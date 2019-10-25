import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import './Numbers.css';

export default class Numbers extends Component {
  _classes(i) {
    const classes = ['numberTile', 'tileBorder'];
    if (this.props.used.includes(i)) {
      classes.push('disabledTile');
    }

    return classes.join(' ');
  }

  render() {
    return <Grid container className="numbersRow">
      {this.props.nums.map((n, i) =>
        <Grid item key={i} xs={4} sm={2}>{this._renderNum(n, i)}</Grid>
      )}
    </Grid>;
  }

  _renderNum(num, i) {
    if (this.props.mode === 'dataEntry') {
      return <input className={this._classes(i)} onChange={(e) => this.props.onSetNumber(i, Number.parseInt(e.target.value))} />
    } else {
      return <div className={this._classes(i)} onClick={() => this.props.onSelect(num, i)}>{num}</div>;
    }
  }
}