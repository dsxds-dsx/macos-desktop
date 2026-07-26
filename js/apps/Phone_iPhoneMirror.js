// Phone - 电话
window.renderPhone = function(body, sidebar, toolbar, windowId) {
    const contacts = [
        { id: 1, name: '小明', avatar: '👦', number: '138 0013 8000', recent: true, callType: 'incoming', callTime: '今天 09:30', duration: '5 分钟' },
        { id: 2, name: '小红', avatar: '👧', number: '139 0013 9000', recent: true, callType: 'outgoing', callTime: '今天 08:15', duration: '3 分钟' },
        { id: 3, name: '妈妈', avatar: '👩', number: '136 0013 6000', recent: true, callType: 'missed', callTime: '昨天 20:45', duration: '未接' },
        { id: 4, name: '老爸', avatar: '👨', number: '137 0013 7000', recent: false },
        { id: 5, name: '阿杰', avatar: '🧑', number: '188 0018 8000', recent: true, callType: 'incoming', callTime: '昨天 15:20', duration: '12 分钟' },
        { id: 6, name: '老王', avatar: '👴', number: '135 0013 5000', recent: false },
        { id: 7, name: '小丽', avatar: '👩‍🦰', number: '189 0018 9000', recent: false },
        { id: 8, name: '小张', avatar: '🧑‍💼', number: '186 0018 6000', recent: false },
    ];

    let activeTab = 'recents';
    let dialNumber = '';
    let inCall = false;
    let callContact = null;
    let callTime = 0;
    let callTimer = null;

    function render() {
        body.innerHTML = `
            <div class="phone-app-container">
                <div class="phone-sidebar">
                    <div class="phone-tabs">
                        <div class="phone-tab ${activeTab === 'recents' ? 'active' : ''}" data-tab="recents">📞 最近通话</div>
                        <div class="phone-tab ${activeTab === 'contacts' ? 'active' : ''}" data-tab="contacts">👥 联系人</div>
                        <div class="phone-tab ${activeTab === 'keypad' ? 'active' : ''}" data-tab="keypad">🔢 拨号键盘</div>
                        <div class="phone-tab ${activeTab === 'voicemail' ? 'active' : ''}" data-tab="voicemail">📼 语音留言</div>
                    </div>
                </div>
                <div class="phone-main">
                    ${inCall ? renderCallScreen() : activeTab === 'recents' ? renderRecents() : activeTab === 'contacts' ? renderContacts() : activeTab === 'keypad' ? renderKeypad() : renderVoicemail()}
                </div>
            </div>
        `;

        body.querySelectorAll('.phone-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                if (inCall) return;
                activeTab = tab.dataset.tab;
                render();
            });
        });

        // 拨号键盘
        if (!inCall && activeTab === 'keypad') {
            body.querySelectorAll('.dial-key').forEach(key => {
                key.addEventListener('click', () => {
                    const val = key.dataset.val;
                    if (val === 'del') {
                        dialNumber = dialNumber.slice(0, -1);
                    } else if (val === 'call') {
                        if (dialNumber) {
                            startCall({ name: dialNumber, number: dialNumber, avatar: '📞' });
                        }
                    } else {
                        dialNumber += val;
                    }
                    render();
                });
            });
        }

        // 联系人点击
        body.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const c = contacts.find(x => x.id === id);
                if (c) startCall(c);
            });
        });

        // 挂断
        const hangupBtn = body.querySelector('#hangup-btn');
        if (hangupBtn) {
            hangupBtn.addEventListener('click', endCall);
        }
    }

    function startCall(contact) {
        callContact = contact;
        inCall = true;
        callTime = 0;
        callTimer = setInterval(() => {
            callTime++;
            const timerEl = document.querySelector('.call-timer');
            if (timerEl) {
                const m = Math.floor(callTime / 60);
                const s = callTime % 60;
                timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
            }
        }, 1000);
        render();
    }

    function endCall() {
        inCall = false;
        if (callTimer) clearInterval(callTimer);
        callContact = null;
        callTime = 0;
        render();
    }

    function renderCallScreen() {
        return `
            <div class="call-screen">
                <div class="call-avatar">${callContact?.avatar || '📞'}</div>
                <div class="call-name">${callContact?.name || '未知号码'}</div>
                <div class="call-number">${callContact?.number || ''}</div>
                <div class="call-timer">0:00</div>
                <div class="call-status">通话中</div>
                <div class="call-actions">
                    <button class="call-action-btn">🔇 静音</button>
                    <button class="call-action-btn">🔊 免提</button>
                    <button class="call-action-btn">📹 FaceTime</button>
                    <button class="call-action-btn">📱 添加通话</button>
                    <button class="call-action-btn">🔒 键盘</button>
                    <button class="call-action-btn">👤 联系人</button>
                </div>
                <button class="call-hangup" id="hangup-btn">📞</button>
            </div>
        `;
    }

    function renderRecents() {
        const recent = contacts.filter(c => c.recent);
        return `
            <div class="phone-list-header">最近通话</div>
            <div class="phone-list">
                ${recent.map(c => `
                    <div class="contact-item" data-id="${c.id}">
                        <div class="contact-avatar">${c.avatar}</div>
                        <div class="contact-info">
                            <div class="contact-name">${c.name}</div>
                            <div class="contact-meta">
                                <span class="call-type call-type-${c.callType}">
                                    ${c.callType === 'incoming' ? '↓ 来电' : c.callType === 'outgoing' ? '↑ 去电' : '✕ 未接'}
                                </span>
                                ${c.duration}
                            </div>
                        </div>
                        <div class="contact-time">${c.callTime}</div>
                        <button class="contact-call-btn">📞</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderContacts() {
        return `
            <div class="phone-list-header">联系人 · ${contacts.length}</div>
            <div class="phone-list">
                ${contacts.map(c => `
                    <div class="contact-item" data-id="${c.id}">
                        <div class="contact-avatar">${c.avatar}</div>
                        <div class="contact-info">
                            <div class="contact-name">${c.name}</div>
                            <div class="contact-number">${c.number}</div>
                        </div>
                        <button class="contact-call-btn">📞</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderKeypad() {
        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
        const letters = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ', '', '+', ''];
        return `
            <div class="keypad-container">
                <div class="dial-display">${dialNumber || ' '}</div>
                <div class="dial-pad">
                    ${keys.map((k, i) => `
                        <div class="dial-key" data-val="${k}">
                            <div class="dial-key-num">${k}</div>
                            ${letters[i] ? `<div class="dial-key-letters">${letters[i]}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="dial-actions">
                    <div style="visibility:hidden"></div>
                    <div class="dial-key dial-call" data-val="call">📞</div>
                    <div class="dial-key dial-del" data-val="del">⌫</div>
                </div>
            </div>
        `;
    }

    function renderVoicemail() {
        return `
            <div class="voicemail-container">
                <div class="phone-list-header">语音留言</div>
                <div class="voicemail-empty">
                    <div style="font-size:48px;margin-bottom:16px;">📼</div>
                    <div style="font-size:16px;font-weight:600;margin-bottom:8px;">暂无语音留言</div>
                    <div style="font-size:13px;color:#8E8E93;">当有人给你留言时会显示在这里</div>
                </div>
            </div>
        `;
    }

    render();
};

// iPhone Mirroring - iPhone 镜像
window.renderIPhoneMirror = function(body, sidebar, toolbar, windowId) {
    let isConnected = false;
    let phoneName = 'iPhone 15 Pro';
    let batteryLevel = 78;
    let currentApp = '主屏幕';
    let isCharging = true;
    let signalBars = 4;
    let wifiBars = 3;

    const apps = [
        { id: 'messages', name: '信息', icon: '💬', color: '#34C759' },
        { id: 'phone', name: '电话', icon: '📞', color: '#34C759' },
        { id: 'safari', name: 'Safari', icon: '🧭', color: '#007AFF' },
        { id: 'mail', name: '邮件', icon: '✉️', color: '#007AFF' },
        { id: 'music', name: '音乐', icon: '🎵', color: '#FF3B30' },
        { id: 'photos', name: '照片', icon: '🌈', color: '#FF9500' },
        { id: 'camera', name: '相机', icon: '📷', color: '#8E8E93' },
        { id: 'settings', name: '设置', icon: '⚙️', color: '#8E8E93' },
        { id: 'maps', name: '地图', icon: '🗺️', color: '#34C759' },
        { id: 'notes', name: '备忘录', icon: '📝', color: '#FFCC00' },
        { id: 'calendar', name: '日历', icon: '📅', color: '#FF3B30' },
        { id: 'appstore', name: 'App Store', icon: '🅰️', color: '#007AFF' },
        { id: 'health', name: '健康', icon: '❤️', color: '#FF3B30' },
        { id: 'wallet', name: '钱包', icon: '💳', color: '#1D1D1F' },
        { id: 'weather', name: '天气', icon: '☀️', color: '#5AC8FA' },
        { id: 'clock', name: '时钟', icon: '🕐', color: '#1D1D1F' },
    ];

    function render() {
        body.innerHTML = `
            <div class="iphone-mirror-container">
                <div class="iphone-mirror-header">
                    <div class="im-title">iPhone 镜像</div>
                    <div class="im-status">
                        <span class="im-dot" style="background:${isConnected ? '#34C759' : '#FF9500'}"></span>
                        ${isConnected ? '已连接' : '未连接'}
                    </div>
                </div>
                <div class="iphone-mirror-main">
                    <div class="iphone-wrapper">
                        <div class="iphone-notch"></div>
                        <div class="iphone-screen">
                            ${isConnected ? renderPhoneScreen() : renderNotConnected()}
                        </div>
                        <div class="iphone-home-bar"></div>
                    </div>
                    <div class="iphone-side-panel">
                        <div class="im-device-info">
                            <div class="im-device-icon">📱</div>
                            <div class="im-device-name">${phoneName}</div>
                            ${isConnected ? `
                                <div class="im-device-meta">
                                    <span>🔋 ${batteryLevel}%</span>
                                    <span>📶 ${signalBars}</span>
                                    <span>📶 ${wifiBars}</span>
                                </div>
                                <div class="im-device-app">当前：${currentApp}</div>
                            ` : `
                                <div class="im-device-meta" style="color:#8E8E93;">设备未连接</div>
                            `}
                        </div>
                        <div class="im-actions">
                            ${isConnected ? `
                                <button class="im-btn">📷 截图</button>
                                <button class="im-btn">🎥 录屏</button>
                                <button class="im-btn">🔊 音频</button>
                                <button class="im-btn">📂 文件</button>
                                <button class="im-btn im-btn-danger" id="im-disconnect">断开连接</button>
                            ` : `
                                <button class="im-btn im-btn-primary" id="im-connect">连接 iPhone</button>
                                <div class="im-help">
                                    <strong>如何连接：</strong>
                                    <ol>
                                        <li>确保 iPhone 和 Mac 在同一 Wi-Fi 下</li>
                                        <li>在 iPhone 上打开控制中心</li>
                                        <li>点击"屏幕镜像"</li>
                                        <li>选择这台 Mac</li>
                                    </ol>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const connectBtn = body.querySelector('#im-connect');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                isConnected = true;
                currentApp = '主屏幕';
                render();
            });
        }

        const disconnectBtn = body.querySelector('#im-disconnect');
        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', () => {
                isConnected = false;
                render();
            });
        }

        // 点击应用图标
        body.querySelectorAll('.im-app-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                const appId = icon.dataset.id;
                const app = apps.find(a => a.id === appId);
                if (app) {
                    currentApp = app.name;
                    render();
                }
            });
        });
    }

    function renderNotConnected() {
        return `
            <div class="im-not-connected">
                <div style="font-size:48px;margin-bottom:16px;">📱</div>
                <div style="font-size:16px;font-weight:600;">未连接 iPhone</div>
                <div style="font-size:12px;color:#8E8E93;margin-top:8px;text-align:center;">
                    点击右侧按钮连接<br>你的 iPhone
                </div>
            </div>
        `;
    }

    function renderPhoneScreen() {
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        return `
            <div class="im-phone-ui">
                <div class="im-status-bar">
                    <span class="im-time">${timeStr}</span>
                    <span class="im-status-icons">
                        <span>📶${signalBars}</span>
                        <span>📶${wifiBars}</span>
                        <span>🔋${batteryLevel}</span>
                    </span>
                </div>
                <div class="im-home-screen">
                    <div class="im-app-grid">
                        ${apps.map(app => `
                            <div class="im-app-icon" data-id="${app.id}">
                                <div class="im-app-icon-img" style="background:${app.color}">${app.icon}</div>
                                <div class="im-app-icon-name">${app.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="im-dock">
                    ${apps.slice(0, 4).map(app => `
                        <div class="im-app-icon" data-id="${app.id}">
                            <div class="im-app-icon-img" style="background:${app.color}">${app.icon}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    render();
};
