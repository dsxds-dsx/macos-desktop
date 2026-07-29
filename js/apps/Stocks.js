window.renderStocks = function(body, sidebar, toolbar, windowId) {
    // ============ Persistent State ============
    let state = JSON.parse(localStorage.getItem('macos_stocks_state') || 'null') || {
        selectedSymbol: 'AAPL',
        watchlist: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'],
        timeRange: '1D'
    };
    let searchQuery = '';

    function saveState() {
        localStorage.setItem('macos_stocks_state', JSON.stringify(state));
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    // ============ Stocks Data ============
    const allStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.34, changePercent: 1.27, open: 183.58, high: 187.92, low: 182.91, volume: 52.3, marketCap: 2890, pe: 30.2, divYield: 0.51, color: '#34C759', sector: '科技' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -1.23, changePercent: -0.86, open: 143.03, high: 143.56, low: 141.20, volume: 28.5, marketCap: 1780, pe: 25.4, divYield: 0.45, color: '#FF3B30', sector: '科技' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 4.56, changePercent: 1.22, open: 374.35, high: 380.12, low: 373.88, volume: 21.8, marketCap: 2820, pe: 34.1, divYield: 0.72, color: '#34C759', sector: '科技' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23, open: 254.17, high: 256.30, low: 247.12, volume: 89.4, marketCap: 790, pe: 65.3, divYield: 0, color: '#FF3B30', sector: '汽车' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 153.42, change: 1.89, changePercent: 1.25, open: 151.53, high: 154.20, low: 151.10, volume: 38.2, marketCap: 1590, pe: 46.7, divYield: 0, color: '#34C759', sector: '电商' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 548.22, change: 12.45, changePercent: 2.32, open: 535.77, high: 552.18, low: 533.20, volume: 42.1, marketCap: 1350, pe: 68.9, divYield: 0.03, color: '#34C759', sector: '半导体' },
        { symbol: 'META', name: 'Meta Platforms', price: 352.96, change: 3.21, changePercent: 0.92, open: 349.75, high: 354.50, low: 348.80, volume: 18.6, marketCap: 902, pe: 32.5, divYield: 0, color: '#34C759', sector: '科技' },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: 478.65, change: -2.45, changePercent: -0.51, open: 481.10, high: 483.20, low: 477.50, volume: 4.2, marketCap: 212, pe: 48.2, divYield: 0, color: '#FF3B30', sector: '传媒' },
        { symbol: 'BABA', name: '阿里巴巴集团', price: 78.42, change: 0.87, changePercent: 1.12, open: 77.55, high: 79.10, low: 77.20, volume: 22.4, marketCap: 198, pe: 11.8, divYield: 1.45, color: '#34C759', sector: '电商' },
        { symbol: 'TCEHY', name: '腾讯控股', price: 47.23, change: -0.34, changePercent: -0.72, open: 47.57, high: 47.80, low: 47.10, volume: 8.5, marketCap: 446, pe: 18.4, divYield: 0.85, color: '#FF3B30', sector: '科技' },
        { symbol: 'BIDU', name: '百度公司', price: 95.80, change: 1.45, changePercent: 1.54, open: 94.35, high: 96.20, low: 94.10, volume: 6.2, marketCap: 33.5, pe: 22.1, divYield: 0, color: '#34C759', sector: '科技' },
        { symbol: 'JD', name: '京东集团', price: 28.45, change: -0.23, changePercent: -0.80, open: 28.68, high: 28.85, low: 28.30, volume: 14.3, marketCap: 44.5, pe: 15.2, divYield: 0, color: '#FF3B30', sector: '电商' }
    ];

    // ============ Chart Data Generation ============
    const timeRanges = [
        { id: '1D', name: '1日', points: 78, label: '今日' },
        { id: '1W', name: '1周', points: 35, label: '1周' },
        { id: '1M', name: '1月', points: 30, label: '1月' },
        { id: '3M', name: '3月', points: 65, label: '3月' },
        { id: '6M', name: '6月', points: 130, label: '6月' },
        { id: '1Y', name: '1年', points: 260, label: '1年' },
        { id: 'ALL', name: '全部', points: 520, label: '全部' }
    ];

    function generateChartData(stock, range) {
        const seed = stock.symbol.charCodeAt(0) + stock.symbol.charCodeAt(1);
        const points = range.points;
        const data = [];
        let basePrice = stock.price;
        // Walk backwards to generate historical data
        const volatility = stock.changePercent >= 0 ? 0.012 : 0.018;
        for (let i = points - 1; i >= 0; i--) {
            const trend = Math.sin((i + seed) * 0.2) * 0.005;
            const noise = (Math.sin(seed * (i + 1) * 7.13) + Math.cos(seed * (i + 1) * 3.7)) * volatility;
            basePrice = basePrice / (1 + trend + noise);
            data.push(basePrice);
        }
        // End at current price
        const scale = stock.price / data[data.length - 1];
        return data.map(p => p * scale);
    }

    function getCurrentStock() {
        return allStocks.find(s => s.symbol === state.selectedSymbol) || allStocks[0];
    }

    function getWatchlistStocks() {
        return state.watchlist.map(sym => allStocks.find(s => s.symbol === sym)).filter(Boolean);
    }

    function formatTime(timestamp) {
        return new Date(timestamp).toLocaleString('zh-CN');
    }

    // ============ News for Selected Stock ============
    function getStockNews(stock) {
        return [
            { id: 1, source: '财经快讯', time: Date.now() - 3600000, title: `${stock.name} 股价${stock.change >= 0 ? '上涨' : '下跌'} ${Math.abs(stock.changePercent).toFixed(2)}%`, summary: `${stock.name}今日${stock.change >= 0 ? '收涨' : '收跌'}，成交量${stock.volume}M股。分析师${stock.change >= 0 ? '看好' : '谨慎'}后市表现。` },
            { id: 2, source: '华尔街见闻', time: Date.now() - 7200000, title: `${stock.sector}板块${stock.change >= 0 ? '走强' : '承压'}，${stock.symbol}领${stock.change >= 0 ? '涨' : '跌'}`, summary: `${stock.sector}板块今日表现${stock.change >= 0 ? '亮眼' : '疲软'}，${stock.symbol}作为板块龙头，${stock.change >= 0 ? '带动板块上行' : '拖累板块走势'}。` },
            { id: 3, source: 'Reuters', time: Date.now() - 14400000, title: `${stock.name} 发布季度财报`, summary: `${stock.name} 今日发布最新季度财报，营收与利润均符合市场预期。公司对未来业绩展望保持乐观。` }
        ];
    }

    // ============ Render Sidebar ============
    function renderSidebar() {
        if (!sidebar) return;
        const watchlistStocks = getWatchlistStocks();
        sidebar.innerHTML = `
            <div class="stocks-sidebar">
                <div class="stocks-sidebar-top">
                    <div class="stocks-sidebar-title">股票</div>
                    <div class="stocks-sidebar-search">
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="6" cy="6" r="4"/><path d="M9 9l3.5 3.5"/></svg>
                        <input type="text" id="stocks-search-${windowId}" placeholder="搜索股票" value="${escapeHtml(searchQuery)}">
                    </div>
                </div>
                <div class="stocks-sidebar-scroll">
                    <div class="stocks-sidebar-group">
                        <div class="stocks-sidebar-group-title">自选列表</div>
                        ${watchlistStocks.length === 0 ? `
                            <div class="stocks-sidebar-empty">还没有添加自选股</div>
                        ` : watchlistStocks.map(s => {
                            const positive = s.change >= 0;
                            return `
                                <div class="stocks-sidebar-row ${state.selectedSymbol === s.symbol ? 'active' : ''}" data-symbol="${s.symbol}">
                                    <div class="stocks-sidebar-symbol">
                                        <div class="stocks-sidebar-sym-text">${s.symbol}</div>
                                        <div class="stocks-sidebar-name">${escapeHtml(s.name)}</div>
                                    </div>
                                    <div class="stocks-sidebar-spark">${renderSparkline(s)}</div>
                                    <div class="stocks-sidebar-price-block">
                                        <div class="stocks-sidebar-price">${s.price.toFixed(2)}</div>
                                        <div class="stocks-sidebar-change ${positive ? 'up' : 'down'}">
                                            ${positive ? '+' : ''}${s.change.toFixed(2)}
                                            <span class="stocks-sidebar-pct">${positive ? '+' : ''}${s.changePercent.toFixed(2)}%</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    ${searchQuery.trim() ? renderSearchResults() : ''}
                </div>
            </div>
        `;

        sidebar.querySelectorAll('[data-symbol]').forEach(item => {
            item.addEventListener('click', () => {
                state.selectedSymbol = item.dataset.symbol;
                if (!state.watchlist.includes(state.selectedSymbol)) {
                    state.watchlist.unshift(state.selectedSymbol);
                }
                saveState();
                renderToolbar();
                renderSidebar();
                renderContent();
            });
        });

        const searchInput = sidebar.querySelector(`#stocks-search-${windowId}`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                renderSidebar();
            });
        }
    }

    function renderSearchResults() {
        const q = searchQuery.toLowerCase();
        const results = allStocks.filter(s => 
            !state.watchlist.includes(s.symbol) &&
            (s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
        ).slice(0, 5);
        if (results.length === 0) return '';
        return `
            <div class="stocks-sidebar-group">
                <div class="stocks-sidebar-group-title">搜索结果</div>
                ${results.map(s => `
                    <div class="stocks-sidebar-row search" data-symbol="${s.symbol}">
                        <div class="stocks-sidebar-symbol">
                            <div class="stocks-sidebar-sym-text">${s.symbol}</div>
                            <div class="stocks-sidebar-name">${escapeHtml(s.name)}</div>
                        </div>
                        <div class="stocks-sidebar-price-block">
                            <div class="stocks-sidebar-price">${s.price.toFixed(2)}</div>
                            <div class="stocks-sidebar-change ${s.change >= 0 ? 'up' : 'down'}">${s.change >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderSparkline(stock) {
        const data = generateChartData(stock, timeRanges[0]);
        const w = 50, h = 20;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const points = data.map((p, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((p - min) / range) * h;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        const color = stock.change >= 0 ? '#34C759' : '#FF3B30';
        return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
    }

    // ============ Render Content ============
    function renderContent() {
        const stock = getCurrentStock();
        const range = timeRanges.find(r => r.id === state.timeRange) || timeRanges[0];
        const data = generateChartData(stock, range);
        const positive = stock.change >= 0;
        const color = positive ? '#34C759' : '#FF3B30';
        const news = getStockNews(stock);

        body.innerHTML = `
            <div class="stocks-content">
                <div class="stocks-content-scroll">
                    <div class="stocks-stock-header">
                        <div class="stocks-stock-symbol">${stock.symbol}</div>
                        <div class="stocks-stock-name">${escapeHtml(stock.name)}</div>
                        <div class="stocks-stock-price-row">
                            <div class="stocks-stock-price" style="color:${color};">${stock.price.toFixed(2)}</div>
                            <div class="stocks-stock-change ${positive ? 'up' : 'down'}">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">${positive ? '<path d="M7 14l5-5 5 5z"/>' : '<path d="M7 10l5 5 5-5z"/>'}</svg>
                                <span>${positive ? '+' : ''}${stock.change.toFixed(2)}</span>
                                <span>(${positive ? '+' : ''}${stock.changePercent.toFixed(2)}%)</span>
                            </div>
                        </div>
                        <div class="stocks-stock-time">截至 ${new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })} · ${stock.sector}</div>
                    </div>

                    <div class="stocks-chart-section">
                        <div class="stocks-chart-toolbar">
                            <div class="stocks-chart-range-group">
                                ${timeRanges.map(r => `
                                    <button class="stocks-chart-range ${state.timeRange === r.id ? 'active' : ''}" data-range="${r.id}">${r.name}</button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="stocks-chart-container" id="stocks-chart-${windowId}">
                            ${renderChart(data, color)}
                        </div>
                        <div class="stocks-chart-axis">
                            <span>${range.label}前</span>
                            <span></span>
                            <span>现在</span>
                        </div>
                    </div>

                    <div class="stocks-stats-grid">
                        <div class="stocks-stat-card">
                            <div class="stocks-stat-label">开盘价</div>
                            <div class="stocks-stat-value">${stock.open.toFixed(2)}</div>
                        </div>
                        <div class="stocks-stat-card">
                            <div class="stocks-stat-label">最高价</div>
                            <div class="stocks-stat-value" style="color:#34C759;">${stock.high.toFixed(2)}</div>
                        </div>
                        <div class="stocks-stat-card">
                            <div class="stocks-stat-label">最低价</div>
                            <div class="stocks-stat-value" style="color:#FF3B30;">${stock.low.toFixed(2)}</div>
                        </div>
                        <div class="stocks-stat-card">
                            <div class="stocks-stat-label">成交量</div>
                            <div class="stocks-stat-value">${stock.volume.toFixed(1)}M</div>
                        </div>
                        <div class="stocks-stat-card">
                            <div class="stocks-stat-label">市值</div>
                            <div class="stocks-stat-value">${stock.marketCap >= 1000 ? (stock.marketCap / 1000).toFixed(2) + '万亿' : stock.marketCap + '亿'}</div>
                        </div>
                        <div class="stocks-stat-card">
                            <div class="stocks-stat-label">市盈率 P/E</div>
                            <div class="stocks-stat-value">${stock.pe.toFixed(1)}</div>
                        </div>
                        <div class="stocks-stat-card">
                            <div class="stocks-stat-label">股息率</div>
                            <div class="stocks-stat-value">${stock.divYield > 0 ? stock.divYield.toFixed(2) + '%' : '—'}</div>
                        </div>
                        <div class="stocks-stat-card">
                            <div class="stocks-stat-label">板块</div>
                            <div class="stocks-stat-value">${stock.sector}</div>
                        </div>
                    </div>

                    <div class="stocks-news-section">
                        <h3 class="stocks-news-title">相关新闻</h3>
                        ${news.map(n => `
                            <div class="stocks-news-card" data-news-id="${n.id}">
                                <div class="stocks-news-source">${n.source}</div>
                                <div class="stocks-news-headline">${escapeHtml(n.title)}</div>
                                <div class="stocks-news-summary">${escapeHtml(n.summary)}</div>
                                <div class="stocks-news-time">${formatTime(n.time)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('[data-range]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.timeRange = btn.dataset.range;
                saveState();
                renderContent();
            });
        });

        body.querySelectorAll('[data-news-id]').forEach(card => {
            card.addEventListener('click', () => {
                if (window.showToast) {
                    const news = getStockNews(stock).find(n => n.id == card.dataset.newsId);
                    if (news) window.showToast(`已打开：${news.title}`, 'info');
                }
            });
        });

        // Setup chart hover
        setupChartHover(data, color, stock);
    }

    function renderChart(data, color) {
        const w = 800, h = 280;
        const padding = { top: 20, right: 60, bottom: 20, left: 10 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const padding_v = range * 0.1;
        const yMin = min - padding_v;
        const yMax = max + padding_v;
        const yRange = yMax - yMin;

        const points = data.map((p, i) => {
            const x = padding.left + (i / (data.length - 1)) * chartW;
            const y = padding.top + chartH - ((p - yMin) / yRange) * chartH;
            return { x, y, v: p };
        });

        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
        const areaPath = `M ${points[0].x} ${padding.top + chartH} ${points.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')} L ${points[points.length - 1].x} ${padding.top + chartH} Z`;

        // Y-axis labels
        const yLabels = [];
        for (let i = 0; i <= 4; i++) {
            const v = yMax - (i / 4) * yRange;
            const y = padding.top + (i / 4) * chartH;
            yLabels.push(`<text x="${w - padding.right + 8}" y="${y + 4}" font-size="11" fill="var(--text-tertiary)" font-family="-apple-system">${v.toFixed(2)}</text>`);
        }

        // Reference line for current price
        const currentPrice = data[data.length - 1];
        const currentY = padding.top + chartH - ((currentPrice - yMin) / yRange) * chartH;

        return `
            <svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="display:block;">
                <defs>
                    <linearGradient id="stocksGrad-${windowId}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:0.25" />
                        <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
                    </linearGradient>
                </defs>
                ${yLabels.join('')}
                <path d="${areaPath}" fill="url(#stocksGrad-${windowId})" />
                <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
                <line x1="${padding.left}" y1="${currentY}" x2="${padding.left + chartW}" y2="${currentY}" stroke="${color}" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.5" />
                <circle cx="${points[points.length - 1].x}" cy="${points[points.length - 1].y}" r="3" fill="${color}" />
                <circle cx="${points[points.length - 1].x}" cy="${points[points.length - 1].y}" r="6" fill="${color}" opacity="0.2" />
                <rect id="stocks-hover-${windowId}" x="0" y="0" width="1" height="${chartH}" fill="${color}" opacity="0" transform="translate(${padding.left}, ${padding.top})" />
                <circle id="stocks-hover-dot-${windowId}" cx="0" cy="0" r="4" fill="${color}" stroke="#fff" stroke-width="2" opacity="0" />
                <text id="stocks-hover-label-${windowId}" x="0" y="0" font-size="11" fill="${color}" font-weight="600" opacity="0" font-family="-apple-system"></text>
            </svg>
        `;
    }

    function setupChartHover(data, color, stock) {
        const chart = body.querySelector(`#stocks-chart-${windowId}`);
        if (!chart) return;
        const svg = chart.querySelector('svg');
        if (!svg) return;
        const hoverLine = body.querySelector(`#stocks-hover-${windowId}`);
        const hoverDot = body.querySelector(`#stocks-hover-dot-${windowId}`);
        const hoverLabel = body.querySelector(`#stocks-hover-label-${windowId}`);
        if (!hoverLine || !hoverDot || !hoverLabel) return;

        const w = 800, h = 280;
        const padding = { top: 20, right: 60, bottom: 20, left: 10 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const padding_v = range * 0.1;
        const yMin = min - padding_v;
        const yMax = max + padding_v;
        const yRange = yMax - yMin;

        svg.addEventListener('mousemove', (e) => {
            const rect = svg.getBoundingClientRect();
            const scaleX = w / rect.width;
            const x = (e.clientX - rect.left) * scaleX;
            const xInChart = Math.max(padding.left, Math.min(padding.left + chartW, x));
            const ratio = (xInChart - padding.left) / chartW;
            const idx = Math.floor(ratio * (data.length - 1));
            const value = data[idx];
            const y = padding.top + chartH - ((value - yMin) / yRange) * chartH;

            hoverLine.setAttribute('transform', `translate(${xInChart}, ${padding.top})`);
            hoverLine.setAttribute('opacity', '1');
            hoverDot.setAttribute('cx', xInChart);
            hoverDot.setAttribute('cy', y);
            hoverDot.setAttribute('opacity', '1');
            hoverLabel.setAttribute('x', xInChart + 8);
            hoverLabel.setAttribute('y', y - 8);
            hoverLabel.setAttribute('opacity', '1');
            hoverLabel.textContent = value.toFixed(2);
        });

        svg.addEventListener('mouseleave', () => {
            hoverLine.setAttribute('opacity', '0');
            hoverDot.setAttribute('opacity', '0');
            hoverLabel.setAttribute('opacity', '0');
        });
    }

    // ============ Render Toolbar ============
    function renderToolbar() {
        if (!toolbar) return;
        const stock = getCurrentStock();
        const isWatched = state.watchlist.includes(stock.symbol);
        toolbar.innerHTML = `
            <div class="stocks-toolbar">
                <button class="stocks-toolbar-btn ${isWatched ? 'active' : ''}" id="stocks-watch-${windowId}" title="${isWatched ? '从自选中移除' : '添加到自选'}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="${isWatched ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span>${isWatched ? '已关注' : '关注'}</span>
                </button>
            </div>
        `;
        toolbar.querySelector(`#stocks-watch-${windowId}`)?.addEventListener('click', () => {
            const idx = state.watchlist.indexOf(stock.symbol);
            if (idx > -1) {
                state.watchlist.splice(idx, 1);
            } else {
                state.watchlist.push(stock.symbol);
            }
            saveState();
            renderSidebar();
            renderToolbar();
        });
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
