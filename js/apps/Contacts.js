window.renderContacts = function(body, sidebar, toolbar, windowId) {
    let selectedContactId = '1';
    let searchQuery = '';
    let showEditor = false;
    let editingContact = null;

    let contacts = JSON.parse(localStorage.getItem('macos_contacts_v2') || 'null') || [
        { id: '1', firstName: '小明', lastName: '张', company: '科技有限公司', phone: '138 0000 1234', email: 'zhang@example.com', avatar: '张', color: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', address: '北京市朝阳区', birthday: '1990-05-15', notes: '老朋友，多年同事' },
        { id: '2', firstName: '华', lastName: '李', company: '设计工作室', phone: '139 0000 5678', email: 'li@example.com', avatar: '李', color: 'linear-gradient(135deg, #4ecdc4, #44a08d)', address: '上海市浦东新区', birthday: '1988-08-22', notes: '设计师，擅长 UI' },
        { id: '3', firstName: '总', lastName: '王', company: '集团总部', phone: '137 0000 9012', email: 'wang@example.com', avatar: '王', color: 'linear-gradient(135deg, #667eea, #764ba2)', address: '深圳市南山区', birthday: '1975-03-10', notes: '' },
        { id: '4', firstName: '妈妈', lastName: '', company: '', phone: '136 0000 3456', email: '', avatar: '妈', color: 'linear-gradient(135deg, #f093fb, #f5576c)', address: '', birthday: '1965-12-08', notes: '记得每周打电话' },
        { id: '5', firstName: '爸爸', lastName: '', company: '', phone: '135 0000 7890', email: '', avatar: '爸', color: 'linear-gradient(135deg, #4facfe, #00f2fe)', address: '', birthday: '1962-06-20', notes: '' },
        { id: '6', firstName: '芳', lastName: '陈', company: '医院', phone: '134 0000 2345', email: 'chen@example.com', avatar: '陈', color: 'linear-gradient(135deg, #43e97b, #38f9d7)', address: '广州市天河区', birthday: '1992-11-30', notes: '医生朋友' },
        { id: '7', firstName: '伟', lastName: '刘', company: '律师事务所', phone: '133 0000 6789', email: 'liu@example.com', avatar: '刘', color: 'linear-gradient(135deg, #fa709a, #fee140)', address: '杭州市西湖区', birthday: '1985-09-14', notes: '律师' },
        { id: '8', firstName: '丽', lastName: '赵', company: '出版社', phone: '132 0000 1122', email: 'zhao@example.com', avatar: '赵', color: 'linear-gradient(135deg, #30cfd0, #330867)', address: '南京市鼓楼区', birthday: '1993-02-18', notes: '' },
        { id: '9', firstName: '强', lastName: '孙', company: '建筑设计院', phone: '131 0000 3344', email: 'sun@example.com', avatar: '孙', color: 'linear-gradient(135deg, #ff9a9e, #fad0c4)', address: '成都市武侯区', birthday: '1987-07-07', notes: '' }
    ];

    function saveContacts() {
        localStorage.setItem('macos_contacts_v2', JSON.stringify(contacts));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function getFullName(c) {
        return (c.lastName || '') + (c.firstName || '');
    }

    function getFilteredContacts() {
        if (!searchQuery) return contacts;
        const q = searchQuery.toLowerCase();
        return contacts.filter(c =>
            getFullName(c).toLowerCase().includes(q) ||
            (c.company || '').toLowerCase().includes(q) ||
            (c.phone || '').includes(q) ||
            (c.email || '').toLowerCase().includes(q)
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

    function renderSidebar() {
        if (!sidebar) return;
        const grouped = getGroupedContacts();
        sidebar.innerHTML = `
            <div class="contacts-sidebar">
                <div class="contacts-sidebar-header">
                    <input type="text" class="contacts-search" placeholder="搜索" id="contacts-search" value="${escapeHtml(searchQuery)}">
                    <button class="contacts-add-btn" id="contacts-add-btn" title="新建联系人">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                    </button>
                </div>
                <div class="contacts-list">
                    ${Object.keys(grouped).length === 0 ? '<div class="contacts-empty">未找到联系人</div>' : Object.keys(grouped).map(letter => `
                        <div class="contacts-group">
                            <div class="contacts-group-header">${letter}</div>
                            ${grouped[letter].map(c => `
                                <div class="contact-item ${selectedContactId === c.id ? 'active' : ''}" data-id="${c.id}">
                                    <div class="contact-avatar" style="background:${c.color};">${escapeHtml(c.avatar)}</div>
                                    <div class="contact-item-info">
                                        <div class="contact-item-name">${escapeHtml(getFullName(c))}</div>
                                        ${c.company ? `<div class="contact-item-company">${escapeHtml(c.company)}</div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const search = sidebar.querySelector('#contacts-search');
        if (search) {
            search.addEventListener('input', () => {
                searchQuery = search.value;
                renderSidebar();
            });
        }

        sidebar.querySelector('#contacts-add-btn')?.addEventListener('click', () => {
            editingContact = {
                id: Date.now().toString(),
                firstName: '', lastName: '', company: '',
                phone: '', email: '', address: '',
                birthday: '', notes: '',
                avatar: '?', color: 'linear-gradient(135deg, #5ac8fa, #0a84ff)'
            };
            showEditor = true;
            renderContent();
        });

        sidebar.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                selectedContactId = item.dataset.id;
                showEditor = false;
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const contact = contacts.find(c => c.id === selectedContactId);
        toolbar.innerHTML = `
            <div class="contacts-toolbar">
                <button class="contacts-tool-btn" id="ct-edit" title="编辑" ${!contact ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 11.5L11.5 2L12.5 3L3 12.5L1.5 12.5L1.5 11zM9 4l1 1"/></svg>
                </button>
                <button class="contacts-tool-btn" id="ct-share" title="分享" ${!contact ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 1.5v6M4.5 4L7 1.5L9.5 4M2.5 8v3.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="contacts-tool-btn" id="ct-message" title="发送信息" ${!contact?.phone ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h10v6H6l-3 2.5V9H2z"/></svg>
                </button>
                <button class="contacts-tool-btn" id="ct-call" title="呼叫" ${!contact?.phone ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3c0-0.5 0.5-1 1-1h2l1 3-1.5 1c0.5 1.5 1.5 2.5 3 3L8.5 7.5l3 1v2c0 0.5-0.5 1-1 1C5.5 11.5 2.5 8.5 2 3z"/></svg>
                </button>
                <button class="contacts-tool-btn" id="ct-mail" title="邮件" ${!contact?.email ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><rect x="1.5" y="3" width="11" height="8" rx="1"/><path d="M2 4l5 3 5-3"/></svg>
                </button>
                <div style="flex:1;"></div>
                <button class="contacts-tool-btn" id="ct-delete" title="删除" ${!contact ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h8M5.5 4V2.5h3V4M5 4l.5 8h3L9 4"/></svg>
                </button>
            </div>
        `;
        toolbar.querySelector('#ct-edit')?.addEventListener('click', () => {
            const c = contacts.find(c => c.id === selectedContactId);
            if (c) {
                editingContact = JSON.parse(JSON.stringify(c));
                showEditor = true;
                renderContent();
            }
        });
        toolbar.querySelector('#ct-delete')?.addEventListener('click', () => {
            const c = contacts.find(c => c.id === selectedContactId);
            if (c && confirm(`确定要删除联系人 "${getFullName(c)}" 吗？`)) {
                contacts = contacts.filter(x => x.id !== selectedContactId);
                selectedContactId = contacts[0]?.id || null;
                saveContacts();
                render();
            }
        });
        toolbar.querySelector('#ct-call')?.addEventListener('click', () => showToast('正在呼叫...'));
        toolbar.querySelector('#ct-message')?.addEventListener('click', () => showToast('打开信息应用...'));
        toolbar.querySelector('#ct-mail')?.addEventListener('click', () => showToast('打开邮件应用...'));
        toolbar.querySelector('#ct-share')?.addEventListener('click', () => showToast('分享联系人卡片...'));
    }

    function showToast(message) {
        const existing = body.querySelector('.contacts-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'photos-toast';
        toast.textContent = message;
        body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 1800);
    }

    function renderContent() {
        if (showEditor && editingContact) {
            renderEditor();
            return;
        }

        const contact = contacts.find(c => c.id === selectedContactId);
        if (!contact) {
            body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-tertiary);">选择或创建一个联系人</div>';
            return;
        }

        body.innerHTML = `
            <div class="contacts-body">
                <div class="contact-detail">
                    <div class="contact-detail-header">
                        <div class="contact-detail-avatar" style="background:${contact.color};">${escapeHtml(contact.avatar)}</div>
                        <div class="contact-detail-name">${escapeHtml(getFullName(contact))}</div>
                        ${contact.company ? `<div class="contact-detail-company">${escapeHtml(contact.company)}</div>` : ''}
                    </div>

                    <div class="contact-info-section">
                        ${contact.phone ? `
                            <div class="contact-info-row">
                                <div class="contact-info-icon">📱</div>
                                <div class="contact-info-content">
                                    <div class="contact-info-label">手机</div>
                                    <div class="contact-info-value">${escapeHtml(contact.phone)}</div>
                                </div>
                            </div>
                        ` : ''}
                        ${contact.email ? `
                            <div class="contact-info-row">
                                <div class="contact-info-icon">📧</div>
                                <div class="contact-info-content">
                                    <div class="contact-info-label">电子邮件</div>
                                    <div class="contact-info-value">${escapeHtml(contact.email)}</div>
                                </div>
                            </div>
                        ` : ''}
                        ${contact.address ? `
                            <div class="contact-info-row">
                                <div class="contact-info-icon">📍</div>
                                <div class="contact-info-content">
                                    <div class="contact-info-label">地址</div>
                                    <div class="contact-info-value">${escapeHtml(contact.address)}</div>
                                </div>
                            </div>
                        ` : ''}
                        ${contact.birthday ? `
                            <div class="contact-info-row">
                                <div class="contact-info-icon">🎂</div>
                                <div class="contact-info-content">
                                    <div class="contact-info-label">生日</div>
                                    <div class="contact-info-value">${escapeHtml(contact.birthday)}</div>
                                </div>
                            </div>
                        ` : ''}
                        ${contact.notes ? `
                            <div class="contact-info-row">
                                <div class="contact-info-icon">📝</div>
                                <div class="contact-info-content">
                                    <div class="contact-info-label">备注</div>
                                    <div class="contact-info-value">${escapeHtml(contact.notes)}</div>
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="contact-actions">
                        <button class="contact-action-btn message" id="ca-message" ${!contact.phone ? 'disabled' : ''}>
                            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h10v6H6l-3 2.5V9H2z"/></svg>
                            信息
                        </button>
                        <button class="contact-action-btn call" id="ca-call" ${!contact.phone ? 'disabled' : ''}>
                            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3c0-0.5 0.5-1 1-1h2l1 3-1.5 1c0.5 1.5 1.5 2.5 3 3L8.5 7.5l3 1v2c0 0.5-0.5 1-1 1C5.5 11.5 2.5 8.5 2 3z"/></svg>
                            呼叫
                        </button>
                        <button class="contact-action-btn mail" id="ca-mail" ${!contact.email ? 'disabled' : ''}>
                            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><rect x="1.5" y="3" width="11" height="8" rx="1"/><path d="M2 4l5 3 5-3"/></svg>
                            邮件
                        </button>
                    </div>
                </div>
            </div>
        `;
        body.querySelector('#ca-message')?.addEventListener('click', () => showToast('打开信息应用...'));
        body.querySelector('#ca-call')?.addEventListener('click', () => showToast('正在呼叫...'));
        body.querySelector('#ca-mail')?.addEventListener('click', () => showToast('打开邮件应用...'));
    }

    function renderEditor() {
        const c = editingContact;
        body.innerHTML = `
            <div class="contacts-body">
                <div class="contact-editor">
                    <div class="contact-editor-header">
                        <div class="contact-editor-avatar" style="background:${c.color};">${escapeHtml(c.avatar)}</div>
                        <button class="contact-editor-change-avatar" id="ce-avatar">更换头像</button>
                    </div>
                    <div class="contact-editor-section">
                        <div class="contact-editor-section-title">姓名</div>
                        <div class="contact-editor-grid">
                            <input type="text" class="ce-input" id="ce-firstName" placeholder="名" value="${escapeHtml(c.firstName)}">
                            <input type="text" class="ce-input" id="ce-lastName" placeholder="姓" value="${escapeHtml(c.lastName)}">
                        </div>
                    </div>
                    <div class="contact-editor-section">
                        <div class="contact-editor-section-title">公司</div>
                        <input type="text" class="ce-input" id="ce-company" placeholder="公司" value="${escapeHtml(c.company)}">
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
            showEditor = false;
            editingContact = null;
            renderContent();
        });
        body.querySelector('#ce-avatar')?.addEventListener('click', () => {
            const newChar = prompt('输入头像字符:', c.avatar);
            if (newChar) {
                c.avatar = newChar.slice(0, 1);
                const colors = [
                    'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                    'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    'linear-gradient(135deg, #667eea, #764ba2)',
                    'linear-gradient(135deg, #f093fb, #f5576c)',
                    'linear-gradient(135deg, #4facfe, #00f2fe)',
                    'linear-gradient(135deg, #43e97b, #38f9d7)'
                ];
                c.color = colors[Math.floor(Math.random() * colors.length)];
                renderContent();
            }
        });
        body.querySelector('#ce-save')?.addEventListener('click', () => {
            c.firstName = body.querySelector('#ce-firstName').value.trim();
            c.lastName = body.querySelector('#ce-lastName').value.trim();
            c.company = body.querySelector('#ce-company').value.trim();
            c.phone = body.querySelector('#ce-phone').value.trim();
            c.email = body.querySelector('#ce-email').value.trim();
            c.address = body.querySelector('#ce-address').value.trim();
            c.birthday = body.querySelector('#ce-birthday').value;
            c.notes = body.querySelector('#ce-notes').value.trim();
            const existing = contacts.findIndex(x => x.id === c.id);
            if (existing >= 0) {
                contacts[existing] = c;
            } else {
                contacts.push(c);
            }
            contacts.sort((a, b) => getFullName(a).localeCompare(getFullName(b), 'zh'));
            selectedContactId = c.id;
            saveContacts();
            showEditor = false;
            editingContact = null;
            render();
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
