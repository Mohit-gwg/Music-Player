import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import AppNavigator from './AppNavigator';

export default class App extends Component {
  render() {
    return (
      <AppNavigator />
    );
  }
};

AppRegistry.registerComponent('appname', () => App);
