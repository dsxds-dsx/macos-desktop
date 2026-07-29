window.renderWeather = function(body, sidebar, toolbar, windowId) {
    let currentCityIndex = 0;
    let activeDetail = null;

    const cities = [
        {
            name: '北京', region: '中国',
            temp: 12, condition: '晴', high: 18, low: 5,
            icon: '☀️', gradient: 'linear-gradient(180deg, #2563eb, #1e40af)',
            feels: 10, humidity: 35, wind: 12, windDir: '西北', vis: 15, uv: 6, uvLevel: '高',
            pressure: 1024, dew: -3, sunrise: '07:18', sunset: '17:42'
        },
        {
            name: '上海', region: '中国',
            temp: 18, condition: '多云', high: 22, low: 14,
            icon: '⛅', gradient: 'linear-gradient(180deg, #64748b, #475569)',
            feels: 17, humidity: 72, wind: 8, windDir: '东', vis: 8, uv: 3, uvLevel: '中等',
            pressure: 1018, dew: 13, sunrise: '06:42', sunset: '17:25'
        },
        {
            name: '广州', region: '中国',
            temp: 25, condition: '小雨', high: 28, low: 22,
            icon: '🌧️', gradient: 'linear-gradient(180deg, #475569, #334155)',
            feels: 27, humidity: 88, wind: 6, windDir: '南', vis: 5, uv: 2, uvLevel: '低',
            pressure: 1012, dew: 22, sunrise: '06:30', sunset: '18:10'
        },
        {
            name: '深圳', region: '中国',
            temp: 27, condition: '晴', high: 30, low: 24,
            icon: '☀️', gradient: 'linear-gradient(180deg, #0ea5e9, #0284c7)',
            feels: 30, humidity: 70, wind: 10, windDir: '东南', vis: 12, uv: 9, uvLevel: '极高',
            pressure: 1015, dew: 21, sunrise: '06:25', sunset: '18:15'
        }
    ];

    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

    function generateForecast(city) {
        const today = new Date();
        const days = [];
        const conditions = ['晴', '多云', '阴', '小雨', '中雨'];
        const icons = ['☀️', '⛅', '☁️', '🌧️', '🌧️'];
        for (let i = 0; i < 10; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            const cIdx = (i + city.temp) % conditions.length;
            const variance = i === 0 ? 0 : Math.round((Math.sin(i * 1.2) * 4));
            days.push({
                day: i === 0 ? '今天' : (i === 1 ? '明天' : `周${dayNames[d.getDay()]}`),
                date: `${d.getMonth() + 1}月${d.getDate()}日`,
                icon: i === 0 ? city.icon : icons[cIdx],
                condition: i === 0 ? city.condition : conditions[cIdx],
                high: city.high + variance,
                low: city.low + variance - 2,
                rainChance: cIdx >= 3 ? Math.floor(60 + Math.random() * 30) : Math.floor(Math.random() * 20)
            });
        }
        return days;
    }

    function generateHours(city) {
        const hours = [];
        const now = new Date();
        for (let i = 0; i < 24; i++) {
            const h = (now.getHours() + i) % 24;
            const temp = city.temp + Math.round(Math.sin((i - 6) * 0.3) * 4);
            let icon = '☀️';
            if (h >= 19 || h < 6) icon = '🌙';
            else if (h >= 6 && h < 9) icon = '🌅';
            else if (h >= 16 && h < 19) icon = '🌇';
            else if (city.condition.includes('雨')) icon = '🌧️';
            else if (city.condition.includes('云')) icon = '⛅';
            hours.push({
                time: i === 0 ? '现在' : `${String(h).padStart(2, '0')}:00`,
                temp: temp,
                icon: icon,
                rainChance: city.condition.includes('雨') ? Math.floor(50 + Math.random() * 40) : Math.floor(Math.random() * 15)
            });
        }
        return hours;
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="weather-sidebar">
                <input type="text" class="weather-search" placeholder="搜索城市或机场" />
                <div class="weather-city-list">
                    ${cities.map((city, i) => `
                        <div class="weather-city-card ${currentCityIndex === i ? 'active' : ''}" data-index="${i}" style="background:${city.gradient};">
                            <div class="weather-city-info">
                                <div class="weather-city-name">${city.name}</div>
                                <div class="weather-city-time">${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}</div>
                            </div>
                            <div class="weather-city-temp">${city.temp}°</div>
                            <div class="weather-city-cond">
                                <span>${city.icon}</span>
                                <span>${city.condition}</span>
                            </div>
                            <div class="weather-city-hilo">↑${city.high}° ↓${city.low}°</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sidebar.querySelectorAll('[data-index]').forEach(item => {
            item.addEventListener('click', () => {
                currentCityIndex = parseInt(item.dataset.index);
                activeDetail = null;
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div class="weather-toolbar">
                <button class="weather-tool-btn" title="添加位置">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                </button>
                <button class="weather-tool-btn" title="图层">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M7 1L1 4l6 3 6-3z"/><path d="M1 7l6 3 6-3M1 10l6 3 6-3"/></svg>
                </button>
                <div style="flex:1;"></div>
                <span class="weather-tool-label">${cities[currentCityIndex].name}</span>
            </div>
        `;
    }

    function renderContent() {
        const city = cities[currentCityIndex];
        const hours = generateHours(city);
        const forecast = generateForecast(city);
        const tempRange = Math.max(1, ...forecast.map(d => d.high)) - Math.min(...forecast.map(d => d.low));

        body.innerHTML = `
            <div class="weather-body" style="background:${city.gradient};">
                <div class="weather-main">
                    <div class="weather-city-name">${city.name}</div>
                    <div class="weather-temp">${city.temp}°</div>
                    <div class="weather-cond-row">
                        <span class="weather-icon">${city.icon}</span>
                        <span class="weather-cond-text">${city.condition}</span>
                    </div>
                    <div class="weather-hilo">↑${city.high}°　↓${city.low}°</div>
                    <div class="weather-feels">体感 ${city.feels}° · 湿度 ${city.humidity}% · ${city.windDir}风 ${city.wind} km/h</div>
                    <div class="weather-summary">今天：${city.condition}为主，最高气温 ${city.high}°，最低 ${city.low}°。${city.condition.includes('雨') ? '出门请带伞。' : '空气清新舒适。'}</div>
                </div>

                <div class="weather-card weather-hourly-card">
                    <div class="weather-card-header">
                        <span>每小时预报</span>
                    </div>
                    <div class="weather-hours-scroll">
                        ${hours.slice(0, 24).map((h, i) => `
                            <div class="weather-hour-item">
                                <div class="weather-hour-time">${h.time}</div>
                                <div class="weather-hour-icon">${h.icon}</div>
                                <div class="weather-hour-rain" style="${h.rainChance < 20 ? 'visibility:hidden;' : ''}">${h.rainChance}%</div>
                                <div class="weather-hour-temp">${h.temp}°</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="weather-card weather-daily-card">
                    <div class="weather-card-header">
                        <span>${city.name}的 10 天预报</span>
                    </div>
                    <div class="weather-daily-list">
                        ${forecast.map((d, i) => {
                            const lowPos = ((d.low - Math.min(...forecast.map(x => x.low))) / tempRange) * 100;
                            const highPos = ((d.high - Math.min(...forecast.map(x => x.low))) / tempRange) * 100;
                            return `
                                <div class="weather-day-row">
                                    <div class="weather-day-name">${d.day}</div>
                                    <div class="weather-day-icon">${d.icon}</div>
                                    <div class="weather-day-rain" style="${d.rainChance < 20 ? 'visibility:hidden;' : ''}">${d.rainChance}%</div>
                                    <div class="weather-day-low">${d.low}°</div>
                                    <div class="weather-day-bar">
                                        <div class="weather-day-bar-track" style="left:${lowPos}%;width:${highPos - lowPos}%;background:${getTempGradient((d.high + d.low) / 2)};"></div>
                                    </div>
                                    <div class="weather-day-high">${d.high}°</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="weather-detail-grid">
                    ${renderDetailCard('紫外线指数', city.uv, city.uvLevel, 'uv')}
                    ${renderDetailCard('日落', city.sunset, `日出 ${city.sunrise}`, 'sun')}
                    ${renderDetailCard('风速', `${city.wind} km/h`, `${city.windDir}风`, 'wind')}
                    ${renderDetailCard('湿度', `${city.humidity}%`, '露点 ' + city.dew + '°', 'humidity')}
                    ${renderDetailCard('能见度', `${city.vis} km`, '良好', 'vis')}
                    ${renderDetailCard('气压', `${city.pressure} hPa`, '稳定', 'pressure')}
                </div>

                <div class="weather-footer">天气数据为模拟 · ${new Date().toLocaleString('zh-CN')}</div>
            </div>
        `;
    }

    function getTempGradient(t) {
        if (t < 0) return 'linear-gradient(90deg, #5ac8fa, #0a84ff)';
        if (t < 10) return 'linear-gradient(90deg, #0a84ff, #5ac8fa)';
        if (t < 20) return 'linear-gradient(90deg, #5ac8fa, #30d158)';
        if (t < 28) return 'linear-gradient(90deg, #30d158, #ffcc00)';
        return 'linear-gradient(90deg, #ffcc00, #ff9500, #ff3b30)';
    }

    function renderDetailCard(label, value, sub, key) {
        const icons = {
            uv: '☀️', sun: '🌅', wind: '💨', humidity: '💧', vis: '👁️', pressure: '🌡️'
        };
        return `
            <div class="weather-card weather-detail-card" data-detail="${key}">
                <div class="weather-detail-label">${label}</div>
                <div class="weather-detail-value">${value}</div>
                <div class="weather-detail-sub">${icons[key]} ${sub}</div>
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.background = cities[currentCityIndex].gradient;
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    render();
};
