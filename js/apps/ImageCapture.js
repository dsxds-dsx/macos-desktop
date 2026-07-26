window.renderImageCapture = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#1a1a1a';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    let devices = [
        { id: 1, name: 'FaceTime 高清摄像头', type: 'camera', connected: true, icon: '📷' },
        { id: 2, name: 'iPhone 15 Pro', type: 'camera', connected: true, icon: '📱' },
        { id: 3, name: '扫描仪', type: 'scanner', connected: false, icon: '🖨️' },
        { id: 4, name: 'SD 卡', type: 'storage', connected: true, icon: '💳' }
    ];

    let capturedImages = JSON.parse(localStorage.getItem('imagecapture_images') || JSON.stringify([
        { id: 1, name: 'IMG_001.jpg', date: Date.now() - 86400000, size: '2.4 MB', thumb: '🏔️' },
        { id: 2, name: 'IMG_002.jpg', date: Date.now() - 86000000, size: '1.8 MB', thumb: '🌅' },
        { id: 3, name: 'IMG_003.jpg', date: Date.now() - 85000000, size: '3.1 MB', thumb: '🌸' },
        { id: 4, name: 'IMG_004.jpg', date: Date.now() - 84000000, size: '2.0 MB', thumb: '🏙️' }
    ]));

    let isCapturing = false;
    let selectedDevice = devices[0];
    let selectedImage = null;

    function save() {
        localStorage.setItem('imagecapture_images', JSON.stringify(capturedImages));
    }

    function render() {
        content.innerHTML = `
            <div style="height:48px;background:linear-gradient(180deg,#2d2d2d,#252525);border-bottom:1px solid #444;display:flex;align-items:center;padding:0 16px;gap:12px;">
                <select id="ic-deviceSelect" style="padding:6px 12px;background:#3d3d3d;border:1px solid #555;border-radius:6px;color:#fff;font-size:12px;min-width:200px;">
                    ${devices.map(d => `<option value="${d.id}" ${d.id === selectedDevice.id ? 'selected' : ''} ${!d.connected ? 'disabled' : ''}>${d.icon} ${d.name} ${d.connected ? '' : '(未连接)'}</option>`).join('')}
                </select>
                <div style="flex:1;"></div>
                <button id="ic-importAll" style="padding:6px 16px;background:var(--accent-blue);border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;">全部导入</button>
            </div>
            <div style="display:flex;flex:1;overflow:hidden;">
                <div style="width:220px;background:#252525;border-right:1px solid #333;display:flex;flex-direction:column;">
                    <div style="padding:12px;border-bottom:1px solid #333;">
                        <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:0 0 10px;">设备</h4>
                        <div id="ic-deviceList"></div>
                    </div>
                    <div style="padding:12px;border-bottom:1px solid #333;">
                        <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:0 0 10px;">导入到</h4>
                        <select style="width:100%;padding:6px;background:#3d3d3d;border:1px solid #555;border-radius:4px;color:#fff;font-size:12px;">
                            <option>图片</option><option>桌面</option><option>下载</option>
                        </select>
                    </div>
                    <div style="padding:12px;">
                        <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:0 0 10px;">删除后</h4>
                        <label style="display:flex;align-items:center;gap:8px;color:#ccc;font-size:12px;cursor:pointer;">
                            <input type="checkbox" checked> 保留项目
                        </label>
                    </div>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
                    <div style="height:280px;background:#000;display:flex;align-items:center;justify-content:center;position:relative;">
                        <div style="font-size:80px;${isCapturing ? 'animation: pulse 1s infinite;' : ''}" id="ic-preview">${selectedDevice.icon}</div>
                        ${isCapturing ? '<div style="position:absolute;top:16px;left:16px;background:#ff3b30;color:#fff;padding:4px 12px;border-radius:4px;font-size:11px;display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:#fff;animation:blink 1s infinite;"></span>录制中</div>' : ''}
                        <div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:12px;">
                            <button id="ic-capture" style="width:56px;height:56px;border-radius:50%;border:4px solid #fff;background:${isCapturing ? '#ff3b30' : '#fff'};cursor:pointer;transition:all 0.2s;"></button>
                        </div>
                    </div>
                    <div style="height:40px;background:#2a2a2a;border-bottom:1px solid #333;display:flex;align-items:center;padding:0 16px;">
                        <span style="color:#999;font-size:12px;">${capturedImages.length} 个项目</span>
                        <div style="flex:1;"></div>
                        <button id="ic-delete" style="padding:4px 12px;background:#333;border:1px solid #555;border-radius:4px;color:#ff3b30;cursor:pointer;font-size:11px;${!selectedImage ? 'opacity:0.5;pointer-events:none;' : ''}">删除</button>
                    </div>
                    <div style="flex:1;overflow-y:auto;padding:16px;background:#1e1e1e;">
                        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px;" id="ic-grid"></div>
                    </div>
                </div>
            </div>
            <style>
                @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
                @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
            </style>
        `;

        const deviceList = content.querySelector('#ic-deviceList');
        devices.forEach(d => {
            const item = document.createElement('div');
            item.style.cssText = `padding:8px 10px;border-radius:6px;cursor:pointer;margin-bottom:4px;display:flex;align-items:center;gap:8px;font-size:12px;${d.id === selectedDevice.id ? 'background:var(--accent-blue);color:#fff;' : 'color:#ccc;'}`;
            item.innerHTML = `<span>${d.icon}</span><span style="flex:1;">${d.name}</span>${d.connected ? '<span style="width:6px;height:6px;border-radius:50%;background:#34c759;"></span>' : '<span style="width:6px;height:6px;border-radius:50%;background:#666;"></span>'}`;
            item.onclick = () => { if (d.connected) { selectedDevice = d; render(); } };
            deviceList.appendChild(item);
        });

        const grid = content.querySelector('#ic-grid');
        capturedImages.forEach(img => {
            const card = document.createElement('div');
            card.style.cssText = `aspect-ratio:1;background:#2a2a2a;border-radius:8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid ${selectedImage === img.id ? 'var(--accent-blue)' : 'transparent'};transition:border-color 0.2s;overflow:hidden;position:relative;`;
            card.innerHTML = `<div style="font-size:40px;margin-bottom:8px;">${img.thumb}</div><div style="font-size:10px;color:#999;">${img.name}</div><div style="font-size:9px;color:#666;margin-top:2px;">${img.size}</div>`;
            card.onclick = () => { selectedImage = selectedImage === img.id ? null : img.id; render(); };
            grid.appendChild(card);
        });

        content.querySelector('#ic-capture').onclick = () => {
            if (!isCapturing) {
                isCapturing = true;
                render();
                setTimeout(() => {
                    isCapturing = false;
                    const newImg = {
                        id: Date.now(),
                        name: `IMG_${String(capturedImages.length + 1).padStart(3, '0')}.jpg`,
                        date: Date.now(),
                        size: (1 + Math.random() * 3).toFixed(1) + ' MB',
                        thumb: ['🏔️','🌅','🌸','🏙️','🌊','🌺','🌲','🏠','🌄','🎆'][Math.floor(Math.random()*10)]
                    };
                    capturedImages.unshift(newImg);
                    save();
                    render();
                }, 1500);
            }
        };

        content.querySelector('#ic-importAll').onclick = () => {
            alert(`已导入 ${capturedImages.length} 张图片到"图片"文件夹`);
        };

        content.querySelector('#ic-deviceSelect').onchange = (e) => {
            const d = devices.find(x => x.id === parseInt(e.target.value));
            if (d && d.connected) { selectedDevice = d; render(); }
        };

        content.querySelector('#ic-delete').onclick = () => {
            if (selectedImage) {
                capturedImages = capturedImages.filter(x => x.id !== selectedImage);
                selectedImage = null;
                save();
                render();
            }
        };
    }

    render();
};
