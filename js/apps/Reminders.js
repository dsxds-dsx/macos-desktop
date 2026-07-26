window.renderReminders = function(body, sidebar, toolbar, windowId) {
    let reminders = JSON.parse(localStorage.getItem('macos_reminders') || 'null') || {
        today: [
            { id: '1', text: '完成项目报告', completed: false },
            { id: '2', text: '回复重要邮件', completed: true },
            { id: '3', text: '下午3点开会', completed: false }
        ],
        scheduled: [
            { id: '4', text: '明天交周报', completed: false },
            { id: '5', text: '周五体检', completed: false }
        ],
        all: [
            { id: '1', text: '完成项目报告', completed: false },
            { id: '2', text: '回复重要邮件', completed: true },
            { id: '3', text: '下午3点开会', completed: false },
            { id: '4', text: '明天交周报', completed: false },
            { id: '5', text: '周五体检', completed: false },
            { id: '6', text: '买牛奶', completed: false },
            { id: '7', text: '给妈妈打电话', completed: true }
        ],
        flagged: [
            { id: '3', text: '下午3点开会', completed: false }
        ]
    };
    let currentList = 'today';
    let newItemText = '';

    function saveReminders() {
        localStorage.setItem('macos_reminders', JSON.stringify(reminders));
    }

    function renderSidebar() {
        if (!sidebar) return;
        const lists = [
            { id: 'today', name: '今天', icon: '📅', count: reminders.today.filter(r => !r.completed).length, color: 'var(--accent-blue)' },
            { id: 'scheduled', name: '计划', icon: '⏰', count: reminders.scheduled.filter(r => !r.completed).length, color: 'var(--accent-red)' },
            { id: 'all', name: '全部', icon: '📋', count: reminders.all.filter(r => !r.completed).length, color: 'var(--text-tertiary)' },
            { id: 'flagged', name: '已标记', icon: '🚩', count: reminders.flagged.filter(r => !r.completed).length, color: 'var(--accent-orange)' }
        ];
        sidebar.innerHTML = `
            <div style="width:220px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);padding:16px;">
                <div style="font-size:20px;font-weight:700;margin-bottom:16px;">提醒事项</div>
                <div style="display:flex;flex-direction:column;gap:4px;">
                    ${lists.map(list => `
                        <div class="finder-sidebar-item ${currentList === list.id ? 'active' : ''}" data-list="${list.id}">
                            <span style="width:24px;height:24px;border-radius:6px;background:${list.color};display:flex;align-items:center;justify-content:center;font-size:12px;">${list.icon}</span>
                            <span style="flex:1;">${list.name}</span>
                            <span style="font-size:12px;opacity:0.6;">${list.count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sidebar.querySelectorAll('[data-list]').forEach(item => {
            item.addEventListener('click', () => {
                currentList = item.dataset.list;
                newItemText = '';
                render();
            });
        });
    }

    function renderContent() {
        const list = reminders[currentList] || [];
        const completedCount = list.filter(r => r.completed).length;
        const listNames = { today: '今天', scheduled: '计划', all: '全部', flagged: '已标记' };
        
        body.innerHTML = `
            <div class="reminders-body">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h2 style="font-size:28px;font-weight:700;">${listNames[currentList]}</h2>
                </div>
                
                <div class="reminder-list">
                    ${list.map(item => `
                        <div class="reminder-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
                            <div class="reminder-checkbox" data-id="${item.id}">
                                ${item.completed ? '✓' : ''}
                            </div>
                            <span class="reminder-text">${item.text}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="reminder-add">
                    <button class="finder-toolbar-btn" id="add-btn" style="width:28px;height:28px;color:var(--accent-blue);">
                        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
                    </button>
                    <input type="text" id="new-reminder" placeholder="添加提醒事项" value="${newItemText}" style="flex:1;">
                </div>
                
                ${completedCount > 0 ? `
                    <div style="margin-top:24px;">
                        <div style="font-size:13px;color:var(--text-tertiary);margin-bottom:8px;padding:0 12px;">已完成 (${completedCount})</div>
                    </div>
                ` : ''}
            </div>
        `;

        body.querySelectorAll('.reminder-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = checkbox.dataset.id;
                ['today', 'scheduled', 'all', 'flagged'].forEach(l => {
                    const item = reminders[l].find(r => r.id === id);
                    if (item) item.completed = !item.completed;
                });
                saveReminders();
                render();
            });
        });

        const input = body.querySelector('#new-reminder');
        const addBtn = body.querySelector('#add-btn');
        
        function addReminder() {
            const text = input.value.trim();
            if (!text) return;
            const newItem = { id: Date.now().toString(), text: text, completed: false };
            reminders.all.unshift(newItem);
            if (currentList === 'all') {
                reminders.all.unshift(newItem);
            } else {
                reminders[currentList].unshift(newItem);
            }
            newItemText = '';
            saveReminders();
            render();
        }

        addBtn.addEventListener('click', addReminder);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addReminder();
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
