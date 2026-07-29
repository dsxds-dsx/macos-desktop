class AppManager {
    constructor() {
        this.apps = new Map();
        this.runningApps = new Map();
        this.activeApp = null;
        this.dockApps = [];
        this.windowManager = null;
        this.fileSystem = null;
        this.registerDefaultApps();
    }

    init(windowManager, fileSystem) {
        this.windowManager = windowManager;
        this.fileSystem = fileSystem;
        this.setupDock();
    }

    registerDefaultApps() {
        const defaultApps = [
            { id: 'launchpad', name: '启动台', icon: 'missioncontrol', width: 1200, height: 750, resizable: false },
            { id: 'finder', name: '访达', icon: 'finder', width: 900, height: 600, defaultOpen: true },
            { id: 'safari', name: 'Safari 浏览器', icon: 'safari', width: 1000, height: 700 },
            { id: 'mail', name: '邮件', icon: 'mail', width: 900, height: 600 },
            { id: 'messages', name: '信息', icon: 'messages', width: 800, height: 600 },
            { id: 'facetime', name: 'FaceTime 通话', icon: 'facetime', width: 600, height: 500 },
            { id: 'maps', name: '地图', icon: 'maps', width: 900, height: 600 },
            { id: 'photos', name: '照片', icon: 'photos', width: 900, height: 650 },
            { id: 'notes', name: '备忘录', icon: 'notes', width: 800, height: 600 },
            { id: 'calendar', name: '日历', icon: 'calendar', width: 800, height: 600 },
            { id: 'reminders', name: '提醒事项', icon: 'reminders', width: 500, height: 600 },
            { id: 'music', name: '音乐', icon: 'music', width: 900, height: 650 },
            { id: 'podcasts', name: '播客', icon: 'podcasts', width: 800, height: 600 },
            { id: 'tv', name: 'TV', icon: 'tv', width: 900, height: 600 },
            { id: 'news', name: '新闻', icon: 'news', width: 800, height: 600 },
            { id: 'stocks', name: '股票', icon: 'stocks', width: 700, height: 500 },
            { id: 'books', name: '图书', icon: 'books', width: 800, height: 600 },
            { id: 'appstore', name: 'App Store', icon: 'appstore', width: 900, height: 650 },
            { id: 'ai', name: 'AI 助手', icon: 'ai', width: 900, height: 700 },
            { id: 'settings', name: '系统设置', icon: 'settings', width: 900, height: 650 },
            { id: 'terminal', name: '终端', icon: 'terminal', width: 700, height: 500 },
            { id: 'activity', name: '活动监视器', icon: 'activity', width: 800, height: 550 },
            { id: 'calculator', name: '计算器', icon: 'calculator', width: 280, height: 420, resizable: false },
            { id: 'textedit', name: '文本编辑', icon: 'textedit', width: 700, height: 600 },
            { id: 'preview', name: '预览', icon: 'preview', width: 800, height: 600 },
            { id: 'quicktime', name: 'QuickTime Player', icon: 'quicktime', width: 800, height: 500 },
            { id: 'weather', name: '天气', icon: 'weather', width: 400, height: 600 },
            { id: 'clock', name: '时钟', icon: 'clock', width: 400, height: 500 },
            { id: 'contacts', name: '通讯录', icon: 'contacts', width: 700, height: 500 },
            { id: 'voicememos', name: '语音备忘录', icon: 'voice', width: 400, height: 500 },
            { id: 'stickies', name: '便笺', icon: 'stickies', width: 300, height: 300 },
            { id: 'chess', name: '国际象棋', icon: 'chess', width: 500, height: 500 },
            { id: 'dictionary', name: '词典', icon: 'dictionary', width: 600, height: 500 },
            { id: 'fontbook', name: '字体册', icon: 'fontbook', width: 700, height: 500 },
            { id: 'imagecapture', name: '图像捕捉', icon: 'imagecapture', width: 600, height: 400 },
            { id: 'keychain', name: '钥匙串访问', icon: 'keychain', width: 600, height: 450 },
            { id: 'migration', name: '迁移助理', icon: 'migration', width: 600, height: 400 },
            { id: 'sysinfo', name: '系统信息', icon: 'sysinfo', width: 700, height: 500 },
            { id: 'home', name: '家庭', icon: 'home', width: 700, height: 500 },
            { id: 'numbers', name: 'Numbers 表格', icon: 'numbers', width: 900, height: 650 },
            { id: 'pages', name: 'Pages 文稿', icon: 'pages', width: 900, height: 650 },
            { id: 'keynote', name: 'Keynote 讲演', icon: 'keynote', width: 900, height: 650 },
            { id: 'garageband', name: '库乐队', icon: 'garageband', width: 800, height: 600, emoji: '🎸' },
            { id: 'imovie', name: 'iMovie 剪辑', icon: 'imovie', width: 900, height: 600, emoji: '🎬' },
            // 新增应用
            { id: 'passwords', name: '密码', icon: 'passwords', width: 800, height: 600 },
            { id: 'journal', name: '日记', icon: 'journal', width: 800, height: 600 },
            { id: 'testflight', name: 'TestFlight', icon: 'testflight', width: 700, height: 500 },
            { id: 'phone', name: '电话', icon: 'phone', width: 500, height: 600 },
            { id: 'iphonemirror', name: 'iPhone 镜像', icon: 'iphonemirror', width: 600, height: 700 },
            { id: 'shortcuts', name: '快捷指令', icon: 'shortcuts', width: 800, height: 600 },
            { id: 'tips', name: '提示', icon: 'tips', width: 700, height: 500 },
            { id: 'timemachine', name: '时间机器', icon: 'timemachine', width: 700, height: 500 },
            { id: 'gamecenter', name: 'Game Center', icon: 'gamecenter', width: 700, height: 500 },
            { id: 'missioncontrol', name: '调度中心', icon: 'missioncontrol', width: 800, height: 500 },
            { id: 'automator', name: '自动操作', icon: 'automator', width: 800, height: 600 },
            { id: 'freeform', name: '无边记', icon: 'freeform', width: 900, height: 650 },
            { id: 'photobooth', name: 'Photo Booth', icon: 'photobooth', width: 700, height: 600 },
            { id: 'findmy', name: '查找', icon: 'findmy', width: 800, height: 600 },
            { id: 'siri', name: 'Siri', icon: 'siri', width: 500, height: 600 },
            { id: 'trash', name: '废纸篓', icon: 'trash', width: 700, height: 500 }
        ];

        defaultApps.forEach(app => {
            this.registerApp(app);
        });

        // Launchpad 放在 Dock 第一位
        this.dockApps = ['launchpad', 'finder', 'safari', 'mail', 'messages', 'maps', 'photos', 'music', 'notes', 'calendar', 'ai', 'settings', 'terminal', 'calculator'];
    }

    registerApp(appConfig) {
        this.apps.set(appConfig.id, {
            id: appConfig.id,
            name: appConfig.name,
            icon: appConfig.icon,
            emoji: appConfig.emoji || null,
            width: appConfig.width || 800,
            height: appConfig.height || 600,
            resizable: appConfig.resizable !== false,
            defaultOpen: appConfig.defaultOpen || false,
            windowId: null
        });
    }

    setupDock() {
        const dock = document.getElementById('dock');
        if (!dock) return;
        dock.innerHTML = '';

        this.dockApps.forEach(appId => {
            const app = this.apps.get(appId);
            if (!app) return;

            const item = document.createElement('div');
            item.className = 'dock-item';
            item.dataset.appId = appId;
            item.dataset.appName = app.name;
            
            const iconSvg = IconGenerator.generate(app.icon, { emoji: app.emoji });
            
            item.innerHTML = `
                <div class="dock-icon">${iconSvg}</div>
                <div class="dock-dot"></div>
                <div class="dock-tooltip">${app.name}</div>
            `;

            item.addEventListener('click', (e) => this.handleDockClick(appId, e));
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showDockContextMenu(appId, e.clientX, e.clientY);
            });
            dock.appendChild(item);
        });

        const separator = document.createElement('div');
        separator.className = 'dock-separator';
        dock.appendChild(separator);

        const trashItem = document.createElement('div');
        trashItem.className = 'dock-item';
        trashItem.dataset.appId = 'trash';
        trashItem.dataset.appName = '废纸篓';
        trashItem.innerHTML = `
            <div class="dock-icon">${IconGenerator.generate('trash')}</div>
            <div class="dock-dot"></div>
            <div class="dock-tooltip">废纸篓</div>
        `;
        trashItem.addEventListener('click', () => this.openApp('trash'));
        trashItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showDockContextMenu('trash', e.clientX, e.clientY);
        });
        dock.appendChild(trashItem);

        this.setupDockMagnification(dock);
        this.setupDockContextMenuClose();
    }

    showDockContextMenu(appId, x, y) {
        this.closeDockContextMenu();
        
        const app = this.apps.get(appId);
        if (!app) return;

        const isRunning = this.isAppRunning(appId);
        const windows = window.windowManager?.getWindowsByApp(appId) || [];

        const menu = document.createElement('div');
        menu.className = 'dock-context-menu';
        menu.id = 'dock-context-menu';
        
        let menuItems = '';
        
        if (appId === 'trash') {
            menuItems = `
                <div class="dock-context-item" data-action="open">打开</div>
                <div class="dock-context-separator"></div>
                <div class="dock-context-item" data-action="empty-trash">清倒废纸篓...</div>
            `;
        } else if (appId === 'launchpad') {
            menuItems = `
                <div class="dock-context-item" data-action="open">打开</div>
            `;
        } else {
            menuItems = `
                <div class="dock-context-item" data-action="open">${isRunning ? '显示所有窗口' : '打开'}</div>
            `;
            
            if (windows.length > 0) {
                menuItems += `<div class="dock-context-separator"></div>`;
                windows.forEach((win, i) => {
                    menuItems += `
                        <div class="dock-context-item" data-action="window" data-window-id="${win.id}">
                            ${win.title || app.name}
                        </div>
                    `;
                });
            }
            
            menuItems += `
                <div class="dock-context-separator"></div>
                <div class="dock-context-item" data-action="quit">${isRunning ? '退出' : '退出'}</div>
            `;
            
            if (!this.dockApps.includes(appId) && appId !== 'trash' && appId !== 'launchpad') {
                menuItems += `
                    <div class="dock-context-separator"></div>
                    <div class="dock-context-item" data-action="remove-from-dock">从 Dock 中移除</div>
                `;
            }
        }

        menu.innerHTML = menuItems;
        document.body.appendChild(menu);

        const menuRect = menu.getBoundingClientRect();
        let menuX = x - menuRect.width / 2;
        let menuY = y - menuRect.height - 10;
        
        if (menuX < 10) menuX = 10;
        if (menuX + menuRect.width > window.innerWidth - 10) {
            menuX = window.innerWidth - menuRect.width - 10;
        }
        if (menuY < 10) menuY = y + 10;

        menu.style.left = `${menuX}px`;
        menu.style.top = `${menuY}px`;

        requestAnimationFrame(() => {
            menu.classList.add('show');
        });

        menu.querySelectorAll('.dock-context-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                const windowId = item.dataset.windowId;
                this.handleDockContextAction(appId, action, windowId);
                this.closeDockContextMenu();
            });
        });
    }

    handleDockContextAction(appId, action, windowId) {
        switch(action) {
            case 'open':
                if (appId === 'trash') {
                    this.openApp('trash');
                } else if (appId === 'launchpad') {
                    this.launchLaunchpad();
                } else {
                    const windows = window.windowManager?.getWindowsByApp(appId) || [];
                    if (windows.length > 0) {
                        const win = windows[0];
                        if (win.minimized) {
                            window.windowManager.restoreWindow(win.id);
                        } else {
                            window.windowManager.focusWindow(win.id);
                        }
                    } else {
                        this.openApp(appId);
                    }
                }
                break;
            case 'window':
                if (windowId) {
                    const win = window.windowManager?.getWindow(windowId);
                    if (win) {
                        if (win.minimized) {
                            window.windowManager.restoreWindow(windowId);
                        } else {
                            window.windowManager.focusWindow(windowId);
                        }
                    }
                }
                break;
            case 'quit':
                const wins = window.windowManager?.getWindowsByApp(appId) || [];
                wins.forEach(win => {
                    window.windowManager.closeWindow(win.id);
                });
                break;
            case 'empty-trash':
                if (fileSystem) {
                    fileSystem.emptyTrash();
                }
                break;
            case 'remove-from-dock':
                const idx = this.dockApps.indexOf(appId);
                if (idx > -1) {
                    this.dockApps.splice(idx, 1);
                    this.setupDock();
                }
                break;
        }
    }

    closeDockContextMenu() {
        const menu = document.getElementById('dock-context-menu');
        if (menu) {
            menu.classList.remove('show');
            setTimeout(() => menu.remove(), 150);
        }
    }

    setupDockContextMenuClose() {
        document.addEventListener('mousedown', this._dockMenuCloseHandler = (e) => {
            if (!e.target.closest('.dock-context-menu')) {
                this.closeDockContextMenu();
            }
        });
    }

    setupDockMagnification(dock) {
        const items = dock.querySelectorAll('.dock-item');
        const baseSize = 50;
        const maxSize = 78;
        const magnificationRange = 140;

        dock.addEventListener('mousemove', (e) => {
            const dockRect = dock.getBoundingClientRect();
            const mouseX = e.clientX - dockRect.left;

            items.forEach((item) => {
                if (item.classList.contains('bounce')) return;
                const itemRect = item.getBoundingClientRect();
                const itemCenterX = itemRect.left - dockRect.left + itemRect.width / 2;
                const distance = Math.abs(mouseX - itemCenterX);

                if (distance < magnificationRange) {
                    // cosine curve, smoother than quadratic
                    const ratio = Math.cos((distance / magnificationRange) * (Math.PI / 2));
                    const eased = ratio * ratio;
                    const scale = 1 + eased * ((maxSize - baseSize) / baseSize);
                    // Lift the icon up proportional to the scale
                    const translateY = (scale - 1) * baseSize * 0.5;
                    item.style.transform = `scale(${scale}) translateY(-${translateY}px)`;
                } else {
                    item.style.transform = '';
                }
            });
        });

        dock.addEventListener('mouseleave', () => {
            items.forEach((item) => {
                if (!item.classList.contains('bounce')) {
                    item.style.transform = '';
                }
            });
        });
    }

    handleDockClick(appId, e) {
        const app = this.apps.get(appId);
        if (!app) return;

        const existingWindow = this.windowManager.getWindowsByApp(appId);
        
        if (existingWindow.length > 0) {
            const win = existingWindow[0];
            if (win.minimized) {
                this.windowManager.restoreWindow(win.id);
            } else if (this.windowManager.activeWindow === win.id) {
                this.windowManager.minimizeWindow(win.id);
            } else {
                this.windowManager.focusWindow(win.id);
            }
        } else {
            this.openApp(appId);
        }
    }

    openApp(appId) {
        const app = this.apps.get(appId);
        if (!app) return null;

        if (appId === 'launchpad') {
            this.launchLaunchpad();
            return null;
        }

        this.bounceDockIcon(appId);

        const windowId = `win-${appId}-${Date.now()}`;
        app.windowId = windowId;

        const win = this.windowManager.createWindow(windowId, appId, {
            title: app.name,
            icon: app.icon,
            width: app.width,
            height: app.height,
            resizable: app.resizable,
            toolbar: this.hasToolbar(appId),
            sidebar: this.hasSidebar(appId)
        });

        this.runningApps.set(windowId, appId);
        this.setActiveApp(appId);
        this.renderApp(windowId, appId);

        return win;
    }

    bounceDockIcon(appId) {
        const dockItem = document.querySelector(`.dock-item[data-app-id="${appId}"]`);
        if (dockItem && !dockItem.classList.contains('running')) {
            dockItem.classList.add('bounce');
            setTimeout(() => {
                dockItem.classList.remove('bounce');
                dockItem.style.transform = '';
            }, 600);
        }
    }

    launchLaunchpad() {
        let lp = document.getElementById('launchpad-overlay');
        if (lp) {
            this.closeLaunchpad();
            return;
        }

        lp = document.createElement('div');
        lp.id = 'launchpad-overlay';
        lp.className = 'launchpad-overlay';
        lp.innerHTML = `
            <div class="launchpad-bg"></div>
            <div class="launchpad-content">
                <div class="lp-search-container">
                    <div class="lp-search-box">
                        <svg viewBox="0 0 24 24" width="20" height="20" style="color:rgba(255,255,255,0.6);flex-shrink:0;">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                        </svg>
                        <input type="text" id="lp-search-input" placeholder="搜索" autocomplete="off">
                    </div>
                </div>
                <div class="lp-pages-container" id="lp-pages">
                    <div class="lp-page" id="lp-page-0"></div>
                </div>
                <div class="lp-page-dots" id="lp-dots"></div>
            </div>
        `;
        document.getElementById('desktop').appendChild(lp);

        requestAnimationFrame(() => {
            lp.classList.add('show');
        });

        this.renderLaunchpadApps();

        lp.addEventListener('click', (e) => {
            if (e.target === lp || e.target.classList.contains('launchpad-bg')) {
                this.closeLaunchpad();
            }
        });

        const searchInput = lp.querySelector('#lp-search-input');
        searchInput.addEventListener('input', (e) => {
            this.filterLaunchpadApps(e.target.value);
        });
        searchInput.focus();

        document.addEventListener('keydown', this._lpKeyHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeLaunchpad();
            }
        });
    }

    closeLaunchpad() {
        const lp = document.getElementById('launchpad-overlay');
        if (lp) {
            lp.classList.remove('show');
            setTimeout(() => {
                lp.remove();
            }, 300);
        }
        document.removeEventListener('keydown', this._lpKeyHandler);
    }

    renderLaunchpadApps() {
        const apps = this.getAllApps().filter(a => a.id !== 'launchpad' && a.id !== 'trash');
        const appsPerPage = 28;
        const totalPages = Math.max(1, Math.ceil(apps.length / appsPerPage));
        const pagesContainer = document.getElementById('lp-pages');
        const dotsContainer = document.getElementById('lp-dots');

        if (!pagesContainer) return;

        pagesContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const page = document.createElement('div');
            page.className = 'lp-page' + (i === 0 ? ' active' : '');
            page.dataset.page = i;
            page.style.transform = `translateX(${i * 100}%)`;
            pagesContainer.appendChild(page);
        }

        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'lp-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                this.switchLaunchpadPage(i);
            });
            dotsContainer.appendChild(dot);
        }

        apps.forEach((app, index) => {
            const pageIndex = Math.floor(index / appsPerPage);
            const page = pagesContainer.children[pageIndex];
            if (!page) return;

            const item = document.createElement('div');
            item.className = 'lp-app-item';
            item.dataset.appId = app.id;
            item.innerHTML = `
                <div class="lp-app-icon">${IconGenerator.generate(app.icon, { emoji: app.emoji })}</div>
                <div class="lp-app-name">${app.name}</div>
            `;
            item.addEventListener('click', () => {
                this.closeLaunchpad();
                setTimeout(() => {
                    this.openApp(app.id);
                }, 250);
            });
            page.appendChild(item);
        });

        let currentPage = 0;
        let isDragging = false;
        let startX = 0;
        let currentX = 0;

        pagesContainer.addEventListener('mousedown', (e) => {
            if (e.target.closest('.lp-app-item')) return;
            isDragging = true;
            startX = e.clientX;
            currentX = 0;
            pagesContainer.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX - startX;
            const pages = pagesContainer.querySelectorAll('.lp-page');
            pages.forEach((page, i) => {
                const baseX = i * 100;
                const offset = (currentX / pagesContainer.offsetWidth) * 100;
                page.style.transform = `translateX(calc(${baseX}% + ${offset}%))`;
            });
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            pagesContainer.style.transition = '';

            const threshold = pagesContainer.offsetWidth * 0.2;
            if (currentX < -threshold && currentPage < totalPages - 1) {
                currentPage++;
            } else if (currentX > threshold && currentPage > 0) {
                currentPage--;
            }

            this.switchLaunchpadPage(currentPage);
        });

        this._lpCurrentPage = 0;
    }

    switchLaunchpadPage(pageIndex) {
        const pagesContainer = document.getElementById('lp-pages');
        const dotsContainer = document.getElementById('lp-dots');
        if (!pagesContainer) return;

        this._lpCurrentPage = pageIndex;
        const pages = pagesContainer.querySelectorAll('.lp-page');
        pages.forEach((page, i) => {
            const offset = (i - pageIndex) * 100;
            page.style.transform = `translateX(${offset}%)`;
            page.classList.toggle('active', i === pageIndex);
        });

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.lp-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === pageIndex);
            });
        }
    }

    filterLaunchpadApps(query) {
        const items = document.querySelectorAll('.lp-app-item');
        const q = query.toLowerCase();
        items.forEach(item => {
            const name = item.dataset.appId + item.querySelector('.lp-app-name').textContent;
            item.style.display = name.toLowerCase().includes(q) ? '' : 'none';
        });
    }

    hasToolbar(appId) {
        return ['finder', 'safari', 'notes', 'mail', 'settings', 'ai', 'maps', 'music', 'clock', 'reminders', 'textedit', 'stickies', 'photos', 'calendar', 'weather', 'stocks', 'news', 'tv', 'contacts'].includes(appId);
    }

    hasSidebar(appId) {
        return ['finder', 'notes', 'mail', 'messages', 'settings', 'music', 'contacts', 'ai', 'reminders', 'textedit', 'photos', 'calendar', 'weather', 'stocks', 'podcasts', 'maps', 'news'].includes(appId);
    }

    renderApp(windowId, appId) {
        const body = document.getElementById(`body-${windowId}`);
        const sidebar = document.getElementById(`sidebar-${windowId}`);
        const toolbar = document.getElementById(`toolbar-${windowId}`);
        
        if (!body) return;

        const renderer = this.getAppRenderer(appId);
        if (renderer) {
            renderer(body, sidebar, toolbar, windowId);
        } else {
            const app = this.apps.get(appId);
            const appName = app?.name || appId;
            const appIcon = app?.icon || 'default';
            
            body.className = 'window-body app-content generic-app';
            body.innerHTML = `
                <div class="generic-app-container">
                    <div class="generic-app-header">
                        <div class="generic-app-big-icon">${IconGenerator.generate(appIcon, { size: 96 })}</div>
                        <h1 class="generic-app-title">${appName}</h1>
                        <p class="generic-app-subtitle">欢迎使用 ${appName}</p>
                    </div>
                    <div class="generic-app-features">
                        <div class="generic-feature-card">
                            <div class="generic-feature-icon">📝</div>
                            <div class="generic-feature-name">新建文档</div>
                            <div class="generic-feature-desc">创建一个新的空白文档</div>
                        </div>
                        <div class="generic-feature-card">
                            <div class="generic-feature-icon">📂</div>
                            <div class="generic-feature-name">打开文件</div>
                            <div class="generic-feature-desc">从文件系统中打开现有文件</div>
                        </div>
                        <div class="generic-feature-card">
                            <div class="generic-feature-icon">💾</div>
                            <div class="generic-feature-name">保存</div>
                            <div class="generic-feature-desc">将当前工作保存到文件</div>
                        </div>
                        <div class="generic-feature-card">
                            <div class="generic-feature-icon">🔍</div>
                            <div class="generic-feature-name">搜索</div>
                            <div class="generic-feature-desc">在文档中查找内容</div>
                        </div>
                    </div>
                    <div class="generic-app-footer">
                        <button class="generic-btn generic-btn-primary" id="generic-new">新建文档</button>
                        <button class="generic-btn" id="generic-open">打开</button>
                        <button class="generic-btn" id="generic-about">关于 ${appName}</button>
                    </div>
                    <div class="generic-app-status" id="generic-status"></div>
                </div>
            `;

            const statusEl = body.querySelector('#generic-status');
            body.querySelector('#generic-new')?.addEventListener('click', () => {
                statusEl.textContent = '已创建新文档';
                setTimeout(() => statusEl.textContent = '', 2000);
            });
            body.querySelector('#generic-open')?.addEventListener('click', () => {
                statusEl.textContent = '正在打开文件...';
                setTimeout(() => statusEl.textContent = '文件已打开', 2000);
            });
            body.querySelector('#generic-about')?.addEventListener('click', () => {
                alert(`${appName}\n版本 1.0\n\nmacOS 应用模拟器`);
            });
        }
    }

    getAppRenderer(appId) {
        const renderers = {
            finder: window.renderFinder,
            safari: window.renderSafari,
            terminal: window.renderTerminal,
            notes: window.renderNotes,
            settings: window.renderSettings,
            calendar: window.renderCalendar,
            ai: window.renderAI,
            photos: window.renderPhotos,
            mail: window.renderMail,
            messages: window.renderMessages,
            facetime: window.renderFaceTime,
            music: window.renderMusic,
            calculator: window.renderCalculator,
            textedit: window.renderTextEdit,
            activity: window.renderActivityMonitor,
            appstore: window.renderAppStore,
            weather: window.renderWeather,
            clock: window.renderClock,
            reminders: window.renderReminders,
            contacts: window.renderContacts,
            maps: window.renderMaps,
            news: window.renderNews,
            stocks: window.renderStocks,
            voicememos: window.renderVoiceMemos,
            quicktime: window.renderQuickTime,
            preview: window.renderPreview,
            stickies: window.renderStickies,
            chess: window.renderChess,
            dictionary: window.renderDictionary,
            books: window.renderBooks,
            podcasts: window.renderPodcasts,
            tv: window.renderTV,
            home: window.renderHome,
            numbers: window.renderNumbers,
            pages: window.renderPages,
            keynote: window.renderKeynote,
            fontbook: window.renderFontBook,
            imagecapture: window.renderImageCapture,
            keychain: window.renderKeychainAccess,
            migration: window.renderMigrationAssistant,
            sysinfo: window.renderSystemInformation,
            garageband: window.renderGarageBand,
            imovie: window.renderiMovie,
            launchpad: window.renderLaunchpad,
            trash: window.renderTrash,
            siri: window.renderSiri,
            findmy: window.renderFindMy,
            shortcuts: window.renderShortcuts,
            passwords: window.renderPasswords,
            freeform: window.renderFreeform,
            photobooth: window.renderPhotoBooth,
            gamecenter: window.renderGameCenter,
            missioncontrol: window.renderMissionControl,
            automator: window.renderAutomator,
            timemachine: window.renderTimeMachine,
            journal: window.renderJournal,
            testflight: window.renderTestFlight,
            tips: window.renderTips,
            phone: window.renderPhone,
            iphonemirror: window.renderIPhoneMirror
        };
        return renderers[appId] || null;
    }

    setActiveApp(appId) {
        this.activeApp = appId;
        const appMenu = document.getElementById('app-menu');
        if (appMenu) {
            const app = this.apps.get(appId);
            appMenu.textContent = app ? app.name : '访达';
        }
    }

    onAppClosed(windowId) {
        this.runningApps.delete(windowId);
    }

    getApp(appId) {
        return this.apps.get(appId);
    }

    getAllApps() {
        return Array.from(this.apps.values());
    }

    isAppRunning(appId) {
        return Array.from(this.runningApps.values()).includes(appId);
    }

    installApp(appConfig) {
        if (this.apps.has(appConfig.id)) {
            return false;
        }

        this.registerApp(appConfig);

        if (!this.dockApps.includes(appConfig.id) && appConfig.id !== 'launchpad' && appConfig.id !== 'trash') {
            this.dockApps.push(appConfig.id);
            this.setupDock();
        }

        return true;
    }

    isAppInstalled(appId) {
        return this.apps.has(appId);
    }
}
