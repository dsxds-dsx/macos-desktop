window.renderMail = function(body, sidebar, toolbar, windowId) {
    let currentMailbox = 'inbox';
    let selectedEmailId = null;
    let showCompose = false;

    const ic = {
        inbox: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8v4.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8M2 8l2-4.5h8L14 8M2 8h3.5l1 1.5h3l1-1.5H14"/></svg>`,
        sent: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8L14 2L9 14L7.5 9L2 8z"/></svg>`,
        drafts: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13L11 4L13 6L4 15L1.5 14.5z"/><path d="M10 5l1 1"/></svg>`,
        trash: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h10M5.5 4V2.5h5V4M5 4l.5 9h5L11 4"/></svg>`
    };

    const mailboxes = [
        { id: 'inbox', name: '收件箱', icon: ic.inbox, bg: 'linear-gradient(135deg,#3a82f7,#0a84ff)' },
        { id: 'sent', name: '已发送', icon: ic.sent, bg: 'linear-gradient(135deg,#34c759,#30d158)' },
        { id: 'drafts', name: '草稿', icon: ic.drafts, bg: 'linear-gradient(135deg,#8e8e93,#48484a)' },
        { id: 'trash', name: '废纸篓', icon: ic.trash, bg: 'linear-gradient(135deg,#8e8e93,#48484a)' }
    ];

    let emails = JSON.parse(localStorage.getItem('macos_mail') || 'null') || {
        inbox: [
            { id: '1', from: 'Apple', sender: 'Apple 支持', subject: '欢迎使用 macOS', preview: '感谢您选择 macOS，我们将为您提供最优质的服务体验...', content: '尊敬的用户：\n\n欢迎使用 macOS！\n\n我们很高兴您选择了我们的产品。macOS 是世界上最先进的桌面操作系统，为您提供强大的功能和优雅的体验。\n\n祝您使用愉快！\n\nApple 团队', date: '2024-01-15 09:30', unread: true },
            { id: '2', from: '张小明', sender: '张小明', subject: '周末聚会', preview: '嗨，这个周末有空吗？想约大家一起吃饭...', content: '嗨！\n\n好久不见！这个周末你有空吗？我想约几个老朋友一起聚聚，吃个饭聊聊天。\n\n地点在市中心的那家川菜馆，时间定在周六晚上6点，你看方便吗？\n\n期待你的回复！\n\n小明', date: '2024-01-14 15:42', unread: true },
            { id: '3', from: '公司HR', sender: '人力资源部', subject: '春节假期安排通知', preview: '各位同事，根据国务院办公厅通知精神...', content: '各位同事：\n\n根据国务院办公厅通知精神，结合公司实际情况，现将2024年春节放假安排通知如下：\n\n放假时间：2月9日（除夕）至2月17日（初八），共9天。\n\n请各部门提前做好工作安排，祝大家春节快乐！\n\n人力资源部', date: '2024-01-12 10:00', unread: false }
        ],
        sent: [
            { id: 's1', from: '我', sender: '我', subject: 'Re: 周末聚会', preview: '好的，我周六晚上有空，到时见！', content: '小明：\n\n好的，我周六晚上有空！非常期待和大家见面。\n\n到时候见！', date: '2024-01-14 16:20', unread: false }
        ],
        drafts: [
            { id: 'd1', from: '我', sender: '我', subject: '项目进度报告', preview: '领导您好，现将本周项目进度汇报如下...', content: '领导您好：\n\n现将本周项目进度汇报如下：\n1. 前端开发完成80%\n2. 后端接口正在联调', date: '2024-01-13 14:00', unread: false }
        ],
        trash: []
    };

    function saveEmails() {
        localStorage.setItem('macos_mail', JSON.stringify(emails));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="mail-sidebar">
                <div class="mail-sidebar-header">
                    <button id="compose-btn" class="mail-compose-btn">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 11.5L11.5 2L12.5 3L3 12.5L1.5 12.5L1.5 11zM9 4l1 1"/></svg>
                        <span>新建邮件</span>
                    </button>
                </div>
                <div class="mail-sidebar-list">
                    ${mailboxes.map(mb => {
                        const unread = emails[mb.id]?.filter(e => e.unread).length || 0;
                        return `
                        <div class="finder-sidebar-item mail-mailbox-item ${currentMailbox === mb.id ? 'active' : ''}" data-mailbox="${mb.id}">
                            <div class="mail-mailbox-icon" style="background:${mb.bg};">${mb.icon}</div>
                            <span class="finder-sidebar-label">${mb.name}</span>
                            ${unread > 0 ? `<span class="mail-mailbox-badge">${unread}</span>` : ''}
                        </div>
                    `;
                    }).join('')}
                </div>
            </div>
        `;

        sidebar.querySelector('#compose-btn').addEventListener('click', () => {
            showCompose = true;
            renderContent();
        });

        sidebar.querySelectorAll('[data-mailbox]').forEach(item => {
            item.addEventListener('click', () => {
                currentMailbox = item.dataset.mailbox;
                selectedEmailId = null;
                showCompose = false;
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const currentEmail = emails[currentMailbox]?.find(e => e.id === selectedEmailId);
        toolbar.innerHTML = `
            <div class="mail-toolbar">
                <button class="mail-toolbar-btn" id="back-btn" title="返回" ${!currentEmail && !showCompose ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2L4 7l5 5"/></svg>
                </button>
                <button class="mail-toolbar-btn" id="archive-btn" title="归档" ${!currentEmail ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2.5" width="10" height="2.5" rx="0.5"/><path d="M3 5v6.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5M5.5 7.5h3"/></svg>
                </button>
                <button class="mail-toolbar-btn" id="delete-email-btn" title="删除" ${!currentEmail ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h8M5.5 4V2.5h3V4M5 4l.5 8h3L9 4"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="mail-toolbar-btn" id="reply-btn" title="回复" ${!currentEmail ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L2 5.5L6 9M2 5.5h6a4 4 0 0 1 4 4v2"/></svg>
                </button>
                <button class="mail-toolbar-btn" id="reply-all-btn" title="回复全部" ${!currentEmail ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2L1.5 5.5L5 9M3.5 2L0 5.5L3.5 9M3.5 5.5h6a4 4 0 0 1 4 4v2"/></svg>
                </button>
                <button class="mail-toolbar-btn" id="forward-btn" title="转发" ${!currentEmail ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2l4 3.5L8 9M12 5.5H6a4 4 0 0 0-4 4v2"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="mail-toolbar-btn" id="flag-btn" title="标记" ${!currentEmail ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 1.5v11M3 2.5h8l-1.5 3L11 8.5H3"/></svg>
                </button>
                <div style="flex:1;"></div>
                <button class="mail-toolbar-btn" title="搜索">
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                </button>
            </div>
        `;

        const backBtn = toolbar.querySelector('#back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (showCompose) {
                    showCompose = false;
                } else {
                    selectedEmailId = null;
                }
                render();
            });
        }

        const deleteBtn = toolbar.querySelector('#delete-email-btn');
        if (deleteBtn && currentEmail) {
            deleteBtn.addEventListener('click', () => {
                if (currentMailbox === 'trash') {
                    emails.trash = emails.trash.filter(e => e.id !== selectedEmailId);
                } else {
                    const email = emails[currentMailbox].find(e => e.id === selectedEmailId);
                    emails[currentMailbox] = emails[currentMailbox].filter(e => e.id !== selectedEmailId);
                    if (email) emails.trash.unshift(email);
                }
                selectedEmailId = null;
                saveEmails();
                render();
            });
        }

        const replyBtn = toolbar.querySelector('#reply-btn');
        if (replyBtn && currentEmail) {
            replyBtn.addEventListener('click', () => {
                showCompose = true;
                render();
                setTimeout(() => {
                    const toInput = body.querySelector('#compose-to');
                    const subjectInput = body.querySelector('#compose-subject');
                    const contentInput = body.querySelector('#compose-content');
                    if (toInput) toInput.value = currentEmail.from;
                    if (subjectInput) subjectInput.value = 'Re: ' + currentEmail.subject;
                    if (contentInput) contentInput.value = '\n\n\n--- 原始邮件 ---\n' + currentEmail.content;
                }, 50);
            });
        }
    }

    function renderContent() {
        if (showCompose) {
            body.innerHTML = `
                <div class="mail-compose">
                    <div class="mail-compose-field">
                        <span class="mail-compose-label">收件人</span>
                        <input type="email" id="compose-to" class="mail-compose-input" placeholder="输入邮箱地址">
                    </div>
                    <div class="mail-compose-field">
                        <span class="mail-compose-label">主题</span>
                        <input type="text" id="compose-subject" class="mail-compose-input" placeholder="邮件主题">
                    </div>
                    <textarea id="compose-content" class="mail-compose-body" placeholder="邮件内容..."></textarea>
                    <div class="mail-compose-actions">
                        <button id="cancel-compose" class="btn btn-secondary">取消</button>
                        <button id="send-email" class="btn btn-primary">发送</button>
                    </div>
                </div>
            `;

            body.querySelector('#cancel-compose').addEventListener('click', () => {
                showCompose = false;
                render();
            });

            body.querySelector('#send-email').addEventListener('click', () => {
                const to = body.querySelector('#compose-to').value;
                const subject = body.querySelector('#compose-subject').value;
                const content = body.querySelector('#compose-content').value;
                if (!to || !subject) {
                    alert('请填写收件人和主题');
                    return;
                }
                emails.sent.unshift({
                    id: 's' + Date.now(),
                    from: '我',
                    sender: '我',
                    to: to,
                    subject: subject,
                    preview: content.slice(0, 50),
                    content: content,
                    date: new Date().toLocaleString('zh-CN'),
                    unread: false
                });
                saveEmails();
                showCompose = false;
                currentMailbox = 'sent';
                render();
            });
            return;
        }

        const currentEmail = emails[currentMailbox]?.find(e => e.id === selectedEmailId);
        if (currentEmail) {
            currentEmail.unread = false;
            saveEmails();
            body.innerHTML = `
                <div class="mail-message-view">
                    <div class="mail-message-header">
                        <h2 class="mail-message-subject">${escapeHtml(currentEmail.subject)}</h2>
                        <div class="mail-message-sender">
                            <div class="mail-sender-avatar">${currentEmail.sender[0]}</div>
                            <div>
                                <div class="mail-sender-name">${escapeHtml(currentEmail.sender)}</div>
                                <div class="mail-sender-meta">${currentEmail.date}</div>
                            </div>
                        </div>
                    </div>
                    <div class="mail-message-body">${escapeHtml(currentEmail.content)}</div>
                </div>
            `;
            return;
        }

        const emailList = emails[currentMailbox] || [];
        body.innerHTML = `
            <div class="mail-body">
                <div class="mail-list">
                    ${emailList.length === 0 ? `
                        <div class="mail-empty">
                            <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"><path d="M8 12h32v24H8zM8 12l16 14L40 12"/></svg>
                            <div class="mail-empty-text">此邮箱暂无邮件</div>
                        </div>
                    ` : emailList.map(email => `
                        <div class="mail-item ${selectedEmailId === email.id ? 'selected' : ''} ${email.unread ? 'unread' : ''}" data-id="${email.id}">
                            <div class="mail-item-row">
                                <div class="mail-sender">${escapeHtml(email.sender)}</div>
                                <div class="mail-date">${email.date.split(' ')[0]}</div>
                            </div>
                            <div class="mail-subject">${escapeHtml(email.subject)}</div>
                            <div class="mail-preview">${escapeHtml(email.preview)}</div>
                            ${email.unread ? '<div class="mail-unread-dot"></div>' : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="mail-message mail-empty-pane">
                    <div class="mail-empty">
                        <svg viewBox="0 0 56 56" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"><path d="M10 14h36v28H10zM10 14l18 16L46 14"/></svg>
                        <div class="mail-empty-text">选择一封邮件阅读</div>
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                selectedEmailId = item.dataset.id;
                render();
            });
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
