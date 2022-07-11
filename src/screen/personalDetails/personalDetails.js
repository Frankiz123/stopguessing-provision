
import React, { Component, } from "react";
import { Image, StyleSheet, ImageBackground, Alert, TextInput, TouchableOpacity, BackHandler, ToastAndroid } from "react-native";
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text,ScrollView, ListItem, Left, Button, Body, Right, View, Footer, FooterTab, Content } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
import { Actions, Router, Scene } from "react-native-router-flux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast'
import { Item, Input, Label } from 'native-base';

const devicewidth = Dimensions.get('window').width;
const devicehieght = Dimensions.get('window').height;
const file = require("../../image/file-text.png")

class personalDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            fullNameErr: '',
            phone: '',
            phoneErr: '',
            city: '',
            cityErr: '',
            address: '',
            addressErr: '',
            zip: '',
            zipErr: '',
            spinner: false,
            card_number: '',
            expire_month: '',
            expire_year: ''
        }
    }

    componentDidMount = async () => {

        var user_id = await AsyncStorage.getItem('user_id');
        var card_num = await AsyncStorage.getItem('card_num');
        var exp_month = await AsyncStorage.getItem('exp_month');
        var exp_year = await AsyncStorage.getItem('exp_year');

        this.setState({
            card_number: card_num,
            expire_month: exp_month,
            expire_year: exp_year
        })

        let formdata =  {
            "id": user_id
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

        fetch('http://18.222.228.44:3000/userpersonaldetails', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "true" || responseJson.status == true) {
                    this.setState({
                        fullName: responseJson.response[0].name,
                        phone: responseJson.response[0].phone,
                        city: responseJson.response[0].city,
                        address: responseJson.response[0].address,
                        zip: responseJson.response[0].zip
                    })
                }
                else {

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


    userdetailsupdate = async () => {

        var user_id = await AsyncStorage.getItem('user_id');
        let regname = /([^\s])/;
        let phnrx = /^\d{1,10}$/
        let isvalidfullName = regname.test(this.state.fullName);

        let isvalidphone = phnrx.test(this.state.phone);
        let isvalidcity = regname.test(this.state.city);
        let isvalidaddress = regname.test(this.state.address);
        let isvalidzip = regname.test(this.state.zip);


        if (!isvalidfullName) {
            this.setState({ fullNameErr: 'Required' })
            return false;
        }
        else if (!isvalidphone) {
            this.setState({ phoneErr: 'Required' })
            return false;

        }
        else if (!isvalidcity) {
            this.setState({ cityErr: 'Required' })
            return false;
        }
        else if (!isvalidaddress) {
            this.setState({ addressErr: 'Required' })
            return false;
        }

        else if (!isvalidzip) {
            this.setState({ zipErr: 'Required' })
            return false;
        }
        else {
            this.setState({ fullNameErr: '' })
            this.setState({ phoneErr: '' })
            this.setState({ cityErr: '' })
            this.setState({ addressErr: '' })
            this.setState({ zipErr: '' })
        }
        AsyncStorage.setItem("user_name_shipping", this.state.firstName);
        AsyncStorage.setItem("user_phone_shipping", this.state.phone);
        AsyncStorage.setItem("user_address_shipping", this.state.address + ' ' + this.state.city + ' ' + this.state.zip);

        this.setState({
            spinner: true,
        });

        let formdata =

        {
            "id": user_id,
            "full_name": this.state.fullName,
            "phone": this.state.phone,
            "city": this.state.city,
            "address": this.state.address,
            "zip": this.state.zip,

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

        fetch('http://18.222.228.44:3000/userpersonaldetailsupdate', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "true" || responseJson.status == true) {

                    this.setState({
                        spinner: false,
                    });
                    this.refs.toast.show('Updated successfully!', 500,)

                }

                else {

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
            <Container style={{}}>
                <Content style={{ backgroundColor: '#DFE6EC',flex:1 }}>
                    <Left style={{ marginRight: '85%' }}>
                        <Button onPress={() => this.props.navigation.navigate('profile')} transparent>
                            <Icon name='arrow-back' style={{ color: 'black' }} />
                        </Button>
                    </Left>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                    <View style={{ marginTop: '0%', marginLeft: '5%' }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold', color: "black" }}>Account Information</Text>
                    </View>
                    <View style={{ marginTop: '5%', backgroundColor: '#DFE6EC' }}>
                        <View style={styles.SectionStyle}>
                            <TextInput style={styles.txtinput}                            
                               placeholder="Fullname"
                               placeholderTextColor="gray" 
                               onChangeText={(fullName, fullNameErr) => this.setState({ fullName, fullNameErr })}
                               value={this.state.fullName} 
                             >                              
                            </TextInput>
                            <Text style={{ color: 'red', fontSize: 14, marginRight: 10 }}>{this.state.fullNameErr}</Text>
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput  style={styles.txtinput}                            
                                placeholder='Shipping Address'
                                placeholderTextColor="gray" 
                                onChangeText={(address, addressErr) => this.setState({ address, addressErr })}
                                value={this.state.address}
                            >    
                            </TextInput>
                            <Text style={{ color: 'red', fontSize: 14, marginRight: 10 }}>{this.state.addressErr}</Text>
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput style={styles.txtinput}
                                placeholder='City'
                                placeholderTextColor="gray" 
                                onChangeText={(city, cityErr) => this.setState({ city, cityErr })}
                                value={this.state.city}>
                            </TextInput>                             
                            <Text style={{ color: 'red', fontSize: 14, marginRight: 10 }}>{this.state.cityErr}</Text>
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput  style={styles.txtinput}                            
                                keyboardType='numeric'
                                onChangeText={(zip, zipErr) => this.setState({ zip, zipErr })}
                                value={this.state.zip}
                                placeholderTextColor="gray" 
                                placeholder="Zip"
                              >
                              </TextInput>
                            <Text style={{ color: 'red', fontSize: 14, marginRight: 10 }}>{this.state.zipErr}</Text>
                        </View>
                        <TouchableOpacity style={styles.regbtnAndroid} onPress={this.userdetailsupdate.bind(this)}>
                            <Text style={styles.btntxt}>Update</Text>
                        </TouchableOpacity>
                    </View>
                    <Toast position='center' ref="toast" style={{ backgroundColor: 'black' }} />
                </Content>

                <Footer style={{ backgroundColor: '#DFE6EC',borderTopWidth:0,elevation:0,bottom:0 }}>
                    <FooterTab style={{ backgroundColor: '#DFE6EC', heightPercentageToHP: '10%' }}>
                        <TouchableOpacity style={{
                            marginLeft: '10%',
                            height: 50,
                            width: '40%',
                            alignSelf: "center",
                            fontSize: 15,
                            fontFamily: "arial",
                            }}
                            onPress={() => this.props.navigation.navigate('skinJournal')} >
                            <Text style={{ fontFamily: 'Khula-Bold', fontSize: 14, color: '#000000', marginLeft: '10%' }}>Skin Journal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.regbtn1} onPress={() => this.props.navigation.navigate('profile')} >
                            <Text style={{ fontFamily: 'Khula-Bold', fontSize: 14, textAlign:'center', marginTop: '10%' }}>My Profile</Text>
                        </TouchableOpacity>
                    </FooterTab>                    
                </Footer>
            </Container>
        );
    }
}

export default personalDetails;

const styles = StyleSheet.create({

    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DFE6EC',
        borderBottomWidth: 0.5,
        borderColor: '#000',
        height: 65,
        marginLeft: '5%',
        marginRight: '5%',
        justifyContent: 'space-around'
    },
    expMonth: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: 0.4,
        borderColor: '#000',
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
        fontFamily: 'Khula-SemiBold'
    },
    cnclTxt: {
        color: '#31323F',
        marginTop: '5%',
        marginLeft: '5%',
        fontWeight: 'bold'
    },
    regbtn: {
        marginTop: "20%",
        marginBottom: '20%',
        height: 60,
        width: '90%',
        alignSelf: "center",
        fontSize: 15,
        fontFamily: "arial",
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation:1,
        backgroundColor : "#DFE6EC",
        shadowRadius: 15 ,
        shadowOffset : { width: 6, height: 5},
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        textAlign: "center",
        // backgroundColor: "#E7E7E7"
    },
    regbtnAndroid: {
        marginTop: "20%",
        marginBottom: '20%',
        height: 60,
        width: '90%',
        alignSelf: "center",
        fontSize: 15,
        fontFamily: "arial",
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.8,
        elevation: 10,
        backgroundColor: "#DFE6EC",
        shadowRadius: 15,
        shadowOffset: { width: 56, height: 13 },
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        textAlign: "center",
        // backgroundColor: "#E7E7E7"
    },
    regbtn1: {
        //  marginTop: "20%",
        marginRight: '10%',
        marginBottom: '10%',
        height: 50,
        width: '40%',
        alignSelf: "center",
        fontSize: 15,
        fontFamily: "arial",
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.8,
        elevation: 15,
        backgroundColor: "#DFE6EC",
        shadowRadius: 15,
        shadowOffset: { width: 6, height: 13 },
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        textAlign: "center",

        // backgroundColor: "#E7E7E7"
    },
    btntxt: {
        marginVertical: 20,
        textAlign: "center",
        margin: "auto",
        color: "black",
        fontWeight: 'bold'
    },
    spinnerTextStyle: {
        color: 'white'
    }
})


