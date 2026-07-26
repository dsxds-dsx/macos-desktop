window.renderNotes = function(body, sidebar, toolbar, windowId) {
    let notes = JSON.parse(localStorage.getItem('macos_notes') || 'null') || [
        {
            id: '1',
            title: '欢迎使用备忘录',
            content: '欢迎使用 macOS 网页版备忘录！\n\n您可以在这里记录您的想法、待办事项和任何重要信息。\n\n功能特点：\n• 自动保存到本地存储\n• 支持多条笔记\n• 简洁易用的界面',
            updated: Date.now()
        }
    ];
    let currentNoteId = notes[0]?.id || null;

    function saveNotes() {
        localStorage.setItem('macos_notes', JSON.stringify(notes));
    }

    function renderSidebar() {
        if (!sidebar) return;
        const sortedNotes = [...notes].sort((a, b) => b.updated - a.updated);
        sidebar.innerHTML = `
            <div class="notes-sidebar" style="height:100%;">
                <div style="padding:12px;border-bottom:0.5px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-weight:600;font-size:14px;">备忘录</span>
                    <button class="finder-toolbar-btn" id="new-note-btn" title="新建备忘录" style="width:28px;height:28px;">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
                    </button>
                </div>
                <div class="notes-list">
                    ${sortedNotes.map(note => `
                        <div class="note-item ${currentNoteId === note.id ? 'active' : ''}" data-id="${note.id}">
                            <div class="note-item-title">${note.title || '新建备忘录'}</div>
                            <div class="note-item-preview">${new Date(note.updated).toLocaleDateString('zh-CN')} · ${(note.content || '').slice(0, 30).replace(/\n/g, ' ')}${note.content?.length > 30 ? '...' : ''}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        sidebar.querySelector('#new-note-btn').addEventListener('click', () => {
            const newNote = {
                id: Date.now().toString(),
                title: '',
                content: '',
                updated: Date.now()
            };
            notes.unshift(newNote);
            currentNoteId = newNote.id;
            saveNotes();
            render();
        });

        sidebar.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', () => {
                currentNoteId = item.dataset.id;
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const currentNote = notes.find(n => n.id === currentNoteId);
        toolbar.innerHTML = `
            <div style="height:100%;display:flex;align-items:center;padding:0 12px;gap:8px;">
                <button class="finder-toolbar-btn" id="delete-note-btn" title="删除" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                </button>
            </div>
        `;

        const deleteBtn = toolbar.querySelector('#delete-note-btn');
        if (deleteBtn && currentNote) {
            deleteBtn.addEventListener('click', () => {
                notes = notes.filter(n => n.id !== currentNoteId);
                if (notes.length > 0) {
                    currentNoteId = notes[0].id;
                } else {
                    const newNote = { id: Date.now().toString(), title: '', content: '', updated: Date.now() };
                    notes.push(newNote);
                    currentNoteId = newNote.id;
                }
                saveNotes();
                render();
            });
        }
    }

    function renderContent() {
        const currentNote = notes.find(n => n.id === currentNoteId);
        if (!currentNote) {
            body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-tertiary);">选择或创建一个备忘录</div>';
            return;
        }

        body.innerHTML = `
            <div style="display:flex;height:100%;">
                <div class="note-editor">
                    <input type="text" class="note-title-input" id="note-title" placeholder="标题" value="${escapeHtml(currentNote.title)}">
                    <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:16px;">${new Date(currentNote.updated).toLocaleString('zh-CN')}</div>
                    <textarea class="note-content-input" id="note-content" placeholder="开始输入...">${escapeHtml(currentNote.content)}</textarea>
                </div>
            </div>
        `;

        const titleInput = body.querySelector('#note-title');
        const contentInput = body.querySelector('#note-content');

        let saveTimeout;
        function autoSave() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                currentNote.title = titleInput.value;
                currentNote.content = contentInput.value;
                currentNote.updated = Date.now();
                saveNotes();
                renderSidebar();
            }, 300);
        }

        titleInput.addEventListener('input', autoSave);
        contentInput.addEventListener('input', autoSave);

        setTimeout(() => contentInput.focus(), 100);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
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
