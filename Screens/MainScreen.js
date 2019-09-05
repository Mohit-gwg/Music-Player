import React, { Component } from 'react'
import { View, StatusBar } from 'react-native';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import Songs from '../Components/Songs';
import Artists from '../Components/Artists';
import Albums from '../Components/Albums';
import Favourites from '../Components/Favourites';
import RecordAudio from '../Components/RecordAudio';

class MainScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Music Player",
        headerStyle: {
            backgroundColor: '#F44336'
        },
        headerTintColor: '#fff',
    });
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <Tabs style={{ backgroundColor: '#EF9A9A' }} renderTabBar={() => <ScrollableTab />}>
                    <Tab heading="SONGS" textStyle={{ fontSize: 14 }} activeTabStyle={{ backgroundColor: '#B71C1C' }} tabStyle={{ backgroundColor: '#F44336', padding: 16 }}>
                        <Songs />
                    </Tab>
                    <Tab heading="ARTISTS" textStyle={{ fontSize: 14 }} activeTabStyle={{ backgroundColor: '#B71C1C' }} tabStyle={{ backgroundColor: '#F44336' }}>
                        <Artists />
                    </Tab>
                    <Tab heading="ALBUMS" textStyle={{ fontSize: 14 }} activeTabStyle={{ backgroundColor: '#B71C1C' }} tabStyle={{ backgroundColor: '#F44336' }}>
                        <Albums />
                    </Tab>
                    <Tab heading="FAVOURITES" textStyle={{ fontSize: 14 }} activeTabStyle={{ backgroundColor: '#B71C1C' }} tabStyle={{ backgroundColor: '#F44336' }}>
                        <Favourites />
                    </Tab>
                    <Tab heading="RECORD AUDIO" textStyle={{ fontSize: 14 }} activeTabStyle={{ backgroundColor: '#B71C1C' }} tabStyle={{ backgroundColor: '#F44336' }}>
                        <RecordAudio />
                    </Tab>
                </Tabs>
            </View>
        );
    }
}
export default MainScreen;