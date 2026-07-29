window.renderCalendar = function(body, sidebar, toolbar, windowId) {
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let selectedDate = new Date(today);
    let viewMode = 'month'; // month | week | day

    // 事件存储（本地）
    const STORAGE_KEY = 'macos_calendar_events_v1';
    let events = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || [
        { id: '1', title: '团队周会', date: ymd(today), time: '10:00', color: 'blue', location: '会议室 A', notes: '讨论本周工作进度' },
        { id: '2', title: '午餐', date: ymd(today), time: '12:30', color: 'orange', location: '楼下餐厅', notes: '' },
        { id: '3', title: '产品评审', date: ymd(addDays(today, 2)), time: '14:00', color: 'red', location: '会议室 B', notes: '评审新版本设计方案' },
        { id: '4', title: '健身', date: ymd(addDays(today, 1)), time: '19:00', color: 'green', location: '健身房', notes: '腿部训练' },
        { id: '5', title: '生日聚会', date: ymd(addDays(today, 5)), time: '18:30', color: 'pink', location: '朋友家', notes: '带礼物' }
    ];

    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekdaysFull = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    const calendarColors = [
        { id: 'blue', name: '工作', color: '#0a84ff' },
        { id: 'red', name: '重要', color: '#ff3b30' },
        { id: 'orange', name: '提醒', color: '#ff9500' },
        { id: 'green', name: '家庭', color: '#34c759' },
        { id: 'pink', name: '社交', color: '#ff2d55' },
        { id: 'purple', name: '个人', color: '#af52de' }
    ];

    const calendars = [
        { id: 'home', name: '家庭', color: 'green', checked: true },
        { id: 'work', name: '工作', color: 'blue', checked: true },
        { id: 'social', name: '社交', color: 'pink', checked: true },
        { id: 'personal', name: '个人', color: 'purple', checked: true }
    ];

    function ymd(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function addDays(d, n) {
        const r = new Date(d);
        r.setDate(r.getDate() + n);
        return r;
    }

    function getColor(id) {
        return calendarColors.find(c => c.id === id) || calendarColors[0];
    }

    function saveEvents() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function getEventsForDate(date) {
        return events.filter(e => e.date === ymd(date));
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="calendar-sidebar">
                <div class="calendar-sidebar-section">
                    <button class="calendar-new-event-btn" id="cal-new-event">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                        新建事件
                    </button>
                </div>
                <div class="calendar-sidebar-section">
                    <div class="calendar-mini-header">
                        <span>${today.getFullYear()}年${today.getMonth() + 1}月</span>
                    </div>
                    <div class="calendar-mini-month" id="cal-mini-month"></div>
                </div>
                <div class="calendar-sidebar-section">
                    <div class="calendar-sidebar-label">日历</div>
                    ${calendars.map(cal => {
                        const c = getColor(cal.color);
                        return `
                            <div class="calendar-cal-item" data-cal="${cal.id}">
                                <div class="calendar-cal-check ${cal.checked ? 'checked' : ''}" style="--cal-color:${c.color};">
                                    ${cal.checked ? '<svg viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M2 5l2 2 4-4"/></svg>' : ''}
                                </div>
                                <span class="calendar-cal-name">${cal.name}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="calendar-sidebar-section">
                    <div class="calendar-sidebar-label"> iCloud</div>
                    <div class="calendar-iCloud-item">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="currentColor"><path d="M11.2 6.2c-.1-1.8-1.6-3.2-3.4-3.2-1.1 0-2 .5-2.6 1.3-.4-.3-.9-.5-1.5-.5-1.3 0-2.4 1.1-2.4 2.4 0 .1 0 .2.1.3-1 .3-1.7 1.3-1.7 2.4 0 1.4 1.1 2.5 2.5 2.5h8c1.4 0 2.5-1.1 2.5-2.5 0-1.1-.7-2-1.5-2.7z" opacity="0.9"/></svg>
                        <span>iCloud</span>
                    </div>
                </div>
            </div>
        `;

        // 迷你月份
        const miniContainer = sidebar.querySelector('#cal-mini-month');
        renderMiniMonth(miniContainer);

        sidebar.querySelector('#cal-new-event')?.addEventListener('click', () => {
            openEventEditor(null);
        });

        sidebar.querySelectorAll('[data-cal]').forEach(item => {
            item.addEventListener('click', () => {
                const cal = calendars.find(c => c.id === item.dataset.cal);
                if (cal) {
                    cal.checked = !cal.checked;
                    renderSidebar();
                }
            });
        });
    }

    function renderMiniMonth(container) {
        const y = today.getFullYear();
        const m = today.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const tDate = today.getDate();

        let html = '<div class="mini-weekdays">';
        weekdays.forEach(w => html += `<div>${w}</div>`);
        html += '</div><div class="mini-days">';
        for (let i = 0; i < firstDay; i++) html += '<div class="mini-day empty"></div>';
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === tDate;
            const hasEvent = events.some(e => e.date === `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
            html += `<div class="mini-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">${d}</div>`;
        }
        html += '</div>';
        container.innerHTML = html;
    }

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div class="calendar-toolbar">
                <div class="calendar-nav">
                    <button class="calendar-nav-btn" id="cal-prev" title="上一个">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
                    </button>
                    <button class="calendar-nav-btn" id="cal-today" style="width:auto;padding:0 12px;font-size:12px;">今天</button>
                    <button class="calendar-nav-btn" id="cal-next" title="下一个">
                        <svg viewBox="0 0 24 24" width="14" height="14"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
                    </button>
                </div>
                <div class="calendar-title">${currentYear}年 ${months[currentMonth]}</div>
                <div style="flex:1;"></div>
                <div class="calendar-view-switch">
                    <button class="${viewMode === 'day' ? 'active' : ''}" data-view="day">日</button>
                    <button class="${viewMode === 'week' ? 'active' : ''}" data-view="week">周</button>
                    <button class="${viewMode === 'month' ? 'active' : ''}" data-view="month">月</button>
                </div>
            </div>
        `;

        toolbar.querySelector('#cal-prev')?.addEventListener('click', () => {
            if (viewMode === 'month') {
                currentMonth--;
                if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            } else if (viewMode === 'week') {
                selectedDate = addDays(selectedDate, -7);
            } else {
                selectedDate = addDays(selectedDate, -1);
            }
            render();
        });

        toolbar.querySelector('#cal-next')?.addEventListener('click', () => {
            if (viewMode === 'month') {
                currentMonth++;
                if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            } else if (viewMode === 'week') {
                selectedDate = addDays(selectedDate, 7);
            } else {
                selectedDate = addDays(selectedDate, 1);
            }
            render();
        });

        toolbar.querySelector('#cal-today')?.addEventListener('click', () => {
            currentYear = today.getFullYear();
            currentMonth = today.getMonth();
            selectedDate = new Date(today);
            render();
        });

        toolbar.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', () => {
                viewMode = btn.dataset.view;
                render();
            });
        });
    }

    function renderContent() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.flexDirection = 'row';

        body.innerHTML = `
            <div class="calendar-main">
                ${viewMode === 'month' ? renderMonthView() : (viewMode === 'week' ? renderWeekView() : renderDayView())}
            </div>
            <div class="calendar-detail" id="cal-detail"></div>
        `;

        renderDetail();

        // 点击日期单元格
        body.querySelectorAll('[data-date]').forEach(cell => {
            cell.addEventListener('click', e => {
                if (e.target.closest('.cal-day-event')) return;
                const dateStr = cell.dataset.date;
                const [y, m, d] = dateStr.split('-').map(Number);
                selectedDate = new Date(y, m - 1, d);
                if (viewMode === 'month') {
                    currentYear = y;
                    currentMonth = m - 1;
                }
                render();
            });
        });

        body.querySelectorAll('.cal-day-event').forEach(ev => {
            ev.addEventListener('click', e => {
                e.stopPropagation();
                openEventEditor(ev.dataset.id);
            });
        });

        // 双击创建事件
        body.querySelectorAll('[data-date]').forEach(cell => {
            cell.addEventListener('dblclick', () => {
                const dateStr = cell.dataset.date;
                const [y, m, d] = dateStr.split('-').map(Number);
                selectedDate = new Date(y, m - 1, d);
                openEventEditor(null);
            });
        });
    }

    function renderMonthView() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        let html = `
            <div class="calendar-month-view">
                <div class="calendar-weekdays">
                    ${weekdays.map(d => `<div>${d}</div>`).join('')}
                </div>
                <div class="calendar-days">
        `;

        for (let i = firstDay - 1; i >= 0; i--) {
            const d = daysInPrevMonth - i;
            const date = new Date(currentYear, currentMonth - 1, d);
            const dayEvents = getEventsForDate(date);
            html += `
                <div class="calendar-day other-month" data-date="${ymd(date)}">
                    <div class="cal-day-num">${d}</div>
                    ${dayEvents.slice(0, 2).map(e => `<div class="cal-day-event" data-id="${e.id}" style="--ev-color:${getColor(e.color).color};">${escapeHtml(e.time || '')} ${escapeHtml(e.title)}</div>`).join('')}
                    ${dayEvents.length > 2 ? `<div class="cal-day-more">+${dayEvents.length - 2} 项</div>` : ''}
                </div>
            `;
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const isSelected = d === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
            const date = new Date(currentYear, currentMonth, d);
            const dayEvents = getEventsForDate(date);
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            html += `
                <div class="${classes}" data-date="${ymd(date)}">
                    <div class="cal-day-num">${d}</div>
                    ${dayEvents.slice(0, 2).map(e => `<div class="cal-day-event" data-id="${e.id}" style="--ev-color:${getColor(e.color).color};">${escapeHtml(e.time || '')} ${escapeHtml(e.title)}</div>`).join('')}
                    ${dayEvents.length > 2 ? `<div class="cal-day-more">+${dayEvents.length - 2} 项</div>` : ''}
                </div>
            `;
        }

        const totalCells = firstDay + daysInMonth;
        const remaining = 42 - totalCells;
        for (let d = 1; d <= remaining; d++) {
            const date = new Date(currentYear, currentMonth + 1, d);
            const dayEvents = getEventsForDate(date);
            html += `
                <div class="calendar-day other-month" data-date="${ymd(date)}">
                    <div class="cal-day-num">${d}</div>
                    ${dayEvents.slice(0, 2).map(e => `<div class="cal-day-event" data-id="${e.id}" style="--ev-color:${getColor(e.color).color};">${escapeHtml(e.time || '')} ${escapeHtml(e.title)}</div>`).join('')}
                </div>
            `;
        }

        html += `</div></div>`;
        return html;
    }

    function renderWeekView() {
        const weekStart = addDays(selectedDate, -selectedDate.getDay());
        const days = [];
        for (let i = 0; i < 7; i++) days.push(addDays(weekStart, i));

        let html = '<div class="calendar-week-view"><div class="week-header">';
        days.forEach(d => {
            const isToday = ymd(d) === ymd(today);
            const isSel = ymd(d) === ymd(selectedDate);
            html += `
                <div class="week-day-header ${isToday ? 'today' : ''} ${isSel ? 'selected' : ''}">
                    <div class="week-day-name">${weekdays[d.getDay()]}</div>
                    <div class="week-day-num">${d.getDate()}</div>
                </div>
            `;
        });
        html += '</div><div class="week-body">';

        // 时间轴 0-23
        for (let h = 0; h < 24; h++) {
            html += `<div class="week-hour-row"><div class="week-hour-label">${String(h).padStart(2, '0')}:00</div>`;
            for (let i = 0; i < 7; i++) {
                const d = days[i];
                const dateStr = ymd(d);
                const hourEvents = events.filter(e => e.date === dateStr && e.time && parseInt(e.time.split(':')[0]) === h);
                html += `<div class="week-hour-cell" data-date="${dateStr}">`;
                hourEvents.forEach(e => {
                    html += `<div class="week-event" data-id="${e.id}" style="--ev-color:${getColor(e.color).color};">
                        <div class="week-event-time">${escapeHtml(e.time)}</div>
                        <div class="week-event-title">${escapeHtml(e.title)}</div>
                    </div>`;
                });
                html += `</div>`;
            }
            html += `</div>`;
        }
        html += '</div></div>';
        return html;
    }

    function renderDayView() {
        const d = selectedDate;
        const isToday = ymd(d) === ymd(today);
        const dayEvents = getEventsForDate(d).sort((a, b) => (a.time || '').localeCompare(b.time || ''));

        let html = `
            <div class="calendar-day-view">
                <div class="day-header ${isToday ? 'today' : ''}">
                    <div class="day-header-name">${weekdaysFull[d.getDay()]}</div>
                    <div class="day-header-date">${d.getMonth() + 1}月${d.getDate()}日</div>
                </div>
                <div class="day-body">
        `;

        if (dayEvents.length === 0) {
            html += '<div class="day-empty">今天没有日程</div>';
        }

        let currentHour = -1;
        for (let h = 0; h < 24; h++) {
            const hourEvents = dayEvents.filter(e => e.time && parseInt(e.time.split(':')[0]) === h);
            if (hourEvents.length > 0) {
                html += `<div class="day-hour-block">
                    <div class="day-hour-label">${String(h).padStart(2, '0')}:00</div>
                    <div class="day-hour-events">`;
                hourEvents.forEach(e => {
                    html += `<div class="day-event" data-id="${e.id}" style="--ev-color:${getColor(e.color).color};">
                        <div class="day-event-time">${escapeHtml(e.time)}</div>
                        <div class="day-event-title">${escapeHtml(e.title)}</div>
                        ${e.location ? `<div class="day-event-loc">📍 ${escapeHtml(e.location)}</div>` : ''}
                    </div>`;
                });
                html += `</div></div>`;
            }
        }

        html += '</div></div>';
        return html;
    }

    function renderDetail() {
        const detail = body.querySelector('#cal-detail');
        if (!detail) return;
        const dayEvents = getEventsForDate(selectedDate).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        detail.innerHTML = `
            <div class="calendar-detail-header">
                <div class="cal-detail-date">${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日</div>
                <div class="cal-detail-weekday">${weekdaysFull[selectedDate.getDay()]}</div>
            </div>
            <div class="calendar-detail-events">
                ${dayEvents.length === 0 ? '<div class="cal-detail-empty">无日程</div>' : dayEvents.map(e => {
                    const c = getColor(e.color);
                    return `
                        <div class="cal-detail-event" data-id="${e.id}">
                            <div class="cal-detail-dot" style="background:${c.color};"></div>
                            <div class="cal-detail-info">
                                <div class="cal-detail-title">${escapeHtml(e.title)}</div>
                                <div class="cal-detail-time">${escapeHtml(e.time || '全天')}</div>
                                ${e.location ? `<div class="cal-detail-loc">📍 ${escapeHtml(e.location)}</div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <button class="cal-detail-add" id="cal-detail-add-btn">+ 添加日程</button>
        `;
        detail.querySelector('#cal-detail-add-btn')?.addEventListener('click', () => openEventEditor(null));
        detail.querySelectorAll('[data-id]').forEach(ev => {
            ev.addEventListener('click', () => openEventEditor(ev.dataset.id));
        });
    }

    function openEventEditor(eventId) {
        const isNew = !eventId;
        const event = isNew ? {
            id: Date.now().toString(),
            title: '',
            date: ymd(selectedDate),
            time: '09:00',
            color: 'blue',
            location: '',
            notes: ''
        } : events.find(e => e.id === eventId);

        if (!event) return;

        const overlay = document.createElement('div');
        overlay.className = 'cal-editor-overlay';
        overlay.innerHTML = `
            <div class="cal-editor">
                <div class="cal-editor-header">
                    <div class="cal-editor-title">${isNew ? '新事件' : '编辑事件'}</div>
                    <button class="cal-editor-close" id="cal-ed-close">×</button>
                </div>
                <div class="cal-editor-body">
                    <input type="text" class="cal-ed-input title" id="cal-ed-title" placeholder="标题" value="${escapeHtml(event.title)}">
                    <div class="cal-ed-field">
                        <label>日期</label>
                        <input type="date" class="cal-ed-input" id="cal-ed-date" value="${event.date}">
                    </div>
                    <div class="cal-ed-field">
                        <label>时间</label>
                        <input type="time" class="cal-ed-input" id="cal-ed-time" value="${event.time}">
                    </div>
                    <div class="cal-ed-field">
                        <label>位置</label>
                        <input type="text" class="cal-ed-input" id="cal-ed-loc" placeholder="添加位置" value="${escapeHtml(event.location)}">
                    </div>
                    <div class="cal-ed-field">
                        <label>日历</label>
                        <div class="cal-ed-colors">
                            ${calendarColors.map(c => `
                                <button class="cal-ed-color ${event.color === c.id ? 'active' : ''}" data-color="${c.id}" style="background:${c.color};" title="${c.name}"></button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="cal-ed-field">
                        <label>备注</label>
                        <textarea class="cal-ed-input notes" id="cal-ed-notes" placeholder="添加备注">${escapeHtml(event.notes)}</textarea>
                    </div>
                </div>
                <div class="cal-editor-footer">
                    ${!isNew ? '<button class="cal-ed-btn danger" id="cal-ed-del">删除</button>' : ''}
                    <div style="flex:1;"></div>
                    <button class="cal-ed-btn" id="cal-ed-cancel">取消</button>
                    <button class="cal-ed-btn primary" id="cal-ed-save">${isNew ? '添加' : '完成'}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        let selectedColor = event.color;

        overlay.querySelector('#cal-ed-close')?.addEventListener('click', () => overlay.remove());
        overlay.querySelector('#cal-ed-cancel')?.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.remove();
        });

        overlay.querySelectorAll('[data-color]').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedColor = btn.dataset.color;
                overlay.querySelectorAll('[data-color]').forEach(b => b.classList.toggle('active', b === btn));
            });
        });

        overlay.querySelector('#cal-ed-del')?.addEventListener('click', () => {
            events = events.filter(e => e.id !== event.id);
            saveEvents();
            overlay.remove();
            render();
        });

        overlay.querySelector('#cal-ed-save')?.addEventListener('click', () => {
            const title = overlay.querySelector('#cal-ed-title').value.trim();
            if (!title) {
                overlay.querySelector('#cal-ed-title').focus();
                return;
            }
            event.title = title;
            event.date = overlay.querySelector('#cal-ed-date').value;
            event.time = overlay.querySelector('#cal-ed-time').value;
            event.location = overlay.querySelector('#cal-ed-loc').value.trim();
            event.notes = overlay.querySelector('#cal-ed-notes').value.trim();
            event.color = selectedColor;
            if (isNew) events.push(event);
            saveEvents();
            const [y, m, d] = event.date.split('-').map(Number);
            selectedDate = new Date(y, m - 1, d);
            if (viewMode === 'month') {
                currentYear = y;
                currentMonth = m - 1;
            }
            overlay.remove();
            render();
        });

        setTimeout(() => overlay.querySelector('#cal-ed-title')?.focus(), 50);
    }

    function render() {
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    render();
};
