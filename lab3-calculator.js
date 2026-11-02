(() => {
  const display = document.querySelector('#display');
  const expression = document.querySelector('#expression');
  const keypad = document.querySelector('#keypad');
  let current = '0';
  let stored = null;
  let pendingOperator = null;
  let replaceCurrent = false;
  let justCalculated = false;

  const format = (value) => {
    if (!Number.isFinite(value)) return 'Error';
    const rounded = Number.parseFloat(value.toPrecision(11));
    return String(rounded);
  };
  const render = () => { display.textContent = current; };
  const reset = () => {
    current = '0'; stored = null; pendingOperator = null;
    replaceCurrent = false; justCalculated = false; expression.textContent = '';
    render();
  };
  const enterDigit = (digit) => {
    if (current === 'Error' || replaceCurrent || justCalculated) {
      current = digit; replaceCurrent = false; justCalculated = false;
      if (!pendingOperator) expression.textContent = '';
    } else if (current.length < 14) {
      current = current === '0' ? digit : current + digit;
    }
    render();
  };
  const enterDecimal = () => {
    if (current === 'Error' || replaceCurrent || justCalculated) {
      current = '0.'; replaceCurrent = false; justCalculated = false;
      if (!pendingOperator) expression.textContent = '';
    } else if (!current.includes('.')) current += '.';
    render();
  };
  const calculate = (left, right, op) => {
    switch (op) {
      case '+': return left + right;
      case '−': return left - right;
      case '×': return left * right;
      case '÷': return right === 0 ? NaN : left / right;
      default: return right;
    }
  };
  const chooseOperator = (op) => {
    if (current === 'Error') return reset();
    const value = Number(current);
    if (pendingOperator && !replaceCurrent && stored !== null) {
      const result = calculate(stored, value, pendingOperator);
      current = format(result); stored = Number(current);
      render();
    } else stored = value;
    pendingOperator = op;
    expression.textContent = `${format(stored)} ${op}`;
    replaceCurrent = true; justCalculated = false;
  };
  const equals = () => {
    if (!pendingOperator || stored === null || current === 'Error') return;
    const right = Number(current);
    const left = stored;
    const op = pendingOperator;
    const result = calculate(left, right, op);
    expression.textContent = `${format(left)} ${op} ${format(right)} =`;
    current = format(result); stored = null; pendingOperator = null;
    replaceCurrent = true; justCalculated = true;
    render();
  };
  const act = (action) => {
    if (action === 'clear') return reset();
    if (action === 'decimal') return enterDecimal();
    if (action === 'equals') return equals();
    if (action === 'sign' && current !== '0' && current !== 'Error') current = format(-Number(current));
    if (action === 'percent' && current !== 'Error') current = format(Number(current) / 100);
    render();
  };

  keypad.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.digit !== undefined) enterDigit(button.dataset.digit);
    else if (button.dataset.operator) chooseOperator(button.dataset.operator);
    else act(button.dataset.action);
  });
  document.addEventListener('keydown', (event) => {
    if (/^[0-9]$/.test(event.key)) enterDigit(event.key);
    else if (event.key === '.') enterDecimal();
    else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); equals(); }
    else if (event.key === 'Escape' || event.key.toLowerCase() === 'c') reset();
    else if (event.key === 'Backspace') {
      if (current !== 'Error') current = current.length > 1 ? current.slice(0, -1) : '0';
      render();
    } else {
      const operators = {'+':'+','-':'−','*':'×','/':'÷'};
      if (operators[event.key]) chooseOperator(operators[event.key]);
    }
  });
  render();
})();
