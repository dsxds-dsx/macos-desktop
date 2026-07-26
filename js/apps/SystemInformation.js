window.renderSystemInformation = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#fff';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    let currentTab = 'overview';
    const tabs = [
        { id: 'overview', name: '概览', icon: '🖥️' },
        { id: 'displays', name: '显示器', icon: '🖥️' },
        { id: 'network', name: '网络', icon: '🌐' },
        { id: 'storage', name: '存储', icon: '💾' },
        { id: 'memory', name: '内存', icon: '🧠' },
        { id: 'cpu', name: '处理器', icon: '⚡' },
        { id: 'battery', name: '电源', icon: '🔋' },
        { id: 'software', name: '软件', icon: '📦' }
    ];

    const sysInfo = {
        model: 'MacBook Pro (16英寸, 2024)',
        serial: 'C02XXXXXXXXX',
        macos: 'macOS Sonoma 14.2.1 (23C71)',
        cpu: 'Apple M3 Max',
        cpuCores: '16核 (12性能 + 4能效)',
        gpu: '40核 GPU',
        memory: '64 GB 统一内存',
        storage: '2 TB',
        storageUsed: 1245,
        storageTotal: 2000,
        startupDisk: 'Macintosh HD',
        serialNumber: 'C02XL8XJXXXX',
        hardwareUUID: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
        uptime: '14天3小时42分钟',
        displays: [
            { name: '内置 Liquid Retina XDR', resolution: '3456 × 2234', refresh: '120Hz ProMotion', size: '16.2英寸', main: true },
            { name: 'Studio Display', resolution: '5120 × 2880', refresh: '60Hz', size: '27英寸', main: false }
        ],
        network: {
            wifi: { name: 'Wi-Fi', status: '已连接', ssid: 'HomeNetwork', ip: '192.168.1.100', mac: 'XX:XX:XX:XX:XX:XX', speed: '1200 Mbps' },
            ethernet: { name: '以太网', status: '未连接', ip: '-', mac: 'XX:XX:XX:XX:XX:XY' },
            bluetooth: { name: '蓝牙', status: '已开启', devices: 3 }
        },
        battery: {
            condition: '正常',
            cycleCount: 127,
            maxCapacity: 98,
            charging: true,
            level: 87,
            timeRemaining: '1小时24分钟至充满'
        },
        software: {
            systemVersion: '14.2.1',
            kernelVersion: 'Darwin 23.2.0',
            bootVolume: 'Macintosh HD',
            bootMode: '正常',
            secureVM: '已启用',
            systemIntegrity: '已启用',
            xprotect: '2024年1月15日'
        }
    };

    function bytesToGB(bytes) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(1);
    }

    function render() {
        content.innerHTML = `
            <div style="display:flex;flex:1;overflow:hidden;">
                <div style="width:200px;background:#f5f5f5;border-right:1px solid #ddd;display:flex;flex-direction:column;">
                    <div style="padding:20px 16px;text-align:center;border-bottom:1px solid #ddd;">
                        <div style="font-size:48px;margin-bottom:8px;">💻</div>
                        <div style="font-size:13px;font-weight:600;color:#333;">${sysInfo.model}</div>
                        <div style="font-size:11px;color:#888;margin-top:2px;">${sysInfo.macos.split(' ')[0]} ${sysInfo.macos.split(' ')[1]}</div>
                    </div>
                    <div style="flex:1;overflow-y:auto;padding:8px;" id="si-tabs"></div>
                    <div style="padding:12px;border-top:1px solid #ddd;">
                        <button id="si-support" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;font-size:12px;color:#333;">支持与服务</button>
                    </div>
                </div>
                <div style="flex:1;overflow-y:auto;background:#fff;" id="si-content"></div>
            </div>
        `;

        const tabsEl = content.querySelector('#si-tabs');
        tabs.forEach(t => {
            const item = document.createElement('div');
            item.style.cssText = `padding:10px 14px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;margin-bottom:2px;${t.id === currentTab ? 'background:var(--accent-blue);color:#fff;' : 'color:#333;'}`;
            item.innerHTML = `<span>${t.icon}</span><span>${t.name}</span>`;
            item.onclick = () => { currentTab = t.id; render(); };
            tabsEl.appendChild(item);
        });

        const contentEl = content.querySelector('#si-content');

        if (currentTab === 'overview') {
            contentEl.innerHTML = `
                <div style="padding:40px;max-width:700px;">
                    <div style="display:flex;gap:40px;align-items:flex-start;margin-bottom:40px;">
                        <div style="font-size:120px;">💻</div>
                        <div style="flex:1;">
                            <h2 style="margin:0 0 4px;font-size:28px;font-weight:600;">${sysInfo.model}</h2>
                            <p style="margin:0;color:#666;font-size:14px;">${sysInfo.macos}</p>
                        </div>
                    </div>
                    <div style="display:grid;grid-template-columns:180px 1fr;gap:0;border:1px solid #e5e5ea;border-radius:12px;overflow:hidden;font-size:13px;">
                        ${[
                            ['芯片', `<strong>${sysInfo.cpu}</strong><br><span style="color:#666;">${sysInfo.cpuCores}</span><br><span style="color:#666;">${sysInfo.gpu}</span>`],
                            ['内存', `<strong>${sysInfo.memory}</strong>`],
                            ['启动磁盘', `<strong>${sysInfo.startupDisk}</strong>`],
                            ['序列号', `<span style="font-family:monospace;">${sysInfo.serialNumber}</span>`],
                            ['操作系统', `<strong>${sysInfo.macos}</strong>`],
                            ['运行时间', `${sysInfo.uptime}`]
                        ].map(([label, val], i, arr) => `
                            <div style="padding:14px 20px;background:${i % 2 === 0 ? '#f9f9fb' : '#fff'};color:#666;display:flex;align-items:center;">${label}</div>
                            <div style="padding:14px 20px;background:${i % 2 === 0 ? '#f9f9fb' : '#fff'};line-height:1.6;border-left:1px solid #e5e5ea;">${val}</div>
                        `).join('')}
                    </div>
                    <div style="margin-top:24px;display:flex;gap:10px;">
                        <button id="si-report" style="padding:8px 18px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:12px;">系统报告...</button>
                        <button id="si-settings" style="padding:8px 18px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:12px;">系统设置...</button>
                    </div>
                </div>
            `;
        } else if (currentTab === 'displays') {
            contentEl.innerHTML = `
                <div style="padding:40px;max-width:700px;">
                    <h2 style="margin:0 0 24px;font-size:22px;font-weight:600;">图形/显示器</h2>
                    <div style="display:flex;flex-direction:column;gap:20px;">
                        ${sysInfo.displays.map((d, i) => `
                            <div style="border:1px solid #e5e5ea;border-radius:12px;padding:20px;${d.main ? 'border-color:var(--accent-blue);background:#f0f7ff;' : ''}">
                                <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
                                    <div style="font-size:40px;">🖥️</div>
                                    <div>
                                        <div style="font-size:15px;font-weight:600;">${d.name} ${d.main ? '<span style="font-size:11px;color:var(--accent-blue);margin-left:8px;">(主显示器)</span>' : ''}</div>
                                    </div>
                                </div>
                                <div style="display:grid;grid-template-columns:120px 1fr;gap:10px;font-size:13px;">
                                    <div style="color:#666;">分辨率</div><div>${d.resolution}</div>
                                    <div style="color:#666;">刷新率</div><div>${d.refresh}</div>
                                    <div style="color:#666;">尺寸</div><div>${d.size}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (currentTab === 'storage') {
            const usedPercent = (sysInfo.storageUsed / sysInfo.storageTotal) * 100;
            contentEl.innerHTML = `
                <div style="padding:40px;max-width:700px;">
                    <h2 style="margin:0 0 24px;font-size:22px;font-weight:600;">存储</h2>
                    <div style="border:1px solid #e5e5ea;border-radius:12px;padding:24px;margin-bottom:20px;">
                        <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
                            <div style="font-size:48px;">💾</div>
                            <div style="flex:1;">
                                <div style="font-size:15px;font-weight:600;margin-bottom:4px;">${sysInfo.startupDisk}</div>
                                <div style="font-size:12px;color:#666;">${sysInfo.storage} APPLE SSD</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:20px;font-weight:700;">${(sysInfo.storageTotal - sysInfo.storageUsed).toFixed(0)} GB <span style="font-weight:400;font-size:13px;color:#666;">可用</span></div>
                                <div style="font-size:12px;color:#888;">共 ${sysInfo.storageTotal} GB</div>
                            </div>
                        </div>
                        <div style="height:20px;border-radius:10px;background:#e5e5ea;overflow:hidden;display:flex;">
                            <div title="系统" style="width:${usedPercent * 0.35}%;background:#ff9500;"></div>
                            <div title="应用" style="width:${usedPercent * 0.25}%;background:#5856d6;"></div>
                            <div title="文稿" style="width:${usedPercent * 0.2}%;background:#34c759;"></div>
                            <div title="照片" style="width:${usedPercent * 0.15}%;background:#ff3b30;"></div>
                            <div title="其他" style="width:${usedPercent * 0.05}%;background:#8e8e93;"></div>
                        </div>
                        <div style="display:flex;gap:20px;margin-top:12px;font-size:11px;color:#666;flex-wrap:wrap;">
                            <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#ff9500;margin-right:4px;"></span>系统</span>
                            <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#5856d6;margin-right:4px;"></span>应用</span>
                            <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#34c759;margin-right:4px;"></span>文稿</span>
                            <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#ff3b30;margin-right:4px;"></span>照片</span>
                            <span><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#8e8e93;margin-right:4px;"></span>其他</span>
                        </div>
                    </div>
                    <button style="padding:8px 18px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:12px;">管理存储...</button>
                </div>
            `;
        } else if (currentTab === 'memory') {
            contentEl.innerHTML = `
                <div style="padding:40px;max-width:700px;">
                    <h2 style="margin:0 0 24px;font-size:22px;font-weight:600;">内存</h2>
                    <div style="border:1px solid #e5e5ea;border-radius:12px;padding:24px;">
                        <div style="display:flex;gap:20px;align-items:center;margin-bottom:24px;">
                            <div style="font-size:56px;">🧠</div>
                            <div>
                                <div style="font-size:24px;font-weight:700;">${sysInfo.memory}</div>
                                <div style="font-size:13px;color:#666;">LPDDR5 统一内存</div>
                                <div style="font-size:12px;color:#34c759;margin-top:4px;">内存压力：正常</div>
                            </div>
                        </div>
                        <div style="margin-bottom:16px;">
                            <div style="display:flex;justify-content:space-between;font-size:12px;color:#666;margin-bottom:6px;">
                                <span>内存使用</span><span>42.3 GB / 64 GB</span>
                            </div>
                            <div style="height:12px;border-radius:6px;background:#e5e5ea;overflow:hidden;">
                                <div style="width:66%;height:100%;background:linear-gradient(90deg,#34c759,#30d158);"></div>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;font-size:12px;">
                            <div style="background:#f5f5f7;border-radius:8px;padding:12px;">
                                <div style="color:#666;margin-bottom:4px;">已使用</div><div style="font-size:16px;font-weight:600;">42.3 GB</div>
                            </div>
                            <div style="background:#f5f5f7;border-radius:8px;padding:12px;">
                                <div style="color:#666;margin-bottom:4px;">已缓存</div><div style="font-size:16px;font-weight:600;">18.7 GB</div>
                            </div>
                            <div style="background:#f5f5f7;border-radius:8px;padding:12px;">
                                <div style="color:#666;margin-bottom:4px;">交换已用</div><div style="font-size:16px;font-weight:600;">0 MB</div>
                            </div>
                            <div style="background:#f5f5f7;border-radius:8px;padding:12px;">
                                <div style="color:#666;margin-bottom:4px;">内存带宽</div><div style="font-size:16px;font-weight:600;">400 GB/s</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentTab === 'cpu') {
            contentEl.innerHTML = `
                <div style="padding:40px;max-width:700px;">
                    <h2 style="margin:0 0 24px;font-size:22px;font-weight:600;">处理器</h2>
                    <div style="border:1px solid #e5e5ea;border-radius:12px;padding:24px;">
                        <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:24px;">
                            <div style="font-size:56px;">⚡</div>
                            <div>
                                <div style="font-size:24px;font-weight:700;">${sysInfo.cpu}</div>
                                <div style="font-size:13px;color:#666;">${sysInfo.cpuCores}</div>
                                <div style="font-size:13px;color:#666;">${sysInfo.gpu}</div>
                                <div style="font-size:12px;color:#888;margin-top:4px;">3纳米工艺</div>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;font-size:12px;margin-bottom:20px;">
                            ${Array.from({length:16}, (_,i) => {
                                const usage = 5 + Math.random() * 60;
                                return `<div><div style="text-align:center;color:#666;margin-bottom:4px;">${i+1}</div><div style="height:60px;background:#e5e5ea;border-radius:4px;position:relative;overflow:hidden;"><div style="position:absolute;bottom:0;width:100%;height:${usage}%;background:${usage > 80 ? '#ff3b30' : usage > 50 ? '#ff9500' : '#34c759'};"></div></div><div style="text-align:center;color:#888;margin-top:2px;">${usage.toFixed(0)}%</div></div>`;
                            }).join('')}
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;font-size:12px;">
                            <div style="background:#f5f5f7;border-radius:8px;padding:12px;">
                                <div style="color:#666;margin-bottom:4px;">当前使用率</div><div style="font-size:18px;font-weight:600;">${(15 + Math.random() * 30).toFixed(1)}%</div>
                            </div>
                            <div style="background:#f5f5f7;border-radius:8px;padding:12px;">
                                <div style="color:#666;margin-bottom:4px;">空闲</div><div style="font-size:18px;font-weight:600;">${(60 + Math.random() * 20).toFixed(1)}%</div>
                            </div>
                            <div style="background:#f5f5f7;border-radius:8px;padding:12px;">
                                <div style="color:#666;margin-bottom:4px;">进程数</div><div style="font-size:18px;font-weight:600;">342</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentTab === 'network') {
            contentEl.innerHTML = `
                <div style="padding:40px;max-width:700px;">
                    <h2 style="margin:0 0 24px;font-size:22px;font-weight:600;">网络</h2>
                    ${Object.values(sysInfo.network).map(net => `
                        <div style="border:1px solid #e5e5ea;border-radius:12px;padding:20px;margin-bottom:16px;${net.status === '已连接' ? 'border-color:#34c759;' : ''}">
                            <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
                                <div style="font-size:28px;">${net.name === 'Wi-Fi' ? '📶' : net.name === '以太网' ? '🔌' : '🔵'}</div>
                                <div style="flex:1;">
                                    <div style="font-size:15px;font-weight:600;">${net.name}</div>
                                    <div style="font-size:12px;color:${net.status === '已连接' || net.status === '已开启' ? '#34c759' : '#888'};margin-top:2px;">${net.status}</div>
                                </div>
                            </div>
                            <div style="display:grid;grid-template-columns:100px 1fr;gap:8px;font-size:13px;">
                                ${net.ssid ? `<><div style="color:#666;">网络名称</div><div>${net.ssid}</div></>` : ''}
                                ${net.ip ? `<><div style="color:#666;">IP 地址</div><div style="font-family:monospace;">${net.ip}</div></>` : ''}
                                ${net.mac ? `<><div style="color:#666;">MAC 地址</div><div style="font-family:monospace;">${net.mac}</div></>` : ''}
                                ${net.speed ? `<><div style="color:#666;">传输速率</div><div>${net.speed}</div></>` : ''}
                                ${net.devices ? `<><div style="color:#666;">已连接设备</div><div>${net.devices} 个</div></>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (currentTab === 'battery') {
            contentEl.innerHTML = `
                <div style="padding:40px;max-width:700px;">
                    <h2 style="margin:0 0 24px;font-size:22px;font-weight:600;">电源</h2>
                    <div style="border:1px solid #e5e5ea;border-radius:12px;padding:24px;">
                        <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;">
                            <div style="font-size:64px;">🔋</div>
                            <div style="flex:1;">
                                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                                    <div style="flex:1;height:24px;background:#e5e5ea;border-radius:4px;overflow:hidden;position:relative;">
                                        <div style="height:100%;width:${sysInfo.battery.level}%;background:linear-gradient(90deg,#34c759,#30d158);border-radius:4px;"></div>
                                    </div>
                                    <div style="font-size:20px;font-weight:700;min-width:60px;text-align:right;">${sysInfo.battery.level}%</div>
                                </div>
                                <div style="font-size:13px;color:${sysInfo.battery.charging ? '#34c759' : '#666'};display:flex;align-items:center;gap:6px;">
                                    ${sysInfo.battery.charging ? '⚡ 电源适配器已连接' : '🔌 使用电池'} · ${sysInfo.battery.timeRemaining}
                                </div>
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;font-size:13px;">
                            <div style="background:#f5f5f7;border-radius:8px;padding:14px;">
                                <div style="color:#666;font-size:11px;margin-bottom:4px;">电池健康</div>
                                <div style="font-size:16px;font-weight:600;color:${sysInfo.battery.maxCapacity > 80 ? '#34c759' : '#ff9500'};">${sysInfo.battery.condition}</div>
                                <div style="font-size:11px;color:#888;margin-top:2px;">最大容量：${sysInfo.battery.maxCapacity}%</div>
                            </div>
                            <div style="background:#f5f5f7;border-radius:8px;padding:14px;">
                                <div style="color:#666;font-size:11px;margin-bottom:4px;">循环计数</div>
                                <div style="font-size:16px;font-weight:600;">${sysInfo.battery.cycleCount}</div>
                                <div style="font-size:11px;color:#888;margin-top:2px;">设计容量：1000 次</div>
                            </div>
                            <div style="background:#f5f5f7;border-radius:8px;padding:14px;">
                                <div style="color:#666;font-size:11px;margin-bottom:4px;">充满电容量</div>
                                <div style="font-size:16px;font-weight:600;">95.8 Wh</div>
                            </div>
                            <div style="background:#f5f5f7;border-radius:8px;padding:14px;">
                                <div style="color:#666;font-size:11px;margin-bottom:4px;">电压</div>
                                <div style="font-size:16px;font-weight:600;">12.86 V</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentTab === 'software') {
            contentEl.innerHTML = `
                <div style="padding:40px;max-width:700px;">
                    <h2 style="margin:0 0 24px;font-size:22px;font-weight:600;">软件</h2>
                    <div style="border:1px solid #e5e5ea;border-radius:12px;overflow:hidden;font-size:13px;">
                        ${[
                            ['系统版本', sysInfo.software.systemVersion],
                            ['macOS 名称', 'Sonoma'],
                            ['内核版本', sysInfo.software.kernelVersion],
                            ['启动宗卷', sysInfo.software.bootVolume],
                            ['启动模式', sysInfo.software.bootMode],
                            ['安全虚拟机', sysInfo.software.secureVM],
                            ['系统完整性保护', sysInfo.software.systemIntegrity],
                            ['XProtect 版本', sysInfo.software.xprotect],
                            ['开机时间', sysInfo.uptime],
                            ['硬件 UUID', `<span style="font-family:monospace;font-size:12px;">${sysInfo.hardwareUUID}</span>`]
                        ].map(([label, val], i, arr) => `
                            <div style="display:grid;grid-template-columns:160px 1fr;gap:20px;padding:14px 20px;background:${i % 2 === 0 ? '#f9f9fb' : '#fff'};${i < arr.length-1 ? 'border-bottom:1px solid #e5e5ea;' : ''}">
                                <div style="color:#666;">${label}</div><div>${val}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="margin-top:20px;display:flex;gap:10px;">
                        <button style="padding:8px 18px;border:1px solid #007aff;border-radius:8px;background:#007aff;color:#fff;cursor:pointer;font-size:12px;font-weight:500;">软件更新...</button>
                        <button id="si-legal" style="padding:8px 18px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:12px;">法律声明</button>
                    </div>
                </div>
            `;
        }

        content.querySelector('#si-support')?.addEventListener('click', () => {
            alert('正在打开 Apple 支持页面...');
        });
        content.querySelector('#si-report')?.addEventListener('click', () => {
            alert('正在生成系统报告...');
        });
        content.querySelector('#si-settings')?.addEventListener('click', () => {
            if (window.appManager) {
                try { window.appManager.openApp('Settings'); } catch {}
            }
        });
    }

    render();
};
