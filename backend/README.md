# DSA Playground Backend (Python)

A simple FastAPI backend for user accounts and progress caching.

## Features
- User signup/login (JWT auth)
- Save and load progress per user
- SQLite database (no setup needed)
- CORS enabled for frontend integration

## Endpoints
- `POST /signup` — Create account (form: username, password)
- `POST /login` — Get JWT token (OAuth2 form: username, password)
- `GET /progress` — Get progress (JWT required)
- `POST /progress` — Save progress (form: data, JWT required)

## Running Locally
1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Start the server:
   ```sh
   uvicorn main:app --reload
   ```
3. The API will be at `http://localhost:8000`

## Usage
- Use the JWT token from `/login` as `Authorization: Bearer <token>` for progress endpoints.
- Integrate with the frontend to sync progress per user.

## Security Notes
- For production, set a strong `SECRET_KEY` in your environment.
- Use HTTPS in production.
