/**
 * macOS 26 Tahoe 风格图标生成器
 * 严格基于 macOS 26 真实系统全家照参考图重写
 * 特点：更圆润 squircle、精致玻璃高光、统一的元素比例和颜色
 */
class IconGenerator {
    static _seq = 0;

    static _prefix() {
        IconGenerator._seq = (IconGenerator._seq + 1) % 1000000;
        return 'ic' + IconGenerator._seq;
    }

    static generate(name, options = {}) {
        const { emoji = '', bgColor = null } = options;
        if (emoji) {
            return IconGenerator.wrap(emoji, bgColor);
        }
        const p = IconGenerator._prefix();
        const icon = IconGenerator.icons[name] || IconGenerator.icons.default;
        return icon(p);
    }

    static wrap(emoji, bgColor) {
        const bg = bgColor || '#007AFF';
        const p = IconGenerator._prefix();
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, [bg, bg])}
            <text x="50" y="70" text-anchor="middle" font-family="apple color emoji, segoe ui emoji, sans-serif" font-size="50">${emoji}</text>
        </svg>`;
    }

    /**
     * Tahoe squircle 背景 - 大圆角 + 精致玻璃高光
     */
    static bg(p, stops, opts = {}) {
        const { x = 5, y = 5, w = 90, h = 90 } = opts;
        const arr = Array.isArray(stops) ? stops : [stops, stops];
        const stopsXml = arr.map((c, i) =>
            `<stop offset="${(i / Math.max(1, arr.length - 1) * 100).toFixed(0)}%" stop-color="${c}"/>`
        ).join('');
        const r = 22;
        return `<defs>
            <linearGradient id="${p}-bg" x1="0%" y1="0%" x2="100%" y2="100%">${stopsXml}</linearGradient>
            <linearGradient id="${p}-glass" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
                <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.1"/>
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="${p}-edge" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.5"/>
                <stop offset="15%" stop-color="#FFFFFF" stop-opacity="0"/>
                <stop offset="85%" stop-color="#000000" stop-opacity="0"/>
                <stop offset="100%" stop-color="#000000" stop-opacity="0.15"/>
            </linearGradient>
            <filter id="${p}-sh" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.25"/>
            </filter>
            <clipPath id="${p}-clip">
                <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}"/>
            </clipPath>
        </defs>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="url(#${p}-bg)" filter="url(#${p}-sh)"/>
        <g clip-path="url(#${p}-clip)">
            <rect x="${x}" y="${y}" width="${w}" height="${h * 0.5}" rx="0" fill="url(#${p}-glass)"/>
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="url(#${p}-edge)" stroke-width="1.5"/>
        </g>`;
    }

    static icons = {
        // 时钟 - 黑底白面，橘色秒针（参考图第1行第1列）
        clock: (p) => {
            const ticks = [...Array(12)].map((_, i) => {
                const major = i % 3 === 0;
                const len = major ? 5 : 2.5;
                const w = major ? 1.8 : 1;
                return `<rect x="${50 - w / 2}" y="${50 - 31}" width="${w}" height="${len}" rx="0.5" fill="${major ? '#1D1D1F' : '#8E8E93'}" transform="rotate(${i * 30} 50 50)"/>`;
            }).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <circle cx="50" cy="50" r="36" fill="#FFFFFF"/>
                <circle cx="50" cy="50" r="36" fill="none" stroke="#1D1D1F" stroke-width="1"/>
                ${ticks}
                <rect x="49" y="50" width="2" height="22" rx="1" fill="#1D1D1F" transform="rotate(-30 50 50)"/>
                <rect x="49" y="50" width="2" height="26" rx="1" fill="#1D1D1F" transform="rotate(60 50 50)"/>
                <rect x="49.4" y="22" width="1.2" height="30" rx="0.6" fill="#FF9500" transform="rotate(120 50 50)"/>
                <circle cx="50" cy="50" r="2.5" fill="#1D1D1F"/>
            </svg>`;
        },

        // 访达 - 经典笑脸（参考图第1行第2列）
        finder: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'], { x: 5, y: 5, w: 90, h: 90 })}
                <path d="M12,30 Q8,52 18,72 Q30,90 50,90 Q70,90 82,72 Q92,52 88,30 Q82,12 60,10 Q40,10 30,12 Q18,16 12,30 Z" fill="#FFFFFF"/>
                <path d="M52,10 Q72,12 86,28 Q92,46 84,62 Q74,80 56,86 Q50,88 48,86 Q54,76 60,64 Q66,50 60,34 Q54,20 46,12 Z" fill="#007AFF"/>
                <ellipse cx="30" cy="48" rx="4.5" ry="6" fill="#1D1D1F"/>
                <ellipse cx="68" cy="48" rx="4.5" ry="6" fill="#FFFFFF"/>
                <path d="M28,66 Q42,80 50,78 Q58,80 72,66" stroke="#1D1D1F" stroke-width="4" fill="none" stroke-linecap="round"/>
            </svg>`;
        },

        // 照片 - 8片彩色花瓣（参考图第1行第3列）
        photos: (p) => {
            const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55'];
            const petals = colors.map((c, i) =>
                `<ellipse cx="0" cy="-20" rx="7.5" ry="15" fill="${c}" transform="rotate(${i * 45})"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#FFFFFF'])}
                <g transform="translate(50,50)">${petals}</g>
                <circle cx="50" cy="50" r="8" fill="#FFFFFF"/>
            </svg>`;
        },

        // 语音备忘录 - 红色波形（参考图第1行第4列）
        voice: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
                <g stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round">
                    <line x1="20" y1="50" x2="20" y2="50"/>
                    <line x1="26" y1="42" x2="26" y2="58"/>
                    <line x1="32" y1="34" x2="32" y2="66"/>
                    <line x1="38" y1="26" x2="38" y2="74"/>
                    <line x1="44" y1="36" x2="44" y2="64"/>
                    <line x1="50" y1="20" x2="50" y2="80" stroke="#FF3B30" stroke-width="3"/>
                    <line x1="56" y1="32" x2="56" y2="68"/>
                    <line x1="62" y1="40" x2="62" y2="60"/>
                    <line x1="68" y1="28" x2="68" y2="72"/>
                    <line x1="74" y1="38" x2="74" y2="62"/>
                    <line x1="80" y1="46" x2="80" y2="54"/>
                </g>
            </svg>`;
        },

        // 计算器 - 黑色机身+橘色等号（参考图第2行第1列）
        calculator: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#3A3A3C', '#1C1C1E'])}
                <rect x="14" y="12" width="72" height="76" rx="10" fill="#1C1C1E"/>
                <rect x="14" y="12" width="72" height="76" rx="10" fill="none" stroke="#48484A" stroke-width="1"/>
                <rect x="20" y="18" width="60" height="18" rx="2" fill="#000000"/>
                <text x="76" y="32" text-anchor="end" font-family="-apple-system, sans-serif" font-size="14" fill="#FFFFFF" font-weight="300">0</text>
                ${(() => {
                    let btns = '';
                    const colors = [
                        ['#A5A5A5', '#A5A5A5', '#A5A5A5', '#FF9F0A'],
                        ['#333335', '#333335', '#333335', '#FF9F0A'],
                        ['#333335', '#333335', '#333335', '#FF9F0A'],
                        ['#333335', '#333335', '#333335', '#FF9F0A'],
                        ['#333335', '#333335', '#333335', '#FF9F0A']
                    ];
                    for (let r = 0; r < 5; r++) {
                        for (let c = 0; c < 4; c++) {
                            const x = 20 + c * 15;
                            const y = 40 + r * 9.5;
                            const w = 13;
                            const h = 8;
                            const fill = colors[r][c];
                            const radius = c === 3 ? (r === 0 ? 2 : 4) : 2;
                            btns += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}"/>`;
                        }
                    }
                    return btns;
                })()}
            </svg>`;
        },

        // 信息 - 彩色气泡（参考图第2行第2列）
        messages: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <path d="M28,18 Q12,18 12,34 L12,52 Q12,68 28,68 L40,68 L46,78 L52,68 L72,68 Q88,68 88,52 L88,34 Q88,18 72,18 Z" fill="#5AC8FA"/>
                <path d="M30,82 Q14,82 14,66" stroke="#34C759" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M30,82 Q24,82 20,78" stroke="#34C759" stroke-width="6" fill="none" stroke-linecap="round"/>
                <rect x="42" y="34" width="6" height="20" rx="3" fill="#FFFFFF"/>
                <rect x="52" y="34" width="6" height="20" rx="3" fill="#FFFFFF"/>
            </svg>`;
        },

        // 提示 - 黄色灯泡（参考图第2行第3列）
        tips: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#FFD60A', '#FF9500'])}
                <path d="M50,16 Q32,16 32,38 Q32,52 42,62 L42,72 L58,72 L58,62 Q68,52 68,38 Q68,16 50,16 Z" fill="#FFFFFF"/>
                <rect x="42" y="74" width="16" height="4" rx="1" fill="#FFFFFF"/>
                <rect x="44" y="80" width="12" height="4" rx="1" fill="#FFFFFF"/>
                <path d="M44,40 Q50,46 56,40" stroke="#FF9500" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </svg>`;
        },

        // App Store - 蓝色三角（参考图第2行第4列）
        appstore: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <g fill="#FFFFFF">
                    <path d="M30,72 L50,24 L70,72 L60,72 L50,52 L40,72 Z"/>
                    <line x1="22" y1="50" x2="78" y2="50" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
                </g>
            </svg>`;
        },

        // Siri - 蓝紫渐变波形（参考图第3行第1列）
        siri: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${p}-siri" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF375F"/>
                        <stop offset="50%" stop-color="#BF5AF2"/>
                        <stop offset="100%" stop-color="#0A84FF"/>
                    </linearGradient>
                </defs>
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <circle cx="50" cy="50" r="32" fill="url(#${p}-siri)" opacity="0.15"/>
                <circle cx="50" cy="50" r="22" fill="url(#${p}-siri)"/>
                <circle cx="50" cy="50" r="10" fill="#FFFFFF"/>
            </svg>`;
        },

        // 相机取景框（参考图第3行第2列）
        camera: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <g fill="none" stroke="#1D1D1F" stroke-width="3" stroke-linecap="round">
                    <path d="M22,30 L22,22 L34,22"/>
                    <path d="M78,30 L78,22 L66,22"/>
                    <path d="M22,70 L22,78 L34,78"/>
                    <path d="M78,70 L78,78 L66,78"/>
                </g>
                <circle cx="50" cy="50" r="12" fill="none" stroke="#1D1D1F" stroke-width="2.5"/>
                <circle cx="50" cy="50" r="6" fill="#1D1D1F"/>
            </svg>`;
        },

        // 照片彩色花瓣（同 photos）
        colorpics: (p) => {
            const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55'];
            const petals = colors.map((c, i) =>
                `<ellipse cx="0" cy="-18" rx="6" ry="13" fill="${c}" transform="rotate(${i * 45})"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#FFFFFF'])}
                <g transform="translate(50,50)">${petals}</g>
            </svg>`;
        },

        // 国际象棋 - 木马（参考图第3行第4列）
        chess: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#E5E5EA', '#C7C7CC'])}
                <g fill="#1D1D1F">
                    <path d="M30,72 L70,72 L74,82 L26,82 Z"/>
                    <rect x="32" y="68" width="36" height="6" rx="1"/>
                    <path d="M50,30 Q40,30 38,42 L38,68 L62,68 L62,42 Q60,30 50,30 Z"/>
                    <path d="M38,42 L34,30 Q32,22 38,20 L42,28"/>
                    <circle cx="62" cy="22" r="3"/>
                </g>
            </svg>`;
        },

        // 库乐队 - 黑色钢琴+彩色推子（参考图第4行第1列）
        garageband: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
                <rect x="8" y="20" width="84" height="60" rx="6" fill="#3A3A3C"/>
                <rect x="12" y="24" width="76" height="14" fill="#FFFFFF"/>
                ${[0, 1, 2, 3, 4, 5, 6].map((i) => {
                    const x = 14 + i * 11;
                    return `<rect x="${x}" y="24" width="6" height="14" fill="#1D1D1F"/>`;
                }).join('')}
                <rect x="12" y="42" width="76" height="32" rx="2" fill="#1C1C1E"/>
                ${[0, 1, 2, 3].map((i) => {
                    const x = 18 + i * 17;
                    const colors = ['#FF3B30', '#FF9500', '#34C759', '#5AC8FA'];
                    return `<rect x="${x}" y="46" width="6" height="24" rx="2" fill="${colors[i]}"/>`;
                }).join('')}
            </svg>`;
        },

        // Pages - 红色A字母（参考图第4行第2列）
        pages: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
                <text x="50" y="74" text-anchor="middle" font-family="Georgia, serif" font-size="68" fill="#FFFFFF" font-weight="400">A</text>
            </svg>`;
        },

        // 开发者 - <>（参考图第4行第3列）
        terminal: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <text x="50" y="68" text-anchor="middle" font-family="Menlo, monospace" font-size="44" fill="#1D1D1F" font-weight="700">&lt;/&gt;</text>
            </svg>`;
        },

        // Pixelmator - 橙色波浪（参考图第4行第4列）
        pixelmator: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${p}-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF9500"/>
                        <stop offset="100%" stop-color="#FF3B30"/>
                    </linearGradient>
                </defs>
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <path d="M20,58 Q34,38 50,52 Q66,66 80,46" stroke="url(#${p}-orange)" stroke-width="6" fill="none" stroke-linecap="round"/>
            </svg>`;
        },

        // 警告 - 黑底黄字（参考图第5行第1列）
        warnings: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
                <text x="50" y="44" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="14" fill="#FFD60A" font-weight="700">WARNING</text>
                <text x="50" y="72" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="22" fill="#FFD60A" font-weight="300">7:36</text>
            </svg>`;
        },

        // 股票 - 黑底绿波形（参考图第5行第2列）
        stocks: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
                <g stroke="#5AC8FA" stroke-width="1" opacity="0.3">
                    <line x1="14" y1="20" x2="86" y2="20"/>
                    <line x1="14" y1="40" x2="86" y2="40"/>
                    <line x1="14" y1="60" x2="86" y2="60"/>
                    <line x1="14" y1="80" x2="86" y2="80"/>
                </g>
                <line x1="50" y1="14" x2="50" y2="86" stroke="#FFFFFF" stroke-width="2"/>
                <polyline points="14,52 26,46 32,54 40,50 48,58 56,42 64,48 72,30 86,28" stroke="#5AC8FA" stroke-width="2" fill="none"/>
                <circle cx="50" cy="50" r="6" fill="#5AC8FA"/>
                <circle cx="50" cy="50" r="3" fill="#FFFFFF"/>
            </svg>`;
        },

        // 速记/便签 - 黄色纸+彩色点（参考图第5行第3列）
        stickies: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <rect x="18" y="18" width="64" height="64" rx="6" fill="#FFFFFF"/>
                <rect x="18" y="18" width="64" height="14" rx="6" fill="#E5E5EA"/>
                <g>
                    <circle cx="28" cy="44" r="4" fill="#5AC8FA"/>
                    <circle cx="40" cy="44" r="4" fill="#FF9500"/>
                    <circle cx="52" cy="44" r="4" fill="#34C759"/>
                    <circle cx="64" cy="44" r="4" fill="#FF3B30"/>
                </g>
                <rect x="28" y="54" width="44" height="3" rx="1.5" fill="#1D1D1F"/>
                <rect x="28" y="62" width="36" height="3" rx="1.5" fill="#1D1D1F"/>
                <rect x="28" y="70" width="40" height="3" rx="1.5" fill="#1D1D1F"/>
            </svg>`;
        },

        // 打印机（参考图第5行第4列）
        printer: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <rect x="22" y="20" width="56" height="34" rx="4" fill="#FFFFFF" stroke="#1D1D1F" stroke-width="2"/>
                <rect x="14" y="32" width="72" height="30" rx="3" fill="#1D1D1F"/>
                <rect x="20" y="38" width="60" height="18" fill="#FFFFFF"/>
                <rect x="22" y="62" width="56" height="20" rx="2" fill="#FFFFFF" stroke="#1D1D1F" stroke-width="2"/>
                <line x1="32" y1="68" x2="68" y2="68" stroke="#1D1D1F" stroke-width="2"/>
                <line x1="32" y1="74" x2="58" y2="74" stroke="#1D1D1F" stroke-width="2"/>
            </svg>`;
        },

        // 信息/对话 - 蓝色双气泡（参考图第6行第1列）
        chat: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <path d="M22,22 Q12,22 12,32 L12,46 Q12,56 22,56 L32,56 L38,64 L42,56 L52,56 Q62,56 62,46 L62,32 Q62,22 52,22 Z" fill="#5AC8FA"/>
                <path d="M40,40 Q34,40 34,48 L34,60 Q34,68 40,68 L60,68 Q66,68 66,60 L66,48 Q66,40 60,40 L52,40 L46,48 L40,40 Z" fill="#007AFF" opacity="0.85"/>
            </svg>`;
        },

        // App Store 蓝（重复）
        appstore2: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <g fill="#FFFFFF">
                    <path d="M30,72 L50,24 L70,72 L60,72 L50,52 L40,72 Z"/>
                    <line x1="22" y1="50" x2="78" y2="50" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
                </g>
            </svg>`;
        },

        // iBooks - 橙色书（参考图第6行第3列）
        books: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#FF9500', '#FF6B00'])}
                <path d="M50,18 Q34,14 22,20 L22,80 Q36,76 50,80 Z" fill="#FFFFFF"/>
                <path d="M50,18 Q66,14 78,20 L78,80 Q64,76 50,80 Z" fill="#FFFFFF"/>
                <line x1="50" y1="20" x2="50" y2="78" stroke="#FF9500" stroke-width="2"/>
            </svg>`;
        },

        // 联系人 - 白色头像（参考图第6行第4列）
        contacts: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <circle cx="50" cy="38" r="14" fill="#FFFFFF"/>
                <path d="M22,82 Q22,58 50,58 Q78,58 78,82 Z" fill="#FFFFFF"/>
            </svg>`;
        },

        // 通讯录 - 灰色头像（参考图第7行第1列）
        addressbook: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <rect x="14" y="14" width="72" height="72" rx="8" fill="#FFFFFF"/>
                <rect x="14" y="14" width="20" height="72" rx="8" fill="#FF9500"/>
                <circle cx="58" cy="40" r="10" fill="#1D1D1F"/>
                <path d="M40,68 Q40,52 58,52 Q76,52 76,68 Z" fill="#1D1D1F"/>
            </svg>`;
        },

        // 文件夹 - 蓝色（参考图第7行第2列）
        folders: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${p}-fb" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#5AC8FA"/>
                        <stop offset="100%" stop-color="#007AFF"/>
                    </linearGradient>
                </defs>
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <path d="M14,30 L40,30 L46,24 L86,24 Q90,24 90,28 L90,76 Q90,80 86,80 L14,80 Q10,80 10,76 L10,34 Q10,30 14,30 Z" fill="url(#${p}-fb)"/>
                <path d="M14,30 L40,30 L46,24 L86,24 Q90,24 90,28 L90,40 L10,40 L10,34 Q10,30 14,30 Z" fill="#FFFFFF" opacity="0.2"/>
            </svg>`;
        },

        // 蓝牙 - 蓝色（参考图第7行第3列）
        bluetooth: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <path d="M30,24 L70,52 L50,72 M50,28 L30,52 L50,76 M50,28 L50,76" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        },

        // 钥匙串 - 钥匙（参考图第7行第4列）
        keychain: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <circle cx="34" cy="50" r="20" fill="none" stroke="#FFFFFF" stroke-width="6"/>
                <circle cx="34" cy="50" r="6" fill="#FFFFFF"/>
                <rect x="50" y="46" width="36" height="8" rx="2" fill="#FFFFFF"/>
                <rect x="76" y="50" width="6" height="12" rx="1" fill="#FFFFFF"/>
            </svg>`;
        },

        // 提醒事项 - 三色圆点列表（参考图第8行第1列）
        reminders: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <rect x="14" y="14" width="72" height="72" rx="6" fill="#FFFFFF"/>
                <circle cx="28" cy="30" r="6" fill="none" stroke="#1D1D1F" stroke-width="2"/>
                <circle cx="28" cy="30" r="3" fill="#1D1D1F"/>
                <line x1="40" y1="30" x2="76" y2="30" stroke="#1D1D1F" stroke-width="2" stroke-linecap="round"/>
                <circle cx="28" cy="50" r="6" fill="none" stroke="#1D1D1F" stroke-width="2"/>
                <line x1="40" y1="50" x2="76" y2="50" stroke="#1D1D1F" stroke-width="2" stroke-linecap="round"/>
                <circle cx="28" cy="70" r="6" fill="none" stroke="#1D1D1F" stroke-width="2"/>
                <line x1="40" y1="70" x2="70" y2="70" stroke="#1D1D1F" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        },

        // 便签 - 黄色纸（参考图第8行第2列）
        notes: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#FFE066', '#FFD60A'])}
                <rect x="14" y="14" width="72" height="72" rx="6" fill="#FFFFFF"/>
                <rect x="14" y="14" width="72" height="16" rx="6" fill="#FFD60A"/>
                <rect x="14" y="24" width="72" height="6" fill="#FFD60A"/>
                <rect x="24" y="40" width="52" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
                <rect x="24" y="48" width="44" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
                <rect x="24" y="56" width="48" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
                <rect x="24" y="64" width="40" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
                <rect x="24" y="72" width="50" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
            </svg>`;
        },

        // FaceTime - 绿色相机（参考图第8行第3列）
        facetime: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#34C759', '#248A3D'])}
                <rect x="12" y="30" width="54" height="40" rx="8" fill="#FFFFFF"/>
                <path d="M66,44 L88,30 L88,70 L66,56 Z" fill="#FFFFFF"/>
            </svg>`;
        },

        // 日历 - 红头白底数字（参考图第8行第4列）
        calendar: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <rect x="10" y="10" width="80" height="80" rx="6" fill="#FFFFFF"/>
                <rect x="10" y="10" width="80" height="22" rx="6" fill="#FF3B30"/>
                <rect x="10" y="24" width="80" height="8" fill="#FF3B30"/>
                <text x="50" y="26" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="10" fill="#FFFFFF" font-weight="700">JULY</text>
                <text x="50" y="76" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="48" fill="#1D1D1F" font-weight="300">26</text>
            </svg>`;
        },

        // 仪表盘/活动 - 绿底白环（参考图第9行第1列）
        activity: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <circle cx="50" cy="50" r="32" fill="#34C759"/>
                <circle cx="50" cy="50" r="22" fill="none" stroke="#FFFFFF" stroke-width="3"/>
                <line x1="50" y1="32" x2="50" y2="68" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
                <line x1="32" y1="50" x2="68" y2="50" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="3" fill="#FFFFFF"/>
            </svg>`;
        },

        // 照片花瓣（同photos）
        photos2: (p) => {
            const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55'];
            const petals = colors.map((c, i) =>
                `<ellipse cx="0" cy="-18" rx="6.5" ry="14" fill="${c}" transform="rotate(${i * 45})"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#FFFFFF'])}
                <g transform="translate(50,50)">${petals}</g>
                <circle cx="50" cy="50" r="6" fill="#FFFFFF"/>
            </svg>`;
        },

        // 信息 - 绿色对话（参考图第9行第3列）
        chat2: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#34C759', '#248A3D'])}
                <path d="M50,16 C26,16 10,32 10,54 C10,66 18,76 28,82 L24,90 L40,82 C44,84 48,85 50,86 C74,86 90,70 90,54 C90,32 74,16 50,16 Z" fill="#FFFFFF"/>
            </svg>`;
        },

        // 文件 - 白底黑线（参考图第9行第4列）
        files: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <rect x="14" y="14" width="72" height="72" rx="6" fill="#FFFFFF"/>
                <rect x="28" y="20" width="44" height="60" rx="3" fill="#FFFFFF" stroke="#1D1D1F" stroke-width="2"/>
                <line x1="36" y1="32" x2="64" y2="32" stroke="#1D1D1F" stroke-width="2"/>
                <line x1="36" y1="42" x2="64" y2="42" stroke="#1D1D1F" stroke-width="2"/>
                <line x1="36" y1="52" x2="56" y2="52" stroke="#1D1D1F" stroke-width="2"/>
                <line x1="36" y1="62" x2="60" y2="62" stroke="#1D1D1F" stroke-width="2"/>
            </svg>`;
        },

        // Siri渐变（参考图第10行第1列）
        siri2: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${p}-siri2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF375F"/>
                        <stop offset="50%" stop-color="#BF5AF2"/>
                        <stop offset="100%" stop-color="#0A84FF"/>
                    </linearGradient>
                </defs>
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <circle cx="50" cy="50" r="30" fill="url(#${p}-siri2)"/>
                <circle cx="50" cy="50" r="14" fill="#FFFFFF"/>
            </svg>`;
        },

        // 音乐 - 红粉渐变音符（参考图第10行第2列）
        music: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${p}-note" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF375F"/>
                        <stop offset="50%" stop-color="#FF2D55"/>
                        <stop offset="100%" stop-color="#BF5AF2"/>
                    </linearGradient>
                </defs>
                ${IconGenerator.bg(p, ['#FFFFFF', '#F2F2F7'])}
                <path d="M38,68 L38,28 L72,20 L72,60" stroke="url(#${p}-note)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                <ellipse cx="34" cy="70" rx="11" ry="9" fill="url(#${p}-note)"/>
                <ellipse cx="68" cy="60" rx="11" ry="9" fill="url(#${p}-note)"/>
            </svg>`;
        },

        // 天气 - 云+太阳（参考图第10行第3列）
        weather: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <circle cx="68" cy="32" r="14" fill="#FFD60A"/>
                <path d="M20,62 Q12,54 20,46 Q28,38 40,44 Q50,36 60,46 Q72,44 72,56 Q78,62 72,68 Q68,74 60,72 L24,72 Q14,72 20,62 Z" fill="#FFFFFF"/>
            </svg>`;
        },

        // 计算器（参考图第10行第4列）
        calculator2: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#3A3A3C', '#1C1C1E'])}
                <rect x="14" y="12" width="72" height="76" rx="10" fill="#1C1C1E"/>
                <rect x="20" y="18" width="60" height="18" rx="2" fill="#000000"/>
                <text x="76" y="32" text-anchor="end" font-family="-apple-system, sans-serif" font-size="14" fill="#FFFFFF" font-weight="300">0</text>
                ${(() => {
                    let btns = '';
                    for (let r = 0; r < 5; r++) {
                        for (let c = 0; c < 4; c++) {
                            const x = 20 + c * 15;
                            const y = 40 + r * 9.5;
                            const fill = c === 3 ? '#FF9F0A' : (r === 0 ? '#A5A5A5' : '#333335');
                            btns += `<rect x="${x}" y="${y}" width="13" height="8" rx="2" fill="${fill}"/>`;
                        }
                    }
                    return btns;
                })()}
            </svg>`;
        },

        // 查找iPhone - 绿圈（参考图第11行第1列）
        findmy: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${p}-fm" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#5BE35B"/>
                        <stop offset="100%" stop-color="#34C759"/>
                    </linearGradient>
                </defs>
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <circle cx="50" cy="50" r="32" fill="url(#${p}-fm)"/>
                <circle cx="50" cy="50" r="22" fill="none" stroke="#FFFFFF" stroke-width="3"/>
                <circle cx="50" cy="50" r="6" fill="#FFFFFF"/>
            </svg>`;
        },

        // 系统设置 - 灰色齿轮（参考图第11行第2列）
        settings: (p) => {
            const teeth = [...Array(8)].map((_, i) =>
                `<rect x="46" y="6" width="8" height="14" rx="2" fill="#8E8E93" transform="rotate(${i * 45} 50 50)"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                ${teeth}
                <circle cx="50" cy="50" r="30" fill="#8E8E93"/>
                <circle cx="50" cy="50" r="18" fill="#F2F2F7"/>
                <circle cx="50" cy="50" r="10" fill="#8E8E93"/>
            </svg>`;
        },

        // 辅助功能 - 灰色人形（参考图第11行第3列）
        accessibility: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <circle cx="50" cy="32" r="8" fill="#1D1D1F"/>
                <path d="M30,48 L70,48 L70,58 L58,58 L58,82 L42,82 L42,58 L30,58 Z" fill="#1D1D1F"/>
            </svg>`;
        },

        // 联系人（参考图第11行第4列）
        contacts2: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <rect x="14" y="20" width="72" height="60" rx="8" fill="#FFFFFF"/>
                <circle cx="50" cy="42" r="10" fill="#1D1D1F"/>
                <path d="M30,68 Q30,52 50,52 Q70,52 70,68 Z" fill="#1D1D1F"/>
            </svg>`;
        },

        // TestFlight - 灰色盾牌（参考图第12行第1列）
        testflight: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <path d="M50,14 L26,24 L26,52 Q26,72 50,86 Q74,72 74,52 L74,24 Z" fill="#8E8E93"/>
                <path d="M30,48 L46,60 L70,32" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        },

        // 健康 - 心电图（参考图第12行第2列）
        health: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
                <g fill="none" stroke="#0A84FF" stroke-width="2" opacity="0.3">
                    <line x1="14" y1="20" x2="86" y2="20"/>
                    <line x1="14" y1="40" x2="86" y2="40"/>
                    <line x1="14" y1="60" x2="86" y2="60"/>
                    <line x1="14" y1="80" x2="86" y2="80"/>
                </g>
                <polyline points="14,50 30,50 36,30 44,70 50,40 56,60 64,50 86,50" stroke="#30D158" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
        },

        // 备忘录 - 黄色便签（参考图第12行第3列）
        memos: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#FFD60A', '#FF9500'])}
                <rect x="14" y="14" width="72" height="72" rx="6" fill="#FFFFFF"/>
                <line x1="14" y1="20" x2="86" y2="20" stroke="#FF9500" stroke-width="1.5" stroke-dasharray="2 2"/>
                <line x1="20" y1="30" x2="20" y2="86" stroke="#FF3B30" stroke-width="1.5"/>
                <rect x="28" y="36" width="48" height="3" rx="1.5" fill="#FFCC00" opacity="0.7"/>
                <rect x="28" y="44" width="40" height="3" rx="1.5" fill="#FFCC00" opacity="0.7"/>
                <rect x="28" y="52" width="44" height="3" rx="1.5" fill="#FFCC00" opacity="0.7"/>
                <rect x="28" y="60" width="36" height="3" rx="1.5" fill="#FFCC00" opacity="0.7"/>
                <rect x="28" y="68" width="42" height="3" rx="1.5" fill="#FFCC00" opacity="0.7"/>
                <rect x="28" y="76" width="30" height="3" rx="1.5" fill="#FFCC00" opacity="0.7"/>
            </svg>`;
        },

        // 智能家居 - 橙色房子（参考图第12行第4列）
        home: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#FF9500', '#FF6B00'])}
                <path d="M50,16 L84,46 L84,82 L60,82 L60,60 L40,60 L40,82 L16,82 L16,46 Z" fill="#FFFFFF"/>
            </svg>`;
        },

        // 终端 - 黑底（参考图第13行第1列）
        terminalCmd: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
                <rect x="14" y="20" width="72" height="60" rx="4" fill="#000000"/>
                <text x="50" y="60" text-anchor="middle" font-family="Menlo, monospace" font-size="32" fill="#FFFFFF" font-weight="700">&gt;_</text>
            </svg>`;
        },

        // 照片（重复参考图第13行第2列）
        photos3: (p) => {
            const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55'];
            const petals = colors.map((c, i) =>
                `<ellipse cx="0" cy="-18" rx="6.5" ry="14" fill="${c}" transform="rotate(${i * 45})"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <g transform="translate(50,50)">${petals}</g>
                <circle cx="50" cy="50" r="6" fill="#FFFFFF"/>
            </svg>`;
        },

        // 无限符号（参考图第13行第3列）
        infinity: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${p}-inf" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF375F"/>
                        <stop offset="50%" stop-color="#FF9500"/>
                        <stop offset="100%" stop-color="#FFCC00"/>
                    </linearGradient>
                </defs>
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <path d="M30,50 C30,38 42,38 50,50 C58,62 70,62 70,50 C70,38 58,38 50,50 C42,62 30,62 30,50 Z" stroke="url(#${p}-inf)" stroke-width="6" fill="none"/>
            </svg>`;
        },

        // 照片-紫色（参考图第13行第4列）
        photos4: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
                <rect x="10" y="22" width="80" height="56" rx="4" fill="#3A3A3C"/>
                <circle cx="34" cy="42" r="6" fill="#5AC8FA"/>
                <circle cx="50" cy="42" r="6" fill="#FF9500"/>
                <circle cx="66" cy="42" r="6" fill="#34C759"/>
                <path d="M10,78 L20,60 L36,72 L52,54 L68,68 L82,52 L90,62 L90,78 Z" fill="#34C759"/>
            </svg>`;
        },

        // Safari - 蓝白罗盘（参考图第14行第1列）
        safari: (p) => {
            const ticks = [...Array(12)].map((_, i) => {
                const major = i % 3 === 0;
                const len = major ? 6 : 3;
                const w = major ? 2 : 1.2;
                return `<rect x="${50 - w / 2}" y="${50 - 32}" width="${w}" height="${len}" rx="0.5" fill="${major ? '#1D1D1F' : '#8E8E93'}" transform="rotate(${i * 30} 50 50)"/>`;
            }).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <circle cx="50" cy="50" r="34" fill="#FFFFFF"/>
                <circle cx="50" cy="50" r="34" fill="none" stroke="#1D1D1F" stroke-width="1.5"/>
                ${ticks}
                <text x="50" y="22" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="6" fill="#1D1D1F" font-weight="600">N</text>
                <path d="M50,50 L58,22 L52,48 Z" fill="#FF3B30"/>
                <path d="M50,50 L42,78 L48,52 Z" fill="#E5E5EA"/>
                <circle cx="50" cy="50" r="3" fill="#1D1D1F"/>
            </svg>`;
        },

        // 播客 - 紫色（参考图第14行第2列）
        podcasts: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#BF5AF2', '#8944AB'])}
                <circle cx="50" cy="36" r="10" fill="#FFFFFF"/>
                <path d="M50,48 Q66,48 66,64 L34,64 Q34,48 50,48 Z" fill="#FFFFFF"/>
                <path d="M26,52 Q26,28 48,18" stroke="#FFFFFF" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                <path d="M74,52 Q74,28 52,18" stroke="#FFFFFF" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                <rect x="48" y="64" width="4" height="14" fill="#FFFFFF"/>
            </svg>`;
        },

        // 地图 - 彩色（参考图第14行第3列）
        maps: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#34C759'])}
                <path d="M14,24 L34,18 L62,28 L86,20 L86,76 L62,84 L34,72 L14,80 Z" fill="#A8E6B8"/>
                <path d="M14,24 L34,18 L62,28 L86,20 L86,48 L62,54 L34,46 L14,52 Z" fill="#34C759" opacity="0.6"/>
                <path d="M14,52 Q30,48 50,56 Q70,64 86,48 L86,76 L62,84 L34,72 L14,80 Z" fill="#5AC8FA"/>
                <path d="M14,68 Q30,62 46,68 Q60,74 76,66 L86,76 L62,84 L34,72 L14,80 Z" fill="#FCD34D" opacity="0.5"/>
                <path d="M50,32 C42,32 36,38 36,46 C36,56 50,72 50,72 C50,72 64,56 64,46 C64,38 58,32 50,32 Z" fill="#FF3B30"/>
                <circle cx="50" cy="46" r="6" fill="#FFFFFF"/>
            </svg>`;
        },

        // 搜索/Spotlight - 蓝（参考图第14行第4列）
        spotlight: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <circle cx="42" cy="42" r="22" fill="none" stroke="#5AC8FA" stroke-width="8"/>
                <line x1="58" y1="58" x2="80" y2="80" stroke="#5AC8FA" stroke-width="8" stroke-linecap="round"/>
            </svg>`;
        },

        // 钥匙串 - 蓝（参考图第15行第1列）
        keys: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${p}-kg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#5BE35B"/>
                        <stop offset="50%" stop-color="#FFD60A"/>
                        <stop offset="100%" stop-color="#FF9500"/>
                    </linearGradient>
                </defs>
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <circle cx="32" cy="68" r="14" fill="url(#${p}-kg)"/>
                <rect x="42" y="46" width="40" height="6" rx="2" fill="url(#${p}-kg)" transform="rotate(-30 42 46)"/>
                <rect x="74" y="30" width="6" height="14" rx="1" fill="url(#${p}-kg)" transform="rotate(-30 74 30)"/>
            </svg>`;
        },

        // Apple TV - 黑底（参考图第15行第2列）
        appletv: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
                <path d="M40,38 Q34,32 38,26 Q44,20 50,28 L50,38 Q44,42 40,38 Z" fill="#FFFFFF"/>
                <text x="62" y="42" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="20" fill="#FFFFFF" font-weight="500">tv</text>
            </svg>`;
        },

        // WiFi - 蓝（参考图第15行第3列）
        wifi: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <path d="M20,40 Q50,18 80,40" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M30,52 Q50,38 70,52" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M40,64 Q50,56 60,64" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round"/>
                <circle cx="50" cy="76" r="4" fill="#FFFFFF"/>
            </svg>`;
        },

        // 邮件 - 蓝色信封（参考图第15行第4列）
        mail: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <rect x="12" y="28" width="76" height="44" rx="6" fill="#FFFFFF"/>
                <path d="M12,34 L50,58 L88,34" stroke="#007AFF" stroke-width="2" fill="none" stroke-linejoin="round"/>
                <path d="M12,34 L50,56 L88,34" stroke="rgba(0,122,255,0.4)" stroke-width="1" fill="none"/>
            </svg>`;
        },

        // 备忘录 - 黄色（参考图第16行第1列）
        notes2: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#FFFFFF', '#F2F2F7'])}
                <rect x="14" y="14" width="72" height="72" rx="6" fill="#FFFFFF"/>
                <line x1="14" y1="22" x2="86" y2="22" stroke="#FF3B30" stroke-width="1"/>
                <line x1="20" y1="30" x2="20" y2="86" stroke="#FF3B30" stroke-width="1"/>
                <line x1="28" y1="36" x2="80" y2="36" stroke="#1D1D1F" stroke-width="1.5" stroke-dasharray="2 2"/>
                <line x1="28" y1="44" x2="80" y2="44" stroke="#1D1D1F" stroke-width="1.5" stroke-dasharray="2 2"/>
                <line x1="28" y1="52" x2="80" y2="52" stroke="#1D1D1F" stroke-width="1.5" stroke-dasharray="2 2"/>
                <line x1="28" y1="60" x2="80" y2="60" stroke="#1D1D1F" stroke-width="1.5" stroke-dasharray="2 2"/>
                <line x1="28" y1="68" x2="80" y2="68" stroke="#1D1D1F" stroke-width="1.5" stroke-dasharray="2 2"/>
                <line x1="28" y1="76" x2="68" y2="76" stroke="#1D1D1F" stroke-width="1.5" stroke-dasharray="2 2"/>
            </svg>`;
        },

        // 快捷指令 - 紫粉渐变（参考图第16行第2列）
        shortcuts: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="${p}-sc" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FF375F"/>
                        <stop offset="50%" stop-color="#BF5AF2"/>
                        <stop offset="100%" stop-color="#5E5CE6"/>
                    </linearGradient>
                </defs>
                ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
                <path d="M30,30 L42,30 L70,58 L70,70 L58,70 Z" fill="url(#${p}-sc)"/>
                <path d="M70,30 L58,30 L30,58 L30,70 L42,70 Z" fill="url(#${p}-sc)"/>
            </svg>`;
        },

        // 邮件（备份）
        default: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#F2F2F7', '#E5E5EA'])}
            <text x="50" y="68" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="48" fill="#8E8E93">?</text>
        </svg>`,

        // 兼容旧版本图标 - 文本编辑（绿色铅笔+文档）
        textedit: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#34C759', '#248A3D'])}
            <rect x="18" y="14" width="50" height="72" rx="3" fill="#FFFFFF"/>
            <rect x="24" y="26" width="28" height="3.5" rx="1.5" fill="#1D1D1F"/>
            <rect x="24" y="36" width="34" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="24" y="42" width="30" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="24" y="48" width="34" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="24" y="54" width="26" height="2" rx="1" fill="#C7C7CC"/>
            <g transform="rotate(45 68 58)">
                <rect x="62" y="42" width="8" height="26" rx="2" fill="#FF9F0A"/>
                <rect x="62" y="42" width="8" height="6" rx="2" fill="#FF6B3A"/>
                <path d="M62,68 L66,76 L70,68 Z" fill="#1D1D1F"/>
            </g>
        </svg>`,

        // 兼容旧版本 - 废纸篓
        trash: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#E5E5EA', '#C7C7CC'])}
            <path d="M24,32 L76,32 L72,84 Q70,90 62,90 L38,90 Q30,90 28,84 Z" fill="#FFFFFF"/>
            <rect x="34" y="20" width="32" height="10" rx="3" fill="#8E8E93"/>
            <line x1="40" y1="42" x2="40" y2="82" stroke="#D1D1D6" stroke-width="3" stroke-linecap="round"/>
            <line x1="50" y1="42" x2="50" y2="82" stroke="#D1D1D6" stroke-width="3" stroke-linecap="round"/>
            <line x1="60" y1="42" x2="60" y2="82" stroke="#D1D1D6" stroke-width="3" stroke-linecap="round"/>
        </svg>`,

        // 兼容 - AI 助手
        ai: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF375F', '#BF5AF2', '#5E5CE6'])}
            <g transform="translate(50,50)">
                ${[0, 72, 144, 216, 288].map((deg) =>
                    `<path d="M0,-20 C7,-12 9,-5 0,5 C-9,-5 -7,-12 0,-20 Z" fill="#FFFFFF" transform="rotate(${deg})"/>`
                ).join('')}
            </g>
            <circle cx="50" cy="50" r="10" fill="#FFFFFF" opacity="0.95"/>
        </svg>`,

        // 兼容 - Keynote
        keynote: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#007AFF', '#0040DD'])}
            <rect x="12" y="18" width="76" height="48" rx="4" fill="#FFFFFF"/>
            <rect x="22" y="34" width="10" height="22" rx="2" fill="#FF3B30"/>
            <rect x="36" y="40" width="10" height="16" rx="2" fill="#FF9500"/>
            <rect x="50" y="30" width="10" height="26" rx="2" fill="#34C759"/>
            <rect x="64" y="36" width="10" height="20" rx="2" fill="#5AC8FA"/>
            <rect x="46" y="66" width="8" height="14" fill="#8E8E93"/>
            <rect x="26" y="80" width="48" height="4" rx="2" fill="#8E8E93"/>
        </svg>`,

        // 兼容 - News
        news: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
            <rect x="14" y="14" width="72" height="72" rx="4" fill="#FFFFFF"/>
            <text x="50" y="58" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="#FF3B30" font-weight="700" font-style="italic">N</text>
        </svg>`,

        // 兼容 - QuickTime
        quicktime: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#3A3A3C', '#000000'])}
            <circle cx="50" cy="50" r="34" fill="#000000"/>
            <polygon points="38,34 38,66 68,50" fill="#FFFFFF"/>
        </svg>`,

        // 兼容 - ImageCapture
        imagecapture: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#8E8E93', '#48484A'])}
            <rect x="10" y="30" width="80" height="50" rx="6" fill="#FFFFFF"/>
            <rect x="36" y="22" width="28" height="10" rx="3" fill="#FFFFFF"/>
            <circle cx="50" cy="55" r="18" fill="#1D1D1F"/>
            <circle cx="50" cy="55" r="14" fill="#5AC8FA"/>
            <circle cx="50" cy="55" r="10" fill="#1D1D1F"/>
        </svg>`,

        // 兼容 - Dictionary
        dictionary: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
            <rect x="22" y="12" width="56" height="76" rx="4" fill="#FFD60A"/>
            <rect x="28" y="16" width="44" height="68" rx="2" fill="#FFFFFF"/>
            <text x="50" y="55" text-anchor="middle" font-family="Songti SC, serif" font-size="32" fill="#1D1D1F" font-weight="700">字</text>
        </svg>`,

        // 兼容 - FontBook
        fontbook: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
            <text x="50" y="68" text-anchor="middle" font-family="Georgia, serif" font-size="48" fill="#FFFFFF" font-weight="700" font-style="italic">Aa</text>
        </svg>`,

        // 兼容 - Migration
        migration: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#C7C7CC', '#8E8E93'])}
            <rect x="12" y="28" width="32" height="48" rx="4" fill="#FFFFFF"/>
            <rect x="12" y="28" width="32" height="10" rx="4" fill="#E5E5EA"/>
            <path d="M52,52 L72,52 M66,46 L72,52 L66,58" stroke="#34C759" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,

        // 兼容 - SysInfo
        sysinfo: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#636366', '#3A3A3C'])}
            <rect x="16" y="16" width="68" height="52" rx="4" fill="#000000"/>
            <rect x="22" y="22" width="56" height="40" rx="2" fill="#1C1C1E"/>
            <rect x="26" y="28" width="26" height="4" rx="1" fill="#30D158"/>
            <rect x="26" y="36" width="40" height="3" rx="1" fill="#5AC8FA"/>
            <rect x="26" y="44" width="32" height="3" rx="1" fill="#FF9500"/>
            <rect x="26" y="52" width="44" height="3" rx="1" fill="#FF3B30"/>
        </svg>`,

        // 兼容 - Voice Memos 别名
        voicememos: (p) => IconGenerator.icons.voice(p),

        // 兼容 - TV
        tv: (p) => IconGenerator.icons.appletv(p),

        // 兼容 - Photo Booth / Pages 红色
        photoBooth: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
            <rect x="20" y="22" width="60" height="60" rx="6" fill="#1C1C1E"/>
            <circle cx="50" cy="44" r="12" fill="#5AC8FA"/>
            <path d="M28,72 L40,58 L52,66 L64,52 L72,60 L72,82 L28,82 Z" fill="#34C759"/>
            <circle cx="68" cy="28" r="3" fill="#FF9500"/>
        </svg>`,

        // 兼容 - Photo Booth
        photobooth: (p) => IconGenerator.icons.photoBooth(p),

        // 兼容 - Image Playback（紫色预览）
        preview: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
            <rect x="10" y="22" width="80" height="56" rx="4" fill="#3A3A3C"/>
            <circle cx="34" cy="42" r="6" fill="#5AC8FA"/>
            <circle cx="50" cy="42" r="6" fill="#FF9500"/>
            <circle cx="66" cy="42" r="6" fill="#34C759"/>
            <path d="M10,78 L20,60 L36,72 L52,54 L68,68 L82,52 L90,62 L90,78 Z" fill="#34C759"/>
        </svg>`,

        // 兼容 - Voice Memos 简写
        voice: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
            <g stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round">
                <line x1="26" y1="42" x2="26" y2="58"/>
                <line x1="32" y1="34" x2="32" y2="66"/>
                <line x1="38" y1="26" x2="38" y2="74"/>
                <line x1="44" y1="36" x2="44" y2="64"/>
                <line x1="50" y1="20" x2="50" y2="80" stroke="#FF3B30" stroke-width="3"/>
                <line x1="56" y1="32" x2="56" y2="68"/>
                <line x1="62" y1="40" x2="62" y2="60"/>
                <line x1="68" y1="28" x2="68" y2="72"/>
                <line x1="74" y1="38" x2="74" y2="62"/>
            </g>
        </svg>`,

        // 兼容 - Image Capture
        camera: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
            <rect x="20" y="30" width="60" height="42" rx="4" fill="#3A3A3C"/>
            <rect x="38" y="22" width="24" height="10" rx="3" fill="#3A3A3C"/>
            <circle cx="50" cy="51" r="14" fill="#1C1C1E"/>
            <circle cx="50" cy="51" r="10" fill="#5AC8FA"/>
            <path d="M50,38 L50,68 M38,51 L62,51" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        </svg>`,

        // 兼容 - Photos
        photos_app: (p) => IconGenerator.icons.photos(p),

        // 兼容 - Stickies
        stickies: (p) => IconGenerator.icons.notes(p),

        // 兼容 - Numbers
        numbers: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#34C759', '#248A3D'])}
            <rect x="14" y="16" width="72" height="68" rx="6" fill="#FFFFFF"/>
            <rect x="22" y="30" width="16" height="28" rx="2" fill="#34C759"/>
            <rect x="40" y="38" width="16" height="20" rx="2" fill="#5AC8FA"/>
            <rect x="58" y="34" width="16" height="24" rx="2" fill="#FF9500"/>
        </svg>`,

        // 兼容 - 词典字体
        fontbook: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
            <text x="50" y="68" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="#FFFFFF" font-weight="700" font-style="italic">Aa</text>
        </svg>`,

        // 兼容 - Apple TV 别名
        appletv: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#1C1C1E', '#000000'])}
            <text x="50" y="68" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="36" fill="#FFFFFF" font-weight="600" letter-spacing="-2">tv</text>
        </svg>`,

        // 兼容 - Music 别名
        music: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="${p}-note" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FF375F"/>
                    <stop offset="50%" stop-color="#FF2D55"/>
                    <stop offset="100%" stop-color="#BF5AF2"/>
                </linearGradient>
            </defs>
            ${IconGenerator.bg(p, ['#FFFFFF', '#F2F2F7'])}
            <path d="M38,68 L38,28 L72,20 L72,60" stroke="url(#${p}-note)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <ellipse cx="34" cy="70" rx="11" ry="9" fill="url(#${p}-note)"/>
            <ellipse cx="68" cy="60" rx="11" ry="9" fill="url(#${p}-note)"/>
        </svg>`,

        // 兼容 - Maps 别名
        maps_app: (p) => IconGenerator.icons.maps(p),

        // 兼容 - 邮件别名
        mail: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
            <rect x="12" y="28" width="76" height="44" rx="6" fill="#FFFFFF"/>
            <path d="M12,34 L50,58 L88,34" stroke="#007AFF" stroke-width="2" fill="none" stroke-linejoin="round"/>
        </svg>`,

        // 兼容 - 通讯录
        contacts: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#C7C7CC', '#8E8E93'])}
            <rect x="14" y="12" width="72" height="76" rx="6" fill="#FFFFFF"/>
            <rect x="14" y="12" width="72" height="16" rx="6" fill="#D1D1D6"/>
            <circle cx="50" cy="42" r="12" fill="#007AFF"/>
            <path d="M30,68 Q30,52 50,52 Q70,52 70,68 Z" fill="#007AFF"/>
        </svg>`,

        // 兼容 - Books
        books: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF9500', '#FF6B00'])}
            <path d="M50,18 Q34,14 22,20 L22,80 Q36,76 50,80 Z" fill="#FFFFFF"/>
            <path d="M50,18 Q66,14 78,20 L78,80 Q64,76 50,80 Z" fill="#FFFFFF"/>
        </svg>`,

        // 兼容 - Reminders
        reminders: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FFFFFF', '#F2F2F7'])}
            <rect x="14" y="14" width="72" height="72" rx="6" fill="#FFFFFF"/>
            <circle cx="28" cy="30" r="6" fill="none" stroke="#1D1D1F" stroke-width="2"/>
            <circle cx="28" cy="30" r="3" fill="#1D1D1F"/>
            <line x1="40" y1="30" x2="76" y2="30" stroke="#1D1D1F" stroke-width="2" stroke-linecap="round"/>
            <circle cx="28" cy="50" r="6" fill="none" stroke="#1D1D1F" stroke-width="2"/>
            <line x1="40" y1="50" x2="76" y2="50" stroke="#1D1D1F" stroke-width="2" stroke-linecap="round"/>
            <circle cx="28" cy="70" r="6" fill="none" stroke="#1D1D1F" stroke-width="2"/>
            <line x1="40" y1="70" x2="70" y2="70" stroke="#1D1D1F" stroke-width="2" stroke-linecap="round"/>
        </svg>`,

        // 兼容 - Notes（黄色便签）
        notes: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FFE066', '#FFD60A'])}
            <rect x="14" y="14" width="72" height="72" rx="6" fill="#FFFFFF"/>
            <rect x="14" y="14" width="72" height="16" rx="6" fill="#FFD60A"/>
            <rect x="14" y="24" width="72" height="6" fill="#FFD60A"/>
            <rect x="24" y="40" width="52" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
            <rect x="24" y="48" width="44" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
            <rect x="24" y="56" width="48" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
            <rect x="24" y="64" width="40" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
            <rect x="24" y="72" width="50" height="3" rx="1.5" fill="#E5C200" opacity="0.6"/>
        </svg>`,

        // 兼容 - 邮件
        mail_app: (p) => IconGenerator.icons.mail(p),

        // 兼容 - Stickies
        stickies_app: (p) => IconGenerator.icons.stickies(p),

        // 兼容 - iMovie
        imovie: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#BF5AF2', '#8944AB'])}
            <rect x="10" y="12" width="80" height="56" rx="4" fill="#1C1C1E"/>
            <polygon points="38,28 38,52 64,40" fill="#FFFFFF"/>
            <rect x="10" y="68" width="80" height="20" rx="3" fill="#FFFFFF"/>
            <rect x="18" y="74" width="18" height="8" rx="1" fill="#BF5AF2"/>
            <rect x="40" y="72" width="24" height="10" rx="1" fill="#5AC8FA"/>
            <rect x="68" y="74" width="18" height="8" rx="1" fill="#FF9500"/>
        </svg>`,

        // 兼容 - Photo Booth
        photos_alt: (p) => IconGenerator.icons.photos(p),

        // 兼容 - Color Picker
        colorpics: (p) => {
            const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55'];
            const petals = colors.map((c, i) =>
                `<ellipse cx="0" cy="-18" rx="6" ry="13" fill="${c}" transform="rotate(${i * 45})"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#F2F2F7', '#FFFFFF'])}
                <g transform="translate(50,50)">${petals}</g>
            </svg>`;
        },

        // 兼容 - Stickies 别名
        stickies_old: (p) => IconGenerator.icons.stickies(p)
    };

    // 兼容原有图标名（指向新设计）
    static get _compatMap() {
        return {
            'appstore': 'appstore2',
            'tips': 'tips',
            'finder': 'finder',
            'safari': 'safari',
            'mail': 'mail',
            'messages': 'chat2',
            'maps': 'maps',
            'photos': 'photos',
            'music': 'music',
            'notes': 'notes2',
            'reminders': 'reminders',
            'calendar': 'calendar',
            'contacts': 'contacts2',
            'facetime': 'facetime',
            'clock': 'clock',
            'weather': 'weather',
            'calculator': 'calculator2',
            'voice': 'voice',
            'stocks': 'stocks',
            'home': 'home',
            'books': 'books',
            'podcasts': 'podcasts',
            'tv': 'appletv',
            'appstore': 'appstore2',
            'terminal': 'terminal',
            'settings': 'settings',
            'activity': 'activity',
            'keychain': 'keychain',
            'chess': 'chess',
            'preview': 'photos4',
            'sysinfo': 'sysinfo',
            'imagecapture': 'camera',
            'shortcuts': 'shortcuts'
        };
    }
}
