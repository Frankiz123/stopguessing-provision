import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
    BackHandler
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Alert} from "react-native";

const deviceWidth = Dimensions.get('window').width;

export default class oilySkin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            final_image: '',
            pathcountOily: '',
            progress: 80,
            data: [],
            loading: true,
            user_id: null
        }
        this.onEnd = this.onEnd.bind(this);
    }

    componentWillMount = async () => {
        console.log("kkkkk....")
        const now = await AsyncStorage.getItem('editPicture_show');
        const user_id = await AsyncStorage.getItem('user_id');

        this.setState({
            final_image: now,
            user_id: user_id
        });
    }

    check = async (success, path) => {
        AsyncStorage.setItem("pathcountOily", JSON.stringify(this.state.pathcountOily));
        if (this.state.pathcountOily === 0 && Platform.OS !== 'ios') {
            this.props.navigation.navigate("thankYou")
        } else {
            await this.grabPixels(success, path)
        }
    }

    grabPixels = async (success, path) => {
        this.setState({
            spinner: true
        });
        AsyncStorage.setItem("pathsForOilySkin", JSON.stringify(this.state.data));

        const user_id = await AsyncStorage.getItem('user_id');
        const finalPath = 'file://file' + path;
        const newVar = finalPath.split("/");

        const imgName = newVar[newVar.length - 1];

        const newImage = {
            uri: finalPath,

            type: 'image/jpg',
            name: imgName
        };
        const data = new FormData();
        data.append("insert_id", ""+user_id)

        data.append('profile', newImage)

        let dataFetch =
            {
                method: 'POST',
                body: data,
                headers:
                    {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'

                    },
            };

        fetch('http://18.222.228.44:3000/oilySkin', dataFetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                // alert(responseJson.data.id);
                if (responseJson.status === "true") {
                    this.setState({
                        spinner: false
                    });

                    this.props.navigation.navigate('thankYou');
                } else {
                    alert('incorrect');
                }
            }).catch((error) => {
            // console.error("api not",error);
            setTimeout(() => {
                Alert.alert(
                    //title
                    'Stop Guessing',
                    //body
                    'Please check your internet connection.',
                    [
                        {
                            text: 'Ok', onPress: () => BackHandler.exitApp()
                        },
                    ],
                    {cancelable: false}
                );
            }, 3000);
        }).done();
    }

    path_count = async (pathsCount) => {
        if(this.state.loading) {
            this.setState({loading: false});
        } else if (this.state.data.length === 0 && this.state.data.length - pathsCount === 0 ) {
            this.props.navigation.navigate('drySkin');
        } else if (this.state.data.length !== 0 && this.state.data.length - pathsCount === 1) {
            const data = this.state.data;
            data.pop();
            this.setState({data: [...data]});
        } else if (this.state.data.length !== 0 && this.state.data.length - pathsCount === this.state.data.length) {
            this.setState({data: []});
        }
        this.setState({pathcountOily: pathsCount});
    }

    onEnd(paths) {
        if (this.state.data){
            this.setState({data: [...this.state.data, paths]});
        } else {
            this.setState({data: [paths]});
        }
    }

    render() {
        const barWidth = Dimensions.get('screen').width - 40;

        const srcImage = {
            filename: this.state.final_image,
            directory: '',
            mode: 'AspectFill'
        }

        return (
            <View style={{flex: 1, backgroundColor: '#DFE6EC'}}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Saving...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={{backgroundColor: '#DFE6EC'}}>

                    <RNSketchCanvas
                        canvasStyle={{
                            height: hp('79%'),
                            width: wp('100%'),
                            position: "absolute",
                            backgroundColor: 'white'
                        }}

                        localSourceImage={srcImage}
                        undoComponent={<View style={Platform.OS === "ios" ? styles.undo : styles.undoAndroid}><Text
                            style={{color: 'black', textAlign: 'center', fontFamily: 'Khula-Bold'}}>Undo</Text></View>}
                        clearComponent={<View style={Platform.OS === "ios" ? styles.clear : styles.clearAndroid} >
                            <Text style={{
                                textAlign: 'center',
                                color:this.state.data.length > 0 ? 'black' : "red",
                                fontFamily: 'Khula-Bold'}}>{this.state.data.length > 0 ? "Clear" : "Back"}</Text>
                        </View>}
                        defaultStrokeWidth={10}
                        strokeColors={[{color: '#080000'}, {color: '#080000'}]}
                        saveComponent={<View style={Platform.OS === "ios" ? styles.next : styles.nextAndroid}><Text
                            style={{textAlign: 'center', color: 'white', fontFamily: 'Khula-Bold',}}>Next</Text></View>}

                        savePreference={() => {
                            return {
                                folder: 'StopGuessing',
                                filename: String("OilySkin-" + this.state.user_id + "-" + Math.ceil(Math.random() * 100000000)),
                                transparent: true,
                                imageType: 'jpg',
                                includeImage: true,
                                includeText: false,
                                cropToImageSize: true
                            }
                        }}
                        onSketchSaved={this.grabPixels}
                        onPathsChange={this.path_count}
                        onStrokeEnd={this.onEnd}
                    />
                    <View style={styles.progressBar}>
                        <ProgressBarAnimated
                            width={barWidth}
                            height={18}
                            value={this.state.progress}
                            backgroundColor="black"
                            elevation={15}
                        />
                    </View>
                </View>

                <View style={{bottom: 102}}>
                    <View style={{
                        backgroundColor: '#DFE6EC',
                        width: deviceWidth,
                        height: 40,
                        bottom: hp('9%'),
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30
                    }}>
                        <Text style={{
                            fontSize: 24,
                            textAlign: 'center',
                            color: 'black',
                            fontWeight: '600',
                            marginTop: 10,
                            fontFamily: 'Khula-Bold'
                        }}>Touch the Oily Skin</Text></View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    strokeColorButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
    },
    strokeWidthButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#39579A'
    },
    functionButton: {
        marginHorizontal: 35,
        marginTop: hp('92%'),
        height: 30,
        width: 60,
        backgroundColor: '#79A14B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        height: 18,
        width: '89%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignSelf: 'center',
        bottom: hp('90%'),
        backgroundColor: 'white'
    },

    progressBarfill: {
        height: 20,
        width: 265,
        borderRadius: 11,
        backgroundColor: '#66893E',
    },
    bottomview: {
        height: 40,
        width: wp('100%'),
        backgroundColor: 'white',
        bottom: 0,

    },
    spinnerTextStyle: {
        color: 'white'
    },
    undo: {
        marginTop: hp('90%'),
        height: '6%',
        width: '80%',
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
        backgroundColor: '#DFE6EC',
        justifyContent: 'center',
        marginRight: '50%',
        marginLeft: '-0%',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 1,
        borderColor: 'black',
        shadowOffset: {width: 6, height: 5}
    },

    undoAndroid: {
        marginTop: hp('87%'),
        height: '6%',
        width: '80%',
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
        backgroundColor: '#DFE6EC',
        justifyContent: 'center',
        marginRight: '50%',
        marginLeft: '-0%',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 15,
        borderColor: 'black',
        shadowOffset: {width: 6, height: 5}
    },

    clear: {
        marginTop: hp('90%'),
        height: '6%',
        width: '80%',
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        backgroundColor: '#DFE6EC',
        justifyContent: 'center',
        marginRight: '65%',
        marginLeft: '-20%',
        shadowColor: 'black',

        shadowOpacity: 0.3,
        elevation: 1,
        shadowOffset: {width: 6, height: 5},

        borderColor: 'black',
        //  borderRadius:10
    },
    clearAndroid: {
        marginTop: hp('87%'),
        height: '6%',
        width: '80%',
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        backgroundColor: '#DFE6EC',
        justifyContent: 'center',
        marginRight: '65%',
        marginLeft: '-20%',
        shadowColor: 'black',

        shadowOpacity: 0.3,
        elevation: 15,
        shadowOffset: {width: 6, height: 5},

        borderColor: 'black',
//  borderRadius:10
    },
    next: {
        marginTop: hp('90%'),
        height: '6%',
        width: '80%',
        borderRadius: 60 / 2,
        backgroundColor: 'black',
        justifyContent: 'center',
        marginRight: '40%',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 1,
        shadowOffset: {width: 6, height: 6},
    },

    nextAndroid: {
        marginTop: hp('87%'),
        height: '6%',
        width: '80%',
        borderRadius: 60 / 2,
        backgroundColor: 'black',
        justifyContent: 'center',
        marginRight: '40%',
        shadowColor: 'black',
        shadowOpacity: 0.8,
        elevation: 15,
        shadowOffset: {width: 36, height: 16},
    },

});