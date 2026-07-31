// Shortcuts - 快捷指令 (macOS Sonoma)
window.renderShortcuts = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_shortcuts_state_v2';

    const ICONS = {
        all: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
        star: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        share: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`,
        bolt: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        tool: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
        leaf: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>`,
        play: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
        search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
        back: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
        more: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`,
        edit: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
        add: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
        flow: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6"/></svg>`
    };

    const CAT_ICONS = {
        all: ICONS.all,
        mine: ICONS.star,
        shared: ICONS.share,
        efficiency: ICONS.bolt,
        tools: ICONS.tool,
        life: ICONS.leaf
    };

    const SHORTCUTS = [
        { id: 1, name: '早上好', icon: '☀️', color: '#FF9500', gradient: 'linear-gradient(135deg, #FFB340, #FF9500)', desc: '播报天气、新闻和日程安排', category: 'mine', runs: 156, actions: [
            { type: 'weather', name: '获取天气', icon: '🌤️' },
            { type: 'speak', name: '朗读今日天气', icon: '🗣️' },
            { type: 'news', name: '获取新闻', icon: '📰' },
            { type: 'calendar', name: '显示今日日程', icon: '📅' }
        ]},
        { id: 2, name: '回家路线', icon: '🏠', color: '#34C759', gradient: 'linear-gradient(135deg, #63E673, #34C759)', desc: '导航回家并发送预计到达时间', category: 'mine', runs: 89, actions: [
            { type: 'location', name: '获取当前位置', icon: '📍' },
            { type: 'maps', name: '规划回家路线', icon: '🗺️' },
            { type: 'message', name: '发送预计到达时间', icon: '💬' }
        ]},
        { id: 3, name: '视频转 GIF', icon: '🎬', color: '#AF52DE', gradient: 'linear-gradient(135deg, #D8B4FE, #AF52DE)', desc: '快速将视频转换为 GIF 动图', category: 'mine', runs: 42, actions: [
            { type: 'select', name: '选择视频', icon: '🎞️' },
            { type: 'convert', name: '提取帧', icon: '🎞️' },
            { type: 'gif', name: '生成 GIF', icon: '🎬' },
            { type: 'save', name: '保存到相册', icon: '💾' }
        ]},
        { id: 4, name: '快捷记账', icon: '💰', color: '#FF3B30', gradient: 'linear-gradient(135deg, #FF6961, #FF3B30)', desc: '快速记录一笔支出', category: 'mine', runs: 231, actions: [
            { type: 'input', name: '输入金额', icon: '💵' },
            { type: 'select', name: '选择分类', icon: '🏷️' },
            { type: 'save', name: '保存记录', icon: '✅' }
        ]},
        { id: 5, name: '番茄钟', icon: '🍅', color: '#FF2D55', gradient: 'linear-gradient(135deg, #FF6B8B, #FF2D55)', desc: '25 分钟专注计时器', category: 'mine', runs: 78, actions: [
            { type: 'timer', name: '开始 25 分钟计时', icon: '⏱️' },
            { type: 'notify', name: '计时结束提醒', icon: '🔔' },
            { type: 'rest', name: '5 分钟休息', icon: '☕' }
        ]},
        { id: 6, name: '每日一句', icon: '📖', color: '#007AFF', gradient: 'linear-gradient(135deg, #5AC8FA, #007AFF)', desc: '获取每日名言警句', category: 'mine', runs: 45, actions: [
            { type: 'fetch', name: '获取名言', icon: '🌐' },
            { type: 'speak', name: '朗读名言', icon: '🗣️' }
        ]},
        { id: 7, name: '下载视频', icon: '📥', color: '#FF3B30', gradient: 'linear-gradient(135deg, #FF6961, #FF3B30)', desc: '下载在线视频到相册', category: 'shared', runs: 12, actions: [
            { type: 'input', name: '输入视频链接', icon: '🔗' },
            { type: 'download', name: '下载视频', icon: '📥' },
            { type: 'save', name: '保存到相册', icon: '💾' }
        ]},
        { id: 8, name: '照片拼图', icon: '🖼️', color: '#5AC8FA', gradient: 'linear-gradient(135deg, #80D8FF, #5AC8FA)', desc: '将多张照片合成一张', category: 'shared', runs: 34, actions: [
            { type: 'select', name: '选择照片', icon: '📷' },
            { type: 'layout', name: '选择拼图布局', icon: '🎨' },
            { type: 'combine', name: '合成图片', icon: '🖼️' }
        ]},
        { id: 9, name: '扫描二维码', icon: '📷', color: '#34C759', gradient: 'linear-gradient(135deg, #63E673, #34C759)', desc: '快速扫描并打开链接', category: 'efficiency', runs: 67, actions: [
            { type: 'scan', name: '扫描二维码', icon: '📷' },
            { type: 'open', name: '打开链接', icon: '🌐' }
        ]},
        { id: 10, name: '翻译文本', icon: '🌐', color: '#007AFF', gradient: 'linear-gradient(135deg, #5AC8FA, #007AFF)', desc: '翻译选中的文字', category: 'efficiency', runs: 55, actions: [
            { type: 'input', name: '获取选中文本', icon: '📝' },
            { type: 'translate', name: '翻译为中文', icon: '🌐' },
            { type: 'show', name: '显示翻译结果', icon: '💬' }
        ]},
        { id: 11, name: '生成二维码', icon: '🔲', color: '#5856D6', gradient: 'linear-gradient(135deg, #7B79FF, #5856D6)', desc: '为文本生成二维码', category: 'tools', runs: 23, actions: [
            { type: 'input', name: '输入文本', icon: '📝' },
            { type: 'generate', name: '生成二维码', icon: '🔲' },
            { type: 'save', name: '保存图片', icon: '💾' }
        ]},
        { id: 12, name: '天气预报', icon: '🌤️', color: '#5AC8FA', gradient: 'linear-gradient(135deg, #80D8FF, #5AC8FA)', desc: '获取未来 7 天天气预报', category: 'life', runs: 98, actions: [
            { type: 'location', name: '获取位置', icon: '📍' },
            { type: 'weather', name: '获取天气预报', icon: '🌤️' },
            { type: 'show', name: '显示天气卡片', icon: '📊' }
        ]}
    ];

    const CATEGORIES = [
        { id: 'all', name: '所有快捷指令', icon: 'all' },
        { id: 'mine', name: '我的快捷指令', icon: 'star' },
        { id: 'shared', name: '共享', icon: 'share' },
        { id: 'efficiency', name: '效率', icon: 'bolt' },
        { id: 'tools', name: '工具', icon: 'tool' },
        { id: 'life', name: '生活', icon: 'leaf' }
    ];

    let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
        activeCategory: 'all',
        searchQuery: '',
        selectedId: null,
        favorites: [1, 4]
    };

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getFiltered() {
        let list = state.activeCategory === 'all' ? SHORTCUTS : SHORTCUTS.filter(s => s.category === state.activeCategory);
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            list = list.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
        }
        return list;
    }

    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text, 'success');
    }

    function renderSidebar() {
        const counts = {
            all: SHORTCUTS.length,
            mine: SHORTCUTS.filter(s => s.category === 'mine').length,
            shared: SHORTCUTS.filter(s => s.category === 'shared').length,
            efficiency: SHORTCUTS.filter(s => s.category === 'efficiency').length,
            tools: SHORTCUTS.filter(s => s.category === 'tools').length,
            life: SHORTCUTS.filter(s => s.category === 'life').length
        };

        return `
            <div class="sc-side">
                <div class="sc-side-header">
                    <div class="sc-side-eyebrow">快捷指令</div>
                    <h1 class="sc-side-title">快捷指令</h1>
                </div>
                <div class="sc-search">
                    ${ICONS.search}
                    <input type="text" id="sc-search-input" placeholder="搜索" value="${escapeHtml(state.searchQuery)}">
                </div>
                <div class="sc-nav">
                    ${CATEGORIES.map(cat => `
                        <div class="sc-nav-item ${state.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                            ${CAT_ICONS[cat.icon]}
                            <span>${escapeHtml(cat.name)}</span>
                            ${counts[cat.id] ? `<span class="sc-count">${counts[cat.id]}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="sc-side-footer">
                    <div class="sc-gallery-card">
                        ${ICONS.flow}
                        <div>
                            <div class="sc-gallery-title">快捷指令中心</div>
                            <div class="sc-gallery-sub">探索精选快捷指令</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderGallery(list) {
        if (list.length === 0) {
            return `
                <div class="sc-empty">
                    <div class="sc-empty-icon">${ICONS.flow}</div>
                    <div class="sc-empty-title">${state.searchQuery ? '未找到快捷指令' : '没有快捷指令'}</div>
                    <div class="sc-empty-sub">${state.searchQuery ? '尝试其他搜索词' : '点击 + 创建你的第一个快捷指令'}</div>
                </div>
            `;
        }
        return `
            <div class="sc-grid">
                ${list.map(s => {
                    const isFav = state.favorites.includes(s.id);
                    return `
                        <div class="sc-card" data-id="${s.id}" style="background:${s.gradient}">
                            <button class="sc-fav ${isFav ? 'active' : ''}" data-fav="${s.id}" title="收藏">
                                ${ICONS.star}
                            </button>
                            <div class="sc-card-icon">${s.icon}</div>
                            <div class="sc-card-name">${escapeHtml(s.name)}</div>
                            <div class="sc-card-desc">${escapeHtml(s.desc)}</div>
                            <div class="sc-card-meta">
                                <span class="sc-runs">已运行 ${s.runs} 次</span>
                            </div>
                            <button class="sc-play-btn" data-play="${s.id}" title="运行">
                                ${ICONS.play}
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderDetailView(sc) {
        const isFav = state.favorites.includes(sc.id);
        return `
            <div class="sc-detail">
                <div class="sc-detail-toolbar">
                    <button class="sc-back-btn" data-action="back">${ICONS.back}<span>快捷指令</span></button>
                    <div class="sc-detail-tools">
                        <button class="sc-tool-btn" data-action="edit" title="编辑">${ICONS.edit}</button>
                        <button class="sc-tool-btn" data-action="more">${ICONS.more}</button>
                    </div>
                </div>
                <div class="sc-detail-scroll">
                    <div class="sc-detail-hero">
                        <div class="sc-detail-icon" style="background:${sc.gradient}">${sc.icon}</div>
                        <div class="sc-detail-info">
                            <h1 class="sc-detail-name">${escapeHtml(sc.name)}</h1>
                            <div class="sc-detail-desc">${escapeHtml(sc.desc)}</div>
                            <div class="sc-detail-stats">
                                <span class="sc-stat-pill">已运行 ${sc.runs} 次</span>
                                <span class="sc-stat-pill">${sc.actions.length} 个操作</span>
                            </div>
                        </div>
                        <button class="sc-run-main" data-action="run-detail">
                            ${ICONS.play}
                            <span>运行</span>
                        </button>
                    </div>

                    <div class="sc-section">
                        <div class="sc-section-title">操作流程</div>
                        <div class="sc-flow">
                            ${sc.actions.map((a, i) => `
                                <div class="sc-flow-step">
                                    <div class="sc-flow-num">${i + 1}</div>
                                    <div class="sc-flow-icon">${a.icon}</div>
                                    <div class="sc-flow-info">
                                        <div class="sc-flow-name">${escapeHtml(a.name)}</div>
                                        <div class="sc-flow-type">${escapeHtml(a.type)}</div>
                                    </div>
                                    ${i < sc.actions.length - 1 ? `<div class="sc-flow-arrow"></div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="sc-section">
                        <div class="sc-section-title">详细信息</div>
                        <div class="sc-info-list">
                            <div class="sc-info-row">
                                <span class="sc-info-label">分类</span>
                                <span class="sc-info-value">${escapeHtml(CATEGORIES.find(c => c.id === sc.category)?.name || '')}</span>
                            </div>
                            <div class="sc-info-row">
                                <span class="sc-info-label">创建时间</span>
                                <span class="sc-info-value">2026年1月15日</span>
                            </div>
                            <div class="sc-info-row">
                                <span class="sc-info-label">最近运行</span>
                                <span class="sc-info-value">今天 10:30</span>
                            </div>
                            <div class="sc-info-row">
                                <span class="sc-info-label">已收藏</span>
                                <span class="sc-info-value">${isFav ? '是' : '否'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderMain() {
        const sel = state.selectedId ? SHORTCUTS.find(s => s.id === state.selectedId) : null;
        if (sel) {
            return `<main class="sc-main">${renderDetailView(sel)}</main>`;
        }
        const list = getFiltered();
        const headerTitle = state.activeCategory === 'all' ? '所有快捷指令' : CATEGORIES.find(c => c.id === state.activeCategory)?.name;
        return `
            <main class="sc-main">
                <div class="sc-list-view">
                    <div class="sc-list-header">
                        <div>
                            <div class="sc-header-eyebrow">快捷指令</div>
                            <h2 class="sc-header-title">${escapeHtml(headerTitle)}</h2>
                            <div class="sc-header-sub">${list.length} 个快捷指令</div>
                        </div>
                        <button class="sc-new-btn">${ICONS.add}<span>新建快捷指令</span></button>
                    </div>
                    ${renderGallery(list)}
                </div>
            </main>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.innerHTML = `<div class="sc-app">${renderSidebar()}${renderMain()}</div>`;
        bindEvents();
    }

    function runShortcut(sc, btn) {
        if (btn) {
            btn.classList.add('running');
            const original = btn.innerHTML;
            btn.innerHTML = `<div class="sc-spinner"></div>`;
            setTimeout(() => {
                btn.classList.remove('running');
                btn.innerHTML = original;
                sc.runs++;
                showToast(`「${sc.name}」运行完成 · 已运行 ${sc.runs} 次`);
                render();
            }, 1200);
        } else {
            sc.runs++;
            showToast(`「${sc.name}」运行完成 · 已运行 ${sc.runs} 次`);
            render();
        }
    }

    function bindEvents() {
        body.querySelectorAll('.sc-nav-item').forEach(el => {
            el.addEventListener('click', () => {
                state.activeCategory = el.dataset.cat;
                state.selectedId = null;
                saveState();
                render();
            });
        });

        const search = body.querySelector('#sc-search-input');
        if (search) {
            let timer;
            search.addEventListener('input', (e) => {
                clearTimeout(timer);
                const val = e.target.value;
                timer = setTimeout(() => {
                    state.searchQuery = val;
                    saveState();
                    render();
                    const ni = body.querySelector('#sc-search-input');
                    if (ni) { ni.focus(); ni.setSelectionRange(val.length, val.length); }
                }, 200);
            });
        }

        body.querySelectorAll('[data-play]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.play);
                const sc = SHORTCUTS.find(s => s.id === id);
                if (sc) runShortcut(sc, btn);
            });
        });

        body.querySelectorAll('[data-fav]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.fav);
                const idx = state.favorites.indexOf(id);
                if (idx > -1) {
                    state.favorites.splice(idx, 1);
                    showToast('已取消收藏');
                } else {
                    state.favorites.push(id);
                    showToast('已添加到收藏');
                }
                saveState();
                render();
            });
        });

        body.querySelectorAll('.sc-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-play]') || e.target.closest('[data-fav]')) return;
                const id = parseInt(card.dataset.id);
                state.selectedId = id;
                saveState();
                render();
            });
        });

        body.querySelectorAll('[data-action="back"]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.selectedId = null;
                saveState();
                render();
            });
        });

        body.querySelectorAll('[data-action="run-detail"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const sc = SHORTCUTS.find(s => s.id === state.selectedId);
                if (sc) runShortcut(sc, btn);
            });
        });

        body.querySelectorAll('.sc-new-btn, [data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('快捷指令编辑器即将上线');
            });
        });

        body.querySelectorAll('[data-action="more"]').forEach(btn => {
            btn.addEventListener('click', () => showToast('更多选项'));
        });

        body.querySelector('.sc-gallery-card')?.addEventListener('click', () => {
            showToast('快捷指令中心：浏览精选快捷指令');
        });
    }

    render();

    return () => {};
};
