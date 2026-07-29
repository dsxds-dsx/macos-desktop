window.renderReminders = function(body, sidebar, toolbar, windowId) {
    let reminders = JSON.parse(localStorage.getItem('macos_reminders_v2') || 'null') || {
        lists: [
            { id: 'today', name: '今天', icon: 'calendar', color: '#ff3b30', system: true },
            { id: 'scheduled', name: '计划', icon: 'clock', color: '#ff9500', system: true },
            { id: 'all', name: '全部', icon: 'inbox', color: '#0a84ff', system: true },
            { id: 'flagged', name: '已标记', icon: 'flag', color: '#ff9500', system: true },
            { id: 'completed', name: '已完成', icon: 'check', color: '#34c759', system: true }
        ],
        items: [
            { id: '1', text: '完成项目报告', completed: false, listId: 'today', date: 'today', flagged: false },
            { id: '2', text: '回复重要邮件', completed: true, listId: 'today', date: 'today', flagged: false },
            { id: '3', text: '下午3点开会', completed: false, listId: 'today', date: 'today', flagged: true },
            { id: '4', text: '明天交周报', completed: false, listId: 'scheduled', date: 'tomorrow', flagged: false },
            { id: '5', text: '周五体检', completed: false, listId: 'scheduled', date: 'friday', flagged: false },
            { id: '6', text: '买牛奶', completed: false, listId: 'all', flagged: false },
            { id: '7', text: '给妈妈打电话', completed: true, listId: 'all', flagged: false }
        ]
    };
    let currentList = 'today';
    let newItemText = '';
    let editingId = null;

    function saveReminders() {
        localStorage.setItem('macos_reminders_v2', JSON.stringify(reminders));
    }

    function getListItems(listId) {
        if (listId === 'today') return reminders.items.filter(i => i.date === 'today' || i.listId === 'today');
        if (listId === 'scheduled') return reminders.items.filter(i => i.date && i.date !== 'today' && !i.completed);
        if (listId === 'all') return reminders.items;
        if (listId === 'flagged') return reminders.items.filter(i => i.flagged);
        if (listId === 'completed') return reminders.items.filter(i => i.completed);
        return reminders.items.filter(i => i.listId === listId);
    }

    function getCount(listId) {
        return getListItems(listId).filter(i => !i.completed).length;
    }

    const sfIcons = {
        calendar: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5"/><path d="M1.5 5.5h11M4 1v3M10 1v3"/></svg>',
        clock: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><circle cx="7" cy="7.5" r="5"/><path d="M7 5v2.5l2 1"/></svg>',
        inbox: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"><path d="M1.5 8.5L3 3.5h8l1.5 5v3H1.5z"/><path d="M1.5 8.5h3l1 1.5h3l1-1.5h3"/></svg>',
        flag: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"><path d="M3 1.5v11M3 2.5h7l-1.5 2.5L10 7.5H3"/></svg>',
        check: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.5l3 3 6-6"/></svg>',
        list: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"><path d="M3 4h8M3 7h8M3 10h8"/></svg>'
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="reminders-sidebar">
                <div class="reminders-sidebar-header">
                    <button class="reminders-add-list-btn" title="添加列表">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                    </button>
                </div>
                <div class="reminders-sidebar-list">
                    ${reminders.lists.map(list => {
                        const count = getCount(list.id);
                        const icon = list.system ? (sfIcons[list.icon] || sfIcons.list) : sfIcons.list;
                        return `
                        <div class="finder-sidebar-item reminders-list-item ${currentList === list.id ? 'active' : ''}" data-list="${list.id}">
                            <div class="reminders-list-icon" style="background:${list.color};">${icon}</div>
                            <span class="finder-sidebar-label">${escapeHtml(list.name)}</span>
                            ${count > 0 ? `<span class="reminders-list-count">${count}</span>` : ''}
                        </div>
                        `;
                    }).join('')}
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

    function renderToolbar() {
        if (!toolbar) return;
        const currentListName = reminders.lists.find(l => l.id === currentList)?.name || '';
        toolbar.innerHTML = `
            <div class="reminders-toolbar">
                <button class="reminders-toolbar-btn" id="reminders-add-btn" title="新建提醒事项">
                    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                </button>
                <button class="reminders-toolbar-btn" id="reminders-flag-btn" title="标记">
                    <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M3 1.5v11M3 2.5h7l-1.5 2.5L10 7.5H3"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="reminders-toolbar-btn" id="reminders-delete-btn" title="删除" disabled>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h8M5.5 4V2.5h3V4M5 4l.5 8h3L9 4"/></svg>
                </button>
                <div style="flex:1;"></div>
                <div class="reminders-list-title">${escapeHtml(currentListName)}</div>
                <div style="flex:1;"></div>
                <button class="reminders-toolbar-btn" title="搜索">
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                </button>
            </div>
        `;
        const addBtn = toolbar.querySelector('#reminders-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                newItemText = '';
                render();
                setTimeout(() => {
                    const input = body.querySelector('#new-reminder');
                    if (input) input.focus();
                }, 50);
            });
        }
    }

    function renderContent() {
        const items = getListItems(currentList);
        const activeItems = items.filter(i => !i.completed);
        const completedItems = items.filter(i => i.completed);
        const list = reminders.lists.find(l => l.id === currentList);
        const listColor = list?.color || '#ff3b30';

        body.innerHTML = `
            <div class="reminders-body">
                <div class="reminders-list-header" style="color:${listColor};">
                    <svg viewBox="0 0 16 16" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.3">
                        <circle cx="8" cy="8" r="6.5"/>
                        <path d="M5 8.5l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>${escapeHtml(list?.name || '')}</span>
                </div>
                <div class="reminders-items">
                    ${activeItems.length === 0 && newItemText === '' && completedItems.length === 0 ? `
                        <div class="reminders-empty">
                            <div class="reminders-empty-title">无提醒事项</div>
                            <div class="reminders-empty-sub">点击 + 添加新提醒事项</div>
                        </div>
                    ` : ''}
                    ${activeItems.map(item => `
                        <div class="reminder-item ${item.flagged ? 'flagged' : ''}" data-id="${item.id}">
                            <div class="reminder-checkbox ${item.completed ? 'completed' : ''}" data-id="${item.id}">
                                ${item.completed ? '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.5l3 3 6-6"/></svg>' : ''}
                            </div>
                            <div class="reminder-content">
                                <div class="reminder-text">${escapeHtml(item.text)}</div>
                                ${item.date ? `<div class="reminder-meta">${item.date === 'today' ? '今天' : item.date === 'tomorrow' ? '明天' : item.date === 'friday' ? '周五' : escapeHtml(item.date)}</div>` : ''}
                            </div>
                            ${item.flagged ? `<div class="reminder-flag-icon"><svg viewBox="0 0 14 14" width="11" height="11" fill="#ff9500" stroke="#ff9500" stroke-width="1.3" stroke-linejoin="round"><path d="M3 1.5v11M3 2.5h7l-1.5 2.5L10 7.5H3"/></svg></div>` : ''}
                        </div>
                    `).join('')}
                    <div class="reminder-add">
                        <div class="reminder-add-circle">
                            <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="${listColor}" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                        </div>
                        <input type="text" id="new-reminder" class="reminder-add-input" placeholder="新提醒事项" value="${escapeHtml(newItemText)}">
                    </div>
                    ${completedItems.length > 0 ? `
                        <div class="reminders-completed-section">
                            <div class="reminders-completed-title">已完成 (${completedItems.length})</div>
                            ${completedItems.map(item => `
                                <div class="reminder-item completed" data-id="${item.id}">
                                    <div class="reminder-checkbox completed" data-id="${item.id}">
                                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.5l3 3 6-6"/></svg>
                                    </div>
                                    <div class="reminder-content">
                                        <div class="reminder-text">${escapeHtml(item.text)}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        body.querySelectorAll('.reminder-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = checkbox.dataset.id;
                const item = reminders.items.find(r => r.id === id);
                if (item) {
                    item.completed = !item.completed;
                    saveReminders();
                    render();
                }
            });
        });

        const input = body.querySelector('#new-reminder');
        if (input) {
            input.addEventListener('input', () => { newItemText = input.value; });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const text = input.value.trim();
                    if (!text) return;
                    const newItem = {
                        id: Date.now().toString(),
                        text: text,
                        completed: false,
                        listId: currentList === 'today' || currentList === 'all' || currentList === 'scheduled' || currentList === 'flagged' || currentList === 'completed' ? 'all' : currentList,
                        date: currentList === 'today' ? 'today' : (currentList === 'scheduled' ? 'tomorrow' : null),
                        flagged: currentList === 'flagged'
                    };
                    reminders.items.unshift(newItem);
                    newItemText = '';
                    saveReminders();
                    render();
                    setTimeout(() => {
                        const newInput = body.querySelector('#new-reminder');
                        if (newInput) newInput.focus();
                    }, 50);
                }
            });
        }
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
