import React, {Component,} from "react";
import {
    Text,
    ImageBackground,
    BackHandler,
    Image
} from "react-native";
import {Container, View} from 'native-base';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from "react-native-animatable";
import {Alert} from "react-native";
import Svg, {Circle, Polyline} from "react-native-svg";

class thankYou extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner: true,
            img: '',
            acnePaths: [],
            finePaths: [],
            dryPaths: [],
            oilyPaths: [],
            imageSize: {width: 0, height: 0}
        }
        this.height = hp('79%');
        this.width = wp('100%');
    }

    componentDidMount = async () => {
        const now = await AsyncStorage.getItem('thankYouImage');
        Image.getSize(now, (width, height) => {
            const heightDiffRatio = 1 - height/hp(100);
            const widthDiffRatio = 1 - width/wp(100);

            this.setState({imageSize: {
                width: width,
                height: height,
                heightDiffRatio,
                widthDiffRatio: widthDiffRatio >= 0 ? widthDiffRatio : (-1) * widthDiffRatio
            }});
        });
        this.setState({
            img: now
        });     
        let that = this;
        setTimeout(function () {
            that.setState({
                spinner: false
            })
            that.getLoginStatus ()
        }, 7000)        
    }    

    getLoginStatus = async () => {
        const userInfo = await AsyncStorage.getItem("responseJson")       
        if (userInfo) {
            const subId = await AsyncStorage.getItem("subscriptionId")             
            if (subId) this.props.navigation.navigate("skinJournal")
            else this.props.navigation.navigate("scanResult")     
            // this.props.navigation.navigate("skinJournal")                     
        }
        else this.props.navigation.navigate("login")
    }
    getViewBox() {
        const fullWidth = wp(100);
        const svgHeight = hp(79);
        const svgWidth = fullWidth * this.state.imageSize.widthDiffRatio / 2;
        return svgWidth / 2 + " 0 " + (fullWidth - svgWidth) + " " + svgHeight;
    }

    render() {
        const slideInDown = {
            from: {
                translateY: 650,
            },
            to: {
                translateY: 0,
            },
        }

        Animatable.initializeRegistryWithDefinitions({
            slideInDown,
        });

        // const margin = (hp(100) - hp('79%')) / 2;
        const margin = 0;
        return (
            <Container style={{backgroundColor: '#DFE6EC'}}>
                <ImageBackground style={{height: hp('100%'), marginTop: margin}} source={{uri: this.state.img}} key={this.state.img}>
                    <Svg height={hp(100)} width={wp(100)} viewBox={this.getViewBox()} style={{position: "absolute", backgroundColor: "transparent"}}>
                        {this.state.acnePaths.map(path => {
                            if (path.path.data.length === 1) {
                                const point = path.path.data[0].split(",");
                                return <Circle cx={parseFloat(point[0])} cy={parseFloat(point[1])} r="5" fill="#ff45b588" />
                            } else {
                                return (
                                    <Polyline
                                        points={path.path.data.join(" ")}
                                        fill="none"
                                        stroke="#ff45b588"
                                        strokeWidth="10"
                                    />
                                )
                            }
                        })}
                        {this.state.finePaths.map(path => {
                            if (path.path.data.length === 1) {
                                const point = path.path.data[0].split(",");
                                return <Circle cx={parseFloat(point[0])} cy={parseFloat(point[1])} r="5" fill="#7cf3a088" />
                            } else {
                                return (
                                    <Polyline
                                        points={path.path.data.join(' ')}
                                        fill="none"
                                        stroke="#7cf3a088"
                                        strokeWidth="10"
                                    />
                                )
                            }
                        })}
                        {this.state.dryPaths.map(path => {
                            if (path.path.data.length === 1) {
                                const point = path.path.data[0].split(",");
                                return <Circle cx={parseFloat(point[0])} cy={parseFloat(point[1])} r="5" fill="#ff75d888" />
                            } else {
                                return (
                                    <Polyline
                                        points={path.path.data.join(' ')}
                                        fill="none"
                                        stroke="#ff75d888"
                                        strokeWidth="10"
                                    />
                                )
                            }
                        })}
                        {this.state.oilyPaths.map(path => {
                            if (path.path.data.length === 1) {
                                const point = path.path.data[0].split(",");
                                return <Circle cx={parseFloat(point[0])} cy={parseFloat(point[1])} r="5" fill="#f2ecec88" />
                            } else {
                                return (
                                    <Polyline
                                        points={path.path.data.join(' ')}
                                        fill="none"
                                        stroke="#f2ecec88"
                                        strokeWidth="10"
                                    />
                                )
                            }
                        })}
                    </Svg>
                    <View style={{alignItems: "center", marginTop: "5%"}}>
                        <Animatable.View style={{width: '80%', height: '10%', backgroundColor: '#080000'}}
                                         animation="slideInDown" iterationCount={14} duration={1000}
                                         direction="alternate">
                            <Text style={{color: 'white', fontSize: 18, textAlign: 'center', marginTop: '10%'}}>
                                Photo Analyzing...
                            </Text>
                        </Animatable.View>
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}

export default thankYou;
