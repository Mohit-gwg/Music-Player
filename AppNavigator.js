import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainScreen from './Screens/MainScreen';
import SongProfile from './Screens/SongProfile';

const MainNavigator = createStackNavigator({
    MainScreen: { screen: MainScreen },
    SongProfile: { screen: SongProfile },
});

const App = createAppContainer(MainNavigator);

export default App;
