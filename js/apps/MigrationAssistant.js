// Migration Assistant - 迁移助理 (macOS Sonoma)
window.renderMigrationAssistant = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_migration_v2';

    function defaultData() {
        return { step: 0, selectedSource: null, transferProgress: 0, transferItems: null, done: false };
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultData();

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text, type) {
        if (window.toast) window.toast(text, type || 'info');
        else if (window.Toast) window.Toast.show(text);
    }
    function fmtSize(s) {
        if (s >= 1024) return (s / 1024).toFixed(1) + ' GB';
        return s.toFixed(1) + ' MB';
    }

    const steps = ['欢迎', '选择来源', '选择信息', '传输中', '完成'];

    const sources = [
        { id: 1, name: 'MacBook Pro', type: 'Mac', icon: 'mac', info: 'macOS Sonoma 14.2 · 512 GB', distance: '本机' },
        { id: 2, name: 'Time Machine 备份', type: 'Backup', icon: 'backup', info: '外置磁盘 · 2 TB', distance: '已连接' },
        { id: 3, name: 'Windows PC', type: 'Windows', icon: 'windows', info: 'Windows 11 · 用户文件', distance: '同一网络' },
        { id: 4, name: 'iPhone 15 Pro', type: 'iOS', icon: 'ios', info: 'iOS 17.2 · 256 GB', distance: '附近' }
    ];

    function defaultTransferItems() {
        return [
            { id: 'user', name: '用户账户', icon: 'user', size: 45.2, selected: true, desc: '个人文件夹、桌面、文稿' },
            { id: 'apps', name: '应用程序', icon: 'apps', size: 12.8, selected: true, desc: '已安装的应用程序' },
            { id: 'settings', name: '设置', icon: 'settings', size: 0.156, selected: true, desc: '系统偏好设置、网络设置' },
            { id: 'other', name: '其他文件', icon: 'folder', size: 8.3, selected: false, desc: '根目录上的文件和文件夹' }
        ];
    }

    if (!data.transferItems) data.transferItems = defaultTransferItems();
    let transferTimer = null;

    // ----- SVG icons -----
    const ICON = {
        logo: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>',
        rocket: '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
        mac: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
        backup: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 5v6c0 1.66-4 3-9 3s-9-1.34-9-3V5"/><path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"/></svg>',
        windows: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M6 7h6M6 10h4"/></svg>',
        ios: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
        user: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        apps: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
        settings: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        folder: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        check_circle: '<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        hourglass: '<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12M6 22h12M6 22a6 6 0 0 0 6-6 6 6 0 0 0 6 6M6 2a6 6 0 0 0 6 6 6 6 0 0 0 6-6"/></svg>',
        info: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
    };

    function sourceIcon(name) {
        return { mac: ICON.mac, backup: ICON.backup, windows: ICON.windows, ios: ICON.ios }[name] || ICON.mac;
    }

    function render() {
        body.className = 'window-body app-content migration-body';
        body.style.display = 'flex';
        body.style.alignItems = 'center';
        body.style.justifyContent = 'center';
        body.innerHTML = `
            <div class="migration-card">
                <div class="migration-card-header">
                    <div class="migration-logo">
                        <span class="migration-logo-icon">${ICON.logo}</span>
                    </div>
                    <div class="migration-titles">
                        <h1 class="migration-title">迁移助理</h1>
                        <p class="migration-subtitle">将信息从另一台电脑传输到这台 Mac</p>
                    </div>
                </div>
                ${data.step > 0 && data.step < 4 ? `
                    <div class="migration-steps">
                        ${steps.slice(0, 4).map((s, i) => `
                            <div class="migration-step ${i < data.step ? 'done' : i === data.step ? 'current' : ''}">
                                <div class="migration-step-dot">${i < data.step ? ICON.check : `<span>${i + 1}</span>`}</div>
                                ${i < 3 ? `<div class="migration-step-line ${i < data.step ? 'done' : ''}"></div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="migration-card-body" id="ma-body"></div>
                <div class="migration-card-footer">
                    <div class="migration-progress-text">步骤 ${data.step + 1} / 5</div>
                    <div class="migration-footer-actions">
                        ${data.step > 0 && data.step !== 4 ? `<button class="migration-btn secondary" id="ma-back">返回</button>` : ''}
                        ${data.step < 4
                            ? `<button class="migration-btn primary" id="ma-continue" ${(data.step === 1 && !data.selectedSource) ? 'disabled' : ''}>${data.step === 3 ? '开始传输' : '继续'}</button>`
                            : `<button class="migration-btn primary" id="ma-quit">完成</button>`}
                    </div>
                </div>
            </div>
        `;
        const stepBody = body.querySelector('#ma-body');
        if (data.step === 0) renderWelcome(stepBody);
        else if (data.step === 1) renderSource(stepBody);
        else if (data.step === 2) renderItems(stepBody);
        else if (data.step === 3) renderProgress(stepBody);
        else if (data.step === 4) renderDone(stepBody);

        body.querySelector('#ma-back')?.addEventListener('click', () => {
            data.step--;
            if (data.step < 0) data.step = 0;
            if (transferTimer) { clearTimeout(transferTimer); transferTimer = null; }
            if (data.step === 3) data.transferProgress = 0;
            save();
            render();
        });
        body.querySelector('#ma-continue')?.addEventListener('click', () => {
            data.step++;
            if (data.step === 3) data.transferProgress = 0;
            if (data.step > 4) data.step = 4;
            save();
            render();
        });
        body.querySelector('#ma-quit')?.addEventListener('click', () => {
            // Reset to allow re-run
            data = defaultData();
            save();
            if (window.appManager && windowId) {
                try { window.appManager.closeWindow(windowId); } catch {}
            }
        });
    }

    function renderWelcome(el) {
        el.innerHTML = `
            <div class="migration-welcome">
                <div class="migration-welcome-icon">${ICON.rocket}</div>
                <h2 class="migration-welcome-title">欢迎使用迁移助理</h2>
                <p class="migration-welcome-text">您可以从另一台 Mac、Time Machine 备份、Windows PC 或 iOS 设备传输用户账户、应用程序、设置和其他文件。</p>
                <div class="migration-welcome-tips">
                    <h3 class="migration-tips-title">开始之前</h3>
                    <ul class="migration-tips-list">
                        <li>确保您的旧电脑已连接电源</li>
                        <li>如果从另一台 Mac 传输，请确保两台电脑在同一网络上</li>
                        <li>传输过程中请不要关闭任何一台电脑</li>
                    </ul>
                </div>
            </div>
        `;
    }

    function renderSource(el) {
        el.innerHTML = `
            <h2 class="migration-section-title">选择来源</h2>
            <p class="migration-section-desc">选择要从中传输信息的系统、备份或设备</p>
            <div class="migration-sources">
                ${sources.map(s => `
                    <div class="migration-source ${data.selectedSource === s.id ? 'selected' : ''}" data-id="${s.id}">
                        <div class="migration-source-top">
                            <span class="migration-source-icon">${sourceIcon(s.icon)}</span>
                            <div class="migration-source-info">
                                <div class="migration-source-name">${escapeHtml(s.name)}</div>
                                <div class="migration-source-distance">${escapeHtml(s.distance)}</div>
                            </div>
                        </div>
                        <div class="migration-source-meta">${escapeHtml(s.info)}</div>
                    </div>
                `).join('')}
            </div>
        `;
        el.querySelectorAll('.migration-source').forEach(card => {
            card.addEventListener('click', () => {
                data.selectedSource = parseInt(card.dataset.id, 10);
                save();
                render();
            });
        });
    }

    function renderItems(el) {
        const selectedSize = data.transferItems.filter(i => i.selected).reduce((a, i) => a + i.size, 0);
        el.innerHTML = `
            <h2 class="migration-section-title">选择要传输的信息</h2>
            <p class="migration-section-desc">选择要传输到这台 Mac 的项目</p>
            <div class="migration-items">
                ${data.transferItems.map((item, i) => `
                    <div class="migration-item ${item.selected ? 'selected' : ''}" data-i="${i}">
                        <div class="migration-item-check">${item.selected ? ICON.check : ''}</div>
                        <div class="migration-item-icon">${ICON[item.icon] || ICON.folder}</div>
                        <div class="migration-item-info">
                            <div class="migration-item-name">${escapeHtml(item.name)}</div>
                            <div class="migration-item-desc">${escapeHtml(item.desc)}</div>
                        </div>
                        <div class="migration-item-size">${fmtSize(item.size)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="migration-total">
                <span class="migration-total-label">总计大小</span>
                <span class="migration-total-value">${fmtSize(selectedSize)}</span>
            </div>
        `;
        el.querySelectorAll('.migration-item').forEach(card => {
            card.addEventListener('click', () => {
                const i = parseInt(card.dataset.i, 10);
                data.transferItems[i].selected = !data.transferItems[i].selected;
                save();
                renderItems(el);
                // also update footer enable state
                const cont = body.querySelector('#ma-continue');
                if (cont) cont.disabled = !data.transferItems.some(it => it.selected);
            });
        });
    }

    function renderProgress(el) {
        const src = sources.find(s => s.id === data.selectedSource);
        const selected = data.transferItems.filter(i => i.selected);
        const totalSize = selected.reduce((a, i) => a + i.size, 0);
        const isDone = data.transferProgress >= 100;
        const transferredGB = (data.transferProgress / 100) * totalSize;

        // Determine currently transferring item index
        let cumPct = 0;
        let currentItem = null;
        for (const it of selected) {
            const itemPct = (it.size / totalSize) * 100;
            if (data.transferProgress < cumPct + itemPct) {
                currentItem = it;
                break;
            }
            cumPct += itemPct;
        }

        el.innerHTML = `
            <div class="migration-progress">
                <div class="migration-progress-icon ${isDone ? 'done' : ''}">${isDone ? ICON.check_circle : ICON.hourglass}</div>
                <h2 class="migration-progress-title">${isDone ? '传输已准备好完成' : '正在传输信息...'}</h2>
                <p class="migration-progress-text">${isDone
                    ? '信息已成功传输到这台 Mac'
                    : `正在从 ${escapeHtml(src?.name || '来源')} 传输项目，请不要关闭电脑或断开连接`}</p>
                <div class="migration-progress-bar-wrap">
                    <div class="migration-progress-bar"><div class="migration-progress-fill" style="width:${data.transferProgress}%;"></div></div>
                    <div class="migration-progress-meta">
                        <span>${transferredGB.toFixed(1)} GB</span>
                        <span>${Math.floor(data.transferProgress)}%</span>
                        <span>剩余约 ${Math.max(0, Math.ceil((100 - data.transferProgress) * 0.2))} 分钟</span>
                    </div>
                </div>
                <div class="migration-progress-items">
                    ${selected.map(it => {
                        const itemPct = (it.size / totalSize) * 100;
                        const done = data.transferProgress >= cumPct + itemPct;
                        cumPct += itemPct;
                        const inProgress = !done && currentItem === it;
                        return `
                            <div class="migration-progress-item ${done ? 'done' : inProgress ? 'active' : ''}">
                                <span class="migration-progress-item-icon">${done ? ICON.check : inProgress ? '<span class=\"migration-spinner\"></span>' : '<span class=\"migration-pending\"></span>'}</span>
                                <span class="migration-progress-item-name">${escapeHtml(it.name)}</span>
                                <span class="migration-progress-item-size">${fmtSize(it.size)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        if (!isDone && !transferTimer) {
            transferTimer = setTimeout(() => {
                data.transferProgress += Math.random() * 3 + 1;
                if (data.transferProgress > 100) data.transferProgress = 100;
                transferTimer = null;
                save();
                render();
            }, 400);
        }
    }

    function renderDone(el) {
        const selected = data.transferItems.filter(i => i.selected);
        el.innerHTML = `
            <div class="migration-done">
                <div class="migration-done-icon">${ICON.check_circle}</div>
                <h2 class="migration-done-title">迁移完成</h2>
                <p class="migration-done-text">您的信息已成功传输到这台 Mac。若要使传输的设置生效，您需要重新启动电脑。</p>
                <div class="migration-done-summary">
                    <h3 class="migration-done-summary-title">已传输的内容</h3>
                    ${selected.map(it => `
                        <div class="migration-done-row">
                            <span class="migration-done-row-name">${ICON[it.icon] || ICON.folder}${escapeHtml(it.name)}</span>
                            <span class="migration-done-row-check">${ICON.check}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Reset progress if a new run
    render();

    return () => {
        if (transferTimer) clearTimeout(transferTimer);
    };
};
