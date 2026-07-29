window.renderNews = function(body, sidebar, toolbar, windowId) {
    // ============ Persistent State ============
    let state = JSON.parse(localStorage.getItem('macos_news_state') || 'null') || {
        currentChannel: 'today',
        selectedArticleId: null,
        savedArticles: [],
        readingHistory: [],
        followingChannels: ['tech', 'world', 'business'],
        fontSize: 'medium'
    };
    let searchQuery = '';

    function saveState() {
        localStorage.setItem('macos_news_state', JSON.stringify(state));
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    // ============ Channels ============
    const channels = [
        { id: 'today', name: '今日', icon: 'newspaper' },
        { id: 'tech', name: '科技', icon: 'cpu' },
        { id: 'world', name: '国际', icon: 'globe' },
        { id: 'business', name: '财经', icon: 'chart' },
        { id: 'sports', name: '体育', icon: 'trophy' },
        { id: 'entertainment', name: '娱乐', icon: 'film' },
        { id: 'health', name: '健康', icon: 'heart' },
        { id: 'science', name: '科学', icon: 'flask' }
    ];

    const channelIcons = {
        'today': `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm0-4H7v-2h5v2zm0-4H7V7h5v2zm5 8h-3V7h3v10z"/></svg>`,
        'tech': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg>`,
        'world': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        'business': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg>`,
        'sports': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
        'entertainment': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/></svg>`,
        'health': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        'science': `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v2l-1 1v4l5 8a3 3 0 0 1-2.6 4.5H7.6A3 3 0 0 1 5 18l5-8V6L9 5V3z"/></svg>`
    };

    // ============ Articles Data ============
    const articles = [
        { id: '1', channel: 'tech', title: '苹果发布 macOS Sonoma 全新版本', summary: '苹果公司今日发布 macOS 最新版本 Sonoma，带来全新桌面小组件、游戏模式等功能。', source: '科技日报', sourceColor: '#34C759', time: Date.now() - 3600000, image: 'macos-sonoma', category: '科技', readTime: 4, content: '苹果公司今日正式发布 macOS Sonoma 操作系统，这是 Mac 平台的最新重大更新。新版本带来了许多令人兴奋的功能，包括可以放置在桌面上的交互式小组件、全新的屏幕保护程序、增强的视频会议功能，以及专门为游戏玩家设计的游戏模式。\n\n游戏模式可以为游戏提供更多的 CPU 和 GPU 资源，确保更流畅的游戏体验。Safari 浏览器也得到了重大升级，包括全新的隐私保护功能和更快的性能。\n\n此外，macOS Sonoma 还引入了全新的健康应用、密码应用，以及对 AirDrop 的重大改进。用户可以通过软件更新立即体验全新功能。' },
        { id: '2', channel: 'tech', title: '2024年人工智能发展趋势展望', summary: 'AI 技术持续快速发展，大语言模型、多模态 AI 成为今年的焦点。', source: 'AI 观察', sourceColor: '#5856D6', time: Date.now() - 10800000, image: 'ai-trend', category: '科技', readTime: 6, content: '2024年人工智能领域继续保持快速发展势头。大语言模型的能力不断提升，多模态 AI 可以同时处理文本、图像、音频和视频。AI 在医疗、教育、金融等领域的应用越来越广泛。\n\n专家预测，2024年将是 AI 从实验室走向大规模实际应用的关键一年。从智能助手到自动驾驶，从内容创作到科学研究，AI 正在深刻改变我们的工作与生活方式。\n\n同时，AI 安全、伦理和监管也成为各国关注的焦点。如何在推动创新的同时确保技术的负责任发展，是整个行业需要共同面对的课题。' },
        { id: '3', channel: 'sports', title: '北京冬奥会成功举办两周年纪念', summary: '回顾两年前那场精彩绝伦的冬季体育盛会。', source: '体育周刊', sourceColor: '#FF9500', time: Date.now() - 18000000, image: 'winter-sports', category: '体育', readTime: 3, content: '两年前的今天，北京2022年冬奥会隆重开幕。这场盛会给世界留下了深刻印象，北京也成为历史上第一个既举办过夏季奥运会又举办过冬季奥运会的"双奥之城"。\n\n冬奥会的遗产继续惠及大众，冰雪运动在中国得到了前所未有的普及。从场馆的赛后利用到群众性冰雪运动的开展，北京冬奥会的影响将持续深远。' },
        { id: '4', channel: 'entertainment', title: '春节档电影票房创新高', summary: '多部优秀国产影片集中上映，观众观影热情高涨。', source: '娱乐头条', sourceColor: '#FF2D55', time: Date.now() - 86400000, image: 'cinema', category: '娱乐', readTime: 5, content: '今年春节档电影市场表现亮眼，多部优秀国产影片集中上映，涵盖喜剧、科幻、动画等多种类型。观众观影热情高涨，票房收入创下历史新高。\n\n业内人士表示，这反映了中国电影市场的强劲复苏和国产电影质量的不断提升。从制作水准到叙事能力，国产电影正在迎来新的黄金时代。' },
        { id: '5', channel: 'health', title: '春季养生小贴士', summary: '春天到了，这些健康知识你需要知道。', source: '健康生活', sourceColor: '#FF3B30', time: Date.now() - 86400000, image: 'spring-health', category: '健康', readTime: 4, content: '春季是万物复苏的季节，也是养生的好时机。专家建议：\n\n1. 早睡早起，适当运动\n2. 饮食清淡，多吃新鲜蔬果\n3. 注意保暖，预防感冒\n4. 保持心情舒畅\n\n春季户外活动增多，但也要注意适度，避免过度疲劳。让我们以健康的方式迎接这个美好的季节。' },
        { id: '6', channel: 'world', title: '全球气候大会达成历史性协议', summary: '各国代表在气候大会上就减排目标达成一致。', source: '国际时报', sourceColor: '#007AFF', time: Date.now() - 172800000, image: 'climate', category: '国际', readTime: 5, content: '在刚刚结束的全球气候大会上，各国代表经过两周的艰苦谈判，最终就减排目标达成一致。协议承诺到2030年将全球碳排放量减半，并设立专门的基金支持发展中国家应对气候变化。\n\n这一协议被各方视为应对气候变化的重要里程碑，但执行情况仍有待观察。' },
        { id: '7', channel: 'business', title: '央行宣布降准释放长期资金', summary: '此次降准将释放约1万亿元长期资金，支持实体经济。', source: '财经快讯', sourceColor: '#34C759', time: Date.now() - 172800000, image: 'finance', category: '财经', readTime: 3, content: '中国人民银行今日宣布下调金融机构存款准备金率0.5个百分点。此次降准将释放约1万亿元长期资金，有助于降低金融机构资金成本，支持实体经济。\n\n分析人士认为，这一举措反映了货币政策对经济的精准支持，预计将有助于稳定市场预期。' },
        { id: '8', channel: 'science', title: '詹姆斯·韦伯望远镜发现新行星', summary: 'NASA 宣布在距离地球400光年处发现一颗类地行星。', source: '科学前沿', sourceColor: '#AF52DE', time: Date.now() - 259200000, image: 'planet', category: '科学', readTime: 6, content: 'NASA 今日宣布，詹姆斯·韦伯太空望远镜在距离地球约400光年的恒星系统中发现了一颗类地行星。初步观测显示，这颗行星可能存在液态水，是寻找地外生命的重要候选。\n\n这一发现为人类探索宇宙起源和生命存在提供了新的线索。' },
        { id: '9', channel: 'tech', title: '新一代处理器性能提升40%', summary: '采用全新3nm工艺，能效比显著改善。', source: '硬件评测', sourceColor: '#34C759', time: Date.now() - 259200000, image: 'chip', category: '科技', readTime: 4, content: '新一代处理器正式发布，采用全新3nm工艺制程。性能较上一代提升40%，能效比改善30%。\n\n新处理器在 AI 推理、图形渲染和多任务处理方面都有显著进步，将为下一代设备带来更强大的计算能力。' },
        { id: '10', channel: 'world', title: '国际合作助力太空探索', summary: '多国航天机构签署合作协议，共同推进深空探测。', source: '国际时报', sourceColor: '#007AFF', time: Date.now() - 345600000, image: 'space', category: '国际', readTime: 5, content: '来自全球多个国家的航天机构今日签署了一份合作协议，承诺在月球基地建设、火星探测和小行星防御等领域开展深度合作。\n\n这标志着人类太空探索进入了全新的合作时代。' }
    ];

    function getArticleById(id) {
        return articles.find(a => a.id === id);
    }

    function formatTime(timestamp) {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;
        return new Date(timestamp).toLocaleDateString('zh-CN');
    }

    // ============ Hero Image Generator ============
    function getHeroImage(article) {
        const gradients = {
            'macos-sonoma': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            'ai-trend': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'winter-sports': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'cinema': 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
            'spring-health': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'climate': 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
            'finance': 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
            'planet': 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            'chip': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            'space': 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)'
        };
        const icons = {
            'macos-sonoma': '', 'ai-trend': '🤖', 'winter-sports': '⛷️', 'cinema': '🎬',
            'spring-health': '🌸', 'climate': '🌍', 'finance': '📈', 'planet': '🪐',
            'chip': '💾', 'space': '🚀'
        };
        return {
            gradient: gradients[article.image] || 'linear-gradient(135deg, #667eea, #764ba2)',
            icon: icons[article.image] || '📰'
        };
    }

    // ============ Render Sidebar ============
    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="news-sidebar">
                <div class="news-sidebar-top">
                    <div class="news-sidebar-title">新闻</div>
                    <div class="news-sidebar-search">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                        <input type="text" id="news-search-${windowId}" placeholder="搜索" value="${escapeHtml(searchQuery)}">
                    </div>
                </div>
                <div class="news-sidebar-scroll">
                    <div class="news-sidebar-group">
                        <div class="news-sidebar-group-title">Apple 新闻</div>
                        <div class="news-sidebar-section ${state.currentChannel === 'today' ? 'active' : ''}" data-channel="today">
                            ${channelIcons['today']}
                            <span>今日</span>
                        </div>
                    </div>
                    <div class="news-sidebar-group">
                        <div class="news-sidebar-group-title">频道</div>
                        ${channels.filter(c => c.id !== 'today').map(ch => `
                            <div class="news-sidebar-section ${state.currentChannel === ch.id ? 'active' : ''}" data-channel="${ch.id}">
                                ${channelIcons[ch.id]}
                                <span>${ch.name}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="news-sidebar-group">
                        <div class="news-sidebar-group-title">我的</div>
                        <div class="news-sidebar-section ${state.currentChannel === 'saved' ? 'active' : ''}" data-channel="saved">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                            <span>已保存</span>
                            ${state.savedArticles.length > 0 ? `<span class="news-sidebar-badge">${state.savedArticles.length}</span>` : ''}
                        </div>
                        <div class="news-sidebar-section ${state.currentChannel === 'history' ? 'active' : ''}" data-channel="history">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            <span>历史记录</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        sidebar.querySelectorAll('[data-channel]').forEach(item => {
            item.addEventListener('click', () => {
                state.currentChannel = item.dataset.channel;
                state.selectedArticleId = null;
                saveState();
                renderSidebar();
                renderContent();
            });
        });

        const searchInput = sidebar.querySelector(`#news-search-${windowId}`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                renderContent();
            });
        }
    }

    // ============ Render Content ============
    function getFilteredArticles() {
        let list = articles;
        if (state.currentChannel === 'today') {
            list = articles.slice(0, 8);
        } else if (state.currentChannel === 'saved') {
            list = articles.filter(a => state.savedArticles.includes(a.id));
        } else if (state.currentChannel === 'history') {
            list = state.readingHistory.map(id => getArticleById(id)).filter(Boolean);
        } else {
            list = articles.filter(a => a.channel === state.currentChannel);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.source.toLowerCase().includes(q));
        }
        return list;
    }

    function renderContent() {
        if (state.selectedArticleId) {
            renderArticleDetail();
            return;
        }

        const list = getFilteredArticles();
        const channelInfo = channels.find(c => c.id === state.currentChannel);
        const titles = {
            'today': '今日',
            'saved': '已保存',
            'history': '历史记录'
        };
        const title = titles[state.currentChannel] || (channelInfo ? channelInfo.name : '新闻');

        if (list.length === 0) {
            body.innerHTML = `
                <div class="news-content news-content-empty">
                    <div class="news-empty-icon">${state.currentChannel === 'saved' ? '🔖' : '🔍'}</div>
                    <div class="news-empty-title">${state.currentChannel === 'saved' ? '还没有保存的文章' : (searchQuery ? '未找到相关文章' : '暂无文章')}</div>
                    <div class="news-empty-desc">${state.currentChannel === 'saved' ? '阅读文章时点击保存按钮，稍后在此查看' : '试试其他关键词或频道'}</div>
                </div>
            `;
            return;
        }

        // Featured article (first in today view)
        const featured = state.currentChannel === 'today' ? list[0] : null;
        const restList = featured ? list.slice(1) : list;

        body.innerHTML = `
            <div class="news-content">
                <div class="news-content-inner">
                    <div class="news-header">
                        <h1 class="news-header-title">${title}</h1>
                        <div class="news-header-date">${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</div>
                    </div>
                    ${featured ? renderFeaturedCard(featured) : ''}
                    ${restList.length > 0 ? `
                        <div class="news-list">
                            ${restList.map(article => renderArticleCard(article)).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        body.querySelectorAll('[data-article-id]').forEach(card => {
            card.addEventListener('click', () => {
                state.selectedArticleId = card.dataset.articleId;
                if (!state.readingHistory.includes(state.selectedArticleId)) {
                    state.readingHistory.unshift(state.selectedArticleId);
                    if (state.readingHistory.length > 50) state.readingHistory.pop();
                }
                saveState();
                renderContent();
            });
        });
    }

    function renderFeaturedCard(article) {
        const hero = getHeroImage(article);
        const isSaved = state.savedArticles.includes(article.id);
        return `
            <div class="news-featured-card" data-article-id="${article.id}">
                <div class="news-featured-image" style="background:${hero.gradient};">
                    <span class="news-featured-icon">${hero.icon}</span>
                    <div class="news-featured-badge">${article.category}</div>
                </div>
                <div class="news-featured-info">
                    <div class="news-featured-source" style="color:${article.sourceColor};">${article.source}</div>
                    <h2 class="news-featured-title">${escapeHtml(article.title)}</h2>
                    <p class="news-featured-summary">${escapeHtml(article.summary)}</p>
                    <div class="news-featured-meta">
                        <span>${formatTime(article.time)}</span>
                        <span>·</span>
                        <span>${article.readTime} 分钟阅读</span>
                        ${isSaved ? '<span class="news-saved-tag">已保存</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    function renderArticleCard(article) {
        const hero = getHeroImage(article);
        const isSaved = state.savedArticles.includes(article.id);
        const isRead = state.readingHistory.includes(article.id);
        return `
            <div class="news-card" data-article-id="${article.id}">
                <div class="news-card-image" style="background:${hero.gradient};">
                    <span class="news-card-icon">${hero.icon}</span>
                </div>
                <div class="news-card-content">
                    <div class="news-card-source" style="color:${article.sourceColor};">${article.source}</div>
                    <h3 class="news-card-title ${isRead ? 'read' : ''}">${escapeHtml(article.title)}</h3>
                    <p class="news-card-summary">${escapeHtml(article.summary)}</p>
                    <div class="news-card-meta">
                        <span>${formatTime(article.time)}</span>
                        <span>·</span>
                        <span>${article.readTime} 分钟阅读</span>
                        ${isSaved ? '<span class="news-saved-tag">已保存</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // ============ Render Article Detail ============
    function renderArticleDetail() {
        const article = getArticleById(state.selectedArticleId);
        if (!article) {
            state.selectedArticleId = null;
            renderContent();
            return;
        }
        const hero = getHeroImage(article);
        const isSaved = state.savedArticles.includes(article.id);
        const relatedArticles = articles.filter(a => a.channel === article.channel && a.id !== article.id).slice(0, 3);

        body.innerHTML = `
            <div class="news-article">
                <div class="news-article-toolbar">
                    <button class="news-back-btn" id="news-back-${windowId}">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        <span>返回</span>
                    </button>
                    <div class="news-article-toolbar-actions">
                        <button class="news-icon-btn" id="news-share-${windowId}" title="分享">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                        </button>
                        <button class="news-icon-btn ${isSaved ? 'active' : ''}" id="news-save-${windowId}" title="${isSaved ? '取消保存' : '保存'}">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        </button>
                        <button class="news-icon-btn" id="news-text-size-${windowId}" title="字体大小">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
                        </button>
                    </div>
                </div>
                <div class="news-article-scroll">
                    <article class="news-article-body news-font-${state.fontSize}">
                        <div class="news-article-hero" style="background:${hero.gradient};">
                            <span class="news-article-hero-icon">${hero.icon}</span>
                        </div>
                        <div class="news-article-content">
                            <div class="news-article-category" style="color:${article.sourceColor};">${article.category}</div>
                            <h1 class="news-article-title">${escapeHtml(article.title)}</h1>
                            <div class="news-article-byline">
                                <span>来源：${escapeHtml(article.source)}</span>
                                <span>·</span>
                                <span>${formatTime(article.time)}</span>
                                <span>·</span>
                                <span>${article.readTime} 分钟阅读</span>
                            </div>
                            <div class="news-article-text">${article.content.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}</div>
                            ${relatedArticles.length > 0 ? `
                                <div class="news-related">
                                    <h3 class="news-related-title">相关阅读</h3>
                                    ${relatedArticles.map(related => {
                                        const rHero = getHeroImage(related);
                                        return `
                                            <div class="news-related-card" data-article-id="${related.id}">
                                                <div class="news-related-image" style="background:${rHero.gradient};">
                                                    <span>${rHero.icon}</span>
                                                </div>
                                                <div class="news-related-info">
                                                    <div class="news-related-source">${related.source}</div>
                                                    <div class="news-related-card-title">${escapeHtml(related.title)}</div>
                                                    <div class="news-related-meta">${formatTime(related.time)}</div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </article>
                </div>
            </div>
        `;

        body.querySelector(`#news-back-${windowId}`).addEventListener('click', () => {
            state.selectedArticleId = null;
            saveState();
            renderContent();
        });

        body.querySelector(`#news-save-${windowId}`).addEventListener('click', () => {
            const idx = state.savedArticles.indexOf(article.id);
            if (idx > -1) {
                state.savedArticles.splice(idx, 1);
            } else {
                state.savedArticles.unshift(article.id);
            }
            saveState();
            renderArticleDetail();
            renderSidebar();
        });

        body.querySelector(`#news-share-${windowId}`).addEventListener('click', () => {
            if (window.showToast) {
                window.showToast(`已复制「${article.title}」的链接`, 'success');
            }
        });

        body.querySelector(`#news-text-size-${windowId}`).addEventListener('click', () => {
            const sizes = ['small', 'medium', 'large'];
            const idx = sizes.indexOf(state.fontSize);
            state.fontSize = sizes[(idx + 1) % sizes.length];
            saveState();
            renderArticleDetail();
        });

        body.querySelectorAll('[data-article-id]').forEach(card => {
            card.addEventListener('click', () => {
                state.selectedArticleId = card.dataset.articleId;
                if (!state.readingHistory.includes(state.selectedArticleId)) {
                    state.readingHistory.unshift(state.selectedArticleId);
                    if (state.readingHistory.length > 50) state.readingHistory.pop();
                }
                saveState();
                renderContent();
            });
        });
    }

    // ============ Render Toolbar ============
    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = '';
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    render();
};
