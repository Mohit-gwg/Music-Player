import React, { Component } from 'react'
import { View, StatusBar, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { Header, Icon, Button, Body, Title, Right, Card } from 'native-base';
import { connect } from 'react-redux';
import { addFavSongData } from '../Actions/FavSongData';
import { withNavigation } from 'react-navigation';

class SongProfile extends Component {
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
            skipSongCheck: false,
            favClickCheck: false,
            play: 1,
        }
    }
    static navigationOptions = ({ navigation }) => ({
        title: "Music Player",
        headerStyle: {
            backgroundColor: '#F44336'
        },
        headerTintColor: '#fff',
        headerRight: <Icon type='FontAwesome' name='music' style={{ fontSize: 15, color: '#000', marginRight: 16 }} />
    });

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
        this.setState({ skipSongCheck: true });
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
        this.setState({ skipSongCheck: true });
        this.playSong();
    }
    playSong = () => {
        this.setState({ play: 2 });
        if (this.state.skipSongCheck == true) {
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
        if (this.state.skipSongCheck === true) {
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
    addFavSong = () => {
        if (this.state.favClickCheck === true) {
            this.state.favClickCheck = false;
            if (this.props.FavSongData.length > 0 && this.state.skipSongCheck === true) {
                for (i = 0; i < this.props.FavSongData.length; i++) {
                    if (this.props.FavSongData[i].currentTrackNumber == this.state.currentTrackNumber) {
                        this.props.FavSongData.splice(this.props.FavSongData[i], 1);
                    }
                }
            }
            else if (this.props.FavSongData.length > 0 && this.state.skipSongCheck === false) {
                for (i = 0; i < this.props.FavSongData.length; i++) {
                    if (this.props.FavSongData[i].trackNumber == this.props.selectedSongData.trackNumber) {
                        this.props.FavSongData.splice(this.props.FavSongData[i], 1);
                    }
                }
            }
        } // favClickCheck === true if() end
        else {
            this.state.favClickCheck = true;
            if (this.state.skipSongCheck == true) {
                var favSongData = {
                    currentTrackNumber: this.state.currentTrackNumber,
                    currentSong: this.state.currentSong,
                    currentTitle: this.state.currentTitle,
                    currentArtist: this.state.currentArtist,
                    currentImage: this.state.currentImage,
                    currentAlbum: this.state.currentAlbum,
                };
                this.props.add(favSongData);
            }
            else {
                this.props.add(this.props.selectedSongData);
            }
        }
        this.setState({ refresh: true })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ECEFF1' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <ImageBackground style={{ height: '55%', width: '100%', backgroundColor: '#d3d3d3' }} source={{ uri: this.props.selectedSongData.image }}>
                    <View style={{ bottom: 0, right: 0, left: 0, position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                        <Card transparent>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'flex-end' }}>
                                <View style={{ flexDirection: 'column', padding: 8, }}>
                                    {
                                        (this.state.favClickCheck == false)
                                            ?
                                            (
                                                <TouchableOpacity onPress={() => this.addFavSong()}>
                                                    <Icon type='FontAwesome' name='heart-o' style={{ fontSize: 32, color: '#E57373', marginBottom: 8 }} />
                                                </TouchableOpacity>
                                            )
                                            :
                                            (
                                                <TouchableOpacity onPress={() => this.addFavSong()}>
                                                    <Icon type='FontAwesome' name='heart' style={{ fontSize: 32, color: '#F44336', marginBottom: 8 }} />
                                                </TouchableOpacity>
                                            )
                                    }
                                </View>
                            </View>
                        </Card>
                    </View>
                </ImageBackground>
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
        selectedSongData: state.songData.item,
        FavSongData: state.addFavSongData.favSongData,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        add: (favSongData) => {
            dispatch(addFavSongData(favSongData))
        }
    }
}
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(SongProfile))
