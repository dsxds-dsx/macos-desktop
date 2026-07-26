window.renderCalendar = function(body, sidebar, toolbar, windowId) {
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let selectedDate = new Date(today);

    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

    function render() {
        body.innerHTML = `
            <div class="app-content calendar-body">
                <div class="calendar-header">
                    <div class="calendar-nav">
                        <button class="calendar-nav-btn" id="cal-prev">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
                        </button>
                        <button class="calendar-nav-btn" id="cal-today" style="width:auto;padding:0 12px;font-size:13px;">今天</button>
                        <button class="calendar-nav-btn" id="cal-next">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
                        </button>
                    </div>
                    <div class="calendar-month">${currentYear}年 ${months[currentMonth]}</div>
                    <div style="width:150px;"></div>
                </div>
                <div class="calendar-grid">
                    <div class="calendar-weekdays">
                        ${weekdays.map(d => `<div>${d}</div>`).join('')}
                    </div>
                    <div class="calendar-days" id="cal-days"></div>
                </div>
                <div style="padding:16px 20px;border-top:0.5px solid var(--border-color);">
                    <div style="font-size:14px;font-weight:600;margin-bottom:8px;">
                        ${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日
                    </div>
                    <div style="font-size:13px;color:var(--text-secondary);">
                        星期${weekdays[selectedDate.getDay()]} · 无日程安排
                    </div>
                </div>
            </div>
        `;

        const daysContainer = body.querySelector('#cal-days');
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        let html = '';
        
        for (let i = firstDay - 1; i >= 0; i--) {
            const d = daysInPrevMonth - i;
            html += `<div class="calendar-day other-month">${d}</div>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const isSelected = d === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            html += `<div class="${classes}" data-day="${d}">${d}</div>`;
        }

        const totalCells = firstDay + daysInMonth;
        const remaining = 42 - totalCells;
        for (let d = 1; d <= remaining; d++) {
            html += `<div class="calendar-day other-month">${d}</div>`;
        }

        daysContainer.innerHTML = html;

        body.querySelector('#cal-prev').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            render();
        });

        body.querySelector('#cal-next').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            render();
        });

        body.querySelector('#cal-today').addEventListener('click', () => {
            currentYear = today.getFullYear();
            currentMonth = today.getMonth();
            selectedDate = new Date(today);
            render();
        });

        daysContainer.querySelectorAll('.calendar-day:not(.other-month)').forEach(day => {
            day.addEventListener('click', () => {
                selectedDate = new Date(currentYear, currentMonth, parseInt(day.dataset.day));
                render();
            });
        });
    }

    render();
};
