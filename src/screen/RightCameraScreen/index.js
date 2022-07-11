'use strict';
import React, {Component,} from "react";
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-community/async-storage";
import Toast from 'react-native-easy-toast';
import Svg, {Rect, Circle, Line} from "react-native-svg";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import Axios from 'axios'
const DESIRED_RATIO = "4:3";
class RightCameraScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            box: null,
            message: null,
            color: "#FF0000",
            face: null,
            mesh: null,
            lines: null,
            cameraStatus: -1,
            isLoading: false
        }
        this.height = hp('87%');
        this.width = wp('100%');

        this.onFaceDetection = this.onFaceDetection.bind(this);
    }

    prepareRatio = async () => {
        if (Platform.OS === 'android' && this.camera) {
            const ratios = await this.camera.getSupportedRatiosAsync();            
            const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];
            this.setState({ratio});
        }
    }

    setMessage (msg, color) {
        this.setState({message: msg, color: color});
    }

    noFace() {
        const now_1 = moment().add(-1, "s");
        if (this.state.time && this.state.time.isBefore(now_1)) {
            this.setMessage("No face detected","#FF0000");
            this.setState({face: null, mesh: null, lines: null})
        }
    }

    componentDidMount() {
        // console.log ("face mark....", RNCamera)
        setInterval(
            () => this.noFace(),
            500
        )
    }

    onFaceDetection({faces}) {

        if (!faces || faces.length < 1) {
            this.setState ({cameraStatus: -1})
            return
        }
        let foreheadX = faces[0].rightEarPosition.x > faces[0].leftEarPosition.x ? faces[0].leftEarPosition.x : faces[0].rightEarPosition.x;
        let foreheadY = faces[0].rightEarPosition.y > faces[0].leftEarPosition.y ? faces[0].leftEarPosition.y : faces[0].rightEarPosition.y;
        let earDistance = faces[0].leftEarPosition.x - faces[0].rightEarPosition.x;

        foreheadY = foreheadY - ((faces[0].noseBasePosition.y - foreheadY) / 2);
        earDistance = earDistance >= 0 ? earDistance : -1 * earDistance;
        foreheadX = foreheadX + ((earDistance) / 2);
        const now = moment();        
        this.setState({
            face: faces[0].bounds,
            mesh: [
                faces[0].leftEarPosition,
                faces[0].rightEarPosition,
                faces[0].leftEyePosition,
                faces[0].rightEyePosition,
                faces[0].leftCheekPosition,
                faces[0].rightCheekPosition,
                faces[0].leftMouthPosition,
                faces[0].rightMouthPosition,
                faces[0].bottomMouthPosition,
                faces[0].noseBasePosition,
                {
                    x: foreheadX,
                    y: foreheadY
                }
            ],
            lines: [
                [
                    [
                        faces[0].leftEyePosition.x,
                        faces[0].leftEyePosition.y
                    ], [
                        faces[0].noseBasePosition.x,
                        faces[0].noseBasePosition.y
                    ]
                ], [
                    [
                        faces[0].leftEyePosition.x,
                        faces[0].leftEyePosition.y
                    ], [
                        faces[0].leftCheekPosition.x,
                        faces[0].leftCheekPosition.y
                    ]
                ], [
                    [
                        faces[0].rightEyePosition.x,
                        faces[0].rightEyePosition.y
                    ], [
                        faces[0].rightCheekPosition.x,
                        faces[0].rightCheekPosition.y
                    ]
                ], [
                    [
                        faces[0].leftEarPosition.x,
                        faces[0].leftEarPosition.y
                    ], [
                        faces[0].leftCheekPosition.x,
                        faces[0].leftCheekPosition.y
                    ]
                ], [
                    [
                        faces[0].rightEarPosition.x,
                        faces[0].rightEarPosition.y
                    ], [
                        faces[0].rightCheekPosition.x,
                        faces[0].rightCheekPosition.y
                    ]
                ], [
                    [
                        faces[0].rightEyePosition.x,
                        faces[0].rightEyePosition.y
                    ], [
                        faces[0].noseBasePosition.x,
                        faces[0].noseBasePosition.y
                    ]
                ], [
                    [
                        faces[0].leftMouthPosition.x,
                        faces[0].leftMouthPosition.y
                    ], [
                        faces[0].bottomMouthPosition.x,
                        faces[0].bottomMouthPosition.y
                    ]
                ], [
                    [
                        faces[0].rightMouthPosition.x,
                        faces[0].rightMouthPosition.y
                    ], [
                        faces[0].bottomMouthPosition.x,
                        faces[0].bottomMouthPosition.y
                    ]
                ], [
                    [
                        faces[0].rightMouthPosition.x,
                        faces[0].rightMouthPosition.y
                    ], [
                        faces[0].noseBasePosition.x,
                        faces[0].noseBasePosition.y
                    ]
                ], [
                    [
                        faces[0].leftMouthPosition.x,
                        faces[0].leftMouthPosition.y
                    ], [
                        faces[0].noseBasePosition.x,
                        faces[0].noseBasePosition.y
                    ]
                ], [
                    [
                        faces[0].rightMouthPosition.x,
                        faces[0].rightMouthPosition.y
                    ], [
                        faces[0].rightCheekPosition.x,
                        faces[0].rightCheekPosition.y
                    ]
                ], [
                    [
                        faces[0].leftMouthPosition.x,
                        faces[0].leftMouthPosition.y
                    ], [
                        faces[0].leftCheekPosition.x,
                        faces[0].leftCheekPosition.y
                    ]
                ],
            ],
            time: now
        })
        const size = faces[0].bounds.size;
        const heightRatio = size.height / this.height;
        const widthRatio = size.width / this.width;

        if (faces.length <= 0) {
            this.setState ({cameraStatus: -1})
            this.setMessage("No face detected","#FF0000");
        } else if(faces.length > 1) {
            this.setState ({cameraStatus: -1})
            this.setMessage("Make sure there are no people in the background","#FF0000");
        } else if (heightRatio > 0.55 && widthRatio > 0.55) {
            this.setState ({cameraStatus: 1})
            this.setMessage("Perfect!","#00FF00");
        } else if (heightRatio <= 0.55 || widthRatio <= 0.55) {
            this.setMessage("Come closer","#FF0000");
            this.setState ({cameraStatus: -1})
        } else {
            this.setState ({cameraStatus: -1})
            this.setMessage("Please retake","#FF0000");
        }           
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#DFE6EC'}}>    
                <Spinner
                    visible={this.state.isLoading}
                    textContent={'Saving...'}                
                    style={{color: 'white'}}
                />  
                <View style={{height: 100, justifyContent: 'flex-end'}}>
                    <Text style={{alignSelf: 'center', marginBottom: 20, fontSize: 20, fontWeight: 'bold'}}>Turn to the Right</Text>
                </View>          
                <View style={{flex: 1}}>                    
                    {this.state.message && <Text style={{
                        position: "absolute",
                        top: 20,
                        zIndex: 2,
                        alignSelf: "center",
                        backgroundColor: this.state.color + "77",
                        padding: 10,
                        borderRadius: 10
                    }}>{this.state.message}</Text>}     
                    <Image 
                      source={require('src/image/camera/right.jpeg')}                             
                      style={{width: wp('100%'), height: '90%', position: 'absolute', top: 20, zIndex: 3}}
                      resizeMode = "contain"
                    />               
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={{
                            height: hp('87%'), width: wp('100%'),
                            overflow: 'hidden'
                        }}
                        type={RNCamera.Constants.Type.front}
                        onCameraReady={this.prepareRatio} // You can only get the supported ratios when the camera is mounted
                        ratio={this.state.ratio}

                        captureAudio={false}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        defaultVideoQuality={RNCamera.Constants.VideoQuality['288p']}
                        onFacesDetected={this.onFaceDetection}
                        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks?RNCamera.Constants.FaceDetection.Landmarks.all: undefined}
                    >
                        {/* <Svg
                            height={hp(87)}
                            width={wp(100)}
                            viewBox={wp(10) + " "+hp(5)+" "+wp(90)+" "+hp(82)+""}
                        >
                            {this.state.face && <Rect
                                x={this.state.face.origin.x}
                                y={this.state.face.origin.y}
                                width={this.state.face.size.width}
                                height={this.state.face.size.height}
                                stroke={this.state.color + "77"}
                                strokeWidth="2"
                            />}
                        </Svg>
                        <Svg
                            height={hp(87)}
                            width={wp(100)}
                            style={{position: "absolute"}}
                        >
                            {this.state.mesh && this.state.mesh.map((v, i) => {
                                return <Circle cx={v.x} cy={v.y} r="3" fill={this.state.color + "77"} />
                            })}
                            {this.state.lines && this.state.lines.map((v, i) => {
                                return <Line x1={v[0][0]} y1={v[0][1]} x2={v[1][0]} y2={v[1][1]} stroke={this.state.color + "22"} strokeWidth="2" />
                            })}
                        </Svg> */}
                    </RNCamera>
                </View>
                <View style={{height: 150, backgroundColor: '#DFE6EC'}}>                    
                    <View style={{                            
                        backgroundColor: '#DFE6EC',
                        width: '100%',
                        flex: 1,     
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',        
                        marginTop: 20,               
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        shadowColor: 'black',
                        shadowOpacity: 0.3,
                        elevation: 1,                        
                        shadowRadius: 15,
                        shadowOffset: {width: 6, height: 5},
                    }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('camera')}
                                  style={Platform.OS === "ios" ? styles.backbtn : styles.backbtnAndroid}>
                            <Text style={{
                                fontSize: 18, color: 'black', fontWeight: 'bold',
                                fontFamily: 'Khula-Bold', marginTop: '6%', textAlign: 'center'
                            }}> Back </Text>
                        </TouchableOpacity>
                        {
                            this.state.cameraStatus == 1? 
                            <TouchableOpacity onPress={this.takePicture.bind(this)}
                                  style={Platform.OS === "ios" ? styles.regbtn : styles.regbtnAndroid}>
                                <Text style={{
                                    fontSize: 18, color: 'black', fontWeight: 'bold',
                                    fontFamily: 'Khula-Bold', marginTop: '6%', textAlign: 'center'
                                }}> Take Pic </Text>
                            </TouchableOpacity>: <View />
                        }
                        
                    </View>                    
                </View>                               
                <Toast position='top' ref="toast" style={{backgroundColor: 'green'}}/>
                <Toast position='top' ref="toast1" style={{backgroundColor: 'red'}}/>
            </View>
        );
    }

    takePicture = async () => {        

        if (this.state.cameraStatus != 1) return;
        this.setState({isLoading: true})
        if (this.camera) {
            const options = {
                quality: 0.5, fixOrientation: true, mirrorImage: true, skipProcessing: true,
                width: 500, height: 1000,
            };
            const data = await this.camera.takePictureAsync(options);
            const dataUri = data.uri
            const position = dataUri.lastIndexOf("/")     
            
            const Imagedata = new FormData()                    
            Imagedata.append('file', {
                uri: dataUri,
                type: 'image/jpg',
                name: dataUri.substring(position + 1, dataUri.length)     
            });                      
            const url = "http://18.222.228.44:3000/" + "imageUpload";
            Axios.post(url, Imagedata, {    
                  "headers":{  
                    "Content-Type": "multipart/form-data"      
            }})
            .then(res => {
                if (res.data.status == 1) {
                    this.setState({isLoading: false})
                    AsyncStorage.setItem('rightImage', res.data.filename);                    
                    this.props.navigation.navigate('leftCamera');
                }
            })  
            .catch( error => this.setState({isLoading: false}) );           
        }
    };
}

export default RightCameraScreen;

const styles = StyleSheet.create({

    preview: {
        height: hp('40%'),
        width: hp('40%'),
        borderRadius: hp('20%'),
        backgroundColor: 'white'
    },

    progressBar: {
        height: 25,
        width: 320,
        backgroundColor: 'white',
        borderColor: '#EFEFEF',
        borderWidth: 2,
        borderRadius: 12,
        alignSelf: 'center',
    },

    progressBarfill: {
        height: 20,
        width: 53,
        borderRadius: 11,
        backgroundColor: '#66893E',
    },
    oval: {
        marginTop: 10,
        textAlign: 'center',
        fontSize: 20,
    },
    regbtn: {        
        height: 60,
        width: 200,
        marginLeft: 20,
        fontSize: 15,
        fontFamily: 'Khula-Bold',
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 1,
        backgroundColor: "#DFE6EC",
        shadowRadius: 15,
        shadowOffset: {width: 6, height: 5},
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        justifyContent: 'center',
        textAlign: "center"
    },

    regbtnAndroid: {        
        height: 60,
        width: 200,        
        fontSize: 15,
        fontFamily: 'Khula-Bold',
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.8,
        elevation: 15,
        backgroundColor: "#DFE6EC",
        shadowRadius: 15,
        shadowOffset: {width: 56, height: 13},
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        justifyContent: 'center',
        textAlign: "center",
    },

    backbtn: {        
        height: 60,
        width: 100,
        marginLeft: 20,
        fontSize: 15,
        fontFamily: 'Khula-Bold',
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 1,
        backgroundColor: "#DFE6EC",
        shadowRadius: 15,
        shadowOffset: {width: 6, height: 5},
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        justifyContent: 'center',
        textAlign: "center"
    },

    backbtnAndroid: {        
        height: 60,
        width: 100,        
        fontSize: 15,
        fontFamily: 'Khula-Bold',
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.8,
        elevation: 15,
        backgroundColor: "#DFE6EC",
        shadowRadius: 15,
        shadowOffset: {width: 56, height: 13},
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        justifyContent: 'center',
        textAlign: "center",
    },
});