// Launchpad - 全屏应用启动器
window.renderLaunchpad = function(body, sidebar, toolbar, windowId) {
    let searchQuery = '';
    let currentPage = 0;
    const appsPerPage = 35; // 7x5 网格

    function getAllApps() {
        if (!window.appManager) return [];
        const allApps = window.appManager.getAllApps();
        // 排除 launchpad 自身和废纸篓
        return allApps.filter(a => a.id !== 'launchpad' && a.id !== 'trash');
    }

    function getFilteredApps() {
        let apps = getAllApps();
        if (searchQuery) {
            apps = apps.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return apps;
    }

    function render() {
        body.className = 'window-body app-content launchpad-body';
        body.style.background = 'rgba(30, 30, 35, 0.85)';
        body.style.backdropFilter = 'blur(40px)';
        body.style.webkitBackdropFilter = 'blur(40px)';

        const apps = getFilteredApps();
        const totalPages = Math.max(1, Math.ceil(apps.length / appsPerPage));
        if (currentPage >= totalPages) currentPage = totalPages - 1;
        const start = currentPage * appsPerPage;
        const pageApps = apps.slice(start, start + appsPerPage);

        body.innerHTML = `
            <div class="launchpad-container">
                <div class="launchpad-search-wrap">
                    <input type="text" class="launchpad-search" id="lp-search"
                        placeholder="搜索" value="${searchQuery}"
                        autocomplete="off">
                </div>
                <div class="launchpad-grid" id="lp-grid">
                    ${pageApps.map((app, i) => {
                        const delay = Math.min(0.5, 0.03 * i + 0.05).toFixed(3);
                        return `
                        <div class="launchpad-item" data-app-id="${app.id}" data-app-name="${app.name}" style="animation-delay:${delay}s">
                            <div class="launchpad-icon">${IconGenerator.generate(app.icon, { emoji: app.emoji })}</div>
                            <div class="launchpad-name">${app.name}</div>
                        </div>`;
                    }).join('')}
                    ${pageApps.length === 0 ? `
                        <div class="launchpad-empty">
                            <div style="font-size:60px;margin-bottom:12px;">🔍</div>
                            <div>未找到应用</div>
                        </div>
                    ` : ''}
                </div>
                ${totalPages > 1 ? `
                    <div class="launchpad-pages">
                        ${Array.from({length: totalPages}, (_, i) => `
                            <div class="launchpad-page-dot ${i === currentPage ? 'active' : ''}" data-page="${i}"></div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        // 搜索框
        const search = body.querySelector('#lp-search');
        if (search) {
            search.focus();
            search.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                currentPage = 0;
                render();
                const newSearch = body.querySelector('#lp-search');
                if (newSearch) {
                    newSearch.focus();
                    newSearch.setSelectionRange(newSearch.value.length, newSearch.value.length);
                }
            });
        }

        // 应用点击
        body.querySelectorAll('.launchpad-item').forEach(item => {
            item.addEventListener('click', () => {
                const appId = item.dataset.appId;
                if (window.appManager && appId) {
                    // 关闭 Launchpad 窗口
                    if (window.windowManager) {
                        window.windowManager.closeWindow(windowId);
                    }
                    setTimeout(() => {
                        window.appManager.openApp(appId);
                    }, 100);
                }
            });
        });

        // 页码点击
        body.querySelectorAll('.launchpad-page-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentPage = parseInt(dot.dataset.page);
                render();
            });
        });

        // 键盘左右翻页
        body.tabIndex = 0;
        body.focus();
        body.onkeydown = (e) => {
            if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
                currentPage++;
                render();
            } else if (e.key === 'ArrowLeft' && currentPage > 0) {
                currentPage--;
                render();
            } else if (e.key === 'Escape') {
                if (window.windowManager) {
                    window.windowManager.closeWindow(windowId);
                }
            }
        };
    }

    render();
};
