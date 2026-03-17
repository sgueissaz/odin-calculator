const MAX_SIZE_DIGITS = 16;

const DIGITS = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

const PERIOD = '.';

const add = (x, y) => x + y;

const subtract = (x, y) => x - y;

const multiply = (x, y) => x * y;

const divide = function(x, y) {
    if (y === 0) {
        throw new TypeError("Cannot divide by 0!");
    }

    return x / y;
}

const OPERATIONS = {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide,
}

const state = {
    lastOperation: undefined,
    lastOperand: '0',
    currentOperand: undefined,
}

const ui = {
    display: document.querySelector('#display'),
    buttons: document.querySelector('#buttons'),
}

function operate(operation, op1, op2) {
    const result = String(Math.floor(operation(Number(op1), Number(op2)) * 100000) / 100000);
    if (result.length > MAX_SIZE_DIGITS) {
        throw new TypeError("Number too big!");
    }
    return result;
}

function updateCurrentOperand(operand) {
    if (state.currentOperand === undefined || state.currentOperand === '0') {
        state.currentOperand = operand;
        return;
    }

    if (state.currentOperand.length < MAX_SIZE_DIGITS) {
        state.currentOperand += operand;
    }
}

function addPeriod() {
    if (state.currentOperand === undefined) {
        state.currentOperand = DIGITS.zero + PERIOD;
        return;
    }

    if (!/\./.test(state.currentOperand) && state.currentOperand.length < MAX_SIZE_DIGITS - 1) {
        state.currentOperand += PERIOD;
        return;
    }
}

function equal() {
    if (state.lastOperation === undefined) {
        return;
    }

    if (state.currentOperand === undefined) {
        state.lastOperation = undefined;
        return;
    }

    state.lastOperand = operate(state.lastOperation, state.lastOperand, state.currentOperand);
    state.lastOperation = undefined;
    state.currentOperand = undefined;
}

function clear() {
    state.lastOperation = undefined;
    state.lastOperand = DIGITS.zero;
    state.currentOperand = undefined;
}

function backspace() {
    if (state.currentOperand === undefined) {
        return;
    }

    if (state.currentOperand.length === 1) {
        state.currentOperand = DIGITS.zero;
        return;
    }

    state.currentOperand = state.currentOperand.substring(0, state.currentOperand.length - 1);
}

function updateLastOperation(operation) {
    if (state.currentOperand === undefined) {
        state.lastOperation = operation;
        return;
    }

    if (state.lastOperation === undefined) {
        state.lastOperation = operation;
        state.lastOperand = state.currentOperand;
        state.currentOperand = undefined;
        return;
    }

    state.lastOperand = operate(state.lastOperation, state.lastOperand, state.currentOperand);
    state.lastOperation = operation;
    state.currentOperand = undefined;
}

function updateDisplay() {
    ui.display.textContent = state.currentOperand ?? state.lastOperand;
}

function showError(error) {
    ui.display.textContent = error;
}

function handle(id) {
    if (id in DIGITS) {
        updateCurrentOperand(DIGITS[id]);
        return;
    }

    if (id in OPERATIONS) {
        updateLastOperation(OPERATIONS[id])
    }

    switch(id) {
        case 'period':
            addPeriod();
            break;
        case 'equal':
            equal();
            break;
        case 'clear':
            clear();
            break;
        case 'backspace':
            backspace();
            break;
    }
}

ui.buttons.addEventListener('click', (e) => {
    const id = e.target.id;
    if (!id) {
        return;
    }

    try {
        handle(id);
        updateDisplay();
    } catch(e) {
        clear();
        console.log(e.message);
        showError(e.message);
    }
})

updateDisplay();