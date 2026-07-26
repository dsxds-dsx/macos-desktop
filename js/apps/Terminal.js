window.renderTerminal = function(body, sidebar, toolbar, windowId) {
    let currentDir = '/Documents';
    let history = [];
    let historyIndex = -1;
    let commandHistory = JSON.parse(localStorage.getItem('terminal_history') || '[]');
    let theme = localStorage.getItem('terminal_theme') || 'dark';

    const themes = {
        dark: { bg: '#1e1e1e', text: '#d4d4d4', prompt: '#30d158' },
        light: { bg: '#ffffff', text: '#1d1d1f', prompt: '#007aff' },
        pro: { bg: '#000000', text: '#30d158', prompt: '#ff9f0a' }
    };

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
                        return `<span style="color:var(--accent-blue);font-weight:600;">${item.name}/</span>`;
                    }
                    return item.name;
                }).join('  ');
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
                return content;
            }
            case 'echo':
                return args.join(' ');
            case 'clear':
                return '___CLEAR___';
            case 'help':
                return `可用命令:
  ls [路径]       - 列出目录内容
  cd [路径]       - 切换目录
  pwd             - 显示当前路径
  cat <文件>      - 查看文件内容
  echo <文本>     - 输出文本
  clear           - 清屏
  help            - 显示帮助
  mkdir <目录名>  - 创建目录
  touch <文件名>  - 创建文件
  date            - 显示日期时间
  whoami          - 显示当前用户
  open <应用名>   - 打开应用
  about           - 关于终端
  theme <主题>    - 切换主题 (dark/light/pro)`;
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
                return '用户';
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
                    'music': 'music', '音乐': 'music'
                };
                const appId = appMap[args[0].toLowerCase()] || args[0].toLowerCase();
                if (window.appManager) {
                    window.appManager.openApp(appId);
                    return '';
                }
                return `open: ${args[0]}: 无法打开`;
            }
            case 'about':
                return `终端 - macOS 网页版
版本 1.0
欢迎使用命令行界面！`;
            case 'theme': {
                if (!args[0]) return `当前主题: ${theme}\n可用主题: dark, light, pro`;
                if (themes[args[0]]) {
                    theme = args[0];
                    localStorage.setItem('terminal_theme', theme);
                    applyTheme();
                    return `主题已切换为: ${theme}`;
                }
                return `theme: ${args[0]}: 未知主题`;
            }
            default:
                return `zsh: command not found: ${cmd}`;
        }
    }

    function resolvePath(path) {
        if (path.startsWith('/')) return path;
        if (path.startsWith('~/')) return '/Documents/' + path.slice(2);
        if (path === '~') return '/Documents';
        return currentDir === '/' ? '/' + path : currentDir + '/' + path;
    }

    function applyTheme() {
        const t = themes[theme];
        body.style.background = t.bg;
        body.style.color = t.text;
    }

    function render() {
        body.className = 'window-body terminal-body app-content';
        body.style.fontFamily = 'var(--mono-font)';
        applyTheme();
        body.innerHTML = `
            <div class="terminal-line">Last login: ${new Date().toLocaleString('zh-CN')} on ttys000</div>
            <div class="terminal-line">欢迎使用 macOS 网页版终端！输入 <span style="color:var(--accent-yellow);">help</span> 查看可用命令。</div>
            <div id="terminal-output-${windowId}"></div>
            <div class="terminal-input-line" id="terminal-input-line-${windowId}">
                <span class="terminal-prompt" style="color:${themes[theme].prompt};">用户@macbook ${getDirName(currentDir)} %&nbsp;</span>
                <input type="text" class="terminal-input" id="terminal-input-${windowId}" autofocus autocomplete="off" spellcheck="false">
            </div>
        `;

        const input = body.querySelector(`#terminal-input-${windowId}`);
        const output = body.querySelector(`#terminal-output-${windowId}`);
        const inputLine = body.querySelector(`#terminal-input-line-${windowId}`);

        body.addEventListener('click', () => input.focus());

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmdLine = input.value;
                const result = executeCommand(cmdLine);
                
                const cmdLineDiv = document.createElement('div');
                cmdLineDiv.className = 'terminal-line';
                cmdLineDiv.innerHTML = `<span class="terminal-prompt" style="color:${themes[theme].prompt};">用户@macbook ${getDirName(currentDir)} % </span>${escapeHtml(cmdLine)}`;
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
                body.scrollTop = body.scrollHeight;
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
            }
        });

        setTimeout(() => input.focus(), 100);
    }

    function getDirName(path) {
        if (path === '/') return '/';
        const parts = path.split('/').filter(p => p);
        return parts[parts.length - 1];
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    render();
};
