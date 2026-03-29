from fastapi import FastAPI, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import bcrypt as _bcrypt
import jwt
import os
import pathlib
from datetime import datetime, timedelta

# Root of the project (one level up from backend/)
PROJECT_ROOT = pathlib.Path(__file__).parent.parent

# --- Config ---
SECRET_KEY = os.environ.get("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

# --- DB Setup ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./progress.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Models ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    data = Column(Text)  # JSON string

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    message = Column(Text)
    rating = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# --- Auth ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain: str, hashed: str) -> bool:
    return _bcrypt.checkpw(plain.encode(), hashed.encode())

def get_password_hash(password: str) -> str:
    return _bcrypt.hashpw(password.encode(), _bcrypt.gensalt()).decode()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- FastAPI App ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Serve Frontend ---
@app.get("/")
def serve_index():
    return FileResponse(PROJECT_ROOT / "index.html")

# Browser reload after a POST sends another POST to "/", causing 501 on static servers.
# Redirect it to GET using the PRG (Post/Redirect/Get) pattern.
@app.post("/")
def post_redirect():
    return RedirectResponse(url="/", status_code=303)

# Static asset directories
app.mount("/css", StaticFiles(directory=PROJECT_ROOT / "css"), name="css")
app.mount("/js",  StaticFiles(directory=PROJECT_ROOT / "js"),  name="js")

@app.middleware("http")
async def no_cache_js(request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/js/") or request.url.path.startswith("/css/"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response

# --- Routes ---
@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    if len(username.strip()) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if db.query(User).filter(User.username == username.strip()).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    user = User(username=username.strip(), hashed_password=get_password_hash(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"msg": "User created"}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/progress")
def get_progress(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prog = db.query(Progress).filter(Progress.user_id == user.id).first()
    return {"progress": prog.data if prog else "{}"}

@app.post("/progress")
def save_progress(data: str = Form(...), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prog = db.query(Progress).filter(Progress.user_id == user.id).first()
    if prog:
        prog.data = data
    else:
        prog = Progress(user_id=user.id, data=data)
        db.add(prog)
    db.commit()
    return {"msg": "Progress saved"}

@app.get("/feedback")
def get_feedback(db: Session = Depends(get_db)):
    rows = db.query(Feedback).order_by(Feedback.id.desc()).limit(50).all()
    return {"feedback": [
        {"username": r.username, "message": r.message, "rating": r.rating,
         "created_at": r.created_at.isoformat() if r.created_at else None}
        for r in rows
    ]}

@app.post("/feedback")
def post_feedback(
    message: str = Form(...),
    rating: int = Form(...),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if len(message.strip()) < 10:
        raise HTTPException(status_code=400, detail="Feedback must be at least 10 characters")
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be 1–5")
    fb = Feedback(username=user.username, message=message.strip(), rating=rating)
    db.add(fb)
    db.commit()
    return {"msg": "Feedback saved"}
