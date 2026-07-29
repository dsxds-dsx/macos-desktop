window.renderNotes = function(body, sidebar, toolbar, windowId) {
    let notes = JSON.parse(localStorage.getItem('macos_notes_v2') || 'null') || [
        {
            id: '1',
            title: '欢迎使用备忘录',
            content: '欢迎使用 macOS 网页版备忘录！\n\n您可以在这里记录您的想法、待办事项和任何重要信息。\n\n功能特点：\n• 自动保存到本地存储\n• 支持多条笔记\n• 简洁易用的界面\n• 支持文件夹组织\n• 钉住重要笔记\n• 清单功能',
            folder: 'default',
            pinned: false,
            updated: Date.now()
        },
        {
            id: '2',
            title: '购物清单',
            content: '✓ 牛奶\n✓ 面包\n☐ 苹果\n☐ 鸡蛋\n☐ 咖啡',
            folder: 'shopping',
            pinned: true,
            updated: Date.now() - 86400000
        },
        {
            id: '3',
            title: '会议笔记',
            content: '2024年1月15日 团队会议\n\n议程：\n1. 项目进度回顾\n2. 下周工作安排\n3. 资源分配\n\n要点：\n• 前端进度良好\n• 后端需要加强\n• 测试覆盖率待提高',
            folder: 'work',
            pinned: false,
            updated: Date.now() - 172800000
        }
    ];
    let currentNoteId = notes[0]?.id || null;
    let currentFolder = 'all';

    const folders = [
        { id: 'all', name: '所有 [iCloud]', icon: 'notes', system: true },
        { id: 'default', name: '备忘录', icon: 'notes', system: false },
        { id: 'shopping', name: '购物', icon: 'shopping', system: false },
        { id: 'work', name: '工作', icon: 'work', system: false },
        { id: 'personal', name: '个人', icon: 'personal', system: false }
    ];

    const folderIcons = {
        notes: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"><path d="M2 3h3l1 1h6v7.5a0.5 0.5 0 0 1-0.5 0.5h-9a0.5 0.5 0 0 1-0.5-0.5V3.5a0.5 0.5 0 0 1 0.5-0.5z" fill="#ffcc00"/></svg>',
        shopping: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><path d="M2 3h2l1 7h6l1-5H4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="12" r="0.8" fill="#fff"/><circle cx="9" cy="12" r="0.8" fill="#fff"/></svg>',
        work: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><rect x="1.5" y="4" width="11" height="8" rx="1"/><path d="M5 4V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V4" stroke-linecap="round"/></svg>',
        personal: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><circle cx="7" cy="5" r="2"/><path d="M2.5 12c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke-linecap="round"/></svg>'
    };

    const folderColors = {
        notes: 'linear-gradient(135deg, #ffcc00, #ff9500)',
        shopping: 'linear-gradient(135deg, #ff9500, #ff5e3a)',
        work: 'linear-gradient(135deg, #5ac8fa, #0a84ff)',
        personal: 'linear-gradient(135deg, #af52de, #ff2d55)'
    };

    function saveNotes() {
        localStorage.setItem('macos_notes_v2', JSON.stringify(notes));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function getFilteredNotes() {
        if (currentFolder === 'all') return notes;
        return notes.filter(n => n.folder === currentFolder);
    }

    function formatNoteDate(ts) {
        const d = new Date(ts);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        const isThisYear = d.getFullYear() === now.getFullYear();
        if (isToday) {
            return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
        if (isThisYear) {
            return (d.getMonth() + 1) + '月' + d.getDate() + '日';
        }
        return d.getFullYear() + '年' + (d.getMonth() + 1) + '月';
    }

    function renderSidebar() {
        if (!sidebar) return;
        const filtered = getFilteredNotes();
        const sortedNotes = [...filtered].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.updated - a.updated;
        });

        sidebar.innerHTML = `
            <div class="notes-sidebar">
                <div class="notes-sidebar-header">
                    <span class="notes-sidebar-title">备忘录</span>
                    <button class="notes-toolbar-btn" id="new-note-btn" title="新建备忘录">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                    </button>
                </div>
                <div class="notes-folders">
                    ${folders.map(f => `
                        <div class="notes-folder-item ${currentFolder === f.id ? 'active' : ''}" data-folder="${f.id}">
                            <div class="notes-folder-icon" style="background:${folderColors[f.icon]};">${folderIcons[f.icon]}</div>
                            <span class="notes-folder-name">${f.name}</span>
                            <span class="notes-folder-count">${f.id === 'all' ? notes.length : notes.filter(n => n.folder === f.id).length}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="notes-list">
                    ${sortedNotes.length === 0 ? `
                        <div class="notes-empty">没有备忘录</div>
                    ` : sortedNotes.map(note => {
                        const preview = (note.content || '').slice(0, 40).replace(/\n/g, ' ');
                        return `
                        <div class="note-item ${currentNoteId === note.id ? 'active' : ''}" data-id="${note.id}">
                            ${note.pinned ? '<div class="note-item-pin"><svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor"><path d="M5 0l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/></svg></div>' : ''}
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
            const folder = currentFolder === 'all' ? 'default' : currentFolder;
            const newNote = {
                id: Date.now().toString(),
                title: '',
                content: '',
                folder: folder,
                pinned: false,
                updated: Date.now()
            };
            notes.unshift(newNote);
            currentNoteId = newNote.id;
            saveNotes();
            render();
        });

        sidebar.querySelectorAll('.notes-folder-item').forEach(item => {
            item.addEventListener('click', () => {
                currentFolder = item.dataset.folder;
                const filtered = getFilteredNotes();
                if (filtered.length > 0) {
                    currentNoteId = filtered[0].id;
                }
                render();
            });
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
            <div class="notes-toolbar">
                <button class="notes-toolbar-btn" id="delete-note-btn" title="删除" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h8M5.5 4V2.5h3V4M5 4l.5 8h3L9 4"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="notes-toolbar-btn ${currentNote?.pinned ? 'active' : ''}" id="pin-note-btn" title="钉住" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="11" height="11" fill="${currentNote?.pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 1.5v5L4 9h6L7 6.5"/></svg>
                </button>
                <button class="notes-toolbar-btn" id="share-note-btn" title="分享" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 1.5v6M4.5 4L7 1.5L9.5 4M2.5 8v3.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="notes-toolbar-btn" id="checklist-btn" title="插入清单" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 3.5l1 1 1.5-1.5M2.5 8.5l1 1 1.5-1.5M7 4h4.5M7 9h4.5"/></svg>
                </button>
                <button class="notes-toolbar-btn" id="folder-btn" title="移动到文件夹" ${!currentNote ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M1.5 3.5a0.5 0.5 0 0 1 0.5-0.5h3l1 1h6a0.5 0.5 0 0 1 0.5 0.5v6.5a0.5 0.5 0 0 1-0.5 0.5h-10a0.5 0.5 0 0 1-0.5-0.5z"/></svg>
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
                    const newNote = { id: Date.now().toString(), title: '', content: '', folder: 'default', pinned: false, updated: Date.now() };
                    notes.push(newNote);
                    currentNoteId = newNote.id;
                }
                saveNotes();
                render();
            });
        }

        const pinBtn = toolbar.querySelector('#pin-note-btn');
        if (pinBtn && currentNote) {
            pinBtn.addEventListener('click', () => {
                currentNote.pinned = !currentNote.pinned;
                currentNote.updated = Date.now();
                saveNotes();
                render();
            });
        }

        const checklistBtn = toolbar.querySelector('#checklist-btn');
        if (checklistBtn && currentNote) {
            checklistBtn.addEventListener('click', () => {
                currentNote.content = (currentNote.content || '') + (currentNote.content ? '\n' : '') + '☐ 新清单项';
                currentNote.updated = Date.now();
                saveNotes();
                render();
                setTimeout(() => {
                    const ta = body.querySelector('#note-content');
                    if (ta) {
                        ta.focus();
                        ta.setSelectionRange(ta.value.length, ta.value.length);
                    }
                }, 50);
            });
        }

        const folderBtn = toolbar.querySelector('#folder-btn');
        if (folderBtn && currentNote) {
            folderBtn.addEventListener('click', () => openFolderPicker(currentNote));
        }
    }

    function openFolderPicker(note) {
        const overlay = document.createElement('div');
        overlay.className = 'cal-editor-overlay';
        overlay.innerHTML = `
            <div class="cal-editor" style="width:300px;">
                <div class="cal-editor-header">
                    <div class="cal-editor-title">移动到文件夹</div>
                    <button class="cal-editor-close" id="fp-close">×</button>
                </div>
                <div class="cal-editor-body" style="padding:8px;">
                    ${folders.filter(f => !f.system).map(f => `
                        <div class="fp-item" data-folder="${f.id}">
                            <div class="notes-folder-icon" style="background:${folderColors[f.icon]};width:18px;height:18px;">${folderIcons[f.icon]}</div>
                            <span>${f.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#fp-close')?.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.remove();
        });
        overlay.querySelectorAll('[data-folder]').forEach(item => {
            item.addEventListener('click', () => {
                note.folder = item.dataset.folder;
                note.updated = Date.now();
                saveNotes();
                overlay.remove();
                render();
            });
        });
    }

    function renderContent() {
        const currentNote = notes.find(n => n.id === currentNoteId);
        if (!currentNote) {
            body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-tertiary);">选择或创建一个备忘录</div>';
            return;
        }

        body.innerHTML = `
            <div class="note-editor">
                <input type="text" class="note-title-input" id="note-title" placeholder="标题" value="${escapeHtml(currentNote.title)}">
                <div class="note-editor-meta">
                    <span>${new Date(currentNote.updated).toLocaleString('zh-CN')}</span>
                    ${currentNote.pinned ? '<span class="note-editor-badge">已钉住</span>' : ''}
                </div>
                <textarea class="note-content-input" id="note-content" placeholder="开始输入...">${escapeHtml(currentNote.content)}</textarea>
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
                renderToolbar();
            }, 300);
        }

        titleInput.addEventListener('input', autoSave);
        contentInput.addEventListener('input', autoSave);

        setTimeout(() => contentInput.focus(), 100);
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
