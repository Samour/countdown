import React, { Component } from 'react';
import { Grid, Button } from '@material-ui/core';

class Count extends Component {
  render() {
    return (
      <Grid item xs={12} sm={6} md={3}>
        <h3>{this.props.label}</h3>
        <div className="number">
          {this.props.value}
        </div>
        <Button variant="contained" onClick={() => this.props.onIncrement()}>+</Button>
      </Grid>
    );
  }
}

export default class Selector extends Component {

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     smallCount: 0,
  //     largeCount: 0,
  //   };
  // }

  // _increment(large) {
  //   const passbackSettings = () => {
  //     if (this.state.smallCount + this.state.largeCount === 6) {
  //       this.props.onSelectionComplete({
  //         smallCount: this.state.smallCount,
  //         largeCount: this.state.largeCount,
  //       });
  //     }
  //   }

  //   if (large) {
  //     this.setState((state) => ({
  //       largeCount: state.largeCount + 1,
  //     }), passbackSettings);
  //   } else {
  //     this.setState((state) => ({
  //       smallCount: state.smallCount + 1,
  //     }), passbackSettings);
  //   }
  // }

  render() {
    return (
      <Grid container justify="center" spacing={1}>
        <Count label="Large" value={this.props.largeCount} onIncrement={() => this.props.onIncrement(true)} />
        <Count label="Small" value={this.props.smallCount} onIncrement={() => this.props.onIncrement(false)} />
      </Grid>
    );
  }
}