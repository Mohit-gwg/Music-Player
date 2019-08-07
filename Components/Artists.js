import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import TrackPlayer from 'react-native-track-player';

export default class Artists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            musicData: [],
        }
    }
    async componentDidMount() {
        await TrackPlayer.setupPlayer({});
        await TrackPlayer.add({
            id: 'track',
            url: 'http://tegos.kz/new/mp3_full/Luis_Fonsi_feat._Daddy_Yankee_-_Despacito.mp3', // just for test!
            title: 'Despacito',
            artist: 'Luis Fonsi Feat. Daddy Yankee',
            artwork: 'https://images-eu.ssl-images-amazon.com/images/I/61JH2ggghmL._AC_US160_.jpg'
        })
    }
    play = () => {
        TrackPlayer.add({
            id: 'track',
            url: 'http://tegos.kz/new/mp3_full/Luis_Fonsi_feat._Daddy_Yankee_-_Despacito.mp3',
            title: 'Despacito',
            artist: 'Luis Fonsi Feat. Daddy Yankee',
            artwork: 'https://images-eu.ssl-images-amazon.com/images/I/61JH2ggghmL._AC_US160_.jpg'
        }).then(() => {
            TrackPlayer.play();
        });
    }
    pause = () => {
        TrackPlayer.add({
            id: 'track',
            url: 'http://tegos.kz/new/mp3_full/Luis_Fonsi_feat._Daddy_Yankee_-_Despacito.mp3',
            title: 'Despacito',
            artist: 'Luis Fonsi Feat. Daddy Yankee',
            artwork: 'https://images-eu.ssl-images-amazon.com/images/I/61JH2ggghmL._AC_US160_.jpg'
        }).then(() => {
            TrackPlayer.pause();
        });
    }
    reset = () => {
        TrackPlayer.add({
            id: 'track',
            url: 'http://tegos.kz/new/mp3_full/Luis_Fonsi_feat._Daddy_Yankee_-_Despacito.mp3',
            title: 'Despacito',
            artist: 'Luis Fonsi Feat. Daddy Yankee',
            artwork: 'https://images-eu.ssl-images-amazon.com/images/I/61JH2ggghmL._AC_US160_.jpg'
        }).then(() => {
            TrackPlayer.reset();
        });
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#03DAC6' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <TouchableOpacity onPress={() => this.play()}>
                    <Text style={{ color: '#B00020', fontWeight: 'bold', fontSize: 20 }}>Play music</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 32 }} onPress={() => this.pause()}>
                    <Text style={{ color: '#B00020', fontWeight: 'bold', fontSize: 20 }}>Pause music</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 32 }} onPress={() => this.reset()}>
                    <Text style={{ color: '#B00020', fontWeight: 'bold', fontSize: 20 }}>Reset music</Text>
                </TouchableOpacity>
            </View>
        );
    }
};
