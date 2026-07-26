window.renderStickies = function(body, sidebar, toolbar, windowId) {
    let noteContent = localStorage.getItem('macos_stickies') || '欢迎使用便签！\n\n这是一个黄色的便签纸，您可以在这里快速记录想法。\n\n• 支持自动保存\n• 便签纸风格\n• 随时记录';
    let noteColor = localStorage.getItem('macos_stickies_color') || 'yellow';

    const colors = [
        { id: 'yellow', name: '黄色', bg: '#fff2a8', color: '#333' },
        { id: 'pink', name: '粉色', bg: '#ffb6c1', color: '#333' },
        { id: 'blue', name: '蓝色', bg: '#b0e0e6', color: '#333' },
        { id: 'green', name: '绿色', bg: '#90ee90', color: '#333' },
        { id: 'purple', name: '紫色', bg: '#dda0dd', color: '#333' }
    ];

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div style="height:100%;display:flex;align-items:center;padding:0 12px;gap:8px;">
                <div style="display:flex;gap:4px;">
                    ${colors.map(c => `
                        <button class="finder-toolbar-btn" data-color="${c.id}" style="width:24px;height:24px;background:${c.bg};border-radius:50%;border:2px solid ${noteColor === c.id ? '#333' : 'transparent'};padding:0;" title="${c.name}"></button>
                    `).join('')}
                </div>
                <div style="width:1px;height:20px;background:var(--border-color);margin:0 4px;"></div>
                <button class="finder-toolbar-btn" id="clear-btn" title="清空">🗑️</button>
            </div>
        `;

        toolbar.querySelectorAll('[data-color]').forEach(btn => {
            btn.addEventListener('click', () => {
                noteColor = btn.dataset.color;
                localStorage.setItem('macos_stickies_color', noteColor);
                render();
            });
        });

        toolbar.querySelector('#clear-btn')?.addEventListener('click', () => {
            if (confirm('确定要清空便签吗？')) {
                noteContent = '';
                localStorage.setItem('macos_stickies', '');
                render();
            }
        });
    }

    function renderContent() {
        const color = colors.find(c => c.id === noteColor) || colors[0];
        body.innerHTML = `
            <textarea class="stickies-note" id="stickies-content" style="background:${color.bg};color:${color.color};">${noteContent}</textarea>
        `;

        const textarea = body.querySelector('#stickies-content');
        let saveTimeout;
        textarea.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                noteContent = textarea.value;
                localStorage.setItem('macos_stickies', noteContent);
            }, 300);
        });
        setTimeout(() => textarea.focus(), 100);
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderToolbar();
        renderContent();
    }

    render();
};
