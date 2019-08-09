import React, { Component } from 'react'
import { View, StatusBar, Text, Image, TouchableOpacity } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

class SongProfile extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Music Player",
        headerStyle: {
            backgroundColor: '#F44336'
        },
        headerTintColor: '#fff',
    });
    constructor(props) {
        super(props);
        this.state = {
            musicData: [],
            currentTrackNumber: 0,
            currentSong: '',
            currentTitle: '',
            currentArtist: '',
            currentImage: '',
            currentAlbum: '',
            refresh: false,
            skipButtonCheck: false,
            play: 1,
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
    async componentDidMount() {
        this.setState({ currentTrackNumber: this.props.selectedSongData.trackNumber })
        await TrackPlayer.setupPlayer({});
        await TrackPlayer.add({
            id: this.props.selectedSongData.trackNumber,
            url: 'http://storage.googleapis.com/automotive-media/' + this.props.selectedSongData.source, // just for test!
            title: this.props.selectedSongData.title,
            artist: this.props.selectedSongData.artist,
            artwork: 'http://storage.googleapis.com/automotive-media/' + this.props.selectedSongData.image,
        })
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
    pauseSong = () => {
        this.setState({ play: 1 });
        TrackPlayer.pause();
    }
    replaySong = () => {
        TrackPlayer.reset();
        if (this.state.skipButtonCheck === true) {
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
                url: 'http://storage.googleapis.com/automotive-media' + this.props.selectedSongData.source, // just for test!
                title: this.props.selectedSongData.title,
                artist: this.props.selectedSongData.artist,
                artwork: 'http://storage.googleapis.com/automotive-media' + this.props.selectedSongData.image,
            }).then(() => {
                TrackPlayer.play();
            });
        }
    }
    resetSong = () => {
        TrackPlayer.reset();
    }
    render() {
        console.log('Redux Data', this.props.selectedSongData)
        return (
            <View style={{ flex: 1, backgroundColor: '#ECEFF1' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <Image style={{ height: '55%', width: '100%', backgroundColor: '#d3d3d3' }} source={{ uri: this.props.selectedSongData.image }} />
                <View style={{ margin: 32 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon type='FontAwesome' name='music' style={{ fontSize: 25, color: '#F44336', marginBottom: 16 }} />
                        {(this.state.currentSong === '') ? (<Text style={{ marginLeft: 16, fontSize: 18, fontWeight: 'bold', color: '#FFAB91' }}>{this.props.selectedSongData.title}</Text>) : (<Text style={{ marginLeft: 16, fontSize: 18, fontWeight: 'bold', color: '#FFAB91' }}>{this.state.currentTitle}</Text>)}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon type='Ionicons' name='md-microphone' style={{ fontSize: 25, color: '#F44336', marginBottom: 16, marginLeft: 8 }} />
                        {(this.state.currentSong === '') ? (<Text style={{ marginLeft: 16, fontSize: 18, fontWeight: 'bold', color: '#FFAB91' }}>{this.props.selectedSongData.artist}</Text>) : (<Text style={{ marginLeft: 16, fontSize: 18, fontWeight: 'bold', color: '#FFAB91' }}>{this.state.currentArtist}</Text>)}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon type='MaterialIcons' name='album' style={{ fontSize: 25, color: '#F44336' }} />
                        {(this.state.currentSong === '') ? (<Text style={{ marginLeft: 12, fontSize: 18, fontWeight: 'bold', color: '#FFAB91' }}>{this.props.selectedSongData.album}</Text>) : (<Text style={{ marginLeft: 12, fontSize: 18, fontWeight: 'bold', color: '#FFAB91' }}>{this.state.currentAlbum}</Text>)}
                    </View>
                </View>
                <View
                    style={{ borderWidth: 0.5, borderColor: '#d3d3d3', marginLeft: 16, marginRight: 16 }}
                />
                <View style={{ flexDirection: 'column', margin: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 0.2, marginLeft: 4 }}>
                            <TouchableOpacity onPress={() => this.resetSong()}>
                                <Icon type='MaterialIcons' name='shuffle' style={{ fontSize: 25, color: '#F44336' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.6, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.previousSong()}>
                                    <Icon type='AntDesign' name='banckward' style={{ fontSize: 50, color: '#FFAB91' }} />
                                </TouchableOpacity>
                                {
                                    (this.state.play === 1)
                                        ?
                                        (
                                            <TouchableOpacity onPress={() => this.playSong()}>
                                                <Icon type='FontAwesome' name='play-circle' style={{ fontSize: 60, color: '#F44336', marginLeft: 16, marginRight: 16 }} />
                                            </TouchableOpacity>
                                        )
                                        :
                                        (
                                            <TouchableOpacity onPress={() => this.pauseSong()}>
                                                <Icon type='MaterialIcons' name='pause-circle-filled' style={{ fontSize: 60, color: '#F44336', marginLeft: 16, marginRight: 16 }} />
                                            </TouchableOpacity>
                                        )
                                }
                                <TouchableOpacity onPress={() => this.nextSong()}>
                                    <Icon type='AntDesign' name='forward' style={{ fontSize: 50, color: '#FFAB91' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 0.2, alignItems: 'flex-end', marginRight: 4 }}>
                            <TouchableOpacity onPress={() => this.replaySong()}>
                                <Icon type='MaterialCommunityIcons' name='replay' style={{ fontSize: 25, color: '#F44336' }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        selectedSongData: state.songData.item
    }
}
export default withNavigation(connect(mapStateToProps, null)(SongProfile))
