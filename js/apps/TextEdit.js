window.renderTextEdit = function(body, sidebar, toolbar, windowId) {
    let documents = JSON.parse(localStorage.getItem('macos_textedit_docs') || 'null') || [
        { id: '1', name: '未命名.rtf', content: '欢迎使用 macOS 文本编辑\n\n您可以在这里编辑和格式化文本。\n\n功能特性：\n• 粗体、斜体、下划线\n• 多种字号\n• 文本对齐\n• 自动保存到本地存储', updated: Date.now() }
    ];
    let currentDocId = documents[0]?.id || null;
    let fontFamily = 'system';
    let fontSize = 14;
    let isBold = false;
    let isItalic = false;
    let isUnderline = false;
    let align = 'left';

    function saveDocs() {
        localStorage.setItem('macos_textedit_docs', JSON.stringify(documents));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function getCurrentDoc() {
        return documents.find(d => d.id === currentDocId);
    }

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div class="textedit-toolbar">
                <button class="textedit-toolbar-btn" id="te-new" title="新建">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                </button>
                <button class="textedit-toolbar-btn" id="te-save" title="保存">
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2.5h7l2 2v7h-9z"/><path d="M4.5 2.5v3h5v-3"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="textedit-toolbar-btn ${isBold ? 'active' : ''}" id="te-bold" title="粗体" style="font-weight:700;">B</button>
                <button class="textedit-toolbar-btn ${isItalic ? 'active' : ''}" id="te-italic" title="斜体" style="font-style:italic;font-family:Georgia,serif;">I</button>
                <button class="textedit-toolbar-btn ${isUnderline ? 'active' : ''}" id="te-underline" title="下划线" style="text-decoration:underline;">U</button>
                <div class="toolbar-sep"></div>
                <select id="te-fontsize" class="textedit-select" title="字号">
                    ${[11,12,13,14,16,18,20,24,28,32].map(s => `<option value="${s}" ${fontSize === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
                <div class="toolbar-sep"></div>
                <button class="textedit-toolbar-btn ${align === 'left' ? 'active' : ''}" id="te-align-left" title="左对齐">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M2 3h10M2 6h7M2 9h10M2 12h7"/></svg>
                </button>
                <button class="textedit-toolbar-btn ${align === 'center' ? 'active' : ''}" id="te-align-center" title="居中">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M2 3h10M3.5 6h7M2 9h10M3.5 12h7"/></svg>
                </button>
                <button class="textedit-toolbar-btn ${align === 'right' ? 'active' : ''}" id="te-align-right" title="右对齐">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M2 3h10M5 6h7M2 9h10M5 12h7"/></svg>
                </button>
                <div style="flex:1;"></div>
                <button class="textedit-toolbar-btn" title="搜索">
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                </button>
            </div>
        `;

        const newBtn = toolbar.querySelector('#te-new');
        if (newBtn) {
            newBtn.addEventListener('click', () => {
                const newDoc = { id: Date.now().toString(), name: '未命名.rtf', content: '', updated: Date.now() };
                documents.unshift(newDoc);
                currentDocId = newDoc.id;
                saveDocs();
                render();
            });
        }
        const saveBtn = toolbar.querySelector('#te-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const doc = getCurrentDoc();
                if (doc) {
                    doc.content = body.querySelector('#te-content')?.value || '';
                    doc.updated = Date.now();
                    saveDocs();
                    renderSidebar();
                }
            });
        }
        const boldBtn = toolbar.querySelector('#te-bold');
        if (boldBtn) {
            boldBtn.addEventListener('click', () => {
                isBold = !isBold;
                const ta = body.querySelector('#te-content');
                if (ta) ta.style.fontWeight = isBold ? '700' : '400';
                renderToolbar();
            });
        }
        const italicBtn = toolbar.querySelector('#te-italic');
        if (italicBtn) {
            italicBtn.addEventListener('click', () => {
                isItalic = !isItalic;
                const ta = body.querySelector('#te-content');
                if (ta) ta.style.fontStyle = isItalic ? 'italic' : 'normal';
                renderToolbar();
            });
        }
        const underlineBtn = toolbar.querySelector('#te-underline');
        if (underlineBtn) {
            underlineBtn.addEventListener('click', () => {
                isUnderline = !isUnderline;
                const ta = body.querySelector('#te-content');
                if (ta) ta.style.textDecoration = isUnderline ? 'underline' : 'none';
                renderToolbar();
            });
        }
        const fontSelect = toolbar.querySelector('#te-fontsize');
        if (fontSelect) {
            fontSelect.addEventListener('change', () => {
                fontSize = parseInt(fontSelect.value);
                const ta = body.querySelector('#te-content');
                if (ta) ta.style.fontSize = fontSize + 'px';
            });
        }
        ['left', 'center', 'right'].forEach(a => {
            const btn = toolbar.querySelector(`#te-align-${a}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    align = a;
                    const ta = body.querySelector('#te-content');
                    if (ta) ta.style.textAlign = align;
                    renderToolbar();
                });
            }
        });
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="textedit-sidebar">
                <div class="textedit-sidebar-header">
                    <span>文稿</span>
                </div>
                <div class="textedit-doc-list">
                    ${documents.map(doc => `
                        <div class="textedit-doc-item ${currentDocId === doc.id ? 'active' : ''}" data-id="${doc.id}">
                            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M3 1.5h5l3 3v8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5z"/><path d="M8 1.5v3h3"/></svg>
                            <div class="textedit-doc-info">
                                <div class="textedit-doc-name">${escapeHtml(doc.name)}</div>
                                <div class="textedit-doc-meta">${new Date(doc.updated).toLocaleDateString('zh-CN')}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sidebar.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                currentDocId = item.dataset.id;
                render();
            });
        });
    }

    function renderContent() {
        const doc = getCurrentDoc();
        if (!doc) {
            body.innerHTML = '<div class="textedit-empty">选择或创建一个文稿</div>';
            return;
        }
        body.innerHTML = `
            <div class="textedit-body">
                <div class="textedit-ruler">
                    <div class="textedit-ruler-marks"></div>
                </div>
                <textarea class="textedit-content" id="te-content" placeholder="开始输入..."
                    style="font-size:${fontSize}px;font-weight:${isBold ? '700' : '400'};font-style:${isItalic ? 'italic' : 'normal'};text-decoration:${isUnderline ? 'underline' : 'none'};text-align:${align};">${escapeHtml(doc.content)}</textarea>
            </div>
        `;

        const textarea = body.querySelector('#te-content');
        let saveTimeout;
        textarea.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                doc.content = textarea.value;
                doc.updated = Date.now();
                saveDocs();
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
