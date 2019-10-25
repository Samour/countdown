

export const Operations = {
  PLUS: '+',
  MINUS: '-',
  TIMES: 'x',
  DIVIDE: '/',
  PAREN_OPEN: '(',
  PAREN_CLOSE: ')',
};

export const OpLevel = {
  '+': 2,
  '-': 1,
  'x': 4,
  '/': 3,
};

export const ARITHMETIC_OPERATIONS = [Operations.PLUS, Operations.MINUS, Operations.TIMES, Operations.DIVIDE];
export const ALL_OPERATIONS = [
  Operations.PLUS,
  Operations.MINUS,
  Operations.TIMES,
  Operations.DIVIDE,
  Operations.PAREN_OPEN,
  Operations.PAREN_CLOSE,
];

export function evaluateRP(operations) {
  const result = {
    value: null,
    errors: [],
  };

  const stack = [];
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    if (ARITHMETIC_OPERATIONS.includes(op) && stack.length < 2) {
      return result;
    }
    if (op === Operations.PLUS) {
      stack.push(stack.pop() + stack.pop());
    } else if (op === Operations.MINUS) {
      const val = -stack.pop() + stack.pop();
      if (val < 0) {
        result.errors.push(`Cannot use negative number: ${val}`);
      }
      stack.push(val);
    } else if (op === Operations.TIMES) {
      stack.push(stack.pop() * stack.pop());
    } else if (op === Operations.DIVIDE) {
      const right = stack.pop();
      const left = stack.pop();
      if (left % right !== 0) {
        result.errors.push(`${left} is not divisible by ${right}`);
      }
      stack.push(left / right);
    } else if (op !== Operations.PAREN_OPEN) {
      stack.push(op);
    }
  }

  if (stack.length === 1) {
    result.value = stack.pop();
  }

  return result;
}

export default function evaluator(operations) {
  const ops = [...operations].reverse();
  const stack = [];
  const opStack = [];
  while (ops.length > 0) {
    const op = ops.pop();
    if (op === Operations.PAREN_OPEN) {
      opStack.push(op);
    } else if (op === Operations.PAREN_CLOSE) {
      while (opStack[opStack.length - 1] !== Operations.PAREN_OPEN) {
        stack.push(opStack.pop());
      }
      if (opStack.length) {
        opStack.pop();
      }
    } else if (ARITHMETIC_OPERATIONS.includes(op)) {
      while (opStack.length > 0 && OpLevel[opStack[opStack.length - 1]] >= OpLevel[op]) {
        stack.push(opStack.pop());
      }
      opStack.push(op);
    } else {
      stack.push(op);
    }
  }
  while (opStack.length > 0) {
    stack.push(opStack.pop());
  }

  return evaluateRP(stack);
}
