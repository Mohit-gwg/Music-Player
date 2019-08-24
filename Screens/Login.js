import React, { Component } from 'react'
import { View, StatusBar } from 'react-native';
import { Text, Item, Input, Label, Icon, Button } from 'native-base';
import firebase from 'react-native-firebase'

class Login extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorPassword: '',
            errorEmail: '',
            errorMessage: null,
        }
    };
    handleLogin = () => {
        const { email, password } = this.state;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('MainScreen'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <View style={{ margin: 16 }}>
                    <View style={{ margin: 8 }}>
                        <Item rounded returnKeyType={"next"} floatingLabel style={{ alignSelf: 'stretch', overflow: 'hidden', }} error={this.state.errorEmail}>
                            <Icon type="FontAwesome" name="user"></Icon>
                            <Label>Email</Label>
                            <Input keyboardType='default' value={this.state.fullName} onChangeText={(text) => this.setState({ email: text })} />
                            {(this.state.errorEmail) ? (<Icon name='close-circle' active={this.state.errorEmail} />) : (<View></View>)}
                        </Item>
                    </View>
                    <View style={{ margin: 8 }}>
                        <Item rounded returnKeyType={"next"} floatingLabel style={{ alignSelf: 'stretch', overflow: 'hidden', }} error={this.state.errorPassword}>
                            <Icon type="FontAwesome" name="user"></Icon>
                            <Label>Password</Label>
                            <Input keyboardType='default' value={this.state.fullName} onChangeText={(text) => this.setState({ password: text })} />
                            {(this.state.errorPassword) ? (<Icon name='close-circle' active={this.state.errorPassword} />) : (<View></View>)}
                        </Item>
                    </View>
                </View>
                <View style={{ margin: 16 }}>
                    <Button block style={{ backgroundColor: '#F44336', borderRadius: 8 }} onPress={() => this.handleLogin()}>
                        <Text>Login</Text>
                    </Button>
                </View>
                <View style={{ margin: 16, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#FFAB91' }}>Don't have an account? <Text style={{ fontSize: 16, color: 'blue' }} onPress={() => this.props.navigation.navigate('SignUp')}>Sign Up</Text></Text>
                </View>
            </View>
        );
    }
}
export default Login;