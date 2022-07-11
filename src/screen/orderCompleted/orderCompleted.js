import React, { Component } from 'react';
import {  View, Text, Image, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';


const check = require("src/image/check-mark.png")
const jar = require("src/image/jar.png")

export default class orderCompleted extends Component {

    constructor(props) {
        super(props);
        this.state = {
            final_image: ''
        }
    }

    componentDidMount = async () => {
        var bgimage = await AsyncStorage.getItem('thankYouImage');
        this.setState({
            final_image: bgimage
        });
        let that = this;
        setTimeout(function () {
            that.props.navigation.navigate('skinJournal');
        }, 1000)
    }

    render() {
        return (

            <ImageBackground style={{
                width: wp('100%'),
                height: hp('100%')
            }} source={{uri : this.state.final_image}} key={this.state.final_image}>
                <View style={{ width: wp('100%'), height: hp('70%'), backgroundColor: 'white', marginTop: hp('30%'), borderTopLeftRadius: 40, borderTopRightRadius: 40 }}>
                    <View style={{ justifyContent: 'center', marginTop: '5%' }}>
                        <Image style={{ alignSelf: 'center' }} source={check}></Image>
                        <Text style={{ textAlign: "center", fontSize: 24, fontWeight: '600', marginTop: '2%' }}> Order Completed{'\n'}Successfully!</Text>
                        <View style={{ alignItems: 'center', marginTop: '2%' }}>
                            <Image source={{ uri: this.state.final_image }} key={this.state.final_image} style={{ width: wp('30%'), height: wp('30%'), borderRadius: wp('30%/2') }} ></Image>
                            <Image source={jar} style={{ width: wp('20%'), height: hp('11%'), marginTop: '-10%', marginRight: '18%' }} ></Image>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
