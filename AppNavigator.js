import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainScreen from './Screens/MainScreen';

const MainNavigator = createStackNavigator({
    MainScreen: { screen: MainScreen },
});

const App = createAppContainer(MainNavigator);

export default App;
