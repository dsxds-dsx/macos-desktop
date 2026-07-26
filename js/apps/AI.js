window.renderAI = function(body, sidebar, toolbar, windowId) {
    body.className = 'window-body app-content';

    const API_URL = 'https://apihub.agnes-ai.com/v1/chat/completions';
    const API_KEY = 'sk-1udSSi2jhICpJGhv11IbC9IfwjTvW6ZhYmIHxBZ9OnE11gtq';
    const API_MODEL = 'agnes-2.0-flash';
    const SYSTEM_PROMPT = '你是 macOS 网页桌面内置的 AI 助手，用简洁友好的中文回答问题。';
    const MAX_HISTORY = 20;
    const STORAGE_KEY_CONVERSATIONS = 'ai_conversations';
    const STORAGE_KEY_CURRENT = 'ai_current_conversation';
    const CODE_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
    const LIGHT_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>';
    const GLOBE_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
    const SPARKLE_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/></svg>';

    const SUGGESTIONS = [
        { icon: CODE_ICON, title: '帮我写代码', desc: '生成实用的代码片段' },
        { icon: LIGHT_ICON, title: '解释概念', desc: '通俗易懂地解释' },
        { icon: GLOBE_ICON, title: '翻译文字', desc: '中英文互译' },
        { icon: SPARKLE_ICON, title: '创意写作', desc: '诗歌、故事、文案' }
    ];

    const SEND_ICON = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/></svg>';
    const STOP_ICON = '<svg viewBox="0 0 24 24" width="16" height="16"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>';
    const PLUS_ICON = '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" fill="currentColor"/></svg>';
    const PLUS_ICON_SIDE = '<svg viewBox="0 0 24 24" width="14" height="14" style="margin-right:5px"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" fill="currentColor"/></svg>';
    const COPY_ICON = '<svg viewBox="0 0 24 24" width="13" height="13"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/></svg>';
    const REGEN_ICON = '<svg viewBox="0 0 24 24" width="13" height="13"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/></svg>';
    const DELETE_ICON = '<svg viewBox="0 0 24 24" width="12" height="12"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>';
    const CHAT_ICON = '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 1C4.1 1 1 3.7 1 7c0 1.6.8 3 2.1 4L2.5 13l2.3-.8c.9.3 1.9.5 3.2.5 3.9 0 7-2.7 7-6s-3.1-6-7-6z" fill="currentColor"/></svg>';
    const USER_AVATAR = `<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="8" r="4" fill="white"/><path d="M12 14c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5z" fill="white"/></svg>`;
    const AI_ICON = `<svg viewBox="0 0 100 100" width="18" height="18">
        <g opacity="0.95">
            ${[0, 72, 144, 216, 288].map(angle => `
                <path d="M50,20 Q57,28 57,37 Q57,48 50,53 Q43,48 43,37 Q43,28 50,20 Z" 
                      fill="white" transform="rotate(${angle} 50 44)"/>
            `).join('')}
        </g>
        <circle cx="50" cy="42" r="4" fill="white"/>
    </svg>`;
    const GRAD_ID = 'ai-grad-' + windowId;
    const WELCOME_ICON = `<svg viewBox="0 0 100 100" width="72" height="72">
        <defs>
            <radialGradient id="${GRAD_ID}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FF6B9D"/>
                <stop offset="50%" stop-color="#BF5AF2"/>
                <stop offset="100%" stop-color="#5856D6"/>
            </radialGradient>
        </defs>
        <circle cx="50" cy="48" r="38" fill="url(#${GRAD_ID})"/>
        <g opacity="0.9">
            ${[0, 72, 144, 216, 288].map(angle => `
                <path d="M50,20 Q58,28 58,38 Q58,50 50,56 Q42,50 42,38 Q42,28 50,20 Z" 
                      fill="white" transform="rotate(${angle} 50 46)"/>
            `).join('')}
        </g>
        <circle cx="50" cy="44" r="5" fill="white"/>
    </svg>`;

    let conversations = [];
    let currentConversationId = null;
    let isStreaming = false;
    let abortController = null;

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function loadConversations() {
        try {
            conversations = JSON.parse(localStorage.getItem(STORAGE_KEY_CONVERSATIONS) || '[]');
            currentConversationId = localStorage.getItem(STORAGE_KEY_CURRENT);
        } catch (e) {
            conversations = [];
            currentConversationId = null;
        }

        if (!Array.isArray(conversations)) conversations = [];

        let current = conversations.find(c => c.id === currentConversationId);
        if (!current) {
            if (conversations.length > 0) {
                current = conversations[conversations.length - 1];
                currentConversationId = current.id;
            } else {
                createNewConversation(false);
            }
        }
        saveState();
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
        if (currentConversationId) {
            localStorage.setItem(STORAGE_KEY_CURRENT, currentConversationId);
        }
    }

    function getCurrentConversation() {
        return conversations.find(c => c.id === currentConversationId);
    }

    function createNewConversation(switchTo = true) {
        const conv = {
            id: generateId(),
            title: '新对话',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        conversations.push(conv);
        if (switchTo) currentConversationId = conv.id;
        saveState();
        return conv;
    }

    function deleteConversation(id) {
        const idx = conversations.findIndex(c => c.id === id);
        if (idx === -1) return;
        conversations.splice(idx, 1);
        if (currentConversationId === id) {
            if (conversations.length > 0) {
                currentConversationId = conversations[Math.min(idx, conversations.length - 1)].id;
            } else {
                createNewConversation(false);
            }
        }
        saveState();
        renderAll();
    }

    function switchConversation(id) {
        if (isStreaming) return;
        const conv = conversations.find(c => c.id === id);
        if (conv) {
            currentConversationId = id;
            saveState();
            renderAll();
        }
    }

    function updateConversationTitle(conv, firstUserMessage) {
        conv.title = firstUserMessage.slice(0, 18) + (firstUserMessage.length > 18 ? '...' : '');
        conv.updatedAt = Date.now();
        saveState();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function parseMarkdown(text) {
        let html = escapeHtml(text);
        html = html.replace(/```([\s\S]*?)```/g, (m, code) => '<pre><code>' + code.trim() + '</code></pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
        html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:600;margin:12px 0 6px">$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:17px;font-weight:600;margin:14px 0 8px">$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:20px;font-weight:700;margin:16px 0 10px">$1</h1>');
        html = html.replace(/^(\s*)([-*]) (.+)$/gm, (m, i, b, item) => '<li>' + item + '</li>');
        html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (m) => {
            if (m.indexOf('<ul>') === -1 && m.indexOf('<ol>') === -1) return '<ul style="margin:8px 0;padding-left:22px">' + m + '</ul>';
            return m;
        });
        html = html.replace(/^(\s*\d+\.) (.+)$/gm, (m, n, item) => '<li>' + item + '</li>');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#0A84FF;text-decoration:none" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">$1</a>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function buildApiMessages(messages) {
        const history = messages.slice(-MAX_HISTORY).map(m => ({
            role: m.role === 'ai' ? 'assistant' : m.role,
            content: m.content
        }));
        return [{ role: 'system', content: SYSTEM_PROMPT }, ...history];
    }

    function isWelcomeState(conv) {
        return !conv || !conv.messages || conv.messages.length === 0;
    }

    function renderUserMessage(msg) {
        return `<div class="ai-msg ai-user">
            <div class="ai-bubble ai-user-bubble">${escapeHtml(msg.content).replace(/\n/g, '<br>')}</div>
            <div class="ai-avatar ai-user-av">${USER_AVATAR}</div>
        </div>`;
    }

    function renderAiMessage(msg, isLast) {
        return `<div class="ai-msg ai-assistant">
            <div class="ai-avatar ai-ai-av">${AI_ICON}</div>
            <div class="ai-bubble ai-ai-bubble">
                <div class="ai-msg-content">${parseMarkdown(msg.content)}</div>
                <div class="ai-msg-actions">
                    <button class="ai-act-btn ai-copy" title="复制">${COPY_ICON}</button>
                    ${isLast && !isStreaming ? `<button class="ai-act-btn ai-regen" title="重新生成">${REGEN_ICON}</button>` : ''}
                </div>
            </div>
        </div>`;
    }

    function renderStreamingMessage(content) {
        return `<div class="ai-msg ai-assistant">
            <div class="ai-avatar ai-ai-av">${AI_ICON}</div>
            <div class="ai-bubble ai-ai-bubble">
                <div class="ai-msg-content">${parseMarkdown(content)}<span class="ai-cursor"></span></div>
            </div>
        </div>`;
    }

    function renderErrorMessage(text) {
        return `<div class="ai-msg ai-assistant ai-error">
            <div class="ai-avatar ai-ai-av">${AI_ICON}</div>
            <div class="ai-bubble ai-ai-bubble ai-error-bubble">
                <div style="color:#FF3B30;font-size:13px">⚠️ ${escapeHtml(text)}</div>
                <button class="ai-retry-btn">重试</button>
            </div>
        </div>`;
    }

    function renderWelcome() {
        return `<div class="ai-welcome">
            <div class="ai-welcome-icon">${WELCOME_ICON}</div>
            <h2 class="ai-welcome-title">AI 助手</h2>
            <p class="ai-welcome-subtitle">有什么可以帮你的？</p>
            <div class="ai-suggestions">
                ${SUGGESTIONS.map((s, i) => `
                    <div class="ai-suggestion" data-idx="${i}">
                        <div class="ai-sug-icon">${s.icon}</div>
                        <div class="ai-sug-title">${s.title}</div>
                        <div class="ai-sug-desc">${s.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `<style>
            .ai-side { display:flex;flex-direction:column;height:100%;background:rgba(246,246,246,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; }
            .ai-side-head { padding:10px 10px 8px;border-bottom:0.5px solid rgba(0,0,0,0.08); }
            .ai-new-btn { width:100%;padding:9px 14px;border-radius:8px;border:none;background:linear-gradient(180deg,#0A84FF,#0066DD);color:white;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:2px;transition:all 0.12s;box-shadow:0 1px 3px rgba(0,100,210,0.3); }
            .ai-new-btn:hover { background:linear-gradient(180deg,#1A94FF,#0077EE); }
            .ai-new-btn:active { transform:scale(0.98); }
            .ai-new-btn:disabled { opacity:0.5;cursor:not-allowed; }
            .ai-side-list { flex:1;overflow-y:auto;padding:6px 6px; }
            .ai-conv-item { display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;cursor:pointer;font-size:13px;color:#1d1d1f;transition:background 0.1s; }
            .ai-conv-item:hover { background:rgba(0,0,0,0.05); }
            .ai-conv-item.active { background:rgba(10,132,255,0.14); }
            .ai-conv-icon { opacity:0.6;flex-shrink:0;display:flex; }
            .ai-conv-title { flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px; }
            .ai-conv-del { opacity:0;background:none;border:none;color:#FF3B30;cursor:pointer;padding:3px;border-radius:4px;display:flex;align-items:center;transition:all 0.1s; }
            .ai-conv-item:hover .ai-conv-del { opacity:1; }
            .ai-conv-del:hover { background:rgba(255,59,48,0.1); }
        </style>
        <div class="ai-side">
            <div class="ai-side-head">
                <button class="ai-new-btn" id="ai-side-new" ${isStreaming?'disabled':''}>${PLUS_ICON_SIDE}新建对话</button>
            </div>
            <div class="ai-side-list">
                ${conversations.slice().reverse().map(c => `
                    <div class="ai-conv-item ${c.id===currentConversationId?'active':''}" data-cid="${c.id}">
                        <span class="ai-conv-icon">${CHAT_ICON}</span>
                        <span class="ai-conv-title">${escapeHtml(c.title)}</span>
                        <button class="ai-conv-del" data-del="${c.id}">${DELETE_ICON}</button>
                    </div>
                `).join('')}
            </div>
        </div>`;

        const newBtn = sidebar.querySelector('#ai-side-new');
        if (newBtn) newBtn.addEventListener('click', () => { if(!isStreaming){createNewConversation();renderAll();} });

        sidebar.querySelectorAll('.ai-conv-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('[data-del]')) return;
                switchConversation(item.dataset.cid);
            });
        });
        sidebar.querySelectorAll('[data-del]').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); deleteConversation(btn.dataset.del); });
        });
    }

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `<style>
            .ai-toolbar { display:flex;align-items:center;width:100%;height:100%;padding:0 10px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif;gap:6px; }
            .ai-tb-btn { width:28px;height:24px;border:none;background:transparent;border-radius:5px;cursor:pointer;color:#6e6e73;display:flex;align-items:center;justify-content:center;transition:all 0.1s; }
            .ai-tb-btn:hover:not(:disabled) { background:rgba(0,0,0,0.08);color:#1d1d1f; }
            .ai-tb-btn:disabled { opacity:0.4;cursor:not-allowed; }
            .ai-tb-sep { width:1px;height:16px;background:rgba(0,0,0,0.1);margin:0 4px; }
            .ai-tb-title { flex:1;text-align:center;font-size:12px;font-weight:600;color:#6e6e73;pointer-events:none; }
        </style>
        <div class="ai-toolbar">
            <button class="ai-tb-btn" id="ai-tb-new" title="新建对话 (⌘N)" ${isStreaming?'disabled':''}>${PLUS_ICON}</button>
            <div class="ai-tb-sep"></div>
            <button class="ai-tb-btn" id="ai-tb-clear" title="删除当前对话" ${isStreaming?'disabled':''}>${DELETE_ICON}</button>
            <div class="ai-tb-title">AI 助手</div>
        </div>`;
        const newBtn = toolbar.querySelector('#ai-tb-new');
        if (newBtn) newBtn.addEventListener('click', () => { if(!isStreaming){createNewConversation();renderAll();} });
        const delBtn = toolbar.querySelector('#ai-tb-clear');
        if (delBtn) delBtn.addEventListener('click', () => { if(!isStreaming){deleteConversation(currentConversationId);} });
    }

    function renderBody() {
        const conv = getCurrentConversation();
        const welcome = isWelcomeState(conv);
        const messages = conv ? conv.messages : [];

        body.innerHTML = `<style>
            .ai-chat { display:flex;flex-direction:column;height:100%;background:#fff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',sans-serif; }
            .ai-messages { flex:1;overflow-y:auto;padding:20px 0;display:flex;flex-direction:column;gap:0; }
            .ai-msg { display:flex;gap:10px;max-width:700px;width:100%;margin:0 auto;padding:0 20px 18px;align-items:flex-start; }
            .ai-user { flex-direction:row-reverse;justify-content:flex-end; }
            .ai-avatar { width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:2px; }
            .ai-user-av { background:linear-gradient(135deg,#30D158,#248A3D); }
            .ai-ai-av { background:linear-gradient(135deg,#FF2D55,#BF5AF2 50%,#5856D6); }
            .ai-bubble { padding:10px 14px;border-radius:18px;font-size:15px;line-height:1.55;word-wrap:break-word;max-width:calc(100% - 50px); }
            .ai-user-bubble { background:#0A84FF;color:#fff;border-bottom-right-radius:5px; }
            .ai-ai-bubble { background:#F5F5F7;color:#1d1d1f;border-bottom-left-radius:5px;position:relative; }
            .ai-msg-content p { margin:0 0 8px; }
            .ai-msg-content p:last-child { margin-bottom:0; }
            .ai-msg-content pre { background:#1d1d1f;color:#f5f5f7;padding:12px 14px;border-radius:10px;overflow-x:auto;margin:10px 0;font-family:'SF Mono',Menlo,Monaco,monospace;font-size:13px;line-height:1.5; }
            .ai-msg-content code { background:rgba(0,0,0,0.07);padding:2px 6px;border-radius:4px;font-family:'SF Mono',Menlo,Monaco,monospace;font-size:13px; }
            .ai-msg-content pre code { background:transparent;padding:0;color:inherit; }
            .ai-msg-content ul,.ai-msg-content ol { margin:8px 0;padding-left:22px; }
            .ai-msg-content li { margin:3px 0; }
            .ai-msg-content blockquote { border-left:3px solid #0A84FF;padding-left:12px;margin:10px 0;color:#6e6e73; }
            .ai-cursor { display:inline-block;width:7px;height:1.1em;vertical-align:text-bottom;background:#86868b;margin-left:1px;animation:blink 1s steps(2) infinite;border-radius:1px; }
            @keyframes blink { 0%,50%{opacity:1} 50.01%,100%{opacity:0} }
            .ai-msg-actions { display:flex;gap:4px;margin-top:8px;opacity:0;transition:opacity 0.15s; }
            .ai-assistant:hover .ai-msg-actions { opacity:1; }
            .ai-act-btn { padding:5px;border:none;background:rgba(0,0,0,0.05);border-radius:6px;cursor:pointer;color:#86868b;display:flex;align-items:center;transition:all 0.12s; }
            .ai-act-btn:hover { background:rgba(0,0,0,0.1);color:#1d1d1f; }
            .ai-copied-tip { position:fixed;background:rgba(0,0,0,0.82);color:white;padding:5px 11px;border-radius:7px;font-size:12px;z-index:99999;pointer-events:none;animation:tip-fade 1.6s forwards; }
            @keyframes tip-fade { 0%,70%{opacity:1} 100%{opacity:0} }
            .ai-retry-btn { margin-top:8px;padding:5px 14px;border:1px solid #FF3B30;background:transparent;color:#FF3B30;border-radius:7px;cursor:pointer;font-size:12px;font-family:inherit; }
            .ai-retry-btn:hover { background:rgba(255,59,48,0.08); }
            .ai-input-area { padding:12px 20px 16px;border-top:0.5px solid rgba(0,0,0,0.06);background:#fff; }
            .ai-input-wrap { display:flex;align-items:flex-end;gap:8px;max-width:700px;margin:0 auto;background:#F5F5F7;border-radius:22px;padding:7px 7px 7px 16px;border:0.5px solid transparent;transition:all 0.15s; }
            .ai-input-wrap:focus-within { border-color:rgba(10,132,255,0.35);box-shadow:0 0 0 3px rgba(10,132,255,0.08); }
            .ai-input { flex:1;border:none;background:transparent;outline:none;resize:none;font-size:15px;font-family:inherit;line-height:1.4;max-height:120px;padding:5px 0;color:#1d1d1f; }
            .ai-input::placeholder { color:#86868b; }
            .ai-send { width:32px;height:32px;border-radius:50%;border:none;background:#0A84FF;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.12s; }
            .ai-send:hover:not(:disabled) { background:#0066DD;transform:scale(1.04); }
            .ai-send:disabled { background:#C7C7CC;cursor:not-allowed;transform:none; }
            .ai-send.stop { background:#FF3B30; }
            .ai-send.stop:hover:not(:disabled) { background:#CC2E26; }
            .ai-welcome { flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center; }
            .ai-welcome-icon { margin-bottom:18px;animation:welcome-pulse 3s ease-in-out infinite; }
            @keyframes welcome-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.85;transform:scale(1.02)} }
            .ai-welcome-title { font-size:28px;font-weight:700;margin:0 0 6px;color:#1d1d1f;letter-spacing:-0.5px; }
            .ai-welcome-subtitle { font-size:15px;color:#86868b;margin:0 0 32px; }
            .ai-suggestions { display:grid;grid-template-columns:repeat(2,1fr);gap:10px;max-width:480px;width:100%; }
            .ai-suggestion { background:#F5F5F7;border:0.5px solid rgba(0,0,0,0.04);border-radius:14px;padding:16px;cursor:pointer;text-align:left;transition:all 0.15s; }
            .ai-suggestion:hover { background:rgba(10,132,255,0.06);border-color:rgba(10,132,255,0.25);transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,0.06); }
            .ai-sug-icon { font-size:22px;margin-bottom:8px;color:#0A84FF;display:flex; }
            .ai-sug-title { font-size:13px;font-weight:600;color:#1d1d1f;margin-bottom:3px; }
            .ai-sug-desc { font-size:12px;color:#86868b;line-height:1.3; }
        </style>
        <div class="ai-chat">
            <div class="ai-messages" id="ai-msgs">
                ${welcome ? renderWelcome() : messages.map((m,i) => m.role==='user' ? renderUserMessage(m) : renderAiMessage(m, i===messages.length-1)).join('')}
            </div>
            <div class="ai-input-area">
                <div class="ai-input-wrap">
                    <textarea class="ai-input" id="ai-input" placeholder="发送消息..." rows="1" ${isStreaming?'disabled':''}></textarea>
                    <button class="ai-send ${isStreaming?'stop':''}" id="ai-send" title="${isStreaming?'停止生成':'发送'}">${isStreaming?STOP_ICON:SEND_ICON}</button>
                </div>
            </div>
        </div>`;

        const input = body.querySelector('#ai-input');
        const sendBtn = body.querySelector('#ai-send');
        const msgContainer = body.querySelector('#ai-msgs');

        sendBtn.addEventListener('click', () => { isStreaming ? stopGeneration() : sendMessage(); });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if(!isStreaming) sendMessage(); }
        });
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });

        if (!isStreaming) setTimeout(() => input.focus(), 100);

        if (welcome) {
            body.querySelectorAll('.ai-suggestion').forEach(card => {
                card.addEventListener('click', () => {
                    const idx = parseInt(card.dataset.idx);
                    if (SUGGESTIONS[idx]) { input.value = SUGGESTIONS[idx].title; sendMessage(); }
                });
            });
        }

        body.querySelectorAll('.ai-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const msgEl = btn.closest('.ai-msg');
                const content = msgEl?.querySelector('.ai-msg-content');
                copyToClipboard(content?.innerText || '', e);
            });
        });
        body.querySelectorAll('.ai-regen').forEach(btn => {
            btn.addEventListener('click', regenerateLast);
        });
        const retryBtn = body.querySelector('.ai-retry-btn');
        if (retryBtn) retryBtn.addEventListener('click', retryLast);

        if (!welcome) msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function renderAll() {
        renderSidebar();
        renderToolbar();
        renderBody();
    }

    function showCopiedTip(x, y) {
        const tip = document.createElement('div');
        tip.className = 'ai-copied-tip';
        tip.textContent = '已复制';
        tip.style.left = (x - 22) + 'px';
        tip.style.top = (y - 34) + 'px';
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 1600);
    }

    function copyToClipboard(text, event) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); if (event) showCopiedTip(event.clientX, event.clientY); } catch(e){}
        document.body.removeChild(ta);
    }

    function appendMessage(html) {
        const c = body.querySelector('#ai-msgs');
        if (!c) return;
        if (c.querySelector('.ai-welcome')) c.innerHTML = '';
        c.insertAdjacentHTML('beforeend', html);
        c.scrollTop = c.scrollHeight;
    }

    function updateLastStreaming(content) {
        const c = body.querySelector('#ai-msgs');
        if (!c) return;
        const last = c.lastElementChild;
        if (last && last.classList.contains('ai-assistant') && last.querySelector('.ai-cursor')) {
            last.outerHTML = renderStreamingMessage(content);
        } else {
            c.insertAdjacentHTML('beforeend', renderStreamingMessage(content));
        }
        c.scrollTop = c.scrollHeight;
    }

    function replaceLastMessage(html) {
        const c = body.querySelector('#ai-msgs');
        if (!c) return;
        const last = c.lastElementChild;
        if (last) last.outerHTML = html;
        c.scrollTop = c.scrollHeight;
        bindMsgActions(c.lastElementChild);
    }

    function bindMsgActions(el) {
        if (!el) return;
        const copy = el.querySelector('.ai-copy');
        if (copy) copy.addEventListener('click', (e) => {
            const content = el.querySelector('.ai-msg-content');
            copyToClipboard(content?.innerText || '', e);
        });
        const regen = el.querySelector('.ai-regen');
        if (regen) regen.addEventListener('click', regenerateLast);
    }

    function updateSendButton() {
        const sendBtn = body.querySelector('#ai-send');
        const input = body.querySelector('#ai-input');
        if (!sendBtn) return;

        if (isStreaming) {
            sendBtn.classList.add('stop');
            sendBtn.innerHTML = STOP_ICON;
            sendBtn.title = '停止生成';
            if (input) input.disabled = true;
        } else {
            sendBtn.classList.remove('stop');
            sendBtn.innerHTML = SEND_ICON;
            sendBtn.title = '发送';
            if (input) { input.disabled = false; input.focus(); }
        }
    }

    async function sendMessage() {
        if (isStreaming) return;
        const input = body.querySelector('#ai-input');
        const text = input.value.trim();
        if (!text) return;

        let conv = getCurrentConversation();
        if (!conv) conv = createNewConversation();

        const isFirst = conv.messages.length === 0;
        isStreaming = true;
        abortController = new AbortController();

        conv.messages.push({ role: 'user', content: text });
        conv.updatedAt = Date.now();
        if (isFirst) updateConversationTitle(conv, text);
        saveState();

        input.value = '';
        input.style.height = 'auto';

        const c = body.querySelector('#ai-msgs');
        if (c?.querySelector('.ai-welcome')) {
            c.innerHTML = '';
            renderSidebar();
            renderToolbar();
        }

        appendMessage(renderUserMessage({ role:'user', content:text }));
        updateLastStreaming('');
        updateSendButton();
        await streamResponse(conv);
    }

    async function streamResponse(conv) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${API_KEY}` },
                body: JSON.stringify({ model:API_MODEL, messages:buildApiMessages(conv.messages), stream:true }),
                signal: abortController?.signal
            });

            if (!response.ok) {
                let detail = '';
                try { detail = await response.text(); } catch(e){}
                throw new Error(`请求失败 (${response.status})${detail?'：'+detail.slice(0,150):''}`);
            }
            if (!response.body) throw new Error('服务器未返回流式数据');

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '', fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream:true });
                let nl;
                while ((nl = buffer.indexOf('\n')) !== -1) {
                    const line = buffer.slice(0, nl);
                    buffer = buffer.slice(nl+1);
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith('data:')) continue;
                    const data = trimmed.slice(5).trim();
                    if (data === '[DONE]') continue;
                    try {
                        const json = JSON.parse(data);
                        const delta = json.choices?.[0]?.delta;
                        if (delta?.content) { fullContent += delta.content; updateLastStreaming(fullContent); }
                    } catch(e){}
                }
            }

            if (abortController?.signal.aborted) {
                if (fullContent) {
                    conv.messages.push({ role:'ai', content:fullContent+'\n\n[已停止生成]' });
                    saveState();
                    replaceLastMessage(renderAiMessage(conv.messages[conv.messages.length-1], true));
                } else {
                    const c = body.querySelector('#ai-msgs');
                    c?.lastElementChild?.remove();
                }
                return;
            }

            if (!fullContent) throw new Error('AI 没有返回内容，请稍后重试。');

            conv.messages.push({ role:'ai', content:fullContent });
            conv.updatedAt = Date.now();
            saveState();
            replaceLastMessage(renderAiMessage(conv.messages[conv.messages.length-1], true));
        } catch (err) {
            if (err.name === 'AbortError') {
                const c = body.querySelector('#ai-msgs');
                const last = c?.lastElementChild;
                if (last?.querySelector('.ai-cursor')) last.remove();
                return;
            }
            replaceLastMessage(renderErrorMessage(err.message || '未知错误'));
            body.querySelector('.ai-retry-btn')?.addEventListener('click', retryLast);
        } finally {
            isStreaming = false;
            abortController = null;
            updateSendButton();
            renderSidebar();
            renderToolbar();
        }
    }

    function stopGeneration() {
        abortController?.abort();
    }

    function retryLast() {
        if (isStreaming) return;
        const conv = getCurrentConversation();
        if (!conv) return;
        while (conv.messages.length > 0 && conv.messages[conv.messages.length-1].role === 'ai') conv.messages.pop();
        if (conv.messages.length === 0) { saveState(); renderAll(); return; }

        isStreaming = true;
        abortController = new AbortController();
        saveState();
        const c = body.querySelector('#ai-msgs');
        const last = c?.lastElementChild;
        if (last && (last.classList.contains('ai-error') || last.classList.contains('ai-assistant'))) last.remove();
        updateLastStreaming('');
        updateSendButton();
        streamResponse(conv);
    }

    function regenerateLast() {
        if (isStreaming) return;
        const conv = getCurrentConversation();
        if (!conv || conv.messages.length === 0 || conv.messages[conv.messages.length-1].role !== 'ai') return;
        conv.messages.pop();
        saveState();
        isStreaming = true;
        abortController = new AbortController();
        const c = body.querySelector('#ai-msgs');
        c?.lastElementChild?.remove();
        updateLastStreaming('');
        updateSendButton();
        streamResponse(conv);
    }

    function handleKeydown(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'n' && !isStreaming) {
            e.preventDefault();
            createNewConversation();
            renderAll();
        }
    }
    document.addEventListener('keydown', handleKeydown);

    const observer = new MutationObserver(() => {
        if (!document.body.contains(body)) {
            document.removeEventListener('keydown', handleKeydown);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    loadConversations();
    renderAll();
};
