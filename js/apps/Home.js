window.renderHome = function(body, sidebar, toolbar, windowId) {
    let devices = JSON.parse(localStorage.getItem('macos_home') || 'null') || [
        { id: '1', name: '客厅灯', type: 'light', on: true, icon: '💡', room: '客厅' },
        { id: '2', name: '卧室灯', type: 'light', on: false, icon: '💡', room: '卧室' },
        { id: '3', name: '空调', type: 'ac', on: true, temp: 26, icon: '❄️', room: '客厅' },
        { id: '4', name: '智能门锁', type: 'lock', locked: true, icon: '🔒', room: '门厅' },
        { id: '5', name: '智能窗帘', type: 'curtain', open: false, icon: '🪟', room: '客厅' },
        { id: '6', name: '扫地机器人', type: 'vacuum', running: false, icon: '🤖', room: '全屋' },
        { id: '7', name: '智能音箱', type: 'speaker', on: true, icon: '🔊', room: '客厅' },
        { id: '8', name: '摄像头', type: 'camera', on: true, icon: '📹', room: '门厅' }
    ];

    function saveDevices() {
        localStorage.setItem('macos_home', JSON.stringify(devices));
    }

    const rooms = ['全部', '客厅', '卧室', '门厅', '全屋'];
    let currentRoom = '全部';

    function renderContent() {
        const filteredDevices = currentRoom === '全部' ? devices : devices.filter(d => d.room === currentRoom);
        body.innerHTML = `
            <div style="flex:1;padding:32px;background:var(--bg-elevated);overflow-y:auto;">
                <h1 style="font-size:32px;font-weight:700;margin-bottom:24px;">🏠 我的家</h1>
                <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;">
                    ${rooms.map(room => `
                        <button data-room="${room}" style="padding:8px 20px;border:1px solid var(--border-color);background:${currentRoom === room ? 'var(--accent-blue)' : 'var(--button-bg)'};color:${currentRoom === room ? '#fff' : 'var(--text-primary)'};border-radius:20px;cursor:pointer;font-size:13px;">${room}</button>
                    `).join('')}
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;">
                    ${filteredDevices.map(device => {
                        const isOn = device.type === 'lock' ? !device.locked : (device.type === 'curtain' ? device.open : device.on);
                        return `
                            <div data-id="${device.id}" style="padding:20px;background:${isOn ? 'var(--accent-blue)' : 'var(--button-bg)'};border-radius:16px;cursor:pointer;transition:all 0.2s;color:${isOn ? '#fff' : 'var(--text-primary)'};box-shadow:${isOn ? '0 4px 20px rgba(0,122,255,0.3)' : 'none'};">
                                <div style="font-size:32px;margin-bottom:12px;">${device.icon}</div>
                                <div style="font-size:13px;font-weight:600;margin-bottom:4px;">${device.name}</div>
                                <div style="font-size:11px;opacity:0.7;">${device.room}</div>
                                ${device.type === 'ac' && device.on ? `<div style="font-size:20px;font-weight:200;margin-top:8px;">${device.temp}°</div>` : ''}
                                ${device.type === 'lock' ? `<div style="font-size:11px;margin-top:8px;">${device.locked ? '已锁定' : '已解锁'}</div>` : ''}
                                ${device.type === 'curtain' ? `<div style="font-size:11px;margin-top:8px;">${device.open ? '已打开' : '已关闭'}</div>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="margin-top:32px;padding:24px;background:var(--button-bg);border-radius:16px;">
                    <h3 style="font-size:16px;font-weight:600;margin-bottom:16px;">🎬 场景</h3>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;">
                        <div data-scene="home" style="padding:16px;border-radius:12px;background:linear-gradient(135deg,#ff9500,#ff3b30);color:#fff;cursor:pointer;text-align:center;">
                            <div style="font-size:24px;margin-bottom:8px;">🏠</div>
                            <div style="font-size:13px;font-weight:500;">回家</div>
                        </div>
                        <div data-scene="away" style="padding:16px;border-radius:12px;background:linear-gradient(135deg,#5856d6,#af52de);color:#fff;cursor:pointer;text-align:center;">
                            <div style="font-size:24px;margin-bottom:8px;">🚪</div>
                            <div style="font-size:13px;font-weight:500;">离家</div>
                        </div>
                        <div data-scene="sleep" style="padding:16px;border-radius:12px;background:linear-gradient(135deg,#007aff,#5ac8fa);color:#fff;cursor:pointer;text-align:center;">
                            <div style="font-size:24px;margin-bottom:8px;">😴</div>
                            <div style="font-size:13px;font-weight:500;">睡眠</div>
                        </div>
                        <div data-scene="movie" style="padding:16px;border-radius:12px;background:linear-gradient(135deg,#000,#333);color:#fff;cursor:pointer;text-align:center;">
                            <div style="font-size:24px;margin-bottom:8px;">🎬</div>
                            <div style="font-size:13px;font-weight:500;">观影</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('[data-room]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentRoom = btn.dataset.room;
                render();
            });
        });

        body.querySelectorAll('[data-id]').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const device = devices.find(d => d.id === id);
                if (device) {
                    if (device.type === 'lock') device.locked = !device.locked;
                    else if (device.type === 'curtain') device.open = !device.open;
                    else device.on = !device.on;
                    saveDevices();
                    render();
                }
            });
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderContent();
    }

    render();
};
