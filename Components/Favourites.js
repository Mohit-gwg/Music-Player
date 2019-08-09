import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import TrackPlayer from 'react-native-track-player';

export default class Favourites extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <Text>Favourite Songs</Text>
            </View>
        );
    }
};
