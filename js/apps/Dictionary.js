window.renderDictionary = function(body, sidebar, toolbar, windowId) {
    let searchTerm = 'apple';
    let currentWord = 'apple';

    const dictionary = {
        apple: {
            word: 'apple',
            phonetic: '/ˈæpl/',
            definitions: [
                { pos: 'n.', def: '苹果，苹果树', example: 'An apple a day keeps the doctor away.' },
                { pos: 'n.', def: '(计算机)苹果公司(Apple Inc.)', example: 'Apple designs the iPhone and Mac.' }
            ]
        },
        computer: {
            word: 'computer',
            phonetic: '/kəmˈpjuːtər/',
            definitions: [
                { pos: 'n.', def: '计算机，电脑', example: 'I use my computer every day for work.' },
                { pos: 'n.', def: '计算者，计算员', example: 'He is a skilled computer of mathematical tables.' }
            ]
        },
        hello: {
            word: 'hello',
            phonetic: '/həˈloʊ/',
            definitions: [
                { pos: 'int.', def: '你好，喂(打招呼或打电话用语)', example: 'Hello, how are you today?' },
                { pos: 'n.', def: '问候，招呼', example: 'She gave me a warm hello.' }
            ]
        },
        love: {
            word: 'love',
            phonetic: '/lʌv/',
            definitions: [
                { pos: 'n.', def: '爱，爱情，热爱', example: 'Love makes the world go round.' },
                { pos: 'v.', def: '爱，热爱，喜欢', example: 'I love spending time with my family.' }
            ]
        },
        macos: {
            word: 'macOS',
            phonetic: '/ˌmæk oʊ ɛs/',
            definitions: [
                { pos: 'n.', def: 'macOS 是苹果公司为 Mac 电脑开发的操作系统', example: 'macOS Sonoma is the latest version.' }
            ]
        }
    };

    const suggestions = Object.keys(dictionary);

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:220px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);padding:16px;">
                <div style="font-size:20px;font-weight:700;margin-bottom:16px;">📖 词典</div>
                <input type="text" id="search-input" placeholder="搜索" value="${searchTerm}" style="width:100%;padding:8px 12px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:8px;font-size:13px;outline:none;margin-bottom:12px;">
                <div style="font-size:11px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">建议</div>
                ${suggestions.filter(s => s.includes(searchTerm.toLowerCase())).map(s => `
                    <div class="finder-sidebar-item ${currentWord === s ? 'active' : ''}" data-word="${s}" style="margin-bottom:2px;">
                        <span>${s}</span>
                    </div>
                `).join('')}
            </div>
        `;

        const input = sidebar.querySelector('#search-input');
        input.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            if (dictionary[searchTerm.toLowerCase()]) {
                currentWord = searchTerm.toLowerCase();
            }
            renderSidebar();
            renderContent();
        });

        sidebar.querySelectorAll('[data-word]').forEach(item => {
            item.addEventListener('click', () => {
                currentWord = item.dataset.word;
                searchTerm = currentWord;
                render();
            });
        });
    }

    function renderContent() {
        const entry = dictionary[currentWord] || dictionary['apple'];
        body.innerHTML = `
            <div class="dictionary-body">
                <div class="dictionary-word">${entry.word}</div>
                <div class="dictionary-phonetic">${entry.phonetic}</div>
                <button style="margin-bottom:24px;padding:6px 16px;background:var(--accent-blue);color:#fff;border:none;border-radius:16px;cursor:pointer;font-size:12px;">🔊 发音</button>
                ${entry.definitions.map((d, i) => `
                    <div style="margin-bottom:20px;">
                        <div style="display:flex;gap:8px;align-items:baseline;margin-bottom:8px;">
                            <span style="font-style:italic;color:var(--text-tertiary);font-size:13px;">${d.pos}</span>
                            <span style="color:var(--text-tertiary);font-size:13px;">${i + 1}.</span>
                        </div>
                        <div class="dictionary-definition">${d.def}</div>
                        ${d.example ? `<div class="dictionary-example">"${d.example}"</div>` : ''}
                    </div>
                `).join('')}
                <div style="margin-top:32px;padding-top:16px;border-top:0.5px solid var(--border-color);">
                    <div style="font-size:12px;color:var(--text-tertiary);">来源：New Oxford American Dictionary</div>
                </div>
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    render();
};
