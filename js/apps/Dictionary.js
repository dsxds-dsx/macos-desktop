// Dictionary - 词典 (macOS Sonoma)
window.renderDictionary = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_dictionary_v2';

    // Dictionary sources (like real macOS Dictionary)
    const SOURCES = [
        { id: 'new-oxford', name: 'New Oxford American Dictionary', lang: 'EN', icon: 'book' },
        { id: 'oxford-thesaurus', name: 'Oxford Writer\'s Thesaurus', lang: 'EN', icon: 'thesaurus' },
        { id: 'apple', name: 'Apple Dictionary', lang: 'EN', icon: 'apple' },
        { id: 'wikipedia', name: 'Wikipedia', lang: 'ZH', icon: 'wiki' },
        { id: 'all', name: '所有资源', lang: '', icon: 'all' }
    ];

    const dictionary = {
        apple: {
            word: 'apple',
            phonetic: '/ˈæpl/',
            audio: 'apple',
            definitions: [
                { source: 'new-oxford', pos: 'n.', def: 'A round fruit with red or green skin and a firm white flesh.', example: 'She bit into the crisp apple.' },
                { source: 'new-oxford', pos: 'n.', def: 'The tree bearing apples.', example: 'The apple tree blossomed in spring.' },
                { source: 'apple', pos: 'n.', def: 'A multinational technology company known for iPhone, Mac, and iPad.', example: 'Apple revolutionized the smartphone industry.' }
            ],
            thesaurus: [
                { pos: 'n.', synonyms: ['fruit', 'pome', 'crabapple'] }
            ],
            wiki: '苹果（学名：Malus domestica）是蔷薇科苹果属植物的果实。苹果树是世界上最广泛栽培的水果树之一，其果实苹果是常见的水果。'
        },
        computer: {
            word: 'computer',
            phonetic: '/kəmˈpjuːtər/',
            audio: 'computer',
            definitions: [
                { source: 'new-oxford', pos: 'n.', def: 'An electronic device for storing and processing data, typically in binary form, according to instructions given to it.', example: 'She uses a computer for her work.' },
                { source: 'new-oxford', pos: 'n.', def: 'A person who makes calculations, especially formerly a person engaged in mathematical calculation.', example: 'He worked as a computer of astronomical tables.' }
            ],
            thesaurus: [
                { pos: 'n.', synonyms: ['machine', 'processor', 'calculator', 'workstation'] }
            ],
            wiki: '计算机（Computer）是一种用于高速计算的电子设备，可以进行数值计算，又可以进行逻辑计算，还具有存储记忆功能。'
        },
        serendipity: {
            word: 'serendipity',
            phonetic: '/ˌsɛrənˈdɪpɪti/',
            audio: 'serendipity',
            definitions: [
                { source: 'new-oxford', pos: 'n.', def: 'The occurrence and development of events by chance in a happy or beneficial way.', example: 'A series of small serendipities led to their meeting.' },
                { source: 'oxford-thesaurus', pos: 'n.', def: 'A lucky discovery made while searching for something else entirely.', example: 'The discovery of penicillin was a serendipity.' }
            ],
            thesaurus: [
                { pos: 'n.', synonyms: ['chance', 'fortune', 'luck', 'fluke', 'happy coincidence'] }
            ],
            wiki: '机缘巧合（Serendipity）是指偶然发现美好或有价值事物的现象。这个词由霍勒斯·沃波尔在1754年创造。'
        },
        ephemeral: {
            word: 'ephemeral',
            phonetic: '/əˈfɛm(ə)rəl/',
            audio: 'ephemeral',
            definitions: [
                { source: 'new-oxford', pos: 'adj.', def: 'Lasting for a very short time.', example: 'Fame in the music industry can be ephemeral.' },
                { source: 'new-oxford', pos: 'n.', def: 'An ephemeral plant or insect.', example: 'The mayfly is a classic ephemeral.' }
            ],
            thesaurus: [
                { pos: 'adj.', synonyms: ['transient', 'fleeting', 'short-lived', 'momentary', 'evanescent'] }
            ],
            wiki: '短暂性（Ephemeral）形容存在时间很短的事物，常用于描述自然界现象、艺术或网络内容。'
        },
        mellifluous: {
            word: 'mellifluous',
            phonetic: '/məˈlɪfluəs/',
            audio: 'mellifluous',
            definitions: [
                { source: 'new-oxford', pos: 'adj.', def: '(Of a voice or words) sweet or musical; pleasant to hear.', example: 'Her mellifluous voice captivated the audience.' }
            ],
            thesaurus: [
                { pos: 'adj.', synonyms: ['sweet-sounding', 'musical', 'harmonious', 'dulcet', 'euphonious'] }
            ],
            wiki: '悦耳的（Mellifluous）是形容声音甜美动听的形容词，源自拉丁语 mel（蜜）和 fluere（流）。'
        },
        eloquent: {
            word: 'eloquent',
            phonetic: '/ˈɛləkwənt/',
            audio: 'eloquent',
            definitions: [
                { source: 'new-oxford', pos: 'adj.', def: 'Fluent or persuasive in speaking or writing.', example: 'He gave an eloquent speech at the ceremony.' },
                { source: 'new-oxford', pos: 'adj.', def: 'Clearly expressing or indicating something.', example: 'Her silence was eloquent of her disapproval.' }
            ],
            thesaurus: [
                { pos: 'adj.', synonyms: ['articulate', 'fluent', 'persuasive', 'expressive', 'well-spoken'] }
            ],
            wiki: '雄辩的（Eloquent）形容说话或写作流畅且有说服力的能力，是修辞学中的重要概念。'
        },
        macOS: {
            word: 'macOS',
            phonetic: '/ˌmæk oʊ ˈɛs/',
            audio: 'macos',
            definitions: [
                { source: 'apple', pos: 'n.', def: 'The operating system that powers every Mac, designed for performance and ease of use.', example: 'macOS Sonoma brings new ways to work and play.' },
                { source: 'new-oxford', pos: 'n.', def: 'A series of operating systems developed by Apple Inc. for its Mac computers.', example: 'macOS is known for its elegant design.' }
            ],
            thesaurus: [
                { pos: 'n.', synonyms: ['operating system', 'OS', 'system software'] }
            ],
            wiki: 'macOS（原称 Mac OS X）是苹果公司为 Mac 电脑开发的图形界面操作系统。macOS Sonoma（14.0）是2023年发布的版本。'
        },
        sonoma: {
            word: 'Sonoma',
            phonetic: '/səˈnoʊmə/',
            audio: 'sonoma',
            definitions: [
                { source: 'apple', pos: 'n.', def: 'The 14th major release of macOS, featuring widgets, video wallpapers, and Game Mode.', example: 'macOS Sonoma transforms the desktop experience.' }
            ],
            thesaurus: [
                { pos: 'n.', synonyms: ['macOS 14', 'Sonoma County'] }
            ],
            wiki: 'Sonoma 是加利福尼亚州的一个县，以葡萄酒产区闻名。macOS 14 以此命名。'
        }
    };

    const wordOfTheDay = {
        word: 'petrichor',
        phonetic: '/ˈpɛtrɪkɔːr/',
        def: 'The earthy scent produced when rain falls on dry soil.',
        date: new Date().toLocaleDateString('zh-CN')
    };

    function defaultData() {
        return {
            activeSource: 'all',
            history: ['apple', 'serendipity', 'macOS'],
            favorites: ['mellifluous', 'eloquent']
        };
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultData();
    let searchTerm = 'apple';
    let currentWord = 'apple';
    let view = 'entry'; // 'entry' | 'favorites' | 'history'

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text);
    }

    function getFilteredWords() {
        const allWords = Object.keys(dictionary);
        const q = searchTerm.toLowerCase().trim();
        if (!q) return allWords;
        return allWords.filter(w => w.toLowerCase().includes(q));
    }

    function getEntryForSource(word, sourceId) {
        const entry = dictionary[word];
        if (!entry) return null;
        if (sourceId === 'all') return entry;
        if (sourceId === 'wikipedia') return entry.wiki ? entry : null;
        if (sourceId === 'oxford-thesaurus') return entry.thesaurus && entry.thesaurus.length ? entry : null;
        return {
            ...entry,
            definitions: entry.definitions.filter(d => d.source === sourceId)
        };
    }

    function sourceIcon(type) {
        const icons = {
            book: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
            thesaurus: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 7l10-3 10 3M2 12l10-3 10 3M2 17l10-3 10 3"/></svg>',
            apple: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.88 2.65 3.22 2.6 1.29-.05 1.78-.83 3.34-.83 1.56 0 2 .83 3.37.81 1.39-.03 2.27-1.27 3.12-2.53.98-1.45 1.39-2.85 1.41-2.92-.03-.01-2.7-1.04-2.73-4.14M14.6 4.59c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-2.99 1.54-.66.76-1.23 1.98-1.08 3.15 1.14.09 2.3-.58 3.01-1.44"/></svg>',
            wiki: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M3 12h18M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
            all: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>'
        };
        return icons[type] || icons.book;
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="dict-sidebar">
                <div class="dict-sidebar-search">
                    <svg class="dict-search-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                    <input type="text" id="dict-search" class="dict-search-input" placeholder="搜索" value="${escapeHtml(searchTerm)}">
                    ${searchTerm ? `<button class="dict-search-clear" id="dict-clear">×</button>` : ''}
                </div>

                <div class="dict-sources">
                    <div class="dict-sidebar-label">资源</div>
                    ${SOURCES.map(s => `
                        <div class="dict-source ${data.activeSource === s.id ? 'active' : ''}" data-src="${s.id}">
                            <span class="dict-source-icon">${sourceIcon(s.icon)}</span>
                            <span class="dict-source-name">${escapeHtml(s.name)}</span>
                            ${s.lang ? `<span class="dict-source-lang">${s.lang}</span>` : ''}
                        </div>
                    `).join('')}
                </div>

                <div class="dict-words-section">
                    <div class="dict-sidebar-label">建议</div>
                    <div class="dict-words-list">
                        ${getFilteredWords().length ? getFilteredWords().map(w => `
                            <div class="dict-word-item ${currentWord === w ? 'active' : ''}" data-word="${w}">
                                <span class="dict-word-text">${escapeHtml(w)}</span>
                                ${data.favorites.includes(w) ? '<span class="dict-star">★</span>' : ''}
                            </div>
                        `).join('') : `<div class="dict-empty-hint">无匹配结果</div>`}
                    </div>
                </div>

                <div class="dict-sidebar-footer">
                    <div class="dict-wotd">
                        <div class="dict-wotd-label">每日一词</div>
                        <div class="dict-wotd-word">${escapeHtml(wordOfTheDay.word)}</div>
                        <div class="dict-wotd-phonetic">${escapeHtml(wordOfTheDay.phonetic)}</div>
                        <div class="dict-wotd-def">${escapeHtml(wordOfTheDay.def)}</div>
                    </div>
                </div>
            </div>
        `;

        const input = sidebar.querySelector('#dict-search');
        input.addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderSidebar();
        });
        const clearBtn = sidebar.querySelector('#dict-clear');
        if (clearBtn) clearBtn.addEventListener('click', () => {
            searchTerm = '';
            renderSidebar();
        });

        sidebar.querySelectorAll('[data-src]').forEach(el => {
            el.addEventListener('click', () => {
                data.activeSource = el.dataset.src;
                save();
                renderSidebar();
                renderContent();
            });
        });

        sidebar.querySelectorAll('[data-word]').forEach(el => {
            el.addEventListener('click', () => {
                currentWord = el.dataset.word;
                searchTerm = currentWord;
                if (!data.history.includes(currentWord)) {
                    data.history.unshift(currentWord);
                    data.history = data.history.slice(0, 20);
                    save();
                }
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div class="dict-toolbar">
                <div class="dict-toolbar-actions">
                    <button class="dict-tb-btn" id="dict-back" title="后退">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button class="dict-tb-btn" id="dict-fwd" title="前进">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </div>
                <div class="dict-toolbar-center">
                    <div class="dict-current-word">${escapeHtml(dictionary[currentWord]?.word || currentWord)}</div>
                </div>
                <div class="dict-toolbar-actions">
                    <button class="dict-tb-btn ${data.favorites.includes(currentWord) ? 'active' : ''}" id="dict-fav" title="收藏">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="${data.favorites.includes(currentWord) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </button>
                    <button class="dict-tb-btn" id="dict-share" title="分享">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    </button>
                    <button class="dict-tb-btn" id="dict-print" title="打印">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    </button>
                </div>
            </div>
        `;

        const favBtn = toolbar.querySelector('#dict-fav');
        if (favBtn) favBtn.addEventListener('click', () => {
            const idx = data.favorites.indexOf(currentWord);
            if (idx >= 0) {
                data.favorites.splice(idx, 1);
                showToast('已从收藏移除');
            } else {
                data.favorites.unshift(currentWord);
                showToast('已添加到收藏');
            }
            save();
            render();
        });

        const shareBtn = toolbar.querySelector('#dict-share');
        if (shareBtn) shareBtn.addEventListener('click', () => {
            showToast('已复制词条链接');
        });

        const printBtn = toolbar.querySelector('#dict-print');
        if (printBtn) printBtn.addEventListener('click', () => {
            showToast('正在准备打印...');
        });

        const backBtn = toolbar.querySelector('#dict-back');
        if (backBtn) backBtn.addEventListener('click', () => {
            const histIdx = data.history.indexOf(currentWord);
            if (histIdx < data.history.length - 1) {
                currentWord = data.history[histIdx + 1];
                searchTerm = currentWord;
                render();
            }
        });

        const fwdBtn = toolbar.querySelector('#dict-fwd');
        if (fwdBtn) fwdBtn.addEventListener('click', () => {
            const histIdx = data.history.indexOf(currentWord);
            if (histIdx > 0) {
                currentWord = data.history[histIdx - 1];
                searchTerm = currentWord;
                render();
            }
        });
    }

    function renderContent() {
        const entry = dictionary[currentWord];
        if (!entry) {
            body.innerHTML = `
                <div class="dict-body">
                    <div class="dict-not-found">
                        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"><circle cx="28" cy="28" r="20"/><path d="M44 44l12 12"/></svg>
                        <div class="dict-not-found-title">未找到「${escapeHtml(searchTerm)}」</div>
                        <div class="dict-not-found-sub">请尝试其他拼写或选择左侧建议</div>
                    </div>
                </div>
            `;
            return;
        }

        const showEntry = getEntryForSource(currentWord, data.activeSource);
        const isFav = data.favorites.includes(currentWord);

        let defsHtml = '';
        if (showEntry && showEntry.definitions && showEntry.definitions.length) {
            defsHtml = showEntry.definitions.map((d, i) => {
                const srcName = SOURCES.find(s => s.id === d.source)?.name || '';
                return `
                    <div class="dict-def-block">
                        <div class="dict-def-header">
                            <span class="dict-pos">${escapeHtml(d.pos)}</span>
                            <span class="dict-num">${i + 1}</span>
                        </div>
                        <div class="dict-def-text">${escapeHtml(d.def)}</div>
                        ${d.example ? `<div class="dict-def-example">"${escapeHtml(d.example)}"</div>` : ''}
                        <div class="dict-def-src">${escapeHtml(srcName)}</div>
                    </div>
                `;
            }).join('');
        }

        let thesaurusHtml = '';
        if (showEntry && showEntry.thesaurus && showEntry.thesaurus.length && (data.activeSource === 'all' || data.activeSource === 'oxford-thesaurus')) {
            thesaurusHtml = `
                <div class="dict-section">
                    <div class="dict-section-title">同义词</div>
                    ${showEntry.thesaurus.map(t => `
                        <div class="dict-thes-block">
                            <span class="dict-pos">${escapeHtml(t.pos)}</span>
                            <div class="dict-synonyms">
                                ${t.synonyms.map(syn => `<span class="dict-syn-tag">${escapeHtml(syn)}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        let wikiHtml = '';
        if (showEntry && showEntry.wiki && (data.activeSource === 'all' || data.activeSource === 'wikipedia')) {
            wikiHtml = `
                <div class="dict-section">
                    <div class="dict-section-title">
                        <span class="dict-wiki-icon">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M3 12h18M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>
                        </span>
                        Wikipedia
                    </div>
                    <div class="dict-wiki-text">${escapeHtml(showEntry.wiki)}</div>
                </div>
            `;
        }

        body.innerHTML = `
            <div class="dict-body">
                <div class="dict-entry-header">
                    <div class="dict-word-row">
                        <h1 class="dict-word">${escapeHtml(entry.word)}</h1>
                        <button class="dict-audio-btn" id="dict-audio" title="发音">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                        </button>
                        <button class="dict-fav-btn ${isFav ? 'active' : ''}" id="dict-fav-content" title="${isFav ? '取消收藏' : '添加收藏'}">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </button>
                    </div>
                    <div class="dict-phonetic">${escapeHtml(entry.phonetic)}</div>
                </div>

                ${defsHtml ? `<div class="dict-section">${defsHtml}</div>` : ''}
                ${thesaurusHtml}
                ${wikiHtml}

                ${!defsHtml && !thesaurusHtml && !wikiHtml ? `
                    <div class="dict-empty-src">
                        <div class="dict-empty-src-title">当前资源无此词条</div>
                        <div class="dict-empty-src-sub">请选择「所有资源」查看全部内容</div>
                    </div>
                ` : ''}

                <div class="dict-entry-footer">
                    <div class="dict-footer-meta">
                        <span class="dict-footer-src">${escapeHtml(SOURCES.find(s => s.id === data.activeSource)?.name || '所有资源')}</span>
                        <span class="dict-footer-dot">·</span>
                        <span>macOS 词典</span>
                    </div>
                </div>
            </div>
        `;

        const audioBtn = body.querySelector('#dict-audio');
        if (audioBtn) audioBtn.addEventListener('click', () => {
            audioBtn.classList.add('playing');
            showToast(`🔊 ${escapeHtml(entry.word)} ${escapeHtml(entry.phonetic)}`);
            setTimeout(() => audioBtn.classList.remove('playing'), 1000);
        });

        const favBtn = body.querySelector('#dict-fav-content');
        if (favBtn) favBtn.addEventListener('click', () => {
            const idx = data.favorites.indexOf(currentWord);
            if (idx >= 0) {
                data.favorites.splice(idx, 1);
                showToast('已从收藏移除');
            } else {
                data.favorites.unshift(currentWord);
                showToast('已添加到收藏');
            }
            save();
            render();
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    render();
};
