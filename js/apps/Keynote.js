// Keynote - 演示文稿 (macOS Sonoma)
window.renderKeynote = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_keynote_v2';
    const STATE_KEY = STORAGE_KEY + '_state';

    function defaultPresentations() {
        return [
            {
                id: 1, title: '产品发布会', theme: 'gradient',
                slides: [
                    { type: 'title', title: '2024 新品发布会', subtitle: '改变世界的创新', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
                    { type: 'content', title: '全新设计', content: '更薄、更轻、更强大\n全新的外观设计语言\n极致的工艺美学', bg: '#f5f5f7' },
                    { type: 'bullets', title: '核心特性', items: ['革命性的性能提升', '全天续航电池', '专业级摄像头系统', '沉浸式显示效果'], bg: '#1d1d1f' },
                    { type: 'quote', title: '"这是我们最好的产品"', subtitle: '—— 设计团队', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' }
                ]
            },
            {
                id: 2, title: '季度汇报', theme: 'minimal',
                slides: [
                    { type: 'title', title: 'Q4 季度汇报', subtitle: '业绩回顾与展望', bg: '#fff' },
                    { type: 'content', title: '业绩总结', content: '本季度业绩超额完成\n同比增长 35%\n用户满意度创新高', bg: '#f8f9fa' },
                    { type: 'bullets', title: '下季度目标', items: ['拓展新市场', '优化产品体验', '加强团队建设', '提升品牌影响力'], bg: '#1d1d1f' }
                ]
            }
        ];
    }

    function defaultState() {
        return { currentPresId: 1, currentSlide: 0, isPlaying: false };
    }

    function migrateOld() {
        const oldPres = JSON.parse(localStorage.getItem('keynote_presentations') || 'null');
        const oldCurrent = parseInt(localStorage.getItem('keynote_current') || '0', 10);
        if (!Array.isArray(oldPres) || !oldPres.length) return null;
        return { presentations: oldPres, state: { currentPresId: oldCurrent || oldPres[0].id, currentSlide: 0, isPlaying: false } };
    }

    let presentations, state;
    const migrated = migrateOld();
    presentations = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || (migrated ? migrated.presentations : null) || defaultPresentations();
    state = JSON.parse(localStorage.getItem(STATE_KEY) || 'null') || (migrated ? migrated.state : null) || defaultState();
    state.isPlaying = false; // Never resume in play mode

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(presentations));
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    }
    function showToast(text, type) {
        if (window.toast) window.toast(text, type || 'info');
        else if (window.Toast) window.Toast.show(text);
    }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getCurrentPres() {
        return presentations.find(p => p.id === state.currentPresId) || presentations[0];
    }

    function isLightBg(bg) {
        if (!bg) return false;
        if (bg.startsWith('linear-gradient')) return false;
        if (bg.startsWith('#')) {
            const hex = bg.slice(1);
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            return (r * 299 + g * 587 + b * 114) / 1000 > 160;
        }
        return false;
    }

    function getCurrentSlide() {
        const pres = getCurrentPres();
        return pres.slides[state.currentSlide] || pres.slides[0];
    }

    // ----- SVG icons -----
    const ICON = {
        play: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
        add: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
        delete: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        duplicate: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
        text: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
        document: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>',
        list: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
        quote: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2H4c-1.25 0-2 .75-2 2v8c0 1.25.75 2 2 2h2"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2-2-2h-4c-1.25 0-2 .75-2 2v8c0 1.25.75 2 2 2h2"/></svg>',
        chevronLeft: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
        chevronRight: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
        close: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        more: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
        slides: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
    };

    const slideTypes = [
        { id: 'title', name: '标题幻灯片', icon: 'text' },
        { id: 'content', name: '内容幻灯片', icon: 'document' },
        { id: 'bullets', name: '项目符号', icon: 'list' },
        { id: 'quote', name: '引用', icon: 'quote' }
    ];

    const themes = [
        { name: '深色', bg: '#1d1d1f' },
        { name: '浅色', bg: '#ffffff' },
        { name: '蓝紫', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
        { name: '粉橙', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
        { name: '青蓝', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
        { name: '日落', bg: 'linear-gradient(135deg,#fa709a,#fee140)' },
        { name: '海洋', bg: 'linear-gradient(135deg,#30cfd0,#330867)' },
        { name: '森林', bg: 'linear-gradient(135deg,#11998e,#38ef7d)' }
    ];

    function renderSlideHTML(slide, isThumb) {
        const fg = isLightBg(slide.bg) ? '#1d1d1f' : '#ffffff';
        const titleSize = isThumb ? 22 : 56;
        const subSize = isThumb ? 11 : 24;
        const h2Size = isThumb ? 18 : 42;
        const bodySize = isThumb ? 11 : 24;
        const bulletSize = isThumb ? 10 : 22;
        const quoteSize = isThumb ? 18 : 48;

        let inner = '';
        if (slide.type === 'title') {
            inner = `<h1 class="kn-slide-title" style="font-size:${titleSize}px">${escapeHtml(slide.title || '')}</h1><p class="kn-slide-sub" style="font-size:${subSize}px">${escapeHtml(slide.subtitle || '')}</p>`;
        } else if (slide.type === 'content') {
            inner = `<h2 class="kn-slide-h2" style="font-size:${h2Size}px">${escapeHtml(slide.title || '')}</h2><div class="kn-slide-body" style="font-size:${bodySize}px">${escapeHtml(slide.content || '')}</div>`;
        } else if (slide.type === 'bullets') {
            const items = Array.isArray(slide.items) ? slide.items : [];
            inner = `<h2 class="kn-slide-h2" style="font-size:${h2Size}px">${escapeHtml(slide.title || '')}</h2><ul class="kn-slide-bullets">${items.map(it => `<li style="font-size:${bulletSize}px">${escapeHtml(it)}</li>`).join('')}</ul>`;
        } else if (slide.type === 'quote') {
            inner = `<div class="kn-slide-quote" style="font-size:${quoteSize}px">${escapeHtml(slide.title || '')}</div><p class="kn-slide-quote-author" style="font-size:${subSize}px">${escapeHtml(slide.subtitle || '')}</p>`;
        }
        return `<div class="kn-slide-content ${isLightBg(slide.bg) ? 'light' : 'dark'}" style="background:${slide.bg};color:${fg};padding:${isThumb ? '14px' : '60px'}">${inner}</div>`;
    }

    function renderToolbar() {
        if (!toolbar) return;
        const pres = getCurrentPres();
        const canDelete = pres.slides.length > 1;
        toolbar.innerHTML = `
            <div class="kn-toolbar">
                <div class="kn-pres-select">
                    <select id="kn-presSelect" title="选择演示文稿">
                        ${presentations.map(p => `<option value="${p.id}" ${p.id === state.currentPresId ? 'selected' : ''}>${escapeHtml(p.title)}</option>`).join('')}
                    </select>
                </div>
                <button class="kn-tb-btn" id="kn-addSlide" title="添加幻灯片">${ICON.add}<span>添加</span></button>
                <button class="kn-tb-btn" id="kn-duplicateSlide" title="复制幻灯片">${ICON.duplicate}</button>
                <button class="kn-tb-btn danger" id="kn-deleteSlide" title="删除幻灯片" ${!canDelete ? 'disabled' : ''}>${ICON.delete}</button>
                <div class="kn-tb-sep"></div>
                <div class="kn-slide-count">${state.currentSlide + 1} / ${pres.slides.length}</div>
                <div style="flex:1;"></div>
                <button class="kn-tb-btn primary" id="kn-play" title="播放">${ICON.play}<span>播放</span></button>
            </div>
        `;
        toolbar.querySelector('#kn-presSelect')?.addEventListener('change', (e) => {
            state.currentPresId = parseInt(e.target.value, 10);
            state.currentSlide = 0;
            save();
            render();
        });
        toolbar.querySelector('#kn-addSlide')?.addEventListener('click', () => {
            const p = getCurrentPres();
            const lastBg = p.slides[p.slides.length - 1]?.bg || '#1d1d1f';
            p.slides.push({ type: 'title', title: '新幻灯片', subtitle: '副标题', bg: lastBg });
            state.currentSlide = p.slides.length - 1;
            save();
            render();
            showToast('已添加幻灯片', 'success');
        });
        toolbar.querySelector('#kn-duplicateSlide')?.addEventListener('click', () => {
            const p = getCurrentPres();
            const cur = getCurrentSlide();
            const copy = JSON.parse(JSON.stringify(cur));
            p.slides.splice(state.currentSlide + 1, 0, copy);
            state.currentSlide += 1;
            save();
            render();
            showToast('已复制幻灯片', 'success');
        });
        toolbar.querySelector('#kn-deleteSlide')?.addEventListener('click', async () => {
            if (!canDelete) return;
            const ok = await window.showConfirm('删除此幻灯片吗？', {
                subtitle: '此操作无法撤销。',
                confirmText: '删除',
                danger: true
            });
            if (!ok) return;
            const p = getCurrentPres();
            p.slides.splice(state.currentSlide, 1);
            if (state.currentSlide >= p.slides.length) state.currentSlide = p.slides.length - 1;
            save();
            render();
            showToast('已删除幻灯片', 'success');
        });
        toolbar.querySelector('#kn-play')?.addEventListener('click', () => {
            state.isPlaying = true;
            state.currentSlide = 0;
            save();
            render();
        });
    }

    function renderSidebar() {
        if (!sidebar) return;
        const pres = getCurrentPres();
        sidebar.innerHTML = `
            <div class="kn-sidebar">
                <div class="kn-sidebar-head">
                    <span class="kn-sidebar-title">幻灯片</span>
                    <span class="kn-sidebar-count">${pres.slides.length}</span>
                </div>
                <div class="kn-thumbs" id="kn-thumbs">
                    ${pres.slides.map((s, i) => `
                        <div class="kn-thumb ${i === state.currentSlide ? 'active' : ''}" data-idx="${i}">
                            <span class="kn-thumb-num">${i + 1}</span>
                            <div class="kn-thumb-inner">${renderSlideHTML(s, true)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sidebar.querySelectorAll('.kn-thumb').forEach(el => {
            el.addEventListener('click', () => {
                state.currentSlide = parseInt(el.dataset.idx, 10);
                save();
                renderSidebar();
                renderContent();
                renderToolbar();
            });
        });
    }

    function renderContent() {
        const slide = getCurrentSlide();
        body.className = 'window-body app-content kn-body';
        body.style.display = 'flex';
        body.style.flexDirection = 'row';

        body.innerHTML = `
            <div class="kn-stage">
                <div class="kn-stage-canvas" id="kn-stage-canvas">
                    ${renderSlideHTML(slide, false)}
                </div>
            </div>
            <aside class="kn-inspector">
                <div class="kn-inspector-section">
                    <div class="kn-inspector-title">幻灯片类型</div>
                    <div class="kn-type-grid">
                        ${slideTypes.map(t => `
                            <button class="kn-type-btn ${slide.type === t.id ? 'active' : ''}" data-type="${t.id}" title="${t.name}">
                                ${ICON[t.icon]}
                                <span>${t.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="kn-inspector-section">
                    <div class="kn-inspector-title">主题颜色</div>
                    <div class="kn-theme-grid" id="kn-themes">
                        ${themes.map(t => `
                            <button class="kn-theme-swatch ${slide.bg === t.bg ? 'active' : ''}" style="background:${t.bg}" data-bg="${escapeHtml(t.bg)}" title="${t.name}"></button>
                        `).join('')}
                    </div>
                </div>
                <div class="kn-inspector-section">
                    <div class="kn-inspector-title">内容</div>
                    <div class="kn-field">
                        <label>标题</label>
                        <input type="text" id="kn-edit-title" value="${escapeHtml(slide.title || '')}" placeholder="幻灯片标题">
                    </div>
                    ${slide.type === 'content'
                        ? `<div class="kn-field"><label>正文</label><textarea id="kn-edit-content" rows="4" placeholder="幻灯片正文">${escapeHtml(slide.content || '')}</textarea></div>`
                        : ''}
                    ${slide.type === 'bullets'
                        ? `<div class="kn-field"><label>项目符号（每行一条）</label><textarea id="kn-edit-items" rows="5" placeholder="每行一条">${escapeHtml((slide.items || []).join('\n'))}</textarea></div>`
                        : ''}
                    ${slide.type === 'title' || slide.type === 'quote'
                        ? `<div class="kn-field"><label>${slide.type === 'title' ? '副标题' : '署名'}</label><input type="text" id="kn-edit-subtitle" value="${escapeHtml(slide.subtitle || '')}" placeholder="副标题"></div>`
                        : ''}
                </div>
            </aside>
        `;

        // Type buttons
        body.querySelectorAll('.kn-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const slide = getCurrentSlide();
                const type = btn.dataset.type;
                if (slide.type === type) return;
                slide.type = type;
                if (type === 'title') { slide.title = slide.title || '标题'; slide.subtitle = slide.subtitle || '副标题'; }
                else if (type === 'content') { slide.title = slide.title || '标题'; slide.content = slide.content || '在此输入内容...'; }
                else if (type === 'bullets') { slide.title = slide.title || '标题'; slide.items = slide.items || ['项目 1', '项目 2']; }
                else if (type === 'quote') { slide.title = slide.title || '"引用内容"'; slide.subtitle = slide.subtitle || '—— 作者'; }
                save();
                renderContent();
                renderSidebar();
            });
        });

        // Theme swatches
        body.querySelectorAll('.kn-theme-swatch').forEach(sw => {
            sw.addEventListener('click', () => {
                const slide = getCurrentSlide();
                slide.bg = sw.dataset.bg;
                save();
                renderContent();
                renderSidebar();
            });
        });

        // Content editors (auto-save on input)
        const titleInput = body.querySelector('#kn-edit-title');
        titleInput?.addEventListener('input', () => {
            const slide = getCurrentSlide();
            slide.title = titleInput.value;
            save();
            renderSidebar();
            renderStageOnly();
        });
        const contentInput = body.querySelector('#kn-edit-content');
        contentInput?.addEventListener('input', () => {
            const slide = getCurrentSlide();
            slide.content = contentInput.value;
            save();
            renderStageOnly();
        });
        const itemsInput = body.querySelector('#kn-edit-items');
        itemsInput?.addEventListener('input', () => {
            const slide = getCurrentSlide();
            slide.items = itemsInput.value.split('\n').map(s => s).filter((s, i, a) => s.trim() !== '' || i < a.length - 1);
            save();
            renderStageOnly();
            renderSidebar();
        });
        const subInput = body.querySelector('#kn-edit-subtitle');
        subInput?.addEventListener('input', () => {
            const slide = getCurrentSlide();
            slide.subtitle = subInput.value;
            save();
            renderStageOnly();
            renderSidebar();
        });
    }

    function renderStageOnly() {
        const canvas = body.querySelector('#kn-stage-canvas');
        if (!canvas) return;
        const slide = getCurrentSlide();
        canvas.innerHTML = renderSlideHTML(slide, false);
    }

    function renderPlayMode() {
        const pres = getCurrentPres();
        const slide = pres.slides[state.currentSlide] || pres.slides[0];
        body.className = 'window-body app-content kn-play-body';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        body.innerHTML = `
            <div class="kn-play-stage" id="kn-play-stage">
                <div class="kn-play-slide">${renderSlideHTML(slide, false)}</div>
                <div class="kn-play-controls" id="kn-play-controls">
                    <button class="kn-play-btn" id="kn-prevSlide" title="上一张" ${state.currentSlide === 0 ? 'disabled' : ''}>${ICON.chevronLeft}</button>
                    <span class="kn-play-position">${state.currentSlide + 1} / ${pres.slides.length}</span>
                    <button class="kn-play-btn" id="kn-nextSlide" title="下一张" ${state.currentSlide >= pres.slides.length - 1 ? 'disabled' : ''}>${ICON.chevronRight}</button>
                    <span class="kn-play-divider"></span>
                    <button class="kn-play-btn exit" id="kn-exitPlay" title="退出播放">${ICON.close}<span>退出</span></button>
                </div>
                ${pres.slides.length > 1 ? `<div class="kn-play-progress"><div class="kn-play-progress-fill" style="width:${((state.currentSlide + 1) / pres.slides.length) * 100}%"></div></div>` : ''}
            </div>
        `;

        const stage = body.querySelector('#kn-play-stage');
        const controls = body.querySelector('#kn-play-controls');
        let controlsTimer;
        function showControls() {
            if (!controls) return;
            controls.classList.add('visible');
            clearTimeout(controlsTimer);
            controlsTimer = setTimeout(() => controls.classList.remove('visible'), 3000);
        }
        showControls();
        stage?.addEventListener('mousemove', showControls);

        stage?.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            if (state.currentSlide < pres.slides.length - 1) {
                state.currentSlide++;
            } else {
                state.isPlaying = false;
                save();
                render();
                return;
            }
            save();
            renderPlayMode();
        });
        body.querySelector('#kn-prevSlide')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.currentSlide > 0) { state.currentSlide--; save(); renderPlayMode(); }
        });
        body.querySelector('#kn-nextSlide')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.currentSlide < pres.slides.length - 1) { state.currentSlide++; save(); renderPlayMode(); }
        });
        body.querySelector('#kn-exitPlay')?.addEventListener('click', (e) => {
            e.stopPropagation();
            state.isPlaying = false;
            save();
            render();
        });

        const keyHandler = (e) => {
            if (!state.isPlaying) {
                document.removeEventListener('keydown', keyHandler);
                return;
            }
            if (e.key === 'Escape') { state.isPlaying = false; save(); render(); }
            else if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                if (state.currentSlide < pres.slides.length - 1) { state.currentSlide++; save(); renderPlayMode(); }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (state.currentSlide > 0) { state.currentSlide--; save(); renderPlayMode(); }
            }
        };
        document.addEventListener('keydown', keyHandler);

        // Cleanup on window close
        if (windowId) {
            const cleanupKey = `keynote_cleanup_${windowId}`;
            if (window[cleanupKey]) window[cleanupKey]();
            window[cleanupKey] = () => {
                document.removeEventListener('keydown', keyHandler);
            };
        }
    }

    function render() {
        if (state.isPlaying) {
            renderToolbar();
            if (sidebar) sidebar.innerHTML = '';
            renderPlayMode();
            return;
        }
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    render();
};
