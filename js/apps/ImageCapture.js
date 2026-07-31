// Image Capture - 图像捕捉 (macOS Sonoma)
window.renderImageCapture = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_imagecapture_v2';

    const devices = [
        { id: 1, name: 'FaceTime 高清摄像头', type: 'camera', connected: true, icon: 'camera' },
        { id: 2, name: 'iPhone 15 Pro', type: 'camera', connected: true, icon: 'phone' },
        { id: 3, name: 'Canon 扫描仪', type: 'scanner', connected: false, icon: 'scanner' },
        { id: 4, name: 'SD 卡', type: 'storage', connected: true, icon: 'card' }
    ];

    const palettes = [
        ['#FF6B6B', '#FFA500', '#FFD93D'],
        ['#4A90E2', '#5DADE2', '#85C1E9'],
        ['#52C41A', '#73D13D', '#95DE64'],
        ['#AF52DE', '#B37FEB', '#D3ADF7'],
        ['#FA541C', '#FF7A45', '#FF9C6E'],
        ['#13C2C2', '#36CFC9', '#5CDBD3'],
        ['#EB2F96', '#F759AB', '#FF85C0'],
        ['#FAAD14', '#FFC53D', '#FFD666'],
        ['#1890FF', '#40A9FF', '#69C0FF'],
        ['#722ED1', '#9254DE', '#B37FEB']
    ];

    function defaultImages() {
        return [
            { id: 1, name: 'IMG_0001.jpg', date: Date.now() - 86400000, size: '2.4 MB', palette: 0, w: 4032, h: 3024 },
            { id: 2, name: 'IMG_0002.jpg', date: Date.now() - 86000000, size: '1.8 MB', palette: 1, w: 4032, h: 3024 },
            { id: 3, name: 'IMG_0003.jpg', date: Date.now() - 85000000, size: '3.1 MB', palette: 4, w: 4032, h: 3024 },
            { id: 4, name: 'IMG_0004.jpg', date: Date.now() - 84000000, size: '2.0 MB', palette: 6, w: 4032, h: 3024 },
            { id: 5, name: 'IMG_0005.jpg', date: Date.now() - 83000000, size: '2.7 MB', palette: 8, w: 4032, h: 3024 }
        ];
    }

    function defaultData() {
        return {
            selectedDeviceId: 1,
            selectedImageId: null,
            importTo: 'pictures',
            deleteAfter: false,
            isCapturing: false
        };
    }

    let images = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultImages();
    let data = JSON.parse(localStorage.getItem(STORAGE_KEY + '_state') || 'null') || defaultData();
    let captureTimer = null;

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
        localStorage.setItem(STORAGE_KEY + '_state', JSON.stringify(data));
    }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text);
    }
    function fmtDate(ts) {
        const d = new Date(ts);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    function deviceIcon(icon) {
        const icons = {
            camera: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
            phone: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
            scanner: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M7 7h10M7 17h6"/></svg>',
            card: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M2 11h20M7 15h4"/></svg>'
        };
        return icons[icon] || icons.camera;
    }

    function selectedDevice() {
        return devices.find(d => d.id === data.selectedDeviceId) || devices[0];
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="ic-sidebar">
                <div class="ic-sidebar-section">
                    <div class="ic-sidebar-label">设备</div>
                    ${devices.map(d => `
                        <div class="ic-device ${d.id === data.selectedDeviceId ? 'active' : ''} ${!d.connected ? 'disabled' : ''}" data-dev="${d.id}">
                            <span class="ic-dev-icon">${deviceIcon(d.icon)}</span>
                            <span class="ic-dev-info">
                                <span class="ic-dev-name">${escapeHtml(d.name)}</span>
                                <span class="ic-dev-type">${d.type === 'camera' ? '相机' : d.type === 'scanner' ? '扫描仪' : '存储设备'}</span>
                            </span>
                            <span class="ic-dev-status ${d.connected ? 'on' : 'off'}"></span>
                        </div>
                    `).join('')}
                </div>
                <div class="ic-sidebar-section">
                    <div class="ic-sidebar-label">导入到</div>
                    <select id="ic-importTo" class="ic-select">
                        <option value="pictures" ${data.importTo === 'pictures' ? 'selected' : ''}>图片</option>
                        <option value="desktop" ${data.importTo === 'desktop' ? 'selected' : ''}>桌面</option>
                        <option value="downloads" ${data.importTo === 'downloads' ? 'selected' : ''}>下载</option>
                    </select>
                </div>
                <div class="ic-sidebar-section">
                    <div class="ic-sidebar-label">下载后</div>
                    <label class="ic-toggle-row">
                        <span class="ic-toggle-text">导入后删除项目</span>
                        <span class="ic-switch ${data.deleteAfter ? 'on' : ''}" id="ic-deleteAfter"></span>
                    </label>
                </div>
                <div class="ic-sidebar-footer">
                    <div class="ic-storage-info">
                        <div class="ic-storage-label">设备存储</div>
                        <div class="ic-storage-bar"><div class="ic-storage-fill" style="width:42%;"></div></div>
                        <div class="ic-storage-text">42% 已使用 · 18.4 GB 可用</div>
                    </div>
                </div>
            </div>
        `;
        sidebar.querySelectorAll('[data-dev]').forEach(el => {
            const dev = devices.find(d => d.id === parseInt(el.dataset.dev, 10));
            if (dev && dev.connected) {
                el.addEventListener('click', () => {
                    data.selectedDeviceId = dev.id;
                    save();
                    render();
                });
            }
        });
        const importTo = sidebar.querySelector('#ic-importTo');
        if (importTo) importTo.addEventListener('change', (e) => {
            data.importTo = e.target.value;
            save();
        });
        const delAfter = sidebar.querySelector('#ic-deleteAfter');
        if (delAfter) delAfter.addEventListener('click', () => {
            data.deleteAfter = !data.deleteAfter;
            save();
            renderSidebar();
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const dev = selectedDevice();
        toolbar.innerHTML = `
            <div class="ic-toolbar">
                <div class="ic-toolbar-left">
                    <span class="ic-tb-dev-name">${escapeHtml(dev.name)}</span>
                    <span class="ic-tb-dev-status ${dev.connected ? 'on' : 'off'}">${dev.connected ? '已连接' : '未连接'}</span>
                </div>
                <div class="ic-toolbar-right">
                    <button class="ic-tb-btn" id="ic-download" title="下载选定项目" ${!data.selectedImageId ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                    <button class="ic-tb-btn" id="ic-importAll" title="全部导入">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M3 7l3-3h12l3 3"/><circle cx="12" cy="13" r="3"/></svg>
                    </button>
                    <button class="ic-tb-btn" id="ic-delete" title="删除选定" ${!data.selectedImageId ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `;
        toolbar.querySelector('#ic-importAll').addEventListener('click', () => {
            const dest = data.importTo === 'desktop' ? '桌面' : data.importTo === 'downloads' ? '下载' : '图片';
            showToast(`已导入 ${images.length} 张图片到“${dest}”文件夹`);
            if (data.deleteAfter) {
                images = [];
                data.selectedImageId = null;
                save();
                render();
            }
        });
        toolbar.querySelector('#ic-download')?.addEventListener('click', () => {
            if (!data.selectedImageId) return;
            const img = images.find(i => i.id === data.selectedImageId);
            if (img) showToast(`正在下载 ${img.name}...`);
        });
        toolbar.querySelector('#ic-delete')?.addEventListener('click', async () => {
            if (!data.selectedImageId) return;
            const img = images.find(i => i.id === data.selectedImageId);
            if (!img) return;
            const ok = await window.showConfirm(`确定要删除“${img.name}”吗？`, {
                subtitle: '此操作无法撤销。',
                confirmText: '删除',
                danger: true
            });
            if (ok) {
                images = images.filter(i => i.id !== data.selectedImageId);
                data.selectedImageId = null;
                save();
                render();
                showToast('项目已删除');
            }
        });
    }

    function renderContent() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        body.innerHTML = `
            <div class="ic-viewfinder">
                <div class="ic-vf-bg" id="ic-vf-bg"></div>
                <div class="ic-vf-overlay">
                    ${data.isCapturing ? `
                        <div class="ic-vf-rec">
                            <span class="ic-rec-dot"></span>
                            <span>捕获中</span>
                        </div>
                    ` : ''}
                    <div class="ic-vf-grid">
                        <div class="ic-vf-line"></div><div class="ic-vf-line"></div>
                        <div class="ic-vf-line v"></div><div class="ic-vf-line v"></div>
                    </div>
                    <div class="ic-vf-info">
                        <div class="ic-vf-info-item">4032 × 3024</div>
                        <div class="ic-vf-info-item">f/1.8 · 1/120s · ISO 100</div>
                    </div>
                    <div class="ic-vf-crosshair">
                        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1" stroke-linecap="round"><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                </div>
                <div class="ic-vf-controls">
                    <button class="ic-shutter ${data.isCapturing ? 'capturing' : ''}" id="ic-shutter"></button>
                </div>
            </div>
            <div class="ic-bar">
                <span class="ic-bar-count">${images.length} 个项目</span>
                <span class="ic-bar-selected">${data.selectedImageId ? '已选择 1 项' : ''}</span>
            </div>
            <div class="ic-grid-wrap">
                <div class="ic-grid" id="ic-grid"></div>
            </div>
        `;
        const bg = body.querySelector('#ic-vf-bg');
        const dev = selectedDevice();
        if (dev.connected) {
            const pal = palettes[Math.floor(Math.random() * palettes.length)];
            bg.style.background = `radial-gradient(circle at 50% 40%, ${pal[2]}, ${pal[0]} 70%, ${pal[1]})`;
        } else {
            bg.style.background = '#2a2a2a';
        }
        const grid = body.querySelector('#ic-grid');
        grid.innerHTML = images.length ? images.map(img => {
            const pal = palettes[img.palette] || palettes[0];
            return `
                <div class="ic-thumb ${data.selectedImageId === img.id ? 'selected' : ''}" data-id="${img.id}">
                    <div class="ic-thumb-img" style="background:linear-gradient(135deg, ${pal[0]}, ${pal[1]}, ${pal[2]});"></div>
                    <div class="ic-thumb-meta">
                        <span class="ic-thumb-name">${escapeHtml(img.name)}</span>
                        <span class="ic-thumb-size">${escapeHtml(img.size)}</span>
                    </div>
                    <div class="ic-thumb-check">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                </div>
            `;
        }).join('') : `<div class="ic-grid-empty">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <div class="ic-grid-empty-text">没有项目，点击快门捕捉图像</div>
        </div>`;
        grid.querySelectorAll('[data-id]').forEach(el => {
            el.addEventListener('click', () => {
                const id = parseInt(el.dataset.id, 10);
                data.selectedImageId = data.selectedImageId === id ? null : id;
                save();
                renderContent();
                renderToolbar();
            });
        });
        body.querySelector('#ic-shutter').addEventListener('click', capture);
    }

    function capture() {
        if (data.isCapturing) return;
        const dev = selectedDevice();
        if (!dev.connected) {
            showToast('设备未连接');
            return;
        }
        data.isCapturing = true;
        renderContent();
        const flash = document.createElement('div');
        flash.className = 'ic-flash';
        body.querySelector('.ic-viewfinder')?.appendChild(flash);
        setTimeout(() => flash.remove(), 400);
        captureTimer = setTimeout(() => {
            data.isCapturing = false;
            const newImg = {
                id: Date.now(),
                name: `IMG_${String(images.length + 1).padStart(4, '0')}.jpg`,
                date: Date.now(),
                size: (1 + Math.random() * 3).toFixed(1) + ' MB',
                palette: Math.floor(Math.random() * palettes.length),
                w: 4032,
                h: 3024
            };
            images.unshift(newImg);
            data.selectedImageId = newImg.id;
            save();
            render();
            showToast(`已捕捉 ${newImg.name}`);
        }, 1200);
    }

    function render() {
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    render();

    return () => {
        if (captureTimer) clearTimeout(captureTimer);
    };
};
