window.renderPreview = function(body, sidebar, toolbar, windowId) {
    let currentImageIndex = 0;
    let zoom = 1;

    const images = [
        { emoji: '🏔️', name: '山景.jpg', size: '2.4 MB' },
        { emoji: '🌅', name: '日落.jpg', size: '1.8 MB' },
        { emoji: '🌊', name: '海浪.jpg', size: '3.1 MB' },
        { emoji: '🌸', name: '樱花.jpg', size: '1.2 MB' },
        { emoji: '🏙️', name: '城市.jpg', size: '2.8 MB' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:200px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);display:flex;flex-direction:column;">
                <div style="padding:12px;border-bottom:0.5px solid var(--border-color);">
                    <div style="font-weight:600;font-size:14px;">缩略图</div>
                </div>
                <div style="flex:1;overflow-y:auto;padding:8px;display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${images.map((img, i) => `
                        <div data-index="${i}" style="aspect-ratio:1;border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid ${currentImageIndex === i ? 'var(--accent-blue)' : 'transparent'};">
                            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;background:var(--button-bg);">${img.emoji}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('[data-index]').forEach(item => {
            item.addEventListener('click', () => {
                currentImageIndex = parseInt(item.dataset.index);
                zoom = 1;
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div style="height:100%;display:flex;align-items:center;padding:0 12px;gap:8px;">
                <button class="finder-toolbar-btn" id="prev-btn" ${currentImageIndex === 0 ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
                </button>
                <button class="finder-toolbar-btn" id="next-btn" ${currentImageIndex === images.length - 1 ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
                </button>
                <div style="width:1px;height:20px;background:var(--border-color);margin:0 4px;"></div>
                <button class="finder-toolbar-btn" id="zoom-out">🔍-</button>
                <span style="font-size:12px;min-width:40px;text-align:center;">${Math.round(zoom * 100)}%</span>
                <button class="finder-toolbar-btn" id="zoom-in">🔍+</button>
            </div>
        `;

        toolbar.querySelector('#prev-btn')?.addEventListener('click', () => {
            if (currentImageIndex > 0) { currentImageIndex--; zoom = 1; render(); }
        });
        toolbar.querySelector('#next-btn')?.addEventListener('click', () => {
            if (currentImageIndex < images.length - 1) { currentImageIndex++; zoom = 1; render(); }
        });
        toolbar.querySelector('#zoom-out')?.addEventListener('click', () => {
            zoom = Math.max(0.25, zoom - 0.25);
            render();
        });
        toolbar.querySelector('#zoom-in')?.addEventListener('click', () => {
            zoom = Math.min(3, zoom + 0.25);
            render();
        });
    }

    function renderContent() {
        const currentImage = images[currentImageIndex];
        body.innerHTML = `
            <div class="preview-body" style="flex-direction:column;">
                <div class="preview-image" style="transform:scale(${zoom});transition:transform 0.2s;font-size:${180 * zoom}px;">${currentImage.emoji}</div>
                <div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#fff;padding:8px 16px;border-radius:8px;font-size:12px;">
                    ${currentImage.name} · ${currentImage.size}
                </div>
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderToolbar();
        renderContent();
    }

    render();
};
