window.renderGarageBand = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#1a1a1a';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';

    let isPlaying = false;
    let currentTrack = 0;
    let tempo = 120;
    let volume = 75;
    let tracks = [
        { name: '经典电钢琴', type: 'piano', muted: false, solo: false, volume: 80, color: '#4a90d9' },
        { name: '原声鼓组', type: 'drums', muted: false, solo: false, volume: 85, color: '#d94a4a' },
        { name: '电贝司', type: 'bass', muted: false, solo: false, volume: 70, color: '#4ad97a' },
        { name: '合成器主音', type: 'synth', muted: true, solo: false, volume: 65, color: '#d9a64a' }
    ];

    content.innerHTML = `
        <div style="height:48px;background:linear-gradient(180deg,#2d2d2d,#252525);border-bottom:1px solid #444;display:flex;align-items:center;padding:0 16px;gap:12px;">
            <div style="display:flex;align-items:center;gap:8px;background:#333;padding:4px 8px;border-radius:6px;">
                <button id="gb-rec" style="width:28px;height:28px;border-radius:50%;border:none;background:#ff3b30;color:#fff;cursor:pointer;font-size:12px;">●</button>
                <button id="gb-play" style="width:28px;height:28px;border-radius:50%;border:none;background:#4a90d9;color:#fff;cursor:pointer;font-size:12px;">▶</button>
                <button id="gb-stop" style="width:28px;height:28px;border-radius:4px;border:none;background:#555;color:#fff;cursor:pointer;font-size:10px;">■</button>
            </div>
            <div style="width:200px;height:6px;background:#444;border-radius:3px;overflow:hidden;">
                <div id="gb-progress" style="height:100%;background:var(--accent-blue);width:0%;transition:width 0.1s linear;"></div>
            </div>
            <span style="color:#999;font-size:12px;font-family:monospace;" id="gb-time">00:00 / 03:24</span>
            <div style="flex:1;"></div>
            <div style="display:flex;align-items:center;gap:8px;">
                <span style="color:#999;font-size:11px;">BPM</span>
                <input type="number" id="gb-tempo" value="${tempo}" min="40" max="240" style="width:50px;padding:4px;background:#333;border:1px solid #555;border-radius:4px;color:#fff;font-size:12px;text-align:center;">
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
                <span style="color:#999;font-size:11px;">🔊</span>
                <input type="range" id="gb-volume" min="0" max="100" value="${volume}" style="width:80px;">
            </div>
        </div>
        <div style="display:flex;flex:1;overflow:hidden;">
            <div style="width:220px;background:#252525;border-right:1px solid #333;display:flex;flex-direction:column;">
                <div style="padding:12px;border-bottom:1px solid #333;">
                    <button id="gb-addTrack" style="width:100%;padding:8px;background:linear-gradient(180deg,#4a90d9,#3a7bc8);border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;">＋ 新建轨道</button>
                </div>
                <div style="flex:1;overflow-y:auto;padding:8px;" id="gb-tracksList"></div>
                <div style="padding:12px;border-top:1px solid #333;">
                    <h4 style="color:#999;font-size:11px;text-transform:uppercase;margin:0 0 8px;">资源库</h4>
                    <div style="display:flex;flex-direction:column;gap:4px;">
                        ${['🎸 吉他', '🎹 键盘', '🥁 鼓', '🎺 铜管', '🎻 弦乐', '🎤 人声'].map(i => `<div style="padding:8px;background:#333;border-radius:4px;color:#ccc;font-size:12px;cursor:pointer;">${i}</div>`).join('')}
                    </div>
                </div>
            </div>
            <div style="flex:1;background:#1e1e1e;overflow:auto;">
                <div style="height:60px;background:#2a2a2a;border-bottom:1px solid #333;display:flex;align-items:center;padding:0 20px;">
                    ${Array.from({length:32}, (_,i) => `<div style="flex:1;text-align:center;color:#666;font-size:10px;border-left:1px solid #333;height:100%;display:flex;align-items:center;justify-content:center;">${i+1}</div>`).join('')}
                </div>
                <div id="gb-tracksTimeline"></div>
            </div>
        </div>
    `;

    function renderTracks() {
        const listEl = content.querySelector('#gb-tracksList');
        const timelineEl = content.querySelector('#gb-tracksTimeline');
        listEl.innerHTML = '';
        timelineEl.innerHTML = '';

        tracks.forEach((track, i) => {
            const trackItem = document.createElement('div');
            trackItem.style.cssText = `padding:10px;background:${currentTrack === i ? '#333' : '#2a2a2a'};border-radius:6px;margin-bottom:6px;cursor:pointer;border-left:3px solid ${track.color};`;
            trackItem.innerHTML = `
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                    <button class="gb-mute" data-i="${i}" style="width:22px;height:22px;border-radius:3px;border:none;background:${track.muted ? '#ff3b30' : '#444'};color:#fff;font-size:9px;cursor:pointer;font-weight:bold;">M</button>
                    <button class="gb-solo" data-i="${i}" style="width:22px;height:22px;border-radius:3px;border:none;background:${track.solo ? '#ff9500' : '#444'};color:#fff;font-size:9px;cursor:pointer;font-weight:bold;">S</button>
                    <span style="flex:1;color:#fff;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${track.name}</span>
                </div>
                <input type="range" class="gb-trackVol" data-i="${i}" min="0" max="100" value="${track.volume}" style="width:100%;">
            `;
            trackItem.onclick = (e) => { if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') { currentTrack = i; renderTracks(); } };
            listEl.appendChild(trackItem);

            const trackRow = document.createElement('div');
            trackRow.style.cssText = `height:80px;border-bottom:1px solid #333;display:flex;align-items:center;padding:0 20px;gap:0;position:relative;background:${i % 2 === 0 ? '#1e1e1e' : '#222'};`;
            
            const clips = [
                { start: 0, len: 8 },
                { start: 12, len: 16 },
                { start: 28, len: 4 }
            ];
            clips.forEach(clip => {
                const clipEl = document.createElement('div');
                clipEl.style.cssText = `position:absolute;left:calc(${clip.start / 32 * 100}% + 20px);width:calc(${clip.len / 32 * 100}% - 10px);height:60px;background:${track.color};border-radius:4px;opacity:0.8;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.2);`;
                clipEl.innerHTML = `<div style="height:100%;display:flex;align-items:center;padding:0 10px;"><svg viewBox="0 0 200 40" style="width:100%;height:30px;opacity:0.6;"><polyline points="${Array.from({length:50}, (_,j) => `${j*4},${20 + Math.sin(j * 0.5 + i) * 12 * Math.random()}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1"/></svg></div>`;
                trackRow.appendChild(clipEl);
            });

            for (let b = 0; b < 32; b++) {
                const marker = document.createElement('div');
                marker.style.cssText = `flex:1;border-left:1px solid #333;height:100%;`;
                trackRow.appendChild(marker);
            }
            timelineEl.appendChild(trackRow);
        });

        content.querySelectorAll('.gb-mute').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); tracks[parseInt(btn.dataset.i)].muted = !tracks[parseInt(btn.dataset.i)].muted; renderTracks(); };
        });
        content.querySelectorAll('.gb-solo').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); tracks[parseInt(btn.dataset.i)].solo = !tracks[parseInt(btn.dataset.i)].solo; renderTracks(); };
        });
        content.querySelectorAll('.gb-trackVol').forEach(inp => {
            inp.oninput = (e) => { tracks[parseInt(inp.dataset.i)].volume = parseInt(inp.value); };
        });
    }
    renderTracks();

    let playInterval;
    content.querySelector('#gb-play').onclick = () => {
        isPlaying = !isPlaying;
        content.querySelector('#gb-play').textContent = isPlaying ? '❚❚' : '▶';
        const progress = content.querySelector('#gb-progress');
        const timeEl = content.querySelector('#gb-time');
        let pos = 0;
        if (isPlaying) {
            playInterval = setInterval(() => {
                pos += 0.5;
                if (pos >= 100) { pos = 0; }
                progress.style.width = pos + '%';
                const total = 204, cur = Math.floor(pos * 2.04);
                timeEl.textContent = `${String(Math.floor(cur/60)).padStart(2,'0')}:${String(cur%60).padStart(2,'0')} / 03:24`;
            }, 100);
        } else {
            clearInterval(playInterval);
        }
    };

    content.querySelector('#gb-stop').onclick = () => {
        isPlaying = false;
        clearInterval(playInterval);
        content.querySelector('#gb-play').textContent = '▶';
        content.querySelector('#gb-progress').style.width = '0%';
        content.querySelector('#gb-time').textContent = '00:00 / 03:24';
    };

    content.querySelector('#gb-rec').onclick = () => {
        alert('准备录制...\n（这是演示应用，录音功能不可用）');
    };

    content.querySelector('#gb-addTrack').onclick = () => {
        const types = [
            { name: '新音轨', type: 'instrument', color: '#9b59b6' },
            { name: '新鼓手', type: 'drums', color: '#e74c3c' },
            { name: '新录音', type: 'vocal', color: '#2ecc71' }
        ];
        const t = types[Math.floor(Math.random() * types.length)];
        tracks.push({ name: t.name + ' ' + (tracks.length + 1), type: t.type, muted: false, solo: false, volume: 75, color: t.color });
        renderTracks();
    };

    content.querySelector('#gb-tempo').onchange = (e) => { tempo = parseInt(e.target.value); };
    content.querySelector('#gb-volume').oninput = (e) => { volume = parseInt(e.target.value); };
};
