// System Information - 系统信息 (macOS Sonoma)
window.renderSystemInformation = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_sysinfo_v2';

    let currentTab = 'overview';
    const tabs = [
        { id: 'overview', name: '概览', icon: 'overview' },
        { id: 'displays', name: '显示器', icon: 'display' },
        { id: 'storage', name: '存储', icon: 'storage' },
        { id: 'memory', name: '内存', icon: 'memory' },
        { id: 'cpu', name: '处理器', icon: 'cpu' },
        { id: 'network', name: '网络', icon: 'network' },
        { id: 'battery', name: '电源', icon: 'battery' },
        { id: 'software', name: '软件', icon: 'software' }
    ];

    const sysInfo = {
        model: 'MacBook Pro (16英寸, 2024)',
        serial: 'C02XL8XJXXXX',
        macos: 'macOS Sonoma 14.2.1 (23C71)',
        cpu: 'Apple M3 Max',
        cpuCores: '16核 (12性能 + 4能效)',
        gpu: '40核 GPU',
        memory: '64 GB',
        memoryType: 'LPDDR5 统一内存',
        storage: '2 TB',
        storageUsed: 1245,
        storageTotal: 2000,
        startupDisk: 'Macintosh HD',
        serialNumber: 'C02XL8XJLZD',
        hardwareUUID: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
        uptime: '14天3小时42分钟',
        displays: [
            { name: '内置 Liquid Retina XDR', resolution: '3456 × 2234', refresh: '120Hz ProMotion', size: '16.2英寸', main: true },
            { name: 'Studio Display', resolution: '5120 × 2880', refresh: '60Hz', size: '27英寸', main: false }
        ],
        network: {
            wifi: { name: 'Wi-Fi', status: '已连接', ssid: 'HomeNetwork', ip: '192.168.1.100', mac: 'A4:83:E7:9F:2C:1A', speed: '1200 Mbps' },
            ethernet: { name: '以太网', status: '未连接', ip: '-', mac: 'A4:83:E7:9F:2C:1B' },
            bluetooth: { name: '蓝牙', status: '已开启', devices: 3 }
        },
        battery: {
            condition: '正常',
            cycleCount: 127,
            maxCapacity: 98,
            charging: true,
            level: 87,
            timeRemaining: '1小时24分钟至充满'
        },
        software: {
            systemVersion: '14.2.1',
            kernelVersion: 'Darwin 23.2.0',
            bootVolume: 'Macintosh HD',
            bootMode: '正常',
            secureVM: '已启用',
            systemIntegrity: '已启用',
            xprotect: '2024年1月15日'
        }
    };

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text);
    }

    function tabIcon(icon) {
        const icons = {
            overview: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            display: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
            storage: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>',
            memory: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 6V4M11 6V4M15 6V4M19 6V4M7 20v-2M11 20v-2M15 20v-2M19 20v-2"/></svg>',
            cpu: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>',
            network: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>',
            battery: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="10" y1="10" x2="10" y2="14"/><line x1="14" y1="10" x2="14" y2="14"/></svg>',
            software: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'
        };
        return icons[icon] || icons.overview;
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="si-sidebar">
                <div class="si-sidebar-hero">
                    <div class="si-hero-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <div class="si-hero-model">${escapeHtml(sysInfo.model)}</div>
                    <div class="si-hero-os">${escapeHtml(sysInfo.macos.split('(')[0].trim())}</div>
                </div>
                <div class="si-nav">
                    ${tabs.map(t => `
                        <div class="si-nav-item ${currentTab === t.id ? 'active' : ''}" data-tab="${t.id}">
                            <span class="si-nav-icon">${tabIcon(t.icon)}</span>
                            <span class="si-nav-name">${escapeHtml(t.name)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="si-sidebar-footer">
                    <button class="si-support-btn" id="si-support">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <span>支持与服务</span>
                    </button>
                </div>
            </div>
        `;

        sidebar.querySelectorAll('[data-tab]').forEach(el => {
            el.addEventListener('click', () => {
                currentTab = el.dataset.tab;
                render();
            });
        });
        const supportBtn = sidebar.querySelector('#si-support');
        if (supportBtn) supportBtn.addEventListener('click', () => {
            showToast('正在打开 Apple 支持页面...');
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const tab = tabs.find(t => t.id === currentTab);
        toolbar.innerHTML = `
            <div class="si-toolbar">
                <div class="si-toolbar-title">${escapeHtml(tab?.name || '系统信息')}</div>
                <div class="si-toolbar-actions">
                    <button class="si-tb-btn" id="si-refresh" title="刷新">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
                    </button>
                    <button class="si-tb-btn" id="si-export" title="导出">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </button>
                </div>
            </div>
        `;
        toolbar.querySelector('#si-refresh').addEventListener('click', () => {
            showToast('正在刷新系统信息...');
            render();
        });
        toolbar.querySelector('#si-export').addEventListener('click', () => {
            showToast('正在导出系统报告...');
        });
    }

    function renderOverview() {
        return `
            <div class="si-content">
                <div class="si-overview-hero">
                    <div class="si-overview-icon">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <div class="si-overview-info">
                        <h2 class="si-overview-model">${escapeHtml(sysInfo.model)}</h2>
                        <div class="si-overview-os">${escapeHtml(sysInfo.macos)}</div>
                    </div>
                </div>

                <div class="si-info-table">
                    ${[
                        ['芯片', `<strong>${escapeHtml(sysInfo.cpu)}</strong><span class="si-sub">${escapeHtml(sysInfo.cpuCores)}</span><span class="si-sub">${escapeHtml(sysInfo.gpu)}</span>`],
                        ['内存', `<strong>${escapeHtml(sysInfo.memory)}</strong>`],
                        ['启动磁盘', `<strong>${escapeHtml(sysInfo.startupDisk)}</strong>`],
                        ['序列号', `<span class="si-mono">${escapeHtml(sysInfo.serialNumber)}</span>`],
                        ['操作系统', `<strong>${escapeHtml(sysInfo.macos)}</strong>`],
                        ['运行时间', escapeHtml(sysInfo.uptime)]
                    ].map(([label, val]) => `
                        <div class="si-info-row">
                            <div class="si-info-label">${escapeHtml(label)}</div>
                            <div class="si-info-value">${val}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="si-actions">
                    <button class="si-btn-primary" id="si-report">系统报告...</button>
                    <button class="si-btn-secondary" id="si-settings">系统设置...</button>
                </div>
            </div>
        `;
    }

    function renderDisplays() {
        return `
            <div class="si-content">
                <h2 class="si-section-title">图形 / 显示器</h2>
                <div class="si-cards">
                    ${sysInfo.displays.map(d => `
                        <div class="si-card ${d.main ? 'si-card-accent' : ''}">
                            <div class="si-card-header">
                                <div class="si-card-icon">
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                </div>
                                <div class="si-card-title">${escapeHtml(d.name)}${d.main ? '<span class="si-badge">主显示器</span>' : ''}</div>
                            </div>
                            <div class="si-info-table si-info-table-inline">
                                <div class="si-info-row"><div class="si-info-label">分辨率</div><div class="si-info-value">${escapeHtml(d.resolution)}</div></div>
                                <div class="si-info-row"><div class="si-info-label">刷新率</div><div class="si-info-value">${escapeHtml(d.refresh)}</div></div>
                                <div class="si-info-row"><div class="si-info-label">尺寸</div><div class="si-info-value">${escapeHtml(d.size)}</div></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderStorage() {
        const usedPct = (sysInfo.storageUsed / sysInfo.storageTotal) * 100;
        const free = sysInfo.storageTotal - sysInfo.storageUsed;
        const segments = [
            { name: '系统', pct: usedPct * 0.35, color: '#FF9500' },
            { name: '应用', pct: usedPct * 0.25, color: '#5856D6' },
            { name: '文稿', pct: usedPct * 0.20, color: '#34C759' },
            { name: '照片', pct: usedPct * 0.15, color: '#FF3B30' },
            { name: '其他', pct: usedPct * 0.05, color: '#8E8E93' }
        ];
        return `
            <div class="si-content">
                <h2 class="si-section-title">存储</h2>
                <div class="si-card">
                    <div class="si-storage-header">
                        <div class="si-card-icon si-storage-icon">
                            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>
                        </div>
                        <div class="si-storage-info">
                            <div class="si-storage-name">${escapeHtml(sysInfo.startupDisk)}</div>
                            <div class="si-storage-sub">${escapeHtml(sysInfo.storage)} APPLE SSD</div>
                        </div>
                        <div class="si-storage-stat">
                            <div class="si-storage-free"><strong>${free}</strong> <span>GB 可用</span></div>
                            <div class="si-storage-total">共 ${sysInfo.storageTotal} GB</div>
                        </div>
                    </div>
                    <div class="si-storage-bar">
                        ${segments.map(s => `<div class="si-storage-seg" style="width:${s.pct}%;background:${s.color};" title="${escapeHtml(s.name)}"></div>`).join('')}
                    </div>
                    <div class="si-storage-legend">
                        ${segments.map(s => `<span class="si-legend-item"><span class="si-legend-dot" style="background:${s.color};"></span>${escapeHtml(s.name)}</span>`).join('')}
                    </div>
                </div>
                <button class="si-btn-secondary" id="si-manage-storage">管理存储...</button>
            </div>
        `;
    }

    function renderMemory() {
        return `
            <div class="si-content">
                <h2 class="si-section-title">内存</h2>
                <div class="si-card">
                    <div class="si-card-header">
                        <div class="si-card-icon">
                            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 6V4M11 6V4M15 6V4M19 6V4M7 20v-2M11 20v-2M15 20v-2M19 20v-2"/></svg>
                        </div>
                        <div>
                            <div class="si-mem-size">${escapeHtml(sysInfo.memory)}</div>
                            <div class="si-sub">${escapeHtml(sysInfo.memoryType)}</div>
                            <div class="si-mem-pressure"><span class="si-pressure-dot"></span>内存压力：正常</div>
                        </div>
                    </div>
                    <div class="si-progress-block">
                        <div class="si-progress-label"><span>内存使用</span><span>42.3 GB / 64 GB</span></div>
                        <div class="si-progress-bar"><div class="si-progress-fill" style="width:66%;"></div></div>
                    </div>
                    <div class="si-stat-grid">
                        <div class="si-stat"><div class="si-stat-label">已使用</div><div class="si-stat-value">42.3 GB</div></div>
                        <div class="si-stat"><div class="si-stat-label">已缓存</div><div class="si-stat-value">18.7 GB</div></div>
                        <div class="si-stat"><div class="si-stat-label">交换已用</div><div class="si-stat-value">0 MB</div></div>
                        <div class="si-stat"><div class="si-stat-label">内存带宽</div><div class="si-stat-value">400 GB/s</div></div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderCPU() {
        const cores = Array.from({ length: 16 }, (_, i) => {
            const usage = 5 + Math.floor(Math.random() * 60);
            return { idx: i + 1, usage, color: usage > 80 ? '#FF3B30' : usage > 50 ? '#FF9500' : '#34C759' };
        });
        return `
            <div class="si-content">
                <h2 class="si-section-title">处理器</h2>
                <div class="si-card">
                    <div class="si-card-header">
                        <div class="si-card-icon">
                            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>
                        </div>
                        <div>
                            <div class="si-mem-size">${escapeHtml(sysInfo.cpu)}</div>
                            <div class="si-sub">${escapeHtml(sysInfo.cpuCores)}</div>
                            <div class="si-sub">${escapeHtml(sysInfo.gpu)}</div>
                            <div class="si-sub">3纳米工艺</div>
                        </div>
                    </div>
                    <div class="si-cpu-cores">
                        ${cores.map(c => `
                            <div class="si-core">
                                <div class="si-core-num">${c.idx}</div>
                                <div class="si-core-bar"><div class="si-core-fill" style="height:${c.usage}%;background:${c.color};"></div></div>
                                <div class="si-core-pct">${c.usage}%</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="si-stat-grid si-stat-grid-3">
                        <div class="si-stat"><div class="si-stat-label">当前使用率</div><div class="si-stat-value">${(15 + Math.random() * 30).toFixed(1)}%</div></div>
                        <div class="si-stat"><div class="si-stat-label">空闲</div><div class="si-stat-value">${(60 + Math.random() * 20).toFixed(1)}%</div></div>
                        <div class="si-stat"><div class="si-stat-label">进程数</div><div class="si-stat-value">342</div></div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderNetwork() {
        const nets = Object.values(sysInfo.network);
        return `
            <div class="si-content">
                <h2 class="si-section-title">网络</h2>
                <div class="si-cards">
                    ${nets.map(net => {
                        const connected = net.status === '已连接' || net.status === '已开启';
                        const iconSvg = net.name === 'Wi-Fi'
                            ? '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>'
                            : net.name === '以太网'
                            ? '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="20" height="6" rx="1"/><path d="M7 9V6M12 9V6M17 9V6"/></svg>'
                            : '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5h11v11h-11z" opacity="0"/><path d="M7 7l10 10M17 7L7 17"/></svg>';
                        return `
                            <div class="si-card ${connected ? 'si-card-connected' : ''}">
                                <div class="si-card-header">
                                    <div class="si-card-icon">${iconSvg}</div>
                                    <div>
                                        <div class="si-card-title">${escapeHtml(net.name)}</div>
                                        <div class="si-net-status ${connected ? 'on' : 'off'}">${escapeHtml(net.status)}</div>
                                    </div>
                                </div>
                                <div class="si-info-table si-info-table-inline">
                                    ${net.ssid ? `<div class="si-info-row"><div class="si-info-label">网络名称</div><div class="si-info-value">${escapeHtml(net.ssid)}</div></div>` : ''}
                                    ${net.ip ? `<div class="si-info-row"><div class="si-info-label">IP 地址</div><div class="si-info-value si-mono">${escapeHtml(net.ip)}</div></div>` : ''}
                                    ${net.mac ? `<div class="si-info-row"><div class="si-info-label">MAC 地址</div><div class="si-info-value si-mono">${escapeHtml(net.mac)}</div></div>` : ''}
                                    ${net.speed ? `<div class="si-info-row"><div class="si-info-label">传输速率</div><div class="si-info-value">${escapeHtml(net.speed)}</div></div>` : ''}
                                    ${net.devices != null ? `<div class="si-info-row"><div class="si-info-label">已连接设备</div><div class="si-info-value">${net.devices} 个</div></div>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderBattery() {
        const b = sysInfo.battery;
        return `
            <div class="si-content">
                <h2 class="si-section-title">电源</h2>
                <div class="si-card">
                    <div class="si-battery-hero">
                        <div class="si-battery-icon ${b.charging ? 'charging' : ''}">
                            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="10" y1="10" x2="10" y2="14"/><line x1="14" y1="10" x2="14" y2="14"/></svg>
                        </div>
                        <div class="si-battery-main">
                            <div class="si-battery-bar-wrap">
                                <div class="si-battery-bar"><div class="si-battery-fill" style="width:${b.level}%;"></div></div>
                                <div class="si-battery-pct">${b.level}%</div>
                            </div>
                            <div class="si-battery-status ${b.charging ? 'charging' : ''}">
                                ${b.charging
                                    ? `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> 电源适配器已连接 · ${escapeHtml(b.timeRemaining)}`
                                    : `使用电池 · ${escapeHtml(b.timeRemaining)}`}
                            </div>
                        </div>
                    </div>
                    <div class="si-stat-grid">
                        <div class="si-stat">
                            <div class="si-stat-label">电池健康</div>
                            <div class="si-stat-value si-stat-${b.maxCapacity > 80 ? 'good' : 'warn'}">${escapeHtml(b.condition)}</div>
                            <div class="si-stat-sub">最大容量：${b.maxCapacity}%</div>
                        </div>
                        <div class="si-stat">
                            <div class="si-stat-label">循环计数</div>
                            <div class="si-stat-value">${b.cycleCount}</div>
                            <div class="si-stat-sub">设计容量：1000 次</div>
                        </div>
                        <div class="si-stat">
                            <div class="si-stat-label">充满电容量</div>
                            <div class="si-stat-value">95.8 Wh</div>
                        </div>
                        <div class="si-stat">
                            <div class="si-stat-label">电压</div>
                            <div class="si-stat-value">12.86 V</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderSoftware() {
        const rows = [
            ['系统版本', sysInfo.software.systemVersion],
            ['macOS 名称', 'Sonoma'],
            ['内核版本', sysInfo.software.kernelVersion],
            ['启动宗卷', sysInfo.software.bootVolume],
            ['启动模式', sysInfo.software.bootMode],
            ['安全虚拟机', sysInfo.software.secureVM],
            ['系统完整性保护', sysInfo.software.systemIntegrity],
            ['XProtect 版本', sysInfo.software.xprotect],
            ['开机时间', sysInfo.uptime]
        ];
        return `
            <div class="si-content">
                <h2 class="si-section-title">软件</h2>
                <div class="si-info-table">
                    ${rows.map(([label, val]) => `
                        <div class="si-info-row">
                            <div class="si-info-label">${escapeHtml(label)}</div>
                            <div class="si-info-value">${escapeHtml(val)}</div>
                        </div>
                    `).join('')}
                    <div class="si-info-row">
                        <div class="si-info-label">硬件 UUID</div>
                        <div class="si-info-value si-mono">${escapeHtml(sysInfo.hardwareUUID)}</div>
                    </div>
                </div>
                <div class="si-actions">
                    <button class="si-btn-primary" id="si-update">软件更新...</button>
                    <button class="si-btn-secondary" id="si-legal">法律声明</button>
                </div>
            </div>
        `;
    }

    function renderContent() {
        let html = '';
        if (currentTab === 'overview') html = renderOverview();
        else if (currentTab === 'displays') html = renderDisplays();
        else if (currentTab === 'storage') html = renderStorage();
        else if (currentTab === 'memory') html = renderMemory();
        else if (currentTab === 'cpu') html = renderCPU();
        else if (currentTab === 'network') html = renderNetwork();
        else if (currentTab === 'battery') html = renderBattery();
        else if (currentTab === 'software') html = renderSoftware();
        body.innerHTML = html;

        body.querySelector('#si-report')?.addEventListener('click', () => showToast('正在生成系统报告...'));
        body.querySelector('#si-settings')?.addEventListener('click', () => {
            if (window.appManager) { try { window.appManager.openApp('Settings'); } catch {} }
        });
        body.querySelector('#si-manage-storage')?.addEventListener('click', () => showToast('正在打开存储管理...'));
        body.querySelector('#si-update')?.addEventListener('click', () => showToast('正在检查软件更新...'));
        body.querySelector('#si-legal')?.addEventListener('click', () => showToast('法律声明文档已打开'));
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    render();
};
