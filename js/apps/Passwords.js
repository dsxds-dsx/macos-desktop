// Passwords - 密码
window.renderPasswords = function(body, sidebar, toolbar, windowId) {
    const passwords = [
        { id: 1, name: 'GitHub', username: 'user@example.com', password: '********', url: 'github.com', lastModified: Date.now() - 86400000 * 3 },
        { id: 2, name: 'Apple ID', username: 'user@icloud.com', password: '********', url: 'appleid.apple.com', lastModified: Date.now() - 86400000 * 7 },
        { id: 3, name: 'Google', username: 'user@gmail.com', password: '********', url: 'google.com', lastModified: Date.now() - 86400000 * 1 },
        { id: 4, name: '微信', username: 'wechat_user', password: '********', url: 'weixin.qq.com', lastModified: Date.now() - 86400000 * 14 },
        { id: 5, name: '淘宝', username: '13800138000', password: '********', url: 'taobao.com', lastModified: Date.now() - 86400000 * 30 },
        { id: 6, name: '知乎', username: 'user@example.com', password: '********', url: 'zhihu.com', lastModified: Date.now() - 86400000 * 5 },
        { id: 7, name: '微博', username: 'user@example.com', password: '********', url: 'weibo.com', lastModified: Date.now() - 86400000 * 20 },
        { id: 8, name: 'Netflix', username: 'user@example.com', password: '********', url: 'netflix.com', lastModified: Date.now() - 86400000 * 10 },
        { id: 9, name: 'Amazon', username: 'user@example.com', password: '********', url: 'amazon.com', lastModified: Date.now() - 86400000 * 45 },
        { id: 10, name: 'Spotify', username: 'user@example.com', password: '********', url: 'spotify.com', lastModified: Date.now() - 86400000 * 2 },
    ];

    let searchQuery = '';
    let selectedId = null;
    let showPassword = null;

    function render() {
        const filtered = passwords.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        body.innerHTML = `
            <div class="passwords-container">
                <div class="passwords-sidebar">
                    <div class="passwords-sidebar-header">
                        <div class="passwords-title">密码</div>
                        <input type="text" id="pwd-search" placeholder="搜索" value="${searchQuery}">
                    </div>
                    <div class="passwords-list">
                        ${filtered.length === 0 ? '<div class="passwords-empty">未找到密码</div>' : ''}
                        ${filtered.map(p => `
                            <div class="password-item ${selectedId === p.id ? 'active' : ''}" data-id="${p.id}">
                                <div class="password-item-icon" style="background:${getColor(p.name)}">${p.name.charAt(0)}</div>
                                <div class="password-item-info">
                                    <div class="password-item-name">${p.name}</div>
                                    <div class="password-item-user">${p.username}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="passwords-detail">
                    ${selectedId ? renderDetail() : `
                        <div class="passwords-detail-empty">
                            <div style="font-size:60px;margin-bottom:16px;">🔐</div>
                            <div style="font-size:18px;font-weight:600;margin-bottom:8px;">选择一个密码</div>
                            <div style="font-size:13px;color:#8E8E93;">从左侧列表选择以查看详情</div>
                        </div>
                    `}
                </div>
            </div>
        `;

        const search = body.querySelector('#pwd-search');
        if (search) {
            search.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                render();
                const newSearch = body.querySelector('#pwd-search');
                if (newSearch) newSearch.focus();
            });
        }

        body.querySelectorAll('.password-item').forEach(item => {
            item.addEventListener('click', () => {
                selectedId = parseInt(item.dataset.id);
                showPassword = null;
                render();
            });
        });

        const toggleBtn = body.querySelector('#pwd-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                showPassword = showPassword === selectedId ? null : selectedId;
                render();
            });
        }
    }

    function renderDetail() {
        const p = passwords.find(x => x.id === selectedId);
        if (!p) return '';
        const revealed = showPassword === selectedId;
        return `
            <div class="password-detail-card">
                <div class="password-detail-icon" style="background:${getColor(p.name)}">${p.name.charAt(0)}</div>
                <div class="password-detail-name">${p.name}</div>
                <div class="password-detail-url">${p.url}</div>
            </div>
            <div class="password-detail-fields">
                <div class="pwd-field">
                    <div class="pwd-field-label">用户名</div>
                    <div class="pwd-field-value">
                        <span>${p.username}</span>
                        <button class="pwd-copy-btn" onclick="navigator.clipboard.writeText('${p.username}')">复制</button>
                    </div>
                </div>
                <div class="pwd-field">
                    <div class="pwd-field-label">密码</div>
                    <div class="pwd-field-value">
                        <span>${revealed ? 'MyStr0ngP@ss!' : '••••••••'}</span>
                        <button class="pwd-copy-btn" id="pwd-toggle">${revealed ? '隐藏' : '显示'}</button>
                    </div>
                </div>
                <div class="pwd-field">
                    <div class="pwd-field-label">网站</div>
                    <div class="pwd-field-value">
                        <a href="#" style="color:#007AFF;">${p.url}</a>
                    </div>
                </div>
                <div class="pwd-field">
                    <div class="pwd-field-label">上次修改</div>
                    <div class="pwd-field-value">
                        <span>${new Date(p.lastModified).toLocaleDateString('zh-CN')}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function getColor(name) {
        const colors = ['#007AFF', '#FF3B30', '#FF9500', '#34C759', '#00C7BE', '#5AC8FA', '#AF52DE', '#FF2D55', '#FFCC00', '#5E5CE6'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }

    render();
};
