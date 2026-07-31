window.renderSafari = function(body, sidebar, toolbar, windowId) {
    let tabs = [];
    let activeTabId = null;
    let useProxy = true;
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

    const TABS_STORAGE_KEY = 'macos_safari_tabs';

    function activeTab() {
        return tabs.find(t => t.id === activeTabId);
    }

    function createTab(url, title) {
        url = url || '';
        title = title || '';
        return {
            id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
            url: url,
            title: title,
            history: [url || ''],
            historyIndex: 0
        };
    }

    function loadTabs() {
        try {
            const saved = localStorage.getItem(TABS_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const savedTabs = Array.isArray(parsed) ? parsed : parsed.tabs;
                const savedActiveId = Array.isArray(parsed) ? null : parsed.activeTabId;
                if (Array.isArray(savedTabs) && savedTabs.length > 0) {
                    tabs = savedTabs.map(t => ({
                        id: (t && t.id) ? t.id : (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)),
                        url: (t && typeof t.url === 'string') ? t.url : '',
                        title: (t && typeof t.title === 'string') ? t.title : '',
                        history: (t && Array.isArray(t.history) && t.history.length > 0) ? t.history : [''],
                        historyIndex: (t && typeof t.historyIndex === 'number') ? t.historyIndex : 0
                    }));
                    activeTabId = tabs.find(t => t.id === savedActiveId) ? savedActiveId : tabs[0].id;
                    return;
                }
            }
        } catch (e) {}
        const t = createTab();
        tabs = [t];
        activeTabId = t.id;
    }

    function saveTabs() {
        try {
            localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify({ tabs: tabs, activeTabId: activeTabId }));
        } catch (e) {}
    }

    loadTabs();

    function clearAllTimers() {
        checkTimers.forEach(t => clearTimeout(t));
        checkTimers = [];
    }

    function getProxyUrl(url) {
        const proxy = PROXY_SERVICES[currentProxyIndex];
        return proxy.prefix + encodeURIComponent(url);
    }

    function displayUrl(url) {
        if (!url) return '';
        return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    }

    function isSecure(url) {
        return url.startsWith('https://');
    }

    function switchTab(tabId) {
        if (tabId === activeTabId) return;
        activeTabId = tabId;
        clearAllTimers();
        autoProxyAttempts = 0;
        saveTabs();
        render();
    }

    function newTab(url, title) {
        const t = createTab(url, title);
        tabs.push(t);
        activeTabId = t.id;
        clearAllTimers();
        autoProxyAttempts = 0;
        saveTabs();
        render();
    }

    function closeTab(tabId) {
        const idx = tabs.findIndex(t => t.id === tabId);
        if (idx === -1) return;
        tabs.splice(idx, 1);
        if (tabs.length === 0) {
            const t = createTab();
            tabs.push(t);
            activeTabId = t.id;
        } else {
            const newIdx = Math.min(idx, tabs.length - 1);
            activeTabId = tabs[newIdx].id;
        }
        clearAllTimers();
        autoProxyAttempts = 0;
        saveTabs();
        render();
    }

    function renderToolbar() {
        if (!toolbar) return;
        const tab = activeTab();
        const history = tab ? tab.history : [''];
        const historyIndex = tab ? tab.historyIndex : 0;
        const currentUrl = tab ? tab.url : '';
        const canBack = historyIndex > 0;
        const canFwd = historyIndex < history.length - 1;
        const sec = currentUrl && isSecure(currentUrl);
        const proxyName = PROXY_SERVICES[currentProxyIndex]?.name || '';

        toolbar.innerHTML = `
            <div class="safari-tabbar">
                <div class="safari-tabs">
                    ${tabs.map(t => `
                        <div class="safari-tab ${t.id === activeTabId ? 'active' : ''}" data-tab-id="${t.id}">
                            <span class="safari-tab-title">${t.title || '起始页'}</span>
                            <button class="safari-tab-close" data-tab-id="${t.id}">×</button>
                        </div>
                    `).join('')}
                </div>
                <button class="safari-tab-new" id="safari-newtab" title="新建标签">+</button>
            </div>
            <div class="safari-toolbar">
                <div class="safari-toolbar-group">
                    <button class="safari-icon-btn" id="safari-back" ${canBack ? '' : 'disabled'} title="后退" aria-label="后退">
                        <svg viewBox="0 0 14 14" width="14" height="14"><path d="M9.5 2L4 7l5.5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button class="safari-icon-btn" id="safari-forward" ${canFwd ? '' : 'disabled'} title="前进" aria-label="前进">
                        <svg viewBox="0 0 14 14" width="14" height="14"><path d="M4.5 2L10 7l-5.5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
                <div class="safari-toolbar-group">
                    <button class="safari-icon-btn" id="safari-reload" title="重新载入" aria-label="重新载入">
                        <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7a4.5 4.5 0 0 1 8-2.8"/><path d="M11.5 7a4.5 4.5 0 0 1-8 2.8"/><path d="M9.5 1.8v2.6h-2.6"/><path d="M4.5 12.2v-2.6h2.6"/></svg>
                    </button>
                </div>
                <div class="safari-address-wrap">
                    <div class="safari-address-bar">
                        ${currentUrl ? `
                            <span class="safari-lock-icon" title="${sec ? '连接安全' : '不安全连接'}">
                                ${sec ? `<svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor"><path d="M3 5V4a3 3 0 0 1 6 0v1h.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5H3zm1 0h4V4a2 2 0 1 0-4 0v1z"/></svg>` : `<svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M2 6h8M6 2v8"/></svg>`}
                            </span>
                            <span class="safari-domain-text">${displayUrl(currentUrl)}</span>
                            <input type="text" class="safari-url-input" id="safari-url" value="${currentUrl}" spellcheck="false" autocomplete="off">
                        ` : `
                            <span class="safari-search-icon">
                                <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                            </span>
                            <input type="text" class="safari-url-input is-placeholder" id="safari-url" value="" placeholder="搜索或输入网站名称" spellcheck="false" autocomplete="off">
                        `}
                    </div>
                </div>
                <div class="safari-toolbar-group">
                    <button class="safari-icon-btn" id="safari-home" title="起始页" aria-label="起始页">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6.5L7 2.5l5 4"/><path d="M3.5 5.7v5.3a.5.5 0 0 0 .5.5h2.5V8.5h1.5V11.5h2.5a.5.5 0 0 0 .5-.5V5.7"/></svg>
                    </button>
                    <button class="safari-icon-btn ${useProxy ? 'active' : ''}" id="safari-proxy" title="${useProxy ? `代理: ${proxyName}` : '启用代理'}" aria-label="代理">
                        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="10" height="6" rx="1.2"/><path d="M4.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2"/></svg>
                    </button>
                    <button class="safari-icon-btn" id="safari-external" title="在浏览器中打开" style="display:${currentUrl ? 'flex' : 'none'};" aria-label="在浏览器中打开">
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M10 8.5v2.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2.5"/><path d="M8 2h4v4"/><path d="M5.5 8.5L12 2"/></svg>
                    </button>
                </div>
            </div>
        `;

        const urlInput = toolbar.querySelector('#safari-url');
        const addressBar = toolbar.querySelector('.safari-address-bar');

        urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                navigateTo(urlInput.value.trim());
            } else if (e.key === 'Escape') {
                urlInput.value = currentUrl;
                urlInput.blur();
            }
        });
        urlInput.addEventListener('focus', () => {
            urlInput.select();
            addressBar?.classList.add('focused');
            if (addressBar) {
                // 隐藏 domain text 编辑时
                const dt = addressBar.querySelector('.safari-domain-text');
                const lock = addressBar.querySelector('.safari-lock-icon');
                if (dt) dt.style.opacity = '0';
                if (lock) lock.style.opacity = '0';
            }
        });
        urlInput.addEventListener('blur', () => {
            addressBar?.classList.remove('focused');
            const dt = addressBar?.querySelector('.safari-domain-text');
            const lock = addressBar?.querySelector('.safari-lock-icon');
            if (dt) dt.style.opacity = '';
            if (lock) lock.style.opacity = '';
        });

        toolbar.querySelectorAll('.safari-tab').forEach(tabEl => {
            tabEl.addEventListener('click', (e) => {
                if (e.target.classList.contains('safari-tab-close')) return;
                switchTab(tabEl.dataset.tabId);
            });
        });

        toolbar.querySelectorAll('.safari-tab-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeTab(closeBtn.dataset.tabId);
            });
        });

        const newTabBtn = toolbar.querySelector('#safari-newtab');
        if (newTabBtn) {
            newTabBtn.addEventListener('click', () => {
                newTab();
            });
        }

        toolbar.querySelector('#safari-back').addEventListener('click', () => {
            const t = activeTab();
            if (t && t.historyIndex > 0) {
                t.historyIndex--;
                t.url = t.history[t.historyIndex];
                t.title = t.url ? displayUrl(t.url) : '';
                saveTabs();
                render();
            }
        });

        toolbar.querySelector('#safari-forward').addEventListener('click', () => {
            const t = activeTab();
            if (t && t.historyIndex < t.history.length - 1) {
                t.historyIndex++;
                t.url = t.history[t.historyIndex];
                t.title = t.url ? displayUrl(t.url) : '';
                saveTabs();
                render();
            }
        });

        toolbar.querySelector('#safari-reload').addEventListener('click', () => {
            const t = activeTab();
            if (t && t.url) render();
        });

        toolbar.querySelector('#safari-home').addEventListener('click', () => {
            navigateTo('');
        });

        toolbar.querySelector('#safari-proxy').addEventListener('click', () => {
            useProxy = !useProxy;
            currentProxyIndex = 0;
            const t = activeTab();
            if (t && t.url) {
                render();
            }
        });

        const extBtn = toolbar.querySelector('#safari-external');
        if (extBtn) {
            extBtn.addEventListener('click', () => {
                const t = activeTab();
                if (t && t.url) window.open(t.url, '_blank');
            });
        }
    }

    function navigateTo(url) {
        clearAllTimers();
        autoProxyAttempts = 0;
        const t = activeTab();
        if (!t) return;
        if (!url) {
            t.url = '';
            t.history = [''];
            t.historyIndex = 0;
            t.title = '';
            saveTabs();
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

        t.url = targetUrl;
        t.title = displayUrl(targetUrl);
        t.history = t.history.slice(0, t.historyIndex + 1);
        t.history.push(targetUrl);
        t.historyIndex = t.history.length - 1;
        saveTabs();
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
        const t = activeTab();
        const currentUrl = t ? t.url : '';
        if (!currentUrl) {
            body.innerHTML = `
                <div class="safari-content safari-home">
                    <div class="safari-title">Safari</div>
                    <div class="safari-subtitle">收藏的开始页面</div>
                    <div class="safari-favorites">
                        ${favorites.map(fav => `
                            <div class="safari-fav-item" data-url="${fav.url}">
                                <div class="safari-fav-icon" style="background:${fav.color};">${fav.icon}</div>
                                <div class="safari-fav-name">${fav.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            body.querySelectorAll('.safari-fav-item').forEach(item => {
                item.addEventListener('click', () => {
                    navigateTo(item.dataset.url);
                });
            });

            // 让地址栏获得焦点
            setTimeout(() => {
                const urlInput = toolbar?.querySelector('#safari-url');
                if (urlInput) urlInput.focus();
            }, 120);
        } else {
            const iframeSrc = useProxy ? getProxyUrl(currentUrl) : currentUrl;
            body.innerHTML = `
                <div class="safari-content" style="padding:0;">
                    <div class="safari-iframe-container" id="safari-frame-container-${windowId}">
                        ${useProxy ? `<div style="background:rgba(0,122,255,0.08);color:#007aff;padding:6px 12px;font-size:11px;text-align:center;border-bottom:0.5px solid rgba(0,122,255,0.15);"> 通过 ${PROXY_SERVICES[currentProxyIndex].name} 代理加载</div>` : ''}
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
