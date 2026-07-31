// Font Book - 字体册 (macOS Sonoma)
window.renderFontBook = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_fontbook_v2';

    const fonts = [
        { name: 'SF Pro', family: 'System', style: 'Regular', kind: 'TrueType', preview: '敏捷的棕色狐狸跳过懒狗', sampleText: 'The quick brown fox jumps over the lazy dog' },
        { name: 'SF Pro Display', family: 'System', style: 'Light', kind: 'TrueType', preview: '敏捷的棕色狐狸跳过懒狗', sampleText: 'The quick brown fox' },
        { name: 'SF Pro Text', family: 'System', style: 'Regular', kind: 'TrueType', preview: '阅读体验', sampleText: 'Reading experience matters' },
        { name: 'SF Mono', family: 'System', style: 'Regular', kind: 'Monospace', preview: 'const x = 42;', sampleText: 'function hello() { }' },
        { name: 'Helvetica Neue', family: 'Helvetica', style: 'Regular', kind: 'TrueType', preview: 'Typography is the art', sampleText: 'ABCDEFGHIJKLM' },
        { name: 'Helvetica Neue', family: 'Helvetica', style: 'Bold', kind: 'TrueType', preview: 'Bold Typography', sampleText: 'ABCDEFGHIJKLM' },
        { name: 'Arial', family: 'Arial', style: 'Regular', kind: 'TrueType', preview: 'Hello World 123', sampleText: 'ABCDEFGHIJKLMNOP' },
        { name: 'Times New Roman', family: 'Times', style: 'Regular', kind: 'TrueType', preview: 'To be or not to be', sampleText: 'ABCDEFGHIJKLMNOPQ' },
        { name: 'Courier New', family: 'Courier', style: 'Regular', kind: 'Monospace', preview: 'print("Hello")', sampleText: 'ABCDEFGHIJKLMNOPQRS' },
        { name: 'Georgia', family: 'Georgia', style: 'Regular', kind: 'TrueType', preview: 'Serif fonts are elegant', sampleText: 'ABCDEFGHIJK' },
        { name: 'Verdana', family: 'Verdana', style: 'Regular', kind: 'TrueType', preview: 'Sans-serif for screens', sampleText: 'ABCDEFGHIJKLMN' },
        { name: 'Menlo', family: 'Monospace', style: 'Regular', kind: 'Monospace', preview: 'code(); // comment', sampleText: 'ABCDEFGHIJKLMNOPQR' },
        { name: 'Monaco', family: 'Monospace', style: 'Regular', kind: 'Monospace', preview: 'let result = [];', sampleText: 'ABCDEFGHIJKLMNO' },
        { name: 'PingFang SC', family: 'Chinese', style: 'Regular', kind: 'TrueType', preview: '中文字体预览', sampleText: '一二三四五六七八九十' },
        { name: 'PingFang SC', family: 'Chinese', style: 'Semibold', kind: 'TrueType', preview: '中文字体粗体', sampleText: '一二三四五六七八九十' },
        { name: 'Hiragino Sans GB', family: 'Chinese', style: 'Regular', kind: 'TrueType', preview: '冬青黑体字体', sampleText: '的一是在不了有和人这中大为上个国我以' },
        { name: 'STHeiti', family: 'Chinese', style: 'Medium', kind: 'TrueType', preview: '华文黑体', sampleText: '黑体是常用的中文字体' },
        { name: 'STSong', family: 'Chinese', style: 'Regular', kind: 'TrueType', preview: '华文宋体', sampleText: '宋体是经典的印刷字体' },
        { name: 'STKaiti', family: 'Chinese', style: 'Regular', kind: 'TrueType', preview: '华文楷体', sampleText: '楷体模仿手写风格' },
        { name: 'Avenir Next', family: 'Avenir', style: 'Regular', kind: 'TrueType', preview: 'Modern and clean', sampleText: 'ABCDEFGHIJKLMNOP' },
        { name: 'Futura', family: 'Futura', style: 'Regular', kind: 'TrueType', preview: 'Geometric design', sampleText: 'ABCDEFGHIJKLMNOP' }
    ];

    const collections = [
        { id: 'all', name: '所有字体', icon: 'grid' },
        { id: 'System', name: '系统', icon: 'system' },
        { id: 'Chinese', name: '中文字体', icon: 'cn' },
        { id: 'Helvetica', name: 'Helvetica', icon: 'font' },
        { id: 'Monospace', name: '等宽字体', icon: 'mono' },
        { id: 'favorites', name: '个人收藏', icon: 'star' },
        { id: 'recent', name: '最近使用', icon: 'clock' }
    ];

    function defaultData() {
        return {
            selectedFamily: 'all',
            searchText: '',
            previewSize: 24,
            selectedFontIdx: 0,
            favorites: [0, 13],
            recent: [0, 4, 13],
            customText: '敏捷的棕色狐狸跳过懒狗'
        };
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || defaultData();

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function showToast(text) {
        if (window.Toast) window.Toast.show(text);
        else if (window.toast) window.toast(text);
    }

    function getFilteredFonts() {
        let list = fonts;
        if (data.selectedFamily === 'favorites') {
            list = fonts.filter((_, i) => data.favorites.includes(i));
        } else if (data.selectedFamily === 'recent') {
            list = data.recent.map(i => fonts[i]).filter(Boolean);
        } else if (data.selectedFamily !== 'all') {
            list = fonts.filter(f => f.family === data.selectedFamily);
        }
        const q = data.searchText.toLowerCase().trim();
        if (q) list = list.filter(f => f.name.toLowerCase().includes(q) || f.style.toLowerCase().includes(q));
        return list;
    }

    function getSelectedFont() {
        return fonts[data.selectedFontIdx] || fonts[0];
    }

    function collectionIcon(icon) {
        const icons = {
            grid: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
            system: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>',
            cn: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14M9 4v16M15 4v16M5 16h14"/></svg>',
            font: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
            mono: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M7 10v4M11 10v4M15 10v4"/></svg>',
            star: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
            clock: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
        };
        return icons[icon] || icons.grid;
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="fb-sidebar">
                <div class="fb-sidebar-search">
                    <svg class="fb-search-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                    <input type="text" id="fb-search" class="fb-search-input" placeholder="搜索字体" value="${escapeHtml(data.searchText)}">
                </div>

                <div class="fb-collections">
                    <div class="fb-sidebar-label">字体集</div>
                    ${collections.map(c => {
                        let count = 0;
                        if (c.id === 'all') count = fonts.length;
                        else if (c.id === 'favorites') count = data.favorites.length;
                        else if (c.id === 'recent') count = data.recent.length;
                        else count = fonts.filter(f => f.family === c.id).length;
                        return `
                            <div class="fb-collection ${data.selectedFamily === c.id ? 'active' : ''}" data-coll="${c.id}">
                                <span class="fb-coll-icon">${collectionIcon(c.icon)}</span>
                                <span class="fb-coll-name">${escapeHtml(c.name)}</span>
                                <span class="fb-coll-count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        const input = sidebar.querySelector('#fb-search');
        input.addEventListener('input', (e) => {
            data.searchText = e.target.value;
            renderSidebar();
            renderContent();
        });

        sidebar.querySelectorAll('[data-coll]').forEach(el => {
            el.addEventListener('click', () => {
                data.selectedFamily = el.dataset.coll;
                const filtered = getFilteredFonts();
                if (filtered.length) {
                    const firstIdx = fonts.indexOf(filtered[0]);
                    if (firstIdx >= 0) data.selectedFontIdx = firstIdx;
                }
                save();
                render();
            });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        const sel = getSelectedFont();
        const isFav = data.favorites.includes(data.selectedFontIdx);
        toolbar.innerHTML = `
            <div class="fb-toolbar">
                <div class="fb-toolbar-left">
                    <button class="fb-tb-btn" id="fb-minus" title="缩小字号">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>
                    </button>
                    <div class="fb-size-display">${data.previewSize} pt</div>
                    <button class="fb-tb-btn" id="fb-plus" title="放大字号">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                </div>
                <div class="fb-toolbar-center">
                    <span class="fb-tb-font-name">${escapeHtml(sel.name)}</span>
                    <span class="fb-tb-font-style">${escapeHtml(sel.style)} · ${escapeHtml(sel.kind)}</span>
                </div>
                <div class="fb-toolbar-right">
                    <button class="fb-tb-btn ${isFav ? 'active' : ''}" id="fb-fav" title="${isFav ? '取消收藏' : '添加收藏'}">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </button>
                    <button class="fb-tb-btn" id="fb-info" title="显示信息">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </button>
                </div>
            </div>
        `;

        toolbar.querySelector('#fb-plus').addEventListener('click', () => {
            data.previewSize = Math.min(72, data.previewSize + 2);
            save();
            render();
        });
        toolbar.querySelector('#fb-minus').addEventListener('click', () => {
            data.previewSize = Math.max(10, data.previewSize - 2);
            save();
            render();
        });
        toolbar.querySelector('#fb-fav').addEventListener('click', () => {
            const idx = data.favorites.indexOf(data.selectedFontIdx);
            if (idx >= 0) {
                data.favorites.splice(idx, 1);
                showToast('已从收藏移除');
            } else {
                data.favorites.push(data.selectedFontIdx);
                showToast('已添加到收藏');
            }
            save();
            render();
        });
        toolbar.querySelector('#fb-info').addEventListener('click', () => {
            showToast(`字体信息：${sel.name} (${sel.kind})`);
        });
    }

    function renderContent() {
        const sel = getSelectedFont();
        const filtered = getFilteredFonts();
        const fontStack = `'${sel.name}', -apple-system, sans-serif`;

        body.innerHTML = `
            <div class="fb-content">
                <div class="fb-font-list" id="fb-fontList">
                    ${filtered.length ? filtered.map(f => {
                        const idx = fonts.indexOf(f);
                        const isActive = idx === data.selectedFontIdx;
                        const isFav = data.favorites.includes(idx);
                        return `
                            <div class="fb-font-item ${isActive ? 'active' : ''}" data-idx="${idx}">
                                <div class="fb-font-preview" style="font-size:${Math.min(data.previewSize, 28)}px;font-family:'${escapeHtml(f.name)}', -apple-system, sans-serif;">${escapeHtml(f.preview)}</div>
                                <div class="fb-font-meta">
                                    <span class="fb-font-name">${escapeHtml(f.name)}</span>
                                    <span class="fb-font-style-tag">${escapeHtml(f.style)}</span>
                                    ${isFav ? '<span class="fb-font-star">★</span>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('') : `<div class="fb-empty-list">未找到匹配字体</div>`}
                </div>

                <div class="fb-detail">
                    <div class="fb-detail-header">
                        <div class="fb-detail-name" style="font-family:${fontStack};">${escapeHtml(sel.name)}</div>
                        <div class="fb-detail-sub">
                            <span>${escapeHtml(sel.family)}</span>
                            <span class="fb-dot">·</span>
                            <span>${escapeHtml(sel.style)}</span>
                            <span class="fb-dot">·</span>
                            <span>${escapeHtml(sel.kind)}</span>
                        </div>
                        <div class="fb-detail-tags">
                            <span class="fb-tag">${fonts.filter(f => f.family === sel.family).length} 个字重</span>
                            <span class="fb-tag">${sel.kind}</span>
                        </div>
                    </div>

                    <div class="fb-detail-body">
                        <div class="fb-preview-section">
                            <div class="fb-section-label">自定义预览</div>
                            <div contenteditable="true" id="fb-custom-preview" class="fb-custom-preview" style="font-size:${data.previewSize}px;font-family:${fontStack};">${escapeHtml(data.customText)}</div>
                        </div>

                        <div class="fb-preview-section">
                            <div class="fb-section-label">字母表</div>
                            <div class="fb-alphabet" style="font-size:${Math.min(data.previewSize, 36)}px;font-family:${fontStack};">${escapeHtml(sel.sampleText)}</div>
                        </div>

                        <div class="fb-preview-section">
                            <div class="fb-section-label">数字与符号</div>
                            <div class="fb-numbers" style="font-size:${Math.min(data.previewSize, 36)}px;font-family:${fontStack};">0123456789 !@#$%^&*()</div>
                        </div>

                        <div class="fb-preview-section">
                            <div class="fb-section-label">字号对比</div>
                            <div class="fb-size-compare" style="font-family:${fontStack};">
                                <div style="font-size:64px;line-height:1.15;">${escapeHtml(sel.name)}</div>
                                <div style="font-size:40px;line-height:1.2;opacity:0.85;">${escapeHtml(sel.name)}</div>
                                <div style="font-size:28px;line-height:1.3;opacity:0.75;">${escapeHtml(sel.name)}</div>
                                <div style="font-size:20px;line-height:1.4;opacity:0.65;">${escapeHtml(sel.name)}</div>
                                <div style="font-size:14px;line-height:1.5;opacity:0.55;">${escapeHtml(sel.name)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('[data-idx]').forEach(el => {
            el.addEventListener('click', () => {
                data.selectedFontIdx = parseInt(el.dataset.idx);
                const rIdx = data.recent.indexOf(data.selectedFontIdx);
                if (rIdx >= 0) data.recent.splice(rIdx, 1);
                data.recent.unshift(data.selectedFontIdx);
                data.recent = data.recent.slice(0, 10);
                save();
                render();
            });
        });

        const customPreview = body.querySelector('#fb-custom-preview');
        if (customPreview) {
            customPreview.addEventListener('input', (e) => {
                data.customText = e.target.textContent;
                save();
            });
        }
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
