window.renderStocks = function(body, sidebar, toolbar, windowId) {
    let selectedStock = 'AAPL';
    let chartPoints = [];
    
    for (let i = 0; i < 50; i++) {
        chartPoints.push(150 + Math.sin(i * 0.3) * 20 + Math.random() * 10);
    }

    const stocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.34, changePercent: 1.27, color: '#34C759' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -1.23, changePercent: -0.86, color: '#FF3B30' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 4.56, changePercent: 1.22, color: '#34C759' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23, color: '#FF3B30' },
        { symbol: 'AMZN', name: 'Amazon.com', price: 153.42, change: 1.89, changePercent: 1.25, color: '#34C759' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 548.22, change: 12.45, changePercent: 2.32, color: '#34C759' }
    ];

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:280px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);display:flex;flex-direction:column;">
                <div style="padding:16px;">
                    <div style="font-size:22px;font-weight:700;margin-bottom:12px;">📈 股票</div>
                    <input type="text" placeholder="搜索股票代码" style="width:100%;padding:8px 12px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:8px;font-size:13px;outline:none;">
                </div>
                <div style="flex:1;overflow-y:auto;padding:0 8px;">
                    ${stocks.map(s => `
                        <div data-symbol="${s.symbol}" style="padding:12px;border-radius:8px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;background:${selectedStock === s.symbol ? 'var(--accent-blue)' : 'transparent'};color:${selectedStock === s.symbol ? '#fff' : 'inherit'};">
                            <div>
                                <div style="font-weight:600;font-size:14px;">${s.symbol}</div>
                                <div style="font-size:11px;opacity:0.7;">${s.name}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-weight:600;font-size:14px;">$${s.price.toFixed(2)}</div>
                                <div style="font-size:11px;color:${selectedStock === s.symbol ? 'rgba(255,255,255,0.8)' : (s.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)')};">
                                    ${s.change >= 0 ? '+' : ''}${s.change.toFixed(2)} (${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%)
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sidebar.querySelectorAll('[data-symbol]').forEach(item => {
            item.addEventListener('click', () => {
                selectedStock = item.dataset.symbol;
                chartPoints = [];
                for (let i = 0; i < 50; i++) {
                    chartPoints.push(100 + Math.sin(i * 0.3) * 20 + Math.random() * 30);
                }
                render();
            });
        });
    }

    function renderContent() {
        const stock = stocks.find(s => s.symbol === selectedStock);
        const min = Math.min(...chartPoints);
        const max = Math.max(...chartPoints);
        const w = 600, h = 250;
        const points = chartPoints.map((p, i) => {
            const x = (i / (chartPoints.length - 1)) * w;
            const y = h - ((p - min) / (max - min)) * h;
            return `${x},${y}`;
        }).join(' ');

        body.innerHTML = `
            <div style="flex:1;padding:32px;background:var(--bg-elevated);overflow-y:auto;">
                <div style="margin-bottom:24px;">
                    <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:4px;">
                        <h1 style="font-size:28px;font-weight:700;">${stock.symbol}</h1>
                        <span style="font-size:16px;color:var(--text-tertiary);">${stock.name}</span>
                    </div>
                    <div style="display:flex;align-items:baseline;gap:12px;">
                        <span style="font-size:40px;font-weight:200;">$${stock.price.toFixed(2)}</span>
                        <span style="font-size:16px;color:${stock.change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'};font-weight:500;">
                            ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)
                        </span>
                    </div>
                    <div style="font-size:13px;color:var(--text-tertiary);margin-top:4px;">今日 ${new Date().toLocaleDateString('zh-CN')}</div>
                </div>
                
                <div style="background:var(--button-bg);border-radius:16px;padding:24px;margin-bottom:24px;">
                    <svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="display:block;">
                        <defs>
                            <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:${stock.color};stop-opacity:0.3" />
                                <stop offset="100%" style="stop-color:${stock.color};stop-opacity:0" />
                            </linearGradient>
                        </defs>
                        <polygon points="0,${h} ${points} ${w},${h}" fill="url(#chartGrad)" />
                        <polyline points="${points}" fill="none" stroke="${stock.color}" stroke-width="2" stroke-linejoin="round" />
                    </svg>
                    <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:11px;color:var(--text-tertiary);">
                        <span>9:30</span>
                        <span>11:00</span>
                        <span>13:00</span>
                        <span>15:00</span>
                        <span>16:00</span>
                    </div>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
                    <div style="background:var(--button-bg);padding:16px;border-radius:12px;">
                        <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px;">开盘</div>
                        <div style="font-size:18px;font-weight:600;margin-top:4px;">$${(stock.price - stock.change).toFixed(2)}</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:12px;">
                        <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px;">最高</div>
                        <div style="font-size:18px;font-weight:600;margin-top:4px;">$${(stock.price + 2).toFixed(2)}</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:12px;">
                        <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px;">最低</div>
                        <div style="font-size:18px;font-weight:600;margin-top:4px;">$${(stock.price - 3).toFixed(2)}</div>
                    </div>
                    <div style="background:var(--button-bg);padding:16px;border-radius:12px;">
                        <div style="font-size:11px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px;">成交量</div>
                        <div style="font-size:18px;font-weight:600;margin-top:4px;">52.3M</div>
                    </div>
                </div>
            </div>
        `;
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    render();
};
