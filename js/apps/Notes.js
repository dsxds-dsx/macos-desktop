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
            <div class="notes-sidebar">
                <div class="notes-sidebar-header">
                    <span class="notes-sidebar-title">备忘录</span>
                    <button class="notes-toolbar-btn" id="new-note-btn" title="新建备忘录">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                    </button>
                </div>
                <div class="notes-list">
                    ${sortedNotes.length === 0 ? `
                        <div class="notes-empty">没有备忘录</div>
                    ` : sortedNotes.map(note => {
                        const preview = (note.content || '').slice(0, 40).replace(/\n/g, ' ');
                        return `
                        <div class="note-item ${currentNoteId === note.id ? 'active' : ''}" data-id="${note.id}">
                            <div class="note-item-title">${escapeHtml(note.title || '新建备忘录')}</div>
                            <div class="note-item-meta">
                                <span class="note-item-date">${formatNoteDate(note.updated)}</span>
                                <span class="note-item-preview">${escapeHtml(preview)}${note.content?.length > 40 ? '…' : ''}</span>
                            </div>
                        </div>
                    `;
                    }).join('')}
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

    function formatNoteDate(ts) {
        const d = new Date(ts);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        if (isToday) {
            return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
        return (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }

    function renderToolbar() {
        if (!toolbar) return;
        const currentNote = notes.find(n => n.id === currentNoteId);
        toolbar.innerHTML = `
            <div class="notes-toolbar">
                <button class="notes-toolbar-btn" id="delete-note-btn" title="删除" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h8M5.5 4V2.5h3V4M5 4l.5 8h3L9 4"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="notes-toolbar-btn" id="pin-note-btn" title="钉住" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 1.5v5L4 9h6L7 6.5"/></svg>
                </button>
                <button class="notes-toolbar-btn" id="share-note-btn" title="分享" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 1.5v6M4.5 4L7 1.5L9.5 4M2.5 8v3.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="notes-toolbar-btn" id="checklist-btn" title="清单" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 3.5l1 1 1.5-1.5M2.5 8.5l1 1 1.5-1.5M7 4h4.5M7 9h4.5"/></svg>
                </button>
                <div style="flex:1;"></div>
                <button class="notes-toolbar-btn" title="搜索" id="notes-search-btn">
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
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
