window.renderAppStore = function(body, sidebar, toolbar, windowId) {
    let currentCategory = 'featured';
    let searchQuery = '';
    let installedApps = new Set();

    const categories = [
        { id: 'featured', name: '发现', icon: 'sparkles' },
        { id: 'create', name: '创作', icon: 'pencil' },
        { id: 'work', name: '工作', icon: 'briefcase' },
        { id: 'play', name: '游戏', icon: 'gamepad' },
        { id: 'develop', name: '开发', icon: 'terminal' },
        { id: 'lifestyle', name: '生活', icon: 'heart' },
        { id: 'updates', name: '更新', icon: 'refresh' }
    ];

    const availableApps = [
        { id: 'finalcutpro', name: 'Final Cut Pro', category: 'create', icon: 'finalcut', width: 900, height: 650, rating: 4.9, price: '¥1,998', desc: '专业视频剪辑' },
        { id: 'logicpro', name: 'Logic Pro', category: 'create', icon: 'logic', width: 900, height: 650, rating: 4.8, price: '¥1,298', desc: '专业音乐制作' },
        { id: 'motion', name: 'Motion', category: 'create', icon: 'motion', width: 800, height: 600, rating: 4.7, price: '¥498', desc: '动态图形设计' },
        { id: 'compressor', name: 'Compressor', category: 'create', icon: 'compressor', width: 700, height: 500, rating: 4.6, price: '¥298', desc: '视频压缩工具' },
        { id: 'word', name: 'Microsoft Word', category: 'work', icon: 'word', width: 900, height: 650, rating: 4.5, price: '免费', desc: '文字处理' },
        { id: 'excel', name: 'Microsoft Excel', category: 'work', icon: 'excel', width: 900, height: 650, rating: 4.5, price: '免费', desc: '电子表格' },
        { id: 'powerpoint', name: 'Microsoft PowerPoint', category: 'work', icon: 'powerpoint', width: 900, height: 650, rating: 4.4, price: '免费', desc: '演示文稿' },
        { id: 'slack', name: 'Slack', category: 'work', icon: 'slack', width: 800, height: 600, rating: 4.6, price: '免费', desc: '团队协作' },
        { id: 'notion', name: 'Notion', category: 'work', icon: 'notion', width: 900, height: 650, rating: 4.7, price: '免费', desc: '笔记与协作' },
        { id: 'figma', name: 'Figma', category: 'work', icon: 'figma', width: 900, height: 650, rating: 4.8, price: '免费', desc: '设计协作' },
        { id: 'vscode', name: 'Visual Studio Code', category: 'develop', icon: 'vscode', width: 900, height: 650, rating: 4.9, price: '免费', desc: '代码编辑器' },
        { id: 'windsurf', name: 'Windsurf', category: 'develop', icon: 'windsurf', width: 900, height: 650, rating: 4.7, price: '免费', desc: 'AI 编程助手' },
        { id: 'pycharm', name: 'PyCharm', category: 'develop', icon: 'pycharm', width: 900, height: 650, rating: 4.6, price: '免费', desc: 'Python IDE' },
        { id: 'webstorm', name: 'WebStorm', category: 'develop', icon: 'webstorm', width: 900, height: 650, rating: 4.5, price: '免费', desc: 'Web 开发 IDE' },
        { id: 'minecraft', name: 'Minecraft', category: 'play', icon: 'minecraft', width: 800, height: 600, rating: 4.8, price: '¥268', desc: '沙盒游戏' },
        { id: 'amongus', name: 'Among Us', category: 'play', icon: 'amongus', width: 700, height: 500, rating: 4.5, price: '免费', desc: '多人社交推理' },
        { id: 'steam', name: 'Steam', category: 'play', icon: 'steam', width: 900, height: 650, rating: 4.7, price: '免费', desc: '游戏平台' },
        { id: 'spotify', name: 'Spotify', category: 'lifestyle', icon: 'spotify', width: 800, height: 600, rating: 4.8, price: '免费', desc: '音乐流媒体' },
        { id: 'netflix', name: 'Netflix', category: 'lifestyle', icon: 'netflix', width: 900, height: 650, rating: 4.6, price: '免费', desc: '视频流媒体' },
        { id: 'zoom', name: 'Zoom', category: 'lifestyle', icon: 'zoom', width: 800, height: 600, rating: 4.5, price: '免费', desc: '视频会议' },
        { id: 'discord', name: 'Discord', category: 'lifestyle', icon: 'discord', width: 800, height: 600, rating: 4.6, price: '免费', desc: '社交聊天' },
        { id: 'evernote', name: 'Evernote', category: 'lifestyle', icon: 'evernote', width: 800, height: 600, rating: 4.4, price: '免费', desc: '笔记管理' },
        { id: 'spotlight', name: 'Spotlight', category: 'featured', icon: 'spotlight', width: 900, height: 650, rating: 4.9, price: '免费', desc: '搜索一切' }
    ];

    function getInstalledApps() {
        if (!window.appManager) return new Set();
        const allApps = window.appManager.getAllApps();
        return new Set(allApps.map(a => a.id));
    }

    function installApp(app) {
        if (!window.appManager) return;

        const appConfig = {
            id: app.id,
            name: app.name,
            icon: app.icon,
            width: app.width,
            height: app.height
        };

        const success = window.appManager.installApp(appConfig);
        if (success) {
            installedApps.add(app.id);
            showToast(`${app.name} 已安装`);
            renderContent();
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'app-store-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:220px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);padding:16px;">
                <div style="font-size:22px;font-weight:700;margin-bottom:20px;">App Store</div>
                <div style="margin-bottom:20px;">
                    <input type="text" placeholder="搜索" class="appstore-search-input">
                </div>
                ${categories.map(cat => `
                    <div class="appstore-cat-item ${currentCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                        <span>${cat.name}</span>
                    </div>
                `).join('')}
            </div>
        `;

        const searchInput = sidebar.querySelector('.appstore-search-input');
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderContent();
        });

        sidebar.querySelectorAll('.appstore-cat-item').forEach(item => {
            item.addEventListener('click', () => {
                currentCategory = item.dataset.cat;
                render();
            });
        });
    }

    function renderContent() {
        installedApps = getInstalledApps();

        let filteredApps = availableApps;
        if (currentCategory !== 'featured' && currentCategory !== 'updates') {
            filteredApps = availableApps.filter(a => a.category === currentCategory);
        }

        if (searchQuery) {
            filteredApps = filteredApps.filter(a => a.name.toLowerCase().includes(searchQuery));
        }

        body.innerHTML = `
            <div class="app-store-body" style="padding:0;overflow-y:auto;height:100%;">
                ${currentCategory === 'featured' ? `
                    <div class="appstore-hero">
                        <div class="appstore-hero-badge">精选</div>
                        <h1>发现精彩 App</h1>
                        <p>探索最佳应用，提升您的 Mac 体验</p>
                    </div>
                    <div class="appstore-section">
                        <div class="appstore-section-header">
                            <h2>精选推荐</h2>
                        </div>
                        <div class="appstore-featured-row">
                            ${filteredApps.slice(0, 4).map(app => `
                                <div class="appstore-featured-card" data-app="${app.id}">
                                    <div class="appstore-featured-icon">${IconGenerator.generate(app.icon, { size: 56 })}</div>
                                    <div class="appstore-featured-info">
                                        <div class="appstore-featured-name">${app.name}</div>
                                        <div class="appstore-featured-desc">${app.desc}</div>
                                        <div class="appstore-featured-meta">
                                            <span class="appstore-price">${app.price}</span>
                                            <span class="appstore-rating">⭐ ${app.rating}</span>
                                        </div>
                                    </div>
                                    <button class="appstore-install-btn ${installedApps.has(app.id) ? 'installed' : ''}" data-app="${app.id}">
                                        ${installedApps.has(app.id) ? '已安装' : '获取'}
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="appstore-section">
                        <div class="appstore-section-header">
                            <h2>热门分类</h2>
                        </div>
                        <div class="appstore-categories-grid">
                            ${categories.filter(c => c.id !== 'featured' && c.id !== 'updates').map(cat => {
                                const count = availableApps.filter(a => a.category === cat.id).length;
                                return `<div class="appstore-cat-card" data-cat="${cat.id}">
                                    <div class="appstore-cat-icon">${cat.icon}</div>
                                    <div class="appstore-cat-name">${cat.name}</div>
                                    <div class="appstore-cat-count">${count} 个应用</div>
                                </div>`;
                            }).join('')}
                        </div>
                    </div>
                ` : currentCategory === 'updates' ? `
                    <div class="appstore-updates">
                        <div style="text-align:center;padding:60px 20px;">
                            <div style="font-size:72px;margin-bottom:16px;">📦</div>
                            <h2 style="font-size:24px;font-weight:600;margin-bottom:8px;">所有 App 均为最新版本</h2>
                            <p style="color:var(--text-tertiary);font-size:14px;">上次检查：今天 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ` : `
                    <div class="appstore-section">
                        <div class="appstore-section-header">
                            <h2>${categories.find(c => c.id === currentCategory)?.name}</h2>
                            <span style="color:var(--text-tertiary);font-size:13px;">${filteredApps.length} 个应用</span>
                        </div>
                        <div class="appstore-apps-grid">
                            ${filteredApps.map(app => `
                                <div class="appstore-app-card">
                                    <div class="appstore-app-icon">${IconGenerator.generate(app.icon, { size: 64 })}</div>
                                    <div class="appstore-app-info">
                                        <div class="appstore-app-name">${app.name}</div>
                                        <div class="appstore-app-desc">${app.desc}</div>
                                        <div class="appstore-app-meta">
                                            <span class="appstore-price">${app.price}</span>
                                            <span class="appstore-rating">⭐ ${app.rating}</span>
                                        </div>
                                    </div>
                                    <button class="appstore-install-btn ${installedApps.has(app.id) ? 'installed' : ''}" data-app="${app.id}">
                                        ${installedApps.has(app.id) ? '已安装' : '获取'}
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        ${filteredApps.length === 0 ? `
                            <div style="text-align:center;padding:40px;color:var(--text-tertiary);">
                                未找到应用
                            </div>
                        ` : ''}
                    </div>
                `}
            </div>
        `;

        body.querySelectorAll('.appstore-install-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const appId = btn.dataset.app;
                const app = availableApps.find(a => a.id === appId);
                if (app && !installedApps.has(appId)) {
                    installApp(app);
                }
            });
        });

        body.querySelectorAll('.appstore-cat-card').forEach(card => {
            card.addEventListener('click', () => {
                currentCategory = card.dataset.cat;
                render();
            });
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    render();
};
