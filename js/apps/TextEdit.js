window.renderTextEdit = function(body, sidebar, toolbar, windowId) {
    let content = localStorage.getItem('textedit_content') || '';
    let isBold = false;
    let isItalic = false;

    body.innerHTML = `
        <div class="app-content" style="height:100%;display:flex;flex-direction:column;">
            <div style="padding:8px 12px;border-bottom:0.5px solid var(--border-color);display:flex;gap:4px;align-items:center;background:var(--window-header);">
                <button class="finder-toolbar-btn" id="te-bold" title="粗体" style="font-weight:700;">B</button>
                <button class="finder-toolbar-btn" id="te-italic" title="斜体" style="font-style:italic;">I</button>
                <button class="finder-toolbar-btn" id="te-underline" title="下划线" style="text-decoration:underline;">U</button>
                <div style="width:1px;height:20px;background:var(--border-color);margin:0 8px;"></div>
                <button class="finder-toolbar-btn" id="te-save" title="保存">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" fill="currentColor"/></svg>
                </button>
            </div>
            <div class="textedit-body" style="flex:1;">
                <textarea class="textedit-content" id="te-content" placeholder="开始输入...">${escapeHtml(content)}</textarea>
            </div>
        </div>
    `;

    const textarea = body.querySelector('#te-content');

    function save() {
        localStorage.setItem('textedit_content', textarea.value);
    }

    textarea.addEventListener('input', () => {
        clearTimeout(textarea._saveTimeout);
        textarea._saveTimeout = setTimeout(save, 500);
    });

    body.querySelector('#te-bold').addEventListener('click', () => {
        isBold = !isBold;
        textarea.style.fontWeight = isBold ? '700' : '400';
        body.querySelector('#te-bold').classList.toggle('active');
    });

    body.querySelector('#te-italic').addEventListener('click', () => {
        isItalic = !isItalic;
        textarea.style.fontStyle = isItalic ? 'italic' : 'normal';
        body.querySelector('#te-italic').classList.toggle('active');
    });

    body.querySelector('#te-save').addEventListener('click', () => {
        save();
        alert('已保存到本地');
    });

    setTimeout(() => textarea.focus(), 100);

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
