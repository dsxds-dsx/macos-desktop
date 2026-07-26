window.renderFaceTime = function(body, sidebar, toolbar, windowId) {
    let selectedContactId = null;
    let isInCall = false;
    let callType = null;

    const contacts = [
        { id: '1', name: '张小明', avatar: '张', color: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' },
        { id: '2', name: '李华', avatar: '李', color: 'linear-gradient(135deg, #4ecdc4, #44a08d)' },
        { id: '3', name: '王总', avatar: '王', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
        { id: '4', name: '妈妈', avatar: '妈', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
        { id: '5', name: '爸爸', avatar: '爸', color: 'linear-gradient(135deg, #4facfe, #00f2fe)' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:240px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);display:flex;flex-direction:column;">
                <div style="padding:16px;border-bottom:0.5px solid var(--border-color);">
                    <input type="text" placeholder="搜索" style="width:100%;padding:6px 10px;background:var(--input-bg);border:none;border-radius:6px;font-size:12px;outline:none;">
                </div>
                <div style="padding:8px;flex:1;overflow-y:auto;">
                    <div style="font-size:11px;font-weight:600;color:var(--text-tertiary);padding:8px 12px 4px;text-transform:uppercase;letter-spacing:0.5px;">最近通话</div>
                    ${contacts.map(contact => `
                        <div class="contact-item ${selectedContactId === contact.id ? 'active' : ''}" data-id="${contact.id}">
                            <div class="contact-avatar" style="background:${contact.color};">${contact.avatar}</div>
                            <div style="flex:1;">
                                <div style="font-size:13px;font-weight:500;">${contact.name}</div>
                                <div style="font-size:11px;color:var(--text-tertiary);">昨天 · 视频通话 3:24</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                selectedContactId = item.dataset.id;
                renderContent();
            });
        });
    }

    function renderContent() {
        if (isInCall) {
            const contact = contacts.find(c => c.id === selectedContactId);
            body.innerHTML = `
                <div class="facetime-body">
                    <div class="facetime-avatar" style="background:${contact.color};">${contact.avatar}</div>
                    <div class="facetime-name">${contact.name}</div>
                    <div class="facetime-status" id="call-status">${callType === 'video' ? '视频通话中...' : '语音通话中...'}</div>
                    <div class="facetime-buttons">
                        ${callType === 'video' ? `
                            <button class="facetime-btn video" id="mute-video" title="关闭摄像头">📷</button>
                        ` : ''}
                        <button class="facetime-btn" style="background:rgba(255,255,255,0.2);color:#fff;" id="mute-audio" title="静音">🎤</button>
                        <button class="facetime-btn end" id="end-call" title="挂断">📞</button>
                    </div>
                </div>
            `;

            let duration = 0;
            const timer = setInterval(() => {
                duration++;
                const mins = Math.floor(duration / 60);
                const secs = duration % 60;
                const statusEl = body.querySelector('#call-status');
                if (statusEl) statusEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }, 1000);

            body.querySelector('#end-call').addEventListener('click', () => {
                clearInterval(timer);
                isInCall = false;
                callType = null;
                render();
            });
            return;
        }

        const contact = contacts.find(c => c.id === selectedContactId);
        if (contact) {
            body.innerHTML = `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg-elevated);gap:24px;">
                    <div style="width:120px;height:120px;border-radius:50%;background:${contact.color};display:flex;align-items:center;justify-content:center;font-size:48px;color:#fff;">${contact.avatar}</div>
                    <div style="font-size:28px;font-weight:600;">${contact.name}</div>
                    <div style="display:flex;gap:32px;margin-top:24px;">
                        <button class="facetime-btn audio" id="call-audio" title="语音通话">📞</button>
                        <button class="facetime-btn video" id="call-video" title="视频通话">📹</button>
                    </div>
                    <button id="back-btn" style="margin-top:16px;padding:8px 16px;border:1px solid var(--border-color);background:var(--button-bg);border-radius:6px;cursor:pointer;">返回</button>
                </div>
            `;

            body.querySelector('#call-audio').addEventListener('click', () => {
                isInCall = true;
                callType = 'audio';
                render();
            });

            body.querySelector('#call-video').addEventListener('click', () => {
                isInCall = true;
                callType = 'video';
                render();
            });

            body.querySelector('#back-btn').addEventListener('click', () => {
                selectedContactId = null;
                render();
            });
            return;
        }

        body.innerHTML = `
            <div style="flex:1;display:flex;align-items:center;justify-content:center;background:var(--bg-elevated);color:var(--text-tertiary);">
                <div style="text-align:center;">
                    <div style="font-size:64px;margin-bottom:16px;">📹</div>
                    <div>选择一位联系人开始通话</div>
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
