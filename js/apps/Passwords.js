// Passwords - 密码 (macOS Sonoma)
window.renderPasswords = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_passwords_v2';

    const ICONS = {
        all: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
        wifi: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
        passkey: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="12" r="3"/><path d="M10 12h10v3M18 15v3"/></svg>`,
        shield: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        trash: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        key: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/></svg>`,
        search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
        add: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
        copy: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
        eye: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        eyeOff: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
        edit: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
        delete: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        back: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
        more: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        check: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
        generate: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`
    };

    const CATEGORY_ICONS = {
        all: ICONS.all,
        wifi: ICONS.wifi,
        passkey: ICONS.passkey,
        security: ICONS.shield,
        trash: ICONS.trash
    };

    function defaultPasswords() {
        return [
            { id: 1, name: 'GitHub', username: 'user@example.com', password: 'G1tHub!2024', url: 'github.com', lastModified: Date.now() - 86400000 * 3, otp: true, notes: '个人账号', favorite: true, type: 'login' },
            { id: 2, name: 'Apple ID', username: 'user@icloud.com', password: 'AppleSecure#9', url: 'appleid.apple.com', lastModified: Date.now() - 86400000 * 7, otp: true, notes: '', favorite: true, type: 'login' },
            { id: 3, name: 'Google', username: 'user@gmail.com', password: 'Google2024$tr0ng', url: 'google.com', lastModified: Date.now() - 86400000 * 1, otp: true, notes: '主邮箱', favorite: false, type: 'login' },
            { id: 4, name: '微信', username: 'wechat_user', password: 'WeChat_8866', url: 'weixin.qq.com', lastModified: Date.now() - 86400000 * 14, otp: false, notes: '', favorite: false, type: 'login' },
            { id: 5, name: '淘宝', username: '13800138000', password: 'TaoBao2024!', url: 'taobao.com', lastModified: Date.now() - 86400000 * 30, otp: false, notes: '', favorite: false, type: 'login' },
            { id: 6, name: '知乎', username: 'user@example.com', password: 'Zhihu_2024', url: 'zhihu.com', lastModified: Date.now() - 86400000 * 5, otp: false, notes: '', favorite: false, type: 'login' },
            { id: 7, name: '微博', username: 'user@example.com', password: 'Weibo@2024', url: 'weibo.com', lastModified: Date.now() - 86400000 * 20, otp: false, notes: '', favorite: false, type: 'login' },
            { id: 8, name: 'Netflix', username: 'user@example.com', password: 'Netflix#2024', url: 'netflix.com', lastModified: Date.now() - 86400000 * 10, otp: false, notes: '共享账号', favorite: false, type: 'login' },
            { id: 9, name: 'Amazon', username: 'user@example.com', password: 'Amazon2024!', url: 'amazon.com', lastModified: Date.now() - 86400000 * 45, otp: true, notes: '', favorite: false, type: 'login' },
            { id: 10, name: '家庭 Wi-Fi', username: '', password: 'MyHomeWiFi_5G', url: '', lastModified: Date.now() - 86400000 * 60, otp: false, notes: '家庭网络', favorite: false, type: 'wifi' },
            { id: 11, name: '公司 Wi-Fi', username: '', password: 'OfficeSecure2024', url: '', lastModified: Date.now() - 86400000 * 90, otp: false, notes: '', favorite: false, type: 'wifi' }
        ];
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
        passwords: defaultPasswords(),
        trash: [],
        activeCategory: 'all',
        searchQuery: '',
        selectedId: 1
    };

    // migrate old format
    if (data.passwords && data.passwords.length && typeof data.passwords[0].type === 'undefined') {
        data.passwords.forEach(p => { if (!p.type) p.type = 'login'; if (p.favorite === undefined) p.favorite = false; });
    }
    if (!data.trash) data.trash = [];

    let showPassword = null;
    let editing = false;
    let addingNew = false;
    let otpInterval = null;

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getColor(name) {
        const colors = ['#007AFF', '#FF3B30', '#FF9500', '#34C759', '#00C7BE', '#5AC8FA', '#AF52DE', '#FF2D55', '#FFCC00', '#5E5CE6'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }

    function passwordStrength(pw) {
        if (!pw) return { score: 0, label: '无', color: '#8E8E93' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[a-z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (score <= 2) return { score, label: '弱', color: '#FF3B30' };
        if (score <= 4) return { score, label: '中等', color: '#FF9500' };
        return { score, label: '强', color: '#34C759' };
    }

    function getOtpCode(seed) {
        const period = 30;
        const t = Math.floor(Date.now() / 1000 / period);
        let hash = 0;
        const s = String(seed) + ':' + t;
        for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash) + s.charCodeAt(i);
        const code = Math.abs(hash) % 1000000;
        return String(code).padStart(6, '0');
    }

    function getOtpRemaining() {
        return 30 - (Math.floor(Date.now() / 1000) % 30);
    }

    function securityAnalysis() {
        const reused = {};
        data.passwords.forEach(p => {
            if (p.type !== 'wifi') reused[p.password] = (reused[p.password] || 0) + 1;
        });
        const reusedCount = Object.values(reused).filter(c => c > 1).reduce((a, b) => a + b, 0);
        const weak = data.passwords.filter(p => p.type !== 'wifi' && passwordStrength(p.password).score <= 2).length;
        const withOtp = data.passwords.filter(p => p.otp).length;
        const score = Math.max(0, 100 - weak * 10 - reusedCount * 5);
        return { total: data.passwords.length, reused: reusedCount, weak, withOtp, score };
    }

    function getFilteredPasswords() {
        let list = data.passwords;
        if (data.activeCategory === 'wifi') list = list.filter(p => p.type === 'wifi');
        else if (data.activeCategory === 'passkey') list = list.filter(p => p.type === 'passkey');
        else if (data.activeCategory === 'trash') list = data.trash;
        else if (data.activeCategory === 'security') {
            // show weak/reused
            const reusedPws = {};
            list.forEach(p => { if (p.type !== 'wifi') reusedPws[p.password] = (reusedPws[p.password] || 0) + 1; });
            list = list.filter(p => p.type !== 'wifi' && (passwordStrength(p.password).score <= 2 || (reusedPws[p.password] || 0) > 1));
        }
        if (data.searchQuery) {
            const q = data.searchQuery.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) || (p.url || '').toLowerCase().includes(q));
        }
        return list;
    }

    function getSelected() {
        return data.passwords.find(p => p.id === data.selectedId) || null;
    }

    function showToast(text, type = 'success') {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text, type);
    }

    function relativeTime(ts) {
        if (!ts) return '未知';
        const diff = Date.now() - ts;
        const day = Math.floor(diff / 86400000);
        if (day < 1) return '今天';
        if (day < 2) return '昨天';
        if (day < 7) return day + ' 天前';
        if (day < 30) return Math.floor(day / 7) + ' 周前';
        return new Date(ts).toLocaleDateString('zh-CN');
    }

    function renderSidebar() {
        const counts = {
            all: data.passwords.length,
            wifi: data.passwords.filter(p => p.type === 'wifi').length,
            passkey: data.passwords.filter(p => p.type === 'passkey').length,
            security: (() => {
                const reusedPws = {};
                data.passwords.forEach(p => { if (p.type !== 'wifi') reusedPws[p.password] = (reusedPws[p.password] || 0) + 1; });
                return data.passwords.filter(p => p.type !== 'wifi' && (passwordStrength(p.password).score <= 2 || (reusedPws[p.password] || 0) > 1)).length;
            })(),
            trash: data.trash.length
        };

        const categories = [
            { id: 'all', name: '所有密码', icon: 'all' },
            { id: 'wifi', name: 'Wi-Fi 密码', icon: 'wifi' },
            { id: 'passkey', name: '通行密钥', icon: 'passkey' },
            { id: 'security', name: '安全建议', icon: 'security' },
            { id: 'trash', name: '最近删除', icon: 'trash' }
        ];

        const filtered = getFilteredPasswords();

        return `
            <div class="pwd-side">
                <div class="pwd-side-header">
                    <div class="pwd-side-eyebrow">密码</div>
                    <div class="pwd-side-title-row">
                        <h1 class="pwd-side-title">密码</h1>
                        <button class="pwd-icon-btn" id="pwd-add" title="新增密码">${ICONS.add}</button>
                    </div>
                </div>
                <div class="pwd-search">
                    ${ICONS.search}
                    <input type="text" id="pwd-search-input" placeholder="搜索密码" value="${escapeHtml(data.searchQuery)}">
                </div>
                <div class="pwd-nav">
                    ${categories.map(cat => `
                        <div class="pwd-nav-item ${data.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                            ${CATEGORY_ICONS[cat.icon]}
                            <span>${escapeHtml(cat.name)}</span>
                            ${counts[cat.id] ? `<span class="pwd-count ${cat.id === 'security' && counts[cat.id] > 0 ? 'warn' : ''}">${counts[cat.id]}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="pwd-list">
                    <div class="pwd-list-title">${data.activeCategory === 'trash' ? '最近删除' : '密码'}</div>
                    ${filtered.length === 0 ? `
                        <div class="pwd-empty-list">没有密码</div>
                    ` : filtered.map(p => {
                        const st = passwordStrength(p.password);
                        return `
                            <div class="pwd-list-item ${data.selectedId === p.id ? 'active' : ''}" data-id="${p.id}">
                                <div class="pwd-list-icon" style="background:${getColor(p.name)}">
                                    ${p.type === 'wifi' ? ICONS.wifi : escapeHtml(p.name.charAt(0).toUpperCase())}
                                </div>
                                <div class="pwd-list-info">
                                    <div class="pwd-list-name">${escapeHtml(p.name)}</div>
                                    <div class="pwd-list-user">${escapeHtml(p.username || p.url || '—')}</div>
                                </div>
                                ${p.otp ? `<div class="pwd-list-otp" title="双重认证">${ICONS.shield}</div>` : ''}
                                ${data.activeCategory !== 'security' ? `<span class="pwd-list-strength" style="background:${st.color};" title="强度：${st.label}"></span>` : `<span class="pwd-list-strength warn" style="background:${st.color};"></span>`}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderToolbar() {
        const sec = securityAnalysis();
        return `
            <div class="pwd-toolbar">
                <div class="pwd-toolbar-left">
                    <button class="pwd-tb-btn" id="pwd-tb-add" title="新增密码">${ICONS.add}<span>新增密码</span></button>
                    <div class="pwd-tb-sep"></div>
                    <button class="pwd-tb-btn" id="pwd-tb-generate" title="生成密码">${ICONS.generate}<span>生成</span></button>
                </div>
                <div class="pwd-toolbar-right">
                    <div class="pwd-security-score">
                        <div class="pwd-score-ring" style="background: conic-gradient(${sec.score >= 80 ? '#34C759' : sec.score >= 50 ? '#FF9500' : '#FF3B30'} ${sec.score * 3.6}deg, var(--button-bg) ${sec.score * 3.6}deg);">
                            <div class="pwd-score-inner">${sec.score}</div>
                        </div>
                        <div class="pwd-score-info">
                            <div class="pwd-score-label">安全等级</div>
                            <div class="pwd-score-detail">${sec.total} 个密码 · ${sec.weak} 个弱密码</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderEmpty() {
        return `
            <div class="pwd-detail-empty">
                <div class="pwd-empty-icon">${ICONS.key}</div>
                <div class="pwd-empty-title">选择一个密码</div>
                <div class="pwd-empty-sub">从左侧列表选择以查看详情，或点击 + 添加新密码</div>
            </div>
        `;
    }

    function renderDetail(p) {
        const revealed = showPassword === p.id;
        const st = passwordStrength(p.password);

        if (editing) return renderEditForm(p, '编辑密码', '存储');

        return `
            <div class="pwd-detail-scroll">
                <div class="pwd-detail-card">
                    <div class="pwd-detail-icon" style="background:${getColor(p.name)}">${p.type === 'wifi' ? ICONS.wifi : escapeHtml(p.name.charAt(0).toUpperCase())}</div>
                    <div class="pwd-detail-info">
                        <div class="pwd-detail-name">${escapeHtml(p.name)}</div>
                        ${p.url ? `<div class="pwd-detail-url">${escapeHtml(p.url)}</div>` : ''}
                    </div>
                    <button class="pwd-detail-edit" id="pwd-edit" title="编辑">${ICONS.edit}</button>
                </div>

                ${p.otp ? `
                    <div class="pwd-otp-card">
                        <div class="pwd-otp-header">
                            <div class="pwd-otp-label">验证码</div>
                            <div class="pwd-otp-remaining" id="pwd-otp-remain-${windowId}">${getOtpRemaining()} 秒后刷新</div>
                        </div>
                        <div class="pwd-otp-code" id="pwd-otp-code-${windowId}">${getOtpCode(p.id)}</div>
                        <div class="pwd-otp-bar"><div class="pwd-otp-fill" id="pwd-otp-fill-${windowId}" style="width:${(getOtpRemaining() / 30) * 100}%;"></div></div>
                    </div>
                ` : ''}

                <div class="pwd-detail-fields">
                    ${p.username ? `
                        <div class="pwd-field">
                            <div class="pwd-field-label">用户名</div>
                            <div class="pwd-field-value">
                                <span class="pwd-field-text">${escapeHtml(p.username)}</span>
                                <button class="pwd-copy-btn" data-copy="${escapeHtml(p.username)}">${ICONS.copy}<span>复制</span></button>
                            </div>
                        </div>
                    ` : ''}
                    <div class="pwd-field">
                        <div class="pwd-field-label">密码</div>
                        <div class="pwd-field-value">
                            <span class="pwd-field-text mono">${revealed ? escapeHtml(p.password) : '••••••••••'}</span>
                            <div class="pwd-field-actions">
                                <button class="pwd-copy-btn" data-copy="${escapeHtml(p.password)}">${ICONS.copy}<span>复制</span></button>
                                <button class="pwd-copy-btn" id="pwd-toggle">${revealed ? ICONS.eyeOff : ICONS.eye}</button>
                            </div>
                        </div>
                        <div class="pwd-strength-row">
                            <span class="pwd-strength-bar"><span style="width:${(st.score / 6) * 100}%;background:${st.color};"></span></span>
                            <span class="pwd-strength-text" style="color:${st.color};">强度：${st.label}</span>
                        </div>
                    </div>
                    ${p.url ? `
                        <div class="pwd-field">
                            <div class="pwd-field-label">网站</div>
                            <div class="pwd-field-value">
                                <span class="pwd-field-text">${escapeHtml(p.url)}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${p.notes ? `
                        <div class="pwd-field">
                            <div class="pwd-field-label">备注</div>
                            <div class="pwd-field-value">
                                <span class="pwd-field-text">${escapeHtml(p.notes)}</span>
                            </div>
                        </div>
                    ` : ''}
                    <div class="pwd-field">
                        <div class="pwd-field-label">上次修改</div>
                        <div class="pwd-field-value">
                            <span class="pwd-field-text">${relativeTime(p.lastModified)}</span>
                        </div>
                    </div>
                </div>

                <div class="pwd-detail-actions">
                    <button class="pwd-action-btn danger" id="pwd-delete">${ICONS.delete}<span>删除密码</span></button>
                </div>

                <div class="pwd-security-tip">
                    ${ICONS.shield}
                    <span>已开启 iCloud 钥匙串，密码将在所有设备同步</span>
                </div>
            </div>
        `;
    }

    function renderEditForm(p, title, saveText) {
        return `
            <div class="pwd-detail-scroll">
                <div class="pwd-form">
                    <div class="pwd-form-title">${escapeHtml(title)}</div>
                    <div class="pwd-form-row">
                        <label>名称</label>
                        <input type="text" id="pwd-f-name" value="${escapeHtml(p.name)}" placeholder="例如：GitHub">
                    </div>
                    <div class="pwd-form-row">
                        <label>用户名</label>
                        <input type="text" id="pwd-f-user" value="${escapeHtml(p.username)}" placeholder="用户名或邮箱">
                    </div>
                    <div class="pwd-form-row">
                        <label>密码</label>
                        <div class="pwd-form-pass-row">
                            <input type="text" id="pwd-f-pass" value="${escapeHtml(p.password)}" placeholder="密码">
                            <button class="pwd-gen-btn" id="pwd-f-gen" title="生成强密码">${ICONS.generate}</button>
                        </div>
                    </div>
                    <div class="pwd-form-row">
                        <label>网站</label>
                        <input type="text" id="pwd-f-url" value="${escapeHtml(p.url || '')}" placeholder="example.com">
                    </div>
                    <div class="pwd-form-row">
                        <label>备注</label>
                        <input type="text" id="pwd-f-notes" value="${escapeHtml(p.notes || '')}" placeholder="可选">
                    </div>
                    <div class="pwd-form-row">
                        <label>双重认证</label>
                        <label class="pwd-toggle-switch">
                            <input type="checkbox" id="pwd-f-otp" ${p.otp ? 'checked' : ''}>
                            <span class="pwd-toggle-slider"></span>
                        </label>
                    </div>
                    <div class="pwd-form-actions">
                        <button class="pwd-form-cancel" id="pwd-f-cancel">取消</button>
                        <button class="pwd-form-save" id="pwd-f-save">${escapeHtml(saveText)}</button>
                    </div>
                </div>
            </div>
        `;
    }

    function renderNewForm() {
        return renderEditForm({ name: '', username: '', password: '', url: '', notes: '', otp: false, type: 'login', lastModified: Date.now() }, '新增密码', '添加密码');
    }

    function renderTrashDetail(p) {
        return `
            <div class="pwd-detail-scroll">
                <div class="pwd-detail-card">
                    <div class="pwd-detail-icon" style="background:${getColor(p.name)}">${p.type === 'wifi' ? ICONS.wifi : escapeHtml(p.name.charAt(0).toUpperCase())}</div>
                    <div class="pwd-detail-info">
                        <div class="pwd-detail-name">${escapeHtml(p.name)}</div>
                        <div class="pwd-detail-url">已删除</div>
                    </div>
                </div>
                <div class="pwd-detail-actions">
                    <button class="pwd-action-btn" id="pwd-restore">恢复密码</button>
                    <button class="pwd-action-btn danger" id="pwd-delete-forever">永久删除</button>
                </div>
            </div>
        `;
    }

    function renderBody() {
        if (addingNew) return renderNewForm();
        if (data.activeCategory === 'trash') {
            const p = data.trash.find(x => x.id === data.selectedId);
            if (p) return renderTrashDetail(p);
            return renderEmpty();
        }
        const p = getSelected();
        if (!p) return renderEmpty();
        return renderDetail(p);
    }

    function render() {
        if (otpInterval) { clearInterval(otpInterval); otpInterval = null; }
        sidebar.innerHTML = renderSidebar();
        toolbar.innerHTML = renderToolbar();
        body.innerHTML = `<div class="pwd-detail-wrap">${renderBody()}</div>`;
        bindSidebar();
        bindToolbar();
        bindBody();
        startOtpTimer();
    }

    function bindSidebar() {
        sidebar.querySelectorAll('.pwd-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                data.activeCategory = item.dataset.cat;
                const filtered = getFilteredPasswords();
                if (filtered.length && !filtered.find(p => p.id === data.selectedId)) {
                    data.selectedId = filtered[0].id;
                } else if (!filtered.length) {
                    data.selectedId = null;
                }
                addingNew = false;
                editing = false;
                save();
                render();
            });
        });

        sidebar.querySelectorAll('.pwd-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                data.selectedId = id;
                addingNew = false;
                editing = false;
                showPassword = null;
                if (data.activeCategory === 'trash') {
                    // restore on click in trash? No, show detail
                    render();
                } else {
                    render();
                }
            });
        });

        const searchInput = sidebar.querySelector('#pwd-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                data.searchQuery = searchInput.value;
                render();
                const newInput = sidebar.querySelector('#pwd-search-input');
                if (newInput) {
                    newInput.focus();
                    newInput.setSelectionRange(data.searchQuery.length, data.searchQuery.length);
                }
            });
        }

        const addBtn = sidebar.querySelector('#pwd-add');
        if (addBtn) addBtn.addEventListener('click', startAdd);
    }

    function bindToolbar() {
        const addBtn = toolbar.querySelector('#pwd-tb-add');
        if (addBtn) addBtn.addEventListener('click', startAdd);
        const genBtn = toolbar.querySelector('#pwd-tb-generate');
        if (genBtn) genBtn.addEventListener('click', () => {
            const pw = generatePassword();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(pw).then(() => showToast('已生成并复制密码'));
            } else {
                showToast('已生成密码：' + pw);
            }
        });
    }

    function generatePassword() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
        let pw = '';
        for (let i = 0; i < 16; i++) pw += chars[Math.floor(Math.random() * chars.length)];
        return pw;
    }

    function startAdd() {
        addingNew = true;
        editing = false;
        data.activeCategory = 'all';
        render();
        const nameInput = body.querySelector('#pwd-f-name');
        if (nameInput) nameInput.focus();
    }

    function bindBody() {
        const toggleBtn = body.querySelector('#pwd-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                showPassword = showPassword === data.selectedId ? null : data.selectedId;
                render();
            });
        }

        body.querySelectorAll('[data-copy]').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.copy;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => showToast('已复制到剪贴板')).catch(() => showToast('复制失败', 'error'));
                } else {
                    showToast('已复制');
                }
            });
        });

        body.querySelector('#pwd-edit')?.addEventListener('click', () => { editing = true; render(); });

        body.querySelector('#pwd-delete')?.addEventListener('click', () => {
            const p = getSelected();
            if (!p) return;
            const idx = data.passwords.indexOf(p);
            data.trash.push(p);
            data.passwords.splice(idx, 1);
            const remaining = getFilteredPasswords();
            data.selectedId = remaining.length ? remaining[Math.min(idx, remaining.length - 1)].id : null;
            save();
            showToast(`已删除「${p.name}」`);
            render();
        });

        body.querySelector('#pwd-restore')?.addEventListener('click', () => {
            const idx = data.trash.findIndex(p => p.id === data.selectedId);
            if (idx > -1) {
                data.passwords.push(data.trash[idx]);
                data.trash.splice(idx, 1);
                data.activeCategory = 'all';
                save();
                showToast('已恢复密码');
                render();
            }
        });

        body.querySelector('#pwd-delete-forever')?.addEventListener('click', () => {
            const idx = data.trash.findIndex(p => p.id === data.selectedId);
            if (idx > -1) {
                const name = data.trash[idx].name;
                data.trash.splice(idx, 1);
                data.selectedId = data.trash.length ? data.trash[0].id : null;
                save();
                showToast(`已永久删除「${name}」`);
                render();
            }
        });

        const saveBtn = body.querySelector('#pwd-f-save');
        const cancelBtn = body.querySelector('#pwd-f-cancel');
        const genFieldBtn = body.querySelector('#pwd-f-gen');

        cancelBtn?.addEventListener('click', () => { editing = false; addingNew = false; render(); });
        genFieldBtn?.addEventListener('click', () => {
            const passInput = body.querySelector('#pwd-f-pass');
            if (passInput) {
                passInput.value = generatePassword();
                passInput.focus();
            }
        });

        saveBtn?.addEventListener('click', () => {
            const name = body.querySelector('#pwd-f-name').value.trim();
            const username = body.querySelector('#pwd-f-user').value.trim();
            const password = body.querySelector('#pwd-f-pass').value;
            const url = body.querySelector('#pwd-f-url').value.trim();
            const notes = body.querySelector('#pwd-f-notes').value.trim();
            const otp = body.querySelector('#pwd-f-otp').checked;
            if (!name) { showToast('请输入名称', 'error'); return; }
            if (addingNew) {
                const newId = Date.now();
                data.passwords.unshift({ id: newId, name, username, password, url, lastModified: Date.now(), otp, notes, favorite: false, type: 'login' });
                data.selectedId = newId;
                showToast(`已添加「${name}」`);
            } else {
                const p = getSelected();
                if (p) {
                    p.name = name; p.username = username; p.password = password;
                    p.url = url; p.otp = otp; p.notes = notes; p.lastModified = Date.now();
                    showToast('已保存修改');
                }
            }
            save();
            editing = false;
            addingNew = false;
            render();
        });
    }

    function startOtpTimer() {
        if (data.activeCategory === 'trash' || addingNew || editing) return;
        const p = getSelected();
        if (!p || !p.otp) return;
        otpInterval = setInterval(() => {
            const codeEl = body.querySelector(`#pwd-otp-code-${windowId}`);
            const fillEl = body.querySelector(`#pwd-otp-fill-${windowId}`);
            const remainEl = body.querySelector(`#pwd-otp-remain-${windowId}`);
            if (!codeEl) { clearInterval(otpInterval); otpInterval = null; return; }
            const remaining = getOtpRemaining();
            if (remaining === 30) codeEl.textContent = getOtpCode(p.id);
            if (fillEl) fillEl.style.width = (remaining / 30) * 100 + '%';
            if (remainEl) remainEl.textContent = remaining + ' 秒后刷新';
        }, 1000);
    }

    render();
};
