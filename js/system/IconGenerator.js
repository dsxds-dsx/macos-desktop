/**
 * macOS 26 Tahoe 风格图标生成器 - 基于真实参考重写
 * 特点：更圆润 squircle、精致玻璃高光、准确图标元素
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
        finder: (p) => {
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'], { x: 5, y: 5, w: 90, h: 90 })}
                <path d="M15,24 Q8,40 14,60 Q22,80 40,88 Q70,88 86,60 Q92,40 85,24 Q78,12 60,10 Q40,8 25,14 Q18,18 15,24 Z" fill="#FFFFFF"/>
                <path d="M54,10 Q72,12 85,26 Q90,38 86,54 Q80,70 66,80 Q56,84 48,84 Q52,74 58,62 Q64,48 58,32 Q52,20 46,14 Z" fill="#007AFF"/>
                <ellipse cx="30" cy="46" rx="4.5" ry="6" fill="#1D1D1F"/>
                <ellipse cx="70" cy="46" rx="4.5" ry="6" fill="#FFFFFF"/>
                <path d="M26,66 Q42,80 50,78 Q58,80 74,66" stroke="#1D1D1F" stroke-width="4" fill="none" stroke-linecap="round"/>
            </svg>`;
        },

        settings: (p) => {
            const teeth = [...Array(8)].map((_, i) =>
                `<rect x="47" y="8" width="6" height="16" rx="2" fill="#F2F2F7" transform="rotate(${i * 45} 50 50)"/>`
            ).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#8E8E93', '#48484A'])}
                ${teeth}
                <circle cx="50" cy="50" r="28" fill="#F2F2F7"/>
                <circle cx="50" cy="50" r="12" fill="#636366"/>
            </svg>`;
        },

        safari: (p) => {
            const ticks = [...Array(12)].map((_, i) => {
                const major = i % 3 === 0;
                const len = major ? 6 : 3;
                return `<rect x="49.4" y="16" width="1.2" height="${len}" rx="0.5" fill="${major ? '#1D1D1F' : '#8E8E93'}" transform="rotate(${i * 30} 50 50)"/>`;
            }).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
                <circle cx="50" cy="50" r="32" fill="#FFFFFF"/>
                ${ticks}
                <path d="M50,50 L58,22 L52,48 Z" fill="#FF3B30"/>
                <path d="M50,50 L42,78 L48,52 Z" fill="#E5E5EA"/>
                <circle cx="50" cy="50" r="3" fill="#1D1D1F"/>
            </svg>`;
        },

        terminal: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#3A3A3C', '#1D1D1F'])}
            <rect x="12" y="18" width="76" height="66" rx="6" fill="#000000"/>
            <rect x="12" y="18" width="76" height="14" rx="6" fill="#2C2C2E"/>
            <rect x="12" y="28" width="76" height="2" fill="#1C1C1E"/>
            <circle cx="22" cy="25" r="3" fill="#FF5F57"/>
            <circle cx="32" cy="25" r="3" fill="#FEBC2E"/>
            <circle cx="42" cy="25" r="3" fill="#28C840"/>
            <path d="M22,48 L32,56 L22,64" stroke="#30D158" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="38" y="54" width="26" height="3" rx="1.5" fill="#FFFFFF"/>
        </svg>`,

        notes: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FFE066', '#FFCC00'])}
            <rect x="14" y="18" width="72" height="68" rx="4" fill="#FFF9E0"/>
            <rect x="14" y="18" width="72" height="14" fill="#FFD60A"/>
            ${[38, 46, 54, 62, 70, 78].map((yy, i) => {
                const widths = [50, 42, 48, 38, 32, 40];
                return `<rect x="22" y="${yy}" width="${widths[i]}" height="2" rx="1" fill="#E6C800" opacity="0.45"/>`;
            }).join('')}
        </svg>`,

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

        calendar: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FFFFFF', '#F2F2F7'])}
            <rect x="10" y="10" width="80" height="80" rx="4" fill="#FFFFFF"/>
            <rect x="10" y="10" width="80" height="22" fill="#FF3B30"/>
            <text x="50" y="26" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="11" fill="#FFFFFF" font-weight="600">JULY</text>
            <text x="50" y="72" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="48" fill="#1D1D1F" font-weight="300">26</text>
        </svg>`,

        ai: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF375F', '#BF5AF2', '#5E5CE6'])}
            <defs>
                <radialGradient id="${p}-glow" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="34" fill="url(#${p}-glow)"/>
            <g transform="translate(50,50)">
                ${[0, 72, 144, 216, 288].map((deg) =>
                    `<path d="M0,-20 C7,-12 9,-5 0,5 C-9,-5 -7,-12 0,-20 Z" fill="#FFFFFF" transform="rotate(${deg})"/>`
                ).join('')}
            </g>
            <circle cx="50" cy="50" r="10" fill="#FFFFFF" opacity="0.95"/>
            <circle cx="50" cy="50" r="4" fill="#FFFFFF"/>
        </svg>`,

        photos: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FFFFFF', '#F2F2F7'])}
            <g transform="translate(50,50)">
                ${[
                    ['#FFCC00', -90],
                    ['#FF9500', -30],
                    ['#34C759', 30],
                    ['#5AC8FA', 90],
                    ['#007AFF', 150],
                    ['#AF52DE', 210],
                    ['#FF2D55', 270],
                    ['#FF3B30', 330]
                ].map(([c, deg]) =>
                    `<ellipse cx="0" cy="-19" rx="7" ry="16" fill="${c}" transform="rotate(${deg})"/>`
                ).join('')}
                <circle r="9" fill="#FFFFFF"/>
            </g>
        </svg>`,

        mail: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
            <rect x="12" y="28" width="76" height="44" rx="6" fill="#FFFFFF"/>
            <path d="M12,34 L50,58 L88,34" stroke="#007AFF" stroke-width="2" fill="none" stroke-linejoin="round"/>
            <path d="M12,34 Q12,28 18,28 L82,28 Q88,28 88,34 L88,40 L50,62 L12,40 Z" fill="#E5F0FF"/>
            <path d="M12,36 L50,60 L88,36" stroke="rgba(0,122,255,0.1)" stroke-width="1" fill="none"/>
        </svg>`,

        messages: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#34C759', '#248A3D'])}
            <path d="M50,16 C26,16 10,32 10,54 C10,66 18,76 28,82 L24,90 L40,82 C44,84 48,85 50,86 C74,86 90,70 90,54 C90,32 74,16 50,16 Z" fill="#FFFFFF"/>
            <circle cx="36" cy="54" r="4.5" fill="#34C759"/>
            <circle cx="50" cy="54" r="4.5" fill="#34C759"/>
            <circle cx="64" cy="54" r="4.5" fill="#34C759"/>
        </svg>`,

        facetime: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#34C759', '#248A3D'])}
            <rect x="12" y="32" width="50" height="36" rx="8" fill="#FFFFFF"/>
            <path d="M62,44 L88,30 L88,70 L62,56 Z" fill="#FFFFFF"/>
        </svg>`,

        music: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FFFFFF', '#F2F2F7'])}
            <defs>
                <linearGradient id="${p}-note" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FF375F"/>
                    <stop offset="50%" stop-color="#FF2D55"/>
                    <stop offset="100%" stop-color="#AF52DE"/>
                </linearGradient>
                <linearGradient id="${p}-note2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FF375F"/>
                    <stop offset="100%" stop-color="#007AFF"/>
                </linearGradient>
            </defs>
            <path d="M38,68 L38,30 L70,22 L70,58" stroke="url(#${p}-note)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <ellipse cx="34" cy="70" rx="11" ry="9" fill="url(#${p}-note2)"/>
            <ellipse cx="66" cy="58" rx="11" ry="9" fill="url(#${p}-note2)"/>
        </svg>`,

        appstore: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
            <g stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none">
                <line x1="30" y1="78" x2="50" y2="24"/>
                <line x1="70" y1="78" x2="50" y2="24"/>
                <line x1="24" y1="56" x2="76" y2="56"/>
            </g>
        </svg>`,

        calculator: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#48484A', '#1D1D1F'])}
            <rect x="16" y="12" width="68" height="76" rx="8" fill="#1C1C1E"/>
            <rect x="20" y="16" width="60" height="20" rx="4" fill="#000000"/>
            <text x="76" y="32" text-anchor="end" font-family="-apple-system, sans-serif" font-size="18" fill="#FFFFFF" font-weight="200">0</text>
            <rect x="20" y="42" width="13" height="11" rx="5.5" fill="#D4D4D4"/>
            <rect x="36" y="42" width="13" height="11" rx="5.5" fill="#D4D4D4"/>
            <rect x="52" y="42" width="13" height="11" rx="5.5" fill="#D4D4D4"/>
            <rect x="20" y="56" width="13" height="11" rx="5.5" fill="#333335"/>
            <rect x="36" y="56" width="13" height="11" rx="5.5" fill="#333335"/>
            <rect x="52" y="56" width="13" height="11" rx="5.5" fill="#333335"/>
            <rect x="20" y="70" width="13" height="11" rx="5.5" fill="#333335"/>
            <rect x="36" y="70" width="13" height="11" rx="5.5" fill="#333335"/>
            <rect x="52" y="70" width="13" height="11" rx="5.5" fill="#333335"/>
            <rect x="68" y="42" width="12" height="39" rx="6" fill="#FF9F0A"/>
        </svg>`,

        trash: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#E5E5EA', '#C7C7CC'])}
            <path d="M24,32 L76,32 L72,84 Q70,90 62,90 L38,90 Q30,90 28,84 Z" fill="#FFFFFF"/>
            <rect x="34" y="20" width="32" height="10" rx="3" fill="#8E8E93"/>
            <line x1="40" y1="42" x2="40" y2="82" stroke="#D1D1D6" stroke-width="3" stroke-linecap="round"/>
            <line x1="50" y1="42" x2="50" y2="82" stroke="#D1D1D6" stroke-width="3" stroke-linecap="round"/>
            <line x1="60" y1="42" x2="60" y2="82" stroke="#D1D1D6" stroke-width="3" stroke-linecap="round"/>
        </svg>`,

        folder: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#7AD0FF', '#0084FF'])}
            <path d="M8,28 L38,28 Q44,28 48,22 L48,28 L92,28 Q94,28 94,36 L94,80 Q94,86 88,86 L12,86 Q6,86 6,80 L6,34 Q6,28 12,28 Z" fill="#FFFFFF" opacity="0.15"/>
            <path d="M6,30 Q6,20 14,20 L36,20 Q42,20 46,26 L46,30 L8,30 Z" fill="rgba(255,255,255,0.3)"/>
        </svg>`,

        clock: (p) => {
            const ticks = [...Array(12)].map((_, i) => {
                const major = i % 3 === 0;
                const len = major ? 6 : 3;
                return `<rect x="49.4" y="14" width="1.2" height="${len}" rx="0.5" fill="${major ? '#F2F2F7' : '#636366'}" transform="rotate(${i * 30} 50 50)"/>`;
            }).join('');
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#2C2C2E', '#000000'])}
                <circle cx="50" cy="50" r="34" fill="#000000"/>
                <circle cx="50" cy="50" r="34" fill="none" stroke="#FF9500" stroke-width="2.5"/>
                ${ticks}
                <rect x="48.5" y="50" width="3" height="20" rx="1.5" fill="#FFFFFF" transform="rotate(-30 50 50)"/>
                <rect x="49" y="50" width="2" height="24" rx="1" fill="#FFFFFF" transform="rotate(60 50 50)"/>
                <rect x="49.5" y="22" width="1.2" height="30" rx="0.6" fill="#FF9500" transform="rotate(120 50 50)"/>
                <circle cx="50" cy="50" r="3" fill="#FF9500"/>
            </svg>`;
        },

        weather: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
            <circle cx="68" cy="30" r="14" fill="#FFD60A"/>
            <path d="M20,60 Q12,52 20,44 Q28,36 40,42 Q50,34 60,44 Q72,42 72,54 Q78,60 72,66 Q68,72 60,70 L24,70 Q14,70 20,60 Z" fill="#FFFFFF"/>
            <line x1="36" y1="76" x2="34" y2="86" stroke="#5AC8FA" stroke-width="3" stroke-linecap="round"/>
            <line x1="50" y1="76" x2="48" y2="86" stroke="#5AC8FA" stroke-width="3" stroke-linecap="round"/>
            <line x1="64" y1="76" x2="62" y2="86" stroke="#5AC8FA" stroke-width="3" stroke-linecap="round"/>
        </svg>`,

        reminders: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FFD60A', '#FF9500'])}
            <circle cx="50" cy="50" r="30" fill="#FFFFFF"/>
            <circle cx="50" cy="50" r="24" fill="none" stroke="#FF9500" stroke-width="4"/>
            <path d="M50,36 L50,52 L62,60" stroke="#FF9500" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,

        dictionary: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
            <rect x="22" y="12" width="56" height="76" rx="4" fill="#FFD60A"/>
            <rect x="28" y="16" width="44" height="68" rx="2" fill="#FFFFFF"/>
            <text x="50" y="55" text-anchor="middle" font-family="Songti SC, serif" font-size="32" fill="#1D1D1F" font-weight="700">字</text>
        </svg>`,

        contacts: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#C7C7CC', '#8E8E93'])}
            <rect x="14" y="12" width="72" height="76" rx="6" fill="#FFFFFF"/>
            <rect x="14" y="12" width="72" height="16" rx="6" fill="#D1D1D6"/>
            <circle cx="54" cy="42" r="12" fill="#007AFF"/>
            <path d="M54,56 Q68,56 72,68 L72,74 L36,74 L36,68 Q40,56 54,56 Z" fill="#007AFF"/>
        </svg>`,

        maps: (p) => {
            const r = 22;
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="${p}-sh" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.25"/>
                    </filter>
                    <clipPath id="${p}-clip">
                        <rect x="5" y="5" width="90" height="90" rx="${r}" ry="${r}"/>
                    </clipPath>
                    <linearGradient id="${p}-glass" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
                        <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.1"/>
                        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
                    </linearGradient>
                </defs>
                <rect x="5" y="5" width="90" height="90" rx="${r}" ry="${r}" fill="#81C995" filter="url(#${p}-sh)"/>
                <g clip-path="url(#${p}-clip)">
                    <path d="M-5,-5 L35,15 L65,28 L105,-5 L105,48 L65,58 L35,45 L-5,55 Z" fill="#A8E6B8"/>
                    <path d="M-5,55 Q30,46 50,55 Q70,64 105,48 L105,85 L65,95 L35,82 L-5,92 Z" fill="#7DD3FC"/>
                    <path d="M0,68 Q28,62 44,68 Q58,74 78,66 L105,75 L65,95 L35,82 L-5,92 Z" fill="#FCD34D" opacity="0.5"/>
                    <path d="M-5,30 Q15,25 40,32 Q60,38 85,28 L105,20 L105,45 Q75,55 55,48 Q35,40 10,48 L-5,52 Z" fill="#F472B6" opacity="0.45"/>
                    <path d="M30,20 L50,12 L70,25 L105,15" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.8"/>
                    <path d="M-5,50 L20,42 L45,52 L70,44 L105,50" stroke="#F87171" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.5"/>
                    <path d="M50,22 C40,22 32,30 32,40 C32,52 50,68 50,68 C50,68 68,52 68,40 C68,30 60,22 50,22 Z" fill="#EF4444"/>
                    <circle cx="50" cy="40" r="8" fill="#FFFFFF"/>
                    <circle cx="50" cy="40" r="4" fill="#EF4444"/>
                    <rect x="5" y="5" width="90" height="45" fill="url(#${p}-glass)"/>
                </g>
            </svg>`;
        },

        voice: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#48484A', '#1D1D1F'])}
            <rect x="42" y="18" width="16" height="44" rx="8" fill="#FF3B30"/>
            <path d="M24,48 Q24,70 50,70 Q76,70 76,48" stroke="#FF3B30" stroke-width="4" fill="none" stroke-linecap="round"/>
            <rect x="48" y="70" width="4" height="10" fill="#FF3B30"/>
            <rect x="36" y="80" width="28" height="4" rx="2" fill="#FF3B30"/>
        </svg>`,

        launchpad: (p) => {
            const dots = [];
            const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5AC8FA', '#007AFF', '#AF52DE', '#FF2D55', '#8E8E93'];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    dots.push(`<circle cx="${32 + c * 18}" cy="${32 + r * 18}" r="6" fill="${colors[r * 3 + c]}"/>`);
                }
            }
            return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                ${IconGenerator.bg(p, ['#E5E5EA', '#C7C7CC'])}
                ${dots.join('')}
            </svg>`;
        },

        activity: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF9500', '#FF3B30'])}
            <g transform="rotate(-90 50 50)" fill="none" stroke-linecap="round">
                <circle cx="50" cy="50" r="28" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
                <circle cx="50" cy="50" r="28" stroke="#30D158" stroke-width="8" stroke-dasharray="130 175"/>
                <circle cx="50" cy="50" r="20" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
                <circle cx="50" cy="50" r="20" stroke="#5AC8FA" stroke-width="8" stroke-dasharray="95 126"/>
                <circle cx="50" cy="50" r="12" stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
                <circle cx="50" cy="50" r="12" stroke="#FFFFFF" stroke-width="8" stroke-dasharray="58 76"/>
            </g>
        </svg>`,

        quicktime: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#3A3A3C', '#000000'])}
            <circle cx="50" cy="50" r="34" fill="#000000"/>
            <polygon points="38,34 38,66 68,50" fill="#FFFFFF"/>
        </svg>`,

        preview: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#5E5CE6', '#3634A3'])}
            <rect x="10" y="18" width="80" height="64" rx="6" fill="#FFFFFF"/>
            <circle cx="26" cy="40" r="10" fill="#FF9500"/>
            <path d="M10,82 L28,48 L44,62 L58,42 L76,60 L90,48 L90,82 Z" fill="#34C759"/>
        </svg>`,

        news: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
            <rect x="14" y="14" width="72" height="72" rx="4" fill="#FFFFFF"/>
            <text x="50" y="58" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="#FF3B30" font-weight="700" font-style="italic">N</text>
        </svg>`,

        stocks: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#2C2C2E', '#000000'])}
            <defs>
                <linearGradient id="${p}-gr" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#30D158" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#30D158" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <polygon points="8,76 22,58 38,64 54,32 70,48 92,20 92,88 8,88" fill="url(#${p}-gr)"/>
            <polyline points="8,76 22,58 38,64 54,32 70,48 92,20" stroke="#30D158" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="92" cy="20" r="4" fill="#30D158"/>
        </svg>`,

        home: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF9500', '#FF6B00'])}
            <path d="M50,18 L88,50 L88,84 L60,84 L60,60 L40,60 L40,84 L12,84 L12,50 Z" fill="#FFFFFF"/>
            <rect x="42" y="62" width="16" height="22" fill="#FF9500"/>
        </svg>`,

        tv: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#3A3A3C', '#000000'])}
            <text x="50" y="68" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="36" fill="#FFFFFF" font-weight="600" letter-spacing="-2">tv</text>
        </svg>`,

        podcasts: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#BF5AF2', '#8944AB'])}
            <circle cx="50" cy="32" r="10" fill="#FFFFFF"/>
            <path d="M50,44 Q66,44 66,60 L34,60 Q34,44 50,44 Z" fill="#FFFFFF"/>
            <path d="M24,48 Q24,26 46,18" stroke="#FFFFFF" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            <path d="M76,48 Q76,26 54,18" stroke="#FFFFFF" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            <circle cx="50" cy="74" r="4" fill="#FFFFFF"/>
            <rect x="48" y="60" width="4" height="14" fill="#FFFFFF"/>
        </svg>`,

        books: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF9500', '#FF6B00'])}
            <path d="M50,18 Q34,14 22,20 L22,80 Q36,76 50,80 Z" fill="#FFFFFF"/>
            <path d="M50,18 Q66,14 78,20 L78,80 Q64,76 50,80 Z" fill="#FFFFFF"/>
        </svg>`,

        numbers: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#34C759', '#248A3D'])}
            <rect x="14" y="16" width="72" height="68" rx="6" fill="#FFFFFF"/>
            <rect x="22" y="30" width="16" height="28" rx="2" fill="#34C759"/>
            <rect x="40" y="38" width="16" height="20" rx="2" fill="#5AC8FA"/>
            <rect x="58" y="34" width="16" height="24" rx="2" fill="#FF9500"/>
        </svg>`,

        pages: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
            <rect x="24" y="12" width="48" height="76" rx="3" fill="#FFFFFF"/>
            <rect x="30" y="26" width="24" height="6" rx="1" fill="#007AFF"/>
            <rect x="30" y="38" width="34" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="30" y="44" width="30" height="2" rx="1" fill="#C7C7CC"/>
            <rect x="30" y="50" width="34" height="2" rx="1" fill="#C7C7CC"/>
        </svg>`,

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

        garageband: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
            <rect x="10" y="18" width="80" height="64" rx="6" fill="#FFFFFF"/>
            <rect x="10" y="18" width="80" height="16" rx="6" fill="#FF3B30"/>
            <path d="M18,50 L82,50 M18,60 L82,60 M18,70 L82,70" stroke="#C7C7CC" stroke-width="1"/>
            <circle cx="50" cy="62" r="10" fill="#FF3B30"/>
        </svg>`,

        imovie: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#BF5AF2', '#8944AB'])}
            <rect x="10" y="12" width="80" height="56" rx="4" fill="#1C1C1E"/>
            <polygon points="38,28 38,52 64,40" fill="#FFFFFF"/>
            <rect x="10" y="68" width="80" height="20" rx="3" fill="#FFFFFF"/>
            <rect x="18" y="74" width="18" height="8" rx="1" fill="#BF5AF2"/>
            <rect x="40" y="72" width="24" height="10" rx="1" fill="#5AC8FA"/>
            <rect x="68" y="74" width="18" height="8" rx="1" fill="#FF9500"/>
        </svg>`,

        stickies: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FFE680', '#FFCC00'])}
            <rect x="16" y="12" width="68" height="76" rx="3" fill="#FFF3A0"/>
            <path d="M16,12 L84,12 L84,24 L16,24 Z" fill="#FFE066"/>
            <path d="M72,12 L84,12 L84,24 Z" fill="#FFCC00"/>
            ${[30, 38, 46, 54, 62, 70].map((yy, i) => {
                const widths = [44, 50, 36, 48, 40, 32];
                return `<rect x="24" y="${yy}" width="${widths[i]}" height="2.4" rx="1" fill="#C9A227" opacity="0.5"/>`;
            }).join('')}
        </svg>`,

        fontbook: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#FF3B30', '#D70015'])}
            <text x="50" y="68" text-anchor="middle" font-family="Georgia, serif" font-size="48" fill="#FFFFFF" font-weight="700" font-style="italic">Aa</text>
        </svg>`,

        imagecapture: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#8E8E93', '#48484A'])}
            <rect x="10" y="30" width="80" height="50" rx="6" fill="#FFFFFF"/>
            <rect x="36" y="22" width="28" height="10" rx="3" fill="#FFFFFF"/>
            <circle cx="50" cy="55" r="18" fill="#1D1D1F"/>
            <circle cx="50" cy="55" r="14" fill="#5AC8FA"/>
            <circle cx="50" cy="55" r="10" fill="#1D1D1F"/>
            <circle cx="78" cy="38" r="3" fill="#FF3B30"/>
        </svg>`,

        keychain: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#5AC8FA', '#007AFF'])}
            <circle cx="36" cy="50" r="26" fill="none" stroke="#FFFFFF" stroke-width="8"/>
            <rect x="54" y="46" width="34" height="8" rx="3" fill="#FFFFFF"/>
            <rect x="80" y="54" width="6" height="14" rx="2" fill="#FFFFFF"/>
            <circle cx="36" cy="50" r="8" fill="#007AFF"/>
        </svg>`,

        migration: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#C7C7CC', '#8E8E93'])}
            <rect x="12" y="28" width="32" height="48" rx="4" fill="#FFFFFF"/>
            <rect x="12" y="28" width="32" height="10" rx="4" fill="#E5E5EA"/>
            <path d="M52,52 L72,52 M66,46 L72,52 L66,58" stroke="#34C759" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,

        sysinfo: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#636366', '#3A3A3C'])}
            <rect x="16" y="16" width="68" height="52" rx="4" fill="#000000"/>
            <rect x="22" y="22" width="56" height="40" rx="2" fill="#1C1C1E"/>
            <rect x="26" y="28" width="26" height="4" rx="1" fill="#30D158"/>
            <rect x="26" y="36" width="40" height="3" rx="1" fill="#5AC8FA"/>
            <rect x="26" y="44" width="32" height="3" rx="1" fill="#FF9500"/>
            <rect x="26" y="52" width="44" height="3" rx="1" fill="#FF3B30"/>
        </svg>`,

        chess: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#E8C89A', '#C79A5B'])}
            ${[...Array(4)].map((_, r) =>
                [...Array(4)].map((_, c) => {
                    const dark = (r + c) % 2 === 0;
                    return `<rect x="${12 + c * 19}" y="${12 + r * 19}" width="19" height="19" fill="${dark ? '#B5651D' : '#F5DEB3'}"/>`;
                }).join('')
            ).join('')}
            <path d="M50,28 Q44,28 44,34 Q44,38 47,40 L47,52 L43,52 L43,56 L57,56 L57,52 L53,52 L53,40 Q56,38 56,34 Q56,28 50,28 Z" fill="#1D1D1F"/>
            <rect x="41" y="56" width="18" height="4" rx="1" fill="#1D1D1F"/>
            <rect x="38" y="60" width="24" height="6" rx="2" fill="#1D1D1F"/>
        </svg>`,

        trash_filled: (p) => IconGenerator.icons.trash(p),

        default: (p) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${IconGenerator.bg(p, ['#C7C7CC', '#8E8E93'])}
            <text x="50" y="68" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="48" fill="#FFFFFF">?</text>
        </svg>`
    };
}
