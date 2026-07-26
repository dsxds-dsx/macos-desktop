window.renderMigrationAssistant = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.justifyContent = 'center';

    let step = 0;
    const steps = ['欢迎', '选择来源', '选择要传输的信息', '传输中', '完成'];
    let selectedSource = null;
    let transferProgress = 0;

    const sources = [
        { id: 1, name: 'MacBook Pro', type: 'Mac', icon: '💻', info: 'macOS Sonoma 14.2 · 512 GB', distance: '本机' },
        { id: 2, name: 'Time Machine 备份', type: 'Backup', icon: '💾', info: '外置磁盘 · 2 TB', distance: '已连接' },
        { id: 3, name: 'Windows PC', type: 'Windows', icon: '🖥️', info: 'Windows 11 · 用户文件', distance: '同一网络' },
        { id: 4, name: 'iPhone 15 Pro', type: 'iOS', icon: '📱', info: 'iOS 17.2 · 256 GB', distance: '附近' }
    ];

    const transferItems = [
        { id: 'user', name: '用户账户', icon: '👤', size: '45.2 GB', selected: true, desc: '个人文件夹、桌面、文稿' },
        { id: 'apps', name: '应用程序', icon: '📦', size: '12.8 GB', selected: true, desc: '已安装的应用程序' },
        { id: 'settings', name: '设置', icon: '⚙️', size: '156 MB', selected: true, desc: '系统偏好设置、网络设置' },
        { id: 'other', name: '其他文件', icon: '📁', size: '8.3 GB', selected: false, desc: '根目录上的文件和文件夹' }
    ];

    function render() {
        content.innerHTML = `
            <div style="width:680px;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden;">
                <div style="padding:24px 30px;background:linear-gradient(180deg,#f8f8fa,#fff);border-bottom:1px solid #eee;">
                    <div style="display:flex;align-items:center;gap:16px;">
                        <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;font-size:24px;">🔄</div>
                        <div>
                            <h1 style="margin:0;font-size:20px;font-weight:600;color:#1d1d1f;">迁移助理</h1>
                            <p style="margin:4px 0 0;font-size:13px;color:#86868b;">将信息从另一台电脑传输到这台 Mac</p>
                        </div>
                    </div>
                    ${step > 0 && step < 4 ? `
                    <div style="display:flex;align-items:center;gap:8px;margin-top:20px;">
                        ${steps.slice(0, 4).map((s, i) => `
                            <div style="flex:1;display:flex;align-items:center;">
                                <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;${i < step ? 'background:#34c759;color:#fff;' : i === step ? 'background:var(--accent-blue);color:#fff;' : 'background:#e5e5ea;color:#86868b;'}">${i < step ? '✓' : i + 1}</div>
                                <div style="flex:1;height:2px;background:${i < step ? '#34c759' : i === step ? 'var(--accent-blue)' : '#e5e5ea'};margin:0 8px;"></div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                <div style="min-height:400px;padding:30px;" id="ma-content"></div>
                <div style="padding:16px 30px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center;background:#fafafa;">
                    <div style="font-size:11px;color:#86868b;">步骤 ${step + 1} / 5</div>
                    <div style="display:flex;gap:10px;">
                        ${step > 0 && step !== 4 ? `<button id="ma-back" style="padding:8px 20px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;color:#333;">返回</button>` : ''}
                        ${step < 4 ? `<button id="ma-continue" style="padding:8px 24px;border:none;border-radius:8px;background:var(--accent-blue);color:#fff;cursor:pointer;font-size:13px;font-weight:500;${step === 1 && !selectedSource ? 'opacity:0.5;pointer-events:none;' : ''}">${step === 3 ? '开始传输' : '继续'}</button>` : `<button id="ma-close" style="padding:8px 24px;border:none;border-radius:8px;background:var(--accent-blue);color:#fff;cursor:pointer;font-size:13px;font-weight:500;">完成</button>`}
                    </div>
                </div>
            </div>
        `;

        const body2 = content.querySelector('#ma-content');

        if (step === 0) {
            body2.innerHTML = `
                <div style="text-align:center;padding:20px 0;">
                    <div style="font-size:64px;margin-bottom:20px;">🚀</div>
                    <h2 style="font-size:24px;font-weight:600;margin:0 0 12px;color:#1d1d1f;">欢迎使用迁移助理</h2>
                    <p style="font-size:14px;color:#666;max-width:460px;margin:0 auto 30px;line-height:1.6;">
                        您可以从另一台 Mac、Time Machine 备份、Windows PC 或 iOS 设备传输用户账户、应用程序、设置和其他文件。
                    </p>
                    <div style="background:#f5f5f7;border-radius:12px;padding:20px;text-align:left;max-width:460px;margin:0 auto;">
                        <h3 style="font-size:13px;font-weight:600;margin:0 0 12px;color:#1d1d1f;">开始之前</h3>
                        <ul style="margin:0;padding-left:20px;font-size:13px;color:#666;line-height:2;">
                            <li>确保您的旧电脑已连接电源</li>
                            <li>如果从另一台 Mac 传输，请确保两台电脑在同一网络上</li>
                            <li>传输过程中请不要关闭任何一台电脑</li>
                        </ul>
                    </div>
                </div>
            `;
        } else if (step === 1) {
            body2.innerHTML = `
                <h2 style="font-size:18px;font-weight:600;margin:0 0 8px;color:#1d1d1f;">选择来源</h2>
                <p style="font-size:13px;color:#666;margin:0 0 20px;">选择要从中传输信息的系统、备份或设备</p>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;" id="ma-sources">
                    ${sources.map(s => `<div class="ma-source" data-id="${s.id}" style="padding:16px;border:2px solid ${selectedSource === s.id ? 'var(--accent-blue)' : '#e5e5ea'};border-radius:12px;cursor:pointer;transition:all 0.2s;background:${selectedSource === s.id ? '#f0f7ff' : '#fff'};">
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
                            <div style="font-size:28px;">${s.icon}</div>
                            <div>
                                <div style="font-weight:600;font-size:14px;color:#1d1d1f;">${s.name}</div>
                                <div style="font-size:11px;color:#34c759;">${s.distance}</div>
                            </div>
                        </div>
                        <div style="font-size:12px;color:#86868b;">${s.info}</div>
                    </div>`).join('')}
                </div>
            `;
            content.querySelectorAll('.ma-source').forEach(el => {
                el.onclick = () => { selectedSource = sources.find(s => s.id === parseInt(el.dataset.id)); render(); };
            });
        } else if (step === 2) {
            body2.innerHTML = `
                <h2 style="font-size:18px;font-weight:600;margin:0 0 8px;color:#1d1d1f;">选择要传输的信息</h2>
                <p style="font-size:13px;color:#666;margin:0 0 20px;">选择要传输到这台 Mac 的项目</p>
                <div style="display:flex;flex-direction:column;gap:10px;" id="ma-items">
                    ${transferItems.map((item, i) => `<div class="ma-item" data-i="${i}" style="padding:14px 16px;border:1px solid #e5e5ea;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:14px;background:${item.selected ? '#f0f7ff' : '#fff'};">
                        <div style="width:20px;height:20px;border-radius:4px;border:2px solid ${item.selected ? 'var(--accent-blue)' : '#ccc'};background:${item.selected ? 'var(--accent-blue)' : 'transparent'};display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;flex-shrink:0;">${item.selected ? '✓' : ''}</div>
                        <div style="font-size:24px;">${item.icon}</div>
                        <div style="flex:1;">
                            <div style="font-weight:500;font-size:14px;color:#1d1d1f;">${item.name}</div>
                            <div style="font-size:12px;color:#86868b;">${item.desc}</div>
                        </div>
                        <div style="font-size:13px;color:#86868b;font-weight:500;">${item.size}</div>
                    </div>`).join('')}
                </div>
                <div style="margin-top:20px;padding:12px 16px;background:#f5f5f7;border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:13px;color:#666;">总计大小</span>
                    <span style="font-size:15px;font-weight:600;color:#1d1d1f;" id="ma-totalSize">${transferItems.filter(i => i.selected).reduce((a, i) => a + parseFloat(i.size), 0).toFixed(1)} GB</span>
                </div>
            `;
            content.querySelectorAll('.ma-item').forEach(el => {
                el.onclick = () => {
                    const i = parseInt(el.dataset.i);
                    transferItems[i].selected = !transferItems[i].selected;
                    render();
                };
            });
        } else if (step === 3) {
            body2.innerHTML = `
                <div style="text-align:center;padding:40px 0;">
                    <div style="font-size:48px;margin-bottom:20px;">${transferProgress < 100 ? '⏳' : '✅'}</div>
                    <h2 style="font-size:20px;font-weight:600;margin:0 0 12px;color:#1d1d1f;">${transferProgress < 100 ? '正在传输信息...' : '传输已准备好完成'}</h2>
                    <p style="font-size:13px;color:#666;margin:0 0 30px;">${transferProgress < 100 ? '正在从 ' + (selectedSource?.name || '来源') + ' 传输项目\n请不要关闭电脑或断开连接' : '信息已成功传输到这台 Mac'}</p>
                    <div style="max-width:400px;margin:0 auto 20px;">
                        <div style="height:8px;background:#e5e5ea;border-radius:4px;overflow:hidden;margin-bottom:8px;">
                            <div style="height:100%;width:${transferProgress}%;background:var(--accent-blue);border-radius:4px;transition:width 0.3s;"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:11px;color:#86868b;">
                            <span>${Math.floor(transferProgress * (transferItems.filter(i => i.selected).reduce((a, i) => a + parseFloat(i.size), 0) / 100))} GB</span>
                            <span>${transferProgress}%</span>
                            <span>剩余约 ${Math.max(0, Math.ceil((100 - transferProgress) * 0.2))} 分钟</span>
                        </div>
                    </div>
                    <div style="text-align:left;max-width:400px;margin:0 auto;font-size:12px;color:#86868b;">
                        ${transferItems.filter(i => i.selected && (parseFloat(i.size) * 100 / transferItems.filter(x => x.selected).reduce((a, x) => a + parseFloat(x.size), 0)) < transferProgress).map(i => `<div style="padding:6px 0;display:flex;align-items:center;gap:8px;"><span style="color:#34c759;">✓</span> ${i.name}</div>`).join('')}
                        ${transferProgress < 100 && transferItems.filter(i => i.selected).some(i => {
                            const threshold = transferItems.slice(0, transferItems.filter(x => x.selected).indexOf(i) + 1).reduce((a, x) => a + parseFloat(x.size), 0) / transferItems.filter(x => x.selected).reduce((a, x) => a + parseFloat(x.size), 0) * 100;
                            return threshold > transferProgress;
                        }) ? `<div style="padding:6px 0;display:flex;align-items:center;gap:8px;color:var(--accent-blue);"><span>⏳</span> ${transferItems.find(i => i.selected && transferItems.slice(0, transferItems.filter(x => x.selected).indexOf(i) + 1).reduce((a, x) => a + parseFloat(x.size), 0) / transferItems.filter(x => x.selected).reduce((a, x) => a + parseFloat(x.size), 0) * 100 > transferProgress)?.name}</div>` : ''}
                    </div>
                </div>
            `;

            if (transferProgress < 100) {
                setTimeout(() => {
                    transferProgress += Math.random() * 3 + 1;
                    if (transferProgress > 100) transferProgress = 100;
                    render();
                }, 500);
            }
        } else if (step === 4) {
            body2.innerHTML = `
                <div style="text-align:center;padding:30px 0;">
                    <div style="width:80px;height:80px;border-radius:50%;background:#34c759;display:flex;align-items:center;justify-content:center;font-size:40px;color:#fff;margin:0 auto 24px;">✓</div>
                    <h2 style="font-size:24px;font-weight:600;margin:0 0 12px;color:#1d1d1f;">迁移完成</h2>
                    <p style="font-size:14px;color:#666;max-width:400px;margin:0 auto 30px;line-height:1.6;">
                        您的信息已成功传输到这台 Mac。若要使传输的设置生效，您需要重新启动电脑。
                    </p>
                    <div style="background:#f5f5f7;border-radius:12px;padding:20px;max-width:400px;margin:0 auto;text-align:left;">
                        <h3 style="font-size:13px;font-weight:600;margin:0 0 12px;color:#1d1d1f;">已传输的内容</h3>
                        ${transferItems.filter(i => i.selected).map(i => `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#666;"><span>${i.icon} ${i.name}</span><span style="color:#34c759;">✓</span></div>`).join('')}
                    </div>
                </div>
            `;
        }

        if (content.querySelector('#ma-back')) content.querySelector('#ma-back').onclick = () => { step--; transferProgress = 0; render(); };
        if (content.querySelector('#ma-continue')) content.querySelector('#ma-continue').onclick = () => { step++; if (step < 4) transferProgress = 0; render(); };
        if (content.querySelector('#ma-close')) content.querySelector('#ma-close').onclick = () => {
            if (window.appManager && windowId) {
                try { window.appManager.closeWindow(windowId); } catch {}
            }
        };
    }

    render();
};
