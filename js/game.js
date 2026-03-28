/* ═══════════════════════════════════════════════════
   THE ALGORITHM CHRONICLES — Game Engine
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Constants ─────────────────────────────────── */
  const STATE_KEY  = 'alg-chronicles';
  const TOKEN_KEY  = 'alg-token';
  const USER_KEY   = 'alg-user';
  const XP_PER_LEVEL = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3200];

  // ── Backend API URL ───────────────────────────────
  // If your frontend and backend are on the SAME server (FastAPI serving everything),
  // leave this as ''.
  // If your frontend is on static hosting (Vercel/Netlify) and your backend is on
  // a separate server (Render/Railway), set this to your backend URL:
  //   e.g. const API_BASE = 'https://your-backend.onrender.com';
  const API_BASE = window.ALGO_API_BASE || '';

  /* ── Device Detection ──────────────────────────── */
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  /* ── Auth State ────────────────────────────────── */
  let authToken   = localStorage.getItem(TOKEN_KEY) || null;
  let currentUser = localStorage.getItem(USER_KEY)  || null;

  /* ── Game State ────────────────────────────────── */
  let state      = loadState();
  let activeRealm = null;
  let activeTab   = 'story';

  function defaultState() {
    return { xp: 0, level: 1, completedQuests: {}, completedBosses: {}, unlockedRealms: ['arrays'] };
  }

  function loadState() {
    try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(STATE_KEY) || '{}')); }
    catch { return defaultState(); }
  }

  function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    syncProgressToServer();   // fire-and-forget when logged in
  }

  /* ── XP & Leveling ─────────────────────────────── */
  function xpForLevel(lvl) { return XP_PER_LEVEL[lvl] || lvl * 350; }

  function checkLevelUp() {
    while (state.level < 10 && state.xp >= xpForLevel(state.level)) {
      state.level++;
      showLevelUp(state.level);
    }
    saveState();
  }

  function grantXP(amount) {
    state.xp += amount;
    updateHUD();
    showXPToast(amount);
    checkLevelUp();
  }

  /* ── Realm Logic ───────────────────────────────── */
  function isUnlocked(realm) {
    if (realm.comingSoon) return false;
    return realm.unlockRequires.every(r => state.completedQuests[r + '_boss'] || isRealmComplete(r));
  }

  function isRealmComplete(realmId) {
    const realm = WORLD.realms.find(r => r.id === realmId);
    if (!realm || realm.comingSoon) return false;
    return realm.quests.every(q => state.completedQuests[q.id]);
  }

  function realmStatus(realm) {
    if (realm.comingSoon) return 'soon';
    if (realm.unlockRequires.length === 0 || isUnlocked(realm)) {
      return isRealmComplete(realm.id) ? 'complete' : 'available';
    }
    return 'locked';
  }

  /* ── HUD ───────────────────────────────────────── */
  function updateHUD() {
    const lvl    = state.level;
    const currXP = state.xp;
    const nextXP = xpForLevel(lvl);
    const prevXP = xpForLevel(lvl - 1) || 0;
    const pct    = Math.min(100, ((currXP - prevXP) / (nextXP - prevXP)) * 100);

    document.getElementById('hero-level').textContent = `Lv.${lvl} — ${WORLD.titles[lvl - 1]}`;
    document.getElementById('xp-bar').style.width = `${pct}%`;
    document.getElementById('xp-text').textContent  = `${currXP} / ${nextXP} XP`;

    const totalQ   = Object.keys(state.completedQuests).length;
    const doneR    = WORLD.realms.filter(r => isRealmComplete(r.id)).length;
    const playable = WORLD.realms.filter(r => !r.comingSoon).length;
    document.getElementById('stat-quests').textContent = `📜 ${totalQ} Quests`;
    document.getElementById('stat-realms').textContent = `🗺️ ${doneR}/${playable} Realms`;

    const avatars = ['🧙','🧙','🗡️','🗡️','🌿','🌿','🔮','🔮','⚔️','👑'];
    document.getElementById('hero-avatar').textContent = avatars[Math.min(lvl - 1, avatars.length - 1)];

    // Show username in HUD if logged in
    document.getElementById('hero-name').textContent = currentUser || 'Code Wanderer';
    const authBtn = document.getElementById('btn-hud-auth');
    authBtn.textContent = currentUser ? '👤' : '🔑';
    authBtn.title       = currentUser ? `Signed in as ${currentUser}` : 'Sign In';
  }

  /* ── XP Toast ──────────────────────────────────── */
  function showXPToast(amount) {
    const toast = document.getElementById('xp-toast');
    document.getElementById('xp-toast-val').textContent = amount;
    toast.classList.remove('hidden', 'pop');
    void toast.offsetWidth;  // reflow to restart animation
    toast.classList.remove('hidden');
    toast.classList.add('pop');
    setTimeout(() => { toast.classList.add('hidden'); toast.classList.remove('pop'); }, 1900);
  }

  /* ── Level Up ──────────────────────────────────── */
  function showLevelUp(lvl) {
    document.getElementById('levelup-level').textContent = `Level ${lvl}`;
    document.getElementById('levelup-msg').textContent   = `You are now: ${WORLD.titles[lvl - 1]}`;
    document.getElementById('levelup-overlay').classList.remove('hidden');
    spawnParticles(document.body);
  }

  document.getElementById('btn-levelup-ok')?.addEventListener('click', () => {
    document.getElementById('levelup-overlay').classList.add('hidden');
  });

  /* ── Narrator ──────────────────────────────────── */
  let narratorTimer = null;
  let narratorHideTimer = null;

  function narrate(text, duration = 6000) {
    if (!text) return;
    // Don't narrate while modal is open – the modal already shows the story
    if (!document.getElementById('quest-modal').classList.contains('hidden')) return;

    const el  = document.getElementById('narrator-text');
    const box = document.getElementById('narrator');
    el.textContent = '';
    let i = 0;

    if (narratorTimer) clearInterval(narratorTimer);
    if (narratorHideTimer) clearTimeout(narratorHideTimer);

    narratorTimer = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(narratorTimer);
    }, 20);

    box.classList.add('visible');
    if (duration > 0) {
      narratorHideTimer = setTimeout(() => box.classList.remove('visible'), duration);
    }
  }

  function hideNarrator() {
    if (narratorTimer) clearInterval(narratorTimer);
    if (narratorHideTimer) clearTimeout(narratorHideTimer);
    document.getElementById('narrator').classList.remove('visible');
  }

  /* ── Realm Hover Tooltip ───────────────────────── */
  let tooltipTimeout = null;

  function showRealmTooltip(realm, node) {
    clearTimeout(tooltipTimeout);
    const tip   = document.getElementById('realm-tooltip');
    const rect  = node.getBoundingClientRect();
    const questsDone = (realm.quests || []).filter(q => state.completedQuests[q.id]).length;
    const total      = (realm.quests || []).length;

    document.getElementById('tooltip-icon').textContent = realm.icon;
    document.getElementById('tooltip-name').textContent = realm.name;
    document.getElementById('tooltip-teaser').textContent =
      realm.comingSoon ? '⏳ This realm is not yet written...' : realm.story.arrival.slice(0, 90) + '…';
    document.getElementById('tooltip-progress').textContent =
      realm.comingSoon ? '' : `${questsDone}/${total} quests complete`;

    // Position: prefer right of node, flip if near right edge
    const tipW = 280;
    let left = rect.right + 14;
    if (left + tipW > window.innerWidth - 16) left = rect.left - tipW - 14;
    const top = Math.min(rect.top, window.innerHeight - 160);

    tip.style.left = `${left}px`;
    tip.style.top  = `${top}px`;
    tip.classList.remove('hidden');
    tip.classList.add('tip-visible');
  }

  function hideRealmTooltip() {
    tooltipTimeout = setTimeout(() => {
      const tip = document.getElementById('realm-tooltip');
      tip.classList.remove('tip-visible');
      tip.classList.add('hidden');
    }, 120);
  }

  /* ── World Map ─────────────────────────────────── */
  function buildWorldMap() {
    const map = document.getElementById('world-map');
    const svg = document.getElementById('map-paths');
    svg.innerHTML = '';
    // Remove old nodes but keep canvas + svg
    map.querySelectorAll('.realm-node').forEach(n => n.remove());

    WORLD.realms.forEach(realm => {
      const status = realmStatus(realm);

      // SVG connection paths
      realm.unlockRequires.forEach(reqId => {
        const req = WORLD.realms.find(r => r.id === reqId);
        if (!req) return;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${req.x}%`);
        line.setAttribute('y1', `${req.y}%`);
        line.setAttribute('x2', `${realm.x}%`);
        line.setAttribute('y2', `${realm.y}%`);
        line.setAttribute('class', `path-line path-${status}`);
        svg.appendChild(line);
      });

      const node = document.createElement('div');
      node.className = `realm-node realm-${status}`;
      node.style.left = `${realm.x}%`;
      node.style.top  = `${realm.y}%`;
      node.style.setProperty('--realm-color', realm.color);
      node.style.setProperty('--realm-glow',  realm.glowColor);
      node.dataset.id = realm.id;

      if (status === 'soon') {
        node.innerHTML = `
          <div class="realm-pulse realm-pulse-soon"></div>
          <div class="realm-icon realm-icon-soon">${realm.icon}</div>
          <div class="realm-label">${realm.name}</div>
          <div class="soon-badge">✦ Coming Soon ✦</div>
        `;
        if (!hasTouch) {
          node.addEventListener('mouseenter', () => showRealmTooltip(realm, node));
          node.addEventListener('mouseleave', hideRealmTooltip);
        }
        map.appendChild(node);
        return;
      }

      const questsDone = realm.quests.filter(q => state.completedQuests[q.id]).length;
      const bossDone   = state.completedQuests[realm.id + '_boss'];

      node.innerHTML = `
        <div class="realm-pulse"></div>
        <div class="realm-icon">${realm.icon}</div>
        <div class="realm-label">${realm.name}</div>
        <div class="realm-progress">${questsDone}/${realm.quests.length}${bossDone ? ' ⚔️' : ''}</div>
        ${status === 'locked' ? `<div class="realm-lock">🔒 ${realm.unlockRequires.map(r => WORLD.realms.find(x => x.id === r)?.name || r).join(', ')}</div>` : ''}
      `;

      if (status !== 'locked') {
        node.addEventListener('click', () => travelToRealm(realm, node));
        if (!hasTouch) {
          node.addEventListener('mouseenter', () => {
            showRealmTooltip(realm, node);
            narrate(realm.story.arrival, 8000);
          });
          node.addEventListener('mouseleave', hideRealmTooltip);
        }
      } else {
        if (!hasTouch) {
          node.addEventListener('mouseenter', () => showRealmTooltip(realm, node));
          node.addEventListener('mouseleave', hideRealmTooltip);
        }
      }

      map.appendChild(node);
    });
  }

  /* ── Travel Animation → Open Modal ────────────── */
  function travelToRealm(realm, node) {
    // Immediately clear tooltip and narrator — no delay
    clearTimeout(tooltipTimeout);
    const tip = document.getElementById('realm-tooltip');
    tip.classList.remove('tip-visible');
    tip.classList.add('hidden');
    hideNarrator();
    // Brief pulse on the node before modal opens
    node.classList.add('realm-traveling');
    setTimeout(() => {
      node.classList.remove('realm-traveling');
      openRealm(realm);
    }, 400);
  }

  /* ── Quest Modal ───────────────────────────────── */
  function openRealm(realm) {
    activeRealm = realm;
    activeTab   = 'story';
    hideNarrator();   // ← hide narrator so it's not blocked behind backdrop

    document.getElementById('modal-icon').textContent         = realm.icon;
    document.getElementById('modal-realm-name').textContent   = realm.name;
    document.getElementById('modal-realm-sub').textContent    = 'The Algorithm Chronicles';
    document.getElementById('modal-header').style.setProperty('--realm-color', realm.color);
    document.getElementById('quest-modal').classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.tab === 'story'));
    renderTab('story');
  }

  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', closeModal);

  function closeModal() {
    document.getElementById('quest-modal').classList.add('hidden');
    activeRealm = null;
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      renderTab(activeTab);
    });
  });

  /* ── Tab Content ───────────────────────────────── */
  function renderTab(tab) {
    const body = document.getElementById('modal-body');
    if (!activeRealm) return;
    const realm = activeRealm;

    if (tab === 'story') {
      body.innerHTML = `
        <div class="story-panel">
          <div class="story-section">
            <h3>🌅 Arrival</h3>
            <p>${realm.story.arrival}</p>
          </div>
          <div class="story-section">
            <h3>⚡ The Conflict</h3>
            <p>${realm.story.conflict}</p>
          </div>
          <div class="story-section">
            <h3>🌟 Your Mission</h3>
            <p>${realm.story.resolution}</p>
          </div>
          <div class="story-reward">
            <div class="reward-xp">⚡ ${realm.xpReward} XP on realm completion</div>
          </div>
        </div>`;
    }

    else if (tab === 'learn') {
      body.innerHTML = realm.concepts.map((c, i) => `
        <div class="concept-card" id="concept-${i}">
          <div class="concept-header" onclick="toggleConcept(${i})">
            <span>${c.icon} ${c.title}</span>
            <span class="concept-xp">+${c.xp} XP</span>
            <span class="concept-chevron" id="chevron-${i}">▼</span>
          </div>
          <div class="concept-body hidden" id="concept-body-${i}">
            <div class="concept-theory">${c.theory}</div>
            <div class="concept-code-wrap">
              <div class="code-header">💻 Code</div>
              <pre class="concept-code"><code>${escHtml(c.code)}</code></pre>
            </div>
            <button class="btn-concept-done" onclick="markConceptDone('${realm.id}',${i},${c.xp})">
              ✅ Mark as Learned (+${c.xp} XP)
            </button>
          </div>
        </div>`).join('');
    }

    else if (tab === 'quests') {
      body.innerHTML = `<div class="quests-panel">
        ${realm.quests.map(q => {
          const done = state.completedQuests[q.id];
          return `
            <div class="quest-item ${done ? 'quest-done' : ''}">
              <div class="quest-info">
                <div class="quest-title">${done ? '✅' : '⚔️'} ${q.title}</div>
                <div class="quest-meta">
                  <span class="diff diff-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                  <span class="quest-xp">+${q.xp} XP</span>
                </div>
                <div class="quest-hint">💡 ${q.hint}</div>
              </div>
              <div class="quest-actions">
                <a class="btn-quest" href="${q.url}" target="_blank" rel="noopener">Open ↗</a>
                ${!done
                  ? `<button class="btn-complete" onclick="completeQuest('${q.id}',${q.xp},'${realm.id}')">Mark Done</button>`
                  : '<span class="quest-complete-badge">✓ Done</span>'}
              </div>
            </div>`;
        }).join('')}
      </div>`;
    }

    else if (tab === 'boss') {
      const boss = realm.boss;
      const done = state.completedQuests[realm.id + '_boss'];
      body.innerHTML = `
        <div class="boss-panel">
          <div class="boss-portrait">${done ? '💀' : '🐉'}</div>
          <h2 class="boss-name">${boss.name}</h2>
          <p class="boss-desc">${boss.description}</p>
          <div class="boss-problem">
            <div class="boss-problem-title">🏆 Boss Problem</div>
            <div class="boss-problem-name">${boss.problem.title}</div>
            <div class="boss-reward">⚡ +${boss.problem.xp} XP on defeat</div>
          </div>
          <div class="boss-actions">
            <a class="btn-boss-open" href="${boss.problem.url}" target="_blank" rel="noopener">⚔️ Fight the Boss ↗</a>
            ${!done
              ? `<button class="btn-boss-defeat" onclick="defeatBoss('${realm.id}',${boss.problem.xp})">🏅 I Defeated It!</button>`
              : '<div class="boss-slain">⚔️ SLAIN</div>'}
          </div>
          ${done ? `<div class="boss-clear-msg">You have conquered ${boss.name}. The realm trembles.</div>` : ''}
        </div>`;
    }
  }

  /* ── Inline action handlers ────────────────────── */
  window.toggleConcept = function(i) {
    const body    = document.getElementById(`concept-body-${i}`);
    const chevron = document.getElementById(`chevron-${i}`);
    body.classList.toggle('hidden');
    chevron.textContent = body.classList.contains('hidden') ? '▼' : '▲';
  };

  window.markConceptDone = function(realmId, idx, xp) {
    const key = `concept_${realmId}_${idx}`;
    if (!state.completedQuests[key]) {
      state.completedQuests[key] = true;
      grantXP(xp);
      saveState();
      const btn = document.querySelector(`#concept-body-${idx} .btn-concept-done`);
      if (btn) { btn.textContent = '✅ Learned!'; btn.disabled = true; }
    }
  };

  window.completeQuest = function(questId, xp, realmId) {
    if (!state.completedQuests[questId]) {
      state.completedQuests[questId] = true;
      grantXP(xp);
      saveState();
      buildWorldMap();
      renderTab('quests');
      const realm = WORLD.realms.find(r => r.id === realmId);
      if (realm && realm.quests.every(q => state.completedQuests[q.id])) {
        grantXP(realm.xpReward);
        buildWorldMap();
      }
    }
  };

  window.defeatBoss = function(realmId, xp) {
    const key = realmId + '_boss';
    if (!state.completedQuests[key]) {
      state.completedQuests[key] = true;
      grantXP(xp);
      saveState();
      buildWorldMap();
      renderTab('boss');
      setTimeout(buildWorldMap, 500);
    }
  };

  /* ── Auth Modal ────────────────────────────────── */
  let authMode = 'login'; // 'login' | 'signup'

  function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('hidden');
    renderAuthState();
  }

  function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('auth-error').classList.add('hidden');
    document.getElementById('auth-error').textContent = '';
  }

  function renderAuthState() {
    const form    = document.getElementById('auth-form');
    const loggedIn = document.getElementById('auth-logged-in');
    const submitBtn = document.getElementById('btn-auth-submit');

    if (currentUser) {
      form.style.display = 'none';
      loggedIn.style.display = 'block';
      document.getElementById('auth-logged-name').textContent = currentUser;
    } else {
      form.style.display = 'flex';
      loggedIn.style.display = 'none';
      submitBtn.textContent = authMode === 'login' ? 'Sign In ➜' : 'Create Account ➜';
    }
  }

  document.getElementById('auth-close')?.addEventListener('click', closeAuthModal);
  document.getElementById('auth-backdrop')?.addEventListener('click', closeAuthModal);
  document.getElementById('btn-hud-auth')?.addEventListener('click', openAuthModal);
  document.getElementById('btn-auth-intro')?.addEventListener('click', openAuthModal);

  document.querySelectorAll('.auth-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      authMode = btn.dataset.auth;
      renderAuthState();
      document.getElementById('auth-error').classList.add('hidden');
    });
  });

  document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username  = document.getElementById('auth-username').value.trim();
    const password  = document.getElementById('auth-password').value;
    const submitBtn = document.getElementById('btn-auth-submit');

    // ── Client-side validation ──────────────────────
    if (!username || !password) {
      showAuthError('Please fill in all fields.');
      return;
    }
    if (authMode === 'signup') {
      if (username.length < 3) {
        showAuthError('Username must be at least 3 characters.');
        return;
      }
      if (password.length < 6) {
        showAuthError('Password must be at least 6 characters.');
        return;
      }
    }

    submitBtn.textContent = '…';
    submitBtn.disabled    = true;
    document.getElementById('auth-error').classList.add('hidden');

    try {
      if (authMode === 'login') {
        await apiLogin(username, password);
        await loadProgressFromServer();
        closeAuthModal();
        enterWorld();   // enters world if on intro, or refreshes map if already inside
      } else {
        // Signup: two separate steps so errors are distinct
        await apiSignup(username, password);
        try {
          await apiLogin(username, password);
          await loadProgressFromServer();
          closeAuthModal();
          enterWorld();
        } catch {
          // Account created but auto-login failed — ask user to sign in manually
          document.getElementById('auth-username').value = '';
          document.getElementById('auth-password').value = '';
          // Switch to login tab
          document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
          document.querySelector('[data-auth="login"]').classList.add('active');
          authMode = 'login';
          renderAuthState();
          showAuthError('✅ Account created! Please sign in.');
        }
      }
    } catch (err) {
      showAuthError(err.message);
    } finally {
      submitBtn.disabled = false;
      if (!document.getElementById('auth-modal').classList.contains('hidden')) {
        renderAuthState();
      }
    }
  });

  document.getElementById('btn-auth-logout')?.addEventListener('click', () => {
    authToken   = null;
    currentUser = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    updateHUD();
    renderAuthState();
  });

  function showAuthError(msg) {
    const el = document.getElementById('auth-error');
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  /* ── Auth API Calls ────────────────────────────── */
  async function parseApiResponse(res, fallbackMsg) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try { return await res.json(); } catch { /* fall through */ }
    }
    // Server returned HTML or non-JSON (e.g. proxy error, 404)
    if (!res.ok) throw new Error(`${fallbackMsg} (${res.status})`);
    return {};
  }

  async function apiLogin(username, password) {
    const body = new URLSearchParams({ username, password });
    const res  = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const data = await parseApiResponse(res, 'Login failed');
    if (!res.ok) throw new Error(data.detail || 'Incorrect username or password');
    authToken   = data.access_token;
    currentUser = username;
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY,  currentUser);
  }

  async function apiSignup(username, password) {
    const body = new URLSearchParams({ username, password });
    const res  = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const data = await parseApiResponse(res, 'Signup failed');
    if (!res.ok) throw new Error(data.detail || 'Signup failed');
    // Caller handles login — no auto-login here
  }

  async function syncProgressToServer() {
    if (!authToken) return;
    try {
      const form = new FormData();
      form.append('data', JSON.stringify(state));
      await fetch(`${API_BASE}/progress`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: form
      });
    } catch { /* silent — local state is still saved */ }
  }

  async function loadProgressFromServer() {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE}/progress`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!res.ok) {
        // Token expired or invalid — clear it
        authToken = null; currentUser = null;
        localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
        return;
      }
      const data        = await res.json();
      const serverState = JSON.parse(data.progress || '{}');
      // Merge: keep whichever state has more XP
      if ((serverState.xp || 0) > state.xp) {
        state = Object.assign(defaultState(), serverState);
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
      }
    } catch { /* network error — use local state */ }
  }

  /* ── Particles ─────────────────────────────────── */
  function spawnParticles(container) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${20 + Math.random() * 60}vw`;
      p.style.top  = `${20 + Math.random() * 60}vh`;
      p.style.setProperty('--dx', `${(Math.random() - 0.5) * 220}px`);
      p.style.setProperty('--dy', `${(Math.random() - 0.5) * 220}px`);
      p.textContent = ['✨','⭐','💫','🌟','⚡'][Math.floor(Math.random() * 5)];
      container.appendChild(p);
      setTimeout(() => p.remove(), 1300);
    }
  }

  /* ── Ambient Floating Orbs ─────────────────────── */
  function spawnAmbientOrbs() {
    const map = document.getElementById('world-map');
    const orbColors = ['#6c5ce720','#00b89415','#74b9ff18','#fd79a812','#fdcb6e15'];
    for (let i = 0; i < 12; i++) {
      const orb = document.createElement('div');
      orb.className = 'ambient-orb';
      const size = 60 + Math.random() * 120;
      orb.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        background:${orbColors[Math.floor(Math.random() * orbColors.length)]};
        animation-duration:${8 + Math.random() * 14}s;
        animation-delay:-${Math.random() * 12}s;
      `;
      map.appendChild(orb);
    }
  }

  /* ── Stars Canvas ──────────────────────────────── */
  function initStars(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.25 + 0.04,
      phase: Math.random() * Math.PI * 2
    }));

    // Add a few larger bright "hero" stars
    for (let i = 0; i < 10; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, r: 2.2 + Math.random(), speed: 0.02, phase: Math.random() * Math.PI * 2 });
    }

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;
      stars.forEach(s => {
        s.phase += 0.018;
        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < 0) { s.y = H; s.x = Math.random() * W; }
      });

      // Subtle nebula wisps
      const grad = ctx.createRadialGradient(W * 0.3, H * 0.5 + Math.sin(t) * 30, 0, W * 0.3, H * 0.5, W * 0.35);
      grad.addColorStop(0, 'rgba(108,92,231,0.04)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const grad2 = ctx.createRadialGradient(W * 0.72, H * 0.4 + Math.cos(t * 0.7) * 25, 0, W * 0.72, H * 0.4, W * 0.3);
      grad2.addColorStop(0, 'rgba(0,184,148,0.03)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, W, H);

      requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });
  }

  /* ── Intro Screen ──────────────────────────────── */
  function showIntroStats() {
    const doneR  = WORLD.realms.filter(r => isRealmComplete(r.id)).length;
    const doneQ  = Object.keys(state.completedQuests).length;
    if (doneQ > 0) {
      document.getElementById('intro-stats').innerHTML = `
        <div class="resume-banner">
          ⚔️ Wanderer Level ${state.level} · ${state.xp} XP · ${doneR} realm${doneR !== 1 ? 's' : ''} mastered
        </div>`;
      document.querySelector('.btn-start').innerHTML = '<span class="btn-glow"></span>Continue Journey ➜';
    }
  }

  let worldEntered = false;

  function enterWorld() {
    if (worldEntered) {
      // Already in the world — just refresh map + HUD with latest state
      buildWorldMap();
      updateHUD();
      return;
    }
    worldEntered = true;
    const intro = document.getElementById('intro-screen');
    intro.classList.add('fade-out');
    setTimeout(() => {
      try {
        intro.classList.add('hidden');
        const world = document.getElementById('world-screen');
        world.classList.remove('hidden');
        world.classList.add('world-enter');
        initStars('world-canvas');
        spawnAmbientOrbs();
        buildWorldMap();
        updateHUD();
        syncHUDOffset();
        if (hasTouch) showMobileHint();
        setTimeout(() => {
          narrate(WORLD.lore.intro[Math.floor(Math.random() * WORLD.lore.intro.length)], 9000);
        }, 800);
      } catch (err) {
        // Surface the error so it's visible
        throw err;
      }
    }, 700);
  }

  document.getElementById('btn-enter-world')?.addEventListener('click', () => {
    // Kick off server sync if token is stored, then enter world
    if (authToken) {
      loadProgressFromServer().then(() => enterWorld());
    } else {
      enterWorld();
    }
  });

  /* ── Mobile helpers ────────────────────────────── */
  function syncHUDOffset() {
    // Push the world-map below the actual HUD height so nodes aren't hidden
    if (window.innerWidth <= 640) {
      const hud = document.querySelector('.hud');
      const h   = hud ? hud.getBoundingClientRect().height : 62;
      document.getElementById('world-map').style.top = `${h}px`;
    }
  }

  function showMobileHint() {
    const map  = document.getElementById('world-map');
    const hint = document.createElement('div');
    hint.className   = 'mobile-map-hint';
    hint.textContent = '👆 Tap a realm to explore';
    map.appendChild(hint);
    setTimeout(() => hint.remove(), 5000);
  }

  window.addEventListener('resize', syncHUDOffset);

  /* ── Keyboard ──────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!document.getElementById('quest-modal').classList.contains('hidden')) closeModal();
      else if (!document.getElementById('auth-modal').classList.contains('hidden')) closeAuthModal();
    }
  });

  /* ── Boot ──────────────────────────────────────── */
  initStars('star-canvas');
  showIntroStats();

  /* ── Utility ────────────────────────────────────── */
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();
