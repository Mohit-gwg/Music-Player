import React, { Component } from 'react'
import { View, StatusBar } from 'react-native';
import { Text, Item, Input, Label, Icon, Button } from 'native-base';
import firebase from 'react-native-firebase'

class SignUp extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: null,
        }
    };
    handleSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => this.props.navigation.navigate('MainScreen'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <View style={{ margin: 16 }}>
                    <View style={{ margin: 8 }}>
                        <Item rounded returnKeyType={"next"} floatingLabel style={{ alignSelf: 'stretch', overflow: 'hidden', }}>
                            <Icon type="FontAwesome" name="user"></Icon>
                            <Label>Email</Label>
                            <Input keyboardType='default' value={this.state.fullName} onChangeText={(text) => this.setState({ email: text })} />
                        </Item>
                    </View>
                    <View style={{ margin: 8 }}>
                        <Item rounded returnKeyType={"next"} floatingLabel style={{ alignSelf: 'stretch', overflow: 'hidden', }}>
                            <Icon type="FontAwesome" name="user"></Icon>
                            <Label>Password</Label>
                            <Input autoCapitalize="none" caretHidden={true} keyboardType='default' value={this.state.fullName} onChangeText={(text) => this.setState({ password: text })} />
                        </Item>
                    </View>
                </View>
                <View style={{ margin: 16 }}>
                    <Button block style={{ backgroundColor: '#F44336', borderRadius: 8 }} onPress={() => this.handleSignUp()}>
                        <Text>Sign Up</Text>
                    </Button>
                </View>
                <View style={{ margin: 16, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#FFAB91' }}>Already have an account? <Text style={{ fontSize: 16, color: 'blue' }} onPress={() => this.props.navigation.navigate('Login')}>Login</Text></Text>
                </View>
            </View>
        );
    }
}
export default SignUp;