let fileSystem, windowManager, appManager;
let idleTimer = null;
let screensaverActive = false;
const IDLE_TIMEOUT = 5 * 60 * 1000;

function initSystem() {
    try {
        fileSystem = new FileSystem();
        windowManager = new WindowManager();
        appManager = new AppManager();
        
        window.fileSystem = fileSystem;
        window.windowManager = windowManager;
        window.appManager = appManager;
        
        appManager.init(windowManager, fileSystem);
        
        setupClock();
        setupLockScreen();
        setupMenuBar();
        setupControlCenter();
        setupNotificationCenter();
        setupSpotlight();
        setupContextMenu();
        setupQuickLook();
        setupKeyboardShortcuts();
        setupTheme();
        setupDesktopIcons();
        setupDesktopDrop();
        setupRubberBandSelection();
        setupScreensaver();
        setupBoot();
        
    } catch (e) {
        console.error('System initialization error:', e);
    }
}

function setupBoot() {
    const bootScreen = document.getElementById('boot-screen');
    const lockScreen = document.getElementById('lock-screen');
    const desktop = document.getElementById('desktop');
    
    setTimeout(() => {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.classList.add('hidden');
            lockScreen.classList.remove('hidden');
            updateLockClock();
        }, 800);
    }, 3000);
}

function setupLockScreen() {
    const passwordInput = document.getElementById('lock-password');
    const submitBtn = document.getElementById('lock-submit');
    const sleepBtn = document.getElementById('sleep-btn');
    const restartBtn = document.getElementById('restart-btn');
    const shutdownBtn = document.getElementById('shutdown-btn');
    
    function unlock() {
        const lockScreen = document.getElementById('lock-screen');
        const desktop = document.getElementById('desktop');
        const hint = document.getElementById('lock-hint');
        
        hint.textContent = '';
        lockScreen.style.opacity = '0';
        lockScreen.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            lockScreen.classList.add('hidden');
            desktop.classList.remove('hidden');
            passwordInput.value = '';
            
            if (appManager) {
                appManager.openApp('finder');
            }
            
            resetIdleTimer();
        }, 500);
    }
    
    submitBtn.addEventListener('click', unlock);
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') unlock();
    });
    
    sleepBtn.addEventListener('click', () => {
        showScreensaver();
    });
    
    restartBtn.addEventListener('click', () => {
        location.reload();
    });
    
    shutdownBtn.addEventListener('click', () => {
        shutdown();
    });
}

function updateLockClock() {
    const timeEl = document.getElementById('lock-time');
    const dateEl = document.getElementById('lock-date');
    
    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}`;
        
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekday = weekdays[now.getDay()];
        dateEl.textContent = `${month}月${day}日 ${weekday}`;
    }
    
    update();
    setInterval(update, 1000);
}

function setupClock() {
    const menuTime = document.getElementById('menubar-time');
    const menuDate = document.getElementById('menubar-date');
    const ncDate = document.getElementById('nc-date');
    
    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        if (menuTime) menuTime.textContent = `${hours}:${minutes}`;
        
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekday = weekdays[now.getDay()];
        if (menuDate) menuDate.textContent = `${month}月${day}日 ${weekday}`;
        if (ncDate) ncDate.textContent = `${now.getFullYear()}年${month}月${day}日 ${weekday}`;
        
        renderNCCalendar();
    }
    
    update();
    setInterval(update, 1000);
}

function renderNCCalendar() {
    const cal = document.getElementById('nc-calendar');
    if (!cal) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = '';
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    weekdays.forEach(d => {
        html += `<div class="nc-calendar-day" style="font-weight:600;color:var(--text-tertiary);">${d}</div>`;
    });
    
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="nc-calendar-day other"></div>`;
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today;
        html += `<div class="nc-calendar-day ${isToday ? 'today' : ''}">${d}</div>`;
    }
    
    cal.innerHTML = html;
}

function setupMenuBar() {
    const ccBtn = document.getElementById('control-center-btn');
    const ncBtn = document.getElementById('notif-center-btn');
    const searchBtn = document.getElementById('search-menu');
    
    const menuItems = [
        { id: 'apple-menu', dropdown: 'apple-dropdown', handler: handleAppleMenuAction },
        { id: 'file-menu', dropdown: 'file-dropdown', handler: handleFileMenuAction },
        { id: 'edit-menu', dropdown: 'edit-dropdown', handler: handleEditMenuAction },
        { id: 'view-menu', dropdown: 'view-dropdown', handler: handleViewMenuAction },
        { id: 'go-menu', dropdown: 'go-dropdown', handler: handleGoMenuAction },
        { id: 'window-menu', dropdown: 'window-dropdown', handler: handleWindowMenuAction },
        { id: 'help-menu', dropdown: 'help-dropdown', handler: handleHelpMenuAction }
    ];
    
    menuItems.forEach(({ id, dropdown, handler }) => {
        const menuEl = document.getElementById(id);
        const dropdownEl = document.getElementById(dropdown);
        if (!menuEl || !dropdownEl) return;
        
        menuEl.addEventListener('mouseenter', (e) => {
            if (document.querySelector('.dropdown-menu.show')) {
                closeAllMenus();
                dropdownEl.classList.add('show');
                menuEl.classList.add('active');
                positionDropdown(menuEl, dropdownEl);
            }
        });
        
        menuEl.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdownEl.classList.contains('show');
            closeAllMenus();
            if (!isOpen) {
                dropdownEl.classList.add('show');
                menuEl.classList.add('active');
                positionDropdown(menuEl, dropdownEl);
            }
        });
        
        dropdownEl.querySelectorAll('.dropdown-item:not(.disabled)').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (action && handler) handler(action);
                closeAllMenus();
            });
        });
    });
    
    ccBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleControlCenter();
    });
    
    ncBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNotificationCenter();
    });
    
    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSpotlight();
    });
    
    document.addEventListener('click', () => {
        closeAllMenus();
    });
}

function positionDropdown(menuEl, dropdownEl) {
    const menuRect = menuEl.getBoundingClientRect();
    dropdownEl.style.left = `${menuRect.left - 8}px`;
    dropdownEl.style.top = 'var(--menubar-height)';
}

function closeAllMenus() {
    document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
    document.querySelectorAll('.menubar-item.active').forEach(m => m.classList.remove('active'));
    document.getElementById('control-center')?.classList.remove('show');
}

function handleAppleMenuAction(action) {
    switch(action) {
        case 'about':
            showAbout();
            break;
        case 'system-settings':
            appManager?.openApp('settings');
            break;
        case 'app-store':
            appManager?.openApp('appstore');
            break;
        case 'sleep':
            showScreensaver();
            break;
        case 'restart':
            if (confirm('确定要重新启动吗？')) location.reload();
            break;
        case 'shutdown':
            shutdown();
            break;
        case 'lock-screen':
            lockScreen();
            break;
        case 'force-quit':
            appManager?.openApp('activity');
            break;
    }
}

function handleFileMenuAction(action) {
    const activeWin = windowManager?.getActiveWindow();
    switch(action) {
        case 'new-finder':
            appManager?.openApp('finder');
            break;
        case 'new-folder':
            break;
        case 'open':
            break;
        case 'close-window':
            if (activeWin) windowManager.closeWindow(activeWin.id);
            break;
        case 'get-info':
            break;
        case 'rename':
            break;
        case 'move-trash':
            break;
        case 'empty-trash':
            appManager?.openApp('trash');
            break;
        case 'find':
            toggleSpotlight();
            break;
    }
}

function handleEditMenuAction(action) {
    switch(action) {
        case 'emoji':
            alert('表情与符号面板');
            break;
    }
}

function handleViewMenuAction(action) {
    switch(action) {
        case 'enter-fullscreen':
            const activeWin = windowManager?.getActiveWindow();
            if (activeWin) windowManager.toggleFullscreen(activeWin.id);
            break;
        case 'show-path-bar':
        case 'show-status-bar':
        case 'show-sidebar':
        case 'show-toolbar':
        case 'show-view-options':
            break;
    }
}

function handleGoMenuAction(action) {
    switch(action) {
        case 'go-desktop':
        case 'go-documents':
        case 'go-downloads':
        case 'go-home':
        case 'go-pictures':
        case 'go-applications':
        case 'go-utilities':
            appManager?.openApp('finder');
            break;
        case 'go-folder':
            break;
        case 'go-enclosing':
            break;
    }
}

function handleWindowMenuAction(action) {
    const activeWin = windowManager?.getActiveWindow();
    switch(action) {
        case 'minimize':
            if (activeWin) windowManager.minimizeWindow(activeWin.id);
            break;
        case 'zoom':
            if (activeWin) windowManager.toggleMaximize(activeWin.id);
            break;
        case 'cycle-windows': {
            const wins = Array.from(windowManager.windows.values()).filter(w => !w.minimized);
            if (wins.length < 2) break;
            const idx = wins.findIndex(w => w.id === windowManager.activeWindow);
            const next = wins[(idx + 1) % wins.length];
            windowManager.focusWindow(next.id);
            break;
        }
        case 'bring-all-front':
            windowManager.windows.forEach(w => {
                if (w.minimized) windowManager.restoreWindow(w.id);
            });
            break;
        case 'mission-control':
            appManager?.openApp('missioncontrol');
            break;
        case 'show-all':
            windowManager.windows.forEach(w => {
                if (w.minimized) windowManager.restoreWindow(w.id);
            });
            break;
        case 'hide-others': {
            if (!activeWin) break;
            windowManager.windows.forEach(w => {
                if (w.id !== activeWin.id && !w.minimized) windowManager.minimizeWindow(w.id);
            });
            break;
        }
        case 'show-desktop': {
            windowManager.windows.forEach(w => {
                if (!w.minimized) windowManager.minimizeWindow(w.id);
            });
            break;
        }
    }
}

function handleHelpMenuAction(action) {
    switch(action) {
        case 'search-help':
        case 'mac-help':
            toggleSpotlight();
            break;
    }
}

function showAbout() {
    const winId = 'about-' + Date.now();
    windowManager.createWindow(winId, 'about', {
        title: '关于本机',
        width: 400,
        height: 350,
        resizable: false
    });
    
    const body = document.getElementById(`body-${winId}`);
    if (body) {
        body.innerHTML = `
            <div class="about-window">
                <div class="about-logo">
                    <svg viewBox="0 0 170 170" width="100" height="100" style="color:var(--text-primary)">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.98-3.17-14.35-3.17-4.58 0-9.5 1.05-14.76 3.17-5.27 2.13-9.51 3.24-12.75 3.35-4.93.21-9.84-1.96-14.75-6.52-3.12-2.73-7.04-7.41-11.73-14.04-5.03-7.08-9.17-15.29-12.41-24.65C13.1 110.9 11.5 101.41 11.5 92.3c0-10.05 2.18-18.88 6.55-26.46 3.48-6.09 8.13-10.87 13.95-14.36 5.82-3.48 12.12-5.27 18.9-5.39 3.91 0 9.04 1.21 15.38 3.59 6.34 2.39 10.41 3.6 12.21 3.6 1.34 0 5.87-1.42 13.56-4.24 7.29-2.62 13.44-3.71 18.5-3.28 13.76 1.11 24.08 6.56 30.93 16.38-12.3 7.46-18.38 17.9-18.22 31.31.14 10.45 3.91 19.15 11.29 26.06 3.34 3.18 7.07 5.63 11.22 7.37-.9 2.61-1.85 5.11-2.85 7.51-.28.66-.56 1.3-.85 1.93zM119.09 7.24c0 8.2-2.99 15.83-8.94 22.84-7.17 8.32-15.85 13.14-25.33 12.38a25.22 25.22 0 0 1-.19-3.07c0-7.88 3.43-16.28 9.4-22.61 2.98-3.2 6.69-5.83 11.14-7.9 4.43-2.04 8.55-3.15 12.32-3.33.16 1.13.24 2.27.24 3.41z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="about-title">macOS</div>
                <div class="about-version">网页版 1.0</div>
                <div class="about-info">
                    <div>处理器：虚拟处理器</div>
                    <div>内存：8 GB</div>
                    <div>启动磁盘：Macintosh HD</div>
                    <div>序列号：W1234567890</div>
                </div>
            </div>
        `;
    }
}

function setupControlCenter() {
    const cc = document.getElementById('control-center');
    const wifi = document.getElementById('cc-wifi');
    const bluetooth = document.getElementById('cc-bluetooth');
    const airdrop = document.getElementById('cc-airdrop');
    const brightness = document.getElementById('cc-brightness');
    const volume = document.getElementById('cc-volume');
    const dnd = document.querySelector('.cc-focus-btn');
    
    [wifi, bluetooth, airdrop].forEach(btn => {
        btn?.addEventListener('click', () => btn.classList.toggle('active'));
    });
    
    dnd?.addEventListener('click', () => dnd.classList.toggle('active'));
}

function toggleControlCenter() {
    const cc = document.getElementById('control-center');
    const nc = document.getElementById('notification-center');
    nc?.classList.remove('show');
    cc?.classList.toggle('show');
}

function setupNotificationCenter() {
    const nc = document.getElementById('notification-center');
    
    document.addEventListener('mousedown', (e) => {
        if (!nc?.contains(e.target) && !e.target.closest('#notif-center-btn')) {
            nc?.classList.remove('show');
        }
    });
}

function toggleNotificationCenter() {
    const cc = document.getElementById('control-center');
    const nc = document.getElementById('notification-center');
    cc?.classList.remove('show');
    nc?.classList.toggle('show');
}

function setupSpotlight() {
    const spotlight = document.getElementById('spotlight');
    const input = document.getElementById('spotlight-input');
    const results = document.getElementById('spotlight-results');
    
    input.addEventListener('input', () => {
        performSpotlightSearch(input.value);
    });
    
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
            e.preventDefault();
            toggleSpotlight();
        }
        if (e.key === 'Escape') {
            spotlight?.classList.remove('show');
            input.value = '';
            results.innerHTML = '';
        }
    });
    
    document.addEventListener('mousedown', (e) => {
        if (!spotlight?.contains(e.target) && !e.target.closest('#search-menu')) {
            spotlight?.classList.remove('show');
        }
    });
}

function toggleSpotlight() {
    const spotlight = document.getElementById('spotlight');
    const cc = document.getElementById('control-center');
    const nc = document.getElementById('notification-center');
    cc?.classList.remove('show');
    nc?.classList.remove('show');
    spotlight?.classList.toggle('show');
    
    if (spotlight?.classList.contains('show')) {
        const input = document.getElementById('spotlight-input');
        input.focus();
        input.select();
    }
}

function performSpotlightSearch(query) {
    const results = document.getElementById('spotlight-results');
    if (!results) return;
    
    if (!query.trim()) {
        results.innerHTML = '';
        return;
    }
    
    const q = query.toLowerCase();
    const apps = appManager?.getAllApps() || [];
    const matchedApps = apps.filter(a => 
        a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
    ).slice(0, 5);

    let html = '';

    if (matchedApps.length > 0) {
        html += '<div class="spotlight-section"><div class="spotlight-section-title">应用程序</div>';
        matchedApps.forEach((app, i) => {
            html += `
                <div class="spotlight-item ${i === 0 ? 'selected' : ''}" data-type="app" data-app="${app.id}">
                    <div class="spotlight-item-icon">${IconGenerator.generate(app.icon, { emoji: app.emoji, size: 32 })}</div>
                    <div>
                        <div class="spotlight-item-name">${app.name}</div>
                        <div class="spotlight-item-path">应用程序</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    const files = searchFiles(q);
    if (files.length > 0) {
        html += '<div class="spotlight-section"><div class="spotlight-section-title">文件和文件夹</div>';
        files.forEach((file, i) => {
            html += `
                <div class="spotlight-item" data-type="file" data-path="${file.path}">
                    <div class="spotlight-item-icon">${IconGenerator.generate(file.type === 'folder' ? 'folder' : 'notes', { size: 32 })}</div>
                    <div>
                        <div class="spotlight-item-name">${file.name}</div>
                        <div class="spotlight-item-path">${file.path}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    const dictMatch = searchDictionary(q);
    if (dictMatch) {
        html += '<div class="spotlight-section"><div class="spotlight-section-title">词典</div>';
        html += `
            <div class="spotlight-item" data-type="dictionary" data-word="${q}">
                <div class="spotlight-item-icon">${IconGenerator.generate('dictionary', { size: 32 })}</div>
                <div>
                    <div class="spotlight-item-name">${dictMatch.word}</div>
                    <div class="spotlight-item-path">${dictMatch.definition}</div>
                </div>
            </div>
        `;
        html += '</div>';
    }

    if (matchedApps.length === 0 && files.length === 0 && !dictMatch) {
        html += `
            <div class="spotlight-section">
                <div class="spotlight-item" data-type="web" data-query="${query}">
                    <div class="spotlight-item-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32" style="color:var(--accent-blue)">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div>
                        <div class="spotlight-item-name">搜索网页 "${query}"</div>
                        <div class="spotlight-item-path">使用默认搜索引擎</div>
                    </div>
                </div>
            </div>
        `;
    }

    results.innerHTML = html;
    
    results.querySelectorAll('.spotlight-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            const appId = item.dataset.app;
            const filePath = item.dataset.path;
            const webQuery = item.dataset.query;
            
            if (type === 'app' && appId) {
                appManager.openApp(appId);
            } else if (type === 'file' && filePath) {
                appManager.openApp('finder');
            } else if (type === 'web' && webQuery) {
                appManager.openApp('safari');
            }
            
            document.getElementById('spotlight').classList.remove('show');
            document.getElementById('spotlight-input').value = '';
            results.innerHTML = '';
        });
    });
}

function searchFiles(query) {
    if (!fileSystem) return [];
    const results = [];
    
    function searchPath(path) {
        try {
            const items = fileSystem.list(path);
            items.forEach(item => {
                if (item.name.toLowerCase().includes(query)) {
                    results.push(item);
                }
                if (item.type === 'folder' && results.length < 5) {
                    searchPath(item.path);
                }
            });
        } catch (e) {}
    }
    
    searchPath('/');
    return results.slice(0, 5);
}

function searchDictionary(query) {
    const dictionary = {
        'mac': '苹果公司推出的 Macintosh 电脑系列',
        'macos': '苹果公司为 Mac 电脑开发的操作系统',
        'safari': '苹果公司开发的网络浏览器',
        'finder': 'macOS 的文件管理器',
        'dock': 'macOS 底部的应用程序启动栏',
        'spotlight': 'macOS 的桌面搜索功能',
        'launchpad': 'macOS 的应用程序启动界面',
        'mission control': 'macOS 的任务调度中心',
        'siri': '苹果公司的语音助手',
        'icloud': '苹果公司的云存储服务',
        'app store': '苹果的应用商店',
        'terminal': 'macOS 的命令行终端',
        'activity monitor': 'macOS 的系统活动监视器',
        'keychain': 'macOS 的密码和密钥管理系统',
        'time machine': 'macOS 的备份工具'
    };
    
    for (const [word, definition] of Object.entries(dictionary)) {
        if (word.includes(query.toLowerCase()) || query.toLowerCase().includes(word)) {
            return { word: word.charAt(0).toUpperCase() + word.slice(1), definition };
        }
    }
    return null;
}

function setupContextMenu() {
    const desktop = document.getElementById('desktop');
    const contextMenu = document.getElementById('context-menu');
    
    desktop?.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.window') || e.target.closest('.dock')) return;
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY);
    });
    
    document.addEventListener('click', () => {
        contextMenu?.classList.remove('show');
    });
}

function showContextMenu(x, y) {
    const menu = document.getElementById('context-menu');
    menu.innerHTML = `
        <div class="context-menu-item" data-action="new-folder">新建文件夹<span class="ctx-shortcut">⇧⌘N</span></div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="get-info">显示简介</div>
        <div class="context-menu-item" data-action="change-wallpaper">更改桌面背景…</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="sort-by-name">按名称排序</div>
        <div class="context-menu-item" data-action="sort-by-date">按修改日期排序</div>
        <div class="context-menu-item" data-action="sort-by-kind">按种类排序</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="show-view-options">查看显示选项</div>
    `;

    // 防止超出屏幕
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.classList.add('show');
    const rect = menu.getBoundingClientRect();
    let mx = x, my = y;
    if (mx + rect.width > window.innerWidth - 8) mx = window.innerWidth - rect.width - 8;
    if (my + rect.height > window.innerHeight - 8) my = window.innerHeight - rect.height - 8;
    menu.style.left = `${mx}px`;
    menu.style.top = `${my}px`;

    menu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            if (action === 'change-wallpaper') {
                appManager?.openApp('settings');
                setTimeout(() => {
                    const settingsSidebar = document.querySelector('.settings-sidebar-item[data-tab="appearance"]');
                    settingsSidebar?.click();
                }, 300);
            } else if (action === 'new-folder' && fileSystem) {
                fileSystem.createFolder(`~/Desktop/新建文件夹 ${new Date().getTime().toString().slice(-4)}`);
            }
            menu.classList.remove('show');
        });
    });
}

function setupQuickLook() {
    const ql = document.getElementById('quick-look');
    if (!ql) return;

    ql.addEventListener('click', (e) => {
        if (e.target === ql) {
            closeQuickLook();
        }
    });
}

function showQuickLook(item) {
    const ql = document.getElementById('quick-look');
    const qlTitle = document.getElementById('ql-title');
    const qlContent = document.getElementById('ql-content');
    if (!ql || !qlTitle || !qlContent) return;

    qlTitle.textContent = item.name;

    let fileContent = item.content;
    if (item.type === 'file' && fileContent === undefined && item.path && fileSystem) {
        try {
            fileContent = fileSystem.readFile(item.path);
        } catch (e) {}
    }

    if (item.type === 'folder') {
        let itemCount = 0;
        try {
            const items = fileSystem?.list(item.path) || [];
            itemCount = items.length;
        } catch (e) {}
        
        qlContent.innerHTML = `
            <div class="ql-icon-preview">
                ${IconGenerator.generate('folder', { size: 128 })}
                <div class="ql-info">
                    <div class="ql-info-name">${item.name}</div>
                    <div class="ql-info-detail">
                        文件夹<br>
                        ${itemCount} 个项目<br>
                        ${item.path}
                    </div>
                </div>
            </div>
        `;
    } else if (item.type === 'file' && fileContent !== undefined) {
        const isText = typeof fileContent === 'string';
        if (isText) {
            qlContent.innerHTML = `<div class="ql-text">${escapeHtml(fileContent)}</div>`;
        } else {
            qlContent.innerHTML = `
                <div class="ql-icon-preview">
                    ${IconGenerator.generate('notes', { size: 128 })}
                    <div class="ql-info">
                        <div class="ql-info-name">${item.name}</div>
                        <div class="ql-info-detail">
                            文稿<br>
                            ${item.path}
                        </div>
                    </div>
                </div>
            `;
        }
    } else if (item.appId) {
        const app = appManager?.getApp(item.appId);
        qlContent.innerHTML = `
            <div class="ql-icon-preview">
                ${IconGenerator.generate(app?.icon || 'default', { emoji: app?.emoji, size: 128 })}
                <div class="ql-info">
                    <div class="ql-info-name">${item.name}</div>
                    <div class="ql-info-detail">
                        应用程序<br>
                        版本 1.0<br>
                        ${app?.name || item.name}
                    </div>
                </div>
            </div>
        `;
    } else {
        qlContent.innerHTML = `
            <div class="ql-icon-preview">
                ${IconGenerator.generate('default', { size: 128 })}
                <div class="ql-info">
                    <div class="ql-info-name">${item.name}</div>
                    <div class="ql-info-detail">
                        ${item.path || ''}
                    </div>
                </div>
            </div>
        `;
    }

    ql.classList.add('show');
}

function closeQuickLook() {
    const ql = document.getElementById('quick-look');
    if (ql) {
        ql.classList.remove('show');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getSelectedItem() {
    const selectedDesktopIcon = document.querySelector('.desktop-icon.selected');
    if (selectedDesktopIcon) {
        const appId = selectedDesktopIcon.dataset.appId;
        const path = selectedDesktopIcon.dataset.path;
        const type = selectedDesktopIcon.dataset.type;
        const label = selectedDesktopIcon.querySelector('.desktop-icon-label')?.textContent;
        
        if (appId) {
            return { name: label, appId, type: 'app' };
        } else if (path) {
            return { name: label, path, type: type || 'file' };
        }
    }

    const activeWindow = document.querySelector('.window:not(.minimized):not(.minimizing)');
    if (activeWindow) {
        const selectedFinderItem = activeWindow.querySelector('.finder-list-item.selected, .finder-grid-item.selected');
        if (selectedFinderItem) {
            const path = selectedFinderItem.dataset.path;
            const type = selectedFinderItem.dataset.type;
            const name = path.split('/').pop();
            return { name, path, type: type || 'file' };
        }
    }

    return null;
}

function setupKeyboardShortcuts() {
    let cmdTabActive = false;
    let cmdTabIndex = 0;
    let cmdTabApps = [];

    function showAppSwitcher() {
        const switcher = document.getElementById('app-switcher');
        const itemsContainer = document.getElementById('app-switcher-items');
        if (!switcher || !itemsContainer || !appManager) return;

        const runningAppIds = Array.from(appManager.runningApps.values());
        const uniqueAppIds = [...new Set(runningAppIds)];
        
        if (uniqueAppIds.length === 0) {
            uniqueAppIds.push('finder');
        }

        cmdTabApps = uniqueAppIds;
        cmdTabIndex = 0;

        itemsContainer.innerHTML = '';
        cmdTabApps.forEach((appId, index) => {
            const app = appManager.getApp(appId);
            if (!app) return;
            
            const item = document.createElement('div');
            item.className = 'app-switcher-item' + (index === 0 ? ' selected' : '');
            item.dataset.appId = appId;
            item.innerHTML = `
                <div class="app-switcher-item-icon">${IconGenerator.generate(app.icon, { emoji: app.emoji })}</div>
                <div class="app-switcher-item-name">${app.name}</div>
            `;
            itemsContainer.appendChild(item);
        });

        switcher.classList.add('show');
    }

    function hideAppSwitcher() {
        const switcher = document.getElementById('app-switcher');
        if (switcher) {
            switcher.classList.remove('show');
        }
        
        if (cmdTabApps.length > 0 && appManager) {
            const selectedAppId = cmdTabApps[cmdTabIndex];
            const windows = windowManager?.getWindowsByApp(selectedAppId);
            if (windows && windows.length > 0) {
                const win = windows[0];
                if (win.minimized) {
                    windowManager.restoreWindow(win.id);
                } else {
                    windowManager.focusWindow(win.id);
                }
            } else {
                appManager.openApp(selectedAppId);
            }
        }
    }

    function selectNextApp(reverse = false) {
        const items = document.querySelectorAll('.app-switcher-item');
        if (items.length === 0) return;

        items[cmdTabIndex].classList.remove('selected');
        
        if (reverse) {
            cmdTabIndex = (cmdTabIndex - 1 + cmdTabApps.length) % cmdTabApps.length;
        } else {
            cmdTabIndex = (cmdTabIndex + 1) % cmdTabApps.length;
        }
        
        items[cmdTabIndex].classList.add('selected');
    }

    function cycleAppWindows() {
        if (!windowManager || !appManager) return;
        
        const activeWin = windowManager.getActiveWindow();
        if (!activeWin) return;
        
        const appWindows = windowManager.getWindowsByApp(activeWin.appName);
        if (appWindows.length <= 1) return;
        
        const currentIndex = appWindows.findIndex(w => w.id === activeWin.id);
        const nextIndex = (currentIndex + 1) % appWindows.length;
        const nextWin = appWindows[nextIndex];
        
        if (nextWin.minimized) {
            windowManager.restoreWindow(nextWin.id);
        } else {
            windowManager.focusWindow(nextWin.id);
        }
    }

    function hideCurrentApp() {
        if (!windowManager || !appManager) return;
        
        const activeWin = windowManager.getActiveWindow();
        if (!activeWin) return;
        
        const appWindows = windowManager.getWindowsByApp(activeWin.appName);
        appWindows.forEach(win => {
            if (!win.minimized) {
                windowManager.minimizeWindow(win.id);
            }
        });
    }

    function showDesktop() {
        if (!windowManager) return;
        
        const allWindows = Array.from(windowManager.windows.values());
        const anyVisible = allWindows.some(w => !w.minimized);
        
        allWindows.forEach(win => {
            if (anyVisible && !win.minimized) {
                windowManager.minimizeWindow(win.id);
            } else if (!anyVisible && win.minimized) {
                windowManager.restoreWindow(win.id);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        const hasModifier = e.metaKey || e.ctrlKey;
        
        if (hasModifier) {
            switch(e.key.toLowerCase()) {
                case 'w':
                    e.preventDefault();
                    const active = windowManager?.getActiveWindow();
                    if (active) windowManager.closeWindow(active.id);
                    break;
                case 'm':
                    e.preventDefault();
                    const act = windowManager?.getActiveWindow();
                    if (act) windowManager.minimizeWindow(act.id);
                    break;
                case 'q':
                    e.preventDefault();
                    const a = windowManager?.getActiveWindow();
                    if (a) {
                        const appWindows = windowManager.getWindowsByApp(a.appName);
                        appWindows.forEach(w => windowManager.closeWindow(w.id));
                    }
                    break;
                case 'tab':
                    e.preventDefault();
                    if (!cmdTabActive) {
                        cmdTabActive = true;
                        showAppSwitcher();
                    } else {
                        selectNextApp(e.shiftKey);
                    }
                    break;
                case '`':
                case '~':
                    e.preventDefault();
                    cycleAppWindows();
                    break;
                case 'h':
                    if (!e.shiftKey) {
                        e.preventDefault();
                        hideCurrentApp();
                    }
                    break;
            }
        }

        if ((e.metaKey || e.ctrlKey) && e.altKey) {
            switch(e.key.toLowerCase()) {
                case 'h':
                    e.preventDefault();
                    if (windowManager) {
                        const activeWin = windowManager.getActiveWindow();
                        if (activeWin) {
                            windowManager.windows.forEach((win, id) => {
                                if (win.appName !== activeWin.appName && !win.minimized) {
                                    windowManager.minimizeWindow(id);
                                }
                            });
                        }
                    }
                    break;
            }
        }

        if (e.key === 'F11') {
            e.preventDefault();
            showDesktop();
        }

        if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
            e.preventDefault();
            toggleSpotlight();
        }

        if (e.key === 'Escape') {
            const lp = document.getElementById('launchpad-overlay');
            if (lp) {
                appManager?.closeLaunchpad();
            }
            const ql = document.getElementById('quick-look');
            if (ql?.classList.contains('show')) {
                closeQuickLook();
                e.preventDefault();
            }
        }

        if (e.code === 'Space' && !e.metaKey && !e.ctrlKey && !e.altKey) {
            const ql = document.getElementById('quick-look');
            if (ql?.classList.contains('show')) {
                closeQuickLook();
                e.preventDefault();
            } else {
                const selected = getSelectedItem();
                if (selected) {
                    e.preventDefault();
                    showQuickLook(selected);
                }
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if ((e.key === 'Meta' || e.key === 'Control') && cmdTabActive) {
            cmdTabActive = false;
            hideAppSwitcher();
        }
    });
}

function setupTheme() {
    const saved = localStorage.getItem('macos_theme') || 'dark';
    setTheme(saved);
}

function setTheme(theme) {
    if (theme === 'auto') {
        const hour = new Date().getHours();
        theme = hour >= 6 && hour < 18 ? 'light' : 'dark';
    }
    document.body.dataset.theme = theme;
    localStorage.setItem('macos_theme', theme);
}

window.setTheme = setTheme;

function setupDesktopIcons() {
    const container = document.getElementById('desktop-icons');
    if (!container) return;
    
    renderDesktopIcons();
}

function renderDesktopIcons() {
    const container = document.getElementById('desktop-icons');
    if (!container) return;
    container.innerHTML = '';

    // 先放桌面应用快捷方式（常用应用放桌面）
    const desktopAppIds = ['macintosh-hd', 'safari', 'mail', 'notes', 'calculator', 'textedit', 'preview', 'stickies', 'terminal'];
    
    desktopAppIds.forEach((appId) => {
        if (appId === 'macintosh-hd') {
            // Macintosh HD 磁盘图标
            const icon = document.createElement('div');
            icon.className = 'desktop-icon';
            icon.innerHTML = `
                <div class="desktop-icon-img">${IconGenerator.generate('folder', { size: 64 })}</div>
                <div class="desktop-icon-label">Macintosh HD</div>
            `;
            icon.addEventListener('dblclick', () => {
                appManager?.openApp('finder');
            });
            container.appendChild(icon);
            return;
        }
        const app = appManager?.apps?.get(appId);
        if (!app) return;
        const icon = document.createElement('div');
        icon.className = 'desktop-icon desktop-app-shortcut';
        icon.dataset.appId = appId;

        icon.innerHTML = `
            <div class="desktop-icon-img">${IconGenerator.generate(app.icon, { emoji: app.emoji, size: 64 })}</div>
            <div class="desktop-icon-label">${app.name}</div>
        `;
        icon.addEventListener('dblclick', () => {
            appManager?.openApp(appId);
        });
        container.appendChild(icon);
    });

    // Show files from /Desktop
    const desktopFiles = fileSystem.list('/Desktop');
    
    desktopFiles.forEach(item => {
        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.setAttribute('draggable', 'true');
        icon.dataset.path = item.path;
        icon.dataset.type = item.type;
        
        icon.innerHTML = `
            <div class="desktop-icon-img">${IconGenerator.generate(item.type === 'folder' ? 'folder' : 'notes', { size: 48 })}</div>
            <div class="desktop-icon-label">${item.name}</div>
        `;
        
        icon.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({ path: item.path, type: item.type, name: item.name }));
            e.dataTransfer.effectAllowed = 'move';
            icon.style.opacity = '0.5';
        });
        icon.addEventListener('dragend', () => {
            icon.style.opacity = '1';
        });
        
        icon.addEventListener('dblclick', () => {
            if (item.type === 'folder') {
                appManager?.openApp('finder');
            } else {
                appManager?.openApp('textedit');
                setTimeout(() => {
                    const texteditBody = document.querySelector('.window:not(.minimizing) .textedit-content');
                    if (texteditBody) {
                        const content = fileSystem.readFile(item.path);
                        texteditBody.value = content || '';
                    }
                }, 300);
            }
        });
        container.appendChild(icon);
    });
}

function setupDesktopDrop() {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;

    desktop.addEventListener('dragover', (e) => {
        if (e.dataTransfer.types.includes('text/plain')) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            desktop.classList.add('drag-over');
        }
    });

    desktop.addEventListener('dragleave', (e) => {
        if (!desktop.contains(e.relatedTarget)) {
            desktop.classList.remove('drag-over');
        }
    });

    desktop.addEventListener('drop', (e) => {
        e.preventDefault();
        desktop.classList.remove('drag-over');
        
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data && data.path) {
                const success = fileSystem.moveFile(data.path, '/Desktop');
                if (success) {
                    renderDesktopIcons();
                    // Refresh any open Finder windows
                    const finderWindows = windowManager?.getWindowsByApp('finder');
                    if (finderWindows && finderWindows.length > 0) {
                        // Re-render active Finder
                        const activeWin = finderWindows[0];
                        if (activeWin && appManager) {
                            appManager.renderApp(activeWin.id, 'finder');
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Drop error:', err);
        }
    });
}

function setupScreensaver() {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, resetIdleTimer);
    });
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(showScreensaver, IDLE_TIMEOUT);
    
    if (screensaverActive) {
        hideScreensaver();
    }
}

function showScreensaver() {
    const screensaver = document.getElementById('screensaver');
    const content = document.getElementById('screensaver-content');
    if (!screensaver) return;
    
    screensaverActive = true;
    screensaver.classList.remove('hidden');
    
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        content.innerHTML = `<div class="screensaver-clock">${h}:${m}</div>`;
    }
    updateClock();
    content._interval = setInterval(updateClock, 1000);
}

function hideScreensaver() {
    const screensaver = document.getElementById('screensaver');
    const content = document.getElementById('screensaver-content');
    if (!screensaver) return;
    
    if (content._interval) clearInterval(content._interval);
    screensaverActive = false;
    screensaver.classList.add('hidden');
    lockScreen();
}

function lockScreen() {
    const lockScreen = document.getElementById('lock-screen');
    const desktop = document.getElementById('desktop');
    desktop?.classList.add('hidden');
    lockScreen?.classList.remove('hidden');
    lockScreen.style.opacity = '1';
    updateLockClock();
}

function shutdown() {
    const shutdown = document.getElementById('shutdown-screen');
    const desktop = document.getElementById('desktop');
    desktop?.classList.add('hidden');
    shutdown?.classList.remove('hidden');
}

function setupRubberBandSelection() {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;

    let isSelecting = false;
    let startX = 0, startY = 0;
    let selBox = null;

    desktop.addEventListener('mousedown', (e) => {
        // 仅在桌面空白区域（非图标、非窗口、非菜单）开始框选
        if (e.target.closest('.desktop-icon') || e.target.closest('.window') ||
            e.target.closest('.dock') || e.target.closest('.menubar') ||
            e.target.closest('.context-menu') || e.button !== 0) return;

        // 清除之前选中的图标
        document.querySelectorAll('.desktop-icon.selected').forEach(el => el.classList.remove('selected'));

        isSelecting = true;
        startX = e.clientX;
        startY = e.clientY;

        selBox = document.createElement('div');
        selBox.className = 'rubber-band';
        selBox.style.left = startX + 'px';
        selBox.style.top = startY + 'px';
        selBox.style.width = '0px';
        selBox.style.height = '0px';
        document.body.appendChild(selBox);

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isSelecting || !selBox) return;

        const curX = e.clientX;
        const curY = e.clientY;
        const left = Math.min(startX, curX);
        const top = Math.min(startY, curY);
        const width = Math.abs(curX - startX);
        const height = Math.abs(curY - startY);

        selBox.style.left = left + 'px';
        selBox.style.top = top + 'px';
        selBox.style.width = width + 'px';
        selBox.style.height = height + 'px';

        // 实时检测哪些图标在选框内
        const rect = selBox.getBoundingClientRect();
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            const iconRect = icon.getBoundingClientRect();
            const intersect = !(iconRect.right < rect.left || iconRect.left > rect.right ||
                               iconRect.bottom < rect.top || iconRect.top > rect.bottom);
            if (intersect) {
                icon.classList.add('selected');
            } else {
                icon.classList.remove('selected');
            }
        });
    });

    document.addEventListener('mouseup', () => {
        if (!isSelecting) return;
        isSelecting = false;
        if (selBox) {
            selBox.remove();
            selBox = null;
        }
    });
}

document.addEventListener('DOMContentLoaded', initSystem);
