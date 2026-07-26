window.renderSafari = function(body, sidebar, toolbar, windowId) {
    let history = [''];
    let historyIndex = 0;
    let currentUrl = '';
    let useProxy = false;
    let checkTimers = [];

    // Proxy services that strip X-Frame-Options headers
    const PROXY_SERVICES = [
        { name: 'AllOrigins', prefix: 'https://api.allorigins.win/raw?url=' },
        { name: 'CORS Proxy', prefix: 'https://corsproxy.io/?' },
        { name: 'CodeTabs', prefix: 'https://api.codetabs.com/v1/proxy/?quest=' },
        { name: 'ThingProxy', prefix: 'https://thingproxy.freeboard.io/fetch/' },
        { name: 'CORS Anywhere', prefix: 'https://cors-anywhere.herokuapp.com/' }
    ];
    let currentProxyIndex = 0;
    let autoProxyAttempts = 0;
    const MAX_AUTO_PROXY_ATTEMPTS = PROXY_SERVICES.length;

    const favorites = [
        { name: '百度', url: 'https://www.baidu.com', color: '#2932E1', icon: '百' },
        { name: 'Bing', url: 'https://www.bing.com', color: '#00809D', icon: 'B' },
        { name: 'GitHub', url: 'https://github.com', color: '#24292e', icon: 'GH' },
        { name: '知乎', url: 'https://www.zhihu.com', color: '#0084FF', icon: '知' },
        { name: 'B站', url: 'https://www.bilibili.com', color: '#FB7299', icon: 'B' },
        { name: '微博', url: 'https://weibo.com', color: '#E6162D', icon: '微' },
        { name: '洛谷', url: 'https://www.luogu.com', color: '#4CAF50', icon: '洛' }
    ];

    function clearAllTimers() {
        checkTimers.forEach(t => clearTimeout(t));
        checkTimers = [];
    }

    function getProxyUrl(url) {
        const proxy = PROXY_SERVICES[currentProxyIndex];
        return proxy.prefix + encodeURIComponent(url);
    }

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div class="safari-toolbar" style="height:100%;">
                <button class="safari-nav-btn" id="safari-back" ${historyIndex === 0 ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
                </button>
                <button class="safari-nav-btn" id="safari-forward" ${historyIndex >= history.length - 1 ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
                </button>
                <div style="flex:1;display:flex;justify-content:center;">
                    <input type="text" class="safari-url-bar" id="safari-url" value="${currentUrl}" placeholder="搜索或输入网址">
                </div>
                <button class="safari-nav-btn" id="safari-home" title="主页">
                    <svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>
                </button>
                <button class="safari-nav-btn" id="safari-proxy" title="${useProxy ? '关闭代理' : '启用代理'}" style="${useProxy ? 'background:rgba(255,149,0,0.3);' : ''}">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </button>
                <button class="safari-nav-btn" id="safari-external" title="在浏览器中打开" style="display:${currentUrl ? 'flex' : 'none'};">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </button>
            </div>
        `;

        const urlInput = toolbar.querySelector('#safari-url');
        urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                navigateTo(urlInput.value.trim());
            }
        });
        urlInput.addEventListener('focus', () => urlInput.select());

        toolbar.querySelector('#safari-back').addEventListener('click', () => {
            if (historyIndex > 0) {
                historyIndex--;
                currentUrl = history[historyIndex];
                render();
            }
        });

        toolbar.querySelector('#safari-forward').addEventListener('click', () => {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                currentUrl = history[historyIndex];
                render();
            }
        });

        toolbar.querySelector('#safari-home').addEventListener('click', () => {
            navigateTo('');
        });

        toolbar.querySelector('#safari-proxy').addEventListener('click', () => {
            useProxy = !useProxy;
            currentProxyIndex = 0;
            if (currentUrl) {
                render();
            }
        });

        const extBtn = toolbar.querySelector('#safari-external');
        if (extBtn) {
            extBtn.addEventListener('click', () => {
                if (currentUrl) window.open(currentUrl, '_blank');
            });
        }
    }

    function navigateTo(url) {
        clearAllTimers();
        autoProxyAttempts = 0;
        if (!url) {
            currentUrl = '';
            history = [''];
            historyIndex = 0;
            render();
            return;
        }

        let targetUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.') && !url.includes(' ')) {
                targetUrl = 'https://' + url;
            } else {
                targetUrl = 'https://www.baidu.com/s?wd=' + encodeURIComponent(url);
            }
        }

        currentUrl = targetUrl;
        history = history.slice(0, historyIndex + 1);
        history.push(targetUrl);
        historyIndex = history.length - 1;
        render();
    }

    function isIframeBlocked(iframe) {
        try {
            const doc = iframe.contentDocument;
            if (!doc) return 'unknown';

            try {
                const href = iframe.contentWindow.location.href;
                if (href === 'about:blank' || href === '') {
                    return 'loading';
                }
            } catch (locErr) {
                // Cross-origin: iframe loaded but blocked access = X-Frame-Options
                return 'blocked';
            }

            const bodyEl = doc.body;
            if (!bodyEl) return 'loading';
            const html = bodyEl.innerHTML.trim();
            if (html === '' || html.length < 100) {
                return 'loading';
            }
            return 'ok';
        } catch (e) {
            return 'blocked';
        }
    }

    function showBlockedFallback(container, url) {
        if (container._fallbackShown) return;
        container._fallbackShown = true;
        
        const proxyBtnText = useProxy ? '切换代理服务器' : '使用代理模式加载';
        container.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:16px;padding:40px;text-align:center;background:var(--bg-elevated, #f5f5f7);">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ff9500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div style="font-size:16px;font-weight:600;color:var(--text-primary,#333);">此网页无法直接加载</div>
                <div style="font-size:13px;max-width:400px;line-height:1.6;color:var(--text-secondary,#666);">该网站禁止被嵌入到其他页面中。您可以使用代理模式加载，或在外部浏览器中打开。</div>
                <div style="font-size:12px;opacity:0.5;word-break:break-all;max-width:400px;">${url}</div>
                <div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;justify-content:center;">
                    <button class="safari-fallback-proxy" style="padding:10px 20px;border-radius:8px;background:#ff9500;color:#fff;border:none;cursor:pointer;font-size:14px;font-family:var(--system-font,-apple-system);">${proxyBtnText}</button>
                    <button class="safari-fallback-external" style="padding:10px 20px;border-radius:8px;background:#007aff;color:#fff;border:none;cursor:pointer;font-size:14px;font-family:var(--system-font,-apple-system);">在浏览器中打开</button>
                    <button class="safari-fallback-copy" style="padding:10px 20px;border-radius:8px;background:rgba(0,0,0,0.05);color:#333;border:1px solid rgba(0,0,0,0.1);cursor:pointer;font-size:14px;font-family:var(--system-font,-apple-system);">复制链接</button>
                </div>
            </div>
        `;
        
        container.querySelector('.safari-fallback-proxy').addEventListener('click', () => {
            if (useProxy) {
                // Try next proxy service
                currentProxyIndex = (currentProxyIndex + 1) % PROXY_SERVICES.length;
            } else {
                useProxy = true;
                currentProxyIndex = 0;
            }
            render();
        });
        
        container.querySelector('.safari-fallback-external').addEventListener('click', () => {
            window.open(url, '_blank');
        });
        
        container.querySelector('.safari-fallback-copy').addEventListener('click', (e) => {
            navigator.clipboard.writeText(url).then(() => {
                e.target.textContent = '已复制';
                setTimeout(() => { e.target.textContent = '复制链接'; }, 1500);
            });
        });
    }

    function renderContent() {
        clearAllTimers();
        if (!currentUrl) {
            body.innerHTML = `
                <div class="safari-content safari-home">
                    <div style="font-size:48px;font-weight:700;margin-bottom:8px;background:linear-gradient(135deg,#007aff,#5856d6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Safari</div>
                    <div style="color:#888;margin-bottom:32px;font-size:14px;">欢迎使用 Safari 浏览器</div>
                    <div class="safari-search-box">
                        <input type="text" class="safari-search-input" id="safari-search" placeholder="搜索或输入网址" autofocus>
                    </div>
                    <div class="safari-favorites">
                        ${favorites.map(fav => `
                            <div class="safari-fav-item" data-url="${fav.url}">
                                <div class="safari-fav-icon" style="background:${fav.color};color:#fff;font-weight:600;font-size:22px;">${fav.icon}</div>
                                <div class="safari-fav-name">${fav.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            const searchInput = body.querySelector('#safari-search');
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    navigateTo(searchInput.value.trim());
                }
            });
            setTimeout(() => searchInput.focus(), 100);

            body.querySelectorAll('.safari-fav-item').forEach(item => {
                item.addEventListener('click', () => {
                    navigateTo(item.dataset.url);
                });
            });
        } else {
            const iframeSrc = useProxy ? getProxyUrl(currentUrl) : currentUrl;
            body.innerHTML = `
                <div class="safari-content" style="padding:0;">
                    <div class="safari-iframe-container" id="safari-frame-container-${windowId}">
                        ${useProxy ? `<div style="background:#fff3cd;color:#856404;padding:8px 12px;font-size:12px;text-align:center;"> 代理模式：${PROXY_SERVICES[currentProxyIndex].name}</div>` : ''}
                        <iframe
                            id="safari-iframe-${windowId}"
                            src="${iframeSrc}"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-presentation allow-modals"
                            referrerpolicy="no-referrer-when-downgrade"
                            allow="autoplay; fullscreen; clipboard-read; clipboard-write; encrypted-media; picture-in-picture"
                            style="width:100%;height:100%;border:none;"
                        ></iframe>
                    </div>
                </div>
            `;

            const container = body.querySelector(`#safari-frame-container-${windowId}`);
            const iframe = body.querySelector(`#safari-iframe-${windowId}`);
            container._fallbackShown = false;
            let confirmedOk = false;
            let finalCheckTimer = null;

            function cancelFinalCheck() {
                if (finalCheckTimer) {
                    clearTimeout(finalCheckTimer);
                    finalCheckTimer = null;
                }
            }

            function checkStatus() {
                if (container._fallbackShown || confirmedOk) return;
                const status = isIframeBlocked(iframe);
                if (status === 'ok') {
                    confirmedOk = true;
                    cancelFinalCheck();
                    autoProxyAttempts = 0;
                }
            }

            function scheduleFinalCheck(delay) {
                cancelFinalCheck();
                finalCheckTimer = setTimeout(() => {
                    if (container._fallbackShown || confirmedOk) return;
                    const status = isIframeBlocked(iframe);
                    if (status !== 'ok') {
                        // Auto-try proxy if not already using it
                        if (!useProxy && autoProxyAttempts < MAX_AUTO_PROXY_ATTEMPTS) {
                            useProxy = true;
                            autoProxyAttempts++;
                            render();
                            return;
                        }
                        // Try next proxy service
                        if (useProxy && autoProxyAttempts < MAX_AUTO_PROXY_ATTEMPTS) {
                            currentProxyIndex = (currentProxyIndex + 1) % PROXY_SERVICES.length;
                            autoProxyAttempts++;
                            render();
                            return;
                        }
                        showBlockedFallback(container, currentUrl);
                    }
                }, delay);
                checkTimers.push(finalCheckTimer);
            }

            iframe.addEventListener('load', () => {
                setTimeout(checkStatus, 500);
                setTimeout(checkStatus, 2000);
                scheduleFinalCheck(6000);
            });

            iframe.addEventListener('error', () => {
                if (!useProxy && autoProxyAttempts < MAX_AUTO_PROXY_ATTEMPTS) {
                    useProxy = true;
                    autoProxyAttempts++;
                    render();
                    return;
                }
                showBlockedFallback(container, currentUrl);
            });

            const safetyTimer = setTimeout(() => {
                if (container._fallbackShown || confirmedOk) return;
                if (!useProxy && autoProxyAttempts < MAX_AUTO_PROXY_ATTEMPTS) {
                    useProxy = true;
                    autoProxyAttempts++;
                    render();
                    return;
                }
                showBlockedFallback(container, currentUrl);
            }, 20000);
            checkTimers.push(safetyTimer);
        }
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.padding = '0';
        body.style.overflow = 'hidden';
        renderToolbar();
        renderContent();
    }

    render();
};
