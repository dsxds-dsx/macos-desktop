// iMovie - 视频编辑 (macOS Sonoma)
window.renderiMovie = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_imovie_v3';
    const STATE_KEY = STORAGE_KEY + '_state';

    function defaultProjects() {
        return [
            { id: 1, name: '度假视频', duration: '2:34', date: '2024-01-15', clips: 5, color: 'linear-gradient(135deg,#4a90d9,#764ba2)' },
            { id: 2, name: '家庭聚会', duration: '5:12', date: '2024-01-10', clips: 12, color: 'linear-gradient(135deg,#f093fb,#f5576c)' },
            { id: 3, name: '生日派对', duration: '3:45', date: '2024-01-05', clips: 8, color: 'linear-gradient(135deg,#fa709a,#fee140)' }
        ];
    }

    function defaultClips() {
        return [
            { id: 1, name: '开场.mp4', duration: 8, color: '#4A90D9' },
            { id: 2, name: '海滩1.mp4', duration: 12, color: '#D94A4A' },
            { id: 3, name: '日落.mp4', duration: 6, color: '#4AD97A' },
            { id: 4, name: '晚餐.mp4', duration: 15, color: '#D9A64A' }
        ];
    }

    function defaultState() {
        return { currentProjectId: null, currentTab: 'movie', isPlaying: false, nextProjectId: 4, nextClipId: 5, playheadPos: 0 };
    }

    function migrateOld() {
        const oldProjects = JSON.parse(localStorage.getItem('macos_imovie_v2_projects') || 'null');
        const oldClips = JSON.parse(localStorage.getItem('macos_imovie_v2_clips') || 'null');
        const oldState = JSON.parse(localStorage.getItem('macos_imovie_v2_state') || 'null');
        if (!Array.isArray(oldProjects) || !oldProjects.length) return null;
        return {
            projects: oldProjects,
            clips: Array.isArray(oldClips) ? oldClips : [],
            state: oldState || defaultState()
        };
    }

    let projects, clips, state;
    const migrated = migrateOld();
    projects = JSON.parse(localStorage.getItem(STORAGE_KEY + '_projects') || 'null') || (migrated ? migrated.projects : null) || defaultProjects();
    clips = JSON.parse(localStorage.getItem(STORAGE_KEY + '_clips') || 'null') || (migrated ? migrated.clips : null) || defaultClips();
    state = JSON.parse(localStorage.getItem(STATE_KEY) || 'null') || (migrated ? migrated.state : null) || defaultState();
    state.isPlaying = false;

    function save() {
        localStorage.setItem(STORAGE_KEY + '_projects', JSON.stringify(projects));
        localStorage.setItem(STORAGE_KEY + '_clips', JSON.stringify(clips));
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    }
    function showToast(text, type) {
        if (window.toast) window.toast(text, type || 'info');
        else if (window.Toast) window.Toast.show(text);
    }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function fmtTime(sec) {
        sec = Math.max(0, Math.floor(sec));
        return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
    }

    // ----- SVG icons -----
    const ICON = {
        play: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
        pause: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
        back: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
        add: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
        share: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>',
        film: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 9h5M2 15h5M17 9h5M17 15h5"/></svg>',
        video: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
        music: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
        transition: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h6M4 12h12M4 18h8M16 12l4-4M16 12l4 4"/></svg>',
        adjust: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/></svg>',
        trash: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        split: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6M12 15v6M5 12h6M13 12h6"/><circle cx="12" cy="12" r="2"/></svg>',
        volume: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>'
    };

    const projectColors = [
        'linear-gradient(135deg,#4a90d9,#764ba2)',
        'linear-gradient(135deg,#f093fb,#f5576c)',
        'linear-gradient(135deg,#fa709a,#fee140)',
        'linear-gradient(135deg,#30cfd0,#330867)',
        'linear-gradient(135deg,#667eea,#764ba2)',
        'linear-gradient(135deg,#11998e,#38ef7d)'
    ];

    const clipColors = ['#4A90D9', '#D94A4A', '#4AD97A', '#D9A64A', '#9B59B6', '#E67E22'];

    const mediaTypes = [
        { id: 'video', name: '视频片段', icon: 'video' },
        { id: 'music', name: '音频', icon: 'music' },
        { id: 'transition', name: '转场', icon: 'transition' },
        { id: 'adjust', name: '调整', icon: 'adjust' }
    ];

    const transitions = [
        { name: '交叉叠化', dur: 1.0 },
        { name: '推入', dur: 0.8 },
        { name: '擦除', dur: 1.2 },
        { name: '缩放', dur: 0.6 },
        { name: '旋转', dur: 1.5 },
        { name: '淡入', dur: 1.0 }
    ];

    let playTimer = null;
    let selectedClipId = null;

    function getCurrentProject() {
        return projects.find(p => p.id === state.currentProjectId) || null;
    }

    function getTotalDuration() {
        return clips.reduce((a, c) => a + c.duration, 0);
    }

    function renderToolbar() {
        if (!toolbar) return;
        const proj = getCurrentProject();
        if (proj) {
            const totalStr = fmtTime(getTotalDuration());
            toolbar.innerHTML = `
                <div class="imovie-toolbar">
                    <button class="imovie-tb-btn" id="imovie-back" title="返回">${ICON.back}<span>项目</span></button>
                    <div class="imovie-tb-sep"></div>
                    <span class="imovie-tb-title">${escapeHtml(proj.name)}</span>
                    <span class="imovie-tb-dur">${totalStr}</span>
                    <div class="imovie-tb-spacer"></div>
                    <button class="imovie-tb-btn" id="imovie-split" title="分割片段">${ICON.split}</button>
                    <button class="imovie-play-btn ${state.isPlaying ? 'playing' : ''}" id="imovie-play" title="${state.isPlaying ? '暂停' : '播放'}">${state.isPlaying ? ICON.pause : ICON.play}</button>
                    <div class="imovie-tb-sep"></div>
                    <button class="imovie-tb-btn primary" id="imovie-share" title="分享">${ICON.share}<span>分享</span></button>
                </div>
            `;
            toolbar.querySelector('#imovie-back')?.addEventListener('click', () => {
                stopPlayback();
                state.currentProjectId = null;
                selectedClipId = null;
                save();
                render();
            });
            toolbar.querySelector('#imovie-play')?.addEventListener('click', () => {
                if (state.isPlaying) {
                    stopPlayback();
                } else {
                    startPlayback();
                }
                renderToolbar();
            });
            toolbar.querySelector('#imovie-split')?.addEventListener('click', () => {
                if (selectedClipId == null) {
                    showToast('请先选择一个片段', 'info');
                    return;
                }
                const clip = clips.find(c => c.id === selectedClipId);
                if (!clip || clip.duration < 2) {
                    showToast('片段太短，无法分割', 'info');
                    return;
                }
                const half = Math.floor(clip.duration / 2);
                const newClip = {
                    id: state.nextClipId++,
                    name: clip.name.replace(/\.mp4$/, '_b.mp4'),
                    duration: clip.duration - half,
                    color: clip.color
                };
                clip.duration = half;
                clips.splice(clips.indexOf(clip) + 1, 0, newClip);
                save();
                renderContent();
                showToast('已分割片段', 'success');
            });
            toolbar.querySelector('#imovie-share')?.addEventListener('click', () => {
                showToast('分享功能演示中', 'info');
            });
        } else {
            toolbar.innerHTML = `
                <div class="imovie-toolbar">
                    <div class="imovie-tabs">
                        <button class="imovie-tab ${state.currentTab === 'movie' ? 'active' : ''}" data-tab="movie">影片</button>
                        <button class="imovie-tab ${state.currentTab === 'trailer' ? 'active' : ''}" data-tab="trailer">预告片</button>
                        <button class="imovie-tab ${state.currentTab === 'media' ? 'active' : ''}" data-tab="media">媒体</button>
                    </div>
                    <div class="imovie-tb-spacer"></div>
                    <button class="imovie-tb-btn primary" id="imovie-new" title="创建新项目">${ICON.add}<span>创建新项目</span></button>
                </div>
            `;
            toolbar.querySelectorAll('.imovie-tab').forEach(t => {
                t.addEventListener('click', () => {
                    state.currentTab = t.dataset.tab;
                    save();
                    renderToolbar();
                });
            });
            toolbar.querySelector('#imovie-new')?.addEventListener('click', async () => {
                const name = await window.showPrompt('项目名称：', { value: '新项目' });
                if (name) {
                    const newP = {
                        id: state.nextProjectId++,
                        name,
                        duration: '0:00',
                        date: new Date().toISOString().split('T')[0],
                        clips: 0,
                        color: projectColors[(state.nextProjectId - 1) % projectColors.length]
                    };
                    projects.unshift(newP);
                    state.currentProjectId = newP.id;
                    clips = [];
                    save();
                    render();
                    showToast('已创建项目：' + name, 'success');
                }
            });
        }
    }

    function renderSidebar() {
        if (!sidebar) return;
        const proj = getCurrentProject();
        if (proj) {
            sidebar.innerHTML = `
                <div class="imovie-sidebar">
                    <div class="imovie-sidebar-section">
                        <div class="imovie-sidebar-head">
                            <span class="imovie-sidebar-title">媒体</span>
                            <span class="imovie-sidebar-count">${mediaTypes.length}</span>
                        </div>
                        <div class="imovie-media-grid">
                            ${mediaTypes.map(m => `
                                <div class="imovie-media-item" data-type="${m.id}" title="${escapeHtml(m.name)}">
                                    ${ICON[m.icon]}
                                    <span class="imovie-media-label">${escapeHtml(m.name)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="imovie-sidebar-section">
                        <div class="imovie-sidebar-head">
                            <span class="imovie-sidebar-title">转场效果</span>
                        </div>
                        <div class="imovie-transitions-grid">
                            ${transitions.map(t => `
                                <div class="imovie-transition-item" data-name="${escapeHtml(t.name)}">
                                    <span>${escapeHtml(t.name)}</span>
                                    <span class="imovie-transition-dur">${t.dur}s</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            sidebar.querySelectorAll('.imovie-media-item').forEach(item => {
                item.addEventListener('click', () => {
                    const type = item.dataset.type;
                    if (type === 'video') {
                        const color = clipColors[Math.floor(Math.random() * clipColors.length)];
                        clips.push({
                            id: state.nextClipId++,
                            name: '片段 ' + clips.length + '.mp4',
                            duration: 5 + Math.floor(Math.random() * 10),
                            color
                        });
                        save();
                        renderContent();
                        renderToolbar();
                        showToast('已添加片段', 'success');
                    } else {
                        showToast('演示应用：' + mediaTypes.find(m => m.id === type)?.name + ' 不可用', 'info');
                    }
                });
            });
            sidebar.querySelectorAll('.imovie-transition-item').forEach(item => {
                item.addEventListener('click', () => {
                    showToast('已应用转场：' + item.dataset.name, 'info');
                });
            });
        } else {
            sidebar.innerHTML = `
                <div class="imovie-sidebar">
                    <div class="imovie-sidebar-head">
                        <span class="imovie-sidebar-title">项目</span>
                        <span class="imovie-sidebar-count">${projects.length}</span>
                    </div>
                    <div class="imovie-projects-list">
                        ${projects.map(p => `
                            <div class="imovie-project-item ${state.currentProjectId === p.id ? 'active' : ''}" data-id="${p.id}">
                                ${ICON.film}
                                <div class="imovie-project-info">
                                    <div class="imovie-project-name">${escapeHtml(p.name)}</div>
                                    <div class="imovie-project-meta">${p.duration} · ${p.clips} 片段</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            sidebar.querySelectorAll('.imovie-project-item').forEach(el => {
                el.addEventListener('click', () => {
                    state.currentProjectId = parseInt(el.dataset.id, 10);
                    selectedClipId = null;
                    save();
                    render();
                });
            });
        }
    }

    function renderContent() {
        const proj = getCurrentProject();
        if (proj) {
            renderEditor(proj);
        } else {
            renderProjects();
        }
    }

    function renderProjects() {
        body.innerHTML = `
            <div class="imovie-body">
                <div class="imovie-content-scroll">
                    <h2 class="imovie-page-title">项目</h2>
                    ${projects.length === 0 ? `
                        <div class="imovie-empty">
                            <div class="imovie-empty-icon">${ICON.film}</div>
                            <div class="imovie-empty-text">还没有项目</div>
                            <div class="imovie-empty-desc">点击工具栏的「创建新项目」开始</div>
                        </div>
                    ` : `
                        <div class="imovie-projects-grid">
                            ${projects.map(p => `
                                <div class="imovie-project-card" data-id="${p.id}">
                                    <div class="imovie-project-thumb" style="background:${p.color};">
                                        ${ICON.film}
                                    </div>
                                    <div class="imovie-project-card-info">
                                        <div class="imovie-project-card-name">${escapeHtml(p.name)}</div>
                                        <div class="imovie-project-card-meta">
                                            <span>${p.duration}</span>
                                            <span>·</span>
                                            <span>${p.clips} 个片段</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
        body.querySelectorAll('.imovie-project-card').forEach(card => {
            card.addEventListener('click', () => {
                state.currentProjectId = parseInt(card.dataset.id, 10);
                selectedClipId = null;
                save();
                render();
            });
        });
    }

    function renderEditor(proj) {
        const totalDuration = getTotalDuration();
        const totalStr = fmtTime(totalDuration);

        body.innerHTML = `
            <div class="imovie-body imovie-editor-body">
                <div class="imovie-preview">
                    <div class="imovie-preview-content" id="imovie-preview">
                        ${ICON.film}
                    </div>
                    <div class="imovie-timecode" id="imovie-timecode">00:00 / ${totalStr}</div>
                </div>
                <div class="imovie-timeline-wrap">
                    <div class="imovie-timeline-toolbar">
                        <span class="imovie-timeline-label">时间线</span>
                        <span class="imovie-timeline-info">${clips.length} 个片段 · ${totalStr}</span>
                    </div>
                    <div class="imovie-timeline-scroll">
                        <div class="imovie-timeline-ruler" id="imovie-ruler"></div>
                        <div class="imovie-timeline" id="imovie-timeline">
                            <div class="imovie-playhead" id="imovie-playhead"></div>
                            ${clips.length === 0 ? `
                                <div class="imovie-timeline-empty">
                                    ${ICON.add}
                                    <span>点击侧边栏媒体添加片段</span>
                                </div>
                            ` : clips.map((c, i) => `
                                <div class="imovie-clip ${selectedClipId === c.id ? 'selected' : ''}" data-id="${c.id}" style="width:${c.duration * 12}px;background:linear-gradient(135deg,${c.color},${c.color}cc);">
                                    <span class="imovie-clip-name">${escapeHtml(c.name)}</span>
                                    <span class="imovie-clip-dur">${c.duration}s</span>
                                    <button class="imovie-clip-del" data-del="${c.id}" title="删除">${ICON.trash}</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render ruler
        const ruler = body.querySelector('#imovie-ruler');
        if (ruler) {
            const rulerWidth = Math.max(totalDuration * 12, 200);
            ruler.style.width = rulerWidth + 'px';
            const marks = Math.ceil(totalDuration / 5) + 1;
            let html = '';
            for (let i = 0; i < marks; i++) {
                html += `<div class="imovie-ruler-mark"><span>${fmtTime(i * 5)}</span></div>`;
            }
            ruler.innerHTML = html;
        }

        // Clip selection
        body.querySelectorAll('.imovie-clip').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.closest('.imovie-clip-del')) return;
                selectedClipId = parseInt(el.dataset.id, 10);
                renderContent();
            });
        });

        // Clip delete
        body.querySelectorAll('.imovie-clip-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.del, 10);
                clips = clips.filter(c => c.id !== id);
                if (selectedClipId === id) selectedClipId = null;
                save();
                renderContent();
                renderToolbar();
            });
        });

        // Timeline click to seek
        const timeline = body.querySelector('#imovie-timeline');
        if (timeline) {
            timeline.addEventListener('click', (e) => {
                if (e.target.closest('.imovie-clip') || e.target.closest('.imovie-clip-del')) return;
                const rect = timeline.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const sec = Math.floor(x / 12);
                state.playheadPos = Math.max(0, Math.min(sec, totalDuration));
                updatePlayhead();
                updateTimecode();
            });
        }

        updatePlayhead();
    }

    function updatePlayhead() {
        const playhead = body.querySelector('#imovie-playhead');
        if (playhead) {
            playhead.style.left = (state.playheadPos * 12) + 'px';
        }
    }

    function updateTimecode() {
        const timecode = body.querySelector('#imovie-timecode');
        const totalStr = fmtTime(getTotalDuration());
        if (timecode) {
            timecode.textContent = `${fmtTime(state.playheadPos)} / ${totalStr}`;
        }
    }

    function updatePreview() {
        const preview = body.querySelector('#imovie-preview');
        if (!preview || clips.length === 0) return;
        let acc = 0;
        let curIdx = 0;
        for (let i = 0; i < clips.length; i++) {
            if (acc + clips[i].duration > state.playheadPos) { curIdx = i; break; }
            acc += clips[i].duration;
        }
        const clip = clips[curIdx];
        if (clip) {
            preview.style.background = `linear-gradient(135deg, ${clip.color}, ${clip.color}aa)`;
        }
    }

    function stopPlayback() {
        if (playTimer) { clearInterval(playTimer); playTimer = null; }
        state.isPlaying = false;
    }

    function startPlayback() {
        stopPlayback();
        const total = getTotalDuration();
        if (total === 0) {
            showToast('请先添加片段', 'info');
            return;
        }
        // Reset to start if at end
        if (state.playheadPos >= total) state.playheadPos = 0;
        state.isPlaying = true;
        const step = 0.1; // 100ms steps
        playTimer = setInterval(() => {
            state.playheadPos += step;
            if (state.playheadPos >= total) {
                state.playheadPos = total;
                stopPlayback();
                renderToolbar();
            }
            updatePlayhead();
            updateTimecode();
            updatePreview();
        }, 100);
    }

    function render() {
        body.className = 'window-body app-content imovie-app';
        body.style.display = 'flex';
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    // Cleanup on window close
    if (windowId) {
        const cleanupKey = `imovie_cleanup_${windowId}`;
        if (window[cleanupKey]) window[cleanupKey]();
        window[cleanupKey] = () => {
            if (playTimer) { clearInterval(playTimer); playTimer = null; }
            state.isPlaying = false;
        };
    }

    render();
};
