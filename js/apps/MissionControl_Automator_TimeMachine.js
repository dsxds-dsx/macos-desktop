// Mission Control - 调度中心
window.renderMissionControl = function(body, sidebar, toolbar, windowId) {
    const desktops = [
        { id: 1, name: '桌面 1', apps: ['Finder', 'Safari', '邮件', '备忘录'], wallpaper: 'linear-gradient(135deg, #667eea, #764ba2)' },
        { id: 2, name: '桌面 2', apps: ['Xcode', '终端'], wallpaper: 'linear-gradient(135deg, #f093fb, #f5576c)' },
        { id: 3, name: '桌面 3', apps: ['Photoshop', 'Figma', '预览'], wallpaper: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    ];

    let selectedDesktop = 1;

    function render() {
        body.innerHTML = `
            <div class="missioncontrol-container">
                <div class="mc-top">
                    <div class="mc-desktops">
                        ${desktops.map(d => `
                            <div class="mc-desktop ${d.id === selectedDesktop ? 'active' : ''}" data-id="${d.id}">
                                <div class="mc-desktop-preview" style="background:${d.wallpaper}">
                                    <div class="mc-desktop-apps">
                                        ${d.apps.map(a => `<div class="mc-desktop-app">${a.charAt(0)}</div>`).join('')}
                                    </div>
                                </div>
                                <div class="mc-desktop-name">${d.name}</div>
                            </div>
                        `).join('')}
                        <div class="mc-desktop mc-add" id="mc-add">
                            <div class="mc-desktop-preview mc-add-preview">
                                <div style="font-size:40px;color:#8E8E93;">+</div>
                            </div>
                            <div class="mc-desktop-name">添加桌面</div>
                        </div>
                    </div>
                </div>
                <div class="mc-bottom">
                    <div class="mc-section-title">所有窗口</div>
                    <div class="mc-windows">
                        ${generateWindows()}
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.mc-desktop[data-id]').forEach(d => {
            d.addEventListener('click', () => {
                selectedDesktop = parseInt(d.dataset.id);
                render();
            });
        });

        body.querySelector('#mc-add').addEventListener('click', () => {
            const id = desktops.length + 1;
            const gradients = [
                'linear-gradient(135deg, #fa709a, #fee140)',
                'linear-gradient(135deg, #a8edea, #fed6e3)',
                'linear-gradient(135deg, #d299c2, #fef9d7)',
                'linear-gradient(135deg, #89f7fe, #66a6ff)',
            ];
            desktops.push({
                id,
                name: `桌面 ${id}`,
                apps: [],
                wallpaper: gradients[(id - 1) % gradients.length]
            });
            selectedDesktop = id;
            render();
        });
    }

    function generateWindows() {
        const windows = [
            { app: 'Safari', title: 'Apple - macOS', color: '#007AFF', size: 'large' },
            { app: '邮件', title: '收件箱 (23)', color: '#34C759', size: 'medium' },
            { app: '备忘录', title: '工作笔记', color: '#FFCC00', size: 'small' },
            { app: '设置', title: '系统设置', color: '#8E8E93', size: 'medium' },
            { app: '终端', title: '~ bash', color: '#1D1D1F', size: 'large' },
            { app: '访达', title: '文稿', color: '#5AC8FA', size: 'large' },
            { app: '音乐', title: '正在播放', color: '#FF3B30', size: 'medium' },
            { app: '信息', title: '小明', color: '#34C759', size: 'small' },
        ];
        return windows.map(w => `
            <div class="mc-window mc-window-${w.size}">
                <div class="mc-window-header" style="background:${w.color}">
                    <div class="mc-window-dots">
                        <span style="background:#FF5F57"></span>
                        <span style="background:#FFBD2E"></span>
                        <span style="background:#28C840"></span>
                    </div>
                    <div class="mc-window-title">${w.title}</div>
                </div>
                <div class="mc-window-body">
                    <div style="font-size:24px;margin-bottom:8px;">${w.app.charAt(0)}</div>
                    <div style="font-size:10px;color:#8E8E93;">${w.app}</div>
                </div>
            </div>
        `).join('');
    }

    render();
};

// Automator - 自动操作
window.renderAutomator = function(body, sidebar, toolbar, windowId) {
    const workflows = [
        { id: 1, name: '批量重命名文件', type: '工作流程', icon: '📁', actions: 5 },
        { id: 2, name: '调整图片大小', type: '快速操作', icon: '🖼️', actions: 3 },
        { id: 3, name: '邮件存档', type: '日历提醒', icon: '📧', actions: 8 },
        { id: 4, name: 'PDF 合并', type: '工作流程', icon: '📄', actions: 4 },
        { id: 5, name: '网页截图', type: '快速操作', icon: '📸', actions: 2 },
        { id: 6, name: '备份到外部磁盘', type: '文件夹操作', icon: '💾', actions: 6 },
    ];

    const actions = [
        { name: '获取指定 Finder 项目', icon: '📁', cat: 'Finder' },
        { name: '重命名 Finder 项目', icon: '✏️', cat: 'Finder' },
        { name: '拷贝 Finder 项目', icon: '📋', cat: 'Finder' },
        { name: '新建文件夹', icon: '📂', cat: 'Finder' },
        { name: '运行 AppleScript', icon: '📜', cat: '实用工具' },
        { name: '运行 Shell 脚本', icon: '💻', cat: '实用工具' },
        { name: '显示通知', icon: '🔔', cat: '实用工具' },
        { name: '显示提醒', icon: '⏰', cat: '日历' },
        { name: '发送邮件', icon: '📧', cat: '邮件' },
        { name: '文本替换', icon: '🔤', cat: '文本' },
        { name: '合并 PDF 文件', icon: '📄', cat: 'PDF' },
        { name: '添加音乐到播放列表', icon: '🎵', cat: '音乐' },
    ];

    let selectedWorkflow = null;
    let activeTab = 'library';

    function render() {
        body.innerHTML = `
            <div class="automator-container">
                <div class="automator-sidebar">
                    <div class="automator-sidebar-header">
                        <div class="automator-title">自动操作</div>
                    </div>
                    <div class="automator-workflows">
                        <div class="automator-section-title">我的工作流程</div>
                        ${workflows.map(w => `
                            <div class="automator-workflow ${selectedWorkflow === w.id ? 'active' : ''}" data-id="${w.id}">
                                <span class="automator-wf-icon">${w.icon}</span>
                                <div class="automator-wf-info">
                                    <div class="automator-wf-name">${w.name}</div>
                                    <div class="automator-wf-type">${w.type} · ${w.actions} 个操作</div>
                                </div>
                            </div>
                        `).join('')}
                        <button class="automator-new-btn">+ 新建工作流程</button>
                    </div>
                </div>
                <div class="automator-main">
                    <div class="automator-toolbar">
                        <div class="automator-tabs">
                            <div class="automator-tab ${activeTab === 'library' ? 'active' : ''}" data-tab="library">动作库</div>
                            <div class="automator-tab ${activeTab === 'log' ? 'active' : ''}" data-tab="log">日志</div>
                        </div>
                        <button class="automator-run-btn">▶ 运行</button>
                    </div>
                    <div class="automator-content">
                        <div class="automator-actions-grid">
                            ${actions.map(a => `
                                <div class="automator-action">
                                    <div class="automator-action-icon">${a.icon}</div>
                                    <div class="automator-action-name">${a.name}</div>
                                    <div class="automator-action-cat">${a.cat}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.automator-workflow').forEach(w => {
            w.addEventListener('click', () => {
                selectedWorkflow = parseInt(w.dataset.id);
                render();
            });
        });

        body.querySelectorAll('.automator-tab').forEach(t => {
            t.addEventListener('click', () => {
                activeTab = t.dataset.tab;
                render();
            });
        });
    }

    render();
};

// Time Machine - 时间机器 (macOS Sonoma)
window.renderTimeMachine = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_timemachine_v2';

    function defaultData() {
        const now = Date.now();
        return {
            backups: [
                { date: now, type: 'now', label: '现在', size: '当前', files: 1284032 },
                { date: now - 3600000 * 2, type: 'hourly', label: '今天 09:30', size: '2.3 GB', files: 1283990 },
                { date: now - 3600000 * 5, type: 'hourly', label: '今天 06:30', size: '1.8 GB', files: 1283950 },
                { date: now - 86400000, type: 'daily', label: '昨天 23:58', size: '4.1 GB', files: 1283800 },
                { date: now - 86400000 * 2, type: 'daily', label: '7月27日 23:55', size: '3.7 GB', files: 1283500 },
                { date: now - 86400000 * 3, type: 'daily', label: '7月26日 23:52', size: '5.2 GB', files: 1283200 },
                { date: now - 86400000 * 7, type: 'weekly', label: '7月22日', size: '12.4 GB', files: 1280000 },
                { date: now - 86400000 * 14, type: 'weekly', label: '7月15日', size: '11.8 GB', files: 1275000 },
                { date: now - 86400000 * 21, type: 'weekly', label: '7月8日', size: '10.9 GB', files: 1270000 },
                { date: now - 86400000 * 30, type: 'monthly', label: '6月29日', size: '45.2 GB', files: 1250000 }
            ],
            selectedIndex: 0,
            disk: {
                name: 'MacBook Pro 备份',
                total: 1024,
                used: 678,
                oldest: '2023年8月15日'
            }
        };
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultData();

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text);
    }
    function typeColor(t) {
        return { now: '#FF9500', hourly: '#34C759', daily: '#5AC8FA', weekly: '#AF52DE', monthly: '#FF3B30' }[t] || '#8E8E93';
    }
    function typeLabel(t) {
        return { now: '当前', hourly: '每小时', daily: '每日', weekly: '每周', monthly: '每月' }[t] || '';
    }

    function generateStars() {
        let stars = '';
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 2 + 0.5;
            const delay = Math.random() * 4;
            const dur = Math.random() * 3 + 2;
            stars += `<div class="tm-star" style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;animation-delay:${delay}s;animation-duration:${dur}s"></div>`;
        }
        return stars;
    }

    function generateFinderIcons() {
        const items = [
            { icon: '📁', name: '文稿' },
            { icon: '📁', name: '下载' },
            { icon: '📄', name: '报告.pdf' },
            { icon: '🖼️', name: '照片.jpg' },
            { icon: '📁', name: '音乐' },
            { icon: '📊', name: '表格.xlsx' },
            { icon: '📝', name: '笔记.txt' },
            { icon: '🎵', name: '歌曲.mp3' },
            { icon: '📁', name: '桌面' },
            { icon: '🎬', name: '视频.mov' },
            { icon: '💎', name: '项目' },
            { icon: '📦', name: '归档' }
        ];
        return items.map(it => `
            <div class="tm-finder-item">
                <div class="tm-finder-icon">${it.icon}</div>
                <div class="tm-finder-name">${escapeHtml(it.name)}</div>
            </div>
        `).join('');
    }

    function render() {
        const backup = data.backups[data.selectedIndex];
        const usedPct = Math.round(data.disk.used / data.disk.total * 100);

        body.innerHTML = `
            <div class="tm-app">
                <div class="tm-stars">${generateStars()}</div>
                <div class="tm-nebula"></div>

                <div class="tm-header">
                    <div class="tm-header-left">
                        <div class="tm-back" id="tm-back" ${data.selectedIndex === 0 ? 'disabled' : ''}>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        </div>
                        <div class="tm-forward" id="tm-forward" ${data.selectedIndex >= data.backups.length - 1 ? 'disabled' : ''}>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                    </div>
                    <div class="tm-header-center">
                        <div class="tm-time-icon">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </div>
                        <div class="tm-date-label">${escapeHtml(backup.label)}</div>
                        <div class="tm-type-badge" style="background:${typeColor(backup.type)}">${typeLabel(backup.type)}</div>
                    </div>
                    <div class="tm-header-right">
                        <div class="tm-status-pill">
                            <span class="tm-status-dot"></span>
                            <span>备份已开启</span>
                        </div>
                    </div>
                </div>

                <div class="tm-stage" id="tm-stage">
                    <div class="tm-tunnel">
                        ${data.backups.slice(data.selectedIndex, data.selectedIndex + 6).map((b, i) => {
                            const scale = 1 - i * 0.09;
                            const ty = i * 20;
                            const opacity = 1 - i * 0.13;
                            const blur = i * 0.6;
                            return `
                                <div class="tm-window-layer ${i === 0 ? 'active' : ''}" data-idx="${data.selectedIndex + i}"
                                    style="transform: scale(${scale}) translateY(${ty}px); opacity: ${opacity}; filter: blur(${blur}px)">
                                    <div class="tm-window">
                                        <div class="tm-window-titlebar">
                                            <div class="tm-traffic">
                                                <span class="tm-tf close"></span>
                                                <span class="tm-tf min"></span>
                                                <span class="tm-tf max"></span>
                                            </div>
                                            <div class="tm-window-title">${escapeHtml(b.label)} — 访达</div>
                                            <div class="tm-window-sidebar-toggle">
                                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                                            </div>
                                        </div>
                                        <div class="tm-window-content">
                                            <div class="tm-finder-toolbar">
                                                <div class="tm-finder-nav">
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                                                </div>
                                                <div class="tm-finder-path">${i === 0 ? '文稿' : '文稿 (备份)'}</div>
                                            </div>
                                            <div class="tm-finder-grid">
                                                ${generateFinderIcons()}
                                            </div>
                                            <div class="tm-finder-status">${b.files.toLocaleString()} 个项目 · ${escapeHtml(b.size)}</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="tm-footer">
                    <div class="tm-disk-info">
                        <div class="tm-disk-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>
                        </div>
                        <div class="tm-disk-body">
                            <div class="tm-disk-name">${escapeHtml(data.disk.name)}</div>
                            <div class="tm-disk-bar">
                                <div class="tm-disk-fill" style="width:${usedPct}%"></div>
                            </div>
                            <div class="tm-disk-meta">${data.disk.used} GB 已用 / ${data.disk.total} GB · 最早备份 ${escapeHtml(data.disk.oldest)}</div>
                        </div>
                    </div>
                    <div class="tm-actions">
                        <button class="tm-btn-secondary" id="tm-backup-now">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
                            <span>立即备份</span>
                        </button>
                        <button class="tm-btn-restore" id="tm-restore" ${data.selectedIndex === 0 ? 'disabled' : ''}>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                            <span>恢复</span>
                        </button>
                    </div>
                </div>

                <div class="tm-timeline-rail" id="tm-timeline">
                    ${data.backups.map((b, i) => `
                        <div class="tm-tl-tick ${i === data.selectedIndex ? 'active' : ''} ${i > data.selectedIndex ? 'future' : ''}" data-idx="${i}">
                            <div class="tm-tl-dot" style="background:${typeColor(b.type)}"></div>
                            <div class="tm-tl-label">${escapeHtml(b.label)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        bind();
    }

    function bind() {
        const back = body.querySelector('#tm-back');
        if (back) back.addEventListener('click', () => {
            if (data.selectedIndex > 0) { data.selectedIndex--; save(); render(); }
        });
        const fwd = body.querySelector('#tm-forward');
        if (fwd) fwd.addEventListener('click', () => {
            if (data.selectedIndex < data.backups.length - 1) { data.selectedIndex++; save(); render(); }
        });
        const restore = body.querySelector('#tm-restore');
        if (restore) restore.addEventListener('click', () => {
            if (data.selectedIndex === 0) return;
            const b = data.backups[data.selectedIndex];
            showToast(`正在从「${b.label}」恢复文件...`);
        });
        const backupNow = body.querySelector('#tm-backup-now');
        if (backupNow) backupNow.addEventListener('click', () => {
            showToast('正在创建新备份...');
            setTimeout(() => {
                const newBackup = { date: Date.now(), type: 'now', label: '现在', size: '当前', files: data.backups[0].files + 10 };
                data.backups.forEach(b => {
                    if (b.type === 'now') { b.type = 'hourly'; b.label = '今天 ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0'); b.size = '0.5 GB'; }
                });
                data.backups.unshift(newBackup);
                data.selectedIndex = 0;
                save();
                render();
                showToast('备份完成');
            }, 1500);
        });
        body.querySelectorAll('.tm-tl-tick').forEach(tick => {
            tick.addEventListener('click', () => {
                data.selectedIndex = parseInt(tick.dataset.idx);
                save();
                render();
            });
        });
        body.querySelectorAll('.tm-window-layer').forEach(layer => {
            layer.addEventListener('click', () => {
                const idx = parseInt(layer.dataset.idx);
                if (idx > data.selectedIndex) { data.selectedIndex = idx; save(); render(); }
            });
        });

        // Keyboard navigation
        body.tabIndex = 0;
        body.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); if (data.selectedIndex > 0) { data.selectedIndex--; save(); render(); } }
            else if (e.key === 'ArrowRight') { e.preventDefault(); if (data.selectedIndex < data.backups.length - 1) { data.selectedIndex++; save(); render(); } }
        });
    }

    render();
};
