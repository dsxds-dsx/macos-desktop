/**
 * macOS 26 Tahoe 风格图标生成器
 * 特征：更圆润的 squircle + 精细渐变 + 玻璃质感 + 内边框 + 多层叠加
 * 所有图标使用 100x100 viewBox
 *
 * 参考 Apple 官方设计语言：
 *  - 多层 Liquid Glass 玻璃质感
 *  - 顶部高光 + 底部阴影
 *  - 内部元素扁平化、不超出 squircle 边界
 *  - 渐变更柔和、更现代
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

    /**
     * emoji 图标包装器
     */
    static wrap(emoji, bgColor) {
        const bg = bgColor || '#007AFF';
        const p = IconGenerator._prefix();
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, [bg, bg])}
            <text x="50" y="70" text-anchor="middle" font-family="apple color emoji, segoe ui emoji, sans-serif" font-size="50">${emoji}</text>
        </svg>`;
    }

    /**
     * macOS Tahoe squircle: 更圆润圆角 + 玻璃高光 + 内边框
     */
    static squircle(p, stops, opts = {}) {
        const { rotate = false, x = 4, y = 4, w = 92, h = 92, r = 24 } = opts;
        const arr = Array.isArray(stops) ? stops : [stops, stops];
        const x2 = rotate ? '100%' : '0%';
        const stopsXml = arr.map((c, i) =>
            `<stop offset="${(i / Math.max(1, arr.length - 1) * 100).toFixed(0)}%" stop-color="${c}"/>`
        ).join('');
        const cx2 = x + w;
        // Tahoe 风格顶部高光
        const hi = `M${x},${y + r} Q${x},${y} ${x + r},${y} L${cx2 - r},${y} Q${cx2},${y} ${cx2},${y + r} L${cx2},${y + h * 0.4} L${x},${y + h * 0.4} Z`;
        return `<defs>
            <linearGradient id="${p}-bg" x1="0%" y1="0%" x2="${x2}" y2="100%">${stopsXml}</linearGradient>
            <linearGradient id="${p}-hi" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.28"/>
                <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.08"/>
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
            </linearGradient>
            <filter id="${p}-sh" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.32"/>
            </filter>
        </defs>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${p}-bg)" filter="url(#${p}-sh)"/>
        <path d="${hi}" fill="url(#${p}-hi)"/>
        <rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${r - 0.5}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.7"/>`;
    }

    /**
     * 内部描边高光 - 模拟 Liquid Glass 边缘反光
     */
    static glassEdge(p, x = 5, y = 5, w = 90, h = 90, r = 23) {
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="0.6"/>`;
    }

    static icons = {
        // Finder: macOS Tahoe - 蓝白两面板色块，左深右浅，Liquid Glass 质感
        finder: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#1B6FE3', '#0040A0'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <!-- 左半面（深色笑脸脸） -->
            <path d="M16,28 Q16,18 26,18 L50,18 L50,82 L26,82 Q16,82 16,72 Z" fill="#1B6FE3"/>
            <path d="M16,28 Q16,18 26,18 L50,18 L50,24 L26,24 Q22,24 22,28 L22,32 L16,32 Z" fill="rgba(255,255,255,0.18)"/>
            <!-- 右半面（浅色笑脸脸） -->
            <path d="M50,18 L74,18 Q84,18 84,28 L84,72 Q84,82 74,82 L50,82 Z" fill="#E8F2FF"/>
            <path d="M50,18 L74,18 Q84,18 84,28 L84,32 L78,32 Q78,28 74,28 L50,28 Z" fill="#FFFFFF"/>
            <!-- 中间分隔线 -->
            <line x1="50" y1="18" x2="50" y2="82" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/>
            <!-- 眼睛 -->
            <ellipse cx="34" cy="42" rx="3" ry="5" fill="#0A2540"/>
            <ellipse cx="66" cy="42" rx="3" ry="5" fill="#0A2540"/>
            <!-- 眼睛高光 -->
            <circle cx="35" cy="40" r="0.9" fill="#FFFFFF" opacity="0.6"/>
            <circle cx="67" cy="40" r="0.9" fill="#FFFFFF" opacity="0.6"/>
            <!-- 微笑 -->
            <path d="M34,58 Q50,70 66,58" stroke="#0A2540" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        </svg>`,

        // 系统设置：银色齿轮 + Liquid Glass
        settings: (p) => {
            const teeth = [...Array(8)].map((_, i) =>
                `<rect x="46.5" y="14" width="7" height="14" rx="2" fill="#E5E5EA" transform="rotate(${i * 45} 50 50)"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#9DA0A8', '#3A3A3D'])}
                ${IconGenerator.glassEdge(p)}
                <g>
                    ${teeth}
                    <circle cx="50" cy="50" r="24" fill="#F2F2F7"/>
                    <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/>
                    <!-- 中心高光 -->
                    <ellipse cx="50" cy="42" rx="14" ry="6" fill="rgba(255,255,255,0.5)"/>
                    <circle cx="50" cy="50" r="9" fill="#3A3A3D"/>
                    <circle cx="50" cy="50" r="9" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"/>
                </g>
            </svg>`;
        },

        // Safari: 蓝色背景 + 白色大表盘 + 红白指针（更接近真实 Tahoe 设计）
        safari: (p) => {
            const ticks = [...Array(12)].map((_, i) => {
                const major = i % 3 === 0;
                const h = major ? 5 : 3;
                return `<rect x="49.3" y="14" width="1.4" height="${h}" rx="0.5" fill="${major ? '#1D1D1F' : '#8E8E93'}" transform="rotate(${i * 30} 50 50)"/>`;
            }).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#1FA2FF', '#0A4D9E'], { rotate: true })}
                ${IconGenerator.glassEdge(p)}
                <!-- 大表盘 -->
                <circle cx="50" cy="50" r="34" fill="#F2F8FF"/>
                <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/>
                <!-- 顶部玻璃高光 -->
                <path d="M16,50 A34,34 0 0 1 50,16 A34,34 0 0 1 84,50 L84,42 A34,26 0 0 0 16,42 Z" fill="rgba(255,255,255,0.5)"/>
                ${ticks}
                <!-- 红白指针（罗盘针） -->
                <path d="M50,50 L60,28 L52,46 Z" fill="#FF3B30"/>
                <path d="M50,50 L40,72 L48,54 Z" fill="#FFFFFF"/>
                <path d="M50,50 L60,28 L52,46 Z" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.4"/>
                <path d="M50,50 L40,72 L48,54 Z" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="0.4"/>
                <circle cx="50" cy="50" r="2.8" fill="#1D1D1F"/>
            </svg>`;
        },

        // 终端：黑底绿字 Liquid Glass
        terminal: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5A5A5D', '#1D1D1F'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="12" y="20" width="76" height="60" rx="8" fill="#0A0A0C"/>
            <rect x="12" y="20" width="76" height="60" rx="8" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.6"/>
            <path d="M12,28 Q12,20 20,20 L80,20 Q88,20 88,28 L88,34 L12,34 Z" fill="#2C2C2E"/>
            <line x1="12" y1="34" x2="88" y2="34" stroke="rgba(0,0,0,0.5)" stroke-width="0.6"/>
            <circle cx="20" cy="27" r="2.4" fill="#FF5F57"/>
            <circle cx="29" cy="27" r="2.4" fill="#FEBC2E"/>
            <circle cx="38" cy="27" r="2.4" fill="#28C840"/>
            <path d="M20,46 L28,52 L20,58" stroke="#30D158" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="32" y="50" width="26" height="2.8" rx="1" fill="#E5E5EA"/>
            <rect x="32" y="58" width="16" height="2.4" rx="1" fill="#8E8E93"/>
            <rect x="20" y="66" width="6" height="2.4" rx="1" fill="#E5E5EA"/>
        </svg>`,

        // 备忘录：白纸 + 黄色顶部，玻璃质感
        notes: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFD340', '#FFB800'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="18" y="20" width="64" height="64" rx="6" fill="#FFFFFF"/>
            <rect x="18" y="20" width="64" height="64" rx="6" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <path d="M18,26 Q18,20 24,20 L76,20 Q82,20 82,26 L82,32 L18,32 Z" fill="#FFD60A"/>
            <path d="M18,26 Q18,20 24,20 L76,20 Q82,20 82,26 L82,28 L18,28 Z" fill="rgba(255,255,255,0.4)"/>
            <line x1="18" y1="32" x2="82" y2="32" stroke="#E0B400" stroke-width="0.6"/>
            ${[40, 48, 56, 64, 72].map((yy, i) => {
                const widths = [48, 40, 46, 38, 30];
                return `<rect x="24" y="${yy}" width="${widths[i]}" height="2" rx="1" fill="#D4A017" opacity="0.55"/>`;
            }).join('')}
        </svg>`,

        // 文本编辑：白纸 + 铅笔
        textedit: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#A8E6A1', '#2ECC71'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <rect x="20" y="14" width="50" height="72" rx="4" fill="#FFFFFF"/>
            <rect x="20" y="14" width="50" height="72" rx="4" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <path d="M20,18 Q20,14 24,14 L66,14 L66,20 L20,20 Z" fill="#EAF6EA"/>
            <rect x="26" y="28" width="28" height="2.8" rx="1" fill="#1D1D1F"/>
            <rect x="26" y="36" width="36" height="1.8" rx="0.9" fill="#C7C7CC"/>
            <rect x="26" y="42" width="32" height="1.8" rx="0.9" fill="#C7C7CC"/>
            <rect x="26" y="48" width="36" height="1.8" rx="0.9" fill="#C7C7CC"/>
            <rect x="26" y="54" width="28" height="1.8" rx="0.9" fill="#C7C7CC"/>
            <rect x="26" y="60" width="34" height="1.8" rx="0.9" fill="#C7C7CC"/>
            <g transform="rotate(45 70 52)">
                <rect x="64" y="32" width="8" height="36" rx="1.5" fill="#FF9F0A"/>
                <rect x="64" y="32" width="8" height="6" rx="1.5" fill="#FF5E3A"/>
                <path d="M64,68 L68,76 L72,68 Z" fill="#1D1D1F"/>
                <rect x="64" y="38" width="8" height="2" fill="rgba(0,0,0,0.12)"/>
            </g>
        </svg>`,

        // 日历：白底 + 红色顶部
        calendar: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFFFFF', '#F2F2F7'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="12" y="12" width="76" height="76" rx="8" fill="#FFFFFF" stroke="#E5E5EA" stroke-width="0.5"/>
            <path d="M12,20 Q12,12 20,12 L80,12 Q88,12 88,20 L88,32 L12,32 Z" fill="#FF3B30"/>
            <path d="M12,20 Q12,12 20,12 L80,12 Q88,12 88,20 L88,24 L12,24 Z" fill="rgba(255,255,255,0.25)"/>
            <text x="50" y="27" text-anchor="middle" font-family="PingFang SC, sans-serif" font-size="11" fill="#FFFFFF" font-weight="600">七月</text>
            <text x="50" y="70" text-anchor="middle" font-family="PingFang SC, sans-serif" font-size="38" fill="#1D1D1F" font-weight="200">26</text>
            <rect x="12" y="12" width="76" height="2" fill="rgba(255,255,255,0.25)"/>
        </svg>`,

        // AI：彩色光晕星 - Apple Intelligence 设计
        ai: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF2D55', '#BF5AF2', '#5856D6'], { rotate: true })}
            <defs>
                <radialGradient id="${p}-core" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
                    <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
                </radialGradient>
                <radialGradient id="${p}-glow" cx="50%" cy="45%" r="50%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="${p}-petal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.7"/>
                    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.15"/>
                </linearGradient>
                <filter id="${p}-blur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.2"/>
                </filter>
            </defs>
            <circle cx="50" cy="50" r="36" fill="url(#${p}-glow)"/>
            <g transform="translate(50,50)" filter="url(#${p}-blur)">
                ${[0, 60, 120, 180, 240, 300].map((deg, i) =>
                    `<path d="M0,-${18 + i % 2 * 4} C${6 + i % 2 * 2},-${10 + i % 2 * 3} ${8 + i % 2 * 2},-${4 + i % 2} 0,${4 + i % 2 * 2} C-${8 + i % 2 * 2},-${4 + i % 2} -${6 + i % 2 * 2},-${10 + i % 2 * 3} 0,-${18 + i % 2 * 4} Z" fill="url(#${p}-petal)" opacity="${0.55 - i % 2 * 0.12}" transform="rotate(${deg + 15})"/>`
                ).join('')}
            </g>
            <g transform="translate(50,50)">
                ${[0, 72, 144, 216, 288].map((deg, i) =>
                    `<path d="M0,-22 C7,-13 9,-6 0,4 C-9,-6 -7,-13 0,-22 Z" fill="url(#${p}-petal)" opacity="${0.7 - i % 2 * 0.1}" transform="rotate(${deg})"/>`
                ).join('')}
            </g>
            <circle cx="50" cy="50" r="11" fill="url(#${p}-core)"/>
            <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" opacity="0.95"/>
        </svg>`,

        // 照片：白色花形 Liquid Glass 风格（六个彩色花瓣，玻璃质感）
        photos: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFFFFF', '#F2F2F7'])}
            ${IconGenerator.glassEdge(p)}
            <defs>
                <linearGradient id="${p}-petal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.5)"/>
                    <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
                </linearGradient>
            </defs>
            <g transform="translate(50,50)">
                ${[['#FFCC00', -90], ['#FF9500', -30], ['#34C759', 30], ['#5AC8FA', 90], ['#007AFF', 150], ['#AF52DE', 210]].map(([c, deg]) =>
                    `<ellipse cx="0" cy="-16" rx="7" ry="13" fill="${c}" transform="rotate(${deg})" opacity="0.95"/>
                     <ellipse cx="0" cy="-16" rx="6.5" ry="6" fill="url(#${p}-petal)" transform="rotate(${deg})"/>`
                ).join('')}
                <circle r="9" fill="#FFFFFF"/>
                <circle r="9" fill="none" stroke="rgba(0,0,0,0.04)" stroke-width="0.4"/>
                <circle r="3.5" fill="rgba(255,255,255,0.6)"/>
            </g>
        </svg>`,

        // 邮件：白信封 + 蓝色背景
        mail: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5BB8FF', '#0A6BE0'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <rect x="14" y="26" width="72" height="48" rx="9" fill="#FFFFFF"/>
            <rect x="14" y="26" width="72" height="48" rx="9" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <path d="M14,33 Q14,26 21,26 L79,26 Q86,26 86,33 L86,36 L50,60 L14,36 Z" fill="#EAF2FF"/>
            <path d="M14,33 L50,60 L86,33" stroke="#0A84FF" stroke-width="2.2" fill="none" stroke-linejoin="round"/>
            <path d="M14,74 L40,52 M86,74 L60,52" stroke="#C7C7CC" stroke-width="1.4" fill="none"/>
        </svg>`,

        // 信息：绿色对话气泡 + Liquid Glass
        messages: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#46E36B', '#1FAA4C'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <path d="M50,18 C27,18 12,33 12,51 C12,61 17,69 26,76 L22,88 L36,82 C41,84 45,85 50,85 C73,85 88,70 88,51 C88,33 73,18 50,18 Z" fill="#FFFFFF"/>
            <path d="M50,18 C27,18 12,33 12,51 C12,56 13,61 15,65 L12,88 L26,82 C32,84 41,85 50,85 C73,85 88,70 88,51 C88,33 73,18 50,18 Z" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>
            <!-- 顶部玻璃高光 -->
            <path d="M22,30 Q30,22 50,22 Q70,22 78,30 Q70,28 50,28 Q30,28 22,30 Z" fill="rgba(255,255,255,0.5)"/>
            <circle cx="36" cy="51" r="4" fill="#1FAA4C"/>
            <circle cx="50" cy="51" r="4" fill="#1FAA4C"/>
            <circle cx="64" cy="51" r="4" fill="#1FAA4C"/>
        </svg>`,

        // FaceTime: 绿色摄像头
        facetime: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#46E36B', '#1FAA4C'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <rect x="16" y="30" width="50" height="40" rx="10" fill="#FFFFFF"/>
            <rect x="16" y="30" width="50" height="40" rx="10" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <rect x="16" y="30" width="50" height="8" rx="10" fill="rgba(0,0,0,0.05)"/>
            <path d="M66,42 L86,30 L86,70 L66,58 Z" fill="#FFFFFF"/>
            <path d="M66,42 L86,30 L86,38 L66,50 Z" fill="rgba(0,0,0,0.08)"/>
        </svg>`,

        // 音乐：红色渐变 + 白色音符（更接近 macOS Tahoe Music 设计）
        music: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF6B95', '#FA233B'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <!-- 音符旗 -->
            <path d="M44,64 L44,28 L72,22 L72,56" stroke="#FFFFFF" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="44" y="24" width="28" height="5" rx="2" fill="#FFFFFF"/>
            <!-- 音符头 -->
            <ellipse cx="40" cy="66" rx="9" ry="7.5" fill="#FFFFFF"/>
            <ellipse cx="68" cy="58" rx="9" ry="7.5" fill="#FFFFFF"/>
            <ellipse cx="40" cy="66" rx="3.5" ry="2.8" fill="#FA233B"/>
            <ellipse cx="68" cy="58" rx="3.5" ry="2.8" fill="#FA233B"/>
            <!-- 顶部高光 -->
            <path d="M20,12 Q30,8 50,10 Q70,8 80,12 L80,16 Q70,14 50,16 Q30,14 20,16 Z" fill="rgba(255,255,255,0.18)"/>
        </svg>`,

        // App Store: 蓝色 A 字
        appstore: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#3DADFF', '#0A5BCC'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <g stroke="#FFFFFF" stroke-width="3.6" stroke-linecap="round" fill="none">
                <line x1="32" y1="74" x2="50" y2="28"/>
                <line x1="68" y1="74" x2="50" y2="28"/>
                <line x1="28" y1="56" x2="72" y2="56"/>
            </g>
            <circle cx="50" cy="28" r="2.8" fill="#FFFFFF"/>
            <circle cx="32" cy="74" r="2.6" fill="#FFFFFF"/>
            <circle cx="68" cy="74" r="2.6" fill="#FFFFFF"/>
        </svg>`,

        // 计算器 Liquid Glass 风格
        calculator: (p) => {
            const lightKeys = [[22, 44], [37, 44], [52, 44]].map(([gx, gy]) =>
                `<rect x="${gx}" y="${gy}" width="12" height="11" rx="5.5" fill="#A5A5A5"/>`
            ).join('');
            const darkKeys = [[22, 58], [37, 58], [52, 58], [22, 72], [37, 72], [52, 72]].map(([gx, gy]) =>
                `<rect x="${gx}" y="${gy}" width="12" height="11" rx="5.5" fill="#333335"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#3A3A3C', '#1C1C1E'])}
                ${IconGenerator.glassEdge(p)}
                <rect x="18" y="14" width="64" height="72" rx="8" fill="#1C1C1E"/>
                <rect x="18" y="14" width="64" height="72" rx="8" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
                <rect x="22" y="18" width="56" height="20" rx="3" fill="#0A0A0A"/>
                <text x="74" y="33" text-anchor="end" font-family="Menlo, monospace" font-size="14" fill="#FF9F0A" font-weight="300">0</text>
                ${lightKeys}
                ${darkKeys}
                <rect x="67" y="44" width="11" height="39" rx="5.5" fill="#FF9F0A"/>
                <rect x="67" y="44" width="11" height="4" rx="5.5" fill="rgba(255,255,255,0.22)"/>
            </svg>`;
        },

        // 废纸篓
        trash: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#B0B0B5', '#6E6E73'])}
            ${IconGenerator.glassEdge(p)}
            <path d="M30,32 L70,32 L66,80 Q66,84 60,84 L40,84 Q34,84 34,80 Z" fill="#FFFFFF"/>
            <path d="M30,32 L70,32 L66,80 Q66,84 60,84 L40,84 Q34,84 34,80 Z" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <path d="M34,32 L66,32 L64,40 L36,40 Z" fill="rgba(0,0,0,0.06)"/>
            <rect x="38" y="22" width="24" height="8" rx="2.5" fill="#6E6E73"/>
            <rect x="38" y="22" width="24" height="3" rx="2.5" fill="rgba(255,255,255,0.35)"/>
            <line x1="44" y1="44" x2="44" y2="78" stroke="#B0B0B5" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="44" x2="50" y2="78" stroke="#B0B0B5" stroke-width="2" stroke-linecap="round"/>
            <line x1="56" y1="44" x2="56" y2="78" stroke="#B0B0B5" stroke-width="2" stroke-linecap="round"/>
        </svg>`,

        // 文件夹 Liquid Glass
        folder: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="${p}-fbg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#7AD0FF"/>
                    <stop offset="100%" stop-color="#0A84FF"/>
                </linearGradient>
                <linearGradient id="${p}-fhi" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.32"/>
                    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
                </linearGradient>
                <filter id="${p}-fsh" x="-25%" y="-25%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.32"/>
                </filter>
            </defs>
            <path d="M6,24 Q6,14 16,14 L36,14 Q42,14 46,20 L46,26 L86,26 Q94,26 94,34 L94,80 Q94,86 88,86 L12,86 Q6,86 6,80 Z" fill="url(#${p}-fbg)" filter="url(#${p}-fsh)"/>
            <path d="M6,24 Q6,14 16,14 L36,14 Q42,14 46,20 L46,26 L6,26 Z" fill="url(#${p}-fhi)"/>
            <rect x="6" y="26" width="88" height="3" fill="rgba(255,255,255,0.4)"/>
            <path d="M6,24 Q6,14 16,14 L36,14 Q42,14 46,20 L46,26 L86,26 Q94,26 94,34 L94,80 Q94,86 88,86 L12,86 Q6,86 6,80 Z" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.6"/>
        </svg>`,

        // 时钟：黑色 + 橙色秒针
        clock: (p) => {
            const ticks = [...Array(12)].map((_, i) => {
                const major = i % 3 === 0;
                const h = major ? 5 : 3;
                return `<rect x="49.4" y="18" width="1.2" height="${h}" rx="0.4" fill="#8E8E93" transform="rotate(${i * 30} 50 50)"/>`;
            }).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#1D1D1F', '#000000'])}
                ${IconGenerator.glassEdge(p)}
                <circle cx="50" cy="50" r="35" fill="#000000"/>
                <circle cx="50" cy="50" r="35" fill="none" stroke="#FF9500" stroke-width="1.5"/>
                <circle cx="50" cy="50" r="31" fill="none" stroke="#2C2C2E" stroke-width="0.5"/>
                ${ticks}
                <rect x="48.7" y="50" width="2.8" height="22" rx="1.4" fill="#FFFFFF" transform="rotate(-30 50 50)"/>
                <rect x="49" y="50" width="2.2" height="27" rx="1.1" fill="#FFFFFF" transform="rotate(60 50 50)"/>
                <rect x="49.5" y="27" width="1.3" height="25" rx="0.65" fill="#FF9500" transform="rotate(120 50 50)"/>
                <circle cx="50" cy="50" r="3.2" fill="#FF9500"/>
                <circle cx="50" cy="50" r="1.5" fill="#000000"/>
            </svg>`;
        },

        // 天气：蓝底 + 太阳云朵
        weather: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5BB8FF', '#0A6BE0'])}
            ${IconGenerator.glassEdge(p)}
            <circle cx="64" cy="32" r="14" fill="#FFD60A"/>
            <circle cx="64" cy="32" r="14" fill="rgba(255,255,255,0.2)"/>
            <path d="M26,60 Q19,54 23,46 Q29,38 39,43 Q47,35 58,43 Q68,41 70,53 Q76,57 71,65 Q67,71 60,69 L30,69 Q20,69 26,60 Z" fill="#FFFFFF"/>
            <line x1="36" y1="74" x2="34" y2="82" stroke="#5AC8FA" stroke-width="2.6" stroke-linecap="round"/>
            <line x1="50" y1="74" x2="48" y2="82" stroke="#5AC8FA" stroke-width="2.6" stroke-linecap="round"/>
            <line x1="64" y1="74" x2="62" y2="82" stroke="#5AC8FA" stroke-width="2.6" stroke-linecap="round"/>
        </svg>`,

        // 提醒事项：白底 + 橙色闹钟
        reminders: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFC04D', '#FF9500'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <circle cx="50" cy="52" r="26" fill="#FFFFFF" opacity="0.96"/>
            <circle cx="50" cy="52" r="26" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="0.5"/>
            <circle cx="50" cy="52" r="20" fill="none" stroke="#FF9500" stroke-width="3"/>
            <path d="M50,40 L50,52 L58,57" stroke="#FF9500" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="34" y1="32" x2="42" y2="38" stroke="#FF9500" stroke-width="3" stroke-linecap="round"/>
            <line x1="66" y1="32" x2="58" y2="38" stroke="#FF9500" stroke-width="3" stroke-linecap="round"/>
            <circle cx="50" cy="52" r="2.6" fill="#FF9500"/>
        </svg>`,

        // 字典
        dictionary: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#A1A1A8', '#48484C'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="24" y="14" width="52" height="72" rx="4" fill="#FFD60A"/>
            <rect x="24" y="14" width="52" height="72" rx="4" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <rect x="24" y="14" width="6" height="72" fill="#E0B400"/>
            <rect x="30" y="18" width="44" height="64" rx="2" fill="#FFFFFF"/>
            <text x="52" y="46" text-anchor="middle" font-family="Songti SC, serif" font-size="24" fill="#1D1D1F" font-weight="700">字</text>
            <text x="52" y="58" text-anchor="middle" font-family="Songti SC, serif" font-size="7" fill="#8E8E93" font-weight="500">DICTIONARY</text>
            <rect x="34" y="64" width="36" height="1.4" fill="#D1D1D6"/>
            <rect x="38" y="70" width="28" height="1.4" fill="#D1D1D6"/>
            <rect x="34" y="76" width="36" height="1.4" fill="#D1D1D6"/>
        </svg>`,

        // 通讯录：橙色边 + 蓝色人像
        contacts: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#B0B0B5', '#6E6E73'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="20" y="14" width="60" height="72" rx="6" fill="#FFFFFF"/>
            <rect x="20" y="14" width="60" height="72" rx="6" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <path d="M20,20 Q20,14 26,14 L30,14 L30,86 L26,86 Q20,86 20,80 Z" fill="#FF9500"/>
            <circle cx="54" cy="36" r="9" fill="#007AFF"/>
            <path d="M54,48 Q64,48 68,55 L68,62 L40,62 L40,55 Q44,48 54,48 Z" fill="#007AFF"/>
            <rect x="66" y="32" width="8" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="66" y="38" width="8" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="66" y="44" width="8" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="66" y="50" width="8" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="66" y="56" width="8" height="2" rx="1" fill="#C7C7CC"/>
        </svg>`,

        // 地图：彩色地图 + 红色大头针（更接近 Tahoe 实际设计）
        maps: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5AC8FA', '#34C759'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <!-- 地图块（折叠效果） -->
            <path d="M14,28 L38,22 L62,28 L86,22 L86,72 L62,78 L38,72 L14,78 Z" fill="#C8E6C9"/>
            <path d="M14,52 Q40,44 62,52 Q78,58 86,50 L86,72 L62,78 L38,72 L14,78 Z" fill="#B3E5FC"/>
            <path d="M14,28 L38,22 L38,72 L14,78 Z" fill="rgba(0,0,0,0.04)"/>
            <!-- 路线 -->
            <path d="M18,64 L46,46 L70,58 L82,46" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
            <!-- 大头针 -->
            <path d="M50,28 C42,28 38,34 38,40 C38,50 50,62 50,62 C50,62 62,50 62,40 C62,34 58,28 50,28 Z" fill="#FF3B30"/>
            <path d="M50,28 C42,28 38,34 38,40 C38,44 39,47 41,50 C44,46 50,32 50,32 C50,32 56,46 59,50 C61,47 62,44 62,40 C62,34 58,28 50,28 Z" fill="#FF6259"/>
            <circle cx="50" cy="40" r="3.6" fill="#FFFFFF"/>
        </svg>`,

        // 语音备忘录
        voice: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#3A3A3C', '#1D1D1F'])}
            ${IconGenerator.glassEdge(p)}
            <path d="M26,46 Q26,64 50,64 Q74,64 74,46" stroke="#FF3B30" stroke-width="3.4" fill="none" stroke-linecap="round"/>
            <rect x="44" y="20" width="12" height="40" rx="6" fill="#FF3B30"/>
            <rect x="44" y="20" width="12" height="9" rx="6" fill="#FF6B6B"/>
            <rect x="48" y="64" width="4" height="14" fill="#FF3B30"/>
            <rect x="38" y="78" width="24" height="4" rx="2" fill="#FF3B30"/>
            <path d="M20,42 Q20,22 44,18" stroke="#FF6B6B" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
            <path d="M80,42 Q80,22 56,18" stroke="#FF6B6B" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
        </svg>`,

        // 活动监视器
        activity: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFB340', '#FF3B30'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <g transform="rotate(-90 50 50)" fill="none" stroke-linecap="round">
                <circle cx="50" cy="50" r="28" stroke="rgba(255,255,255,0.18)" stroke-width="6"/>
                <circle cx="50" cy="50" r="28" stroke="#30D158" stroke-width="6" stroke-dasharray="125 175"/>
                <circle cx="50" cy="50" r="21" stroke="rgba(255,255,255,0.18)" stroke-width="6"/>
                <circle cx="50" cy="50" r="21" stroke="#5AC8FA" stroke-width="6" stroke-dasharray="98 130"/>
                <circle cx="50" cy="50" r="14" stroke="rgba(255,255,255,0.18)" stroke-width="6"/>
                <circle cx="50" cy="50" r="14" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="62 86"/>
            </g>
        </svg>`,

        // QuickTime
        quicktime: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#2C2C2E', '#000000'])}
            ${IconGenerator.glassEdge(p)}
            <circle cx="50" cy="50" r="32" fill="#000000"/>
            <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="0.6"/>
            <path d="M50,16 A34 34 0 0 1 84,50" stroke="rgba(255,255,255,0.22)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="23" fill="#FFFFFF" opacity="0.08"/>
            <polygon points="42,36 42,64 66,50" fill="#FFFFFF"/>
        </svg>`,

        // 预览：白底 + 橙色圆 + 绿色山形
        preview: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#7B79D8', '#3634A3'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="14" y="20" width="72" height="60" rx="6" fill="#FFFFFF"/>
            <rect x="14" y="20" width="72" height="60" rx="6" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <rect x="14" y="20" width="72" height="9" rx="6" fill="#F2F2F7"/>
            <circle cx="22" cy="24.5" r="1.2" fill="#FF5F57"/>
            <circle cx="27" cy="24.5" r="1.2" fill="#FEBC2E"/>
            <circle cx="32" cy="24.5" r="1.2" fill="#28C840"/>
            <circle cx="30" cy="42" r="7" fill="#FF9500"/>
            <path d="M14,80 L32,52 L44,64 L60,46 L74,60 L86,50 L86,80 Z" fill="#34C759"/>
            <path d="M14,80 L32,52 L44,64 L60,46 L74,60 L86,50 L86,58 L60,52 L44,70 L32,60 L14,84 Z" fill="#2EA64A" opacity="0.6"/>
        </svg>`,

        // 新闻
        news: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF6B6B', '#FF3B30'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <rect x="18" y="16" width="64" height="68" rx="4" fill="#FFFFFF"/>
            <rect x="18" y="16" width="64" height="68" rx="4" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <text x="50" y="48" text-anchor="middle" font-family="Georgia, serif" font-size="32" fill="#FF3B30" font-weight="700" font-style="italic">N</text>
            <rect x="24" y="56" width="52" height="2" rx="1" fill="#D1D1D6"/>
            <rect x="24" y="62" width="44" height="2" rx="1" fill="#D1D1D6"/>
            <rect x="24" y="68" width="48" height="2" rx="1" fill="#D1D1D6"/>
            <rect x="24" y="74" width="38" height="2" rx="1" fill="#D1D1D6"/>
        </svg>`,

        // 股票
        stocks: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#1D1D1F', '#000000'])}
            ${IconGenerator.glassEdge(p)}
            <defs>
                <linearGradient id="${p}-area" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#30D158" stop-opacity="0.45"/>
                    <stop offset="100%" stop-color="#30D158" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <polygon points="12,72 26,56 40,60 56,34 70,46 88,22 88,80 12,80" fill="url(#${p}-area)"/>
            <polyline points="12,72 26,56 40,60 56,34 70,46 88,22" stroke="#30D158" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="88" cy="22" r="3.4" fill="#30D158"/>
            <text x="50" y="94" text-anchor="middle" font-family="Menlo, monospace" font-size="9" fill="#30D158" font-weight="600">+2.45%</text>
        </svg>`,

        // 家庭
        home: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFB340', '#FF3B30'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <path d="M50,20 L80,48 L80,82 L62,82 L62,62 L38,62 L38,82 L20,82 L20,48 Z" fill="#FFFFFF"/>
            <path d="M50,20 L80,48 L74,48 L50,26 L26,48 L20,48 Z" fill="rgba(255,255,255,0.4)"/>
            <rect x="44" y="66" width="12" height="16" fill="#FF9500" opacity="0.4"/>
        </svg>`,

        // 电视
        tv: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#2C2C2E', '#000000'])}
            ${IconGenerator.glassEdge(p)}
            <text x="50" y="64" text-anchor="middle" font-family="PingFang SC, sans-serif" font-size="28" fill="#FFFFFF" font-weight="500" letter-spacing="-2">tv</text>
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.6"/>
        </svg>`,

        // 播客
        podcasts: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#C56DEF', '#9B4DCA'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <circle cx="50" cy="34" r="8" fill="#FFFFFF"/>
            <path d="M50,44 Q60,44 60,58 L40,58 Q40,44 50,44 Z" fill="#FFFFFF"/>
            <path d="M30,48 Q30,34 44,28" stroke="#FFFFFF" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.78"/>
            <path d="M70,48 Q70,34 56,28" stroke="#FFFFFF" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.78"/>
            <path d="M20,56 Q20,30 44,20" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.42"/>
            <path d="M80,56 Q80,30 56,20" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.42"/>
            <circle cx="50" cy="68" r="3.4" fill="#FFFFFF"/>
            <rect x="48.5" y="60" width="3" height="10" fill="#FFFFFF"/>
        </svg>`,

        // 图书
        books: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFB13B', '#FF9500'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <path d="M50,24 Q40,20 28,22 L28,78 Q40,76 50,80 Z" fill="#FFFFFF"/>
            <path d="M50,24 Q60,20 72,22 L72,78 Q60,76 50,80 Z" fill="#FFFFFF"/>
            <path d="M50,24 Q40,20 28,22 L28,28 Q40,26 50,30 Z" fill="rgba(0,0,0,0.06)"/>
            <path d="M50,24 Q60,20 72,22 L72,28 Q60,26 50,30 Z" fill="rgba(0,0,0,0.06)"/>
            <line x1="50" y1="24" x2="50" y2="80" stroke="#D1D1D6" stroke-width="0.6"/>
        </svg>`,

        // Numbers
        numbers: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#46E36B', '#1FAA4C'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <rect x="18" y="20" width="64" height="60" rx="6" fill="#FFFFFF"/>
            <rect x="18" y="20" width="64" height="60" rx="6" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <path d="M18,26 Q18,20 24,20 L76,20 Q82,20 82,26 L82,30 L18,30 Z" fill="rgba(52,199,89,0.18)"/>
            <rect x="22" y="34" width="14" height="24" rx="2" fill="#34C759"/>
            <rect x="38" y="40" width="14" height="18" rx="2" fill="#5AC8FA"/>
            <rect x="54" y="36" width="14" height="22" rx="2" fill="#FF9500"/>
            <rect x="22" y="62" width="46" height="14" rx="2" fill="#F2F2F7"/>
            <text x="45" y="73" text-anchor="middle" font-family="Menlo, monospace" font-size="9" fill="#1FAA4C" font-weight="600">=SUM</text>
        </svg>`,

        // Pages
        pages: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5BB8FF', '#0A6BE0'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <rect x="22" y="14" width="50" height="72" rx="4" fill="#FFFFFF"/>
            <rect x="22" y="14" width="50" height="72" rx="4" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <path d="M22,18 Q22,14 26,14 L68,14 L68,20 L22,20 Z" fill="#EAF2FF"/>
            <rect x="28" y="30" width="24" height="6" rx="1" fill="#0A6BE0"/>
            <rect x="28" y="42" width="40" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="28" y="48" width="34" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="28" y="54" width="38" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="28" y="60" width="30" height="2" rx="1" fill="#C7C7CC"/>
            <g transform="rotate(45 70 60)">
                <rect x="64" y="40" width="8" height="32" rx="1.5" fill="#FF9F0A"/>
                <rect x="64" y="40" width="8" height="6" rx="1.5" fill="#FF5E3A"/>
                <path d="M64,72 L68,80 L72,72 Z" fill="#1D1D1F"/>
            </g>
        </svg>`,

        // Keynote
        keynote: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#7B79D8', '#3634A3'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <rect x="16" y="22" width="68" height="42" rx="4" fill="#FFFFFF"/>
            <rect x="16" y="22" width="68" height="42" rx="4" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <path d="M16,26 Q16,22 20,22 L80,22 Q84,22 84,26 L84,30 L16,30 Z" fill="#5856D6"/>
            <rect x="46" y="64" width="8" height="10" fill="#8E8E93"/>
            <rect x="30" y="74" width="40" height="3" rx="1.5" fill="#8E8E93"/>
            <rect x="26" y="38" width="8" height="20" rx="1.5" fill="#FF3B30"/>
            <rect x="38" y="44" width="8" height="14" rx="1.5" fill="#FF9500"/>
            <rect x="50" y="36" width="8" height="22" rx="1.5" fill="#34C759"/>
            <rect x="62" y="42" width="8" height="16" rx="1.5" fill="#5AC8FA"/>
        </svg>`,

        // GarageBand
        garageband: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF6B6B', '#FA233B'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <rect x="14" y="20" width="72" height="60" rx="6" fill="#FFFFFF"/>
            <rect x="14" y="20" width="72" height="60" rx="6" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <rect x="14" y="20" width="72" height="14" rx="6" fill="#FF3B30"/>
            <rect x="14" y="32" width="72" height="2" fill="#D12A2A"/>
            <path d="M22,46 L78,46 M22,54 L78,54 M22,62 L78,62 M22,70 L78,70" stroke="#C7C7CC" stroke-width="0.8"/>
            <circle cx="50" cy="58" r="6" fill="#FF3B30"/>
        </svg>`,

        // iMovie
        imovie: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#9C5BD8', '#5E2D8A'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="14" y="14" width="72" height="56" rx="4" fill="#1C1C1E"/>
            <polygon points="44,30 44,54 64,42" fill="#FFFFFF"/>
            <rect x="14" y="70" width="72" height="16" rx="3" fill="#FFFFFF"/>
            <rect x="14" y="70" width="72" height="3" fill="#E5E5EA"/>
            <rect x="20" y="78" width="14" height="6" rx="1" fill="#9C5BD8"/>
            <rect x="38" y="76" width="20" height="8" rx="1" fill="#5AC8FA"/>
            <rect x="62" y="78" width="14" height="6" rx="1" fill="#FF9500"/>
        </svg>`,

        // 便签
        stickies: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFE680', '#FFCC00'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="20" y="16" width="60" height="68" rx="3" fill="#FFF3A0"/>
            <rect x="20" y="16" width="60" height="68" rx="3" fill="none" stroke="#D4A017" stroke-width="0.4"/>
            <path d="M20,16 L80,16 L80,22 L20,22 Z" fill="#FFE066"/>
            <path d="M70,16 L80,16 L80,26 Z" fill="#FFCC00"/>
            ${[30, 38, 46, 54, 62, 70].map((yy, i) => {
                const widths = [40, 46, 32, 44, 36, 28];
                return `<rect x="26" y="${yy}" width="${widths[i]}" height="2.4" rx="1" fill="#C9A227" opacity="0.6"/>`;
            }).join('')}
        </svg>`,

        // 国际象棋
        chess: (p) => {
            const board = [...Array(4)].map((_, r) =>
                [...Array(4)].map((_, c) => {
                    const dark = (r + c) % 2 === 0;
                    return `<rect x="${12 + c * 19}" y="${12 + r * 19}" width="19" height="19" fill="${dark ? '#B5651D' : '#F5DEB3'}"/>`;
                }).join('')
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#E8C89A', '#C79A5B'])}
                ${IconGenerator.glassEdge(p)}
                ${board}
                <rect x="12" y="12" width="76" height="76" fill="none" stroke="#8B5A2B" stroke-width="1"/>
                <path d="M50,30 Q44,30 44,36 Q44,40 47,42 L47,52 L43,52 L43,56 L57,56 L57,52 L53,52 L53,42 Q56,40 56,36 Q56,30 50,30 Z" fill="#1D1D1F"/>
                <rect x="42" y="56" width="16" height="3" fill="#1D1D1F"/>
                <rect x="40" y="59" width="20" height="4" rx="1" fill="#1D1D1F"/>
                <circle cx="47" cy="36" r="1" fill="#FFFFFF" opacity="0.5"/>
            </svg>`;
        },

        // 字体簿
        fontbook: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF5E6C', '#E11D48'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <text x="50" y="64" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="#FFFFFF" font-weight="700" font-style="italic">Aa</text>
            <rect x="22" y="74" width="56" height="1.6" fill="rgba(255,255,255,0.5)"/>
        </svg>`,

        // 图像捕捉
        imagecapture: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5AC8FA', '#34C759'], { rotate: true })}
            ${IconGenerator.glassEdge(p)}
            <rect x="14" y="28" width="72" height="44" rx="6" fill="#FFFFFF"/>
            <rect x="14" y="28" width="72" height="9" rx="6" fill="#E5E5EA"/>
            <rect x="38" y="24" width="24" height="6" rx="2" fill="#FFFFFF"/>
            <circle cx="50" cy="50" r="14" fill="#1D1D1F"/>
            <circle cx="50" cy="50" r="11" fill="#5AC8FA"/>
            <circle cx="50" cy="50" r="7" fill="#1D1D1F"/>
            <circle cx="46" cy="46" r="2.4" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="74" cy="36" r="2" fill="#FF3B30"/>
        </svg>`,

        // 钥匙串
        keychain: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5BB8FF', '#0A6BE0'])}
            ${IconGenerator.glassEdge(p)}
            <circle cx="40" cy="48" r="22" fill="none" stroke="#FFFFFF" stroke-width="6"/>
            <rect x="58" y="44" width="28" height="8" rx="2.5" fill="#FFFFFF"/>
            <rect x="78" y="52" width="4.5" height="13" rx="1.5" fill="#FFFFFF"/>
            <rect x="71" y="52" width="4.5" height="9" rx="1.5" fill="#FFFFFF"/>
            <circle cx="40" cy="48" r="6" fill="#0A6BE0"/>
            <circle cx="40" cy="48" r="6" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="0.6"/>
        </svg>`,

        // 迁移助理
        migration: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#A1A1A8', '#6E6E73'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="16" y="28" width="28" height="44" rx="4" fill="#FFFFFF"/>
            <rect x="16" y="28" width="28" height="44" rx="4" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.5"/>
            <rect x="16" y="28" width="28" height="7" rx="4" fill="#E5E5EA"/>
            <circle cx="30" cy="46" r="1.6" fill="#1D1D1F"/>
            <rect x="22" y="52" width="16" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="22" y="58" width="16" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="22" y="64" width="16" height="2" rx="1" fill="#C7C7CC"/>
            <path d="M48,50 L68,50 M62,44 L68,50 L62,56" stroke="#34C759" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="70" y="28" width="14" height="44" rx="3" fill="#FFFFFF" opacity="0.55"/>
            <rect x="70" y="28" width="14" height="6" rx="3" fill="#E5E5EA" opacity="0.6"/>
        </svg>`,

        // 系统信息
        sysinfo: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#636366', '#3A3A3C'])}
            ${IconGenerator.glassEdge(p)}
            <rect x="22" y="20" width="56" height="42" rx="4" fill="#0A0A0A"/>
            <rect x="26" y="24" width="48" height="34" rx="2" fill="#1C1C1E"/>
            <rect x="30" y="28" width="22" height="3" rx="1" fill="#30D158"/>
            <rect x="30" y="34" width="34" height="2" rx="1" fill="#5AC8FA"/>
            <rect x="30" y="40" width="28" height="2" rx="1" fill="#FF9500"/>
            <rect x="30" y="46" width="38" height="2" rx="1" fill="#FF3B30"/>
            <rect x="30" y="52" width="24" height="2" rx="1" fill="#BF5AF2"/>
            <rect x="34" y="64" width="32" height="3" rx="1.5" fill="#2C2C2E"/>
            <rect x="44" y="62" width="12" height="4" rx="1" fill="#2C2C2E"/>
            <circle cx="32" cy="72" r="2" fill="#30D158"/>
            <rect x="40" y="70" width="30" height="4" rx="1" fill="#3A3A3C"/>
        </svg>`,

        trash_filled: (p) => IconGenerator.icons.trash(p),

        default: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#A1A1A8', '#6E6E73'])}
            ${IconGenerator.glassEdge(p)}
            <text x="50" y="68" text-anchor="middle" font-family="PingFang SC, sans-serif" font-size="46" fill="#FFFFFF" opacity="0.92">?</text>
        </svg>`
    };
}
