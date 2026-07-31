// Find My - 查找 (macOS Sonoma)
window.renderFindMy = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_findmy_state_v2';

    const ICONS = {
        people: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        devices: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
        items: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
        laptop: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
        phone: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`,
        tablet: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`,
        watch: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="6" width="10" height="12" rx="2"/><path d="M9 6V3h6v3M9 18v3h6v-3"/></svg>`,
        pods: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a3 3 0 0 1 6 0v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM20 12a3 3 0 0 0-6 0v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z"/></svg>`,
        tag: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
        playSound: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
        locate: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
        lost: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 24l1.5-4.5h5L16 24"/><circle cx="12" cy="10" r="3"/></svg>`,
        erase: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        directions: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
        notify: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
        refresh: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
        battery: `<svg viewBox="0 0 28 14" width="26" height="13" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1" y="2" width="22" height="10" rx="2.5"/><rect x="24" y="5" width="2" height="4" rx="1" fill="currentColor" stroke="none"/></svg>`,
        search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
        close: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`
    };

    const DEVICES = [
        { id: 1, name: 'MacBook Pro', type: 'laptop', status: 'online', location: '北京市朝阳区三里屯', address: '三里屯太古里', battery: 82, charging: true, lastSeen: '刚刚', lat: 39.93, lng: 116.45, distance: '0 m', color: '#007AFF' },
        { id: 2, name: 'iPhone 15 Pro', type: 'phone', status: 'online', location: '北京市朝阳区三里屯', address: '三里屯太古里', battery: 67, charging: false, lastSeen: '刚刚', lat: 39.93, lng: 116.46, distance: '0 m', color: '#34C759' },
        { id: 3, name: 'iPad Air', type: 'tablet', status: 'online', location: '北京市朝阳区三里屯', address: '三里屯太古里', battery: 45, charging: false, lastSeen: '10 分钟前', lat: 39.92, lng: 116.45, distance: '1.1 km', color: '#5AC8FA' },
        { id: 4, name: 'Apple Watch Ultra 2', type: 'watch', status: 'online', location: '北京市朝阳区三里屯', address: '三里屯太古里', battery: 73, charging: false, lastSeen: '刚刚', lat: 39.93, lng: 116.45, distance: '0 m', color: '#FF9500' },
        { id: 5, name: 'AirPods Pro 2', type: 'pods', status: 'offline', location: '北京市朝阳区三里屯', address: '三里屯太古里', battery: 12, charging: false, lastSeen: '2 小时前', lat: 39.93, lng: 116.45, distance: '0 m', color: '#8E8E93' },
        { id: 6, name: '钥匙', type: 'tag', status: 'online', location: '北京市朝阳公园', address: '朝阳公园西门', battery: 95, charging: false, lastSeen: '5 分钟前', lat: 39.94, lng: 116.47, distance: '2.3 km', color: '#FF3B30' },
        { id: 7, name: '背包', type: 'tag', status: 'online', location: '北京市朝阳区三里屯', address: '三里屯太古里', battery: 91, charging: false, lastSeen: '3 分钟前', lat: 39.93, lng: 116.45, distance: '0 m', color: '#AF52DE' }
    ];

    const PEOPLE = [
        { id: 101, name: '王晓明', relation: '家人', status: 'online', location: '北京市朝阳区三里屯', address: '三里屯太古里', lastSeen: '刚刚', lat: 39.93, lng: 116.46, distance: '0 m', color: '#FF9500', initials: '王' },
        { id: 102, name: '李娜', relation: '朋友', status: 'online', location: '北京市海淀区中关村', address: '中关村理想国际大厦', lastSeen: '刚刚', lat: 39.98, lng: 116.31, distance: '12 km', color: '#FF2D55', initials: '李' },
        { id: 103, name: '张伟', relation: '同事', status: 'offline', location: '上海市浦东新区', address: '陆家嘴金融中心', lastSeen: '1 小时前', lat: 31.24, lng: 121.50, distance: '1063 km', color: '#5856D6', initials: '张' }
    ];

    let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
        activeTab: 'devices',
        selectedId: 1,
        searchQuery: ''
    };

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getCurrentList() {
        let list;
        if (state.activeTab === 'people') list = PEOPLE;
        else if (state.activeTab === 'items') list = DEVICES.filter(d => d.type === 'tag');
        else list = DEVICES.filter(d => d.type !== 'tag');
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            list = list.filter(item => item.name.toLowerCase().includes(q) || (item.location || '').toLowerCase().includes(q));
        }
        return list;
    }

    function getSelected() {
        const list = getCurrentList();
        return list.find(item => item.id === state.selectedId) || list[0] || null;
    }

    function getStatusInfo(status) {
        if (status === 'online') return { label: '在线', color: 'var(--accent-green)', dot: 'var(--accent-green)' };
        return { label: '离线', color: 'var(--text-tertiary)', dot: 'var(--text-tertiary)' };
    }

    function getBatteryColor(battery, charging) {
        if (charging) return 'var(--accent-green)';
        if (battery <= 20) return 'var(--accent-red)';
        if (battery <= 40) return 'var(--accent-orange)';
        return 'var(--accent-green)';
    }

    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text, 'success');
    }

    function renderSidebar() {
        const counts = {
            people: PEOPLE.length,
            devices: DEVICES.filter(d => d.type !== 'tag').length,
            items: DEVICES.filter(d => d.type === 'tag').length
        };

        return `
            <div class="fm-side">
                <div class="fm-side-header">
                    <div class="fm-side-eyebrow">查找</div>
                    <h1 class="fm-side-title">所有设备</h1>
                </div>
                <div class="fm-search">
                    ${ICONS.search}
                    <input type="text" id="fm-search-input" placeholder="搜索" value="${escapeHtml(state.searchQuery)}">
                </div>
                <div class="fm-nav">
                    <div class="fm-nav-item ${state.activeTab === 'people' ? 'active' : ''}" data-tab="people">
                        ${ICONS.people}
                        <span>联系人</span>
                        ${counts.people ? `<span class="fm-count">${counts.people}</span>` : ''}
                    </div>
                    <div class="fm-nav-item ${state.activeTab === 'devices' ? 'active' : ''}" data-tab="devices">
                        ${ICONS.devices}
                        <span>设备</span>
                        ${counts.devices ? `<span class="fm-count">${counts.devices}</span>` : ''}
                    </div>
                    <div class="fm-nav-item ${state.activeTab === 'items' ? 'active' : ''}" data-tab="items">
                        ${ICONS.items}
                        <span>物品</span>
                        ${counts.items ? `<span class="fm-count">${counts.items}</span>` : ''}
                    </div>
                </div>
                <div class="fm-device-list">
                    ${renderDeviceList()}
                </div>
                <div class="fm-side-footer">
                    <div class="fm-friend-card">
                        ${ICONS.people}
                        <span>添加朋友以共享位置</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderDeviceList() {
        const list = getCurrentList();
        if (list.length === 0) {
            return `<div class="fm-list-empty">${state.searchQuery ? '未找到结果' : '没有项目'}</div>`;
        }
        return list.map(item => {
            const isDevice = item.type !== undefined;
            const st = getStatusInfo(item.status);
            const sel = state.selectedId === item.id;
            const icon = isDevice ? ICONS[item.type] : `<span class="fm-avatar-sm" style="background:${item.color}">${escapeHtml(item.initials)}</span>`;
            return `
                <div class="fm-device-item ${sel ? 'active' : ''}" data-id="${item.id}">
                    <div class="fm-device-icon" style="color:${sel ? '#fff' : item.color}">${icon}</div>
                    <div class="fm-device-info">
                        <div class="fm-device-name">${escapeHtml(item.name)}</div>
                        <div class="fm-device-loc">
                            <span class="fm-status-dot" style="background:${st.dot}"></span>
                            <span>${escapeHtml(item.location)}</span>
                        </div>
                    </div>
                    ${isDevice ? `<div class="fm-battery-mini ${item.charging ? 'charging' : ''}" style="color:${getBatteryColor(item.battery, item.charging)}">${item.battery}%</div>` : ''}
                </div>
            `;
        }).join('');
    }

    function renderMap() {
        const sel = getSelected();
        if (!sel) {
            return `<div class="fm-map-empty">未选择任何项目</div>`;
        }
        const isDevice = sel.type !== undefined;
        const st = getStatusInfo(sel.status);
        // Multiple pins on map
        const allItems = getCurrentList();
        const pins = allItems.map((item, i) => {
            const x = 15 + (i * 11) % 70 + (item.id % 3) * 4;
            const y = 20 + (i * 17) % 55;
            const isActive = item.id === state.selectedId;
            return `
                <div class="fm-pin ${isActive ? 'active' : ''}" style="left:${x}%;top:${y}%;--pin-color:${item.color}">
                    <div class="fm-pin-pulse"></div>
                    <div class="fm-pin-dot">${isDevice ? '' : escapeHtml(item.initials)}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="fm-map">
                <div class="fm-map-bg">
                    <div class="fm-map-roads"></div>
                    <div class="fm-map-park"></div>
                    <div class="fm-map-water"></div>
                    <div class="fm-map-grid"></div>
                </div>
                ${pins}
                <div class="fm-map-controls">
                    <button class="fm-map-btn" data-action="zoom-in" title="放大">+</button>
                    <button class="fm-map-btn" data-action="zoom-out" title="缩小">−</button>
                    <button class="fm-map-btn locate" data-action="locate" title="定位">${ICONS.locate}</button>
                </div>
                <div class="fm-map-info-card">
                    <div class="fm-info-icon" style="background:${sel.color};color:#fff">
                        ${isDevice ? ICONS[sel.type] : escapeHtml(sel.initials)}
                    </div>
                    <div class="fm-info-content">
                        <div class="fm-info-name">${escapeHtml(sel.name)}</div>
                        <div class="fm-info-address">${escapeHtml(sel.address)}</div>
                        <div class="fm-info-meta">
                            <span class="fm-info-status" style="color:${st.color}">● ${st.label}</span>
                            ${isDevice ? `<span class="fm-info-sep">·</span><span>距离 ${sel.distance}</span>` : ''}
                            <span class="fm-info-sep">·</span><span>${sel.lastSeen}</span>
                        </div>
                    </div>
                    ${isDevice ? `
                        <div class="fm-info-battery">
                            <div class="fm-battery-bar">
                                <div class="fm-battery-fill" style="width:${sel.battery}%;background:${getBatteryColor(sel.battery, sel.charging)}"></div>
                            </div>
                            <span class="fm-battery-text" style="color:${getBatteryColor(sel.battery, sel.charging)}">${sel.charging ? '⚡' : ''}${sel.battery}%</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    function renderDetailPanel() {
        const sel = getSelected();
        if (!sel) return '';
        const isDevice = sel.type !== undefined;
        const st = getStatusInfo(sel.status);

        return `
            <div class="fm-detail">
                <div class="fm-detail-header">
                    <div class="fm-detail-icon" style="background:${sel.color};color:#fff">
                        ${isDevice ? ICONS[sel.type] : escapeHtml(sel.initials)}
                    </div>
                    <div class="fm-detail-titles">
                        <h2 class="fm-detail-name">${escapeHtml(sel.name)}</h2>
                        <div class="fm-detail-sub">${isDevice ? '设备' : sel.relation}</div>
                    </div>
                </div>

                <div class="fm-detail-status">
                    <div class="fm-status-row">
                        <span class="fm-status-label">状态</span>
                        <span class="fm-status-value" style="color:${st.color}">
                            <span class="fm-status-dot" style="background:${st.dot}"></span>${st.label}
                        </span>
                    </div>
                    ${isDevice ? `
                        <div class="fm-status-row">
                            <span class="fm-status-label">电量</span>
                            <span class="fm-status-value">
                                <span class="fm-battery-pill" style="color:${getBatteryColor(sel.battery, sel.charging)}">
                                    <span class="fm-battery-fill-sm" style="width:${sel.battery}%;background:${getBatteryColor(sel.battery, sel.charging)}"></span>
                                </span>
                                ${sel.charging ? '⚡ ' : ''}${sel.battery}%
                            </span>
                        </div>
                    ` : ''}
                    <div class="fm-status-row">
                        <span class="fm-status-label">位置</span>
                        <span class="fm-status-value">${escapeHtml(sel.address)}</span>
                    </div>
                    <div class="fm-status-row">
                        <span class="fm-status-label">距离</span>
                        <span class="fm-status-value">${sel.distance}</span>
                    </div>
                    <div class="fm-status-row">
                        <span class="fm-status-label">最后定位</span>
                        <span class="fm-status-value">${sel.lastSeen}</span>
                    </div>
                </div>

                <div class="fm-detail-actions">
                    ${isDevice ? `
                        <button class="fm-action-btn primary" data-action="play-sound">
                            ${ICONS.playSound}
                            <span>播放声音</span>
                        </button>
                        <button class="fm-action-btn" data-action="locate">
                            ${ICONS.locate}
                            <span>定位</span>
                        </button>
                        <button class="fm-action-btn" data-action="directions">
                            ${ICONS.directions}
                            <span>路线</span>
                        </button>
                        <button class="fm-action-btn" data-action="notify">
                            ${ICONS.notify}
                            <span>通知</span>
                        </button>
                        <button class="fm-action-btn warn" data-action="lost">
                            ${ICONS.lost}
                            <span>标记为丢失</span>
                        </button>
                        <button class="fm-action-btn danger" data-action="erase">
                            ${ICONS.erase}
                            <span>擦除此设备</span>
                        </button>
                    ` : `
                        <button class="fm-action-btn primary" data-action="directions">
                            ${ICONS.directions}
                            <span>路线</span>
                        </button>
                        <button class="fm-action-btn" data-action="notify">
                            ${ICONS.notify}
                            <span>通知</span>
                        </button>
                        <button class="fm-action-btn" data-action="locate">
                            ${ICONS.locate}
                            <span>定位</span>
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.innerHTML = `
            <div class="fm-app">
                ${renderSidebar()}
                <div class="fm-content">
                    ${renderMap()}
                </div>
                ${renderDetailPanel()}
            </div>
        `;
        bindEvents();
    }

    function bindEvents() {
        body.querySelectorAll('.fm-nav-item').forEach(el => {
            el.addEventListener('click', () => {
                state.activeTab = el.dataset.tab;
                const list = getCurrentList();
                state.selectedId = list[0] ? list[0].id : null;
                saveState();
                render();
            });
        });

        body.querySelectorAll('.fm-device-item').forEach(el => {
            el.addEventListener('click', () => {
                state.selectedId = parseInt(el.dataset.id);
                saveState();
                render();
            });
        });

        const search = body.querySelector('#fm-search-input');
        if (search) {
            let timer;
            search.addEventListener('input', (e) => {
                clearTimeout(timer);
                const val = e.target.value;
                timer = setTimeout(() => {
                    state.searchQuery = val;
                    saveState();
                    render();
                    const ni = body.querySelector('#fm-search-input');
                    if (ni) { ni.focus(); ni.setSelectionRange(val.length, val.length); }
                }, 200);
            });
        }

        body.querySelectorAll('.fm-action-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const act = btn.dataset.action;
                const sel = getSelected();
                const name = sel ? sel.name : '';
                switch (act) {
                    case 'play-sound':
                        showToast(`正在${name}上播放声音…`);
                        break;
                    case 'locate':
                        showToast(`正在定位${name}…`);
                        const pin = body.querySelector('.fm-pin.active');
                        if (pin) {
                            pin.classList.add('locating');
                            setTimeout(() => pin.classList.remove('locating'), 2000);
                        }
                        break;
                    case 'directions':
                        showToast(`已打开前往${name}的路线`);
                        break;
                    case 'notify':
                        showToast(`已为${name}开启位置通知`);
                        break;
                    case 'lost':
                        showToast(`${name}已标记为丢失模式`);
                        break;
                    case 'erase':
                        if (window.DialogSystem && window.DialogSystem.confirm) {
                            window.DialogSystem.confirm('擦除此设备', `确定要擦除“${name}”上的所有内容吗？此操作无法撤销。`, () => {
                                showToast(`${name}正在擦除…`);
                            });
                        } else if (await window.showConfirm(`确定要擦除“${name}”吗？`)) {
                            showToast(`${name}正在擦除…`);
                        }
                        break;
                }
            });
        });

        body.querySelectorAll('.fm-map-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const act = btn.dataset.action;
                if (act === 'locate') showToast('正在定位当前位置…');
            });
        });
    }

    render();

    return () => {};
};
