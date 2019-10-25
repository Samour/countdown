import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';
import { Check, Backspace } from '@material-ui/icons';
import Numbers from './Numbers';
import CalculatorText from './CalculatorText';
import evaluator, { Operations, ARITHMETIC_OPERATIONS, ALL_OPERATIONS, evaluateRP } from './evaluator';

const OPERATIONS_FOR_NUM = ARITHMETIC_OPERATIONS + [Operations.PAREN_OPEN];

class Operation extends Component {
  render() {
    return <Grid item xs={3} className="calculatorOperation">
      <Button variant="contained" onClick={() => this.props.onClick(this.props.operation)}>
        {this.props.operation}
      </Button>
    </Grid>;
  }
}

export default class Calculator extends Component {
  _acceptsNumber() {
    return this.props.operations.length === 0
      || OPERATIONS_FOR_NUM.includes(this.props.operations[this.props.operations.length - 1]);
  }

  _countParenDepth() {
    let depth = 0;
    for (let i = 0; i < this.props.operations.length; i++) {
      if (this.props.operations[i] === Operations.PAREN_OPEN) {
        depth++;
      } else if (this.props.operations[i] === Operations.PAREN_CLOSE) {
        depth--;
      }
    }

    return depth;
  }

  _trySelectNum(num, i) {
    if (this.props.mode === 'play' && this._acceptsNumber()) {
      this.props.onSelect(num, i);
    }
  }

  _permitOperation(operation) {
    if (ARITHMETIC_OPERATIONS.includes(operation)) {
      return !this._acceptsNumber();
    } else if (operation === Operations.PAREN_CLOSE) {
      return !this._acceptsNumber() && this._countParenDepth() > 0;
    } else {
      return this._acceptsNumber();
    }
  }

  _tryOperation(operation) {
    if (this.props.mode === 'play' && this._permitOperation(operation)) {
      this.props.onOperation(operation);
    }
  }

  _evaluate() {
    if (this.props.mode === 'solution' && !!this.props.solution) {
      return evaluateRP(this.props.solution);
    } else {
      return evaluator(this.props.operations);
    }
  }

  render() {
    const sum = this._evaluate();
    return <Grid container>
      <Numbers mode={this.props.mode} nums={this.props.nums} used={this.props.used}
        onSelect={(n, i) => this._trySelectNum(n, i)} onSetNumber={(i, n) => this.props.onSetNumber(i, n)} />
      <CalculatorText mode={this.props.mode}
        operations={this.props.mode === 'solution' ? this.props.solution : this.props.operations} />
      {this._renderSoln(sum)}
      {this._renderControls(sum)}
    </Grid>;
  }

  _renderSoln(sum) {
    if (this.props.mode === 'submitted') {
      if (!sum.value) {
        return <Grid container className="errorMessage">Your equation is not correct</Grid>;
      } else {
        return <Grid container>
          <Grid container>
            <Grid item xs={12}>You got {sum.value}</Grid>
            {this._renderSolvedMsg(sum.errors, Math.abs(sum.value - this.props.target))}
          </Grid>
        </Grid>;
      }
    } else if (this.props.mode === 'solution' && !!this.props.solution) {
      // debugger;
      const distance = Math.abs(sum.value - this.props.target);
      if (distance > 0) {
        return this._renderSolvedMsg(sum.errors, distance);
      }
    }

    return null;
  }

  _renderSolvedMsg(errors, distance) {
    if (errors.length > 0) {
      return errors.map((e, i) => <Grid key={i} item xs={12} className="errorMessage">{e}</Grid>);
    } else if (distance === 0) {
      return <Grid item xs={12}>You reached the target!</Grid>;
    } else {
      return <Grid item xs={12}>{distance} away</Grid>;
    }
  }

  _renderControls(sum) {
    if (this.props.mode === 'play') {
      return <Grid container>
        {ALL_OPERATIONS.map((o) => <Operation key={o} operation={o} onClick={() => this._tryOperation(o)} />)}
        <Grid item xs={3} className="calculatorOperation">
          <Button variant="contained" onClick={() => this.props.onSubmit()}><Check /></Button>
        </Grid>
        <Grid item xs={3} className="calculatorOperation">
          <Button variant="contained" onClick={() => this.props.onUndo()}><Backspace /></Button>
        </Grid>
      </Grid>;
    } else if ((this.props.mode === 'submitted' && sum.value !== this.props.target)
      || this.props.mode === 'dataEntry') {
      return <Grid item xs={12} className="calculatorOperation">
        <Button variant="contained" onClick={() => this.props.onShowSolution()}>Show solution</Button>
      </Grid>;
    }
  }
}
