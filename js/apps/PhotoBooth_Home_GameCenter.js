// Photo Booth - 拍照应用
window.renderPhotoBooth = function(body, sidebar, toolbar, windowId) {
    let photos = JSON.parse(localStorage.getItem('photobooth_photos') || '[]');
    let isCounting = false;
    let cameraOn = true;
    let filterIndex = 0;
    const filters = ['原图', '漫画效果', '光隧道', '挤压', '旋转', '万花筒', '热感应', 'X光'];

    function render() {
        body.innerHTML = `
            <div class="photobooth-container">
                <div class="pb-camera">
                    <div class="pb-viewfinder" id="pb-viewfinder">
                        <div class="pb-camera-placeholder" id="pb-placeholder">
                            <div style="font-size:48px;margin-bottom:12px;">📸</div>
                            <div style="font-size:14px;color:#8E8E93;">相机预览</div>
                            <div style="font-size:11px;color:#8E8E93;margin-top:4px;">当前滤镜：${filters[filterIndex]}</div>
                        </div>
                        <div class="pb-flash" id="pb-flash"></div>
                        ${isCounting ? `<div class="pb-countdown" id="pb-countdown">3</div>` : ''}
                    </div>
                    <div class="pb-filter-bar">
                        ${filters.map((f, i) => `
                            <div class="pb-filter ${i === filterIndex ? 'active' : ''}" data-filter="${i}">
                                <div class="pb-filter-preview">${['🎭', '🖼️', '✨', '🔮', '🌀', '🔷', '🌡️', '💀'][i]}</div>
                                <div class="pb-filter-name">${f}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="pb-controls">
                        <button class="pb-camera-toggle" id="pb-camera-on">
                            ${cameraOn ? '⏸ 暂停' : '▶ 开始'}
                        </button>
                        <button class="pb-shutter" id="pb-shutter" title="拍照">
                            <div class="pb-shutter-inner"></div>
                        </button>
                        <button class="pb-switch-cam" title="切换摄像头">🔄</button>
                    </div>
                </div>
                <div class="pb-gallery">
                    <div class="pb-gallery-title">照片 (${photos.length})</div>
                    <div class="pb-gallery-grid">
                        ${photos.length === 0 ? '<div class="pb-empty">还没有照片<br><span style="font-size:11px;">点击快门拍摄</span></div>' : ''}
                        ${photos.slice().reverse().map((p, i) => `
                            <div class="pb-thumb" data-idx="${photos.length - 1 - i}">
                                <div class="pb-thumb-img" style="background:${p.color}">${p.emoji}</div>
                                <div class="pb-thumb-date">${new Date(p.time).toLocaleDateString('zh-CN')}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        body.querySelector('#pb-shutter').addEventListener('click', takePhoto);
        body.querySelector('#pb-camera-on').addEventListener('click', () => {
            cameraOn = !cameraOn;
            render();
        });
        body.querySelectorAll('.pb-filter').forEach(f => {
            f.addEventListener('click', () => {
                filterIndex = parseInt(f.dataset.filter);
                render();
            });
        });
    }

    function takePhoto() {
        if (isCounting) return;
        isCounting = true;
        render();
        let count = 3;
        const countdownEl = body.querySelector('#pb-countdown');
        const interval = setInterval(() => {
            count--;
            if (countdownEl) countdownEl.textContent = count > 0 ? count : '';
            if (count <= 0) {
                clearInterval(interval);
                // 闪光灯效果
                const flash = document.getElementById('pb-flash');
                if (flash) {
                    flash.style.opacity = '1';
                    setTimeout(() => {
                        if (flash) flash.style.opacity = '0';
                    }, 200);
                }
                // 保存照片
                const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55'];
                const emojis = ['😊', '😎', '🤩', '📸', '🎭', '🖼️', '🌈', '⭐'];
                photos.push({
                    time: Date.now(),
                    filter: filters[filterIndex],
                    color: colors[Math.floor(Math.random() * colors.length)],
                    emoji: emojis[Math.floor(Math.random() * emojis.length)]
                });
                localStorage.setItem('photobooth_photos', JSON.stringify(photos));
                isCounting = false;
                render();
            }
        }, 1000);
    }

    render();
};

// Home - 家庭
window.renderHome = function(body, sidebar, toolbar, windowId) {
    const rooms = [
        { id: 1, name: '客厅', icon: '🛋️', accessories: 5 },
        { id: 2, name: '卧室', icon: '🛏️', accessories: 3 },
        { id: 3, name: '厨房', icon: '🍳', accessories: 2 },
        { id: 4, name: '浴室', icon: '🚿', accessories: 2 },
        { id: 5, name: '书房', icon: '💻', accessories: 4 },
        { id: 6, name: '阳台', icon: '🌿', accessories: 1 },
    ];

    const accessories = [
        { id: 1, room: 1, name: '客厅灯', type: 'light', on: true, brightness: 80 },
        { id: 2, room: 1, name: '空调', type: 'ac', on: true, temp: 24 },
        { id: 3, room: 1, name: '电视', type: 'tv', on: false },
        { id: 4, room: 1, name: '智能音箱', type: 'speaker', on: true, volume: 60 },
        { id: 5, room: 1, name: '窗帘', type: 'curtain', on: false },
        { id: 6, room: 2, name: '卧室灯', type: 'light', on: false, brightness: 50 },
        { id: 7, room: 2, name: '空调', type: 'ac', on: false, temp: 26 },
        { id: 8, room: 2, name: '加湿器', type: 'humidifier', on: true },
        { id: 9, room: 3, name: '冰箱', type: 'fridge', on: true, temp: 4 },
        { id: 10, room: 3, name: '智能插座', type: 'plug', on: true },
        { id: 11, room: 4, name: '浴室灯', type: 'light', on: false, brightness: 100 },
        { id: 12, room: 4, name: '热水器', type: 'heater', on: true, temp: 45 },
        { id: 13, room: 5, name: '台灯', type: 'light', on: true, brightness: 100 },
        { id: 14, room: 5, name: '空气净化器', type: 'purifier', on: true },
        { id: 15, room: 5, name: '加湿器', type: 'humidifier', on: false },
        { id: 16, room: 5, name: 'MacBook 充电器', type: 'plug', on: true },
        { id: 17, room: 6, name: '花园灯', type: 'light', on: false, brightness: 70 },
    ];

    let activeRoom = null;

    function render() {
        body.innerHTML = `
            <div class="home-app-container">
                <div class="home-sidebar">
                    <div class="home-title">家庭</div>
                    <div class="home-rooms">
                        <div class="home-room-item ${activeRoom === null ? 'active' : ''}" data-room="all">
                            <span>🏠</span><span>我的家</span>
                        </div>
                        ${rooms.map(r => `
                            <div class="home-room-item ${activeRoom === r.id ? 'active' : ''}" data-room="${r.id}">
                                <span>${r.icon}</span><span>${r.name}</span>
                                <span class="home-room-count">${r.accessories}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="home-main">
                    <div class="home-section-title">
                        ${activeRoom ? rooms.find(r => r.id === activeRoom).name : '我的家'} · 喜爱的场景
                    </div>
                    <div class="home-scenes">
                        <div class="home-scene" data-scene="good-morning">
                            <div class="home-scene-icon">🌅</div>
                            <div class="home-scene-name">起床</div>
                        </div>
                        <div class="home-scene" data-scene="leave">
                            <div class="home-scene-icon">🚪</div>
                            <div class="home-scene-name">离家</div>
                        </div>
                        <div class="home-scene" data-scene="arrive">
                            <div class="home-scene-icon">🏡</div>
                            <div class="home-scene-name">回家</div>
                        </div>
                        <div class="home-scene" data-scene="good-night">
                            <div class="home-scene-icon">🌙</div>
                            <div class="home-scene-name">就寝</div>
                        </div>
                    </div>
                    <div class="home-section-title">配件</div>
                    <div class="home-accessories">
                        ${accessories.filter(a => activeRoom === null || a.room === activeRoom).map(a => renderAccessory(a)).join('')}
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.home-room-item').forEach(item => {
            item.addEventListener('click', () => {
                const v = item.dataset.room;
                activeRoom = v === 'all' ? null : parseInt(v);
                render();
            });
        });

        body.querySelectorAll('.home-accessory-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const id = parseInt(toggle.dataset.id);
                const acc = accessories.find(a => a.id === id);
                if (acc) {
                    acc.on = !acc.on;
                    render();
                }
            });
        });
    }

    function renderAccessory(a) {
        const icons = { light: '💡', ac: '❄️', tv: '📺', speaker: '🔊', curtain: '🪟', humidifier: '💧', fridge: '🧊', plug: '🔌', heater: '🔥', purifier: '🌬️' };
        const icon = icons[a.type] || '⚙️';
        return `
            <div class="home-accessory ${a.on ? 'on' : 'off'}">
                <div class="home-accessory-header">
                    <div class="home-accessory-icon">${icon}</div>
                    <div class="home-accessory-toggle" data-id="${a.id}">
                        <div class="home-toggle-inner"></div>
                    </div>
                </div>
                <div class="home-accessory-name">${a.name}</div>
                <div class="home-accessory-status">${a.on ? (a.brightness ? a.brightness + '%' : a.temp ? a.temp + '°' : '开启') : '关闭'}</div>
            </div>
        `;
    }

    render();
};

// Game Center - 游戏中心
window.renderGameCenter = function(body, sidebar, toolbar, windowId) {
    const games = [
        { id: 1, name: '《英雄联盟》', icon: '⚔️', lastPlayed: Date.now() - 3600000 * 2, playTime: '128 小时', achievements: 84, totalAchievements: 120 },
        { id: 2, name: '《塞尔达传说》', icon: '🗡️', lastPlayed: Date.now() - 86400000, playTime: '95 小时', achievements: 42, totalAchievements: 60 },
        { id: 3, name: '《原神》', icon: '✨', lastPlayed: Date.now() - 86400000 * 3, playTime: '342 小时', achievements: 256, totalAchievements: 300 },
        { id: 4, name: '《动物森友会》', icon: '🏝️', lastPlayed: Date.now() - 86400000 * 7, playTime: '220 小时', achievements: 65, totalAchievements: 80 },
        { id: 5, name: '《星露谷物语》', icon: '🌾', lastPlayed: Date.now() - 86400000 * 10, playTime: '156 小时', achievements: 38, totalAchievements: 50 },
        { id: 6, name: '《文明 VI》', icon: '🏛️', lastPlayed: Date.now() - 86400000 * 5, playTime: '88 小时', achievements: 22, totalAchievements: 100 },
    ];

    const friends = [
        { id: 1, name: '小明', avatar: '👦', status: 'online', game: '《英雄联盟》' },
        { id: 2, name: '小红', avatar: '👧', status: 'online', game: '《原神》' },
        { id: 3, name: '阿杰', avatar: '🧑', status: 'offline', game: null },
        { id: 4, name: '老王', avatar: '👨', status: 'online', game: null },
        { id: 5, name: '小丽', avatar: '👩', status: 'online', game: '《动物森友会》' },
    ];

    let activeTab = 'games';

    function render() {
        body.innerHTML = `
            <div class="gamecenter-container">
                <div class="gc-sidebar">
                    <div class="gc-profile">
                        <div class="gc-avatar">🎮</div>
                        <div class="gc-username">Player_001</div>
                        <div class="gc-achievements-total">156 个成就</div>
                    </div>
                    <div class="gc-tabs">
                        <div class="gc-tab ${activeTab === 'games' ? 'active' : ''}" data-tab="games">🎮 游戏</div>
                        <div class="gc-tab ${activeTab === 'friends' ? 'active' : ''}" data-tab="friends">👥 朋友</div>
                        <div class="gc-tab ${activeTab === 'achievements' ? 'active' : ''}" data-tab="achievements">🏆 成就</div>
                    </div>
                </div>
                <div class="gc-main">
                    ${activeTab === 'games' ? renderGames() : activeTab === 'friends' ? renderFriends() : renderAchievements()}
                </div>
            </div>
        `;

        body.querySelectorAll('.gc-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activeTab = tab.dataset.tab;
                render();
            });
        });
    }

    function renderGames() {
        return `
            <div class="gc-games-header">
                <div class="gc-section-title">我的游戏</div>
                <div class="gc-game-count">${games.length} 款游戏</div>
            </div>
            <div class="gc-games-grid">
                ${games.map(g => `
                    <div class="gc-game-card">
                        <div class="gc-game-icon">${g.icon}</div>
                        <div class="gc-game-info">
                            <div class="gc-game-name">${g.name}</div>
                            <div class="gc-game-meta">
                                <span>⏱ ${g.playTime}</span>
                                <span>🏆 ${g.achievements}/${g.totalAchievements}</span>
                            </div>
                            <div class="gc-game-last">最后游玩：${formatTime(g.lastPlayed)}</div>
                        </div>
                        <button class="gc-play-btn">游玩</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderFriends() {
        return `
            <div class="gc-games-header">
                <div class="gc-section-title">好友</div>
                <div class="gc-game-count">${friends.filter(f => f.status === 'online').length} 位在线</div>
            </div>
            <div class="gc-friends-list">
                ${friends.map(f => `
                    <div class="gc-friend-item">
                        <div class="gc-friend-avatar">${f.avatar}</div>
                        <div class="gc-friend-info">
                            <div class="gc-friend-name">${f.name}</div>
                            <div class="gc-friend-status" style="color:${f.status === 'online' ? '#34C759' : '#8E8E93'}">
                                ${f.status === 'online' ? (f.game ? '正在玩 ' + f.game : '在线') : '离线'}
                            </div>
                        </div>
                        ${f.status === 'online' ? '<button class="gc-friend-btn">聊天</button>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderAchievements() {
        const totalAch = games.reduce((s, g) => s + g.totalAchievements, 0);
        const earnedAch = games.reduce((s, g) => s + g.achievements, 0);
        const percent = Math.round(earnedAch / totalAch * 100);
        return `
            <div class="gc-games-header">
                <div class="gc-section-title">成就</div>
            </div>
            <div class="gc-ach-overview">
                <div class="gc-ach-progress">
                    <div class="gc-ach-ring" style="--percent:${percent}">
                        <div class="gc-ach-ring-inner">
                            <div class="gc-ach-count">${earnedAch}</div>
                            <div class="gc-ach-total">/ ${totalAch}</div>
                        </div>
                    </div>
                </div>
                <div class="gc-ach-info">
                    <div class="gc-ach-title">成就完成度</div>
                    <div class="gc-ach-percent">${percent}%</div>
                    <div class="gc-ach-sub">已解锁 ${earnedAch} 个成就</div>
                </div>
            </div>
            <div class="gc-section-title" style="margin-top:24px;">各游戏成就</div>
            <div class="gc-ach-games">
                ${games.map(g => {
                    const p = Math.round(g.achievements / g.totalAchievements * 100);
                    return `
                        <div class="gc-ach-game">
                            <div class="gc-ach-game-icon">${g.icon}</div>
                            <div class="gc-ach-game-info">
                                <div class="gc-ach-game-name">${g.name}</div>
                                <div class="gc-ach-bar"><div class="gc-ach-bar-fill" style="width:${p}%"></div></div>
                            </div>
                            <div class="gc-ach-game-count">${g.achievements}/${g.totalAchievements}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function formatTime(ts) {
        const diff = Date.now() - ts;
        if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
        if (diff < 86400000 * 7) return Math.floor(diff / 86400000) + ' 天前';
        return new Date(ts).toLocaleDateString('zh-CN');
    }

    render();
};
