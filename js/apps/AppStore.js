window.renderAppStore = function(body, sidebar, toolbar, windowId) {
    let currentCategory = 'featured';

    const categories = [
        { id: 'featured', name: '精选', icon: '⭐' },
        { id: 'create', name: '创作', icon: '🎨' },
        { id: 'work', name: '工作', icon: '💼' },
        { id: 'play', name: '游戏', icon: '🎮' },
        { id: 'develop', name: '开发', icon: '💻' },
        { id: 'updates', name: '更新', icon: '🔄' }
    ];

    const apps = [
        { name: 'Keynote', category: '创作', icon: '📊', color: 'linear-gradient(135deg, #007AFF, #5856D6)', rating: 4.8 },
        { name: 'Pages', category: '创作', icon: '📝', color: 'linear-gradient(135deg, #FF9500, #FF3B30)', rating: 4.7 },
        { name: 'Numbers', category: '创作', icon: '📈', color: 'linear-gradient(135deg, #34C759, #007AFF)', rating: 4.6 },
        { name: 'iMovie', category: '创作', icon: '🎬', color: 'linear-gradient(135deg, #FF2D55, #FF9500)', rating: 4.9 },
        { name: 'GarageBand', category: '创作', icon: '🎹', color: 'linear-gradient(135deg, #FF3B30, #FF9500)', rating: 4.8 },
        { name: 'Final Cut Pro', category: '创作', icon: '🎥', color: 'linear-gradient(135deg, #5856D6, #AF52DE)', rating: 4.9 },
        { name: 'Xcode', category: '开发', icon: '🔨', color: 'linear-gradient(135deg, #007AFF, #5AC8FA)', rating: 4.5 },
        { name: 'Swift Playgrounds', category: '开发', icon: '🐦', color: 'linear-gradient(135deg, #FF9500, #FF3B30)', rating: 4.7 },
        { name: 'Minecraft', category: '游戏', icon: '⛏️', color: 'linear-gradient(135deg, #34C759, #8E8E93)', rating: 4.8 },
        { name: 'Among Us', category: '游戏', icon: '👾', color: 'linear-gradient(135deg, #FF2D55, #AF52DE)', rating: 4.6 },
        { name: 'Microsoft Word', category: '工作', icon: '📘', color: 'linear-gradient(135deg, #007AFF, #003B73)', rating: 4.5 },
        { name: 'Slack', category: '工作', icon: '💬', color: 'linear-gradient(135deg, #8B0000, #FF0000)', rating: 4.6 }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:220px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);padding:16px;overflow-y:auto;">
                <div style="font-size:22px;font-weight:700;margin-bottom:20px;">App Store</div>
                <div style="margin-bottom:24px;">
                    <input type="text" placeholder="搜索 App Store" style="width:100%;padding:8px 12px;background:var(--input-bg);border:none;border-radius:8px;font-size:13px;outline:none;">
                </div>
                ${categories.map(cat => `
                    <div class="finder-sidebar-item ${currentCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" style="margin-bottom:2px;">
                        <span style="font-size:16px;">${cat.icon}</span>
                        <span style="font-size:13px;">${cat.name}</span>
                    </div>
                `).join('')}
            </div>
        `;

        sidebar.querySelectorAll('[data-cat]').forEach(item => {
            item.addEventListener('click', () => {
                currentCategory = item.dataset.cat;
                render();
            });
        });
    }

    function renderContent() {
        let filteredApps = apps;
        if (currentCategory !== 'featured' && currentCategory !== 'updates') {
            const categoryNames = { create: '创作', work: '工作', play: '游戏', develop: '开发' };
            filteredApps = apps.filter(a => a.category === categoryNames[currentCategory]);
        }

        body.innerHTML = `
            <div class="app-store-body">
                ${currentCategory === 'featured' ? `
                    <div class="app-store-hero">
                        <h2>发现精彩 App</h2>
                        <p>探索精选的优质应用，提升您的 Mac 体验</p>
                    </div>
                ` : ''}
                
                ${currentCategory === 'updates' ? `
                    <div style="padding:40px;text-align:center;">
                        <div style="font-size:64px;margin-bottom:16px;">✅</div>
                        <h2 style="font-size:24px;margin-bottom:8px;">所有 App 均为最新版本</h2>
                        <p style="color:var(--text-tertiary);">上次检查：今天 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                ` : `
                    <div class="app-store-section">
                        <div class="app-store-section-title">
                            ${currentCategory === 'featured' ? '精选 App' : categories.find(c => c.id === currentCategory)?.name}
                        </div>
                        <div class="app-store-grid">
                            ${filteredApps.map(app => `
                                <div class="app-card">
                                    <div class="app-card-icon" style="background:${app.color};">${app.icon}</div>
                                    <div class="app-card-name">${app.name}</div>
                                    <div class="app-card-category">${app.category} · ⭐ ${app.rating}</div>
                                    <button style="margin-top:8px;width:100%;padding:6px;background:var(--button-bg);border:none;border-radius:12px;font-size:12px;font-weight:600;cursor:pointer;">获取</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    render();
};
