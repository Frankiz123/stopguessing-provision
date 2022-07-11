import React, { Component } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View, Text, Animated, TextInput, Button, Icon, Dimensions, TouchableOpacity, Image, Alert, BackHandler, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import Toast, { DURATION } from 'react-native-easy-toast'
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';

const BgPerson = require("../../image/person.png")
const jar = require("../../image/jar_trans.png")

export default class shippingDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailErr: '',
            password: '',
            passwordErr: '',
            FirstName: '',
            FirstNameErr: '',
            LastName:"",
            LastNameErr:'',
            phone: '',
            phoneErr: '',
            city: '',
            cityErr: '',
            address: '',
            addressErr: '',
            zip: '',
            zipErr: '',
            stateName:'',
            stateNameErr:'',
            spinner: false,
            progress: 25,
            final_image: ''
        }
    }

    componentDidMount = async () => {
        var bgimage = await AsyncStorage.getItem('thankYouImage');
        this.setState({
            final_image: bgimage
        });

    }

    strip_id() {
        

        let fullName = this.state.FirstName + this.state.LastName;

        let formdata =
        {
            "email": this.state.email,
            "name": fullName,
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

        fetch('http://18.222.228.44:3000/createcustomer', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {

                AsyncStorage.setItem("custoner_id", responseJson.customer.id);
             console.log("success");

            }).catch((error) => {
                setTimeout(() => {
                    Alert.alert(

                        'Stop Guessing',

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

    sign_up = async () => {

        let rjxemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
        let rxpassword = /^(?!\s*$).+/;
        let regname = /([^\s])/;
        let phnrx = /^\d{1,10}$/

        let isvalidFirstName = regname.test(this.state.FirstName);
        let isvalidLastName = regname.test(this.state.LastName);

        let isEmailValid = rjxemail.test(this.state.email);
        let isPasswordvalid = rxpassword.test(this.state.password);
        let isPhoneValid = phnrx.test(this.state.phone);
        let isAddressValid = regname.test(this.state.address);
        let isCityValid = regname.test(this.state.city);
        let isZipValid = regname.test(this.state.zip);
        let isvalidState = regname.test(this.state.stateName);


     if (!isvalidFirstName) {
            this.setState({ FirstNameErr: 'Required' })
            return false;
        }
        else if (!isvalidLastName) {
            this.setState({ LastNameErr: 'Required' })
            return false;
        }
        else if (!isEmailValid) {
            this.setState({ emailErr: 'Email Required' })
            return false;
        }
        else if (!isPasswordvalid) {
            this.setState({ passwordErr: 'Required' })
            return false;
        }
      
        else if (!isPhoneValid) {
            this.setState({ phoneErr: 'Required' })
            return false;
        }
        else if (!isAddressValid) {
            this.setState({ addressErr: 'Required' })
            return false;
        }
        else if (!isZipValid) {
            this.setState({ zipErr: 'Required' })
            return false;
        }
        else if (!isCityValid) {
            this.setState({ cityErr: 'Required' })
            return false;
        }
       
        else if (!isvalidState) {
            this.setState({ stateNameErr: 'Required' })
            return false;
        }
        else {
            this.setState({ FirstNameErr: '' })
            this.setState({ LastNameErr: '' })
            this.setState({ emailErr: '' })
            this.setState({ passwordErr: '' })
            this.setState({ phoneErr: '' })
            this.setState({ addressErr: '' })
            this.setState({ zipErr: '' })
            this.setState({ cityErr: '' })
            this.setState({ stateNameErr: '' })


        }
        var user_id = await AsyncStorage.getItem('user_id');

        var fullName = this.state.FirstName +" "+ this.state.LastName ;

        AsyncStorage.setItem("email_id", this.state.email);
        AsyncStorage.setItem("user_name_shipping", fullName);
        AsyncStorage.setItem("user_phone_shipping", this.state.phone);
        AsyncStorage.setItem("user_address_shipping", this.state.address + ' ' + this.state.city + ' ' + this.state.zip);


        this.setState({
            spinner: true,
        });


        let formdata =

        {
            "full_name": fullName,
            "email": this.state.email,
            "password": this.state.password,
            "phone": this.state.phone,
            "city": this.state.city,
            "address": this.state.address,
            "zip": this.state.zip,
            "state":this.state.stateName,
            "insertId": user_id
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

        fetch('http://18.222.228.44:3000/sign_up_new', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "true" || responseJson.status == true) {
     this.strip_id();
                    this.setState({
                        spinner: false,
                    });
                    this.refs.toast.show('Registered successfully!', 500, () => {
                        this.props.navigation.navigate("profile");

                    });
                    const session_id = 1;
                    AsyncStorage.setItem('session_id', JSON.stringify(session_id));

                }

                else {
                    this.setState({
                        spinner: false,
                    });
                    this.refs.toast1.show('Email already exists', 1000)
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

            <Container style={{ backgroundColor: '#DFE6EC' }}>
            <KeyboardAwareScrollView
                style={{ backgroundColor: '#DFE6EC' }}
            >
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />

                <ScrollView style={{ backgroundColor: '#DFE6EC' }}>
<View style={{margin:'7%'}}>

                        <Text style={styles.textShipping}>Shipping Details{'\n'} </Text>
                    

                    <View style={{ marginTop: '-15%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
                            <View style={{
                                borderWidth: 0.4,
                                borderColor: '#BFC7CE', width: '50%', marginTop: 20, height: 65
                            }}>
                                <Item floatingLabel style={styles.txtinput}
                                >
                                    <Label style={{ color: 'black', fontSize: 14, marginLeft: 10 }} >First name</Label>
                                    <Input
                                    style={{marginLeft:7,marginTop:'10%'}}
                                        onChangeText={(FirstName, FirstNameErr) => this.setState({ FirstName, FirstNameErr })}
                                        value={this.state.FirstName}
                                    />
                                </Item>

                                <Text style={{ color: 'red', fontSize: 14, marginLeft: '60%', marginBottom: '3%' }}>{this.state.FirstNameErr}</Text>

                            </View>
                            <View style={{
                                borderWidth: 0.4,
                                borderColor: '#BFC7CE', width: '50%', marginTop: 20, height: 65
                            }}>
                                <Item floatingLabel style={styles.txtinput}
                                >
                                    <Label style={{ color: 'black', fontSize: 15,marginLeft: 10 }} >Last name</Label>
                                    <Input
                                         style={{marginLeft:7,marginTop:'10%'}}

                                        onChangeText={(LastName, LastNameErr) => this.setState({ LastNameErr, LastName })}
                                        value={this.state.LastName}
                                    />
                                </Item>



                                <Text style={{ color: 'red', fontSize: 15, marginLeft: '60%', marginBottom: '3%' }}>{this.state.LastNameErr}</Text>

                            </View>
                        </View>
                        <View style={{
                            borderWidth: 0.4,
                            borderColor: '#BFC7CE', width: '100%', height: 65,
                        }}>

                            <Item floatingLabel style={styles.txtinput} >
                                <Label style={{ color: 'black', fontSize: 14, marginLeft: 10 }} >Email Address</Label>
                                <Input
                                    style={{marginLeft:7}}

                                    onChangeText={(email, emailErr) => this.setState({ email, emailErr })}
                                    value={this.state.email}
                                />
                            </Item>


                            <Text style={{ color: 'red', fontSize: 14, marginLeft: '70%', marginBottom: '0%' }}>{this.state.emailErr}</Text>

                        </View>

                        <View style={{
                            borderWidth: 0.4,
                            borderColor: '#BFC7CE', width: '100%', height: 65
                        }}>

                            <Item floatingLabel style={styles.txtinput}
                            >
                                <Label style={{ color: 'black', fontSize: 14, marginLeft: 10 }} >Password</Label>
                                <Input

                                    secureTextEntry={true}
                                    style={{marginLeft:7,}}

                                    onChangeText={(password, passwordErr) => this.setState({ password, passwordErr })}
                                    value={this.state.password}
                                />
                            </Item>



                            <Text style={{ color: 'red', fontSize: 14, marginLeft: '80%' }}>{this.state.passwordErr}</Text>

                        </View>


                        <View style={{
                            borderWidth: 0.4,
                            borderColor: '#BFC7CE', width: '100%', height: 65
                        }}>
                            <Item floatingLabel style={styles.txtinput}
                            >
                                <Label style={{ color: 'black', fontSize: 14, marginLeft: 10 }} >Phone Number</Label>
                                <Input
                                    keyboardType='numeric'
                                    style={{marginLeft:7,}}
                                    maxLength={10}
                                    minLength={1}
                                    onChangeText={(phone, phoneErr) => this.setState({ phone, phoneErr })}
                                    value={this.state.phone}
                                />
                            </Item>


                            <Text style={{ color: 'red', fontSize: 14, marginLeft: '80%' }}>{this.state.phoneErr}</Text>

                        </View>

                        <View style={{
                            borderWidth: 0.4,
                            borderColor: '#BFC7CE', width: '100%', height: 65
                        }}>
                            <Item floatingLabel style={styles.txtinput}
                            >
                                <Label style={{ color: 'black', fontSize: 14, marginLeft: 10 }} >Address</Label>
                                <Input
                                    style={{marginLeft:7}}

                                    onChangeText={(address, addressErr) => this.setState({ address, addressErr })}
                                    value={this.state.address}
                                />
                            </Item>


                            <Text style={{ color: 'red', fontSize: 14, marginLeft: '80%' }}>{this.state.addressErr}</Text>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
                            <View style={{
                                borderWidth: 0.4,
                                borderColor: '#BFC7CE', width: '25%', height: 65
                            }}>

                                <Item floatingLabel style={styles.txtinput}
                                >
                                    <Label style={{ color: 'black', fontSize: 14,  marginLeft: 10 }} >Zip</Label>
                                    <Input
                                        keyboardType='numeric'
                                        style={{marginLeft:7,marginTop:'10%'}}
                                        maxLength={10}
                                        minLength={1}
                                        onChangeText={(zip, zipErr) => this.setState({ zip, zipErr })}
                                        value={this.state.zip}

                                    />
                                </Item>

                                <Text style={{ color: 'red', fontSize: 14, marginLeft: '25%' }}>{this.state.zipErr}</Text>

                            </View>

                            <View style={{
                                borderWidth: 0.4,
                                borderColor: '#BFC7CE', width: '50%', height: 65
                            }}>

                                <Item floatingLabel style={styles.txtinput}
                                >
                                    <Label style={{ color: 'black', fontSize: 14, marginLeft: 10,marginTop:'-2%' }} >City</Label>
                                    <Input
                                    minLength={1}
                                        style={{marginLeft:7,marginTop:'3%'}}
                                        onChangeText={(city, cityErr) => this.setState({ city, cityErr })}
                                        value={this.state.city}
                                    />
                                </Item>

                                <Text style={{ color: 'red', fontSize: 14, marginLeft: "65%" }}>{this.state.cityErr}</Text>

                            </View>

                            <View style={{
                                borderWidth: 0.4,
                                borderColor: '#BFC7CE', width: '25%', height: 65
                            }}>

                                <Item floatingLabel style={styles.txtinput}
                                >
                                    <Label style={{ color: 'black', fontSize: 14, marginLeft: 10 }} >State</Label>
                                    <Input
                                        minLength={1}
                                        style={{marginLeft:7,marginTop:'10%'}}
                                        onChangeText={(stateName, stateNameErr) => this.setState({ stateName, stateNameErr })}
                                        value={this.state.stateName}
                                    />
                                </Item>

                                <Text style={{ color: 'red', fontSize: 14, marginLeft: "35%" }}>{this.state.stateNameErr}</Text>

                            </View>

                        </View>
                    </View>
                    <Toast position='center' ref="toast" style={{ backgroundColor: 'black' }} />
                    <Toast position='center' ref="toast1" style={{ backgroundColor: 'black' }} />
</View>
                </ScrollView>
                <TouchableOpacity style={Platform.OS == "ios" ? styles.regbtn : styles.regbtnAndroid} onPress={this.sign_up.bind(this)}>
                    <Text style={styles.btntxt}>Continue To Profile</Text>
                </TouchableOpacity>

            </KeyboardAwareScrollView>

        </Container>
        );
    }

}

const styles = StyleSheet.create({



    textShipping: {

        color: '#000000',
        fontSize: 24,
        marginTop: '0%',
        marginBottom:'5%',
        lineHeight: 33,
       // marginLeft: '-75%',
        fontFamily: 'Khula-Bold',
        textAlign:'center'
    },



    progressBarfill: {
        height: 20,
        width: '45%',
        borderRadius: 11,
        backgroundColor: '#66893E',
    },

    txtinput: {
        flex: 1,
        borderColor: 'transparent',
        marginTop: '5%',
    //  fontFamily: 'Khula-SemiBold'
marginBottom:'-5%'
    },

    btntxt: {
        marginVertical: 20,
        textAlign: "center",
        margin: "auto",
        color: "black",
        fontSize: 16,
        fontFamily: 'Khula-Bold'
    },

    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        height: 55,
        borderBottomWidth: 0.5,
        marginLeft: '0%',
        marginRight: '0%',

    },

    ImageStyle: {
        padding: 10,
        margin: 10,
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        alignItems: 'center',
    },


    regbtn: {
   marginTop:'15%',
       // marginBottom: "10%",
        height: 60,
        width: '90%',
        alignSelf: "center",
        fontSize: 15,
        fontFamily:'Khula-Bold',
       borderBottomEndRadius:100,
       borderBottomStartRadius:100,
       shadowColor: 'black',
      shadowOpacity: 0.3,
      elevation:1,
      backgroundColor : "#DFE6EC",
      shadowRadius: 15 ,
      shadowOffset : { width: 6, height: 5},
       borderTopEndRadius:100,
       borderTopStartRadius:100,
        textAlign: "center"},
            
regbtnAndroid: {
    marginTop:'10%',
    marginBottom: "20%",
    height: 60,
    width: '90%',
    alignSelf: "center",
    fontSize: 15,
    fontFamily:'Khula-Bold',
    borderBottomEndRadius:100,
    borderBottomStartRadius:100,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 15,
    backgroundColor : "#DFE6EC",
    shadowRadius: 15 ,
    shadowOffset : { width: 56, height: 13},
    borderTopEndRadius:100,
    borderTopStartRadius:100,
    textAlign: "center",
    },
    spinnerTextStyle: {
        color: 'white'
    },
    jar: {
        width: wp('20%'),
        height: hp('11%'),
        marginTop: '26%',
        marginLeft: '-7%'
    },

},

);




