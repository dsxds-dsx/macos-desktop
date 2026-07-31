// TestFlight (macOS Sonoma Style)
window.renderTestFlight = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_testflight_state';

    const ICONS = {
        profile: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        testing: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31a4 4 0 0 0-2.34 7.36L4 22h16l-3.66-5.33A4 4 0 0 0 14 9.31V2M8 2h8M9 14h6"/></svg>`,
        accepted: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        expired: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
        code: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        install: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        open: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
        refresh: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
        back: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
        share: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>`
    };

    const APPS = [
        { id: 1, name: 'PhotoMagic',     icon: 'camera',  dev: 'Magic Labs',     status: 'testing',  version: '2.1.0',         build: 156, lastUpdate: '2 小时前', expires: 45,  size: '85 MB',   rating: 4.6, color: '#FF3B30', gradient: 'linear-gradient(135deg, #FF6961, #FF3B30)', desc: '专业的照片编辑与魔法滤镜应用，支持 RAW 处理与 AI 修图。' },
        { id: 2, name: 'TaskFlow',       icon: 'tasks',   dev: 'Flow Inc.',      status: 'testing',  version: '3.0.0 beta 2',   build: 204, lastUpdate: '今天',     expires: 60,  size: '142 MB',  rating: 4.8, color: '#007AFF', gradient: 'linear-gradient(135deg, #5AC8FA, #007AFF)', desc: '新一代的任务管理工具，整合日历、笔记和提醒事项。' },
        { id: 3, name: 'SoundWave',      icon: 'audio',   dev: 'Wave Studios',   status: 'testing',  version: '1.5.0',         build: 89,  lastUpdate: '昨天',     expires: 30,  size: '210 MB',  rating: 4.4, color: '#AF52DE', gradient: 'linear-gradient(135deg, #D8B4FE, #AF52DE)', desc: '专业的音频制作与混音工具，支持空间音频与多轨录制。' },
        { id: 4, name: 'Fitness+',       icon: 'fitness', dev: 'Health Tech',    status: 'testing',  version: '2.3.1',         build: 178, lastUpdate: '3 天前',   expires: 15,  size: '95 MB',   rating: 4.7, color: '#34C759', gradient: 'linear-gradient(135deg, #63E673, #34C759)', desc: 'Apple Fitness+ 训练助手，跟踪心率、卡路里与训练进度。' },
        { id: 5, name: 'PixelEditor',    icon: 'pixel',   dev: 'Pixel Team',     status: 'expired',  version: '1.0.0',         build: 1,   lastUpdate: '90 天前',  expires: -5,  size: '128 MB',  rating: 4.2, color: '#FF9500', gradient: 'linear-gradient(135deg, #FFB340, #FF9500)', desc: '像素艺术创作工具，提供丰富的画笔与图层支持。' },
        { id: 6, name: 'CodeBuddy',      icon: 'code',    dev: 'CodeBase',       status: 'accepted', version: '4.2.0',         build: 312, lastUpdate: '1 周前',   expires: 50,  size: '180 MB',  rating: 4.9, color: '#5856D6', gradient: 'linear-gradient(135deg, #7B79FF, #5856D6)', desc: 'AI 辅助编程工具，支持多种语言与代码补全。' },
        { id: 7, name: 'MindMap Pro',    icon: 'mind',    dev: 'Think Studio',   status: 'testing',  version: '5.0.0 beta',    build: 78,  lastUpdate: '5 小时前', expires: 25,  size: '76 MB',   rating: 4.5, color: '#FF2D55', gradient: 'linear-gradient(135deg, #FF6B8B, #FF2D55)', desc: '思维导图与头脑风暴工具，支持多人实时协作。' },
        { id: 8, name: 'CloudSync',      icon: 'cloud',   dev: 'CloudOps',       status: 'expired',  version: '0.9.2',         build: 22,  lastUpdate: '60 天前',  expires: -10, size: '52 MB',   rating: 4.0, color: '#5AC8FA', gradient: 'linear-gradient(135deg, #80D8FF, #5AC8FA)', desc: '云存储同步客户端，支持多种云服务统一管理。' },
        { id: 9, name: 'Notes Plus',     icon: 'note',    dev: 'NoteMakers',     status: 'accepted', version: '6.1.0',         build: 412, lastUpdate: '2 周前',   expires: 80,  size: '110 MB',  rating: 4.7, color: '#FFCC00', gradient: 'linear-gradient(135deg, #FFE066, #FFCC00)', desc: '强大的笔记应用，支持手写、语音、图片与 markdown。' }
    ];

    const APP_ICONS = {
        camera:  `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
        tasks:   `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
        audio:   `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
        fitness: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11M17.5 17.5h-11M6.5 6.5a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3M17.5 6.5a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3M9 12h6"/></svg>`,
        pixel:   `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg>`,
        code:    `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        mind:    `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M9.5 10.5L6 7.5M14.5 10.5L18 7.5M9.5 13.5L6 16.5M14.5 13.5L18 16.5"/></svg>`,
        cloud:   `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.7-1.5 4 4 0 0 0 .7 7.5z"/></svg>`,
        note:    `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`
    };

    let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
        activeTab: 'testing',
        selectedAppId: null,
        installedApps: [6, 9]
    };

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function render() {
        const filtered = APPS.filter(a => {
            if (state.activeTab === 'all') return true;
            return a.status === state.activeTab;
        });
        const counts = {
            testing: APPS.filter(a => a.status === 'testing').length,
            accepted: APPS.filter(a => a.status === 'accepted').length,
            expired: APPS.filter(a => a.status === 'expired').length
        };
        const currentApp = state.selectedAppId ? APPS.find(a => a.id === state.selectedAppId) : null;

        body.innerHTML = `
            <div class="tf-app">
                <aside class="tf-side">
                    <div class="tf-side-header">
                        <div class="tf-side-eyebrow">BETA TESTING</div>
                        <h1 class="tf-side-title">TestFlight</h1>
                    </div>
                    <div class="tf-profile">
                        <div class="tf-avatar">${ICONS.profile}</div>
                        <div class="tf-username">Beta Tester</div>
                        <div class="tf-apple-id">tester@icloud.com</div>
                    </div>
                    <div class="tf-nav">
                        <div class="tf-nav-item ${state.activeTab === 'testing' ? 'active' : ''}" data-tab="testing">
                            ${ICONS.testing}
                            <span>测试中</span>
                            ${counts.testing ? `<span class="tf-badge">${counts.testing}</span>` : ''}
                        </div>
                        <div class="tf-nav-item ${state.activeTab === 'accepted' ? 'active' : ''}" data-tab="accepted">
                            ${ICONS.accepted}
                            <span>已接受</span>
                            ${counts.accepted ? `<span class="tf-badge green">${counts.accepted}</span>` : ''}
                        </div>
                        <div class="tf-nav-item ${state.activeTab === 'expired' ? 'active' : ''}" data-tab="expired">
                            ${ICONS.expired}
                            <span>已过期</span>
                            ${counts.expired ? `<span class="tf-badge red">${counts.expired}</span>` : ''}
                        </div>
                        <div class="tf-nav-sep"></div>
                        <div class="tf-nav-item" id="tf-redeem-${windowId}">
                            ${ICONS.code}
                            <span>兑换码</span>
                        </div>
                    </div>
                    <div class="tf-side-footer">
                        <div class="tf-disclaimer">
                            ${ICONS.warning}
                            <div>
                                <div class="tf-disclaimer-title">Beta 软件提醒</div>
                                <div class="tf-disclaimer-text">测试版可能存在不稳定因素，请勿用于关键工作。</div>
                            </div>
                        </div>
                    </div>
                </aside>
                <main class="tf-main">
                    ${currentApp ? renderAppDetail(currentApp) : renderAppList(filtered, counts)}
                </main>
            </div>
        `;
        bindEvents();
    }

    function renderAppList(filtered, counts) {
        const tabName = { testing: '测试中', accepted: '已接受', expired: '已过期', all: '全部' }[state.activeTab];
        return `
            <div class="tf-list-view">
                <div class="tf-header">
                    <div>
                        <div class="tf-header-eyebrow">${tabName}</div>
                        <h2 class="tf-header-title">${tabName}的 App</h2>
                        <div class="tf-header-sub">共 ${filtered.length} 个 App · 已安装 ${state.installedApps.length} 个</div>
                    </div>
                    <button class="tf-refresh-btn" id="tf-refresh-${windowId}">${ICONS.refresh}<span>刷新</span></button>
                </div>
                ${filtered.length === 0 ? `
                    <div class="tf-empty">
                        <div class="tf-empty-icon">${ICONS.testing}</div>
                        <div class="tf-empty-title">没有${tabName}的 App</div>
                        <div class="tf-empty-sub">使用兑换码添加新的测试 App</div>
                        <button class="tf-empty-btn" id="tf-empty-redeem-${windowId}">${ICONS.code}<span>使用兑换码</span></button>
                    </div>
                ` : `
                    <div class="tf-apps">
                        ${filtered.map(app => {
                            const isInstalled = state.installedApps.includes(app.id);
                            const expiringSoon = app.status === 'testing' && app.expires <= 7;
                            return `
                                <article class="tf-app-card ${app.status === 'expired' ? 'expired' : ''}" data-app="${app.id}">
                                    <div class="tf-app-icon" style="background:${app.gradient};color:#fff;">${APP_ICONS[app.icon]}</div>
                                    <div class="tf-app-info">
                                        <div class="tf-app-name">${escapeHtml(app.name)}</div>
                                        <div class="tf-app-dev">${escapeHtml(app.dev)}</div>
                                        <div class="tf-app-meta">
                                            <span>v${escapeHtml(app.version)}</span>
                                            <span class="dot"></span>
                                            <span>构建 ${app.build}</span>
                                            <span class="dot"></span>
                                            <span>${app.size}</span>
                                            ${app.rating ? `<span class="dot"></span><span class="tf-rating">★ ${app.rating}</span>` : ''}
                                        </div>
                                        <div class="tf-app-update">更新于 ${app.lastUpdate}</div>
                                    </div>
                                    <div class="tf-app-action">
                                        ${app.status === 'testing' ? `
                                            <button class="tf-btn ${isInstalled ? 'open' : 'install'}" data-install="${app.id}">
                                                ${isInstalled ? ICONS.open : ICONS.install}
                                                <span>${isInstalled ? '打开' : '安装'}</span>
                                            </button>
                                            <div class="tf-expires ${expiringSoon ? 'warning' : ''}">
                                                ${app.expires} 天后过期
                                            </div>
                                        ` : app.status === 'accepted' ? `
                                            <button class="tf-btn install" data-install="${app.id}">
                                                ${isInstalled ? ICONS.open : ICONS.install}
                                                <span>${isInstalled ? '打开' : '安装'}</span>
                                            </button>
                                            <div class="tf-expires">${app.expires} 天后过期</div>
                                        ` : `
                                            <button class="tf-btn disabled" disabled>
                                                ${ICONS.expired}
                                                <span>已过期</span>
                                            </button>
                                            <div class="tf-expires red">过期 ${-app.expires} 天</div>
                                        `}
                                    </div>
                                </article>
                            `;
                        }).join('')}
                    </div>
                    <div class="tf-notice">
                        <div class="tf-notice-icon">${ICONS.warning}</div>
                        <div>
                            <strong>TestFlight 说明</strong>
                            <p>测试版 App 可能包含错误，不建议在主要设备上使用。请在反馈助手 App 中提交错误报告。每个测试版 App 最多可安装 10,000 个测试设备，过期后需重新接受邀请。</p>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    function renderAppDetail(app) {
        const isInstalled = state.installedApps.includes(app.id);
        const otherVersions = [
            { version: app.version, build: app.build, date: app.lastUpdate, current: true },
            { version: app.version.replace(/ beta.*$/, '').replace(/\d+$/, m => parseInt(m) - 1), build: app.build - 1, date: '1 周前', current: false },
            { version: app.version.replace(/ beta.*$/, '').replace(/\d+$/, m => parseInt(m) - 2), build: app.build - 2, date: '2 周前', current: false }
        ];

        return `
            <div class="tf-detail">
                <div class="tf-detail-toolbar">
                    <button class="tf-back-btn" id="tf-back-${windowId}">${ICONS.back}<span>返回</span></button>
                    <div class="tf-detail-tools">
                        <button class="tf-tool-btn" id="tf-detail-share-${windowId}" title="分享">${ICONS.share}</button>
                    </div>
                </div>
                <div class="tf-detail-scroll">
                    <div class="tf-detail-hero">
                        <div class="tf-detail-icon" style="background:${app.gradient};color:#fff;">${APP_ICONS[app.icon]}</div>
                        <div class="tf-detail-hero-info">
                            <h1 class="tf-detail-name">${escapeHtml(app.name)}</h1>
                            <div class="tf-detail-dev">${escapeHtml(app.dev)}</div>
                            <div class="tf-detail-tags">
                                <span class="tf-tag ${app.status}">${
                                    { testing: '测试中', accepted: '已接受', expired: '已过期' }[app.status]
                                }</span>
                                <span class="tf-tag">v${escapeHtml(app.version)}</span>
                                <span class="tf-tag">构建 ${app.build}</span>
                                ${app.rating ? `<span class="tf-tag rating">★ ${app.rating}</span>` : ''}
                            </div>
                        </div>
                        <div class="tf-detail-action">
                            ${app.status === 'expired' ? `
                                <button class="tf-btn large disabled" disabled>${ICONS.expired}<span>已过期</span></button>
                            ` : `
                                <button class="tf-btn large ${isInstalled ? 'open' : 'install'}" id="tf-detail-install-${windowId}">
                                    ${isInstalled ? ICONS.open : ICONS.install}
                                    <span>${isInstalled ? '打开' : '安装'}</span>
                                </button>
                            `}
                        </div>
                    </div>
                    <div class="tf-detail-stats">
                        <div class="tf-stat">
                            <div class="tf-stat-label">大小</div>
                            <div class="tf-stat-value">${app.size}</div>
                        </div>
                        <div class="tf-stat">
                            <div class="tf-stat-label">最后更新</div>
                            <div class="tf-stat-value">${app.lastUpdate}</div>
                        </div>
                        <div class="tf-stat">
                            <div class="tf-stat-label">${app.status === 'expired' ? '过期天数' : '剩余天数'}</div>
                            <div class="tf-stat-value ${app.status === 'expired' ? 'red' : app.expires <= 7 ? 'warning' : ''}">${
                                app.status === 'expired' ? -app.expires : app.expires
                            } 天</div>
                        </div>
                        <div class="tf-stat">
                            <div class="tf-stat-label">状态</div>
                            <div class="tf-stat-value ${app.status}">${
                                { testing: '测试中', accepted: '已接受', expired: '已过期' }[app.status]
                            }</div>
                        </div>
                    </div>
                    <div class="tf-detail-section">
                        <h3 class="tf-section-title">关于</h3>
                        <p class="tf-detail-desc">${escapeHtml(app.desc)}</p>
                    </div>
                    <div class="tf-detail-section">
                        <h3 class="tf-section-title">版本历史</h3>
                        <div class="tf-versions">
                            ${otherVersions.map(v => `
                                <div class="tf-version ${v.current ? 'current' : ''}">
                                    <div class="tf-version-info">
                                        <div class="tf-version-num">v${escapeHtml(v.version)} (构建 ${v.build})</div>
                                        <div class="tf-version-date">${v.date}</div>
                                    </div>
                                    ${v.current ? '<span class="tf-version-badge">当前</span>' : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="tf-detail-section">
                        <h3 class="tf-section-title">开发人员</h3>
                        <div class="tf-dev-info">
                            <div class="tf-dev-avatar" style="background:${app.gradient};">${escapeHtml(app.dev.charAt(0))}</div>
                            <div>
                                <div class="tf-dev-name">${escapeHtml(app.dev)}</div>
                                <div class="tf-dev-id">开发者 ID: ${1000 + app.id * 137}</div>
                            </div>
                        </div>
                    </div>
                    <div class="tf-detail-actions">
                        <button class="tf-action-btn" id="tf-feedback-${windowId}">
                            ${ICONS.warning}
                            <span>提交反馈</span>
                        </button>
                        <button class="tf-action-btn" id="tf-detail-share-2-${windowId}">
                            ${ICONS.share}
                            <span>分享给朋友</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function bindEvents() {
        body.querySelectorAll('.tf-nav-item[data-tab]').forEach(item => {
            item.addEventListener('click', () => {
                state.activeTab = item.dataset.tab;
                state.selectedAppId = null;
                saveState();
                render();
            });
        });

        body.querySelectorAll('.tf-app-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.tf-btn')) return;
                state.selectedAppId = parseInt(card.dataset.app);
                saveState();
                render();
            });
        });

        body.querySelectorAll('[data-install]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.install);
                const app = APPS.find(a => a.id === id);
                if (!app) return;
                if (state.installedApps.includes(id)) {
                    if (window.toast) window.toast(`正在打开 ${app.name}（演示）`, 'info');
                } else {
                    state.installedApps.push(id);
                    saveState();
                    if (window.toast) window.toast(`已安装 ${app.name}`, 'success');
                    render();
                }
            });
        });

        const redeem = body.querySelector(`#tf-redeem-${windowId}`);
        if (redeem) {
            redeem.addEventListener('click', async () => {
                const code = await window.showPrompt('输入兑换码', {
                    subtitle: '请输入开发者提供的 TestFlight 兑换码。',
                    placeholder: 'XXXX-XXXX-XXXX-XXXX',
                    confirmText: '兑换'
                });
                if (code && code.trim()) {
                    if (window.toast) window.toast(`兑换码"${code.trim()}"无效（演示）`, 'error');
                }
            });
        }

        const emptyRedeem = body.querySelector(`#tf-empty-redeem-${windowId}`);
        if (emptyRedeem) {
            emptyRedeem.addEventListener('click', async () => {
                const code = await window.showPrompt('输入兑换码', {
                    subtitle: '请输入开发者提供的 TestFlight 兑换码。',
                    placeholder: 'XXXX-XXXX-XXXX-XXXX',
                    confirmText: '兑换'
                });
                if (code && code.trim()) {
                    if (window.toast) window.toast(`兑换码"${code.trim()}"无效（演示）`, 'error');
                }
            });
        }

        const refresh = body.querySelector(`#tf-refresh-${windowId}`);
        if (refresh) {
            refresh.addEventListener('click', () => {
                if (window.toast) window.toast('已是最新（演示）', 'info');
            });
        }

        const back = body.querySelector(`#tf-back-${windowId}`);
        if (back) {
            back.addEventListener('click', () => {
                state.selectedAppId = null;
                saveState();
                render();
            });
        }

        const detailInstall = body.querySelector(`#tf-detail-install-${windowId}`);
        if (detailInstall) {
            detailInstall.addEventListener('click', () => {
                const app = APPS.find(a => a.id === state.selectedAppId);
                if (!app) return;
                if (state.installedApps.includes(app.id)) {
                    if (window.toast) window.toast(`正在打开 ${app.name}（演示）`, 'info');
                } else {
                    state.installedApps.push(app.id);
                    saveState();
                    if (window.toast) window.toast(`已安装 ${app.name}`, 'success');
                    render();
                }
            });
        }

        const feedback = body.querySelector(`#tf-feedback-${windowId}`);
        if (feedback) {
            feedback.addEventListener('click', async () => {
                const text = await window.showPrompt('提交反馈', {
                    subtitle: '描述你遇到的问题或建议。',
                    placeholder: '请输入反馈内容...',
                    confirmText: '提交'
                });
                if (text && text.trim()) {
                    if (window.toast) window.toast('反馈已提交，感谢！', 'success');
                }
            });
        }

        body.querySelectorAll(`#tf-detail-share-${windowId}, #tf-detail-share-2-${windowId}`).forEach(b => {
            if (b) b.addEventListener('click', () => {
                if (window.toast) window.toast('已复制邀请链接（演示）', 'info');
            });
        });
    }

    render();
};
