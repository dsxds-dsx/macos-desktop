// Journal - 日记 (macOS Sonoma Style)
window.renderJournal = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_journal_entries_v2';
    const SETTINGS_KEY = 'macos_journal_settings';

    // ============ Mood data ============
    const MOODS = [
        { id: 'excellent', emoji: '😄', label: '出色', color: '#34C759' },
        { id: 'good',      emoji: '🙂', label: '良好', color: '#30B0C7' },
        { id: 'neutral',   emoji: '😐', label: '一般', color: '#8E8E93' },
        { id: 'sad',       emoji: '😔', label: '低落', color: '#5E5CE6' },
        { id: 'awful',     emoji: '😢', label: '糟糕', color: '#FF3B30' }
    ];

    const WEATHERS = [
        { id: 'sunny',    emoji: '☀️', label: '晴朗' },
        { id: 'cloudy',   emoji: '⛅', label: '多云' },
        { id: 'rainy',    emoji: '🌧️', label: '下雨' },
        { id: 'snowy',    emoji: '❄️', label: '下雪' },
        { id: 'foggy',    emoji: '🌫️', label: '雾天' },
        { id: 'stormy',   emoji: '⛈️', label: '雷暴' }
    ];

    // ============ Reflection prompts (macOS Journal style) ============
    const PROMPTS = [
        '今天最让我感到感激的事情是？',
        '今天我学到了什么新东西？',
        '一个让我开心的瞬间是？',
        '今天我想要记住的事情是？',
        '一个挑战我的时刻是？',
        '今天和谁共度了愉快的时光？',
        '今天的亮点是什么？',
        '如果重新过今天，我会改变什么？',
        '今天让我感到自豪的事情是？',
        '一个值得记住的小细节是？'
    ];

    // ============ State ============
    let entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || [
        {
            id: Date.now() - 86400000 * 0,
            date: new Date(new Date().setHours(9, 30, 0, 0)).getTime(),
            title: '清晨咖啡与代码',
            text: '清晨六点起床，泡了一杯耶加雪菲。窗外的天空刚刚泛起鱼肚白，整座城市还在沉睡。\n\n打开电脑继续完善 macOS 模拟项目，把 Journal 应用重写了一遍。专注于细节是件让人开心的事——颜色、间距、动效，每一个像素都值得推敲。\n\n下午去楼下散步，遇到一只很亲人的橘猫，蹲下来摸了好一会儿。',
            mood: 'good',
            weather: 'sunny',
            photos: 3,
            location: '北京·朝阳',
            bookmarked: true,
            tags: ['工作', '咖啡', '猫']
        },
        {
            id: Date.now() - 86400000 * 1,
            date: new Date(new Date().setHours(20, 15, 0, 0)).getTime() - 86400000,
            title: '颐和园的夕阳',
            text: '今天去了颐和园，运气很好，赶上了一个绝美的夕阳。昆明湖的水面被染成金色，远处的西山剪影格外分明。\n\n拍了大约八十张照片，挑出十张最满意的。十七孔桥在夕阳下重新焕发了生气，金光穿过桥洞洒在水面上，那一刻仿佛穿越了时间。\n\n回家路上吃了碗炸酱面，简单却满足。',
            mood: 'excellent',
            weather: 'sunny',
            photos: 8,
            location: '北京·颐和园',
            bookmarked: false,
            tags: ['旅行', '摄影', '夕阳']
        },
        {
            id: Date.now() - 86400000 * 3,
            date: new Date(new Date().setHours(14, 0, 0, 0)).getTime() - 86400000 * 3,
            title: '新项目启动',
            text: '团队新项目正式启动会议，十个人的小房间挤得满满当当。讨论了三小时，定下了第一个里程碑。\n\n虽然压力很大，但能和大家一起从零开始做一件事情，本身就是值得期待的事。下个月底见分晓。',
            mood: 'good',
            weather: 'cloudy',
            photos: 0,
            location: '办公室',
            bookmarked: false,
            tags: ['工作', '团队']
        },
        {
            id: Date.now() - 86400000 * 5,
            date: new Date(new Date().setHours(7, 0, 0, 0)).getTime() - 86400000 * 5,
            title: '奥森跑步',
            text: '今天完成了 5 公里跑步，配速 6\'30"，比上周快了 15 秒。森林氧吧段依然是最舒服的部分，清晨的阳光透过树叶洒下来，地面斑驳。\n\n坚持运动的第十一天，状态明显比之前好。睡眠更深，注意力也更集中。',
            mood: 'excellent',
            weather: 'sunny',
            photos: 1,
            location: '奥林匹克森林公园',
            bookmarked: true,
            tags: ['运动', '跑步']
        },
        {
            id: Date.now() - 86400000 * 9,
            date: new Date(new Date().setHours(22, 30, 0, 0)).getTime() - 86400000 * 9,
            title: '读完《深度工作》',
            text: '花了两周读完了卡尔·纽波特的《深度工作》。书中提到的"深度工作"和"浅层工作"的区分让我重新审视自己的时间分配。\n\n决定每天留出 2 小时无打扰的深度工作时间：关闭通知、手机放远、专注一件事。从明天开始尝试。',
            mood: 'neutral',
            weather: 'rainy',
            photos: 0,
            location: '家',
            bookmarked: false,
            tags: ['阅读', '思考']
        }
    ];

    let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null') || {
        filter: 'all',
        sortOrder: 'desc', // 'desc' or 'asc'
        searchQuery: ''
    };

    let selectedEntryId = entries[0]?.id || null;
    let editing = false;
    let editingDraft = null;
    let showPromptPicker = false;
    let calendarOpen = false;
    let calendarMonth = new Date().getMonth();
    let calendarYear = new Date().getFullYear();

    function saveEntries() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getMood(id) {
        return MOODS.find(m => m.id === id) || MOODS[1];
    }
    function getWeather(id) {
        return WEATHERS.find(w => w.id === id) || WEATHERS[0];
    }

    function formatTime(d) {
        return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }

    function formatFullDate(ts) {
        const d = new Date(ts);
        const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        return `${d.getFullYear()} 年 ${d.getMonth()+1} 月 ${d.getDate()} 日 ${weekdays[d.getDay()]} · ${formatTime(d)}`;
    }

    function getFilteredEntries() {
        let list = [...entries];
        if (settings.filter === 'photo') list = list.filter(e => e.photos > 0);
        if (settings.filter === 'bookmark') list = list.filter(e => e.bookmarked);
        const q = settings.searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter(e => {
                const text = `${e.title} ${e.text} ${(e.tags || []).join(' ')}`.toLowerCase();
                return text.includes(q);
            });
        }
        list.sort((a, b) => settings.sortOrder === 'desc' ? b.date - a.date : a.date - b.date);
        return list;
    }

    function groupByDate(list) {
        const groups = {};
        list.forEach(e => {
            const d = new Date(e.date);
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (!groups[key]) groups[key] = { date: e.date, items: [] };
            groups[key].items.push(e);
        });
        return Object.values(groups).sort((a, b) => settings.sortOrder === 'desc' ? b.date - a.date : a.date - b.date);
    }

    function randomPrompt() {
        return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    }

    // ============ Calendar ============
    function renderCalendar() {
        const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === calendarYear && today.getMonth() === calendarMonth;
        const monthEntries = entries.filter(e => {
            const d = new Date(e.date);
            return d.getFullYear() === calendarYear && d.getMonth() === calendarMonth;
        });
        const entryDayMap = {};
        monthEntries.forEach(e => {
            entryDayMap[new Date(e.date).getDate()] = true;
        });

        const weekdays = ['日','一','二','三','四','五','六'];
        let html = `<div class="j-calendar">`;
        html += `<div class="j-cal-header">
            <button class="j-cal-nav" data-cal="prev"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
            <div class="j-cal-title">${calendarYear} 年 ${calendarMonth + 1} 月</div>
            <button class="j-cal-nav" data-cal="next"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
        </div>`;
        html += `<div class="j-cal-grid">`;
        weekdays.forEach(w => html += `<div class="j-cal-wk">${w}</div>`);
        for (let i = 0; i < firstDay; i++) html += `<div class="j-cal-day empty"></div>`;
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = isCurrentMonth && today.getDate() === d;
            const hasEntry = entryDayMap[d];
            html += `<div class="j-cal-day ${isToday ? 'today' : ''} ${hasEntry ? 'has-entry' : ''}" data-day="${d}">${d}${hasEntry ? '<span class="j-cal-dot"></span>' : ''}</div>`;
        }
        html += `</div></div>`;
        return html;
    }

    // ============ Render ============
    function render() {
        const filtered = getFilteredEntries();
        const groups = groupByDate(filtered);
        const current = entries.find(e => e.id === selectedEntryId);

        body.innerHTML = `
            <div class="journal-app">
                <aside class="journal-side">
                    <div class="journal-side-top">
                        <div class="journal-side-header">
                            <div>
                                <div class="journal-side-eyebrow">${new Date().getFullYear()} 年 ${new Date().getMonth() + 1} 月</div>
                                <h1 class="journal-side-title">日记</h1>
                            </div>
                            <button class="journal-icon-btn" id="journal-toggle-cal-${windowId}" title="日历">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                            </button>
                        </div>
                        <div class="journal-search">
                            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                            <input type="text" id="journal-search-${windowId}" placeholder="搜索日记" value="${escapeHtml(settings.searchQuery)}">
                            ${settings.searchQuery ? `<button class="journal-search-clear" id="journal-search-clear-${windowId}"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>` : ''}
                        </div>
                        ${calendarOpen ? renderCalendar() : ''}
                        <div class="journal-filters">
                            <button class="journal-filter-btn ${settings.filter === 'all' ? 'active' : ''}" data-filter="all">
                                全部
                                <span class="journal-filter-count">${entries.length}</span>
                            </button>
                            <button class="journal-filter-btn ${settings.filter === 'photo' ? 'active' : ''}" data-filter="photo">
                                照片
                                <span class="journal-filter-count">${entries.filter(e => e.photos > 0).length}</span>
                            </button>
                            <button class="journal-filter-btn ${settings.filter === 'bookmark' ? 'active' : ''}" data-filter="bookmark">
                                书签
                                <span class="journal-filter-count">${entries.filter(e => e.bookmarked).length}</span>
                            </button>
                        </div>
                    </div>
                    <div class="journal-entries">
                        ${groups.length === 0 ? `
                            <div class="journal-empty-list">
                                <div class="journal-empty-icon">
                                    <svg viewBox="0 0 64 64" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="14" width="44" height="42" rx="4"/><path d="M10 24h44M22 8v12M42 8v12M22 36h12M22 44h18"/></svg>
                                </div>
                                <div class="journal-empty-text">${settings.searchQuery ? '没有找到匹配的日记' : '还没有日记'}</div>
                                ${settings.searchQuery ? `<div class="journal-empty-sub">尝试其他关键词</div>` : `<div class="journal-empty-sub">点击右上角"新建日记"开始</div>`}
                            </div>
                        ` : groups.map(group => {
                            const gd = new Date(group.date);
                            const today = new Date();
                            const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                            const startYesterday = startToday - 86400000;
                            let label;
                            if (gd.getTime() >= startToday) label = '今天';
                            else if (gd.getTime() >= startYesterday) label = '昨天';
                            else label = `${gd.getMonth() + 1} 月 ${gd.getDate()} 日`;
                            return `
                                <div class="journal-group">
                                    <div class="journal-group-label">${label}</div>
                                    ${group.items.map(e => {
                                        const mood = getMood(e.mood);
                                        const weather = getWeather(e.weather);
                                        return `
                                            <div class="journal-card ${e.id === selectedEntryId ? 'active' : ''}" data-id="${e.id}">
                                                <div class="journal-card-mood" style="background:${mood.color}1a;color:${mood.color};">${mood.emoji}</div>
                                                <div class="journal-card-body">
                                                    <div class="journal-card-title">${escapeHtml(e.title)}</div>
                                                    <div class="journal-card-preview">${escapeHtml(e.text.replace(/\n/g, ' ').substring(0, 60))}${e.text.length > 60 ? '…' : ''}</div>
                                                    <div class="journal-card-meta">
                                                        <span>${formatTime(new Date(e.date))}</span>
                                                        ${e.weather ? `<span class="journal-card-weather">${weather.emoji}</span>` : ''}
                                                        ${e.photos > 0 ? `<span class="journal-card-photos"><svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg> ${e.photos}</span>` : ''}
                                                        ${e.bookmarked ? `<span class="journal-card-bm"><svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></span>` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="journal-side-bottom">
                        <button class="journal-new-btn" id="journal-new-${windowId}">
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                            新建日记
                        </button>
                    </div>
                </aside>
                <main class="journal-main">
                    ${current ? renderDetail(current) : `
                        <div class="journal-detail-empty">
                            <div class="journal-detail-empty-icon">
                                <svg viewBox="0 0 80 80" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M28 18c0-4 0-7 4-9 3-2 7-1 9 2 1 2 1 4 1 7"/><rect x="14" y="18" width="52" height="50" rx="6"/><path d="M14 32h52M26 46h12M26 56h22"/></svg>
                            </div>
                            <div class="journal-detail-empty-title">开始你的第一篇日记</div>
                            <div class="journal-detail-empty-sub">记录生活中的点滴瞬间</div>
                            <button class="journal-cta" id="journal-cta-new-${windowId}">写一篇日记</button>
                        </div>
                    `}
                </main>
            </div>
        `;

        bindEvents();
        if (editing) bindEditorEvents(current);
    }

    function renderDetail(entry) {
        if (editing && editingDraft) return renderEditor(entry);
        const mood = getMood(entry.mood);
        const weather = getWeather(entry.weather);
        const wordCount = entry.text.length;

        return `
            <div class="journal-detail">
                <div class="journal-detail-toolbar">
                    <div class="journal-detail-toolbar-left">
                        <button class="journal-icon-btn" id="journal-edit-${windowId}" title="编辑">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="journal-icon-btn" id="journal-bookmark-${windowId}" title="${entry.bookmarked ? '取消书签' : '添加书签'}" data-active="${entry.bookmarked}">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="${entry.bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        </button>
                    </div>
                    <div class="journal-detail-toolbar-right">
                        <button class="journal-icon-btn" id="journal-prompt-${windowId}" title="反思提示">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/><circle cx="12" cy="12" r="10"/></svg>
                        </button>
                        <button class="journal-icon-btn" id="journal-share-${windowId}" title="分享">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
                        </button>
                        <button class="journal-icon-btn danger" id="journal-delete-${windowId}" title="删除">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
                <div class="journal-detail-scroll">
                    <article class="journal-article">
                        <div class="journal-article-date">${formatFullDate(entry.date)}</div>
                        <h1 class="journal-article-title">${escapeHtml(entry.title)}</h1>
                        <div class="journal-article-meta">
                            <span class="journal-mood-pill" style="background:${mood.color}1a;color:${mood.color};">${mood.emoji} ${mood.label}</span>
                            ${entry.weather ? `<span class="journal-meta-item">${weather.emoji} ${weather.label}</span>` : ''}
                            ${entry.location ? `<span class="journal-meta-item"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${escapeHtml(entry.location)}</span>` : ''}
                        </div>
                        ${entry.tags && entry.tags.length ? `
                            <div class="journal-article-tags">
                                ${entry.tags.map(t => `<span class="journal-tag">#${escapeHtml(t)}</span>`).join('')}
                            </div>
                        ` : ''}
                        <div class="journal-article-body">
                            ${entry.text.split('\n').filter(p => p.trim() !== '').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
                        </div>
                        ${entry.photos > 0 ? `
                            <div class="journal-article-photos">
                                <div class="journal-photos-label">${entry.photos} 张照片</div>
                                <div class="journal-photo-grid">
                                    ${Array(entry.photos).fill(0).map((_, i) => {
                                        const hue = (i * 47 + entry.id % 360) % 360;
                                        return `<div class="journal-photo" style="background:linear-gradient(135deg, hsl(${hue}, 65%, 70%), hsl(${(hue + 30) % 360}, 70%, 55%));" title="照片 ${i + 1}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>`;
                                    }).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </article>
                </div>
                <div class="journal-detail-footer">
                    <span>${wordCount} 字</span>
                    ${entry.bookmarked ? '<span class="journal-footer-bm"><svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> 已加书签</span>' : ''}
                </div>
            </div>
        `;
    }

    function renderEditor(entry) {
        const d = editingDraft;
        return `
            <div class="journal-editor">
                <div class="journal-detail-toolbar">
                    <div class="journal-detail-toolbar-left">
                        <button class="journal-icon-btn" id="journal-cancel-edit-${windowId}" title="取消">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="journal-detail-toolbar-right">
                        <button class="journal-save-btn" id="journal-save-${windowId}">完成</button>
                    </div>
                </div>
                <div class="journal-editor-scroll">
                    <div class="journal-editor-form">
                        <input type="text" class="journal-edit-title" id="journal-edit-title-${windowId}" placeholder="标题" value="${escapeHtml(d.title)}">
                        <div class="journal-edit-meta">
                            <div class="journal-edit-meta-row">
                                <label>心情</label>
                                <div class="journal-mood-picker">
                                    ${MOODS.map(m => `
                                        <button class="journal-mood-opt ${d.mood === m.id ? 'active' : ''}" data-mood="${m.id}" style="${d.mood === m.id ? `background:${m.color}1a;border-color:${m.color}40;color:${m.color};` : ''}" title="${m.label}">
                                            <span>${m.emoji}</span>
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="journal-edit-meta-row">
                                <label>天气</label>
                                <div class="journal-weather-picker">
                                    ${WEATHERS.map(w => `
                                        <button class="journal-weather-opt ${d.weather === w.id ? 'active' : ''}" data-weather="${w.id}" title="${w.label}">
                                            <span>${w.emoji}</span>
                                            <span class="journal-weather-label">${w.label}</span>
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="journal-edit-meta-row">
                                <label>位置</label>
                                <input type="text" class="journal-edit-location" id="journal-edit-location-${windowId}" placeholder="添加位置" value="${escapeHtml(d.location || '')}">
                            </div>
                            <div class="journal-edit-meta-row">
                                <label>标签</label>
                                <input type="text" class="journal-edit-tags" id="journal-edit-tags-${windowId}" placeholder="用逗号分隔，例如：工作, 阅读" value="${escapeHtml((d.tags || []).join(', '))}">
                            </div>
                        </div>
                        ${showPromptPicker ? `
                            <div class="journal-prompts">
                                <div class="journal-prompts-label">反思提示</div>
                                <div class="journal-prompts-list">
                                    ${PROMPTS.map(p => `
                                        <button class="journal-prompt-item" data-prompt="${escapeHtml(p)}">${escapeHtml(p)}</button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <textarea class="journal-edit-text" id="journal-edit-text-${windowId}" placeholder="开始写今天的日记..." rows="20">${escapeHtml(d.text)}</textarea>
                        <div class="journal-edit-toolbar">
                            <button class="journal-edit-tool-btn" id="journal-insert-prompt-${windowId}">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/><circle cx="12" cy="12" r="10"/></svg>
                                ${showPromptPicker ? '隐藏提示' : '显示反思提示'}
                            </button>
                            <button class="journal-edit-tool-btn" id="journal-insert-date-${windowId}">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                                插入日期
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ============ Event binding ============
    function bindEvents() {
        body.querySelectorAll('.journal-card').forEach(card => {
            card.addEventListener('click', () => {
                selectedEntryId = parseInt(card.dataset.id);
                editing = false;
                render();
            });
        });

        body.querySelectorAll('.journal-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                settings.filter = btn.dataset.filter;
                saveSettings();
                render();
            });
        });

        const searchInput = body.querySelector(`#journal-search-${windowId}`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                settings.searchQuery = e.target.value;
                saveSettings();
                // Re-render the list only by re-rendering whole
                render();
                const s = body.querySelector(`#journal-search-${windowId}`);
                if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
            });
        }
        const clearSearch = body.querySelector(`#journal-search-clear-${windowId}`);
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                settings.searchQuery = '';
                saveSettings();
                render();
            });
        }

        const toggleCal = body.querySelector(`#journal-toggle-cal-${windowId}`);
        if (toggleCal) {
            toggleCal.addEventListener('click', () => {
                calendarOpen = !calendarOpen;
                render();
            });
        }

        body.querySelectorAll('.j-cal-nav').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.cal === 'prev') {
                    calendarMonth--;
                    if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
                } else {
                    calendarMonth++;
                    if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
                }
                render();
            });
        });

        body.querySelectorAll('.j-cal-day[data-day]').forEach(day => {
            day.addEventListener('click', () => {
                const dayNum = parseInt(day.dataset.day);
                const target = new Date(calendarYear, calendarMonth, dayNum);
                const match = entries.find(e => {
                    const d = new Date(e.date);
                    return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth() && d.getDate() === target.getDate();
                });
                if (match) {
                    selectedEntryId = match.id;
                    calendarOpen = false;
                    render();
                }
            });
        });

        const newBtn = body.querySelector(`#journal-new-${windowId}`);
        if (newBtn) newBtn.addEventListener('click', createNewEntry);
        const ctaBtn = body.querySelector(`#journal-cta-new-${windowId}`);
        if (ctaBtn) ctaBtn.addEventListener('click', createNewEntry);

        const editBtn = body.querySelector(`#journal-edit-${windowId}`);
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const entry = entries.find(e => e.id === selectedEntryId);
                if (!entry) return;
                editingDraft = JSON.parse(JSON.stringify(entry));
                editing = true;
                render();
            });
        }

        const bmBtn = body.querySelector(`#journal-bookmark-${windowId}`);
        if (bmBtn) {
            bmBtn.addEventListener('click', () => {
                const entry = entries.find(e => e.id === selectedEntryId);
                if (!entry) return;
                entry.bookmarked = !entry.bookmarked;
                saveEntries();
                if (window.toast) window.toast(entry.bookmarked ? '已添加书签' : '已取消书签', 'success');
                render();
            });
        }

        const delBtn = body.querySelector(`#journal-delete-${windowId}`);
        if (delBtn) {
            delBtn.addEventListener('click', async () => {
                const entry = entries.find(e => e.id === selectedEntryId);
                if (!entry) return;
                const ok = await window.showConfirm(`确定要删除"${entry.title}"吗？`, {
                    subtitle: '此操作无法撤销。',
                    danger: true,
                    confirmText: '删除'
                });
                if (!ok) return;
                const idx = entries.findIndex(e => e.id === selectedEntryId);
                entries.splice(idx, 1);
                saveEntries();
                selectedEntryId = entries[0]?.id || null;
                if (window.toast) window.toast('日记已删除', 'success');
                render();
            });
        }

        const shareBtn = body.querySelector(`#journal-share-${windowId}`);
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const entry = entries.find(e => e.id === selectedEntryId);
                if (!entry) return;
                if (window.toast) window.toast('已复制到剪贴板（演示）', 'info');
            });
        }

        const promptBtn = body.querySelector(`#journal-prompt-${windowId}`);
        if (promptBtn) {
            promptBtn.addEventListener('click', () => {
                if (window.toast) window.toast(randomPrompt(), 'info', 4000);
            });
        }
    }

    function bindEditorEvents(entry) {
        const cancelBtn = body.querySelector(`#journal-cancel-edit-${windowId}`);
        if (cancelBtn) {
            cancelBtn.addEventListener('click', async () => {
                const orig = entries.find(e => e.id === selectedEntryId);
                if (orig && (orig.title !== editingDraft.title || orig.text !== editingDraft.text)) {
                    const ok = await window.showConfirm('放弃此次更改？', {
                        subtitle: '尚未保存的修改将丢失。',
                        danger: true,
                        confirmText: '放弃'
                    });
                    if (!ok) return;
                }
                editing = false;
                editingDraft = null;
                render();
            });
        }

        const titleEl = body.querySelector(`#journal-edit-title-${windowId}`);
        if (titleEl) {
            titleEl.addEventListener('input', () => { editingDraft.title = titleEl.value; });
        }
        const textEl = body.querySelector(`#journal-edit-text-${windowId}`);
        if (textEl) {
            textEl.addEventListener('input', () => { editingDraft.text = textEl.value; });
        }
        const locEl = body.querySelector(`#journal-edit-location-${windowId}`);
        if (locEl) {
            locEl.addEventListener('input', () => { editingDraft.location = locEl.value; });
        }
        const tagEl = body.querySelector(`#journal-edit-tags-${windowId}`);
        if (tagEl) {
            tagEl.addEventListener('input', () => {
                editingDraft.tags = tagEl.value.split(',').map(t => t.trim()).filter(Boolean);
            });
        }

        body.querySelectorAll('.journal-mood-opt').forEach(b => {
            b.addEventListener('click', () => {
                editingDraft.mood = b.dataset.mood;
                render();
                const t = body.querySelector(`#journal-edit-text-${windowId}`);
                if (t) t.focus();
            });
        });

        body.querySelectorAll('.journal-weather-opt').forEach(b => {
            b.addEventListener('click', () => {
                editingDraft.weather = b.dataset.weather;
                render();
                const t = body.querySelector(`#journal-edit-text-${windowId}`);
                if (t) t.focus();
            });
        });

        body.querySelectorAll('.journal-prompt-item').forEach(p => {
            p.addEventListener('click', () => {
                const text = p.dataset.prompt;
                const textEl = body.querySelector(`#journal-edit-text-${windowId}`);
                if (textEl) {
                    const cur = textEl.value;
                    const add = (cur && !cur.endsWith('\n') ? '\n\n' : (cur ? '\n' : '')) + text + '\n';
                    textEl.value = cur + add;
                    editingDraft.text = textEl.value;
                    textEl.focus();
                    textEl.setSelectionRange(textEl.value.length, textEl.value.length);
                }
            });
        });

        const insertPromptBtn = body.querySelector(`#journal-insert-prompt-${windowId}`);
        if (insertPromptBtn) {
            insertPromptBtn.addEventListener('click', () => {
                showPromptPicker = !showPromptPicker;
                render();
                const t = body.querySelector(`#journal-edit-text-${windowId}`);
                if (t) t.focus();
            });
        }

        const insertDateBtn = body.querySelector(`#journal-insert-date-${windowId}`);
        if (insertDateBtn) {
            insertDateBtn.addEventListener('click', () => {
                const now = new Date();
                const w = ['周日','周一','周二','周三','周四','周五','周六'][now.getDay()];
                const dateStr = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${w} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
                const textEl = body.querySelector(`#journal-edit-text-${windowId}`);
                if (textEl) {
                    const cur = textEl.value;
                    const add = (cur && !cur.endsWith('\n') ? '\n\n' : (cur ? '\n' : '')) + `📅 ${dateStr}\n`;
                    textEl.value = cur + add;
                    editingDraft.text = textEl.value;
                    textEl.focus();
                    textEl.setSelectionRange(textEl.value.length, textEl.value.length);
                }
            });
        }

        const saveBtn = body.querySelector(`#journal-save-${windowId}`);
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const orig = entries.find(e => e.id === selectedEntryId);
                if (!orig) return;
                Object.assign(orig, editingDraft);
                orig.date = orig.date; // keep
                saveEntries();
                editing = false;
                editingDraft = null;
                if (window.toast) window.toast('已保存', 'success');
                render();
            });
        }
    }

    function createNewEntry() {
        const now = Date.now();
        const newEntry = {
            id: now,
            date: now,
            title: '',
            text: '',
            mood: 'good',
            weather: 'sunny',
            photos: 0,
            location: '',
            bookmarked: false,
            tags: []
        };
        entries.unshift(newEntry);
        selectedEntryId = newEntry.id;
        editingDraft = JSON.parse(JSON.stringify(newEntry));
        editing = true;
        showPromptPicker = false;
        saveEntries();
        render();
        setTimeout(() => {
            const t = body.querySelector(`#journal-edit-title-${windowId}`);
            if (t) t.focus();
        }, 50);
    }

    render();
};
