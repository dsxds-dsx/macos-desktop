window.renderTV = function(body, sidebar, toolbar, windowId) {
    let currentSection = 'watch';
    const content = [
        { id: '1', title: '盗梦空间', cover: '🎬', category: '电影', rating: '9.3', color: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
        { id: '2', title: '星际穿越', cover: '🚀', category: '电影', rating: '9.4', color: 'linear-gradient(135deg, #0f0c29, #302b63)' },
        { id: '3', title: '权力的游戏', cover: '⚔️', category: '剧集', rating: '9.5', color: 'linear-gradient(135deg, #232526, #414345)' },
        { id: '4', title: '老友记', cover: '📺', category: '剧集', rating: '9.8', color: 'linear-gradient(135deg, #f39c12, #e74c3c)' },
        { id: '5', title: '寻梦环游记', cover: '🎸', category: '动画', rating: '9.1', color: 'linear-gradient(135deg, #ff6b6b, #feca57)' },
        { id: '6', title: '千与千寻', cover: '🐉', category: '动画', rating: '9.4', color: 'linear-gradient(135deg, #a8e6cf, #dcedc1)' }
    ];

    const sections = [
        { id: 'watch', name: '立即观看', icon: '▶️' },
        { id: 'movies', name: '电影', icon: '🎬' },
        { id: 'tv', name: '电视节目', icon: '📺' },
        { id: 'kids', name: '儿童', icon: '🧒' },
        { id: 'library', name: '资料库', icon: '📚' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:200px;height:100%;background:#000;padding:16px;">
                <div style="font-size:22px;font-weight:700;margin-bottom:20px;color:#fff;">📺 TV</div>
                ${sections.map(sec => `
                    <div data-section="${sec.id}" style="padding:8px 12px;border-radius:6px;cursor:pointer;margin-bottom:2px;color:#fff;font-size:13px;display:flex;align-items:center;gap:10px;background:${currentSection === sec.id ? 'rgba(255,255,255,0.1)' : 'transparent'};">
                        <span>${sec.icon}</span>
                        <span>${sec.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        sidebar.querySelectorAll('[data-section]').forEach(item => {
            item.addEventListener('click', () => {
                currentSection = item.dataset.section;
                render();
            });
        });
    }

    function renderContent() {
        body.innerHTML = `
            <div style="flex:1;background:#000;overflow-y:auto;color:#fff;">
                <div style="padding:32px;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);margin-bottom:24px;">
                    <div style="font-size:12px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">精选推荐</div>
                    <h1 style="font-size:48px;font-weight:700;margin-bottom:16px;">${content[0].title}</h1>
                    <p style="font-size:18px;opacity:0.8;margin-bottom:24px;max-width:500px;">一部震撼人心的科幻巨作，探索梦境与现实的边界</p>
                    <div style="display:flex;gap:12px;">
                        <button style="padding:12px 32px;background:#fff;color:#000;border:none;border-radius:6px;font-size:14px;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:8px;">▶️ 播放</button>
                        <button style="padding:12px 24px;background:rgba(255,255,255,0.2);color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer;">+ 添加到列表</button>
                    </div>
                </div>
                <div style="padding:0 32px 32px;">
                    <h2 style="font-size:24px;font-weight:700;margin-bottom:16px;">热门内容</h2>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:20px;">
                        ${content.map(item => `
                            <div data-id="${item.id}" style="cursor:pointer;">
                                <div style="width:100%;aspect-ratio:2/3;border-radius:8px;background:${item.color};display:flex;align-items:center;justify-content:center;font-size:64px;margin-bottom:8px;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${item.cover}</div>
                                <div style="font-size:13px;font-weight:500;">${item.title}</div>
                                <div style="font-size:11px;opacity:0.6;">${item.category} · ⭐ ${item.rating}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    render();
};
