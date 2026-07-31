// GarageBand - 音乐制作 (macOS Sonoma)
window.renderGarageBand = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_garageband_v2';

    function defaultTracks() {
        return [
            { id: 1, name: '经典电钢琴', type: 'piano', muted: false, solo: false, volume: 80, color: '#4A90D9', icon: 'piano' },
            { id: 2, name: '原声鼓组', type: 'drums', muted: false, solo: false, volume: 85, color: '#D94A4A', icon: 'drums' },
            { id: 3, name: '电贝司', type: 'bass', muted: false, solo: false, volume: 70, color: '#4AD97A', icon: 'bass' },
            { id: 4, name: '合成器主音', type: 'synth', muted: true, solo: false, volume: 65, color: '#D9A64A', icon: 'synth' }
        ];
    }

    function defaultState() {
        return {
            tracks: defaultTracks(),
            tempo: 120,
            masterVolume: 75,
            isPlaying: false,
            position: 0,
            currentTrackId: 1,
            nextId: 5
        };
    }

    function migrateOld() {
        // Old version had no persistent state
        return null;
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || migrateOld() || defaultState();
    if (!Array.isArray(data.tracks) || !data.tracks.length) data.tracks = defaultTracks();
    data.isPlaying = false; // Never resume playback on reload

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    function showToast(text, type) {
        if (window.toast) window.toast(text, type || 'info');
        else if (window.Toast) window.Toast.show(text);
    }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function getTrack(id) { return data.tracks.find(t => t.id === id); }
    function getCurrentTrack() { return getTrack(data.currentTrackId) || data.tracks[0]; }

    const TOTAL_BARS = 32;
    const TRACK_DURATION_SEC = 204; // ~3:24

    // ----- SVG icons -----
    const ICON = {
        play: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
        pause: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
        stop: '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>',
        record: '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><circle cx="12" cy="12" r="7"/></svg>',
        rewind: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M11 12l9-6v12zM2 12l9-6v12z"/></svg>',
        add: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
        delete: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        volume: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
        piano: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="13" rx="1"/><path d="M8 6v8M14 6v8M18 6v8" stroke-width="1.4"/></svg>',
        drums: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="8" rx="9" ry="3"/><path d="M3 8v6c0 1.66 4 3 9 3s9-1.34 9-3V8"/><path d="M8 14v6M16 14v6"/></svg>',
        bass: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8M9 4l3-2 3 2M5 14c0 4 3 6 7 6s7-2 7-6-3-4-7-4-7 0-7 4z"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>',
        synth: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><line x1="7" y1="10" x2="7" y2="14"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="17" y1="10" x2="17" y2="14"/></svg>',
        mic: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/></svg>',
        guitar: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="16" r="5"/><path d="M12 12l9-9M16 4l3 3M18 6l-2-2"/></svg>',
        strings: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4v16M10 4v16M15 4v16M20 4v16"/></svg>',
        brass: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h14a3 3 0 0 1 0 6h-1l-3 5h-4l3-5H3z"/><path d="M3 9V7"/></svg>',
        mute: '<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="700" font-family="sans-serif">M</text></svg>',
        solo: '<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="700" font-family="sans-serif">S</text></svg>'
    };

    const trackTypes = [
        { id: 'piano', name: '键盘', icon: 'piano', color: '#4A90D9' },
        { id: 'guitar', name: '吉他', icon: 'guitar', color: '#D94A4A' },
        { id: 'drums', name: '鼓', icon: 'drums', color: '#E67E22' },
        { id: 'bass', name: '贝司', icon: 'bass', color: '#4AD97A' },
        { id: 'synth', name: '合成器', icon: 'synth', color: '#D9A64A' },
        { id: 'strings', name: '弦乐', icon: 'strings', color: '#9B59B6' },
        { id: 'brass', name: '铜管', icon: 'brass', color: '#F39C12' },
        { id: 'vocal', name: '人声', icon: 'mic', color: '#E84393' }
    ];

    function getTrackIcon(type) {
        const t = trackTypes.find(tt => tt.id === type);
        return t ? t.icon : 'piano';
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    let playTimer = null;
    function startPlayback() {
        if (data.isPlaying) return;
        data.isPlaying = true;
        let startedAt = Date.now();
        let startPos = data.position;
        playTimer = setInterval(() => {
            let elapsed = (Date.now() - startedAt) / 1000;
            data.position = startPos + elapsed;
            if (data.position >= TRACK_DURATION_SEC) {
                data.position = 0;
                startPos = 0;
                startedAt = Date.now();
            }
            updateTransport();
        }, 100);
        save();
        renderToolbar();
    }
    function stopPlayback() {
        if (playTimer) { clearInterval(playTimer); playTimer = null; }
        data.isPlaying = false;
        save();
        renderToolbar();
    }
    function resetPlayback() {
        if (playTimer) { clearInterval(playTimer); playTimer = null; }
        data.isPlaying = false;
        data.position = 0;
        save();
        renderToolbar();
        renderTimeline();
    }

    function updateTransport() {
        const progressEl = body.querySelector('#gb-progress');
        const timeEl = body.querySelector('#gb-time');
        const playhead = body.querySelector('#gb-playhead');
        if (progressEl) progressEl.style.width = (data.position / TRACK_DURATION_SEC * 100) + '%';
        if (timeEl) timeEl.textContent = formatTime(data.position) + ' / ' + formatTime(TRACK_DURATION_SEC);
        if (playhead) playhead.style.left = (data.position / TRACK_DURATION_SEC * 100) + '%';
    }

    // ----- Rendering -----
    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div class="gb-toolbar">
                <div class="gb-transport">
                    <button class="gb-transport-btn rewind" id="gb-rewind" title="回到开始">${ICON.rewind}</button>
                    <button class="gb-transport-btn stop" id="gb-stop" title="停止">${ICON.stop}</button>
                    <button class="gb-transport-btn play ${data.isPlaying ? 'active' : ''}" id="gb-play" title="${data.isPlaying ? '暂停' : '播放'}">${data.isPlaying ? ICON.pause : ICON.play}</button>
                    <button class="gb-transport-btn record" id="gb-record" title="录音">${ICON.record}</button>
                </div>
                <div class="gb-progress-wrap">
                    <div class="gb-progress-track">
                        <div class="gb-progress-fill" id="gb-progress" style="width:${(data.position / TRACK_DURATION_SEC) * 100}%"></div>
                    </div>
                    <span class="gb-time" id="gb-time">${formatTime(data.position)} / ${formatTime(TRACK_DURATION_SEC)}</span>
                </div>
                <div class="gb-tb-sep"></div>
                <div class="gb-bpm-control">
                    <span class="gb-bpm-label">BPM</span>
                    <input type="number" id="gb-tempo" value="${data.tempo}" min="40" max="240">
                </div>
                <div class="gb-master-volume">
                    ${ICON.volume}
                    <input type="range" id="gb-master-vol" min="0" max="100" value="${data.masterVolume}">
                </div>
                <div style="flex:1;"></div>
                <button class="gb-tb-btn primary" id="gb-addTrack">${ICON.add}<span>新轨道</span></button>
            </div>
        `;
        toolbar.querySelector('#gb-rewind')?.addEventListener('click', resetPlayback);
        toolbar.querySelector('#gb-stop')?.addEventListener('click', stopPlayback);
        toolbar.querySelector('#gb-play')?.addEventListener('click', () => {
            if (data.isPlaying) stopPlayback();
            else startPlayback();
        });
        toolbar.querySelector('#gb-record')?.addEventListener('click', () => {
            showToast('准备录制（演示应用，录音功能不可用）', 'info');
        });
        toolbar.querySelector('#gb-tempo')?.addEventListener('change', (e) => {
            let v = parseInt(e.target.value, 10);
            if (isNaN(v)) v = 120;
            v = Math.max(40, Math.min(240, v));
            data.tempo = v;
            e.target.value = v;
            save();
        });
        toolbar.querySelector('#gb-master-vol')?.addEventListener('input', (e) => {
            data.masterVolume = parseInt(e.target.value, 10);
            save();
        });
        toolbar.querySelector('#gb-addTrack')?.addEventListener('click', async () => {
            const t = trackTypes[Math.floor(Math.random() * trackTypes.length)];
            const newTrack = {
                id: data.nextId++,
                name: t.name + ' ' + (data.tracks.length + 1),
                type: t.id,
                muted: false, solo: false,
                volume: 75,
                color: t.color,
                icon: t.icon
            };
            data.tracks.push(newTrack);
            data.currentTrackId = newTrack.id;
            save();
            renderSidebar();
            renderContent();
            showToast('已添加轨道：' + newTrack.name, 'success');
        });
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="gb-sidebar">
                <div class="gb-sidebar-head">
                    <span class="gb-sidebar-title">轨道</span>
                    <span class="gb-sidebar-count">${data.tracks.length}</span>
                </div>
                <div class="gb-tracks-list" id="gb-tracks-list">
                    ${data.tracks.map(t => {
                        const icon = ICON[t.icon] || ICON.piano;
                        return `
                            <div class="gb-track-item ${data.currentTrackId === t.id ? 'active' : ''}" data-id="${t.id}" style="--track-color:${t.color};">
                                <div class="gb-track-header">
                                    <span class="gb-track-icon" style="color:${t.color};">${icon}</span>
                                    <span class="gb-track-name">${escapeHtml(t.name)}</span>
                                </div>
                                <div class="gb-track-controls">
                                    <button class="gb-track-btn mute ${t.muted ? 'active' : ''}" data-id="${t.id}" data-action="mute" title="静音">${ICON.mute}</button>
                                    <button class="gb-track-btn solo ${t.solo ? 'active' : ''}" data-id="${t.id}" data-action="solo" title="独奏">${ICON.solo}</button>
                                    <input type="range" class="gb-track-vol" data-id="${t.id}" min="0" max="100" value="${t.volume}" title="音量">
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="gb-library">
                    <div class="gb-library-head">
                        <span class="gb-library-title">资源库</span>
                    </div>
                    <div class="gb-library-list">
                        ${trackTypes.map(t => `
                            <div class="gb-library-item" data-type="${t.id}" title="添加 ${t.name}">
                                <span style="color:${t.color};">${ICON[t.icon]}</span>
                                <span>${t.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        sidebar.querySelectorAll('.gb-track-item').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.closest('button') || e.target.tagName === 'INPUT') return;
                data.currentTrackId = parseInt(el.dataset.id, 10);
                save();
                renderSidebar();
                renderContent();
            });
        });
        sidebar.querySelectorAll('.gb-track-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id, 10);
                const track = getTrack(id);
                if (!track) return;
                const action = btn.dataset.action;
                if (action === 'mute') track.muted = !track.muted;
                else if (action === 'solo') track.solo = !track.solo;
                save();
                renderSidebar();
            });
        });
        sidebar.querySelectorAll('.gb-track-vol').forEach(inp => {
            inp.addEventListener('input', (e) => {
                e.stopPropagation();
                const id = parseInt(inp.dataset.id, 10);
                const track = getTrack(id);
                if (track) {
                    track.volume = parseInt(inp.value, 10);
                    save();
                }
            });
        });
        sidebar.querySelectorAll('.gb-library-item').forEach(el => {
            el.addEventListener('click', () => {
                const typeId = el.dataset.type;
                const t = trackTypes.find(tt => tt.id === typeId);
                if (!t) return;
                const newTrack = {
                    id: data.nextId++,
                    name: t.name + ' ' + (data.tracks.length + 1),
                    type: t.id,
                    muted: false, solo: false,
                    volume: 75,
                    color: t.color,
                    icon: t.icon
                };
                data.tracks.push(newTrack);
                data.currentTrackId = newTrack.id;
                save();
                renderSidebar();
                renderContent();
                showToast('已添加 ' + t.name + ' 轨道', 'success');
            });
        });
    }

    function renderContent() {
        body.className = 'window-body app-content gb-body';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';

        body.innerHTML = `
            <div class="gb-timeline">
                <div class="gb-ruler" id="gb-ruler">
                    ${Array.from({ length: TOTAL_BARS }, (_, i) => {
                        const isEvery4 = (i % 4) === 0;
                        return `<div class="gb-ruler-bar ${isEvery4 ? 'major' : ''}">${isEvery4 ? (i + 1) : ''}</div>`;
                    }).join('')}
                </div>
                <div class="gb-tracks-area" id="gb-tracks-area">
                    ${data.tracks.map((t, i) => {
                        // Synthesize clip positions based on track id for stability
                        const clips = [
                            { start: 0, len: 8 },
                            { start: 12, len: 16 },
                            { start: 28, len: 4 }
                        ];
                        return `
                            <div class="gb-track-row ${i % 2 === 0 ? 'even' : 'odd'} ${data.currentTrackId === t.id ? 'active' : ''}" data-id="${t.id}" style="--track-color:${t.color};">
                                ${clips.map(clip => {
                                    const leftPct = clip.start / TOTAL_BARS * 100;
                                    const widthPct = clip.len / TOTAL_BARS * 100;
                                    return `
                                        <div class="gb-clip" style="left:${leftPct}%;width:${widthPct}%;background:${t.color};" data-id="${t.id}">
                                            <svg class="gb-clip-wave" viewBox="0 0 200 40" preserveAspectRatio="none">
                                                <polyline points="${Array.from({ length: 50 }, (_, j) => `${j * 4},${20 + Math.sin(j * 0.5 + t.id) * 10 + Math.cos(j * 0.3) * 6}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/>
                                            </svg>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        `;
                    }).join('')}
                    <div class="gb-playhead" id="gb-playhead" style="left:${(data.position / TRACK_DURATION_SEC) * 100}%;"></div>
                </div>
            </div>
        `;

        body.querySelectorAll('.gb-track-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.gb-clip')) return;
                data.currentTrackId = parseInt(row.dataset.id, 10);
                save();
                renderSidebar();
                renderContent();
            });
        });
    }

    function renderTimeline() {
        // Just update the playhead position
        updateTransport();
    }

    function render() {
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    // Cleanup on window close
    if (windowId) {
        const cleanupKey = `garageband_cleanup_${windowId}`;
        if (window[cleanupKey]) window[cleanupKey]();
        window[cleanupKey] = () => {
            if (playTimer) { clearInterval(playTimer); playTimer = null; }
        };
    }

    render();
};
