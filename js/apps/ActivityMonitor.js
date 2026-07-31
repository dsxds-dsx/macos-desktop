// Activity Monitor - 活动监视器 (macOS Sonoma)
window.renderActivityMonitor = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_activity_v1';

    const categories = [
        { id: 'cpu', name: 'CPU', icon: 'cpu' },
        { id: 'memory', name: '内存', icon: 'memory' },
        { id: 'energy', name: '能耗', icon: 'energy' },
        { id: 'disk', name: '磁盘', icon: 'disk' },
        { id: 'network', name: '网络', icon: 'network' },
        { id: 'cache', name: '缓存', icon: 'cache' },
        { id: 'gpu', name: 'GPU', icon: 'gpu' }
    ];

    const processes = [
        { name: 'kernel_task', pid: 0, user: 'root', cpu: 3.4, mem: 0, threads: 32, kind: 'system', icon: 'gear' },
        { name: 'WindowServer', pid: 145, user: '_windowserver', cpu: 8.2, mem: 195, threads: 14, kind: 'system', icon: 'display' },
        { name: 'Safari', pid: 205, user: 'user', cpu: 12.5, mem: 420, threads: 24, kind: 'app', icon: 'safari' },
        { name: 'Finder', pid: 301, user: 'user', cpu: 2.3, mem: 85, threads: 8, kind: 'app', icon: 'finder' },
        { name: '邮件', pid: 302, user: 'user', cpu: 1.1, mem: 98, threads: 12, kind: 'app', icon: 'mail' },
        { name: '信息', pid: 305, user: 'user', cpu: 0.8, mem: 65, threads: 10, kind: 'app', icon: 'messages' },
        { name: '音乐', pid: 401, user: 'user', cpu: 4.2, mem: 156, threads: 16, kind: 'app', icon: 'music' },
        { name: '活动监视器', pid: 501, user: 'user', cpu: 1.5, mem: 72, threads: 6, kind: 'app', icon: 'activity' },
        { name: 'Terminal', pid: 105, user: 'user', cpu: 0.3, mem: 12, threads: 4, kind: 'app', icon: 'terminal' },
        { name: 'SystemUIServer', pid: 58, user: 'root', cpu: 0.1, mem: 28, threads: 8, kind: 'system', icon: 'gear' },
        { name: 'launchd', pid: 1, user: 'root', cpu: 0.2, mem: 8, threads: 6, kind: 'system', icon: 'gear' },
        { name: 'dock', pid: 88, user: 'user', cpu: 0.6, mem: 64, threads: 9, kind: 'app', icon: 'gear' },
        { name: ' Spotlight', pid: 91, user: '_spotlight', cpu: 0.4, mem: 44, threads: 11, kind: 'system', icon: 'search' },
        { name: 'Photos', pid: 612, user: 'user', cpu: 0.9, mem: 132, threads: 13, kind: 'app', icon: 'photos' },
        { name: 'Xcode', pid: 720, user: 'user', cpu: 6.8, mem: 845, threads: 38, kind: 'app', icon: 'code' }
    ];

    const seedStats = {
        cpu: 24.5, cpuUser: 17.2, cpuSystem: 7.3,
        mem: 62, memUsed: 42.3, memCached: 18.7,
        energy: 38, energyAvg: 12,
        diskRead: 2.4, diskWrite: 1.1,
        netIn: 1.2, netOut: 0.6,
        cache: 4.2,
        gpu: 18
    };

    function defaultData() {
        return {
            currentTab: 'cpu',
            searchText: '',
            sortKey: 'cpu',
            sortDir: 'desc',
            updateFreq: 2,
            selectedPid: null,
            showInspector: true
        };
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultData();

    let stats = Object.assign({}, seedStats);
    let history = { cpu: [], mem: [], net: [], disk: [], gpu: [], energy: [] };
    const HISTORY_LEN = 40;
    for (let i = 0; i < HISTORY_LEN; i++) {
        history.cpu.push(20 + Math.random() * 30);
        history.mem.push(58 + Math.random() * 10);
        history.net.push(Math.random() * 2);
        history.disk.push(Math.random() * 4);
        history.gpu.push(10 + Math.random() * 20);
        history.energy.push(30 + Math.random() * 20);
    }

    let updateInterval = null;

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text);
    }

    function catIcon(icon) {
        const icons = {
            cpu: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>',
            memory: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 6V4M11 6V4M15 6V4M19 6V4M7 20v-2M11 20v-2M15 20v-2M19 20v-2"/></svg>',
            energy: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
            disk: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>',
            network: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>',
            cache: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
            gpu: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="2"/><circle cx="15" cy="12" r="2"/></svg>'
        };
        return icons[icon] || icons.cpu;
    }

    function procIcon(icon) {
        const icons = {
            gear: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
            display: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            safari: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
            finder: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l4-4h10l4 4v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"/><path d="M3 7h18M9 3v4M15 3v4"/></svg>',
            mail: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>',
            messages: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
            music: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
            activity: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
            terminal: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
            search: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
            photos: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
            code: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
        };
        return icons[icon] || icons.gear;
    }

    function randomizeStats() {
        stats.cpu = Math.max(4, Math.min(92, stats.cpu + (Math.random() - 0.5) * 12));
        stats.cpuUser = stats.cpu * (0.6 + Math.random() * 0.2);
        stats.cpuSystem = stats.cpu - stats.cpuUser;
        stats.mem = Math.max(35, Math.min(92, stats.mem + (Math.random() - 0.5) * 4));
        stats.memUsed = (stats.mem / 100) * 64;
        stats.memCached = 12 + Math.random() * 12;
        stats.energy = Math.max(15, Math.min(80, stats.energy + (Math.random() - 0.5) * 8));
        stats.energyAvg = 8 + Math.random() * 8;
        stats.diskRead = Math.random() * 6;
        stats.diskWrite = Math.random() * 4;
        stats.netIn = Math.random() * 2.5;
        stats.netOut = Math.random() * 1.2;
        stats.cache = 3 + Math.random() * 3;
        stats.gpu = Math.max(5, Math.min(75, stats.gpu + (Math.random() - 0.5) * 14));

        history.cpu.shift(); history.cpu.push(stats.cpu);
        history.mem.shift(); history.mem.push(stats.mem);
        history.net.shift(); history.net.push((stats.netIn + stats.netOut));
        history.disk.shift(); history.disk.push((stats.diskRead + stats.diskWrite));
        history.gpu.shift(); history.gpu.push(stats.gpu);
        history.energy.shift(); history.energy.push(stats.energy);

        processes.forEach(p => {
            p.cpu = Math.max(0.0, Math.min(60, p.cpu + (Math.random() - 0.5) * 3.5));
            p.mem = Math.max(4, p.mem + (Math.random() - 0.5) * 18);
        });
    }

    function sparkline(values, color, w, h) {
        const max = Math.max(...values, 1);
        const min = Math.min(...values, 0);
        const range = Math.max(max - min, 1);
        const step = w / (values.length - 1);
        const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`).join(' ');
        const last = values[values.length - 1];
        const lastY = h - ((last - min) / range) * h;
        const areaPts = `0,${h} ${pts} ${w},${h}`;
        return `
            <svg class="am-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
                <polyline points="${areaPts}" fill="${color}" fill-opacity="0.12" stroke="none"/>
                <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>
                <circle cx="${w}" cy="${lastY}" r="2.2" fill="${color}"/>
            </svg>
        `;
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="am-sidebar">
                <div class="am-sidebar-hero">
                    <div class="am-hero-icon">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <div class="am-hero-title">活动监视器</div>
                </div>
                <div class="am-nav">
                    <div class="am-nav-label">分类</div>
                    ${categories.map(c => `
                        <div class="am-nav-item ${data.currentTab === c.id ? 'active' : ''}" data-cat="${c.id}">
                            <span class="am-nav-icon">${catIcon(c.icon)}</span>
                            <span class="am-nav-name">${escapeHtml(c.name)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="am-sidebar-footer">
                    <div class="am-update-ctrl">
                        <span>更新频率</span>
                        <select id="am-freq">
                            <option value="1" ${data.updateFreq === 1 ? 'selected' : ''}>经常 (1秒)</option>
                            <option value="2" ${data.updateFreq === 2 ? 'selected' : ''}>正常 (2秒)</option>
                            <option value="5" ${data.updateFreq === 5 ? 'selected' : ''}>不常 (5秒)</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        sidebar.querySelectorAll('[data-cat]').forEach(el => {
            el.addEventListener('click', () => {
                data.currentTab = el.dataset.cat;
                save();
                render();
            });
        });
        const freq = sidebar.querySelector('#am-freq');
        if (freq) freq.addEventListener('change', (e) => {
            data.updateFreq = parseInt(e.target.value, 10);
            save();
            restartTimer();
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const cat = categories.find(c => c.id === data.currentTab);
        toolbar.innerHTML = `
            <div class="am-toolbar">
                <div class="am-toolbar-left">
                    <div class="am-tb-cat-icon">${catIcon(cat?.icon || 'cpu')}</div>
                    <div class="am-tb-cat-name">${escapeHtml(cat?.name || 'CPU')}</div>
                </div>
                <div class="am-toolbar-center">
                    <div class="am-search-wrap">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                        <input type="text" id="am-search" class="am-search" placeholder="过滤进程名称或 PID" value="${escapeHtml(data.searchText)}">
                    </div>
                </div>
                <div class="am-toolbar-right">
                    <button class="am-tb-btn" id="am-inspector" title="${data.showInspector ? '隐藏检查器' : '显示检查器'}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                    </button>
                    <button class="am-tb-btn" id="am-refresh" title="立即刷新">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
                    </button>
                </div>
            </div>
        `;
        const search = toolbar.querySelector('#am-search');
        search.addEventListener('input', (e) => {
            data.searchText = e.target.value;
            renderContent();
        });
        toolbar.querySelector('#am-refresh').addEventListener('click', () => {
            randomizeStats();
            renderContent();
            renderSidebarHeroStats();
        });
        toolbar.querySelector('#am-inspector').addEventListener('click', () => {
            data.showInspector = !data.showInspector;
            save();
            render();
        });
    }

    function renderSidebarHeroStats() {
        // Hero live stats injected separately to keep header reactive
    }

    function getFilteredSorted() {
        let list = processes.slice();
        const q = data.searchText.trim().toLowerCase();
        if (q) {
            list = list.filter(p => p.name.toLowerCase().includes(q) || String(p.pid).includes(q));
        }
        const key = data.sortKey;
        const dir = data.sortDir === 'asc' ? 1 : -1;
        list.sort((a, b) => {
            let va = a[key], vb = b[key];
            if (typeof va === 'string') return va.localeCompare(vb) * dir;
            return ((va || 0) - (vb || 0)) * dir;
        });
        return list;
    }

    function columnsForTab() {
        const base = [
            { key: 'name', label: '进程名称', align: 'left', width: 'flex' },
            { key: 'user', label: '用户', align: 'left', width: '110px' },
            { key: 'pid', label: '% PID', align: 'right', width: '70px' }
        ];
        switch (data.currentTab) {
            case 'cpu':
                return [
                    ...base,
                    { key: 'cpu', label: '% CPU', align: 'right', width: '80px' },
                    { key: 'threads', label: '线程数', align: 'right', width: '80px' }
                ];
            case 'memory':
                return [
                    ...base,
                    { key: 'mem', label: '内存', align: 'right', width: '90px' },
                    { key: 'threads', label: '线程数', align: 'right', width: '80px' }
                ];
            case 'energy':
                return [
                    ...base,
                    { key: 'energyImpact', label: '能耗影响', align: 'right', width: '110px' },
                    { key: 'cpu', label: '% CPU', align: 'right', width: '80px' }
                ];
            case 'disk':
                return [
                    ...base,
                    { key: 'diskIn', label: '读入', align: 'right', width: '90px' },
                    { key: 'diskOut', label: '写出', align: 'right', width: '90px' }
                ];
            case 'network':
                return [
                    ...base,
                    { key: 'netIn', label: '接收', align: 'right', width: '90px' },
                    { key: 'netOut', label: '发送', align: 'right', width: '90px' }
                ];
            case 'cache':
                return [
                    ...base,
                    { key: 'mem', label: '内存', align: 'right', width: '90px' },
                    { key: 'cache', label: '缓存', align: 'right', width: '90px' }
                ];
            case 'gpu':
                return [
                    ...base,
                    { key: 'gpu', label: '% GPU', align: 'right', width: '80px' },
                    { key: 'mem', label: '内存', align: 'right', width: '90px' }
                ];
            default:
                return base;
        }
    }

    function cellValue(p, key) {
        switch (key) {
            case 'name': return `<div class="am-proc-name"><span class="am-proc-icon">${procIcon(p.icon)}</span><span>${escapeHtml(p.name.trim())}</span></div>`;
            case 'pid': return `<span class="am-mono">${p.pid}</span>`;
            case 'user': return escapeHtml(p.user);
            case 'cpu': return p.cpu.toFixed(1) + '%';
            case 'mem': return Math.round(p.mem) + ' MB';
            case 'threads': return p.threads;
            case 'energyImpact': return Math.round(p.cpu * 12);
            case 'diskIn': return (Math.random() * 4).toFixed(1) + ' MB/s';
            case 'diskOut': return (Math.random() * 2).toFixed(1) + ' MB/s';
            case 'netIn': return (Math.random() * 1.5).toFixed(2) + ' MB/s';
            case 'netOut': return (Math.random() * 0.8).toFixed(2) + ' MB/s';
            case 'cache': return Math.round(p.mem * 0.18) + ' MB';
            case 'gpu': return (p.cpu * 2.2 + Math.random() * 4).toFixed(1) + '%';
            default: return '';
        }
    }

    function renderStatsPanel() {
        const c = data.currentTab;
        const cpuColor = '#007AFF', memColor = '#34C759', energyColor = '#FF9500';
        const diskColor = '#5856D6', netColor = '#AF52DE', gpuColor = '#FF3B30', cacheColor = '#5AC8FA';

        if (c === 'cpu') {
            return `
                <div class="am-stats-grid am-stats-3">
                    <div class="am-stat-card">
                        <div class="am-stat-label">CPU 使用率</div>
                        <div class="am-stat-value">${stats.cpu.toFixed(1)}<span class="am-unit">%</span></div>
                        <div class="am-stat-spark">${sparkline(history.cpu, cpuColor, 220, 40)}</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">用户</div>
                        <div class="am-stat-value">${stats.cpuUser.toFixed(1)}<span class="am-unit">%</span></div>
                        <div class="am-stat-bar"><div class="am-bar-fill" style="width:${(stats.cpuUser / Math.max(stats.cpu, 1)) * 100}%;background:${cpuColor};"></div></div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">系统</div>
                        <div class="am-stat-value">${stats.cpuSystem.toFixed(1)}<span class="am-unit">%</span></div>
                        <div class="am-stat-bar"><div class="am-bar-fill" style="width:${(stats.cpuSystem / Math.max(stats.cpu, 1)) * 100}%;background:#5AC8FA;"></div></div>
                    </div>
                </div>
            `;
        }
        if (c === 'memory') {
            const pressure = stats.mem < 60 ? '正常' : stats.mem < 80 ? '中' : '高';
            const pColor = stats.mem < 60 ? '#34C759' : stats.mem < 80 ? '#FF9500' : '#FF3B30';
            return `
                <div class="am-stats-grid am-stats-3">
                    <div class="am-stat-card">
                        <div class="am-stat-label">内存压力</div>
                        <div class="am-stat-value" style="color:${pColor};">${stats.mem.toFixed(0)}<span class="am-unit">%</span></div>
                        <div class="am-stat-spark">${sparkline(history.mem, memColor, 220, 40)}</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">已使用</div>
                        <div class="am-stat-value">${stats.memUsed.toFixed(1)}<span class="am-unit"> GB</span></div>
                        <div class="am-stat-sub">物理内存 64 GB</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">已缓存</div>
                        <div class="am-stat-value">${stats.memCached.toFixed(1)}<span class="am-unit"> GB</span></div>
                        <div class="am-stat-sub">内存压力：${pressure}</div>
                    </div>
                </div>
            `;
        }
        if (c === 'energy') {
            return `
                <div class="am-stats-grid am-stats-3">
                    <div class="am-stat-card">
                        <div class="am-stat-label">能耗影响</div>
                        <div class="am-stat-value" style="color:${energyColor};">${stats.energy.toFixed(0)}</div>
                        <div class="am-stat-spark">${sparkline(history.energy, energyColor, 220, 40)}</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">平均能耗</div>
                        <div class="am-stat-value">${stats.energyAvg.toFixed(1)}</div>
                        <div class="am-stat-sub">12小时平均</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">图形卡</div>
                        <div class="am-stat-value" style="font-size:16px;">集成显卡</div>
                        <div class="am-stat-sub">Apple M3 Max GPU</div>
                    </div>
                </div>
            `;
        }
        if (c === 'disk') {
            return `
                <div class="am-stats-grid am-stats-3">
                    <div class="am-stat-card">
                        <div class="am-stat-label">读取速度</div>
                        <div class="am-stat-value" style="color:${diskColor};">${stats.diskRead.toFixed(1)}<span class="am-unit"> MB/s</span></div>
                        <div class="am-stat-spark">${sparkline(history.disk, diskColor, 220, 40)}</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">写入速度</div>
                        <div class="am-stat-value">${stats.diskWrite.toFixed(1)}<span class="am-unit"> MB/s</span></div>
                        <div class="am-stat-bar"><div class="am-bar-fill" style="width:${Math.min(stats.diskWrite / 5 * 100, 100)}%;background:${diskColor};"></div></div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">磁盘已用</div>
                        <div class="am-stat-value">1.2<span class="am-unit"> TB</span></div>
                        <div class="am-stat-sub">共 2 TB · 健康良好</div>
                    </div>
                </div>
            `;
        }
        if (c === 'network') {
            return `
                <div class="am-stats-grid am-stats-3">
                    <div class="am-stat-card">
                        <div class="am-stat-label">接收</div>
                        <div class="am-stat-value" style="color:${netColor};">${stats.netIn.toFixed(2)}<span class="am-unit"> MB/s</span></div>
                        <div class="am-stat-spark">${sparkline(history.net, netColor, 220, 40)}</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">发送</div>
                        <div class="am-stat-value">${stats.netOut.toFixed(2)}<span class="am-unit"> MB/s</span></div>
                        <div class="am-stat-bar"><div class="am-bar-fill" style="width:${Math.min(stats.netOut / 1.2 * 100, 100)}%;background:${netColor};"></div></div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">Wi-Fi</div>
                        <div class="am-stat-value" style="font-size:16px;">已连接</div>
                        <div class="am-stat-sub">HomeNetwork · 1200 Mbps</div>
                    </div>
                </div>
            `;
        }
        if (c === 'cache') {
            return `
                <div class="am-stats-grid am-stats-3">
                    <div class="am-stat-card">
                        <div class="am-stat-label">已缓存文件</div>
                        <div class="am-stat-value" style="color:${cacheColor};">${stats.cache.toFixed(1)}<span class="am-unit"> GB</span></div>
                        <div class="am-stat-spark">${sparkline(history.mem, cacheColor, 220, 40)}</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">交换已用</div>
                        <div class="am-stat-value">0<span class="am-unit"> MB</span></div>
                        <div class="am-stat-sub">无需交换</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">压缩</div>
                        <div class="am-stat-value">2.4<span class="am-unit"> GB</span></div>
                        <div class="am-stat-sub">已压缩内存</div>
                    </div>
                </div>
            `;
        }
        if (c === 'gpu') {
            return `
                <div class="am-stats-grid am-stats-3">
                    <div class="am-stat-card">
                        <div class="am-stat-label">GPU 使用率</div>
                        <div class="am-stat-value" style="color:${gpuColor};">${stats.gpu.toFixed(1)}<span class="am-unit">%</span></div>
                        <div class="am-stat-spark">${sparkline(history.gpu, gpuColor, 220, 40)}</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">图形卡</div>
                        <div class="am-stat-value" style="font-size:16px;">Apple M3 Max</div>
                        <div class="am-stat-sub">40 核 GPU</div>
                    </div>
                    <div class="am-stat-card">
                        <div class="am-stat-label">Metal</div>
                        <div class="am-stat-value" style="font-size:16px;">已支持</div>
                        <div class="am-stat-sub">Metal 3 · 硬件加速</div>
                    </div>
                </div>
            `;
        }
        return '';
    }

    function renderInspector() {
        if (!data.showInspector) return '';
        const sel = processes.find(p => p.pid === data.selectedPid) || processes[0];
        if (!sel) return '';
        const cpuColor = sel.cpu > 30 ? '#FF3B30' : sel.cpu > 10 ? '#FF9500' : '#34C759';
        return `
            <div class="am-inspector">
                <div class="am-insp-header">
                    <div class="am-insp-icon">${procIcon(sel.icon)}</div>
                    <div class="am-insp-title">
                        <div class="am-insp-name">${escapeHtml(sel.name.trim())}</div>
                        <div class="am-insp-sub">PID ${sel.pid} · ${escapeHtml(sel.user)}</div>
                    </div>
                </div>
                <div class="am-insp-row"><span>线程数</span><strong>${sel.threads}</strong></div>
                <div class="am-insp-row"><span>类型</span><strong>${sel.kind === 'system' ? '系统进程' : '用户应用'}</strong></div>
                <div class="am-insp-row"><span>CPU 使用</span><strong style="color:${cpuColor};">${sel.cpu.toFixed(1)}%</strong></div>
                <div class="am-insp-row"><span>内存</span><strong>${Math.round(sel.mem)} MB</strong></div>
                <div class="am-insp-row"><span>架构</span><strong>arm64</strong></div>
                <div class="am-insp-row"><span>响应状态</span><strong style="color:#34C759;">正常</strong></div>
                <div class="am-insp-actions">
                    <button class="am-insp-btn" id="am-sample">取样</button>
                    <button class="am-insp-btn danger" id="am-quit">退出</button>
                </div>
            </div>
        `;
    }

    function renderContent() {
        const cols = columnsForTab();
        const rows = getFilteredSorted();
        const inner = `
            <div class="am-content">
                <div class="am-main">
                    <div class="am-stats-wrap">${renderStatsPanel()}</div>
                    <div class="am-table-wrap">
                        <table class="am-table">
                            <thead>
                                <tr>
                                    ${cols.map(col => `
                                        <th class="am-th ${col.align === 'right' ? 'right' : ''}" data-key="${col.key}" style="${col.width !== 'flex' ? `width:${col.width};` : ''}">
                                            <span>${escapeHtml(col.label)}</span>
                                            ${data.sortKey === col.key ? `<span class="am-sort-arrow">${data.sortDir === 'asc' ? '▲' : '▼'}</span>` : ''}
                                        </th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${rows.length ? rows.map(p => `
                                    <tr class="am-tr ${data.selectedPid === p.pid ? 'selected' : ''}" data-pid="${p.pid}">
                                        ${cols.map(col => `<td class="am-td ${col.align === 'right' ? 'right' : ''}">${cellValue(p, col.key)}</td>`).join('')}
                                    </tr>
                                `).join('') : `<tr><td colspan="${cols.length}" class="am-empty">没有匹配的进程</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </div>
                ${renderInspector()}
            </div>
            <div class="am-footer">
                <span class="am-footer-item"><span class="am-dot cpu"></span> CPU ${stats.cpu.toFixed(1)}%</span>
                <span class="am-footer-item"><span class="am-dot mem"></span> 内存 ${stats.memUsed.toFixed(1)} GB / 64 GB</span>
                <span class="am-footer-item"><span class="am-dot net"></span> 网络 ↓${stats.netIn.toFixed(2)} ↑${stats.netOut.toFixed(2)} MB/s</span>
                <span class="am-footer-item"><span class="am-dot disk"></span> 磁盘 R:${stats.diskRead.toFixed(1)} W:${stats.diskWrite.toFixed(1)} MB/s</span>
                <span class="am-footer-item am-footer-right">${rows.length} 个进程 · ${data.updateFreq}s 刷新</span>
            </div>
        `;
        body.innerHTML = inner;

        body.querySelectorAll('[data-key]').forEach(th => {
            th.addEventListener('click', () => {
                const k = th.dataset.key;
                if (data.sortKey === k) {
                    data.sortDir = data.sortDir === 'asc' ? 'desc' : 'asc';
                } else {
                    data.sortKey = k;
                    data.sortDir = 'desc';
                }
                save();
                renderContent();
            });
        });
        body.querySelectorAll('[data-pid]').forEach(tr => {
            tr.addEventListener('click', () => {
                data.selectedPid = parseInt(tr.dataset.pid, 10);
                save();
                renderContent();
            });
        });
        body.querySelector('#am-sample')?.addEventListener('click', () => showToast(`正在对进程进行取样...`));
        body.querySelector('#am-quit')?.addEventListener('click', () => {
            const p = processes.find(x => x.pid === data.selectedPid);
            if (p) showToast(`已发送退出信号至 ${p.name.trim()}`);
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    function restartTimer() {
        if (updateInterval) clearInterval(updateInterval);
        updateInterval = setInterval(() => {
            randomizeStats();
            renderContent();
        }, data.updateFreq * 1000);
    }

    restartTimer();
    render();

    return () => {
        if (updateInterval) clearInterval(updateInterval);
    };
};
