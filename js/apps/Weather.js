window.renderWeather = function(body, sidebar, toolbar, windowId) {
    let currentCityIndex = 0;
    const cities = [
        { name: '北京', temp: 12, condition: '晴', high: 18, low: 5, icon: '☀️', gradient: 'linear-gradient(180deg, #2563eb, #1e40af)' },
        { name: '上海', temp: 18, condition: '多云', high: 22, low: 14, icon: '⛅', gradient: 'linear-gradient(180deg, #64748b, #475569)' },
        { name: '广州', temp: 25, condition: '小雨', high: 28, low: 22, icon: '🌧️', gradient: 'linear-gradient(180deg, #475569, #334155)' },
        { name: '深圳', temp: 27, condition: '晴', high: 30, low: 24, icon: '☀️', gradient: 'linear-gradient(180deg, #0ea5e9, #0284c7)' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:200px;height:100%;background:rgba(0,0,0,0.3);padding:16px;overflow-y:auto;">
                <input type="text" placeholder="搜索城市" style="width:100%;padding:8px 12px;background:rgba(255,255,255,0.2);border:none;border-radius:8px;font-size:13px;color:#fff;outline:none;margin-bottom:16px;">
                ${cities.map((city, i) => `
                    <div data-index="${i}" style="padding:12px;border-radius:10px;cursor:pointer;margin-bottom:8px;background:${currentCityIndex === i ? 'rgba(255,255,255,0.2)' : 'transparent'};">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <div style="font-weight:600;color:#fff;">${city.name}</div>
                                <div style="font-size:12px;color:rgba(255,255,255,0.7);">${city.condition}</div>
                            </div>
                            <div style="font-size:24px;font-weight:200;color:#fff;">${city.temp}°</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        sidebar.querySelectorAll('[data-index]').forEach(item => {
            item.addEventListener('click', () => {
                currentCityIndex = parseInt(item.dataset.index);
                render();
            });
        });
    }

    function renderContent() {
        const city = cities[currentCityIndex];
        const hours = [];
        for (let i = 0; i < 12; i++) {
            const hour = (new Date().getHours() + i) % 24;
            const temp = city.temp + Math.round(Math.sin(i * 0.5) * 4);
            hours.push({
                time: i === 0 ? '现在' : `${hour}:00`,
                temp: temp,
                icon: i > 4 && i < 9 ? '☀️' : i >= 9 && i < 18 ? '⛅' : '🌙'
            });
        }

        body.innerHTML = `
            <div class="weather-body" style="background:${city.gradient};">
                <div class="weather-city">${city.name}</div>
                <div class="weather-temp">${city.temp}°</div>
                <div class="weather-condition">${city.icon} ${city.condition}</div>
                <div class="weather-hilo">最高 ${city.high}° · 最低 ${city.low}°</div>
                
                <div class="weather-hours">
                    ${hours.map(h => `
                        <div class="weather-hour">
                            <div class="weather-hour-time">${h.time}</div>
                            <div class="weather-hour-icon">${h.icon}</div>
                            <div class="weather-hour-temp">${h.temp}°</div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top:24px;display:grid;grid-template-columns:repeat(2,1fr);gap:16px;">
                    <div style="background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;backdrop-filter:blur(10px);">
                        <div style="font-size:12px;opacity:0.8;margin-bottom:8px;">紫外线指数</div>
                        <div style="font-size:24px;font-weight:600;">3</div>
                        <div style="font-size:12px;opacity:0.7;">中等</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;backdrop-filter:blur(10px);">
                        <div style="font-size:12px;opacity:0.8;margin-bottom:8px;">湿度</div>
                        <div style="font-size:24px;font-weight:600;">65%</div>
                        <div style="font-size:12px;opacity:0.7;">舒适</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;backdrop-filter:blur(10px);">
                        <div style="font-size:12px;opacity:0.8;margin-bottom:8px;">风速</div>
                        <div style="font-size:24px;font-weight:600;">8 km/h</div>
                        <div style="font-size:12px;opacity:0.7;">东北风</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;backdrop-filter:blur(10px);">
                        <div style="font-size:12px;opacity:0.8;margin-bottom:8px;">能见度</div>
                        <div style="font-size:24px;font-weight:600;">10 km</div>
                        <div style="font-size:12px;opacity:0.7;">良好</div>
                    </div>
                </div>
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    render();
};
