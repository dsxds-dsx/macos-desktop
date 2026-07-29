// Passwords - 密码
window.renderPasswords = function(body, sidebar, toolbar, windowId) {
    let passwords = JSON.parse(localStorage.getItem('macos_passwords') || 'null') || [
        { id: 1, name: 'GitHub', username: 'user@example.com', password: 'G1tHub!2024', url: 'github.com', lastModified: Date.now() - 86400000 * 3, otp: true, notes: '个人账号' },
        { id: 2, name: 'Apple ID', username: 'user@icloud.com', password: 'AppleSecure#9', url: 'appleid.apple.com', lastModified: Date.now() - 86400000 * 7, otp: true, notes: '' },
        { id: 3, name: 'Google', username: 'user@gmail.com', password: 'Google2024$tr0ng', url: 'google.com', lastModified: Date.now() - 86400000 * 1, otp: true, notes: '主邮箱' },
        { id: 4, name: '微信', username: 'wechat_user', password: 'WeChat_8866', url: 'weixin.qq.com', lastModified: Date.now() - 86400000 * 14, otp: false, notes: '' },
        { id: 5, name: '淘宝', username: '13800138000', password: 'TaoBao2024!', url: 'taobao.com', lastModified: Date.now() - 86400000 * 30, otp: false, notes: '' },
        { id: 6, name: '知乎', username: 'user@example.com', password: 'Zhihu_2024', url: 'zhihu.com', lastModified: Date.now() - 86400000 * 5, otp: false, notes: '' },
        { id: 7, name: '微博', username: 'user@example.com', password: 'Weibo@2024', url: 'weibo.com', lastModified: Date.now() - 86400000 * 20, otp: false, notes: '' },
        { id: 8, name: 'Netflix', username: 'user@example.com', password: 'Netflix#2024', url: 'netflix.com', lastModified: Date.now() - 86400000 * 10, otp: false, notes: '共享账号' },
        { id: 9, name: 'Amazon', username: 'user@example.com', password: 'Amazon2024!', url: 'amazon.com', lastModified: Date.now() - 86400000 * 45, otp: true, notes: '' },
        { id: 10, name: 'Spotify', username: 'user@example.com', password: 'Spotify#24', url: 'spotify.com', lastModified: Date.now() - 86400000 * 2, otp: false, notes: '' },
    ];

    let searchQuery = '';
    let selectedId = passwords[0].id;
    let showPassword = null;
    let editing = false;
    let addingNew = false;

    function save() {
        localStorage.setItem('macos_passwords', JSON.stringify(passwords));
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
        // pseudo-TOTP for display purposes only
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
        passwords.forEach(p => {
            reused[p.password] = (reused[p.password] || 0) + 1;
        });
        const reusedCount = Object.values(reused).filter(c => c > 1).reduce((a, b) => a + b, 0);
        const weak = passwords.filter(p => passwordStrength(p.password).score <= 2).length;
        const withOtp = passwords.filter(p => p.otp).length;
        return { total: passwords.length, reused: reusedCount, weak, withOtp, score: Math.max(0, 100 - weak * 10 - reusedCount * 5) };
    }

    function render() {
        const filtered = passwords.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        body.innerHTML = `
            <div class="passwords-container">
                <div class="passwords-sidebar">
                    <div class="passwords-sidebar-header">
                        <div class="passwords-title-row">
                            <div class="passwords-title">密码</div>
                            <button class="passwords-add-btn" id="pwd-add" title="新增密码">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                            </button>
                        </div>
                        <div class="passwords-search-wrap">
                            <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                            <input type="text" id="pwd-search" placeholder="搜索密码" value="${escapeHtml(searchQuery)}">
                        </div>
                    </div>
                    <div class="passwords-list">
                        ${filtered.length === 0 ? '<div class="passwords-empty">未找到密码</div>' : filtered.map(p => {
                            const st = passwordStrength(p.password);
                            return `
                            <div class="password-item ${selectedId === p.id ? 'active' : ''}" data-id="${p.id}">
                                <div class="password-item-icon" style="background:${getColor(p.name)}">${escapeHtml(p.name.charAt(0).toUpperCase())}</div>
                                <div class="password-item-info">
                                    <div class="password-item-name">${escapeHtml(p.name)}</div>
                                    <div class="password-item-user">${escapeHtml(p.username)}</div>
                                </div>
                                ${p.otp ? `<svg class="password-item-otp" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="双重认证"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>` : ''}
                                <span class="password-item-strength" style="background:${st.color};" title="强度：${st.label}"></span>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="passwords-detail">
                    ${addingNew ? renderNewForm() : (selectedId ? renderDetail() : renderEmpty())}
                </div>
            </div>
        `;

        const search = body.querySelector('#pwd-search');
        if (search) {
            search.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                render();
                const newSearch = body.querySelector('#pwd-search');
                if (newSearch) { newSearch.focus(); newSearch.setSelectionRange(searchQuery.length, searchQuery.length); }
            });
        }

        body.querySelectorAll('.password-item').forEach(item => {
            item.addEventListener('click', () => {
                selectedId = parseInt(item.dataset.id);
                showPassword = null;
                addingNew = false;
                render();
            });
        });

        body.querySelector('#pwd-add')?.addEventListener('click', () => {
            addingNew = true;
            render();
        });

        bindDetailEvents();
    }

    function renderEmpty() {
        return `
            <div class="passwords-detail-empty">
                <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <div class="passwords-empty-title">选择一个密码</div>
                <div class="passwords-empty-sub">从左侧列表选择以查看详情，或点击 + 添加新密码</div>
            </div>
        `;
    }

    function renderDetail() {
        const p = passwords.find(x => x.id === selectedId);
        if (!p) return renderEmpty();
        const revealed = showPassword === selectedId;
        const st = passwordStrength(p.password);
        const sec = securityAnalysis();

        if (editing) {
            return renderEditForm(p);
        }

        return `
            <div class="password-detail-scroll">
                <div class="password-detail-card">
                    <div class="password-detail-icon" style="background:${getColor(p.name)}">${escapeHtml(p.name.charAt(0).toUpperCase())}</div>
                    <div class="password-detail-name">${escapeHtml(p.name)}</div>
                    <a class="password-detail-url">${escapeHtml(p.url)}</a>
                </div>

                ${p.otp ? `
                    <div class="pwd-otp-card">
                        <div class="pwd-otp-label">验证码</div>
                        <div class="pwd-otp-code" id="pwd-otp-code-${windowId}">${getOtpCode(p.id)}</div>
                        <div class="pwd-otp-bar"><div class="pwd-otp-fill" id="pwd-otp-fill-${windowId}" style="width:${(getOtpRemaining() / 30) * 100}%;"></div></div>
                        <div class="pwd-otp-remaining" id="pwd-otp-remain-${windowId}">${getOtpRemaining()} 秒后刷新</div>
                    </div>
                ` : ''}

                <div class="password-detail-fields">
                    <div class="pwd-field">
                        <div class="pwd-field-label">用户名</div>
                        <div class="pwd-field-value">
                            <span class="pwd-field-text">${escapeHtml(p.username)}</span>
                            <button class="pwd-copy-btn" data-copy="${escapeHtml(p.username)}">复制</button>
                        </div>
                    </div>
                    <div class="pwd-field">
                        <div class="pwd-field-label">密码</div>
                        <div class="pwd-field-value">
                            <span class="pwd-field-text">${revealed ? escapeHtml(p.password) : '••••••••••'}</span>
                            <div class="pwd-field-actions">
                                <button class="pwd-copy-btn" data-copy="${escapeHtml(p.password)}">复制</button>
                                <button class="pwd-copy-btn" id="pwd-toggle">${revealed ? '隐藏' : '显示'}</button>
                            </div>
                        </div>
                        <div class="pwd-strength-row">
                            <span class="pwd-strength-bar"><span style="width:${(st.score / 6) * 100}%;background:${st.color};"></span></span>
                            <span class="pwd-strength-text" style="color:${st.color};">强度：${st.label}</span>
                        </div>
                    </div>
                    <div class="pwd-field">
                        <div class="pwd-field-label">网站</div>
                        <div class="pwd-field-value">
                            <span class="pwd-field-text">${escapeHtml(p.url)}</span>
                        </div>
                    </div>
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
                            <span class="pwd-field-text">${new Date(p.lastModified).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <div class="password-detail-actions">
                    <button class="pwd-action-btn" id="pwd-edit">编辑</button>
                    <button class="pwd-action-btn danger" id="pwd-delete">删除</button>
                </div>

                <div class="pwd-security-tip">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span>已开启 iCloud 钥匙串，密码将在所有设备同步</span>
                </div>
            </div>
        `;
    }

    function renderEditForm(p) {
        return `
            <div class="pwd-form">
                <div class="pwd-form-title">编辑密码</div>
                <div class="pwd-form-row">
                    <label>名称</label>
                    <input type="text" id="pwd-f-name" value="${escapeHtml(p.name)}">
                </div>
                <div class="pwd-form-row">
                    <label>用户名</label>
                    <input type="text" id="pwd-f-user" value="${escapeHtml(p.username)}">
                </div>
                <div class="pwd-form-row">
                    <label>密码</label>
                    <input type="text" id="pwd-f-pass" value="${escapeHtml(p.password)}">
                </div>
                <div class="pwd-form-row">
                    <label>网站</label>
                    <input type="text" id="pwd-f-url" value="${escapeHtml(p.url)}">
                </div>
                <div class="pwd-form-row">
                    <label>备注</label>
                    <input type="text" id="pwd-f-notes" value="${escapeHtml(p.notes || '')}">
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
                    <button class="pwd-form-save" id="pwd-f-save">存储</button>
                </div>
            </div>
        `;
    }

    function renderNewForm() {
        return `
            <div class="pwd-form">
                <div class="pwd-form-title">新增密码</div>
                <div class="pwd-form-row">
                    <label>名称</label>
                    <input type="text" id="pwd-f-name" placeholder="例如：GitHub" autofocus>
                </div>
                <div class="pwd-form-row">
                    <label>用户名</label>
                    <input type="text" id="pwd-f-user" placeholder="用户名或邮箱">
                </div>
                <div class="pwd-form-row">
                    <label>密码</label>
                    <input type="text" id="pwd-f-pass" placeholder="密码">
                </div>
                <div class="pwd-form-row">
                    <label>网站</label>
                    <input type="text" id="pwd-f-url" placeholder="example.com">
                </div>
                <div class="pwd-form-row">
                    <label>备注</label>
                    <input type="text" id="pwd-f-notes" placeholder="可选">
                </div>
                <div class="pwd-form-row">
                    <label>双重认证</label>
                    <label class="pwd-toggle-switch">
                        <input type="checkbox" id="pwd-f-otp">
                        <span class="pwd-toggle-slider"></span>
                    </label>
                </div>
                <div class="pwd-form-actions">
                    <button class="pwd-form-cancel" id="pwd-f-cancel">取消</button>
                    <button class="pwd-form-save" id="pwd-f-save">添加密码</button>
                </div>
            </div>
        `;
    }

    function bindDetailEvents() {
        const toggleBtn = body.querySelector('#pwd-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                showPassword = showPassword === selectedId ? null : selectedId;
                render();
            });
        }

        body.querySelectorAll('[data-copy]').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.dataset.copy;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        if (window.toast) window.toast('已复制到剪贴板', 'success');
                    }).catch(() => {
                        if (window.toast) window.toast('复制失败', 'error');
                    });
                } else if (window.toast) {
                    window.toast('已复制', 'success');
                }
            });
        });

        body.querySelector('#pwd-edit')?.addEventListener('click', () => {
            editing = true;
            render();
        });

        body.querySelector('#pwd-delete')?.addEventListener('click', () => {
            const p = passwords.find(x => x.id === selectedId);
            if (!p) return;
            if (passwords.length <= 1) {
                if (window.toast) window.toast('至少保留一个密码', 'info');
                return;
            }
            const idx = passwords.indexOf(p);
            passwords.splice(idx, 1);
            selectedId = passwords[Math.min(idx, passwords.length - 1)].id;
            save();
            if (window.toast) window.toast(`已删除「${p.name}」`, 'success');
            render();
        });

        // edit/new form save
        const saveBtn = body.querySelector('#pwd-f-save');
        const cancelBtn = body.querySelector('#pwd-f-cancel');
        cancelBtn?.addEventListener('click', () => {
            editing = false;
            addingNew = false;
            render();
        });
        saveBtn?.addEventListener('click', () => {
            const name = body.querySelector('#pwd-f-name').value.trim();
            const username = body.querySelector('#pwd-f-user').value.trim();
            const password = body.querySelector('#pwd-f-pass').value;
            const url = body.querySelector('#pwd-f-url').value.trim();
            const notes = body.querySelector('#pwd-f-notes').value.trim();
            const otp = body.querySelector('#pwd-f-otp').checked;
            if (!name) {
                if (window.toast) window.toast('请输入名称', 'error');
                return;
            }
            if (addingNew) {
                const newId = Date.now();
                passwords.unshift({ id: newId, name, username, password, url, lastModified: Date.now(), otp, notes });
                selectedId = newId;
                if (window.toast) window.toast(`已添加「${name}」`, 'success');
            } else {
                const p = passwords.find(x => x.id === selectedId);
                if (p) {
                    p.name = name; p.username = username; p.password = password;
                    p.url = url; p.otp = otp; p.notes = notes; p.lastModified = Date.now();
                    if (window.toast) window.toast('已保存修改', 'success');
                }
            }
            save();
            editing = false;
            addingNew = false;
            render();
        });

        // OTP live update
        if (selectedId && !editing && !addingNew) {
            const p = passwords.find(x => x.id === selectedId);
            if (p && p.otp) {
                const interval = setInterval(() => {
                    const codeEl = body.querySelector(`#pwd-otp-code-${windowId}`);
                    const fillEl = body.querySelector(`#pwd-otp-fill-${windowId}`);
                    const remainEl = body.querySelector(`#pwd-otp-remain-${windowId}`);
                    if (!codeEl) { clearInterval(interval); return; }
                    const remaining = getOtpRemaining();
                    if (remaining === 30) {
                        codeEl.textContent = getOtpCode(p.id);
                    }
                    if (fillEl) fillEl.style.width = (remaining / 30) * 100 + '%';
                    if (remainEl) remainEl.textContent = remaining + ' 秒后刷新';
                }, 1000);
                // store interval to clear on re-render (it auto-clears when element gone)
            }
        }
    }

    render();
};
