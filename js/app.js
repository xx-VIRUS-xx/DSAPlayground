/* =============================================
   DSA Playground — Main Application Logic
   ============================================= */

(function () {
    'use strict';

    // ─── State ───
    const state = {
        currentSection: 'welcome',
        currentTopic: null,
        learned: JSON.parse(localStorage.getItem('dsa-learned') || '{}'),
        sortViz: null
    };

    // ─── DOM References ───
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ─── Init ───
    function init() {
        state.sortViz = new SortingVisualizer();
        buildNavigation();
        bindEvents();
        updateProgress();
        state.sortViz.generateArray(30);
        renderSortCode('bubble');
    }

    // ─── Build Dynamic Navigation ───
    function buildNavigation() {
        // Patterns sub-nav
        const navPatterns = $('#nav-patterns');
        CONTENT.patterns.forEach(p => {
            navPatterns.appendChild(createSubNavItem(p.id, `${p.icon} ${p.title}`, 'patterns'));
        });

        // Data Structures sub-nav
        const navDS = $('#nav-ds');
        CONTENT.dataStructures.forEach(ds => {
            navDS.appendChild(createSubNavItem(ds.id, `${ds.icon} ${ds.title}`, 'ds'));
        });

        // Algorithms sub-nav
        const navAlgo = $('#nav-algorithms');
        CONTENT.algorithms.forEach(a => {
            navAlgo.appendChild(createSubNavItem(a.id, `${a.icon} ${a.title}`, 'algorithms'));
        });

        // System Design sub-nav
        const navSD = $('#nav-sd');
        CONTENT.systemDesign.forEach(sd => {
            navSD.appendChild(createSubNavItem(sd.id, `${sd.icon} ${sd.title}`, 'system-design'));
        });
    }

    function createSubNavItem(id, label, section) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        const check = document.createElement('span');
        check.className = 'check' + (state.learned[id] ? ' done' : '');
        check.textContent = state.learned[id] ? '✓' : '';
        check.dataset.id = id;
        btn.appendChild(check);
        btn.appendChild(document.createTextNode(' ' + label));
        btn.dataset.section = section;
        btn.dataset.topic = id;
        btn.addEventListener('click', () => navigateToTopic(section, id));
        li.appendChild(btn);
        return li;
    }

    // ─── Event Binding ───
    function bindEvents() {
        // Main section navigation
        $$('.nav-section-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                // Toggle sub-nav
                const subNav = btn.parentElement.querySelector('.nav-sub');
                if (subNav) {
                    subNav.classList.toggle('open');
                }
                navigateToSection(section);
            });
        });

        // Hero cards
        $$('.hero-card').forEach(card => {
            card.addEventListener('click', () => {
                navigateToSection(card.dataset.goto);
            });
        });

        // Mobile menu
        $('#menu-toggle').addEventListener('click', () => {
            $('#sidebar').classList.toggle('open');
        });

        // Close sidebar on main content click (mobile)
        $('#main-content').addEventListener('click', () => {
            $('#sidebar').classList.remove('open');
        });

        // Sorting controls
        $('#sort-generate').addEventListener('click', () => {
            const size = parseInt($('#arr-size').value);
            state.sortViz.generateArray(size);
        });

        $('#sort-play').addEventListener('click', async () => {
            const algo = $('#sort-algo').value;
            $('#sort-play').disabled = true;
            $('#sort-stop').disabled = false;
            $('#sort-generate').disabled = true;
            await state.sortViz.run(algo);
            $('#sort-play').disabled = false;
            $('#sort-stop').disabled = true;
            $('#sort-generate').disabled = false;
        });

        $('#sort-stop').addEventListener('click', () => {
            state.sortViz.stop();
            $('#sort-play').disabled = false;
            $('#sort-stop').disabled = true;
            $('#sort-generate').disabled = false;
        });

        $('#arr-size').addEventListener('input', (e) => {
            $('#size-val').textContent = e.target.value;
            state.sortViz.generateArray(parseInt(e.target.value));
        });

        $('#sort-speed').addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            $('#speed-val').textContent = val;
            state.sortViz.speed = val;
        });

        $('#sort-algo').addEventListener('change', (e) => {
            renderSortCode(e.target.value);
        });
    }

    // ─── Navigation ───
    function navigateToSection(section) {
        state.currentSection = section;
        state.currentTopic = null;

        // Hide all, show target
        $$('.content-section').forEach(s => s.classList.remove('active'));
        const target = $(`#section-${section}`);
        if (target) target.classList.add('active');

        // Update nav active states
        $$('.nav-section-btn').forEach(b => b.classList.remove('active'));
        const navBtn = $(`.nav-section-btn[data-section="${section}"]`);
        if (navBtn) navBtn.classList.add('active');

        // Render content if needed
        renderSectionContent(section);

        // Scroll to top
        $('#main-content').scrollTo(0, 0);
    }

    function navigateToTopic(section, topicId) {
        state.currentSection = section;
        state.currentTopic = topicId;

        $$('.content-section').forEach(s => s.classList.remove('active'));
        const target = $(`#section-${section}`);
        if (target) target.classList.add('active');

        renderSectionContent(section, topicId);

        // Update sub-nav active
        $$('.nav-sub button').forEach(b => b.classList.remove('active'));
        const topicBtn = $(`.nav-sub button[data-topic="${topicId}"]`);
        if (topicBtn) topicBtn.classList.add('active');

        $('#main-content').scrollTo(0, 0);
        $('#sidebar').classList.remove('open');
    }

    // ─── Render Content ───
    function renderSectionContent(section, topicId) {
        switch (section) {
            case 'approach': renderApproach(); break;
            case 'patterns': renderPatterns(topicId); break;
            case 'ds': renderDataStructures(topicId); break;
            case 'algorithms': renderAlgorithms(topicId); break;
            case 'system-design': renderSystemDesign(topicId); break;
            case 'cheatsheet': renderCheatsheet(); break;
        }
    }

    // ─── Problem Solving Approach ───
    function renderApproach() {
        const data = CONTENT.approach;
        let html = `<h1>${data.title}</h1><p class="section-desc">${data.desc}</p>`;

        data.steps.forEach((step, i) => {
            html += `
                <div class="step-card">
                    <div class="step-number">${i + 1}</div>
                    <h3>${step.title}</h3>
                    <ul>${step.points.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>`;
        });

        data.tips.forEach(t => {
            const cls = t.type === 'warn' ? 'warn-box' : 'tip-box';
            html += `<div class="${cls}"><strong>${t.title}</strong><p>${t.text}</p></div>`;
        });

        $('#approach-content').innerHTML = html;
    }

    // ─── Patterns ───
    function renderPatterns(topicId) {
        const container = $('#patterns-content');

        if (!topicId) {
            // Overview
            let html = `<h1>🧩 LeetCode Patterns</h1>
                <p class="section-desc">Master these 14 patterns and you'll be able to solve 90% of coding interview problems. Click any pattern to dive deep.</p>`;

            html += '<div class="hero-cards">';
            CONTENT.patterns.forEach(p => {
                const learned = state.learned[p.id] ? ' style="border-color: var(--green);"' : '';
                html += `
                    <div class="hero-card" onclick="window._nav('patterns','${p.id}')"${learned}>
                        <span class="hero-card-icon">${p.icon}</span>
                        <h3>${p.title} ${diffBadge(p.difficulty)}</h3>
                        <p>${p.description.substring(0, 100)}...</p>
                    </div>`;
            });
            html += '</div>';
            container.innerHTML = html;
            return;
        }

        const pattern = CONTENT.patterns.find(p => p.id === topicId);
        if (!pattern) return;
        container.innerHTML = renderTopicDetail(pattern, 'patterns');
        attachTopicEvents(container);
    }

    // ─── Data Structures ───
    function renderDataStructures(topicId) {
        const container = $('#ds-content');

        if (!topicId) {
            let html = `<h1>📦 Data Structures</h1>
                <p class="section-desc">Understand the building blocks. Knowing which data structure to use is half the battle in interviews.</p>`;

            html += '<div class="hero-cards">';
            CONTENT.dataStructures.forEach(ds => {
                const learned = state.learned[ds.id] ? ' style="border-color: var(--green);"' : '';
                html += `
                    <div class="hero-card" onclick="window._nav('ds','${ds.id}')"${learned}>
                        <span class="hero-card-icon">${ds.icon}</span>
                        <h3>${ds.title}</h3>
                        <p>${ds.description.substring(0, 100)}...</p>
                    </div>`;
            });
            html += '</div>';
            container.innerHTML = html;
            return;
        }

        const ds = CONTENT.dataStructures.find(d => d.id === topicId);
        if (!ds) return;
        container.innerHTML = renderDSDetail(ds);
        attachTopicEvents(container);
    }

    // ─── Algorithms ───
    function renderAlgorithms(topicId) {
        const container = $('#algorithms-content');

        if (!topicId) {
            let html = `<h1>⚡ Algorithms</h1>
                <p class="section-desc">Core algorithms that form the foundation of problem-solving. Understand them deeply—don't just memorize.</p>`;

            html += '<div class="hero-cards">';
            CONTENT.algorithms.forEach(a => {
                const learned = state.learned[a.id] ? ' style="border-color: var(--green);"' : '';
                html += `
                    <div class="hero-card" onclick="window._nav('algorithms','${a.id}')"${learned}>
                        <span class="hero-card-icon">${a.icon}</span>
                        <h3>${a.title}</h3>
                        <p>${a.description.substring(0, 100)}...</p>
                    </div>`;
            });
            html += '</div>';
            container.innerHTML = html;
            return;
        }

        const algo = CONTENT.algorithms.find(a => a.id === topicId);
        if (!algo) return;
        container.innerHTML = renderAlgoDetail(algo);
        attachTopicEvents(container);
    }

    // ─── System Design ───
    function renderSystemDesign(topicId) {
        const container = $('#sd-content');

        if (!topicId) {
            let html = `<h1>🏗️ System Design</h1>
                <p class="section-desc">Learn to design scalable systems. These concepts come up in every senior engineering interview.</p>`;

            html += '<div class="hero-cards">';
            CONTENT.systemDesign.forEach(sd => {
                const learned = state.learned[sd.id] ? ' style="border-color: var(--green);"' : '';
                html += `
                    <div class="hero-card" onclick="window._nav('system-design','${sd.id}')"${learned}>
                        <span class="hero-card-icon">${sd.icon}</span>
                        <h3>${sd.title}</h3>
                        <p>${sd.description.substring(0, 80)}...</p>
                    </div>`;
            });
            html += '</div>';
            container.innerHTML = html;
            return;
        }

        const sd = CONTENT.systemDesign.find(s => s.id === topicId);
        if (!sd) return;
        container.innerHTML = renderSDDetail(sd);
        attachTopicEvents(container);
    }

    // ─── Cheat Sheet ───
    function renderCheatsheet() {
        const data = CONTENT.cheatsheet;
        let html = `<h1>${data.title}</h1><p class="section-desc">${data.desc}</p>`;

        data.tables.forEach(table => {
            html += `<div class="topic-card"><h2>${table.title}</h2>`;
            html += `<table class="cheat-table"><thead><tr>`;
            table.headers.forEach(h => html += `<th>${h}</th>`);
            html += `</tr></thead><tbody>`;

            table.rows.forEach(row => {
                html += '<tr>';
                row.forEach((cell, i) => {
                    const cls = i >= 1 && i <= 4 ? 'tc' : (i === 5 ? 'sc' : '');
                    html += `<td class="${cls}">${cell}</td>`;
                });
                html += '</tr>';
            });

            html += '</tbody></table>';
            if (table.notes) html += `<p style="font-size:0.8rem;color:var(--text-muted);margin-top:8px;">${table.notes}</p>`;
            html += '</div>';
        });

        $('#cheatsheet-content').innerHTML = html;
    }

    // ─── Detail Renderers ───
    function renderTopicDetail(p) {
        let html = `<div class="topic-card">
            <h2>${p.icon} ${p.title} ${diffBadge(p.difficulty)}</h2>
            <p>${p.description}</p>

            <h3>📌 When to Use</h3>
            <ul>${p.whenToUse.map(w => `<li>${w}</li>`).join('')}</ul>

            <h3>🔧 How It Works</h3>
            <p>${p.howItWorks}</p>

            <h3>💡 Common Problems</h3>
            <ul>${p.examples.map(e => `<li>${e}</li>`).join('')}</ul>

            ${p.complexity ? `<div class="info-grid">
                <div class="info-item"><div class="label">Time Complexity</div><div class="value">${p.complexity.time}</div></div>
                <div class="info-item"><div class="label">Space Complexity</div><div class="value">${p.complexity.space}</div></div>
            </div>` : ''}

            ${renderCodeBlock(p.code)}

            ${p.quiz ? renderQuiz(p.quiz, p.id) : ''}

            <button class="mark-learned-btn ${state.learned[p.id] ? 'learned' : ''}" data-topic-id="${p.id}">
                ${state.learned[p.id] ? '✓ Learned' : '☐ Mark as Learned'}
            </button>
        </div>`;
        return html;
    }

    function renderDSDetail(ds) {
        let html = `<div class="topic-card">
            <h2>${ds.icon} ${ds.title}</h2>
            <p>${ds.description}</p>

            <h3>📌 Key Points</h3>
            <ul>${ds.keyPoints.map(k => `<li>${k}</li>`).join('')}</ul>

            <h3>⚡ Operations Complexity</h3>
            <div class="info-grid">
                ${Object.entries(ds.operations).map(([op, tc]) => `
                    <div class="info-item"><div class="label">${op}</div><div class="value">${tc}</div></div>
                `).join('')}
            </div>

            ${renderCodeBlock(ds.code)}

            <button class="mark-learned-btn ${state.learned[ds.id] ? 'learned' : ''}" data-topic-id="${ds.id}">
                ${state.learned[ds.id] ? '✓ Learned' : '☐ Mark as Learned'}
            </button>
        </div>`;
        return html;
    }

    function renderAlgoDetail(algo) {
        let html = `<div class="topic-card">
            <h2>${algo.icon} ${algo.title}</h2>
            <p>${algo.description}</p>

            <h3>📌 Key Points</h3>
            <ul>${algo.keyPoints.map(k => `<li>${k}</li>`).join('')}</ul>`;

        if (algo.algoTable) {
            html += `<h3>📊 Comparison</h3>
                <table class="cheat-table"><thead><tr>
                    <th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th>
                </tr></thead><tbody>`;
            algo.algoTable.forEach(row => {
                html += `<tr>
                    <td>${row.name}</td>
                    <td class="tc">${row.best}</td>
                    <td class="tc">${row.avg}</td>
                    <td class="tc">${row.worst}</td>
                    <td class="sc">${row.space}</td>
                    <td>${row.stable}</td>
                </tr>`;
            });
            html += '</tbody></table>';
        }

        html += renderCodeBlock(algo.code);

        html += `<button class="mark-learned-btn ${state.learned[algo.id] ? 'learned' : ''}" data-topic-id="${algo.id}">
                ${state.learned[algo.id] ? '✓ Learned' : '☐ Mark as Learned'}
            </button>
        </div>`;
        return html;
    }

    function renderSDDetail(sd) {
        let html = `<div class="topic-card">
            <h2>${sd.icon} ${sd.title}</h2>
            <p>${sd.description}</p>`;

        sd.sections.forEach(section => {
            html += `<h3>${section.title}</h3>${section.content}`;
        });

        html += `<button class="mark-learned-btn ${state.learned[sd.id] ? 'learned' : ''}" data-topic-id="${sd.id}">
                ${state.learned[sd.id] ? '✓ Learned' : '☐ Mark as Learned'}
            </button>
        </div>`;
        return html;
    }

    // ─── Code Block Renderer ───
    function renderCodeBlock(codeData) {
        if (!codeData) return '';
        const escaped = escapeHtml(codeData.code);
        const highlighted = highlightPython(escaped);
        return `
            <div class="code-block-container">
                <div class="code-header">
                    <span class="lang-label">${codeData.lang}</span>
                    <span>${codeData.title}</span>
                    <button class="copy-btn" onclick="window._copy(this)">Copy</button>
                </div>
                <div class="code-block">${highlighted}</div>
            </div>`;
    }

    function renderSortCode(algo) {
        const codeData = SORT_CODES[algo];
        if (!codeData) return;
        $('#sort-code').innerHTML = renderCodeBlock(codeData);
    }

    // ─── Quiz Renderer ───
    function renderQuiz(quiz, topicId) {
        return `
            <div class="quiz-container">
                <div class="quiz-question">
                    <h4>🧪 Quick Check: ${quiz.question}</h4>
                    <div class="quiz-options">
                        ${quiz.options.map((opt, i) => `
                            <button class="quiz-option" data-correct="${i === quiz.correct}" data-quiz="${topicId}">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                    <div class="quiz-explanation" id="quiz-exp-${topicId}">
                        ✅ ${quiz.explanation}
                    </div>
                </div>
            </div>`;
    }

    // ─── Event Handlers for Dynamic Content ───
    function attachTopicEvents(container) {
        // Mark as learned
        container.querySelectorAll('.mark-learned-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.topicId;
                state.learned[id] = !state.learned[id];
                localStorage.setItem('dsa-learned', JSON.stringify(state.learned));
                btn.classList.toggle('learned');
                btn.textContent = state.learned[id] ? '✓ Learned' : '☐ Mark as Learned';
                updateProgress();
                updateCheckmarks();
            });
        });

        // Quiz options
        container.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const quiz = opt.dataset.quiz;
                const isCorrect = opt.dataset.correct === 'true';
                const siblings = opt.parentElement.querySelectorAll('.quiz-option');

                // Disable all options
                siblings.forEach(s => {
                    s.disabled = true;
                    if (s.dataset.correct === 'true') s.classList.add('correct');
                });

                if (!isCorrect) opt.classList.add('wrong');

                // Show explanation
                const exp = document.getElementById(`quiz-exp-${quiz}`);
                if (exp) exp.classList.add('show');
            });
        });
    }

    // ─── Progress Tracking ───
    function updateProgress() {
        const allTopics = [
            ...CONTENT.patterns.map(p => p.id),
            ...CONTENT.dataStructures.map(d => d.id),
            ...CONTENT.algorithms.map(a => a.id),
            ...CONTENT.systemDesign.map(s => s.id)
        ];
        const total = allTopics.length;
        const done = allTopics.filter(id => state.learned[id]).length;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        $('#progress-pct').textContent = `${pct}% (${done}/${total})`;
        $('#progress-fill').style.width = `${pct}%`;
    }

    function updateCheckmarks() {
        $$('.nav-sub .check').forEach(check => {
            const id = check.dataset.id;
            if (state.learned[id]) {
                check.classList.add('done');
                check.textContent = '✓';
            } else {
                check.classList.remove('done');
                check.textContent = '';
            }
        });
    }

    // ─── Helpers ───
    function diffBadge(diff) {
        if (!diff) return '';
        const cls = diff.toLowerCase().includes('hard') ? 'badge-hard'
                  : diff.toLowerCase().includes('medium') ? 'badge-medium'
                  : 'badge-easy';
        return `<span class="badge ${cls}">${diff}</span>`;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function highlightPython(code) {
        // Comments
        code = code.replace(/(#.*)$/gm, '<span class="cm">$1</span>');
        // Strings (double and single quoted)
        code = code.replace(/(&quot;.*?&quot;|&#39;.*?&#39;|".*?"|'.*?')/g, '<span class="str">$1</span>');
        // Keywords
        const keywords = ['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'not', 'and', 'or', 'is', 'None', 'True', 'False', 'import', 'from', 'as', 'with', 'try', 'except', 'finally', 'raise', 'pass', 'break', 'continue', 'yield', 'lambda', 'self'];
        keywords.forEach(kw => {
            const re = new RegExp(`\\b(${kw})\\b`, 'g');
            code = code.replace(re, '<span class="kw">$1</span>');
        });
        // Builtins / functions
        const builtins = ['len', 'range', 'max', 'min', 'sum', 'sorted', 'enumerate', 'zip', 'map', 'filter', 'list', 'dict', 'set', 'tuple', 'int', 'str', 'float', 'bool', 'print', 'append', 'pop', 'extend', 'abs', 'type'];
        builtins.forEach(fn => {
            const re = new RegExp(`\\b(${fn})\\b`, 'g');
            code = code.replace(re, '<span class="fn">$1</span>');
        });
        // Numbers
        code = code.replace(/\b(\d+)\b/g, '<span class="num">$1</span>');

        return code;
    }

    // ─── Global Hooks (for onclick in rendered HTML) ───
    window._nav = function (section, topicId) {
        navigateToTopic(section, topicId);
    };

    window._copy = function (btn) {
        const codeBlock = btn.closest('.code-block-container').querySelector('.code-block');
        const text = codeBlock.textContent;
        navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 1500);
        });
    };

    // ─── Boot ───
    document.addEventListener('DOMContentLoaded', init);

})();
