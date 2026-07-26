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

    function getActiveBoard() {
        return boards.find(b => b.id === activeBoardId) || boards[0];
    }

    function save() {
        localStorage.setItem('freeform_boards', JSON.stringify(boards));
    }

    function render() {
        const board = getActiveBoard();
        body.innerHTML = `
            <div class="freeform-container">
                <div class="freeform-sidebar">
                    <div class="freeform-sidebar-header">
                        <div class="freeform-title">无边记</div>
                        <button class="freeform-new-btn" id="ff-new">+</button>
                    </div>
                    <div class="freeform-board-list">
                        ${boards.map(b => `
                            <div class="freeform-board-item ${b.id === activeBoardId ? 'active' : ''}" data-id="${b.id}">
                                <div class="freeform-board-icon" style="background:${b.color}">📋</div>
                                <div class="freeform-board-info">
                                    <div class="freeform-board-name">${b.name}</div>
                                    <div class="freeform-board-count">${b.items.length} 个元素</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="freeform-main">
                    <div class="freeform-toolbar">
                        <div class="ff-tool ${tool === 'select' ? 'active' : ''}" data-tool="select" title="选择">↖</div>
                        <div class="ff-tool ${tool === 'sticky' ? 'active' : ''}" data-tool="sticky" title="便利贴">🟨</div>
                        <div class="ff-tool ${tool === 'text' ? 'active' : ''}" data-tool="text" title="文本">T</div>
                        <div class="ff-tool ${tool === 'shape' ? 'active' : ''}" data-tool="shape" title="形状">⬜</div>
                        <div class="ff-tool-sep"></div>
                        <div class="ff-tool" id="ff-delete" title="删除">🗑</div>
                        <div class="ff-tool ff-tool-share" title="共享">🔗</div>
                        <div class="freeform-board-title">${board.name}</div>
                    </div>
                    <div class="freeform-canvas" id="ff-canvas">
                        <div class="freeform-grid-bg"></div>
                        ${board.items.map((item, idx) => renderItem(item, idx)).join('')}
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.freeform-board-item').forEach(item => {
            item.addEventListener('click', () => {
                activeBoardId = parseInt(item.dataset.id);
                render();
            });
        });

        body.querySelectorAll('.ff-tool[data-tool]').forEach(t => {
            t.addEventListener('click', () => {
                tool = t.dataset.tool;
                render();
                setupCanvasInteractions();
            });
        });

        body.querySelector('#ff-new').addEventListener('click', () => {
            const newId = Date.now();
            const colors = ['#FF9500', '#34C759', '#007AFF', '#AF52DE', '#FF3B30', '#5AC8FA'];
            const newBoard = {
                id: newId,
                name: `新看板 ${boards.length + 1}`,
                color: colors[Math.floor(Math.random() * colors.length)],
                items: []
            };
            boards.push(newBoard);
            activeBoardId = newId;
            save();
            render();
        });

        setupCanvasInteractions();
    }

    function renderItem(item, idx) {
        if (item.type === 'sticky') {
            return `<div class="ff-sticky" data-idx="${idx}" style="left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;background:${item.color};">
                <div class="ff-sticky-text">${item.text}</div>
            </div>`;
        }
        if (item.type === 'text') {
            return `<div class="ff-text-item" data-idx="${idx}" style="left:${item.x}px;top:${item.y}px;font-size:${item.size || 16}px;font-weight:${item.bold ? 700 : 400};">
                ${item.text}
            </div>`;
        }
        if (item.type === 'shape') {
            return `<div class="ff-shape-item" data-idx="${idx}" style="left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;background:${item.color};border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;">
                ${item.text || ''}
            </div>`;
        }
        return '';
    }

    function setupCanvasInteractions() {
        const canvas = body.querySelector('#ff-canvas');
        if (!canvas) return;

        // 双击添加便利贴
        canvas.addEventListener('dblclick', (e) => {
            if (e.target !== canvas && !e.target.classList.contains('freeform-grid-bg')) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - 80;
            const y = e.clientY - rect.top - 50;
            const board = getActiveBoard();
            const colors = ['#FFD60A', '#FF9500', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF3B30'];
            board.items.push({
                type: 'sticky', x, y, w: 160, h: 100,
                text: '新便利贴',
                color: colors[Math.floor(Math.random() * colors.length)]
            });
            save();
            render();
        });

        // 拖拽
        body.querySelectorAll('[data-idx]').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                const idx = parseInt(el.dataset.idx);
                const board = getActiveBoard();
                const item = board.items[idx];
                dragging = idx;
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
            board.items[dragging].x = e.clientX - dragOffset.x;
            board.items[dragging].y = e.clientY - dragOffset.y;
            const el = body.querySelector(`[data-idx="${dragging}"]`);
            if (el) {
                el.style.left = board.items[dragging].x + 'px';
                el.style.top = board.items[dragging].y + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (dragging !== null) {
                save();
                dragging = null;
            }
        });
    }

    render();
};
