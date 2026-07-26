window.renderPodcasts = function(body, sidebar, toolbar, windowId) {
    let currentSection = 'browse';
    let selectedShowId = null;

    const shows = [
        { id: '1', title: '科技乱炖', author: '科技评论', cover: '🎙️', color: 'linear-gradient(135deg, #667eea, #764ba2)', episodes: 156 },
        { id: '2', title: '故事FM', author: '故事FM', cover: '📻', color: 'linear-gradient(135deg, #f093fb, #f5576c)', episodes: 423 },
        { id: '3', title: '日谈公园', author: '李志明', cover: '🎧', color: 'linear-gradient(135deg, #4facfe, #00f2fe)', episodes: 312 },
        { id: '4', title: '忽左忽右', author: '程衍樑', cover: '🎤', color: 'linear-gradient(135deg, #43e97b, #38f9d7)', episodes: 245 },
        { id: '5', title: '声东击西', author: '声东击西', cover: '📢', color: 'linear-gradient(135deg, #fa709a, #fee140)', episodes: 189 },
        { id: '6', title: '得意忘形', author: '张潇雨', cover: '🎵', color: 'linear-gradient(135deg, #a8edea, #fed6e3)', episodes: 87 }
    ];

    const sections = [
        { id: 'browse', name: '浏览', icon: '🔍' },
        { id: 'library', name: '资料库', icon: '📚' },
        { id: 'downloads', name: '已下载', icon: '⬇️' },
        { id: 'subscribed', name: '已订阅', icon: '❤️' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:200px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);padding:16px;">
                <div style="font-size:22px;font-weight:700;margin-bottom:20px;">🎙️ 播客</div>
                ${sections.map(sec => `
                    <div class="finder-sidebar-item ${currentSection === sec.id ? 'active' : ''}" data-section="${sec.id}" style="margin-bottom:2px;">
                        <span style="font-size:16px;">${sec.icon}</span>
                        <span style="font-size:13px;">${sec.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        sidebar.querySelectorAll('[data-section]').forEach(item => {
            item.addEventListener('click', () => {
                currentSection = item.dataset.section;
                selectedShowId = null;
                render();
            });
        });
    }

    function renderContent() {
        if (selectedShowId) {
            const show = shows.find(s => s.id === selectedShowId);
            body.innerHTML = `
                <div style="flex:1;padding:32px;background:var(--bg-elevated);overflow-y:auto;">
                    <button id="back-btn" style="background:none;border:none;color:var(--accent-blue);cursor:pointer;font-size:14px;margin-bottom:24px;">← 返回</button>
                    <div style="display:flex;gap:32px;max-width:800px;margin:0 auto;">
                        <div style="width:200px;height:200px;border-radius:16px;background:${show.color};display:flex;align-items:center;justify-content:center;font-size:80px;box-shadow:0 8px 30px rgba(0,0,0,0.3);flex-shrink:0;">${show.cover}</div>
                        <div style="flex:1;padding-top:16px;">
                            <div style="font-size:12px;color:var(--accent-purple);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">播客</div>
                            <h1 style="font-size:32px;font-weight:700;margin-bottom:8px;">${show.title}</h1>
                            <div style="font-size:15px;color:var(--text-tertiary);margin-bottom:20px;">${show.author}</div>
                            <div style="display:flex;gap:12px;margin-bottom:24px;">
                                <button style="padding:10px 24px;background:var(--accent-purple);color:#fff;border:none;border-radius:20px;font-size:14px;cursor:pointer;font-weight:500;">订阅</button>
                                <button style="width:40px;height:40px;border-radius:50%;border:2px solid var(--border-color);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;">▶</button>
                            </div>
                            <div style="font-size:13px;color:var(--text-tertiary);">${show.episodes} 集 · 更新于昨天</div>
                        </div>
                    </div>
                    <div style="max-width:800px;margin:32px auto 0;">
                        <h2 style="font-size:20px;font-weight:600;margin-bottom:16px;">最新单集</h2>
                        <div style="display:flex;flex-direction:column;gap:8px;">
                            ${[1,2,3].map(i => `
                                <div style="display:flex;align-items:center;gap:16px;padding:12px;background:var(--button-bg);border-radius:10px;cursor:pointer;">
                                    <button style="width:36px;height:36px;border-radius:50%;border:none;background:var(--accent-purple);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;">▶</button>
                                    <div style="flex:1;">
                                        <div style="font-size:14px;font-weight:500;">第${show.episodes - i + 1}期：科技热点话题讨论</div>
                                        <div style="font-size:12px;color:var(--text-tertiary);">${i}天前 · ${45 + i}分钟</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            body.querySelector('#back-btn').addEventListener('click', () => {
                selectedShowId = null;
                render();
            });
            return;
        }

        body.innerHTML = `
            <div style="flex:1;padding:32px;background:var(--bg-elevated);overflow-y:auto;">
                <h1 style="font-size:28px;font-weight:700;margin-bottom:24px;">${sections.find(s => s.id === currentSection).name}</h1>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:24px;">
                    ${shows.map(show => `
                        <div data-id="${show.id}" style="cursor:pointer;">
                            <div style="width:100%;aspect-ratio:1;border-radius:16px;background:${show.color};display:flex;align-items:center;justify-content:center;font-size:64px;box-shadow:0 4px 15px rgba(0,0,0,0.2);margin-bottom:12px;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${show.cover}</div>
                            <div style="font-size:14px;font-weight:600;margin-bottom:2px;">${show.title}</div>
                            <div style="font-size:12px;color:var(--text-tertiary);">${show.author}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        body.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                selectedShowId = item.dataset.id;
                render();
            });
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    render();
};
