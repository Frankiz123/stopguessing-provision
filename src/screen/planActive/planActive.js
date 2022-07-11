
import React, { Component, } from "react";
import { Image, StyleSheet, ImageBackground, Alert, TouchableOpacity, BackHandler, ToastAndroid, Platform } from "react-native";
import { Container, Header, Tab, Tabs, Title, TabHeading, Icon, Text, ListItem, Left, Button, Body, Right, View, FooterTab, Footer, Content } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
import { Actions, Router, Scene } from "react-native-router-flux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

const devicewidth = Dimensions.get('window').width;
const devicehieght = Dimensions.get('window').height;
const check = require("src/image/check-mark.png")
const checkred = require("src/image/check-red.png")
const file = require("src/image/file-text.png")


class planActive extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            check: '',
            status: '',
            subscription_status: 'Active'
        }
    }

    componentDidMount = async () => {
        var a = await AsyncStorage.getItem('user_status');

        if (a == null) {
            this.setState({
                check: 0
            })
        }
        else {
            this.setState({
                check: a == 0 ? 0 : 1
            })
        }
    }

    planActive = async () => {

        var subscribe_id = await AsyncStorage.getItem('subscribe_id');

        this.setState({
            spinner: true,
        });

        let formdata =

        {
            "subscribe_id": subscribe_id,
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

        fetch('http://18.222.228.44:3000/cancelsubscription', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {

                if (responseJson.status == "true" || responseJson.status == true) {
                    this.setState({
                        spinner: false,
                        check: 1,
                        status: responseJson.cancel_at_period_end.cancel_at_period_end

                    });

                    this.local_check();
                    this.userStatus();

                    // this.props.navigation.navigate("planInactive");

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

    planReactive = async () => {

        var subscribe_id = await AsyncStorage.getItem('subscribe_id');

        this.setState({
            spinner: true,
        });

        let formdata =

        {
            "subscribe_id": subscribe_id,
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

        fetch('http://18.222.228.44:3000/reactivesubscription', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {

                if (responseJson.status == "true" || responseJson.status == true) {

                    this.setState({
                        spinner: false,
                        check: 0,
                        status: responseJson.cancel_at_period_end.cancel_at_period_end

                    });
                    this.local_check();
                    this.userStatus();

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

    userStatus = async () => {
        if (this.state.status == true) {
            this.setState({
                subscription_status: "Inactive"
            })
        }
        else {
            this.setState({
                subscription_status: "Active"
            })
        }
        var user_id = await AsyncStorage.getItem('user_id');

        let formdata =

        {
            "user_id": user_id,
            "subscribe_status": this.state.subscription_status,
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

        fetch('http://18.222.228.44:3000/userstatus', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {

                if (responseJson.status == "true" || responseJson.status == true) {

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


    local_check = async () => {
        AsyncStorage.setItem('user_status', JSON.stringify(this.state.check));

    }

    render() {

        return (
            <Container style={{ backgroundColor: '#DFE6EC' }}>


                {this.state.check === 0 &&

                    <Content>
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
                        <Image style={{ alignSelf: 'center', marginTop: '30%', }} source={check}></Image>
                        <Text style={{ textAlign: 'center', marginTop: '5%', fontSize: 24, color: '#31323F' }}>
                            Your plan is active!
                                       </Text>
                        <TouchableOpacity style={Platform.OS =='ios' ?styles.regbtnIOS:styles.regbtn } onPress={this.planActive.bind(this)}>

                            <Text style={styles.btntxt}>Cancel Subscription</Text>
                        </TouchableOpacity>


                    </Content>
                }

                {this.state.check === 1 &&
                    <Content>
                        <Spinner
                            visible={this.state.spinner}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                        <Image style={{ alignSelf: 'center', marginTop: '30%', }} source={checkred}></Image>
                        <Text style={{ textAlign: 'center', marginTop: '5%', fontWeight: '600', fontSize: 24, color: '#31323F',fontFamily:'Khula-SemiBold' }}>
                            Your plan is inactive!
                                       </Text>
                        <TouchableOpacity style={Platform.OS =='ios' ?styles.regbtnIOS:styles.regbtn } onPress={this.planReactive.bind(this)}>

                            <Text style={styles.btntxt1}>Reactivate Subscription</Text>
                        </TouchableOpacity>
                    </Content>
                }
                <Footer style={{ backgroundColor: '#DFE6EC', borderTopWidth:0,elevation:0}}>
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

                            <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000000' }}>Skin Journal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.regbtn1} onPress={() => this.props.navigation.navigate('profile')} >

                            <Text style={{ fontWeight: 'bold', fontSize: 14, textAlign:'center', marginTop: '10%' }}>My Profile</Text>
                        </TouchableOpacity>

                    </FooterTab>
                </Footer>

            </Container>

        );
    }
}

export default planActive;

const styles = StyleSheet.create({

    SectionStyle: {

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#000',
        height: 61,

    },

    regbtn: {
        marginTop: "10%",
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
    },
    regbtnIOS:{
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
    },

    regbtn1: {
        marginRight: '5%',
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

    },
    btntxt: {
        marginVertical: 20,
        textAlign: "center",
        margin: "auto",
        color: "black",
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily:'Khula-SemiBold'
    },
    btntxt1: {
        marginVertical: 20,
        textAlign: "center",
        margin: "auto",
        color: "black",
        fontSize: 16,
        fontFamily:'Khula-SemiBold'
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
        borderColor: '#EFEFEF',
        fontSize: 14,
        fontWeight: '600'
    },
    cnclTxt: {
        color: '#31323F',
        marginTop: '5%',
        marginLeft: '5%',
        fontWeight: 'bold'
    },
    spinnerTextStyle: {
        color: 'white'
    }
})


