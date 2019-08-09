import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Modal } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { Thumbnail, Icon } from 'native-base';
import { addSongData } from '../Actions/SongData';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

class Songs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            musicData: [],
            showMusicModal: false,
            currentTitle: '',
            currentSong: '',
            currentArtist: '',
            currentImage: '',
            currentTrackNumber: 0,
            play: 1,
            skipButtonCheck: false,
        }
    }
    showMusicProfile_Modal(visible, item) {
        if (item === undefined || item === null) {
            this.setState({ showMusicModal: visible });
        }
        else {
            this.props.add(item);
            this.setState({ showMusicModal: visible });
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
    playSong = () => {
        this.setState({ play: 2 });
        if (this.state.skipButtonCheck == true) {
            TrackPlayer.reset();
            TrackPlayer.add({
                id: this.state.currentTrackNumber,
                url: 'http://storage.googleapis.com/automotive-media/' + this.state.currentSong, // just for test!
                title: this.state.currentTitle,
                artist: this.state.currentArtist,
                artwork: 'http://storage.googleapis.com/automotive-media/' + this.state.currentImage,
            }).then(() => {
                TrackPlayer.play();
            });
        }
        else {
            TrackPlayer.add({
                id: this.props.selectedSongData.trackNumber,
                url: 'http://storage.googleapis.com/automotive-media/' + this.props.selectedSongData.source, // just for test!
                title: this.props.selectedSongData.title,
                artist: this.props.selectedSongData.artist,
                artwork: 'http://storage.googleapis.com/automotive-media/' + this.props.selectedSongData.image,
            }).then(() => {
                TrackPlayer.play();
            });
        }
    }
    nextSong = () => {
        var nextTrackNumber = this.state.currentTrackNumber + 1;
        this.state.currentTrackNumber = nextTrackNumber;
        for (var i = 0; i <= this.state.musicData.length; i++) {
            if (this.state.musicData[i].trackNumber == nextTrackNumber) {
                this.state.currentSong = this.state.musicData[i].source;
                this.state.currentTitle = this.state.musicData[i].title;
                this.state.currentArtist = this.state.musicData[i].artist;
                this.state.currentImage = this.state.musicData[i].image;
                this.state.currentAlbum = this.state.musicData[i].album;
                break;
            }
        }
        this.setState({ skipButtonCheck: true });
        this.playSong();
    }
    previousSong = () => {
        var nextTrackNumber = this.state.currentTrackNumber - 1;
        this.state.currentTrackNumber = nextTrackNumber;
        for (var i = 0; i <= this.state.musicData.length; i++) {
            if (this.state.musicData[i].trackNumber == nextTrackNumber) {
                this.state.currentSong = this.state.musicData[i].source;
                this.state.currentTitle = this.state.musicData[i].title;
                this.state.currentArtist = this.state.musicData[i].artist;
                this.state.currentImage = this.state.musicData[i].image;
                this.state.currentAlbum = this.state.musicData[i].album;
                break;
            }
        }
        this.setState({ skipButtonCheck: true });
        this.playSong();
    }
    pauseSong = () => {
        this.setState({ play: 1 });
        TrackPlayer.pause();
    }
    goToSongProfile = () => {
        this.setState({ showMusicModal: !this.state.showMusicModal });
        this.props.navigation.navigate('SongProfile')
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
                        <TouchableOpacity onPress={() => this.showMusicProfile_Modal(!this.state.showMusicModal, item)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 8, justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'column', flex: 0.4 }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F44336' }}>{item.title}</Text>
                                    <Text style={{ fontSize: 12, marginTop: 4, color: '#E57373' }}>{((item.duration) / 60).toFixed(2)}  {item.artist}</Text>
                                    <View style={{ borderWidth: 0.5, borderColor: '#d3d3d3', marginTop: 16, width: 324 }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.trackNumber.toString()}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showMusicModal}
                    onRequestClose={() => {
                        this.showMusicProfile_Modal(!this.state.showMusicModal);
                    }}
                    style={{ height: 100 }}
                >
                    <View style={{ height: '12%', bottom: 0, right: 0, left: 0, position: 'absolute', backgroundColor: '#fff', borderWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                        <TouchableOpacity onPress={() => this.goToSongProfile()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 8, justifyContent: 'space-between' }}>
                                <View style={{ flex: 0.4 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Thumbnail square style={{ backgroundColor: '#d3d3d3', borderRadius: 4 }} source={{ uri: this.props.selectedSongData.image }} />
                                        <View style={{ flexDirection: 'column', marginLeft: 8 }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F44336' }}>{this.props.selectedSongData.title}</Text>
                                            <Text style={{ fontSize: 12, marginTop: 2, color: '#E57373' }}>{this.props.selectedSongData.artist}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ alignContent: 'flex-end' }}>
                                    <View style={{ flex: 0.6 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => this.previousSong()}>
                                                <Icon type='AntDesign' name='caretleft' style={{ fontSize: 40, color: '#FFAB91' }} />
                                            </TouchableOpacity>
                                            {
                                                (this.state.play === 1)
                                                    ?
                                                    (
                                                        <TouchableOpacity onPress={() => this.playSong()}>
                                                            <Icon type='FontAwesome' name='play-circle' style={{ fontSize: 42, color: '#F44336' }} />
                                                        </TouchableOpacity>
                                                    )
                                                    :
                                                    (
                                                        <TouchableOpacity onPress={() => this.pauseSong()}>
                                                            <Icon type='MaterialIcons' name='pause-circle-filled' style={{ fontSize: 42, color: '#F44336' }} />
                                                        </TouchableOpacity>
                                                    )
                                            }
                                            <TouchableOpacity onPress={() => this.nextSong()}>
                                                <Icon type='AntDesign' name='caretright' style={{ fontSize: 40, color: '#FFAB91' }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
};

const mapStateToProps = state => {
    return {
        selectedSongData: state.songData.item
    }
}

const mapDispatchToProps = dispatch => {
    return {
        add: (item) => {
            dispatch(addSongData(item))
        }
    }
}
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Songs))
