import React, { Component } from 'react';
import { View, Text, StatusBar, } from 'react-native';

export default class ScreenB extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#03DAC6' }}>
                <StatusBar backgroundColor={'#000'} />
                <Text style={{ color: '#B00020', fontWeight: 'bold', fontSize: 20 }}>Hello Screen B</Text>
            </View>
        );
    }
};
