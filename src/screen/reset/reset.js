
import React, { Component, } from "react";
import { Image, StyleSheet, ImageBackground, Alert, TextInput, TouchableOpacity, BackHandler, ToastAndroid } from "react-native";
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text, ListItem, Left, Button, Body, Right, View, Footer, FooterTab, Content } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast'
import {  Form, Item, Input, Label } from 'native-base';
class reset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            currentPasswordErr: '',
            newPassword: '',
            newPasswordErr: '',
            confirmPassword: '',
            confirmPasswordErr: '',
            spinner: false,

        }
    }

    resetPassword = async () => {

        let rxpassword = /^(?!\s*$).+/;
        let isPassword = rxpassword.test(this.state.currentPassword);
        let newpassword = rxpassword.test(this.state.newPassword);

        if (!isPassword) {
            this.setState({ currentPasswordErr: 'Required' })
            return false;
        }

        else if (!newpassword) {
            this.setState({ newPasswordErr: 'Required' })
            return false;
        }
        else if (this.state.newPassword != this.state.confirmPassword) {
            this.setState({ confirmPasswordErr: 'Unmatched password' })
            return false;
        }

        else {
            this.setState({ currentPasswordErr: '' })
            this.setState({ newPasswordErr: '' })

        }
        var user_id = await AsyncStorage.getItem('user_id');
       

        this.setState({
            spinner: true,
        });

        let formdata =

        {
            "id": user_id,
            "password": this.state.currentPassword,
        }

        let datafetch =
        {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'same-origin',
            body: JSON.stringify(formdata),
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        fetch('http://18.222.228.44:3000/resetpassword', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "true" || responseJson.status == true) {

                    this.setState({
                        spinner: false,
                    });
                    this.resetPasswordUpdate();
                }
                else {
                    this.setState({
                        spinner: false,
                    });
                    this.refs.toast1.show('Wrong current password!', 500,)

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
                        { cancelable: false }
                    );
                }, 3000);
            }).done();
    }


    resetPasswordUpdate = async () => {

        var user_id = await AsyncStorage.getItem('user_id');

        this.setState({
            spinner: true,
        });

        let formdata =

        {
            "id": user_id,
            "newpassword": this.state.newPassword,
        }

        let datafetch =
        {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'same-origin',
            body: JSON.stringify(formdata),
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        fetch('http://18.222.228.44:3000/resetpasswordupdate', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "true" || responseJson.status == true) {

                    this.setState({
                        spinner: false,
                    });
                    this.refs.toast.show('Password updated successfully!', 500, () => {
                        this.props.navigation.navigate("profile");
                    });
                }

                else {
                    this.setState({
                        spinner: false,
                    });

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
                        { cancelable: false }
                    );
                }, 3000);
            }).done();
    }

    render() {

        return (

            <Container style={{backgroundColor:'#DFE6EC'}}>
               
                <Content>
                <Left style={{ marginRight: '85%' }}>
                        <Button onPress={() => this.props.navigation.navigate('profile')} transparent>
                            <Icon  name='arrow-back' style={{color:'black'}}/>
                        </Button>
                    </Left>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                            <View style={{ marginTop: '5%', marginLeft: '5%' }}>
                                <Text style={{ fontSize: 17,fontFamily:'Khula-Bold', color: "#31323F" }}>Reset Password</Text>
                            </View>
                            <View style={{ marginTop: '5%' }}>

                                <View style={styles.SectionStyle}>
                                <Item floatingLabel style={styles.txtinput}
>
              <Label style={{color:'black',fontSize:14,fontFamily:'Khula-SemiBold'}} >Current password</Label>
              <Input 
                secureTextEntry={true}
              
              onChangeText={(currentPassword, currentPasswordErr) => this.setState({ currentPassword, currentPasswordErr })}
                                        value={this.state.currentPassword}              />
            </Item>

                                    <Text style={{ color: 'red', fontSize: 14, marginRight: 10 ,fontFamily:'Khula-SemiBold'}}>{this.state.currentPasswordErr}</Text>

                                </View>

                                <View style={styles.SectionStyle}>
                                <Item floatingLabel style={styles.txtinput}
>
              <Label style={{color:'black',fontSize:14,fontFamily:'Khula-SemiBold'}} >New password</Label>
              <Input 
                secureTextEntry={true}
                placeholderTextColor="black"
                onChangeText={(newPassword, newPasswordErr) => this.setState({ newPassword, newPasswordErr })}
                value={this.state.newPassword}             />
            </Item>

                                    
                                    <Text style={{ color: 'red', fontSize: 14, marginRight: 10,fontFamily:'Khula-SemiBold' }}>{this.state.newPasswordErr}</Text>

                                </View>

                                <View style={styles.SectionStyle}>
                                <Item floatingLabel style={styles.txtinput}
>
              <Label style={{color:'black',fontSize:14,fontFamily:'Khula-SemiBold'}} >Confirm New password</Label>
              <Input 
                secureTextEntry={true}
                placeholderTextColor="black"
                onChangeText={(confirmPassword, confirmPasswordErr) => this.setState({ confirmPassword, confirmPasswordErr })}
                                        value={this.state.confirmPassword}            />
            </Item>

                                 
                                    <Text style={{ color: 'red', fontSize: 14, marginRight: 10,fontFamily:'Khula-SemiBold' }}>{this.state.confirmPasswordErr}</Text>

                                </View>
                                <TouchableOpacity style={styles.regbtn} onPress={this.resetPassword.bind(this)}>

                                    <Text style={styles.btntxt}>Save</Text>
                                </TouchableOpacity>
                            </View>

                    <Toast position='center' ref="toast" style={{ backgroundColor: '#79A14B' }} />
                    <Toast position='center' ref="toast1" style={{ backgroundColor: 'red' }} />

                </Content>
                <Footer style={{ backgroundColor: '#DFE6EC', }}>
                    <FooterTab style={{ backgroundColor: '#DFE6EC',heightPercentageToHP:'10%' }}>
                        
                        <TouchableOpacity style={{ marginLeft:'10%', 
    height: 50,
    width: '40%',
    alignSelf: "center",
    fontSize: 15,
    fontFamily: "arial",}}
     onPress={() => this.props.navigation.navigate('skinJournal')} >
                           
                            <Text style={{  fontSize:14,color:'#000000', fontFamily:'Khula-Bold',marginLeft:'10%' }}>Skin Journal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.regbtn1}onPress={() => this.props.navigation.navigate('profile')} >
                          
                            <Text style={{  fontSize:14,marginTop:'10%', fontFamily:'Khula-Bold',marginLeft:'20%' }}>My Profile</Text>
                        </TouchableOpacity>

                    </FooterTab>
                </Footer>

            </Container>

        );
    }
}

export default reset;

const styles = StyleSheet.create({

    SectionStyle: {

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DFE6EC',
        borderBottomWidth: 0.5,
        borderColor: '#BFC7CE',
        height: 55,
marginLeft:'5%',
marginRight:'5%',
marginTop:'2%'
    },

    ImageStyle: {
        padding: 10,
        margin: 10,
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    txtinput: {
        flex: 1,
        color: '#31323F',
        borderColor: 'transparent',
        fontSize: 14,
        fontWeight: '600'
    },
    cnclTxt: {
        color: '#31323F',
        marginTop: '5%',
        marginLeft: '5%',
        fontWeight: 'bold'
    },
    
regbtn: {
    marginTop: "60%",
    marginBottom:'20%',
    height: 60,
    width: '90%',
    alignSelf: "center",
    fontSize: 15,
    fontFamily: "arial",
   borderBottomEndRadius:100,
   borderBottomStartRadius:100,
   shadowColor: 'black',
  shadowOpacity: 0.5,
  elevation: 10,
  backgroundColor : "black",
  shadowRadius: 15 ,
  shadowOffset : { width: 6, height: 13},
   borderTopEndRadius:100,
   borderTopStartRadius:100,
    textAlign: "center",
  },
    btntxt: {
        marginVertical: 20,
        textAlign: "center",
        margin: "auto",
        color: "#DFE6EC",
        fontFamily:'Khula-Bold'
    },

    spinnerTextStyle: {
        color: 'white'
    },
       
regbtn1: {
  marginRight:'10%',
      marginBottom:'10%',
      height: 50,
      width: '40%',
      alignSelf: "center",
      fontSize: 15,
      fontFamily: "arial",
     borderBottomEndRadius:100,
     borderBottomStartRadius:100,
     shadowColor: 'black',
     shadowOpacity: 0.8,
     elevation: 15,
     backgroundColor: "#DFE6EC",
     shadowRadius: 15,
     shadowOffset: { width: 6, height: 13 },
     borderTopEndRadius:100,
     borderTopStartRadius:100,
      textAlign: "center",
      
    },
  
})


