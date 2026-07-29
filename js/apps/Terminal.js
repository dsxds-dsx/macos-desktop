window.renderTerminal = function(body, sidebar, toolbar, windowId) {
    let currentDir = '/Documents';
    let commandHistory = JSON.parse(localStorage.getItem('terminal_history') || '[]');
    let historyIndex = -1;
    let theme = localStorage.getItem('terminal_theme') || 'basic';

    const themes = {
        basic: { name: 'Basic', bg: 'rgba(238,238,238,1)', text: '#1d1d1f', prompt: '#1d1d1f', title: '#e8e8e8', dir: '#1d1d1f' },
        pro: { name: 'Pro', bg: 'rgba(20,20,20,0.95)', text: '#e8e8e8', prompt: '#30d158', title: '#1a1a1a', dir: '#5ac8fa' },
        ocean: { name: 'Ocean', bg: 'rgba(18,28,46,1)', text: '#cdd6e1', prompt: '#5ac8fa', title: '#0e1a30', dir: '#5ac8fa' },
        homebrew: { name: 'Homebrew', bg: 'rgba(0,0,0,1)', text: '#30d158', prompt: '#30d158', title: '#0a0a0a', dir: '#30d158' },
        man: { name: 'Man Page', bg: 'rgba(245,245,245,1)', text: '#1d1d1f', prompt: '#1d1d1f', title: '#e0e0e0', dir: '#666' }
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function getDirName(path) {
        if (path === '/') return '/';
        if (path === '/Documents') return '~';
        if (path.startsWith('/Documents/')) return '~/...' + path.slice(11);
        const parts = path.split('/').filter(p => p);
        return parts[parts.length - 1];
    }

    function resolvePath(path) {
        if (path.startsWith('/')) return path;
        if (path.startsWith('~/')) return '/Documents/' + path.slice(2);
        if (path === '~') return '/Documents';
        return currentDir === '/' ? '/' + path : currentDir + '/' + path;
    }

    function applyTheme() {
        const t = themes[theme] || themes.basic;
        body.style.background = t.bg;
        body.style.color = t.text;
    }

    function executeCommand(cmdLine) {
        const parts = cmdLine.trim().split(/\s+/);
        const cmd = parts[0]?.toLowerCase();
        const args = parts.slice(1);

        if (!cmd) return '';

        commandHistory.push(cmdLine);
        if (commandHistory.length > 100) commandHistory.shift();
        localStorage.setItem('terminal_history', JSON.stringify(commandHistory));

        switch (cmd) {
            case 'ls': {
                const listPath = args[0] ? resolvePath(args[0]) : currentDir;
                const items = window.fileSystem.list(listPath);
                if (!items) return `ls: ${args[0] || listPath}: 没有那个文件或目录`;
                return items.map(item => {
                    if (item.type === 'folder') {
                        return `<span style="color:var(--accent-blue);font-weight:600;">${escapeHtml(item.name)}/</span>`;
                    }
                    if (item.name.endsWith('.sh')) {
                        return `<span style="color:#30d158;">${escapeHtml(item.name)}</span>`;
                    }
                    return escapeHtml(item.name);
                }).join('   ');
            }
            case 'cd': {
                if (!args[0] || args[0] === '~') {
                    currentDir = '/Documents';
                    return '';
                }
                if (args[0] === '..') {
                    const parts = currentDir.split('/').filter(p => p);
                    parts.pop();
                    currentDir = '/' + parts.join('/');
                    if (currentDir === '/') currentDir = '/';
                    return '';
                }
                if (args[0] === '/') {
                    currentDir = '/';
                    return '';
                }
                const target = resolvePath(args[0]);
                if (window.fileSystem.isFolder(target)) {
                    currentDir = target;
                    return '';
                }
                return `cd: ${args[0]}: 不是目录`;
            }
            case 'pwd':
                return currentDir;
            case 'cat': {
                if (!args[0]) return 'cat: 缺少文件参数';
                const filePath = resolvePath(args[0]);
                const content = window.fileSystem.readFile(filePath);
                if (content === null) return `cat: ${args[0]}: 没有那个文件或目录`;
                return escapeHtml(content);
            }
            case 'echo':
                return escapeHtml(args.join(' '));
            case 'clear':
                return '___CLEAR___';
            case 'help':
                return `可用命令:
  <span style="color:var(--accent-blue);">ls [路径]</span>       列出目录内容
  <span style="color:var(--accent-blue);">cd [路径]</span>       切换目录
  <span style="color:var(--accent-blue);">pwd</span>             显示当前路径
  <span style="color:var(--accent-blue);">cat &lt;文件&gt;</span>      查看文件内容
  <span style="color:var(--accent-blue);">echo &lt;文本&gt;</span>     输出文本
  <span style="color:var(--accent-blue);">clear</span>           清屏
  <span style="color:var(--accent-blue);">help</span>            显示帮助
  <span style="color:var(--accent-blue);">mkdir &lt;目录&gt;</span>  创建目录
  <span style="color:var(--accent-blue);">touch &lt;文件&gt;</span>  创建文件
  <span style="color:var(--accent-blue);">date</span>            显示日期时间
  <span style="color:var(--accent-blue);">whoami</span>          显示当前用户
  <span style="color:var(--accent-blue);">open &lt;应用&gt;</span>   打开应用
  <span style="color:var(--accent-blue);">about</span>           关于终端
  <span style="color:var(--accent-blue);">theme &lt;主题&gt;</span>  切换主题 (basic/pro/ocean/homebrew/man)`;
            case 'mkdir': {
                if (!args[0]) return 'mkdir: 缺少目录名';
                const path = currentDir === '/' ? '/' + args[0] : currentDir + '/' + args[0];
                const success = window.fileSystem.createFolder(path);
                return success ? '' : `mkdir: ${args[0]}: 创建失败`;
            }
            case 'touch': {
                if (!args[0]) return 'touch: 缺少文件名';
                const path = currentDir === '/' ? '/' + args[0] : currentDir + '/' + args[0];
                const success = window.fileSystem.writeFile(path, '');
                return success ? '' : `touch: ${args[0]}: 创建失败`;
            }
            case 'date':
                return new Date().toLocaleString('zh-CN');
            case 'whoami':
                return 'user';
            case 'open': {
                if (!args[0]) return 'open: 缺少应用名';
                const appMap = {
                    'finder': 'finder', '访达': 'finder',
                    'safari': 'safari', '浏览器': 'safari',
                    'settings': 'settings', '设置': 'settings',
                    'notes': 'notes', '备忘录': 'notes',
                    'calculator': 'calculator', '计算器': 'calculator',
                    'calendar': 'calendar', '日历': 'calendar',
                    'photos': 'photos', '照片': 'photos',
                    'ai': 'ai', 'textedit': 'textedit', '文本编辑': 'textedit',
                    'music': 'music', '音乐': 'music',
                    'terminal': 'terminal', '终端': 'terminal',
                    'clock': 'clock', '时钟': 'clock',
                    'reminders': 'reminders', '提醒事项': 'reminders',
                    'mail': 'mail', '邮件': 'mail'
                };
                const appId = appMap[args[0].toLowerCase()] || args[0].toLowerCase();
                if (window.appManager) {
                    window.appManager.openApp(appId);
                    return '';
                }
                return `open: ${args[0]}: 无法打开`;
            }
            case 'about':
                return `<span style="color:#ff9f0a;">macOS Web Terminal</span>
版本 1.0 (Build 2024)
Shell: zsh 5.9
用户: user
主机: macbook-pro.local`;
            case 'theme': {
                if (!args[0]) return `当前主题: ${themes[theme]?.name || theme}\n可用主题: ${Object.keys(themes).join(', ')}`;
                if (themes[args[0]]) {
                    theme = args[0];
                    localStorage.setItem('terminal_theme', theme);
                    applyTheme();
                    updateTitle();
                    return `主题已切换为: ${themes[theme].name}`;
                }
                return `theme: ${args[0]}: 未知主题。可用: ${Object.keys(themes).join(', ')}`;
            }
            case 'history': {
                return commandHistory.slice(-20).map((c, i) => `  ${(commandHistory.length - Math.min(commandHistory.length, 20) + i + 1).toString().padStart(4)}  ${escapeHtml(c)}`).join('\n');
            }
            case 'sudo':
                return `<span style="color:#ff3b30;">user is not in the sudoers file. This incident will be reported.</span>`;
            default:
                return `<span style="color:#ff3b30;">zsh: command not found: ${escapeHtml(cmd)}</span>`;
        }
    }

    function updateTitle() {
        const t = themes[theme] || themes.basic;
        const titleBar = body.querySelector('.terminal-title-bar');
        if (titleBar) {
            titleBar.style.background = t.title;
            titleBar.style.color = t.text;
            titleBar.querySelector('.terminal-title-text').textContent = `user — -zsh — ${getDirName(currentDir)} — ${t.name}`;
        }
        const prompt = body.querySelector('.terminal-prompt-active');
        if (prompt) prompt.style.color = t.prompt;
        const dir = body.querySelector('.terminal-dir-active');
        if (dir) {
            dir.style.color = t.dir;
            dir.textContent = getDirName(currentDir);
        }
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.padding = '0';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        const t = themes[theme] || themes.basic;
        applyTheme();
        body.innerHTML = `
            <div class="terminal-title-bar" style="background:${t.title};color:${t.text};">
                <div class="terminal-title-text">user — -zsh — ${getDirName(currentDir)} — ${t.name}</div>
            </div>
            <div class="terminal-body" id="terminal-output-${windowId}" style="background:${t.bg};color:${t.text};">
                <div class="terminal-line">Last login: ${new Date().toLocaleString('zh-CN')} on ttys000</div>
                <div class="terminal-line">Welcome to macOS Web Terminal. Type <span style="color:var(--accent-yellow);">help</span> for available commands.</div>
            </div>
            <div class="terminal-input-line terminal-input-row" id="terminal-input-line-${windowId}">
                <span class="terminal-prompt terminal-prompt-active" style="color:${t.prompt};">user@macbook <span class="terminal-dir-active" style="color:${t.dir};">${getDirName(currentDir)}</span> % </span>
                <input type="text" class="terminal-input" id="terminal-input-${windowId}" autocomplete="off" spellcheck="false">
            </div>
        `;

        const input = body.querySelector(`#terminal-input-${windowId}`);
        const output = body.querySelector(`#terminal-output-${windowId}`);

        body.addEventListener('click', () => input.focus());

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmdLine = input.value;
                const result = executeCommand(cmdLine);
                const t = themes[theme] || themes.basic;

                const cmdLineDiv = document.createElement('div');
                cmdLineDiv.className = 'terminal-line terminal-cmd-line';
                cmdLineDiv.innerHTML = `<span class="terminal-prompt" style="color:${t.prompt};">user@macbook <span style="color:${t.dir};">${getDirName(currentDir)}</span> % </span>${escapeHtml(cmdLine)}`;
                output.appendChild(cmdLineDiv);

                if (result === '___CLEAR___') {
                    output.innerHTML = '';
                } else if (result) {
                    const resultDiv = document.createElement('div');
                    resultDiv.className = 'terminal-line';
                    resultDiv.innerHTML = result;
                    output.appendChild(resultDiv);
                }

                input.value = '';
                historyIndex = -1;
                updateTitle();
                output.scrollTop = output.scrollHeight;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (commandHistory.length > 0) {
                    historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                    input.value = commandHistory[commandHistory.length - 1 - historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                historyIndex = Math.max(historyIndex - 1, -1);
                input.value = historyIndex >= 0 ? commandHistory[commandHistory.length - 1 - historyIndex] || '' : '';
            } else if (e.key === 'Tab') {
                e.preventDefault();
                // Simple tab completion
                const val = input.value;
                const parts = val.split(/\s+/);
                const last = parts[parts.length - 1];
                if (parts.length > 1 && last) {
                    const items = window.fileSystem.list(currentDir) || [];
                    const matches = items.filter(i => i.name.startsWith(last));
                    if (matches.length === 1) {
                        parts[parts.length - 1] = matches[0].name + (matches[0].type === 'folder' ? '/' : '');
                        input.value = parts.join(' ');
                    }
                }
            }
        });

        setTimeout(() => input.focus(), 100);
    }

    render();
};
