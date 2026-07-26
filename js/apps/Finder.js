window.renderFinder = function(body, sidebar, toolbar, windowId) {
    let currentPath = '/Documents';
    let viewMode = 'list';
    let searchQuery = '';

    const sidebarItems = [
        { id: 'favorites', label: '个人收藏', type: 'header' },
        { id: 'Applications', label: '应用程序', path: '/Applications', icon: 'folder' },
        { id: 'Desktop', label: '桌面', path: '/Desktop', icon: 'folder' },
        { id: 'Documents', label: '文稿', path: '/Documents', icon: 'folder' },
        { id: 'Downloads', label: '下载', path: '/Downloads', icon: 'folder' },
        { id: 'Pictures', label: '图片', path: '/Pictures', icon: 'folder' },
        { id: 'Music', label: '音乐', path: '/Music', icon: 'folder' },
        { id: 'Movies', label: '影片', path: '/Movies', icon: 'folder' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="finder-sidebar">
                ${sidebarItems.map(item => {
                    if (item.type === 'header') {
                        return `<div class="finder-sidebar-header">${item.label}</div>`;
                    }
                    const active = currentPath === item.path ? 'active' : '';
                    return `
                        <div class="finder-sidebar-item ${active}" data-path="${item.path}">
                            <div class="finder-sidebar-icon">${IconGenerator.generate(item.icon, { size: 18 })}</div>
                            <span>${item.label}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        sidebar.querySelectorAll('.finder-sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                currentPath = item.dataset.path;
                render();
            });

            // Drop target for folders
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                item.classList.add('drag-over');
            });
            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                try {
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    if (data && data.path && data.path !== item.dataset.path) {
                        const targetPath = item.dataset.path;
                        if (window.fileSystem.moveFile(data.path, targetPath)) {
                            render();
                        }
                    }
                } catch (err) {
                    console.error('Drop error:', err);
                }
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const pathParts = currentPath.split('/').filter(p => p);
        const pathHtml = ['<span class="finder-path-item" data-path="/">Macintosh HD</span>']
            .concat(pathParts.map((part, i) => {
                const path = '/' + pathParts.slice(0, i + 1).join('/');
                return `<span class="finder-path-sep">›</span><span class="finder-path-item" data-path="${path}">${part}</span>`;
            })).join('');

        toolbar.innerHTML = `
            <div class="finder-toolbar">
                <div class="finder-toolbar-left">
                    <button class="finder-toolbar-btn" id="finder-back" title="返回">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
                    </button>
                    <button class="finder-toolbar-btn" id="finder-forward" title="前进">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
                    </button>
                    <div class="finder-path">${pathHtml}</div>
                </div>
                <div class="finder-toolbar-right">
                    <div class="finder-view-toggle">
                        <button class="finder-view-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list" title="列表视图">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor"/></svg>
                        </button>
                        <button class="finder-view-btn ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="图标视图">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" fill="currentColor"/></svg>
                        </button>
                    </div>
                    <input type="text" class="finder-search" id="finder-search" placeholder="搜索" value="${searchQuery}">
                </div>
            </div>
        `;

        toolbar.querySelectorAll('.finder-path-item').forEach(item => {
            item.addEventListener('click', () => {
                currentPath = item.dataset.path;
                render();
            });
        });

        toolbar.querySelectorAll('.finder-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                viewMode = btn.dataset.view;
                render();
            });
        });

        const searchInput = toolbar.querySelector('#finder-search');
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderContent();
        });
    }

    function renderContent() {
        let items = window.fileSystem.list(currentPath);
        
        if (searchQuery) {
            items = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (viewMode === 'grid') {
            body.innerHTML = `
                <div class="finder-grid-view">
                    ${items.length === 0 ? '<div class="finder-empty">此文件夹为空</div>' : ''}
                    ${items.map(item => `
                        <div class="finder-grid-item" data-path="${item.path}" data-type="${item.type}">
                            <div class="finder-grid-icon">${IconGenerator.generate(item.type === 'folder' ? 'folder' : 'notes', { size: 64 })}</div>
                            <div class="finder-grid-name">${item.name}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            body.innerHTML = `
                <div class="finder-list-view">
                    <div class="finder-list-header">
                        <div class="finder-list-cell name">名称</div>
                        <div class="finder-list-cell date">修改日期</div>
                        <div class="finder-list-cell size">大小</div>
                        <div class="finder-list-cell type">类型</div>
                    </div>
                    ${items.length === 0 ? '<div class="finder-empty">此文件夹为空</div>' : ''}
                    ${items.map(item => `
                        <div class="finder-list-item" data-path="${item.path}" data-type="${item.type}">
                            <div class="finder-list-cell name">
                                <div class="finder-list-icon">${IconGenerator.generate(item.type === 'folder' ? 'folder' : 'notes', { size: 20 })}</div>
                                <span>${item.name}</span>
                            </div>
                            <div class="finder-list-cell date">${item.modified ? new Date(item.modified).toLocaleDateString('zh-CN') : '--'}</div>
                            <div class="finder-list-cell size">${item.type === 'folder' ? '--' : (item.content ? item.content.length + ' 字节' : '--')}</div>
                            <div class="finder-list-cell type">${item.type === 'folder' ? '文件夹' : '文稿'}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        body.querySelectorAll('.finder-grid-item, .finder-list-item').forEach(item => {
            // Drag support
            item.setAttribute('draggable', 'true');
            item.addEventListener('dragstart', (e) => {
                const path = item.dataset.path;
                const type = item.dataset.type;
                e.dataTransfer.setData('text/plain', JSON.stringify({ path, type, name: path.split('/').pop() }));
                e.dataTransfer.effectAllowed = 'move';
                item.style.opacity = '0.5';
            });
            item.addEventListener('dragend', () => {
                item.style.opacity = '1';
            });

            item.addEventListener('dblclick', () => {
                const path = item.dataset.path;
                const type = item.dataset.type;
                if (type === 'folder') {
                    currentPath = path;
                    render();
                } else {
                    if (window.appManager) {
                        window.appManager.openApp('textedit');
                        setTimeout(() => {
                            const texteditBody = document.querySelector('.window:not(.minimizing) .textedit-content');
                            if (texteditBody) {
                                const content = window.fileSystem.readFile(path);
                                texteditBody.value = content || '';
                            }
                        }, 300);
                    }
                }
            });
        });
    }

    function render() {
        body.className = 'window-body app-content finder-body';
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    render();
};
