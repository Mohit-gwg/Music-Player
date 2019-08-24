import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { Thumbnail } from 'native-base';

export default class Albums extends Component {
    constructor(props) {
        super(props);
        this.state = {
            musicData: [],
        }
    }
    componentWillMount() {
        fetch("http://storage.googleapis.com/automotive-media/music.json", {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ musicData: responseJson.music })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ECEFF1' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{ margin: 8 }}
                    data={this.state.musicData}
                    renderItem={({ item }) =>
                        <TouchableOpacity >
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 8 }}>
                                <View style={{ flex: 0.3 }}>
                                    <Thumbnail style={{ backgroundColor: '#d3d3d3' }} source={{ uri: item.image }} />
                                </View>
                                <View style={{ flexDirection: 'column', flex: 0.7 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F44336' }}>{item.album}</Text>
                                    <Text style={{ fontSize: 12, marginTop: 4, color: '#E57373' }}>{item.artist} songs</Text>
                                    <View style={{ borderWidth: 0.5, borderColor: '#d3d3d3', marginTop: 16 }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.trackNumber.toString()}
                />
            </View>
        );
    }
};
