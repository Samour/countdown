import React, { Component } from 'react';
import { Operations, ARITHMETIC_OPERATIONS } from './evaluator';

const OpLevel = {
  '+': 1,
  '-': 1,
  'x': 2,
  '/': 2,
};

class CalcExprNode {
  constructor(value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
  }

  _needsBrackets(operation, rightOperand) {
    if (!(operation in OpLevel)) {
      return false;
    } else if (OpLevel[this.value] > OpLevel[operation]) {
      return true;
    } else if (rightOperand && OpLevel[this.value] === OpLevel[operation]
      && (this.value === Operations.MINUS || this.value === Operations.DIVIDE)) {
      return true;
    } else {
      return false;
    }
  }

  algebraic() {
    if (!this.left || !this.right) {
      return [this.value];
    }

    const leftNeedBrackets = this._needsBrackets(this.left.value, false);
    const rightNeedBrackets = this._needsBrackets(this.right.value, true);
    const parts = [];
    if (leftNeedBrackets) {
      parts.push(Operations.PAREN_OPEN);
    }
    this.left.algebraic().forEach((p) => parts.push(p));
    if (leftNeedBrackets) {
      parts.push(Operations.PAREN_CLOSE);
    }
    parts.push(this.value);
    if (rightNeedBrackets) {
      parts.push(Operations.PAREN_OPEN);
    }
    this.right.algebraic().forEach((p) => parts.push(p));
    if (rightNeedBrackets) {
      parts.push(Operations.PAREN_CLOSE);
    }

    return parts;
  }
}

export default class CalculatorText extends Component {
  _expression() {
    if (this.props.mode !== 'solution') {
      return this.props.operations.join(' ');
    } else if (!this.props.operations) {
      return 'Solving...';
    } else if (this.props.operations.length === 0) {
      return 'Could not find a solution';
    }

    const stack = [];
    for (let i = 0; i < this.props.operations.length; i++) {
      const op = this.props.operations[i];
      if (ARITHMETIC_OPERATIONS.includes(op)) {
        const right = stack.pop();
        const left = stack.pop();
        stack.push(new CalcExprNode(op, left, right));
      } else {
        stack.push(new CalcExprNode(op));
      }
    }

    return stack.pop().algebraic().join(' ');
  }

  render() {
    return <div className="calculatorText tileBorder">{this._expression()}</div>;
  }
}
