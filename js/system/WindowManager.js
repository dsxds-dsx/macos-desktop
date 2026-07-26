class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndexCounter = 100;
        this.activeWindow = null;
        this.container = document.getElementById('windows-container');
        this.dockItemStates = new Map();
    }

    createWindow(id, appName, options = {}) {
        const {
            width = 800,
            height = 600,
            minWidth = 400,
            minHeight = 300,
            icon = 'finder',
            content = '',
            title = appName,
            resizable = true,
            toolbar = false,
            sidebar = null
        } = options;

        if (this.windows.has(id)) {
            this.focusWindow(id);
            return this.windows.get(id);
        }

        const x = Math.max(50, (window.innerWidth - width) / 2 + (this.windows.size * 30) % 200 - 100);
        const y = Math.max(50, (window.innerHeight - height) / 2 + (this.windows.size * 30) % 150 - 50);

        const win = document.createElement('div');
        win.className = 'window';
        win.id = `window-${id}`;
        win.dataset.windowId = id;
        win.style.width = `${width}px`;
        win.style.height = `${height}px`;
        win.style.left = `${x}px`;
        win.style.top = `${y}px`;
        win.style.zIndex = ++this.zIndexCounter;

        win.innerHTML = `
            <div class="window-header">
                <div class="window-controls">
                    <button class="window-control close" title="关闭">
                        <svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </button>
                    <button class="window-control minimize" title="最小化">
                        <svg viewBox="0 0 10 10"><path d="M2 5h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </button>
                    <button class="window-control maximize" title="最大化">
                        <svg viewBox="0 0 10 10"><path d="M3 3h4v4H3z" fill="none" stroke="currentColor" stroke-width="1"/></svg>
                    </button>
                </div>
                <div class="window-title">${title}</div>
            </div>
            ${toolbar ? `
            <div class="window-toolbar" id="toolbar-${id}"></div>
            ` : ''}
            <div class="window-content">
                ${sidebar ? `
                <div class="window-sidebar" id="sidebar-${id}"></div>
                ` : ''}
                <div class="window-body" id="body-${id}">
                    ${content}
                </div>
            </div>
        `;

        this.container.appendChild(win);

        if (resizable) {
            this.addResizeHandles(win, id, minWidth, minHeight);
        }

        this.setupWindowEvents(win, id);

        const windowData = {
            id,
            element: win,
            appName,
            title,
            icon,
            state: 'normal',
            prevState: null,
            x, y, width, height,
            minimized: false,
            maximized: false,
            fullscreen: false
        };

        this.windows.set(id, windowData);

        requestAnimationFrame(() => {
            win.classList.add('open');
            this.focusWindow(id);
        });

        this.updateDockState(appName, true);

        return windowData;
    }

    addResizeHandles(win, id, minWidth, minHeight) {
        const handles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
        handles.forEach(dir => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${dir}`;
            handle.dataset.direction = dir;
            win.appendChild(handle);
            this.setupResize(handle, win, id, dir, minWidth, minHeight);
        });
    }

    setupResize(handle, win, id, dir, minWidth, minHeight) {
        let startX, startY, startW, startH, startL, startT;

        const onMouseDown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.focusWindow(id);
            startX = e.clientX;
            startY = e.clientY;
            startW = win.offsetWidth;
            startH = win.offsetHeight;
            startL = win.offsetLeft;
            startT = win.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newW = startW, newH = startH, newL = startL, newT = startT;

            if (dir.includes('e')) newW = Math.max(minWidth, startW + dx);
            if (dir.includes('w')) {
                newW = Math.max(minWidth, startW - dx);
                newL = startL + (startW - newW);
            }
            if (dir.includes('s')) newH = Math.max(minHeight, startH + dy);
            if (dir.includes('n')) {
                newH = Math.max(minHeight, startH - dy);
                newT = startT + (startH - newH);
            }

            win.style.width = `${newW}px`;
            win.style.height = `${newH}px`;
            win.style.left = `${newL}px`;
            win.style.top = `${newT}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        handle.addEventListener('mousedown', onMouseDown);
    }

    setupWindowEvents(win, id) {
        const header = win.querySelector('.window-header');
        const closeBtn = win.querySelector('.window-control.close');
        const minBtn = win.querySelector('.window-control.minimize');
        const maxBtn = win.querySelector('.window-control.maximize');

        let isDragging = false;
        let startX, startY, startL, startT;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-control')) return;
            this.focusWindow(id);
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startL = win.offsetLeft;
            startT = win.offsetTop;
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', onDragUp);
        });

        header.addEventListener('dblclick', (e) => {
            if (e.target.closest('.window-control')) return;
            this.toggleMaximize(id);
        });

        const onDragMove = (e) => {
            if (!isDragging) return;
            const winData = this.windows.get(id);
            if (winData && (winData.maximized || winData.fullscreen)) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newL = startL + dx;
            let newT = Math.max(28, startT + dy);
            
            newL = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, newL));
            
            win.style.left = `${newL}px`;
            win.style.top = `${newT}px`;
        };

        const onDragUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragUp);
        };

        closeBtn.addEventListener('click', () => this.closeWindow(id));
        minBtn.addEventListener('click', () => this.minimizeWindow(id));
        maxBtn.addEventListener('click', () => this.toggleMaximize(id));

        win.addEventListener('mousedown', () => this.focusWindow(id));
    }

    focusWindow(id) {
        if (this.activeWindow === id) return;

        this.windows.forEach((winData, winId) => {
            if (winId === id) {
                winData.element.style.zIndex = ++this.zIndexCounter;
                winData.element.classList.add('focused');
            } else {
                winData.element.classList.remove('focused');
            }
        });

        this.activeWindow = id;
        const winData = this.windows.get(id);
        if (winData && window.appManager) {
            window.appManager.setActiveApp(winData.appName);
        }
    }

    closeWindow(id) {
        const winData = this.windows.get(id);
        if (!winData) return;

        winData.element.classList.remove('open');
        setTimeout(() => {
            if (winData.element.parentNode) {
                winData.element.parentNode.removeChild(winData.element);
            }
            this.windows.delete(id);
            if (this.activeWindow === id) {
                this.activeWindow = null;
                const remaining = Array.from(this.windows.keys());
                if (remaining.length > 0) {
                    this.focusWindow(remaining[remaining.length - 1]);
                }
            }
            this.updateDockState(winData.appName, false);
            if (window.appManager) {
                window.appManager.onAppClosed(id);
            }
        }, 200);
    }

    minimizeWindow(id) {
        const winData = this.windows.get(id);
        if (!winData) return;

        winData.element.classList.add('minimizing');
        winData.minimized = true;
        
        setTimeout(() => {
            winData.element.style.display = 'none';
            winData.element.classList.remove('minimizing');
        }, 300);

        this.updateDockState(winData.appName, true, 'minimized');
    }

    restoreWindow(id) {
        const winData = this.windows.get(id);
        if (!winData) return;

        winData.element.style.display = '';
        winData.element.classList.add('open');
        winData.minimized = false;
        winData.maximized = false;
        winData.fullscreen = false;
        winData.element.classList.remove('maximized', 'fullscreen');
        
        this.focusWindow(id);
        this.updateDockState(winData.appName, true, 'normal');
    }

    toggleMaximize(id) {
        const winData = this.windows.get(id);
        if (!winData) return;

        if (winData.maximized) {
            winData.element.classList.remove('maximized');
            winData.element.style.top = `${winData.y}px`;
            winData.element.style.left = `${winData.x}px`;
            winData.element.style.width = `${winData.width}px`;
            winData.element.style.height = `${winData.height}px`;
            winData.maximized = false;
        } else {
            if (!winData.prevState) {
                winData.x = winData.element.offsetLeft;
                winData.y = winData.element.offsetTop;
                winData.width = winData.element.offsetWidth;
                winData.height = winData.element.offsetHeight;
            }
            winData.element.classList.add('maximized');
            winData.element.style.top = '28px';
            winData.element.style.left = '0';
            winData.element.style.width = '100%';
            winData.element.style.height = 'calc(100% - 28px - 88px)';
            winData.maximized = true;
        }
    }

    toggleFullscreen(id) {
        const winData = this.windows.get(id);
        if (!winData) return;

        if (winData.fullscreen) {
            winData.element.classList.remove('fullscreen');
            winData.element.style.top = `${winData.y}px`;
            winData.element.style.left = `${winData.x}px`;
            winData.element.style.width = `${winData.width}px`;
            winData.element.style.height = `${winData.height}px`;
            winData.fullscreen = false;
        } else {
            if (!winData.prevState) {
                winData.x = winData.element.offsetLeft;
                winData.y = winData.element.offsetTop;
                winData.width = winData.element.offsetWidth;
                winData.height = winData.element.offsetHeight;
            }
            winData.element.classList.add('fullscreen');
            winData.fullscreen = true;
        }
    }

    updateDockState(id, running, state = 'normal') {
        const dockItem = document.querySelector(`.dock-item[data-app-id="${id}"]`);
        if (dockItem) {
            if (running) {
                dockItem.classList.add('running');
                dockItem.dataset.windowState = state;
            } else {
                dockItem.classList.remove('running');
                delete dockItem.dataset.windowState;
            }
        }
    }

    getWindow(id) {
        return this.windows.get(id);
    }

    getActiveWindow() {
        return this.activeWindow ? this.windows.get(this.activeWindow) : null;
    }

    getWindowsByApp(appName) {
        return Array.from(this.windows.values()).filter(w => w.appName === appName);
    }
}
