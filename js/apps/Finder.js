window.renderFinder = function(body, sidebar, toolbar, windowId) {
    let currentPath = '/Documents';
    let viewMode = 'list';
    let searchQuery = '';
    let selectedPath = null;
    let history = ['/Documents'];
    let historyIndex = 0;

    function formatFileSize(bytes) {
        if (!bytes) return '--';
        if (bytes < 1024) return bytes + ' 字节';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }
    function fileIconFor(item) {
        if (item.type === 'folder') return 'folder';
        const name = (item.name || '').toLowerCase();
        if (/\.(png|jpe?g|gif|svg|heic)$/.test(name)) return 'pictures';
        if (/\.(mp4|mov|m4v)$/.test(name)) return 'movies';
        if (/\.(mp3|m4a|wav|aac)$/.test(name)) return 'music';
        if (/\.(pdf)$/.test(name)) return 'documents';
        return 'notes';
    }

    const sf = {
        // SF Symbol-style strokes
        applications: `<svg viewBox="0 0 16 16" width="14" height="14"><rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="none" stroke="#5ac8fa" stroke-width="1.1"/><circle cx="6" cy="6" r="1.4" fill="#5ac8fa"/><circle cx="10" cy="6" r="1.4" fill="#ff9500"/><circle cx="6" cy="10" r="1.4" fill="#ff3b30"/><circle cx="10" cy="10" r="1.4" fill="#34c759"/></svg>`,
        desktop: `<svg viewBox="0 0 16 16" width="14" height="14"><rect x="1.5" y="2.5" width="13" height="9" rx="1.2" fill="none" stroke="#5ac8fa" stroke-width="1.1"/><rect x="0.5" y="12" width="15" height="2" rx="0.6" fill="#5ac8fa" opacity="0.85"/></svg>`,
        documents: `<svg viewBox="0 0 16 16" width="14" height="14"><path d="M2.5 3.5h4l1 1.2h6v8.3a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1z" fill="none" stroke="#3a82f7" stroke-width="1.1" stroke-linejoin="round"/></svg>`,
        downloads: `<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 1.5v8M4.5 6L8 9.5L11.5 6" fill="none" stroke="#3a82f7" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="2.5" y="11" width="11" height="3" rx="1" fill="#3a82f7" opacity="0.85"/></svg>`,
        pictures: `<svg viewBox="0 0 16 16" width="14" height="14"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="#ff3b30" stroke-width="1.1"/><circle cx="5.5" cy="6" r="1.2" fill="#ff3b30"/><path d="M2 11l3.5-3.5L8 9.5l3-3 3 3.5v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" fill="#ff3b30" opacity="0.55"/></svg>`,
        music: `<svg viewBox="0 0 16 16" width="14" height="14"><path d="M6 3.5l6-1v8.5a2 2 0 1 1-1.3-1.87V5.2L7.3 5.9v6.1a2 2 0 1 1-1.3-1.87z" fill="#ff2d55"/></svg>`,
        movies: `<svg viewBox="0 0 16 16" width="14" height="14"><rect x="1.5" y="3" width="13" height="10" rx="1.5" fill="none" stroke="#ff2d55" stroke-width="1.1"/><path d="M6.5 6.2v3.6l3-1.8z" fill="#ff2d55"/></svg>`,
        iCloud: `<svg viewBox="0 0 16 16" width="14" height="14"><path d="M4.6 12.2a3 3 0 0 1 0-6c.3-1.7 1.7-3 3.4-3a3.5 3.5 0 0 1 3.5 3.5c1.6 0 3 1.3 3 3a3 3 0 0 1-3 3z" fill="none" stroke="#3a82f7" stroke-width="1.1" stroke-linejoin="round"/></svg>`,
        cloud: `<svg viewBox="0 0 16 16" width="14" height="14"><path d="M4.6 11.5a2.6 2.6 0 0 1 0-5.2c.3-1.5 1.5-2.6 3-2.6a3 3 0 0 1 3 3c1.4 0 2.6 1.1 2.6 2.6a2.6 2.6 0 0 1-2.6 2.6z" fill="none" stroke="#8e8e93" stroke-width="1.1" stroke-linejoin="round"/></svg>`,
        tagRed: `<svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="8" r="5" fill="#ff3b30"/></svg>`,
        tagOrange: `<svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="8" r="5" fill="#ff9500"/></svg>`,
        tagGreen: `<svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="8" r="5" fill="#34c759"/></svg>`,
        tagBlue: `<svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="8" r="5" fill="#0a84ff"/></svg>`
    };

    const sidebarSections = [
        { header: '个人收藏', items: [
            { id: 'Applications', label: '应用程序', path: '/Applications', icon: sf.applications },
            { id: 'Desktop', label: '桌面', path: '/Desktop', icon: sf.desktop },
            { id: 'Documents', label: '文稿', path: '/Documents', icon: sf.documents },
            { id: 'Downloads', label: '下载', path: '/Downloads', icon: sf.downloads }
        ]},
        { header: 'iCloud', items: [
            { id: 'iCloud', label: 'iCloud Drive', path: '/iCloud', icon: sf.iCloud }
        ]},
        { header: '位置', items: [
            { id: 'MacintoshHD', label: 'Macintosh HD', path: '/', icon: sf.cloud }
        ]},
        { header: '标签', items: [
            { id: 'tag-red', label: '红色', path: '__tag_red', icon: sf.tagRed, isTag: true },
            { id: 'tag-orange', label: '橙色', path: '__tag_orange', icon: sf.tagOrange, isTag: true },
            { id: 'tag-green', label: '绿色', path: '__tag_green', icon: sf.tagGreen, isTag: true },
            { id: 'tag-blue', label: '蓝色', path: '__tag_blue', icon: sf.tagBlue, isTag: true }
        ]}
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="finder-sidebar">
                ${sidebarSections.map(section => `
                    <div class="finder-sidebar-section">
                        <div class="finder-sidebar-header">${section.header}</div>
                        ${section.items.map(item => {
                            const active = currentPath === item.path ? 'active' : '';
                            return `
                                <div class="finder-sidebar-item ${active}" data-path="${item.path}" ${item.isTag ? 'data-is-tag="1"' : ''}>
                                    <div class="finder-sidebar-icon">${item.icon}</div>
                                    <span class="finder-sidebar-label">${item.label}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `).join('')}
            </div>
        `;

        sidebar.querySelectorAll('.finder-sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                if (item.dataset.isTag) return;
                const newPath = item.dataset.path;
                if (newPath !== currentPath) {
                    history = history.slice(0, historyIndex + 1);
                    history.push(newPath);
                    historyIndex = history.length - 1;
                }
                currentPath = newPath;
                render();
            });

            // Drop target for folders
            item.addEventListener('dragover', (e) => {
                if (item.dataset.isTag) return;
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

        const canBack = historyIndex > 0;
        const canFwd = historyIndex < history.length - 1;

        toolbar.innerHTML = `
            <div class="finder-toolbar">
                <div class="finder-toolbar-left">
                    <button class="finder-toolbar-btn" id="finder-back" ${canBack ? '' : 'disabled'} title="返回">
                        <svg viewBox="0 0 14 14" width="13" height="13"><path d="M9 2L4 7l5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button class="finder-toolbar-btn" id="finder-forward" ${canFwd ? '' : 'disabled'} title="前进">
                        <svg viewBox="0 0 14 14" width="13" height="13"><path d="M5 2L10 7l-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
                <div class="finder-toolbar-center">
                    <div class="finder-path">${pathHtml}</div>
                </div>
                <div class="finder-toolbar-right">
                    <div class="finder-view-toggle">
                        <button class="finder-view-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list" title="列表视图">
                            <svg viewBox="0 0 14 14" width="13" height="13" fill="currentColor"><rect x="2" y="2.5" width="10" height="1.4" rx="0.7"/><rect x="2" y="6.3" width="10" height="1.4" rx="0.7"/><rect x="2" y="10.1" width="10" height="1.4" rx="0.7"/></svg>
                        </button>
                        <button class="finder-view-btn ${viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="图标视图">
                            <svg viewBox="0 0 14 14" width="13" height="13" fill="currentColor"><rect x="2" y="2" width="4" height="4" rx="0.8"/><rect x="8" y="2" width="4" height="4" rx="0.8"/><rect x="2" y="8" width="4" height="4" rx="0.8"/><rect x="8" y="8" width="4" height="4" rx="0.8"/></svg>
                        </button>
                        <button class="finder-view-btn ${viewMode === 'columns' ? 'active' : ''}" data-view="columns" title="分栏视图">
                            <svg viewBox="0 0 14 14" width="13" height="13" fill="currentColor"><rect x="2" y="2" width="3" height="10" rx="0.8"/><rect x="5.5" y="2" width="3" height="10" rx="0.8"/><rect x="9" y="2" width="3" height="10" rx="0.8"/></svg>
                        </button>
                    </div>
                    <div class="finder-search-wrap">
                        <svg class="finder-search-icon" viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                        <input type="text" class="finder-search" id="finder-search" placeholder="搜索" value="${searchQuery}" spellcheck="false">
                    </div>
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

        const backBtn = toolbar.querySelector('#finder-back');
        backBtn.addEventListener('click', () => {
            if (historyIndex > 0) {
                historyIndex--;
                currentPath = history[historyIndex];
                render();
            }
        });

        const fwdBtn = toolbar.querySelector('#finder-forward');
        fwdBtn.addEventListener('click', () => {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                currentPath = history[historyIndex];
                render();
            }
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
                        <div class="finder-grid-item ${selectedPath === item.path ? 'selected' : ''}" data-path="${item.path}" data-type="${item.type}">
                            <div class="finder-grid-icon">${IconGenerator.generate(fileIconFor(item), { size: 64 })}</div>
                            <div class="finder-grid-name">${item.name}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="finder-status-bar">${items.length} 个项目</div>
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
                        <div class="finder-list-item ${selectedPath === item.path ? 'selected' : ''}" data-path="${item.path}" data-type="${item.type}">
                            <div class="finder-list-cell name">
                                <div class="finder-list-icon">${IconGenerator.generate(fileIconFor(item), { size: 20 })}</div>
                                <span>${item.name}</span>
                            </div>
                            <div class="finder-list-cell date">${item.modified ? new Date(item.modified).toLocaleDateString('zh-CN') : '--'}</div>
                            <div class="finder-list-cell size">${item.type === 'folder' ? '--' : formatFileSize(item.content ? item.content.length : 0)}</div>
                            <div class="finder-list-cell type">${item.type === 'folder' ? '文件夹' : '文稿'}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="finder-status-bar">${items.length} 个项目</div>
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
                    selectedPath = null;
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

        body.onclick = (e) => {
            const item = e.target.closest('.finder-grid-item, .finder-list-item');
            if (item) {
                e.stopPropagation();
                selectedPath = item.dataset.path;
                body.querySelectorAll('.finder-grid-item.selected, .finder-list-item.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                item.classList.add('selected');
            } else {
                selectedPath = null;
                body.querySelectorAll('.finder-grid-item.selected, .finder-list-item.selected').forEach(el => {
                    el.classList.remove('selected');
                });
            }
        };
    }

    function render() {
        body.className = 'window-body app-content finder-body';
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    render();
};
