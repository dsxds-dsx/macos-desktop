window.renderNumbers = function(body, sidebar, toolbar, windowId) {
    const content = body;
    content.innerHTML = '';
    content.style.background = '#fff';

    let currentSheet = localStorage.getItem('numbers_sheet') || '预算表';
    let sheets = JSON.parse(localStorage.getItem('numbers_sheets') || JSON.stringify(['预算表', '销售数据', '库存清单']));

    const defaultData = {
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

    let cellData = JSON.parse(localStorage.getItem('numbers_data') || JSON.stringify(defaultData));

    function saveData() {
        localStorage.setItem('numbers_sheet', currentSheet);
        localStorage.setItem('numbers_sheets', JSON.stringify(sheets));
        localStorage.setItem('numbers_data', JSON.stringify(cellData));
    }

    function getCellDisplay(row, col) {
        const val = cellData[currentSheet]?.[row]?.[col] || '';
        if (typeof val === 'string' && val.startsWith('=')) {
            try {
                const formula = val.substring(1).replace(/([A-Z])(\d+)/g, (match, colLetter, rowNum) => {
                    const colIdx = colLetter.charCodeAt(0) - 65;
                    const rowIdx = parseInt(rowNum) - 1;
                    const cellVal = cellData[currentSheet]?.[rowIdx]?.[colIdx];
                    if (cellVal && !isNaN(parseFloat(cellVal))) return cellVal;
                    return '0';
                });
                return eval(formula).toString();
            } catch { return '#ERR'; }
        }
        return val;
    }

    function render() {
        content.innerHTML = `
            <div class="numbers-toolbar" style="height:52px;background:linear-gradient(180deg,#fafafa,#f0f0f0);border-bottom:1px solid #ddd;display:flex;align-items:center;padding:0 16px;gap:12px;">
                <button class="tb-btn" id="nums-addSheet" style="padding:6px 12px;border:1px solid #ccc;border-radius:6px;background:#fff;cursor:pointer;">＋ 新建表格</button>
                <div class="nums-sheets" style="display:flex;gap:4px;margin-left:20px;" id="nums-sheetTabs"></div>
                <div style="flex:1;"></div>
                <button class="tb-btn" id="nums-chart" style="padding:6px 12px;border:none;border-radius:6px;background:var(--accent-blue);color:#fff;cursor:pointer;">📊 图表</button>
            </div>
            <div style="flex:1;overflow:auto;background:#f8f8f8;padding:20px;">
                <div style="background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);overflow:hidden;">
                    <table style="width:100%;border-collapse:collapse;" id="nums-table">
                        <thead id="nums-thead"></thead>
                        <tbody id="nums-tbody"></tbody>
                    </table>
                </div>
            </div>
        `;

        const tabsEl = content.querySelector('#nums-sheetTabs');
        sheets.forEach(sheet => {
            const tab = document.createElement('div');
            tab.className = 'nums-sheet-tab';
            tab.style.cssText = `padding:8px 16px;border-radius:6px;cursor:pointer;font-size:13px;${sheet === currentSheet ? 'background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.1);font-weight:500;' : 'background:transparent;'}`;
            tab.textContent = sheet;
            tab.onclick = () => { currentSheet = sheet; saveData(); render(); };
            tabsEl.appendChild(tab);
        });

        const thead = content.querySelector('#nums-thead');
        const tbody = content.querySelector('#nums-tbody');
        const data = cellData[currentSheet] || [];
        const maxCols = Math.max(...data.map(r => r.length), 5);

        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th style="width:50px;background:#f5f5f5;border:1px solid #e0e0e0;padding:8px;font-weight:600;font-size:12px;color:#666;"></th>`;
        for (let c = 0; c < maxCols; c++) {
            const th = document.createElement('th');
            th.style.cssText = 'min-width:100px;background:#f5f5f5;border:1px solid #e0e0e0;padding:8px;font-weight:600;font-size:12px;color:#666;text-align:center;';
            th.textContent = String.fromCharCode(65 + c);
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);

        data.forEach((row, ri) => {
            const tr = document.createElement('tr');
            const th = document.createElement('td');
            th.style.cssText = 'background:#f5f5f5;border:1px solid #e0e0e0;padding:8px;font-weight:600;font-size:12px;color:#666;text-align:center;';
            th.textContent = ri + 1;
            tr.appendChild(th);

            for (let c = 0; c < maxCols; c++) {
                const td = document.createElement('td');
                td.style.cssText = 'border:1px solid #e0e0e0;padding:0;';
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'nums-cell';
                input.style.cssText = 'width:100%;border:none;padding:8px 10px;font-size:13px;outline:none;background:transparent;box-sizing:border-box;';
                input.value = row[c] || '';
                input.dataset.row = ri;
                input.dataset.col = c;
                input.onfocus = () => { input.style.background = '#e8f0fe'; };
                input.onblur = () => {
                    input.style.background = 'transparent';
                    if (!cellData[currentSheet]) cellData[currentSheet] = [];
                    if (!cellData[currentSheet][ri]) cellData[currentSheet][ri] = [];
                    cellData[currentSheet][ri][c] = input.value;
                    saveData();
                    render();
                };
                if (ri > 0 && c > 0 && input.value && !isNaN(parseFloat(getCellDisplay(ri, c)))) {
                    input.style.textAlign = 'right';
                }
                td.appendChild(input);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });

        const addRowBtn = document.createElement('tr');
        addRowBtn.innerHTML = `<td colspan="${maxCols + 1}" style="padding:10px;text-align:center;background:#fafafa;cursor:pointer;color:var(--accent-blue);font-size:13px;border:1px dashed #ddd;">＋ 添加行</td>`;
        addRowBtn.onclick = () => {
            if (!cellData[currentSheet]) cellData[currentSheet] = [];
            cellData[currentSheet].push(new Array(maxCols).fill(''));
            saveData(); render();
        };
        tbody.appendChild(addRowBtn);

        content.querySelector('#nums-addSheet').onclick = () => {
            const name = prompt('新表格名称：', '新表格');
            if (name && !sheets.includes(name)) {
                sheets.push(name);
                cellData[name] = [['列1', '列2', '列3']];
                currentSheet = name;
                saveData(); render();
            }
        };
    }

    render();
};
