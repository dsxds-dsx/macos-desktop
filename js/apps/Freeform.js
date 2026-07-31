// Freeform - 无边记 (macOS Sonoma)
window.renderFreeform = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_freeform_v2';

    const ICONS = {
        board: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>`,
        allBoards: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
        star: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        recent: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        shared: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`,
        trash: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        select: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>`,
        sticky: `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h9l7-7V5c0-1.1-.9-2-2-2zm-5 14.5V14c0-.55.45-1 1-1h3.5L14 17.5z"/></svg>`,
        text: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>`,
        shape: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>`,
        circle: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>`,
        line: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 19L19 5"/></svg>`,
        pen: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
        eraser: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H7L3 16c-1-1-1-3 0-4l9-9c1-1 3-1 4 0l5 5c1 1 1 3 0 4l-7 7"/></svg>`,
        delete: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        share: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`,
        zoomIn: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>`,
        zoomOut: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35M8 11h6"/></svg>`,
        fitToScreen: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>`,
        add: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
        search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
        more: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`,
        icloud: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.5 10.5c-.4-2.6-2.7-4.5-5.3-4.5-2.4 0-4.5 1.5-5.3 3.7-2.3.3-4 2.2-4 4.5 0 2.5 2 4.5 4.5 4.5h9.5c2.5 0 4.5-2 4.5-4.5 0-2.2-1.5-4-3.4-3.7z"/></svg>`,
        back: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`
    };

    const STICKY_COLORS = [
        { name: '黄', value: '#FFD60A' },
        { name: '橙', value: '#FF9500' },
        { name: '红', value: '#FF3B30' },
        { name: '粉', value: '#FF2D55' },
        { name: '绿', value: '#34C759' },
        { name: '青', value: '#5AC8FA' },
        { name: '蓝', value: '#007AFF' },
        { name: '紫', value: '#AF52DE' }
    ];

    const SHAPE_COLORS = ['#FFD60A', '#FF9500', '#FF3B30', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55', '#5856D6', '#000000'];

    const CATEGORY_ICONS = {
        all: ICONS.allBoards,
        favorites: ICONS.star,
        recent: ICONS.recent,
        shared: ICONS.shared,
        trash: ICONS.trash
    };

    function defaultBoards() {
        return [
            { id: 1, name: '项目创意', color: '#FF9500', favorite: true, shared: false, updatedAt: Date.now() - 1000 * 60 * 30, items: [
                { type: 'sticky', x: 100, y: 80, text: '新功能想法 🚀', color: '#FFD60A', w: 170, h: 120 },
                { type: 'sticky', x: 320, y: 120, text: '用户调研结果', color: '#34C759', w: 180, h: 100 },
                { type: 'text', x: 560, y: 100, text: '2026 Q3 规划', size: 26, bold: true, color: '#1d1d1f' },
                { type: 'sticky', x: 360, y: 270, text: '下周会议讨论', color: '#5AC8FA', w: 170, h: 95 },
                { type: 'shape', x: 80, y: 280, shape: 'rect', color: '#AF52DE', w: 150, h: 110, text: 'OKR' }
            ]},
            { id: 2, name: '读书笔记', color: '#5AC8FA', favorite: false, shared: false, updatedAt: Date.now() - 1000 * 60 * 60 * 5, items: [
                { type: 'sticky', x: 100, y: 80, text: '《设计心理学》\n好的设计是可视的', color: '#FF3B30', w: 210, h: 120 },
                { type: 'text', x: 100, y: 240, text: '核心观点', size: 20, bold: true, color: '#1d1d1f' },
                { type: 'sticky', x: 100, y: 280, text: '1. 可供性\n2. 意符\n3. 映射\n4. 反馈', color: '#FFD60A', w: 210, h: 140 }
            ]},
            { id: 3, name: '旅行计划', color: '#34C759', favorite: true, shared: true, updatedAt: Date.now() - 1000 * 60 * 60 * 24, items: [
                { type: 'sticky', x: 100, y: 80, text: '东京 5 天行程', color: '#FF3B30', w: 190, h: 100 },
                { type: 'sticky', x: 330, y: 100, text: 'Day 1 抵达', color: '#007AFF', w: 150, h: 90 },
                { type: 'sticky', x: 330, y: 220, text: 'Day 2 浅草寺', color: '#FF9500', w: 150, h: 90 },
                { type: 'sticky', x: 520, y: 100, text: 'Day 3 明治神宫', color: '#34C759', w: 150, h: 90 }
            ]},
            { id: 4, name: '团队协作白板', color: '#AF52DE', favorite: false, shared: true, updatedAt: Date.now() - 1000 * 60 * 60 * 48, items: [
                { type: 'sticky', x: 100, y: 80, text: '待办事项', color: '#FFD60A', w: 160, h: 100 },
                { type: 'sticky', x: 300, y: 80, text: '进行中', color: '#5AC8FA', w: 160, h: 100 },
                { type: 'sticky', x: 500, y: 80, text: '已完成', color: '#34C759', w: 160, h: 100 },
                { type: 'shape', x: 100, y: 240, shape: 'circle', color: '#FF9500', w: 100, h: 100, text: '目标' }
            ]}
        ];
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
        boards: defaultBoards(),
        trash: [],
        activeCategory: 'all',
        searchQuery: '',
        activeBoardId: 1
    };

    // migrate old format
    if (data.boards && data.boards.length && !data.boards[0].hasOwnProperty && typeof data.boards[0].favorite === 'undefined') {
        data.boards.forEach(b => { if (b.favorite === undefined) b.favorite = false; if (b.shared === undefined) b.shared = false; if (!b.updatedAt) b.updatedAt = Date.now(); });
    }

    let tool = 'select';
    let zoom = 1;
    let dragging = null;
    let dragOffset = { x: 0, y: 0 };
    let selectedItem = null;
    let currentStickyColor = STICKY_COLORS[0].value;
    let currentShapeColor = SHAPE_COLORS[5];

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getActiveBoard() {
        return data.boards.find(b => b.id === data.activeBoardId) || data.boards[0];
    }

    function getFilteredBoards() {
        let list = data.boards;
        if (data.activeCategory === 'favorites') list = list.filter(b => b.favorite);
        else if (data.activeCategory === 'shared') list = list.filter(b => b.shared);
        else if (data.activeCategory === 'recent') list = [...list].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 10);
        else if (data.activeCategory === 'trash') list = data.trash;
        if (data.searchQuery) {
            const q = data.searchQuery.toLowerCase();
            list = list.filter(b => b.name.toLowerCase().includes(q));
        }
        return list;
    }

    function showToast(text, type = 'success') {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text, type);
    }

    function relativeTime(ts) {
        if (!ts) return '未知';
        const diff = Date.now() - ts;
        const min = Math.floor(diff / 60000);
        if (min < 1) return '刚刚';
        if (min < 60) return min + ' 分钟前';
        const hr = Math.floor(min / 60);
        if (hr < 24) return hr + ' 小时前';
        const day = Math.floor(hr / 24);
        if (day < 7) return day + ' 天前';
        return new Date(ts).toLocaleDateString('zh-CN');
    }

    function renderSidebar() {
        const counts = {
            all: data.boards.length,
            favorites: data.boards.filter(b => b.favorite).length,
            shared: data.boards.filter(b => b.shared).length,
            recent: Math.min(data.boards.length, 10),
            trash: data.trash.length
        };

        const categories = [
            { id: 'all', name: '所有看板', icon: 'all' },
            { id: 'favorites', name: '个人收藏', icon: 'favorites' },
            { id: 'recent', name: '最近使用', icon: 'recent' },
            { id: 'shared', name: '已共享', icon: 'shared' },
            { id: 'trash', name: '最近删除', icon: 'trash' }
        ];

        const filtered = getFilteredBoards();

        return `
            <div class="ff-side">
                <div class="ff-side-header">
                    <div class="ff-side-eyebrow">无边记</div>
                    <div class="ff-side-title-row">
                        <h1 class="ff-side-title">无边记</h1>
                        <button class="ff-icon-btn" id="ff-new-board" title="新建看板">${ICONS.add}</button>
                    </div>
                </div>
                <div class="ff-search">
                    ${ICONS.search}
                    <input type="text" id="ff-search-input" placeholder="搜索" value="${escapeHtml(data.searchQuery)}">
                </div>
                <div class="ff-nav">
                    ${categories.map(cat => `
                        <div class="ff-nav-item ${data.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                            ${CATEGORY_ICONS[cat.icon]}
                            <span>${escapeHtml(cat.name)}</span>
                            ${counts[cat.id] ? `<span class="ff-count">${counts[cat.id]}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="ff-board-list">
                    <div class="ff-list-title">${data.activeCategory === 'trash' ? '最近删除' : '看板'}</div>
                    ${filtered.length === 0 ? `
                        <div class="ff-empty-list">没有看板</div>
                    ` : filtered.map(b => `
                        <div class="ff-board-item ${b.id === data.activeBoardId ? 'active' : ''}" data-id="${b.id}">
                            <div class="ff-board-thumb" style="background:${b.color}">
                                ${ICONS.board}
                            </div>
                            <div class="ff-board-info">
                                <div class="ff-board-name">${escapeHtml(b.name)}</div>
                                <div class="ff-board-meta">
                                    ${b.shared ? `<span class="ff-board-shared">${ICONS.shared}</span>` : ''}
                                    <span>${relativeTime(b.updatedAt)}</span>
                                </div>
                            </div>
                            ${b.favorite ? `<div class="ff-board-fav">${ICONS.star}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderToolbar(board) {
        const tools = [
            { id: 'select', icon: 'select', label: '选择' },
            { id: 'sticky', icon: 'sticky', label: '便利贴' },
            { id: 'text', icon: 'text', label: '文本' },
            { id: 'shape', icon: 'shape', label: '形状' },
            { id: 'pen', icon: 'pen', label: '画笔' },
            { id: 'eraser', icon: 'eraser', label: '橡皮擦' }
        ];

        return `
            <div class="ff-toolbar">
                <div class="ff-toolbar-left">
                    <div class="ff-tool-group">
                        ${tools.map(t => `
                            <button class="ff-tool ${tool === t.id ? 'active' : ''}" data-tool="${t.id}" title="${t.label}">${ICONS[t.icon]}</button>
                        `).join('')}
                    </div>
                    <div class="ff-tool-sep"></div>
                    <div class="ff-color-picker" id="ff-color-picker" style="background:${tool === 'sticky' ? currentStickyColor : currentShapeColor}"></div>
                    <div class="ff-tool-sep"></div>
                    <button class="ff-tool" id="ff-delete-tool" title="删除选中" disabled>${ICONS.delete}</button>
                    <button class="ff-tool" id="ff-share-tool" title="共享">${ICONS.share}</button>
                </div>
                <div class="ff-toolbar-center">
                    <div class="ff-board-title-display">${escapeHtml(board.name)}</div>
                    ${board.shared ? `<div class="ff-shared-badge">${ICONS.shared} 已共享</div>` : ''}
                </div>
                <div class="ff-toolbar-right">
                    <div class="ff-collaborators">
                        <div class="ff-avatar" style="background:#FF9500">我</div>
                        ${board.shared ? `<div class="ff-avatar" style="background:#5AC8FA">王</div>` : ''}
                    </div>
                    <div class="ff-tool-sep"></div>
                    <button class="ff-tool ff-sm" id="ff-zoom-out" title="缩小">${ICONS.zoomOut}</button>
                    <button class="ff-zoom-label" id="ff-zoom-label" title="重置缩放">${Math.round(zoom * 100)}%</button>
                    <button class="ff-tool ff-sm" id="ff-zoom-in" title="放大">${ICONS.zoomIn}</button>
                    <button class="ff-tool ff-sm" id="ff-fit" title="适合屏幕">${ICONS.fitToScreen}</button>
                </div>
            </div>
        `;
    }

    function renderItem(item, idx) {
        const selected = selectedItem === idx ? ' selected' : '';
        if (item.type === 'sticky') {
            return `<div class="ff-sticky${selected}" data-idx="${idx}" style="left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;background:${item.color};">
                <div class="ff-sticky-fold"></div>
                <div class="ff-sticky-text">${escapeHtml(item.text).replace(/\n/g, '<br>')}</div>
            </div>`;
        }
        if (item.type === 'text') {
            return `<div class="ff-text-item${selected}" data-idx="${idx}" style="left:${item.x}px;top:${item.y}px;font-size:${item.size || 16}px;font-weight:${item.bold ? 700 : 400};color:${item.color || '#1d1d1f'};">
                ${escapeHtml(item.text)}
            </div>`;
        }
        if (item.type === 'shape') {
            const radius = item.shape === 'circle' ? '50%' : '12px';
            return `<div class="ff-shape-item${selected}" data-idx="${idx}" style="left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;background:${item.color};border-radius:${radius};">
                <span>${escapeHtml(item.text || '')}</span>
            </div>`;
        }
        return '';
    }

    function renderCanvas(board) {
        return `
            <div class="ff-canvas-wrap" id="ff-canvas-wrap">
                <div class="ff-canvas" id="ff-canvas" style="transform: scale(${zoom})">
                    <div class="ff-grid-bg"></div>
                    ${board.items.map((item, idx) => renderItem(item, idx)).join('')}
                </div>
                <div class="ff-canvas-hint">
                    <span>双击画布添加便利贴</span>
                    <span class="ff-hint-dot"></span>
                    <span>双击便利贴编辑文字</span>
                    <span class="ff-hint-dot"></span>
                    <span>拖动可移动元素</span>
                </div>
                <div class="ff-zoom-mini">
                    <button class="ff-zoom-mini-btn" id="ff-zoom-mini-out">${ICONS.zoomOut}</button>
                    <button class="ff-zoom-mini-btn" id="ff-zoom-mini-in">${ICONS.zoomIn}</button>
                </div>
            </div>
        `;
    }

    function renderColorPicker() {
        const colors = tool === 'sticky' ? STICKY_COLORS : SHAPE_COLORS.map(c => ({ value: c }));
        return `
            <div class="ff-color-popover" id="ff-color-popover">
                <div class="ff-color-popover-title">${tool === 'sticky' ? '便利贴颜色' : '形状颜色'}</div>
                <div class="ff-color-grid">
                    ${colors.map(c => `
                        <button class="ff-color-swatch ${c.name ? '' : ''} ${(tool === 'sticky' ? currentStickyColor : currentShapeColor) === c.value ? 'active' : ''}" style="background:${c.value}" data-color="${c.value}"></button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function render() {
        const board = getActiveBoard();
        sidebar.innerHTML = renderSidebar();
        toolbar.innerHTML = renderToolbar(board);
        body.innerHTML = renderCanvas(board);

        // Remove any existing popover
        document.querySelectorAll('#ff-color-popover').forEach(p => p.remove());

        bindSidebar();
        bindToolbar();
        bindCanvas();
        updateDeleteBtn();
    }

    function bindSidebar() {
        sidebar.querySelectorAll('.ff-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                data.activeCategory = item.dataset.cat;
                if (data.activeCategory === 'trash') {
                    // show trash - no active board
                } else {
                    const filtered = getFilteredBoards();
                    if (filtered.length && !filtered.find(b => b.id === data.activeBoardId)) {
                        data.activeBoardId = filtered[0].id;
                    }
                }
                save();
                render();
            });
        });

        sidebar.querySelectorAll('.ff-board-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                if (data.activeCategory === 'trash') {
                    // restore
                    const idx = data.trash.findIndex(b => b.id === id);
                    if (idx > -1) {
                        data.boards.push(data.trash[idx]);
                        data.trash.splice(idx, 1);
                        data.activeBoardId = id;
                        data.activeCategory = 'all';
                        save();
                        showToast('已恢复看板');
                        render();
                    }
                    return;
                }
                data.activeBoardId = id;
                save();
                render();
            });

            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const id = parseInt(item.dataset.id);
                showBoardContextMenu(id, e.clientX, e.clientY);
            });
        });

        const searchInput = sidebar.querySelector('#ff-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                data.searchQuery = searchInput.value;
                render();
                const newInput = sidebar.querySelector('#ff-search-input');
                if (newInput) {
                    newInput.focus();
                    newInput.setSelectionRange(data.searchQuery.length, data.searchQuery.length);
                }
            });
        }

        const newBtn = sidebar.querySelector('#ff-new-board');
        if (newBtn) {
            newBtn.addEventListener('click', createBoard);
        }
    }

    function showBoardContextMenu(id, x, y) {
        document.querySelectorAll('.ff-context-menu').forEach(m => m.remove());
        const board = data.activeCategory === 'trash' ? data.trash.find(b => b.id === id) : data.boards.find(b => b.id === id);
        if (!board) return;

        const menu = document.createElement('div');
        menu.className = 'ff-context-menu';
        menu.innerHTML = `
            ${data.activeCategory === 'trash' ? `
                <div class="ff-ctx-item" data-act="restore">恢复</div>
                <div class="ff-ctx-sep"></div>
                <div class="ff-ctx-item danger" data-act="delete-forever">永久删除</div>
            ` : `
                <div class="ff-ctx-item" data-act="rename">重命名</div>
                <div class="ff-ctx-item" data-act="duplicate">复制</div>
                <div class="ff-ctx-item" data-act="${board.favorite ? 'unfavorite' : 'favorite'}">${board.favorite ? '取消收藏' : '收藏'}</div>
                <div class="ff-ctx-item" data-act="${board.shared ? 'unshare' : 'share'}">${board.shared ? '停止共享' : '共享'}</div>
                <div class="ff-ctx-sep"></div>
                <div class="ff-ctx-item danger" data-act="delete">删除</div>
            `}
        `;
        document.body.appendChild(menu);
        const rect = menu.getBoundingClientRect();
        menu.style.left = Math.min(x, window.innerWidth - rect.width - 10) + 'px';
        menu.style.top = Math.min(y, window.innerHeight - rect.height - 10) + 'px';
        requestAnimationFrame(() => menu.classList.add('show'));

        menu.querySelectorAll('.ff-ctx-item').forEach(it => {
            it.addEventListener('click', () => {
                const act = it.dataset.act;
                handleBoardAction(id, act, board);
                menu.remove();
            });
        });

        const close = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', close);
            }
        };
        setTimeout(() => document.addEventListener('click', close), 0);
    }

    function handleBoardAction(id, act, board) {
        switch (act) {
            case 'rename':
                showPromptDialog('重命名看板', board.name, (name) => {
                    if (name) {
                        board.name = name;
                        board.updatedAt = Date.now();
                        save();
                        render();
                    }
                });
                break;
            case 'duplicate':
                const copy = JSON.parse(JSON.stringify(board));
                copy.id = Date.now();
                copy.name = board.name + ' 副本';
                copy.updatedAt = Date.now();
                data.boards.push(copy);
                data.activeBoardId = copy.id;
                save();
                showToast('已复制看板');
                render();
                break;
            case 'favorite':
            case 'unfavorite':
                board.favorite = act === 'favorite';
                save();
                render();
                break;
            case 'share':
                board.shared = true;
                board.updatedAt = Date.now();
                save();
                showToast('已共享看板');
                render();
                break;
            case 'unshare':
                board.shared = false;
                save();
                render();
                break;
            case 'delete':
                const idx = data.boards.findIndex(b => b.id === id);
                if (idx > -1) {
                    data.trash.push(data.boards[idx]);
                    data.boards.splice(idx, 1);
                    if (data.boards.length) data.activeBoardId = data.boards[0].id;
                    save();
                    showToast('已移至最近删除');
                    render();
                }
                break;
            case 'restore':
                const tidx = data.trash.findIndex(b => b.id === id);
                if (tidx > -1) {
                    data.boards.push(data.trash[tidx]);
                    data.trash.splice(tidx, 1);
                    data.activeBoardId = id;
                    data.activeCategory = 'all';
                    save();
                    showToast('已恢复看板');
                    render();
                }
                break;
            case 'delete-forever':
                const fidx = data.trash.findIndex(b => b.id === id);
                if (fidx > -1) {
                    data.trash.splice(fidx, 1);
                    save();
                    showToast('已永久删除');
                    render();
                }
                break;
        }
    }

    async function showPromptDialog(title, value, callback) {
        if (window.showMacDialog) {
            window.showMacDialog({ title, input: true, value, confirmText: '好', cancelText: '取消' }, callback);
        } else {
            const name = await window.showPrompt(title, { value, confirmText: '好', cancelText: '取消' });
            callback(name);
        }
    }

    function createBoard() {
        const newId = Date.now();
        const newBoard = {
            id: newId,
            name: `新看板 ${data.boards.length + 1}`,
            color: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)].value,
            favorite: false,
            shared: false,
            updatedAt: Date.now(),
            items: []
        };
        data.boards.push(newBoard);
        data.activeBoardId = newId;
        data.activeCategory = 'all';
        save();
        showToast('已创建新看板');
        render();
    }

    function bindToolbar() {
        toolbar.querySelectorAll('.ff-tool[data-tool]').forEach(t => {
            t.addEventListener('click', () => {
                tool = t.dataset.tool;
                selectedItem = null;
                render();
            });
        });

        const colorPicker = toolbar.querySelector('#ff-color-picker');
        if (colorPicker) {
            colorPicker.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('#ff-color-popover').forEach(p => p.remove());
                const popover = document.createElement('div');
                popover.innerHTML = renderColorPicker();
                const pop = popover.firstElementChild;
                document.body.appendChild(pop);
                const rect = colorPicker.getBoundingClientRect();
                pop.style.left = rect.left + 'px';
                pop.style.top = (rect.bottom + 6) + 'px';
                requestAnimationFrame(() => pop.classList.add('show'));

                pop.querySelectorAll('.ff-color-swatch').forEach(sw => {
                    sw.addEventListener('click', () => {
                        if (tool === 'sticky') currentStickyColor = sw.dataset.color;
                        else currentShapeColor = sw.dataset.color;
                        // apply to selected
                        if (selectedItem !== null) {
                            const board = getActiveBoard();
                            const item = board.items[selectedItem];
                            if (item) {
                                item.color = (tool === 'sticky') ? currentStickyColor : currentShapeColor;
                                board.updatedAt = Date.now();
                                save();
                            }
                        }
                        pop.remove();
                        render();
                    });
                });

                const close = (e) => {
                    if (!pop.contains(e.target) && e.target !== colorPicker) {
                        pop.remove();
                        document.removeEventListener('click', close);
                    }
                };
                setTimeout(() => document.addEventListener('click', close), 0);
            });
        }

        const delBtn = toolbar.querySelector('#ff-delete-tool');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                if (selectedItem === null) return;
                const board = getActiveBoard();
                board.items.splice(selectedItem, 1);
                selectedItem = null;
                board.updatedAt = Date.now();
                save();
                render();
            });
        }

        const shareBtn = toolbar.querySelector('#ff-share-tool');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const board = getActiveBoard();
                showToast(`已生成「${board.name}」共享链接`);
            });
        }

        const zoomIn = toolbar.querySelector('#ff-zoom-in');
        const zoomOut = toolbar.querySelector('#ff-zoom-out');
        const zoomLabel = toolbar.querySelector('#ff-zoom-label');
        const fitBtn = toolbar.querySelector('#ff-fit');

        const applyZoom = () => {
            const canvas = body.querySelector('#ff-canvas');
            if (canvas) canvas.style.transform = `scale(${zoom})`;
            if (zoomLabel) zoomLabel.textContent = Math.round(zoom * 100) + '%';
        };
        if (zoomIn) zoomIn.addEventListener('click', () => { zoom = Math.min(2, zoom + 0.1); applyZoom(); });
        if (zoomOut) zoomOut.addEventListener('click', () => { zoom = Math.max(0.4, zoom - 0.1); applyZoom(); });
        if (zoomLabel) zoomLabel.addEventListener('click', () => { zoom = 1; applyZoom(); });
        if (fitBtn) fitBtn.addEventListener('click', () => { zoom = 1; applyZoom(); });

        const miniIn = body.querySelector('#ff-zoom-mini-in');
        const miniOut = body.querySelector('#ff-zoom-mini-out');
        if (miniIn) miniIn.addEventListener('click', () => { zoom = Math.min(2, zoom + 0.1); applyZoom(); });
        if (miniOut) miniOut.addEventListener('click', () => { zoom = Math.max(0.4, zoom - 0.1); applyZoom(); });
    }

    function updateDeleteBtn() {
        const delBtn = toolbar.querySelector('#ff-delete-tool');
        if (delBtn) {
            if (selectedItem === null) delBtn.setAttribute('disabled', '');
            else delBtn.removeAttribute('disabled');
        }
    }

    function bindCanvas() {
        const canvas = body.querySelector('#ff-canvas');
        if (!canvas) return;

        canvas.addEventListener('dblclick', (e) => {
            const itemEl = e.target.closest('[data-idx]');
            if (itemEl) {
                const idx = parseInt(itemEl.dataset.idx);
                const board = getActiveBoard();
                const item = board.items[idx];
                if (item && item.type === 'sticky') {
                    editSticky(itemEl.querySelector('.ff-sticky-text'), idx);
                } else if (item && item.type === 'text') {
                    editText(itemEl, idx);
                }
                return;
            }
            if (e.target !== canvas && !e.target.classList.contains('ff-grid-bg')) return;
            // add new item based on tool
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoom - 80;
            const y = (e.clientY - rect.top) / zoom - 50;
            const board = getActiveBoard();
            if (tool === 'sticky' || tool === 'select') {
                board.items.push({
                    type: 'sticky', x: Math.round(x), y: Math.round(y), w: 170, h: 110,
                    text: '双击编辑文字', color: currentStickyColor
                });
                selectedItem = board.items.length - 1;
            } else if (tool === 'text') {
                board.items.push({
                    type: 'text', x: Math.round(x), y: Math.round(y), text: '文本', size: 20, bold: false, color: '#1d1d1f'
                });
                selectedItem = board.items.length - 1;
            } else if (tool === 'shape') {
                board.items.push({
                    type: 'shape', x: Math.round(x), y: Math.round(y), w: 120, h: 120, shape: 'rect', color: currentShapeColor, text: ''
                });
                selectedItem = board.items.length - 1;
            }
            board.updatedAt = Date.now();
            save();
            render();
        });

        body.querySelectorAll('[data-idx]').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('ff-sticky-text') && e.detail >= 2) return;
                const idx = parseInt(el.dataset.idx);
                selectedItem = idx;
                const board = getActiveBoard();
                const item = board.items[idx];
                if (!item) return;
                dragging = idx;
                dragOffset = { x: e.clientX / zoom - item.x, y: e.clientY / zoom - item.y };
                body.querySelectorAll('[data-idx]').forEach(x => x.classList.remove('selected'));
                el.classList.add('selected');
                updateDeleteBtn();
                e.preventDefault();
            });
        });

        canvas.addEventListener('click', (e) => {
            if (e.target === canvas || e.target.classList.contains('ff-grid-bg')) {
                selectedItem = null;
                body.querySelectorAll('[data-idx]').forEach(x => x.classList.remove('selected'));
                updateDeleteBtn();
            }
        });

        const onMove = (e) => {
            if (dragging === null) return;
            const board = getActiveBoard();
            const item = board.items[dragging];
            if (!item) return;
            const canvasRect = canvas.getBoundingClientRect();
            item.x = Math.round((e.clientX - canvasRect.left) / zoom - dragOffset.x);
            item.y = Math.round((e.clientY - canvasRect.top) / zoom - dragOffset.y);
            const el = body.querySelector(`[data-idx="${dragging}"]`);
            if (el) {
                el.style.left = item.x + 'px';
                el.style.top = item.y + 'px';
            }
        };
        const onUp = () => {
            if (dragging !== null) {
                const board = getActiveBoard();
                board.updatedAt = Date.now();
                save();
                dragging = null;
            }
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    function editSticky(textEl, idx) {
        if (!textEl) return;
        const board = getActiveBoard();
        const item = board.items[idx];
        if (!item) return;
        const original = item.text;
        const ta = document.createElement('textarea');
        ta.className = 'ff-sticky-edit';
        ta.value = original;
        ta.style.width = (item.w - 24) + 'px';
        ta.style.height = (item.h - 28) + 'px';
        textEl.replaceWith(ta);
        ta.focus();
        ta.select();
        let committed = false;
        const commit = () => {
            if (committed) return;
            committed = true;
            item.text = ta.value || '便利贴';
            board.updatedAt = Date.now();
            save();
            render();
        };
        ta.addEventListener('blur', commit);
        ta.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ta.value = original;
                commit();
            }
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                commit();
            }
        });
    }

    function editText(el, idx) {
        const board = getActiveBoard();
        const item = board.items[idx];
        if (!item) return;
        const original = item.text;
        const ta = document.createElement('textarea');
        ta.className = 'ff-text-edit';
        ta.value = original;
        ta.style.fontSize = (item.size || 16) + 'px';
        ta.style.fontWeight = item.bold ? 700 : 400;
        const rect = el.getBoundingClientRect();
        ta.style.width = Math.max(120, rect.width) + 'px';
        el.replaceWith(ta);
        ta.focus();
        ta.select();
        let committed = false;
        const commit = () => {
            if (committed) return;
            committed = true;
            item.text = ta.value || '文本';
            board.updatedAt = Date.now();
            save();
            render();
        };
        ta.addEventListener('blur', commit);
        ta.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { ta.value = original; commit(); }
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit();
        });
    }

    render();
};
