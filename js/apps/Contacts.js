// Contacts - 通讯录 (macOS Sonoma)
window.renderContacts = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_contacts_v3';

    function defaultContacts() {
        const colors = [
            'linear-gradient(135deg, #FF6B6B, #EE5A24)',
            'linear-gradient(135deg, #4ECDC4, #44A08D)',
            'linear-gradient(135deg, #667EEA, #764BA2)',
            'linear-gradient(135deg, #F093FB, #F5576C)',
            'linear-gradient(135deg, #4FACFE, #00F2FE)',
            'linear-gradient(135deg, #43E97B, #38F9D7)',
            'linear-gradient(135deg, #FA709A, #FEE140)',
            'linear-gradient(135deg, #30CFD0, #330867)',
            'linear-gradient(135deg, #FF9A9E, #FAD0C4)',
            'linear-gradient(135deg, #A855F7, #6366F1)',
            'linear-gradient(135deg, #FB7185, #F43F5E)',
            'linear-gradient(135deg, #34D399, #10B981)'
        ];
        const pick = i => colors[i % colors.length];
        return [
            { id: '1', firstName: '小明', lastName: '张', company: '科技有限公司', title: '高级工程师', phone: '138 0000 1234', email: 'zhang@example.com', avatar: '张', color: pick(0), address: '北京市朝阳区建国路 88 号', birthday: '1990-05-15', notes: '老朋友，多年同事', favorite: true, tags: ['同事', '北京'] },
            { id: '2', firstName: '华', lastName: '李', company: '设计工作室', title: '产品设计师', phone: '139 0000 5678', email: 'li@example.com', avatar: '李', color: pick(1), address: '上海市浦东新区世纪大道 100 号', birthday: '1988-08-22', notes: '设计师，擅长 UI', favorite: true, tags: ['设计师', '上海'] },
            { id: '3', firstName: '总', lastName: '王', company: '集团总部', title: '总经理', phone: '137 0000 9012', email: 'wang@example.com', avatar: '王', color: pick(2), address: '深圳市南山区科技园', birthday: '1975-03-10', notes: '', favorite: false, tags: ['客户'] },
            { id: '4', firstName: '妈妈', lastName: '', company: '', title: '', phone: '136 0000 3456', email: '', avatar: '妈', color: pick(3), address: '', birthday: '1965-12-08', notes: '记得每周打电话', favorite: true, tags: ['家人'] },
            { id: '5', firstName: '爸爸', lastName: '', company: '', title: '', phone: '135 0000 7890', email: '', avatar: '爸', color: pick(4), address: '', birthday: '1962-06-20', notes: '', favorite: true, tags: ['家人'] },
            { id: '6', firstName: '芳', lastName: '陈', company: '协和医院', title: '主治医师', phone: '134 0000 2345', email: 'chen@example.com', avatar: '陈', color: pick(5), address: '广州市天河区天河路 12 号', birthday: '1992-11-30', notes: '医生朋友', favorite: false, tags: ['医生', '广州'] },
            { id: '7', firstName: '伟', lastName: '刘', company: '律师事务所', title: '资深律师', phone: '133 0000 6789', email: 'liu@example.com', avatar: '刘', color: pick(6), address: '杭州市西湖区文三路 8 号', birthday: '1985-09-14', notes: '律师', favorite: false, tags: ['律师', '杭州'] },
            { id: '8', firstName: '丽', lastName: '赵', company: '文艺出版社', title: '编辑', phone: '132 0000 1122', email: 'zhao@example.com', avatar: '赵', color: pick(7), address: '南京市鼓楼区中山路 56 号', birthday: '1993-02-18', notes: '', favorite: false, tags: ['编辑', '南京'] },
            { id: '9', firstName: '强', lastName: '孙', company: '建筑设计院', title: '高级建筑师', phone: '131 0000 3344', email: 'sun@example.com', avatar: '孙', color: pick(8), address: '成都市武侯区人民南路 18 号', birthday: '1987-07-07', notes: '', favorite: false, tags: ['建筑', '成都'] },
            { id: '10', firstName: 'Emily', lastName: 'Wang', company: 'Apple Inc.', title: 'Software Engineer', phone: '+1 415 555 0192', email: 'emily.wang@apple.com', avatar: 'E', color: pick(9), address: '1 Apple Park Way, Cupertino, CA', birthday: '1994-04-25', notes: 'Met at WWDC', favorite: false, tags: ['Apple', 'Cupertino'] }
        ];
    }

    function defaultData() {
        return { selectedContactId: '1', searchQuery: '', showEditor: false, editingContact: null, selectedGroup: 'all' };
    }

    let contacts = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!contacts) {
        // Migrate from v2 if present
        const old = JSON.parse(localStorage.getItem('macos_contacts_v2') || 'null');
        if (Array.isArray(old) && old.length) {
            contacts = old.map(c => ({
                id: c.id, firstName: c.firstName || '', lastName: c.lastName || '',
                company: c.company || '', title: c.title || '',
                phone: c.phone || '', email: c.email || '',
                avatar: c.avatar || '?', color: c.color || 'linear-gradient(135deg, #5AC8FA, #0A84FF)',
                address: c.address || '', birthday: c.birthday || '', notes: c.notes || '',
                favorite: !!c.favorite, tags: Array.isArray(c.tags) ? c.tags : []
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
        } else {
            contacts = defaultContacts();
        }
    }
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY + '_state') || 'null') || defaultData();

    function saveContacts() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
        localStorage.setItem(STORAGE_KEY + '_state', JSON.stringify(data));
    }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text) {
        if (window.toast) window.toast(text);
        else if (window.Toast) window.Toast.show(text);
    }
    function getFullName(c) {
        if (!c) return '';
        const last = c.lastName || '';
        const first = c.firstName || '';
        if (last && first) return last + first;
        return last || first || '(未命名)';
    }
    function getInitial(c) {
        return (c.avatar || (c.lastName || c.firstName || '?')).slice(0, 1);
    }

    function getFilteredContacts() {
        let list = contacts;
        if (data.selectedGroup === 'favorites') {
            list = list.filter(c => c.favorite);
        }
        if (!data.searchQuery) return list;
        const q = data.searchQuery.toLowerCase();
        return list.filter(c =>
            getFullName(c).toLowerCase().includes(q) ||
            (c.company || '').toLowerCase().includes(q) ||
            (c.phone || '').includes(q) ||
            (c.email || '').toLowerCase().includes(q) ||
            (c.notes || '').toLowerCase().includes(q)
        );
    }

    function getGroupedContacts() {
        const filtered = getFilteredContacts();
        const groups = {};
        filtered.forEach(c => {
            const first = (c.lastName || c.firstName || '#').charAt(0).toUpperCase();
            const letter = /[A-Z]/.test(first) ? first : '#';
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(c);
        });
        Object.keys(groups).forEach(g => {
            groups[g].sort((a, b) => getFullName(a).localeCompare(getFullName(b), 'zh'));
        });
        return Object.keys(groups).sort().reduce((obj, key) => {
            obj[key] = groups[key];
            return obj;
        }, {});
    }

    // ----- SVG icons -----
    const ICON = {
        search: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
        add: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
        edit: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
        share: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
        message: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        call: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        mail: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>',
        trash: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        phone: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        email: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>',
        location: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        cake: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5 1 2 1 2.5-2 4-2 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20M7 8v3M12 8v3M17 8v3"/><path d="M7 4h.01M12 4h.01M17 4h.01"/></svg>',
        note: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
        star: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        star_outline: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        all: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
        tag: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
        contacts: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>'
    };

    function renderSidebar() {
        if (!sidebar) return;
        const grouped = getGroupedContacts();
        const favoritesCount = contacts.filter(c => c.favorite).length;
        sidebar.innerHTML = `
            <div class="contacts-sidebar">
                <div class="contacts-groups">
                    <div class="contacts-group-item ${data.selectedGroup === 'all' ? 'active' : ''}" data-group="all">
                        <span class="contacts-group-icon">${ICON.all}</span>
                        <span class="contacts-group-name">所有联系人</span>
                        <span class="contacts-group-count">${contacts.length}</span>
                    </div>
                    <div class="contacts-group-item ${data.selectedGroup === 'favorites' ? 'active' : ''}" data-group="favorites">
                        <span class="contacts-group-icon" style="color:#FF9500;">${ICON.star}</span>
                        <span class="contacts-group-name">收藏</span>
                        <span class="contacts-group-count">${favoritesCount}</span>
                    </div>
                </div>
                <div class="contacts-sidebar-search">
                    <span class="contacts-search-icon">${ICON.search}</span>
                    <input type="text" class="contacts-search" placeholder="搜索" id="contacts-search" value="${escapeHtml(data.searchQuery)}">
                    ${data.searchQuery ? `<button class="contacts-search-clear" id="contacts-search-clear">${'<svg viewBox=\"0 0 24 24\" width=\"11\" height=\"11\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M15 9l-6 6M9 9l6 6\"/></svg>'}</button>` : ''}
                </div>
                <div class="contacts-list">
                    ${Object.keys(grouped).length === 0
                        ? `<div class="contacts-empty">
                            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                            <div class="contacts-empty-text">未找到联系人</div>
                        </div>`
                        : Object.keys(grouped).map(letter => `
                            <div class="contacts-group">
                                <div class="contacts-group-header">${letter}</div>
                                ${grouped[letter].map(c => `
                                    <div class="contact-item ${data.selectedContactId === c.id ? 'active' : ''}" data-id="${c.id}">
                                        <div class="contact-avatar" style="background:${c.color};">${escapeHtml(c.avatar)}</div>
                                        <div class="contact-item-info">
                                            <div class="contact-item-name">${escapeHtml(getFullName(c))}</div>
                                            ${c.company ? `<div class="contact-item-company">${escapeHtml(c.company)}</div>` : ''}
                                        </div>
                                        ${c.favorite ? `<span class="contact-item-fav">${ICON.star}</span>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                </div>
                <div class="contacts-sidebar-footer">
                    <button class="contacts-add-contact-btn" id="contacts-add-btn">
                        <span class="cac-icon">${ICON.add}</span>
                        <span class="cac-text">新建联系人</span>
                    </button>
                </div>
            </div>
        `;

        const search = sidebar.querySelector('#contacts-search');
        if (search) {
            search.addEventListener('input', () => {
                data.searchQuery = search.value;
                saveContacts();
                renderSidebar();
            });
        }
        sidebar.querySelector('#contacts-search-clear')?.addEventListener('click', () => {
            data.searchQuery = '';
            saveContacts();
            renderSidebar();
        });
        sidebar.querySelectorAll('[data-group]').forEach(el => {
            el.addEventListener('click', () => {
                data.selectedGroup = el.dataset.group;
                saveContacts();
                renderSidebar();
            });
        });
        sidebar.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                data.selectedContactId = item.dataset.id;
                data.showEditor = false;
                data.editingContact = null;
                saveContacts();
                render();
            });
        });
        sidebar.querySelector('#contacts-add-btn')?.addEventListener('click', () => {
            data.editingContact = {
                id: Date.now().toString(),
                firstName: '', lastName: '', company: '', title: '',
                phone: '', email: '', address: '',
                birthday: '', notes: '',
                avatar: '?', color: 'linear-gradient(135deg, #5AC8FA, #0A84FF)',
                favorite: false, tags: []
            };
            data.showEditor = true;
            saveContacts();
            render();
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const contact = contacts.find(c => c.id === data.selectedContactId);
        toolbar.innerHTML = `
            <div class="contacts-toolbar">
                <button class="contacts-tool-btn" id="ct-edit" title="编辑" ${!contact ? 'disabled' : ''}>
                    ${ICON.edit}
                </button>
                <button class="contacts-tool-btn" id="ct-share" title="分享" ${!contact ? 'disabled' : ''}>
                    ${ICON.share}
                </button>
                <button class="contacts-tool-btn ${contact?.favorite ? 'on' : ''}" id="ct-favorite" title="${contact?.favorite ? '取消收藏' : '添加到收藏'}" ${!contact ? 'disabled' : ''}>
                    ${contact?.favorite ? ICON.star : ICON.star_outline}
                </button>
                <div class="toolbar-sep"></div>
                <button class="contacts-tool-btn" id="ct-message" title="发送信息" ${!contact?.phone ? 'disabled' : ''}>
                    ${ICON.message}
                </button>
                <button class="contacts-tool-btn" id="ct-call" title="呼叫" ${!contact?.phone ? 'disabled' : ''}>
                    ${ICON.call}
                </button>
                <button class="contacts-tool-btn" id="ct-mail" title="邮件" ${!contact?.email ? 'disabled' : ''}>
                    ${ICON.mail}
                </button>
                <div style="flex:1;"></div>
                <button class="contacts-tool-btn danger" id="ct-delete" title="删除" ${!contact ? 'disabled' : ''}>
                    ${ICON.trash}
                </button>
            </div>
        `;
        toolbar.querySelector('#ct-edit')?.addEventListener('click', () => {
            const c = contacts.find(c => c.id === data.selectedContactId);
            if (c) {
                data.editingContact = JSON.parse(JSON.stringify(c));
                data.showEditor = true;
                saveContacts();
                render();
            }
        });
        toolbar.querySelector('#ct-favorite')?.addEventListener('click', () => {
            const c = contacts.find(c => c.id === data.selectedContactId);
            if (c) {
                c.favorite = !c.favorite;
                saveContacts();
                render();
                showToast(c.favorite ? '已添加到收藏' : '已从收藏中移除');
            }
        });
        toolbar.querySelector('#ct-delete')?.addEventListener('click', async () => {
            const c = contacts.find(c => c.id === data.selectedContactId);
            if (!c) return;
            const ok = await window.showConfirm(`确定要删除联系人“${getFullName(c)}”吗？`, {
                subtitle: '此操作无法撤销。',
                confirmText: '删除',
                danger: true
            });
            if (ok) {
                contacts = contacts.filter(x => x.id !== data.selectedContactId);
                data.selectedContactId = contacts[0]?.id || null;
                saveContacts();
                render();
                showToast('联系人已删除');
            }
        });
        toolbar.querySelector('#ct-call')?.addEventListener('click', () => showToast(`正在呼叫 ${getFullName(contact)}...`));
        toolbar.querySelector('#ct-message')?.addEventListener('click', () => showToast('打开信息应用...'));
        toolbar.querySelector('#ct-mail')?.addEventListener('click', () => showToast('打开邮件应用...'));
        toolbar.querySelector('#ct-share')?.addEventListener('click', () => showToast('分享联系人卡片...'));
    }

    function renderContent() {
        if (data.showEditor && data.editingContact) {
            renderEditor();
            return;
        }
        const contact = contacts.find(c => c.id === data.selectedContactId);
        if (!contact) {
            body.innerHTML = `<div class="contacts-empty-detail">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                <div class="contacts-empty-detail-text">选择或创建一个联系人</div>
            </div>`;
            return;
        }

        const rows = [];
        if (contact.phone) rows.push({ icon: ICON.phone, label: '手机', value: contact.phone, action: 'call', cls: 'call' });
        if (contact.email) rows.push({ icon: ICON.email, label: '电子邮件', value: contact.email, action: 'mail', cls: 'mail' });
        if (contact.address) rows.push({ icon: ICON.location, label: '地址', value: contact.address, action: 'map', cls: 'location' });
        if (contact.birthday) rows.push({ icon: ICON.cake, label: '生日', value: contact.birthday, action: null, cls: 'cake' });
        if (contact.notes) rows.push({ icon: ICON.note, label: '备注', value: contact.notes, action: null, cls: 'note' });

        body.innerHTML = `
            <div class="contacts-body">
                <div class="contact-detail">
                    <div class="contact-detail-header">
                        <div class="contact-detail-avatar" style="background:${contact.color};">${escapeHtml(contact.avatar)}</div>
                        <div class="contact-detail-name">${escapeHtml(getFullName(contact))}</div>
                        ${contact.title || contact.company
                            ? `<div class="contact-detail-company">${escapeHtml([contact.title, contact.company].filter(Boolean).join(' · '))}</div>`
                            : ''}
                        ${contact.tags && contact.tags.length ? `
                            <div class="contact-detail-tags">
                                ${contact.tags.map(t => `<span class="contact-tag">${escapeHtml(t)}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>

                    ${rows.length ? `
                        <div class="contact-info-section">
                            ${rows.map(r => `
                                <div class="contact-info-row ${r.action ? 'clickable' : ''}" data-action="${r.action || ''}">
                                    <div class="contact-info-icon ${r.cls}">${r.icon}</div>
                                    <div class="contact-info-content">
                                        <div class="contact-info-label">${r.label}</div>
                                        <div class="contact-info-value">${escapeHtml(r.value)}</div>
                                    </div>
                                    ${r.action ? `<button class="contact-info-action" data-action="${r.action}" title="${r.action === 'call' ? '呼叫' : r.action === 'mail' ? '发送邮件' : '在地图中查看'}">
                                        ${r.action === 'call' ? ICON.call : r.action === 'mail' ? ICON.mail : ICON.location}
                                    </button>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : `<div class="contact-info-empty">没有联系信息</div>`}

                    <div class="contact-actions">
                        <button class="contact-action-btn message" id="ca-message" ${!contact.phone ? 'disabled' : ''}>
                            ${ICON.message}
                            <span>信息</span>
                        </button>
                        <button class="contact-action-btn call" id="ca-call" ${!contact.phone ? 'disabled' : ''}>
                            ${ICON.call}
                            <span>呼叫</span>
                        </button>
                        <button class="contact-action-btn mail" id="ca-mail" ${!contact.email ? 'disabled' : ''}>
                            ${ICON.mail}
                            <span>邮件</span>
                        </button>
                        <button class="contact-action-btn favorite ${contact.favorite ? 'on' : ''}" id="ca-favorite">
                            ${contact.favorite ? ICON.star : ICON.star_outline}
                            <span>${contact.favorite ? '已收藏' : '收藏'}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        body.querySelector('#ca-message')?.addEventListener('click', () => showToast('打开信息应用...'));
        body.querySelector('#ca-call')?.addEventListener('click', () => showToast(`正在呼叫 ${getFullName(contact)}...`));
        body.querySelector('#ca-mail')?.addEventListener('click', () => showToast('打开邮件应用...'));
        body.querySelector('#ca-favorite')?.addEventListener('click', () => {
            contact.favorite = !contact.favorite;
            saveContacts();
            render();
            showToast(contact.favorite ? '已添加到收藏' : '已从收藏中移除');
        });
        body.querySelectorAll('.contact-info-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const act = btn.dataset.action;
                if (act === 'call') showToast(`正在呼叫 ${getFullName(contact)}...`);
                else if (act === 'mail') showToast('打开邮件应用...');
                else if (act === 'map') showToast('打开地图应用...');
            });
        });
        body.querySelectorAll('.contact-info-row.clickable').forEach(row => {
            row.addEventListener('click', () => {
                const act = row.dataset.action;
                if (!act) return;
                if (act === 'call') showToast(`正在呼叫 ${getFullName(contact)}...`);
                else if (act === 'mail') showToast('打开邮件应用...');
                else if (act === 'map') showToast('打开地图应用...');
            });
        });
    }

    function renderEditor() {
        const c = data.editingContact;
        body.innerHTML = `
            <div class="contacts-body">
                <div class="contact-editor">
                    <div class="contact-editor-header">
                        <div class="contact-editor-avatar" style="background:${c.color};">${escapeHtml(c.avatar || '?')}</div>
                        <button class="contact-editor-change-avatar" id="ce-avatar">更换头像</button>
                    </div>
                    <div class="contact-editor-section">
                        <div class="contact-editor-section-title">姓名</div>
                        <div class="contact-editor-grid">
                            <input type="text" class="ce-input" id="ce-lastName" placeholder="姓" value="${escapeHtml(c.lastName)}">
                            <input type="text" class="ce-input" id="ce-firstName" placeholder="名" value="${escapeHtml(c.firstName)}">
                        </div>
                    </div>
                    <div class="contact-editor-grid two">
                        <div class="contact-editor-section">
                            <div class="contact-editor-section-title">公司</div>
                            <input type="text" class="ce-input" id="ce-company" placeholder="公司" value="${escapeHtml(c.company)}">
                        </div>
                        <div class="contact-editor-section">
                            <div class="contact-editor-section-title">职位</div>
                            <input type="text" class="ce-input" id="ce-title" placeholder="职位" value="${escapeHtml(c.title)}">
                        </div>
                    </div>
                    <div class="contact-editor-section">
                        <div class="contact-editor-section-title">手机</div>
                        <input type="tel" class="ce-input" id="ce-phone" placeholder="手机号码" value="${escapeHtml(c.phone)}">
                    </div>
                    <div class="contact-editor-section">
                        <div class="contact-editor-section-title">电子邮件</div>
                        <input type="email" class="ce-input" id="ce-email" placeholder="电子邮件地址" value="${escapeHtml(c.email)}">
                    </div>
                    <div class="contact-editor-section">
                        <div class="contact-editor-section-title">地址</div>
                        <input type="text" class="ce-input" id="ce-address" placeholder="街道、城市" value="${escapeHtml(c.address)}">
                    </div>
                    <div class="contact-editor-section">
                        <div class="contact-editor-section-title">生日</div>
                        <input type="date" class="ce-input" id="ce-birthday" value="${c.birthday || ''}">
                    </div>
                    <div class="contact-editor-section">
                        <div class="contact-editor-section-title">标签</div>
                        <input type="text" class="ce-input" id="ce-tags" placeholder="用逗号分隔，如：同事, 北京" value="${escapeHtml((c.tags || []).join(', '))}">
                    </div>
                    <div class="contact-editor-section">
                        <div class="contact-editor-section-title">备注</div>
                        <textarea class="ce-input ce-textarea" id="ce-notes" placeholder="添加备注">${escapeHtml(c.notes)}</textarea>
                    </div>
                    <div class="contact-editor-actions">
                        <button class="ce-btn" id="ce-cancel">取消</button>
                        <button class="ce-btn primary" id="ce-save">完成</button>
                    </div>
                </div>
            </div>
        `;
        body.querySelector('#ce-cancel')?.addEventListener('click', () => {
            data.showEditor = false;
            data.editingContact = null;
            saveContacts();
            render();
        });
        body.querySelector('#ce-avatar')?.addEventListener('click', async () => {
            const newChar = await window.showPrompt('输入头像字符:', {
                placeholder: '例如：张',
                value: c.avatar || ''
            });
            if (newChar != null && newChar.trim()) {
                c.avatar = newChar.trim().slice(0, 1);
                const colors = [
                    'linear-gradient(135deg, #FF6B6B, #EE5A24)',
                    'linear-gradient(135deg, #4ECDC4, #44A08D)',
                    'linear-gradient(135deg, #667EEA, #764BA2)',
                    'linear-gradient(135deg, #F093FB, #F5576C)',
                    'linear-gradient(135deg, #4FACFE, #00F2FE)',
                    'linear-gradient(135deg, #43E97B, #38F9D7)',
                    'linear-gradient(135deg, #FA709A, #FEE140)',
                    'linear-gradient(135deg, #30CFD0, #330867)',
                    'linear-gradient(135deg, #A855F7, #6366F1)',
                    'linear-gradient(135deg, #FB7185, #F43F5E)'
                ];
                c.color = colors[Math.floor(Math.random() * colors.length)];
                renderEditor();
            }
        });
        body.querySelector('#ce-save')?.addEventListener('click', () => {
            c.lastName = body.querySelector('#ce-lastName').value.trim();
            c.firstName = body.querySelector('#ce-firstName').value.trim();
            c.company = body.querySelector('#ce-company').value.trim();
            c.title = body.querySelector('#ce-title').value.trim();
            c.phone = body.querySelector('#ce-phone').value.trim();
            c.email = body.querySelector('#ce-email').value.trim();
            c.address = body.querySelector('#ce-address').value.trim();
            c.birthday = body.querySelector('#ce-birthday').value;
            c.notes = body.querySelector('#ce-notes').value.trim();
            const tagsRaw = body.querySelector('#ce-tags').value.trim();
            c.tags = tagsRaw ? tagsRaw.split(/[,，]/).map(t => t.trim()).filter(Boolean) : [];
            c.avatar = c.avatar || (c.lastName || c.firstName || '?').slice(0, 1);
            const existing = contacts.findIndex(x => x.id === c.id);
            if (existing >= 0) {
                contacts[existing] = c;
            } else {
                contacts.push(c);
            }
            contacts.sort((a, b) => getFullName(a).localeCompare(getFullName(b), 'zh'));
            data.selectedContactId = c.id;
            data.showEditor = false;
            data.editingContact = null;
            saveContacts();
            render();
            showToast(existing >= 0 ? '联系人已更新' : '联系人已创建');
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    render();
};
