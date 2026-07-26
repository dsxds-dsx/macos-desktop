window.renderMaps = function(body, sidebar, toolbar, windowId) {
    body.style.padding = '0';
    body.style.overflow = 'hidden';
    body.innerHTML = `
        <div class="maps-container" id="maps-container-${windowId}" style="width:100%;height:100%;position:relative;overflow:hidden;">
            <div class="maps-search-bar">
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
            <div class="maps-map-wrapper" id="maps-wrapper-${windowId}" style="width:100%;height:100%;position:absolute;inset:0;z-index:0;transition:transform 0.5s cubic-bezier(0.4,0,0.2,1);transform-origin:center center;">
                <div class="maps-map" id="maps-map-${windowId}" style="width:100%;height:100%;position:absolute;inset:0;"></div>
            </div>
            <div class="maps-bottom-bar" id="maps-bottom-${windowId}" style="display:none;">
                <div class="maps-bottom-info">
                    <div class="maps-bottom-name" id="maps-place-name"></div>
                    <div class="maps-bottom-address" id="maps-place-address"></div>
                </div>
                <button class="maps-route-btn" id="maps-route-btn">路线</button>
            </div>
            <div class="maps-nav-overlay" id="maps-nav-overlay-${windowId}" style="display:none;">
                <div class="maps-nav-top">
                    <div class="maps-nav-direction" id="maps-nav-direction">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
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
    `;

    if (toolbar) {
        toolbar.innerHTML = `
            <div class="maps-toolbar">
                <div class="maps-toolbar-segment">
                    <button class="maps-toolbar-btn active" data-mode="standard" title="标准">标准</button>
                    <button class="maps-toolbar-btn" data-mode="satellite" title="卫星">卫星</button>
                </div>
                <div style="flex:1"></div>
                <button class="maps-toolbar-btn" id="maps-zoom-in-${windowId}" title="放大">
                    <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>
                </button>
                <button class="maps-toolbar-btn" id="maps-zoom-out-${windowId}" title="缩小">
                    <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 13H5v-2h14v2z" fill="currentColor"/></svg>
                </button>
            </div>
        `;
    }

    const mapEl = body.querySelector(`#maps-map-${windowId}`);
    const wrapperEl = body.querySelector(`#maps-wrapper-${windowId}`);
    const containerEl = body.querySelector(`#maps-container-${windowId}`);
    const searchInput = body.querySelector(`#maps-search-${windowId}`);
    const resultsEl = body.querySelector(`#maps-results-${windowId}`);
    const locateBtn = body.querySelector(`#maps-locate-${windowId}`);
    const bottomBar = body.querySelector(`#maps-bottom-${windowId}`);
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

    // WGS-84 to GCJ-02 coordinate conversion
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

    // Calculate bearing between two points (degrees, 0=north, clockwise)
    function calculateBearing(lat1, lng1, lat2, lng2) {
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const la1 = lat1 * Math.PI / 180;
        const la2 = lat2 * Math.PI / 180;
        const y = Math.sin(dLng) * Math.cos(la2);
        const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLng);
        let brng = Math.atan2(y, x) * 180 / Math.PI;
        return (brng + 360) % 360;
    }

    // Distance between two points in meters (Haversine)
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

    // Find closest point on polyline to a given point
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
                    <svg viewBox="0 0 40 56" width="40" height="56">
                        <defs>
                            <linearGradient id="triGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#4da3ff"/>
                                <stop offset="100%" stop-color="#0066ff"/>
                            </linearGradient>
                        </defs>
                        <path d="M20 0 C20 0, 0 34, 0 42 C0 50, 9 56, 20 56 C31 56, 40 50, 40 42 C40 34, 20 0, 20 0Z" fill="url(#triGrad)" stroke="#fff" stroke-width="2.5"/>
                        <circle cx="20" cy="42" r="6" fill="rgba(255,255,255,0.4)"/>
                    </svg>
                </div>
                <div class="maps-triangle-halo"></div>
            </div>`,
            iconSize: [40, 56],
            iconAnchor: [20, 42]
        });
    }

    function addUserMarker(lat, lng, bearing) {
        if (userMarker) {
            userMarker.setLatLng([lat, lng]);
            userMarker.setIcon(createTriangleIcon(bearing));
        } else {
            userMarker = L.marker([lat, lng], { icon: createTriangleIcon(bearing), interactive: false, zIndexOffset: 1000 });
            userMarker.addTo(map);
        }
    }

    function updateUserLocation(lat, lng, accuracy, heading, speed) {
        // Calculate bearing from movement if heading not provided
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
            // Navigation mode: rotate map, zoom in, follow
            updateNavigationView(lat, lng, bearing, accuracy);
        } else if (navMode) {
            // Route overview with route line - just follow with bearing up
            updateNavigationView(lat, lng, bearing, accuracy);
        }
    }

    function updateNavigationView(lat, lng, bearing, accuracy) {
        // Set zoom to navigation level
        const navZoom = 17;
        if (map.getZoom() < navZoom - 1) {
            map.setZoom(navZoom, { animate: true });
        }

        // Look ahead in the direction of movement
        const lookAheadMeters = 80;
        const bearingRad = bearing * Math.PI / 180;
        const lookLat = lat + (lookAheadMeters / 111000) * Math.cos(bearingRad);
        const lookLng = lng + (lookAheadMeters / (111000 * Math.cos(lat * Math.PI / 180))) * Math.sin(bearingRad);

        // Pan to look-ahead point
        map.panTo([lookLat, lookLng], { animate: true, duration: 0.5 });

        // Rotate map so that bearing points up (route is vertical)
        const rotateAngle = -bearing;
        wrapperEl.style.transform = `rotate(${rotateAngle}deg)`;

        // Update compass to point north (reverse rotate)
        compassEl.style.transform = `rotate(${-rotateAngle}deg)`;
        compassEl.style.display = 'flex';

        // Find progress along route and update instructions
        if (routeCoords.length > 0) {
            updateRouteProgress(lat, lng);
        }

        // Update speed display
        const spdEl = body.querySelector('#maps-nav-speed');
        if (spdEl) spdEl.textContent = Math.round(currentSpeed);
    }

    function updateRouteProgress(lat, lng) {
        const closest = findClosestPointOnRoute(lat, lng, routeCoords);
        const remaining = routeCoords.slice(closest.index);

        if (remaining.length < 2) {
            // Arrived
            body.querySelector('#maps-nav-instruction').textContent = '已到达目的地';
            body.querySelector('#maps-nav-distance').textContent = '0 米';
            return;
        }

        // Calculate remaining distance
        let remainingDist = 0;
        for (let i = closest.index; i < routeCoords.length - 1; i++) {
            remainingDist += haversineDistance(routeCoords[i][0], routeCoords[i][1], routeCoords[i+1][0], routeCoords[i+1][1]);
        }

        // Determine next turn instruction (simplified - just show direction based on angle)
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
                    dirIcon.innerHTML = '<path d="M5 19V5h14M12 5l7 7-7 7"/>';
                } else if (directionIcon === 'left') {
                    dirIcon.innerHTML = '<path d="M19 19V5H5M12 5L5 12l7 7"/>';
                } else {
                    dirIcon.innerHTML = '<path d="M12 19V5M5 12l7-7 7 7"/>';
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
        bottomBar.style.display = 'none';
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
        bottomBar.style.display = 'none';
        body.querySelector('.maps-search-bar').style.opacity = '1';
        body.querySelector('.maps-search-bar').style.pointerEvents = '';

        // Reset map rotation
        wrapperEl.style.transform = 'rotate(0deg)';
        compassEl.style.display = 'none';
        compassEl.style.transform = '';

        // Re-enable map interactions
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

        if (watchId != null && !navActive) {
            // Keep watching for position updates but not in nav mode
        }
    }

    function showPlace(place) {
        selectedPlace = place;
        clearMarkers();
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        const [gLng, gLat] = wgs84ToGcj02(lng, lat);

        const pinIcon = L.divIcon({
            className: 'maps-pin-marker',
            html: `<svg viewBox="0 0 24 32" width="28" height="36"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#ff3b30"/><circle cx="12" cy="12" r="5" fill="#fff"/></svg>`,
            iconSize: [28, 36],
            iconAnchor: [14, 36]
        });
        const marker = L.marker([gLat, gLng], { icon: pinIcon });
        if (place.display_name) marker.bindPopup(place.display_name);
        marker.addTo(map);
        markers.push(marker);

        map.setView([gLat, gLng], 15);

        bottomBar.style.display = 'flex';
        body.querySelector('#maps-place-name').textContent = (place.namedetails && place.namedetails.name) || place.display_name.split(',')[0];
        body.querySelector('#maps-place-address').textContent = place.display_name;
        resultsEl.style.display = 'none';
    }

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
                resultsEl.innerHTML = data.map((p, i) => `
                    <div class="maps-result-item" data-idx="${i}">
                        <svg viewBox="0 0 24 24" width="16" height="16" style="flex-shrink:0;opacity:0.6"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
                        <div style="overflow:hidden">
                            <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${(p.namedetails && p.namedetails.name) || p.display_name.split(',')[0]}</div>
                            <div style="font-size:11px;opacity:0.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.display_name}</div>
                        </div>
                    </div>
                `).join('');
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

    async function getRoute(fromLat, fromLng, toLat, toLng) {
        try {
            const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson&steps=true`);
            const data = await resp.json();
            if (data.routes && data.routes.length > 0) {
                // Convert all coordinates to GCJ-02
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

                // Add destination marker
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
                        <span>路线 · ${dist} 公里 · 约 ${dur} 分钟</span>
                        <button class="maps-nav-start-btn" id="maps-nav-start-btn-${windowId}" style="margin-left:auto;background:#007aff;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">开始导航</button>
                        <button class="maps-dir-close" id="maps-dir-close-${windowId}" style="margin-left:8px;">✕</button>
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
        bottomBar.style.display = 'flex';
        body.querySelector('#maps-place-name').textContent = label;
        body.querySelector('#maps-place-address').textContent = subLabel || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
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

    // Device orientation for compass
    function handleOrientation(e) {
        let heading = null;
        if (e.webkitCompassHeading != null) {
            heading = e.webkitCompassHeading;
        } else if (e.alpha != null) {
            // alpha is rotation around z-axis, 0=north on some devices
            heading = 360 - e.alpha;
        }
        if (heading != null && !isNaN(heading)) {
            deviceHeading = heading;
        }
    }

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
        // iOS requires permission
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // Will request on first locate
        }
    }

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
        if (!e.target.closest(`#maps-container-${windowId}`)) {
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

    body.querySelector('#maps-route-btn').addEventListener('click', () => {
        if (!selectedPlace || !userMarker) return;
        if (userWgs84Lat == null || userWgs84Lng == null) return;
        const destLat = parseFloat(selectedPlace.lat);
        const destLng = parseFloat(selectedPlace.lon);
        getRoute(userWgs84Lat, userWgs84Lng, destLat, destLng);
    });

    body.querySelector(`#maps-nav-exit-${windowId}`).addEventListener('click', exitNavigation);

    compassEl.addEventListener('click', () => {
        if (navActive || navMode) {
            // Toggle: exit course-up, go north-up
            if (wrapperEl.style.transform && wrapperEl.style.transform !== 'rotate(0deg)') {
                wrapperEl.style.transform = 'rotate(0deg)';
                compassEl.style.transform = 'rotate(0deg)';
            } else {
                // Back to course up
                wrapperEl.style.transform = `rotate(${-currentBearing}deg)`;
                compassEl.style.transform = `rotate(${currentBearing}deg)`;
            }
        }
    });

    if (toolbar) {
        toolbar.querySelectorAll('.maps-toolbar-segment .maps-toolbar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                toolbar.querySelectorAll('.maps-toolbar-segment .maps-toolbar-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const mode = btn.dataset.mode;
                if (mode !== currentLayer) {
                    if (mode === 'satellite') {
                        map.removeLayer(standardLayer);
                        satelliteLayer.addTo(map);
                    } else {
                        map.removeLayer(satelliteLayer);
                        standardLayer.addTo(map);
                    }
                    currentLayer = mode;
                }
            });
        });

        const zi = toolbar.querySelector(`#maps-zoom-in-${windowId}`);
        const zo = toolbar.querySelector(`#maps-zoom-out-${windowId}`);
        if (zi) zi.addEventListener('click', () => map.zoomIn());
        if (zo) zo.addEventListener('click', () => map.zoomOut());
    }

    const resizeObserver = new ResizeObserver(() => {
        sizeMapEl();
        map.invalidateSize();
    });
    resizeObserver.observe(body);
    resizeObserver.observe(containerEl);

    setTimeout(locateUser, 300);
};
