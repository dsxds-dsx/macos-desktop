window.renderSettings = function(body, sidebar, toolbar, windowId) {
    let currentTab = 'general';
    let searchQuery = '';

    const wallpapers = [
        { id: 'default', name: 'Ventura 渐变', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
        { id: 'sunset', name: '日落', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' },
        { id: 'ocean', name: '海洋', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'forest', name: '森林', gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
        { id: 'night', name: '夜空', gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
        { id: 'peach', name: '蜜桃', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
        { id: 'aurora', name: '极光', gradient: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)' },
        { id: 'purple', name: '紫罗兰', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }
    ];

    // SF Symbol-style colored icons
    const sf = (svgInner, bg) => `<div class="settings-sf-icon" style="background:${bg};">${svgInner}</div>`;
    const ic = {
        wifi: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff"><path d="M8 4C5.4 4 3 5 1.2 6.7L2.6 8c1.5-1.4 3.4-2.1 5.4-2.1s3.9.7 5.4 2.1l1.4-1.3C13 5 10.6 4 8 4zm0 3.4c-1.6 0-3 .6-4.1 1.6L8 13.2l4.1-4.2C11 8 9.6 7.4 8 7.4z"/></svg>`,
        bluetooth: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l6 6-3 3V2l3 3-6 6"/></svg>`,
        network: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"><path d="M2 12h12M3 9h10M5 6h6M7 3h2"/></svg>`,
        notifications: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff"><path d="M8 2a4 4 0 0 0-4 4v3l-1 2v1h10v-1l-1-2V6a4 4 0 0 0-4-4zm0 12a1.7 1.7 0 0 0 1.5-1h-3A1.7 1.7 0 0 0 8 14z"/></svg>`,
        sound: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h2l3-2.5v9L5 10H3z"/><path d="M11 5a4 4 0 0 1 0 6M12.5 3.5a6.5 6.5 0 0 1 0 9"/></svg>`,
        appearance: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff"><path d="M8 1.5a6.5 6.5 0 1 0 0 13c.4 0 .7-.3.7-.7 0-.2-.1-.4-.3-.5a1.7 1.7 0 0 1 1.2-3h1A4 4 0 0 0 14.5 6c0-2.5-2.9-4.5-6.5-4.5z"/></svg>`,
        wallpaper: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff"><path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h9A1.5 1.5 0 0 1 14 4.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5z"/><circle cx="6" cy="6.5" r="1.1" fill="#f59e0b"/><path d="M3 12l3-3 2.5 2L10 9l3 3v0.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5z" fill="#000" opacity="0.2"/></svg>`,
        dock: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.3"><rect x="2.5" y="9" width="3" height="3" rx="0.6"/><rect x="6.5" y="9" width="3" height="3" rx="0.6"/><rect x="10.5" y="9" width="3" height="3" rx="0.6"/><rect x="6.5" y="4.5" width="3" height="3" rx="0.6"/></svg>`,
        control: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.3"><rect x="2.5" y="2.5" width="5" height="5" rx="1.5"/><rect x="8.5" y="8.5" width="5" height="5" rx="1.5"/></svg>`,
        siri: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2.5" fill="#000" opacity="0.15"/></svg>`,
        privacy: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff"><path d="M8 1.5L3 3.5V8c0 3.4 2.1 5.9 5 7 2.9-1.1 5-3.6 5-7V3.5L8 1.5z" stroke="#fff" stroke-width="1.1" fill="none"/><path d="M5.5 8l1.7 1.7L10.5 6" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        desktop: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.3"><rect x="2" y="3" width="12" height="9" rx="1"/><rect x="1" y="11.5" width="14" height="1.5" rx="0.5" fill="#fff" stroke="none"/></svg>`,
        screensaver: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff"><circle cx="8" cy="8" r="6" fill="none" stroke="#fff" stroke-width="1.3"/><path d="M8 4v4l2.5 1.5" stroke="#fff" stroke-width="1.3" stroke-linecap="round" fill="none"/></svg>`,
        battery: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.1"><rect x="1.5" y="5.5" width="11" height="5" rx="1.2"/><rect x="13" y="7" width="1.5" height="2" rx="0.4" fill="#fff" stroke="none"/><rect x="2.5" y="6.5" width="7" height="3" fill="#fff" stroke="none"/></svg>`,
        keyboard: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1"><rect x="1.5" y="4" width="13" height="8" rx="1.5"/><path d="M3.5 7h1M6 7h1M8.5 7h1M11 7h1M5 9.5h6" stroke-linecap="round"/></svg>`,
        trackpad: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M5 5l-1.5 3M11 5l1.5 3"/></svg>`,
        accessibility: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff"><circle cx="8" cy="3" r="1.5"/><path d="M5 5l3 1 3-1M5 6.5l3 1 3-1M8 7v5" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`,
        general: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff"><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M13 3l-1.4 1.4M4.4 11.6L3 13" stroke="#fff" stroke-width="1.3" stroke-linecap="round" fill="none"/></svg>`,
        about: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.3"><circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 11v.5" stroke-linecap="round"/></svg>`
    };

    const tabs = [
        { id: 'profile', label: 'Apple 账户', type: 'profile' },
        { id: 'wifi', label: 'Wi-Fi', icon: sf(ic.wifi, 'linear-gradient(135deg,#3a82f7,#0a84ff)') },
        { id: 'bluetooth', label: '蓝牙', icon: sf(ic.bluetooth, 'linear-gradient(135deg,#3a82f7,#0a84ff)') },
        { id: 'network', label: '网络', icon: sf(ic.network, 'linear-gradient(135deg,#8e8e93,#48484a)') },
        { id: 'notifications', label: '通知', icon: sf(ic.notifications, 'linear-gradient(135deg,#ff3b30,#ff453a)') },
        { id: 'sound', label: '声音', icon: sf(ic.sound, 'linear-gradient(135deg,#ff2d55,#ff375f)') },
        { id: 'appearance', label: '外观', icon: sf(ic.appearance, 'linear-gradient(135deg,#5856d6,#1d1d1f)') },
        { id: 'general', label: '通用', icon: sf(ic.general, 'linear-gradient(135deg,#8e8e93,#48484a)') },
        { id: 'wallpaper', label: '墙纸', icon: sf(ic.wallpaper, 'linear-gradient(135deg,#34c759,#30d158)') },
        { id: 'desktop', label: '桌面与程序坞', icon: sf(ic.desktop, 'linear-gradient(135deg,#3a82f7,#0a84ff)') },
        { id: 'dock', label: '程序坞', icon: sf(ic.dock, 'linear-gradient(135deg,#34c759,#30d158)') },
        { id: 'control', label: '控制中心', icon: sf(ic.control, 'linear-gradient(135deg,#ff9500,#ff7800)') },
        { id: 'siri', label: 'Siri', icon: sf(ic.siri, 'linear-gradient(135deg,#1d1d1f,#5e5ce6)') },
        { id: 'accessibility', label: '辅助功能', icon: sf(ic.accessibility, 'linear-gradient(135deg,#3a82f7,#0a84ff)') },
        { id: 'privacy', label: '隐私与安全性', icon: sf(ic.privacy, 'linear-gradient(135deg,#ff3b30,#ff453a)') },
        { id: 'about', label: '关于本机', icon: sf(ic.about, 'linear-gradient(135deg,#8e8e93,#48484a)') }
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
        const visibleTabs = tabs.filter(t => {
            if (searchQuery) {
                return t.label.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        });

        sidebar.innerHTML = `
            <div class="settings-sidebar">
                <div class="settings-search-wrap">
                    <svg class="settings-search-icon" viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                    <input type="text" class="settings-search-input" id="settings-search" placeholder="搜索" value="${searchQuery}" spellcheck="false">
                </div>
                <div class="settings-sidebar-scroll">
                    ${visibleTabs.map(tab => {
                        if (tab.type === 'profile') {
                            return `
                                <div class="settings-profile-item">
                                    <div class="settings-profile-avatar">
                                        <svg viewBox="0 0 32 32" width="32" height="32"><circle cx="16" cy="13" r="6" fill="#fff"/><path d="M5 27c0-6 5-10 11-10s11 4 11 10" fill="#fff"/></svg>
                                    </div>
                                    <div class="settings-profile-text">
                                        <div class="settings-profile-name">DSX</div>
                                        <div class="settings-profile-sub">Apple 账户</div>
                                    </div>
                                </div>
                            `;
                        }
                        const active = currentTab === tab.id ? 'active' : '';
                        return `
                            <div class="settings-sidebar-item ${active}" data-tab="${tab.id}">
                                ${tab.icon || ''}
                                <span class="settings-sidebar-label">${tab.label}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('.settings-sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                currentTab = item.dataset.tab;
                render();
            });
        });

        const searchInput = sidebar.querySelector('#settings-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                renderSidebar();
            });
        }
    }

    function segmentedControl(name, options, currentValue) {
        return `
            <div class="seg-control" data-seg="${name}">
                ${options.map(opt => `
                    <button class="seg-control-btn ${currentValue === opt.value ? 'active' : ''}" data-value="${opt.value}">${opt.label}</button>
                `).join('')}
            </div>
        `;
    }

    function renderContent() {
        let html = '';

        if (currentTab === 'profile' || currentTab === 'about') {
            html = `
                <div class="settings-profile-hero">
                    <svg viewBox="0 0 100 100" width="84" height="84" class="settings-hero-avatar">
                        <defs>
                            <linearGradient id="g-${windowId}" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#5ac8fa"/>
                                <stop offset="100%" stop-color="#0a84ff"/>
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="48" fill="url(#g-${windowId})"/>
                        <circle cx="50" cy="40" r="18" fill="#fff"/>
                        <path d="M18 88c0-17 14-28 32-28s32 11 32 28" fill="#fff"/>
                    </svg>
                    <h2 class="settings-profile-title">DSX</h2>
                    <div class="settings-profile-id">Apple 账户 · 个人</div>
                </div>
                <div class="settings-card">
                    <div class="settings-row">
                        <span class="settings-label">姓名</span>
                        <span class="settings-value">DSX</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">Apple ID</span>
                        <span class="settings-value">dsx@icloud.com</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">iCloud 储存空间</span>
                        <span class="settings-value">5 GB（剩余 3.2 GB）</span>
                    </div>
                </div>
                <div class="settings-card">
                    <div class="settings-row">
                        <span class="settings-label">处理器</span>
                        <span class="settings-value">虚拟 Apple M 系列</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">内存</span>
                        <span class="settings-value">8 GB</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">启动磁盘</span>
                        <span class="settings-value">Macintosh HD</span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">序列号</span>
                        <span class="settings-value">W1234567890</span>
                    </div>
                    <div class="settings-row last">
                        <span class="settings-label">系统版本</span>
                        <span class="settings-value">macOS Sonoma 14.0</span>
                    </div>
                </div>
            `;
        } else if (currentTab === 'wifi') {
            html = `
                <h2 class="settings-page-title">Wi-Fi</h2>
                <div class="settings-card">
                    <div class="settings-row">
                        <div class="settings-row-main">
                            <div class="settings-label">Wi-Fi</div>
                            <div class="settings-hint">与附近的 Wi-Fi 网络连接</div>
                        </div>
                        <div class="toggle-switch active" data-toggle="wifi"></div>
                    </div>
                </div>
                <div class="settings-section-header">网络</div>
                <div class="settings-card">
                    <div class="settings-row">
                        <span class="settings-label"><span class="settings-wifi-icon"></span>Home-5G</span>
                        <span class="settings-value"><span class="settings-link">断开</span></span>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label"><span class="settings-wifi-icon weak"></span>CoffeeShop</span>
                        <span class="settings-value"><span class="settings-link">连接</span></span>
                    </div>
                    <div class="settings-row last">
                        <span class="settings-label"><span class="settings-wifi-icon medium"></span>iPhone</span>
                        <span class="settings-value"><span class="settings-link">连接</span></span>
                    </div>
                </div>
            `;
        } else if (currentTab === 'bluetooth') {
            html = `
                <h2 class="settings-page-title">蓝牙</h2>
                <div class="settings-card">
                    <div class="settings-row">
                        <div class="settings-row-main">
                            <div class="settings-label">蓝牙</div>
                            <div class="settings-hint">与附近的蓝牙设备连接</div>
                        </div>
                        <div class="toggle-switch active" data-toggle="bluetooth"></div>
                    </div>
                </div>
                <div class="settings-section-header">我的设备</div>
                <div class="settings-card">
                    <div class="settings-row">
                        <span class="settings-label">Magic Mouse</span>
                        <span class="settings-value">已连接 · 86%</span>
                    </div>
                    <div class="settings-row last">
                        <span class="settings-label">AirPods Pro</span>
                        <span class="settings-value"><span class="settings-link">连接</span></span>
                    </div>
                </div>
            `;
        } else if (currentTab === 'general') {
            html = `
                <h2 class="settings-page-title">通用</h2>
                <div class="settings-card">
                    <div class="settings-row" style="cursor:default;">
                        <span class="settings-label">关于</span>
                        <span class="settings-value" style="color:var(--text-tertiary);">macOS Sonoma 14.5</span>
                    </div>
                    <div class="settings-row" style="cursor:default;">
                        <span class="settings-label">芯片</span>
                        <span class="settings-value" style="color:var(--text-tertiary);">Apple M3 Pro</span>
                    </div>
                    <div class="settings-row" style="cursor:default;">
                        <span class="settings-label">内存</span>
                        <span class="settings-value" style="color:var(--text-tertiary);">18 GB</span>
                    </div>
                    <div class="settings-row last" style="cursor:default;">
                        <span class="settings-label">序列号</span>
                        <span class="settings-value" style="color:var(--text-tertiary);">C02XK1TZLZG7</span>
                    </div>
                </div>
                <div class="settings-section-header">软件更新</div>
                <div class="settings-card">
                    <div class="settings-row last">
                        <span class="settings-label">自动更新</span>
                        <div class="toggle-switch ${settings.autoUpdate !== false ? 'active' : ''}" data-toggle="autoUpdate"></div>
                    </div>
                </div>
                <div class="settings-section-header">默认网页浏览器</div>
                <div class="settings-card">
                    <div class="settings-row last">
                        <span class="settings-label">默认浏览器</span>
                        <select class="settings-select" id="default-browser-select">
                            <option ${!settings.defaultBrowser || settings.defaultBrowser === 'safari' ? 'selected' : ''} value="safari">Safari</option>
                            <option ${settings.defaultBrowser === 'chrome' ? 'selected' : ''} value="chrome">Chrome</option>
                            <option ${settings.defaultBrowser === 'firefox' ? 'selected' : ''} value="firefox">Firefox</option>
                        </select>
                    </div>
                </div>
                <div class="settings-section-header">存储空间</div>
                <div class="settings-card">
                    <div class="settings-row last" style="flex-direction:column;align-items:stretch;gap:8px;">
                        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-tertiary);">
                            <span>已使用 312 GB</span>
                            <span>剩余 488 GB</span>
                        </div>
                        <div style="height:8px;background:var(--input-bg);border-radius:4px;overflow:hidden;display:flex;">
                            <div style="width:31%;background:#0a84ff;"></div>
                            <div style="width:12%;background:#34c759;"></div>
                            <div style="width:8%;background:#ff9500;"></div>
                            <div style="width:5%;background:#ff453a;"></div>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentTab === 'appearance') {
            html = `
                <h2 class="settings-page-title">外观</h2>
                <div class="settings-card">
                    <div class="settings-row">
                        <span class="settings-label">外观</span>
                        <div class="settings-appearance-picker">
                            <div class="settings-appearance-option ${settings.appearance === 'light' ? 'selected' : ''}" data-appearance="light">
                                <div class="settings-appearance-preview light"></div>
                                <div class="settings-appearance-label">浅色</div>
                            </div>
                            <div class="settings-appearance-option ${settings.appearance === 'dark' ? 'selected' : ''}" data-appearance="dark">
                                <div class="settings-appearance-preview dark"></div>
                                <div class="settings-appearance-label">深色</div>
                            </div>
                            <div class="settings-appearance-option ${settings.appearance === 'auto' ? 'selected' : ''}" data-appearance="auto">
                                <div class="settings-appearance-preview auto"></div>
                                <div class="settings-appearance-label">自动</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="settings-section-header">强调色</div>
                <div class="settings-card">
                    <div class="settings-row last">
                        <span class="settings-label">${settings.accent === 'purple' ? '紫色' : settings.accent === 'graphite' ? '石墨色' : '蓝色'}</span>
                        <div class="seg-control" data-seg="accent">
                            <button class="seg-control-btn ${(!settings.accent || settings.accent === 'blue') ? 'active' : ''}" data-value="blue">蓝色</button>
                            <button class="seg-control-btn ${settings.accent === 'purple' ? 'active' : ''}" data-value="purple">紫色</button>
                            <button class="seg-control-btn ${settings.accent === 'graphite' ? 'active' : ''}" data-value="graphite">石墨色</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentTab === 'wallpaper' || currentTab === 'desktop') {
            html = `
                <h2 class="settings-page-title">桌面与屏幕保护程序</h2>
                <div class="settings-section-header">桌面图片</div>
                <div class="wallpaper-grid">
                    ${wallpapers.map(wp => `
                        <div class="wallpaper-item ${settings.wallpaper === wp.id ? 'selected' : ''}" data-wallpaper="${wp.id}">
                            <div class="wallpaper-gradient" style="background:${wp.gradient};"></div>
                            <div class="wallpaper-label">${wp.name}</div>
                            ${settings.wallpaper === wp.id ? `<svg class="wallpaper-check" viewBox="0 0 14 14" width="14" height="14"><path d="M3 7.5l3 3 5-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (currentTab === 'dock') {
            html = `
                <h2 class="settings-page-title">程序坞与菜单栏</h2>
                <div class="settings-card">
                    <div class="settings-row">
                        <span class="settings-label">大小</span>
                        <div class="settings-row-control">
                            <input type="range" class="macos-slider" min="32" max="80" value="${settings.dockSize}" id="dock-size-slider">
                            <span class="settings-slider-value">${settings.dockSize}px</span>
                        </div>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">放大</span>
                        <div class="toggle-switch ${settings.magnification ? 'active' : ''}" data-toggle="magnification"></div>
                    </div>
                    <div class="settings-row last">
                        <span class="settings-label">屏幕上的位置</span>
                        <div class="seg-control" data-seg="dock-position">
                            <button class="seg-control-btn ${settings.dockPosition === 'left' ? 'active' : ''}" data-value="left">左边</button>
                            <button class="seg-control-btn ${settings.dockPosition === 'bottom' ? 'active' : ''}" data-value="bottom">底部</button>
                            <button class="seg-control-btn ${settings.dockPosition === 'right' ? 'active' : ''}" data-value="right">右边</button>
                        </div>
                    </div>
                </div>
                <div class="settings-section-header">其他</div>
                <div class="settings-card">
                    <div class="settings-row last">
                        <span class="settings-label">最小化窗口时使用</span>
                        <div class="seg-control" data-seg="min-effect">
                            <button class="seg-control-btn active" data-value="genie">神奇效果</button>
                            <button class="seg-control-btn" data-value="scale">缩放</button>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentTab === 'accessibility') {
            html = `
                <h2 class="settings-page-title">辅助功能</h2>
                <div class="settings-card">
                    <div class="settings-row">
                        <div class="settings-row-main">
                            <div class="settings-label">减少动态效果</div>
                            <div class="settings-hint">减少屏幕上的动画</div>
                        </div>
                        <div class="toggle-switch ${settings.reduceMotion ? 'active' : ''}" data-toggle="reduceMotion"></div>
                    </div>
                    <div class="settings-row last">
                        <div class="settings-row-main">
                            <div class="settings-label">增强对比度</div>
                            <div class="settings-hint">提高界面元素对比度</div>
                        </div>
                        <div class="toggle-switch ${settings.increaseContrast ? 'active' : ''}" data-toggle="increaseContrast"></div>
                    </div>
                </div>
            `;
        } else if (currentTab === 'sound') {
            html = `
                <h2 class="settings-page-title">声音</h2>
                <div class="settings-card">
                    <div class="settings-row">
                        <span class="settings-label">主音量</span>
                        <div class="settings-row-control">
                            <span class="settings-volume-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12z"/></svg></span>
                            <input type="range" class="macos-slider" min="0" max="100" value="60">
                            <span class="settings-volume-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zm4-2.5v5l-2-1.5v-2l2-1.5zM18.5 8v8l3-2.5v-3l-3-2.5z"/></svg></span>
                        </div>
                    </div>
                    <div class="settings-row last">
                        <span class="settings-label">静音</span>
                        <div class="toggle-switch" data-toggle="mute"></div>
                    </div>
                </div>
            `;
        } else {
            html = `
                <h2 class="settings-page-title">${tabs.find(t => t.id === currentTab)?.label || '设置'}</h2>
                <div class="settings-card">
                    <div class="settings-row last">
                        <div class="settings-row-main">
                            <div class="settings-label">此面板正在开发中</div>
                            <div class="settings-hint">敬请期待更多 macOS 风格的设置项</div>
                        </div>
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
                if (key in settings) {
                    settings[key] = !settings[key];
                    saveSettings();
                } else {
                    toggle.classList.toggle('active');
                }
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
                renderContent();
            });
        }

        body.querySelectorAll('[data-seg="dock-position"] .seg-control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                settings.dockPosition = btn.dataset.value;
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
