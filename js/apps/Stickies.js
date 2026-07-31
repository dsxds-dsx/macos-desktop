window.renderStickies = function(body, sidebar, toolbar, windowId) {
    let notes = JSON.parse(localStorage.getItem('macos_stickies_v2') || 'null') || [
        { id: '1', content: '欢迎使用便签！\n\n这是一个黄色的便签纸，您可以在这里快速记录想法。\n\n• 支持自动保存\n• 多种颜色\n• 多个便签', color: 'yellow', updated: Date.now() }
    ];
    let currentNoteId = notes[0]?.id || null;

    const colors = [
        { id: 'yellow', name: '黄色', bg: '#fff2a8', color: '#5a4a00' },
        { id: 'pink', name: '粉色', bg: '#ffb6c1', color: '#5a1a2a' },
        { id: 'blue', name: '蓝色', bg: '#b0e0e6', color: '#0a3a4a' },
        { id: 'green', name: '绿色', bg: '#90ee90', color: '#1a4a1a' },
        { id: 'purple', name: '紫色', bg: '#dda0dd', color: '#3a1a3a' },
        { id: 'gray', name: '灰色', bg: '#d3d3d3', color: '#1d1d1f' }
    ];

    function saveNotes() {
        localStorage.setItem('macos_stickies_v2', JSON.stringify(notes));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function getCurrentNote() {
        return notes.find(n => n.id === currentNoteId);
    }

    function getColor(id) {
        return colors.find(c => c.id === id) || colors[0];
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="stickies-sidebar">
                <div class="stickies-sidebar-header">
                    <button class="stickies-add-btn" title="新建便签">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                    </button>
                </div>
                <div class="stickies-list">
                    ${notes.length === 0 ? '<div class="stickies-empty">无便签</div>' : notes.map(note => {
                        const color = getColor(note.color);
                        const preview = (note.content || '').slice(0, 50).replace(/\n/g, ' ');
                        return `
                            <div class="stickies-list-item ${currentNoteId === note.id ? 'active' : ''}" data-id="${note.id}" style="background:${color.bg};color:${color.color};">
                                <div class="stickies-list-preview">${escapeHtml(preview) || '<em>空便签</em>'}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        sidebar.querySelector('.stickies-add-btn')?.addEventListener('click', () => {
            const newNote = { id: Date.now().toString(), content: '', color: 'yellow', updated: Date.now() };
            notes.unshift(newNote);
            currentNoteId = newNote.id;
            saveNotes();
            render();
        });
        sidebar.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                currentNoteId = item.dataset.id;
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const note = getCurrentNote();
        toolbar.innerHTML = `
            <div class="stickies-toolbar">
                <button class="stickies-toolbar-btn" id="sticky-delete" title="删除" ${!note ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h8M5.5 4V2.5h3V4M5 4l.5 8h3L9 4"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <div class="stickies-color-picker">
                    ${colors.map(c => `
                        <button class="stickies-color-dot ${note?.color === c.id ? 'active' : ''}" data-color="${c.id}" style="background:${c.bg};border-color:${c.color};" title="${c.name}"></button>
                    `).join('')}
                </div>
            </div>
        `;
        toolbar.querySelector('#sticky-delete')?.addEventListener('click', async () => {
            if (!note) return;
            const ok = await window.showConfirm('确定要删除此便签吗？');
            if (ok) {
                notes = notes.filter(n => n.id !== currentNoteId);
                currentNoteId = notes[0]?.id || null;
                saveNotes();
                render();
            }
        });
        toolbar.querySelectorAll('[data-color]').forEach(btn => {
            btn.addEventListener('click', () => {
                const note = getCurrentNote();
                if (note) {
                    note.color = btn.dataset.color;
                    saveNotes();
                    render();
                }
            });
        });
    }

    function renderContent() {
        const note = getCurrentNote();
        if (!note) {
            body.innerHTML = '<div class="stickies-empty-state">选择或创建一个便签</div>';
            return;
        }
        const color = getColor(note.color);
        body.innerHTML = `
            <div class="stickies-body" style="background:${color.bg};color:${color.color};">
                <textarea class="stickies-textarea" id="stickies-content" placeholder="开始输入..." style="color:${color.color};">${escapeHtml(note.content)}</textarea>
            </div>
        `;
        const textarea = body.querySelector('#stickies-content');
        let saveTimeout;
        textarea.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                note.content = textarea.value;
                note.updated = Date.now();
                saveNotes();
                renderSidebar();
            }, 300);
        });
        setTimeout(() => textarea.focus(), 100);
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    render();
};
