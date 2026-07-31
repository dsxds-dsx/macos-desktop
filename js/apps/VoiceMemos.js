window.renderVoiceMemos = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_voice_memos_v2';

    // SVG icons (macOS Sonoma style)
    const ICONS = {
        all: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h2l2-7 4 14 3-9 2 5h5"/></svg>`,
        favorites: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        trash: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
        record: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>`,
        stop: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`,
        play: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
        pause: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`,
        skipBack: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 6h2v12H6zM9.5 12l8.5 6V6z"/></svg>`,
        skipForward: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 6h2v12h-2zM6 6v12l8.5-6z"/></svg>`,
        search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
        edit: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
        share: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>`,
        trim: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
        back: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
        more: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`,
        waveform: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="10" x2="3" y2="14"/><line x1="7" y1="6" x2="7" y2="18"/><line x1="11" y1="3" x2="11" y2="21"/><line x1="15" y1="8" x2="15" y2="16"/><line x1="19" y1="11" x2="19" y2="13"/></svg>`
    };

    let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
        activeTab: 'all',
        searchQuery: '',
        selectedId: null,
        favorites: []
    };

    let recordings = JSON.parse(localStorage.getItem('macos_voice_memos_data') || 'null') || [
        { id: 'r1', name: '新录音', date: Date.now() - 1000 * 60 * 30, duration: 23, trash: false },
        { id: 'r2', name: '会议记录', date: Date.now() - 1000 * 60 * 60 * 26, duration: 754, trash: false },
        { id: 'r3', name: '想法灵感', date: Date.now() - 1000 * 60 * 60 * 48, duration: 128, trash: false },
        { id: 'r4', name: '采访记录', date: Date.now() - 1000 * 60 * 60 * 72, duration: 3420, trash: false },
        { id: 'r5', name: '英语练习', date: Date.now() - 1000 * 60 * 60 * 96, duration: 540, trash: false }
    ];

    let isRecording = false;
    let recordTime = 0;
    let recordInterval = null;
    let recordWave = [];

    let playbackId = null;
    let playbackTime = 0;
    let playbackInterval = null;
    let isPlaying = false;

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function saveRecordings() {
        localStorage.setItem('macos_voice_memos_data', JSON.stringify(recordings));
    }

    function formatDuration(seconds) {
        seconds = Math.max(0, Math.floor(seconds));
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) {
            return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        return `${m}:${String(s).padStart(2, '0')}`;
    }

    function formatRelativeDate(ts) {
        const now = Date.now();
        const diff = now - ts;
        const day = 1000 * 60 * 60 * 24;
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
        const today = new Date().setHours(0, 0, 0, 0);
        const tsDay = new Date(ts).setHours(0, 0, 0, 0);
        if (tsDay === today) return `今天 ${formatTime(ts)}`;
        if (tsDay === today - day) return `昨天 ${formatTime(ts)}`;
        const d = new Date(ts);
        const month = d.getMonth() + 1;
        const date = d.getDate();
        const hour = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${month}月${date}日 ${hour}:${min}`;
    }

    function formatTime(ts) {
        const d = new Date(ts);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    function getRecordings() {
        let list = recordings;
        if (state.activeTab === 'favorites') {
            list = list.filter(r => state.favorites.includes(r.id));
        } else if (state.activeTab === 'trash') {
            list = list.filter(r => r.trash);
        } else {
            list = list.filter(r => !r.trash);
        }
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            list = list.filter(r => r.name.toLowerCase().includes(q));
        }
        return list.sort((a, b) => b.date - a.date);
    }

    function generateRandomWave(length = 60, seed = 0) {
        const wave = [];
        let prev = 0.3;
        for (let i = 0; i < length; i++) {
            const noise = (Math.sin(i * 0.5 + seed) + Math.sin(i * 0.2 + seed * 2) * 0.7 + (Math.random() - 0.5) * 1.2) / 2.4;
            prev = Math.max(0.08, Math.min(1, prev * 0.55 + (noise * 0.5 + 0.5) * 0.45));
            wave.push(prev);
        }
        return wave;
    }

    function getWaveForRecord(rec) {
        const seed = parseInt(rec.id.replace(/\D/g, '')) || 1;
        return generateRandomWave(80, seed);
    }

    function renderWaveHTML(wave, progress = 0) {
        return wave.map((v, i) => {
            const passed = (i / wave.length) <= progress;
            return `<span class="vm-wave-bar ${passed ? 'passed' : ''}" style="height:${Math.max(8, v * 100)}%"></span>`;
        }).join('');
    }

    function renderSidebar() {
        const counts = {
            all: recordings.filter(r => !r.trash).length,
            favorites: state.favorites.filter(id => recordings.find(r => r.id === id && !r.trash)).length,
            trash: recordings.filter(r => r.trash).length
        };

        return `
            <div class="vm-side">
                <div class="vm-side-header">
                    <div class="vm-side-eyebrow">语音备忘录</div>
                    <h1 class="vm-side-title">录音</h1>
                </div>
                <div class="vm-search">
                    ${ICONS.search}
                    <input type="text" id="vm-search-input" placeholder="搜索" value="${state.searchQuery.replace(/"/g, '&quot;')}">
                </div>
                <div class="vm-nav">
                    <div class="vm-nav-item ${state.activeTab === 'all' ? 'active' : ''}" data-tab="all">
                        ${ICONS.all}
                        <span>所有录音</span>
                        ${counts.all ? `<span class="vm-count">${counts.all}</span>` : ''}
                    </div>
                    <div class="vm-nav-item ${state.activeTab === 'favorites' ? 'active' : ''}" data-tab="favorites">
                        ${ICONS.favorites}
                        <span>个人收藏</span>
                        ${counts.favorites ? `<span class="vm-count">${counts.favorites}</span>` : ''}
                    </div>
                    <div class="vm-nav-sep"></div>
                    <div class="vm-nav-item ${state.activeTab === 'trash' ? 'active' : ''}" data-tab="trash">
                        ${ICONS.trash}
                        <span>最近删除</span>
                        ${counts.trash ? `<span class="vm-count">${counts.trash}</span>` : ''}
                    </div>
                </div>
                <div class="vm-side-footer">
                    <div class="vm-storage-card">
                        <div class="vm-storage-bar"><div class="vm-storage-fill" style="width:34%"></div></div>
                        <div class="vm-storage-text">
                            <span>已使用 1.2 GB</span>
                            <span class="vm-storage-total">/ 5 GB</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderRecordingList(list) {
        if (list.length === 0) {
            const msg = state.activeTab === 'trash' ? '废纸篓是空的' : state.searchQuery ? `未找到与“${state.searchQuery}”匹配的录音` : '没有录音';
            return `
                <div class="vm-empty">
                    <div class="vm-empty-icon">${ICONS.waveform}</div>
                    <div class="vm-empty-title">${msg}</div>
                    <div class="vm-empty-sub">${state.searchQuery ? '尝试其他搜索词' : '点击下方按钮开始你的第一次录音'}</div>
                </div>
            `;
        }

        return `
            <div class="vm-list">
                ${list.map(rec => {
                    const isFav = state.favorites.includes(rec.id);
                    const isSel = state.selectedId === rec.id;
                    const wave = getWaveForRecord(rec);
                    const playing = playbackId === rec.id;
                    return `
                        <div class="vm-item ${isSel ? 'selected' : ''} ${playing ? 'playing' : ''}" data-id="${rec.id}">
                            <button class="vm-play-mini" data-action="play" data-id="${rec.id}">
                                ${playing && isPlaying ? ICONS.pause : ICONS.play}
                            </button>
                            <div class="vm-item-info">
                                <div class="vm-item-top">
                                    <span class="vm-item-name">${escapeHtml(rec.name)}</span>
                                    ${isFav ? `<span class="vm-fav-mark">${ICONS.favorites}</span>` : ''}
                                </div>
                                <div class="vm-item-wave">
                                    ${renderWaveHTML(wave, playing ? playbackTime / Math.max(1, rec.duration) : 0)}
                                </div>
                                <div class="vm-item-meta">
                                    <span class="vm-time">${formatRelativeDate(rec.date)}</span>
                                    <span class="vm-dot">·</span>
                                    <span class="vm-duration">${formatDuration(rec.duration)}</span>
                                    ${playing ? `<span class="vm-dot">·</span><span class="vm-progress-time">${formatDuration(playbackTime)}</span>` : ''}
                                </div>
                            </div>
                            <button class="vm-item-more" data-action="more" data-id="${rec.id}">${ICONS.more}</button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderRecordBar() {
        return `
            <div class="vm-record-bar ${isRecording ? 'recording' : ''}">
                <div class="vm-record-time">
                    <div class="vm-timer ${isRecording ? 'live' : ''}">
                        ${isRecording ? formatDuration(recordTime) : ''}
                    </div>
                    <div class="vm-record-status">
                        ${isRecording ? '正在录音' : '没有正在进行的录音'}
                    </div>
                </div>
                <button class="vm-record-btn ${isRecording ? 'recording' : ''}" id="vm-record-btn" title="${isRecording ? '停止录音' : '开始录音'}">
                    ${isRecording ? ICONS.stop : ICONS.record}
                </button>
                ${isRecording ? `
                    <button class="vm-finish-btn" id="vm-finish-btn">完成</button>
                ` : `
                    <div class="vm-record-hint">点按或按下空格键以开始录音</div>
                `}
            </div>
        `;
    }

    function renderMain() {
        const list = getRecordings();
        const selected = state.selectedId ? recordings.find(r => r.id === state.selectedId) : null;

        if (selected && !selected.trash) {
            return renderDetailView(selected);
        }

        const headerTitle = state.activeTab === 'trash' ? '最近删除' : state.activeTab === 'favorites' ? '个人收藏' : '所有录音';

        return `
            <main class="vm-main">
                <div class="vm-list-view">
                    <div class="vm-list-header">
                        <div>
                            <div class="vm-header-eyebrow">语音备忘录</div>
                            <h2 class="vm-header-title">${headerTitle}</h2>
                            <div class="vm-header-sub">${list.length} 个录音</div>
                        </div>
                    </div>
                    ${renderRecordingList(list)}
                </div>
                ${renderRecordBar()}
            </main>
        `;
    }

    function renderDetailView(rec) {
        const wave = getWaveForRecord(rec);
        const isFav = state.favorites.includes(rec.id);
        const playing = playbackId === rec.id;
        const progress = playing ? playbackTime / Math.max(1, rec.duration) : 0;

        return `
            <main class="vm-main">
                <div class="vm-detail">
                    <div class="vm-detail-toolbar">
                        <button class="vm-back-btn" data-action="back">${ICONS.back}<span>录音</span></button>
                        <div class="vm-detail-tools">
                            <button class="vm-tool-btn" data-action="share" title="分享">${ICONS.share}</button>
                            <button class="vm-tool-btn" data-action="trim" title="编辑">${ICONS.trim}</button>
                            <button class="vm-tool-btn ${isFav ? 'active' : ''}" data-action="fav" title="收藏">${ICONS.favorites}</button>
                        </div>
                    </div>
                    <div class="vm-detail-scroll">
                        <div class="vm-detail-hero">
                            <div class="vm-detail-title-row">
                                <h1 class="vm-detail-name">${escapeHtml(rec.name)}</h1>
                                <button class="vm-edit-name" data-action="rename" title="重命名">${ICONS.edit}</button>
                            </div>
                            <div class="vm-detail-date">${formatRelativeDate(rec.date)}</div>
                        </div>

                        <div class="vm-player">
                            <div class="vm-player-time vm-player-current">${formatDuration(playing ? playbackTime : 0)}</div>
                            <div class="vm-player-wave" data-action="seek">
                                ${renderWaveHTML(wave, progress)}
                            </div>
                            <div class="vm-player-time vm-player-total">${formatDuration(rec.duration)}</div>
                        </div>

                        <div class="vm-player-controls">
                            <button class="vm-ctrl-btn" data-action="seek-back" title="后退 15 秒">${ICONS.skipBack}</button>
                            <button class="vm-play-main" data-action="play-main" data-id="${rec.id}">
                                ${playing && isPlaying ? ICONS.pause : ICONS.play}
                            </button>
                            <button class="vm-ctrl-btn" data-action="seek-forward" title="前进 15 秒">${ICONS.skipForward}</button>
                        </div>

                        <div class="vm-info-grid">
                            <div class="vm-info-cell">
                                <div class="vm-info-label">时长</div>
                                <div class="vm-info-value">${formatDuration(rec.duration)}</div>
                            </div>
                            <div class="vm-info-cell">
                                <div class="vm-info-label">大小</div>
                                <div class="vm-info-value">${(rec.duration * 0.016).toFixed(1)} MB</div>
                            </div>
                            <div class="vm-info-cell">
                                <div class="vm-info-label">采样率</div>
                                <div class="vm-info-value">44.1 kHz</div>
                            </div>
                            <div class="vm-info-cell">
                                <div class="vm-info-label">格式</div>
                                <div class="vm-info-value">M4A</div>
                            </div>
                        </div>

                        <div class="vm-transcript">
                            <div class="vm-section-title">录音文字稿</div>
                            <p class="vm-transcript-text">这是 ${escapeHtml(rec.name)} 的内容预览。语音备忘录支持自动生成文字稿，让你能快速浏览录音要点。在 macOS Sonoma 中，你可以直接搜索录音中的内容，并跳转到对应的音频位置。</p>
                        </div>
                    </div>
                </div>
                ${renderRecordBar()}
            </main>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.innerHTML = `<div class="vm-app">${renderSidebar()}${renderMain()}</div>`;
        bindEvents();
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function showToast(text) {
        if (window.Toast) {
            window.Toast.show(text);
        }
    }

    async function showMacPrompt(title, placeholder, defaultValue, cb) {
        if (window.DialogSystem && window.DialogSystem.prompt) {
            window.DialogSystem.prompt(title, placeholder, defaultValue, cb);
        } else if (window.DialogSystem && window.DialogSystem.confirm) {
            const name = await window.showPrompt(title, { value: defaultValue, placeholder });
            if (name != null) cb(name);
        } else {
            const name = await window.showPrompt(title, { value: defaultValue, placeholder });
            if (name != null) cb(name);
        }
    }

    async function showMacConfirm(title, message, cb) {
        if (window.DialogSystem && window.DialogSystem.confirm) {
            window.DialogSystem.confirm(title, message, cb);
        } else {
            const ok = await window.showConfirm(title, { subtitle: message });
            if (ok) cb();
        }
    }

    function togglePlay(recId) {
        const rec = recordings.find(r => r.id === recId);
        if (!rec) return;

        if (playbackId === recId && isPlaying) {
            isPlaying = false;
            clearInterval(playbackInterval);
            playbackInterval = null;
        } else {
            if (playbackId === recId) {
                // resume
            } else {
                playbackId = recId;
                playbackTime = 0;
            }
            isPlaying = true;
            if (playbackInterval) clearInterval(playbackInterval);
            playbackInterval = setInterval(() => {
                playbackTime += 0.5;
                if (playbackTime >= rec.duration) {
                    playbackTime = 0;
                    isPlaying = false;
                    clearInterval(playbackInterval);
                    playbackInterval = null;
                }
                updatePlayback();
            }, 500);
        }
        render();
    }

    function updatePlayback() {
        // Lightweight update: just re-render
        render();
    }

    function seekPlayback(seconds) {
        if (!playbackId) return;
        const rec = recordings.find(r => r.id === playbackId);
        if (!rec) return;
        playbackTime = Math.max(0, Math.min(rec.duration, playbackTime + seconds));
        render();
    }

    function seekToPosition(ratio) {
        if (!playbackId) return;
        const rec = recordings.find(r => r.id === playbackId);
        if (!rec) return;
        playbackTime = Math.max(0, Math.min(rec.duration, rec.duration * ratio));
        render();
    }

    function startRecording() {
        isRecording = true;
        recordTime = 0;
        recordWave = [];
        recordInterval = setInterval(() => {
            recordTime += 0.2;
            recordWave.push(Math.random() * 0.8 + 0.2);
            if (recordWave.length > 80) recordWave.shift();
            if (Math.floor(recordTime * 5) % 5 === 0) {
                render();
            }
        }, 200);
        render();
    }

    function stopRecording() {
        if (!isRecording) return;
        clearInterval(recordInterval);
        recordInterval = null;
        const duration = Math.floor(recordTime);
        if (duration > 0) {
            const newRec = {
                id: 'r' + Date.now(),
                name: `新录音 ${recordings.filter(r => !r.trash).length + 1}`,
                date: Date.now(),
                duration: duration,
                trash: false
            };
            recordings.unshift(newRec);
            saveRecordings();
            state.selectedId = newRec.id;
            saveState();
            showToast(`已保存录音 · ${formatDuration(duration)}`);
        }
        isRecording = false;
        recordTime = 0;
        recordWave = [];
        render();
    }

    function bindEvents() {
        // Sidebar nav
        body.querySelectorAll('.vm-nav-item').forEach(el => {
            el.addEventListener('click', () => {
                state.activeTab = el.dataset.tab;
                state.selectedId = null;
                saveState();
                render();
            });
        });

        // Search
        const searchInput = body.querySelector('#vm-search-input');
        if (searchInput) {
            let timer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timer);
                const val = e.target.value;
                timer = setTimeout(() => {
                    state.searchQuery = val;
                    saveState();
                    render();
                    const newInput = body.querySelector('#vm-search-input');
                    if (newInput) {
                        newInput.focus();
                        newInput.setSelectionRange(val.length, val.length);
                    }
                }, 200);
            });
        }

        // Record button
        const recordBtn = body.querySelector('#vm-record-btn');
        if (recordBtn) {
            recordBtn.addEventListener('click', () => {
                if (isRecording) {
                    stopRecording();
                } else {
                    startRecording();
                }
            });
        }
        const finishBtn = body.querySelector('#vm-finish-btn');
        if (finishBtn) {
            finishBtn.addEventListener('click', stopRecording);
        }

        // List item actions
        body.querySelectorAll('.vm-item').forEach(el => {
            const id = el.dataset.id;
            el.addEventListener('click', (e) => {
                if (e.target.closest('[data-action]')) return;
                state.selectedId = id;
                saveState();
                render();
            });
        });

        body.querySelectorAll('[data-action="play"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlay(btn.dataset.id);
            });
        });

        body.querySelectorAll('[data-action="more"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showItemMenu(btn.dataset.id, e.currentTarget);
            });
        });

        // Detail view actions
        body.querySelectorAll('[data-action="back"]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.selectedId = null;
                saveState();
                render();
            });
        });

        body.querySelectorAll('[data-action="play-main"]').forEach(btn => {
            btn.addEventListener('click', () => togglePlay(btn.dataset.id));
        });

        body.querySelectorAll('[data-action="seek-back"]').forEach(btn => {
            btn.addEventListener('click', () => seekPlayback(-15));
        });

        body.querySelectorAll('[data-action="seek-forward"]').forEach(btn => {
            btn.addEventListener('click', () => seekPlayback(15));
        });

        body.querySelectorAll('[data-action="seek"]').forEach(el => {
            el.addEventListener('click', (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                seekToPosition(ratio);
            });
        });

        body.querySelectorAll('[data-action="rename"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const rec = recordings.find(r => r.id === state.selectedId);
                if (!rec) return;
                showMacPrompt('重命名录音', '输入新名称', rec.name, (newName) => {
                    if (newName && newName.trim()) {
                        rec.name = newName.trim();
                        saveRecordings();
                        render();
                    }
                });
            });
        });

        body.querySelectorAll('[data-action="fav"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = state.favorites.indexOf(state.selectedId);
                if (idx > -1) {
                    state.favorites.splice(idx, 1);
                    showToast('已从收藏移除');
                } else {
                    state.favorites.push(state.selectedId);
                    showToast('已添加到收藏');
                }
                saveState();
                render();
            });
        });

        body.querySelectorAll('[data-action="share"]').forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('分享功能：已复制录音链接');
            });
        });

        body.querySelectorAll('[data-action="trim"]').forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('修剪功能：拖动波形两端调整起止点');
            });
        });
    }

    function showItemMenu(recId, anchor) {
        const rec = recordings.find(r => r.id === recId);
        if (!rec) return;
        const isFav = state.favorites.includes(recId);

        const menu = document.createElement('div');
        menu.className = 'vm-context-menu';
        menu.innerHTML = `
            <div class="vm-ctx-item" data-act="play">播放录音</div>
            <div class="vm-ctx-item" data-act="rename">重命名…</div>
            <div class="vm-ctx-item" data-act="fav">${isFav ? '取消收藏' : '添加到收藏'}</div>
            <div class="vm-ctx-sep"></div>
            <div class="vm-ctx-item" data-act="share">分享…</div>
            <div class="vm-ctx-item" data-act="duplicate">复制</div>
            <div class="vm-ctx-sep"></div>
            <div class="vm-ctx-item danger" data-act="delete">${rec.trash ? '永久删除' : '移到废纸篓'}</div>
        `;
        document.body.appendChild(menu);

        const rect = anchor.getBoundingClientRect();
        let x = rect.right - 180;
        let y = rect.bottom + 4;
        if (x < 10) x = 10;
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        requestAnimationFrame(() => menu.classList.add('show'));

        const close = () => {
            menu.classList.remove('show');
            setTimeout(() => menu.remove(), 180);
            document.removeEventListener('click', onDocClick, true);
        };
        const onDocClick = (e) => {
            if (!menu.contains(e.target)) close();
        };
        setTimeout(() => document.addEventListener('click', onDocClick, true), 0);

        menu.querySelectorAll('.vm-ctx-item').forEach(item => {
            item.addEventListener('click', () => {
                const act = item.dataset.act;
                close();
                handleItemAction(act, recId);
            });
        });
    }

    function handleItemAction(act, recId) {
        const rec = recordings.find(r => r.id === recId);
        if (!rec) return;
        switch (act) {
            case 'play':
                togglePlay(recId);
                break;
            case 'rename':
                showMacPrompt('重命名录音', '输入新名称', rec.name, (newName) => {
                    if (newName && newName.trim()) {
                        rec.name = newName.trim();
                        saveRecordings();
                        render();
                    }
                });
                break;
            case 'fav':
                const idx = state.favorites.indexOf(recId);
                if (idx > -1) {
                    state.favorites.splice(idx, 1);
                    showToast('已从收藏移除');
                } else {
                    state.favorites.push(recId);
                    showToast('已添加到收藏');
                }
                saveState();
                render();
                break;
            case 'share':
                showToast('分享功能：已复制录音链接');
                break;
            case 'duplicate':
                const copy = { ...rec, id: 'r' + Date.now(), name: rec.name + ' 副本', date: Date.now() };
                recordings.unshift(copy);
                saveRecordings();
                render();
                showToast('已复制录音');
                break;
            case 'delete':
                if (rec.trash) {
                    showMacConfirm('永久删除录音', `“${rec.name}”将被永久删除，此操作无法撤销。`, () => {
                        recordings = recordings.filter(r => r.id !== recId);
                        state.favorites = state.favorites.filter(id => id !== recId);
                        if (state.selectedId === recId) state.selectedId = null;
                        saveRecordings();
                        saveState();
                        render();
                        showToast('录音已永久删除');
                    });
                } else {
                    rec.trash = true;
                    saveRecordings();
                    render();
                    showToast('已移到废纸篓');
                }
                break;
        }
    }

    function handleKeyDown(e) {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    render();

    return () => {
        if (recordInterval) clearInterval(recordInterval);
        if (playbackInterval) clearInterval(playbackInterval);
        document.removeEventListener('keydown', handleKeyDown);
    };
};
