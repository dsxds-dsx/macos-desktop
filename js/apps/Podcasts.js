window.renderPodcasts = function(body, sidebar, toolbar, windowId) {
    // ============ Persistent State ============
    let state = JSON.parse(localStorage.getItem('macos_podcasts_state') || 'null') || {
        currentSection: 'listen_now',
        selectedShowId: null,
        playingEpisodeId: null,
        isPlaying: false,
        currentTime: 0,
        speed: 1,
        sleepTimer: null,
        subscriptions: ['1', '2', '3', '4'],
        downloads: ['e1-1', 'e2-1'],
        playbackPositions: {}
    };
    let searchQuery = '';
    let playInterval = null;

    function saveState() {
        localStorage.setItem('macos_podcasts_state', JSON.stringify(state));
    }

    // ============ Podcast Library ============
    const library = {
        shows: [
            { id: '1', title: '科技乱炖', author: '科技评论', cover: '🎙️', color: 'linear-gradient(135deg, #667eea, #764ba2)', category: '科技', desc: '一档关注科技行业动态、深度评测和趋势分析的播客节目。每期邀请业内专家，深度探讨科技话题。', episodes: 156, rating: 4.8, subscribers: '128万' },
            { id: '2', title: '故事FM', author: '故事FM', cover: '📻', color: 'linear-gradient(135deg, #f093fb, #f5576c)', category: '人文', desc: '用第一人称讲述普通人的真实故事，记录这个时代的声音。', episodes: 423, rating: 4.9, subscribers: '256万' },
            { id: '3', title: '日谈公园', author: '李志明', cover: '🎧', color: 'linear-gradient(135deg, #4facfe, #00f2fe)', category: '生活', desc: '一档轻松的生活类播客，聊日常、聊文化、聊一切有趣的事。', episodes: 312, rating: 4.7, subscribers: '89万' },
            { id: '4', title: '忽左忽右', author: '程衍樑', cover: '🎤', color: 'linear-gradient(135deg, #43e97b, #38f9d7)', category: '时政', desc: '严肃话题的轻松讨论，关注国际视野下的中国与世界。', episodes: 245, rating: 4.8, subscribers: '67万' },
            { id: '5', title: '声东击西', author: '声东击西', cover: '📢', color: 'linear-gradient(135deg, #fa709a, #fee140)', category: '国际', desc: '立足国际视野，探讨科技、商业与文化领域的全球趋势。', episodes: 189, rating: 4.6, subscribers: '45万' },
            { id: '6', title: '得意忘形', author: '张潇雨', cover: '🎵', color: 'linear-gradient(135deg, #a8edea, #fed6e3)', category: '个人成长', desc: '关于个人成长、思维方式和人生选择的深度对话。', episodes: 87, rating: 4.9, subscribers: '32万' },
            { id: '7', title: '商业就是这样', author: '商业观察', cover: '📊', color: 'linear-gradient(135deg, #0ba360, #3cba92)', category: '商业', desc: '解读商业事件背后的逻辑，洞察商业世界的运作法则。', episodes: 98, rating: 4.7, subscribers: '56万' },
            { id: '8', title: '大内密谈', author: '相征', cover: '🎸', color: 'linear-gradient(135deg, #ee0979, #ff6a00)', category: '音乐', desc: '国内最早的音乐播客之一，深度聊音乐与文化。', episodes: 234, rating: 4.8, subscribers: '78万' }
        ]
    };

    // Generate episodes for each show
    library.episodes = {};
    library.shows.forEach(show => {
        const eps = [];
        const topicsByCat = {
            '科技': ['AI 前沿观察', '科技巨头财报分析', '硬件创新趋势', '互联网产品思考', '芯片战争解读'],
            '人文': ['一个普通人的故事', '时代记忆', '城市与人', '选择的勇气', '记忆中的味道'],
            '生活': ['周末闲聊', '生活美学', '咖啡与人生', '旅行随笔', '关于读书这件事'],
            '时政': ['国际格局观察', '东南亚局势', '中美关系思考', '欧洲走向何方', '拉美的未来'],
            '国际': ['硅谷见闻', '中东局势', '非洲新故事', '科技脱钩', '全球化反思'],
            '个人成长': ['关于焦虑', '如何做选择', '专注的力量', '失败的礼物', '身份认同'],
            '商业': ['品牌的力量', '渠道战争', '新消费时代', '价格与价值', '渠道变革'],
            '音乐': ['华语音乐三十年', '摇滚不死', '电子音乐浪潮', '民谣复兴', '嘻哈文化']
        };
        const topics = topicsByCat[show.category] || ['第N期'];
        for (let i = 0; i < 8; i++) {
            const epNum = show.episodes - i;
            const daysAgo = i === 0 ? 0 : (i === 1 ? 1 : (i === 2 ? 3 : (i * 4 + Math.floor(Math.random() * 3))));
            const d = new Date();
            d.setDate(d.getDate() - daysAgo);
            const topic = topics[i % topics.length];
            const duration = 35 * 60 + Math.floor(Math.random() * 30 * 60);
            eps.push({
                id: `e${show.id}-${i + 1}`,
                showId: show.id,
                number: epNum,
                title: `第${epNum}期：${topic}`,
                desc: `${show.title} 第${epNum}期节目。本期节目将深入讨论${topic}相关话题，欢迎收听。时长约${Math.floor(duration / 60)}分钟。`,
                date: d.getTime(),
                duration: duration,
                progress: state.playbackPositions[`e${show.id}-${i + 1}`] || 0
            });
        }
        library.episodes[show.id] = eps;
    });

    // ============ Sidebar Navigation ============
    const sections = [
        { id: 'listen_now', name: '现在就听', icon: 'play.circle' },
        { id: 'browse', name: '浏览', icon: 'safari' },
        { id: 'library', name: '资料库', icon: 'books' },
        { id: 'downloads', name: '已下载', icon: 'arrow.down.circle' },
        { id: 'subscriptions', name: '已订阅', icon: 'star' }
    ];

    const sectionIcons = {
        'listen_now': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`,
        'browse': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="#fff"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>`,
        'library': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.95 4.9 1.5 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>`,
        'downloads': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>`,
        'subscriptions': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
    };

    function getEpisodeById(id) {
        for (const showId of Object.keys(library.episodes)) {
            const e = library.episodes[showId].find(e => e.id === id);
            if (e) return { ...e, show: library.shows.find(s => s.id === showId) };
        }
        return null;
    }

    function renderSidebar() {
        if (!sidebar) return;
        const subscribedShows = library.shows.filter(s => state.subscriptions.includes(s.id));
        sidebar.innerHTML = `
            <div class="podcasts-sidebar">
                <div class="podcasts-sidebar-top">
                    <div class="podcasts-sidebar-title">播客</div>
                    <div class="podcasts-sidebar-search">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                        <input type="text" id="podcasts-search-${windowId}" placeholder="搜索" value="${escapeHtml(searchQuery)}">
                    </div>
                </div>
                <div class="podcasts-sidebar-sections">
                    ${sections.map(sec => `
                        <div class="podcasts-sidebar-section ${state.currentSection === sec.id ? 'active' : ''}" data-section="${sec.id}">
                            ${sectionIcons[sec.id]}
                            <span>${sec.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="podcasts-sidebar-divider"></div>
                <div class="podcasts-sidebar-group">
                    <div class="podcasts-sidebar-group-title">已订阅</div>
                    ${subscribedShows.length === 0 ? `
                        <div class="podcasts-sidebar-empty">还没有订阅</div>
                    ` : subscribedShows.map(s => `
                        <div class="podcasts-sidebar-show ${state.selectedShowId === s.id ? 'active' : ''}" data-show="${s.id}">
                            <div class="podcasts-sidebar-cover" style="background:${s.color};">${s.cover}</div>
                            <div class="podcasts-sidebar-show-info">
                                <div class="podcasts-sidebar-show-title">${escapeHtml(s.title)}</div>
                                <div class="podcasts-sidebar-show-author">${escapeHtml(s.author)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('.podcasts-sidebar-section').forEach(el => {
            el.addEventListener('click', () => {
                state.currentSection = el.dataset.section;
                state.selectedShowId = null;
                saveState();
                render();
            });
        });
        sidebar.querySelectorAll('[data-show]').forEach(el => {
            el.addEventListener('click', () => {
                state.selectedShowId = el.dataset.show;
                state.currentSection = 'library';
                saveState();
                render();
            });
        });
        const searchInput = sidebar.querySelector(`#podcasts-search-${windowId}`);
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                searchQuery = searchInput.value;
                render();
            });
        }
    }

    function escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    function formatTime(ts) {
        const d = new Date(ts);
        const now = new Date();
        const diff = (now - d) / 1000;
        if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
        if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
        if (diff < 86400 * 2) return '昨天';
        if (diff < 86400 * 7) return Math.floor(diff / 86400) + ' 天前';
        return (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }

    function formatDuration(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        if (h > 0) return h + ' 小时 ' + m + ' 分钟';
        return m + ' 分钟';
    }

    function formatPlayTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' + s : s);
    }

    function getFilteredEpisodes() {
        let allEpisodes = [];
        Object.keys(library.episodes).forEach(showId => {
            const show = library.shows.find(s => s.id === showId);
            library.episodes[showId].forEach(ep => {
                allEpisodes.push({ ...ep, show: show });
            });
        });

        if (state.currentSection === 'downloads') {
            allEpisodes = allEpisodes.filter(e => state.downloads.includes(e.id));
        } else if (state.currentSection === 'subscriptions') {
            allEpisodes = allEpisodes.filter(e => state.subscriptions.includes(e.showId));
        } else if (state.currentSection === 'listen_now') {
            allEpisodes = allEpisodes.filter(e => state.subscriptions.includes(e.showId));
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            allEpisodes = allEpisodes.filter(e =>
                e.title.toLowerCase().includes(q) ||
                (e.show && e.show.title.toLowerCase().includes(q))
            );
        }

        allEpisodes.sort((a, b) => b.date - a.date);
        return allEpisodes;
    }

    function renderShowDetail() {
        const show = library.shows.find(s => s.id === state.selectedShowId);
        if (!show) {
            state.selectedShowId = null;
            renderContent();
            return;
        }
        const episodes = library.episodes[show.id] || [];
        const isSubscribed = state.subscriptions.includes(show.id);

        body.innerHTML = `
            <div class="podcasts-content">
                <div class="podcasts-show-hero" style="background:${show.color};">
                    <button class="podcasts-back-btn" id="podcasts-back-${windowId}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                    <div class="podcasts-show-cover">${show.cover}</div>
                    <div class="podcasts-show-meta">
                        <div class="podcasts-show-type">播客</div>
                        <h1 class="podcasts-show-title">${escapeHtml(show.title)}</h1>
                        <div class="podcasts-show-author">${escapeHtml(show.author)}</div>
                        <div class="podcasts-show-stats">
                            <span>${show.episodes} 集</span>
                            <span class="dot">·</span>
                            <span>★ ${show.rating}</span>
                            <span class="dot">·</span>
                            <span>${show.subscribers} 订阅</span>
                        </div>
                        <div class="podcasts-show-actions">
                            <button class="podcasts-subscribe-btn ${isSubscribed ? 'subscribed' : ''}" id="podcasts-subscribe-${windowId}">
                                ${isSubscribed ? '已订阅' : '+ 订阅'}
                            </button>
                            <button class="podcasts-play-all-btn" id="podcasts-play-all-${windowId}">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                播放
                            </button>
                            <button class="podcasts-share-btn" id="podcasts-share-${windowId}">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="podcasts-show-desc">${escapeHtml(show.desc)}</div>
                <div class="podcasts-show-section-title">单集</div>
                <div class="podcasts-episodes-list">
                    ${episodes.map(ep => renderEpisodeRow(ep)).join('')}
                </div>
                <div style="height:100px;"></div>
            </div>
        `;

        body.querySelector(`#podcasts-back-${windowId}`).addEventListener('click', () => {
            state.selectedShowId = null;
            saveState();
            render();
        });
        body.querySelector(`#podcasts-subscribe-${windowId}`).addEventListener('click', (e) => {
            const idx = state.subscriptions.indexOf(show.id);
            if (idx >= 0) {
                state.subscriptions.splice(idx, 1);
                if (window.toast) window.toast(`已取消订阅 ${show.title}`, 'info');
            } else {
                state.subscriptions.push(show.id);
                if (window.toast) window.toast(`已订阅 ${show.title}`, 'success');
            }
            saveState();
            renderSidebar();
            renderContent();
        });
        body.querySelector(`#podcasts-play-all-${windowId}`).addEventListener('click', () => {
            if (episodes.length > 0) {
                playEpisode(episodes[0]);
            }
        });
        body.querySelector(`#podcasts-share-${windowId}`).addEventListener('click', () => {
            if (window.toast) window.toast('分享链接已复制', 'success');
        });
        bindEpisodeEvents();
    }

    function renderEpisodeRow(ep) {
        const isPlaying = state.playingEpisodeId === ep.id && state.isPlaying;
        const isCurrent = state.playingEpisodeId === ep.id;
        const isDownloaded = state.downloads.includes(ep.id);
        const progress = ep.progress > 0 ? Math.min(100, (ep.progress / ep.duration) * 100) : 0;
        return `
            <div class="podcasts-episode-row ${isCurrent ? 'current' : ''}" data-ep="${ep.id}">
                <button class="podcasts-ep-play" data-action="play" data-ep="${ep.id}">
                    ${isPlaying ?
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>` :
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`}
                </button>
                <div class="podcasts-ep-info">
                    <div class="podcasts-ep-title">${escapeHtml(ep.title)}</div>
                    <div class="podcasts-ep-desc">${escapeHtml(ep.desc)}</div>
                    <div class="podcasts-ep-meta">
                        <span>${formatTime(ep.date)}</span>
                        <span class="dot">·</span>
                        <span>${formatDuration(ep.duration)}</span>
                        ${isDownloaded ? `<span class="dot">·</span><span class="downloaded-badge">已下载</span>` : ''}
                    </div>
                    ${progress > 0 ? `<div class="podcasts-ep-progress"><div class="podcasts-ep-progress-bar" style="width:${progress}%;"></div></div>` : ''}
                </div>
                <button class="podcasts-ep-more" data-action="more" data-ep="${ep.id}">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                </button>
            </div>
        `;
    }

    function bindEpisodeEvents() {
        body.querySelectorAll('[data-action="play"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const epId = btn.dataset.ep;
                const ep = getEpisodeById(epId);
                if (!ep) return;
                if (state.playingEpisodeId === epId && state.isPlaying) {
                    pauseEpisode();
                } else {
                    playEpisode(ep);
                }
            });
        });
        body.querySelectorAll('[data-action="more"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const epId = btn.dataset.ep;
                showEpisodeMenu(epId, e.clientX, e.clientY);
            });
        });
        body.querySelectorAll('.podcasts-episode-row').forEach(row => {
            row.addEventListener('click', () => {
                const epId = row.dataset.ep;
                const ep = getEpisodeById(epId);
                if (ep) {
                    showEpisodeDetail(ep);
                }
            });
        });
    }

    function showEpisodeMenu(epId, x, y) {
        // Close existing menu
        const existing = document.getElementById('podcasts-context-menu');
        if (existing) existing.remove();

        const ep = getEpisodeById(epId);
        if (!ep) return;
        const isDownloaded = state.downloads.includes(epId);

        const menu = document.createElement('div');
        menu.className = 'podcasts-context-menu';
        menu.id = 'podcasts-context-menu';
        menu.innerHTML = `
            <div class="podcasts-menu-item" data-action="play">播放</div>
            <div class="podcasts-menu-item" data-action="play-next">接下来播放</div>
            <div class="podcasts-menu-item" data-action="${isDownloaded ? 'remove-download' : 'download'}">${isDownloaded ? '移除下载' : '下载单集'}</div>
            <div class="podcasts-menu-divider"></div>
            <div class="podcasts-menu-item" data-action="mark-played">标记为已播放</div>
            <div class="podcasts-menu-item" data-action="share">分享</div>
        `;
        document.body.appendChild(menu);
        const rect = menu.getBoundingClientRect();
        let mx = x;
        let my = y;
        if (mx + rect.width > window.innerWidth - 10) mx = window.innerWidth - rect.width - 10;
        if (my + rect.height > window.innerHeight - 10) my = window.innerHeight - rect.height - 10;
        menu.style.left = mx + 'px';
        menu.style.top = my + 'px';
        requestAnimationFrame(() => menu.classList.add('show'));

        menu.querySelectorAll('.podcasts-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                switch (action) {
                    case 'play': playEpisode(ep); break;
                    case 'play-next': if (window.toast) window.toast('已加入播放队列', 'success'); break;
                    case 'download':
                        if (!isDownloaded) {
                            state.downloads.push(epId);
                            saveState();
                            if (window.toast) window.toast('开始下载', 'info');
                            renderContent();
                        }
                        break;
                    case 'remove-download':
                        const idx = state.downloads.indexOf(epId);
                        if (idx >= 0) {
                            state.downloads.splice(idx, 1);
                            saveState();
                            if (window.toast) window.toast('已移除下载', 'info');
                            renderContent();
                        }
                        break;
                    case 'mark-played':
                        if (window.toast) window.toast('已标记为已播放', 'success');
                        break;
                    case 'share':
                        if (window.toast) window.toast('分享链接已复制', 'success');
                        break;
                }
                menu.remove();
            });
        });
        setTimeout(() => {
            const handler = (e) => {
                if (!e.target.closest('#podcasts-context-menu')) {
                    menu.remove();
                    document.removeEventListener('click', handler);
                }
            };
            document.addEventListener('click', handler);
        }, 100);
    }

    function showEpisodeDetail(ep) {
        // For simplicity, just play if not playing, else show info via toast
        if (state.playingEpisodeId !== ep.id) {
            playEpisode(ep);
        }
    }

    function playEpisode(ep) {
        // Save progress of previous episode
        if (state.playingEpisodeId) {
            state.playbackPositions[state.playingEpisodeId] = state.currentTime;
        }
        state.playingEpisodeId = ep.id;
        state.currentTime = ep.progress || 0;
        state.isPlaying = true;
        saveState();
        startPlayback();
        renderContent();
        renderPlayer();
    }

    function pauseEpisode() {
        state.isPlaying = false;
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
        saveState();
        renderContent();
        renderPlayer();
    }

    function startPlayback() {
        if (playInterval) clearInterval(playInterval);
        const ep = getEpisodeById(state.playingEpisodeId);
        if (!ep) return;
        playInterval = setInterval(() => {
            state.currentTime += state.speed;
            if (state.currentTime >= ep.duration) {
                // Next episode
                state.playbackPositions[ep.id] = 0;
                const allEps = getFilteredEpisodes();
                const idx = allEps.findIndex(e => e.id === ep.id);
                if (idx >= 0 && idx < allEps.length - 1) {
                    playEpisode(allEps[idx + 1]);
                } else {
                    state.isPlaying = false;
                    state.currentTime = 0;
                    if (playInterval) clearInterval(playInterval);
                    playInterval = null;
                }
            }
            updatePlayerTime();
        }, 1000 / state.speed);
    }

    function updatePlayerTime() {
        const ep = getEpisodeById(state.playingEpisodeId);
        if (!ep) return;
        const progressEl = body.querySelector(`#podcasts-player-progress-${windowId}`);
        if (progressEl) {
            const pct = (state.currentTime / ep.duration) * 100;
            progressEl.style.width = pct + '%';
        }
        const curEl = body.querySelector(`#podcasts-player-current-${windowId}`);
        if (curEl) curEl.textContent = formatPlayTime(state.currentTime);
        const durEl = body.querySelector(`#podcasts-player-duration-${windowId}`);
        if (durEl) durEl.textContent = formatPlayTime(ep.duration);
        // Update playing icon in episode list
        const playBtn = body.querySelector(`[data-action="play"][data-ep="${ep.id}"]`);
        if (playBtn) {
            playBtn.innerHTML = state.isPlaying ?
                `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>` :
                `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        }
    }

    function renderContent() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.background = 'var(--bg-elevated)';
        if (state.selectedShowId) {
            renderShowDetail();
            return;
        }

        const episodes = getFilteredEpisodes();
        let sectionName = sections.find(s => s.id === state.currentSection)?.name || '播客';
        let subtitle = '';
        if (state.currentSection === 'listen_now') subtitle = '你订阅播客的最新单集';
        else if (state.currentSection === 'browse') subtitle = '发现更多精彩播客';
        else if (state.currentSection === 'library') subtitle = '所有已订阅的播客';
        else if (state.currentSection === 'downloads') subtitle = '已下载的单集';
        else if (state.currentSection === 'subscriptions') subtitle = '你订阅的播客最新更新';

        body.innerHTML = `
            <div class="podcasts-content">
                <div class="podcasts-content-header">
                    <h1 class="podcasts-content-title">${sectionName}</h1>
                    <div class="podcasts-content-subtitle">${subtitle}</div>
                </div>
                ${state.currentSection === 'browse' || state.currentSection === 'library' ? `
                    <div class="podcasts-shows-grid">
                        ${library.shows
                            .filter(s => state.currentSection !== 'library' || state.subscriptions.includes(s.id))
                            .map(s => `
                            <div class="podcasts-show-card" data-show="${s.id}">
                                <div class="podcasts-show-card-cover" style="background:${s.color};">${s.cover}</div>
                                <div class="podcasts-show-card-title">${escapeHtml(s.title)}</div>
                                <div class="podcasts-show-card-author">${escapeHtml(s.author)}</div>
                                <div class="podcasts-show-card-stats">${s.episodes} 集 · ${s.subscribers}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${state.currentSection !== 'browse' && state.currentSection !== 'library' ? `
                    ${episodes.length === 0 ? `
                        <div class="podcasts-empty">
                            <div class="podcasts-empty-icon">🎙️</div>
                            <div class="podcasts-empty-text">暂无内容</div>
                        </div>
                    ` : `
                        <div class="podcasts-episodes-list">
                            ${episodes.map(ep => renderEpisodeRow(ep)).join('')}
                        </div>
                    `}
                ` : ''}
                <div style="height:100px;"></div>
            </div>
        `;
        body.querySelectorAll('[data-show]').forEach(el => {
            el.addEventListener('click', () => {
                state.selectedShowId = el.dataset.show;
                saveState();
                render();
            });
        });
        bindEpisodeEvents();
    }

    function renderPlayer() {
        let playerBar = body.querySelector(`#podcasts-player-bar-${windowId}`);
        if (playerBar) playerBar.remove();

        if (!state.playingEpisodeId) return;
        const ep = getEpisodeById(state.playingEpisodeId);
        if (!ep) return;

        playerBar = document.createElement('div');
        playerBar.className = 'podcasts-player-bar';
        playerBar.id = `podcasts-player-bar-${windowId}`;
        playerBar.innerHTML = `
            <div class="podcasts-player-cover" style="background:${ep.show.color};">${ep.show.cover}</div>
            <div class="podcasts-player-info">
                <div class="podcasts-player-title">${escapeHtml(ep.title)}</div>
                <div class="podcasts-player-show">${escapeHtml(ep.show.title)}</div>
                <div class="podcasts-player-progress-track" id="podcasts-player-track-${windowId}">
                    <div class="podcasts-player-progress" id="podcasts-player-progress-${windowId}" style="width:${(state.currentTime / ep.duration) * 100}%;"></div>
                </div>
                <div class="podcasts-player-time">
                    <span id="podcasts-player-current-${windowId}">${formatPlayTime(state.currentTime)}</span>
                    <span id="podcasts-player-duration-${windowId}">${formatPlayTime(ep.duration)}</span>
                </div>
            </div>
            <div class="podcasts-player-controls">
                <button class="podcasts-player-btn" id="podcasts-player-back15-${windowId}" title="后退 15 秒">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9h3a6 6 0 1 1-6 6"/><text x="12" y="15" font-size="7" font-weight="700" fill="currentColor" stroke="none" text-anchor="middle">15</text></svg>
                </button>
                <button class="podcasts-player-btn main" id="podcasts-player-toggle-${windowId}">
                    ${state.isPlaying ?
                        `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>` :
                        `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`}
                </button>
                <button class="podcasts-player-btn" id="podcasts-player-fwd15-${windowId}" title="前进 30 秒">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5l5 4h-3a6 6 0 1 0 6 6"/><text x="12" y="15" font-size="7" font-weight="700" fill="currentColor" stroke="none" text-anchor="middle">30</text></svg>
                </button>
                <button class="podcasts-player-btn" id="podcasts-player-speed-${windowId}" title="播放速度">
                    ${state.speed}×
                </button>
            </div>
        `;
        // Insert at end of body's parent (the window-content) so it overlays at the bottom
        const windowContent = body.closest('.window-content');
        if (windowContent) {
            windowContent.appendChild(playerBar);
        } else {
            body.appendChild(playerBar);
        }

        playerBar.querySelector(`#podcasts-player-toggle-${windowId}`).addEventListener('click', () => {
            if (state.isPlaying) {
                pauseEpisode();
            } else {
                state.isPlaying = true;
                startPlayback();
                saveState();
                renderPlayer();
                renderContent();
            }
        });
        playerBar.querySelector(`#podcasts-player-back15-${windowId}`).addEventListener('click', () => {
            state.currentTime = Math.max(0, state.currentTime - 15);
            updatePlayerTime();
        });
        playerBar.querySelector(`#podcasts-player-fwd15-${windowId}`).addEventListener('click', () => {
            state.currentTime = Math.min(ep.duration, state.currentTime + 30);
            updatePlayerTime();
        });
        playerBar.querySelector(`#podcasts-player-speed-${windowId}`).addEventListener('click', () => {
            const speeds = [1, 1.25, 1.5, 1.75, 2, 0.75];
            const idx = speeds.indexOf(state.speed);
            state.speed = speeds[(idx + 1) % speeds.length];
            saveState();
            renderPlayer();
            if (state.isPlaying) {
                if (playInterval) clearInterval(playInterval);
                startPlayback();
            }
        });
        const track = playerBar.querySelector(`#podcasts-player-track-${windowId}`);
        if (track) {
            track.addEventListener('click', (e) => {
                const rect = track.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                state.currentTime = ep.duration * pct;
                updatePlayerTime();
            });
        }
    }

    function render() {
        renderSidebar();
        renderContent();
        renderPlayer();
    }

    // Toolbar
    if (toolbar) {
        toolbar.innerHTML = `
            <div class="podcasts-toolbar">
                <div class="podcasts-toolbar-back" id="podcasts-tb-back-${windowId}">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </div>
                <div style="flex:1"></div>
                <button class="podcasts-toolbar-btn" id="podcasts-tb-refresh-${windowId}" title="刷新">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>
                </button>
                <button class="podcasts-toolbar-btn" id="podcasts-tb-share-${windowId}" title="分享">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
                </button>
            </div>
        `;
        const backBtn = toolbar.querySelector(`#podcasts-tb-back-${windowId}`);
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (state.selectedShowId) {
                    state.selectedShowId = null;
                    saveState();
                    render();
                }
            });
        }
        toolbar.querySelector(`#podcasts-tb-refresh-${windowId}`).addEventListener('click', () => {
            if (window.toast) window.toast('已刷新播客库', 'success');
            render();
        });
        toolbar.querySelector(`#podcasts-tb-share-${windowId}`).addEventListener('click', () => {
            if (window.toast) window.toast('分享链接已复制', 'success');
        });
    }

    // Resume playback if needed
    if (state.playingEpisodeId && state.isPlaying) {
        startPlayback();
    }

    render();
};
