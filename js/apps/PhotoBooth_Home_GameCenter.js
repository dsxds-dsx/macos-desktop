// Photo Booth - 拍照应用 (macOS Sonoma)
window.renderPhotoBooth = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_photobooth_v2';

    const EFFECTS = [
        { id: 'none', name: '原图', css: 'none', gradient: 'linear-gradient(135deg, #4a4a4a, #2a2a2a)', emoji: '📷' },
        { id: 'comic', name: '漫画效果', css: 'contrast(1.8) saturate(1.5) brightness(1.1)', gradient: 'linear-gradient(135deg, #FF6B6B, #FFD93D)', emoji: '💬' },
        { id: 'tunnel', name: '光隧道', css: 'blur(2px) brightness(1.3) saturate(1.8) hue-rotate(180deg)', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', emoji: '🌀' },
        { id: 'squeeze', name: '挤压', css: 'saturate(2) contrast(1.4)', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', emoji: '🤏' },
        { id: 'mirror', name: '镜像', css: 'hue-rotate(90deg) saturate(1.6)', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', emoji: '🪞' },
        { id: 'kaleidoscope', name: '万花筒', css: 'hue-rotate(45deg) saturate(2) contrast(1.5) brightness(1.1)', gradient: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)', emoji: '🔮' },
        { id: 'thermal', name: '热感应', css: 'sepia(1) hue-rotate(180deg) saturate(3) brightness(1.2)', gradient: 'linear-gradient(135deg, #ff0844, #ffb199)', emoji: '🌡️' },
        { id: 'xray', name: 'X光', css: 'invert(1) grayscale(0.8) contrast(1.6) brightness(1.1)', gradient: 'linear-gradient(135deg, #e0e0e0, #2a2a2a)', emoji: '☢️' },
        { id: 'mono', name: '单色', css: 'grayscale(1) contrast(1.2)', gradient: 'linear-gradient(135deg, #666, #ccc)', emoji: '⚫' },
        { id: 'vintage', name: '复古', css: 'sepia(0.6) contrast(1.1) brightness(0.95) saturate(1.2)', gradient: 'linear-gradient(135deg, #d4a574, #8b6f47)', emoji: '📷' },
        { id: 'dreamy', name: '梦境', css: 'blur(0.5px) brightness(1.15) saturate(1.3) contrast(0.95)', gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)', emoji: '✨' },
        { id: 'neon', name: '霓虹', css: 'contrast(1.6) saturate(2.5) brightness(1.2) hue-rotate(280deg)', gradient: 'linear-gradient(135deg, #ff00ff, #00ffff)', emoji: '🌈' }
    ];

    const BG_COLORS = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55', '#5856D6', '#00C7BE'];
    const BG_EMOJIS = ['😊', '😎', '🤩', '😄', '🥰', '😜', '🤗', '😋', '🤓', '😇'];

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || {
        photos: [],
        effectIndex: 0,
        cameraOn: true,
        mirror: true
    };

    let isCounting = false;
    let viewingPhoto = null;

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

    function escapeHtml(s) { return s == null ? '' : String(s); }

    function showToast(text, type = 'success') {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text, type);
    }

    function getEffect() { return EFFECTS[data.effectIndex]; }

    function render() {
        const effect = getEffect();
        body.innerHTML = `
            <div class="pb-app">
                <div class="pb-stage" id="pb-stage">
                    <div class="pb-viewfinder ${data.cameraOn ? '' : 'off'}" style="filter: ${effect.css}; ${data.mirror ? 'transform: scaleX(-1);' : ''}">
                        <div class="pb-vf-bg" style="background: ${effect.gradient}"></div>
                        <div class="pb-vf-face">${effect.emoji}</div>
                        <div class="pb-vf-label">Photo Booth</div>
                        <div class="pb-vf-effect-name">${effect.name}</div>
                    </div>
                    <div class="pb-vignette"></div>
                    <div class="pb-flash" id="pb-flash"></div>
                    ${isCounting ? `<div class="pb-countdown" id="pb-countdown">3</div>` : ''}
                    ${!data.cameraOn ? '<div class="pb-paused-overlay"><div class="pb-paused-icon">⏸</div><div class="pb-paused-text">相机已暂停</div></div>' : ''}
                    <div class="pb-top-bar">
                        <div class="pb-top-left">
                            <button class="pb-top-btn" id="pb-mirror" title="${data.mirror ? '关闭镜像' : '开启镜像'}">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 8l-3 4 3 4M19 8l3 4-3 4"/></svg>
                            </button>
                        </div>
                        <div class="pb-top-center">
                            <div class="pb-rec-dot"></div>
                            <span class="pb-rec-text">${data.cameraOn ? '直播' : '已暂停'}</span>
                        </div>
                        <div class="pb-top-right">
                            ${data.photos.length > 0 ? `<button class="pb-top-btn" id="pb-clear-all" title="清空"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>` : ''}
                        </div>
                    </div>
                </div>

                <div class="pb-effects-rail">
                    <div class="pb-effects-scroll" id="pb-effects-scroll">
                        ${EFFECTS.map((ef, i) => `
                            <div class="pb-effect ${i === data.effectIndex ? 'active' : ''}" data-idx="${i}">
                                <div class="pb-effect-preview" style="background: ${ef.gradient}; filter: ${ef.css === 'none' ? '' : ef.css}">
                                    <span>${ef.emoji}</span>
                                </div>
                                <div class="pb-effect-name">${ef.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="pb-controls">
                    <div class="pb-ctrl-left">
                        <button class="pb-ctrl-side" id="pb-camera-toggle" title="${data.cameraOn ? '暂停' : '播放'}">
                            ${data.cameraOn
                                ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`
                                : `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>`
                            }
                        </button>
                    </div>
                    <button class="pb-shutter-btn ${isCounting ? 'counting' : ''}" id="pb-shutter" title="拍照">
                        <div class="pb-shutter-ring"></div>
                        <div class="pb-shutter-core"></div>
                    </button>
                    <div class="pb-ctrl-right">
                        <button class="pb-ctrl-side" id="pb-switch-cam" title="切换摄像头">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                        </button>
                    </div>
                </div>

                ${data.photos.length > 0 ? `
                    <div class="pb-filmstrip">
                        <div class="pb-filmstrip-label">照片 · ${data.photos.length}</div>
                        <div class="pb-filmstrip-scroll" id="pb-filmstrip-scroll">
                            ${data.photos.slice().reverse().map((p, i) => {
                                const idx = data.photos.length - 1 - i;
                                return `
                                    <div class="pb-film-thumb ${viewingPhoto === idx ? 'active' : ''}" data-idx="${idx}" style="filter: ${EFFECTS.find(e => e.id === p.effectId)?.css || 'none'}">
                                        <div class="pb-film-thumb-bg" style="background: ${p.gradient || EFFECTS.find(e => e.id === p.effectId)?.gradient || 'linear-gradient(135deg, #4a4a4a, #2a2a2a)'}">
                                            <span>${p.emoji}</span>
                                        </div>
                                        <div class="pb-film-thumb-del" data-del="${idx}">×</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                ${viewingPhoto !== null ? renderPhotoViewer() : ''}
            </div>
        `;
        bind();
    }

    function renderPhotoViewer() {
        const p = data.photos[viewingPhoto];
        if (!p) return '';
        const effect = EFFECTS.find(e => e.id === p.effectId) || EFFECTS[0];
        return `
            <div class="pb-viewer" id="pb-viewer">
                <div class="pb-viewer-content">
                    <div class="pb-viewer-photo" style="background: ${p.gradient || effect.gradient}; filter: ${effect.css === 'none' ? '' : effect.css}">
                        <span>${p.emoji}</span>
                    </div>
                    <div class="pb-viewer-info">
                        <div class="pb-viewer-effect">${effect.name}</div>
                        <div class="pb-viewer-date">${new Date(p.time).toLocaleString('zh-CN')}</div>
                    </div>
                    <div class="pb-viewer-actions">
                        <button class="pb-viewer-btn" id="pb-viewer-prev" ${viewingPhoto === 0 ? 'disabled' : ''}>‹</button>
                        <button class="pb-viewer-btn" id="pb-viewer-export">导出</button>
                        <button class="pb-viewer-btn danger" id="pb-viewer-delete">删除</button>
                        <button class="pb-viewer-btn" id="pb-viewer-next" ${viewingPhoto === data.photos.length - 1 ? 'disabled' : ''}>›</button>
                    </div>
                </div>
                <button class="pb-viewer-close" id="pb-viewer-close">×</button>
            </div>
        `;
    }

    function takePhoto() {
        if (isCounting) return;
        isCounting = true;
        render();
        let count = 3;
        let countdownEl = body.querySelector('#pb-countdown');
        const interval = setInterval(() => {
            count--;
            countdownEl = body.querySelector('#pb-countdown');
            if (countdownEl) countdownEl.textContent = count > 0 ? count : '';
            if (count <= 0) {
                clearInterval(interval);
                const flash = body.querySelector('#pb-flash');
                if (flash) {
                    flash.style.opacity = '1';
                    setTimeout(() => { if (flash) flash.style.opacity = '0'; }, 180);
                }
                const effect = getEffect();
                data.photos.push({
                    time: Date.now(),
                    effectId: effect.id,
                    effectName: effect.name,
                    gradient: effect.gradient,
                    emoji: BG_EMOJIS[Math.floor(Math.random() * BG_EMOJIS.length)],
                    color: BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)]
                });
                save();
                isCounting = false;
                render();
            }
        }, 1000);
    }

    function deletePhoto(idx) {
        data.photos.splice(idx, 1);
        save();
        if (viewingPhoto === idx) viewingPhoto = null;
        else if (viewingPhoto !== null && viewingPhoto > idx) viewingPhoto--;
        render();
        showToast('照片已删除');
    }

    function bind() {
        const shutter = body.querySelector('#pb-shutter');
        if (shutter) shutter.addEventListener('click', takePhoto);

        const toggle = body.querySelector('#pb-camera-toggle');
        if (toggle) toggle.addEventListener('click', () => { data.cameraOn = !data.cameraOn; save(); render(); });

        const mirror = body.querySelector('#pb-mirror');
        if (mirror) mirror.addEventListener('click', () => { data.mirror = !data.mirror; save(); render(); });

        const switchCam = body.querySelector('#pb-switch-cam');
        if (switchCam) switchCam.addEventListener('click', () => showToast('已切换摄像头'));

        const clearAll = body.querySelector('#pb-clear-all');
        if (clearAll) clearAll.addEventListener('click', () => {
            if (window.confirmDialog) {
                window.confirmDialog('确定要清空所有照片吗？', () => {
                    data.photos = [];
                    save();
                    render();
                    showToast('已清空所有照片');
                });
            } else {
                data.photos = []; save(); render(); showToast('已清空');
            }
        });

        body.querySelectorAll('.pb-effect').forEach(el => {
            el.addEventListener('click', () => {
                data.effectIndex = parseInt(el.dataset.idx);
                save();
                render();
            });
        });

        body.querySelectorAll('.pb-film-thumb').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.classList.contains('pb-film-thumb-del')) return;
                viewingPhoto = parseInt(el.dataset.idx);
                render();
            });
        });

        body.querySelectorAll('.pb-film-thumb-del').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                deletePhoto(parseInt(el.dataset.del));
            });
        });

        const viewer = body.querySelector('#pb-viewer');
        if (viewer) {
            viewer.addEventListener('click', (e) => {
                if (e.target === viewer) { viewingPhoto = null; render(); }
            });
            const close = body.querySelector('#pb-viewer-close');
            if (close) close.addEventListener('click', () => { viewingPhoto = null; render(); });
            const del = body.querySelector('#pb-viewer-delete');
            if (del) del.addEventListener('click', () => deletePhoto(viewingPhoto));
            const exp = body.querySelector('#pb-viewer-export');
            if (exp) exp.addEventListener('click', () => showToast('照片已导出到桌面'));
            const prev = body.querySelector('#pb-viewer-prev');
            if (prev) prev.addEventListener('click', () => { if (viewingPhoto > 0) { viewingPhoto--; render(); } });
            const next = body.querySelector('#pb-viewer-next');
            if (next) next.addEventListener('click', () => { if (viewingPhoto < data.photos.length - 1) { viewingPhoto++; render(); } });
        }
    }

    render();
};

// Home - 家庭 (macOS Sonoma)
window.renderHome = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_home_v2';

    const ICONS = {
        home: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        light: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg>`,
        ac: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>`,
        tv: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="13" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
        speaker: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
        curtain: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v3H3zM5 6v15M19 6v15M7 6c2 4 2 11 0 15M17 6c-2 4-2 11 0 15"/></svg>`,
        humidifier: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
        fridge: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="5" y1="10" x2="19" y2="10"/><line x1="9" y1="6" x2="9" y2="7"/><line x1="9" y1="14" x2="9" y2="15"/></svg>`,
        plug: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M5 8h14v3a7 7 0 0 1-14 0z"/></svg>`,
        heater: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
        purifier: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9"/><path d="M3 12c0 5 4 9 9 9"/><circle cx="12" cy="12" r="2"/></svg>`,
        sun: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
        moon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
        door: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M3 7l9-4v18l-9-4z"/></svg>`,
        add: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
        search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
        edit: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
        more: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`,
        chevron: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
    };

    const ACC_ICONS = {
        light: ICONS.light, ac: ICONS.ac, tv: ICONS.tv, speaker: ICONS.speaker,
        curtain: ICONS.curtain, humidifier: ICONS.humidifier, fridge: ICONS.fridge,
        plug: ICONS.plug, heater: ICONS.heater, purifier: ICONS.purifier
    };

    function defaultData() {
        return {
            rooms: [
                { id: 1, name: '客厅', icon: '🛋️', color: '#FF9500' },
                { id: 2, name: '卧室', icon: '🛏️', color: '#5AC8FA' },
                { id: 3, name: '厨房', icon: '🍳', color: '#34C759' },
                { id: 4, name: '浴室', icon: '🚿', color: '#007AFF' },
                { id: 5, name: '书房', icon: '💻', color: '#AF52DE' },
                { id: 6, name: '阳台', icon: '🌿', color: '#34C759' }
            ],
            accessories: [
                { id: 1, room: 1, name: '客厅灯', type: 'light', on: true, brightness: 80 },
                { id: 2, room: 1, name: '空调', type: 'ac', on: true, temp: 24 },
                { id: 3, room: 1, name: '电视', type: 'tv', on: false },
                { id: 4, room: 1, name: '智能音箱', type: 'speaker', on: true, volume: 60 },
                { id: 5, room: 1, name: '窗帘', type: 'curtain', on: false },
                { id: 6, room: 2, name: '卧室灯', type: 'light', on: false, brightness: 50 },
                { id: 7, room: 2, name: '空调', type: 'ac', on: false, temp: 26 },
                { id: 8, room: 2, name: '加湿器', type: 'humidifier', on: true },
                { id: 9, room: 3, name: '冰箱', type: 'fridge', on: true, temp: 4 },
                { id: 10, room: 3, name: '智能插座', type: 'plug', on: true },
                { id: 11, room: 4, name: '浴室灯', type: 'light', on: false, brightness: 100 },
                { id: 12, room: 4, name: '热水器', type: 'heater', on: true, temp: 45 },
                { id: 13, room: 5, name: '台灯', type: 'light', on: true, brightness: 100 },
                { id: 14, room: 5, name: '空气净化器', type: 'purifier', on: true },
                { id: 15, room: 5, name: '加湿器', type: 'humidifier', on: false },
                { id: 16, room: 5, name: 'MacBook 充电器', type: 'plug', on: true },
                { id: 17, room: 6, name: '花园灯', type: 'light', on: false, brightness: 70 }
            ],
            scenes: [
                { id: 'morning', name: '起床', icon: 'sun', color: '#FF9500' },
                { id: 'leave', name: '离家', icon: 'door', color: '#8E8E93' },
                { id: 'arrive', name: '回家', icon: 'home', color: '#34C759' },
                { id: 'night', name: '就寝', icon: 'moon', color: '#5856D6' }
            ],
            activeRoom: null
        };
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultData();
    let searchQuery = '';

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function showToast(text, type = 'success') {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text, type);
    }

    function getFilteredAccessories() {
        let list = data.accessories;
        if (data.activeRoom) list = list.filter(a => a.room === data.activeRoom);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(a => a.name.toLowerCase().includes(q));
        }
        return list;
    }

    function getStatusText(a) {
        if (!a.on) return '关闭';
        if (a.brightness !== undefined) return a.brightness + '%';
        if (a.temp !== undefined) return a.temp + '°';
        if (a.volume !== undefined) return a.volume + '%';
        return '开启';
    }

    function getRoomName() {
        if (!data.activeRoom) return '我的家';
        const room = data.rooms.find(r => r.id === data.activeRoom);
        return room ? room.name : '我的家';
    }

    function renderSidebar() {
        const counts = {};
        data.rooms.forEach(r => { counts[r.id] = data.accessories.filter(a => a.room === r.id).length; });
        const totalCount = data.accessories.length;
        const onCount = data.accessories.filter(a => a.on).length;

        return `
            <div class="hm-side">
                <div class="hm-side-header">
                    <div class="hm-side-eyebrow">家庭</div>
                    <div class="hm-side-title-row">
                        <h1 class="hm-side-title">我的家</h1>
                        <button class="hm-icon-btn" id="hm-add-room" title="添加房间">${ICONS.add}</button>
                    </div>
                </div>
                <div class="hm-search">
                    ${ICONS.search}
                    <input type="text" id="hm-search-input" placeholder="搜索配件" value="${escapeHtml(searchQuery)}">
                </div>
                <div class="hm-nav">
                    <div class="hm-nav-item ${data.activeRoom === null ? 'active' : ''}" data-room="all">
                        ${ICONS.home}
                        <span>所有房间</span>
                        <span class="hm-count">${totalCount}</span>
                    </div>
                    <div class="hm-nav-sep"></div>
                    <div class="hm-nav-label">房间</div>
                    ${data.rooms.map(r => `
                        <div class="hm-nav-item ${data.activeRoom === r.id ? 'active' : ''}" data-room="${r.id}">
                            <span class="hm-room-emoji">${r.icon}</span>
                            <span>${escapeHtml(r.name)}</span>
                            <span class="hm-count">${counts[r.id] || 0}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="hm-side-footer">
                    <div class="hm-status-card">
                        <div class="hm-status-row">
                            <span class="hm-status-label">配件总数</span>
                            <span class="hm-status-value">${totalCount}</span>
                        </div>
                        <div class="hm-status-row">
                            <span class="hm-status-label">正在运行</span>
                            <span class="hm-status-value on">${onCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderToolbar() {
        return `
            <div class="hm-toolbar">
                <div class="hm-toolbar-left">
                    <button class="hm-tb-btn" id="hm-edit" title="编辑">${ICONS.edit}<span>编辑</span></button>
                    <button class="hm-tb-btn" id="hm-add-acc" title="添加配件">${ICONS.add}<span>添加配件</span></button>
                </div>
                <div class="hm-toolbar-right">
                    <button class="hm-tb-btn" title="发现">${ICONS.more}</button>
                </div>
            </div>
        `;
    }

    function renderScene(scene) {
        return `
            <div class="hm-scene" data-scene="${scene.id}" style="--scene-color:${scene.color}">
                <div class="hm-scene-icon">${ICONS[scene.icon] || ICONS.home}</div>
                <div class="hm-scene-name">${escapeHtml(scene.name)}</div>
            </div>
        `;
    }

    function renderAccessory(a) {
        const icon = ACC_ICONS[a.type] || ICONS.plug;
        const status = getStatusText(a);
        const room = data.rooms.find(r => r.id === a.room);
        return `
            <div class="hm-acc ${a.on ? 'on' : 'off'}" data-id="${a.id}">
                <div class="hm-acc-header">
                    <div class="hm-acc-icon">${icon}</div>
                    <div class="hm-acc-toggle" data-id="${a.id}">
                        <div class="hm-toggle-knob"></div>
                    </div>
                </div>
                <div class="hm-acc-body">
                    <div class="hm-acc-name">${escapeHtml(a.name)}</div>
                    <div class="hm-acc-status">${a.on ? status : '关闭'}</div>
                    ${data.activeRoom === null && room ? `<div class="hm-acc-room">${escapeHtml(room.name)}</div>` : ''}
                </div>
                ${a.on && a.brightness !== undefined ? `
                    <div class="hm-acc-slider-row">
                        <input type="range" min="0" max="100" value="${a.brightness}" data-bright="${a.id}" class="hm-slider">
                    </div>
                ` : ''}
            </div>
        `;
    }

    function renderBody() {
        const accs = getFilteredAccessories();
        return `
            <div class="hm-main">
                <div class="hm-content">
                    <div class="hm-section">
                        <div class="hm-section-title">${getRoomName()} · 场景</div>
                        <div class="hm-scenes">
                            ${data.scenes.map(renderScene).join('')}
                        </div>
                    </div>
                    <div class="hm-section">
                        <div class="hm-section-title-row">
                            <div class="hm-section-title">配件</div>
                            <div class="hm-section-count">${accs.length} 个</div>
                        </div>
                        <div class="hm-accessories">
                            ${accs.length === 0 ? `
                                <div class="hm-acc-empty">
                                    <div class="hm-acc-empty-title">没有配件</div>
                                    <div class="hm-acc-empty-sub">${searchQuery ? '未找到匹配的配件' : '点击"添加配件"来添加'}</div>
                                </div>
                            ` : accs.map(renderAccessory).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function render() {
        sidebar.innerHTML = renderSidebar();
        toolbar.innerHTML = renderToolbar();
        body.innerHTML = renderBody();
        bindSidebar();
        bindToolbar();
        bindBody();
    }

    function bindSidebar() {
        sidebar.querySelectorAll('.hm-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const v = item.dataset.room;
                data.activeRoom = v === 'all' ? null : parseInt(v);
                save();
                render();
            });
        });
        const searchInput = sidebar.querySelector('#hm-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                searchQuery = searchInput.value;
                render();
                const ni = sidebar.querySelector('#hm-search-input');
                if (ni) { ni.focus(); ni.setSelectionRange(searchQuery.length, searchQuery.length); }
            });
        }
        const addRoomBtn = sidebar.querySelector('#hm-add-room');
        if (addRoomBtn) addRoomBtn.addEventListener('click', () => showToast('添加房间功能开发中'));
    }

    function bindToolbar() {
        const editBtn = toolbar.querySelector('#hm-edit');
        if (editBtn) editBtn.addEventListener('click', () => showToast('进入编辑模式'));
        const addAccBtn = toolbar.querySelector('#hm-add-acc');
        if (addAccBtn) addAccBtn.addEventListener('click', () => showToast('添加配件功能开发中'));
    }

    function bindBody() {
        body.querySelectorAll('.hm-acc-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(toggle.dataset.id);
                const acc = data.accessories.find(a => a.id === id);
                if (acc) {
                    acc.on = !acc.on;
                    save();
                    render();
                }
            });
        });

        body.querySelectorAll('.hm-scene').forEach(scene => {
            scene.addEventListener('click', () => {
                const id = scene.dataset.scene;
                const sc = data.scenes.find(s => s.id === id);
                if (sc) {
                    if (id === 'leave' || id === 'night') {
                        data.accessories.forEach(a => { if (a.type !== 'fridge') a.on = false; });
                    } else if (id === 'morning' || id === 'arrive') {
                        data.accessories.forEach(a => { if (a.type === 'light' || a.type === 'ac') a.on = true; });
                    }
                    save();
                    showToast(`已执行「${sc.name}」场景`);
                    render();
                }
            });
        });

        body.querySelectorAll('.hm-slider').forEach(slider => {
            slider.addEventListener('input', () => {
                const id = parseInt(slider.dataset.bright);
                const acc = data.accessories.find(a => a.id === id);
                if (acc) {
                    acc.brightness = parseInt(slider.value);
                    save();
                    const statusEl = slider.closest('.hm-acc').querySelector('.hm-acc-status');
                    if (statusEl) statusEl.textContent = acc.brightness + '%';
                }
            });
        });

        body.querySelectorAll('.hm-acc').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const acc = data.accessories.find(a => a.id === id);
                if (acc) {
                    acc.on = !acc.on;
                    save();
                    render();
                }
            });
        });
    }

    render();
};

// Game Center - 游戏中心 (macOS Sonoma)
window.renderGameCenter = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_gamecenter_v2';

    const ICONS = {
        games: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="4"/></svg>`,
        friends: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        trophy: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
        leaderboard: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 5 5-9"/></svg>`,
        profile: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>`,
        play: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
        chat: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        add: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
        more: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`,
        chevron: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
    };

    const GAME_COLORS = ['#FF3B30', '#007AFF', '#34C759', '#FF9500', '#AF52DE', '#5AC8FA', '#FF2D55', '#5856D6'];

    function defaultData() {
        return {
            profile: {
                name: 'Player_001',
                avatar: '🎮',
                level: 42,
                title: '传奇玩家'
            },
            games: [
                { id: 1, name: '英雄联盟', icon: '⚔️', color: '#FF3B30', lastPlayed: Date.now() - 3600000 * 2, playHours: 128, achievements: 84, totalAchievements: 120, genre: 'MOBA' },
                { id: 2, name: '塞尔达传说', icon: '🗡️', color: '#34C759', lastPlayed: Date.now() - 86400000, playHours: 95, achievements: 42, totalAchievements: 60, genre: '冒险' },
                { id: 3, name: '原神', icon: '✨', color: '#007AFF', lastPlayed: Date.now() - 86400000 * 3, playHours: 342, achievements: 256, totalAchievements: 300, genre: 'RPG' },
                { id: 4, name: '动物森友会', icon: '🏝️', color: '#FF9500', lastPlayed: Date.now() - 86400000 * 7, playHours: 220, achievements: 65, totalAchievements: 80, genre: '模拟' },
                { id: 5, name: '星露谷物语', icon: '🌾', color: '#FFCC00', lastPlayed: Date.now() - 86400000 * 10, playHours: 156, achievements: 38, totalAchievements: 50, genre: '模拟' },
                { id: 6, name: '文明 VI', icon: '🏛️', color: '#AF52DE', lastPlayed: Date.now() - 86400000 * 5, playHours: 88, achievements: 22, totalAchievements: 100, genre: '策略' }
            ],
            friends: [
                { id: 1, name: '小明', avatar: '👦', status: 'online', game: '英雄联盟', color: '#FF3B30' },
                { id: 2, name: '小红', avatar: '👧', status: 'online', game: '原神', color: '#007AFF' },
                { id: 3, name: '阿杰', avatar: '🧑', status: 'offline', game: null, color: '#8E8E93' },
                { id: 4, name: '老王', avatar: '👨', status: 'online', game: null, color: '#34C759' },
                { id: 5, name: '小丽', avatar: '👩', status: 'online', game: '动物森友会', color: '#FF9500' },
                { id: 6, name: '大牛', avatar: '🧔', status: 'offline', game: null, color: '#8E8E93' },
                { id: 7, name: 'Amy', avatar: '👩‍🦰', status: 'online', game: '塞尔达传说', color: '#34C759' }
            ],
            achievements: [
                { id: 1, name: '初次胜利', game: '英雄联盟', desc: '赢得第一场比赛', unlocked: true, rarity: 'common', icon: '🥇', date: Date.now() - 86400000 * 30 },
                { id: 2, name: '百战不殆', game: '英雄联盟', desc: '游玩 100 场比赛', unlocked: true, rarity: 'rare', icon: '💯', date: Date.now() - 86400000 * 20 },
                { id: 3, name: '勇者无畏', game: '原神', desc: '到达 60 级', unlocked: true, rarity: 'epic', icon: '⚔️', date: Date.now() - 86400000 * 15 },
                { id: 4, name: '岛屿大师', game: '动物森友会', desc: '收集所有鱼类', unlocked: false, rarity: 'legendary', icon: '🐟', date: null },
                { id: 5, name: '文明缔造者', game: '文明 VI', desc: '完成科技胜利', unlocked: false, rarity: 'epic', icon: '🏛️', date: null },
                { id: 6, name: '农场之王', game: '星露谷物语', desc: '赚取 100 万金币', unlocked: true, rarity: 'rare', icon: '💰', date: Date.now() - 86400000 * 8 },
                { id: 7, name: '冒险家', game: '塞尔达传说', desc: '探索所有神庙', unlocked: true, rarity: 'legendary', icon: '🗺️', date: Date.now() - 86400000 * 5 },
                { id: 8, name: '元素大师', game: '原神', desc: '解锁所有元素', unlocked: false, rarity: 'legendary', icon: '✨', date: null }
            ],
            leaderboards: [
                { game: '英雄联盟', rank: 1240, score: '大师', trend: 'up' },
                { game: '原神', rank: 890, score: '深渊 12 层', trend: 'up' },
                { game: '塞尔达传说', rank: 567, score: '120 神庙', trend: 'same' },
                { game: '动物森友会', rank: 2103, score: '5 星岛屿', trend: 'down' }
            ],
            activeTab: 'games',
            searchQuery: ''
        };
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultData();

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text);
    }
    function formatTime(ts) {
        const diff = Date.now() - ts;
        if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
        if (diff < 86400000 * 7) return Math.floor(diff / 86400000) + ' 天前';
        return new Date(ts).toLocaleDateString('zh-CN');
    }
    function totalAchievements() {
        return data.games.reduce((s, g) => s + g.achievements, 0);
    }
    function totalPossibleAchievements() {
        return data.games.reduce((s, g) => s + g.totalAchievements, 0);
    }
    function unlockedCount() {
        return data.achievements.filter(a => a.unlocked).length;
    }

    function rarityColor(r) {
        return { common: '#8E8E93', rare: '#007AFF', epic: '#AF52DE', legendary: '#FF9500' }[r] || '#8E8E93';
    }
    function rarityLabel(r) {
        return { common: '普通', rare: '稀有', epic: '史诗', legendary: '传说' }[r] || '普通';
    }

    function renderSidebar() {
        const onlineCount = data.friends.filter(f => f.status === 'online').length;
        const gamesCount = data.games.length;
        const achCount = data.achievements.length;
        const lbCount = data.leaderboards.length;

        const navItems = [
            { id: 'games', name: '游戏', icon: 'games', count: gamesCount },
            { id: 'friends', name: '朋友', icon: 'friends', count: onlineCount },
            { id: 'achievements', name: '成就', icon: 'trophy', count: `${unlockedCount()}/${achCount}` },
            { id: 'leaderboards', name: '排行榜', icon: 'leaderboard', count: lbCount },
            { id: 'profile', name: '个人资料', icon: 'profile' }
        ];

        return `
            <div class="gc-side">
                <div class="gc-side-header">
                    <div class="gc-side-eyebrow">Game Center</div>
                    <h1 class="gc-side-title">游戏中心</h1>
                </div>
                <div class="gc-profile-card">
                    <div class="gc-profile-avatar">${escapeHtml(data.profile.avatar)}</div>
                    <div class="gc-profile-body">
                        <div class="gc-profile-name">${escapeHtml(data.profile.name)}</div>
                        <div class="gc-profile-title">${escapeHtml(data.profile.title)}</div>
                        <div class="gc-profile-level">
                            <div class="gc-level-bar"><div class="gc-level-fill" style="width:70%"></div></div>
                            <div class="gc-level-text">Lv.${data.profile.level}</div>
                        </div>
                    </div>
                </div>
                <div class="gc-nav">
                    ${navItems.map(item => `
                        <div class="gc-nav-item ${data.activeTab === item.id ? 'active' : ''}" data-tab="${item.id}">
                            ${ICONS[item.icon]}
                            <span>${escapeHtml(item.name)}</span>
                            ${item.count !== undefined ? `<span class="gc-count">${item.count}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="gc-side-footer">
                    <div class="gc-stat-card">
                        <div class="gc-stat-num">${totalAchievements()}</div>
                        <div class="gc-stat-label">成就点数</div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderToolbar() {
        return `
            <div class="gc-toolbar">
                <div class="gc-toolbar-title">${({games:'我的游戏', friends:'朋友', achievements:'成就', leaderboards:'排行榜', profile:'个人资料'})[data.activeTab] || ''}</div>
                <div class="gc-toolbar-right">
                    <div class="gc-search">
                        ${ICONS.search}
                        <input type="text" id="gc-search" placeholder="搜索" value="${escapeHtml(data.searchQuery)}">
                    </div>
                    <button class="gc-tb-btn" id="gc-more" title="更多">${ICONS.more}</button>
                </div>
            </div>
        `;
    }

    function renderGames() {
        let list = data.games;
        if (data.searchQuery) {
            const q = data.searchQuery.toLowerCase();
            list = list.filter(g => g.name.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q));
        }
        return `
            <div class="gc-content">
                <div class="gc-section-header">
                    <div class="gc-section-title">我的游戏</div>
                    <div class="gc-section-meta">${list.length} 款游戏</div>
                </div>
                <div class="gc-games-grid">
                    ${list.length === 0 ? `<div class="gc-empty">没有找到游戏</div>` : list.map(g => {
                        const pct = Math.round(g.achievements / g.totalAchievements * 100);
                        return `
                            <div class="gc-game-card" style="--gc-color:${g.color}">
                                <div class="gc-game-cover" style="background: linear-gradient(135deg, ${g.color}, ${g.color}dd)">
                                    <span class="gc-game-emoji">${g.icon}</span>
                                    <div class="gc-game-genre">${escapeHtml(g.genre)}</div>
                                </div>
                                <div class="gc-game-body">
                                    <div class="gc-game-name">${escapeHtml(g.name)}</div>
                                    <div class="gc-game-stats">
                                        <span class="gc-game-stat">⏱ ${g.playHours}h</span>
                                        <span class="gc-game-stat">🏆 ${g.achievements}/${g.totalAchievements}</span>
                                    </div>
                                    <div class="gc-game-progress">
                                        <div class="gc-game-progress-bar"><div class="gc-game-progress-fill" style="width:${pct}%"></div></div>
                                        <span class="gc-game-progress-pct">${pct}%</span>
                                    </div>
                                    <div class="gc-game-last">最后游玩 ${formatTime(g.lastPlayed)}</div>
                                </div>
                                <button class="gc-play-btn" data-play="${g.id}">${ICONS.play}<span>游玩</span></button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderFriends() {
        let list = data.friends;
        if (data.searchQuery) {
            const q = data.searchQuery.toLowerCase();
            list = list.filter(f => f.name.toLowerCase().includes(q));
        }
        const online = list.filter(f => f.status === 'online');
        const offline = list.filter(f => f.status === 'offline');
        return `
            <div class="gc-content">
                <div class="gc-section-header">
                    <div class="gc-section-title">朋友</div>
                    <div class="gc-section-meta">${online.length} 位在线 · ${offline.length} 位离线</div>
                </div>
                <div class="gc-friends-section">
                    <div class="gc-friends-label">在线</div>
                    ${online.length === 0 ? '<div class="gc-empty-inline">没有在线好友</div>' : online.map(f => renderFriend(f)).join('')}
                </div>
                ${offline.length > 0 ? `
                    <div class="gc-friends-section">
                        <div class="gc-friends-label">离线</div>
                        ${offline.map(f => renderFriend(f)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    function renderFriend(f) {
        return `
            <div class="gc-friend ${f.status}" data-friend="${f.id}">
                <div class="gc-friend-avatar" style="background: ${f.color}22; border-color: ${f.color}">
                    ${escapeHtml(f.avatar)}
                    <div class="gc-friend-dot ${f.status}"></div>
                </div>
                <div class="gc-friend-info">
                    <div class="gc-friend-name">${escapeHtml(f.name)}</div>
                    <div class="gc-friend-status">${f.status === 'online' ? (f.game ? '正在玩 ' + escapeHtml(f.game) : '在线') : '离线'}</div>
                </div>
                ${f.status === 'online' ? `<button class="gc-friend-action" data-chat="${f.id}">${ICONS.chat}</button>` : ''}
            </div>
        `;
    }

    function renderAchievements() {
        let list = data.achievements;
        if (data.searchQuery) {
            const q = data.searchQuery.toLowerCase();
            list = list.filter(a => a.name.toLowerCase().includes(q) || a.game.toLowerCase().includes(q));
        }
        const earned = list.filter(a => a.unlocked).length;
        const total = list.length;
        const pct = total > 0 ? Math.round(earned / total * 100) : 0;
        return `
            <div class="gc-content">
                <div class="gc-section-header">
                    <div class="gc-section-title">成就</div>
                    <div class="gc-section-meta">${earned}/${total}</div>
                </div>
                <div class="gc-ach-hero">
                    <div class="gc-ach-ring-wrap">
                        <div class="gc-ach-ring" style="--pct:${pct}">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(128,128,128,0.2)" stroke-width="8"/>
                                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" stroke-width="8" stroke-linecap="round"
                                    stroke-dasharray="${2 * Math.PI * 42}" stroke-dashoffset="${2 * Math.PI * 42 * (1 - pct / 100)}"
                                    transform="rotate(-90 50 50)"/>
                            </svg>
                            <div class="gc-ach-ring-inner">
                                <div class="gc-ach-pct">${pct}%</div>
                                <div class="gc-ach-earned">${earned}/${total}</div>
                            </div>
                        </div>
                    </div>
                    <div class="gc-ach-hero-info">
                        <div class="gc-ach-hero-title">成就完成度</div>
                        <div class="gc-ach-hero-desc">已解锁 ${earned} 个成就，共 ${total} 个</div>
                        <div class="gc-ach-rarity-row">
                            ${['common','rare','epic','legendary'].map(r => {
                                const c = list.filter(a => a.rarity === r && a.unlocked).length;
                                return `<div class="gc-rarity-chip" style="--rc:${rarityColor(r)}">${rarityLabel(r)} ${c}</div>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
                <div class="gc-ach-grid">
                    ${list.length === 0 ? '<div class="gc-empty">没有找到成就</div>' : list.map(a => `
                        <div class="gc-ach-card ${a.unlocked ? 'unlocked' : 'locked'}" style="--rc:${rarityColor(a.rarity)}">
                            <div class="gc-ach-icon">${a.unlocked ? a.icon : '🔒'}</div>
                            <div class="gc-ach-card-body">
                                <div class="gc-ach-name">${escapeHtml(a.name)}</div>
                                <div class="gc-ach-desc">${escapeHtml(a.desc)}</div>
                                <div class="gc-ach-meta">
                                    <span class="gc-ach-game">${escapeHtml(a.game)}</span>
                                    <span class="gc-ach-rarity">${rarityLabel(a.rarity)}</span>
                                    ${a.unlocked && a.date ? `<span class="gc-ach-date">${formatTime(a.date)}</span>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderLeaderboards() {
        let list = data.leaderboards;
        if (data.searchQuery) {
            const q = data.searchQuery.toLowerCase();
            list = list.filter(l => l.game.toLowerCase().includes(q));
        }
        return `
            <div class="gc-content">
                <div class="gc-section-header">
                    <div class="gc-section-title">排行榜</div>
                    <div class="gc-section-meta">${list.length} 个游戏</div>
                </div>
                <div class="gc-lb-list">
                    ${list.length === 0 ? '<div class="gc-empty">没有找到排行榜</div>' : list.map((l, i) => {
                        const game = data.games.find(g => g.name === l.game);
                        const trendIcon = l.trend === 'up' ? '▲' : l.trend === 'down' ? '▼' : '—';
                        const trendColor = l.trend === 'up' ? '#34C759' : l.trend === 'down' ? '#FF3B30' : '#8E8E93';
                        return `
                            <div class="gc-lb-item" style="--gc-color:${game?.color || '#8E8E93'}">
                                <div class="gc-lb-rank">#${i + 1}</div>
                                <div class="gc-lb-game">${game ? game.icon : '🎮'} ${escapeHtml(l.game)}</div>
                                <div class="gc-lb-score">${escapeHtml(l.score)}</div>
                                <div class="gc-lb-pos">
                                    <span style="color:${trendColor}">${trendIcon}</span>
                                    <span class="gc-lb-global">全球 #${l.rank}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderProfile() {
        const totalHours = data.games.reduce((s, g) => s + g.playHours, 0);
        return `
            <div class="gc-content">
                <div class="gc-profile-hero">
                    <div class="gc-profile-hero-avatar">${escapeHtml(data.profile.avatar)}</div>
                    <div class="gc-profile-hero-body">
                        <div class="gc-profile-hero-name">${escapeHtml(data.profile.name)}</div>
                        <div class="gc-profile-hero-title">${escapeHtml(data.profile.title)}</div>
                        <div class="gc-profile-hero-stats">
                            <div class="gc-ph-stat"><div class="gc-ph-num">Lv.${data.profile.level}</div><div class="gc-ph-lbl">等级</div></div>
                            <div class="gc-ph-stat"><div class="gc-ph-num">${totalAchievements()}</div><div class="gc-ph-lbl">成就点</div></div>
                            <div class="gc-ph-stat"><div class="gc-ph-num">${totalHours}h</div><div class="gc-ph-lbl">游戏时长</div></div>
                            <div class="gc-ph-stat"><div class="gc-ph-num">${data.friends.length}</div><div class="gc-ph-lbl">好友</div></div>
                        </div>
                    </div>
                </div>
                <div class="gc-section-header"><div class="gc-section-title">游戏统计</div></div>
                <div class="gc-profile-games">
                    ${data.games.map(g => {
                        const pct = Math.round(g.achievements / g.totalAchievements * 100);
                        return `
                            <div class="gc-pg-row">
                                <div class="gc-pg-icon" style="background:${g.color}22">${g.icon}</div>
                                <div class="gc-pg-info">
                                    <div class="gc-pg-name">${escapeHtml(g.name)}</div>
                                    <div class="gc-pg-bar"><div class="gc-pg-fill" style="width:${pct}%;background:${g.color}"></div></div>
                                </div>
                                <div class="gc-pg-meta">${g.playHours}h · ${pct}%</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderBody() {
        if (data.activeTab === 'games') return renderGames();
        if (data.activeTab === 'friends') return renderFriends();
        if (data.activeTab === 'achievements') return renderAchievements();
        if (data.activeTab === 'leaderboards') return renderLeaderboards();
        if (data.activeTab === 'profile') return renderProfile();
        return '';
    }

    function render() {
        sidebar.innerHTML = renderSidebar();
        toolbar.innerHTML = renderToolbar();
        body.innerHTML = renderBody();
        bindSidebar();
        bindToolbar();
        bindBody();
    }

    function bindSidebar() {
        sidebar.querySelectorAll('.gc-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                data.activeTab = item.dataset.tab;
                data.searchQuery = '';
                save();
                render();
            });
        });
    }

    function bindToolbar() {
        const search = toolbar.querySelector('#gc-search');
        if (search) {
            search.addEventListener('input', () => {
                data.searchQuery = search.value;
                body.innerHTML = renderBody();
                bindBody();
                const ni = toolbar.querySelector('#gc-search');
                if (ni) { ni.focus(); ni.setSelectionRange(data.searchQuery.length, data.searchQuery.length); }
            });
        }
        const more = toolbar.querySelector('#gc-more');
        if (more) more.addEventListener('click', () => showToast('更多选项'));
    }

    function bindBody() {
        body.querySelectorAll('.gc-play-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.play);
                const g = data.games.find(x => x.id === id);
                if (g) {
                    g.lastPlayed = Date.now();
                    save();
                    showToast(`正在启动「${g.name}」...`);
                }
            });
        });
        body.querySelectorAll('.gc-friend-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.chat);
                const f = data.friends.find(x => x.id === id);
                if (f) showToast(`正在与 ${f.name} 聊天`);
            });
        });
        body.querySelectorAll('.gc-friend').forEach(el => {
            el.addEventListener('click', () => {
                const id = parseInt(el.dataset.friend);
                const f = data.friends.find(x => x.id === id);
                if (f) showToast(`${f.name} · ${f.status === 'online' ? '在线' : '离线'}`);
            });
        });
    }

    render();
};
