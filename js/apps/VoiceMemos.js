window.renderVoiceMemos = function(body, sidebar, toolbar, windowId) {
    let isRecording = false;
    let recordTime = 0;
    let recordInterval = null;
    let recordings = JSON.parse(localStorage.getItem('macos_voice_memos') || 'null') || [
        { id: '1', name: '新录音 1', date: '今天 10:30', duration: '0:23' },
        { id: '2', name: '会议记录', date: '昨天 15:42', duration: '12:34' },
        { id: '3', name: '想法灵感', date: '周一 09:15', duration: '2:08' }
    ];

    function saveRecordings() {
        localStorage.setItem('macos_voice_memos', JSON.stringify(recordings));
    }

    function formatDuration(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    }

    function generateWave() {
        let waves = '';
        for (let i = 0; i < 40; i++) {
            const h = Math.random() * 30 + 5;
            waves += `<span style="height:${h}px;${isRecording && i > 35 - (recordTime % 10) ? 'opacity:0.3;' : ''}"></span>`;
        }
        return waves;
    }

    function renderContent() {
        body.innerHTML = `
            <div class="voice-memos-body">
                <div class="voice-recordings">
                    ${recordings.map(rec => `
                        <div class="voice-recording">
                            <div style="width:36px;height:36px;border-radius:50%;background:var(--accent-red);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;">▶</div>
                            <div style="flex:1;">
                                <div style="font-size:14px;font-weight:500;color:#fff;margin-bottom:4px;">${rec.name}</div>
                                <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:8px;">${rec.date} · ${rec.duration}</div>
                                <div class="voice-wave">
                                    ${generateWave()}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="voice-controls">
                    <div style="text-align:center;margin-bottom:16px;">
                        <div style="font-size:48px;font-weight:200;color:#fff;font-family:'SF Mono',Monaco,monospace;">${formatDuration(recordTime)}</div>
                        <div style="font-size:14px;color:rgba(255,255,255,0.5);margin-top:4px;">${isRecording ? '正在录音...' : '点击按钮开始录音'}</div>
                    </div>
                    <button class="voice-record-btn ${isRecording ? 'recording' : ''}" id="record-btn"></button>
                </div>
            </div>
        `;

        body.querySelector('#record-btn').addEventListener('click', () => {
            if (isRecording) {
                clearInterval(recordInterval);
                recordings.unshift({
                    id: Date.now().toString(),
                    name: `新录音 ${recordings.length + 1}`,
                    date: '刚刚',
                    duration: formatDuration(recordTime)
                });
                saveRecordings();
                isRecording = false;
                recordTime = 0;
            } else {
                isRecording = true;
                recordTime = 0;
                recordInterval = setInterval(() => {
                    recordTime++;
                    renderContent();
                }, 1000);
            }
            renderContent();
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderContent();
    }

    render();

    return () => {
        if (recordInterval) clearInterval(recordInterval);
    };
};
