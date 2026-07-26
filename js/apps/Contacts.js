window.renderContacts = function(body, sidebar, toolbar, windowId) {
    let selectedContactId = '1';

    const contacts = [
        { id: '1', firstName: '小明', lastName: '张', company: '科技有限公司', phone: '138****1234', email: 'z*******@***********', avatar: '张', color: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
        { id: '2', firstName: '华', lastName: '李', company: '设计工作室', phone: '139****5678', email: 'l***@***********', avatar: '李', color: 'linear-gradient(135deg, #4ecdc4, #44a08d)' },
        { id: '3', firstName: '总', lastName: '王', company: '集团总部', phone: '137****9012', email: 'w***@***********', avatar: '王', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
        { id: '4', firstName: '妈妈', lastName: '', company: '', phone: '136****3456', email: '', avatar: '妈', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
        { id: '5', firstName: '爸爸', lastName: '', company: '', phone: '135****7890', email: '', avatar: '爸', color: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
        { id: '6', firstName: '芳', lastName: '陈', company: '医院', phone: '134****2345', email: 'c****@******', avatar: '陈', color: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
        { id: '7', firstName: '伟', lastName: '刘', company: '律师事务所', phone: '133****6789', email: 'l**@***********', avatar: '刘', color: 'linear-gradient(135deg, #fa709a, #fee140)' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:240px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);display:flex;flex-direction:column;">
                <div style="padding:12px;border-bottom:0.5px solid var(--border-color);">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-weight:600;font-size:14px;">通讯录</span>
                        <button class="finder-toolbar-btn" style="width:28px;height:28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
                        </button>
                    </div>
                </div>
                <div style="padding:8px;">
                    <input type="text" placeholder="搜索" style="width:100%;padding:6px 10px;background:var(--input-bg);border:none;border-radius:6px;font-size:12px;outline:none;">
                </div>
                <div class="contacts-list" style="flex:1;overflow-y:auto;">
                    ${contacts.map(c => `
                        <div class="contact-item ${selectedContactId === c.id ? 'active' : ''}" data-id="${c.id}">
                            <div class="contact-avatar" style="background:${c.color};">${c.avatar}</div>
                            <div>
                                <div style="font-size:13px;font-weight:500;">${c.lastName}${c.firstName}</div>
                                <div style="font-size:11px;opacity:0.6;">${c.company || ' '}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                selectedContactId = item.dataset.id;
                render();
            });
        });
    }

    function renderContent() {
        const contact = contacts.find(c => c.id === selectedContactId);
        if (!contact) return;

        body.innerHTML = `
            <div class="contacts-body">
                <div class="contact-detail">
                    <div style="text-align:center;margin-bottom:32px;">
                        <div style="width:120px;height:120px;border-radius:50%;background:${contact.color};display:flex;align-items:center;justify-content:center;font-size:48px;color:#fff;margin:0 auto 16px;">${contact.avatar}</div>
                        <div class="contact-detail-name">${contact.lastName}${contact.firstName}</div>
                        ${contact.company ? `<div style="color:var(--text-tertiary);font-size:14px;">${contact.company}</div>` : ''}
                    </div>
                    
                    <div style="max-width:400px;margin:0 auto;">
                        ${contact.phone ? `
                            <div class="contact-info-row">
                                <span style="font-size:20px;">📱</span>
                                <div>
                                    <div class="contact-info-label">手机</div>
                                    <div class="contact-info-value">${contact.phone}</div>
                                </div>
                            </div>
                        ` : ''}
                        ${contact.email ? `
                            <div class="contact-info-row">
                                <span style="font-size:20px;">📧</span>
                                <div>
                                    <div class="contact-info-label">电子邮件</div>
                                    <div class="contact-info-value">${contact.email}</div>
                                </div>
                            </div>
                        ` : ''}
                        <div class="contact-info-row">
                            <span style="font-size:20px;">📍</span>
                            <div>
                                <div class="contact-info-label">地址</div>
                                <div class="contact-info-value">北京市朝阳区</div>
                            </div>
                        </div>
                        <div class="contact-info-row">
                            <span style="font-size:20px;">🎂</span>
                            <div>
                                <div class="contact-info-label">生日</div>
                                <div class="contact-info-value">1月1日</div>
                            </div>
                        </div>
                        
                        <div style="display:flex;gap:12px;margin-top:32px;">
                            <button style="flex:1;padding:12px;background:var(--accent-blue);color:#fff;border:none;border-radius:10px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                                📱 发送信息
                            </button>
                            <button style="flex:1;padding:12px;background:var(--accent-green);color:#fff;border:none;border-radius:10px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                                📞 呼叫
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    render();
};
