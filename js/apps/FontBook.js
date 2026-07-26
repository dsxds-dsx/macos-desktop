window.renderFontBook = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#fff';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    let fonts = [
        { name: 'SF Pro', family: 'System', style: 'Regular', selected: true, preview: '敏捷的棕色狐狸跳过懒狗', sampleText: 'The quick brown fox jumps over the lazy dog' },
        { name: 'SF Pro Display', family: 'System', style: 'Light', selected: false, preview: '敏捷的棕色狐狸跳过懒狗', sampleText: 'The quick brown fox' },
        { name: 'SF Mono', family: 'System', style: 'Regular', selected: false, preview: 'const x = 42;', sampleText: 'function hello() { }' },
        { name: 'Helvetica Neue', family: 'Helvetica', style: 'Regular', selected: false, preview: 'Typography is the art', sampleText: 'ABCDEFGHIJKLM' },
        { name: 'Helvetica Neue Bold', family: 'Helvetica', style: 'Bold', selected: false, preview: 'Typography is the art', sampleText: 'ABCDEFGHIJKLM' },
        { name: 'Arial', family: 'Arial', style: 'Regular', selected: false, preview: 'Hello World 123', sampleText: 'ABCDEFGHIJKLMNOP' },
        { name: 'Times New Roman', family: 'Times', style: 'Regular', selected: false, preview: 'To be or not to be', sampleText: 'ABCDEFGHIJKLMNOPQ' },
        { name: 'Courier New', family: 'Courier', style: 'Regular', selected: false, preview: 'print("Hello")', sampleText: 'ABCDEFGHIJKLMNOPQRS' },
        { name: 'Georgia', family: 'Georgia', style: 'Regular', selected: false, preview: 'Serif fonts are elegant', sampleText: 'ABCDEFGHIJK' },
        { name: 'Verdana', family: 'Verdana', style: 'Regular', selected: false, preview: 'Sans-serif for screens', sampleText: 'ABCDEFGHIJKLMN' },
        { name: 'Menlo', family: 'Monospace', style: 'Regular', selected: false, preview: 'code(); // comment', sampleText: 'ABCDEFGHIJKLMNOPQR' },
        { name: 'Monaco', family: 'Monospace', style: 'Regular', selected: false, preview: 'let result = [];', sampleText: 'ABCDEFGHIJKLMNO' },
        { name: 'PingFang SC', family: 'Chinese', style: 'Regular', selected: false, preview: '中文字体预览', sampleText: '一二三四五六七八九十' },
        { name: 'PingFang SC Bold', family: 'Chinese', style: 'Semibold', selected: false, preview: '中文字体粗体', sampleText: '一二三四五六七八九十' },
        { name: 'Hiragino Sans GB', family: 'Chinese', style: 'Regular', selected: false, preview: '冬青黑体字体', sampleText: '的一是在不了有和人这中大为上个国我以要他' },
        { name: 'STHeiti', family: 'Chinese', style: 'Medium', selected: false, preview: '华文黑体', sampleText: '黑体是常用的中文字体' },
        { name: 'STSong', family: 'Chinese', style: 'Regular', selected: false, preview: '华文宋体', sampleText: '宋体是经典的印刷字体' },
        { name: 'STKaiti', family: 'Chinese', style: 'Regular', selected: false, preview: '华文楷体', sampleText: '楷体模仿手写风格' }
    ];

    let selectedFamily = '所有字体';
    let searchText = '';
    let previewSize = 24;

    const families = ['所有字体', 'System', 'Helvetica', 'Arial', 'Times', 'Courier', 'Georgia', 'Verdana', 'Monospace', 'Chinese'];

    function getFilteredFonts() {
        return fonts.filter(f => {
            const matchFamily = selectedFamily === '所有字体' || f.family === selectedFamily;
            const matchSearch = f.name.toLowerCase().includes(searchText.toLowerCase());
            return matchFamily && matchSearch;
        });
    }

    function getSelectedFont() {
        return fonts.find(f => f.selected) || fonts[0];
    }

    function render() {
        const sel = getSelectedFont();
        const filtered = getFilteredFonts();
        content.innerHTML = `
            <div style="display:flex;flex:1;overflow:hidden;">
                <div style="width:200px;background:#f5f5f5;border-right:1px solid #ddd;display:flex;flex-direction:column;">
                    <div style="padding:12px;border-bottom:1px solid #ddd;">
                        <div style="position:relative;">
                            <input type="text" id="fb-search" placeholder="搜索字体" value="${searchText}" style="width:100%;padding:6px 10px 6px 28px;border:1px solid #ccc;border-radius:6px;font-size:12px;box-sizing:border-box;">
                            <span style="position:absolute;left:8px;top:50%;transform:translateY(-50%);color:#999;font-size:12px;">🔍</span>
                        </div>
                    </div>
                    <div style="flex:1;overflow-y:auto;" id="fb-familyList">
                        ${families.map(fam => `<div class="fb-family-item" data-fam="${fam}" style="padding:10px 16px;cursor:pointer;font-size:13px;${fam === selectedFamily ? 'background:var(--accent-blue);color:#fff;' : ''}">${fam}</div>`).join('')}
                    </div>
                </div>
                <div style="width:300px;border-right:1px solid #ddd;display:flex;flex-direction:column;">
                    <div style="padding:10px;border-bottom:1px solid #ddd;display:flex;align-items:center;gap:8px;">
                        <span style="font-size:12px;color:#666;">字号</span>
                        <input type="range" id="fb-size" min="10" max="72" value="${previewSize}" style="flex:1;">
                        <span style="font-size:12px;width:30px;text-align:right;">${previewSize}</span>
                    </div>
                    <div style="flex:1;overflow-y:auto;" id="fb-fontList"></div>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
                    <div style="padding:20px;border-bottom:1px solid #ddd;background:#fafafa;">
                        <div style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:8px;letter-spacing:0.5px;">字体信息</div>
                        <div style="font-size:28px;font-weight:300;margin-bottom:4px;font-family:'${sel.name}', -apple-system, sans-serif;">${sel.name}</div>
                        <div style="font-size:13px;color:#666;">${sel.family} · ${sel.style}</div>
                    </div>
                    <div style="flex:1;overflow-y:auto;padding:30px;background:#fff;">
                        <div style="margin-bottom:40px;">
                            <div style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:16px;letter-spacing:0.5px;">预览</div>
                            <div contenteditable="true" id="fb-preview" style="font-size:${previewSize}px;font-family:'${sel.name}', -apple-system, sans-serif;line-height:1.5;outline:none;min-height:80px;padding:10px;border:1px solid transparent;border-radius:6px;">${sel.preview}</div>
                        </div>
                        <div style="margin-bottom:40px;">
                            <div style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:16px;letter-spacing:0.5px;">字母表</div>
                            <div style="font-size:${Math.min(previewSize, 36)}px;font-family:'${sel.name}', -apple-system, sans-serif;line-height:1.8;">${sel.sampleText}</div>
                        </div>
                        <div style="margin-bottom:40px;">
                            <div style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:16px;letter-spacing:0.5px;">数字</div>
                            <div style="font-size:${Math.min(previewSize, 36)}px;font-family:'${sel.name}', -apple-system, sans-serif;">0123456789</div>
                        </div>
                        <div>
                            <div style="font-size:11px;color:#888;text-transform:uppercase;margin-bottom:16px;letter-spacing:0.5px;">字号对比</div>
                            <div style="font-family:'${sel.name}', -apple-system, sans-serif;">
                                <div style="font-size:72px;line-height:1.2;margin-bottom:8px;">${sel.name}</div>
                                <div style="font-size:48px;line-height:1.2;margin-bottom:8px;opacity:0.9;">${sel.name}</div>
                                <div style="font-size:36px;line-height:1.3;margin-bottom:8px;opacity:0.8;">${sel.name}</div>
                                <div style="font-size:24px;line-height:1.4;margin-bottom:8px;opacity:0.75;">${sel.name}</div>
                                <div style="font-size:18px;line-height:1.5;margin-bottom:8px;opacity:0.7;">${sel.name}</div>
                                <div style="font-size:14px;line-height:1.5;opacity:0.65;">${sel.name}</div>
                                <div style="font-size:12px;line-height:1.5;opacity:0.6;">${sel.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const listEl = content.querySelector('#fb-fontList');
        filtered.forEach(f => {
            const item = document.createElement('div');
            item.className = 'fb-font-item';
            item.style.cssText = `padding:14px 16px;cursor:pointer;border-bottom:1px solid #f0f0f0;${f.selected ? 'background:#e8f0fe;' : ''}`;
            item.innerHTML = `<div style="font-size:${Math.min(previewSize - 4, 24)}px;font-family:'${f.name}', -apple-system, sans-serif;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.preview}</div><div style="font-size:11px;color:#888;">${f.name} · ${f.style}</div>`;
            item.onclick = () => {
                fonts.forEach(x => x.selected = false);
                f.selected = true;
                render();
            };
            listEl.appendChild(item);
        });

        content.querySelectorAll('.fb-family-item').forEach(item => {
            item.onclick = () => { selectedFamily = item.dataset.fam; render(); };
        });

        content.querySelector('#fb-search').oninput = (e) => { searchText = e.target.value; render(); };
        content.querySelector('#fb-size').oninput = (e) => { previewSize = parseInt(e.target.value); render(); };
    }

    render();
};
