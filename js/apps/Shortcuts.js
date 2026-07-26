// Shortcuts - 快捷指令
window.renderShortcuts = function(body, sidebar, toolbar, windowId) {
    const shortcuts = [
        { id: 1, name: '早上好', icon: '☀️', color: '#FF9500', desc: '播报天气、新闻和日程', category: '我的快捷指令', runs: 156 },
        { id: 2, name: '回家路线', icon: '🏠', color: '#34C759', desc: '导航回家并发送预计到达时间', category: '我的快捷指令', runs: 89 },
        { id: 3, name: '视频转 GIF', icon: '🎬', color: '#AF52DE', desc: '快速将视频转换为 GIF', category: '我的快捷指令', runs: 42 },
        { id: 4, name: '快捷记账', icon: '💰', color: '#FF3B30', desc: '快速记录一笔支出', category: '我的快捷指令', runs: 231 },
        { id: 5, name: '番茄钟', icon: '🍅', color: '#FF2D55', desc: '25 分钟专注计时器', category: '我的快捷指令', runs: 78 },
        { id: 6, name: '每日一句', icon: '📖', color: '#007AFF', desc: '获取每日名言', category: '我的快捷指令', runs: 45 },
        { id: 7, name: '下载 YouTube 视频', icon: '📥', color: '#FF3B30', desc: '下载 YouTube 视频到相册', category: '共享', runs: 12 },
        { id: 8, name: '照片拼图', icon: '🖼️', color: '#5AC8FA', desc: '将多张照片合成一张', category: '共享', runs: 34 },
        { id: 9, name: '扫描二维码', icon: '📷', color: '#34C759', desc: '快速扫描并打开链接', category: '效率', runs: 67 },
        { id: 10, name: '翻译文本', icon: '🌐', color: '#007AFF', desc: '翻译选中的文字', category: '效率', runs: 55 },
        { id: 11, name: '生成二维码', icon: '🔲', color: '#1D1D1F', desc: '为文本生成二维码', category: '工具', runs: 23 },
        { id: 12, name: '天气预报', icon: '🌤️', color: '#5AC8FA', desc: '获取未来 7 天天气', category: '生活', runs: 98 },
    ];

    let activeCategory = 'all';
    const categories = [
        { id: 'all', name: '所有快捷指令', icon: '📋' },
        { id: '我的快捷指令', name: '我的快捷指令', icon: '⭐' },
        { id: '共享', name: '共享', icon: '🔗' },
        { id: '效率', name: '效率', icon: '⚡' },
        { id: '工具', name: '工具', icon: '🔧' },
        { id: '生活', name: '生活', icon: '🌱' },
    ];

    function render() {
        body.innerHTML = `
            <div class="shortcuts-container">
                <div class="shortcuts-sidebar">
                    <div class="shortcuts-sidebar-header">
                        <div class="shortcuts-title">快捷指令</div>
                    </div>
                    ${categories.map(cat => `
                        <div class="shortcuts-category ${activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                            <span class="shortcuts-cat-icon">${cat.icon}</span>
                            <span>${cat.name}</span>
                            <span class="shortcuts-cat-count">${cat.id === 'all' ? shortcuts.length : shortcuts.filter(s => s.category === cat.id).length}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="shortcuts-main">
                    <div class="shortcuts-toolbar">
                        <div class="shortcuts-main-title">
                            ${activeCategory === 'all' ? '所有快捷指令' : categories.find(c => c.id === activeCategory)?.name}
                        </div>
                        <div class="shortcuts-search">
                            <input type="text" id="sc-search" placeholder="搜索" style="padding:6px 10px;border:1px solid #ddd;border-radius:6px;font-size:12px;width:180px;">
                        </div>
                    </div>
                    <div class="shortcuts-grid">
                        ${(activeCategory === 'all' ? shortcuts : shortcuts.filter(s => s.category === activeCategory)).map(s => `
                            <div class="shortcut-card" data-id="${s.id}" style="background:linear-gradient(135deg, ${s.color}dd, ${s.color}aa);">
                                <div class="shortcut-card-icon">${s.icon}</div>
                                <div class="shortcut-card-name">${s.name}</div>
                                <div class="shortcut-card-play">▶</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.shortcuts-category').forEach(cat => {
            cat.addEventListener('click', () => {
                activeCategory = cat.dataset.cat;
                render();
            });
        });

        body.querySelectorAll('.shortcut-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const sc = shortcuts.find(s => s.id === id);
                if (sc) {
                    sc.runs++;
                    card.classList.add('running');
                    setTimeout(() => {
                        card.classList.remove('running');
                        alert(`「${sc.name}」运行完成！\n已运行 ${sc.runs} 次`);
                    }, 800);
                }
            });
        });
    }

    render();
};
