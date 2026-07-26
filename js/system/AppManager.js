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
            { id: 'trash', name: '废纸篓', icon: 'trash', width: 700, height: 500 }
        ];

        defaultApps.forEach(app => {
            this.registerApp(app);
        });

        this.dockApps = ['finder', 'safari', 'mail', 'messages', 'maps', 'photos', 'music', 'notes', 'calendar', 'ai', 'settings', 'terminal', 'calculator'];
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
        dock.appendChild(trashItem);
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

    hasToolbar(appId) {
        return ['finder', 'safari', 'notes', 'mail', 'settings', 'ai', 'maps', 'music'].includes(appId);
    }

    hasSidebar(appId) {
        return ['finder', 'notes', 'mail', 'messages', 'settings', 'music', 'contacts', 'ai'].includes(appId);
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
            body.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:40px;text-align:center;">
                    <div style="width:120px;height:120px;margin-bottom:20px;">${IconGenerator.generate(this.apps.get(appId)?.icon || 'default', { emoji: this.apps.get(appId)?.emoji })}</div>
                    <h2 style="margin-bottom:8px;font-weight:600;">${this.apps.get(appId)?.name || appId}</h2>
                    <p style="color:var(--text-secondary);">此应用正在开发中...</p>
                </div>
            `;
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
            trash: window.renderTrash
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
}
