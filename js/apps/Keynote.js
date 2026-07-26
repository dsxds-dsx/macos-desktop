window.renderKeynote = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#1a1a1a';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    const defaultPresentations = [
        {
            id: 1, title: '产品发布会', theme: 'gradient',
            slides: [
                { type: 'title', title: '2024 新品发布会', subtitle: '改变世界的创新', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
                { type: 'content', title: '全新设计', content: '更薄、更轻、更强大\n全新的外观设计语言\n极致的工艺美学', bg: '#f5f5f7' },
                { type: 'bullets', title: '核心特性', items: ['革命性的性能提升', '全天续航电池', '专业级摄像头系统', '沉浸式显示效果'], bg: '#000' },
                { type: 'quote', title: '"这是我们最好的产品"', subtitle: '—— 设计团队', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' }
            ]
        },
        {
            id: 2, title: '季度汇报', theme: 'minimal',
            slides: [
                { type: 'title', title: 'Q4 季度汇报', subtitle: '业绩回顾与展望', bg: '#fff' },
                { type: 'content', title: '业绩总结', content: '本季度业绩超额完成\n同比增长35%\n用户满意度创新高', bg: '#f8f9fa' },
                { type: 'bullets', title: '下季度目标', items: ['拓展新市场', '优化产品体验', '加强团队建设', '提升品牌影响力'], bg: '#1d1d1f' }
            ]
        }
    ];

    let presentations = JSON.parse(localStorage.getItem('keynote_presentations') || JSON.stringify(defaultPresentations));
    let currentPresId = parseInt(localStorage.getItem('keynote_current') || '1');
    let currentSlide = 0;
    let isPlaying = false;

    function save() {
        localStorage.setItem('keynote_presentations', JSON.stringify(presentations));
        localStorage.setItem('keynote_current', currentPresId.toString());
    }

    function getCurrentPres() {
        return presentations.find(p => p.id === currentPresId) || presentations[0];
    }

    function renderSlide(slide, isThumb = false) {
        const styles = `width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:${isThumb ? '20px' : '60px'};box-sizing:border-box;background:${slide.bg};color:${slide.bg.includes('#fff') || slide.bg.includes('#f5') || slide.bg.includes('#f8') ? '#1d1d1f' : '#fff'};border-radius:${isThumb ? '6px' : '0'};position:relative;overflow:hidden;`;
        
        let content = '';
        if (slide.type === 'title') {
            content = `<h1 style="font-size:${isThumb ? '24px' : '56px'};font-weight:700;text-align:center;margin:0 0 ${isThumb ? '8px' : '20px'};line-height:1.2;">${slide.title}</h1><p style="font-size:${isThumb ? '12px' : '24px'};opacity:0.9;text-align:center;margin:0;">${slide.subtitle}</p>`;
        } else if (slide.type === 'content') {
            content = `<h2 style="font-size:${isThumb ? '18px' : '42px'};font-weight:600;margin:0 0 ${isThumb ? '12px' : '40px'};align-self:flex-start;">${slide.title}</h2><div style="font-size:${isThumb ? '10px' : '24px'};line-height:1.8;white-space:pre-line;opacity:0.9;">${slide.content}</div>`;
        } else if (slide.type === 'bullets') {
            content = `<h2 style="font-size:${isThumb ? '16px' : '36px'};font-weight:600;margin:0 0 ${isThumb ? '10px' : '30px'};align-self:flex-start;">${slide.title}</h2><ul style="list-style:none;padding:0;margin:0;">${slide.items.map((item, i) => `<li style="font-size:${isThumb ? '9px' : '22px'};padding:${isThumb ? '4px 0' : '12px 0'};padding-left:${isThumb ? '12px' : '30px'};position:before;opacity:0.9;">${item}</li>`).join('')}</ul>`;
        } else if (slide.type === 'quote') {
            content = `<div style="font-size:${isThumb ? '18px' : '48px'};font-weight:300;font-style:italic;text-align:center;line-height:1.4;margin-bottom:${isThumb ? '8px' : '30px'};">${slide.title}</div><p style="font-size:${isThumb ? '10px' : '20px'};opacity:0.8;">${slide.subtitle}</p>`;
        }
        return `<div class="keynote-slide" style="${styles}">${content}</div>`;
    }

    function render() {
        if (isPlaying) {
            renderPlayMode();
            return;
        }

        const pres = getCurrentPres();
        const slide = pres.slides[currentSlide] || pres.slides[0];
        
        content.innerHTML = `
            <div style="height:48px;background:#2d2d2d;border-bottom:1px solid #444;display:flex;align-items:center;padding:0 16px;gap:12px;">
                <select id="keynote-presSelect" style="padding:6px 12px;background:#3d3d3d;border:1px solid #555;border-radius:6px;color:#fff;font-size:13px;">
                    ${presentations.map(p => `<option value="${p.id}" ${p.id === currentPresId ? 'selected' : ''}>${p.title}</option>`).join('')}
                </select>
                <button id="keynote-addSlide" style="padding:6px 12px;background:#3d3d3d;border:1px solid #555;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;">＋ 添加幻灯片</button>
                <div style="flex:1;"></div>
                <button id="keynote-play" style="padding:6px 16px;background:var(--accent-blue);border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:13px;font-weight:500;">▶ 播放</button>
            </div>
            <div style="display:flex;flex:1;overflow:hidden;">
                <div style="width:180px;background:#252525;border-right:1px solid #333;overflow-y:auto;padding:12px;" id="keynote-slidesList"></div>
                <div style="flex:1;background:#333;display:flex;align-items:center;justify-content:center;padding:40px;">
                    <div style="width:100%;max-width:900px;aspect-ratio:16/9;box-shadow:0 10px 40px rgba(0,0,0,0.5);border-radius:8px;overflow:hidden;" id="keynote-mainSlide">
                        ${renderSlide(slide)}
                    </div>
                </div>
                <div style="width:220px;background:#252525;border-left:1px solid #333;padding:16px;overflow-y:auto;">
                    <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:0 0 12px;">幻灯片类型</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <button class="slide-type-btn" data-type="title" style="padding:10px;background:#3d3d3d;border:1px solid #555;border-radius:6px;color:#fff;cursor:pointer;text-align:left;font-size:12px;">📝 标题幻灯片</button>
                        <button class="slide-type-btn" data-type="content" style="padding:10px;background:#3d3d3d;border:1px solid #555;border-radius:6px;color:#fff;cursor:pointer;text-align:left;font-size:12px;">📄 内容幻灯片</button>
                        <button class="slide-type-btn" data-type="bullets" style="padding:10px;background:#3d3d3d;border:1px solid #555;border-radius:6px;color:#fff;cursor:pointer;text-align:left;font-size:12px;">•  项目符号</button>
                        <button class="slide-type-btn" data-type="quote" style="padding:10px;background:#3d3d3d;border:1px solid #555;border-radius:6px;color:#fff;cursor:pointer;text-align:left;font-size:12px;">❝ 引用</button>
                    </div>
                    <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:20px 0 12px;">主题颜色</h4>
                    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;" id="keynote-themes"></div>
                </div>
            </div>
        `;

        const slidesList = content.querySelector('#keynote-slidesList');
        pres.slides.forEach((s, i) => {
            const thumb = document.createElement('div');
            thumb.style.cssText = `margin-bottom:12px;cursor:pointer;border:2px solid ${i === currentSlide ? 'var(--accent-blue)' : 'transparent'};border-radius:8px;overflow:hidden;aspect-ratio:16/9;`;
            thumb.innerHTML = renderSlide(s, true);
            thumb.onclick = () => { currentSlide = i; render(); };
            slidesList.appendChild(thumb);
        });

        const themes = [
            { name: '深色', bg: '#1d1d1f' },
            { name: '浅色', bg: '#fff' },
            { name: '蓝紫', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
            { name: '粉橙', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
            { name: '青绿', bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
            { name: '日落', bg: 'linear-gradient(135deg,#fa709a,#fee140)' },
            { name: '海洋', bg: 'linear-gradient(135deg,#30cfd0,#330867)' },
            { name: '森林', bg: 'linear-gradient(135deg,#11998e,#38ef7d)' }
        ];
        const themesEl = content.querySelector('#keynote-themes');
        themes.forEach(t => {
            const btn = document.createElement('button');
            btn.style.cssText = `width:100%;aspect-ratio:1;border-radius:6px;border:2px solid ${slide.bg === t.bg ? 'var(--accent-blue)' : '#555'};background:${t.bg};cursor:pointer;padding:0;`;
            btn.onclick = () => { slide.bg = t.bg; save(); render(); };
            themesEl.appendChild(btn);
        });

        content.querySelector('#keynote-presSelect').onchange = (e) => {
            currentPresId = parseInt(e.target.value);
            currentSlide = 0;
            save(); render();
        };

        content.querySelector('#keynote-addSlide').onclick = () => {
            pres.slides.push({ type: 'title', title: '新幻灯片', subtitle: '副标题', bg: '#1d1d1f' });
            currentSlide = pres.slides.length - 1;
            save(); render();
        };

        content.querySelectorAll('.slide-type-btn').forEach(btn => {
            btn.onclick = () => {
                slide.type = btn.dataset.type;
                if (btn.dataset.type === 'title') { slide.title = '标题'; slide.subtitle = '副标题'; }
                else if (btn.dataset.type === 'content') { slide.title = '标题'; slide.content = '在此输入内容...'; }
                else if (btn.dataset.type === 'bullets') { slide.title = '标题'; slide.items = ['项目 1', '项目 2', '项目 3']; }
                else if (btn.dataset.type === 'quote') { slide.title = '"引用内容"'; slide.subtitle = '—— 作者'; }
                save(); render();
            };
        });

        content.querySelector('#keynote-play').onclick = () => { isPlaying = true; currentSlide = 0; render(); };
    }

    function renderPlayMode() {
        const pres = getCurrentPres();
        const slide = pres.slides[currentSlide];
        content.innerHTML = `
            <div style="width:100%;height:100%;background:#000;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;" id="keynote-playArea">
                <div style="width:100%;height:100%;">${renderSlide(slide)}</div>
                <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:12px;align-items:center;background:rgba(0,0,0,0.5);padding:10px 20px;border-radius:20px;opacity:0;transition:opacity 0.3s;" id="keynote-playControls">
                    <button id="keynote-prevSlide" style="width:36px;height:36px;border-radius:50%;border:none;background:rgba(255,255,255,0.2);color:#fff;cursor:pointer;font-size:16px;">◀</button>
                    <span style="color:#fff;font-size:14px;min-width:60px;text-align:center;">${currentSlide + 1} / ${pres.slides.length}</span>
                    <button id="keynote-nextSlide" style="width:36px;height:36px;border-radius:50%;border:none;background:rgba(255,255,255,0.2);color:#fff;cursor:pointer;font-size:16px;">▶</button>
                    <button id="keynote-exitPlay" style="padding:6px 16px;border-radius:6px;border:none;background:rgba(255,255,255,0.2);color:#fff;cursor:pointer;font-size:12px;">退出</button>
                </div>
            </div>
        `;

        const playArea = content.querySelector('#keynote-playArea');
        const controls = content.querySelector('#keynote-playControls');
        let controlsTimer;

        function showControls() {
            controls.style.opacity = '1';
            clearTimeout(controlsTimer);
            controlsTimer = setTimeout(() => { controls.style.opacity = '0'; }, 3000);
        }
        showControls();

        playArea.onmousemove = showControls;
        playArea.onclick = (e) => {
            if (e.target.tagName !== 'BUTTON') {
                if (currentSlide < pres.slides.length - 1) currentSlide++;
                else { isPlaying = false; render(); return; }
                renderPlayMode();
            }
        };

        content.querySelector('#keynote-prevSlide').onclick = (e) => { e.stopPropagation(); if (currentSlide > 0) { currentSlide--; renderPlayMode(); } };
        content.querySelector('#keynote-nextSlide').onclick = (e) => { e.stopPropagation(); if (currentSlide < pres.slides.length - 1) { currentSlide++; renderPlayMode(); } };
        content.querySelector('#keynote-exitPlay').onclick = (e) => { e.stopPropagation(); isPlaying = false; render(); };

        document.onkeydown = (e) => {
            if (!isPlaying) { document.onkeydown = null; return; }
            if (e.key === 'Escape') { isPlaying = false; document.onkeydown = null; render(); }
            else if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); if (currentSlide < pres.slides.length - 1) currentSlide++; renderPlayMode(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); if (currentSlide > 0) currentSlide--; renderPlayMode(); }
        };
    }

    render();
};
