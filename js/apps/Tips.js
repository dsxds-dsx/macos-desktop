// Tips - 提示 (macOS Sonoma Style)
window.renderTips = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_tips_state';

    const COLLECTIONS = [
        { id: 'macbook',   name: 'MacBook 使用技巧', icon: 'macbook',   color: '#007AFF', gradient: 'linear-gradient(135deg, #5AC8FA, #007AFF)' },
        { id: 'macos',     name: 'macOS 新功能',     icon: 'macos',     color: '#FF9500', gradient: 'linear-gradient(135deg, #FFB340, #FF9500)' },
        { id: 'siri',      name: 'Siri 快捷指令',    icon: 'siri',      color: '#AF52DE', gradient: 'linear-gradient(135deg, #D8B4FE, #AF52DE)' },
        { id: 'photos',    name: '照片使用技巧',     icon: 'photos',    color: '#FF3B30', gradient: 'linear-gradient(135deg, #FF6961, #FF3B30)' },
        { id: 'icloud',    name: 'iCloud 使用指南',  icon: 'icloud',    color: '#34C759', gradient: 'linear-gradient(135deg, #63E673, #34C759)' },
        { id: 'keyboard',  name: '键盘快捷键',       icon: 'keyboard',  color: '#5856D6', gradient: 'linear-gradient(135deg, #7B79FF, #5856D6)' },
        { id: 'accessibility', name: '辅助功能',     icon: 'accessibility', color: '#FF2D55', gradient: 'linear-gradient(135deg, #FF6B8B, #FF2D55)' },
        { id: 'privacy',   name: '隐私与安全',       icon: 'privacy',   color: '#1D1D1F', gradient: 'linear-gradient(135deg, #42424C, #1D1D1F)' }
    ];

    // SVG icons (matching macOS Sonoma style)
    const ICONS = {
        macbook: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M2 20h20"/></svg>`,
        macos: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.46 15.6 3.18 8.62 7.07 8.18c1.36-.15 2.3.65 3.09.65 1.07 0 1.78-.86 3.31-.65 1.5.2 2.6 1.05 3.32 2.27-2.94 1.78-2.46 5.95.26 7.13zm-3.4-12.6c-1.51 1.23-3.4 1.34-4.32 1.18-.13-1.4.43-2.83 1.32-3.78.91-.97 2.45-1.7 3.65-1.75.12 1.45-.32 2.85-.65 3.35z"/></svg>`,
        siri: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12c0-2.5 1.5-4 4-4s4 1.5 4 4"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`,
        photos: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>`,
        icloud: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.7-1.5 4 4 0 0 0 .7 7.5z"/></svg>`,
        keyboard: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></svg>`,
        accessibility: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M5 9h14M9 9l-1 6m7-6l1 6m-7 0l3 6 3-6"/></svg>`,
        privacy: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z"/><path d="M9 12l2 2 4-4"/></svg>`,
        search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
        heart: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        heartFilled: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        share: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 10.49l-6.82-3.98"/></svg>`,
        back: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
        bookmark: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
        bookmarkFilled: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`
    };

    const TIPS = [
        { id: 1,  title: '使用快速备忘录快速记录想法',     desc: '从屏幕右下角向内轻扫，或按下 Globe 键 + Q 来快速创建备忘录，无需切换应用。',                   category: 'macbook',       liked: false, bookmarked: false, readTime: 1 },
        { id: 2,  title: '台前调度让多任务更轻松',         desc: '在系统设置 > 桌面与程序坞中开启台前调度，自动整理打开的 App 和窗口，让桌面始终保持整洁。',         category: 'macos',         liked: true,  bookmarked: false, readTime: 2 },
        { id: 3,  title: '用 Siri 设置提醒事项',           desc: '告诉 Siri"30 分钟后提醒我喝水"，自动创建带有时间的提醒事项，无需手动打开应用。',              category: 'siri',          liked: true,  bookmarked: true,  readTime: 1 },
        { id: 4,  title: '实况文本提取图片中的文字',       desc: '在预览或照片中，直接选择并复制图片中的文字，无需任何 OCR 工具。实况文本会自动识别中文、英文、数字。', category: 'photos',        liked: false, bookmarked: false, readTime: 2 },
        { id: 5,  title: '用 iCloud 钥匙串保存密码',       desc: '在所有设备上自动填充保存的密码和验证码，无需再记住多个复杂的密码。可在系统设置 > 密码中查看。',     category: 'icloud',        liked: false, bookmarked: false, readTime: 2 },
        { id: 6,  title: 'Command + 空格 打开聚焦搜索',   desc: '快速搜索文件、启动应用、查找定义、计算货币汇率，聚焦搜索是 Mac 上最强大的快捷键之一。',         category: 'keyboard',      liked: true,  bookmarked: false, readTime: 1 },
        { id: 7,  title: '语音控制完全用语音操作 Mac',     desc: '无需手动操作，用语音就能完全控制你的 Mac。说"点按文件菜单"或"滚动向下"即可执行。',          category: 'accessibility', liked: false, bookmarked: false, readTime: 3 },
        { id: 8,  title: '文件保险箱保护你的数据',         desc: '开启文件保险箱，对整个磁盘进行 AES-256 加密保护，即使 Mac 丢失也无法访问你的数据。',         category: 'privacy',      liked: false, bookmarked: true,  readTime: 2 },
        { id: 9,  title: '在访达中使用标签快速分类文件',   desc: '为文件添加彩色标签（红、橙、黄、绿、蓝、紫、灰），在访达侧边栏快速访问同一标签的所有文件。',     category: 'macos',         liked: false, bookmarked: false, readTime: 1 },
        { id: 10, title: '三指拖移让移动窗口更轻松',       desc: '在系统设置 > 辅助功能 > 指针控制中开启"三指拖移"，用三指在触控板上拖动即可移动窗口。',         category: 'accessibility', liked: true,  bookmarked: false, readTime: 1 },
        { id: 11, title: '使用随航把 iPad 当作第二屏',     desc: '通过 Wi-Fi 或 USB 连接 iPad，在系统设置 > 显示器中开启随航，获得无线扩展的桌面空间。',         category: 'macbook',       liked: false, bookmarked: false, readTime: 2 },
        { id: 12, title: '快速查看按空格预览文件',         desc: '选中任意文件按空格键即可快速预览，支持图片、视频、PDF、文档等几乎所有格式，无需打开应用。',      category: 'keyboard',      liked: true,  bookmarked: true,  readTime: 1 },
        { id: 13, title: 'iPhone 在附近时自动解锁 Mac',   desc: '开启"使用 Apple Watch 解锁"或借助连续互通，Apple Watch 戴在手上时 Mac 自动解锁。',          category: 'icloud',        liked: false, bookmarked: false, readTime: 1 },
        { id: 14, title: '用通用控制一套键鼠操作多台 Mac', desc: '通用控制让你用一套键盘和鼠标，跨多台 Mac 操作，甚至可以在不同设备间拖放文件。',          category: 'macos',         liked: true,  bookmarked: false, readTime: 2 },
        { id: 15, title: '隔空投送快速分享文件',           desc: '在访达中右键文件 > 共享 > 隔空投送，即可在附近的 Apple 设备间无线传输文件，无需任何设置。',     category: 'icloud',        liked: false, bookmarked: false, readTime: 1 },
        { id: 16, title: '快捷键截屏与录屏',               desc: 'Cmd+Shift+3 截取全屏，Cmd+Shift+4 截取区域，Cmd+Shift+5 打开截屏工具栏进行录屏。',         category: 'keyboard',      liked: true,  bookmarked: true,  readTime: 1 },
        { id: 17, title: '在照片中识别物体和宠物',         desc: '在照片 App 中，长按照片中的物体或宠物，即可自动识别并提供相关搜索结果，使用视觉查找功能。',     category: 'photos',        liked: false, bookmarked: false, readTime: 2 },
        { id: 18, title: '隔离模式保护设备安全',           desc: '当检测到可疑的网络攻击时，可开启隔离模式，限制设备的功能以防止高级别网络攻击。',           category: 'privacy',      liked: false, bookmarked: false, readTime: 2 },
        { id: 19, title: 'Hey Siri 听写让打字更轻松',     desc: '在系统设置 > 键盘 > 听写中开启听写，按两次 Ctrl 键即可说话输入文字，支持中文标点。',         category: 'siri',          liked: false, bookmarked: false, readTime: 1 },
        { id: 20, title: '在访达中显示路径栏',             desc: '在访达菜单栏 > 显示 > 显示路径栏中开启，文件位置一目了然，底部路径栏可点击跳转任意层级。',     category: 'macbook',       liked: false, bookmarked: false, readTime: 1 }
    ];

    let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
        activeCollection: null, // null = all
        searchQuery: '',
        sortBy: 'recent', // recent, liked, alpha
        selectedTipId: null,
        view: 'list' // 'list' or 'detail'
    };

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function getCollection(id) {
        return COLLECTIONS.find(c => c.id === id);
    }

    function getFilteredTips() {
        let list = [...TIPS];
        if (state.activeCollection) list = list.filter(t => t.category === state.activeCollection);
        const q = state.searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter(t => (t.title + ' ' + t.desc + ' ' + t.category).toLowerCase().includes(q));
        }
        if (state.sortBy === 'liked') list.sort((a, b) => (b.liked - a.liked) || (a.id - b.id));
        else if (state.sortBy === 'alpha') list.sort((a, b) => a.title.localeCompare(b.title, 'zh'));
        else list.sort((a, b) => a.id - b.id);
        return list;
    }

    function render() {
        const filtered = getFilteredTips();
        const currentTip = state.selectedTipId ? TIPS.find(t => t.id === state.selectedTipId) : null;
        const activeCollection = state.activeCollection ? getCollection(state.activeCollection) : null;

        body.innerHTML = `
            <div class="tips-app">
                <aside class="tips-side">
                    <div class="tips-side-header">
                        <div class="tips-side-eyebrow">macOS Sonoma</div>
                        <h1 class="tips-side-title">提示</h1>
                        <div class="tips-search">
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
                            <input type="text" id="tips-search-${windowId}" placeholder="搜索提示" value="${escapeHtml(state.searchQuery)}">
                            ${state.searchQuery ? `<button class="tips-search-clear" id="tips-search-clear-${windowId}"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>` : ''}
                        </div>
                    </div>
                    <div class="tips-collections-list">
                        <div class="tips-collection-item ${state.activeCollection === null ? 'active' : ''}" data-collection="all">
                            <div class="tips-collection-icon" style="background:linear-gradient(135deg, #8E8E93, #636366);color:#fff;">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </div>
                            <div class="tips-collection-name">所有提示</div>
                            <span class="tips-collection-count">${TIPS.length}</span>
                        </div>
                        ${COLLECTIONS.map(c => {
                            const count = TIPS.filter(t => t.category === c.id).length;
                            return `
                                <div class="tips-collection-item ${state.activeCollection === c.id ? 'active' : ''}" data-collection="${c.id}">
                                    <div class="tips-collection-icon" style="background:${c.gradient};color:#fff;">${ICONS[c.icon]}</div>
                                    <div class="tips-collection-name">${c.name}</div>
                                    <span class="tips-collection-count">${count}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="tips-side-footer">
                        <div class="tips-stats">
                            <div class="tips-stat">
                                <div class="tips-stat-num">${TIPS.filter(t => t.liked).length}</div>
                                <div class="tips-stat-label">已收藏</div>
                            </div>
                            <div class="tips-stat">
                                <div class="tips-stat-num">${TIPS.filter(t => t.bookmarked).length}</div>
                                <div class="tips-stat-label">书签</div>
                            </div>
                            <div class="tips-stat">
                                <div class="tips-stat-num">${TIPS.length}</div>
                                <div class="tips-stat-label">总数</div>
                            </div>
                        </div>
                    </div>
                </aside>
                <main class="tips-main">
                    ${currentTip ? renderDetail(currentTip) : renderList(filtered, activeCollection)}
                </main>
            </div>
        `;
        bindEvents();
    }

    function renderList(filtered, activeCollection) {
        if (filtered.length === 0) {
            return `
                <div class="tips-empty">
                    <div class="tips-empty-icon">
                        <svg viewBox="0 0 80 80" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="40" r="32"/><path d="M40 26v16M40 50v.01"/></svg>
                    </div>
                    <div class="tips-empty-title">${state.searchQuery ? '没有找到匹配的提示' : '这里还没有提示'}</div>
                    <div class="tips-empty-sub">${state.searchQuery ? '尝试使用其他关键词搜索' : '选择左侧的分类查看相关提示'}</div>
                </div>
            `;
        }

        return `
            <div class="tips-main-header">
                <div>
                    <div class="tips-main-eyebrow">${activeCollection ? '分类' : '所有提示'}</div>
                    <h2 class="tips-main-title">${activeCollection ? activeCollection.name : '精选实用技巧'}</h2>
                    <div class="tips-main-sub">共 ${filtered.length} 条提示 · 帮你更好地使用 Mac</div>
                </div>
                <div class="tips-main-tools">
                    <div class="tips-sort">
                        <button class="tips-sort-btn ${state.sortBy === 'recent' ? 'active' : ''}" data-sort="recent">最新</button>
                        <button class="tips-sort-btn ${state.sortBy === 'liked' ? 'active' : ''}" data-sort="liked">收藏</button>
                        <button class="tips-sort-btn ${state.sortBy === 'alpha' ? 'active' : ''}" data-sort="alpha">字母</button>
                    </div>
                </div>
            </div>
            <div class="tips-cards">
                ${filtered.map(t => {
                    const c = getCollection(t.category);
                    return `
                        <article class="tip-card" data-tip="${t.id}">
                            <div class="tip-card-icon" style="background:${c.gradient};color:#fff;">${ICONS[c.icon]}</div>
                            <div class="tip-card-body">
                                <div class="tip-card-cat" style="color:${c.color};">${c.name}</div>
                                <h3 class="tip-card-title">${escapeHtml(t.title)}</h3>
                                <p class="tip-card-desc">${escapeHtml(t.desc)}</p>
                                <div class="tip-card-foot">
                                    <span class="tip-card-time">${t.readTime} 分钟阅读</span>
                                    <div class="tip-card-actions">
                                        <button class="tip-card-action bookmark ${t.bookmarked ? 'active' : ''}" data-bookmark="${t.id}" title="${t.bookmarked ? '取消书签' : '添加书签'}">
                                            ${t.bookmarked ? ICONS.bookmarkFilled : ICONS.bookmark}
                                        </button>
                                        <button class="tip-card-action like ${t.liked ? 'active' : ''}" data-like="${t.id}" title="${t.liked ? '取消收藏' : '添加收藏'}">
                                            ${t.liked ? ICONS.heartFilled : ICONS.heart}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderDetail(tip) {
        const c = getCollection(tip.category);
        const related = TIPS.filter(t => t.category === tip.category && t.id !== tip.id).slice(0, 3);
        return `
            <div class="tips-detail">
                <div class="tips-detail-toolbar">
                    <button class="tips-back-btn" id="tips-back-${windowId}">${ICONS.back}<span>返回</span></button>
                    <div class="tips-detail-tools">
                        <button class="tips-tool-btn ${tip.bookmarked ? 'active' : ''}" id="tips-detail-bookmark-${windowId}" title="${tip.bookmarked ? '取消书签' : '添加书签'}">
                            ${tip.bookmarked ? ICONS.bookmarkFilled : ICONS.bookmark}
                        </button>
                        <button class="tips-tool-btn ${tip.liked ? 'active' : ''}" id="tips-detail-like-${windowId}" title="${tip.liked ? '取消收藏' : '添加收藏'}">
                            ${tip.liked ? ICONS.heartFilled : ICONS.heart}
                        </button>
                        <button class="tips-tool-btn" id="tips-detail-share-${windowId}" title="分享">${ICONS.share}</button>
                    </div>
                </div>
                <div class="tips-detail-scroll">
                    <article class="tips-article">
                        <div class="tips-article-cat" style="color:${c.color};background:${c.color}1a;">${ICONS[c.icon]} ${c.name}</div>
                        <h1 class="tips-article-title">${escapeHtml(tip.title)}</h1>
                        <div class="tips-article-meta">
                            <span>${tip.readTime} 分钟阅读</span>
                            <span class="dot"></span>
                            <span>${tip.liked ? '已收藏' : '未收藏'}</span>
                        </div>
                        <div class="tips-article-icon" style="background:${c.gradient};">${ICONS[c.icon]}</div>
                        <p class="tips-article-lead">${escapeHtml(tip.desc)}</p>
                        <div class="tips-article-content">
                            <h3>详细步骤</h3>
                            <ol>
                                <li>打开 <strong>系统设置</strong>，从左侧选择对应的功能项。</li>
                                <li>根据上面的描述找到相应的开关或选项。</li>
                                <li>按提示完成设置，部分功能可能需要重新登录或重启 Mac 生效。</li>
                                <li>使用过程中可随时回到设置调整或关闭该功能。</li>
                            </ol>
                            <h3>小贴士</h3>
                            <ul>
                                <li>该功能在 macOS Sonoma 及以上版本中可用。</li>
                                <li>开启某些功能可能需要额外的存储空间或网络连接。</li>
                                <li>建议先阅读相关隐私说明，确认你了解数据如何被处理。</li>
                            </ul>
                        </div>
                        ${related.length > 0 ? `
                            <div class="tips-related">
                                <div class="tips-related-label">相关提示</div>
                                <div class="tips-related-list">
                                    ${related.map(r => `
                                        <button class="tips-related-card" data-related="${r.id}">
                                            <div class="tips-related-icon" style="background:${c.gradient};">${ICONS[c.icon]}</div>
                                            <div class="tips-related-title">${escapeHtml(r.title)}</div>
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </article>
                </div>
            </div>
        `;
    }

    function bindEvents() {
        body.querySelectorAll('.tips-collection-item').forEach(item => {
            item.addEventListener('click', () => {
                const c = item.dataset.collection;
                state.activeCollection = c === 'all' ? null : c;
                state.selectedTipId = null;
                saveState();
                render();
            });
        });

        const searchInput = body.querySelector(`#tips-search-${windowId}`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value;
                saveState();
                render();
                const s = body.querySelector(`#tips-search-${windowId}`);
                if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
            });
        }
        const clearSearch = body.querySelector(`#tips-search-clear-${windowId}`);
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                state.searchQuery = '';
                saveState();
                render();
            });
        }

        body.querySelectorAll('.tips-sort-btn').forEach(b => {
            b.addEventListener('click', () => {
                state.sortBy = b.dataset.sort;
                saveState();
                render();
            });
        });

        body.querySelectorAll('.tip-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.tip-card-action')) return;
                state.selectedTipId = parseInt(card.dataset.tip);
                saveState();
                render();
            });
        });

        body.querySelectorAll('[data-like]').forEach(b => {
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(b.dataset.like);
                const t = TIPS.find(x => x.id === id);
                if (!t) return;
                t.liked = !t.liked;
                if (window.toast) window.toast(t.liked ? '已收藏' : '已取消收藏', 'success');
                render();
            });
        });

        body.querySelectorAll('[data-bookmark]').forEach(b => {
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(b.dataset.bookmark);
                const t = TIPS.find(x => x.id === id);
                if (!t) return;
                t.bookmarked = !t.bookmarked;
                if (window.toast) window.toast(t.bookmarked ? '已添加书签' : '已取消书签', 'success');
                render();
            });
        });

        const backBtn = body.querySelector(`#tips-back-${windowId}`);
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                state.selectedTipId = null;
                saveState();
                render();
            });
        }

        const detailBookmark = body.querySelector(`#tips-detail-bookmark-${windowId}`);
        if (detailBookmark) {
            detailBookmark.addEventListener('click', () => {
                const t = TIPS.find(x => x.id === state.selectedTipId);
                if (!t) return;
                t.bookmarked = !t.bookmarked;
                if (window.toast) window.toast(t.bookmarked ? '已添加书签' : '已取消书签', 'success');
                render();
            });
        }

        const detailLike = body.querySelector(`#tips-detail-like-${windowId}`);
        if (detailLike) {
            detailLike.addEventListener('click', () => {
                const t = TIPS.find(x => x.id === state.selectedTipId);
                if (!t) return;
                t.liked = !t.liked;
                if (window.toast) window.toast(t.liked ? '已收藏' : '已取消收藏', 'success');
                render();
            });
        }

        const detailShare = body.querySelector(`#tips-detail-share-${windowId}`);
        if (detailShare) {
            detailShare.addEventListener('click', () => {
                if (window.toast) window.toast('已复制链接（演示）', 'info');
            });
        }

        body.querySelectorAll('[data-related]').forEach(b => {
            b.addEventListener('click', () => {
                state.selectedTipId = parseInt(b.dataset.related);
                saveState();
                render();
                const scroll = body.querySelector('.tips-detail-scroll');
                if (scroll) scroll.scrollTop = 0;
            });
        });
    }

    render();
};
