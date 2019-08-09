import React, { Component } from 'react';
import AppNavigator from './AppNavigator';
import { Root } from 'native-base';

export default class App extends Component {
  render() {
    return (
      <Root>
        <AppNavigator />
      </Root>
    );
  }
};
