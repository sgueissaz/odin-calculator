const DIGITS = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

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
    lastOperand: 0,
    currentOperand: undefined,
}

const ui = {
    display: document.querySelector('#display'),
    buttons: document.querySelector('#buttons'),
}

function updateCurrentOperand(operand) {
    if (state.currentOperand === undefined || state.currentOperand === 0) {
        state.currentOperand = operand;
        return;
    }

    state.currentOperand = parseInt(`${state.currentOperand}${operand}`);
}

function equal() {
    if (state.lastOperation === undefined) {
        return;
    }

    if (state.currentOperand === undefined) {
        state.lastOperation = undefined;
        return;
    }

    state.lastOperand = state.lastOperation(state.lastOperand, state.currentOperand);
    state.lastOperation = undefined;
    state.currentOperand = undefined;
}

function clear() {
    state.lastOperation = undefined;
    state.lastOperand = 0;
    state.currentOperand = undefined;
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

    state.lastOperand = state.lastOperation(state.lastOperand, state.currentOperand);
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
        case 'equal':
            equal();
            break;
        case 'clear':
            clear();
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