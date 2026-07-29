window.renderPhotos = function(body, sidebar, toolbar, windowId) {
    let currentView = 'library';
    let selectedPhoto = null;
    let selectedIds = new Set();
    let zoomLevel = 1;

    const photos = [
        { id: 1, emoji: '🏔️', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', title: '山景', date: '2024-01-15', album: 'recents', location: '阿尔卑斯山', camera: 'Sony A7 III', size: '24.5 MP' },
        { id: 2, emoji: '🌅', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', title: '日落', date: '2024-01-14', album: 'favorites', location: '巴厘岛', camera: 'Canon R5', size: '45 MP' },
        { id: 3, emoji: '🌊', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', title: '海浪', date: '2024-01-12', album: 'recents', location: '马尔代夫', camera: 'Nikon Z9', size: '45.7 MP' },
        { id: 4, emoji: '🌸', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', title: '樱花', date: '2024-01-10', album: 'favorites', location: '京都', camera: 'Fujifilm X-T5', size: '40 MP' },
        { id: 5, emoji: '🌲', color: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', title: '森林', date: '2024-01-08', album: 'recents', location: '北海道', camera: 'Sony A1', size: '50 MP' },
        { id: 6, emoji: '🌃', color: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', title: '夜景', date: '2024-01-07', album: 'recents', location: '上海', camera: 'Sony A7R V', size: '61 MP' },
        { id: 7, emoji: '🏖️', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', title: '海滩', date: '2024-01-05', album: 'favorites', location: '普吉岛', camera: 'Canon R5', size: '45 MP' },
        { id: 8, emoji: '🍂', color: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)', title: '秋叶', date: '2024-01-03', album: 'recents', location: '北京', camera: 'Leica Q3', size: '60 MP' },
        { id: 9, emoji: '❄️', color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', title: '雪景', date: '2023-12-30', album: 'recents', location: '哈尔滨', camera: 'Nikon Z9', size: '45.7 MP' },
        { id: 10, emoji: '🌺', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', title: '花朵', date: '2023-12-28', album: 'favorites', location: '昆明', camera: 'Fujifilm X100V', size: '26 MP' },
        { id: 11, emoji: '🌙', color: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', title: '月光', date: '2023-12-25', album: 'recents', location: '丽江', camera: 'Sony A7S III', size: '12 MP' },
        { id: 12, emoji: '🌈', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)', title: '彩虹', date: '2023-12-22', album: 'recents', location: '桂林', camera: 'Canon R3', size: '24 MP' },
        { id: 13, emoji: '🏞️', color: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)', title: '山谷', date: '2023-12-20', album: 'recents', location: '九寨沟', camera: 'Nikon Z7 II', size: '45.7 MP' },
        { id: 14, emoji: '🌌', color: 'linear-gradient(135deg, #000000 0%, #130f40 100%)', title: '星空', date: '2023-12-18', album: 'favorites', location: '青海', camera: 'Sony A7S III', size: '12 MP' },
        { id: 15, emoji: '🍀', color: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)', title: '四叶草', date: '2023-12-15', album: 'recents', location: '爱尔兰', camera: 'Fujifilm X-T5', size: '40 MP' },
        { id: 16, emoji: '🎆', color: 'linear-gradient(135deg, #fc00ff 0%, #00dbde 100%)', title: '烟花', date: '2023-12-31', album: 'recents', location: '香港', camera: 'Canon R5', size: '45 MP' }
    ];

    const albums = [
        { id: 'recents', name: '最近项目', icon: 'clock', count: photos.filter(p => p.album === 'recents').length },
        { id: 'favorites', name: '个人收藏', icon: 'heart', count: photos.filter(p => p.album === 'favorites').length }
    ];

    const sfIcons = {
        library: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="2.5" width="11" height="9" rx="1.2"/><circle cx="5" cy="6" r="1"/><path d="M2 9l3-2.5L7 8l3-2.5L12 9"/></svg>',
        recents: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><circle cx="7" cy="7.5" r="5"/><path d="M7 4.5v3l2 1"/></svg>',
        favorites: '<svg viewBox="0 0 14 14" width="11" height="11" fill="#fff"><path d="M7 12l-4-3.5C1.5 6.5 2 4 4 4c1.2 0 2 .8 2.5 1.5L7 6l.5-.5C8 4.8 8.8 4 10 4c2 0 2.5 2.5 1 4.5z"/></svg>',
        albums: '<svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><rect x="1.5" y="2.5" width="4" height="4" rx="0.6"/><rect x="8.5" y="2.5" width="4" height="4" rx="0.6"/><rect x="1.5" y="8.5" width="4" height="4" rx="0.6"/><rect x="8.5" y="8.5" width="4" height="4" rx="0.6"/></svg>'
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function getFilteredPhotos() {
        if (currentView === 'favorites') return photos.filter(p => p.album === 'favorites');
        if (currentView === 'albums') return photos;
        return photos.filter(p => p.album === 'recents');
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="photos-sidebar">
                <div class="photos-sidebar-section">
                    <div class="photos-sidebar-header">照片</div>
                    <div class="finder-sidebar-item ${currentView === 'library' ? 'active' : ''}" data-view="library">
                        <div class="photos-sidebar-icon" style="background:linear-gradient(135deg,#3a82f7,#0a84ff);">${sfIcons.library}</div>
                        <span class="finder-sidebar-label">图库</span>
                    </div>
                    <div class="finder-sidebar-item ${currentView === 'recents' ? 'active' : ''}" data-view="recents">
                        <div class="photos-sidebar-icon" style="background:linear-gradient(135deg,#ff9500,#ff7800);">${sfIcons.recents}</div>
                        <span class="finder-sidebar-label">最近</span>
                        <span class="photos-sidebar-count">${photos.filter(p => p.album === 'recents').length}</span>
                    </div>
                    <div class="finder-sidebar-item ${currentView === 'favorites' ? 'active' : ''}" data-view="favorites">
                        <div class="photos-sidebar-icon" style="background:linear-gradient(135deg,#ff375f,#ff2d55);">${sfIcons.favorites}</div>
                        <span class="finder-sidebar-label">个人收藏</span>
                    </div>
                </div>
                <div class="photos-sidebar-section">
                    <div class="photos-sidebar-header">我的相簿</div>
                    <div class="finder-sidebar-item ${currentView === 'albums' ? 'active' : ''}" data-view="albums">
                        <div class="photos-sidebar-icon" style="background:linear-gradient(135deg,#8e8e93,#48484a);">${sfIcons.albums}</div>
                        <span class="finder-sidebar-label">所有照片</span>
                    </div>
                </div>
                <div class="photos-sidebar-section">
                    <div class="photos-sidebar-header">媒体类型</div>
                    <div class="finder-sidebar-item">
                        <div class="photos-sidebar-icon" style="background:linear-gradient(135deg,#34c759,#30b0c7);"><svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><path d="M7 1.5l5 9H2z"/></svg></div>
                        <span class="finder-sidebar-label">视频</span>
                    </div>
                    <div class="finder-sidebar-item">
                        <div class="photos-sidebar-icon" style="background:linear-gradient(135deg,#5ac8fa,#0a84ff);"><svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><circle cx="7" cy="7" r="5"/><circle cx="7" cy="7" r="2"/></svg></div>
                        <span class="finder-sidebar-label">Live Photo</span>
                    </div>
                    <div class="finder-sidebar-item">
                        <div class="photos-sidebar-icon" style="background:linear-gradient(135deg,#ffd60a,#ff9500);"><svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.2"><path d="M7 3l3 4H4z" fill="#fff"/></svg></div>
                        <span class="finder-sidebar-label">截屏</span>
                    </div>
                </div>
            </div>
        `;
        sidebar.querySelectorAll('[data-view]').forEach(item => {
            item.addEventListener('click', () => {
                currentView = item.dataset.view;
                selectedPhoto = null;
                selectedIds.clear();
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const hasSelection = selectedPhoto || selectedIds.size > 0;
        toolbar.innerHTML = `
            <div class="photos-toolbar">
                <button class="photos-toolbar-btn" id="photo-back-btn" title="返回" ${!selectedPhoto ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2L4 7l5 5"/></svg>
                </button>
                <button class="photos-toolbar-btn" id="photo-favorite-btn" title="加入收藏" ${!selectedPhoto ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="${selectedPhoto && photos.find(p => p.id === selectedPhoto)?.album === 'favorites' ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M7 12l-4-3.5C1.5 6.5 2 4 4 4c1.2 0 2 .8 2.5 1.5L7 6l.5-.5C8 4.8 8.8 4 10 4c2 0 2.5 2.5 1 4.5z"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="photos-toolbar-btn" id="photo-info-btn" title="信息" ${!hasSelection ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="7" cy="7" r="5.5"/><path d="M7 6.5v3M7 4.5v.5" stroke-linecap="round"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="photos-toolbar-btn" id="photo-rotate-btn" title="旋转" ${!hasSelection ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M2 7a5 5 0 0 1 5-5c2 0 3.5 1 4.5 2.5M12 4v2.5H9.5M12 7a5 5 0 0 1-5 5c-2 0-3.5-1-4.5-2.5M2 10V7.5h2.5"/></svg>
                </button>
                <button class="photos-toolbar-btn" id="photo-crop-btn" title="裁剪" ${!hasSelection ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M4 1v9h9M1 4h9v9"/></svg>
                </button>
                <button class="photos-toolbar-btn" id="photo-filter-btn" title="滤镜" ${!hasSelection ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="4.5" cy="4.5" r="3"/><circle cx="9.5" cy="9.5" r="3"/></svg>
                </button>
                <div style="flex:1;"></div>
                <button class="photos-toolbar-btn" id="photo-zoom-out" title="缩小">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 7h8"/></svg>
                </button>
                <button class="photos-toolbar-btn" id="photo-zoom-in" title="放大">
                    <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 3v8M3 7h8"/></svg>
                </button>
                <button class="photos-toolbar-btn" id="photo-grid-btn" title="网格">
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="1.5" width="4" height="4" rx="0.6"/><rect x="8.5" y="1.5" width="4" height="4" rx="0.6"/><rect x="1.5" y="8.5" width="4" height="4" rx="0.6"/><rect x="8.5" y="8.5" width="4" height="4" rx="0.6"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="photos-toolbar-btn" id="photo-share-btn" title="分享" ${!hasSelection ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M3 5L7 1l4 4M7 1v8M2 11v2h10v-2"/></svg>
                </button>
                <button class="photos-toolbar-btn" id="photo-delete-btn" title="删除" ${!hasSelection ? 'disabled' : ''}>
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h8M5.5 4V2.5h3V4M5 4l.5 8h3L9 4"/></svg>
                </button>
                <div class="toolbar-sep"></div>
                <button class="photos-toolbar-btn" title="搜索">
                    <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                </button>
            </div>
        `;
        toolbar.querySelector('#photo-back-btn')?.addEventListener('click', () => {
            selectedPhoto = null;
            render();
        });
        toolbar.querySelector('#photo-favorite-btn')?.addEventListener('click', () => {
            const photo = photos.find(p => p.id === selectedPhoto);
            if (photo) {
                photo.album = photo.album === 'favorites' ? 'recents' : 'favorites';
                render();
            }
        });
        toolbar.querySelector('#photo-info-btn')?.addEventListener('click', toggleInfoPanel);
        toolbar.querySelector('#photo-rotate-btn')?.addEventListener('click', () => showToast('已旋转 90°'));
        toolbar.querySelector('#photo-crop-btn')?.addEventListener('click', () => showToast('进入裁剪模式'));
        toolbar.querySelector('#photo-filter-btn')?.addEventListener('click', () => showToast('滤镜已应用'));
        toolbar.querySelector('#photo-zoom-out')?.addEventListener('click', () => {
            zoomLevel = Math.max(0.6, zoomLevel - 0.2);
            renderContent();
        });
        toolbar.querySelector('#photo-zoom-in')?.addEventListener('click', () => {
            zoomLevel = Math.min(2, zoomLevel + 0.2);
            renderContent();
        });
        toolbar.querySelector('#photo-share-btn')?.addEventListener('click', () => showToast('分享菜单已打开'));
        toolbar.querySelector('#photo-delete-btn')?.addEventListener('click', () => {
            if (selectedPhoto) {
                const idx = photos.findIndex(p => p.id === selectedPhoto);
                if (idx >= 0) {
                    photos.splice(idx, 1);
                    selectedPhoto = null;
                    render();
                    showToast('已删除 1 张照片');
                }
            }
        });
    }

    function toggleInfoPanel() {
        const existing = body.querySelector('.photos-info-panel');
        if (existing) {
            existing.remove();
            return;
        }
        if (!selectedPhoto) return;
        const photo = photos.find(p => p.id === selectedPhoto);
        if (!photo) return;
        const panel = document.createElement('div');
        panel.className = 'photos-info-panel';
        panel.innerHTML = `
            <div class="photos-info-header">
                <span class="photos-info-title">信息</span>
                <button class="photos-info-close">×</button>
            </div>
            <div class="photos-info-thumb" style="background:${photo.color};">
                <span style="font-size:48px;">${photo.emoji}</span>
            </div>
            <div class="photos-info-body">
                <div class="photos-info-row"><span class="photos-info-label">标题</span><span class="photos-info-value">${escapeHtml(photo.title)}</span></div>
                <div class="photos-info-row"><span class="photos-info-label">日期</span><span class="photos-info-value">${photo.date}</span></div>
                <div class="photos-info-row"><span class="photos-info-label">位置</span><span class="photos-info-value">${escapeHtml(photo.location)}</span></div>
                <div class="photos-info-row"><span class="photos-info-label">相机</span><span class="photos-info-value">${escapeHtml(photo.camera)}</span></div>
                <div class="photos-info-row"><span class="photos-info-label">分辨率</span><span class="photos-info-value">${photo.size}</span></div>
            </div>
        `;
        body.appendChild(panel);
        panel.querySelector('.photos-info-close').addEventListener('click', () => panel.remove());
    }

    function showToast(message) {
        const existing = body.querySelector('.photos-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'photos-toast';
        toast.textContent = message;
        body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 1800);
    }

    function renderContent() {
        if (selectedPhoto) {
            const photo = photos.find(p => p.id === selectedPhoto);
            if (!photo) { selectedPhoto = null; renderContent(); return; }
            body.innerHTML = `
                <div class="photos-viewer">
                    <div class="photos-viewer-image" style="background:${photo.color};">
                        <span style="font-size:${160 * zoomLevel}px;transition:font-size 0.2s ease;">${photo.emoji}</span>
                    </div>
                    <div class="photos-viewer-info">
                        <div class="photos-viewer-title">${escapeHtml(photo.title)}</div>
                        <div class="photos-viewer-meta">${photo.date} · ${escapeHtml(photo.location)}</div>
                        <div class="photos-viewer-controls">
                            <button class="photos-nav-btn" id="viewer-prev" title="上一张">
                                <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2L4 7l5 5"/></svg>
                            </button>
                            <span class="photos-viewer-counter">${photos.findIndex(p => p.id === selectedPhoto) + 1} / ${photos.length}</span>
                            <button class="photos-nav-btn" id="viewer-next" title="下一张">
                                <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2l5 5-5 5"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            body.querySelector('#viewer-prev')?.addEventListener('click', () => {
                const idx = photos.findIndex(p => p.id === selectedPhoto);
                selectedPhoto = photos[(idx - 1 + photos.length) % photos.length].id;
                renderContent();
                renderToolbar();
            });
            body.querySelector('#viewer-next')?.addEventListener('click', () => {
                const idx = photos.findIndex(p => p.id === selectedPhoto);
                selectedPhoto = photos[(idx + 1) % photos.length].id;
                renderContent();
                renderToolbar();
            });
            return;
        }

        const list = getFilteredPhotos();
        const viewTitle = { library: '图库', recents: '最近项目', favorites: '个人收藏', albums: '所有照片' }[currentView] || '照片';
        const thumbSize = Math.round(150 * zoomLevel);
        body.innerHTML = `
            <div class="photos-content">
                <div class="photos-grid" style="grid-template-columns:repeat(auto-fill, minmax(${thumbSize}px, 1fr));">
                    ${list.map(photo => `
                        <div class="photo-item ${selectedIds.has(photo.id) ? 'selected' : ''}" data-id="${photo.id}">
                            <div class="photo-item-inner" style="background:${photo.color};">
                                <span style="font-size:${48 * zoomLevel}px;">${photo.emoji}</span>
                            </div>
                            ${photo.album === 'favorites' ? '<div class="photo-favorite-badge"><svg viewBox="0 0 14 14" width="9" height="9" fill="#fff"><path d="M7 12l-4-3.5C1.5 6.5 2 4 4 4c1.2 0 2 .8 2.5 1.5L7 6l.5-.5C8 4.8 8.8 4 10 4c2 0 2.5 2.5 1 4.5z"/></svg></div>' : ''}
                            ${selectedIds.has(photo.id) ? '<div class="photo-check"><svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M3 7l3 3 5-5"/></svg></div>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        body.querySelectorAll('.photo-item').forEach(item => {
            item.addEventListener('click', e => {
                if (e.metaKey || e.ctrlKey) {
                    const id = parseInt(item.dataset.id);
                    if (selectedIds.has(id)) selectedIds.delete(id);
                    else selectedIds.add(id);
                    renderContent();
                    renderToolbar();
                } else {
                    selectedPhoto = parseInt(item.dataset.id);
                    zoomLevel = 1;
                    render();
                }
            });
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    render();
};
