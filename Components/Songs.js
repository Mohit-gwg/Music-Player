import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Modal, ScrollView, TouchableHighlight, TextInput, ToastAndroid } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { Thumbnail, Icon } from 'native-base';
import { addSongData } from '../Actions/SongData';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
class Songs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check: false,
            musicData: [],
            showMusicModal: false,
            showEditFileModal: false,
            currentTitle: '',
            currentSong: '',
            currentArtist: '',
            currentImage: '',
            currentTrackNumber: 0,
            play: 1,
            skipButtonCheck: false,
            hasPermission: undefined,
            audioPath: '',
            fileName: '',
        }
    }
    componentWillMount() {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });
            if (!isAuthorised) return;
            this.prepareRecordingPath(AudioUtils.DocumentDirectoryPath + '/test.aac');
            AudioRecorder.onProgress = (data) => {
                this.setState({ currentTime: Math.floor(data.currentTime) });
            };
            AudioRecorder.onFinished = (data) => {
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });
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
    showMusicProfile_Modal(visible, item) {
        if (item === undefined || item === null) {
            this.setState({ showMusicModal: visible });
        }
        else {
            this.props.add(item);
            this.setState({ showMusicModal: visible });
        }
    }
    showEditFile_Modal(visible) {
        this.setState({ showEditFileModal: visible });
    }
    recordAudio = () => {
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/' + 'test.aac';
        AudioRecorder.prepareRecordingAtPath(path, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000,
        });
        AudioRecorder.startRecording();
        this.state.fileName = '';
    }
    stopRecording = () => {
        AudioRecorder.stopRecording();
    }
    addFileName = () => {
        AudioRecorder.stopRecording();
        if (this.state.fileName == '') {
            return ToastAndroid.show('Please add file name!', ToastAndroid.SHORT);
        }
        else {
            var RNFS = require('react-native-fs');
            var path = RNFS.moveFile(RNFS.DocumentDirectoryPath + '/' + 'test.aac', RNFS.DocumentDirectoryPath + '/' + this.state.fileName).then((success) => {
                console.log(success);
            });
            RNFS.exists(RNFS.DocumentDirectoryPath + '/' + this.state.fileName)
                .then((exists) => {
                    if (exists) {
                        console.log("file EXISTS");
                    } else {
                        console.log("file DOES NOT EXIST");
                    }
                });
            this.state.musicData.push({ title: this.state.fileName, source: path, trackNumber: 12 });
            this.setState({ showEditFileModal: !this.state.showEditFileModal, check: !this.state.check, audioPath: RNFS.DocumentDirectoryPath + '/' + this.state.fileName });
        }
    }
    playRecordedAudio = () => {
        TrackPlayer.add({
            id: 1,
            url: this.state.audioPath,
        }).then(() => {
            TrackPlayer.play();
        });
    }
    playSong = () => {
        this.setState({ play: 2 });
        if (this.state.skipButtonCheck == true && this.state.fileName == '') {
            TrackPlayer.reset();
            TrackPlayer.add({
                id: this.state.currentTrackNumber,
                url: 'http://storage.googleapis.com/automotive-media/' + this.state.currentSong,
                title: this.state.currentTitle,
                artist: this.state.currentArtist,
                artwork: 'http://storage.googleapis.com/automotive-media/' + this.state.currentImage,
            }).then(() => {
                TrackPlayer.play();
            });
        }
        else if (this.state.fileName != '') {
            TrackPlayer.add({
                id: 1,
                url: this.state.audioPath,
            }).then(() => {
                TrackPlayer.play();
            });
        }
        else {
            TrackPlayer.add({
                id: this.props.selectedSongData.trackNumber,
                url: 'http://storage.googleapis.com/automotive-media/' + this.props.selectedSongData.source,
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
        this.props.navigation.navigate('SongProfile');
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ECEFF1' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
                <ScrollView>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{ margin: 8 }}
                        data={this.state.musicData}
                        extraData={this.state.check}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => this.showMusicProfile_Modal(!this.state.showMusicModal, item)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 8, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'column', flex: 0.4 }}>
                                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F44336' }}>{item.title}</Text>
                                        {
                                            (item.duration == null || item.duration == undefined || item.duration == '')
                                                ?
                                                (
                                                    <View></View>
                                                )
                                                :
                                                (
                                                    <View>
                                                        <Text style={{ fontSize: 12, marginTop: 4, color: '#E57373' }}>{((item.duration) / 60).toFixed(2)}  {item.artist}</Text>
                                                        <View style={{ borderWidth: 0.5, borderColor: '#d3d3d3', marginTop: 16, width: 324 }} />
                                                    </View>
                                                )
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item.trackNumber.toString()}
                    />
                    <View style={{ justifyContent: 'center', alignItems: 'center', margin: 16 }}>
                        <TouchableHighlight onPress={() => this.showEditFile_Modal(!this.state.showEditFileModal)}>
                            <Icon type='MaterialIcons' name='keyboard-voice' style={{ fontSize: 42, color: '#F44336' }} />
                        </TouchableHighlight>
                    </View>
                </ScrollView>

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

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showEditFileModal}
                    onRequestClose={() => {
                        this.showEditFile_Modal(!this.state.showEditFileModal);
                    }}
                    style={{ height: 100 }}
                >
                    <View style={{ height: '40%', bottom: 0, right: 0, left: 0, position: 'absolute', backgroundColor: '#fff', borderWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                        <View style={{ margin: 8 }}>
                            <ScrollView>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 16 }}>
                                    <TouchableHighlight onPress={() => this.recordAudio()} style={{ marginRight: 32 }}>
                                        <Icon type='MaterialIcons' name='keyboard-voice' style={{ fontSize: 40, color: '#F44336' }} />
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.stopRecording()}>
                                        <Icon type='FontAwesome' name='stop' style={{ fontSize: 40, color: '#F44336' }} />
                                    </TouchableHighlight>
                                </View>
                                <View style={{ margin: 8 }}>
                                    <TextInput
                                        style={{ height: 50, alignSelf: 'center', marginBottom: 16, marginTop: 16 }}
                                        placeholder="Add file Name"
                                        onChangeText={(text) => this.setState({ fileName: text })}
                                        value={this.state.fileName}
                                    />
                                </View>
                            </ScrollView>
                            <TouchableHighlight style={{ height: '22%', width: '100%', backgroundColor: '#F44336', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }} onPress={() => this.addFileName()}>
                                <Text style={{ textAlign: 'center', alignItems: 'center', color: '#fff' }}>Add File Name</Text>
                            </TouchableHighlight>
                        </View>
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
