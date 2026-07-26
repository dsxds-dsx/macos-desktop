window.renderQuickTime = function(body, sidebar, toolbar, windowId) {
    let isPlaying = false;
    let progress = 0;
    let isMuted = false;
    let progressInterval = null;

    function renderContent() {
        body.innerHTML = `
            <div class="quicktime-body">
                <div class="quicktime-video">
                    <svg viewBox="0 0 24 24" width="120" height="120" fill="currentColor" style="color:#666;">
                        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                    </svg>
                </div>
                <div class="quicktime-controls">
                    <button class="quicktime-play" id="play-btn">
                        ${isPlaying ? 
                            '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' : 
                            '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'}
                    </button>
                    <div style="color:#fff;font-size:12px;min-width:80px;" id="time-display">0:00 / 1:32</div>
                    <div class="quicktime-bar" id="progress-bar">
                        <div class="quicktime-fill" id="progress-fill" style="width:${progress}%;"></div>
                    </div>
                    <button class="quicktime-play" id="mute-btn" style="width:32px;height:32px;">
                        ${isMuted ? '🔇' : '🔊'}
                    </button>
                </div>
            </div>
        `;

        body.querySelector('#play-btn').addEventListener('click', togglePlay);
        body.querySelector('#mute-btn').addEventListener('click', () => {
            isMuted = !isMuted;
            renderContent();
        });

        const progressBar = body.querySelector('#progress-bar');
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            progress = ((e.clientX - rect.left) / rect.width) * 100;
            updateProgress();
        });

        if (isPlaying) startProgress();
    }

    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) startProgress();
        else stopProgress();
        renderContent();
    }

    function startProgress() {
        stopProgress();
        progressInterval = setInterval(() => {
            progress += 0.3;
            if (progress >= 100) {
                progress = 0;
                isPlaying = false;
                stopProgress();
                renderContent();
            } else {
                updateProgress();
            }
        }, 100);
    }

    function stopProgress() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    function updateProgress() {
        const fill = body.querySelector('#progress-fill');
        const timeEl = body.querySelector('#time-display');
        if (fill) fill.style.width = progress + '%';
        if (timeEl) {
            const current = Math.floor((progress / 100) * 92);
            const mins = Math.floor(current / 60);
            const secs = current % 60;
            timeEl.textContent = `${mins}:${String(secs).padStart(2, '0')} / 1:32`;
        }
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderContent();
    }

    render();
};
