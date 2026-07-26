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
    const appleMenu = document.getElementById('apple-menu');
    const appleDropdown = document.getElementById('apple-dropdown');
    const ccBtn = document.getElementById('control-center-btn');
    const ncBtn = document.getElementById('notif-center-btn');
    const searchBtn = document.getElementById('search-menu');
    
    appleMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllMenus();
        appleDropdown.classList.toggle('show');
        appleMenu.classList.toggle('active');
    });
    
    appleDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            handleAppleMenuAction(action);
            closeAllMenus();
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
    ).slice(0, 8);
    
    let html = '';
    if (matchedApps.length > 0) {
        html += '<div class="spotlight-section"><div class="spotlight-section-title">应用程序</div>';
        matchedApps.forEach((app, i) => {
            html += `
                <div class="spotlight-item ${i === 0 ? 'selected' : ''}" data-app="${app.id}">
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
    
    results.innerHTML = html;
    
    results.querySelectorAll('.spotlight-item').forEach(item => {
        item.addEventListener('click', () => {
            const appId = item.dataset.app;
            if (appId) {
                appManager.openApp(appId);
                document.getElementById('spotlight').classList.remove('show');
                document.getElementById('spotlight-input').value = '';
                results.innerHTML = '';
            }
        });
    });
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
        <div class="context-menu-item" data-action="new-folder">新建文件夹</div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" data-action="change-wallpaper">更改桌面背景...</div>
        <div class="context-menu-item" data-action="show-view-options">查看显示选项</div>
    `;
    
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.classList.add('show');
    
    menu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            if (action === 'change-wallpaper') {
                appManager?.openApp('settings');
                setTimeout(() => {
                    const settingsSidebar = document.querySelector('.settings-sidebar-item[data-tab="appearance"]');
                    settingsSidebar?.click();
                }, 300);
            }
            menu.classList.remove('show');
        });
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey) {
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
                    if (a) windowManager.closeWindow(a.id);
                    break;
            }
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
