import { createStackNavigator, createAppContainer } from 'react-navigation';
import SplashScreen from './Screens/SplashScreen';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import MainScreen from './Screens/MainScreen';
import SongProfile from './Screens/SongProfile';

const MainNavigator = createStackNavigator({
    SplashScreen: { screen: SplashScreen },
    Login: { screen: Login },
    SignUp: { screen: SignUp },
    MainScreen: { screen: MainScreen },
    SongProfile: { screen: SongProfile },
});

const App = createAppContainer(MainNavigator);

export default App;
