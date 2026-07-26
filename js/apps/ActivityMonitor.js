window.renderActivityMonitor = function(body, sidebar, toolbar, windowId) {
    let currentTab = 'cpu';
    let updateInterval = null;

    const tabs = [
        { id: 'cpu', name: 'CPU' },
        { id: 'memory', name: '内存' },
        { id: 'energy', name: '能耗' },
        { id: 'disk', name: '磁盘' },
        { id: 'network', name: '网络' }
    ];

    const processes = [
        { name: 'Finder', pid: 101, cpu: 2.3, memory: 85, threads: 8, icon: '📁' },
        { name: 'Safari', pid: 205, cpu: 12.5, memory: 420, threads: 24, icon: '🌐' },
        { name: '邮件', pid: 302, cpu: 1.1, memory: 98, threads: 12, icon: '📧' },
        { name: '信息', pid: 305, cpu: 0.8, memory: 65, threads: 10, icon: '💬' },
        { name: '音乐', pid: 401, cpu: 4.2, memory: 156, threads: 16, icon: '🎵' },
        { name: '活动监视器', pid: 501, cpu: 1.5, memory: 72, threads: 6, icon: '📊' },
        { name: 'Terminal', pid: 105, cpu: 0.3, memory: 12, threads: 4, icon: '💻' },
        { name: 'SystemUIServer', pid: 58, cpu: 0.1, memory: 28, threads: 8, icon: '⚙️' },
        { name: 'WindowServer', pid: 45, cpu: 8.2, memory: 195, threads: 14, icon: '🖥️' },
        { name: 'kernel_task', pid: 0, cpu: 3.5, memory: 0, threads: 32, icon: '🔧' }
    ];

    let stats = {
        cpu: 24.5,
        memory: 68,
        energy: 45,
        diskRead: 0,
        diskWrite: 0,
        netIn: 0,
        netOut: 0
    };

    function randomizeStats() {
        stats.cpu = Math.max(5, Math.min(95, stats.cpu + (Math.random() - 0.5) * 10));
        stats.memory = Math.max(40, Math.min(90, stats.memory + (Math.random() - 0.5) * 5));
        stats.energy = Math.max(20, Math.min(80, stats.energy + (Math.random() - 0.5) * 8));
        stats.diskRead = Math.random() * 5;
        stats.diskWrite = Math.random() * 3;
        stats.netIn = Math.random() * 2;
        stats.netOut = Math.random() * 1;
        
        processes.forEach(p => {
            p.cpu = Math.max(0.1, Math.min(50, p.cpu + (Math.random() - 0.5) * 3));
            p.memory = Math.max(10, p.memory + (Math.random() - 0.5) * 20);
        });
    }

    function renderContent() {
        body.innerHTML = `
            <div class="activity-monitor-body">
                <div class="am-tabs">
                    ${tabs.map(tab => `
                        <button class="am-tab ${currentTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">${tab.name}</button>
                    `).join('')}
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
                    ${renderStatsPanel()}
                </div>

                <table class="am-table">
                    <thead>
                        <tr>
                            <th>进程名称</th>
                            <th>PID</th>
                            <th>${getColumnHeader()}</th>
                            <th>线程</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${processes.sort((a, b) => getSortValue(b) - getSortValue(a)).map(p => `
                            <tr>
                                <td>
                                    <div class="am-process">
                                        <span style="font-size:16px;">${p.icon}</span>
                                        <span>${p.name}</span>
                                    </div>
                                </td>
                                <td>${p.pid}</td>
                                <td>${getColumnValue(p)}</td>
                                <td>${p.threads}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        body.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                currentTab = btn.dataset.tab;
                renderContent();
            });
        });
    }

    function getColumnHeader() {
        switch(currentTab) {
            case 'cpu': return 'CPU %';
            case 'memory': return '内存 (MB)';
            case 'energy': return '能耗';
            case 'disk': return '磁盘';
            case 'network': return '网络';
            default: return '%';
        }
    }

    function getSortValue(p) {
        switch(currentTab) {
            case 'cpu': return p.cpu;
            case 'memory': return p.memory;
            case 'energy': return p.cpu * 2;
            case 'disk': return Math.random() * 10;
            case 'network': return Math.random() * 5;
            default: return p.cpu;
        }
    }

    function getColumnValue(p) {
        switch(currentTab) {
            case 'cpu': return p.cpu.toFixed(1) + '%';
            case 'memory': return Math.round(p.memory) + ' MB';
            case 'energy': return Math.round(p.cpu * 10);
            case 'disk': return (Math.random() * 5).toFixed(1) + ' MB/s';
            case 'network': return (Math.random() * 2).toFixed(2) + ' MB/s';
            default: return p.cpu.toFixed(1) + '%';
        }
    }

    function renderStatsPanel() {
        switch(currentTab) {
            case 'cpu':
                return `
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">CPU 使用率</div>
                        <div style="font-size:28px;font-weight:700;">${stats.cpu.toFixed(1)}%</div>
                        <div style="height:6px;background:var(--border-color);border-radius:3px;margin-top:12px;overflow:hidden;">
                            <div style="height:100%;width:${stats.cpu}%;background:var(--accent-blue);border-radius:3px;transition:width 0.5s;"></div>
                        </div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">用户</div>
                        <div style="font-size:28px;font-weight:700;">${(stats.cpu * 0.7).toFixed(1)}%</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">系统</div>
                        <div style="font-size:28px;font-weight:700;">${(stats.cpu * 0.3).toFixed(1)}%</div>
                    </div>
                `;
            case 'memory':
                return `
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">内存压力</div>
                        <div style="font-size:28px;font-weight:700;">${stats.memory.toFixed(1)}%</div>
                        <div style="height:6px;background:var(--border-color);border-radius:3px;margin-top:12px;overflow:hidden;">
                            <div style="height:100%;width:${stats.memory}%;background:var(--accent-green);border-radius:3px;transition:width 0.5s;"></div>
                        </div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">已使用</div>
                        <div style="font-size:28px;font-weight:700;">${(stats.memory * 0.16).toFixed(1)} GB</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">已缓存</div>
                        <div style="font-size:28px;font-weight:700;">2.4 GB</div>
                    </div>
                `;
            case 'energy':
                return `
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">能耗影响</div>
                        <div style="font-size:28px;font-weight:700;">${stats.energy.toFixed(0)}</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">图形卡</div>
                        <div style="font-size:18px;font-weight:600;">集成显卡</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">电池</div>
                        <div style="font-size:28px;font-weight:700;">85%</div>
                        <div style="font-size:12px;color:var(--accent-green);">电源适配器</div>
                    </div>
                `;
            case 'disk':
                return `
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">读取速度</div>
                        <div style="font-size:24px;font-weight:700;">${stats.diskRead.toFixed(1)} MB/s</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">写入速度</div>
                        <div style="font-size:24px;font-weight:700;">${stats.diskWrite.toFixed(1)} MB/s</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">已使用</div>
                        <div style="font-size:24px;font-weight:700;">256 GB</div>
                        <div style="font-size:12px;color:var(--text-tertiary);">共 512 GB</div>
                    </div>
                `;
            case 'network':
                return `
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">接收</div>
                        <div style="font-size:24px;font-weight:700;">${stats.netIn.toFixed(2)} MB/s</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">发送</div>
                        <div style="font-size:24px;font-weight:700;">${stats.netOut.toFixed(2)} MB/s</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:8px;">
                        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">Wi-Fi</div>
                        <div style="font-size:18px;font-weight:600;">已连接</div>
                        <div style="font-size:12px;color:var(--text-tertiary);">Home-WiFi</div>
                    </div>
                `;
            default: return '';
        }
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderContent();
    }

    updateInterval = setInterval(() => {
        randomizeStats();
        renderContent();
    }, 1500);

    render();

    return () => {
        if (updateInterval) clearInterval(updateInterval);
    };
};
