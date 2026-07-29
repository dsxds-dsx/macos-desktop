window.renderClock = function(body, sidebar, toolbar, windowId) {
    let updateInterval = null;
    let currentTab = 'world';

    // Stopwatch state
    let swStartTime = 0;
    let swElapsed = 0;
    let swRunning = false;
    let swLaps = [];

    // Timer state
    let timerDuration = 0;
    let timerRemaining = 0;
    let timerRunning = false;
    let timerEnd = 0;

    const cities = [
        { name: '库比蒂诺', timezone: 'America/Los_Angeles', offset: -7 },
        { name: '纽约', timezone: 'America/New_York', offset: -4 },
        { name: '伦敦', timezone: 'Europe/London', offset: 1 },
        { name: '巴黎', timezone: 'Europe/Paris', offset: 2 },
        { name: '东京', timezone: 'Asia/Tokyo', offset: 9 },
        { name: '北京', timezone: 'Asia/Shanghai', offset: 8 },
        { name: '悉尼', timezone: 'Australia/Sydney', offset: 11 }
    ];

    function pad(n) { return String(n).padStart(2, '0'); }

    function getCityTime(offset) {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        return new Date(utc + offset * 60 * 60 * 1000);
    }

    function formatSwTime(ms) {
        const totalSec = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSec / 60);
        const seconds = totalSec % 60;
        const centi = Math.floor((ms % 1000) / 10);
        return `${pad(minutes)}:${pad(seconds)}.${pad(centi)}`;
    }

    function formatTimerTime(ms) {
        const totalSec = Math.max(0, Math.ceil(ms / 1000));
        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;
        if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        return `${pad(minutes)}:${pad(seconds)}`;
    }

    function getElapsed() {
        if (!swRunning) return swElapsed;
        return swElapsed + (Date.now() - swStartTime);
    }

    function getTimerRemaining() {
        if (!timerRunning) return timerRemaining;
        return Math.max(0, timerEnd - Date.now());
    }

    function renderToolbar() {
        if (!toolbar) return;
        const tabs = [
            { id: 'world', label: '世界时钟', icon: '<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="7" cy="7" r="5.5"/><path d="M7 3v4l2.5 1.5"/></svg>' },
            { id: 'alarm', label: '闹钟', icon: '<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M7 4v3l2 1.5"/><circle cx="7" cy="7" r="5.5"/><path d="M3 1.5L1.5 3M11 1.5L12.5 3"/></svg>' },
            { id: 'stopwatch', label: '秒表', icon: '<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="7" cy="8" r="5"/><path d="M7 8l2-2M5 1h4M7 1v2"/></svg>' },
            { id: 'timer', label: '计时器', icon: '<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M7 1v3M5 2h4M7 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM7 7l2.5 1.5"/></svg>' }
        ];
        toolbar.innerHTML = `
            <div class="clock-toolbar">
                <div class="clock-tab-group">
                    ${tabs.map(t => `
                        <button class="clock-tab-btn ${currentTab === t.id ? 'active' : ''}" data-tab="${t.id}">
                            ${t.icon}
                            <span>${t.label}</span>
                        </button>
                    `).join('')}
                </div>
                <div style="flex:1;"></div>
                <button class="clock-tab-btn" id="clock-add-btn" title="添加">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                </button>
            </div>
        `;
        toolbar.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentTab = btn.dataset.tab;
                render();
            });
        });
    }

    function renderWorld() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const hourDeg = (hours % 12) * 30 + minutes * 0.5;
        const minuteDeg = minutes * 6 + seconds * 0.1;
        const secondDeg = seconds * 6;

        return `
            <div class="clock-world">
                <div class="clock-local">
                    <div class="clock-analog">
                        <div class="clock-tick-marks">${Array.from({length: 12}, (_, i) => `<div class="clock-tick" style="transform:rotate(${i * 30}deg)"></div>`).join('')}</div>
                        <div class="clock-hand clock-hour" style="transform:rotate(${hourDeg}deg);"></div>
                        <div class="clock-hand clock-minute" style="transform:rotate(${minuteDeg}deg);"></div>
                        <div class="clock-hand clock-second" style="transform:rotate(${secondDeg}deg);"></div>
                        <div class="clock-center"></div>
                    </div>
                    <div class="clock-local-info">
                        <div class="clock-local-city">本地</div>
                        <div class="clock-digital">${pad(hours)}:${pad(minutes)}:${pad(seconds)}</div>
                        <div class="clock-date">${now.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                    </div>
                </div>
                <div class="clock-cities">
                    ${cities.map(city => {
                        const cityTime = getCityTime(city.offset);
                        const cH = cityTime.getHours();
                        const cM = cityTime.getMinutes();
                        const dayDiff = cH - hours;
                        let offsetLabel = '';
                        if (dayDiff > 12) offsetLabel = '前一天';
                        else if (dayDiff < -12) offsetLabel = '后一天';
                        return `
                            <div class="clock-city-card">
                                <div class="clock-city-info">
                                    <div class="clock-city-name">${city.name}</div>
                                    <div class="clock-city-offset">${offsetLabel || (city.offset >= 0 ? '+' : '') + city.offset + '小时'}</div>
                                </div>
                                <div class="clock-city-time">${pad(cH)}:${pad(cM)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderAlarm() {
        return `
            <div class="clock-empty">
                <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4">
                    <circle cx="32" cy="34" r="22"/>
                    <path d="M32 24v10l7 4"/>
                    <path d="M14 16L10 12M50 16l4-4M32 12v-2M20 12a8 8 0 0 1 12-2M44 12a8 8 0 0 0-12-2"/>
                </svg>
                <div class="clock-empty-title">无闹钟</div>
                <div class="clock-empty-sub">点击 + 添加闹钟</div>
            </div>
        `;
    }

    function renderStopwatch() {
        const elapsed = getElapsed();
        return `
            <div class="clock-stopwatch">
                <div class="clock-stopwatch-display">${formatSwTime(elapsed)}</div>
                <div class="clock-stopwatch-controls">
                    <button class="clock-sw-btn ${swRunning ? 'pause' : 'start'}" id="sw-toggle">
                        ${swRunning ? '停止' : '启动'}
                    </button>
                    <button class="clock-sw-btn reset" id="sw-lap">${swRunning ? '计次' : '复位'}</button>
                </div>
                ${swLaps.length > 0 ? `
                    <div class="clock-laps">
                        ${swLaps.map((lap, i) => `
                            <div class="clock-lap">
                                <span class="clock-lap-num">次 ${swLaps.length - i}</span>
                                <span class="clock-lap-time">${formatSwTime(lap)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    function renderTimer() {
        const remaining = getTimerRemaining();
        const presets = [60, 300, 600, 900, 1800];
        return `
            <div class="clock-stopwatch">
                <div class="clock-stopwatch-display">${formatTimerTime(remaining)}</div>
                <div class="clock-timer-presets">
                    ${presets.map(p => `
                        <button class="clock-timer-preset ${timerDuration === p * 1000 ? 'active' : ''}" data-preset="${p}">${p < 60 ? p + '秒' : (p/60) + '分钟'}</button>
                    `).join('')}
                </div>
                <div class="clock-stopwatch-controls">
                    <button class="clock-sw-btn ${timerRunning ? 'pause' : (timerRemaining > 0 ? 'start' : 'start disabled')}" id="timer-toggle" ${timerRemaining <= 0 && !timerRunning ? 'disabled' : ''}>
                        ${timerRunning ? '暂停' : '开始'}
                    </button>
                    <button class="clock-sw-btn reset" id="timer-reset">复位</button>
                </div>
            </div>
        `;
    }

    function renderContent() {
        let content = '';
        if (currentTab === 'world') content = renderWorld();
        else if (currentTab === 'alarm') content = renderAlarm();
        else if (currentTab === 'stopwatch') content = renderStopwatch();
        else content = renderTimer();

        body.innerHTML = `
            <div class="clock-body">
                ${content}
            </div>
        `;

        // Stopwatch handlers
        const swToggle = body.querySelector('#sw-toggle');
        if (swToggle) {
            swToggle.addEventListener('click', () => {
                if (swRunning) {
                    swElapsed += Date.now() - swStartTime;
                    swRunning = false;
                } else {
                    swStartTime = Date.now();
                    swRunning = true;
                }
                render();
            });
        }
        const swLap = body.querySelector('#sw-lap');
        if (swLap) {
            swLap.addEventListener('click', () => {
                if (swRunning) {
                    swLaps.unshift(getElapsed());
                } else {
                    swElapsed = 0;
                    swLaps = [];
                }
                render();
            });
        }

        // Timer handlers
        const timerToggle = body.querySelector('#timer-toggle');
        if (timerToggle) {
            timerToggle.addEventListener('click', () => {
                if (timerRemaining <= 0 && !timerRunning) return;
                if (timerRunning) {
                    timerRemaining = getTimerRemaining();
                    timerRunning = false;
                } else {
                    timerEnd = Date.now() + timerRemaining;
                    timerRunning = true;
                }
                render();
            });
        }
        const timerReset = body.querySelector('#timer-reset');
        if (timerReset) {
            timerReset.addEventListener('click', () => {
                timerRunning = false;
                timerRemaining = 0;
                timerDuration = 0;
                render();
            });
        }
        body.querySelectorAll('[data-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (timerRunning) return;
                const secs = parseInt(btn.dataset.preset);
                timerDuration = secs * 1000;
                timerRemaining = timerDuration;
                render();
            });
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        renderToolbar();
        renderContent();
    }

    updateInterval = setInterval(() => {
        if (currentTab === 'world' || currentTab === 'stopwatch' || currentTab === 'timer') {
            renderContent();
        }
    }, 1000);
    // Faster update for smooth stopwatch
    const fastInterval = setInterval(() => {
        if ((swRunning || timerRunning) && (currentTab === 'stopwatch' || currentTab === 'timer')) {
            renderContent();
        }
    }, 50);

    render();

    return () => {
        if (updateInterval) clearInterval(updateInterval);
        if (fastInterval) clearInterval(fastInterval);
    };
};
