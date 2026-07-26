// Find My - 查找
window.renderFindMy = function(body, sidebar, toolbar, windowId) {
    const devices = [
        { id: 1, name: 'MacBook Pro', type: 'laptop', status: '在线', location: '北京市朝阳区三里屯', battery: '82%', lastSeen: '刚刚' },
        { id: 2, name: 'iPhone 15 Pro', type: 'phone', status: '在线', location: '北京市朝阳区三里屯', battery: '67%', lastSeen: '刚刚' },
        { id: 3, name: 'iPad Air', type: 'tablet', status: '在线', location: '北京市朝阳区三里屯', battery: '45%', lastSeen: '10 分钟前' },
        { id: 4, name: 'Apple Watch Ultra 2', type: 'watch', status: '在线', location: '北京市朝阳区三里屯', battery: '73%', lastSeen: '刚刚' },
        { id: 5, name: 'AirPods Pro', type: 'pods', status: '离线', location: '北京市朝阳区三里屯', battery: '--', lastSeen: '2 小时前' },
        { id: 6, name: 'AirTag - 钥匙', type: 'tag', status: '在线', location: '北京市朝阳公园', battery: '95%', lastSeen: '5 分钟前' },
        { id: 7, name: 'AirTag - 背包', type: 'tag', status: '在线', location: '北京市朝阳区三里屯', battery: '91%', lastSeen: '3 分钟前' },
    ];

    let activeTab = 'devices';
    let selectedDevice = devices[0];

    function render() {
        body.innerHTML = `
            <div class="findmy-container">
                <div class="findmy-sidebar">
                    <div class="findmy-tabs">
                        <div class="findmy-tab ${activeTab === 'devices' ? 'active' : ''}" data-tab="devices">
                            <span class="findmy-tab-icon">📱</span>设备
                        </div>
                        <div class="findmy-tab ${activeTab === 'items' ? 'active' : ''}" data-tab="items">
                            <span class="findmy-tab-icon">🔑</span>物品
                        </div>
                        <div class="findmy-tab ${activeTab === 'people' ? 'active' : ''}" data-tab="people">
                            <span class="findmy-tab-icon">👥</span>联系人
                        </div>
                    </div>
                    <div class="findmy-device-list">
                        ${devices.filter(d => {
                            if (activeTab === 'devices') return d.type !== 'tag';
                            if (activeTab === 'items') return d.type === 'tag';
                            return false;
                        }).map(d => `
                            <div class="findmy-device-item ${selectedDevice.id === d.id ? 'active' : ''}" data-id="${d.id}">
                                <div class="findmy-device-icon">${getDeviceIcon(d.type)}</div>
                                <div class="findmy-device-info">
                                    <div class="findmy-device-name">${d.name}</div>
                                    <div class="findmy-device-status" style="color:${d.status === '在线' ? '#34C759' : '#8E8E93'}">${d.location}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="findmy-map">
                    <div class="findmy-map-placeholder">
                        <div class="findmy-map-pin" style="top:40%;left:55%;">
                            ${getDeviceIcon(selectedDevice.type)}
                        </div>
                        <div class="findmy-map-grid"></div>
                        <div class="findmy-map-label">
                            <div style="font-size:16px;font-weight:600;margin-bottom:4px;">${selectedDevice.name}</div>
                            <div style="font-size:13px;color:#8E8E93;">${selectedDevice.location}</div>
                            <div style="font-size:12px;color:#8E8E93;margin-top:4px;">最后位置：${selectedDevice.lastSeen}</div>
                        </div>
                    </div>
                </div>
                <div class="findmy-actions">
                    <button class="findmy-action-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 20l-4-4H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2h-4l-4 4z" fill="currentColor"/></svg>
                        <span>播放声音</span>
                    </button>
                    <button class="findmy-action-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
                        <span>标记为丢失</span>
                    </button>
                    <button class="findmy-action-btn danger">
                        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                        <span>擦除此设备</span>
                    </button>
                    <div class="findmy-device-detail">
                        <div><span class="findmy-detail-label">状态</span><span style="color:${selectedDevice.status === '在线' ? '#34C759' : '#8E8E93'}">${selectedDevice.status}</span></div>
                        <div><span class="findmy-detail-label">电量</span><span>${selectedDevice.battery}</span></div>
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.findmy-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activeTab = tab.dataset.tab;
                render();
            });
        });

        body.querySelectorAll('.findmy-device-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                selectedDevice = devices.find(d => d.id === id);
                render();
            });
        });
    }

    function getDeviceIcon(type) {
        const icons = {
            laptop: '💻',
            phone: '📱',
            tablet: '📱',
            watch: '⌚',
            pods: '🎧',
            tag: '🏷️'
        };
        return icons[type] || '📱';
    }

    render();
};
