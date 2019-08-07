import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';

export default class ScreenA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            musicData: [],
        }
    }
    componentDidMount() {
        fetch("http://storage.googleapis.com/automotive-media/music.json", {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.state.musicData = responseJson
            })
            .catch((error) => {
                console.error(error);
            });
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#03DAC6' }}>
                <StatusBar backgroundColor={'#000'} />
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ScreenB')}>
                    <Text style={{ color: '#B00020', fontWeight: 'bold', fontSize: 20 }}>Hello Screen A</Text>
                </TouchableOpacity>
            </View>
        );
    }
};
