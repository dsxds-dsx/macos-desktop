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

// Time Machine - 时间机器
window.renderTimeMachine = function(body, sidebar, toolbar, windowId) {
    const backups = [
        { date: Date.now(), type: 'now', label: '现在' },
        { date: Date.now() - 3600000 * 2, type: 'hourly', label: '今天 09:30' },
        { date: Date.now() - 3600000 * 5, type: 'hourly', label: '今天 06:30' },
        { date: Date.now() - 86400000, type: 'daily', label: '昨天 23:58' },
        { date: Date.now() - 86400000 * 2, type: 'daily', label: '7月24日 23:55' },
        { date: Date.now() - 86400000 * 3, type: 'daily', label: '7月23日 23:52' },
        { date: Date.now() - 86400000 * 7, type: 'weekly', label: '7月19日' },
        { date: Date.now() - 86400000 * 14, type: 'weekly', label: '7月12日' },
        { date: Date.now() - 86400000 * 21, type: 'weekly', label: '7月5日' },
        { date: Date.now() - 86400000 * 30, type: 'monthly', label: '6月26日' },
    ];

    let selectedBackup = 0;

    function render() {
        body.innerHTML = `
            <div class="timemachine-container">
                <div class="tm-header">
                    <div class="tm-title">时间机器</div>
                    <div class="tm-status">
                        <span class="tm-status-dot" style="background:#34C759"></span>
                        备份已开启
                    </div>
                </div>
                <div class="tm-main">
                    <div class="tm-visual">
                        ${backups.slice(0, 8).map((b, i) => `
                            <div class="tm-window-layer ${i === selectedBackup ? 'active' : ''}" data-idx="${i}"
                                style="transform: scale(${1 - i * 0.08}) translateY(${i * 15}px); opacity: ${1 - i * 0.1};">
                                <div class="tm-window">
                                    <div class="tm-window-header">
                                        <span class="tm-dots"><span></span><span></span><span></span></span>
                                        <span>${b.label} - 访达</span>
                                    </div>
                                    <div class="tm-window-body">
                                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px;">
                                            ${['📁 文稿', '📁 下载', '📄 报告.pdf', '🖼️ 照片.jpg', '📁 音乐', '📊 表格.xlsx', '📝 笔记.txt', '🎵 歌曲.mp3'].map(n => `
                                                <div style="text-align:center;font-size:10px;padding:4px;">
                                                    <div style="font-size:24px;">${n.split(' ')[0]}</div>
                                                    <div style="font-size:8px;color:#888;">${n.split(' ')[1]}</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="tm-controls">
                        <div class="tm-backup-list">
                            <div class="tm-list-title">备份时间线</div>
                            ${backups.map((b, i) => `
                                <div class="tm-backup-item ${i === selectedBackup ? 'active' : ''}" data-idx="${i}">
                                    <span class="tm-backup-dot" style="background:${b.type === 'now' ? '#FF9500' : b.type === 'hourly' ? '#34C759' : b.type === 'daily' ? '#5AC8FA' : '#AF52DE'}"></span>
                                    <span class="tm-backup-label">${b.label}</span>
                                    <span class="tm-backup-type">${b.type === 'now' ? '当前' : b.type === 'hourly' ? '每小时' : b.type === 'daily' ? '每日' : '每周'}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="tm-actions">
                            <button class="tm-btn tm-btn-restore">恢复</button>
                            <button class="tm-btn tm-btn-secondary">手动备份</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.tm-backup-item').forEach(item => {
            item.addEventListener('click', () => {
                selectedBackup = parseInt(item.dataset.idx);
                render();
            });
        });
    }

    render();
};
