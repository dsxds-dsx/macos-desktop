window.renderKeychainAccess = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#fff';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    const defaultItems = [
        { id: 1, type: 'password', name: 'Apple ID', account: 'user@icloud.com', password: '•••••••••••', website: 'appleid.apple.com', modified: Date.now() - 86400000 * 30 },
        { id: 2, type: 'password', name: 'GitHub', account: 'developer', password: '•••••••••••', website: 'github.com', modified: Date.now() - 86400000 * 7 },
        { id: 3, type: 'password', name: 'Gmail', account: 'user@gmail.com', password: '•••••••••••', website: 'mail.google.com', modified: Date.now() - 86400000 * 14 },
        { id: 4, type: 'wifi', name: '家庭 Wi-Fi', account: 'HomeNetwork', password: 'MyHomeWiFi2024!', website: '', modified: Date.now() - 86400000 * 60 },
        { id: 5, type: 'password', name: '微信', account: '13800138000', password: '•••••••••••', website: '', modified: Date.now() - 86400000 * 3 },
        { id: 6, type: 'note', name: '银行密码', account: '', password: '', website: '', note: '银行卡密码：123456\n网银登录密码：********\n安全问题答案：******', modified: Date.now() - 86400000 * 90 },
        { id: 7, type: 'certificate', name: 'Apple Development', account: 'Developer ID', password: '', website: '', modified: Date.now() - 86400000 * 180 },
        { id: 8, type: 'password', name: '淘宝', account: 'user_taobao', password: '•••••••••••', website: 'taobao.com', modified: Date.now() - 86400000 * 5 }
    ];

    let items = JSON.parse(localStorage.getItem('keychain_items') || JSON.stringify(defaultItems));
    let selectedCategory = '所有项目';
    let selectedItemId = 1;
    let searchText = '';
    let showPassword = {};

    const categories = [
        { name: '所有项目', icon: '🔑', filter: () => true },
        { name: '密码', icon: '🔐', filter: i => i.type === 'password' },
        { name: '安全备注', icon: '📝', filter: i => i.type === 'note' },
        { name: '证书', icon: '📜', filter: i => i.type === 'certificate' },
        { name: 'Wi-Fi', icon: '📶', filter: i => i.type === 'wifi' }
    ];

    function save() {
        localStorage.setItem('keychain_items', JSON.stringify(items));
    }

    function getSelectedItem() {
        return items.find(i => i.id === selectedItemId);
    }

    function getFilteredItems() {
        const cat = categories.find(c => c.name === selectedCategory);
        return items.filter(i => {
            const matchCat = cat.filter(i);
            const matchSearch = i.name.toLowerCase().includes(searchText.toLowerCase()) || i.account.toLowerCase().includes(searchText.toLowerCase());
            return matchCat && matchSearch;
        });
    }

    function getTypeIcon(type) {
        return { password: '🔐', wifi: '📶', note: '📝', certificate: '📜' }[type] || '🔑';
    }

    function render() {
        const sel = getSelectedItem();
        const filtered = getFilteredItems();

        content.innerHTML = `
            <div style="display:flex;flex:1;overflow:hidden;">
                <div style="width:180px;background:#f5f5f5;border-right:1px solid #ddd;">
                    <div style="padding:12px;border-bottom:1px solid #ddd;">
                        <div style="position:relative;">
                            <input type="text" id="kc-search" placeholder="搜索" value="${searchText}" style="width:100%;padding:6px 10px 6px 28px;border:1px solid #ccc;border-radius:6px;font-size:12px;box-sizing:border-box;">
                            <span style="position:absolute;left:8px;top:50%;transform:translateY(-50%);color:#999;font-size:12px;">🔍</span>
                        </div>
                    </div>
                    <div style="padding:8px;" id="kc-categories"></div>
                </div>
                <div style="width:280px;border-right:1px solid #ddd;display:flex;flex-direction:column;">
                    <div style="height:40px;border-bottom:1px solid #ddd;display:flex;align-items:center;padding:0 12px;">
                        <span style="font-size:12px;font-weight:600;color:#333;">${selectedCategory}</span>
                        <span style="font-size:11px;color:#999;margin-left:8px;">(${filtered.length})</span>
                        <div style="flex:1;"></div>
                        <button id="kc-add" style="width:24px;height:24px;border:none;background:transparent;color:var(--accent-blue);cursor:pointer;font-size:18px;">＋</button>
                    </div>
                    <div style="flex:1;overflow-y:auto;" id="kc-list"></div>
                </div>
                <div style="flex:1;background:#fafafa;overflow-y:auto;">
                    ${sel ? `
                    <div style="padding:30px;">
                        <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
                            <div style="width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,var(--accent-blue),#5e5ce6);display:flex;align-items:center;justify-content:center;font-size:32px;">${getTypeIcon(sel.type)}</div>
                            <div>
                                <h2 style="margin:0;font-size:22px;font-weight:600;">${sel.name}</h2>
                                ${sel.website ? `<a href="#" style="color:var(--accent-blue);font-size:13px;text-decoration:none;">${sel.website}</a>` : ''}
                            </div>
                        </div>
                        <div style="background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.1);overflow:hidden;">
                            ${sel.account ? `
                            <div style="padding:16px 20px;border-bottom:1px solid #f0f0f0;display:flex;">
                                <div style="width:100px;font-size:12px;color:#888;padding-top:2px;">账户</div>
                                <div style="flex:1;">
                                    <input type="text" value="${sel.account}" readonly style="width:100%;border:none;font-size:14px;outline:none;background:transparent;font-weight:500;">
                                </div>
                                <button class="kc-copy" data-field="account" style="padding:4px 10px;border:1px solid #ddd;border-radius:4px;background:#fafafa;cursor:pointer;font-size:11px;color:#666;">拷贝</button>
                            </div>` : ''}
                            ${sel.type === 'password' || sel.type === 'wifi' ? `
                            <div style="padding:16px 20px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;">
                                <div style="width:100px;font-size:12px;color:#888;">密码</div>
                                <div style="flex:1;">
                                    <input type="${showPassword[sel.id] ? 'text' : 'password'}" value="${sel.password}" readonly style="width:100%;border:none;font-size:14px;outline:none;background:transparent;font-family:monospace;font-weight:500;">
                                </div>
                                <button class="kc-toggle" data-id="${sel.id}" style="padding:4px 10px;border:none;background:transparent;cursor:pointer;font-size:14px;color:#888;">${showPassword[sel.id] ? '🙈' : '👁️'}</button>
                                <button class="kc-copy" data-field="password" style="padding:4px 10px;border:1px solid #ddd;border-radius:4px;background:#fafafa;cursor:pointer;font-size:11px;color:#666;">拷贝</button>
                            </div>` : ''}
                            ${sel.note ? `
                            <div style="padding:16px 20px;">
                                <div style="font-size:12px;color:#888;margin-bottom:8px;">备注</div>
                                <textarea readonly style="width:100%;min-height:150px;border:1px solid #f0f0f0;border-radius:8px;padding:12px;font-size:13px;outline:none;resize:none;background:#fafafa;line-height:1.6;">${sel.note}</textarea>
                            </div>` : ''}
                            <div style="padding:12px 20px;background:#fafafa;border-top:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                                <span style="font-size:11px;color:#999;">修改时间：${new Date(sel.modified).toLocaleString('zh-CN')}</span>
                                <button id="kc-delete" style="padding:6px 14px;border:1px solid #ff3b30;border-radius:6px;background:#fff;color:#ff3b30;cursor:pointer;font-size:12px;">删除</button>
                            </div>
                        </div>
                    </div>
                    ` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:14px;">选择一个项目查看详情</div>'}
                </div>
            </div>
        `;

        const catEl = content.querySelector('#kc-categories');
        categories.forEach(cat => {
            const item = document.createElement('div');
            item.style.cssText = `padding:10px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;margin-bottom:2px;${cat.name === selectedCategory ? 'background:var(--accent-blue);color:#fff;' : 'color:#333;'}`;
            item.innerHTML = `<span>${cat.icon}</span><span>${cat.name}</span>`;
            item.onclick = () => { selectedCategory = cat.name; selectedItemId = getFilteredItems()[0]?.id; render(); };
            catEl.appendChild(item);
        });

        const listEl = content.querySelector('#kc-list');
        filtered.forEach(i => {
            const item = document.createElement('div');
            item.style.cssText = `padding:12px 16px;cursor:pointer;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;gap:12px;${i.id === selectedItemId ? 'background:#e8f0fe;' : ''}`;
            item.onclick = () => { selectedItemId = i.id; render(); };
            item.innerHTML = `
                <div style="width:36px;height:36px;border-radius:8px;background:${i.type === 'wifi' ? '#34c759' : i.type === 'note' ? '#ff9500' : i.type === 'certificate' ? '#af52de' : 'var(--accent-blue)'};display:flex;align-items:center;justify-content:center;font-size:18px;">${getTypeIcon(i.type)}</div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i.name}</div>
                    <div style="font-size:11px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i.account || i.type === 'note' ? '安全备注' : i.type === 'certificate' ? '证书' : ''}</div>
                </div>
            `;
            listEl.appendChild(item);
        });

        content.querySelector('#kc-search').oninput = (e) => { searchText = e.target.value; render(); };

        content.querySelectorAll('.kc-toggle').forEach(btn => {
            btn.onclick = () => { showPassword[parseInt(btn.dataset.id)] = !showPassword[parseInt(btn.dataset.id)]; render(); };
        });

        content.querySelectorAll('.kc-copy').forEach(btn => {
            btn.onclick = () => { btn.textContent = '已拷贝'; setTimeout(() => btn.textContent = '拷贝', 1500); };
        });

        if (sel) {
            content.querySelector('#kc-delete').onclick = () => {
                if (confirm(`确定要删除"${sel.name}"吗？`)) {
                    items = items.filter(i => i.id !== sel.id);
                    selectedItemId = items[0]?.id;
                    save(); render();
                }
            };
        }

        content.querySelector('#kc-add').onclick = () => {
            const name = prompt('新项目名称：');
            if (name) {
                const newItem = { id: Date.now(), type: 'password', name, account: '账户名', password: 'password123', website: '', modified: Date.now() };
                items.unshift(newItem);
                selectedItemId = newItem.id;
                save(); render();
            }
        };
    }

    render();
};
