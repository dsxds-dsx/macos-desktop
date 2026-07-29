window.renderMaps = function(body, sidebar, toolbar, windowId) {
    body.style.padding = '0';
    body.style.overflow = 'hidden';

    // ============ State ============
    let currentLayer = 'standard';
    let markers = [];
    let routeLine = null;
    let routeCoords = [];
    let userMarker = null;
    let selectedPlace = null;
    let searchTimeout = null;
    let located = false;
    let watchId = null;
    let navMode = false;
    let navActive = false;
    let currentBearing = 0;
    let deviceHeading = null;
    let lastPositions = [];
    let lastPosTime = 0;
    let routeDist = 0;
    let routeDur = 0;
    let routeStartBearing = 0;
    let currentSpeed = 0;
    let navFollowTimer = null;
    let userWgs84Lat = null;
    let userWgs84Lng = null;
    let activeSidebarSection = 'favorites';
    let activeCategoryFilter = null;
    let favorites = JSON.parse(localStorage.getItem('macos_maps_favorites') || '[]');
    let recents = JSON.parse(localStorage.getItem('macos_maps_recents') || '[]');

    // ============ Place Categories (macOS-style) ============
    const categories = [
        { id: 'food', name: '餐厅', emoji: '🍽️', color: '#ff9500', osm: 'amenity=restaurant' },
        { id: 'cafe', name: '咖啡馆', emoji: '☕', color: '#a2845e', osm: 'amenity=cafe' },
        { id: 'hotel', name: '酒店', emoji: '🏨', color: '#5856d6', osm: 'tourism=hotel' },
        { id: 'gas', name: '加油站', emoji: '⛽', color: '#ff3b30', osm: 'amenity=fuel' },
        { id: 'parking', name: '停车场', emoji: '🅿️', color: '#34c759', osm: 'amenity=parking' },
        { id: 'hospital', name: '医院', emoji: '🏥', color: '#ff2d55', osm: 'amenity=hospital' },
        { id: 'bank', name: '银行', emoji: '🏦', color: '#007aff', osm: 'amenity=bank' },
        { id: 'shop', name: '商场', emoji: '🛍️', color: '#af52de', osm: 'shop=mall' },
        { id: 'attraction', name: '景点', emoji: '📍', color: '#ff6482', osm: 'tourism=attraction' }
    ];

    // ============ Default favorite places ============
    const defaultFavorites = [
        { id: 'fav-home', name: '家', address: '北京市朝阳区', lat: 39.9242, lng: 116.4474, category: 'home', emoji: '🏠', addedAt: Date.now() - 86400000 * 30 },
        { id: 'fav-work', name: '公司', address: '北京市海淀区中关村', lat: 39.9842, lng: 116.3074, category: 'work', emoji: '💼', addedAt: Date.now() - 86400000 * 20 },
        { id: 'fav-school', name: '清华大学', address: '北京市海淀区清华园1号', lat: 40.0084, lng: 116.3224, category: 'school', emoji: '🎓', addedAt: Date.now() - 86400000 * 10 }
    ];
    if (favorites.length === 0) {
        favorites = defaultFavorites;
        saveFavorites();
    }

    function saveFavorites() {
        localStorage.setItem('macos_maps_favorites', JSON.stringify(favorites));
    }
    function saveRecents() {
        localStorage.setItem('macos_maps_recents', JSON.stringify(recents.slice(0, 10)));
    }
    function addRecent(place) {
        const exists = recents.findIndex(r => r.name === place.name);
        if (exists >= 0) recents.splice(exists, 1);
        recents.unshift({
            name: place.name,
            address: place.address,
            lat: place.lat,
            lng: place.lng,
            ts: Date.now()
        });
        recents = recents.slice(0, 10);
        saveRecents();
    }

    // ============ Build main UI structure ============
    body.innerHTML = `
        <div class="maps-app" id="maps-app-${windowId}">
            <div class="maps-map-wrapper" id="maps-wrapper-${windowId}">
                <div class="maps-map" id="maps-map-${windowId}"></div>
                <div class="maps-search-bar" id="maps-search-bar-${windowId}">
                    <div class="maps-search-input-wrap">
                        <svg viewBox="0 0 24 24" width="16" height="16" style="opacity:0.5;flex-shrink:0"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/></svg>
                        <input type="text" class="maps-search-input" id="maps-search-${windowId}" placeholder="搜索地点或地址">
                        <button class="maps-locate-btn" id="maps-locate-${windowId}" title="我的位置">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                        </button>
                    </div>
                    <div class="maps-search-results" id="maps-results-${windowId}"></div>
                </div>
                <div class="maps-directions-panel" id="maps-directions-${windowId}" style="display:none;"></div>
                <div class="maps-zoom-controls" id="maps-zoom-controls-${windowId}">
                    <button class="maps-zoom-btn" id="maps-zoom-in-${windowId}" title="放大">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
                    </button>
                    <div class="maps-zoom-divider"></div>
                    <button class="maps-zoom-btn" id="maps-zoom-out-${windowId}" title="缩小">
                        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 13H5v-2h14v2z" fill="currentColor"/></svg>
                    </button>
                </div>
                <div class="maps-map-tools" id="maps-map-tools-${windowId}">
                    <button class="maps-tool-btn" id="maps-3d-btn-${windowId}" title="3D 视图">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 8l9 5 9-5"/></svg>
                    </button>
                    <button class="maps-tool-btn" id="maps-compass-btn-${windowId}" title="正北朝上">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polygon points="12,5 9,12 12,11 15,12" fill="currentColor"/><polygon points="12,19 9,12 12,13 15,12" fill="none"/></svg>
                    </button>
                </div>
                <div class="maps-scale-indicator" id="maps-scale-${windowId}">
                    <div class="maps-scale-bar" id="maps-scale-bar-${windowId}"></div>
                    <span class="maps-scale-text" id="maps-scale-text-${windowId}">500 m</span>
                </div>
                <div class="maps-place-card" id="maps-place-card-${windowId}" style="display:none;">
                    <div class="maps-place-header">
                        <div class="maps-place-icon" id="maps-place-icon-${windowId}">📍</div>
                        <div class="maps-place-header-info">
                            <div class="maps-place-name" id="maps-place-name-${windowId}"></div>
                            <div class="maps-place-category" id="maps-place-category-${windowId}"></div>
                        </div>
                        <button class="maps-place-close" id="maps-place-close-${windowId}" title="关闭">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="maps-place-address" id="maps-place-address-${windowId}"></div>
                    <div class="maps-place-meta" id="maps-place-meta-${windowId}"></div>
                    <div class="maps-place-actions">
                        <button class="maps-place-action" id="maps-action-route-${windowId}">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>
                            <span>路线</span>
                        </button>
                        <button class="maps-place-action" id="maps-action-call-${windowId}">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            <span>电话</span>
                        </button>
                        <button class="maps-place-action" id="maps-action-share-${windowId}">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
                            <span>分享</span>
                        </button>
                        <button class="maps-place-action" id="maps-action-fav-${windowId}">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
                            <span id="maps-fav-text-${windowId}">收藏</span>
                        </button>
                    </div>
                </div>
                <div class="maps-nav-overlay" id="maps-nav-overlay-${windowId}" style="display:none;">
                    <div class="maps-nav-top">
                        <div class="maps-nav-direction" id="maps-nav-direction">
                            <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4v36M12 16l12-12 12 12"/></svg>
                        </div>
                        <div class="maps-nav-info">
                            <div class="maps-nav-distance" id="maps-nav-distance">-- 米</div>
                            <div class="maps-nav-instruction" id="maps-nav-instruction">沿当前道路行驶</div>
                        </div>
                        <button class="maps-nav-exit" id="maps-nav-exit-${windowId}">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="maps-nav-bottom">
                        <div class="maps-nav-speed">
                            <span class="maps-nav-speed-val" id="maps-nav-speed">0</span>
                            <span class="maps-nav-speed-unit">km/h</span>
                        </div>
                        <div class="maps-nav-summary">
                            <div class="maps-nav-total-dist" id="maps-nav-total-dist">-- km</div>
                            <div class="maps-nav-eta" id="maps-nav-eta">-- 分钟</div>
                        </div>
                        <div style="min-width:100px;"></div>
                    </div>
                </div>
                <div class="maps-compass" id="maps-compass-${windowId}" title="正北朝上" style="display:none;">
                    <svg viewBox="0 0 40 40" width="36" height="36">
                        <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                        <polygon points="20,6 16,20 24,20" fill="#ff3b30"/>
                        <polygon points="20,34 16,20 24,20" fill="#8e8e93"/>
                        <text x="20" y="14" text-anchor="middle" font-size="7" font-weight="bold" fill="#fff" font-family="-apple-system">N</text>
                    </svg>
                </div>
            </div>
        </div>
    `;

    if (toolbar) {
        toolbar.innerHTML = `
            <div class="maps-toolbar">
                <div class="maps-toolbar-segment">
                    <button class="maps-toolbar-btn active" data-mode="standard" title="标准地图">标准</button>
                    <button class="maps-toolbar-btn" data-mode="hybrid" title="混合地图">混合</button>
                    <button class="maps-toolbar-btn" data-mode="satellite" title="卫星地图">卫星</button>
                </div>
                <div class="maps-toolbar-divider"></div>
                <button class="maps-toolbar-btn maps-toolbar-icon-btn" id="maps-tb-locate-${windowId}" title="定位">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>
                </button>
                <div style="flex:1"></div>
                <button class="maps-toolbar-btn maps-toolbar-icon-btn" id="maps-tb-share-${windowId}" title="分享位置">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                </button>
            </div>
        `;
    }

    // ============ Render Sidebar (macOS style) ============
    function renderSidebar() {
        if (!sidebar) return;
        const today = new Date();
        const recentList = recents.map((r, i) => {
            const ago = timeAgo(r.ts);
            return `
                <div class="maps-sidebar-item" data-action="recent" data-idx="${i}">
                    <div class="maps-sidebar-icon" style="background:linear-gradient(135deg,#8e8e93,#48484a);">🕒</div>
                    <div class="maps-sidebar-text">
                        <div class="maps-sidebar-name">${escapeHtml(r.name)}</div>
                        <div class="maps-sidebar-sub">${escapeHtml(r.address || '')} · ${ago}</div>
                    </div>
                </div>
            `;
        }).join('');

        const favList = favorites.map((f, i) => {
            const emoji = f.emoji || '⭐';
            const colors = {
                home: 'linear-gradient(135deg,#34c759,#30d158)',
                work: 'linear-gradient(135deg,#007aff,#0a84ff)',
                school: 'linear-gradient(135deg,#ff9500,#ff5e3a)',
                star: 'linear-gradient(135deg,#ffcc00,#ff9500)'
            };
            const bg = colors[f.category] || 'linear-gradient(135deg,#8e8e93,#48484a)';
            return `
                <div class="maps-sidebar-item" data-action="favorite" data-idx="${i}">
                    <div class="maps-sidebar-icon" style="background:${bg};">${emoji}</div>
                    <div class="maps-sidebar-text">
                        <div class="maps-sidebar-name">${escapeHtml(f.name)}</div>
                        <div class="maps-sidebar-sub">${escapeHtml(f.address || '')}</div>
                    </div>
                </div>
            `;
        }).join('');

        sidebar.innerHTML = `
            <div class="maps-sidebar">
                <div class="maps-sidebar-top">
                    <button class="maps-sidebar-newroute" id="maps-sidebar-route-${windowId}">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>
                        <span>规划路线</span>
                    </button>
                </div>
                <div class="maps-sidebar-sections">
                    <div class="maps-sidebar-section-btn ${activeSidebarSection === 'favorites' ? 'active' : ''}" data-section="favorites">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
                        <span>收藏地点</span>
                    </div>
                    <div class="maps-sidebar-section-btn ${activeSidebarSection === 'recents' ? 'active' : ''}" data-section="recents">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                        <span>最近搜索</span>
                    </div>
                    <div class="maps-sidebar-section-btn ${activeSidebarSection === 'nearby' ? 'active' : ''}" data-section="nearby">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>附近</span>
                    </div>
                </div>
                <div class="maps-sidebar-content">
                    ${activeSidebarSection === 'favorites' ? `
                        <div class="maps-sidebar-group-title">我的收藏</div>
                        <div class="maps-sidebar-list">
                            ${favList || '<div class="maps-sidebar-empty">暂无收藏地点</div>'}
                        </div>
                    ` : ''}
                    ${activeSidebarSection === 'recents' ? `
                        <div class="maps-sidebar-group-title">最近搜索</div>
                        <div class="maps-sidebar-list">
                            ${recentList || '<div class="maps-sidebar-empty">暂无最近搜索</div>'}
                        </div>
                    ` : ''}
                    ${activeSidebarSection === 'nearby' ? `
                        <div class="maps-sidebar-group-title">附近地点</div>
                        <div class="maps-sidebar-categories">
                            ${categories.map(c => `
                                <div class="maps-category-item ${activeCategoryFilter === c.id ? 'active' : ''}" data-category="${c.id}">
                                    <div class="maps-category-icon" style="background:${c.color};">${c.emoji}</div>
                                    <span>${c.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('.maps-sidebar-section-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activeSidebarSection = btn.dataset.section;
                renderSidebar();
            });
        });
        sidebar.querySelectorAll('[data-action="favorite"]').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.idx);
                const fav = favorites[idx];
                if (fav) {
                    showPlaceFromData({
                        name: fav.name,
                        display_name: fav.address,
                        lat: fav.lat,
                        lon: fav.lng,
                        category: fav.category
                    });
                }
            });
        });
        sidebar.querySelectorAll('[data-action="recent"]').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.idx);
                const r = recents[idx];
                if (r) {
                    showPlaceFromData({
                        name: r.name,
                        display_name: r.address,
                        lat: r.lat,
                        lon: r.lng
                    });
                }
            });
        });
        sidebar.querySelectorAll('.maps-category-item').forEach(el => {
            el.addEventListener('click', () => {
                const catId = el.dataset.category;
                activeCategoryFilter = activeCategoryFilter === catId ? null : catId;
                renderSidebar();
                if (activeCategoryFilter) {
                    searchNearbyByCategory(activeCategoryFilter);
                }
            });
        });
        const routeBtn = sidebar.querySelector(`#maps-sidebar-route-${windowId}`);
        if (routeBtn) {
            routeBtn.addEventListener('click', () => {
                if (window.toast) window.toast('请先选择目的地，然后点击"路线"', 'info');
            });
        }
    }

    function timeAgo(ts) {
        const diff = (Date.now() - ts) / 1000;
        if (diff < 60) return '刚刚';
        if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
        if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
        return Math.floor(diff / 86400) + ' 天前';
    }

    function escapeHtml(text) {
        if (text == null) return '';
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    // ============ Map setup ============
    const mapEl = body.querySelector(`#maps-map-${windowId}`);
    const wrapperEl = body.querySelector(`#maps-wrapper-${windowId}`);
    const containerEl = body.querySelector(`#maps-app-${windowId}`);
    const searchInput = body.querySelector(`#maps-search-${windowId}`);
    const resultsEl = body.querySelector(`#maps-results-${windowId}`);
    const locateBtn = body.querySelector(`#maps-locate-${windowId}`);
    const placeCard = body.querySelector(`#maps-place-card-${windowId}`);
    const directionsPanel = body.querySelector(`#maps-directions-${windowId}`);
    const navOverlay = body.querySelector(`#maps-nav-overlay-${windowId}`);
    const compassEl = body.querySelector(`#maps-compass-${windowId}`);

    function sizeMapEl() {
        const rect = body.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            containerEl.style.width = rect.width + 'px';
            containerEl.style.height = rect.height + 'px';
        }
    }
    sizeMapEl();

    const standardLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        subdomains: ['1', '2', '3', '4'],
        attribution: '',
        maxZoom: 18
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        maxZoom: 19
    });

    const hybridOverlayLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        subdomains: ['1', '2', '3', '4'],
        attribution: '',
        maxZoom: 18,
        opacity: 0.5
    });

    const map = L.map(mapEl, {
        center: [39.9042, 116.4074],
        zoom: 12,
        zoomControl: false,
        layers: [standardLayer],
        fadeAnimation: false,
        trackResize: true
    });

    requestAnimationFrame(() => { sizeMapEl(); map.invalidateSize(); });
    setTimeout(() => { sizeMapEl(); map.invalidateSize(); }, 300);
    setTimeout(() => { sizeMapEl(); map.invalidateSize(); }, 800);

    // Update scale indicator on zoom/move
    function updateScale() {
        const zoom = map.getZoom();
        // Rough conversion: at zoom z, meters per pixel ≈ 156543.03392 * cos(lat) / 2^z
        const centerLat = map.getCenter().lat;
        const mpp = 156543.03392 * Math.cos(centerLat * Math.PI / 180) / Math.pow(2, zoom);
        const scaleBar = body.querySelector(`#maps-scale-bar-${windowId}`);
        const scaleText = body.querySelector(`#maps-scale-text-${windowId}`);
        if (!scaleBar || !scaleText) return;
        // Pick a nice round number that fits ~80px
        const targetPx = 80;
        const targetMeters = targetPx * mpp;
        const niceValues = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];
        let chosen = niceValues[0];
        for (const v of niceValues) {
            if (v <= targetMeters) chosen = v;
        }
        const actualPx = chosen / mpp;
        scaleBar.style.width = Math.min(actualPx, 120) + 'px';
        scaleText.textContent = chosen >= 1000 ? (chosen / 1000).toFixed(chosen % 1000 === 0 ? 0 : 1) + ' km' : chosen + ' m';
    }
    map.on('zoom move', updateScale);
    setTimeout(updateScale, 500);

    // ============ Coordinate conversion ============
    function wgs84ToGcj02(lng, lat) {
        const a = 6378245.0;
        const ee = 0.00669342162296594323;
        function transformLat(x, y) {
            let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
            return ret;
        }
        function transformLng(x, y) {
            let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
            return ret;
        }
        let dLat = transformLat(lng - 105.0, lat - 35.0);
        let dLng = transformLng(lng - 105.0, lat - 35.0);
        const radLat = lat / 180.0 * Math.PI;
        let magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
        dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
        return [lng + dLng, lat + dLat];
    }

    function calculateBearing(lat1, lng1, lat2, lng2) {
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const la1 = lat1 * Math.PI / 180;
        const la2 = lat2 * Math.PI / 180;
        const y = Math.sin(dLng) * Math.cos(la2);
        const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLng);
        let brng = Math.atan2(y, x) * 180 / Math.PI;
        return (brng + 360) % 360;
    }

    function haversineDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function findClosestPointOnRoute(lat, lng, coords) {
        let minDist = Infinity;
        let minIdx = 0;
        for (let i = 0; i < coords.length; i++) {
            const d = haversineDistance(lat, lng, coords[i][0], coords[i][1]);
            if (d < minDist) {
                minDist = d;
                minIdx = i;
            }
        }
        return { index: minIdx, dist: minDist };
    }

    // ============ Markers ============
    function clearMarkers() {
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        if (routeLine) {
            map.removeLayer(routeLine);
            routeLine = null;
            routeCoords = [];
        }
    }

    function createTriangleIcon(bearing) {
        return L.divIcon({
            className: 'maps-triangle-marker',
            html: `<div class="maps-triangle-wrap" style="transform: rotate(${bearing}deg);">
                <div class="maps-triangle-shape">
                    <svg viewBox="0 0 48 64" width="48" height="64">
                        <defs>
                            <linearGradient id="triGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#4da3ff"/>
                                <stop offset="100%" stop-color="#0066ff"/>
                            </linearGradient>
                        </defs>
                        <path d="M24 0 L40 52 L24 44 L8 52 Z" fill="url(#triGrad)" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="maps-triangle-halo"></div>
            </div>`,
            iconSize: [48, 64],
            iconAnchor: [24, 44]
        });
    }

    function createWaterDropIcon() {
        return L.divIcon({
            className: 'maps-waterdrop-marker',
            html: `<div class="maps-waterdrop-shape">
                <svg viewBox="0 0 36 52" width="36" height="52">
                    <defs>
                        <radialGradient id="dropGrad" cx="40%" cy="35%" r="60%">
                            <stop offset="0%" stop-color="#5cb3ff"/>
                            <stop offset="100%" stop-color="#007aff"/>
                        </radialGradient>
                    </defs>
                    <path d="M18 0 C18 0, 0 22, 0 34 C0 44, 8 52, 18 52 C28 52, 36 44, 36 34 C36 22, 18 0, 18 0Z" fill="url(#dropGrad)" stroke="#fff" stroke-width="2"/>
                    <circle cx="14" cy="30" r="4" fill="rgba(255,255,255,0.5)"/>
                </svg>
            </div>`,
            iconSize: [36, 52],
            iconAnchor: [18, 44]
        });
    }

    function createPinIcon(color, emoji) {
        const inner = emoji ? `<span style="font-size:14px;position:absolute;top:8px;left:0;right:0;text-align:center;">${emoji}</span>` : '';
        return L.divIcon({
            className: 'maps-pin-marker',
            html: `<div style="position:relative;width:32px;height:42px;">
                <svg viewBox="0 0 32 42" width="32" height="42" style="filter:drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
                    <path d="M16 0 C7.2 0 0 7.2 0 16 C0 28 16 42 16 42 C16 42 32 28 32 16 C32 7.2 24.8 0 16 0Z" fill="${color || '#ff3b30'}" stroke="#fff" stroke-width="2"/>
                </svg>
                ${inner}
            </div>`,
            iconSize: [32, 42],
            iconAnchor: [16, 42]
        });
    }

    function addUserMarker(lat, lng, bearing) {
        const icon = (navActive || navMode) ? createTriangleIcon(bearing) : createWaterDropIcon();
        if (userMarker) {
            userMarker.setLatLng([lat, lng]);
            userMarker.setIcon(icon);
        } else {
            userMarker = L.marker([lat, lng], { icon: icon, interactive: false, zIndexOffset: 1000 });
            userMarker.addTo(map);
        }
    }

    function updateUserLocation(lat, lng, accuracy, heading, speed) {
        let bearing = heading;
        if (heading == null || isNaN(heading)) {
            const now = Date.now();
            lastPositions.push({ lat, lng, time: now });
            if (lastPositions.length > 5) lastPositions.shift();
            if (lastPositions.length >= 2) {
                const old = lastPositions[0];
                const newP = lastPositions[lastPositions.length - 1];
                const timeDiff = (newP.time - old.time) / 1000;
                const dist = haversineDistance(old.lat, old.lng, newP.lat, newP.lng);
                if (dist > 2 && timeDiff > 0.5) {
                    bearing = calculateBearing(old.lat, old.lng, newP.lat, newP.lng);
                    currentSpeed = (dist / timeDiff) * 3.6;
                }
            }
        } else {
            bearing = heading;
            if (speed != null) currentSpeed = speed * 3.6;
        }
        if (bearing == null || isNaN(bearing)) bearing = currentBearing;
        currentBearing = bearing;

        addUserMarker(lat, lng, bearing);

        if (navActive) {
            updateNavigationView(lat, lng, bearing, accuracy);
        } else if (navMode) {
            updateNavigationView(lat, lng, bearing, accuracy);
        }
    }

    function updateNavigationView(lat, lng, bearing, accuracy) {
        const navZoom = 17;
        if (map.getZoom() < navZoom - 1) {
            map.setZoom(navZoom, { animate: true });
        }
        const lookAheadMeters = 80;
        const bearingRad = bearing * Math.PI / 180;
        const lookLat = lat + (lookAheadMeters / 111000) * Math.cos(bearingRad);
        const lookLng = lng + (lookAheadMeters / (111000 * Math.cos(lat * Math.PI / 180))) * Math.sin(bearingRad);
        map.panTo([lookLat, lookLng], { animate: true, duration: 0.5 });
        const rotateAngle = -bearing;
        wrapperEl.style.transform = `rotate(${rotateAngle}deg)`;
        compassEl.style.transform = `rotate(${-rotateAngle}deg)`;
        compassEl.style.display = 'flex';
        if (routeCoords.length > 0) {
            updateRouteProgress(lat, lng);
        }
        const spdEl = body.querySelector('#maps-nav-speed');
        if (spdEl) spdEl.textContent = Math.round(currentSpeed);
    }

    function updateRouteProgress(lat, lng) {
        const closest = findClosestPointOnRoute(lat, lng, routeCoords);
        const remaining = routeCoords.slice(closest.index);

        if (remaining.length < 2) {
            body.querySelector('#maps-nav-instruction').textContent = '已到达目的地';
            body.querySelector('#maps-nav-distance').textContent = '0 米';
            return;
        }

        let remainingDist = 0;
        for (let i = closest.index; i < routeCoords.length - 1; i++) {
            remainingDist += haversineDistance(routeCoords[i][0], routeCoords[i][1], routeCoords[i+1][0], routeCoords[i+1][1]);
        }

        const lookAheadIdx = Math.min(closest.index + 8, routeCoords.length - 1);
        if (lookAheadIdx > closest.index) {
            const nearBearing = calculateBearing(routeCoords[closest.index][0], routeCoords[closest.index][1],
                routeCoords[Math.min(closest.index + 3, routeCoords.length - 1)][0], routeCoords[Math.min(closest.index + 3, routeCoords.length - 1)][1]);
            const farBearing = calculateBearing(routeCoords[Math.min(closest.index + 3, routeCoords.length - 1)][0], routeCoords[Math.min(closest.index + 3, routeCoords.length - 1)][1],
                routeCoords[lookAheadIdx][0], routeCoords[lookAheadIdx][1]);
            const turnAngle = ((farBearing - nearBearing + 540) % 360) - 180;

            let instruction = '沿当前道路行驶';
            let directionIcon = 'straight';
            if (Math.abs(turnAngle) > 25) {
                if (turnAngle > 0) {
                    instruction = '前方右转';
                    directionIcon = 'right';
                } else {
                    instruction = '前方左转';
                    directionIcon = 'left';
                }
            }

            const turnDist = haversineDistance(routeCoords[closest.index][0], routeCoords[closest.index][1],
                routeCoords[Math.min(closest.index + 3, routeCoords.length - 1)][0], routeCoords[Math.min(closest.index + 3, routeCoords.length - 1)][1]);

            const dirIcon = body.querySelector('#maps-nav-direction svg');
            if (dirIcon) {
                if (directionIcon === 'right') {
                    dirIcon.innerHTML = '<path d="M8 20V4h12v4H12v12h-4z" fill="#fff"/><path d="M16 10l8 8-8 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
                } else if (directionIcon === 'left') {
                    dirIcon.innerHTML = '<path d="M40 20V4H28v4h8v12h4z" fill="#fff"/><path d="M32 10l-8 8 8 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
                } else {
                    dirIcon.innerHTML = '<path d="M24 4v36M12 16l12-12 12 12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
                }
            }

            body.querySelector('#maps-nav-instruction').textContent = instruction;
            const distText = turnDist > 1000 ? (turnDist / 1000).toFixed(1) + ' 公里' : Math.round(turnDist) + ' 米';
            body.querySelector('#maps-nav-distance').textContent = distText;
        }

        const totalDistText = remainingDist > 1000 ? (remainingDist / 1000).toFixed(1) + ' km' : Math.round(remainingDist) + ' m';
        body.querySelector('#maps-nav-total-dist').textContent = totalDistText;
        const etaMin = Math.round(remainingDist / Math.max(currentSpeed * 1000 / 60, 200));
        body.querySelector('#maps-nav-eta').textContent = etaMin + ' 分钟';
    }

    function startNavigation() {
        navActive = true;
        navMode = true;
        navOverlay.style.display = 'block';
        placeCard.style.display = 'none';
        directionsPanel.style.display = 'none';

        body.querySelector('.maps-search-bar').style.opacity = '0';
        body.querySelector('.maps-search-bar').style.pointerEvents = 'none';

        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();

        const dist = (routeDist / 1000).toFixed(1);
        const dur = Math.round(routeDur / 60);
        body.querySelector('#maps-nav-total-dist').textContent = dist + ' km';
        body.querySelector('#maps-nav-eta').textContent = dur + ' 分钟';
        body.querySelector('#maps-nav-distance').textContent = '-- 米';
        body.querySelector('#maps-nav-instruction').textContent = '准备出发';

        if (routeCoords.length >= 2) {
            routeStartBearing = calculateBearing(routeCoords[0][0], routeCoords[0][1], routeCoords[Math.min(5, routeCoords.length-1)][0], routeCoords[Math.min(5, routeCoords.length-1)][1]);
            if (userMarker) {
                const uc = userMarker.getLatLng();
                updateNavigationView(uc.lat, uc.lng, routeStartBearing, 0);
            }
        }

        startWatchPosition();
        compassEl.style.display = 'flex';
    }

    function exitNavigation() {
        navActive = false;
        navMode = false;
        navOverlay.style.display = 'none';
        placeCard.style.display = 'none';
        body.querySelector('.maps-search-bar').style.opacity = '1';
        body.querySelector('.maps-search-bar').style.pointerEvents = '';

        wrapperEl.style.transform = 'rotate(0deg)';
        compassEl.style.display = 'none';
        compassEl.style.transform = '';

        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();

        map.setZoom(14, { animate: true });
        if (routeLine) {
            map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });
        }
    }

    // ============ Place card display ============
    function showPlace(place) {
        selectedPlace = place;
        clearMarkers();
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        const [gLng, gLat] = wgs84ToGcj02(lng, lat);

        // Determine category from OSM place data
        const cat = detectCategory(place);
        const categoryObj = categories.find(c => c.id === cat) || { emoji: '📍', color: '#ff3b30', name: '地点' };

        const marker = L.marker([gLat, gLng], { icon: createPinIcon(categoryObj.color, categoryObj.emoji) });
        if (place.display_name) marker.bindPopup(place.display_name);
        marker.addTo(map);
        markers.push(marker);

        map.setView([gLat, gLng], 15);

        placeCard.style.display = 'block';
        const name = (place.namedetails && place.namedetails.name) || (place.display_name ? place.display_name.split(',')[0] : (place.name || '未知地点'));
        body.querySelector(`#maps-place-name-${windowId}`).textContent = name;
        body.querySelector(`#maps-place-category-${windowId}`).textContent = categoryObj.name;
        body.querySelector(`#maps-place-icon-${windowId}`).textContent = categoryObj.emoji;
        body.querySelector(`#maps-place-icon-${windowId}`).style.background = categoryObj.color;
        body.querySelector(`#maps-place-address-${windowId}`).textContent = place.display_name || place.address || '';

        // Place meta: rating, distance, hours
        const meta = body.querySelector(`#maps-place-meta-${windowId}`);
        const distance = userWgs84Lat != null ? haversineDistance(userWgs84Lat, userWgs84Lng, lat, lng) : null;
        const rating = (place.extratags && place.extratags.rating) || (Math.random() * 1.5 + 3.5).toFixed(1);
        const metaParts = [];
        metaParts.push(`<span class="maps-meta-rating">★ ${rating}</span>`);
        if (distance != null) {
            const distText = distance > 1000 ? (distance / 1000).toFixed(1) + ' km' : Math.round(distance) + ' m';
            metaParts.push(`<span class="maps-meta-dot">·</span><span>${distText}</span>`);
        }
        // Fake hours
        const hours = place.extratags && (place.extratags.opening_hours || place.extratags['opening_hours']);
        if (hours) {
            metaParts.push(`<span class="maps-meta-dot">·</span><span class="maps-meta-open">${hours}</span>`);
        } else {
            metaParts.push(`<span class="maps-meta-dot">·</span><span class="maps-meta-open">营业中</span>`);
        }
        meta.innerHTML = metaParts.join('');

        // Update favorite button text
        const favText = body.querySelector(`#maps-fav-text-${windowId}`);
        const isFav = favorites.some(f => Math.abs(f.lat - lat) < 0.001 && Math.abs(f.lng - lng) < 0.001);
        if (favText) favText.textContent = isFav ? '已收藏' : '收藏';

        resultsEl.style.display = 'none';

        addRecent({
            name: name,
            address: place.display_name || '',
            lat: lat,
            lng: lng
        });
        if (activeSidebarSection === 'recents') renderSidebar();
    }

    function showPlaceFromData(data) {
        selectedPlace = data;
        clearMarkers();
        const lat = parseFloat(data.lat);
        const lng = parseFloat(data.lon || data.lng);
        const [gLng, gLat] = wgs84ToGcj02(lng, lat);

        const cat = data.category || detectCategory(data);
        const categoryObj = categories.find(c => c.id === cat) || { emoji: '📍', color: '#ff3b30', name: '地点' };
        const emoji = data.emoji || categoryObj.emoji;

        const marker = L.marker([gLat, gLng], { icon: createPinIcon(categoryObj.color, emoji) });
        marker.addTo(map);
        markers.push(marker);
        map.setView([gLat, gLng], 15);

        placeCard.style.display = 'block';
        body.querySelector(`#maps-place-name-${windowId}`).textContent = data.name;
        body.querySelector(`#maps-place-category-${windowId}`).textContent = categoryObj.name;
        body.querySelector(`#maps-place-icon-${windowId}`).textContent = emoji;
        body.querySelector(`#maps-place-icon-${windowId}`).style.background = categoryObj.color;
        body.querySelector(`#maps-place-address-${windowId}`).textContent = data.display_name || data.address || '';

        const meta = body.querySelector(`#maps-place-meta-${windowId}`);
        const distance = userWgs84Lat != null ? haversineDistance(userWgs84Lat, userWgs84Lng, lat, lng) : null;
        const metaParts = [];
        if (distance != null) {
            const distText = distance > 1000 ? (distance / 1000).toFixed(1) + ' km' : Math.round(distance) + ' m';
            metaParts.push(`<span>${distText}</span>`);
        }
        metaParts.push(`<span class="maps-meta-dot">·</span><span class="maps-meta-open">营业中</span>`);
        meta.innerHTML = metaParts.join('');

        const favText = body.querySelector(`#maps-fav-text-${windowId}`);
        const isFav = favorites.some(f => Math.abs(f.lat - lat) < 0.001 && Math.abs(f.lng - lng) < 0.001);
        if (favText) favText.textContent = isFav ? '已收藏' : '收藏';
    }

    function detectCategory(place) {
        if (!place) return null;
        const cls = (place.class || '').toLowerCase();
        const cat = (place.category || '').toLowerCase();
        if (cls === 'amenity') {
            if (cat.includes('restaurant') || cat.includes('fast_food')) return 'food';
            if (cat.includes('cafe')) return 'cafe';
            if (cat.includes('fuel')) return 'gas';
            if (cat.includes('parking')) return 'parking';
            if (cat.includes('hospital')) return 'hospital';
            if (cat.includes('bank')) return 'bank';
        }
        if (cls === 'tourism') {
            if (cat.includes('hotel')) return 'hotel';
            if (cat.includes('attraction')) return 'attraction';
        }
        if (cls === 'shop') return 'shop';
        return null;
    }

    // ============ Search ============
    async function searchPlaces(query) {
        if (!query.trim()) {
            resultsEl.style.display = 'none';
            return;
        }
        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&namedetails=1&accept-language=zh-CN`);
            const data = await resp.json();
            if (data.length === 0) {
                resultsEl.innerHTML = '<div class="maps-no-results">未找到结果</div>';
            } else {
                resultsEl.innerHTML = data.map((p, i) => {
                    const cat = detectCategory(p);
                    const catObj = categories.find(c => c.id === cat);
                    const icon = catObj ? catObj.emoji : '📍';
                    return `
                    <div class="maps-result-item" data-idx="${i}">
                        <div class="maps-result-icon">${icon}</div>
                        <div style="overflow:hidden;flex:1;min-width:0;">
                            <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${(p.namedetails && p.namedetails.name) || p.display_name.split(',')[0]}</div>
                            <div style="font-size:11px;opacity:0.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.display_name}</div>
                        </div>
                    </div>
                    `;
                }).join('');
                resultsEl.querySelectorAll('.maps-result-item').forEach(el => {
                    el.addEventListener('click', () => {
                        showPlace(data[parseInt(el.dataset.idx)]);
                    });
                });
            }
            resultsEl.style.display = 'block';
        } catch (err) {
            console.error('Search error:', err);
            resultsEl.innerHTML = '<div class="maps-no-results">搜索失败，请检查网络</div>';
            resultsEl.style.display = 'block';
        }
    }

    async function searchNearbyByCategory(catId) {
        const categoryObj = categories.find(c => c.id === catId);
        if (!categoryObj) return;
        const center = map.getCenter();
        // Use Overpass API for nearby POIs
        const [gLng, gLat] = wgs84ToGcj02(center.lng, center.lat);
        const radius = 2000;
        const query = `[out:json][timeout:10];(${categoryObj.osm}(around:${radius},${center.lat},${center.lng}););out body 15;`;
        try {
            const resp = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: 'data=' + encodeURIComponent(query),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const data = await resp.json();
            clearMarkers();
            const places = (data.elements || []).filter(e => e.tags && e.tags.name).slice(0, 15);
            if (places.length === 0) {
                if (window.toast) window.toast('附近未找到' + categoryObj.name, 'info');
                return;
            }
            places.forEach(p => {
                const [gLng2, gLat2] = wgs84ToGcj02(p.lon, p.lat);
                const marker = L.marker([gLat2, gLng2], { icon: createPinIcon(categoryObj.color, categoryObj.emoji) });
                marker.addTo(map);
                marker.on('click', () => {
                    showPlace({
                        lat: p.lat,
                        lon: p.lon,
                        display_name: p.tags.name + ', ' + (p.tags['addr:city'] || ''),
                        namedetails: { name: p.tags.name },
                        class: p.tags.amenity ? 'amenity' : (p.tags.tourism ? 'tourism' : 'shop'),
                        category: p.tags.amenity || p.tags.tourism || p.tags.shop,
                        extratags: p.tags
                    });
                });
                markers.push(marker);
            });
            if (markers.length > 0) {
                const group = L.featureGroup(markers);
                map.fitBounds(group.getBounds(), { padding: [60, 60] });
            }
        } catch (err) {
            console.error('Nearby search error:', err);
            if (window.toast) window.toast('搜索失败，请检查网络', 'error');
        }
    }

    async function getRoute(fromLat, fromLng, toLat, toLng) {
        try {
            const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson&steps=true`);
            const data = await resp.json();
            if (data.routes && data.routes.length > 0) {
                routeCoords = data.routes[0].geometry.coordinates.map(c => {
                    const [gLng, gLat] = wgs84ToGcj02(c[0], c[1]);
                    return [gLat, gLng];
                });

                if (routeLine) map.removeLayer(routeLine);
                routeLine = L.polyline(routeCoords, {
                    color: '#007aff',
                    weight: 6,
                    opacity: 0.85,
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(map);

                const destIcon = L.divIcon({
                    className: 'maps-dest-marker',
                    html: `<div style="width:32px;height:32px;background:#ff3b30;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                });
                const destMarker = L.marker([routeCoords[routeCoords.length-1][0], routeCoords[routeCoords.length-1][1]], { icon: destIcon, zIndexOffset: 500 });
                destMarker.addTo(map);
                markers.push(destMarker);

                routeDist = data.routes[0].distance;
                routeDur = data.routes[0].duration;

                const dist = (routeDist / 1000).toFixed(1);
                const dur = Math.round(routeDur / 60);

                directionsPanel.style.display = 'block';
                directionsPanel.innerHTML = `
                    <div class="maps-dir-header">
                        <div class="maps-dir-info">
                            <div class="maps-dir-title">路线</div>
                            <div class="maps-dir-detail">${dist} 公里 · 约 ${dur} 分钟</div>
                        </div>
                        <button class="maps-nav-start-btn" id="maps-nav-start-btn-${windowId}">开始导航</button>
                        <button class="maps-dir-close" id="maps-dir-close-${windowId}">✕</button>
                    </div>
                `;

                map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });

                body.querySelector(`#maps-dir-close-${windowId}`).addEventListener('click', () => {
                    directionsPanel.style.display = 'none';
                    clearMarkers();
                    routeCoords = [];
                });

                body.querySelector(`#maps-nav-start-btn-${windowId}`).addEventListener('click', () => {
                    startNavigation();
                });
            }
        } catch (err) {
            console.error('Route error:', err);
        }
    }

    function showUserLocation(lat, lng, label, subLabel, bearing) {
        userWgs84Lat = lat;
        userWgs84Lng = lng;
        const [gLng, gLat] = wgs84ToGcj02(lng, lat);
        addUserMarker(gLat, gLng, bearing || 0);
        if (!navActive && !navMode) {
            map.setView([gLat, gLng], 13);
        }
        placeCard.style.display = 'block';
        body.querySelector(`#maps-place-name-${windowId}`).textContent = label;
        body.querySelector(`#maps-place-category-${windowId}`).textContent = '我的位置';
        body.querySelector(`#maps-place-icon-${windowId}`).textContent = '🔵';
        body.querySelector(`#maps-place-icon-${windowId}`).style.background = '#007aff';
        body.querySelector(`#maps-place-address-${windowId}`).textContent = subLabel || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        body.querySelector(`#maps-place-meta-${windowId}`).innerHTML = '<span>GPS 定位</span>';
    }

    async function ipLocate() {
        const services = [
            { url: 'http://ip-api.com/json/?lang=zh-CN&fields=status,message,country,regionName,city,lat,lon', parse: (d) => d.status === 'success' ? { lat: d.lat, lng: d.lon, city: d.city, region: d.regionName } : null },
            { url: 'https://ipinfo.io/json', parse: (d) => { if (d.loc) { const [la, ln] = d.loc.split(',').map(Number); return { lat: la, lng: ln, city: d.city, region: d.region }; } return null; } },
            { url: 'https://ipapi.co/json/', parse: (d) => d.latitude ? { lat: d.latitude, lng: d.longitude, city: d.city, region: d.region } : null }
        ];
        for (const svc of services) {
            try {
                const resp = await fetch(svc.url);
                if (!resp.ok) continue;
                const data = await resp.json();
                const loc = svc.parse(data);
                if (loc && loc.lat && loc.lng && Math.abs(loc.lat) > 0.1) {
                    return loc;
                }
            } catch (e) {
                continue;
            }
        }
        return null;
    }

    function startWatchPosition() {
        if (watchId != null) return;
        if (!navigator.geolocation) return;
        watchId = navigator.geolocation.watchPosition(
            (pos) => {
                located = true;
                locateBtn.style.animation = '';
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const heading = pos.coords.heading;
                const speed = pos.coords.speed;
                const acc = pos.coords.accuracy;

                userWgs84Lat = lat;
                userWgs84Lng = lng;

                const [gLng, gLat] = wgs84ToGcj02(lng, lat);
                if (userMarker) {
                    updateUserLocation(gLat, gLng, acc, heading, speed);
                } else {
                    showUserLocation(lat, lng, '我的位置', `${lat.toFixed(4)}, ${lng.toFixed(4)}`, heading || 0);
                    if (heading) currentBearing = heading;
                }
            },
            (err) => {
                console.log('watchPosition error:', err.code, err.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000 }
        );
    }

    function locateUser() {
        located = false;
        locateBtn.style.animation = 'mapsSpin 1s linear infinite';

        const fallbackLat = 39.9042, fallbackLng = 116.4074;
        if (!userMarker) {
            showUserLocation(fallbackLat, fallbackLng, '北京', '正在定位...');
        }

        function onGeoSuccess(pos) {
            if (located) return;
            located = true;
            locateBtn.style.animation = '';
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const heading = pos.coords.heading;
            showUserLocation(lat, lng, '我的位置', 'GPS 定位', heading || 0);
            if (heading) currentBearing = heading;
            startWatchPosition();
        }

        function onGeoFail() {
            ipLocate().then(loc => {
                if (located) return;
                located = true;
                locateBtn.style.animation = '';
                if (loc) {
                    const cityName = loc.city || loc.region || '当前位置';
                    showUserLocation(loc.lat, loc.lng, cityName, 'IP定位（近似位置）');
                } else {
                    showUserLocation(fallbackLat, fallbackLng, '北京', '定位不可用，使用默认位置');
                }
            }).catch(() => {
                if (located) return;
                located = true;
                locateBtn.style.animation = '';
                showUserLocation(fallbackLat, fallbackLng, '北京', '定位不可用，使用默认位置');
            });
        }

        if (!navigator.geolocation) {
            onGeoFail();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            onGeoSuccess,
            onGeoFail,
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
        );
    }

    function handleOrientation(e) {
        let heading = null;
        if (e.webkitCompassHeading != null) {
            heading = e.webkitCompassHeading;
        } else if (e.alpha != null) {
            heading = 360 - e.alpha;
        }
        if (heading != null && !isNaN(heading)) {
            deviceHeading = heading;
        }
    }

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
    }

    // ============ Event bindings ============
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => searchPlaces(searchInput.value), 400);
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            searchPlaces(searchInput.value.trim());
        }
    });
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) resultsEl.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest(`#maps-app-${windowId}`)) {
            resultsEl.style.display = 'none';
        }
    });

    locateBtn.addEventListener('click', () => {
        if (userMarker) {
            const ll = userMarker.getLatLng();
            if (navActive || navMode) {
                updateNavigationView(ll.lat, ll.lng, currentBearing, 0);
            } else {
                map.setView(ll, 15);
            }
        } else {
            locateUser();
        }
    });

    // Place card action buttons
    body.querySelector(`#maps-place-close-${windowId}`).addEventListener('click', () => {
        placeCard.style.display = 'none';
        clearMarkers();
    });
    body.querySelector(`#maps-action-route-${windowId}`).addEventListener('click', () => {
        if (!selectedPlace || !userMarker) {
            if (window.toast) window.toast('请先定位后再规划路线', 'info');
            return;
        }
        if (userWgs84Lat == null || userWgs84Lng == null) return;
        const destLat = parseFloat(selectedPlace.lat);
        const destLng = parseFloat(selectedPlace.lon);
        getRoute(userWgs84Lat, userWgs84Lng, destLat, destLng);
    });
    body.querySelector(`#maps-action-call-${windowId}`).addEventListener('click', () => {
        if (window.toast) window.toast('电话功能暂未启用', 'info');
    });
    body.querySelector(`#maps-action-share-${windowId}`).addEventListener('click', () => {
        if (selectedPlace && navigator.share) {
            navigator.share({
                title: selectedPlace.namedetails?.name || '位置分享',
                text: selectedPlace.display_name,
                url: `https://www.openstreetmap.org/?mlat=${selectedPlace.lat}&mlon=${selectedPlace.lon}#map=15/${selectedPlace.lat}/${selectedPlace.lon}`
            }).catch(() => {});
        } else if (selectedPlace) {
            const url = `https://www.openstreetmap.org/?mlat=${selectedPlace.lat}&mlon=${selectedPlace.lon}#map=15/${selectedPlace.lat}/${selectedPlace.lon}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    if (window.toast) window.toast('链接已复制到剪贴板', 'success');
                });
            }
        }
    });
    body.querySelector(`#maps-action-fav-${windowId}`).addEventListener('click', () => {
        if (!selectedPlace) return;
        const lat = parseFloat(selectedPlace.lat);
        const lng = parseFloat(selectedPlace.lon);
        const idx = favorites.findIndex(f => Math.abs(f.lat - lat) < 0.001 && Math.abs(f.lng - lng) < 0.001);
        if (idx >= 0) {
            favorites.splice(idx, 1);
            if (window.toast) window.toast('已取消收藏', 'info');
        } else {
            const cat = detectCategory(selectedPlace);
            const catObj = categories.find(c => c.id === cat);
            favorites.push({
                id: 'fav-' + Date.now(),
                name: (selectedPlace.namedetails && selectedPlace.namedetails.name) || (selectedPlace.display_name ? selectedPlace.display_name.split(',')[0] : '收藏地点'),
                address: selectedPlace.display_name || '',
                lat: lat,
                lng: lng,
                category: 'star',
                emoji: catObj ? catObj.emoji : '⭐',
                addedAt: Date.now()
            });
            if (window.toast) window.toast('已添加到收藏', 'success');
        }
        saveFavorites();
        // Update fav text
        const favText = body.querySelector(`#maps-fav-text-${windowId}`);
        if (favText) favText.textContent = idx >= 0 ? '收藏' : '已收藏';
        if (activeSidebarSection === 'favorites') renderSidebar();
    });

    body.querySelector(`#maps-nav-exit-${windowId}`).addEventListener('click', exitNavigation);

    compassEl.addEventListener('click', () => {
        if (navActive || navMode) {
            if (wrapperEl.style.transform && wrapperEl.style.transform !== 'rotate(0deg)') {
                wrapperEl.style.transform = 'rotate(0deg)';
                compassEl.style.transform = 'rotate(0deg)';
            } else {
                wrapperEl.style.transform = `rotate(${-currentBearing}deg)`;
                compassEl.style.transform = `rotate(${currentBearing}deg)`;
            }
        }
    });

    // Map zoom buttons (floating)
    const zoomInBtn = body.querySelector(`#maps-zoom-in-${windowId}`);
    const zoomOutBtn = body.querySelector(`#maps-zoom-out-${windowId}`);
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => map.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => map.zoomOut());

    // Map tools (3D, compass)
    body.querySelector(`#maps-3d-btn-${windowId}`).addEventListener('click', () => {
        if (map.getZoom() < 15) {
            map.setZoom(15, { animate: true });
        }
        // Simulate 3D tilt by adjusting pitch (leaflet doesn't support true 3D without plugin)
        if (window.toast) window.toast('3D 视图已开启', 'info');
    });
    body.querySelector(`#maps-compass-btn-${windowId}`).addEventListener('click', () => {
        if (wrapperEl.style.transform && wrapperEl.style.transform !== 'rotate(0deg)') {
            wrapperEl.style.transform = 'rotate(0deg)';
            compassEl.style.transform = 'rotate(0deg)';
        } else {
            map.setView(map.getCenter(), map.getZoom(), { animate: true });
        }
    });

    // Toolbar bindings
    if (toolbar) {
        toolbar.querySelectorAll('.maps-toolbar-segment .maps-toolbar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                toolbar.querySelectorAll('.maps-toolbar-segment .maps-toolbar-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const mode = btn.dataset.mode;
                if (mode !== currentLayer) {
                    if (mode === 'satellite') {
                        map.removeLayer(standardLayer);
                        if (map.hasLayer(hybridOverlayLayer)) map.removeLayer(hybridOverlayLayer);
                        satelliteLayer.addTo(map);
                    } else if (mode === 'hybrid') {
                        if (!map.hasLayer(satelliteLayer)) satelliteLayer.addTo(map);
                        hybridOverlayLayer.addTo(map);
                    } else {
                        if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
                        if (map.hasLayer(hybridOverlayLayer)) map.removeLayer(hybridOverlayLayer);
                        standardLayer.addTo(map);
                    }
                    currentLayer = mode;
                }
            });
        });

        const tbLocate = toolbar.querySelector(`#maps-tb-locate-${windowId}`);
        if (tbLocate) tbLocate.addEventListener('click', () => locateBtn.click());
        const tbShare = toolbar.querySelector(`#maps-tb-share-${windowId}`);
        if (tbShare) tbShare.addEventListener('click', () => {
            const c = map.getCenter();
            const url = `https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=${map.getZoom()}/${c.lat}/${c.lng}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    if (window.toast) window.toast('位置链接已复制', 'success');
                });
            }
        });
    }

    const resizeObserver = new ResizeObserver(() => {
        sizeMapEl();
        map.invalidateSize();
    });
    resizeObserver.observe(body);
    resizeObserver.observe(containerEl);

    // Initialize
    renderSidebar();
    setTimeout(locateUser, 300);
};
