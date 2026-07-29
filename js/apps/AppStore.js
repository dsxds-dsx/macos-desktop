window.renderAppStore = function(body, sidebar, toolbar, windowId) {
    // ============ Persistent State ============
    let state = JSON.parse(localStorage.getItem('macos_appstore_state') || 'null') || {
        currentSection: 'discover',
        selectedAppId: null,
        installedApps: ['safari', 'mail', 'messages', 'notes', 'calendar', 'calculator'],
        searchQuery: ''
    };
    let searchQuery = '';

    function saveState() {
        localStorage.setItem('macos_appstore_state', JSON.stringify(state));
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function formatNumber(n) {
        if (n >= 10000) return (n / 10000).toFixed(1) + '万';
        return n.toString();
    }

    // ============ Sidebar Sections ============
    const sections = [
        { id: 'discover', name: '发现' },
        { id: 'arcade', name: 'Arcade' },
        { id: 'create', name: '创作' },
        { id: 'work', name: '工作' },
        { id: 'play', name: '游玩' },
        { id: 'develop', name: '开发' },
        { id: 'categories', name: '类别' },
        { id: 'updates', name: '更新' }
    ];

    const sectionIcons = {
        'discover': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
        'arcade': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`,
        'create': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
        'work': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
        'play': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M10 8l6 4-6 4V8z" fill="currentColor"/></svg>`,
        'develop': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>`,
        'categories': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
        'updates': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.7 1 6.3 2.7L21 8"/><path d="M21 3v5h-5"/></svg>`
    };

    // ============ Apps Data ============
    const apps = [
        { id: '1', name: 'Procreate', developer: 'Savage Interactive', category: 'create', section: 'create', icon: '🎨', color: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', price: 68, rating: 4.8, reviews: 12800, size: '854 MB', age: '4+', desc: '专业的绘画应用，功能强大，让数字艺术创作变得简单而富有表现力。', version: '5.3.6', whatsNew: '新增动画功能，性能优化', featured: true },
        { id: '2', name: 'Pixelmator Pro', developer: 'Pixelmator Team', category: 'create', section: 'create', icon: '🖌️', color: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', price: 328, rating: 4.7, reviews: 8600, size: '420 MB', age: '4+', desc: '专业图像编辑器，支持图层、滤镜、AI 修图，是 Photoshop 的强力替代品。', version: '3.4.2', whatsNew: 'AI 智能选择工具', featured: false },
        { id: '3', name: 'Things 3', developer: 'Cultured Code', category: 'work', section: 'work', icon: '✓', color: 'linear-gradient(135deg, #00b894, #00cec9)', price: 328, rating: 4.9, reviews: 25400, size: '120 MB', age: '4+', desc: '优雅的任务管理应用，让待办事项变得简单而有趣。', version: '3.17.5', whatsNew: 'Bug 修复和性能优化', featured: false },
        { id: '4', name: 'MindNode', developer: 'IdeasOnCanvas', category: 'work', section: 'work', icon: '🧠', color: 'linear-gradient(135deg, #fd79a8, #fdcb6e)', price: 68, rating: 4.6, reviews: 4200, size: '95 MB', age: '4+', desc: '思维导图工具，快速记录灵感，组织想法。', version: '2023.3', whatsNew: '新增协作功能', featured: false },
        { id: '5', name: 'Stardew Valley', developer: 'ConcernedApe', category: 'play', section: 'play', icon: '🌾', color: 'linear-gradient(135deg, #55a630, #2ecc71)', price: 48, rating: 4.9, reviews: 38000, size: '650 MB', age: '9+', desc: '继承爷爷的农场，开始全新的乡村生活。种植、养殖、交友、探索。', version: '1.5.6', whatsNew: '新增多人合作模式', featured: true },
        { id: '6', name: 'Minecraft', developer: 'Mojang', category: 'play', section: 'play', icon: '⛏️', color: 'linear-gradient(135deg, #6ab04c, #218c74)', price: 68, rating: 4.5, reviews: 156000, size: '800 MB', age: '9+', desc: '在方块世界中探索、建造、生存的开放世界沙盒游戏。', version: '1.20.4', whatsNew: '新增考古系统', featured: false },
        { id: '7', name: 'Xcode', developer: 'Apple', category: 'develop', section: 'develop', icon: '🔨', color: 'linear-gradient(135deg, #2d3436, #636e72)', price: 0, rating: 4.2, reviews: 89000, size: '12 GB', age: '4+', desc: 'Apple 官方开发工具，用于开发 macOS、iOS、watchOS、tvOS 应用。', version: '15.2', whatsNew: 'SwiftUI 预览增强', featured: true },
        { id: '8', name: 'Tower', developer: 'fournova', category: 'develop', section: 'develop', icon: 'tower', color: 'linear-gradient(135deg, #d63031, #e84393)', price: 0, rating: 4.7, reviews: 5600, size: '85 MB', age: '4+', desc: '强大的 Git 客户端，让版本控制变得直观简单。', version: '9.0', whatsNew: '全新 UI 设计', featured: false },
        { id: '9', name: 'Bear', developer: 'Shiny Frog', category: 'work', section: 'work', icon: '🐻', color: 'linear-gradient(135deg, #d35400, #e67e22)', price: 0, rating: 4.8, reviews: 12000, size: '78 MB', age: '4+', desc: '优雅的 Markdown 笔记应用，支持标签、富文本和导出多种格式。', version: '2.3', whatsNew: '改进的编辑器', featured: false },
        { id: '10', name: 'LumaFusion', developer: 'Luma Touch', category: 'create', section: 'create', icon: '🎬', color: 'linear-gradient(135deg, #0984e3, #6c5ce7)', price: 248, rating: 4.7, reviews: 8200, size: '450 MB', age: '4+', desc: '专业视频编辑应用，多轨道编辑、特效、调色，移动端最强剪辑工具。', version: '4.0.2', whatsNew: 'AI 自动字幕', featured: false },
        { id: '11', name: 'Alto\'s Odyssey', developer: 'Snowman', category: 'arcade', section: 'arcade', icon: '🏔️', color: 'linear-gradient(135deg, #fab1a0, #fd79a8)', price: 30, rating: 4.8, reviews: 22000, size: '280 MB', age: '9+', desc: '穿越美丽沙漠的跑酷冒险游戏，画面精美，音乐动听。', version: '1.0.7', whatsNew: '新增主题', featured: true },
        { id: '12', name: 'Monument Valley 2', developer: 'ustwo games', category: 'arcade', section: 'arcade', icon: '🗼', color: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)', price: 30, rating: 4.9, reviews: 18500, size: '320 MB', age: '4+', desc: '探索奇幻建筑，解谜过关的休闲游戏，艺术与游戏的完美结合。', version: '2.4.12', whatsNew: '新增章节', featured: false }
    ];

    function getAppById(id) {
        return apps.find(a => a.id === id);
    }

    function isInstalled(appId) {
        return state.installedApps.includes(appId);
    }

    function getCategoryName(cat) {
        const names = { create: '摄影与录像', work: '效率', play: '游戏', develop: '开发者工具', arcade: 'Arcade 游戏' };
        return names[cat] || '应用';
    }

    function formatPrice(price) {
        if (price === 0) return '获取';
        return `¥${price}`;
    }

    // ============ Render Sidebar ============
    function renderSidebar() {
        if (!sidebar) return;
        const updateCount = apps.filter(a => isInstalled(a.id)).length;
        sidebar.innerHTML = `
            <div class="appstore-sidebar">
                <div class="appstore-sidebar-top">
                    <div class="appstore-sidebar-title">App Store</div>
                    <div class="appstore-sidebar-search">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                        <input type="text" id="appstore-search-${windowId}" placeholder="搜索" value="${escapeHtml(searchQuery)}">
                    </div>
                </div>
                <div class="appstore-sidebar-scroll">
                    ${sections.map(sec => `
                        <div class="appstore-sidebar-section ${state.currentSection === sec.id ? 'active' : ''}" data-section="${sec.id}">
                            ${sectionIcons[sec.id]}
                            <span>${sec.name}</span>
                            ${sec.id === 'updates' && updateCount > 0 ? `<span class="appstore-sidebar-badge">${updateCount}</span>` : ''}
                        </div>
                    `).join('')}
                    ${state.installedApps.length > 0 ? `
                        <div class="appstore-sidebar-group">
                            <div class="appstore-sidebar-group-title">已购项目</div>
                            <div class="appstore-sidebar-section" data-section="purchased">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                                <span>我的已购项目</span>
                                <span class="appstore-sidebar-badge">${state.installedApps.length}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('[data-section]').forEach(item => {
            item.addEventListener('click', () => {
                state.currentSection = item.dataset.section;
                state.selectedAppId = null;
                saveState();
                renderSidebar();
                renderContent();
            });
        });

        const searchInput = sidebar.querySelector(`#appstore-search-${windowId}`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                renderContent();
            });
        }
    }

    // ============ Render Content ============
    function renderContent() {
        if (state.selectedAppId) {
            renderAppDetail();
            return;
        }
        if (searchQuery.trim()) {
            renderSearchResults();
            return;
        }
        if (state.currentSection === 'updates') {
            renderUpdates();
            return;
        }
        if (state.currentSection === 'purchased') {
            renderPurchased();
            return;
        }
        renderBrowse();
    }

    function getFilteredApps() {
        if (state.currentSection === 'discover') return apps;
        return apps.filter(a => a.section === state.currentSection);
    }

    function renderBrowse() {
        const list = getFilteredApps();
        if (list.length === 0) {
            body.innerHTML = `<div class="appstore-content"><div class="appstore-empty"><div class="appstore-empty-icon">📦</div><div class="appstore-empty-text">该分类暂无应用</div></div></div>`;
            return;
        }
        const featured = list.find(a => a.featured) || list[0];
        const rest = list.filter(a => a.id !== featured.id);

        body.innerHTML = `
            <div class="appstore-content">
                <div class="appstore-content-scroll">
                    <div class="appstore-hero" style="background:${featured.color};" data-app="${featured.id}">
                        <div class="appstore-hero-icon">${featured.icon}</div>
                        <div class="appstore-hero-info">
                            <div class="appstore-hero-badge">编辑精选</div>
                            <h1 class="appstore-hero-title">${escapeHtml(featured.name)}</h1>
                            <div class="appstore-hero-sub">${escapeHtml(featured.developer)} · ${getCategoryName(featured.category)}</div>
                            <p class="appstore-hero-desc">${escapeHtml(featured.desc)}</p>
                        </div>
                    </div>
                    <div class="appstore-section">
                        <h2 class="appstore-section-title">${{ discover: '推荐应用', create: '创作工具', work: '效率工具', play: '热门游戏', develop: '开发工具', arcade: 'Arcade 游戏', categories: '所有类别' }[state.currentSection] || '应用'}</h2>
                        <div class="appstore-list">
                            ${rest.map(app => renderAppRow(app)).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        attachAppClickHandlers();
    }

    function renderAppRow(app) {
        const installed = isInstalled(app.id);
        return `
            <div class="appstore-app-row" data-app="${app.id}">
                <div class="appstore-app-icon" style="background:${app.color};">${app.icon}</div>
                <div class="appstore-app-info">
                    <div class="appstore-app-name">${escapeHtml(app.name)}</div>
                    <div class="appstore-app-sub">${escapeHtml(app.developer)}</div>
                    <div class="appstore-app-meta">${getCategoryName(app.category)} · ${app.rating} ★</div>
                </div>
                <div class="appstore-app-action">
                    <button class="appstore-get-btn ${installed ? 'installed' : ''}" data-install="${app.id}">
                        ${installed ? '打开' : formatPrice(app.price)}
                    </button>
                    ${app.price === 0 && !installed ? `<div class="appstore-iap">App 内购买</div>` : ''}
                </div>
            </div>
        `;
    }

    function renderAppDetail() {
        const app = getAppById(state.selectedAppId);
        if (!app) {
            state.selectedAppId = null;
            renderContent();
            return;
        }
        const installed = isInstalled(app.id);

        body.innerHTML = `
            <div class="appstore-content">
                <div class="appstore-content-scroll">
                    <button class="appstore-back-btn" id="appstore-back-${windowId}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        <span>返回</span>
                    </button>
                    <div class="appstore-detail">
                        <div class="appstore-detail-header">
                            <div class="appstore-detail-icon" style="background:${app.color};">${app.icon}</div>
                            <div class="appstore-detail-info">
                                <h1 class="appstore-detail-name">${escapeHtml(app.name)}</h1>
                                <div class="appstore-detail-dev">${escapeHtml(app.developer)}</div>
                                <button class="appstore-detail-get ${installed ? 'installed' : ''}" id="appstore-install-${windowId}">
                                    ${installed ? '打开' : formatPrice(app.price)}
                                </button>
                            </div>
                        </div>
                        <div class="appstore-detail-stats">
                            <div class="appstore-stat">
                                <div class="appstore-stat-value">${app.rating}</div>
                                <div class="appstore-stat-label">评分</div>
                                <div class="appstore-stat-stars">${'★'.repeat(Math.round(app.rating))}${'☆'.repeat(5 - Math.round(app.rating))}</div>
                            </div>
                            <div class="appstore-stat">
                                <div class="appstore-stat-value">${formatNumber(app.reviews)}</div>
                                <div class="appstore-stat-label">评分</div>
                            </div>
                            <div class="appstore-stat">
                                <div class="appstore-stat-value">${getCategoryName(app.category).split('')[0]}</div>
                                <div class="appstore-stat-label">${getCategoryName(app.category)}</div>
                            </div>
                            <div class="appstore-stat">
                                <div class="appstore-stat-value">${app.age}</div>
                                <div class="appstore-stat-label">年龄</div>
                            </div>
                        </div>
                        <div class="appstore-screenshots">
                            <div class="appstore-screenshot" style="background:${app.color};">${app.icon}</div>
                            <div class="appstore-screenshot" style="background:linear-gradient(135deg, #636e72, #2d3436);">${app.icon}</div>
                            <div class="appstore-screenshot" style="background:linear-gradient(135deg, #74b9ff, #0984e3);">${app.icon}</div>
                        </div>
                        <div class="appstore-detail-section">
                            <h3 class="appstore-detail-section-title">描述</h3>
                            <p class="appstore-detail-desc">${escapeHtml(app.desc)}</p>
                        </div>
                        <div class="appstore-detail-section">
                            <h3 class="appstore-detail-section-title">新功能</h3>
                            <div class="appstore-detail-version">版本 ${app.version}</div>
                            <p class="appstore-detail-whatsnew">${escapeHtml(app.whatsNew)}</p>
                        </div>
                        <div class="appstore-detail-section">
                            <h3 class="appstore-detail-section-title">信息</h3>
                            <div class="appstore-info-list">
                                <div class="appstore-info-row"><span>类别</span><span>${getCategoryName(app.category)}</span></div>
                                <div class="appstore-info-row"><span>开发商</span><span>${escapeHtml(app.developer)}</span></div>
                                <div class="appstore-info-row"><span>大小</span><span>${app.size}</span></div>
                                <div class="appstore-info-row"><span>版本</span><span>${app.version}</span></div>
                                <div class="appstore-info-row"><span>年龄分级</span><span>${app.age}+</span></div>
                                <div class="appstore-info-row"><span>价格</span><span>${app.price === 0 ? '免费' : '¥' + app.price}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        body.querySelector(`#appstore-back-${windowId}`).addEventListener('click', () => {
            state.selectedAppId = null;
            saveState();
            renderContent();
        });

        body.querySelector(`#appstore-install-${windowId}`).addEventListener('click', () => {
            if (installed) {
                if (window.showToast) window.showToast(`正在打开 ${app.name}`, 'info');
            } else {
                state.installedApps.push(app.id);
                saveState();
                renderSidebar();
                renderAppDetail();
                if (window.showToast) window.showToast(`已安装 ${app.name}`, 'success');
            }
        });
    }

    function renderSearchResults() {
        const q = searchQuery.toLowerCase();
        const results = apps.filter(a => a.name.toLowerCase().includes(q) || a.developer.toLowerCase().includes(q) || getCategoryName(a.category).toLowerCase().includes(q));
        body.innerHTML = `
            <div class="appstore-content">
                <div class="appstore-content-scroll">
                    <h2 class="appstore-section-title">搜索"${escapeHtml(searchQuery)}"</h2>
                    ${results.length === 0 ? `
                        <div class="appstore-empty"><div class="appstore-empty-icon">🔍</div><div class="appstore-empty-text">未找到相关应用</div></div>
                    ` : `
                        <div class="appstore-list">
                            ${results.map(app => renderAppRow(app)).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
        attachAppClickHandlers();
    }

    function renderUpdates() {
        const installedApps = apps.filter(a => isInstalled(a.id));
        body.innerHTML = `
            <div class="appstore-content">
                <div class="appstore-content-scroll">
                    <h2 class="appstore-section-title">可用更新</h2>
                    ${installedApps.length === 0 ? `
                        <div class="appstore-empty"><div class="appstore-empty-icon">✓</div><div class="appstore-empty-text">所有应用均为最新版本</div></div>
                    ` : `
                        <div class="appstore-list">
                            ${installedApps.map(app => `
                                <div class="appstore-app-row" data-app="${app.id}">
                                    <div class="appstore-app-icon" style="background:${app.color};">${app.icon}</div>
                                    <div class="appstore-app-info">
                                        <div class="appstore-app-name">${escapeHtml(app.name)}</div>
                                        <div class="appstore-app-sub">${escapeHtml(app.developer)}</div>
                                        <div class="appstore-app-meta">版本 ${app.version} · ${app.size}</div>
                                    </div>
                                    <div class="appstore-app-action">
                                        <button class="appstore-get-btn update" data-update="${app.id}">更新</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
        attachAppClickHandlers();
        body.querySelectorAll('[data-update]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const appId = btn.dataset.update;
                const app = getAppById(appId);
                btn.textContent = '已更新';
                btn.classList.add('installed');
                if (window.showToast) window.showToast(`已更新 ${app.name} 到 ${app.version}`, 'success');
            });
        });
    }

    function renderPurchased() {
        const purchased = apps.filter(a => isInstalled(a.id));
        body.innerHTML = `
            <div class="appstore-content">
                <div class="appstore-content-scroll">
                    <h2 class="appstore-section-title">我的已购项目</h2>
                    ${purchased.length === 0 ? `
                        <div class="appstore-empty"><div class="appstore-empty-icon">📦</div><div class="appstore-empty-text">还没有已购项目</div></div>
                    ` : `
                        <div class="appstore-list">
                            ${purchased.map(app => renderAppRow(app)).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
        attachAppClickHandlers();
    }

    function attachAppClickHandlers() {
        body.querySelectorAll('[data-app]').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-install]') || e.target.closest('[data-update]')) return;
                state.selectedAppId = card.dataset.app;
                saveState();
                renderContent();
            });
        });
        body.querySelectorAll('[data-install]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const appId = btn.dataset.install;
                const app = getAppById(appId);
                if (isInstalled(appId)) {
                    if (window.showToast) window.showToast(`正在打开 ${app.name}`, 'info');
                } else {
                    state.installedApps.push(appId);
                    saveState();
                    btn.textContent = '打开';
                    btn.classList.add('installed');
                    renderSidebar();
                    if (window.showToast) window.showToast(`已安装 ${app.name}`, 'success');
                }
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = '';
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    render();
};
