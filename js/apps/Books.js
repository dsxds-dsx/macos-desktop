window.renderBooks = function(body, sidebar, toolbar, windowId) {
    let selectedBookId = null;
    let currentSection = 'library';

    const books = [
        { id: '1', title: '三体', author: '刘慈欣', cover: '📚', color: 'linear-gradient(135deg, #1a1a2e, #16213e)', progress: 65 },
        { id: '2', title: '百年孤独', author: '加西亚·马尔克斯', cover: '📖', color: 'linear-gradient(135deg, #f39c12, #e74c3c)', progress: 100 },
        { id: '3', title: '活着', author: '余华', cover: '📕', color: 'linear-gradient(135deg, #c0392b, #8e44ad)', progress: 30 },
        { id: '4', title: '人类简史', author: '尤瓦尔·赫拉利', cover: '📗', color: 'linear-gradient(135deg, #27ae60, #2c3e50)', progress: 0 },
        { id: '5', title: '小王子', author: '圣埃克苏佩里', cover: '📘', color: 'linear-gradient(135deg, #3498db, #2980b9)', progress: 100 },
        { id: '6', title: '围城', author: '钱钟书', cover: '📙', color: 'linear-gradient(135deg, #d35400, #c0392b)', progress: 80 }
    ];

    const sections = [
        { id: 'library', name: '书库', icon: '📚' },
        { id: 'reading', name: '正在阅读', icon: '📖' },
        { id: 'finished', name: '已读完', icon: '✅' },
        { id: 'bookstore', name: '书店', icon: '🏪' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:200px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);padding:16px;">
                <div style="font-size:22px;font-weight:700;margin-bottom:20px;">📚 图书</div>
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
                selectedBookId = null;
                render();
            });
        });
    }

    function renderContent() {
        if (selectedBookId) {
            const book = books.find(b => b.id === selectedBookId);
            body.innerHTML = `
                <div style="flex:1;padding:40px;background:var(--bg-elevated);overflow-y:auto;">
                    <button id="back-btn" style="background:none;border:none;color:var(--accent-blue);cursor:pointer;font-size:14px;margin-bottom:24px;">← 返回书库</button>
                    <div style="display:flex;gap:32px;max-width:800px;margin:0 auto;">
                        <div style="width:180px;height:260px;border-radius:8px;background:${book.color};display:flex;align-items:center;justify-content:center;font-size:72px;box-shadow:0 8px 30px rgba(0,0,0,0.3);flex-shrink:0;">${book.cover}</div>
                        <div style="flex:1;padding-top:16px;">
                            <h1 style="font-size:28px;font-weight:700;margin-bottom:8px;">${book.title}</h1>
                            <div style="font-size:16px;color:var(--text-tertiary);margin-bottom:24px;">${book.author}</div>
                            <div style="margin-bottom:24px;">
                                <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-tertiary);margin-bottom:6px;">
                                    <span>阅读进度</span>
                                    <span>${book.progress}%</span>
                                </div>
                                <div style="height:4px;background:var(--border-color);border-radius:2px;overflow:hidden;">
                                    <div style="height:100%;width:${book.progress}%;background:var(--accent-blue);border-radius:2px;"></div>
                                </div>
                            </div>
                            <div style="display:flex;gap:12px;">
                                <button style="padding:12px 32px;background:var(--accent-blue);color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:500;">${book.progress === 0 ? '开始阅读' : book.progress === 100 ? '重新阅读' : '继续阅读'}</button>
                            </div>
                            <div style="margin-top:32px;padding:24px;background:var(--button-bg);border-radius:12px;">
                                <div style="font-size:13px;font-weight:600;margin-bottom:12px;">简介</div>
                                <div style="font-size:13px;line-height:1.8;color:var(--text-secondary);">这是一本精彩的书籍，讲述了一个引人入胜的故事。作者以独特的视角和细腻的笔触，为读者呈现了一个丰富多彩的世界。</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            body.querySelector('#back-btn').addEventListener('click', () => {
                selectedBookId = null;
                render();
            });
            return;
        }

        let displayBooks = books;
        let title = '全部图书';
        if (currentSection === 'reading') {
            displayBooks = books.filter(b => b.progress > 0 && b.progress < 100);
            title = '正在阅读';
        } else if (currentSection === 'finished') {
            displayBooks = books.filter(b => b.progress === 100);
            title = '已读完';
        } else if (currentSection === 'bookstore') {
            title = '书店';
        }

        body.innerHTML = `
            <div style="flex:1;padding:32px;background:var(--bg-elevated);overflow-y:auto;">
                <h1 style="font-size:28px;font-weight:700;margin-bottom:24px;">${title}</h1>
                ${currentSection === 'bookstore' ? `
                    <div style="text-align:center;padding:80px;color:var(--text-tertiary);">
                        <div style="font-size:64px;margin-bottom:16px;">🏪</div>
                        <div>书店功能即将推出</div>
                    </div>
                ` : `
                    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:24px;">
                        ${displayBooks.map(book => `
                            <div data-id="${book.id}" style="cursor:pointer;">
                                <div style="width:100%;aspect-ratio:2/3;border-radius:8px;background:${book.color};display:flex;align-items:center;justify-content:center;font-size:48px;box-shadow:0 4px 15px rgba(0,0,0,0.2);margin-bottom:8px;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${book.cover}</div>
                                <div style="font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${book.title}</div>
                                <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">${book.author}</div>
                                ${book.progress > 0 && book.progress < 100 ? `
                                    <div style="height:2px;background:var(--border-color);border-radius:1px;overflow:hidden;">
                                        <div style="height:100%;width:${book.progress}%;background:var(--accent-blue);border-radius:1px;"></div>
                                    </div>
                                ` : book.progress === 100 ? `
                                    <div style="font-size:11px;color:var(--accent-green);">✓ 已读完</div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
        body.querySelectorAll('[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                selectedBookId = item.dataset.id;
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
