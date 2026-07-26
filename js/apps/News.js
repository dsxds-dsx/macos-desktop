window.renderNews = function(body, sidebar, toolbar, windowId) {
    let selectedArticleId = null;
    const articles = [
        { id: '1', title: '苹果发布 macOS Sonoma 全新版本', summary: '苹果公司今日发布 macOS 最新版本 Sonoma，带来全新桌面小组件、游戏模式等功能。', category: '科技', source: '科技日报', time: '1小时前', image: '🍎', content: '苹果公司今日正式发布 macOS Sonoma 操作系统，这是 Mac 平台的最新重大更新。新版本带来了许多令人兴奋的功能，包括可以放置在桌面上的交互式小组件、全新的屏幕保护程序、增强的视频会议功能，以及专门为游戏玩家设计的游戏模式。\n\n游戏模式可以为游戏提供更多的 CPU 和 GPU 资源，确保更流畅的游戏体验。Safari 浏览器也得到了重大升级，包括全新的隐私保护功能和更快的性能。' },
        { id: '2', title: '2024年人工智能发展趋势展望', summary: 'AI 技术持续快速发展，大语言模型、多模态 AI 成为今年的焦点。', category: '科技', source: 'AI 观察', time: '3小时前', image: '🤖', content: '2024年人工智能领域继续保持快速发展势头。大语言模型的能力不断提升，多模态 AI 可以同时处理文本、图像、音频和视频。AI 在医疗、教育、金融等领域的应用越来越广泛。专家预测，2024年将是 AI 从实验室走向大规模实际应用的关键一年。' },
        { id: '3', title: '北京冬奥会成功举办两周年纪念', summary: '回顾两年前那场精彩绝伦的冬季体育盛会。', category: '体育', source: '体育周刊', time: '5小时前', image: '⛷️', content: '两年前的今天，北京2022年冬奥会隆重开幕。这场盛会给世界留下了深刻印象，北京也成为历史上第一个既举办过夏季奥运会又举办过冬季奥运会的"双奥之城"。冬奥会的遗产继续惠及大众，冰雪运动在中国得到了前所未有的普及。' },
        { id: '4', title: '春节档电影票房创新高', summary: '多部优秀国产影片集中上映，观众观影热情高涨。', category: '娱乐', source: '娱乐头条', time: '昨天', image: '🎬', content: '今年春节档电影市场表现亮眼，多部优秀国产影片集中上映，涵盖喜剧、科幻、动画等多种类型。观众观影热情高涨，票房收入创下历史新高。业内人士表示，这反映了中国电影市场的强劲复苏和国产电影质量的不断提升。' },
        { id: '5', title: '春季养生小贴士', summary: '春天到了，这些健康知识你需要知道。', category: '健康', source: '健康生活', time: '昨天', image: '🌸', content: '春季是万物复苏的季节，也是养生的好时机。专家建议：1. 早睡早起，适当运动；2. 饮食清淡，多吃新鲜蔬果；3. 注意保暖，预防感冒；4. 保持心情舒畅。春季户外活动增多，但也要注意适度，避免过度疲劳。' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        const channels = [
            { name: '今日头条', icon: '📰', active: true },
            { name: '科技', icon: '💻' },
            { name: '体育', icon: '⚽' },
            { name: '娱乐', icon: '🎭' },
            { name: '财经', icon: '📈' },
            { name: '健康', icon: '💊' },
            { name: '国际', icon: '🌍' }
        ];
        sidebar.innerHTML = `
            <div style="width:220px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);padding:16px;">
                <div style="font-size:22px;font-weight:700;margin-bottom:20px;">📰 新闻</div>
                <input type="text" placeholder="搜索新闻" style="width:100%;padding:8px 12px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:8px;font-size:13px;outline:none;margin-bottom:16px;">
                <div style="font-size:11px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">频道</div>
                ${channels.map(ch => `
                    <div class="finder-sidebar-item ${ch.active ? 'active' : ''}" style="margin-bottom:2px;">
                        <span style="font-size:16px;">${ch.icon}</span>
                        <span style="font-size:13px;">${ch.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderContent() {
        if (selectedArticleId) {
            const article = articles.find(a => a.id === selectedArticleId);
            body.innerHTML = `
                <div style="flex:1;overflow-y:auto;background:var(--bg-elevated);">
                    <div style="padding:24px;max-width:700px;margin:0 auto;">
                        <button id="back-btn" style="background:none;border:none;color:var(--accent-blue);cursor:pointer;font-size:14px;margin-bottom:16px;">← 返回</button>
                        <div style="font-size:80px;text-align:center;margin-bottom:24px;">${article.image}</div>
                        <div style="font-size:12px;color:var(--accent-blue);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">${article.category}</div>
                        <h1 style="font-size:28px;font-weight:700;line-height:1.3;margin-bottom:12px;">${article.title}</h1>
                        <div style="font-size:13px;color:var(--text-tertiary);margin-bottom:24px;padding-bottom:16px;border-bottom:0.5px solid var(--border-color);">${article.source} · ${article.time}</div>
                        <div style="font-size:16px;line-height:1.8;color:var(--text-primary);white-space:pre-wrap;">${article.content}</div>
                    </div>
                </div>
            `;
            body.querySelector('#back-btn').addEventListener('click', () => {
                selectedArticleId = null;
                renderContent();
            });
            return;
        }

        body.innerHTML = `
            <div style="flex:1;overflow-y:auto;background:var(--bg-elevated);">
                <div style="padding:24px;">
                    <h1 style="font-size:32px;font-weight:700;margin-bottom:24px;">今日头条</h1>
                    <div style="display:grid;gap:16px;">
                        ${articles.map(article => `
                            <div data-id="${article.id}" style="display:flex;gap:16px;padding:16px;background:var(--button-bg);border-radius:12px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='var(--button-hover)'" onmouseout="this.style.background='var(--button-bg)'">
                                <div style="width:80px;height:80px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:40px;flex-shrink:0;">${article.image}</div>
                                <div style="flex:1;min-width:0;">
                                    <div style="font-size:12px;color:var(--accent-blue);font-weight:600;margin-bottom:4px;">${article.category}</div>
                                    <div style="font-size:16px;font-weight:600;margin-bottom:6px;line-height:1.4;">${article.title}</div>
                                    <div style="font-size:13px;color:var(--text-tertiary);line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${article.summary}</div>
                                    <div style="font-size:11px;color:var(--text-tertiary);margin-top:8px;">${article.source} · ${article.time}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        body.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                selectedArticleId = item.dataset.id;
                renderContent();
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
