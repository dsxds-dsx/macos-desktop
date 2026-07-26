// Journal - 日记
window.renderJournal = function(body, sidebar, toolbar, windowId) {
    let entries = JSON.parse(localStorage.getItem('journal_entries') || JSON.stringify([
        { id: 1, date: Date.now() - 86400000 * 0, title: '今天的学习', text: '今天学习了 macOS 开发的新技巧，感觉收获很大。尝试了 SwiftUI 的新特性，非常好用。\n\n下午去咖啡店写了一会儿代码，效率很高。', mood: '😊', photos: 3, location: '北京' },
        { id: 2, date: Date.now() - 86400000 * 1, title: '周末的旅行', text: '周末去了颐和园，天气很好，人也不多。拍了很多照片，特别是昆明湖的夕阳特别美。\n\n晚上吃了北京烤鸭，味道不错。', mood: '😃', photos: 8, location: '北京颐和园' },
        { id: 3, date: Date.now() - 86400000 * 3, title: '新的项目开始了', text: '今天新项目正式启动，团队成员都很兴奋。我们讨论了很多想法，希望能做出好产品。\n\n第一个里程碑是下月底，加油！', mood: '💪', photos: 0, location: '办公室' },
        { id: 4, date: Date.now() - 86400000 * 7, title: '跑步打卡', text: '今天跑了 5 公里，配速 6 分 30 秒，比上次快了一点点。\n\n坚持运动真的很重要，感觉整个人状态都好了。', mood: '🏃', photos: 1, location: '奥森公园' },
        { id: 5, date: Date.now() - 86400000 * 14, title: '读《深度工作》有感', text: '读完了《深度工作》这本书，很受启发。在这个信息爆炸的时代，能够专注地深度工作变得越来越珍贵。\n\n决定每天留出 2 小时的深度工作时间。', mood: '📚', photos: 0, location: '家' },
    ]));

    let selectedEntry = entries[0].id;
    let filter = 'all';

    function render() {
        const filtered = entries.sort((a, b) => b.date - a.date);
        const current = entries.find(e => e.id === selectedEntry);

        body.innerHTML = `
            <div class="journal-container">
                <div class="journal-sidebar">
                    <div class="journal-sidebar-header">
                        <div class="journal-title">日记</div>
                        <button class="journal-new-btn" id="journal-new">✏️ 新建</button>
                    </div>
                    <div class="journal-filter">
                        <button class="jf-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">全部 (${entries.length})</button>
                        <button class="jf-btn ${filter === 'photo' ? 'active' : ''}" data-filter="photo">照片</button>
                        <button class="jf-btn ${filter === 'bookmark' ? 'active' : ''}" data-filter="bookmark">书签</button>
                    </div>
                    <div class="journal-entries">
                        ${filtered.map(e => `
                            <div class="journal-entry-item ${e.id === selectedEntry ? 'active' : ''}" data-id="${e.id}">
                                <div class="je-date">${formatDate(e.date)}</div>
                                <div class="je-title">${e.title}</div>
                                <div class="je-preview">${e.text.substring(0, 40)}...</div>
                                ${e.photos > 0 ? `<div class="je-photos-count">📷 ${e.photos} 张照片</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="journal-detail">
                    ${current ? `
                        <div class="journal-detail-header">
                            <div class="jd-mood">${current.mood}</div>
                            <div class="jd-title">${current.title}</div>
                            <div class="jd-meta">
                                <span>${formatFullDate(current.date)}</span>
                                ${current.location ? `<span>📍 ${current.location}</span>` : ''}
                            </div>
                        </div>
                        <div class="journal-detail-body">
                            ${current.text.split('\n').map(p => `<p>${p}</p>`).join('')}
                        </div>
                        ${current.photos > 0 ? `
                            <div class="journal-photos">
                                <div class="jp-title">照片</div>
                                <div class="jp-grid">
                                    ${Array(current.photos).fill(0).map((_, i) => `
                                        <div class="jp-photo" style="background:hsl(${i * 60}, 70%, 75%)">
                                            <span style="font-size:24px;">📷</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <div class="journal-detail-actions">
                            <button class="jd-action">🔖 书签</button>
                            <button class="jd-action">📤 分享</button>
                            <button class="jd-action">💭 反思</button>
                        </div>
                    ` : '<div class="journal-empty">选择一篇日记查看</div>'}
                </div>
            </div>
        `;

        body.querySelectorAll('.journal-entry-item').forEach(item => {
            item.addEventListener('click', () => {
                selectedEntry = parseInt(item.dataset.id);
                render();
            });
        });

        body.querySelectorAll('.jf-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filter = btn.dataset.filter;
                render();
            });
        });

        body.querySelector('#journal-new').addEventListener('click', () => {
            const newEntry = {
                id: Date.now(),
                date: Date.now(),
                title: '新的日记',
                text: '今天发生了什么？',
                mood: '😊',
                photos: 0,
                location: ''
            };
            entries.unshift(newEntry);
            selectedEntry = newEntry.id;
            localStorage.setItem('journal_entries', JSON.stringify(entries));
            render();
        });
    }

    function formatDate(ts) {
        const d = new Date(ts);
        const now = new Date();
        const diff = Math.floor((now - d) / 86400000);
        if (diff === 0) return '今天';
        if (diff === 1) return '昨天';
        if (diff < 7) return d.toLocaleDateString('zh-CN', { weekday: 'long' });
        return d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    }

    function formatFullDate(ts) {
        const d = new Date(ts);
        return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit' });
    }

    render();
};

// TestFlight
window.renderTestFlight = function(body, sidebar, toolbar, windowId) {
    const apps = [
        { id: 1, name: 'PhotoMagic', icon: '📷', dev: 'Magic Labs', status: 'testing', version: '2.1.0 (156)', lastUpdate: '2 小时前', build: 156, expires: 45 },
        { id: 2, name: 'TaskFlow', icon: '✅', dev: 'Flow Inc.', status: 'testing', version: '3.0.0 beta 2', lastUpdate: '今天', build: 204, expires: 60 },
        { id: 3, name: 'SoundWave', icon: '🎵', dev: 'Wave Studios', status: 'testing', version: '1.5.0', lastUpdate: '昨天', build: 89, expires: 30 },
        { id: 4, name: 'Fitness+', icon: '💪', dev: 'Health Tech', status: 'testing', version: '2.3.1', lastUpdate: '3 天前', build: 178, expires: 15 },
        { id: 5, name: 'PixelEditor', icon: '🎨', dev: 'Pixel Team', status: 'expired', version: '1.0.0', lastUpdate: '90 天前', build: 1, expires: -5 },
        { id: 6, name: 'CodeBuddy', icon: '💻', dev: 'CodeBase', status: 'accepted', version: '4.2.0', lastUpdate: '1 周前', build: 312, expires: 50 },
    ];

    let activeTab = 'testing';

    function render() {
        const filtered = apps.filter(a => {
            if (activeTab === 'testing') return a.status === 'testing';
            if (activeTab === 'accepted') return a.status === 'accepted';
            if (activeTab === 'expired') return a.status === 'expired';
            return true;
        });

        body.innerHTML = `
            <div class="testflight-container">
                <div class="tf-sidebar">
                    <div class="tf-profile">
                        <div class="tf-avatar">👤</div>
                        <div class="tf-username">Tester_001</div>
                        <div class="tf-apple-id">tester@icloud.com</div>
                    </div>
                    <div class="tf-nav">
                        <div class="tf-nav-item ${activeTab === 'testing' ? 'active' : ''}" data-tab="testing">
                            <span>🧪</span><span>测试中</span>
                            <span class="tf-badge">${apps.filter(a => a.status === 'testing').length}</span>
                        </div>
                        <div class="tf-nav-item ${activeTab === 'accepted' ? 'active' : ''}" data-tab="accepted">
                            <span>✅</span><span>已接受</span>
                        </div>
                        <div class="tf-nav-item ${activeTab === 'expired' ? 'active' : ''}" data-tab="expired">
                            <span>⏰</span><span>已过期</span>
                        </div>
                        <div class="tf-nav-item">
                            <span>🏷️</span><span>兑换码</span>
                        </div>
                    </div>
                </div>
                <div class="tf-main">
                    <div class="tf-header">
                        <div class="tf-title">${activeTab === 'testing' ? '测试中' : activeTab === 'accepted' ? '已接受' : '已过期'}的 App</div>
                        <div class="tf-count">${filtered.length} 个 App</div>
                    </div>
                    <div class="tf-apps">
                        ${filtered.map(app => `
                            <div class="tf-app-card">
                                <div class="tf-app-icon">${app.icon}</div>
                                <div class="tf-app-info">
                                    <div class="tf-app-name">${app.name}</div>
                                    <div class="tf-app-dev">${app.dev}</div>
                                    <div class="tf-app-version">版本 ${app.version}</div>
                                    <div class="tf-app-build">第 ${app.build} 版 · 更新于 ${app.lastUpdate}</div>
                                </div>
                                <div class="tf-app-action">
                                    ${app.status === 'testing' ? `
                                        <button class="tf-btn tf-install">安装</button>
                                        <div class="tf-expires">${app.expires} 天后过期</div>
                                    ` : app.status === 'accepted' ? `
                                        <button class="tf-btn tf-install">安装</button>
                                    ` : `
                                        <button class="tf-btn tf-disabled" disabled>已过期</button>
                                        <div class="tf-expires">过期 ${-app.expires} 天</div>
                                    `}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="tf-footer">
                        <div class="tf-note">
                            <strong>TestFlight 说明</strong><br>
                            测试版 App 可能包含错误，不建议在主要设备上使用。请在反馈助手 App 中提交错误报告。
                        </div>
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.tf-nav-item[data-tab]').forEach(item => {
            item.addEventListener('click', () => {
                activeTab = item.dataset.tab;
                render();
            });
        });
    }

    render();
};

// Tips - 提示
window.renderTips = function(body, sidebar, toolbar, windowId) {
    const collections = [
        { id: 1, name: 'MacBook 使用技巧', icon: '💻', count: 25, color: '#007AFF' },
        { id: 2, name: 'macOS 新功能', icon: '🆕', count: 18, color: '#FF9500' },
        { id: 3, name: 'Siri 快捷指令', icon: '🗣️', count: 30, color: '#AF52DE' },
        { id: 4, name: '照片使用技巧', icon: '📷', count: 15, color: '#FF3B30' },
        { id: 5, name: 'iCloud 使用指南', icon: '☁️', count: 12, color: '#5AC8FA' },
        { id: 6, name: '键盘快捷键', icon: '⌨️', count: 40, color: '#34C759' },
        { id: 7, name: '辅助功能', icon: '♿', count: 20, color: '#5E5CE6' },
        { id: 8, name: '隐私与安全', icon: '🔒', count: 14, color: '#1D1D1F' },
    ];

    const tips = [
        { id: 1, title: '使用快速备忘录快速记录想法', desc: '从屏幕右下角向内轻扫，或按下 Globe 键 + Q 来快速创建备忘录。', icon: '📝', category: 'MacBook 使用技巧', liked: true },
        { id: 2, title: '台前调度让多任务更轻松', desc: '在系统设置中开启台前调度，自动整理打开的 App 和窗口。', icon: '🪟', category: 'macOS 新功能', liked: false },
        { id: 3, title: '用 Siri 设置提醒事项', desc: '告诉 Siri"30 分钟后提醒我喝水"，自动创建提醒。', icon: '⏰', category: 'Siri 快捷指令', liked: true },
        { id: 4, title: '实况文本提取图片中的文字', desc: '在预览或照片中，直接选择并复制图片中的文字。', icon: '📷', category: '照片使用技巧', liked: false },
        { id: 5, title: '用 iCloud 钥匙串保存密码', desc: '在所有设备上自动填充保存的密码和验证码。', icon: '🔑', category: 'iCloud 使用指南', liked: false },
        { id: 6, title: 'Command + 空格 打开聚焦搜索', desc: '快速搜索文件、启动应用、查找定义等。', icon: '🔍', category: '键盘快捷键', liked: true },
        { id: 7, title: '语音控制完全用语音操作 Mac', desc: '无需手动操作，用语音就能完全控制你的 Mac。', icon: '🎙️', category: '辅助功能', liked: false },
        { id: 8, title: '文件保险箱保护你的数据', desc: '开启文件保险箱，对整个磁盘进行加密保护。', icon: '🔐', category: '隐私与安全', liked: false },
    ];

    let activeCollection = null;
    let searchQuery = '';

    function render() {
        body.innerHTML = `
            <div class="tips-container">
                <div class="tips-sidebar">
                    <div class="tips-sidebar-header">
                        <div class="tips-title">提示</div>
                        <input type="text" id="tips-search" placeholder="搜索" value="${searchQuery}">
                    </div>
                    <div class="tips-collections">
                        <div class="tips-collection ${activeCollection === null ? 'active' : ''}" data-id="all">
                            <span>📚</span> 所有提示
                            <span class="tips-count">${tips.length}</span>
                        </div>
                        ${collections.map(c => `
                            <div class="tips-collection ${activeCollection === c.id ? 'active' : ''}" data-id="${c.id}">
                                <span style="background:${c.color}15;color:${c.color};">${c.icon}</span>
                                ${c.name}
                                <span class="tips-count">${c.count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="tips-main">
                    <div class="tips-header">
                        <div class="tips-main-title">
                            ${activeCollection === null ? '所有提示' : collections.find(c => c.id === activeCollection)?.name || '提示'}
                        </div>
                        <div class="tips-sub">精选实用技巧，帮你更好地使用 Mac</div>
                    </div>
                    <div class="tips-grid">
                        ${tips.map(t => `
                            <div class="tip-card">
                                <div class="tip-icon">${t.icon}</div>
                                <div class="tip-title">${t.title}</div>
                                <div class="tip-desc">${t.desc}</div>
                                <div class="tip-footer">
                                    <span class="tip-cat">${t.category}</span>
                                    <button class="tip-like ${t.liked ? 'liked' : ''}">${t.liked ? '❤️' : '🤍'}</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.tips-collection').forEach(c => {
            c.addEventListener('click', () => {
                const id = c.dataset.id;
                activeCollection = id === 'all' ? null : parseInt(id);
                render();
            });
        });

        const search = body.querySelector('#tips-search');
        if (search) {
            search.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                render();
                const s = body.querySelector('#tips-search');
                if (s) s.focus();
            });
        }
    }

    render();
};
