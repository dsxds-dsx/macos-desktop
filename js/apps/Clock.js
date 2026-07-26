window.renderClock = function(body, sidebar, toolbar, windowId) {
    let updateInterval = null;
    let currentTab = 'world';

    const cities = [
        { name: '北京', timezone: 'Asia/Shanghai', offset: 8 },
        { name: '上海', timezone: 'Asia/Shanghai', offset: 8 },
        { name: '东京', timezone: 'Asia/Tokyo', offset: 9 },
        { name: '纽约', timezone: 'America/New_York', offset: -5 },
        { name: '伦敦', timezone: 'Europe/London', offset: 0 },
        { name: '巴黎', timezone: 'Europe/Paris', offset: 1 }
    ];

    function renderContent() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        const hourDeg = (hours % 12) * 30 + minutes * 0.5;
        const minuteDeg = minutes * 6 + seconds * 0.1;
        const secondDeg = seconds * 6;

        body.innerHTML = `
            <div style="flex:1;display:flex;flex-direction:column;background:#000;color:#fff;">
                <div style="display:flex;gap:4px;padding:12px 16px;border-bottom:0.5px solid #333;">
                    <button class="am-tab ${currentTab === 'world' ? 'active' : ''}" data-tab="world" style="background:${currentTab === 'world' ? '#333' : 'transparent'};color:#fff;">世界时钟</button>
                    <button class="am-tab ${currentTab === 'alarm' ? 'active' : ''}" data-tab="alarm" style="background:${currentTab === 'alarm' ? '#333' : 'transparent'};color:#fff;">闹钟</button>
                    <button class="am-tab ${currentTab === 'stopwatch' ? 'active' : ''}" data-tab="stopwatch" style="background:${currentTab === 'stopwatch' ? '#333' : 'transparent'};color:#fff;">秒表</button>
                    <button class="am-tab ${currentTab === 'timer' ? 'active' : ''}" data-tab="timer" style="background:${currentTab === 'timer' ? '#333' : 'transparent'};color:#fff;">计时器</button>
                </div>
                
                ${currentTab === 'world' ? `
                    <div style="flex:1;padding:20px;overflow-y:auto;">
                        <div style="display:flex;justify-content:center;margin-bottom:32px;">
                            <div class="clock-analog">
                                <div class="clock-hand clock-hour" style="transform:rotate(${hourDeg}deg);"></div>
                                <div class="clock-hand clock-minute" style="transform:rotate(${minuteDeg}deg);"></div>
                                <div class="clock-hand clock-second" style="transform:rotate(${secondDeg}deg);"></div>
                                <div style="position:absolute;top:50%;left:50%;width:10px;height:10px;border-radius:50%;background:#fff;transform:translate(-50%,-50%);"></div>
                            </div>
                        </div>
                        <div class="clock-digital" style="text-align:center;">
                            ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
                        </div>
                        <div class="clock-date" style="text-align:center;">
                            ${now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div style="margin-top:32px;">
                            <div style="font-size:13px;color:#888;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;">世界时钟</div>
                            <div style="display:flex;flex-direction:column;gap:8px;">
                                ${cities.map(city => {
                                    const cityTime = new Date(now.getTime() + (city.offset - 8) * 60 * 60 * 1000);
                                    const cityH = cityTime.getUTCHours();
                                    const cityM = cityTime.getUTCMinutes();
                                    return `
                                        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#1c1c1e;border-radius:10px;">
                                            <div>
                                                <div style="font-size:12px;color:#888;">${city.name}</div>
                                                <div style="font-size:11px;color:#666;">${city.offset >= 0 ? '+' : ''}${city.offset}小时</div>
                                            </div>
                                            <div style="font-size:24px;font-weight:200;">${String(cityH).padStart(2, '0')}:${String(cityM).padStart(2, '0')}</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                ` : currentTab === 'alarm' ? `
                    <div style="flex:1;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#888;">
                        <div style="font-size:48px;margin-bottom:16px;">⏰</div>
                        <div>闹钟功能</div>
                        <div style="font-size:12px;margin-top:8px;">暂无闹钟</div>
                    </div>
                ` : currentTab === 'stopwatch' ? `
                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                        <div style="font-size:72px;font-weight:100;font-family:'SF Mono',Monaco,monospace;">00:00.00</div>
                        <div style="display:flex;gap:24px;margin-top:32px;">
                            <button style="width:80px;height:80px;border-radius:50%;border:2px solid #333;background:#1c1c1e;color:#fff;font-size:16px;cursor:pointer;">启动</button>
                            <button style="width:80px;height:80px;border-radius:50%;border:2px solid #333;background:#1c1c1e;color:#fff;font-size:16px;cursor:pointer;">复位</button>
                        </div>
                    </div>
                ` : `
                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                        <div style="font-size:72px;font-weight:100;font-family:'SF Mono',Monaco,monospace;">00:00</div>
                        <div style="display:flex;gap:8px;margin-top:32px;">
                            <button style="padding:10px 24px;border-radius:20px;border:1px solid #333;background:#1c1c1e;color:#fff;font-size:14px;cursor:pointer;">0分钟</button>
                            <button style="padding:10px 24px;border-radius:20px;border:1px solid #333;background:#1c1c1e;color:#fff;font-size:14px;cursor:pointer;">1分钟</button>
                            <button style="padding:10px 24px;border-radius:20px;border:1px solid #333;background:#1c1c1e;color:#fff;font-size:14px;cursor:pointer;">5分钟</button>
                            <button style="padding:10px 24px;border-radius:20px;border:1px solid #333;background:#1c1c1e;color:#fff;font-size:14px;cursor:pointer;">10分钟</button>
                        </div>
                    </div>
                `}
            </div>
        `;

        body.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentTab = btn.dataset.tab;
                renderContent();
            });
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderContent();
    }

    updateInterval = setInterval(renderContent, 1000);
    render();

    return () => {
        if (updateInterval) clearInterval(updateInterval);
    };
};
