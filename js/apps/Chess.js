// Chess - 国际象棋 (macOS Sonoma)
window.renderChess = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_chess_v2';

    // ----- SVG piece definitions (classic Staunton-style) -----
    const PIECE_SVG = {
        wK: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="none" stroke="#2b2b2b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-3.5-9-3.5-11.5 0V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>',
        wQ: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="#fff" stroke="#2b2b2b" stroke-width="1.5" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="14" cy="9" r="2.5"/><circle cx="22.5" cy="8" r="2.5"/><circle cx="31" cy="9" r="2.5"/><circle cx="39" cy="12" r="2.5"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/></g></svg>',
        wR: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="#fff" stroke="#2b2b2b" stroke-width="1.5" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>',
        wB: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="none" stroke="#2b2b2b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.66.43 13.5-3.5 2.84 3.93 10.11 2.53 13.5 3.5 0 0 1.65.49 3 2.5-3.04.97-9.5-.5-12 1.5-1.04 1-1.5 4-4.5 4s-3.46-3-4.5-4c-2.5-2-8.96-.53-12-1.5 1.35-2.01 3-2.5 3-2.5z"/><path d="M22.5 6c-1.5 1.5-3 3-3 5.5 0 3 1.5 4.5 3 6 1.5-1.5 3-3 3-6 0-2.5-1.5-4-3-5.5z"/><path d="M15 31c2.5-2.5 12.5-2.5 15 0 .5 3.5 0 7.5 0 7.5-3.5-1-11.5-1-15 0 0 0 .5-4 0-7.5z"/><path d="M22.5 25c-2 0-2.5 2-2.5 2 0 2.5 1 3.5 2.5 3.5s2.5-1 2.5-3.5c0 0-.5-2-2.5-2z"/></g><path d="M22.5 19v4M20 22h5" stroke-linejoin="miter"/></g></svg>',
        wN: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="none" stroke="#2b2b2b" stroke-width="1.5" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.02 4-2 6-2 6-2 0-3-1-3-1 2-2 3-5 5-5z" fill="#fff"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#2b2b2b"/><path d="M15 15.5a.5 1.5 0 1 1-1 0 .5 1.5 0 1 1 1 0z" fill="#2b2b2b" transform="matrix(.866 .5 -.5 .866 9.693 -5.173)"/></g></svg>',
        wP: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3.04 2.71-4.91 6.93-4.91 11.47h18c0-4.54-1.87-8.76-4.91-11.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#2b2b2b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        bK: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="none" stroke="#f5f5f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#262421" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-3.5-9-3.5-11.5 0V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7" fill="#262421"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>',
        bQ: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="#262421" stroke="#f5f5f5" stroke-width="1.5" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="14" cy="9" r="2.5"/><circle cx="22.5" cy="8" r="2.5"/><circle cx="31" cy="9" r="2.5"/><circle cx="39" cy="12" r="2.5"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/></g></svg>',
        bR: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="#262421" stroke="#f5f5f5" stroke-width="1.5" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17" stroke-linecap="butt"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none" stroke-linejoin="miter"/></g></svg>',
        bB: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="none" stroke="#f5f5f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#262421" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.66.43 13.5-3.5 2.84 3.93 10.11 2.53 13.5 3.5 0 0 1.65.49 3 2.5-3.04.97-9.5-.5-12 1.5-1.04 1-1.5 4-4.5 4s-3.46-3-4.5-4c-2.5-2-8.96-.53-12-1.5 1.35-2.01 3-2.5 3-2.5z"/><path d="M22.5 6c-1.5 1.5-3 3-3 5.5 0 3 1.5 4.5 3 6 1.5-1.5 3-3 3-6 0-2.5-1.5-4-3-5.5z"/><path d="M15 31c2.5-2.5 12.5-2.5 15 0 .5 3.5 0 7.5 0 7.5-3.5-1-11.5-1-15 0 0 0 .5-4 0-7.5z"/><path d="M22.5 25c-2 0-2.5 2-2.5 2 0 2.5 1 3.5 2.5 3.5s2.5-1 2.5-3.5c0 0-.5-2-2.5-2z"/></g><path d="M22.5 19v4M20 22h5" stroke-linejoin="miter"/></g></svg>',
        bN: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><g fill="none" stroke="#f5f5f5" stroke-width="1.5" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#262421"/><path d="M24 18c.02 4-2 6-2 6-2 0-3-1-3-1 2-2 3-5 5-5z" fill="#262421"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z" fill="#f5f5f5"/><path d="M15 15.5a.5 1.5 0 1 1-1 0 .5 1.5 0 1 1 1 0z" fill="#f5f5f5" transform="matrix(.866 .5 -.5 .866 9.693 -5.173)"/></g></svg>',
        bP: '<svg viewBox="0 0 45 45" width="100%" height="100%" shape-rendering="geometricPrecision"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3.04 2.71-4.91 6.93-4.91 11.47h18c0-4.54-1.87-8.76-4.91-11.47C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#262421" stroke="#f5f5f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };

    const PIECE_VALUE = { '': 0, P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
    const FILES = ['a','b','c','d','e','f','g','h'];

    function initialBoard() {
        return [
            ['bR','bN','bB','bQ','bK','bB','bN','bR'],
            ['bP','bP','bP','bP','bP','bP','bP','bP'],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['wP','wP','wP','wP','wP','wP','wP','wP'],
            ['wR','wN','wB','wQ','wK','wB','wN','wR']
        ];
    }

    function defaultData() {
        return {
            board: initialBoard(),
            turn: 'w',
            selected: null,
            legalMoves: [],
            history: [],
            capturedByWhite: [],
            capturedByBlack: [],
            lastMove: null,
            flipped: false,
            status: 'playing',
            moveCount: 0
        };
    }

    function migrateOld() {
        const old = JSON.parse(localStorage.getItem('macos_chess') || 'null');
        if (!old || typeof old !== 'object') return null;
        const d = defaultData();
        if (Array.isArray(old.board) && old.board.length === 8) d.board = old.board;
        if (old.turn === 'w' || old.turn === 'b') d.turn = old.turn;
        if (Array.isArray(old.capturedByWhite)) d.capturedByWhite = old.capturedByWhite;
        if (Array.isArray(old.capturedByBlack)) d.capturedByBlack = old.capturedByBlack;
        d.flipped = !!old.flipped;
        d.lastMove = old.lastMove || null;
        d.status = old.status || 'playing';
        return d;
    }

    let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || migrateOld() || defaultData();
    // Repair any missing fields after migration
    if (!Array.isArray(data.board) || data.board.length !== 8) data.board = initialBoard();
    if (!Array.isArray(data.history)) data.history = [];
    if (!Array.isArray(data.capturedByWhite)) data.capturedByWhite = [];
    if (!Array.isArray(data.capturedByBlack)) data.capturedByBlack = [];
    if (!Array.isArray(data.legalMoves)) data.legalMoves = [];
    if (data.status !== 'playing' && data.status !== 'check' && data.status !== 'checkmate' && data.status !== 'stalemate') {
        data.status = 'playing';
    }

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    function showToast(text, type) {
        if (window.toast) window.toast(text, type || 'info');
        else if (window.Toast) window.Toast.show(text);
    }

    // ============ Chess rules ============
    function colorOf(piece) { return piece ? piece[0] : ''; }
    function typeOf(piece) { return piece ? piece[1] : ''; }
    function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
    function cloneBoard(b) { return b.map(row => row.slice()); }
    function squareName(r, c) { return FILES[c] + (8 - r); }
    function pieceLetter(piece, capture) {
        const t = typeOf(piece);
        if (t === 'P') return capture ? FILES[capture.c] : '';
        return t;
    }

    function pseudoMoves(b, r, c) {
        const piece = b[r][c];
        const color = colorOf(piece);
        const type = typeOf(piece);
        const moves = [];
        const slide = (deltas) => {
            deltas.forEach(([dr, dc]) => {
                let nr = r + dr, nc = c + dc;
                while (inBounds(nr, nc)) {
                    const target = b[nr][nc];
                    if (!target) {
                        moves.push({ r: nr, c: nc });
                    } else {
                        if (colorOf(target) !== color) moves.push({ r: nr, c: nc, capture: target });
                        break;
                    }
                    nr += dr; nc += dc;
                }
            });
        };
        const step = (deltas) => {
            deltas.forEach(([dr, dc]) => {
                const nr = r + dr, nc = c + dc;
                if (!inBounds(nr, nc)) return;
                const target = b[nr][nc];
                if (!target) moves.push({ r: nr, c: nc });
                else if (colorOf(target) !== color) moves.push({ r: nr, c: nc, capture: target });
            });
        };
        if (type === 'P') {
            const dir = color === 'w' ? -1 : 1;
            const startRow = color === 'w' ? 6 : 1;
            const oneR = r + dir;
            if (inBounds(oneR, c) && !b[oneR][c]) {
                moves.push({ r: oneR, c });
                const twoR = r + 2 * dir;
                if (r === startRow && !b[twoR][c]) moves.push({ r: twoR, c });
            }
            [-1, 1].forEach(dc => {
                const nr = r + dir, nc = c + dc;
                if (!inBounds(nr, nc)) return;
                const target = b[nr][nc];
                if (target && colorOf(target) !== color) moves.push({ r: nr, c: nc, capture: target });
            });
        } else if (type === 'N') {
            step([[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]);
        } else if (type === 'B') {
            slide([[-1,-1],[-1,1],[1,-1],[1,1]]);
        } else if (type === 'R') {
            slide([[-1,0],[1,0],[0,-1],[0,1]]);
        } else if (type === 'Q') {
            slide([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
        } else if (type === 'K') {
            step([[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]);
        }
        return moves;
    }

    function findKing(b, color) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (b[r][c] === color + 'K') return { r, c };
            }
        }
        return null;
    }

    function isSquareAttacked(b, r, c, byColor) {
        for (let rr = 0; rr < 8; rr++) {
            for (let cc = 0; cc < 8; cc++) {
                const p = b[rr][cc];
                if (!p || colorOf(p) !== byColor) continue;
                const moves = pseudoMoves(b, rr, cc);
                if (moves.some(m => m.r === r && m.c === c)) return true;
            }
        }
        return false;
    }

    function isInCheck(b, color) {
        const king = findKing(b, color);
        if (!king) return false;
        return isSquareAttacked(b, king.r, king.c, color === 'w' ? 'b' : 'w');
    }

    function legalMovesFor(b, r, c) {
        const piece = b[r][c];
        if (!piece) return [];
        const color = colorOf(piece);
        const pseudo = pseudoMoves(b, r, c);
        return pseudo.filter(m => {
            const nb = cloneBoard(b);
            nb[m.r][m.c] = piece;
            nb[r][c] = '';
            // Auto-queen promotion for legality check
            if (typeOf(piece) === 'P' && (m.r === 0 || m.r === 7)) {
                nb[m.r][m.c] = color + 'Q';
            }
            return !isInCheck(nb, color);
        });
    }

    function hasAnyLegalMove(b, color) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = b[r][c];
                if (!p || colorOf(p) !== color) continue;
                if (legalMovesFor(b, r, c).length > 0) return true;
            }
        }
        return false;
    }

    function updateStatus() {
        const inCheck = isInCheck(data.board, data.turn);
        const hasMoves = hasAnyLegalMove(data.board, data.turn);
        if (!hasMoves) {
            data.status = inCheck ? 'checkmate' : 'stalemate';
        } else {
            data.status = inCheck ? 'check' : 'playing';
        }
    }

    function moveToNotation(piece, from, to, capture, promoted) {
        const file = (n) => FILES[n];
        const rank = (r) => 8 - r;
        const t = typeOf(piece);
        if (t === 'K' && Math.abs(to.c - from.c) === 2) {
            return to.c > from.c ? 'O-O' : 'O-O-O';
        }
        const dest = file(to.c) + rank(to.r);
        if (t === 'P') {
            let s = capture ? file(from.c) + 'x' + dest : dest;
            if (promoted) s += '=Q';
            return s;
        }
        return t + (capture ? 'x' : '') + dest;
    }

    // ============ Rendering ============
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getDisplayRow(r) { return data.flipped ? 7 - r : r; }
    function getDisplayCol(c) { return data.flipped ? 7 - c : c; }
    function getDisplaySquare(r, c) {
        // inverse mapping from display to actual board indices
        return { r: data.flipped ? 7 - r : r, c: data.flipped ? 7 - c : c };
    }

    function renderToolbar() {
        if (!toolbar) return;
        const canUndo = data.history.length > 0 && data.status !== 'checkmate' && data.status !== 'stalemate';
        toolbar.innerHTML = `
            <div class="chess-toolbar">
                <button class="chess-tb-btn" id="chess-new" title="新棋局">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9"/><polyline points="21 3 21 9 15 9"/></svg>
                    <span>新棋局</span>
                </button>
                <button class="chess-tb-btn" id="chess-undo" ${!canUndo ? 'disabled' : ''} title="悔棋">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                    <span>悔棋</span>
                </button>
                <button class="chess-tb-btn" id="chess-flip" title="翻转棋盘">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                    <span>翻转棋盘</span>
                </button>
                <div class="chess-tb-sep"></div>
                <div class="chess-tb-turn" data-turn="${data.turn}">
                    <span class="chess-tb-turn-dot" style="background:${data.turn === 'w' ? '#fff' : '#262421'};"></span>
                    <span>${data.turn === 'w' ? '白方' : '黑方'} 回合</span>
                </div>
                <div style="flex:1;"></div>
                <span class="chess-tb-move-count">第 ${Math.floor(data.history.length / 2) + 1} 步</span>
            </div>
        `;
        toolbar.querySelector('#chess-new')?.addEventListener('click', async () => {
            if (data.history.length > 0) {
                const ok = await window.showConfirm('开始新棋局吗？', {
                    subtitle: '当前对局的进度将丢失。',
                    confirmText: '新棋局',
                    danger: true
                });
                if (!ok) return;
            }
            data = defaultData();
            save();
            render();
            showToast('新棋局已开始', 'success');
        });
        toolbar.querySelector('#chess-undo')?.addEventListener('click', () => {
            if (!data.history.length) return;
            const last = data.history.pop();
            // Undo move
            data.board[last.from.r][last.from.c] = last.piece;
            data.board[last.to.r][last.to.c] = last.captured || '';
            // Undo promotion
            if (last.promoted) {
                data.board[last.from.r][last.from.c] = colorOf(last.piece) + 'P';
            }
            data.turn = last.turn;
            data.selected = null;
            data.legalMoves = [];
            data.lastMove = data.history.length ? data.history[data.history.length - 1].movePair : null;
            updateStatus();
            save();
            render();
        });
        toolbar.querySelector('#chess-flip')?.addEventListener('click', () => {
            data.flipped = !data.flipped;
            save();
            render();
        });
    }

    function renderSidebar() {
        if (!sidebar) return;
        const capturedByWhite = data.capturedByWhite;
        const capturedByBlack = data.capturedByBlack;
        const whiteValue = capturedByWhite.reduce((s, p) => s + (PIECE_VALUE[typeOf(p)] || 0), 0);
        const blackValue = capturedByBlack.reduce((s, p) => s + (PIECE_VALUE[typeOf(p)] || 0), 0);
        const advantage = whiteValue - blackValue;
        const statusText = {
            playing: '对局进行中',
            check: '将军！',
            checkmate: data.turn === 'w' ? '黑方胜利' : '白方胜利',
            stalemate: '和棋（逼和）'
        }[data.status];
        const statusIcon = {
            playing: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
            check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            checkmate: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>',
            stalemate: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
        }[data.status];

        // Build move history pairs (white/black)
        const pairs = [];
        for (let i = 0; i < data.history.length; i += 2) {
            pairs.push({ num: i / 2 + 1, white: data.history[i], black: data.history[i + 1] });
        }

        sidebar.innerHTML = `
            <div class="chess-sidebar">
                <div class="chess-status ${data.status}">
                    <span class="chess-status-icon">${statusIcon}</span>
                    <div class="chess-status-text">
                        <div class="chess-status-title">${statusText}</div>
                        <div class="chess-status-sub">${data.history.length} 着已走</div>
                    </div>
                </div>

                <div class="chess-captured">
                    <div class="chess-captured-row">
                        <span class="chess-captured-label">白方</span>
                        <div class="chess-captured-pieces">
                            ${capturedByWhite.map(p => `<span class="chess-captured-piece white">${PIECE_SVG[p] ? PIECE_SVG[p].replace('width="100%" height="100%"', 'width="22" height="22"') : ''}</span>`).join('')}
                        </div>
                        ${advantage > 0 ? `<span class="chess-advantage">+${advantage}</span>` : ''}
                    </div>
                    <div class="chess-captured-row">
                        <span class="chess-captured-label">黑方</span>
                        <div class="chess-captured-pieces">
                            ${capturedByBlack.map(p => `<span class="chess-captured-piece black">${PIECE_SVG[p] ? PIECE_SVG[p].replace('width="100%" height="100%"', 'width="22" height="22"') : ''}</span>`).join('')}
                        </div>
                        ${advantage < 0 ? `<span class="chess-advantage">+${-advantage}</span>` : ''}
                    </div>
                </div>

                <div class="chess-history">
                    <div class="chess-history-head">
                        <span class="chess-history-title">着法记录</span>
                        <span class="chess-history-count">${data.history.length}</span>
                    </div>
                    <div class="chess-history-list" id="chess-history-list">
                        ${pairs.length === 0
                            ? `<div class="chess-history-empty">尚未走子</div>`
                            : pairs.map(p => `
                                <div class="chess-history-pair">
                                    <span class="chess-history-num">${p.num}.</span>
                                    <span class="chess-history-move ${data.history.length - 1 === (p.num - 1) * 2 ? 'last' : ''}">${p.white ? p.white.notation : ''}</span>
                                    <span class="chess-history-move ${data.history.length - 1 === (p.num - 1) * 2 + 1 ? 'last' : ''}">${p.black ? p.black.notation : ''}</span>
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Auto-scroll to bottom of history
        setTimeout(() => {
            const list = sidebar.querySelector('#chess-history-list');
            if (list) list.scrollTop = list.scrollHeight;
        }, 0);
    }

    function renderContent() {
        body.className = 'window-body app-content chess-body';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';

        const lastMove = data.lastMove;
        const kingInCheck = (data.status === 'check' || data.status === 'checkmate') ? findKing(data.board, data.turn) : null;

        body.innerHTML = `
            <div class="chess-board-wrap">
                <div class="chess-rank-labels">
                    ${Array.from({ length: 8 }, (_, i) => {
                        const r = data.flipped ? i : 7 - i;
                        return `<span>${8 - r}</span>`;
                    }).join('')}
                </div>
                <div class="chess-board-inner">
                    <div class="chess-grid">
                        ${Array.from({ length: 8 }, (_, dr) =>
                            Array.from({ length: 8 }, (_, dc) => {
                                const actual = getDisplaySquare(dr, dc);
                                const r = actual.r, c = actual.c;
                                const piece = data.board[r][c];
                                const isLight = (r + c) % 2 === 0;
                                const isSelected = data.selected && data.selected.r === r && data.selected.c === c;
                                const isLegal = data.legalMoves.some(m => m.r === r && m.c === c);
                                const isCapture = isLegal && piece;
                                const isLastFrom = lastMove && lastMove.from.r === r && lastMove.from.c === c;
                                const isLastTo = lastMove && lastMove.to.r === r && lastMove.to.c === c;
                                const isCheck = kingInCheck && kingInCheck.r === r && kingInCheck.c === c;
                                return `
                                    <div class="chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isLastFrom ? 'last-from' : ''} ${isLastTo ? 'last-to' : ''} ${isCheck ? 'check' : ''}"
                                         data-r="${r}" data-c="${c}">
                                        ${piece ? `<div class="chess-piece ${colorOf(piece)}">${PIECE_SVG[piece] || ''}</div>` : ''}
                                        ${isLegal ? `<div class="chess-hint ${isCapture ? 'capture' : ''}"></div>` : ''}
                                    </div>
                                `;
                            }).join('')
                        ).join('')}
                    </div>
                    <div class="chess-file-labels">
                        ${Array.from({ length: 8 }, (_, i) => {
                            const c = data.flipped ? 7 - i : i;
                            return `<span>${FILES[c]}</span>`;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        body.querySelectorAll('.chess-square').forEach(sq => {
            sq.addEventListener('click', () => {
                if (data.status === 'checkmate' || data.status === 'stalemate') return;
                const r = parseInt(sq.dataset.r, 10);
                const c = parseInt(sq.dataset.c, 10);
                const piece = data.board[r][c];

                if (data.selected) {
                    const move = data.legalMoves.find(m => m.r === r && m.c === c);
                    if (move) {
                        makeMove(data.selected.r, data.selected.c, r, c);
                        return;
                    }
                    if (piece && colorOf(piece) === data.turn) {
                        selectPiece(r, c);
                    } else {
                        data.selected = null;
                        data.legalMoves = [];
                        renderContent();
                    }
                } else {
                    if (piece && colorOf(piece) === data.turn) {
                        selectPiece(r, c);
                    }
                }
            });
        });
    }

    function selectPiece(r, c) {
        data.selected = { r, c };
        data.legalMoves = legalMovesFor(data.board, r, c);
        renderContent();
    }

    function makeMove(fromR, fromC, toR, toC) {
        const piece = data.board[fromR][fromC];
        const captured = data.board[toR][toC];
        const isCastle = typeOf(piece) === 'K' && Math.abs(toC - fromC) === 2;
        let promoted = false;

        // Save move state for undo
        const moveRecord = {
            from: { r: fromR, c: fromC },
            to: { r: toR, c: toC },
            piece,
            captured: captured || null,
            turn: data.turn,
            notation: '',
            movePair: { from: { r: fromR, c: fromC }, to: { r: toR, c: toC } }
        };

        // Move piece
        data.board[toR][toC] = piece;
        data.board[fromR][fromC] = '';

        // Castling: move the rook
        if (isCastle) {
            if (toC > fromC) {
                // Kingside
                data.board[toR][toC - 1] = data.board[toR][7];
                data.board[toR][7] = '';
            } else {
                // Queenside
                data.board[toR][toC + 1] = data.board[toR][0];
                data.board[toR][0] = '';
            }
        }

        // Pawn promotion
        if (typeOf(piece) === 'P' && (toR === 0 || toR === 7)) {
            data.board[toR][toC] = colorOf(piece) + 'Q';
            promoted = true;
        }

        // Track captured pieces
        if (captured) {
            if (colorOf(captured) === 'w') data.capturedByWhite.push(captured);
            else data.capturedByBlack.push(captured);
            // If capturing a rook on its home square, that's fine for our simulation
        }

        moveRecord.promoted = promoted;
        moveRecord.notation = moveToNotation(piece, { r: fromR, c: fromC }, { r: toR, c: toC }, captured, promoted);

        data.history.push(moveRecord);
        data.lastMove = moveRecord.movePair;
        data.selected = null;
        data.legalMoves = [];
        data.turn = data.turn === 'w' ? 'b' : 'w';
        data.moveCount++;

        updateStatus();

        // Add check/checkmate marker to notation
        if (data.status === 'checkmate') moveRecord.notation += '#';
        else if (data.status === 'check') moveRecord.notation += '+';

        save();
        render();

        if (data.status === 'checkmate') {
            const winner = data.turn === 'w' ? '黑方' : '白方';
            showToast(`${winner}获胜！`, 'success');
        } else if (data.status === 'stalemate') {
            showToast('和棋（逼和）', 'info');
        } else if (data.status === 'check') {
            showToast('将军！', 'warning');
        }
    }

    function render() {
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    // Cleanup any timers when window closes
    if (windowId) {
        const cleanupKey = `chess_cleanup_${windowId}`;
        if (window[cleanupKey]) window[cleanupKey]();
        window[cleanupKey] = () => {};
    }

    render();
};
