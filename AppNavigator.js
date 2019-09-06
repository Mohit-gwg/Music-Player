import { createStackNavigator, createAppContainer } from 'react-navigation';
import MainScreen from './Screens/MainScreen';
import SongProfile from './Screens/SongProfile';
import RecordedAudioProfile from './Screens/RecordedAudioProfile';

const MainNavigator = createStackNavigator({
    MainScreen: { screen: MainScreen },
    SongProfile: { screen: SongProfile },
    RecordedAudioProfile: { screen: RecordedAudioProfile },
});

const App = createAppContainer(MainNavigator);

export default App;
