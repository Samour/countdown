import React from 'react';
import { Grid } from '@material-ui/core';
import './App.css';
import NumbersGame from './components/numbers/NumbersGame';

function App() {
  return (
    <Grid id="App" container>
      <NumbersGame/>
    </Grid>
  );
}

export default App;
