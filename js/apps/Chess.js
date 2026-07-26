window.renderChess = function(body, sidebar, toolbar, windowId) {
    const pieces = {
        wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
        bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
    };

    let board = [
        ['bR','bN','bB','bQ','bK','bB','bN','bR'],
        ['bP','bP','bP','bP','bP','bP','bP','bP'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['wP','wP','wP','wP','wP','wP','wP','wP'],
        ['wR','wN','wB','wQ','wK','wB','wN','wR']
    ];
    let selected = null;
    let currentTurn = 'w';
    let capturedByWhite = [];
    let capturedByBlack = [];

    function renderContent() {
        body.innerHTML = `
            <div class="chess-board">
                <div style="display:flex;flex-direction:column;gap:16px;align-items:center;">
                    <div style="font-size:14px;color:var(--text-tertiary);">
                        ${currentTurn === 'w' ? '白方' : '黑方'}回合
                    </div>
                    <div style="display:flex;gap:8px;font-size:20px;min-height:30px;">
                        ${currentTurn === 'w' ? capturedByBlack.map(p => pieces[p]).join('') : capturedByWhite.map(p => pieces[p]).join('')}
                    </div>
                    <div class="chess-grid">
                        ${board.map((row, r) => row.map((piece, c) => {
                            const isLight = (r + c) % 2 === 0;
                            const isSelected = selected && selected.r === r && selected.c === c;
                            return `
                                <div class="chess-square ${isLight ? 'light' : 'dark'}" data-r="${r}" data-c="${c}" style="${isSelected ? 'box-shadow:inset 0 0 0 3px var(--accent-blue);' : ''}">
                                    ${piece ? pieces[piece] : ''}
                                </div>
                            `;
                        }).join('')).join('')}
                    </div>
                    <div style="display:flex;gap:8px;font-size:20px;min-height:30px;">
                        ${currentTurn === 'w' ? capturedByWhite.map(p => pieces[p]).join('') : capturedByBlack.map(p => pieces[p]).join('')}
                    </div>
                    <button id="reset-btn" style="padding:8px 20px;border:1px solid var(--border-color);background:var(--button-bg);border-radius:6px;cursor:pointer;font-size:13px;">重新开始</button>
                </div>
            </div>
        `;

        body.querySelectorAll('.chess-square').forEach(square => {
            square.addEventListener('click', () => {
                const r = parseInt(square.dataset.r);
                const c = parseInt(square.dataset.c);
                const piece = board[r][c];

                if (selected) {
                    if (piece && piece[0] === currentTurn) {
                        selected = { r, c };
                    } else {
                        const movingPiece = board[selected.r][selected.c];
                        if (piece) {
                            if (piece[0] === 'w') capturedByWhite.push(piece);
                            else capturedByBlack.push(piece);
                        }
                        board[r][c] = movingPiece;
                        board[selected.r][selected.c] = '';
                        selected = null;
                        currentTurn = currentTurn === 'w' ? 'b' : 'w';
                    }
                } else {
                    if (piece && piece[0] === currentTurn) {
                        selected = { r, c };
                    }
                }
                renderContent();
            });
        });

        body.querySelector('#reset-btn').addEventListener('click', () => {
            board = [
                ['bR','bN','bB','bQ','bK','bB','bN','bR'],
                ['bP','bP','bP','bP','bP','bP','bP','bP'],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['wP','wP','wP','wP','wP','wP','wP','wP'],
                ['wR','wN','wB','wQ','wK','wB','wN','wR']
            ];
            selected = null;
            currentTurn = 'w';
            capturedByWhite = [];
            capturedByBlack = [];
            renderContent();
        });
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderContent();
    }

    render();
};
