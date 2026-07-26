window.renderMessages = function(body, sidebar, toolbar, windowId) {
    let selectedContactId = '1';
    let inputText = '';

    const contacts = [
        { id: '1', name: '张小明', avatar: '张', lastMessage: '好的，到时见！', time: '下午', unread: 2, color: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
        { id: '2', name: '李华', avatar: '李', lastMessage: '这个项目进展如何？', time: '上午', unread: 0, color: 'linear-gradient(135deg, #4ecdc4, #44a08d)' },
        { id: '3', name: '工作群', avatar: '群', lastMessage: '王总：明天下午开会', time: '昨天', unread: 5, color: 'linear-gradient(135deg, #667eea, #764ba2)' },
        { id: '4', name: '妈妈', avatar: '妈', lastMessage: '记得按时吃饭', time: '周一', unread: 0, color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
        { id: '5', name: '快递员', avatar: '快', lastMessage: '您的快递已放在门卫', time: '上周', unread: 0, color: 'linear-gradient(135deg, #4facfe, #00f2fe)' }
    ];

    let conversations = JSON.parse(localStorage.getItem('macos_messages') || 'null') || {
        '1': [
            { from: 'them', text: '嗨！这个周末有空吗？', time: '15:30' },
            { from: 'them', text: '想约大家一起聚聚', time: '15:30' },
            { from: 'me', text: '好啊！什么时间？', time: '15:32' },
            { from: 'them', text: '周六晚上6点，市中心那家川菜馆', time: '15:33' },
            { from: 'me', text: '没问题！我会准时到的', time: '15:35' },
            { from: 'them', text: '好的，到时见！', time: '15:36' }
        ],
        '2': [
            { from: 'them', text: '你好，这个项目进展如何？', time: '10:00' },
            { from: 'me', text: '目前进度正常，预计下周能完成', time: '10:15' }
        ],
        '3': [
            { from: 'them', text: '各位同事请注意', time: '09:00' },
            { from: 'them', text: '明天下午2点在大会议室开会', time: '09:01' },
            { from: 'them', text: '请大家准时参加', time: '09:02' }
        ],
        '4': [
            { from: 'them', text: '儿子，最近工作忙吗？', time: '18:00' },
            { from: 'me', text: '还好，不是特别忙', time: '19:00' },
            { from: 'them', text: '记得按时吃饭，别太累了', time: '19:01' }
        ],
        '5': [
            { from: 'them', text: '您好，您的快递到了', time: '14:00' },
            { from: 'them', text: '已放在门卫处，请尽快领取', time: '14:01' },
            { from: 'me', text: '好的，谢谢', time: '14:30' }
        ]
    };

    function saveMessages() {
        localStorage.setItem('macos_messages', JSON.stringify(conversations));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function getCurrentContact() {
        return contacts.find(c => c.id === selectedContactId);
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="messages-sidebar" style="height:100%;">
                <div style="padding:12px;border-bottom:0.5px solid var(--border-color);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="font-weight:600;font-size:14px;">信息</span>
                        <button class="finder-toolbar-btn" style="width:28px;height:28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
                        </button>
                    </div>
                    <input type="text" placeholder="搜索" style="width:100%;padding:6px 10px;background:var(--input-bg);border:none;border-radius:6px;font-size:12px;outline:none;">
                </div>
                <div style="overflow-y:auto;height:calc(100% - 60px);">
                    ${contacts.map(contact => `
                        <div class="contact-item ${selectedContactId === contact.id ? 'active' : ''}" data-id="${contact.id}" style="position:relative;">
                            <div class="contact-avatar" style="background:${contact.color};">${contact.avatar}</div>
                            <div style="flex:1;min-width:0;">
                                <div style="font-weight:500;font-size:13px;">${escapeHtml(contact.name)}</div>
                                <div style="font-size:12px;opacity:0.7;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(contact.lastMessage)}</div>
                            </div>
                            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                                <div style="font-size:11px;opacity:0.5;">${contact.time}</div>
                                ${contact.unread > 0 ? `<span style="background:var(--accent-blue);color:#fff;font-size:10px;padding:2px 6px;border-radius:10px;min-width:18px;text-align:center;">${contact.unread}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                const contact = contacts.find(c => c.id === selectedContactId);
                if (contact) contact.unread = 0;
                selectedContactId = item.dataset.id;
                render();
            });
        });
    }

    function renderContent() {
        const contact = getCurrentContact();
        const messages = conversations[selectedContactId] || [];

        body.innerHTML = `
            <div class="messages-body">
                <div class="messages-chat">
                    <div class="messages-header">${escapeHtml(contact.name)}</div>
                    <div class="messages-list" id="messages-list">
                        ${messages.map((msg, idx) => `
                            <div class="message-bubble ${msg.from === 'me' ? 'sent' : 'received'}">${escapeHtml(msg.text)}</div>
                        `).join('')}
                    </div>
                    <div class="messages-input-area">
                        <input type="text" class="messages-input" id="message-input" placeholder="iMessage" value="${escapeHtml(inputText)}">
                        <button id="send-btn" style="width:36px;height:36px;border-radius:50%;border:none;background:var(--accent-blue);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;">
                            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const msgList = body.querySelector('#messages-list');
        msgList.scrollTop = msgList.scrollHeight;

        const input = body.querySelector('#message-input');
        const sendBtn = body.querySelector('#send-btn');

        function sendMessage() {
            const text = input.value.trim();
            if (!text) return;
            conversations[selectedContactId].push({ from: 'me', text: text, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) });
            contact.lastMessage = text;
            contact.time = '刚刚';
            inputText = '';
            saveMessages();
            render();
        }

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
        input.focus();
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    render();
};
