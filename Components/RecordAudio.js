import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Modal, ScrollView, TouchableHighlight, TextInput, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import { Icon } from 'native-base';
import { addSongData } from '../Actions/SongData';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
class RecordAudio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check: false,
            audioPath: '',
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
            showEditFileModal: false,
            fileName: '',
            currentTime: 0,
        }
    }
    componentWillMount() {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });
            if (!isAuthorised) return;
            this.prepareRecordingPath(AudioUtils.DocumentDirectoryPath + '/test.aac');
            AudioRecorder.onProgress = (data) => {
                this.state.currentTime = Math.floor(data.currentTime)
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
    recordAudio = () => {
        this.state.fileName = '';
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/' + 'test.aac';
        this.setState({ audioPath: path })
        AudioRecorder.prepareRecordingAtPath(path, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000,
        });
        AudioRecorder.startRecording();
    }
    async stopRecording() {
        await AudioRecorder.stopRecording();
    }
    addFileName = () => {
        var RNFS = require('react-native-fs');
        var path = `${RNFS.DocumentDirectoryPath}/${this.state.fileName}.aac`;
        console.log(path);
        this.state.check = !this.state.check;
        if (this.state.fileName == '') {
            return ToastAndroid.show('Please add file name!', ToastAndroid.SHORT);
        }
        else {
            RNFS.moveFile(this.state.audioPath, path);
            RNFS.exists(path)
                .then((exists) => {
                    if (exists) {
                        return ToastAndroid.show(this.state.fileName + ' file name already exist, Please try another one!', ToastAndroid.CENTER);
                    } else {
                        this.state.musicData.push({ title: this.state.fileName, source: path, trackNumber: 12 });
                        this.setState({ showEditFileModal: !this.state.showEditFileModal, check: !this.state.check });
                    }
                });
        }
        this.state.musicData.push({ title: this.state.fileName, source: path, trackNumber: 12 });
        this.setState({ showEditFileModal: !this.state.showEditFileModal, check: !this.state.check });
    }
    showMusicProfile_Modal(visible, item) {
        if (item === undefined) {
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
    playSong = () => {
        this.setState({ play: 2 });
    }
    pauseSong = () => {
        this.setState({ play: 1 });
    }
    nextSong = () => {
        var nextTrackNumber = this.state.currentTrackNumber + 1;
        this.state.currentTrackNumber = nextTrackNumber;
        for (var i = 0; i <= this.state.musicData.length; i++) {
            if (this.state.musicData[i].trackNumber == nextTrackNumber) {
                this.state.currentTrackNumber = this.state.musicData[i].trackNumber
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
    goToSongProfile = () => {
        this.setState({ showMusicModal: !this.state.showMusicModal });
        this.props.navigation.navigate('RecordedAudioProfile');
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ECEFF1' }}>
                <StatusBar barStyle="light-content" backgroundColor="#E57373" />
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
                                    <Text style={{ fontSize: 12, marginTop: 4, color: '#E57373' }}>{((item.duration) / 60).toFixed(2)}  {item.artist}</Text>
                                    <View style={{ borderWidth: 0.5, borderColor: '#d3d3d3', marginTop: 16, width: 324 }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.trackNumber.toString()}
                />
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#E57373', position: 'absolute', bottom: 40, right: 30, elevation: 5 }}>
                    <TouchableHighlight onPress={() => this.showEditFile_Modal(!this.state.showEditFileModal)}>
                        <Icon type='MaterialIcons' name='keyboard-voice' style={{ fontSize: 55, color: '#F44336', marginLeft: 2 }} />
                    </TouchableHighlight>
                </View>
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
                                        {
                                            (this.state.skipButtonCheck === true && this.state.play === 1 && this.state.currentImage != undefined)
                                                ?
                                                (
                                                    <View style={{ marginRight: 8 }}>
                                                        <Video source={{ uri: 'http://storage.googleapis.com/automotive-media/' + this.state.currentSong }}
                                                            ref={(ref) => {
                                                                this.player = ref
                                                            }}
                                                            paused={true}
                                                            poster={'http://storage.googleapis.com/automotive-media/' + this.state.currentImage}
                                                            style={{ width: 50, height: 50 }} />
                                                    </View>
                                                )
                                                :
                                                (this.state.skipButtonCheck === true && this.state.play === 2 && this.state.currentImage != undefined)
                                                    ?
                                                    (
                                                        <View style={{ marginRight: 8 }}>
                                                            <Video source={{ uri: 'http://storage.googleapis.com/automotive-media/' + this.state.currentSong }}
                                                                ref={(ref) => {
                                                                    this.player = ref
                                                                }}
                                                                poster={'http://storage.googleapis.com/automotive-media/' + this.state.currentImage}
                                                                style={{ width: 50, height: 50 }} />
                                                        </View>
                                                    )
                                                    :
                                                    (this.state.skipButtonCheck === false && this.state.play === 1 && this.props.selectedSongData.image != undefined)
                                                        ?
                                                        (
                                                            <View style={{ marginRight: 8 }}>
                                                                <Video source={{ uri: 'http://storage.googleapis.com/automotive-media/' + this.props.selectedSongData.source }}
                                                                    ref={(ref) => {
                                                                        this.player = ref
                                                                    }}
                                                                    paused={true}
                                                                    poster={'http://storage.googleapis.com/automotive-media/' + this.props.selectedSongData.image}
                                                                    style={{ width: 45, height: 45 }} />
                                                            </View>
                                                        )
                                                        :
                                                        (this.state.skipButtonCheck === false && this.state.play === 2 && this.props.selectedSongData.image != undefined)
                                                            ?
                                                            (
                                                                <View style={{ marginRight: 8 }}>
                                                                    <Video source={{ uri: 'http://storage.googleapis.com/automotive-media/' + this.props.selectedSongData.source }}
                                                                        ref={(ref) => {
                                                                            this.player = ref
                                                                        }}
                                                                        poster={'http://storage.googleapis.com/automotive-media/' + this.props.selectedSongData.image}
                                                                        style={{ width: 45, height: 45 }} />
                                                                </View>
                                                            )
                                                            :
                                                            (this.state.skipButtonCheck === false && this.state.play === 1 && this.props.selectedSongData.image === undefined)
                                                                ?
                                                                (
                                                                    <View style={{ marginRight: 8 }}>
                                                                        <Video source={{ uri: this.props.selectedSongData.source }}
                                                                            ref={(ref) => {
                                                                                this.player = ref
                                                                            }}
                                                                            paused={true}
                                                                            audioOnly={true}
                                                                            style={{ width: 45, height: 45 }} />
                                                                    </View>
                                                                )
                                                                :
                                                                (this.state.skipButtonCheck === false && this.state.play === 2 && this.props.selectedSongData.image === undefined)
                                                                    ?
                                                                    (
                                                                        <View style={{ marginRight: 8 }}>
                                                                            <Video source={{ uri: this.props.selectedSongData.source }}
                                                                                ref={(ref) => {
                                                                                    this.player = ref
                                                                                }}
                                                                                audioOnly={true}
                                                                                style={{ width: 45, height: 45 }} />
                                                                        </View>
                                                                    )
                                                                    :
                                                                    (this.state.skipButtonCheck === true && this.state.play === 1 && this.state.currentImage === undefined)
                                                                        ?
                                                                        (
                                                                            <View style={{ marginRight: 8 }}>
                                                                                <Video source={{ uri: this.state.currentSong }}
                                                                                    ref={(ref) => {
                                                                                        this.player = ref
                                                                                    }}
                                                                                    paused={true}
                                                                                    audioOnly={true}
                                                                                    style={{ width: 45, height: 45 }} />
                                                                            </View>
                                                                        )
                                                                        :
                                                                        (this.state.skipButtonCheck === true && this.state.play === 2 && this.state.currentImage === undefined)
                                                                            ?
                                                                            (
                                                                                <View style={{ marginRight: 8 }}>
                                                                                    <Video source={{ uri: this.state.currentSong }}
                                                                                        ref={(ref) => {
                                                                                            this.player = ref
                                                                                        }}
                                                                                        audioOnly={true}
                                                                                        style={{ width: 45, height: 45 }} />
                                                                                </View>
                                                                            )
                                                                            :
                                                                            (
                                                                                <View></View>
                                                                            )

                                        }
                                        <View style={{ flexDirection: 'column', marginLeft: 8 }}>
                                            {
                                                (this.state.currentTitle === '')
                                                    ?
                                                    (
                                                        <View>
                                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F44336' }}>{this.props.selectedSongData.title}</Text>
                                                            <Text style={{ fontSize: 12, marginTop: 2, color: '#E57373' }}>{this.props.selectedSongData.artist}</Text>
                                                        </View>
                                                    )
                                                    :
                                                    (
                                                        <View>
                                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#F44336' }}>{this.state.currentTitle}</Text>
                                                            <Text style={{ fontSize: 12, marginTop: 2, color: '#E57373' }}>{this.state.currentArtist}</Text>
                                                        </View>
                                                    )
                                            }
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
                                <Text style={{ textAlign: 'center', alignItems: 'center', color: '#fff' }}>SUBMIT</Text>
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
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(RecordAudio))
