// Freeform - 无边记
window.renderFreeform = function(body, sidebar, toolbar, windowId) {
    let boards = JSON.parse(localStorage.getItem('freeform_boards') || JSON.stringify([
        { id: 1, name: '项目创意', color: '#FF9500', items: [
            { type: 'sticky', x: 100, y: 80, text: '新功能想法 🚀', color: '#FFD60A', w: 160, h: 120 },
            { type: 'sticky', x: 300, y: 120, text: '用户调研结果', color: '#34C759', w: 180, h: 100 },
            { type: 'text', x: 550, y: 100, text: '2026 Q3 规划', size: 24, bold: true },
            { type: 'sticky', x: 350, y: 260, text: '下周会议讨论', color: '#5AC8FA', w: 160, h: 90 },
            { type: 'shape', x: 80, y: 280, shape: 'rect', color: '#AF52DE', w: 140, h: 100, text: 'OKR' },
        ]},
        { id: 2, name: '读书笔记', color: '#5AC8FA', items: [
            { type: 'sticky', x: 100, y: 80, text: '《设计心理学》\n好的设计是可视的', color: '#FF3B30', w: 200, h: 120 },
            { type: 'text', x: 100, y: 240, text: '核心观点', size: 18, bold: true },
            { type: 'sticky', x: 100, y: 280, text: '1. 可供性\n2. 意符\n3. 映射\n4. 反馈', color: '#FFD60A', w: 200, h: 140 },
        ]},
        { id: 3, name: '旅行计划', color: '#34C759', items: [
            { type: 'sticky', x: 100, y: 80, text: '东京 5 天行程', color: '#FF3B30', w: 180, h: 100 },
            { type: 'sticky', x: 320, y: 100, text: '✈️ Day 1 抵达', color: '#007AFF', w: 140, h: 90 },
            { type: 'sticky', x: 320, y: 220, text: '🗼 Day 2 浅草寺', color: '#FF9500', w: 140, h: 90 },
            { type: 'sticky', x: 500, y: 100, text: '⛩️ Day 3 明治神宫', color: '#34C759', w: 140, h: 90 },
        ]},
    ]));

    let activeBoardId = boards[0].id;
    let tool = 'select';
    let dragging = null;
    let dragOffset = { x: 0, y: 0 };
    let selectedItem = null;

    const STICKY_COLORS = ['#FFD60A', '#FF9500', '#FF3B30', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55'];

    function getActiveBoard() {
        return boards.find(b => b.id === activeBoardId) || boards[0];
    }

    function save() {
        localStorage.setItem('freeform_boards', JSON.stringify(boards));
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    const ICONS = {
        select: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>`,
        sticky: `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h9l7-7V5c0-1.1-.9-2-2-2zm-5 14.5V14c0-.55.45-1 1-1h3.5L14 17.5z"/></svg>`,
        text: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>`,
        shape: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>`,
        delete: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        share: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`,
        zoomIn: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>`,
        zoomOut: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35M8 11h6"/></svg>`,
        board: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>`
    };

    function render() {
        const board = getActiveBoard();
        body.innerHTML = `
            <div class="freeform-container">
                <div class="freeform-sidebar">
                    <div class="freeform-sidebar-header">
                        <div class="freeform-title">无边记</div>
                        <button class="freeform-new-btn" id="ff-new" title="新建看板">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                    </div>
                    <div class="freeform-sidebar-subtitle">看板</div>
                    <div class="freeform-board-list">
                        ${boards.map(b => `
                            <div class="freeform-board-item ${b.id === activeBoardId ? 'active' : ''}" data-id="${b.id}">
                                <div class="freeform-board-icon" style="background:${b.color}">${ICONS.board}</div>
                                <div class="freeform-board-info">
                                    <div class="freeform-board-name">${escapeHtml(b.name)}</div>
                                    <div class="freeform-board-count">${b.items.length} 个元素</div>
                                </div>
                                <button class="freeform-board-del" data-del="${b.id}" title="删除">
                                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="freeform-main">
                    <div class="freeform-toolbar">
                        <div class="ff-tool-group">
                            <div class="ff-tool ${tool === 'select' ? 'active' : ''}" data-tool="select" title="选择">${ICONS.select}</div>
                            <div class="ff-tool ${tool === 'sticky' ? 'active' : ''}" data-tool="sticky" title="便利贴">${ICONS.sticky}</div>
                            <div class="ff-tool ${tool === 'text' ? 'active' : ''}" data-tool="text" title="文本框">${ICONS.text}</div>
                            <div class="ff-tool ${tool === 'shape' ? 'active' : ''}" data-tool="shape" title="形状">${ICONS.shape}</div>
                        </div>
                        <div class="ff-tool-sep"></div>
                        <div class="ff-tool" id="ff-delete" title="删除选中">${ICONS.delete}</div>
                        <div class="ff-tool" id="ff-share" title="共享">${ICONS.share}</div>
                        <div class="freeform-board-title">${escapeHtml(board.name)}</div>
                        <div class="ff-tool-right">
                            <div class="ff-tool ff-sm" id="ff-zoom-out" title="缩小">${ICONS.zoomOut}</div>
                            <span class="ff-zoom-label" id="ff-zoom-label">100%</span>
                            <div class="ff-tool ff-sm" id="ff-zoom-in" title="放大">${ICONS.zoomIn}</div>
                        </div>
                    </div>
                    <div class="freeform-canvas-wrap">
                        <div class="freeform-canvas" id="ff-canvas">
                            <div class="freeform-grid-bg"></div>
                            ${board.items.map((item, idx) => renderItem(item, idx)).join('')}
                        </div>
                        <div class="freeform-hint">双击画布添加便利贴 · 双击便利贴编辑文字 · 拖动可移动</div>
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.freeform-board-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('[data-del]')) return;
                activeBoardId = parseInt(item.dataset.id);
                selectedItem = null;
                render();
            });
        });

        body.querySelectorAll('[data-del]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.del);
                if (boards.length <= 1) {
                    if (window.toast) window.toast('至少保留一个看板', 'info');
                    return;
                }
                boards = boards.filter(b => b.id !== id);
                if (activeBoardId === id) activeBoardId = boards[0].id;
                save();
                render();
            });
        });

        body.querySelectorAll('.ff-tool[data-tool]').forEach(t => {
            t.addEventListener('click', () => {
                tool = t.dataset.tool;
                selectedItem = null;
                render();
                setupCanvasInteractions();
            });
        });

        body.querySelector('#ff-new').addEventListener('click', () => {
            const newId = Date.now();
            const newBoard = {
                id: newId,
                name: `新看板 ${boards.length + 1}`,
                color: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)],
                items: []
            };
            boards.push(newBoard);
            activeBoardId = newId;
            save();
            render();
        });

        body.querySelector('#ff-delete').addEventListener('click', () => {
            if (selectedItem === null) {
                if (window.toast) window.toast('请先选择一个元素', 'info');
                return;
            }
            const board = getActiveBoard();
            board.items.splice(selectedItem, 1);
            selectedItem = null;
            save();
            render();
        });

        body.querySelector('#ff-share').addEventListener('click', () => {
            if (window.toast) window.toast(`已生成「${getActiveBoard().name}」共享链接`, 'success');
        });

        // Zoom controls
        let zoom = 1;
        const canvas = body.querySelector('#ff-canvas');
        const zoomLabel = body.querySelector('#ff-zoom-label');
        body.querySelector('#ff-zoom-in').addEventListener('click', () => {
            zoom = Math.min(2, zoom + 0.1);
            applyZoom();
        });
        body.querySelector('#ff-zoom-out').addEventListener('click', () => {
            zoom = Math.max(0.5, zoom - 0.1);
            applyZoom();
        });
        function applyZoom() {
            if (canvas) canvas.style.transform = `scale(${zoom})`;
            if (zoomLabel) zoomLabel.textContent = Math.round(zoom * 100) + '%';
        }

        setupCanvasInteractions();
    }

    function renderItem(item, idx) {
        const selected = selectedItem === idx ? ' selected' : '';
        if (item.type === 'sticky') {
            return `<div class="ff-sticky${selected}" data-idx="${idx}" style="left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;background:${item.color};">
                <div class="ff-sticky-text">${escapeHtml(item.text).replace(/\n/g, '<br>')}</div>
                <div class="ff-sticky-handle" data-handle="${idx}"></div>
            </div>`;
        }
        if (item.type === 'text') {
            return `<div class="ff-text-item${selected}" data-idx="${idx}" style="left:${item.x}px;top:${item.y}px;font-size:${item.size || 16}px;font-weight:${item.bold ? 700 : 400};">
                ${escapeHtml(item.text)}
            </div>`;
        }
        if (item.type === 'shape') {
            return `<div class="ff-shape-item${selected}" data-idx="${idx}" style="left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;background:${item.color};border-radius:8px;">
                <span>${escapeHtml(item.text || '')}</span>
            </div>`;
        }
        return '';
    }

    function setupCanvasInteractions() {
        const canvas = body.querySelector('#ff-canvas');
        if (!canvas) return;

        // 双击画布添加便利贴
        canvas.addEventListener('dblclick', (e) => {
            if (e.target !== canvas && !e.target.classList.contains('freeform-grid-bg') && !e.target.classList.contains('ff-sticky-text')) {
                // double-click on sticky text = edit
                if (e.target.classList.contains('ff-sticky-text')) {
                    editSticky(e.target);
                    return;
                }
                if (e.target.closest('[data-idx]')) return;
            }
            if (e.target !== canvas && !e.target.classList.contains('freeform-grid-bg')) {
                if (e.target.closest('[data-idx]')) {
                    // double click on item - select it
                    const el = e.target.closest('[data-idx]');
                    selectedItem = parseInt(el.dataset.idx);
                    render();
                    return;
                }
                return;
            }
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - 80;
            const y = e.clientY - rect.top - 50;
            const board = getActiveBoard();
            const color = STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
            board.items.push({
                type: 'sticky', x, y, w: 160, h: 100,
                text: '双击编辑文字',
                color: color
            });
            selectedItem = board.items.length - 1;
            save();
            render();
        });

        // 点击元素选中
        body.querySelectorAll('[data-idx]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedItem = parseInt(el.dataset.idx);
                // re-render to show selection
                body.querySelectorAll('[data-idx]').forEach(x => x.classList.remove('selected'));
                el.classList.add('selected');
            });

            // double click sticky to edit
            const textEl = el.querySelector('.ff-sticky-text');
            if (textEl) {
                textEl.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    editSticky(textEl);
                });
            }
        });

        // 点击画布空白取消选中
        canvas.addEventListener('click', (e) => {
            if (e.target === canvas || e.target.classList.contains('freeform-grid-bg')) {
                selectedItem = null;
                body.querySelectorAll('[data-idx]').forEach(x => x.classList.remove('selected'));
            }
        });

        // 拖拽
        body.querySelectorAll('[data-idx]').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('ff-sticky-text') && e.detail >= 2) return;
                const idx = parseInt(el.dataset.idx);
                const board = getActiveBoard();
                const item = board.items[idx];
                if (!item) return;
                dragging = idx;
                selectedItem = idx;
                dragOffset = {
                    x: e.clientX - item.x,
                    y: e.clientY - item.y
                };
                e.preventDefault();
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (dragging === null) return;
            const board = getActiveBoard();
            const item = board.items[dragging];
            if (!item) return;
            item.x = Math.round(e.clientX - dragOffset.x);
            item.y = Math.round(e.clientY - dragOffset.y);
            const el = body.querySelector(`[data-idx="${dragging}"]`);
            if (el) {
                el.style.left = item.x + 'px';
                el.style.top = item.y + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (dragging !== null) {
                save();
                dragging = null;
            }
        });
    }

    function editSticky(textEl) {
        const stickyEl = textEl.closest('[data-idx]');
        if (!stickyEl) return;
        const idx = parseInt(stickyEl.dataset.idx);
        const board = getActiveBoard();
        const item = board.items[idx];
        if (!item) return;
        const original = item.text;
        const ta = document.createElement('textarea');
        ta.className = 'ff-sticky-edit';
        ta.value = original;
        ta.style.width = item.w - 24 + 'px';
        ta.style.height = item.h - 24 + 'px';
        textEl.replaceWith(ta);
        ta.focus();
        ta.select();
        const commit = () => {
            item.text = ta.value || '便利贴';
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

    render();
};
