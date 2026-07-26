window.renderPhotos = function(body, sidebar, toolbar, windowId) {
    let selectedPhoto = null;

    const photos = [
        { id: 1, emoji: '🏔️', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', title: '山景' },
        { id: 2, emoji: '🌅', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', title: '日落' },
        { id: 3, emoji: '🌊', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', title: '海浪' },
        { id: 4, emoji: '🌸', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', title: '樱花' },
        { id: 5, emoji: '🌲', color: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', title: '森林' },
        { id: 6, emoji: '🌃', color: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', title: '夜景' },
        { id: 7, emoji: '🏖️', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', title: '海滩' },
        { id: 8, emoji: '🍂', color: 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)', title: '秋叶' },
        { id: 9, emoji: '❄️', color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', title: '雪景' },
        { id: 10, emoji: '🌺', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', title: '花朵' },
        { id: 11, emoji: '🌙', color: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', title: '月光' },
        { id: 12, emoji: '🌈', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)', title: '彩虹' },
        { id: 13, emoji: '🏞️', color: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)', title: '山谷' },
        { id: 14, emoji: '🌌', color: 'linear-gradient(135deg, #000000 0%, #130f40 100%)', title: '星空' },
        { id: 15, emoji: '🍀', color: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)', title: '四叶草' },
        { id: 16, emoji: '🎆', color: 'linear-gradient(135deg, #fc00ff 0%, #00dbde 100%)', title: '烟花' }
    ];

    function render() {
        if (selectedPhoto) {
            const photo = photos.find(p => p.id === selectedPhoto);
            body.innerHTML = `
                <div class="app-content" style="height:100%;display:flex;flex-direction:column;background:#000;">
                    <div style="padding:12px 16px;display:flex;align-items:center;gap:12px;background:rgba(0,0,0,0.5);">
                        <button class="finder-toolbar-btn" id="photo-back" style="color:#fff;">
                            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/></svg>
                        </button>
                        <span style="color:#fff;font-size:14px;font-weight:500;">${photo.title}</span>
                    </div>
                    <div style="flex:1;display:flex;align-items:center;justify-content:center;">
                        <div style="width:100%;height:100%;background:${photo.color};display:flex;align-items:center;justify-content:center;font-size:120px;">
                            ${photo.emoji}
                        </div>
                    </div>
                </div>
            `;
            body.querySelector('#photo-back').addEventListener('click', () => {
                selectedPhoto = null;
                render();
            });
        } else {
            body.innerHTML = `
                <div class="app-content" style="height:100%;display:flex;flex-direction:column;background:var(--bg-elevated);">
                    <div style="padding:16px 20px;border-bottom:0.5px solid var(--border-color);">
                        <h2 style="font-size:24px;font-weight:600;margin-bottom:4px;">照片</h2>
                        <span style="font-size:13px;color:var(--text-secondary);">${photos.length} 张照片</span>
                    </div>
                    <div style="flex:1;overflow-y:auto;padding:4px;">
                        <div class="photos-grid">
                            ${photos.map(photo => `
                                <div class="photo-item" data-id="${photo.id}">
                                    <div class="photo-item-inner" style="background:${photo.color};">
                                        <span style="font-size:48px;">${photo.emoji}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            body.querySelectorAll('.photo-item').forEach(item => {
                item.addEventListener('click', () => {
                    selectedPhoto = parseInt(item.dataset.id);
                    render();
                });
            });
        }
    }

    render();
};
