// Trash - 废纸篓 (macOS Sonoma)
window.renderTrash = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'trash_items_v2';

    function defaultItems() {
        return [
            { id: 1, name: '旧报告.pdf', type: 'pdf', size: 2.4 * 1024 * 1024, deleted: Date.now() - 86400000 * 2, original: '文稿' },
            { id: 2, name: '屏幕截图 2024-01-10.png', type: 'image', size: 856 * 1024, deleted: Date.now() - 86400000 * 5, original: '桌面' },
            { id: 3, name: 'temp_folder', type: 'folder', size: 0, deleted: Date.now() - 86400000, original: '下载' },
            { id: 4, name: '旧项目备份.zip', type: 'archive', size: 156 * 1024 * 1024, deleted: Date.now() - 86400000 * 7, original: '桌面' },
            { id: 5, name: '草稿.txt', type: 'text', size: 4 * 1024, deleted: Date.now() - 3600000 * 3, original: '文稿' },
            { id: 6, name: '未使用的应用.app', type: 'app', size: 45 * 1024 * 1024, deleted: Date.now() - 86400000 * 14, original: '应用程序' },
            { id: 7, name: '旧照片.jpg', type: 'image', size: 3.2 * 1024 * 1024, deleted: Date.now() - 86400000 * 3, original: '图片' },
            { id: 8, name: '音乐片段.mp3', type: 'audio', size: 5.6 * 1024 * 1024, deleted: Date.now() - 86400000 * 1.5, original: '音乐' },
            { id: 9, name: '演示.key', type: 'app', size: 28 * 1024 * 1024, deleted: Date.now() - 86400000 * 4, original: '文稿' }
        ];
    }

    function defaultData() {
        return { selectedIds: [], viewMode: 'list', sortBy: 'date' };
    }

    function migrateOld() {
        const old = JSON.parse(localStorage.getItem('trash_items') || 'null');
        if (!Array.isArray(old) || !old.length) return null;
        return old.map(it => ({
            id: it.id,
            name: it.name || '未命名',
            type: it.type || 'file',
            size: parseSizeStr(it.size),
            deleted: it.deleted || Date.now(),
            original: it.original || ''
        }));
    }

    function parseSizeStr(s) {
        if (typeof s !== 'string') return Number(s) || 0;
        if (s === '--' || !s) return 0;
        const num = parseFloat(s);
        if (s.includes('GB')) return num * 1024 * 1024 * 1024;
        if (s.includes('MB')) return num * 1024 * 1024;
        if (s.includes('KB')) return num * 1024;
        return num || 0;
    }

    function formatSize(bytes) {
        if (!bytes) return '--';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
        return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
    }

    let trashItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || migrateOld() || defaultItems();
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY + '_state') || 'null') || defaultData();

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trashItems));
        localStorage.setItem(STORAGE_KEY + '_state', JSON.stringify(data));
    }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text, type) {
        if (window.toast) window.toast(text, type || 'info');
        else if (window.Toast) window.Toast.show(text);
    }
    function formatDate(ts) {
        const date = new Date(ts);
        const now = new Date();
        const diff = now - date;
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
        if (diff < 86400000 * 7) return Math.floor(diff / 86400000) + ' 天前';
        return date.toLocaleDateString('zh-CN');
    }

    // ----- SVG icons -----
    function fileIcon(type) {
        const map = {
            pdf: { color: '#FF3B30', label: 'PDF', svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h4"/></svg>' },
            image: { color: '#FF9500', label: 'IMG', svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
            folder: { color: '#5AC8FA', label: 'DIR', svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>' },
            archive: { color: '#AF52DE', label: 'ZIP', svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>' },
            text: { color: '#34C759', label: 'TXT', svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>' },
            app: { color: '#007AFF', label: 'APP', svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>' },
            audio: { color: '#FF2D55', label: 'AUD', svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
            video: { color: '#FF9500', label: 'VID', svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>' },
            file: { color: '#8E8E93', label: 'DOC', svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' }
        };
        return map[type] || map.file;
    }

    function getSortedItems() {
        return [...trashItems].sort((a, b) => {
            if (data.sortBy === 'name') return a.name.localeCompare(b.name, 'zh');
            if (data.sortBy === 'size') return b.size - a.size;
            return b.deleted - a.deleted;
        });
    }

    function totalSize() {
        return trashItems.reduce((sum, i) => sum + (i.size || 0), 0);
    }

    function renderToolbar() {
        if (!toolbar) return;
        const hasSelection = data.selectedIds.length > 0;
        const hasItems = trashItems.length > 0;
        toolbar.innerHTML = `
            <div class="trash-toolbar">
                <button class="trash-tb-btn" id="trash-put-back" ${!hasSelection ? 'disabled' : ''} title="放回原处">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9"/><polyline points="3 4 3 12 11 12"/></svg>
                    <span>放回原处</span>
                </button>
                <button class="trash-tb-btn danger" id="trash-delete-sel" ${!hasSelection ? 'disabled' : ''} title="删除选中">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    <span>删除选中</span>
                </button>
                <div class="trash-tb-sep"></div>
                <button class="trash-tb-btn danger-fill" id="trash-empty" ${!hasItems ? 'disabled' : ''} title="清倒废纸篓">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg>
                    <span>清倒废纸篓</span>
                </button>
                <div style="flex:1;"></div>
                <div class="trash-tb-views">
                    <button class="trash-tb-view ${data.viewMode === 'list' ? 'active' : ''}" data-view="list" title="列表视图">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>
                    </button>
                    <button class="trash-tb-view ${data.viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="图标视图">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                    </button>
                </div>
                <select class="trash-tb-sort" id="trash-sort">
                    <option value="date" ${data.sortBy === 'date' ? 'selected' : ''}>按删除日期</option>
                    <option value="name" ${data.sortBy === 'name' ? 'selected' : ''}>按名称</option>
                    <option value="size" ${data.sortBy === 'size' ? 'selected' : ''}>按大小</option>
                </select>
            </div>
        `;
        toolbar.querySelector('#trash-put-back')?.addEventListener('click', () => {
            const count = data.selectedIds.length;
            trashItems = trashItems.filter(i => !data.selectedIds.includes(i.id));
            data.selectedIds = [];
            save();
            render();
            showToast(`已将 ${count} 个项目放回原处`, 'success');
        });
        toolbar.querySelector('#trash-delete-sel')?.addEventListener('click', async () => {
            const count = data.selectedIds.length;
            const ok = await window.showConfirm(`确定要永久删除 ${count} 个项目吗？`, {
                subtitle: '此操作无法撤销。',
                confirmText: '删除',
                danger: true
            });
            if (ok) {
                trashItems = trashItems.filter(i => !data.selectedIds.includes(i.id));
                data.selectedIds = [];
                save();
                render();
                showToast(`已永久删除 ${count} 个项目`, 'success');
            }
        });
        toolbar.querySelector('#trash-empty')?.addEventListener('click', async () => {
            const count = trashItems.length;
            const ok = await window.showConfirm(`确定要清倒废纸篓吗？`, {
                subtitle: `此操作将永久删除废纸篓中的 ${count} 个项目，无法撤销。`,
                confirmText: '清倒废纸篓',
                danger: true
            });
            if (ok) {
                trashItems = [];
                data.selectedIds = [];
                save();
                render();
                showToast('废纸篓已清空', 'success');
            }
        });
        toolbar.querySelectorAll('.trash-tb-view').forEach(btn => {
            btn.addEventListener('click', () => {
                data.viewMode = btn.dataset.view;
                save();
                renderToolbar();
                renderContent();
            });
        });
        toolbar.querySelector('#trash-sort')?.addEventListener('change', (e) => {
            data.sortBy = e.target.value;
            save();
            renderContent();
        });
    }

    function renderContent() {
        body.className = 'window-body app-content trash-body';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        const items = getSortedItems();
        body.innerHTML = items.length === 0
            ? `<div class="trash-empty">
                <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                <h3 class="trash-empty-title">废纸篓是空的</h3>
                <p class="trash-empty-text">当您删除项目时，它们会暂时存放在这里</p>
            </div>`
            : `${data.viewMode === 'list' ? renderListView(items) : renderGridView(items)}
              <div class="trash-status-bar">
                  <span>${items.length} 个项目</span>
                  <span class="trash-status-sep">·</span>
                  <span>可获得约 ${formatSize(totalSize())} 空间</span>
                  ${data.selectedIds.length ? `<span class="trash-status-sep">·</span><span class="trash-status-selected">已选择 ${data.selectedIds.length} 项</span>` : ''}
              </div>`;
        body.querySelectorAll('.trash-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const id = parseInt(item.dataset.id, 10);
                if (e.metaKey || e.ctrlKey) {
                    if (data.selectedIds.includes(id)) {
                        data.selectedIds = data.selectedIds.filter(i => i !== id);
                    } else {
                        data.selectedIds.push(id);
                    }
                } else {
                    data.selectedIds = data.selectedIds.includes(id) && data.selectedIds.length === 1 ? [] : [id];
                }
                save();
                renderToolbar();
                renderContent();
            });
            item.addEventListener('dblclick', () => {
                const it = trashItems.find(t => t.id === parseInt(item.dataset.id, 10));
                if (it) showToast(`Quick Look 预览：${it.name}（演示）`, 'info');
            });
        });
    }

    function renderListView(items) {
        return `
            <div class="trash-list-wrap">
                <div class="trash-list-header">
                    <div class="trash-list-col-name">名称</div>
                    <div class="trash-list-col-size">大小</div>
                    <div class="trash-list-col-orig">原位置</div>
                    <div class="trash-list-col-date">删除日期</div>
                </div>
                <div class="trash-list-body">
                    ${items.map(item => {
                        const ic = fileIcon(item.type);
                        const sel = data.selectedIds.includes(item.id);
                        return `
                            <div class="trash-item list ${sel ? 'selected' : ''}" data-id="${item.id}">
                                <div class="trash-list-checkbox">${sel ? '<svg viewBox=\"0 0 24 24\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"white\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg>' : ''}</div>
                                <div class="trash-list-icon" style="color:${ic.color};">${ic.svg}</div>
                                <div class="trash-list-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                                <div class="trash-list-size">${formatSize(item.size)}</div>
                                <div class="trash-list-orig">${escapeHtml(item.original || '—')}</div>
                                <div class="trash-list-date">${formatDate(item.deleted)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderGridView(items) {
        return `
            <div class="trash-grid">
                ${items.map(item => {
                    const ic = fileIcon(item.type);
                    const sel = data.selectedIds.includes(item.id);
                    return `
                        <div class="trash-item grid ${sel ? 'selected' : ''}" data-id="${item.id}">
                            <div class="trash-grid-icon" style="color:${ic.color};">${ic.svg}</div>
                            <div class="trash-grid-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
                            <div class="trash-grid-size">${formatSize(item.size)}</div>
                            ${sel ? `<div class="trash-grid-check"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function render() {
        renderToolbar();
        renderContent();
    }

    render();
};
