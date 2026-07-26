window.renderCalculator = function(body, sidebar, toolbar, windowId) {
    let display = '0';
    let previousValue = null;
    let operator = null;
    let waitingForOperand = false;
    let history = [];

    function inputDigit(digit) {
        if (waitingForOperand) {
            display = digit;
            waitingForOperand = false;
        } else {
            display = display === '0' ? digit : display + digit;
        }
        render();
    }

    function inputDecimal() {
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
        previousValue = null;
        operator = null;
        waitingForOperand = false;
        render();
    }

    function performOperation(nextOperator) {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            previousValue = inputValue;
        } else if (operator) {
            const currentValue = previousValue;
            let result;

            switch (operator) {
                case '+': result = currentValue + inputValue; break;
                case '-': result = currentValue - inputValue; break;
                case '*': result = currentValue * inputValue; break;
                case '/': result = inputValue !== 0 ? currentValue / inputValue : '错误'; break;
                default: result = inputValue;
            }

            if (result === '错误') {
                display = '错误';
                previousValue = null;
                operator = null;
                waitingForOperand = true;
                render();
                return;
            }

            display = String(parseFloat(result.toFixed(10)));
            previousValue = result;
            history.push(`${currentValue} ${operator} ${inputValue} = ${result}`);
        }

        waitingForOperand = true;
        operator = nextOperator;

        if (nextOperator === '=') {
            previousValue = null;
            operator = null;
        }
        render();
    }

    function toggleSign() {
        if (display !== '0' && display !== '错误') {
            display = String(-parseFloat(display));
        }
        render();
    }

    function percentage() {
        if (display !== '错误') {
            display = String(parseFloat(display) / 100);
        }
        render();
    }

    function backspace() {
        if (display.length > 1 && display !== '错误') {
            display = display.slice(0, -1);
            if (display === '-' || display === '') display = '0';
        } else {
            display = '0';
        }
        render();
    }

    function render() {
        body.innerHTML = `
            <div class="calculator-body">
                <div class="calc-display">
                    <div class="calc-display-value">${display}</div>
                </div>
                <div class="calc-buttons">
                    <button class="calc-btn function" data-action="clear">AC</button>
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
                    <button class="calc-btn operator" data-action="=">=</button>
                </div>
            </div>
        `;

        body.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const digit = btn.dataset.digit;
                const action = btn.dataset.action;

                if (digit !== undefined) {
                    if (digit === '0' && display === '0') return;
                    inputDigit(digit);
                } else if (action) {
                    switch (action) {
                        case 'clear': clear(); break;
                        case 'sign': toggleSign(); break;
                        case 'percent': percentage(); break;
                        case 'decimal': inputDecimal(); break;
                        case 'backspace': backspace(); break;
                        case '+':
                        case '-':
                        case '*':
                        case '/':
                        case '=': performOperation(action); break;
                    }
                }
            });
        });

        body.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
            else if (e.key === '.') inputDecimal();
            else if (['+', '-', '*', '/', '='].includes(e.key)) performOperation(e.key);
            else if (e.key === 'Enter') { e.preventDefault(); performOperation('='); }
            else if (e.key === 'Escape' || e.key === 'c') clear();
            else if (e.key === 'Backspace') backspace();
            else if (e.key === '%') percentage();
        });
    }

    render();
};
