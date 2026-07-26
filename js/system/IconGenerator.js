/**
 * macOS 风格精致图标生成器
 * 统一 squircle 背景（rx=22）+ 精细渐变 + 顶部高光层 + 内边框 + 阴影
 * 所有图标使用 100x100 viewBox，渐变 ID 全局唯一（每次调用生成独立前缀）。
 * 颜色使用 #RRGGBB；高光/阴影使用 rgba()。引用渐变统一使用 url(#id)。
 */
class IconGenerator {
    static _seq = 0;

    static _prefix() {
        IconGenerator._seq = (IconGenerator._seq + 1) % 1000000;
        return 'ic' + IconGenerator._seq;
    }

    /**
     * 生成图标 SVG。
     * @param {string} name 图标名称
     * @param {{emoji?:string, bgColor?:string}} options emoji 与 bgColor（emoji 图标用）
     */
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
     * emoji 图标包装器：squircle 背景 + emoji 文字。
     */
    static wrap(emoji, bgColor) {
        const bg = bgColor || '#007AFF';
        const p = IconGenerator._prefix();
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, [bg, bg])}
            <text x="50" y="71" text-anchor="middle" font-family="apple color emoji, segoe ui emoji, sans-serif" font-size="50">${emoji}</text>
        </svg>`;
    }

    /**
     * squircle 圆角矩形背景（macOS 标志性造型）
     * 含：精细渐变背景 + 顶部高光层（rgba 0.22→0）+ 内边框（rgba 0.10）+ 阴影
     * @param {string} p 唯一前缀
     * @param {string[]|string} stops 渐变色标
     * @param {{rotate?:boolean, x?:number, y?:number, w?:number, h?:number, r?:number}} opts
     */
    static squircle(p, stops, opts = {}) {
        const { rotate = false, x = 5, y = 5, w = 90, h = 90, r = 22 } = opts;
        const arr = Array.isArray(stops) ? stops : [stops, stops];
        const x2 = rotate ? '100%' : '0%';
        const y2 = '100%';
        const stopsXml = arr.map((c, i) =>
            `<stop offset="${(i / Math.max(1, arr.length - 1) * 100).toFixed(0)}%" stop-color="${c}"/>`
        ).join('');
        const cx2 = x + w;
        const cy2 = y + h;
        // 顶部高光路径：上方圆角（与 squircle 同半径），下方平直
        const hi = `M${x},${y + r} Q${x},${y} ${x + r},${y} L${cx2 - r},${y} Q${cx2},${y} ${cx2},${y + r} L${cx2},${y + h * 0.46} L${x},${y + h * 0.46} Z`;
        return `<defs>
            <linearGradient id="${p}-bg" x1="0%" y1="0%" x2="${x2}" y2="${y2}">${stopsXml}</linearGradient>
            <linearGradient id="${p}-hi" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.22"/>
                <stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.06"/>
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
            </linearGradient>
            <filter id="${p}-sh" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.28"/>
            </filter>
        </defs>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#${p}-bg)" filter="url(#${p}-sh)"/>
        <path d="${hi}" fill="url(#${p}-hi)"/>
        <rect x="${x + 0.4}" y="${y + 0.4}" width="${w - 0.8}" height="${h - 0.8}" rx="${r - 0.4}" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="0.6"/>`;
    }

    static icons = {
        finder: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5AC8FA', '#0A84FF'], { rotate: true })}
            <path d="M20,32 Q20,22 30,22 L50,22 L50,78 L30,78 Q20,78 20,68 Z" fill="#FFFFFF"/>
            <path d="M50,22 L70,22 Q80,22 80,32 L80,68 Q80,78 70,78 L50,78 Z" fill="#D7ECFF"/>
            <line x1="50" y1="22" x2="50" y2="78" stroke="#B6D9FF" stroke-width="0.6"/>
            <ellipse cx="40" cy="44" rx="2.4" ry="4.2" fill="#1D1D1F"/>
            <ellipse cx="60" cy="44" rx="2.4" ry="4.2" fill="#1D1D1F"/>
            <path d="M38,58 Q50,70 62,58" stroke="#1D1D1F" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        </svg>`,

        settings: (p) => {
            const teeth = [...Array(8)].map((_, i) =>
                `<rect x="46.5" y="18.5" width="7" height="12" rx="1.6" fill="#FFFFFF" transform="rotate(${i * 45} 50 50)"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#A1A1A8', '#48484C'])}
                <g filter="url(#${p}-sh)">
                    ${teeth}
                    <circle cx="50" cy="50" r="20.5" fill="#FFFFFF"/>
                </g>
                <circle cx="50" cy="50" r="20.5" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/>
                <circle cx="50" cy="50" r="8.5" fill="#54545A"/>
                <circle cx="50" cy="50" r="8.5" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="0.5"/>
            </svg>`;
        },

        safari: (p) => {
            const ticks = [...Array(12)].map((_, i) => {
                const major = i % 3 === 0;
                const h = major ? 5 : 3;
                return `<rect x="49.4" y="19.5" width="1.2" height="${h}" rx="0.4" fill="#8E8E93" transform="rotate(${i * 30} 50 50)"/>`;
            }).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#1FA2FF', '#0A4D9E'], { rotate: true })}
                <circle cx="50" cy="50" r="32" fill="#FFFFFF"/>
                <circle cx="50" cy="50" r="32" fill="none" stroke="#C7C7CC" stroke-width="0.6"/>
                ${ticks}
                <path d="M50,50 L62,31 L55,45 Z" fill="#FF3B30"/>
                <path d="M50,50 L38,69 L45,55 Z" fill="#E5E5EA"/>
                <path d="M50,50 L62,31 L55,45 Z" fill="none" stroke="#B0B0B5" stroke-width="0.4"/>
                <path d="M50,50 L38,69 L45,55 Z" fill="none" stroke="#B0B0B5" stroke-width="0.4"/>
                <circle cx="50" cy="50" r="2.4" fill="#1D1D1F"/>
            </svg>`;
        },

        terminal: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#4A4A4D', '#1D1D1F'])}
            <rect x="14" y="22" width="72" height="56" rx="7" fill="#0E0E10"/>
            <path d="M14,29 Q14,22 21,22 L79,22 Q86,22 86,29 L86,34 L14,34 Z" fill="#2C2C2E"/>
            <line x1="14" y1="34" x2="86" y2="34" stroke="rgba(0,0,0,0.4)" stroke-width="0.6"/>
            <circle cx="22" cy="28" r="2.4" fill="#FF5F57"/>
            <circle cx="31" cy="28" r="2.4" fill="#FEBC2E"/>
            <circle cx="40" cy="28" r="2.4" fill="#28C840"/>
            <path d="M22,46 L28,50 L22,54" stroke="#30D158" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="32" y="48.5" width="22" height="2.6" rx="1" fill="#E5E5EA"/>
            <rect x="32" y="56" width="14" height="2.2" rx="1" fill="#8E8E93"/>
            <rect x="22" y="64" width="6" height="2.2" rx="1" fill="#E5E5EA"/>
        </svg>`,

        notes: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFE680', '#FFC400'])}
            <rect x="20" y="20" width="60" height="60" rx="6" fill="#FFFFFF"/>
            <path d="M20,26 Q20,20 26,20 L74,20 Q80,20 80,26 L80,30 L20,30 Z" fill="#FFD60A"/>
            <rect x="20" y="29.5" width="60" height="1" fill="#E0B400"/>
            ${[38, 46, 54, 62, 70].map((yy, i) => {
                const widths = [46, 38, 44, 36, 30];
                return `<rect x="26" y="${yy}" width="${widths[i]}" height="1.8" rx="0.9" fill="#D4A017" opacity="0.55"/>`;
            }).join('')}
            <rect x="20" y="74" width="60" height="6" rx="6" fill="#FFF3A0" opacity="0.5"/>
        </svg>`,

        textedit: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#A8E6A1', '#2ECC71'], { rotate: true })}
            <rect x="22" y="16" width="46" height="68" rx="4" fill="#FFFFFF"/>
            <path d="M22,20 Q22,16 26,16 L64,16 L64,22 L22,22 Z" fill="#EAF6EA"/>
            <rect x="28" y="30" width="26" height="2.6" rx="1" fill="#1D1D1F"/>
            <rect x="28" y="38" width="34" height="1.8" rx="0.9" fill="#C7C7CC"/>
            <rect x="28" y="44" width="30" height="1.8" rx="0.9" fill="#C7C7CC"/>
            <rect x="28" y="50" width="34" height="1.8" rx="0.9" fill="#C7C7CC"/>
            <rect x="28" y="56" width="26" height="1.8" rx="0.9" fill="#C7C7CC"/>
            <g transform="rotate(45 66 50)">
                <rect x="60" y="30" width="8" height="34" rx="1.5" fill="#FF9F0A"/>
                <rect x="60" y="30" width="8" height="6" rx="1.5" fill="#FF5E3A"/>
                <path d="M60,64 L64,72 L68,64 Z" fill="#1D1D1F"/>
                <rect x="60" y="36" width="8" height="2" fill="rgba(0,0,0,0.12)"/>
            </g>
        </svg>`,

        calendar: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFFFFF', '#F2F2F7'])}
            <rect x="14" y="14" width="72" height="72" rx="6" fill="#FFFFFF" stroke="#E5E5EA" stroke-width="0.5"/>
            <path d="M14,20 Q14,14 20,14 L80,14 Q86,14 86,20 L86,30 L14,30 Z" fill="#FF3B30"/>
            <text x="50" y="26" text-anchor="middle" font-family="PingFang SC, sans-serif" font-size="11" fill="#FFFFFF" font-weight="600">七月</text>
            <text x="50" y="68" text-anchor="middle" font-family="PingFang SC, sans-serif" font-size="36" fill="#1D1D1F" font-weight="200">17</text>
            <rect x="14" y="14" width="72" height="2" fill="rgba(255,255,255,0.25)"/>
        </svg>`,

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
            <circle cx="50" cy="50" r="34" fill="url(#${p}-glow)"/>
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
            <circle cx="50" cy="50" r="10" fill="url(#${p}-core)"/>
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" opacity="0.95"/>
        </svg>`,

        photos: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFFFFF', '#F2F2F7'])}
            <g transform="translate(50,50)">
                ${[['#FFCC00', -90], ['#FF9500', -30], ['#34C759', 30], ['#5AC8FA', 90], ['#007AFF', 150], ['#AF52DE', 210]].map(([c, deg]) =>
                    `<ellipse cx="0" cy="-16" rx="7" ry="13" fill="${c}" transform="rotate(${deg})" opacity="0.92"/>`
                ).join('')}
                <circle r="8" fill="#FFFFFF"/>
                <circle r="3.5" fill="rgba(255,255,255,0.6)"/>
            </g>
        </svg>`,

        mail: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#4DA6FF', '#0062CC'], { rotate: true })}
            <rect x="16" y="28" width="68" height="44" rx="8" fill="#FFFFFF"/>
            <path d="M16,34 Q16,28 22,28 L78,28 Q84,28 84,34 L84,36 L50,58 L16,36 Z" fill="#EAF2FF"/>
            <path d="M16,34 L50,58 L84,34" stroke="#0A84FF" stroke-width="2" fill="none" stroke-linejoin="round"/>
            <path d="M16,72 L40,52 M84,72 L60,52" stroke="#C7C7CC" stroke-width="1.2" fill="none"/>
        </svg>`,

        messages: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#34D05B', '#1FAA4C'], { rotate: true })}
            <path d="M50,20 C29,20 15,34 15,51 C15,61 20,69 28,75 L24,86 L37,80 C42,82 46,83 50,83 C71,83 85,69 85,51 C85,34 71,20 50,20 Z" fill="#FFFFFF"/>
            <circle cx="38" cy="51" r="3.6" fill="#1FAA4C"/>
            <circle cx="50" cy="51" r="3.6" fill="#1FAA4C"/>
            <circle cx="62" cy="51" r="3.6" fill="#1FAA4C"/>
        </svg>`,

        facetime: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#34D05B', '#1FAA4C'], { rotate: true })}
            <rect x="18" y="30" width="48" height="40" rx="10" fill="#FFFFFF"/>
            <rect x="18" y="30" width="48" height="8" rx="10" fill="rgba(0,0,0,0.05)"/>
            <path d="M66,42 L84,32 L84,68 L66,58 Z" fill="#FFFFFF"/>
            <path d="M66,42 L84,32 L84,38 L66,48 Z" fill="rgba(0,0,0,0.08)"/>
        </svg>`,

        music: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF6B6B', '#FA233B'], { rotate: true })}
            <path d="M40,68 L40,34 L70,28 L70,58" stroke="#FFFFFF" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="40" y="30" width="30" height="5" rx="2.5" fill="#FFFFFF"/>
            <ellipse cx="37" cy="68" rx="9" ry="7" fill="#FFFFFF"/>
            <ellipse cx="67" cy="58" rx="9" ry="7" fill="#FFFFFF"/>
            <ellipse cx="37" cy="68" rx="4" ry="3" fill="#FA233B"/>
            <ellipse cx="67" cy="58" rx="4" ry="3" fill="#FA233B"/>
        </svg>`,

        appstore: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#2FA8FF', '#0A5BCC'], { rotate: true })}
            <g stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" fill="none">
                <line x1="34" y1="72" x2="50" y2="32"/>
                <line x1="66" y1="72" x2="50" y2="32"/>
                <line x1="30" y1="56" x2="70" y2="56"/>
            </g>
            <circle cx="50" cy="32" r="2.6" fill="#FFFFFF"/>
            <circle cx="34" cy="72" r="2.4" fill="#FFFFFF"/>
            <circle cx="66" cy="72" r="2.4" fill="#FFFFFF"/>
        </svg>`,

        calculator: (p) => {
            const grid = [[22, 44], [37, 44], [52, 44], [22, 58], [37, 58], [52, 58], [22, 72], [37, 72], [52, 72]];
            const lightKeys = [[22, 44], [37, 44], [52, 44]].map(([gx, gy]) =>
                `<rect x="${gx}" y="${gy}" width="12" height="11" rx="5.5" fill="#A5A5A5"/>`
            ).join('');
            const darkKeys = [[22, 58], [37, 58], [52, 58], [22, 72], [37, 72], [52, 72]].map(([gx, gy]) =>
                `<rect x="${gx}" y="${gy}" width="12" height="11" rx="5.5" fill="#333335"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#3A3A3C', '#1C1C1E'])}
                <rect x="18" y="16" width="64" height="68" rx="8" fill="#1C1C1E"/>
                <rect x="22" y="20" width="56" height="18" rx="3" fill="#0A0A0A"/>
                <text x="74" y="33" text-anchor="end" font-family="Menlo, monospace" font-size="13" fill="#FF9F0A" font-weight="300">0</text>
                ${lightKeys}
                ${darkKeys}
                <rect x="67" y="44" width="11" height="39" rx="5.5" fill="#FF9F0A"/>
                <rect x="67" y="44" width="11" height="4" rx="5.5" fill="rgba(255,255,255,0.22)"/>
            </svg>`;
        },

        trash: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#B0B0B5', '#6E6E73'])}
            <path d="M32,34 L68,34 L64,80 Q64,84 58,84 L42,84 Q36,84 36,80 Z" fill="#FFFFFF"/>
            <path d="M36,34 L64,34 L62,40 L38,40 Z" fill="rgba(0,0,0,0.06)"/>
            <rect x="38" y="24" width="24" height="8" rx="2.5" fill="#6E6E73"/>
            <rect x="38" y="24" width="24" height="3" rx="2.5" fill="rgba(255,255,255,0.35)"/>
            <line x1="44" y1="44" x2="44" y2="78" stroke="#B0B0B5" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="44" x2="50" y2="78" stroke="#B0B0B5" stroke-width="2" stroke-linecap="round"/>
            <line x1="56" y1="44" x2="56" y2="78" stroke="#B0B0B5" stroke-width="2" stroke-linecap="round"/>
        </svg>`,

        folder: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="${p}-fbg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#7AD0FF"/>
                    <stop offset="100%" stop-color="#0A84FF"/>
                </linearGradient>
                <linearGradient id="${p}-fhi" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.30"/>
                    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
                </linearGradient>
                <filter id="${p}-fsh" x="-25%" y="-25%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.28"/>
                </filter>
            </defs>
            <path d="M6,24 Q6,16 14,16 L36,16 Q42,16 46,22 L46,26 L86,26 Q94,26 94,34 L94,78 Q94,84 88,84 L12,84 Q6,84 6,78 Z" fill="url(#${p}-fbg)" filter="url(#${p}-fsh)"/>
            <path d="M6,24 Q6,16 14,16 L36,16 Q42,16 46,22 L46,26 L6,26 Z" fill="url(#${p}-fhi)"/>
            <rect x="6" y="26" width="88" height="3" fill="rgba(255,255,255,0.35)"/>
            <path d="M6,24 Q6,16 14,16 L36,16 Q42,16 46,22 L46,26 L86,26 Q94,26 94,34 L94,78 Q94,84 88,84 L12,84 Q6,84 6,78 Z" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="0.6"/>
        </svg>`,

        clock: (p) => {
            const ticks = [...Array(12)].map((_, i) => {
                const major = i % 3 === 0;
                const h = major ? 5 : 3;
                return `<rect x="49.4" y="18.5" width="1.2" height="${h}" rx="0.4" fill="#8E8E93" transform="rotate(${i * 30} 50 50)"/>`;
            }).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#1D1D1F', '#000000'])}
                <circle cx="50" cy="50" r="34" fill="#000000"/>
                <circle cx="50" cy="50" r="34" fill="none" stroke="#FF9500" stroke-width="1.4"/>
                <circle cx="50" cy="50" r="30" fill="none" stroke="#2C2C2E" stroke-width="0.5"/>
                ${ticks}
                <rect x="48.7" y="50" width="2.6" height="22" rx="1.3" fill="#FFFFFF" transform="rotate(-30 50 50)"/>
                <rect x="49" y="50" width="2" height="26" rx="1" fill="#FFFFFF" transform="rotate(60 50 50)"/>
                <rect x="49.5" y="28" width="1.2" height="24" rx="0.6" fill="#FF9500" transform="rotate(120 50 50)"/>
                <circle cx="50" cy="50" r="3" fill="#FF9500"/>
                <circle cx="50" cy="50" r="1.4" fill="#000000"/>
            </svg>`;
        },

        weather: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#4DA6FF', '#0062CC'])}
            <circle cx="62" cy="34" r="13" fill="#FFD60A"/>
            <circle cx="62" cy="34" r="13" fill="rgba(255,255,255,0.18)"/>
            <path d="M28,60 Q21,54 25,46 Q31,38 41,43 Q49,35 60,43 Q70,41 72,53 Q78,57 73,65 Q69,71 62,69 L32,69 Q22,69 28,60 Z" fill="#FFFFFF"/>
            <line x1="38" y1="74" x2="36" y2="82" stroke="#5AC8FA" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="50" y1="74" x2="48" y2="82" stroke="#5AC8FA" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="62" y1="74" x2="60" y2="82" stroke="#5AC8FA" stroke-width="2.4" stroke-linecap="round"/>
        </svg>`,

        reminders: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFB84D', '#FF9500'], { rotate: true })}
            <circle cx="50" cy="50" r="28" fill="#FFFFFF" opacity="0.95"/>
            <circle cx="50" cy="50" r="22" fill="none" stroke="#FF9500" stroke-width="3"/>
            <path d="M50,38 L50,50 L58,55" stroke="#FF9500" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="50" cy="50" r="2.4" fill="#FF9500"/>
        </svg>`,

        dictionary: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#A1A1A8', '#48484C'])}
            <rect x="24" y="16" width="52" height="68" rx="4" fill="#FFD60A"/>
            <rect x="24" y="16" width="6" height="68" fill="#E0B400"/>
            <rect x="30" y="20" width="44" height="60" rx="2" fill="#FFFFFF"/>
            <text x="52" y="44" text-anchor="middle" font-family="Songti SC, serif" font-size="22" fill="#1D1D1F" font-weight="700">字</text>
            <text x="52" y="56" text-anchor="middle" font-family="Songti SC, serif" font-size="7" fill="#8E8E93" font-weight="500">DICTIONARY</text>
            <rect x="34" y="62" width="36" height="1.4" fill="#D1D1D6"/>
            <rect x="38" y="68" width="28" height="1.4" fill="#D1D1D6"/>
            <rect x="34" y="74" width="36" height="1.4" fill="#D1D1D6"/>
        </svg>`,

        contacts: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#B0B0B5', '#6E6E73'])}
            <rect x="22" y="16" width="56" height="68" rx="6" fill="#FFFFFF"/>
            <path d="M22,22 Q22,16 28,16 L30,16 L30,84 L28,84 Q22,84 22,78 Z" fill="#FF9500"/>
            <circle cx="54" cy="38" r="9" fill="#007AFF"/>
            <path d="M54,49 Q64,49 68,56 L68,62 L40,62 L40,56 Q44,49 54,49 Z" fill="#007AFF"/>
            <rect x="66" y="34" width="8" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="66" y="40" width="8" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="66" y="46" width="8" height="2" rx="1" fill="#C7C7CC"/>
        </svg>`,

        maps: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5AC8FA', '#34C759'], { rotate: true })}
            <path d="M16,28 L38,22 L62,28 L86,22 L86,72 L62,78 L38,72 L16,78 Z" fill="#C8E6C9"/>
            <path d="M16,52 Q40,44 62,52 Q78,58 86,50 L86,72 L62,78 L38,72 L16,78 Z" fill="#B3E5FC"/>
            <path d="M16,28 L38,22 L38,72 L16,78 Z" fill="rgba(0,0,0,0.04)"/>
            <path d="M20,64 L46,46 L70,58 L82,46" stroke="#FFFFFF" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
            <path d="M50,32 C42,32 38,38 38,44 C38,54 50,66 50,66 C50,66 62,54 62,44 C62,38 58,32 50,32 Z" fill="#FF3B30"/>
            <circle cx="50" cy="44" r="3.4" fill="#FFFFFF"/>
        </svg>`,

        voice: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#3A3A3C', '#1D1D1F'])}
            <path d="M28,46 Q28,64 50,64 Q72,64 72,46" stroke="#FF3B30" stroke-width="3.2" fill="none" stroke-linecap="round"/>
            <rect x="44" y="22" width="12" height="38" rx="6" fill="#FF3B30"/>
            <rect x="44" y="22" width="12" height="8" rx="6" fill="#FF6B6B"/>
            <rect x="48" y="64" width="4" height="12" fill="#FF3B30"/>
            <rect x="38" y="76" width="24" height="4" rx="2" fill="#FF3B30"/>
            <path d="M22,42 Q22,24 44,20" stroke="#FF6B6B" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
            <path d="M78,42 Q78,24 56,20" stroke="#FF6B6B" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
        </svg>`,

        activity: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF9500', '#FF3B30'], { rotate: true })}
            <g transform="rotate(-90 50 50)" fill="none" stroke-linecap="round">
                <circle cx="50" cy="50" r="27" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>
                <circle cx="50" cy="50" r="27" stroke="#30D158" stroke-width="6" stroke-dasharray="122 170"/>
                <circle cx="50" cy="50" r="20" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>
                <circle cx="50" cy="50" r="20" stroke="#5AC8FA" stroke-width="6" stroke-dasharray="96 126"/>
                <circle cx="50" cy="50" r="13" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>
                <circle cx="50" cy="50" r="13" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="60 82"/>
            </g>
        </svg>`,

        quicktime: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#2C2C2E', '#000000'])}
            <circle cx="50" cy="50" r="30" fill="#000000"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.6"/>
            <path d="M50,18 A32 32 0 0 1 82,50" stroke="rgba(255,255,255,0.18)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="22" fill="#FFFFFF" opacity="0.08"/>
            <polygon points="43,38 43,62 64,50" fill="#FFFFFF"/>
        </svg>`,

        preview: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#7B79D8', '#3634A3'])}
            <rect x="16" y="22" width="68" height="56" rx="5" fill="#FFFFFF"/>
            <rect x="16" y="22" width="68" height="8" rx="5" fill="#F2F2F7"/>
            <circle cx="30" cy="40" r="6" fill="#FF9500"/>
            <path d="M16,78 L32,54 L42,64 L60,46 L74,60 L84,52 L84,78 Z" fill="#34C759"/>
            <path d="M16,78 L32,54 L42,64 L60,46 L74,60 L84,52 L84,58 L60,52 L42,70 L32,60 L16,84 Z" fill="#2EA64A" opacity="0.6"/>
        </svg>`,

        news: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF6B6B', '#FF3B30'], { rotate: true })}
            <rect x="20" y="18" width="60" height="64" rx="4" fill="#FFFFFF"/>
            <text x="50" y="50" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#FF3B30" font-weight="700" font-style="italic">N</text>
            <rect x="26" y="58" width="48" height="2" rx="1" fill="#D1D1D6"/>
            <rect x="26" y="64" width="40" height="2" rx="1" fill="#D1D1D6"/>
            <rect x="26" y="70" width="44" height="2" rx="1" fill="#D1D1D6"/>
            <rect x="26" y="76" width="34" height="2" rx="1" fill="#D1D1D6"/>
        </svg>`,

        stocks: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#1D1D1F', '#000000'])}
            <defs>
                <linearGradient id="${p}-area" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#30D158" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#30D158" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <polygon points="14,70 28,56 42,60 58,36 72,46 86,24 86,80 14,80" fill="url(#${p}-area)"/>
            <polyline points="14,70 28,56 42,60 58,36 72,46 86,24" stroke="#30D158" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="86" cy="24" r="3.2" fill="#30D158"/>
            <text x="50" y="94" text-anchor="middle" font-family="Menlo, monospace" font-size="9" fill="#30D158" font-weight="600">+2.45%</text>
        </svg>`,

        home: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF9500', '#FF3B30'], { rotate: true })}
            <path d="M50,22 L78,48 L78,80 L62,80 L62,62 L38,62 L38,80 L22,80 L22,48 Z" fill="#FFFFFF"/>
            <path d="M50,22 L78,48 L74,48 L50,27 L26,48 L22,48 Z" fill="rgba(255,255,255,0.35)"/>
            <rect x="44" y="66" width="12" height="14" fill="#FF9500" opacity="0.35"/>
        </svg>`,

        tv: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#2C2C2E', '#000000'])}
            <text x="50" y="62" text-anchor="middle" font-family="PingFang SC, sans-serif" font-size="26" fill="#FFFFFF" font-weight="600" letter-spacing="-1.5">tv</text>
            <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.6"/>
        </svg>`,

        podcasts: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#C56DEF', '#9B4DCA'], { rotate: true })}
            <circle cx="50" cy="36" r="8" fill="#FFFFFF"/>
            <path d="M50,46 Q60,46 60,60 L40,60 Q40,46 50,46 Z" fill="#FFFFFF"/>
            <path d="M30,48 Q30,34 44,28" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.75"/>
            <path d="M70,48 Q70,34 56,28" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.75"/>
            <path d="M22,56 Q22,30 44,20" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
            <path d="M78,56 Q78,30 56,20" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4"/>
            <circle cx="50" cy="68" r="3.2" fill="#FFFFFF"/>
            <rect x="48.5" y="60" width="3" height="10" fill="#FFFFFF"/>
        </svg>`,

        books: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFB13B', '#FF9500'], { rotate: true })}
            <path d="M50,26 Q40,22 28,24 L28,76 Q40,74 50,78 Z" fill="#FFFFFF"/>
            <path d="M50,26 Q60,22 72,24 L72,76 Q60,74 50,78 Z" fill="#FFFFFF"/>
            <path d="M50,26 Q40,22 28,24 L28,28 Q40,26 50,30 Z" fill="rgba(0,0,0,0.06)"/>
            <path d="M50,26 Q60,22 72,24 L72,28 Q60,26 50,30 Z" fill="rgba(0,0,0,0.06)"/>
            <line x1="50" y1="26" x2="50" y2="78" stroke="#D1D1D6" stroke-width="0.5"/>
        </svg>`,

        numbers: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#34D05B', '#1FAA4C'], { rotate: true })}
            <rect x="20" y="22" width="60" height="56" rx="6" fill="#FFFFFF"/>
            <path d="M20,28 Q20,22 26,22 L74,22 Q80,22 80,28 L80,30 L20,30 Z" fill="rgba(52,199,89,0.18)"/>
            <rect x="24" y="34" width="14" height="22" rx="2" fill="#34C759"/>
            <rect x="40" y="40" width="14" height="16" rx="2" fill="#5AC8FA"/>
            <rect x="56" y="36" width="14" height="20" rx="2" fill="#FF9500"/>
            <rect x="24" y="60" width="46" height="14" rx="2" fill="#F2F2F7"/>
            <text x="47" y="71" text-anchor="middle" font-family="Menlo, monospace" font-size="9" fill="#1FAA4C" font-weight="600">=SUM</text>
        </svg>`,

        pages: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#4DA6FF', '#0A6BE0'], { rotate: true })}
            <rect x="22" y="16" width="50" height="68" rx="4" fill="#FFFFFF"/>
            <path d="M22,20 Q22,16 26,16 L68,16 L68,22 L22,22 Z" fill="#EAF2FF"/>
            <rect x="28" y="30" width="22" height="6" rx="1" fill="#0A6BE0"/>
            <rect x="28" y="42" width="38" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="28" y="48" width="32" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="28" y="54" width="36" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="28" y="60" width="28" height="2" rx="1" fill="#C7C7CC"/>
            <g transform="rotate(45 70 60)">
                <rect x="64" y="40" width="8" height="32" rx="1.5" fill="#FF9F0A"/>
                <rect x="64" y="40" width="8" height="6" rx="1.5" fill="#FF5E3A"/>
                <path d="M64,72 L68,80 L72,72 Z" fill="#1D1D1F"/>
            </g>
        </svg>`,

        keynote: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#7B79D8', '#3634A3'], { rotate: true })}
            <rect x="18" y="24" width="64" height="40" rx="4" fill="#FFFFFF"/>
            <path d="M18,28 Q18,24 22,24 L78,24 Q82,24 82,28 L82,30 L18,30 Z" fill="#5856D6"/>
            <rect x="46" y="64" width="8" height="8" fill="#8E8E93"/>
            <rect x="30" y="72" width="40" height="3" rx="1.5" fill="#8E8E93"/>
            <rect x="28" y="40" width="8" height="18" rx="1.5" fill="#FF3B30"/>
            <rect x="40" y="46" width="8" height="12" rx="1.5" fill="#FF9500"/>
            <rect x="52" y="38" width="8" height="20" rx="1.5" fill="#34C759"/>
            <rect x="64" y="44" width="8" height="14" rx="1.5" fill="#5AC8FA"/>
        </svg>`,

        stickies: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FFE680', '#FFCC00'])}
            <rect x="20" y="18" width="60" height="64" rx="3" fill="#FFF3A0"/>
            <path d="M20,18 L80,18 L80,24 L20,24 Z" fill="#FFE066"/>
            <path d="M70,18 L80,18 L80,28 Z" fill="#FFCC00"/>
            <rect x="20" y="18" width="60" height="64" rx="3" fill="none" stroke="#D4A017" stroke-width="0.4"/>
            ${[30, 38, 46, 54, 62, 70].map((yy, i) => {
                const widths = [40, 46, 32, 44, 36, 28];
                return `<rect x="26" y="${yy}" width="${widths[i]}" height="2.4" rx="1" fill="#C9A227" opacity="0.6"/>`;
            }).join('')}
        </svg>`,

        chess: (p) => {
            const board = [...Array(4)].map((_, r) =>
                [...Array(4)].map((_, c) => {
                    const dark = (r + c) % 2 === 0;
                    return `<rect x="${14 + c * 18}" y="${14 + r * 18}" width="18" height="18" fill="${dark ? '#B5651D' : '#F5DEB3'}"/>`;
                }).join('')
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.squircle(p, ['#E8C89A', '#C79A5B'])}
                ${board}
                <rect x="14" y="14" width="72" height="72" fill="none" stroke="#8B5A2B" stroke-width="1"/>
                <path d="M50,30 Q44,30 44,36 Q44,40 47,42 L47,52 L43,52 L43,56 L57,56 L57,52 L53,52 L53,42 Q56,40 56,36 Q56,30 50,30 Z" fill="#1D1D1F"/>
                <rect x="42" y="56" width="16" height="3" fill="#1D1D1F"/>
                <rect x="40" y="59" width="20" height="4" rx="1" fill="#1D1D1F"/>
                <circle cx="47" cy="36" r="1" fill="#FFFFFF" opacity="0.5"/>
            </svg>`;
        },

        fontbook: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#FF5E6C', '#E11D48'], { rotate: true })}
            <text x="50" y="62" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="#FFFFFF" font-weight="700" font-style="italic">Aa</text>
            <rect x="24" y="72" width="52" height="1.6" fill="rgba(255,255,255,0.5)"/>
        </svg>`,

        imagecapture: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#5AC8FA', '#34C759'], { rotate: true })}
            <rect x="16" y="30" width="68" height="42" rx="6" fill="#FFFFFF"/>
            <rect x="16" y="30" width="68" height="9" rx="6" fill="#E5E5EA"/>
            <rect x="38" y="26" width="24" height="6" rx="2" fill="#FFFFFF"/>
            <circle cx="50" cy="52" r="14" fill="#1D1D1F"/>
            <circle cx="50" cy="52" r="11" fill="#5AC8FA"/>
            <circle cx="50" cy="52" r="7" fill="#1D1D1F"/>
            <circle cx="46" cy="48" r="2.4" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="72" cy="38" r="2" fill="#FF3B30"/>
        </svg>`,

        keychain: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#4DA6FF', '#0A6BE0'])}
            <circle cx="42" cy="48" r="20" fill="none" stroke="#FFFFFF" stroke-width="5.5"/>
            <rect x="58" y="44" width="28" height="8" rx="2.5" fill="#FFFFFF"/>
            <rect x="78" y="52" width="4.5" height="13" rx="1.5" fill="#FFFFFF"/>
            <rect x="71" y="52" width="4.5" height="9" rx="1.5" fill="#FFFFFF"/>
            <circle cx="42" cy="48" r="6" fill="#0A6BE0"/>
            <circle cx="42" cy="48" r="6" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="0.6"/>
        </svg>`,

        migration: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#A1A1A8', '#6E6E73'])}
            <rect x="18" y="30" width="26" height="40" rx="4" fill="#FFFFFF"/>
            <rect x="18" y="30" width="26" height="7" rx="4" fill="#E5E5EA"/>
            <circle cx="31" cy="48" r="1.6" fill="#1D1D1F"/>
            <rect x="24" y="54" width="14" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="24" y="60" width="14" height="2" rx="1" fill="#C7C7CC"/>
            <path d="M48,50 L68,50 M62,44 L68,50 L62,56" stroke="#34C759" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="70" y="30" width="14" height="40" rx="3" fill="#FFFFFF" opacity="0.55"/>
            <rect x="70" y="30" width="14" height="6" rx="3" fill="#E5E5EA" opacity="0.6"/>
        </svg>`,

        sysinfo: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.squircle(p, ['#636366', '#3A3A3C'])}
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
            <text x="50" y="66" text-anchor="middle" font-family="PingFang SC, sans-serif" font-size="44" fill="#FFFFFF" opacity="0.92">?</text>
        </svg>`
    };
}
