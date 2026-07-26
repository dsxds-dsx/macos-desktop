window.renderMusic = function(body, sidebar, toolbar, windowId) {
    const MUSIC_URL = 'https://1music.cc/zh-CN';
    let history = [MUSIC_URL];
    let historyIndex = 0;
    let currentUrl = MUSIC_URL;

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div class="safari-toolbar" style="height:100%;">
                <button class="safari-nav-btn" id="music-back" ${historyIndex === 0 ? 'disabled' : ''} title="返回">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
                </button>
                <button class="safari-nav-btn" id="music-forward" ${historyIndex >= history.length - 1 ? 'disabled' : ''} title="前进">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
                </button>
                <div style="flex:1;display:flex;justify-content:center;">
                    <input type="text" class="safari-url-bar" id="music-url" value="${currentUrl}" placeholder="搜索音乐或输入网址">
                </div>
                <button class="safari-nav-btn" id="music-home" title="主页">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>
                </button>
                <button class="safari-nav-btn" id="music-share" title="在浏览器中打开">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" fill="currentColor"/></svg>
                </button>
                <button class="safari-nav-btn" id="music-refresh" title="刷新">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                </button>
            </div>
        `;

        const urlInput = toolbar.querySelector('#music-url');
        urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                navigateTo(urlInput.value.trim());
            }
        });
        urlInput.addEventListener('focus', () => urlInput.select());

        toolbar.querySelector('#music-back').addEventListener('click', () => {
            if (historyIndex > 0) {
                historyIndex--;
                currentUrl = history[historyIndex];
                render();
            }
        });

        toolbar.querySelector('#music-forward').addEventListener('click', () => {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                currentUrl = history[historyIndex];
                render();
            }
        });

        toolbar.querySelector('#music-home').addEventListener('click', () => {
            navigateTo(MUSIC_URL);
        });

        toolbar.querySelector('#music-share').addEventListener('click', () => {
            window.open(currentUrl, '_blank');
        });

        toolbar.querySelector('#music-refresh').addEventListener('click', () => {
            const frame = body.querySelector('#music-frame');
            if (frame) {
                frame.src = currentUrl;
            }
        });
    }

    function navigateTo(url) {
        if (!url) {
            currentUrl = MUSIC_URL;
            history = [MUSIC_URL];
            historyIndex = 0;
            render();
            return;
        }

        let targetUrl = url;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
                targetUrl = 'https://' + targetUrl;
            } else {
                // Search on 1music
                targetUrl = 'https://1music.cc/search?q=' + encodeURIComponent(targetUrl);
            }
        }

        currentUrl = targetUrl;
        history = history.slice(0, historyIndex + 1);
        history.push(targetUrl);
        historyIndex = history.length - 1;
        render();
    }

    function renderContent() {
        body.innerHTML = `
            <div class="safari-content" style="padding:0;">
                <div class="safari-iframe-container">
                    <iframe id="music-frame" src="${currentUrl}"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-presentation allow-modals"
                        allow="autoplay; fullscreen; clipboard-read; clipboard-write; encrypted-media; picture-in-picture"
                        referrerpolicy="no-referrer-when-downgrade"
                        style="width:100%;height:100%;border:none;"></iframe>
                </div>
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        renderToolbar();
        renderContent();
    }

    render();
};