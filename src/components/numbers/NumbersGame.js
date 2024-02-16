import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';
import Selector from './Selector';
import Calculator from './Calculator';
import { ALL_OPERATIONS } from './evaluator';
import solver from './solver';

const DEV_MODE = true;

const LARGE_NUMS = [25, 50, 75, 100];
const SMALL_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class Controls extends Component {
  render() {
    return <Grid container justify="center">
      <Grid item xs={3}>
        <Button variant="contained" onClick={() => this.props.onNewGame()}>New game</Button>
      </Grid>
      {this._renderDevButton()}
    </Grid>;
  }

  _renderDevButton() {
    if (DEV_MODE) {
      return <Grid item xs={3}>
        <Button variant="contained" onClick={() => this.props.onSetNumbers()}>Enter numbers</Button>
      </Grid>;
    }
  }
}

export default class NumbersGame extends Component {
  constructor(props) {
    super(props);

    this.state = this._getInitialState();
  }

  _getInitialState() {
    return {
      mode: 'selection',
      largeCount: 0,
      smallCount: 0,
      nums: [],
      used: [],
      target: -1,
      operations: [],
      solution: null,
    };
  }

  _restartGame() {
    this.setState(this._getInitialState());
  }

  _increment(large) {
    const startGame = () => {
      if (this.state.smallCount + this.state.largeCount === 6) {
        this._startGame()
      }
    }

    if (large) {
      this.setState((state) => ({
        largeCount: state.largeCount + 1,
      }), startGame);
    } else {
      this.setState((state) => ({
        smallCount: state.smallCount + 1,
      }), startGame);
    }
  }

  _startGame() {
    const nums = [];
    for (let i = 0; i < this.state.largeCount; i++) {
      nums.push(LARGE_NUMS[Math.floor(Math.random() * LARGE_NUMS.length)]);
    }
    for (let i = 0; i < this.state.smallCount; i++) {
      nums.push(SMALL_NUMS[Math.floor(Math.random() * SMALL_NUMS.length)]);
    }

    this.setState({
      mode: 'play',
      nums,
      target: Math.floor(Math.random() * 1000),
    });
  }

  _pushOperation(operation) {
    this.setState({
      operations: this.state.operations.concat([operation]),
    });
  }

  _undoLast() {
    this.setState((state) => {
      if (state.operations.length === 0) {
        return {};
      }
      const operations = [...state.operations];
      const op = operations.pop();
      const used = [...state.used];
      if (!(ALL_OPERATIONS.includes(op))) {
        used.pop();
      }

      return { operations, used };
    })
  }

  _selectNum(num, i) {
    if (this.state.mode === 'play' && !this.state.used.includes(i)) {
      this.setState({
        operations: this.state.operations.concat([num]),
        used: this.state.used.concat(i),
      });
    }
  }

  _submit() {
    this.setState({
      mode: 'submitted',
    });
  }

  _dataEntryMode() {
    this.setState({
      ...this._getInitialState(),
      mode: 'dataEntry',
      nums: [null, null, null, null, null, null],
    });
  }

  _setTarget(e) {
    this.setState({
      target: Number.parseInt(e.target.value),
    });
  }

  _setNumber(i, num) {
    const nums = [...this.state.nums];
    nums[i] = num;
    this.setState({ nums });
  }

  _showSolution() {
    this.setState({
      mode: 'solution',
      solution: null,
    }, () =>
      this.setState((state) => ({
        solution: solver(state.nums, state.target),
      }))
    );
  }

  render() {
    return <Grid container justify="center" className="targetRow">
      <Grid item xs={12} sm={8} md={6}>
        <Controls onNewGame={() => this._restartGame()} onSetNumbers={() => this._dataEntryMode()} />
        {this._renderInternal()}
      </Grid>
    </Grid>;
  }

  _renderInternal() {
    if (this.state.mode === 'selection') {
      return <Selector largeCount={this.state.largeCount} smallCount={this.state.smallCount}
        onIncrement={(i) => this._increment(i)} />;
    } else {
      const target = this.state.mode === 'dataEntry' ? <input onChange={(e) => this._setTarget(e)} />
        : this.state.target;
      return <Grid container>
        <Grid container className="targetRow">
          <Grid item xs={6}>Target</Grid>
          <Grid item xs={6}>{target}</Grid>
        </Grid>
        <Calculator mode={this.state.mode} nums={this.state.nums} target={this.state.target} used={this.state.used}
          operations={this.state.operations} solution={this.state.solution} onSelect={(n, i) => this._selectNum(n, i)}
          onSetNumber={(i, n) => this._setNumber(i, n)} onOperation={(o) => this._pushOperation(o)}
          onUndo={() => this._undoLast()} onSubmit={() => this._submit()} onShowSolution={() => this._showSolution()} />
      </Grid>;
    }
  }
}