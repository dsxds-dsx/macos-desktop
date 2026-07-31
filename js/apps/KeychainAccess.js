// Keychain Access - 钥匙串访问 (macOS Sonoma)
window.renderKeychainAccess = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_keychain_v2';

    function defaultItems() {
        return [
            { id: 1, type: 'password', name: 'Apple ID', account: 'user@icloud.com', password: 'ApplePass2024!', website: 'appleid.apple.com', modified: Date.now() - 86400000 * 30 },
            { id: 2, type: 'password', name: 'GitHub', account: 'developer', password: 'ghp_aB1cD2eF3gH4', website: 'github.com', modified: Date.now() - 86400000 * 7 },
            { id: 3, type: 'password', name: 'Gmail', account: 'user@gmail.com', password: 'GmailSecure99', website: 'mail.google.com', modified: Date.now() - 86400000 * 14 },
            { id: 4, type: 'wifi', name: '家庭 Wi-Fi', account: 'HomeNetwork', password: 'MyHomeWiFi2024!', website: '', modified: Date.now() - 86400000 * 60 },
            { id: 5, type: 'password', name: '微信', account: '13800138000', password: 'WeChat_Pwd88', website: '', modified: Date.now() - 86400000 * 3 },
            { id: 6, type: 'note', name: '银行密码', account: '', password: '', website: '', note: '银行卡密码：123456\n网银登录密码：********\n安全问题答案：******', modified: Date.now() - 86400000 * 90 },
            { id: 7, type: 'certificate', name: 'Apple Development', account: 'Developer ID', password: '', website: '', modified: Date.now() - 86400000 * 180 },
            { id: 8, type: 'password', name: '淘宝', account: 'user_taobao', password: 'TaobaoShop22', website: 'taobao.com', modified: Date.now() - 86400000 * 5 },
            { id: 9, type: 'wifi', name: '公司 Wi-Fi', account: 'OfficeNet', password: 'Office@2024', website: '', modified: Date.now() - 86400000 * 22 },
            { id: 10, type: 'note', name: '软件许可证', account: '', password: '', website: '', note: 'Final Cut Pro: XXXX-XXXX-XXXX\nLogic Pro: YYYY-YYYY-YYYY\nOffice: ZZZZ-ZZZZ-ZZZZ', modified: Date.now() - 86400000 * 45 }
        ];
    }

    function defaultData() {
        return {
            selectedCategory: 'all',
            selectedKeychain: 'login',
            searchText: '',
            selectedItemId: 1,
            revealed: {}
        };
    }

    let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultItems();
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY + '_state') || 'null') || defaultData();

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        localStorage.setItem(STORAGE_KEY + '_state', JSON.stringify(data));
    }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text);
    }
    function fmtDate(ts) {
        const d = new Date(ts);
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    const keychains = [
        { id: 'login', name: '登录', icon: 'key' },
        { id: 'icloud', name: 'iCloud', icon: 'cloud' },
        { id: 'system', name: '系统', icon: 'system' }
    ];

    const categories = [
        { id: 'all', name: '所有项目', icon: 'all', filter: () => true },
        { id: 'password', name: '密码', icon: 'password', filter: i => i.type === 'password' },
        { id: 'note', name: '安全备注', icon: 'note', filter: i => i.type === 'note' },
        { id: 'certificate', name: '证书', icon: 'cert', filter: i => i.type === 'certificate' },
        { id: 'wifi', name: 'Wi-Fi', icon: 'wifi', filter: i => i.type === 'wifi' }
    ];

    function catIcon(icon) {
        const icons = {
            all: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
            password: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
            note: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
            cert: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><polyline points="8.5 12.5 7 22 12 19 17 22 15.5 12.5"/></svg>',
            wifi: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>',
            key: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 6.5m0 0l3 3L22 7l-3-3"/></svg>',
            cloud: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
            system: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
        };
        return icons[icon] || icons.all;
    }

    function typeColor(type) {
        return { password: '#007AFF', wifi: '#34C759', note: '#FF9500', certificate: '#AF52DE' }[type] || '#007AFF';
    }

    function typeIconSvg(type, size) {
        const s = size || 16;
        const map = {
            password: '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
            wifi: '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>',
            note: '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
            certificate: '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><polyline points="8.5 12.5 7 22 12 19 17 22 15.5 12.5"/></svg>'
        };
        return map[type] || map.password;
    }

    function getFilteredItems() {
        const cat = categories.find(c => c.id === data.selectedCategory) || categories[0];
        const q = data.searchText.trim().toLowerCase();
        return items.filter(i => {
            const matchCat = cat.filter(i);
            const matchSearch = !q || i.name.toLowerCase().includes(q) || (i.account || '').toLowerCase().includes(q) || (i.website || '').toLowerCase().includes(q);
            return matchCat && matchSearch;
        });
    }

    function getSelectedItem() {
        return items.find(i => i.id === data.selectedItemId);
    }

    function renderSidebar() {
        if (!sidebar) return;
        const catCounts = {};
        categories.forEach(c => { catCounts[c.id] = items.filter(c.filter).length; });
        sidebar.innerHTML = `
            <div class="kc-sidebar">
                <div class="kc-sidebar-section">
                    <div class="kc-sidebar-label">钥匙串</div>
                    ${keychains.map(k => `
                        <div class="kc-keychain ${data.selectedKeychain === k.id ? 'active' : ''}" data-kc="${k.id}">
                            <span class="kc-kc-icon">${catIcon(k.icon)}</span>
                            <span class="kc-kc-name">${escapeHtml(k.name)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="kc-sidebar-section">
                    <div class="kc-sidebar-label">类别</div>
                    ${categories.map(c => `
                        <div class="kc-category ${data.selectedCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
                            <span class="kc-cat-icon">${catIcon(c.icon)}</span>
                            <span class="kc-cat-name">${escapeHtml(c.name)}</span>
                            <span class="kc-cat-count">${catCounts[c.id]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sidebar.querySelectorAll('[data-cat]').forEach(el => {
            el.addEventListener('click', () => {
                data.selectedCategory = el.dataset.cat;
                const filtered = getFilteredItems();
                if (filtered.length && !filtered.find(i => i.id === data.selectedItemId)) {
                    data.selectedItemId = filtered[0].id;
                }
                save();
                render();
            });
        });
        sidebar.querySelectorAll('[data-kc]').forEach(el => {
            el.addEventListener('click', () => {
                data.selectedKeychain = el.dataset.kc;
                save();
                renderSidebar();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const cat = categories.find(c => c.id === data.selectedCategory);
        toolbar.innerHTML = `
            <div class="kc-toolbar">
                <div class="kc-toolbar-left">
                    <div class="kc-tb-cat-icon" style="color:${typeColor('password')};">${catIcon(cat?.icon || 'all')}</div>
                    <div class="kc-tb-cat-name">${escapeHtml(cat?.name || '所有项目')}</div>
                </div>
                <div class="kc-toolbar-center">
                    <div class="kc-search-wrap">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                        <input type="text" id="kc-search" class="kc-search" placeholder="搜索钥匙串" value="${escapeHtml(data.searchText)}">
                    </div>
                </div>
                <div class="kc-toolbar-right">
                    <button class="kc-tb-btn" id="kc-add" title="新建项目">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                    <button class="kc-tb-btn" id="kc-lock" title="锁定钥匙串">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </button>
                </div>
            </div>
        `;
        const search = toolbar.querySelector('#kc-search');
        search.addEventListener('input', (e) => {
            data.searchText = e.target.value;
            renderList();
        });
        toolbar.querySelector('#kc-add').addEventListener('click', addItem);
        toolbar.querySelector('#kc-lock').addEventListener('click', () => {
            data.revealed = {};
            save();
            renderDetail();
            showToast('钥匙串已锁定，密码已隐藏');
        });
    }

    function renderList() {
        const listEl = body.querySelector('#kc-list');
        if (!listEl) { renderContent(); return; }
        const filtered = getFilteredItems();
        const cat = categories.find(c => c.id === data.selectedCategory);
        listEl.parentElement.querySelector('.kc-list-header-count').textContent = `(${filtered.length})`;
        listEl.innerHTML = filtered.length ? filtered.map(i => `
            <div class="kc-list-item ${i.id === data.selectedItemId ? 'selected' : ''}" data-id="${i.id}">
                <div class="kc-item-icon" style="background:${typeColor(i.type)}1a;color:${typeColor(i.type)};">${typeIconSvg(i.type, 16)}</div>
                <div class="kc-item-info">
                    <div class="kc-item-name">${escapeHtml(i.name)}</div>
                    <div class="kc-item-sub">${escapeHtml(i.account || (i.type === 'note' ? '安全备注' : i.type === 'certificate' ? '证书' : i.type === 'wifi' ? '网络' : '密码'))}</div>
                </div>
            </div>
        `).join('') : `<div class="kc-list-empty">没有项目</div>`;
        listEl.querySelectorAll('[data-id]').forEach(el => {
            el.addEventListener('click', () => {
                data.selectedItemId = parseInt(el.dataset.id, 10);
                save();
                renderList();
                renderDetail();
            });
        });
    }

    function renderDetail() {
        const detailEl = body.querySelector('#kc-detail');
        if (!detailEl) { renderContent(); return; }
        const sel = getSelectedItem();
        if (!sel) {
            detailEl.innerHTML = `<div class="kc-detail-empty">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <div class="kc-detail-empty-text">选择一个项目查看详情</div>
            </div>`;
            return;
        }
        const color = typeColor(sel.type);
        const revealed = !!data.revealed[sel.id];
        detailEl.innerHTML = `
            <div class="kc-detail">
                <div class="kc-detail-hero">
                    <div class="kc-detail-icon" style="background:${color}1a;color:${color};">${typeIconSvg(sel.type, 30)}</div>
                    <div class="kc-detail-title">
                        <h2 class="kc-detail-name">${escapeHtml(sel.name)}</h2>
                        ${sel.website ? `<div class="kc-detail-website">${escapeHtml(sel.website)}</div>` : `<div class="kc-detail-type">${escapeHtml(categories.find(c => c.id === sel.type)?.name || '项目')}</div>`}
                    </div>
                </div>

                <div class="kc-card">
                    ${sel.account ? `
                    <div class="kc-field">
                        <div class="kc-field-label">账户</div>
                        <div class="kc-field-value">
                            <span class="kc-field-text">${escapeHtml(sel.account)}</span>
                            <button class="kc-copy-btn" data-field="account">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                        </div>
                    </div>` : ''}
                    ${(sel.type === 'password' || sel.type === 'wifi') ? `
                    <div class="kc-field">
                        <div class="kc-field-label">密码</div>
                        <div class="kc-field-value">
                            <span class="kc-field-text kc-mono">${revealed ? escapeHtml(sel.password) : '••••••••••••'}</span>
                            <div class="kc-field-actions">
                                <button class="kc-reveal-btn" data-id="${sel.id}" title="${revealed ? '隐藏' : '显示'}">
                                    ${revealed
                                        ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
                                        : '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'}
                                </button>
                                <button class="kc-copy-btn" data-field="password">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>` : ''}
                    ${sel.note ? `
                    <div class="kc-field kc-field-note">
                        <div class="kc-field-label">备注</div>
                        <div class="kc-note-box">${escapeHtml(sel.note)}</div>
                    </div>` : ''}
                    ${sel.website ? `
                    <div class="kc-field">
                        <div class="kc-field-label">网站</div>
                        <div class="kc-field-value">
                            <span class="kc-field-text kc-link">${escapeHtml(sel.website)}</span>
                        </div>
                    </div>` : ''}
                    <div class="kc-field">
                        <div class="kc-field-label">修改日期</div>
                        <div class="kc-field-value">
                            <span class="kc-field-text kc-date">${fmtDate(sel.modified)}</span>
                        </div>
                    </div>
                    <div class="kc-field">
                        <div class="kc-field-label">钥匙串</div>
                        <div class="kc-field-value">
                            <span class="kc-field-text">${escapeHtml(keychains.find(k => k.id === data.selectedKeychain)?.name || '登录')}</span>
                        </div>
                    </div>
                </div>

                <div class="kc-detail-actions">
                    <button class="kc-btn kc-btn-danger" id="kc-delete">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        删除
                    </button>
                </div>
            </div>
        `;
        detailEl.querySelectorAll('.kc-reveal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id, 10);
                data.revealed[id] = !data.revealed[id];
                save();
                renderDetail();
            });
        });
        detailEl.querySelectorAll('.kc-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const field = btn.dataset.field;
                const val = sel[field] || '';
                try { navigator.clipboard?.writeText(val); } catch {}
                showToast(field === 'password' ? '密码已拷贝' : `${field} 已拷贝`);
            });
        });
        detailEl.querySelector('#kc-delete')?.addEventListener('click', async () => {
            const ok = await window.showConfirm(`确定要删除“${sel.name}”吗？`, {
                subtitle: '此操作无法撤销。',
                confirmText: '删除',
                danger: true
            });
            if (ok) {
                items = items.filter(i => i.id !== sel.id);
                const filtered = getFilteredItems();
                data.selectedItemId = filtered[0]?.id || null;
                save();
                renderList();
                renderDetail();
                showToast('项目已删除');
            }
        });
    }

    function renderContent() {
        const cat = categories.find(c => c.id === data.selectedCategory);
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.flexDirection = 'row';
        body.innerHTML = `
            <div class="kc-list-pane">
                <div class="kc-list-header">
                    <span class="kc-list-header-title">${escapeHtml(cat?.name || '所有项目')}</span>
                    <span class="kc-list-header-count">(0)</span>
                </div>
                <div class="kc-list" id="kc-list"></div>
            </div>
            <div class="kc-detail-pane" id="kc-detail"></div>
        `;
        renderList();
        renderDetail();
    }

    async function addItem() {
        const name = await window.showPrompt('新建钥匙串项目', {
            placeholder: '项目名称',
            confirmText: '创建'
        });
        if (!name) return;
        const newItem = {
            id: Date.now(),
            type: data.selectedCategory === 'note' ? 'note' : data.selectedCategory === 'certificate' ? 'certificate' : data.selectedCategory === 'wifi' ? 'wifi' : 'password',
            name: name.trim(),
            account: '',
            password: data.selectedCategory === 'note' ? '' : 'newpassword123',
            website: '',
            note: data.selectedCategory === 'note' ? '' : undefined,
            modified: Date.now()
        };
        items.unshift(newItem);
        data.selectedItemId = newItem.id;
        save();
        renderSidebar();
        renderList();
        renderDetail();
        showToast('已创建新项目');
    }

    function render() {
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    render();
};
