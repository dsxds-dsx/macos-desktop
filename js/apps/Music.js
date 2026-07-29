window.renderMusic = function(body, sidebar, toolbar, windowId) {
    // 持久化状态
    let state = JSON.parse(localStorage.getItem('macos_music_state') || 'null') || {
        currentView: 'library_songs',
        selectedAlbumId: 'a1',
        selectedPlaylistId: null,
        playingSongId: null,
        isPlaying: false,
        currentTime: 0,
        shuffle: false,
        repeat: 'off', // off / all / one
        volume: 0.7,
        searchQuery: ''
    };

    // 曲库数据
    const library = {
        albums: [
            { id: 'a1', title: '夜曲', artist: '周杰伦', year: 2005, color: 'linear-gradient(135deg,#1e3c72,#2a5298)', emoji: '🌙', songs: [
                { id: 's1', title: '夜曲', artist: '周杰伦', album: '夜曲', duration: 224 },
                { id: 's2', title: '蓝色风暴', artist: '周杰伦', album: '夜曲', duration: 268 },
                { id: 's3', title: '发如雪', artist: '周杰伦', album: '夜曲', duration: 252 },
                { id: 's4', title: '黑色毛衣', artist: '周杰伦', album: '夜曲', duration: 245 },
                { id: 's5', title: '四面楚歌', artist: '周杰伦', album: '夜曲', duration: 285 }
            ]},
            { id: 'a2', title: '范特西', artist: '周杰伦', year: 2001, color: 'linear-gradient(135deg,#c31432,#240b36)', emoji: '🎸', songs: [
                { id: 's6', title: '双截棍', artist: '周杰伦', album: '范特西', duration: 215 },
                { id: 's7', title: '简单爱', artist: '周杰伦', album: '范特西', duration: 235 },
                { id: 's8', title: '开不了口', artist: '周杰伦', album: '范特西', duration: 256 },
                { id: 's9', title: '上海一九四三', artist: '周杰伦', album: '范特西', duration: 248 }
            ]},
            { id: 'a3', title: '七里香', artist: '周杰伦', year: 2004, color: 'linear-gradient(135deg,#f7971e,#ffd200)', emoji: '🌾', songs: [
                { id: 's10', title: '七里香', artist: '周杰伦', album: '七里香', duration: 298 },
                { id: 's11', title: '我的地盘', artist: '周杰伦', album: '七里香', duration: 220 },
                { id: 's12', title: '借口', artist: '周杰伦', album: '七里香', duration: 256 },
                { id: 's13', title: '搁浅', artist: '周杰伦', album: '七里香', duration: 264 }
            ]},
            { id: 'a4', title: '叶惠美', artist: '周杰伦', year: 2003, color: 'linear-gradient(135deg,#41295a,#2F0743)', emoji: '🍃', songs: [
                { id: 's14', title: '晴天', artist: '周杰伦', album: '叶惠美', duration: 269 },
                { id: 's15', title: '东风破', artist: '周杰伦', album: '叶惠美', duration: 305 },
                { id: 's16', title: '以父之名', artist: '周杰伦', album: '叶惠美', duration: 322 }
            ]},
            { id: 'a5', title: 'Hymn for the Weekend', artist: 'Coldplay', year: 2015, color: 'linear-gradient(135deg,#f12711,#f5af19)', emoji: '🌺', songs: [
                { id: 's17', title: 'Hymn for the Weekend', artist: 'Coldplay', album: 'A Head Full of Dreams', duration: 258 },
                { id: 's18', title: 'Adventure of a Lifetime', artist: 'Coldplay', album: 'A Head Full of Dreams', duration: 263 },
                { id: 's19', title: 'Up&Up', artist: 'Coldplay', album: 'A Head Full of Dreams', duration: 282 }
            ]},
            { id: 'a6', title: '反方向的钟', artist: '陈奕迅', year: 2012, color: 'linear-gradient(135deg,#00c6ff,#0072ff)', emoji: '🕐', songs: [
                { id: 's20', title: '反方向的钟', artist: '陈奕迅', album: '反方向的钟', duration: 268 },
                { id: 's21', title: '稳稳的幸福', artist: '陈奕迅', album: '反方向的钟', duration: 274 },
                { id: 's22', title: '稳稳的你', artist: '陈奕迅', album: '反方向的钟', duration: 256 }
            ]},
            { id: 'a7', title: 'Lover', artist: 'Taylor Swift', year: 2019, color: 'linear-gradient(135deg,#ff6e7f,#bfe9ff)', emoji: '💗', songs: [
                { id: 's23', title: 'Lover', artist: 'Taylor Swift', album: 'Lover', duration: 261 },
                { id: 's24', title: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', duration: 243 },
                { id: 's25', title: 'The Man', artist: 'Taylor Swift', album: 'Lover', duration: 222 }
            ]},
            { id: 'a8', title: '起风了', artist: '买辣椒也用券', year: 2018, color: 'linear-gradient(135deg,#3a1c71,#d76d77,#ffaf7b)', emoji: '🌬️', songs: [
                { id: 's26', title: '起风了', artist: '买辣椒也用券', album: '起风了', duration: 325 },
                { id: 's27', title: '夜空中最亮的星', artist: '逃跑计划', album: '起风了', duration: 282 }
            ]}
        ],
        playlists: [
            { id: 'p1', name: '我的最爱', emoji: '❤️', color: 'linear-gradient(135deg,#ff2d55,#ff6e7f)', songIds: ['s1','s7','s14','s17','s20','s23','s26'] },
            { id: 'p2', name: '通勤音乐', emoji: '🚇', color: 'linear-gradient(135deg,#5ac8fa,#0a84ff)', songIds: ['s6','s10','s18','s24'] },
            { id: 'p3', name: '深夜电台', emoji: '🌙', color: 'linear-gradient(135deg,#5856d6,#af52de)', songIds: ['s3','s15','s22','s27'] },
            { id: 'p4', name: '运动节奏', emoji: '🏃', color: 'linear-gradient(135deg,#34c759,#30d158)', songIds: ['s2','s6','s9','s18'] }
        ]
    };

    // 全部歌曲
    function getAllSongs() {
        const songs = [];
        library.albums.forEach(a => a.songs.forEach(s => songs.push({ ...s, albumId: a.id, albumColor: a.color, albumEmoji: a.emoji })));
        return songs;
    }

    function getSong(id) {
        return getAllSongs().find(s => s.id === id);
    }

    function saveState() {
        localStorage.setItem('macos_music_state', JSON.stringify(state));
    }

    function escapeHtml(t) {
        const d = document.createElement('div');
        d.textContent = t || '';
        return d.innerHTML;
    }

    function formatTime(sec) {
        if (!sec || sec < 0) sec = 0;
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' + s : s);
    }

    // 播放控制
    let playInterval = null;

    function startPlayback() {
        stopPlayback();
        if (!state.playingSongId) {
            // 默认从第一首开始
            const first = getAllSongs()[0];
            if (first) state.playingSongId = first.id;
        }
        state.isPlaying = true;
        playInterval = setInterval(() => {
            const song = getSong(state.playingSongId);
            if (!song) { stopPlayback(); return; }
            state.currentTime += 1;
            if (state.currentTime >= song.duration) {
                nextSong();
            }
            updatePlayerUI();
        }, 1000);
        saveState();
    }

    function stopPlayback() {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
        state.isPlaying = false;
    }

    function togglePlay() {
        if (!state.playingSongId) {
            const first = getAllSongs()[0];
            if (first) {
                state.playingSongId = first.id;
                state.currentTime = 0;
                startPlayback();
            }
            render();
            return;
        }
        if (state.isPlaying) {
            stopPlayback();
        } else {
            startPlayback();
        }
        render();
    }

    function playSong(id) {
        state.playingSongId = id;
        state.currentTime = 0;
        state.isPlaying = true;
        startPlayback();
        render();
    }

    function nextSong() {
        const all = getAllSongs();
        const idx = all.findIndex(s => s.id === state.playingSongId);
        if (idx === -1) return;
        let nextIdx;
        if (state.shuffle) {
            nextIdx = Math.floor(Math.random() * all.length);
        } else {
            nextIdx = idx + 1;
            if (nextIdx >= all.length) nextIdx = state.repeat === 'all' ? 0 : all.length - 1;
        }
        state.playingSongId = all[nextIdx].id;
        state.currentTime = 0;
        if (state.isPlaying) startPlayback();
        updatePlayerUI();
        saveState();
    }

    function prevSong() {
        if (state.currentTime > 3) {
            state.currentTime = 0;
            updatePlayerUI();
            return;
        }
        const all = getAllSongs();
        const idx = all.findIndex(s => s.id === state.playingSongId);
        if (idx === -1) return;
        const prevIdx = idx === 0 ? all.length - 1 : idx - 1;
        state.playingSongId = all[prevIdx].id;
        state.currentTime = 0;
        if (state.isPlaying) startPlayback();
        updatePlayerUI();
        saveState();
    }

    function toggleShuffle() {
        state.shuffle = !state.shuffle;
        saveState();
        render();
    }

    function cycleRepeat() {
        const order = ['off', 'all', 'one'];
        const idx = order.indexOf(state.repeat);
        state.repeat = order[(idx + 1) % order.length];
        saveState();
        render();
    }

    function setVolume(v) {
        state.volume = Math.max(0, Math.min(1, v));
        saveState();
        updatePlayerUI();
    }

    function seekTo(percent) {
        const song = getSong(state.playingSongId);
        if (!song) return;
        state.currentTime = Math.floor(song.duration * percent);
        updatePlayerUI();
        saveState();
    }

    // 当前歌曲列表 (根据视图)
    function getCurrentQueue() {
        if (state.currentView === 'library_songs') return getAllSongs();
        if (state.currentView === 'album_detail') {
            const album = library.albums.find(a => a.id === state.selectedAlbumId);
            return album ? album.songs : [];
        }
        if (state.currentView === 'playlist_detail') {
            const playlist = library.playlists.find(p => p.id === state.selectedPlaylistId);
            if (!playlist) return [];
            return playlist.songIds.map(id => getSong(id)).filter(Boolean);
        }
        return getAllSongs();
    }

    // 更新播放器 UI (不重新渲染整体)
    function updatePlayerUI() {
        const song = getSong(state.playingSongId);
        const playBtn = body.querySelector('#m-play-btn');
        const titleEl = body.querySelector('.music-now-title');
        const artistEl = body.querySelector('.music-now-artist');
        const artEl = body.querySelector('.music-now-art');
        const curTime = body.querySelector('.music-cur-time');
        const totalTime = body.querySelector('.music-total-time');
        const fill = body.querySelector('.music-progress-fill');
        const handle = body.querySelector('.music-progress-handle');

        if (playBtn) {
            playBtn.innerHTML = state.isPlaying
                ? '<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>'
                : '<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg>';
        }
        if (song) {
            if (titleEl) titleEl.textContent = song.title;
            if (artistEl) artistEl.textContent = song.artist + ' — ' + song.album;
            if (artEl) {
                const album = library.albums.find(a => a.title === song.album);
                if (album) {
                    artEl.style.background = album.color;
                    artEl.textContent = album.emoji;
                }
            }
            if (curTime) curTime.textContent = formatTime(state.currentTime);
            if (totalTime) totalTime.textContent = formatTime(song.duration);
            if (fill) {
                const p = (state.currentTime / song.duration) * 100;
                fill.style.width = p + '%';
            }
            if (handle) {
                const p = (state.currentTime / song.duration) * 100;
                handle.style.left = p + '%';
            }
        }
        // 更新歌曲列表中正在播放的图标
        body.querySelectorAll('.music-row').forEach(row => {
            const id = row.dataset.id;
            const playingIcon = row.querySelector('.music-row-playing');
            const titleEl = row.querySelector('.music-row-title');
            if (id === state.playingSongId) {
                row.classList.add('playing');
                if (state.isPlaying) {
                    if (playingIcon) playingIcon.innerHTML = '<span class="music-bars"><span></span><span></span><span></span></span>';
                } else {
                    if (playingIcon) playingIcon.innerHTML = '<svg viewBox="0 0 10 10" width="10" height="10" fill="currentColor"><rect x="2" y="1.5" width="2" height="7" rx="0.5"/><rect x="6" y="1.5" width="2" height="7" rx="0.5"/></svg>';
                }
                if (titleEl) titleEl.style.color = 'var(--accent-pink)';
            } else {
                row.classList.remove('playing');
                if (playingIcon) playingIcon.innerHTML = '';
                if (titleEl) titleEl.style.color = '';
            }
        });
    }

    // 渲染侧栏
    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="music-sidebar">
                <div class="music-side-search">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                    <input type="text" id="m-search" placeholder="搜索" value="${escapeHtml(state.searchQuery)}">
                </div>
                <div class="music-side-section">
                    <div class="music-side-label">Apple Music</div>
                    <div class="music-side-item ${state.currentView === 'home' ? 'active' : ''}" data-view="home">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="currentColor" style="color:#ff2d55;"><path d="M7 1L1 6v7h4V9h4v4h4V6z"/></svg>
                        <span>主页</span>
                    </div>
                    <div class="music-side-item ${state.currentView === 'browse' ? 'active' : ''}" data-view="browse">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" style="color:#ff2d55;"><circle cx="7" cy="7" r="5.5"/><path d="M7 4v3l2 1"/></svg>
                        <span>浏览</span>
                    </div>
                    <div class="music-side-item ${state.currentView === 'radio' ? 'active' : ''}" data-view="radio">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" style="color:#ff2d55;"><circle cx="7" cy="9" r="2"/><path d="M3.5 5.5a5 5 0 0 1 7 0M1.5 3a8 8 0 0 1 11 0"/></svg>
                        <span>广播</span>
                    </div>
                </div>
                <div class="music-side-section">
                    <div class="music-side-label">资料库</div>
                    <div class="music-side-item ${state.currentView === 'library_songs' ? 'active' : ''}" data-view="library_songs">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="currentColor" style="color:#ff2d55;"><path d="M3 2h8a0.5 0.5 0 0 1 0.5 0.5V11a1.5 1.5 0 1 1-1.5-1.5H3z"/></svg>
                        <span>歌曲</span>
                    </div>
                    <div class="music-side-item ${state.currentView === 'library_albums' ? 'active' : ''}" data-view="library_albums">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.2" style="color:#ff2d55;"><circle cx="4" cy="10" r="2"/><circle cx="10" cy="9" r="2"/><path d="M6 10V3l6-1v6" stroke-linecap="round"/></svg>
                        <span>专辑</span>
                    </div>
                    <div class="music-side-item ${state.currentView === 'library_artists' ? 'active' : ''}" data-view="library_artists">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.2" style="color:#ff2d55;"><circle cx="7" cy="4.5" r="2.5"/><path d="M2 12c0-2.5 2.5-4 5-4s5 1.5 5 4" stroke-linecap="round"/></svg>
                        <span>艺人</span>
                    </div>
                </div>
                <div class="music-side-section music-side-playlists">
                    <div class="music-side-label">
                        播放列表
                        <button class="music-side-add" id="m-add-playlist" title="新建播放列表">
                            <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                        </button>
                    </div>
                    ${library.playlists.map(p => `
                        <div class="music-side-item ${state.selectedPlaylistId === p.id && state.currentView === 'playlist_detail' ? 'active' : ''}" data-playlist="${p.id}">
                            <div class="music-side-pl-icon" style="background:${p.color};">${p.emoji}</div>
                            <span>${escapeHtml(p.name)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        sidebar.querySelector('#m-search')?.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            saveState();
            renderContent();
        });

        sidebar.querySelectorAll('[data-view]').forEach(item => {
            item.addEventListener('click', () => {
                state.currentView = item.dataset.view;
                state.searchQuery = '';
                saveState();
                render();
            });
        });

        sidebar.querySelectorAll('[data-playlist]').forEach(item => {
            item.addEventListener('click', () => {
                state.selectedPlaylistId = item.dataset.playlist;
                state.currentView = 'playlist_detail';
                saveState();
                render();
            });
        });

        sidebar.querySelector('#m-add-playlist')?.addEventListener('click', () => {
            openPlaylistEditor();
        });
    }

    function openPlaylistEditor(existing = null) {
        const overlay = document.createElement('div');
        overlay.className = 'cal-editor-overlay';
        overlay.innerHTML = `
            <div class="cal-editor" style="width:320px;">
                <div class="cal-editor-header">
                    <div class="cal-editor-title">${existing ? '编辑播放列表' : '新建播放列表'}</div>
                    <button class="cal-editor-close" id="pe-close">×</button>
                </div>
                <div class="cal-editor-body">
                    <div class="music-pl-edit-form">
                        <div class="music-pl-edit-emoji-row">
                            <div class="music-pl-edit-emoji" id="pe-emoji-preview">${existing?.emoji || '🎵'}</div>
                            <div class="music-pl-edit-emoji-picker">
                                ${['🎵','❤️','🌙','☀️','🔥','🌟','🌈','🚇','🏃','☕','🌊','🍃','🌺','💎','🎂','🎸'].map(e => `
                                    <button class="music-pl-emoji-btn ${existing?.emoji === e ? 'selected' : ''}" data-emoji="${e}">${e}</button>
                                `).join('')}
                            </div>
                        </div>
                        <input type="text" id="pe-name" class="music-pl-edit-input" placeholder="播放列表名称" value="${escapeHtml(existing?.name || '')}">
                    </div>
                </div>
                <div class="cal-editor-footer">
                    <button class="btn btn-secondary" id="pe-cancel">取消</button>
                    <button class="btn btn-primary" id="pe-save">${existing ? '保存' : '创建'}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        let selectedEmoji = existing?.emoji || '🎵';

        overlay.querySelectorAll('[data-emoji]').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedEmoji = btn.dataset.emoji;
                overlay.querySelector('#pe-emoji-preview').textContent = selectedEmoji;
                overlay.querySelectorAll('.music-pl-emoji-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        overlay.querySelector('#pe-close')?.addEventListener('click', () => overlay.remove());
        overlay.querySelector('#pe-cancel')?.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

        overlay.querySelector('#pe-save')?.addEventListener('click', () => {
            const name = overlay.querySelector('#pe-name').value.trim();
            if (!name) {
                overlay.querySelector('#pe-name').focus();
                return;
            }
            const colors = [
                'linear-gradient(135deg,#ff2d55,#ff6e7f)',
                'linear-gradient(135deg,#5ac8fa,#0a84ff)',
                'linear-gradient(135deg,#5856d6,#af52de)',
                'linear-gradient(135deg,#34c759,#30d158)',
                'linear-gradient(135deg,#ff9500,#ff5e3a)'
            ];
            if (existing) {
                existing.name = name;
                existing.emoji = selectedEmoji;
            } else {
                const newPlaylist = {
                    id: 'p' + Date.now(),
                    name: name,
                    emoji: selectedEmoji,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    songIds: []
                };
                library.playlists.push(newPlaylist);
            }
            overlay.remove();
            render();
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        let title = '音乐';
        if (state.currentView === 'library_songs') title = '歌曲';
        else if (state.currentView === 'library_albums') title = '专辑';
        else if (state.currentView === 'library_artists') title = '艺人';
        else if (state.currentView === 'album_detail') {
            const album = library.albums.find(a => a.id === state.selectedAlbumId);
            title = album ? album.title : '专辑';
        } else if (state.currentView === 'playlist_detail') {
            const playlist = library.playlists.find(p => p.id === state.selectedPlaylistId);
            title = playlist ? playlist.name : '播放列表';
        } else if (state.currentView === 'home') title = '主页';
        else if (state.currentView === 'browse') title = '浏览';
        else if (state.currentView === 'radio') title = '广播';

        toolbar.innerHTML = `
            <div class="music-toolbar">
                <div class="music-toolbar-title">${escapeHtml(title)}</div>
                <div style="flex:1;"></div>
                ${state.currentView === 'album_detail' || state.currentView === 'playlist_detail' ? `
                    <button class="music-toolbar-btn" id="m-play-all" title="播放全部">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                        <span>播放</span>
                    </button>
                ` : ''}
                ${state.currentView === 'library_albums' || state.currentView === 'library_artists' ? `
                    <button class="music-toolbar-btn" id="m-view-toggle" title="${state.currentView === 'library_albums' ? '查看歌曲' : '查看专辑'}">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="2" width="11" height="3" rx="0.5"/><rect x="1.5" y="6.5" width="11" height="3" rx="0.5"/><rect x="1.5" y="11" width="11" height="1.5" rx="0.5"/></svg>
                    </button>
                ` : ''}
            </div>
        `;

        toolbar.querySelector('#m-play-all')?.addEventListener('click', () => {
            const queue = getCurrentQueue();
            if (queue.length > 0) {
                playSong(queue[0].id);
            }
        });

        toolbar.querySelector('#m-view-toggle')?.addEventListener('click', () => {
            state.currentView = state.currentView === 'library_albums' ? 'library_songs' : 'library_albums';
            saveState();
            render();
        });
    }

    function renderContent() {
        body.innerHTML = '';
        body.className = 'window-body app-content music-app';

        const main = document.createElement('div');
        main.className = 'music-main';

        const scroll = document.createElement('div');
        scroll.className = 'music-scroll';

        if (state.searchQuery) {
            renderSearchResults(scroll);
        } else if (state.currentView === 'home') {
            renderHome(scroll);
        } else if (state.currentView === 'browse') {
            renderBrowse(scroll);
        } else if (state.currentView === 'radio') {
            renderRadio(scroll);
        } else if (state.currentView === 'library_albums') {
            renderAlbumsGrid(scroll);
        } else if (state.currentView === 'library_artists') {
            renderArtistsView(scroll);
        } else if (state.currentView === 'album_detail') {
            renderAlbumDetail(scroll);
        } else if (state.currentView === 'playlist_detail') {
            renderPlaylistDetail(scroll);
        } else {
            // library_songs
            renderSongsList(scroll);
        }

        main.appendChild(scroll);

        // 播放器栏
        const player = document.createElement('div');
        player.className = 'music-player-bar';
        renderPlayerBar(player);
        main.appendChild(player);

        body.appendChild(main);

        attachPlayerListeners();
        updatePlayerUI();
    }

    function renderSongsList(container) {
        const songs = getAllSongs();
        container.innerHTML = `
            <div class="music-songs-header">
                <div class="music-col-num">#</div>
                <div class="music-col-title">标题</div>
                <div class="music-col-artist">艺人</div>
                <div class="music-col-album">专辑</div>
                <div class="music-col-duration">
                    <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="7" cy="7" r="5"/><path d="M7 4v3l2 1"/></svg>
                </div>
            </div>
            <div class="music-songs-list">
                ${songs.map((s, i) => `
                    <div class="music-row" data-id="${s.id}">
                        <div class="music-col-num">
                            <span class="music-row-num">${i + 1}</span>
                            <span class="music-row-playing"></span>
                        </div>
                        <div class="music-col-title">
                            <div class="music-album-thumb" style="background:${s.albumColor};">${s.albumEmoji}</div>
                            <div class="music-row-info">
                                <div class="music-row-title">${escapeHtml(s.title)}</div>
                            </div>
                        </div>
                        <div class="music-col-artist">${escapeHtml(s.artist)}</div>
                        <div class="music-col-album">${escapeHtml(s.album)}</div>
                        <div class="music-col-duration">${formatTime(s.duration)}</div>
                    </div>
                `).join('')}
            </div>
        `;

        attachSongRowListeners(container);
    }

    function renderAlbumsGrid(container) {
        container.innerHTML = `
            <div class="music-grid-section">
                <div class="music-section-title">专辑</div>
                <div class="music-album-grid">
                    ${library.albums.map(a => `
                        <div class="music-album-card" data-album="${a.id}">
                            <div class="music-album-cover" style="background:${a.color};">
                                <span class="music-album-emoji">${a.emoji}</span>
                                <button class="music-album-play" data-album-play="${a.id}">
                                    <svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                                </button>
                            </div>
                            <div class="music-album-card-title">${escapeHtml(a.title)}</div>
                            <div class="music-album-card-artist">${escapeHtml(a.artist)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.querySelectorAll('[data-album]').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-album-play]')) return;
                state.selectedAlbumId = card.dataset.album;
                state.currentView = 'album_detail';
                saveState();
                render();
            });
        });
        container.querySelectorAll('[data-album-play]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const album = library.albums.find(a => a.id === btn.dataset.albumPlay);
                if (album && album.songs.length > 0) {
                    playSong(album.songs[0].id);
                }
            });
        });
    }

    function renderArtistsView(container) {
        // 按艺人分组
        const artistsMap = {};
        library.albums.forEach(a => {
            if (!artistsMap[a.artist]) artistsMap[a.artist] = [];
            artistsMap[a.artist].push(a);
        });
        const artists = Object.keys(artistsMap);

        container.innerHTML = `
            <div class="music-grid-section">
                <div class="music-section-title">艺人</div>
                <div class="music-artist-grid">
                    ${artists.map(name => {
                        const albums = artistsMap[name];
                        const color = albums[0].color;
                        const emoji = albums[0].emoji;
                        return `
                            <div class="music-artist-card" data-artist="${escapeHtml(name)}">
                                <div class="music-artist-cover" style="background:${color};">
                                    <span class="music-album-emoji">${emoji}</span>
                                </div>
                                <div class="music-album-card-title">${escapeHtml(name)}</div>
                                <div class="music-album-card-artist">${albums.length} 个专辑</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderAlbumDetail(container) {
        const album = library.albums.find(a => a.id === state.selectedAlbumId);
        if (!album) {
            container.innerHTML = '<div class="music-empty">未找到专辑</div>';
            return;
        }
        container.innerHTML = `
            <div class="music-detail-header">
                <div class="music-detail-cover" style="background:${album.color};">
                    <span>${album.emoji}</span>
                </div>
                <div class="music-detail-info">
                    <div class="music-detail-label">专辑</div>
                    <h1 class="music-detail-title">${escapeHtml(album.title)}</h1>
                    <div class="music-detail-artist">${escapeHtml(album.artist)}</div>
                    <div class="music-detail-meta">${album.year} 年 · ${album.songs.length} 首歌曲</div>
                    <div class="music-detail-actions">
                        <button class="music-play-btn" id="m-play-album">
                            <svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                            播放
                        </button>
                        <button class="music-add-btn" title="添加到资料库">
                            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="music-songs-list music-detail-songs">
                ${album.songs.map((s, i) => `
                    <div class="music-row" data-id="${s.id}">
                        <div class="music-col-num">
                            <span class="music-row-num">${i + 1}</span>
                            <span class="music-row-playing"></span>
                        </div>
                        <div class="music-col-title">
                            <div class="music-row-info">
                                <div class="music-row-title">${escapeHtml(s.title)}</div>
                            </div>
                        </div>
                        <div class="music-col-artist">${escapeHtml(s.artist)}</div>
                        <div class="music-col-album">${escapeHtml(s.album)}</div>
                        <div class="music-col-duration">${formatTime(s.duration)}</div>
                    </div>
                `).join('')}
            </div>
        `;

        container.querySelector('#m-play-album')?.addEventListener('click', () => {
            if (album.songs.length > 0) playSong(album.songs[0].id);
        });
        attachSongRowListeners(container);
    }

    function renderPlaylistDetail(container) {
        const playlist = library.playlists.find(p => p.id === state.selectedPlaylistId);
        if (!playlist) {
            container.innerHTML = '<div class="music-empty">未找到播放列表</div>';
            return;
        }
        const songs = playlist.songIds.map(id => getSong(id)).filter(Boolean);
        container.innerHTML = `
            <div class="music-detail-header">
                <div class="music-detail-cover music-pl-cover" style="background:${playlist.color};">
                    <span>${playlist.emoji}</span>
                </div>
                <div class="music-detail-info">
                    <div class="music-detail-label">播放列表</div>
                    <h1 class="music-detail-title">${escapeHtml(playlist.name)}</h1>
                    <div class="music-detail-meta">${songs.length} 首歌曲</div>
                    <div class="music-detail-actions">
                        <button class="music-play-btn" id="m-play-pl">
                            <svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                            播放
                        </button>
                        <button class="music-add-btn" id="m-edit-pl" title="编辑播放列表">
                            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 11.5L11.5 2L12.5 3L3 12.5L1.5 12.5L1.5 11zM9 4l1 1"/></svg>
                        </button>
                        <button class="music-add-btn" id="m-del-pl" title="删除播放列表">
                            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h8M5.5 4V2.5h3V4M5 4l.5 8h3L9 4"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            ${songs.length === 0 ? `
                <div class="music-empty music-pl-empty">
                    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"><path d="M24 8l5 12 12 1-9 8 3 12-11-7-11 7 3-12-9-8 12-1z" stroke-linejoin="round"/></svg>
                    <div class="music-empty-text">播放列表中还没有歌曲</div>
                    <div class="music-empty-hint">从资料库中添加歌曲到 "${escapeHtml(playlist.name)}"</div>
                </div>
            ` : `
                <div class="music-songs-list">
                    ${songs.map((s, i) => `
                        <div class="music-row" data-id="${s.id}">
                            <div class="music-col-num">
                                <span class="music-row-num">${i + 1}</span>
                                <span class="music-row-playing"></span>
                            </div>
                            <div class="music-col-title">
                                <div class="music-album-thumb" style="background:${s.albumColor};">${s.albumEmoji}</div>
                                <div class="music-row-info">
                                    <div class="music-row-title">${escapeHtml(s.title)}</div>
                                </div>
                            </div>
                            <div class="music-col-artist">${escapeHtml(s.artist)}</div>
                            <div class="music-col-album">${escapeHtml(s.album)}</div>
                            <div class="music-col-duration">${formatTime(s.duration)}</div>
                        </div>
                    `).join('')}
                </div>
            `}
        `;

        container.querySelector('#m-play-pl')?.addEventListener('click', () => {
            if (songs.length > 0) playSong(songs[0].id);
        });
        container.querySelector('#m-edit-pl')?.addEventListener('click', () => {
            openPlaylistEditor(playlist);
        });
        container.querySelector('#m-del-pl')?.addEventListener('click', () => {
            if (confirm(`确定要删除播放列表 "${playlist.name}" 吗？`)) {
                library.playlists = library.playlists.filter(p => p.id !== playlist.id);
                state.selectedPlaylistId = null;
                state.currentView = 'library_songs';
                render();
            }
        });
        attachSongRowListeners(container);
    }

    function renderHome(container) {
        container.innerHTML = `
            <div class="music-home">
                <div class="music-hero">
                    <div class="music-hero-text">
                        <div class="music-hero-eyebrow">为您推荐</div>
                        <h1 class="music-hero-title">聆听心情</h1>
                        <p class="music-hero-sub">根据您的口味精选的全新歌单和专辑</p>
                        <button class="music-hero-btn" id="m-hero-play">
                            <svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                            立即聆听
                        </button>
                    </div>
                    <div class="music-hero-art">
                        ${library.albums.slice(0, 3).map(a => `
                            <div class="music-hero-card" data-album="${a.id}" style="background:${a.color};">
                                <span>${a.emoji}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="music-grid-section">
                    <div class="music-section-title">最近播放的专辑</div>
                    <div class="music-album-grid">
                        ${library.albums.slice(0, 6).map(a => `
                            <div class="music-album-card" data-album="${a.id}">
                                <div class="music-album-cover" style="background:${a.color};">
                                    <span class="music-album-emoji">${a.emoji}</span>
                                    <button class="music-album-play" data-album-play="${a.id}">
                                        <svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                                    </button>
                                </div>
                                <div class="music-album-card-title">${escapeHtml(a.title)}</div>
                                <div class="music-album-card-artist">${escapeHtml(a.artist)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="music-grid-section">
                    <div class="music-section-title">您的播放列表</div>
                    <div class="music-album-grid">
                        ${library.playlists.map(p => `
                            <div class="music-album-card" data-playlist="${p.id}">
                                <div class="music-album-cover" style="background:${p.color};">
                                    <span class="music-album-emoji">${p.emoji}</span>
                                </div>
                                <div class="music-album-card-title">${escapeHtml(p.name)}</div>
                                <div class="music-album-card-artist">${p.songIds.length} 首歌曲</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        container.querySelector('#m-hero-play')?.addEventListener('click', () => {
            const songs = getAllSongs();
            if (songs.length > 0) playSong(songs[0].id);
        });
        container.querySelectorAll('[data-album]').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-album-play]')) return;
                state.selectedAlbumId = card.dataset.album;
                state.currentView = 'album_detail';
                saveState();
                render();
            });
        });
        container.querySelectorAll('[data-album-play]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const album = library.albums.find(a => a.id === btn.dataset.albumPlay);
                if (album && album.songs.length > 0) playSong(album.songs[0].id);
            });
        });
        container.querySelectorAll('[data-playlist]').forEach(card => {
            card.addEventListener('click', () => {
                state.selectedPlaylistId = card.dataset.playlist;
                state.currentView = 'playlist_detail';
                saveState();
                render();
            });
        });
    }

    function renderBrowse(container) {
        container.innerHTML = `
            <div class="music-grid-section">
                <div class="music-section-title">新发布</div>
                <div class="music-album-grid">
                    ${library.albums.slice(0, 4).map(a => `
                        <div class="music-album-card" data-album="${a.id}">
                            <div class="music-album-cover" style="background:${a.color};">
                                <span class="music-album-emoji">${a.emoji}</span>
                                <button class="music-album-play" data-album-play="${a.id}">
                                    <svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                                </button>
                            </div>
                            <div class="music-album-card-title">${escapeHtml(a.title)}</div>
                            <div class="music-album-card-artist">${escapeHtml(a.artist)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="music-grid-section">
                <div class="music-section-title">热门精选</div>
                <div class="music-browse-banner" style="background:linear-gradient(135deg,#fa233b,#fc5185);">
                    <div class="music-banner-content">
                        <div class="music-banner-eyebrow">今日精选</div>
                        <h2 class="music-banner-title">华语流行 · 精华合集</h2>
                        <button class="music-banner-btn" id="m-banner-play">
                            <svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                            播放
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.querySelectorAll('[data-album]').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('[data-album-play]')) return;
                state.selectedAlbumId = card.dataset.album;
                state.currentView = 'album_detail';
                saveState();
                render();
            });
        });
        container.querySelectorAll('[data-album-play]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const album = library.albums.find(a => a.id === btn.dataset.albumPlay);
                if (album && album.songs.length > 0) playSong(album.songs[0].id);
            });
        });
        container.querySelector('#m-banner-play')?.addEventListener('click', () => {
            const songs = getAllSongs();
            if (songs.length > 0) playSong(songs[0].id);
        });
    }

    function renderRadio(container) {
        container.innerHTML = `
            <div class="music-radio">
                <div class="music-radio-hero" style="background:linear-gradient(135deg,#fa233b,#fc5185);">
                    <div class="music-radio-cover">
                        <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="24" cy="30" r="6"/><path d="M14 20a16 16 0 0 1 20 0M8 12a26 26 0 0 1 32 0"/></svg>
                    </div>
                    <div class="music-radio-info">
                        <div class="music-radio-eyebrow">Apple Music 1</div>
                        <h1 class="music-radio-title">全球之声广播</h1>
                        <button class="music-radio-btn" id="m-radio-play">
                            <svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                            收听
                        </button>
                    </div>
                </div>
                <div class="music-grid-section">
                    <div class="music-section-title">电台</div>
                    <div class="music-album-grid">
                        ${[
                            { name: '华语金曲电台', color: 'linear-gradient(135deg,#ff6e7f,#ff2d55)', emoji: '🎵' },
                            { name: '电子节奏电台', color: 'linear-gradient(135deg,#5ac8fa,#0a84ff)', emoji: '🎧' },
                            { name: '怀旧经典电台', color: 'linear-gradient(135deg,#ff9500,#ff5e3a)', emoji: '📻' },
                            { name: '睡眠白噪音电台', color: 'linear-gradient(135deg,#5856d6,#af52de)', emoji: '🌙' },
                            { name: '运动节奏电台', color: 'linear-gradient(135deg,#34c759,#30d158)', emoji: '🏃' },
                            { name: '咖啡厅音乐电台', color: 'linear-gradient(135deg,#a2845e,#5d4037)', emoji: '☕' }
                        ].map(r => `
                            <div class="music-album-card music-radio-card">
                                <div class="music-album-cover" style="background:${r.color};">
                                    <span class="music-album-emoji">${r.emoji}</span>
                                    <button class="music-album-play" data-radio-play>
                                        <svg viewBox="0 0 14 14" width="14" height="14" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                                    </button>
                                </div>
                                <div class="music-album-card-title">${escapeHtml(r.name)}</div>
                                <div class="music-album-card-artist">Apple Music</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        container.querySelector('#m-radio-play')?.addEventListener('click', () => {
            const songs = getAllSongs();
            if (songs.length > 0) {
                state.shuffle = true;
                playSong(songs[Math.floor(Math.random() * songs.length)].id);
            }
        });
        container.querySelectorAll('[data-radio-play]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const songs = getAllSongs();
                if (songs.length > 0) {
                    state.shuffle = true;
                    playSong(songs[Math.floor(Math.random() * songs.length)].id);
                }
            });
        });
    }

    function renderSearchResults(container) {
        const q = state.searchQuery.toLowerCase();
        const songs = getAllSongs().filter(s =>
            s.title.toLowerCase().includes(q) ||
            s.artist.toLowerCase().includes(q) ||
            s.album.toLowerCase().includes(q)
        );
        const albums = library.albums.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.artist.toLowerCase().includes(q)
        );
        const playlists = library.playlists.filter(p => p.name.toLowerCase().includes(q));

        container.innerHTML = `
            <div class="music-search-results">
                <div class="music-search-summary">搜索 "${escapeHtml(state.searchQuery)}"</div>
                ${songs.length === 0 && albums.length === 0 && playlists.length === 0 ? `
                    <div class="music-empty">
                        <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4"><circle cx="20" cy="20" r="12"/><path d="M30 30l8 8" stroke-linecap="round"/></svg>
                        <div class="music-empty-text">未找到匹配的结果</div>
                    </div>
                ` : ''}
                ${songs.length > 0 ? `
                    <div class="music-grid-section">
                        <div class="music-section-title">歌曲</div>
                        <div class="music-songs-list">
                            ${songs.map((s, i) => `
                                <div class="music-row" data-id="${s.id}">
                                    <div class="music-col-num">
                                        <span class="music-row-num">${i + 1}</span>
                                        <span class="music-row-playing"></span>
                                    </div>
                                    <div class="music-col-title">
                                        <div class="music-album-thumb" style="background:${s.albumColor};">${s.albumEmoji}</div>
                                        <div class="music-row-info">
                                            <div class="music-row-title">${escapeHtml(s.title)}</div>
                                        </div>
                                    </div>
                                    <div class="music-col-artist">${escapeHtml(s.artist)}</div>
                                    <div class="music-col-album">${escapeHtml(s.album)}</div>
                                    <div class="music-col-duration">${formatTime(s.duration)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${albums.length > 0 ? `
                    <div class="music-grid-section">
                        <div class="music-section-title">专辑</div>
                        <div class="music-album-grid">
                            ${albums.map(a => `
                                <div class="music-album-card" data-album="${a.id}">
                                    <div class="music-album-cover" style="background:${a.color};">
                                        <span class="music-album-emoji">${a.emoji}</span>
                                    </div>
                                    <div class="music-album-card-title">${escapeHtml(a.title)}</div>
                                    <div class="music-album-card-artist">${escapeHtml(a.artist)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${playlists.length > 0 ? `
                    <div class="music-grid-section">
                        <div class="music-section-title">播放列表</div>
                        <div class="music-album-grid">
                            ${playlists.map(p => `
                                <div class="music-album-card" data-playlist="${p.id}">
                                    <div class="music-album-cover" style="background:${p.color};">
                                        <span class="music-album-emoji">${p.emoji}</span>
                                    </div>
                                    <div class="music-album-card-title">${escapeHtml(p.name)}</div>
                                    <div class="music-album-card-artist">${p.songIds.length} 首歌曲</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        attachSongRowListeners(container);
        container.querySelectorAll('[data-album]').forEach(card => {
            card.addEventListener('click', () => {
                state.selectedAlbumId = card.dataset.album;
                state.currentView = 'album_detail';
                state.searchQuery = '';
                saveState();
                render();
            });
        });
        container.querySelectorAll('[data-playlist]').forEach(card => {
            card.addEventListener('click', () => {
                state.selectedPlaylistId = card.dataset.playlist;
                state.currentView = 'playlist_detail';
                state.searchQuery = '';
                saveState();
                render();
            });
        });
    }

    function attachSongRowListeners(container) {
        container.querySelectorAll('.music-row').forEach(row => {
            row.addEventListener('click', () => {
                playSong(row.dataset.id);
            });
            row.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showSongContextMenu(row.dataset.id, e.clientX, e.clientY);
            });
        });
    }

    function showSongContextMenu(songId, x, y) {
        document.querySelectorAll('.context-menu').forEach(m => m.remove());
        const song = getSong(songId);
        if (!song) return;

        const menu = document.createElement('div');
        menu.className = 'context-menu music-ctx-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.innerHTML = `
            <div class="ctx-item" data-action="play">
                <svg viewBox="0 0 14 14" width="12" height="12" fill="currentColor"><path d="M3 2v10l9-5z"/></svg>
                播放
            </div>
            <div class="ctx-item" data-action="next">
                <svg viewBox="0 0 14 14" width="12" height="12" fill="currentColor"><path d="M3 2l7 5-7 5zM11 2v10h1.5V2z"/></svg>
                播放下一首
            </div>
            <div class="ctx-sep"></div>
            <div class="ctx-item has-sub" data-action="add">
                <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                添加到播放列表
                <svg class="ctx-arrow" viewBox="0 0 10 10" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 1l4 4-4 4"/></svg>
            </div>
            <div class="ctx-item" data-action="album">
                <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="4" cy="10" r="2"/><circle cx="10" cy="9" r="2"/><path d="M6 10V3l6-1v6" stroke-linecap="round"/></svg>
                前往专辑
            </div>
        `;
        document.body.appendChild(menu);

        menu.querySelectorAll('.ctx-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (action === 'play') {
                    playSong(songId);
                } else if (action === 'next') {
                    state.playingSongId = songId;
                    state.currentTime = 0;
                    saveState();
                    updatePlayerUI();
                } else if (action === 'album') {
                    const album = library.albums.find(a => a.title === song.album);
                    if (album) {
                        state.selectedAlbumId = album.id;
                        state.currentView = 'album_detail';
                        saveState();
                        render();
                    }
                } else if (action === 'add') {
                    showAddToPlaylistMenu(songId, x, y);
                }
                menu.remove();
            });
        });

        setTimeout(() => {
            const close = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', close);
                }
            };
            document.addEventListener('click', close);
        }, 50);
    }

    function showAddToPlaylistMenu(songId, x, y) {
        document.querySelectorAll('.context-menu').forEach(m => m.remove());
        const menu = document.createElement('div');
        menu.className = 'context-menu music-ctx-menu';
        menu.style.left = (x + 180) + 'px';
        menu.style.top = y + 'px';
        menu.innerHTML = `
            <div class="ctx-item music-ctx-header">添加到播放列表</div>
            <div class="ctx-sep"></div>
            ${library.playlists.map(p => `
                <div class="ctx-item" data-pl="${p.id}">
                    <span style="font-size:14px;">${p.emoji}</span>
                    ${escapeHtml(p.name)}
                </div>
            `).join('')}
            <div class="ctx-sep"></div>
            <div class="ctx-item" data-action="new-pl">
                <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M7 2v10M2 7h10"/></svg>
                新建播放列表...
            </div>
        `;
        document.body.appendChild(menu);

        menu.querySelectorAll('[data-pl]').forEach(item => {
            item.addEventListener('click', () => {
                const playlist = library.playlists.find(p => p.id === item.dataset.pl);
                if (playlist && !playlist.songIds.includes(songId)) {
                    playlist.songIds.push(songId);
                }
                menu.remove();
                render();
            });
        });
        menu.querySelector('[data-action="new-pl"]')?.addEventListener('click', () => {
            menu.remove();
            openPlaylistEditor();
        });

        setTimeout(() => {
            const close = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', close);
                }
            };
            document.addEventListener('click', close);
        }, 50);
    }

    function renderPlayerBar(player) {
        const song = getSong(state.playingSongId);
        const songAlbum = song ? library.albums.find(a => a.title === song.album) : null;
        player.innerHTML = `
            <div class="music-now-info">
                <div class="music-now-art" style="${songAlbum ? `background:${songAlbum.color};` : ''}">${songAlbum ? songAlbum.emoji : '🎵'}</div>
                <div class="music-now-text">
                    <div class="music-now-title">${song ? escapeHtml(song.title) : '未播放'}</div>
                    <div class="music-now-artist">${song ? escapeHtml(song.artist) : '选择一首歌曲开始播放'}</div>
                </div>
            </div>
            <div class="music-now-center">
                <div class="music-now-controls">
                    <button class="music-ctrl-btn ${state.shuffle ? 'active' : ''}" id="m-shuffle" title="随机播放">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4h2l4 6h3M1 10h2l4-6h3M10 2l2 2-2 2M10 6l2 2-2 2"/></svg>
                    </button>
                    <button class="music-ctrl-btn" id="m-prev" title="上一首">
                        <svg viewBox="0 0 14 14" width="16" height="16" fill="currentColor"><path d="M3 2v10h1.5V2zM12 2L5 7l7 5z"/></svg>
                    </button>
                    <button class="music-ctrl-btn music-play-btn-main" id="m-play-btn" title="播放/暂停">
                        ${state.isPlaying
                            ? '<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>'
                            : '<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg>'
                        }
                    </button>
                    <button class="music-ctrl-btn" id="m-next" title="下一首">
                        <svg viewBox="0 0 14 14" width="16" height="16" fill="currentColor"><path d="M9.5 2v10H11V2zM2 2l7 5-7 5z"/></svg>
                    </button>
                    <button class="music-ctrl-btn ${state.repeat !== 'off' ? 'active' : ''}" id="m-repeat" title="重复">
                        ${state.repeat === 'one'
                            ? '<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h7l-2-2M11 9H4l2 2"/><text x="6.5" y="9" font-size="5" font-weight="bold" text-anchor="middle" fill="currentColor" stroke="none">1</text></svg>'
                            : '<svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h7l-2-2M11 9H4l2 2"/></svg>'
                        }
                    </button>
                </div>
                <div class="music-progress-wrap">
                    <span class="music-cur-time">${formatTime(state.currentTime)}</span>
                    <div class="music-progress" id="m-progress">
                        <div class="music-progress-track"></div>
                        <div class="music-progress-fill" style="width:${song ? (state.currentTime / song.duration) * 100 : 0}%;"></div>
                        <div class="music-progress-handle" style="left:${song ? (state.currentTime / song.duration) * 100 : 0}%;"></div>
                    </div>
                    <span class="music-total-time">${song ? formatTime(song.duration) : '0:00'}</span>
                </div>
            </div>
            <div class="music-now-right">
                <button class="music-ctrl-btn" title="歌词" id="m-lyrics">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M2 4h6M2 7h10M2 10h6"/></svg>
                </button>
                <button class="music-ctrl-btn" title="队列" id="m-queue">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M2 4h10M2 7h7M2 10h10"/></svg>
                </button>
                <div class="music-volume-wrap">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5v4h2.5L8 12V2L4.5 5z"/><path d="M10.5 4.5a3 3 0 0 1 0 5" opacity="0.6"/></svg>
                    <div class="music-volume" id="m-volume">
                        <div class="music-volume-track"></div>
                        <div class="music-volume-fill" style="width:${state.volume * 100}%;"></div>
                        <div class="music-volume-handle" style="left:${state.volume * 100}%;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function attachPlayerListeners() {
        body.querySelector('#m-play-btn')?.addEventListener('click', togglePlay);
        body.querySelector('#m-prev')?.addEventListener('click', prevSong);
        body.querySelector('#m-next')?.addEventListener('click', nextSong);
        body.querySelector('#m-shuffle')?.addEventListener('click', toggleShuffle);
        body.querySelector('#m-repeat')?.addEventListener('click', cycleRepeat);

        // 进度条拖动
        const progress = body.querySelector('#m-progress');
        if (progress) {
            let dragging = false;
            const seek = (e) => {
                const rect = progress.getBoundingClientRect();
                const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                seekTo(p);
            };
            progress.addEventListener('mousedown', (e) => {
                dragging = true;
                seek(e);
            });
            document.addEventListener('mousemove', (e) => {
                if (dragging) seek(e);
            });
            document.addEventListener('mouseup', () => { dragging = false; });
        }

        // 音量条拖动
        const volume = body.querySelector('#m-volume');
        if (volume) {
            let dragging = false;
            const vol = (e) => {
                const rect = volume.getBoundingClientRect();
                const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                setVolume(p);
            };
            volume.addEventListener('mousedown', (e) => {
                dragging = true;
                vol(e);
            });
            document.addEventListener('mousemove', (e) => {
                if (dragging) vol(e);
            });
            document.addEventListener('mouseup', () => { dragging = false; });
        }

        // 歌词/队列按钮显示提示
        body.querySelector('#m-lyrics')?.addEventListener('click', () => showToast('歌词面板暂未开放'));
        body.querySelector('#m-queue')?.addEventListener('click', () => showToast('播放队队列'));
    }

    function showToast(msg) {
        const existing = body.querySelector('.music-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'music-toast';
        toast.textContent = msg;
        body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 1800);
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    // 清理函数 - 在窗口关闭时调用
    if (windowId) {
        const cleanup = () => {
            stopPlayback();
        };
        const win = window.windowManager?.windows?.get(windowId);
        if (win) {
            const origClose = win.close?.bind(win);
            // 不直接重写，因为 WindowManager 已经处理关闭
        }
    }

    render();

    // 窗口关闭时停止播放
    const observer = new MutationObserver(() => {
        if (!document.body.contains(body)) {
            stopPlayback();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
};
