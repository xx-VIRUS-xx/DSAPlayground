/* ═══════════════════════════════════════════════════
   THE ALGORITHM CHRONICLES — Game Engine
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── State ─────────────────────────────────────── */
  const STATE_KEY = 'alg-chronicles';
  let state = loadState();
  let activeRealm = null;
  let activeTab = 'story';

  function defaultState() {
    return { xp: 0, level: 1, completedQuests: {}, completedBosses: {}, unlockedRealms: ['arrays'] };
  }

  function loadState() {
    try { return Object.assign(defaultState(), JSON.parse(localStorage.getItem(STATE_KEY) || '{}')); }
    catch { return defaultState(); }
  }

  function saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  /* ── XP & Leveling ─────────────────────────────── */
  const XP_PER_LEVEL = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3200];

  function xpForLevel(lvl) { return XP_PER_LEVEL[lvl] || lvl * 350; }

  function checkLevelUp() {
    while (state.level < 10 && state.xp >= xpForLevel(state.level)) {
      state.level++;
      showLevelUp(state.level);
    }
    saveState();
  }

  function grantXP(amount, label) {
    state.xp += amount;
    updateHUD();
    showXPToast(amount, label);
    checkLevelUp();
  }

  /* ── Realm Unlock Logic ───────────────────────── */
  function isUnlocked(realm) {
    return realm.unlockRequires.every(r => state.completedQuests[r + '_boss'] || isRealmComplete(r));
  }

  function isRealmComplete(realmId) {
    const realm = WORLD.realms.find(r => r.id === realmId);
    if (!realm) return false;
    return realm.quests.every(q => state.completedQuests[q.id]);
  }

  function realmStatus(realm) {
    if (realm.unlockRequires.length === 0 || isUnlocked(realm)) {
      if (isRealmComplete(realm.id)) return 'complete';
      return 'available';
    }
    return 'locked';
  }

  /* ── HUD ───────────────────────────────────────── */
  function updateHUD() {
    const lvl = state.level;
    const currXP = state.xp;
    const nextXP = xpForLevel(lvl);
    const prevXP = xpForLevel(lvl - 1) || 0;
    const pct = Math.min(100, ((currXP - prevXP) / (nextXP - prevXP)) * 100);

    document.getElementById('hero-level').textContent = `Level ${lvl} — ${WORLD.titles[lvl - 1]}`;
    document.getElementById('xp-bar').style.width = `${pct}%`;
    document.getElementById('xp-text').textContent = `${currXP} / ${nextXP} XP`;

    const totalQuests = state.completedQuests ? Object.keys(state.completedQuests).length : 0;
    const completedRealms = WORLD.realms.filter(r => isRealmComplete(r.id)).length;
    document.getElementById('stat-quests').textContent = `📜 ${totalQuests} Quests`;
    document.getElementById('stat-realms').textContent = `🗺️ ${completedRealms}/${WORLD.realms.length} Realms`;

    // Update avatar by level
    const avatars = ['🧙','🧙','🗡️','🗡️','🌿','🌿','🔮','🔮','⚔️','👑'];
    document.getElementById('hero-avatar').textContent = avatars[Math.min(lvl - 1, avatars.length - 1)];
  }

  /* ── Toast ─────────────────────────────────────── */
  function showXPToast(amount) {
    const toast = document.getElementById('xp-toast');
    document.getElementById('xp-toast-val').textContent = amount;
    toast.classList.remove('hidden');
    toast.classList.add('pop');
    setTimeout(() => { toast.classList.remove('pop'); toast.classList.add('hidden'); }, 1800);
  }

  /* ── Level Up Overlay ──────────────────────────── */
  function showLevelUp(lvl) {
    const overlay = document.getElementById('levelup-overlay');
    document.getElementById('levelup-level').textContent = `Level ${lvl}`;
    document.getElementById('levelup-msg').textContent = `You are now: ${WORLD.titles[lvl - 1]}`;
    overlay.classList.remove('hidden');
    spawnParticles(document.body);
  }

  document.getElementById('btn-levelup-ok')?.addEventListener('click', () => {
    document.getElementById('levelup-overlay').classList.add('hidden');
  });

  /* ── Narrator ──────────────────────────────────── */
  let narratorTimer = null;
  function narrate(text, duration = 5000) {
    const el = document.getElementById('narrator-text');
    el.textContent = '';
    let i = 0;
    if (narratorTimer) clearInterval(narratorTimer);
    narratorTimer = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(narratorTimer);
    }, 22);
    const box = document.getElementById('narrator');
    box.classList.add('visible');
    if (duration > 0) setTimeout(() => box.classList.remove('visible'), duration);
  }

  /* ── World Map Rendering ───────────────────────── */
  function buildWorldMap() {
    const map = document.getElementById('world-map');
    const svg = document.getElementById('map-paths');
    svg.innerHTML = '';

    WORLD.realms.forEach(realm => {
      const status = realmStatus(realm);

      // Draw connection lines
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

      // Realm node
      const node = document.createElement('div');
      node.className = `realm-node realm-${status}`;
      node.style.left = `${realm.x}%`;
      node.style.top = `${realm.y}%`;
      node.style.setProperty('--realm-color', realm.color);
      node.style.setProperty('--realm-glow', realm.glowColor);
      node.dataset.id = realm.id;

      const questsDone = realm.quests.filter(q => state.completedQuests[q.id]).length;
      const bossDone = state.completedQuests[realm.id + '_boss'];

      node.innerHTML = `
        <div class="realm-pulse"></div>
        <div class="realm-icon">${realm.icon}</div>
        <div class="realm-label">${realm.name}</div>
        <div class="realm-progress">${questsDone}/${realm.quests.length} quests${bossDone ? ' · ⚔️' : ''}</div>
        ${status === 'locked' ? `<div class="realm-lock">🔒 ${realm.unlockRequires.map(r => WORLD.realms.find(x=>x.id===r)?.name).join(', ')}</div>` : ''}
      `;

      if (status !== 'locked') {
        node.addEventListener('click', () => openRealm(realm));
        node.addEventListener('mouseenter', () => {
          narrate(realm.story.arrival, 8000);
        });
      } else {
        node.title = `Requires: ${realm.unlockRequires.join(', ')}`;
      }

      map.appendChild(node);
    });
  }

  /* ── Quest Modal ───────────────────────────────── */
  function openRealm(realm) {
    activeRealm = realm;
    activeTab = 'story';
    document.getElementById('modal-icon').textContent = realm.icon;
    document.getElementById('modal-realm-name').textContent = realm.name;
    document.getElementById('modal-realm-sub').textContent = 'The Algorithm Chronicles';
    document.getElementById('modal-header').style.setProperty('--realm-color', realm.color);
    document.getElementById('quest-modal').classList.remove('hidden');
    renderTab('story');
    narrate(realm.story.arrival, 0);

    // Activate tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === 'story');
    });
  }

  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', closeModal);

  function closeModal() {
    document.getElementById('quest-modal').classList.add('hidden');
    activeRealm = null;
    document.getElementById('narrator').classList.remove('visible');
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      renderTab(activeTab);
    });
  });

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
        </div>
      `;
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
            <button class="btn-concept-done" onclick="markConceptDone('${realm.id}', ${i}, ${c.xp})">
              ✅ Mark as Learned (+${c.xp} XP)
            </button>
          </div>
        </div>
      `).join('');
    }

    else if (tab === 'quests') {
      body.innerHTML = `
        <div class="quests-panel">
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
                  <a class="btn-quest" href="${q.url}" target="_blank">Open Problem ↗</a>
                  ${!done ? `<button class="btn-complete" onclick="completeQuest('${q.id}', ${q.xp}, '${realm.id}')">Mark Complete</button>` : '<span class="quest-complete-badge">Done!</span>'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
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
            <a class="btn-boss-open" href="${boss.problem.url}" target="_blank">⚔️ Fight the Boss ↗</a>
            ${!done ? `<button class="btn-boss-defeat" onclick="defeatBoss('${realm.id}', ${boss.problem.xp})">🏅 I Defeated It!</button>` : '<div class="boss-slain">⚔️ SLAIN</div>'}
          </div>
          ${done ? `<div class="boss-clear-msg">You have conquered ${boss.name}. The realm trembles.</div>` : ''}
        </div>
      `;
    }
  }

  /* ── Actions (called from inline onclick) ──────── */
  window.toggleConcept = function(i) {
    const body = document.getElementById(`concept-body-${i}`);
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

      // Check realm completion
      const realm = WORLD.realms.find(r => r.id === realmId);
      if (realm && realm.quests.every(q => state.completedQuests[q.id])) {
        grantXP(realm.xpReward);
        narrate(`⭐ ${realm.name} fully explored! +${realm.xpReward} bonus XP!`, 6000);
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
      narrate(`🐉 Boss defeated! New realms may now unlock!`, 6000);
      // Rebuild to potentially unlock new realms
      setTimeout(buildWorldMap, 500);
    }
  };

  /* ── Particles ─────────────────────────────────── */
  function spawnParticles(container) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `${Math.random() * 100}vh`;
      p.style.setProperty('--dx', `${(Math.random() - 0.5) * 200}px`);
      p.style.setProperty('--dy', `${(Math.random() - 0.5) * 200}px`);
      p.textContent = ['✨','⭐','💫','🌟'][Math.floor(Math.random()*4)];
      container.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  /* ── Stars Canvas ──────────────────────────────── */
  function initStars(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = Array.from({length: 200}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      twinkle: Math.random() * Math.PI * 2
    }));
    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.twinkle += 0.02;
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── Intro Screen ──────────────────────────────── */
  function showIntroStats() {
    const completedRealms = WORLD.realms.filter(r => isRealmComplete(r.id)).length;
    const totalQuests = Object.keys(state.completedQuests).length;
    if (totalQuests > 0) {
      document.getElementById('intro-stats').innerHTML = `
        <div class="resume-banner">
          ⚔️ Wanderer Level ${state.level} · ${state.xp} XP · ${completedRealms} realms mastered
        </div>
      `;
      document.querySelector('.btn-start').textContent = 'Continue Journey ➜';
    }
  }

  document.getElementById('btn-enter-world')?.addEventListener('click', () => {
    document.getElementById('intro-screen').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('intro-screen').classList.add('hidden');
      document.getElementById('world-screen').classList.remove('hidden');
      initStars('world-canvas');
      buildWorldMap();
      updateHUD();
      setTimeout(() => narrate(WORLD.lore.intro[Math.floor(Math.random() * WORLD.lore.intro.length)], 8000), 600);
    }, 700);
  });

  /* ── Keyboard Shortcuts ──────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* ── Boot ──────────────────────────────────────── */
  initStars('star-canvas');
  showIntroStats();

  /* ── Utility ────────────────────────────────────── */
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();
