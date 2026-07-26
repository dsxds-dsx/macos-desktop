window.renderiMovie = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#1a1a1a';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    let currentTab = 'movie';
    let isPlaying = false;
    let projects = [
        { id: 1, name: '度假视频', thumbnail: '🏖️', duration: '2:34', date: '2024-01-15', clips: 5 },
        { id: 2, name: '家庭聚会', thumbnail: '👨‍👩‍👧‍👦', duration: '5:12', date: '2024-01-10', clips: 12 },
        { id: 3, name: '生日派对', thumbnail: '🎂', duration: '3:45', date: '2024-01-05', clips: 8 }
    ];
    let currentProject = null;
    let clips = [
        { id: 1, name: '开场.mp4', thumb: '🌅', duration: 8, start: 0 },
        { id: 2, name: '海滩1.mp4', thumb: '🌊', duration: 12, start: 8 },
        { id: 3, name: '日落.mp4', thumb: '🌇', duration: 6, start: 20 },
        { id: 4, name: '晚餐.mp4', thumb: '🍽️', duration: 15, start: 26 }
    ];

    function render() {
        if (!currentProject) {
            renderProjects();
        } else {
            renderEditor();
        }
    }

    function renderProjects() {
        content.innerHTML = `
            <div style="height:48px;background:linear-gradient(180deg,#2d2d2d,#252525);border-bottom:1px solid #444;display:flex;align-items:center;padding:0 16px;gap:12px;">
                <div style="display:flex;background:#333;border-radius:6px;padding:2px;">
                    <button class="im-tab" data-tab="movie" style="padding:6px 16px;border:none;border-radius:4px;background:${currentTab==='movie'?'var(--accent-blue)':'transparent'};color:#fff;cursor:pointer;font-size:12px;">影片</button>
                    <button class="im-tab" data-tab="trailer" style="padding:6px 16px;border:none;border-radius:4px;background:${currentTab==='trailer'?'var(--accent-blue)':'transparent'};color:#fff;cursor:pointer;font-size:12px;">预告片</button>
                    <button class="im-tab" data-tab="media" style="padding:6px 16px;border:none;border-radius:4px;background:${currentTab==='media'?'var(--accent-blue)':'transparent'};color:#fff;cursor:pointer;font-size:12px;">媒体</button>
                </div>
                <div style="flex:1;"></div>
                <button id="im-new" style="padding:6px 16px;background:linear-gradient(180deg,#4a90d9,#3a7bc8);border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;">＋ 创建新项目</button>
            </div>
            <div style="flex:1;padding:30px;overflow:auto;">
                <h2 style="color:#fff;font-size:22px;font-weight:600;margin:0 0 20px;">项目</h2>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px;" id="im-projects"></div>
            </div>
        `;

        const projectsEl = content.querySelector('#im-projects');
        projects.forEach(p => {
            const card = document.createElement('div');
            card.style.cssText = 'background:#2a2a2a;border-radius:10px;overflow:hidden;cursor:pointer;transition:transform 0.2s;';
            card.onmouseenter = () => card.style.transform = 'scale(1.03)';
            card.onmouseleave = () => card.style.transform = 'scale(1)';
            card.onclick = () => { currentProject = p; render(); };
            card.innerHTML = `
                <div style="aspect-ratio:16/9;background:linear-gradient(135deg,#3a3a3a,#2a2a2a);display:flex;align-items:center;justify-content:center;font-size:64px;">${p.thumbnail}</div>
                <div style="padding:12px;">
                    <div style="color:#fff;font-weight:500;font-size:13px;margin-bottom:4px;">${p.name}</div>
                    <div style="color:#888;font-size:11px;display:flex;justify-content:space-between;">
                        <span>${p.duration}</span>
                        <span>${p.clips} 个片段</span>
                    </div>
                </div>
            `;
            projectsEl.appendChild(card);
        });

        content.querySelectorAll('.im-tab').forEach(t => {
            t.onclick = () => { currentTab = t.dataset.tab; render(); };
        });

        content.querySelector('#im-new').onclick = () => {
            const name = prompt('项目名称：', '新项目');
            if (name) {
                const newP = { id: Date.now(), name, thumbnail: '🎬', duration: '0:00', date: new Date().toISOString().split('T')[0], clips: 0 };
                projects.unshift(newP);
                currentProject = newP;
                clips = [];
                render();
            }
        };
    }

    function renderEditor() {
        content.innerHTML = `
            <div style="height:48px;background:linear-gradient(180deg,#2d2d2d,#252525);border-bottom:1px solid #444;display:flex;align-items:center;padding:0 16px;gap:12px;">
                <button id="im-back" style="padding:6px 12px;background:#333;border:1px solid #555;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;">← 返回</button>
                <span style="color:#fff;font-weight:500;">${currentProject.name}</span>
                <div style="flex:1;"></div>
                <button id="im-play" style="width:32px;height:32px;border-radius:50%;border:none;background:${isPlaying?'#ff3b30':'var(--accent-blue)'};color:#fff;cursor:pointer;font-size:14px;">${isPlaying ? '❚❚' : '▶'}</button>
                <button style="padding:6px 12px;background:#34c759;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;">分享</button>
            </div>
            <div style="display:flex;flex:1;overflow:hidden;">
                <div style="width:240px;background:#252525;border-right:1px solid #333;padding:16px;overflow-y:auto;">
                    <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:0 0 12px;">我的媒体</h4>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;" id="im-mediaList">
                        ${['🌅','🌊','🌇','🍽️','🎵','📷','🌺','🏠'].map((e,i) => `<div class="im-importItem" data-i="${i}" style="aspect-ratio:1;background:#333;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;border:2px solid transparent;">${e}</div>`).join('')}
                    </div>
                    <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:20px 0 12px;">音频</h4>
                    <div style="display:flex;flex-direction:column;gap:6px;">
                        ${['🎵 iTunes', '🎤 音效', '🎼 配乐', '🔊 旁白'].map(i => `<div style="padding:8px;background:#333;border-radius:4px;color:#ccc;font-size:12px;cursor:pointer;">${i}</div>`).join('')}
                    </div>
                    <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:20px 0 12px;">转场</h4>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
                        ${['交叉叠化','推入','擦除','缩放','旋转','淡入'].map(t => `<div style="padding:8px;background:#333;border-radius:4px;color:#ccc;font-size:10px;text-align:center;cursor:pointer;">${t}</div>`).join('')}
                    </div>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;">
                    <div style="flex:1;background:#000;display:flex;align-items:center;justify-content:center;position:relative;">
                        <div style="text-align:center;color:#666;font-size:48px;" id="im-preview">🎬</div>
                        <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:#fff;background:rgba(0,0,0,0.6);padding:6px 14px;border-radius:20px;font-size:12px;font-family:monospace;" id="im-timecode">00:00 / ${clips.reduce((a,c) => a+c.duration, 0).toString().padStart(2,'0')}:00</div>
                    </div>
                    <div style="height:180px;background:#1e1e1e;border-top:1px solid #333;position:relative;">
                        <div style="height:30px;background:#2a2a2a;border-bottom:1px solid #333;display:flex;align-items:center;padding:0 10px;">
                            ${Array.from({length:Math.ceil(clips.reduce((a,c) => a+c.duration, 0)/5)+1}, (_,i) => `<div style="position:absolute;left:${i*50}px;color:#666;font-size:10px;">${i*5}s</div>`).join('')}
                        </div>
                        <div style="position:absolute;top:30px;left:0;right:0;bottom:0;overflow-x:auto;padding:10px;">
                            <div style="display:flex;min-width:100%;height:100%;gap:2px;" id="im-timeline">
                                ${clips.map((c,i) => `<div class="im-clip" data-i="${i}" style="width:${c.duration*10}px;background:linear-gradient(135deg,${['#4a90d9','#d94a4a','#4ad97a','#d9a64a','#9b59b6'][i%5]},${['#3a7bc8','#c93a3a','#3ac96a','#c9963a','#8b49a6'][i%5]});border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:grab;position:relative;">${c.thumb}<div style="position:absolute;bottom:2px;right:4px;font-size:9px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.5);">${c.duration}s</div></div>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div style="width:200px;background:#252525;border-left:1px solid #333;padding:16px;">
                    <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:0 0 12px;">调整</h4>
                    <div style="margin-bottom:16px;">
                        <label style="color:#ccc;font-size:11px;display:block;margin-bottom:6px;">亮度</label>
                        <input type="range" min="-50" max="50" value="0" style="width:100%;">
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="color:#ccc;font-size:11px;display:block;margin-bottom:6px;">对比度</label>
                        <input type="range" min="-50" max="50" value="0" style="width:100%;">
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="color:#ccc;font-size:11px;display:block;margin-bottom:6px;">饱和度</label>
                        <input type="range" min="-50" max="50" value="0" style="width:100%;">
                    </div>
                    <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:20px 0 12px;">速度</h4>
                    <select style="width:100%;padding:6px;background:#333;border:1px solid #555;border-radius:4px;color:#fff;font-size:12px;">
                        <option>1x 正常</option><option>0.5x 慢速</option><option>2x 快速</option><option>0.25x 极慢</option><option>4x 极快</option>
                    </select>
                </div>
            </div>
        `;

        content.querySelector('#im-back').onclick = () => { currentProject = null; render(); };

        content.querySelectorAll('.im-importItem').forEach(item => {
            item.onclick = () => {
                const emojis = ['🌅','🌊','🌇','🍽️','🎵','📷','🌺','🏠'];
                clips.push({ id: Date.now(), name: '新片段.mp4', thumb: emojis[parseInt(item.dataset.i)], duration: 5 + Math.floor(Math.random()*10), start: clips.reduce((a,c)=>a+c.duration,0) });
                render();
            };
        });

        let playInterval;
        content.querySelector('#im-play').onclick = () => {
            isPlaying = !isPlaying;
            const preview = content.querySelector('#im-preview');
            const timecode = content.querySelector('#im-timecode');
            let t = 0;
            const total = clips.reduce((a,c) => a+c.duration, 0);
            if (isPlaying) {
                playInterval = setInterval(() => {
                    t++;
                    if (t >= total) { t = 0; }
                    let curClip = clips[0], acc = 0;
                    for (const c of clips) { if (acc + c.duration > t) { curClip = c; break; } acc += c.duration; }
                    preview.textContent = curClip.thumb;
                    timecode.textContent = `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')} / ${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
                }, 500);
            } else {
                clearInterval(playInterval);
            }
            render();
        };
    }

    render();
};
