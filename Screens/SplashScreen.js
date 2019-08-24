import React, { Component } from 'react'
import { View, StatusBar, Image } from 'react-native';
import firebase from 'react-native-firebase'

class SplashScreen extends Component {
    static navigationOptions = {
        header: null
    };
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'MainScreen' : 'SignUp')
        })
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <View style={{}}>
                    <Image style={{ height: '100%', width: '100%' }} source={require('../android/app/src/image/musicPlayerImage.png')} />
                </View>
            </View>
        );
    }
}
export default SplashScreen;