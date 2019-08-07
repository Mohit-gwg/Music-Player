import React, { Component } from 'react';
import { View, Text, StatusBar, } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import ScreenA from './Screens/ScreenA';
import ScreenB from './Screens/ScreenB';

const MainNavigator = createStackNavigator({
  ScreenA: { screen: ScreenA },
  ScreenB: { screen: ScreenB },
});

const App = createAppContainer(MainNavigator);

export default App;