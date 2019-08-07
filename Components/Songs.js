import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import TrackPlayer from 'react-native-track-player';

export default class Songs extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <Text>Songs</Text>
            </View>
        );
    }
};
