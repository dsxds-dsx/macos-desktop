window.renderTV = function(body, sidebar, toolbar, windowId) {
    // ============ Persistent State ============
    let state = JSON.parse(localStorage.getItem('macos_tv_state') || 'null') || {
        currentSection: 'home',
        selectedShowId: null,
        playingShowId: null,
        playingEpisodeId: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        watchlist: [],
        watched: []
    };
    let searchQuery = '';

    function saveState() {
        localStorage.setItem('macos_tv_state', JSON.stringify(state));
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${m}:${String(s).padStart(2, '0')}`;
    }

    // ============ Sidebar Sections ============
    const sections = [
        { id: 'home', name: '主页' },
        { id: 'movies', name: '电影' },
        { id: 'tvshows', name: '电视节目' },
        { id: 'kids', name: '儿童' },
        { id: 'library', name: '资料库' }
    ];

    const sectionIcons = {
        'home': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm0-4H7v-2h5v2zm0-4H7V7h5v2zm5 8h-3V7h3v10z"/></svg>`,
        'movies': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>`,
        'tvshows': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>`,
        'kids': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>`,
        'library': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V4h10v7z"/></svg>`
    };

    // ============ Shows Data ============
    const shows = [
        { id: '1', title: '三体', type: 'tvshows', genre: '科幻', year: 2023, rating: 8.4, seasons: 1, episodes: 30, desc: '改编自刘慈欣同名科幻小说。讲述地球文明与三体文明的信息交流、生死搏杀及两个文明在宇宙中的兴衰历程。', color: 'linear-gradient(135deg, #0a0e27, #1a1a3e, #2d1b4e)', accent: '#6a1b9a', badge: '原创剧集' },
        { id: '2', title: '流浪地球', type: 'movies', genre: '科幻', year: 2019, rating: 8.6, duration: 125 * 60, desc: '太阳即将毁灭，人类启动"流浪地球"计划，带着地球一起逃离太阳系，寻找新家园。', color: 'linear-gradient(135deg, #1a237e, #0d47a1)', accent: '#1565c0', badge: '电影' },
        { id: '3', title: '哪吒之魔童降世', type: 'movies', genre: '动画', year: 2019, rating: 8.5, duration: 110 * 60, desc: '本应是灵珠英雄的哪吒却成了混世魔王，面对世人的误解，他要如何证明自己？', color: 'linear-gradient(135deg, #c62828, #4a148c)', accent: '#c62828', badge: '电影' },
        { id: '4', title: '长安三万里', type: 'movies', genre: '动画', year: 2023, rating: 8.0, duration: 168 * 60, desc: '以盛唐为背景，讲述安史之乱后，整个长安因战争而萧条，高适回忆起自己与李白的过往。', color: 'linear-gradient(135deg, #d84315, #4e342e)', accent: '#d84315', badge: '电影' },
        { id: '5', title: '庆余年', type: 'tvshows', genre: '古装', year: 2019, rating: 8.0, seasons: 2, episodes: 46, desc: '一个有着神秘身世的少年，自海边小城初出茅庐，历经家族、江湖、庙堂的种种考验。', color: 'linear-gradient(135deg, #283593, #1565c0)', accent: '#283593', badge: '原创剧集' },
        { id: '6', title: '隐秘的角落', type: 'tvshows', genre: '悬疑', year: 2020, rating: 8.9, seasons: 1, episodes: 12, desc: '三个小孩在景区游玩时，无意间拍摄记录了一次谋杀，由此卷入几个家庭的复杂纷争。', color: 'linear-gradient(135deg, #263238, #37474f)', accent: '#37474f', badge: '原创剧集' },
        { id: '7', title: '熊出没', type: 'kids', genre: '动画', year: 2012, rating: 7.5, seasons: 10, episodes: 200, desc: '森林保护者熊大、熊二与伐木工光头强之间的有趣故事，深受孩子们喜爱。', color: 'linear-gradient(135deg, #2e7d32, #558b2f)', accent: '#2e7d32', badge: '儿童' },
        { id: '8', title: '小猪佩奇', type: 'kids', genre: '动画', year: 2004, rating: 7.8, seasons: 6, episodes: 300, desc: '小猪佩奇与家人的愉快经历，每个故事都洋溢着欢乐的气氛。', color: 'linear-gradient(135deg, #ec407a, #d81b60)', accent: '#ec407a', badge: '儿童' },
        { id: '9', title: '觉醒年代', type: 'tvshows', genre: '历史', year: 2021, rating: 9.3, seasons: 1, episodes: 43, desc: '全景式展现从新文化运动、五四运动到中国共产党建立的波澜壮阔的历史画卷。', color: 'linear-gradient(135deg, #b71c1c, #880e4f)', accent: '#b71c1c', badge: '原创剧集' },
        { id: '10', title: '我和我的祖国', type: 'movies', genre: '剧情', year: 2019, rating: 8.0, duration: 158 * 60, desc: '七个故事，七个瞬间，讲述普通人与国家之间息息相关、密不可分的动人故事。', color: 'linear-gradient(135deg, #d32f2f, #f57c00)', accent: '#d32f2f', badge: '电影' },
        { id: '11', title: '狂飙', type: 'tvshows', genre: '刑侦', year: 2023, rating: 8.5, seasons: 1, episodes: 39, desc: '讲述了一线刑警安欣与黑恶势力的长达二十年的较量，展现扫黑除恶的艰巨过程。', color: 'linear-gradient(135deg, #1a237e, #311b92)', accent: '#1a237e', badge: '原创剧集' },
        { id: '12', title: '深海', type: 'movies', genre: '动画', year: 2023, rating: 7.4, duration: 112 * 60, desc: '一个名叫参宿的女孩误入梦幻的深海世界，开启一段独特的治愈之旅。', color: 'linear-gradient(135deg, #6a1b9a, #283593)', accent: '#6a1b9a', badge: '电影' }
    ];

    // ============ Generate Episodes ============
    shows.forEach(show => {
        if (show.episodes) {
            show.episodeList = [];
            for (let s = 1; s <= (show.seasons || 1); s++) {
                const epsPerSeason = Math.ceil(show.episodes / (show.seasons || 1));
                for (let e = 1; e <= epsPerSeason; e++) {
                    const globalEp = (s - 1) * epsPerSeason + e;
                    show.episodeList.push({
                        id: `${show.id}-s${s}e${e}`,
                        season: s,
                        episode: e,
                        globalNumber: globalEp,
                        title: `第 ${globalEp} 集`,
                        desc: `${show.title} 第 ${show.seasons > 1 ? `第${s}季 ` : ''}第 ${e} 集。${show.desc.slice(0, 30)}...`,
                        duration: (show.duration ? show.duration : (45 + Math.floor(Math.random() * 15)) * 60),
                        watched: state.watched.includes(`${show.id}-s${s}e${e}`)
                    });
                }
            }
        } else {
            show.episodeList = [{
                id: `${show.id}-movie`,
                season: 1,
                episode: 1,
                globalNumber: 1,
                title: show.title,
                desc: show.desc,
                duration: show.duration,
                watched: state.watched.includes(`${show.id}-movie`)
            }];
        }
    });

    function getShowById(id) {
        return shows.find(s => s.id === id);
    }

    // ============ Render Sidebar ============
    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="tv-sidebar">
                <div class="tv-sidebar-top">
                    <div class="tv-sidebar-title">TV</div>
                    <div class="tv-sidebar-search">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                        <input type="text" id="tv-search-${windowId}" placeholder="搜索" value="${escapeHtml(searchQuery)}">
                    </div>
                </div>
                <div class="tv-sidebar-scroll">
                    ${sections.map(sec => `
                        <div class="tv-sidebar-section ${state.currentSection === sec.id ? 'active' : ''}" data-section="${sec.id}">
                            ${sectionIcons[sec.id]}
                            <span>${sec.name}</span>
                        </div>
                    `).join('')}
                    ${state.watchlist.length > 0 ? `
                        <div class="tv-sidebar-group">
                            <div class="tv-sidebar-group-title">待看列表</div>
                            ${state.watchlist.slice(0, 5).map(id => {
                                const s = getShowById(id);
                                if (!s) return '';
                                return `
                                    <div class="tv-sidebar-show ${state.selectedShowId === s.id ? 'active' : ''}" data-show="${s.id}">
                                        <div class="tv-sidebar-cover" style="background:${s.color};">${s.title.charAt(0)}</div>
                                        <div class="tv-sidebar-show-info">
                                            <div class="tv-sidebar-show-title">${escapeHtml(s.title)}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('[data-section]').forEach(item => {
            item.addEventListener('click', () => {
                state.currentSection = item.dataset.section;
                state.selectedShowId = null;
                saveState();
                renderSidebar();
                renderContent();
            });
        });

        sidebar.querySelectorAll('[data-show]').forEach(item => {
            item.addEventListener('click', () => {
                state.selectedShowId = item.dataset.show;
                saveState();
                renderSidebar();
                renderContent();
            });
        });

        const searchInput = sidebar.querySelector(`#tv-search-${windowId}`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                renderContent();
            });
        }
    }

    // ============ Render Content ============
    function renderContent() {
        if (state.selectedShowId) {
            renderShowDetail();
            return;
        }
        renderBrowse();
    }

    function getFilteredShows() {
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return shows.filter(s => s.title.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q));
        }
        if (state.currentSection === 'home') {
            return shows;
        }
        if (state.currentSection === 'library') {
            return shows.filter(s => state.watchlist.includes(s.id) || state.watched.some(w => w.startsWith(s.id + '-')));
        }
        return shows.filter(s => s.type === state.currentSection);
    }

    function renderBrowse() {
        const list = getFilteredShows();
        if (list.length === 0) {
            const emptyIcon = searchQuery.trim()
                ? '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>'
                : '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg>';
            body.innerHTML = `
                <div class="tv-content">
                    <div class="tv-empty">
                        <div class="tv-empty-icon">${emptyIcon}</div>
                        <div class="tv-empty-text">${searchQuery.trim() ? '未找到相关内容' : '暂无内容'}</div>
                    </div>
                </div>
            `;
            return;
        }

        const featured = state.currentSection === 'home' && !searchQuery.trim() ? list[0] : null;
        const rest = featured ? list.slice(1) : list;
        const sectionTitle = searchQuery.trim() ? `搜索"${searchQuery}"` : { home: '为你推荐', movies: '电影', tvshows: '电视节目', kids: '儿童', library: '资料库' }[state.currentSection];

        body.innerHTML = `
            <div class="tv-content">
                <div class="tv-content-scroll">
                    ${featured ? `
                        <div class="tv-hero" style="background:${featured.color};" data-show="${featured.id}">
                            <div class="tv-hero-info">
                                <div class="tv-hero-badge">${featured.badge}</div>
                                <h1 class="tv-hero-title">${escapeHtml(featured.title)}</h1>
                                <div class="tv-hero-meta">
                                    <span>${featured.year}</span>
                                    <span>·</span>
                                    <span>${featured.genre}</span>
                                    <span>·</span>
                                    <span>★ ${featured.rating}</span>
                                </div>
                                <p class="tv-hero-desc">${escapeHtml(featured.desc)}</p>
                                <div class="tv-hero-actions">
                                    <button class="tv-hero-play" data-show="${featured.id}">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                        <span>播放</span>
                                    </button>
                                    <button class="tv-hero-secondary" data-show="${featured.id}">
                                        ${state.watchlist.includes(featured.id) ? '✓ 已加入待看' : '+ 待看'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    <div class="tv-section">
                        <h2 class="tv-section-title">${sectionTitle}</h2>
                        <div class="tv-grid">
                            ${rest.map(show => `
                                <div class="tv-card" data-show="${show.id}">
                                    <div class="tv-card-poster" style="background:${show.color};">
                                        <span class="tv-card-poster-text">${show.title}</span>
                                        <div class="tv-card-badge">${show.badge}</div>
                                        ${state.watchlist.includes(show.id) ? `<div class="tv-card-check">✓</div>` : ''}
                                    </div>
                                    <div class="tv-card-info">
                                        <div class="tv-card-title">${escapeHtml(show.title)}</div>
                                        <div class="tv-card-meta">${show.year} · ${show.genre} · ★ ${show.rating}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('[data-show]').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.tv-hero-play') || e.target.closest('.tv-hero-secondary')) return;
                state.selectedShowId = card.dataset.show;
                saveState();
                renderSidebar();
                renderContent();
            });
        });

        body.querySelectorAll('.tv-hero-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                playShow(btn.dataset.show);
            });
        });

        body.querySelectorAll('.tv-hero-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWatchlist(btn.dataset.show);
            });
        });
    }

    function renderShowDetail() {
        const show = getShowById(state.selectedShowId);
        if (!show) {
            state.selectedShowId = null;
            renderContent();
            return;
        }
        const inWatchlist = state.watchlist.includes(show.id);
        const episodes = show.episodeList || [];

        body.innerHTML = `
            <div class="tv-content">
                <div class="tv-detail-hero" style="background:${show.color};">
                    <button class="tv-back-btn" id="tv-back-${windowId}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                    <div class="tv-detail-info">
                        <div class="tv-detail-badge">${show.badge}</div>
                        <h1 class="tv-detail-title">${escapeHtml(show.title)}</h1>
                        <div class="tv-detail-meta">
                            <span>${show.year}</span>
                            <span>·</span>
                            <span>${show.genre}</span>
                            <span>·</span>
                            <span>★ ${show.rating}</span>
                            ${show.seasons ? `<span>·</span><span>${show.seasons} 季 ${show.episodes} 集</span>` : `<span>·</span><span>${Math.floor(show.duration / 60)} 分钟</span>`}
                        </div>
                        <p class="tv-detail-desc">${escapeHtml(show.desc)}</p>
                        <div class="tv-detail-actions">
                            <button class="tv-detail-play" id="tv-play-${windowId}">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                <span>${state.watched.some(w => w.startsWith(show.id + '-')) ? '继续观看' : '播放'}</span>
                            </button>
                            <button class="tv-detail-btn ${inWatchlist ? 'active' : ''}" id="tv-watchlist-${windowId}">
                                ${inWatchlist ? '✓ 待看' : '+ 待看'}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="tv-detail-episodes">
                    <h3 class="tv-episodes-title">${show.type === 'movies' ? '影片信息' : '剧集列表'}</h3>
                    ${show.type === 'movies' ? `
                        <div class="tv-movie-info">
                            <div class="tv-movie-info-row"><span>年份</span><span>${show.year}</span></div>
                            <div class="tv-movie-info-row"><span>时长</span><span>${Math.floor(show.duration / 60)} 分钟</span></div>
                            <div class="tv-movie-info-row"><span>类型</span><span>${show.genre}</span></div>
                            <div class="tv-movie-info-row"><span>评分</span><span>★ ${show.rating}</span></div>
                        </div>
                    ` : `
                        <div class="tv-episode-list">
                            ${episodes.map(ep => `
                                <div class="tv-episode-row ${ep.watched ? 'watched' : ''}" data-episode="${ep.id}">
                                    <div class="tv-episode-num">${ep.episode}</div>
                                    <div class="tv-episode-info">
                                        <div class="tv-episode-title">${escapeHtml(ep.title)}</div>
                                        <div class="tv-episode-desc">${escapeHtml(ep.desc)}</div>
                                        <div class="tv-episode-meta">${formatDuration(ep.duration)}${ep.watched ? ' · 已观看' : ''}</div>
                                    </div>
                                    <button class="tv-episode-play" data-episode-id="${ep.id}">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;

        body.querySelector(`#tv-back-${windowId}`).addEventListener('click', () => {
            state.selectedShowId = null;
            saveState();
            renderSidebar();
            renderContent();
        });

        body.querySelector(`#tv-play-${windowId}`).addEventListener('click', () => {
            playShow(show.id);
        });

        body.querySelector(`#tv-watchlist-${windowId}`).addEventListener('click', () => {
            toggleWatchlist(show.id);
        });

        body.querySelectorAll('[data-episode-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                playEpisode(show.id, btn.dataset.episodeId);
            });
        });
    }

    function playShow(showId) {
        const show = getShowById(showId);
        if (!show) return;
        const ep = show.episodeList[0];
        if (ep) playEpisode(showId, ep.id);
    }

    function playEpisode(showId, episodeId) {
        const show = getShowById(showId);
        if (!show) return;
        const ep = show.episodeList.find(e => e.id === episodeId);
        if (!ep) return;
        state.playingShowId = showId;
        state.playingEpisodeId = episodeId;
        state.isPlaying = true;
        state.currentTime = 0;
        state.duration = ep.duration;
        saveState();
        renderPlayer();
    }

    function toggleWatchlist(showId) {
        const idx = state.watchlist.indexOf(showId);
        if (idx > -1) state.watchlist.splice(idx, 1);
        else state.watchlist.unshift(showId);
        saveState();
        renderSidebar();
        if (state.selectedShowId) renderShowDetail();
        else renderBrowse();
    }

    let playInterval = null;
    function renderPlayer() {
        let playerBar = body.parentElement.querySelector(`#tv-player-bar-${windowId}`);
        if (playerBar) playerBar.remove();

        if (!state.playingShowId || !state.playingEpisodeId) return;
        const show = getShowById(state.playingShowId);
        const ep = show.episodeList.find(e => e.id === state.playingEpisodeId);
        if (!show || !ep) return;

        playerBar = document.createElement('div');
        playerBar.className = 'tv-player-bar';
        playerBar.id = `tv-player-bar-${windowId}`;
        playerBar.innerHTML = `
            <div class="tv-player-poster" style="background:${show.color};">
                <span>${show.title.charAt(0)}</span>
            </div>
            <div class="tv-player-info">
                <div class="tv-player-title">${escapeHtml(ep.title)}</div>
                <div class="tv-player-show">${escapeHtml(show.title)}</div>
                <div class="tv-player-progress" id="tv-player-track-${windowId}">
                    <div class="tv-player-progress-fill" id="tv-player-fill-${windowId}" style="width:${(state.currentTime / state.duration) * 100}%;"></div>
                </div>
                <div class="tv-player-time">
                    <span id="tv-player-current-${windowId}">${formatDuration(state.currentTime)}</span>
                    <span id="tv-player-total-${windowId}">${formatDuration(state.duration)}</span>
                </div>
            </div>
            <div class="tv-player-controls">
                <button class="tv-player-btn" id="tv-player-back-${windowId}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
                </button>
                <button class="tv-player-btn main" id="tv-player-toggle-${windowId}">
                    ${state.isPlaying ?
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>` :
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`}
                </button>
                <button class="tv-player-btn" id="tv-player-fwd-${windowId}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
                </button>
            </div>
        `;
        body.parentElement.appendChild(playerBar);

        playerBar.querySelector(`#tv-player-toggle-${windowId}`)?.addEventListener('click', () => {
            state.isPlaying = !state.isPlaying;
            saveState();
            renderPlayer();
        });
        playerBar.querySelector(`#tv-player-back-${windowId}`)?.addEventListener('click', () => {
            state.currentTime = Math.max(0, state.currentTime - 10);
            saveState();
            renderPlayer();
        });
        playerBar.querySelector(`#tv-player-fwd-${windowId}`)?.addEventListener('click', () => {
            state.currentTime = Math.min(state.duration, state.currentTime + 10);
            saveState();
            renderPlayer();
        });

        startPlayback();
    }

    function startPlayback() {
        if (playInterval) clearInterval(playInterval);
        if (!state.isPlaying) return;
        playInterval = setInterval(() => {
            state.currentTime += 1;
            if (state.currentTime >= state.duration) {
                state.isPlaying = false;
                state.currentTime = 0;
                if (!state.watched.includes(state.playingEpisodeId)) {
                    state.watched.push(state.playingEpisodeId);
                }
                saveState();
                clearInterval(playInterval);
            }
            saveState();
            const fill = document.getElementById(`tv-player-fill-${windowId}`);
            const cur = document.getElementById(`tv-player-current-${windowId}`);
            if (fill) fill.style.width = `${(state.currentTime / state.duration) * 100}%`;
            if (cur) cur.textContent = formatDuration(state.currentTime);
        }, 1000);
    }

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = '';
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderToolbar();
        renderSidebar();
        renderContent();
        if (state.playingShowId) renderPlayer();
    }

    render();
};
