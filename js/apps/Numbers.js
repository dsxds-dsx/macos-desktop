// Numbers - 电子表格 (macOS Sonoma)
window.renderNumbers = function(body, sidebar, toolbar, windowId) {
    const STORAGE_KEY = 'macos_numbers_v2';
    const STATE_KEY = STORAGE_KEY + '_state';

    function defaultSheets() {
        return ['预算表', '销售数据', '库存清单'];
    }

    function defaultData() {
        return {
            '预算表': [
                ['项目', '一月', '二月', '三月', '总计'],
                ['收入', '15000', '16500', '17200', '=B2+C2+D2'],
                ['支出', '8500', '9200', '8800', '=B3+C3+D3'],
                ['利润', '=B2-B3', '=C2-C3', '=D2-D3', '=E2-E3'],
                ['税费', '=B4*0.2', '=C4*0.2', '=D4*0.2', '=E4*0.2']
            ],
            '销售数据': [
                ['产品', 'Q1', 'Q2', 'Q3', 'Q4'],
                ['MacBook', '1200', '1350', '1580', '2100'],
                ['iPhone', '4500', '5200', '6100', '8900'],
                ['iPad', '2800', '3100', '3500', '4200']
            ],
            '库存清单': [
                ['商品', '数量', '单价', '总价'],
                ['笔记本', '156', '5999', '=B2*C2'],
                ['鼠标', '342', '299', '=B3*C3'],
                ['键盘', '198', '599', '=B4*C4']
            ]
        };
    }

    function defaultState() {
        return { currentSheet: '预算表' };
    }

    function migrateOld() {
        const oldSheets = JSON.parse(localStorage.getItem('numbers_sheets') || 'null');
        const oldData = JSON.parse(localStorage.getItem('numbers_data') || 'null');
        const oldCurrent = localStorage.getItem('numbers_sheet');
        if (!Array.isArray(oldSheets) || !oldData) return null;
        return {
            sheets: oldSheets,
            data: oldData,
            state: { currentSheet: oldCurrent || oldSheets[0] }
        };
    }

    let sheets, cellData, state;
    const migrated = migrateOld();
    sheets = JSON.parse(localStorage.getItem(STORAGE_KEY + '_sheets') || 'null') || (migrated ? migrated.sheets : null) || defaultSheets();
    cellData = JSON.parse(localStorage.getItem(STORAGE_KEY + '_data') || 'null') || (migrated ? migrated.data : null) || defaultData();
    state = JSON.parse(localStorage.getItem(STATE_KEY) || 'null') || (migrated ? migrated.state : null) || defaultState();
    if (!sheets.includes(state.currentSheet)) state.currentSheet = sheets[0];

    function save() {
        localStorage.setItem(STORAGE_KEY + '_sheets', JSON.stringify(sheets));
        localStorage.setItem(STORAGE_KEY + '_data', JSON.stringify(cellData));
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    }
    function showToast(text, type) {
        if (window.toast) window.toast(text, type || 'info');
        else if (window.Toast) window.Toast.show(text);
    }
    function escapeHtml(s) {
        if (s == null) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function getCellDisplay(row, col) {
        const val = cellData[state.currentSheet]?.[row]?.[col] || '';
        if (typeof val === 'string' && val.startsWith('=')) {
            try {
                const formula = val.substring(1).replace(/([A-Z])(\d+)/g, (match, colLetter, rowNum) => {
                    const colIdx = colLetter.charCodeAt(0) - 65;
                    const rowIdx = parseInt(rowNum) - 1;
                    const cellVal = cellData[state.currentSheet]?.[rowIdx]?.[colIdx];
                    if (cellVal && !isNaN(parseFloat(cellVal))) return cellVal;
                    return '0';
                });
                return eval(formula).toString();
            } catch { return '#ERR'; }
        }
        return val;
    }

    // ----- SVG icons -----
    const ICON = {
        add: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
        addRow: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>',
        addCol: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 8l-5 5 5 5M17 8l5 5-5 5" transform="rotate(90 12 12)"/></svg>',
        chart: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></svg>',
        delete: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        duplicate: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
        table: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
        sort: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M6 12h12M9 18h6"/></svg>'
    };

    function renderToolbar() {
        if (!toolbar) return;
        toolbar.innerHTML = `
            <div class="nums-toolbar">
                <button class="nums-tb-btn" id="nums-addSheet" title="新建表格">${ICON.add}<span>新建表格</span></button>
                <button class="nums-tb-btn" id="nums-addRow" title="添加行">${ICON.addRow}<span>添加行</span></button>
                <button class="nums-tb-btn" id="nums-addCol" title="添加列">${ICON.addCol}<span>添加列</span></button>
                <div class="nums-tb-sep"></div>
                <button class="nums-tb-btn" id="nums-duplicate" title="复制表格">${ICON.duplicate}</button>
                <button class="nums-tb-btn danger" id="nums-deleteSheet" title="删除表格" ${sheets.length <= 1 ? 'disabled' : ''}>${ICON.delete}</button>
                <div style="flex:1;"></div>
                <button class="nums-tb-btn primary" id="nums-chart" title="生成图表">${ICON.chart}<span>图表</span></button>
            </div>
        `;
        toolbar.querySelector('#nums-addSheet')?.addEventListener('click', async () => {
            const name = await window.showPrompt('新表格名称：', { value: '新表格 ' + (sheets.length + 1) });
            if (name && !sheets.includes(name)) {
                sheets.push(name);
                cellData[name] = [['列1', '列2', '列3']];
                state.currentSheet = name;
                save();
                render();
                showToast('已创建表格：' + name, 'success');
            }
        });
        toolbar.querySelector('#nums-addRow')?.addEventListener('click', () => {
            if (!cellData[state.currentSheet]) cellData[state.currentSheet] = [];
            const maxCols = Math.max(...cellData[state.currentSheet].map(r => r.length), 1);
            cellData[state.currentSheet].push(new Array(maxCols).fill(''));
            save();
            renderContent();
        });
        toolbar.querySelector('#nums-addCol')?.addEventListener('click', () => {
            if (!cellData[state.currentSheet]) cellData[state.currentSheet] = [];
            cellData[state.currentSheet].forEach(row => {
                while (row.length < Math.max(...cellData[state.currentSheet].map(r => r.length))) row.push('');
                row.push('');
            });
            save();
            renderContent();
        });
        toolbar.querySelector('#nums-duplicate')?.addEventListener('click', () => {
            const newName = state.currentSheet + ' 副本';
            if (!sheets.includes(newName)) {
                sheets.push(newName);
                cellData[newName] = JSON.parse(JSON.stringify(cellData[state.currentSheet] || []));
                state.currentSheet = newName;
                save();
                render();
                showToast('已复制表格', 'success');
            }
        });
        toolbar.querySelector('#nums-deleteSheet')?.addEventListener('click', async () => {
            if (sheets.length <= 1) return;
            const ok = await window.showConfirm('删除此表格吗？', {
                subtitle: '表格「' + state.currentSheet + '」将被永久删除。',
                confirmText: '删除',
                danger: true
            });
            if (!ok) return;
            const idx = sheets.indexOf(state.currentSheet);
            sheets.splice(idx, 1);
            delete cellData[state.currentSheet];
            state.currentSheet = sheets[Math.max(0, idx - 1)];
            save();
            render();
            showToast('已删除表格', 'success');
        });
        toolbar.querySelector('#nums-chart')?.addEventListener('click', () => {
            showToast('图表功能演示中', 'info');
        });
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div class="nums-sidebar">
                <div class="nums-sidebar-head">
                    <span class="nums-sidebar-title">表格</span>
                    <span class="nums-sidebar-count">${sheets.length}</span>
                </div>
                <div class="nums-sheets-list" id="nums-sheets-list">
                    ${sheets.map(name => `
                        <div class="nums-sheet-item ${state.currentSheet === name ? 'active' : ''}" data-sheet="${escapeHtml(name)}">
                            ${ICON.table}
                            <span class="nums-sheet-name">${escapeHtml(name)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        sidebar.querySelectorAll('[data-sheet]').forEach(el => {
            el.addEventListener('click', () => {
                state.currentSheet = el.dataset.sheet;
                save();
                render();
            });
        });
    }

    function renderContent() {
        const data = cellData[state.currentSheet] || [];
        const maxCols = Math.max(...data.map(r => r.length), 5);

        let theadHtml = `<tr><th class="nums-corner"></th>`;
        for (let c = 0; c < maxCols; c++) {
            theadHtml += `<th class="nums-col-head">${String.fromCharCode(65 + c)}</th>`;
        }
        theadHtml += '</tr>';

        let tbodyHtml = '';
        data.forEach((row, ri) => {
            tbodyHtml += `<tr><td class="nums-row-head">${ri + 1}</td>`;
            for (let c = 0; c < maxCols; c++) {
                const val = row[c] || '';
                const display = getCellDisplay(ri, c);
                const isFormula = typeof val === 'string' && val.startsWith('=');
                const isNumber = !isNaN(parseFloat(display)) && display !== '' && !isFormula;
                tbodyHtml += `<td class="nums-cell-wrap" data-row="${ri}" data-col="${c}">
                    <input class="nums-cell ${isFormula ? 'formula' : ''} ${isNumber ? 'numeric' : ''}" value="${escapeHtml(val)}" data-row="${ri}" data-col="${c}" />
                </td>`;
            }
            tbodyHtml += '</tr>';
        });
        tbodyHtml += `<tr><td colspan="${maxCols + 1}" class="nums-add-row" id="nums-addRowInline">${ICON.addRow}<span>添加行</span></td></tr>`;

        body.innerHTML = `
            <div class="nums-body">
                <div class="nums-content-scroll">
                    <div class="nums-table-wrap">
                        <table class="nums-table">
                            <thead>${theadHtml}</thead>
                            <tbody>${tbodyHtml}</tbody>
                        </table>
                    </div>
                </div>
                <div class="nums-status-bar">
                    <span>${data.length} 行 × ${maxCols} 列</span>
                    <span class="nums-status-sep">·</span>
                    <span>${state.currentSheet}</span>
                </div>
            </div>
        `;

        body.querySelectorAll('.nums-cell').forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.nums-cell-wrap')?.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.closest('.nums-cell-wrap')?.classList.remove('focused');
                const ri = parseInt(input.dataset.row, 10);
                const c = parseInt(input.dataset.col, 10);
                if (!cellData[state.currentSheet]) cellData[state.currentSheet] = [];
                if (!cellData[state.currentSheet][ri]) cellData[state.currentSheet][ri] = [];
                if (cellData[state.currentSheet][ri][c] !== input.value) {
                    cellData[state.currentSheet][ri][c] = input.value;
                    save();
                    renderContent();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    input.blur();
                }
            });
        });
        body.querySelector('#nums-addRowInline')?.addEventListener('click', () => {
            if (!cellData[state.currentSheet]) cellData[state.currentSheet] = [];
            const mc = Math.max(...cellData[state.currentSheet].map(r => r.length), 1);
            cellData[state.currentSheet].push(new Array(mc).fill(''));
            save();
            renderContent();
        });
    }

    function render() {
        body.className = 'window-body app-content nums-app';
        body.style.display = 'flex';
        renderToolbar();
        renderSidebar();
        renderContent();
    }

    render();
};
