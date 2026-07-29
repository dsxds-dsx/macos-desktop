window.renderMail = function(body, sidebar, toolbar, windowId) {
    let currentMailbox = 'inbox';
    let selectedEmailId = null;
    let showCompose = false;
    let composeReplyData = null;
    let sortMode = 'date_desc'; // date_desc, date_asc, sender, subject, unread_first
    let flagFilter = false; // only show flagged
    let searchQuery = '';
    let selectedIds = new Set(); // multi-select

    const ic = {
        inbox: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8v4.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8M2 8l2-4.5h8L14 8M2 8h3.5l1 1.5h3l1-1.5H14"/></svg>`,
        sent: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8L14 2L9 14L7.5 9L2 8z"/></svg>`,
        drafts: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 13L11 4L13 6L4 15L1.5 14.5z"/><path d="M10 5l1 1"/></svg>`,
        archive: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2.5" width="12" height="2.5" rx="0.5"/><path d="M3 5v8.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5M6 8h4"/></svg>`,
        trash: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h10M5.5 4V2.5h5V4M5 4l.5 9h5L11 4"/></svg>`,
        flagged: `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 1.5v13M3 2.5h9l-1.5 3L12 8.5H3"/></svg>`,
        vip: `<svg viewBox="0 0 16 16" width="11" height="11" fill="#fff" stroke="#fff" stroke-width="1"><path d="M8 1l2 4.5 5 .5-3.7 3.4 1.1 4.9L8 12l-4.4 2.3 1.1-4.9L1 6l5-.5z"/></svg>`
    };

    const mailboxes = [
        { id: 'inbox', name: '收件箱', icon: ic.inbox, bg: 'linear-gradient(135deg,#3a82f7,#0a84ff)' },
        { id: 'vip', name: 'VIP', icon: ic.vip, bg: 'linear-gradient(135deg,#ff9500,#ff5e3a)' },
        { id: 'flagged', name: '已标记', icon: ic.flagged, bg: 'linear-gradient(135deg,#ffcc00,#ff9500)' },
        { id: 'drafts', name: '草稿', icon: ic.drafts, bg: 'linear-gradient(135deg,#8e8e93,#48484a)' },
        { id: 'sent', name: '已发送', icon: ic.sent, bg: 'linear-gradient(135deg,#34c759,#30d158)' },
        { id: 'archive', name: '归档', icon: ic.archive, bg: 'linear-gradient(135deg,#5856d6,#af52de)' },
        { id: 'trash', name: '废纸篓', icon: ic.trash, bg: 'linear-gradient(135deg,#8e8e93,#48484a)' }
    ];

    let emails = JSON.parse(localStorage.getItem('macos_mail_v2') || 'null') || {
        inbox: [
            { id: '1', from: 'Apple', sender: 'Apple 支持', subject: '欢迎使用 macOS', preview: '感谢您选择 macOS，我们将为您提供最优质的服务体验...', content: '尊敬的用户：\n\n欢迎使用 macOS！\n\n我们很高兴您选择了我们的产品。macOS 是世界上最先进的桌面操作系统，为您提供强大的功能和优雅的体验。\n\n如有任何问题，请随时联系我们的支持团队。\n\n祝您使用愉快！\n\nApple 团队', date: today(-2), unread: true, flagged: false, vip: true, hasAttachment: true, attachments: [{ name: '欢迎指南.pdf', size: '2.4 MB' }] },
            { id: '2', from: '张小明', sender: '张小明', subject: '周末聚会', preview: '嗨，这个周末有空吗？想约大家一起吃饭...', content: '嗨！\n\n好久不见！这个周末你有空吗？我想约几个老朋友一起聚聚，吃个饭聊聊天。\n\n地点在市中心的那家川菜馆，时间定在周六晚上6点，你看方便吗？\n\n期待你的回复！\n\n小明', date: today(-1), unread: true, flagged: true, vip: false, hasAttachment: false },
            { id: '3', from: '公司HR', sender: '人力资源部', subject: '春节假期安排通知', preview: '各位同事，根据国务院办公厅通知精神...', content: '各位同事：\n\n根据国务院办公厅通知精神，结合公司实际情况，现将2024年春节放假安排通知如下：\n\n放假时间：2月9日（除夕）至2月17日（初八），共9天。\n\n请各部门提前做好工作安排，祝大家春节快乐！\n\n人力资源部', date: today(-3), unread: false, flagged: false, vip: false, hasAttachment: true, attachments: [{ name: '假期安排.xlsx', size: '128 KB' }] },
            { id: '4', from: '设计部', sender: '李华', subject: '新版本设计稿评审', preview: '附件是最新的设计稿，请各位评审后回复意见...', content: '各位：\n\n附件是最新的产品 UI 设计稿，主要更新：\n1. 全新首页 Hero 设计\n2. 优化卡片间距\n3. 调整字体层级\n\n请各位评审后于本周五前回复意见，谢谢！\n\n李华', date: today(-5), unread: false, flagged: true, vip: false, hasAttachment: true, attachments: [{ name: 'UI_v2.fig', size: '8.6 MB' }, { name: '说明.pdf', size: '1.2 MB' }] },
            { id: '5', from: 'GitHub', sender: 'GitHub', subject: '[macos-desktop] PR merged successfully', preview: 'Your pull request has been merged into the main branch...', content: 'Hi @user,\n\nYour pull request #42 "Add Music app" has been successfully merged into the main branch.\n\nThe deployment to GitHub Pages has been triggered.\n\nView the live site: https://example.github.io/macos-desktop/\n\nThanks for your contribution!\n\n— GitHub', date: today(-7), unread: false, flagged: false, vip: false, hasAttachment: false },
            { id: '6', from: '微信团队', sender: '微信团队', subject: '微信安全提醒', preview: '我们检测到您的账号在异地登录...', content: '亲爱的用户：\n\n我们检测到您的微信账号在新设备上登录。\n\n登录时间：今天上午 10:32\n登录地点：上海\n设备：iPhone 15 Pro\n\n如非本人操作，请立即修改密码。\n\n微信团队', date: today(-8), unread: true, flagged: false, vip: false, hasAttachment: false },
            { id: '7', from: '京东', sender: '京东商城', subject: '您的订单已发货', preview: '您的订单 #JD20240115 已发货，预计明天送达...', content: '亲爱的顾客：\n\n您的订单 #JD20240115 已发货！\n\n物流公司：顺丰速运\n运单号：SF1234567890\n预计送达：明天下午\n\n点击查看物流详情\n\n感谢您的惠顾！\n\n京东商城', date: today(-10), unread: false, flagged: false, vip: false, hasAttachment: false },
            { id: '8', from: '王总', sender: '王总', subject: 'Re: 项目进度', preview: '好的，看到了。下周开会讨论一下...', content: '收到，看到了。\n\n下周一下午3点开会讨论一下项目进度，会议室 A-301。\n\n请准备相关材料。\n\n王总', date: today(-12), unread: false, flagged: true, vip: true, hasAttachment: false }
        ],
        sent: [
            { id: 's1', from: '我', sender: '我', to: '张小明', subject: 'Re: 周末聚会', preview: '好的，我周六晚上有空，到时见！', content: '小明：\n\n好的，我周六晚上有空！非常期待和大家见面。\n\n到时候见！\n\n我', date: today(-1), unread: false, flagged: false, vip: false, hasAttachment: false },
            { id: 's2', from: '我', sender: '我', to: '王总', subject: '项目进度报告', preview: '领导您好，现将本周项目进度汇报如下...', content: '领导您好：\n\n现将本周项目进度汇报如下：\n1. 前端开发完成 80%\n2. 后端接口正在联调\n3. UI 设计稿已通过评审\n\n下周计划：\n1. 完成前端剩余功能\n2. 修复测试发现的 bug\n3. 准备上线前的性能优化\n\n请指示。', date: today(-2), unread: false, flagged: false, vip: false, hasAttachment: false }
        ],
        drafts: [
            { id: 'd1', from: '我', sender: '我', to: '人事部', subject: '年假申请', preview: '您好，因家中事务需处理，特申请年假...', content: '人事部：\n\n您好，因家中事务需处理，特申请年假 3 天（1月20日-22日）。\n\n望批准。', date: today(0), unread: false, flagged: false, vip: false, hasAttachment: false }
        ],
        archive: [],
        trash: []
    };

    // VIP senders
    const vipSenders = ['Apple 支持', '王总', '张小明'];

    function today(offset = 0) {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        d.setHours(9 + Math.abs(offset), Math.floor(Math.random() * 60), 0, 0);
        return d.getTime();
    }

    function saveEmails() {
        localStorage.setItem('macos_mail_v2', JSON.stringify(emails));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function formatMailDate(ts) {
        const d = new Date(ts);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = d.toDateString() === yesterday.toDateString();
        const isThisYear = d.getFullYear() === now.getFullYear();
        const time = d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        if (isToday) return time;
        if (isYesterday) return '昨天 ' + time;
        if (isThisYear) return (d.getMonth() + 1) + '月' + d.getDate() + '日';
        return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }

    function formatMailDateLong(ts) {
        const d = new Date(ts);
        return d.toLocaleString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function getDateGroup(ts) {
        const d = new Date(ts);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) return '今天';
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return '昨天';
        const diffDays = (now - d) / (1000 * 60 * 60 * 24);
        if (diffDays < 7) return '本周早些时候';
        if (diffDays < 30) return '本月早些时候';
        return '更早';
    }

    // Get current displayed list based on mailbox selection
    function getDisplayedEmails() {
        let list = [];
        if (currentMailbox === 'vip') {
            Object.keys(emails).forEach(mb => {
                if (mb !== 'trash' && mb !== 'archive') {
                    list = list.concat(emails[mb].filter(e => e.vip || vipSenders.includes(e.sender)));
                }
            });
        } else if (currentMailbox === 'flagged') {
            Object.keys(emails).forEach(mb => {
                if (mb !== 'trash' && mb !== 'archive') {
                    list = list.concat(emails[mb].filter(e => e.flagged));
                }
            });
        } else if (currentMailbox === 'all') {
            Object.keys(emails).forEach(mb => {
                if (mb !== 'trash' && mb !== 'archive' && mb !== 'sent' && mb !== 'drafts') {
                    list = list.concat(emails[mb]);
                }
            });
        } else {
            list = emails[currentMailbox] ? [...emails[currentMailbox]] : [];
        }

        // Apply flag filter
        if (flagFilter) {
            list = list.filter(e => e.flagged);
        }

        // Apply search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(e =>
                (e.subject || '').toLowerCase().includes(q) ||
                (e.sender || '').toLowerCase().includes(q) ||
                (e.preview || '').toLowerCase().includes(q) ||
                (e.content || '').toLowerCase().includes(q)
            );
        }

        // Sort
        switch (sortMode) {
            case 'date_asc': list.sort((a, b) => a.date - b.date); break;
            case 'date_desc': list.sort((a, b) => b.date - a.date); break;
            case 'sender': list.sort((a, b) => (a.sender || '').localeCompare(b.sender || '', 'zh')); break;
            case 'subject': list.sort((a, b) => (a.subject || '').localeCompare(b.subject || '', 'zh')); break;
            case 'unread_first':
                list.sort((a, b) => {
                    if (a.unread && !b.unread) return -1;
                    if (!a.unread && b.unread) return 1;
                    return b.date - a.date;
                });
                break;
        }

        return list;
    }

    function getEmailById(id) {
        for (const mb of Object.keys(emails)) {
            const e = emails[mb].find(e => e.id === id);
            if (e) return { ...e, mailbox: mb };
        }
        return null;
    }

    function renderSidebar() {
        if (!sidebar) return;
        const allInboxCount = emails.inbox.filter(e => e.unread).length;
        const vipCount = emails.inbox.filter(e => (e.vip || vipSenders.includes(e.sender)) && e.unread).length;
        const flaggedCount = Object.keys(emails).reduce((acc, mb) => {
            if (mb !== 'trash' && mb !== 'archive') {
                return acc + emails[mb].filter(e => e.flagged).length;
            }
            return acc;
        }, 0);

        sidebar.innerHTML = `
            <div class="mail-sidebar">
                <div class="mail-sidebar-header">
                    <button id="compose-btn" class="mail-compose-btn">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 11.5L11.5 2L12.5 3L3 12.5L1.5 12.5L1.5 11zM9 4l1 1"/></svg>
                        <span>新建邮件</span>
                    </button>
                </div>
                <div class="mail-sidebar-search">
                    <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                    <input type="text" id="mail-search" placeholder="搜索邮件" value="${escapeHtml(searchQuery)}">
                </div>
                <div class="mail-sidebar-list">
                    ${mailboxes.map(mb => {
                        let unread = 0;
                        if (mb.id === 'inbox') unread = allInboxCount;
                        else if (mb.id === 'vip') unread = vipCount;
                        else if (mb.id === 'flagged') unread = flaggedCount;
                        else if (mb.id === 'sent' || mb.id === 'drafts' || mb.id === 'archive' || mb.id === 'trash') {
                            unread = (emails[mb.id] || []).filter(e => e.unread).length;
                        }
                        const count = mb.id === 'vip' || mb.id === 'flagged' ?
                            (mb.id === 'flagged' ? flaggedCount : emails.inbox.filter(e => e.vip || vipSenders.includes(e.sender)).length) :
                            (emails[mb.id] || []).length;
                        return `
                        <div class="finder-sidebar-item mail-mailbox-item ${currentMailbox === mb.id ? 'active' : ''}" data-mailbox="${mb.id}">
                            <div class="mail-mailbox-icon" style="background:${mb.bg};">${mb.icon}</div>
                            <span class="finder-sidebar-label">${mb.name}</span>
                            ${unread > 0 ? `<span class="mail-mailbox-badge">${unread}</span>` : (count > 0 && mb.id !== 'inbox' ? `<span class="mail-mailbox-count">${count}</span>` : '')}
                        </div>
                    `;
                    }).join('')}
                </div>
                <div class="mail-sidebar-footer">
                    <div class="mail-account">
                        <div class="mail-account-avatar" style="background:linear-gradient(135deg,#5ac8fa,#0a84ff);">我</div>
                        <div class="mail-account-info">
                            <div class="mail-account-name">我的邮箱</div>
                            <div class="mail-account-email">me@icloud.com</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        sidebar.querySelector('#compose-btn').addEventListener('click', () => {
            showCompose = true;
            composeReplyData = null;
            selectedEmailId = null;
            renderContent();
        });

        sidebar.querySelector('#mail-search')?.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderContent();
        });

        sidebar.querySelectorAll('[data-mailbox]').forEach(item => {
            item.addEventListener('click', () => {
                currentMailbox = item.dataset.mailbox;
                selectedEmailId = null;
                showCompose = false;
                selectedIds.clear();
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const currentEmail = selectedEmailId ? getEmailById(selectedEmailId) : null;
        const multiSelect = selectedIds.size > 1;
        toolbar.innerHTML = `
            <div class="mail-toolbar">
                <button class="mail-toolbar-btn" id="back-btn" title="返回" ${(!currentEmail && !showCompose) || multiSelect ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2L4 7l5 5"/></svg>
                </button>
                ${!currentEmail && !showCompose ? `
                    <button class="mail-toolbar-btn ${flagFilter ? 'active' : ''}" id="flag-filter-btn" title="${flagFilter ? '显示全部' : '只看已标记'}">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="${flagFilter ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 1.5v11M3 2.5h8l-1.5 3L11 8.5H3"/></svg>
                    </button>
                    <button class="mail-toolbar-btn" id="sort-btn" title="排序">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M2 4h10M3.5 7h7M5 10h4"/></svg>
                    </button>
                    <div class="toolbar-sep"></div>
                    <button class="mail-toolbar-btn" id="mark-all-btn" title="全部标记为已读">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l5 4 5-4M2 9l5 4 5-4"/></svg>
                    </button>
                ` : ''}
                ${currentEmail && !showCompose ? `
                    <button class="mail-toolbar-btn" id="archive-btn" title="归档">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2.5" width="10" height="2.5" rx="0.5"/><path d="M3 5v6.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5M5.5 7.5h3"/></svg>
                    </button>
                    <button class="mail-toolbar-btn" id="delete-email-btn" title="删除">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h8M5.5 4V2.5h3V4M5 4l.5 8h3L9 4"/></svg>
                    </button>
                    <div class="toolbar-sep"></div>
                    <button class="mail-toolbar-btn ${currentEmail.flagged ? 'active' : ''}" id="flag-btn" title="${currentEmail.flagged ? '取消标记' : '标记'}">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="${currentEmail.flagged ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 1.5v11M3 2.5h8l-1.5 3L11 8.5H3"/></svg>
                    </button>
                    <button class="mail-toolbar-btn ${currentEmail.vip || vipSenders.includes(currentEmail.sender) ? 'active' : ''}" id="vip-btn" title="${currentEmail.vip ? '取消 VIP' : '设为 VIP'}">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="${currentEmail.vip || vipSenders.includes(currentEmail.sender) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1"><path d="M7 1l1.8 4 4.2.4-3.2 2.8 1 4.1L7 10.5 3.2 12.3l1-4.1L1 5.4l4.2-.4z"/></svg>
                    </button>
                    <div class="toolbar-sep"></div>
                    <button class="mail-toolbar-btn" id="reply-btn" title="回复">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L2 5.5L6 9M2 5.5h6a4 4 0 0 1 4 4v2"/></svg>
                    </button>
                    <button class="mail-toolbar-btn" id="reply-all-btn" title="回复全部">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2L1.5 5.5L5 9M3.5 2L0 5.5L3.5 9M3.5 5.5h6a4 4 0 0 1 4 4v2"/></svg>
                    </button>
                    <button class="mail-toolbar-btn" id="forward-btn" title="转发">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2l4 3.5L8 9M12 5.5H6a4 4 0 0 0-4 4v2"/></svg>
                    </button>
                ` : ''}
                <div style="flex:1;"></div>
                ${currentEmail && currentEmail.hasAttachment ? `
                    <button class="mail-toolbar-btn" id="attach-btn" title="附件">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3.5L4.5 8a1.5 1.5 0 0 0 2 2L11 5.5a2.5 2.5 0 0 0-3.5-3.5L4 5.5a3.5 3.5 0 0 0 5 5L12 7.5"/></svg>
                    </button>
                ` : ''}
            </div>
        `;

        const backBtn = toolbar.querySelector('#back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (showCompose) {
                    showCompose = false;
                    composeReplyData = null;
                } else {
                    selectedEmailId = null;
                }
                render();
            });
        }

        if (!currentEmail && !showCompose) {
            toolbar.querySelector('#flag-filter-btn')?.addEventListener('click', () => {
                flagFilter = !flagFilter;
                render();
            });

            toolbar.querySelector('#sort-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                showSortMenu(e.clientX, e.clientY);
            });

            toolbar.querySelector('#mark-all-btn')?.addEventListener('click', () => {
                const list = getDisplayedEmails();
                list.forEach(e => {
                    const orig = emails[currentMailbox]?.find(x => x.id === e.id);
                    if (orig) orig.unread = false;
                });
                saveEmails();
                render();
                showToast('已全部标记为已读');
            });
        }

        if (currentEmail && !showCompose) {
            toolbar.querySelector('#archive-btn')?.addEventListener('click', () => {
                archiveEmail(currentEmail.id);
            });

            toolbar.querySelector('#delete-email-btn')?.addEventListener('click', () => {
                deleteEmail(currentEmail.id);
            });

            toolbar.querySelector('#flag-btn')?.addEventListener('click', () => {
                const orig = emails[currentEmail.mailbox]?.find(x => x.id === currentEmail.id);
                if (orig) {
                    orig.flagged = !orig.flagged;
                    saveEmails();
                    render();
                }
            });

            toolbar.querySelector('#vip-btn')?.addEventListener('click', () => {
                const orig = emails[currentEmail.mailbox]?.find(x => x.id === currentEmail.id);
                if (orig) {
                    orig.vip = !orig.vip;
                    if (orig.vip && !vipSenders.includes(orig.sender)) {
                        vipSenders.push(orig.sender);
                    }
                    saveEmails();
                    render();
                }
            });

            toolbar.querySelector('#reply-btn')?.addEventListener('click', () => openReply(currentEmail, false));
            toolbar.querySelector('#reply-all-btn')?.addEventListener('click', () => openReply(currentEmail, true));
            toolbar.querySelector('#forward-btn')?.addEventListener('click', () => openForward(currentEmail));

            toolbar.querySelector('#attach-btn')?.addEventListener('click', () => {
                showToast(`附件：${currentEmail.attachments?.length || 0} 个`);
            });
        }
    }

    function showSortMenu(x, y) {
        document.querySelectorAll('.context-menu').forEach(m => m.remove());
        const menu = document.createElement('div');
        menu.className = 'context-menu mail-sort-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        const options = [
            { id: 'date_desc', label: '日期 (最新优先)' },
            { id: 'date_asc', label: '日期 (最旧优先)' },
            { id: 'unread_first', label: '未读优先' },
            { id: 'sender', label: '发件人' },
            { id: 'subject', label: '主题' }
        ];
        menu.innerHTML = options.map(o => `
            <div class="ctx-item ${sortMode === o.id ? 'active' : ''}" data-sort="${o.id}">
                ${sortMode === o.id ? '<svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 5l2 2 4-4"/></svg>' : '<span style="width:10px;"></span>'}
                ${o.label}
            </div>
        `).join('');
        document.body.appendChild(menu);
        menu.querySelectorAll('[data-sort]').forEach(item => {
            item.addEventListener('click', () => {
                sortMode = item.dataset.sort;
                menu.remove();
                renderContent();
            });
        });
        setTimeout(() => {
            const close = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', close);
                }
            };
            document.addEventListener('click', close);
        }, 50);
    }

    function archiveEmail(id) {
        const email = getEmailById(id);
        if (!email) return;
        emails[email.mailbox] = emails[email.mailbox].filter(e => e.id !== id);
        emails.archive.unshift(email);
        selectedEmailId = null;
        saveEmails();
        render();
        showToast('已归档');
    }

    function deleteEmail(id) {
        const email = getEmailById(id);
        if (!email) return;
        if (email.mailbox === 'trash') {
            emails.trash = emails.trash.filter(e => e.id !== id);
            showToast('已永久删除');
        } else {
            emails[email.mailbox] = emails[email.mailbox].filter(e => e.id !== id);
            emails.trash.unshift(email);
            showToast('已移到废纸篓');
        }
        selectedEmailId = null;
        saveEmails();
        render();
    }

    function openReply(email, replyAll) {
        showCompose = true;
        composeReplyData = {
            to: email.from,
            cc: replyAll ? '' : '',
            subject: email.subject.startsWith('Re:') ? email.subject : 'Re: ' + email.subject,
            body: '\n\n\n--- 原始邮件 ---\n发件人: ' + email.sender + '\n日期: ' + formatMailDateLong(email.date) + '\n主题: ' + email.subject + '\n\n' + email.content
        };
        renderContent();
    }

    function openForward(email) {
        showCompose = true;
        composeReplyData = {
            to: '',
            cc: '',
            subject: 'Fwd: ' + email.subject,
            body: '\n\n\n--- 转发邮件 ---\n发件人: ' + email.sender + '\n日期: ' + formatMailDateLong(email.date) + '\n主题: ' + email.subject + '\n\n' + email.content
        };
        renderContent();
    }

    function showToast(msg) {
        const existing = body.querySelector('.mail-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'mail-toast';
        toast.textContent = msg;
        body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 1800);
    }

    function renderContent() {
        body.innerHTML = '';
        body.className = 'window-body app-content';
        body.style.display = 'flex';

        if (showCompose) {
            renderCompose(body);
            return;
        }

        const currentEmail = selectedEmailId ? getEmailById(selectedEmailId) : null;
        if (currentEmail) {
            // Mark as read
            const orig = emails[currentEmail.mailbox]?.find(x => x.id === selectedEmailId);
            if (orig && orig.unread) {
                orig.unread = false;
                saveEmails();
                currentEmail.unread = false;
            }
            renderMessageView(body, currentEmail);
            return;
        }

        renderEmailList(body);
    }

    function renderEmailList(container) {
        const list = getDisplayedEmails();
        const grouped = {};
        const groupOrder = ['今天', '昨天', '本周早些时候', '本月早些时候', '更早'];
        list.forEach(e => {
            const g = getDateGroup(e.date);
            if (!grouped[g]) grouped[g] = [];
            grouped[g].push(e);
        });

        container.innerHTML = `
            <div class="mail-body">
                <div class="mail-list">
                    ${list.length === 0 ? `
                        <div class="mail-empty">
                            <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"><path d="M8 12h32v24H8zM8 12l16 14L40 12"/></svg>
                            <div class="mail-empty-text">${searchQuery ? '未找到匹配的邮件' : (flagFilter ? '没有已标记的邮件' : '此邮箱暂无邮件')}</div>
                        </div>
                    ` : groupOrder.map(g => {
                        if (!grouped[g]) return '';
                        return `
                            <div class="mail-date-group">${g}</div>
                            ${grouped[g].map(email => `
                                <div class="mail-item ${selectedEmailId === email.id ? 'selected' : ''} ${email.unread ? 'unread' : ''} ${email.flagged ? 'flagged' : ''}" data-id="${email.id}">
                                    <div class="mail-item-flag" data-flag="${email.id}">
                                        <svg viewBox="0 0 14 14" width="10" height="10" fill="${email.flagged ? '#ff9500' : 'none'}" stroke="${email.flagged ? '#ff9500' : 'currentColor'}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 1.5v11M3 2.5h8l-1.5 3L11 8.5H3"/></svg>
                                    </div>
                                    <div class="mail-item-row">
                                        <div class="mail-sender">
                                            ${email.vip || vipSenders.includes(email.sender) ? '<span class="mail-vip-star">★</span>' : ''}
                                            ${escapeHtml(email.sender)}
                                        </div>
                                        <div class="mail-date">${formatMailDate(email.date)}</div>
                                    </div>
                                    <div class="mail-subject">${escapeHtml(email.subject)}</div>
                                    <div class="mail-preview">${escapeHtml(email.preview)}</div>
                                    <div class="mail-item-footer">
                                        ${email.hasAttachment ? '<span class="mail-attach-icon"><svg viewBox="0 0 14 14" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3.5L4.5 8a1.5 1.5 0 0 0 2 2L11 5.5a2.5 2.5 0 0 0-3.5-3.5L4 5.5a3.5 3.5 0 0 0 5 5L12 7.5"/></svg></span>' : ''}
                                        ${email.unread ? '<div class="mail-unread-dot"></div>' : ''}
                                    </div>
                                </div>
                            `).join('')}
                        `;
                    }).join('')}
                </div>
                <div class="mail-message mail-empty-pane">
                    <div class="mail-empty">
                        <svg viewBox="0 0 56 56" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"><path d="M10 14h36v28H10zM10 14l18 16L46 14"/></svg>
                        <div class="mail-empty-text">选择一封邮件阅读</div>
                    </div>
                </div>
            </div>
        `;

        container.querySelectorAll('.mail-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('[data-flag]')) return;
                selectedEmailId = item.dataset.id;
                render();
            });
        });

        container.querySelectorAll('[data-flag]').forEach(flagEl => {
            flagEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = flagEl.dataset.flag;
                const email = getEmailById(id);
                if (email) {
                    const orig = emails[email.mailbox]?.find(x => x.id === id);
                    if (orig) {
                        orig.flagged = !orig.flagged;
                        saveEmails();
                        render();
                    }
                }
            });
        });
    }

    function renderMessageView(container, email) {
        const bodyHtml = escapeHtml(email.content).replace(/\n/g, '<br>');
        container.innerHTML = `
            <div class="mail-message-view">
                <div class="mail-message-header">
                    <h2 class="mail-message-subject">
                        ${email.hasAttachment ? '<span class="mail-subject-attach"><svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3.5L4.5 8a1.5 1.5 0 0 0 2 2L11 5.5a2.5 2.5 0 0 0-3.5-3.5L4 5.5a3.5 3.5 0 0 0 5 5L12 7.5"/></svg></span>' : ''}
                        ${escapeHtml(email.subject)}
                    </h2>
                    <div class="mail-message-sender">
                        <div class="mail-sender-avatar" style="${email.vip || vipSenders.includes(email.sender) ? 'background:linear-gradient(135deg,#ff9500,#ff5e3a);' : ''}">${(email.sender || '?').charAt(0)}</div>
                        <div class="mail-sender-info">
                            <div class="mail-sender-name">
                                ${escapeHtml(email.sender)}
                                ${email.vip || vipSenders.includes(email.sender) ? '<span class="mail-vip-badge">VIP</span>' : ''}
                            </div>
                            <div class="mail-sender-meta">
                                <span>发送给 <strong>${escapeHtml(email.to || '我')}</strong></span>
                                <span class="mail-sender-date">${formatMailDateLong(email.date)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mail-message-body">${bodyHtml}</div>
                ${email.attachments && email.attachments.length > 0 ? `
                    <div class="mail-attachments">
                        <div class="mail-attachments-title">
                            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3.5L4.5 8a1.5 1.5 0 0 0 2 2L11 5.5a2.5 2.5 0 0 0-3.5-3.5L4 5.5a3.5 3.5 0 0 0 5 5L12 7.5"/></svg>
                            附件 (${email.attachments.length})
                        </div>
                        <div class="mail-attachments-list">
                            ${email.attachments.map(att => `
                                <div class="mail-attachment-item" title="下载 ${escapeHtml(att.name)}">
                                    <div class="mail-attachment-icon" data-ext="${(att.name.split('.').pop() || '').toLowerCase()}">
                                        ${(att.name.split('.').pop() || '').toUpperCase().slice(0, 3)}
                                    </div>
                                    <div class="mail-attachment-info">
                                        <div class="mail-attachment-name">${escapeHtml(att.name)}</div>
                                        <div class="mail-attachment-size">${att.size}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        container.querySelectorAll('.mail-attachment-item').forEach(item => {
            item.addEventListener('click', () => showToast('正在下载附件...'));
        });
    }

    function renderCompose(container) {
        const reply = composeReplyData;
        container.innerHTML = `
            <div class="mail-compose">
                <div class="mail-compose-toolbar">
                    <button class="mail-compose-tool" id="cc-toggle" title="抄送/密送">
                        <span style="font-size:11px;font-weight:600;">Cc</span>
                    </button>
                    <button class="mail-compose-tool" id="attach-file" title="添加附件">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3.5L4.5 8a1.5 1.5 0 0 0 2 2L11 5.5a2.5 2.5 0 0 0-3.5-3.5L4 5.5a3.5 3.5 0 0 0 5 5L12 7.5"/></svg>
                    </button>
                    <div style="flex:1;"></div>
                    <button class="mail-compose-tool" id="send-email-top" title="发送">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7L12 2L9 12L7 8z"/></svg>
                    </button>
                </div>
                <div class="mail-compose-field">
                    <span class="mail-compose-label">收件人</span>
                    <input type="email" id="compose-to" class="mail-compose-input" placeholder="输入邮箱地址" value="${escapeHtml(reply?.to || '')}">
                </div>
                <div class="mail-compose-field mail-compose-cc hidden" id="cc-field">
                    <span class="mail-compose-label">抄送</span>
                    <input type="email" id="compose-cc" class="mail-compose-input" placeholder="抄送邮箱地址">
                </div>
                <div class="mail-compose-field mail-compose-cc hidden" id="bcc-field">
                    <span class="mail-compose-label">密送</span>
                    <input type="email" id="compose-bcc" class="mail-compose-input" placeholder="密送邮箱地址">
                </div>
                <div class="mail-compose-field">
                    <span class="mail-compose-label">主题</span>
                    <input type="text" id="compose-subject" class="mail-compose-input" placeholder="邮件主题" value="${escapeHtml(reply?.subject || '')}">
                </div>
                <textarea id="compose-content" class="mail-compose-body" placeholder="邮件内容...">${escapeHtml(reply?.body || '')}</textarea>
                <div class="mail-compose-actions">
                    <button id="cancel-compose" class="btn btn-secondary">取消</button>
                    <button id="send-email" class="btn btn-primary">发送</button>
                </div>
            </div>
        `;

        let ccVisible = false;
        container.querySelector('#cc-toggle').addEventListener('click', () => {
            ccVisible = !ccVisible;
            container.querySelector('#cc-field').classList.toggle('hidden', !ccVisible);
            container.querySelector('#bcc-field').classList.toggle('hidden', !ccVisible);
        });

        container.querySelector('#attach-file').addEventListener('click', () => {
            showToast('附件功能演示中');
        });

        container.querySelector('#cancel-compose').addEventListener('click', () => {
            showCompose = false;
            composeReplyData = null;
            render();
        });

        const sendEmail = () => {
            const to = container.querySelector('#compose-to').value.trim();
            const cc = container.querySelector('#compose-cc').value.trim();
            const subject = container.querySelector('#compose-subject').value.trim();
            const content = container.querySelector('#compose-content').value;
            if (!to) {
                container.querySelector('#compose-to').focus();
                showToast('请填写收件人');
                return;
            }
            if (!subject) {
                container.querySelector('#compose-subject').focus();
                showToast('请填写主题');
                return;
            }
            emails.sent.unshift({
                id: 's' + Date.now(),
                from: '我',
                sender: '我',
                to: to + (cc ? ', ' + cc : ''),
                subject: subject,
                preview: content.slice(0, 50).replace(/\n/g, ' '),
                content: content,
                date: Date.now(),
                unread: false,
                flagged: false,
                vip: false,
                hasAttachment: false
            });
            saveEmails();
            showCompose = false;
            composeReplyData = null;
            currentMailbox = 'sent';
            showToast('邮件已发送');
            render();
        };

        container.querySelector('#send-email').addEventListener('click', sendEmail);
        container.querySelector('#send-email-top').addEventListener('click', sendEmail);
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    render();
};
