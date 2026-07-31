// Pages - 文稿 (macOS Sonoma)
window.renderPages = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_pages_v2';
    const STATE_KEY = STORAGE_KEY + '_state';

    function defaultDocs() {
        return [
            { id: 1, title: '项目计划书', content: '<h1>2024年度项目计划书</h1><h2>一、项目概述</h2><p>本项目旨在开发一款创新的桌面应用，提供卓越的用户体验。</p><h2>二、目标</h2><ul><li>提升用户满意度至95%</li><li>完成核心功能开发</li><li>实现跨平台支持</li></ul><p>请团队成员按照计划推进各项工作。</p>', modified: Date.now() - 86400000 },
            { id: 2, title: '会议纪要', content: '<h1>产品评审会议纪要</h1><p><strong>时间：</strong>2024年1月15日</p><p><strong>参会人员：</strong>产品、设计、开发团队</p><h2>讨论要点</h2><ol><li>新版本功能优先级确定</li><li>UI设计方案评审通过</li><li>发布时间定为下月初</li></ol>', modified: Date.now() - 172800000 },
            { id: 3, title: '个人简历', content: '<h1 style="text-align:center;">个人简历</h1><p style="text-align:center;">邮箱：example@email.com | 电话：138-0000-0000</p><h2>教育背景</h2><p>2018-2022 某大学 计算机科学与技术</p><h2>工作经验</h2><p>2022至今 某科技公司 前端开发工程师</p>', modified: Date.now() - 259200000 }
        ];
    }

    function defaultState() {
        return { currentDocId: 1, nextId: 4 };
    }

    function migrateOld() {
        const oldDocs = JSON.parse(localStorage.getItem('pages_docs') || 'null');
        const oldCurrent = parseInt(localStorage.getItem('pages_current') || '1', 10);
        if (!Array.isArray(oldDocs) || !oldDocs.length) return null;
        const maxId = Math.max(...oldDocs.map(d => parseInt(d.id, 10) || 0));
        return { docs: oldDocs, state: { currentDocId: oldCurrent, nextId: maxId + 1 } };
    }

    let docs, state;
    const migrated = migrateOld();
    docs = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || (migrated ? migrated.docs : null) || defaultDocs();
    state = JSON.parse(localStorage.getItem(STATE_KEY) || 'null') || (migrated ? migrated.state : null) || defaultState();
    if (!docs.find(d => d.id === state.currentDocId)) state.currentDocId = docs[0].id;

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    }
    function showToast(text, type) {
        if (window.toast) window.toast(text, type || 'info');
        else if (window.Toast) window.Toast.show(text);
    }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getCurrentDoc() {
        return docs.find(d => d.id === state.currentDocId) || docs[0];
    }

    // ----- SVG icons -----
    const ICON = {
        add: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
        delete: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        duplicate: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
        document: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>',
        bold: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/></svg>',
        italic: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>',
        underline: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>',
        alignLeft: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
        alignCenter: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>',
        alignRight: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>',
        ul: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
        ol: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4M4 10h2M6 16H4v-1h2v1z"/></svg>'
    };

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div class="pg-toolbar">
                <select class="pg-font-select" id="pg-fontFamily" title="字体">
                    <option value="-apple-system">系统</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times</option>
                    <option value="Georgia">Georgia</option>
                </select>
                <select class="pg-size-select" id="pg-fontSize" title="字号">
                    <option value="12">12</option>
                    <option value="14" selected>14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="24">24</option>
                    <option value="32">32</option>
                    <option value="48">48</option>
                </select>
                <div class="pg-tb-sep"></div>
                <button class="pg-format-btn" data-cmd="bold" title="粗体">${ICON.bold}</button>
                <button class="pg-format-btn" data-cmd="italic" title="斜体">${ICON.italic}</button>
                <button class="pg-format-btn" data-cmd="underline" title="下划线">${ICON.underline}</button>
                <div class="pg-tb-sep"></div>
                <button class="pg-align-btn" data-align="Left" title="左对齐">${ICON.alignLeft}</button>
                <button class="pg-align-btn" data-align="Center" title="居中">${ICON.alignCenter}</button>
                <button class="pg-align-btn" data-align="Right" title="右对齐">${ICON.alignRight}</button>
                <div class="pg-tb-sep"></div>
                <button class="pg-list-btn" data-list="ul" title="项目符号">${ICON.ul}</button>
                <button class="pg-list-btn" data-list="ol" title="编号">${ICON.ol}</button>
                <div style="flex:1;"></div>
                <span class="pg-word-count" id="pg-wordCount"></span>
            </div>
        `;
        toolbar.querySelectorAll('.pg-format-btn').forEach(btn => {
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                document.execCommand(btn.dataset.cmd, false, null);
                const editor = body.querySelector('#pg-editor');
                editor && editor.focus();
                btn.classList.toggle('active');
            });
        });
        toolbar.querySelectorAll('.pg-align-btn').forEach(btn => {
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                document.execCommand('justify' + btn.dataset.align, false, null);
                const editor = body.querySelector('#pg-editor');
                editor && editor.focus();
                toolbar.querySelectorAll('.pg-align-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        toolbar.querySelectorAll('.pg-list-btn').forEach(btn => {
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                document.execCommand(btn.dataset.list === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null);
                const editor = body.querySelector('#pg-editor');
                editor && editor.focus();
            });
        });
        toolbar.querySelector('#pg-fontSize')?.addEventListener('change', (e) => {
            document.execCommand('fontSize', false, '7');
            const editor = body.querySelector('#pg-editor');
            if (editor) {
                const fontElements = editor.getElementsByTagName('font');
                for (let i = 0; i < fontElements.length; i++) {
                    if (fontElements[i].size === '7') {
                        fontElements[i].removeAttribute('size');
                        fontElements[i].style.fontSize = e.target.value + 'px';
                    }
                }
            }
        });
        toolbar.querySelector('#pg-fontFamily')?.addEventListener('change', (e) => {
            document.execCommand('fontName', false, e.target.value);
            const editor = body.querySelector('#pg-editor');
            editor && editor.focus();
        });
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="pg-sidebar">
                <div class="pg-sidebar-head">
                    <span class="pg-sidebar-title">文稿</span>
                    <div class="pg-sidebar-actions">
                        <span class="pg-sidebar-count">${docs.length}</span>
                        <button class="pg-add-btn" id="pg-addDoc" title="新建文稿">${ICON.add}</button>
                    </div>
                </div>
                <div class="pg-docs-list" id="pg-docList">
                    ${docs.map(d => `
                        <div class="pg-doc-item ${d.id === state.currentDocId ? 'active' : ''}" data-id="${d.id}">
                            ${ICON.document}
                            <div class="pg-doc-info">
                                <div class="pg-doc-title">${escapeHtml(d.title)}</div>
                                <div class="pg-doc-date">${new Date(d.modified).toLocaleDateString('zh-CN')}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sidebar.querySelector('#pg-docList')?.addEventListener('click', (e) => {
            const item = e.target.closest('[data-id]');
            if (!item) return;
            const editor = body.querySelector('#pg-editor');
            if (editor) {
                const currentDoc = getCurrentDoc();
                currentDoc.content = editor.innerHTML;
                currentDoc.modified = Date.now();
            }
            state.currentDocId = parseInt(item.dataset.id, 10);
            save();
            renderSidebar();
            renderContent();
        });
        sidebar.querySelector('#pg-addDoc')?.addEventListener('click', async () => {
            const title = await window.showPrompt('文稿名称：', { value: '未命名文稿' });
            if (title) {
                const editor = body.querySelector('#pg-editor');
                if (editor) {
                    const currentDoc = getCurrentDoc();
                    currentDoc.content = editor.innerHTML;
                    currentDoc.modified = Date.now();
                }
                const newDoc = { id: state.nextId++, title, content: '<p>开始输入内容...</p>', modified: Date.now() };
                docs.unshift(newDoc);
                state.currentDocId = newDoc.id;
                save();
                render();
                showToast('已创建文稿：' + title, 'success');
            }
        });
    }

    function renderContent() {
        const doc = getCurrentDoc();
        body.innerHTML = `
            <div class="pg-body">
                <div class="pg-canvas">
                    <div id="pg-editor" class="pg-editor" contenteditable="true">${doc.content}</div>
                </div>
            </div>
        `;
        const editor = body.querySelector('#pg-editor');
        let saveTimeout;
        editor.addEventListener('input', () => {
            doc.content = editor.innerHTML;
            doc.modified = Date.now();
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                save();
                renderSidebar();
            }, 400);
            updateWordCount();
        });
        setTimeout(() => editor.focus(), 100);
        updateWordCount();
    }

    function updateWordCount() {
        const editor = body.querySelector('#pg-editor');
        const wcEl = toolbar?.querySelector('#pg-wordCount');
        if (editor && wcEl) {
            const text = editor.innerText || '';
            const chars = text.replace(/\s/g, '').length;
            wcEl.textContent = chars + ' 字';
        }
    }

    function render() {
        body.className = 'window-body app-content pg-app';
        body.style.display = 'flex';
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    render();
};
