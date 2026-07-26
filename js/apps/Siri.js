// Siri - 语音助手
window.renderSiri = function(body, sidebar, toolbar, windowId) {
    let messages = [
        { role: 'siri', text: '有什么可以帮你的？' }
    ];
    let isListening = false;

    function render() {
        body.innerHTML = `
            <div class="siri-container">
                <div class="siri-messages" id="siri-messages">
                    ${messages.map(msg => `
                        <div class="siri-msg siri-msg-${msg.role}">
                            ${msg.role === 'siri'
                                ? `<div class="siri-avatar">${IconGenerator.generate('siri')}</div>`
                                : ''}
                            <div class="siri-bubble">${msg.text}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="siri-wave" id="siri-wave">
                    ${[...Array(40)].map((_, i) => `
                        <div class="siri-wave-bar" style="--i:${i};height:${Math.random() * 60 + 20}%"></div>
                    `).join('')}
                </div>

                <div class="siri-input-row">
                    <input type="text" id="siri-input" placeholder="输入问题，或点击麦克风" autocomplete="off">
                    <button class="siri-mic-btn" id="siri-mic" title="语音输入">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        const input = body.querySelector('#siri-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                sendMessage(input.value.trim());
            }
        });

        body.querySelector('#siri-mic').addEventListener('click', toggleListening);

        // 滚动到底部
        const msgContainer = body.querySelector('#siri-messages');
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function toggleListening() {
        isListening = !isListening;
        const wave = body.querySelector('#siri-wave');
        if (isListening) {
            wave.classList.add('active');
            simulateListening();
        } else {
            wave.classList.remove('active');
        }
    }

    function simulateListening() {
        setTimeout(() => {
            if (!isListening) return;
            const questions = ['今天天气怎么样', '帮我设个闹钟', '打开音乐', '明天日程', '设置提醒'];
            const q = questions[Math.floor(Math.random() * questions.length)];
            isListening = false;
            const wave = body.querySelector('#siri-wave');
            if (wave) wave.classList.remove('active');
            sendMessage(q, true);
        }, 1500 + Math.random() * 1000);
    }

    function sendMessage(text, fromVoice = false) {
        messages.push({ role: 'user', text });
        
        // 模拟 Siri 回答
        setTimeout(() => {
            const replies = {
                '天气': '北京今天晴，气温 24°，体感温度 22°。',
                '闹钟': '好的，已为你设置明天早上 7:00 的闹钟。',
                '音乐': '正在为你播放音乐。',
                '日程': '你明天有 2 个日程：上午 10 点产品评审会，下午 3 点 1 对 1。',
                '提醒': '好的，提醒事项已添加到提醒列表。',
            };
            
            let reply = '我不太明白你的意思，你可以再说一遍吗？';
            for (const key in replies) {
                if (text.includes(key)) {
                    reply = replies[key];
                    break;
                }
            }
            if (text === '今天天气怎么样') reply = '北京今天晴转多云，最高 26°，最低 18°。空气质量优。建议穿着薄外套。';
            if (text === '帮我设个闹钟') reply = '好的，明天早上 7 点的闹钟已设置。';
            if (text === '打开音乐') reply = '好的，正在为你打开音乐。';
            if (text === '明天日程') reply = '明天你的日程如下：\n• 10:00 产品评审会\n• 15:00 一对一沟通\n• 19:00 健身课';
            if (text === '设置提醒') reply = '想设置什么提醒？';
            
            messages.push({ role: 'siri', text: reply });
            render();
        }, 600 + Math.random() * 800);

        render();
    }

    render();
};
