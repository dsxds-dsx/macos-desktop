window.renderTrash = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#fff';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    let trashItems = JSON.parse(localStorage.getItem('trash_items') || JSON.stringify([
        { id: 1, name: '旧报告.pdf', type: 'pdf', icon: '📄', size: '2.4 MB', deleted: Date.now() - 86400000 * 2, original: '文稿' },
        { id: 2, name: '屏幕截图 2024-01-10.png', type: 'image', icon: '🖼️', size: '856 KB', deleted: Date.now() - 86400000 * 5, original: '桌面' },
        { id: 3, name: 'temp_folder', type: 'folder', icon: '📁', size: '--', deleted: Date.now() - 86400000, original: '下载' },
        { id: 4, name: '旧项目备份.zip', type: 'archive', icon: '🗜️', size: '156 MB', deleted: Date.now() - 86400000 * 7, original: '桌面' },
        { id: 5, name: '草稿.txt', type: 'text', icon: '📝', size: '4 KB', deleted: Date.now() - 3600000 * 3, original: '文稿' },
        { id: 6, name: '未使用的应用.app', type: 'app', icon: '📱', size: '45 MB', deleted: Date.now() - 86400000 * 14, original: '应用程序' },
        { id: 7, name: '旧照片.jpg', type: 'image', icon: '🖼️', size: '3.2 MB', deleted: Date.now() - 86400000 * 3, original: '图片' }
    ]));

    let selectedItems = [];
    let viewMode = 'list';
    let sortBy = 'date';

    function save() {
        localStorage.setItem('trash_items', JSON.stringify(trashItems));
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
        if (diff < 86400000 * 7) return Math.floor(diff / 86400000) + ' 天前';
        return date.toLocaleDateString('zh-CN');
    }

    function getSortedItems() {
        return [...trashItems].sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'size') {
                const getSize = (s) => {
                    if (s === '--') return 0;
                    const num = parseFloat(s);
                    if (s.includes('GB')) return num * 1024;
                    if (s.includes('MB')) return num;
                    if (s.includes('KB')) return num / 1024;
                    return num;
                };
                return getSize(b.size) - getSize(a.size);
            }
            return b.deleted - a.deleted;
        });
    }

    function render() {
        const items = getSortedItems();
        content.innerHTML = `
            <div style="height:52px;background:linear-gradient(180deg,#fafafa,#f0f0f0);border-bottom:1px solid #ddd;display:flex;align-items:center;padding:0 16px;gap:10px;">
                <button id="trash-back" style="padding:6px 12px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;font-size:12px;${selectedItems.length === 0 ? 'opacity:0.5;pointer-events:none;' : ''}">放回原处</button>
                <button id="trash-delete" style="padding:6px 12px;border:1px solid #ff3b30;border-radius:6px;background:#fff;color:#ff3b30;cursor:pointer;font-size:12px;${selectedItems.length === 0 ? 'opacity:0.5;pointer-events:none;' : ''}">删除选中</button>
                <div style="width:1px;height:24px;background:#ddd;margin:0 4px;"></div>
                <button id="trash-empty" style="padding:6px 16px;border:none;border-radius:6px;background:#ff3b30;color:#fff;cursor:pointer;font-size:12px;font-weight:500;${items.length === 0 ? 'opacity:0.5;pointer-events:none;' : ''}">清倒废纸篓</button>
                <div style="flex:1;"></div>
                <div style="display:flex;background:#e8e8e8;border-radius:6px;padding:2px;">
                    <button class="trash-viewBtn" data-view="list" style="padding:5px 12px;border:none;border-radius:4px;background:${viewMode === 'list' ? '#fff' : 'transparent'};cursor:pointer;font-size:12px;">☰ 列表</button>
                    <button class="trash-viewBtn" data-view="grid" style="padding:5px 12px;border:none;border-radius:4px;background:${viewMode === 'grid' ? '#fff' : 'transparent'};cursor:pointer;font-size:12px;">▦ 图标</button>
                </div>
                <select id="trash-sort" style="padding:5px 10px;border:1px solid #ccc;border-radius:6px;background:#fff;font-size:12px;">
                    <option value="date" ${sortBy === 'date' ? 'selected' : ''}>按删除日期</option>
                    <option value="name" ${sortBy === 'name' ? 'selected' : ''}>按名称</option>
                    <option value="size" ${sortBy === 'size' ? 'selected' : ''}>按大小</option>
                </select>
            </div>
            ${items.length === 0 ? `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#999;">
                    <div style="font-size:80px;margin-bottom:16px;">🗑️</div>
                    <h3 style="margin:0;font-size:18px;font-weight:500;">废纸篓是空的</h3>
                    <p style="margin:8px 0 0;font-size:13px;">当您删除项目时，它们会暂时存放在这里</p>
                </div>
            ` : `
                <div style="flex:1;overflow:auto;" id="trash-content">
                    ${viewMode === 'list' ? renderListView(items) : renderGridView(items)}
                </div>
                <div style="height:28px;background:#f5f5f5;border-top:1px solid #ddd;display:flex;align-items:center;padding:0 16px;font-size:11px;color:#888;gap:16px;">
                    <span>${items.length} 个项目</span>
                    <span>可获得约 ${items.reduce((a, i) => {
                        const size = parseFloat(i.size);
                        if (i.size.includes('MB')) return a + size;
                        if (i.size.includes('KB')) return a + size / 1024;
                        if (i.size.includes('GB')) return a + size * 1024;
                        return a;
                    }, 0).toFixed(1)} MB 空间</span>
                </div>
            `}
            <div id="trash-warning" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);z-index:1000;align-items:center;justify-content:center;">
                <div style="background:#fff;border-radius:12px;padding:24px;width:360px;box-shadow:0 10px 40px rgba(0,0,0,0.2);">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                        <div style="width:40px;height:40px;border-radius:50%;background:#ff3b30;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;">⚠️</div>
                        <div>
                            <h3 style="margin:0;font-size:15px;font-weight:600;">确定要清倒废纸篓吗？</h3>
                            <p style="margin:4px 0 0;font-size:12px;color:#666;">此操作将永久删除废纸篓中的 ${items.length} 个项目。</p>
                        </div>
                    </div>
                    <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
                        <button id="trash-cancelEmpty" style="padding:8px 18px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;">取消</button>
                        <button id="trash-confirmEmpty" style="padding:8px 18px;border:none;border-radius:8px;background:#ff3b30;color:#fff;cursor:pointer;font-size:13px;font-weight:500;">清倒废纸篓</button>
                    </div>
                </div>
            </div>
        `;

        content.querySelector('#trash-back').onclick = () => {
            trashItems = trashItems.filter(i => !selectedItems.includes(i.id));
            selectedItems = [];
            save(); render();
        };

        content.querySelector('#trash-delete').onclick = () => {
            if (confirm(`确定要永久删除 ${selectedItems.length} 个项目吗？`)) {
                trashItems = trashItems.filter(i => !selectedItems.includes(i.id));
                selectedItems = [];
                save(); render();
            }
        };

        content.querySelector('#trash-empty').onclick = () => {
            content.querySelector('#trash-warning').style.display = 'flex';
        };

        content.querySelector('#trash-cancelEmpty').onclick = () => {
            content.querySelector('#trash-warning').style.display = 'none';
        };

        content.querySelector('#trash-confirmEmpty').onclick = () => {
            trashItems = [];
            selectedItems = [];
            content.querySelector('#trash-warning').style.display = 'none';
            save(); render();
        };

        content.querySelectorAll('.trash-viewBtn').forEach(btn => {
            btn.onclick = () => { viewMode = btn.dataset.view; render(); };
        });

        content.querySelector('#trash-sort').onchange = (e) => { sortBy = e.target.value; render(); };

        content.querySelectorAll('.trash-item').forEach(item => {
            item.onclick = (e) => {
                const id = parseInt(item.dataset.id);
                if (e.metaKey || e.ctrlKey) {
                    if (selectedItems.includes(id)) selectedItems = selectedItems.filter(i => i !== id);
                    else selectedItems.push(id);
                } else {
                    selectedItems = [id];
                }
                render();
            };
            item.ondblclick = () => {
                alert(`Quick Look 预览：${item.dataset.name}\n（这是演示应用）`);
            };
        });
    }

    function renderListView(items) {
        return `
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                    <tr style="background:#f5f5f5;border-bottom:1px solid #ddd;">
                        <th style="width:40px;padding:8px;text-align:left;"></th>
                        <th style="padding:8px;text-align:left;font-weight:600;font-size:11px;color:#666;">名称</th>
                        <th style="width:100px;padding:8px;text-align:left;font-weight:600;font-size:11px;color:#666;">大小</th>
                        <th style="width:120px;padding:8px;text-align:left;font-weight:600;font-size:11px;color:#666;">原位置</th>
                        <th style="width:120px;padding:8px;text-align:left;font-weight:600;font-size:11px;color:#666;">删除日期</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr class="trash-item" data-id="${item.id}" data-name="${item.name}" style="cursor:pointer;border-bottom:1px solid #f0f0f0;${selectedItems.includes(item.id) ? 'background:#e3f2fd;' : ''}">
                            <td style="padding:8px;"><input type="checkbox" ${selectedItems.includes(item.id) ? 'checked' : ''} style="pointer-events:none;"></td>
                            <td style="padding:8px;display:flex;align-items:center;gap:10px;"><span style="font-size:22px;">${item.icon}</span>${item.name}</td>
                            <td style="padding:8px;color:#666;">${item.size}</td>
                            <td style="padding:8px;color:#666;">${item.original}</td>
                            <td style="padding:8px;color:#666;">${formatDate(item.deleted)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function renderGridView(items) {
        return `
            <div style="padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:20px;">
                ${items.map(item => `
                    <div class="trash-item" data-id="${item.id}" data-name="${item.name}" style="cursor:pointer;text-align:center;padding:12px;border-radius:8px;${selectedItems.includes(item.id) ? 'background:#e3f2fd;' : ''}">
                        <div style="font-size:48px;margin-bottom:8px;${selectedItems.includes(item.id) ? 'filter:opacity(0.8);' : ''}">${item.icon}</div>
                        <div style="font-size:11px;word-break:break-word;line-height:1.3;">${item.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    render();
};
