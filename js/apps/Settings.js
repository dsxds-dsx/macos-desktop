window.renderSettings = function(body, sidebar, toolbar, windowId) {
    let currentTab = 'general';

    const wallpapers = [
        { id: 'default', name: ' Ventura 渐变', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
        { id: 'sunset', name: '日落', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' },
        { id: 'ocean', name: '海洋', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'forest', name: '森林', gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
        { id: 'night', name: '夜空', gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
        { id: 'peach', name: '蜜桃', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
        { id: 'aurora', name: '极光', gradient: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)' },
        { id: 'purple', name: '紫罗兰', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }
    ];

    const tabs = [
        { id: 'general', label: '通用', icon: '⚙️' },
        { id: 'wallpaper', label: '壁纸', icon: '🖼️' },
        { id: 'dock', label: '程序坞', icon: '📦' },
        { id: 'accessibility', label: '辅助功能', icon: '♿' },
        { id: 'about', label: '关于本机', icon: 'ℹ️' }
    ];

    let settings = JSON.parse(localStorage.getItem('macos_settings') || JSON.stringify({
        appearance: localStorage.getItem('macos_theme') || 'dark',
        wallpaper: 'default',
        dockSize: 56,
        dockPosition: 'bottom',
        magnification: true,
        reduceMotion: false,
        increaseContrast: false
    }));

    function saveSettings() {
        localStorage.setItem('macos_settings', JSON.stringify(settings));
    }

    function applyWallpaper(id) {
        const wp = wallpapers.find(w => w.id === id);
        if (wp) {
            document.getElementById('wallpaper').style.background = wp.gradient;
            localStorage.setItem('macos_wallpaper', id);
        }
    }

    const savedWp = localStorage.getItem('macos_wallpaper');
    if (savedWp) applyWallpaper(savedWp);

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="padding:8px;">
                ${tabs.map(tab => `
                    <div class="settings-sidebar-item ${currentTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
                        <div class="settings-sidebar-icon" style="background:${tab.id === 'general' ? 'var(--accent-blue)' : tab.id === 'wallpaper' ? 'var(--accent-purple)' : tab.id === 'dock' ? 'var(--accent-green)' : tab.id === 'accessibility' ? 'var(--accent-orange)' : 'var(--accent-gray)'}">${tab.icon}</div>
                        <span>${tab.label}</span>
                    </div>
                `).join('')}
            </div>
        `;

        sidebar.querySelectorAll('.settings-sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                currentTab = item.dataset.tab;
                render();
            });
        });
    }

    function renderContent() {
        let html = '';

        if (currentTab === 'general') {
            html = `
                <h2 style="margin-bottom:24px;font-size:24px;font-weight:600;">通用</h2>
                <div class="settings-group">
                    <div class="settings-group-title">外观</div>
                    <div class="settings-row">
                        <span class="settings-label">外观模式</span>
                        <div class="settings-control">
                            <button class="finder-view-btn ${settings.appearance === 'light' ? 'active' : ''}" data-appearance="light" style="padding:6px 12px;width:auto;">浅色</button>
                            <button class="finder-view-btn ${settings.appearance === 'dark' ? 'active' : ''}" data-appearance="dark" style="padding:6px 12px;width:auto;">深色</button>
                            <button class="finder-view-btn ${settings.appearance === 'auto' ? 'active' : ''}" data-appearance="auto" style="padding:6px 12px;width:auto;">自动</button>
                        </div>
                    </div>
                </div>
                <div class="settings-group">
                    <div class="settings-group-title">其他</div>
                    <div class="settings-row">
                        <span class="settings-label">默认浏览器</span>
                        <span style="color:var(--text-secondary);font-size:13px;">Safari 浏览器</span>
                    </div>
                </div>
            `;
        } else if (currentTab === 'wallpaper') {
            html = `
                <h2 style="margin-bottom:24px;font-size:24px;font-weight:600;">桌面与屏幕保护程序</h2>
                <div class="settings-group">
                    <div class="settings-group-title">桌面图片</div>
                    <div class="wallpaper-grid">
                        ${wallpapers.map(wp => `
                            <div class="wallpaper-item ${settings.wallpaper === wp.id ? 'selected' : ''}" data-wallpaper="${wp.id}">
                                <div class="wallpaper-gradient" style="background:${wp.gradient};"></div>
                                <div style="position:absolute;bottom:8px;left:8px;color:#fff;font-size:12px;text-shadow:0 1px 3px rgba(0,0,0,0.5);">${wp.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (currentTab === 'dock') {
            html = `
                <h2 style="margin-bottom:24px;font-size:24px;font-weight:600;">程序坞与菜单栏</h2>
                <div class="settings-group">
                    <div class="settings-group-title">程序坞</div>
                    <div class="settings-row">
                        <span class="settings-label">大小</span>
                        <input type="range" class="dock-slider" min="32" max="80" value="${settings.dockSize}" id="dock-size-slider" style="width:150px;">
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">放大</span>
                        <div class="toggle-switch ${settings.magnification ? 'active' : ''}" data-toggle="magnification"></div>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">置于屏幕上的位置</span>
                        <div class="settings-control">
                            <button class="finder-view-btn ${settings.dockPosition === 'left' ? 'active' : ''}" data-position="left" style="padding:6px 12px;width:auto;">左边</button>
                            <button class="finder-view-btn ${settings.dockPosition === 'bottom' ? 'active' : ''}" data-position="bottom" style="padding:6px 12px;width:auto;">底部</button>
                            <button class="finder-view-btn ${settings.dockPosition === 'right' ? 'active' : ''}" data-position="right" style="padding:6px 12px;width:auto;">右边</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentTab === 'accessibility') {
            html = `
                <h2 style="margin-bottom:24px;font-size:24px;font-weight:600;">辅助功能</h2>
                <div class="settings-group">
                    <div class="settings-group-title">显示</div>
                    <div class="settings-row">
                        <span class="settings-label">减少动态效果</span>
                        <div class="toggle-switch ${settings.reduceMotion ? 'active' : ''}" data-toggle="reduceMotion"></div>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">增强对比度</span>
                        <div class="toggle-switch ${settings.increaseContrast ? 'active' : ''}" data-toggle="increaseContrast"></div>
                    </div>
                </div>
                <div class="settings-group">
                    <div class="settings-group-title">缩放</div>
                    <div class="settings-row">
                        <span class="settings-label">使用键盘快捷键缩放</span>
                        <div class="toggle-switch" data-toggle="zoom"></div>
                    </div>
                </div>
            `;
        } else if (currentTab === 'about') {
            html = `
                <div style="display:flex;flex-direction:column;align-items:center;padding:40px;text-align:center;">
                    <svg viewBox="0 0 170 170" width="100" height="100" style="color:var(--text-primary);margin-bottom:16px;">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.98-3.17-14.35-3.17-4.58 0-9.5 1.05-14.76 3.17-5.27 2.13-9.51 3.24-12.75 3.35-4.93.21-9.84-1.96-14.75-6.52-3.12-2.73-7.04-7.41-11.73-14.04-5.03-7.08-9.17-15.29-12.41-24.65C13.1 110.9 11.5 101.41 11.5 92.3c0-10.05 2.18-18.88 6.55-26.46 3.48-6.09 8.13-10.87 13.95-14.36 5.82-3.48 12.12-5.27 18.9-5.39 3.91 0 9.04 1.21 15.38 3.59 6.34 2.39 10.41 3.6 12.21 3.6 1.34 0 5.87-1.42 13.56-4.24 7.29-2.62 13.44-3.71 18.5-3.28 13.76 1.11 24.08 6.56 30.93 16.38-12.3 7.46-18.38 17.9-18.22 31.31.14 10.45 3.91 19.15 11.29 26.06 3.34 3.18 7.07 5.63 11.22 7.37-.9 2.61-1.85 5.11-2.85 7.51-.28.66-.56 1.3-.85 1.93zM119.09 7.24c0 8.2-2.99 15.83-8.94 22.84-7.17 8.32-15.85 13.14-25.33 12.38a25.22 25.22 0 0 1-.19-3.07c0-7.88 3.43-16.28 9.4-22.61 2.98-3.2 6.69-5.83 11.14-7.9 4.43-2.04 8.55-3.15 12.32-3.33.16 1.13.24 2.27.24 3.41z" fill="currentColor"/>
                    </svg>
                    <h2 style="font-size:28px;font-weight:600;margin-bottom:4px;">macOS</h2>
                    <div style="font-size:14px;color:var(--text-secondary);margin-bottom:24px;">网页版 1.0</div>
                    <div style="width:100%;max-width:350px;">
                        <div class="settings-row"><span class="settings-label">处理器</span><span style="font-size:13px;">虚拟 Apple M 系列</span></div>
                        <div class="settings-row"><span class="settings-label">内存</span><span style="font-size:13px;">8 GB</span></div>
                        <div class="settings-row"><span class="settings-label">启动磁盘</span><span style="font-size:13px;">Macintosh HD</span></div>
                        <div class="settings-row"><span class="settings-label">序列号</span><span style="font-size:13px;">W1234567890</span></div>
                        <div class="settings-row"><span class="settings-label">系统版本</span><span style="font-size:13px;">13.0</span></div>
                    </div>
                </div>
            `;
        }

        body.innerHTML = `<div class="settings-content">${html}</div>`;
        body.className = 'window-body settings-body';

        body.querySelectorAll('[data-appearance]').forEach(btn => {
            btn.addEventListener('click', () => {
                settings.appearance = btn.dataset.appearance;
                saveSettings();
                window.setTheme(settings.appearance);
                render();
            });
        });

        body.querySelectorAll('[data-wallpaper]').forEach(item => {
            item.addEventListener('click', () => {
                settings.wallpaper = item.dataset.wallpaper;
                saveSettings();
                applyWallpaper(settings.wallpaper);
                render();
            });
        });

        body.querySelectorAll('[data-toggle]').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const key = toggle.dataset.toggle;
                settings[key] = !settings[key];
                saveSettings();
                render();
            });
        });

        const sizeSlider = body.querySelector('#dock-size-slider');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                settings.dockSize = parseInt(e.target.value);
                saveSettings();
                const dock = document.getElementById('dock');
                if (dock) {
                    dock.querySelectorAll('.dock-icon').forEach(icon => {
                        icon.style.width = settings.dockSize + 'px';
                        icon.style.height = settings.dockSize + 'px';
                    });
                }
            });
        }

        body.querySelectorAll('[data-position]').forEach(btn => {
            btn.addEventListener('click', () => {
                settings.dockPosition = btn.dataset.position;
                saveSettings();
                const dockContainer = document.getElementById('dock-container');
                if (dockContainer) {
                    dockContainer.style.bottom = settings.dockPosition === 'bottom' ? '8px' : '';
                    dockContainer.style.left = settings.dockPosition === 'left' ? '8px' : '';
                    dockContainer.style.right = settings.dockPosition === 'right' ? '8px' : '';
                }
                render();
            });
        });
    }

    function render() {
        renderSidebar();
        renderContent();
    }

    render();
};
