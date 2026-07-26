class FileSystem {
    constructor() {
        this.storageKey = 'macos_fs';
        this.root = this.load() || this.createDefaultFS();
    }

    createDefaultFS() {
        const now = new Date().toISOString();
        return {
            '/': {
                type: 'folder',
                children: {
                    'Applications': {
                        type: 'folder',
                        children: {}
                    },
                    'Desktop': {
                        type: 'folder',
                        children: {}
                    },
                    'Documents': {
                        type: 'folder',
                        children: {
                            '欢迎.txt': {
                                type: 'file',
                                content: '欢迎使用 macOS 网页版！\n\n这是一个功能完整的桌面环境模拟。\n您可以：\n- 点击 Dock 图标打开应用\n- 使用 Command+空格 打开 Spotlight\n- 点击右上角打开控制中心\n- 在系统设置中切换浅色/深色模式\n\n祝您使用愉快！',
                                created: now,
                                modified: now
                            },
                            '待办事项.txt': {
                                type: 'file',
                                content: '我的待办事项\n\n□ 探索系统功能\n□ 试用所有应用\n□ 自定义壁纸\n□ 调整 Dock 设置',
                                created: now,
                                modified: now
                            }
                        }
                    },
                    'Downloads': {
                        type: 'folder',
                        children: {}
                    },
                    'Pictures': {
                        type: 'folder',
                        children: {}
                    },
                    'Music': {
                        type: 'folder',
                        children: {}
                    },
                    'Movies': {
                        type: 'folder',
                        children: {}
                    },
                    'Library': {
                        type: 'folder',
                        children: {}
                    },
                    'Users': {
                        type: 'folder',
                        children: {
                            '用户': {
                                type: 'folder',
                                children: {}
                            }
                        }
                    }
                }
            }
        };
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.root));
        } catch (e) {
            console.warn('Failed to save filesystem:', e);
        }
    }

    resolvePath(path) {
        if (path === '/') return this.root['/'];
        const parts = path.split('/').filter(p => p);
        let current = this.root['/'];
        for (const part of parts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    }

    getParentPath(path) {
        const parts = path.split('/').filter(p => p);
        parts.pop();
        return '/' + parts.join('/');
    }

    list(path) {
        const node = this.resolvePath(path);
        if (!node || node.type !== 'folder') return [];
        return Object.keys(node.children).map(name => ({
            name,
            ...node.children[name],
            path: path === '/' ? '/' + name : path + '/' + name
        }));
    }

    readFile(path) {
        const node = this.resolvePath(path);
        if (!node || node.type !== 'file') return null;
        return node.content;
    }

    writeFile(path, content) {
        const parts = path.split('/').filter(p => p);
        const fileName = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.resolvePath(parentPath);
        if (!parent || parent.type !== 'folder') return false;
        const now = new Date().toISOString();
        if (!parent.children[fileName]) {
            parent.children[fileName] = {
                type: 'file',
                content: '',
                created: now
            };
        }
        parent.children[fileName].content = content;
        parent.children[fileName].modified = now;
        this.save();
        return true;
    }

    createFolder(path) {
        const parts = path.split('/').filter(p => p);
        const folderName = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.resolvePath(parentPath);
        if (!parent || parent.type !== 'folder') return false;
        if (!parent.children[folderName]) {
            parent.children[folderName] = {
                type: 'folder',
                children: {}
            };
            this.save();
        }
        return true;
    }

    delete(path) {
        if (path === '/') return false;
        const parts = path.split('/').filter(p => p);
        const name = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.resolvePath(parentPath);
        if (parent && parent.children[name]) {
            delete parent.children[name];
            this.save();
            return true;
        }
        return false;
    }

    exists(path) {
        return this.resolvePath(path) !== null;
    }

    isFolder(path) {
        const node = this.resolvePath(path);
        return node && node.type === 'folder';
    }

    moveFile(fromPath, toPath) {
        const fromParts = fromPath.split('/').filter(p => p);
        const fromName = fromParts.pop();
        const fromParentPath = '/' + fromParts.join('/');
        const fromParent = this.resolvePath(fromParentPath);
        if (!fromParent || !fromParent.children[fromName]) return false;

        const toParent = this.resolvePath(toPath);
        if (!toParent || toParent.type !== 'folder') return false;

        // Check if destination already has an item with the same name
        if (toParent.children[fromName]) return false;

        // Move the node
        toParent.children[fromName] = fromParent.children[fromName];
        delete fromParent.children[fromName];
        this.save();
        return true;
    }
}
