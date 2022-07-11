import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, TextInput, Button, Icon, TouchableOpacity, Image, Alert,ImageBackground } from 'react-native';
import { CheckBox } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const BgPerson = require("src/image/person.png")

const check = require("src/image/check-mark.png")

export default class healthySkin extends Component {

    componentDidMount = async() =>{
        let that = this;
    setTimeout(function () {
      that.setState({
        spinner:false
      })
      that.props.navigation.navigate('scanResult');  
    },2000)
    }

    render() {
        return (

            <ImageBackground style={{width: wp('100%'),
            height: hp('100%')}} source={BgPerson}>
              <View style={{width:wp('100%'),height:hp('50%'),backgroundColor:'white',marginTop:hp('5%'),borderTopLeftRadius:40,borderTopRightRadius:40,bottom:0,position:'absolute'}}>  
<View style={{justifyContent:'center',marginTop:'10%'}}>
    <Image style={{alignSelf:'center'}} source={check}></Image>
    <Text style={{textAlign:"center",fontSize:24,fontFamily:'Khula-Bold',marginTop:'5%'}}> Congratulations! {'\n'} You have healthy skin!</Text>
</View>
</View>
</ImageBackground>
        );
    }

}






