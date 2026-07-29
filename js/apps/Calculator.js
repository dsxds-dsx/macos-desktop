window.renderCalculator = function(body, sidebar, toolbar, windowId) {
    let display = '0';
    let expression = '';
    let previousValue = null;
    let operator = null;
    let waitingForOperand = false;
    let history = JSON.parse(localStorage.getItem('macos_calc_history') || '[]');

    function saveHistory() {
        localStorage.setItem('macos_calc_history', JSON.stringify(history.slice(0, 20)));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function formatDisplay(value) {
        if (value === '错误' || isNaN(value)) return value;
        const num = parseFloat(value);
        if (!isFinite(num)) return value;
        if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
            return num.toExponential(6);
        }
        const str = String(value);
        if (str.includes('.')) {
            const [intPart, decPart] = str.split('.');
            const sign = intPart.startsWith('-') ? '-' : '';
            const absInt = sign ? intPart.slice(1) : intPart;
            const grouped = absInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return (sign + grouped) + '.' + decPart;
        }
        const sign = str.startsWith('-') ? '-' : '';
        const absInt = sign ? str.slice(1) : str;
        return sign + absInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function inputDigit(digit) {
        if (display === '错误') { clear(); return; }
        if (waitingForOperand) {
            display = digit;
            waitingForOperand = false;
        } else {
            if (display === '0') display = digit;
            else display += digit;
        }
        render();
    }

    function inputDecimal() {
        if (display === '错误') { clear(); return; }
        if (waitingForOperand) {
            display = '0.';
            waitingForOperand = false;
        } else if (!display.includes('.')) {
            display += '.';
        }
        render();
    }

    function clear() {
        display = '0';
        expression = '';
        previousValue = null;
        operator = null;
        waitingForOperand = false;
        render();
    }

    function toggleSign() {
        if (display === '0' || display === '错误') return;
        display = String(-parseFloat(display));
        render();
    }

    function percentage() {
        if (display === '错误') return;
        const value = parseFloat(display) / 100;
        display = String(parseFloat(value.toFixed(10)));
        render();
    }

    function backspace() {
        if (display === '错误') { clear(); return; }
        if (waitingForOperand) return;
        if (display.length > 1) {
            display = display.slice(0, -1);
            if (display === '-' || display === '') display = '0';
        } else {
            display = '0';
        }
        render();
    }

    function performOperation(nextOperator) {
        if (display === '错误') return;
        const inputValue = parseFloat(display);
        const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[nextOperator] || '';

        if (previousValue === null) {
            previousValue = inputValue;
            expression = formatDisplay(String(inputValue)) + ' ' + opSymbol;
        } else if (operator && !waitingForOperand) {
            const currentValue = previousValue;
            let result;
            const prevOpSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[operator];

            switch (operator) {
                case '+': result = currentValue + inputValue; break;
                case '-': result = currentValue - inputValue; break;
                case '*': result = currentValue * inputValue; break;
                case '/': result = inputValue !== 0 ? currentValue / inputValue : '错误'; break;
                default: result = inputValue;
            }

            if (result === '错误') {
                display = '错误';
                expression = '错误';
                previousValue = null;
                operator = null;
                waitingForOperand = true;
                render();
                return;
            }

            display = String(parseFloat(result.toFixed(10)));
            previousValue = result;
            expression = `${formatDisplay(String(currentValue))} ${prevOpSymbol} ${formatDisplay(String(inputValue))} =`;
            history.unshift({ expr: `${formatDisplay(String(currentValue))} ${prevOpSymbol} ${formatDisplay(String(inputValue))}`, result: formatDisplay(display) });
            saveHistory();
        }

        waitingForOperand = true;

        if (nextOperator === '=') {
            previousValue = null;
            operator = null;
        } else {
            operator = nextOperator;
            if (!expression.endsWith('=')) {
                // expression already set above
            } else {
                expression = formatDisplay(display) + ' ' + opSymbol;
            }
        }
        render();
    }

    function handleKey(e) {
        if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
        else if (e.key === '.') inputDecimal();
        else if (['+', '-', '*', '/'].includes(e.key)) performOperation(e.key);
        else if (e.key === '=' || e.key === 'Enter') { e.preventDefault(); performOperation('='); }
        else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') clear();
        else if (e.key === 'Backspace') backspace();
        else if (e.key === '%') percentage();
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        const clearLabel = (display === '0' && !expression) ? 'AC' : 'C';
        body.innerHTML = `
            <div class="calculator-body">
                <div class="calc-display">
                    <div class="calc-history">${escapeHtml(expression)}</div>
                    <div class="calc-display-value">${escapeHtml(formatDisplay(display))}</div>
                </div>
                <div class="calc-buttons">
                    <button class="calc-btn function" data-action="clear">${clearLabel}</button>
                    <button class="calc-btn function" data-action="sign">±</button>
                    <button class="calc-btn function" data-action="percent">%</button>
                    <button class="calc-btn operator ${operator === '/' ? 'active' : ''}" data-action="/">÷</button>
                    <button class="calc-btn number" data-digit="7">7</button>
                    <button class="calc-btn number" data-digit="8">8</button>
                    <button class="calc-btn number" data-digit="9">9</button>
                    <button class="calc-btn operator ${operator === '*' ? 'active' : ''}" data-action="*">×</button>
                    <button class="calc-btn number" data-digit="4">4</button>
                    <button class="calc-btn number" data-digit="5">5</button>
                    <button class="calc-btn number" data-digit="6">6</button>
                    <button class="calc-btn operator ${operator === '-' ? 'active' : ''}" data-action="-">−</button>
                    <button class="calc-btn number" data-digit="1">1</button>
                    <button class="calc-btn number" data-digit="2">2</button>
                    <button class="calc-btn number" data-digit="3">3</button>
                    <button class="calc-btn operator ${operator === '+' ? 'active' : ''}" data-action="+">+</button>
                    <button class="calc-btn number zero" data-digit="0">0</button>
                    <button class="calc-btn number" data-action="decimal">.</button>
                    <button class="calc-btn operator equals" data-action="=">=</button>
                </div>
            </div>
        `;

        body.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const digit = btn.dataset.digit;
                const action = btn.dataset.action;
                if (digit !== undefined) {
                    if (digit === '0' && display === '0' && !waitingForOperand) return;
                    inputDigit(digit);
                } else if (action) {
                    switch (action) {
                        case 'clear': clear(); break;
                        case 'sign': toggleSign(); break;
                        case 'percent': percentage(); break;
                        case 'decimal': inputDecimal(); break;
                        case '+':
                        case '-':
                        case '*':
                        case '/':
                        case '=': performOperation(action); break;
                    }
                }
            });
        });

        body.setAttribute('tabindex', '0');
        body.addEventListener('keydown', handleKey);
    }

    render();
};
