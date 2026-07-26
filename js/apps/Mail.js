window.renderMail = function(body, sidebar, toolbar, windowId) {
    let currentMailbox = 'inbox';
    let selectedEmailId = null;
    let showCompose = false;

    const mailboxes = [
        { id: 'inbox', name: '收件箱', icon: '📥' },
        { id: 'sent', name: '已发送', icon: '📤' },
        { id: 'drafts', name: '草稿', icon: '📝' },
        { id: 'trash', name: '废纸篓', icon: '🗑️' }
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
            <div class="mail-sidebar" style="height:100%;display:flex;flex-direction:column;">
                <div style="padding:12px;border-bottom:0.5px solid var(--border-color);">
                    <button id="compose-btn" style="width:100%;padding:10px;background:var(--accent-blue);color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-weight:500;">
                        ✏️ 新建邮件
                    </button>
                </div>
                <div style="flex:1;overflow-y:auto;padding:8px;">
                    ${mailboxes.map(mb => `
                        <div class="finder-sidebar-item ${currentMailbox === mb.id ? 'active' : ''}" data-mailbox="${mb.id}" style="margin-bottom:2px;">
                            <span style="font-size:16px;">${mb.icon}</span>
                            <span>${mb.name}</span>
                            ${emails[mb.id]?.filter(e => e.unread).length > 0 ? `<span style="margin-left:auto;background:var(--accent-red);color:#fff;font-size:11px;padding:2px 6px;border-radius:10px;">${emails[mb.id].filter(e => e.unread).length}</span>` : ''}
                        </div>
                    `).join('')}
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
            <div style="height:100%;display:flex;align-items:center;padding:0 12px;gap:8px;">
                <button class="finder-toolbar-btn" id="back-btn" title="返回" ${!currentEmail && !showCompose ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/></svg>
                </button>
                <button class="finder-toolbar-btn" id="delete-email-btn" title="删除" ${!currentEmail ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                </button>
                <button class="finder-toolbar-btn" id="reply-btn" title="回复" ${!currentEmail ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" fill="currentColor"/></svg>
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
                <div style="flex:1;display:flex;flex-direction:column;background:var(--bg-elevated);padding:24px;">
                    <div style="margin-bottom:16px;display:flex;gap:12px;align-items:center;">
                        <span style="width:60px;color:var(--text-tertiary);font-size:13px;">收件人：</span>
                        <input type="email" id="compose-to" style="flex:1;padding:8px 12px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:6px;font-size:14px;outline:none;" placeholder="输入邮箱地址">
                    </div>
                    <div style="margin-bottom:16px;display:flex;gap:12px;align-items:center;">
                        <span style="width:60px;color:var(--text-tertiary);font-size:13px;">主题：</span>
                        <input type="text" id="compose-subject" style="flex:1;padding:8px 12px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:6px;font-size:14px;outline:none;" placeholder="邮件主题">
                    </div>
                    <textarea id="compose-content" style="flex:1;padding:12px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:6px;font-size:14px;outline:none;resize:none;font-family:var(--system-font);line-height:1.6;" placeholder="邮件内容..."></textarea>
                    <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end;">
                        <button id="cancel-compose" style="padding:8px 20px;border:1px solid var(--border-color);background:var(--button-bg);border-radius:6px;font-size:14px;cursor:pointer;">取消</button>
                        <button id="send-email" style="padding:8px 20px;background:var(--accent-blue);color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer;font-weight:500;">发送</button>
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
                <div style="flex:1;display:flex;flex-direction:column;background:var(--bg-elevated);">
                    <div style="padding:20px 24px;border-bottom:0.5px solid var(--border-color);">
                        <h2 style="font-size:20px;font-weight:600;margin-bottom:16px;">${escapeHtml(currentEmail.subject)}</h2>
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div style="width:40px;height:40px;border-radius:50%;background:var(--accent-blue);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;">${currentEmail.sender[0]}</div>
                            <div>
                                <div style="font-weight:500;">${escapeHtml(currentEmail.sender)}</div>
                                <div style="font-size:12px;color:var(--text-tertiary);">${currentEmail.date}</div>
                            </div>
                        </div>
                    </div>
                    <div style="flex:1;padding:24px;overflow-y:auto;white-space:pre-wrap;font-size:14px;line-height:1.8;-webkit-user-select:text;user-select:text;">${escapeHtml(currentEmail.content)}</div>
                </div>
            `;
            return;
        }

        const emailList = emails[currentMailbox] || [];
        body.innerHTML = `
            <div class="mail-body">
                <div class="mail-list">
                    ${emailList.length === 0 ? `
                        <div style="padding:40px;text-align:center;color:var(--text-tertiary);">
                            <div style="font-size:48px;margin-bottom:12px;">📭</div>
                            <div>此邮箱暂无邮件</div>
                        </div>
                    ` : emailList.map(email => `
                        <div class="mail-item ${selectedEmailId === email.id ? 'selected' : ''}" data-id="${email.id}">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <div class="mail-sender" style="${email.unread ? 'font-weight:700;' : ''}">${escapeHtml(email.sender)}</div>
                                <div style="font-size:11px;color:var(--text-tertiary);">${email.date.split(' ')[0]}</div>
                            </div>
                            <div class="mail-subject" style="${email.unread ? 'font-weight:600;' : ''}">${escapeHtml(email.subject)}</div>
                            <div class="mail-preview">${escapeHtml(email.preview)}</div>
                            ${email.unread ? '<div style="position:absolute;top:16px;left:8px;width:8px;height:8px;border-radius:50%;background:var(--accent-blue);"></div>' : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="mail-message" style="display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);">
                    <div style="text-align:center;">
                        <div style="font-size:64px;margin-bottom:16px;">📧</div>
                        <div>选择一封邮件阅读</div>
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
