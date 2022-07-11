import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, TextInput, TouchableOpacity, Image, ScrollView, Alert, BackHandler, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { Button } from 'native-base';

import Spinner from 'react-native-loading-spinner-overlay';
import { CheckBox, Container, Thumbnail, } from 'native-base';
import Toast, { DURATION } from 'react-native-easy-toast'
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import moment, { invalid } from "moment";
import { TextInputMask } from 'react-native-masked-text'

import { Header, Content, Form, Item, Input, Label, Left, Icon } from 'native-base';

const BgPerson = require("../../image/person.png")
const jar = require("../../image/jar_trans.png")


const card = require("../../image/card-gray.png")

export default class paymentDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cardNum: '',
            cardNumErr: '',
            expMonth: '',
            expMonthErr: '',
            expYear: '',
            expYearErr: '',
            cvv: '',
            cvvErr: '',
            fullName: '',
            fullNameErr: '',
            city: '',
            cityErr: '',
            address: '',
            addressErr: '',
            zip: '',
            zipErr: '',
            spinner: false,
            check: true,
            progress: 50,
            final_image: '',
            subscriptionDate: moment(new Date()).format("MMM DD, YYYY"),
            dt: '',

        }
    }

    checkboxTest() {
        this.setState({
            check: !this.state.check
        })
    }

    _handlingCardNumber(number) {

        this.setState({
            cardNum: number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim(),
        });

    }

    componentDidMount = async () => {
        var card = await AsyncStorage.getItem('card');
        console.log(this.state.cardNum);
        this.setState({
            cardNum: card
        });
        console.log(this.state.cardNum);
    }

    payment_Details = async () => {

        var date = this.state.dt.split("/");
        var m = date[0];
        var y = date[1];
        let cardrx = /^[0-9,' ']{10,25}$/g
        let monthrx = /^[0-9]{2}$/g
        let yearrx = /^[0-9]{4}$/g

        let cvvrx = /^[0-9]{3,4}$/

        let isvalidCard = cardrx.test(this.state.cardNum);
        let isvalidMonth = monthrx.test(m);
        let isvalidyear = yearrx.test(y);
        let isvalidCvv = cvvrx.test(this.state.cvv);
        if (!isvalidCard) {
            { this.refs.toast1.show('Please enter valid card number', 1000) }
            return false;
        }

        else if (!isvalidMonth) {
            // this.setState({ expMonthErr: 'Required' })
            { this.refs.toast2.show('Please enter valid expiry month', 1000) }

            return false;
        }

        else if (!isvalidyear) {
            // this.setState({ expMonthErr: 'Required' })
            { this.refs.toast2.show('Please enter valid expiry year', 1000) }

            return false;
        }
        else if (!isvalidCvv) {
            { this.refs.toast3.show('Please enter valid cvv', 1000) }
            return false;
        }
        else {
            this.setState({ expMonthErr: '' })
            this.setState({ expYearErr: '' })
            this.setState({ cvvErr: '' })

        }
        var customer_id = await AsyncStorage.getItem('custoner_id');

        var cardString = this.state.cardNum;
        var res = cardString.slice(15, 20);

        AsyncStorage.setItem("card_num", "**** **** ****" + ' ' + res);
        AsyncStorage.setItem("exp_month", m);
        AsyncStorage.setItem("exp_year", y);

        this.setState({
            spinner: true,
        });

        let formdata =
        {
            "card_no": this.state.cardNum,
            "exp_month": m,
            "exp_year": y,
            "cvc": this.state.cvv,
            "customer_id": customer_id
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


        fetch('http://18.222.228.44:3000/addcard', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {

                if (responseJson.status == false) {
                    this.setState({
                        spinner: false,
                    });
                    console.log("responseJson", responseJson);
                    if (responseJson.error.code == 'incorrect_number') {
                        this.refs.toast.show('Please check card number!', 1000)
                    }
                    if (responseJson.error.code == 'invalid_expiry_month') {
                        this.refs.toast.show('Please check expiry month!', 1000)
                    }
                    if (responseJson.error.code == 'invalid_expiry_year') {
                        this.refs.toast.show('Please check expiry year!', 1000)
                    }
                    if (responseJson.error.code == 'invalid_cvc' || responseJson.error.code == 'incorrect_cvc') {
                        this.refs.toast.show('Please check cvv number!', 1000)
                    }
                    if (responseJson.error.decline_code == 'do_not_honor') {
                        this.refs.toast.show('The card has been declined for an unknown reason!', 1000)
                    }
                }


                else {
                    this.setState({
                        spinner: false,
                    });

                    if (this.state.check == false) {
                        this.user_shipping();
                    }
                    else {
                        this.user_subscription();
                    }
                }

            }).catch((error) => {
            }).done();
    }

    user_subscription = async () => {
        var customer_id = await AsyncStorage.getItem('custoner_id');
        var email = await AsyncStorage.getItem('email_id');
        var name = await AsyncStorage.getItem('user_name_shipping');
        var phone = await AsyncStorage.getItem('user_phone_shipping');
        var address = await AsyncStorage.getItem('user_address_shipping');


        this.setState({
            spinner: true,
        });
        let formdata =
        {

            "customer_id": customer_id,
            "email": email,
            "name": name,
            "phone": phone,
            "address": address

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

        fetch('http://18.222.228.44:3000/subscribeuser', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {

                if (responseJson.status == "true") {
                    AsyncStorage.setItem('subscribe_id', responseJson.subscription.id);

                    const one = 1;
                    AsyncStorage.setItem('plan_check', JSON.stringify(one));

                    this.setState({
                        spinner: false,
                    });
                    console.log("responseJson", responseJson);
                    AsyncStorage.setItem('subscription_date', this.state.subscriptionDate);

                    this.props.navigation.navigate("confirmationOrder");
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

    user_shipping = async () => {


        let regname = /([^\s])/;
        let isvalidfullName = regname.test(this.state.fullName);
        let isAddressValid = regname.test(this.state.address);
        let isCityValid = regname.test(this.state.city);
        let isZipValid = regname.test(this.state.zip);

        if (!isvalidfullName) {
            this.setState({ fullNameErr: 'Required' })
            return false;
        }
        else if (!isAddressValid) {
            this.setState({ addressErr: 'Required' })
            return false;
        }
        else if (!isCityValid) {
            this.setState({ cityErr: 'Required' })
            return false;
        }

        else if (!isZipValid) {
            this.setState({ zipErr: 'Required' })
            return false;
        }
        else {
            this.setState({ fullNameErr: '' })
            this.setState({ addressErr: '' })
            this.setState({ cityErr: '' })
            this.setState({ zipErr: '' })

        }
        this.setState({
            spinner: true,
        });
        var user_id = await AsyncStorage.getItem('user_id');

        let formdata =
        {
            "user_id": user_id,
            "full_name": this.state.fullName,
            "city": this.state.city,
            "address": this.state.address,
            "zip": this.state.zip

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

        fetch('http://18.222.228.44:3000/usershipping', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {


                if (responseJson.status == "true" || responseJson.status == true) {
                    this.setState({
                        spinner: false,
                    });
                    this.user_subscription();
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
    getcardNum(cardNum) {

        //start without knowing the credit card type
        var result = "unknown";

        //first check for MasterCard
        if (/^5[1-5]/.test(cardNum)) {
            result = "mastercard";
        }

        //then check for Visa
        else if (/^4/.test(cardNum)) {
            result = "visa";
        }

        //then check for AmEx
        else if (/^3[47]/.test(cardNum)) {
            result = "amex";
        }

        return result;
    }


    render() {

        const barWidth = Dimensions.get('screen').width - 40;

        return (
            <Container>
                <KeyboardAwareScrollView
                    style={{ flex: 1, backgroundColor: '#DFE6EC' }}
                >
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
                    <ScrollView>

                        <View style={{ width: wp('100%'), height: hp('100%'), backgroundColor: '#DFE6EC', marginTop: hp('5%'), borderTopLeftRadius: 40, borderTopRightRadius: 40 }}>

                            <View style={{ flexDirection: 'row', marginBottom: '5%', marginLeft: '0%' }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Button onPress={() => this.props.navigation.navigate('creditDetails')} transparent>
                                        <Icon name='arrow-back' style={{ color: 'black' }} />
                                    </Button>
                                    <View style={{ height: 30, width: 30, borderRadius: 30, borderWidth: 1, marginLeft: '20%', backgroundColor: 'black' }}>
                                        <Text style={{ marginLeft: '35%', marginTop: '10%', color: '#DFE6EC' }}>1</Text>
                                    </View>
                                    <View style={{ height: 30, width: 30, borderRadius: 30, borderWidth: 1, marginLeft: '5%', borderColor: 'black' }}>
                                        <Text style={{ marginLeft: '35%', marginTop: '10%', color: 'black' }}>2</Text>
                                    </View>
                                    <View style={{ height: 30, width: 30, borderRadius: 30, borderWidth: 1, marginLeft: '5%', borderColor: 'grey' }}>
                                        <Text style={{ marginLeft: '35%', marginTop: '10%', color: 'grey' }}>3</Text>
                                    </View>

                                </View>
                                <Text style={styles.textShipping}>Payment Details</Text>
                            </View>
                            <View style={{}}>
                                <Text style={{ marginLeft: '14%', marginTop: '5%', color: "grey" }}>Card Number </Text>
                            </View>
                            <View style={styles.SectionStyle}>

                                <Icon name='card' style={{ color: 'black', marginTop: '6%' }} />
                                <TextInput
                                    style={styles.txtinput}
                                    placeholder="Card number e.g. 4242 4242 4242 4242"
                                    placeholderTextColor="black"
                                    maxLength={25}
                                    editable={false}
                                    underlineColorAndroid="transparent"
                                    keyboardType='numeric'
                                    onChangeText={(cardNum, cardNumErr) => this._handlingCardNumber(cardNum, cardNumErr)}
                                    value={this.state.cardNum}
                                />

                                <Text style={{ color: 'red', fontSize: 10, marginRight: 10 }}>{this.state.cardNumErr}</Text>

                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginRight: '0%', marginLeft: '0%' }}>

                                <View style={{
                                    borderWidth: 0.4,
                                    borderColor: '#BFC7CE', width: '50%', height: 75
                                }}>
                                    <TextInputMask
                                        style={styles.txtinput}
                                        placeholder='MM/YYYY'
                                        type={'datetime'}
                                        options={{
                                            format: 'MM/YYYY'
                                        }}
                                        value={this.state.dt}
                                        placeholderTextColor="black"

                                        onChangeText={text => {

                                            this.setState({
                                                dt: text,

                                            })
                                        }}
                                    />
                                    <Text style={{ color: 'red', fontSize: 10, position: 'absolute', alignSelf: 'center', marginLeft: '37%' }}>{this.state.expMonthErr}</Text>

                                </View>
                                <View style={{
                                    borderWidth: 0.4,
                                    borderColor: '#BFC7CE', width: '50%', flexDirection: 'row', height: 75
                                }}>

                                    <TextInput
                                        style={styles.txtinput}
                                        placeholder="CVV"
                                        placeholderTextColor="black"
                                        maxLength={4}
                                        underlineColorAndroid="transparent"
                                        keyboardType='numeric'
                                        onChangeText={(cvv, cvvErr) => this.setState({ cvv, cvvErr })}
                                        value={this.state.cvv}
                                    />
                                    <Text style={{ color: 'red', fontSize: 10, marginRight: 10, alignSelf: 'center' }}>{this.state.cvvErr}</Text>

                                </View>

                            </View>

                            <View style={{}}>

                                <View style={{ marginTop: 30, flexDirection: 'row', }}>

                                    <CheckBox
                                        style={{ backgroundColor: 'black', borderColor: '#BFC7CE', marginLeft: 10,width:25 }} checked={this.state.check} onPress={() => this.checkboxTest()} />
                                    <Text style={{ marginLeft: 18, color: '#31323F', fontFamily: 'Khula-SemiBold' }}>Billing address same as shipping</Text>
                                </View>
                            </View>

                            {this.state.check == false &&
                                <View style={{ marginTop: '-3%' }}>
                                    <View style={styles.SectionStyle2}>

                                        <Item floatingLabel style={styles.txtinput}
                                        >
                                            <Label style={{ color: 'black', fontSize: 15 }} >Full name</Label>
                                            <Input
                                                placeholderTextColor="black"
                                                onChangeText={(fullName, fullNameErr) => this.setState({ fullName, fullNameErr })}
                                                value={this.state.fullName}
                                            />
                                        </Item>
                                        <Text style={{ color: 'red', fontSize: 10, marginRight: 10 }}>{this.state.fullNameErr}</Text>

                                    </View>

                                    <View style={styles.SectionStyle2}>

                                        <Item floatingLabel style={styles.txtinput}
                                        >
                                            <Label style={{ color: 'black', fontSize: 15 }} >Address</Label>
                                            <Input
                                                placeholderTextColor="black"
                                                onChangeText={(address, addressErr) => this.setState({ address, addressErr })}
                                                value={this.state.address}
                                            />
                                        </Item>

                                        <Text style={{ color: 'red', fontSize: 10, marginRight: 10 }}>{this.state.addressErr}</Text>

                                    </View>

                                    <View style={styles.SectionStyle2}>

                                        <Item floatingLabel style={styles.txtinput}
                                        >
                                            <Label style={{ color: 'black', fontSize: 15 }} >City</Label>
                                            <Input
                                                placeholderTextColor="black"
                                                onChangeText={(city, cityErr) => this.setState({ city, cityErr })}
                                                value={this.state.city}
                                            />
                                        </Item>

                                        <Text style={{ color: 'red', fontSize: 10, marginRight: 10 }}>{this.state.cityErr}</Text>

                                    </View>

                                    <View style={styles.SectionStyle2}>
                                        <Item floatingLabel style={styles.txtinput}
                                        >
                                            <Label style={{ color: 'black', fontSize: 15 }} >Zip</Label>
                                            <Input
                                                placeholderTextColor="black"
                                                keyboardType='numeric'
                                                onChangeText={(zip, zipErr) => this.setState({ zip, zipErr })}
                                                value={this.state.zip}
                                            />
                                        </Item>

                                        <Text style={{ color: 'red', fontSize: 10, marginRight: 10 }}>{this.state.zipErr}</Text>

                                    </View>

                                    <TouchableOpacity style={Platform.OS == "ios" ? styles.regbtn : styles.regbtnAndroid} onPress={this.payment_Details.bind(this)}>
                                        <Text style={styles.btntxt}>Continue To Confirmation</Text>
                                    </TouchableOpacity>

                                </View>

                            }
                            <View style={{ height: '30%' }}></View>
                            <Toast position='center'
                                ref="toast" style={{ backgroundColor: 'red' }} />
                            <Toast position='center'
                                ref="toast1" style={{ backgroundColor: 'red' }} />
                            <Toast position='center'
                                ref="toast2" style={{ backgroundColor: 'red' }} />
                            <Toast position='center'
                                ref="toast3" style={{ backgroundColor: 'red' }} />
                            <Toast position='center'
                                ref="toast4" style={{ backgroundColor: 'red' }} />
                            {this.state.check == true &&

                                <TouchableOpacity style={Platform.OS == "ios" ? styles.regbtn : styles.regbtnAndroid} onPress={this.payment_Details.bind(this)}>
                                    <Text style={styles.btntxt}>Continue To Confirmation</Text>
                                </TouchableOpacity>
                            }


                        </View >
                    </ScrollView>
                </KeyboardAwareScrollView>
            </Container>

        );
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#BFC7CE',

    },

    textShipping: {

        color: '#000000',
        fontSize: 24,
        marginTop: '15%',
        lineHeight: 33,
        marginLeft: '-45%',
        fontFamily: 'Khula-Bold'
    },

    progressBar: {
        marginTop: 45,
        height: 22,
        width: '90%',
        backgroundColor: 'white',
        borderColor: '#EFEFEF',
        borderWidth: 2,
        borderRadius: 12,
        alignSelf: 'center'
    },

    progressBarfill: {
        height: 20,
        width: '60%',
        borderRadius: 11,
        backgroundColor: '#66893E',
    },

    txtinput: {
        flex: 1,
        color: '#31323F',
        borderColor: 'transparent',
        marginLeft: 10,
        marginTop: '5%'
    },

    btntxt: {
        marginVertical: 20,
        textAlign: "center",
        margin: "auto",
        color: "black",
        fontSize: 14,
        fontFamily: 'Khula-Bold'
    },

    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 0.4,
        borderColor: '#BFC7CE',
        height: 61,
        marginTop: '-6%'
    },
    SectionStyle2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 0.4,
        borderColor: '#BFC7CE',
        height: 61,

    },
    ImageStyle: {
        margin: 20,
        height: 17,
        width: 17,
        resizeMode: 'stretch',
        alignItems: 'center',
    },


    regbtnAndroid: {
        marginTop: '8%',
        marginBottom: "20%",
        height: 60,
        width: '90%',
        alignSelf: "center",
        fontSize: 15,
        fontFamily: 'Khula-Bold',
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.8,
        elevation: 15,
        backgroundColor: "#DFE6EC",
        shadowRadius: 15,
        shadowOffset: { width: 56, height: 13 },
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        textAlign: "center",
    },
    regbtn: {
        marginTop: "10%",
        height: 60,
        width: '90%',
        alignSelf: "center",
        fontSize: 15,
        fontFamily: "arial",
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        elevation: 5,
        backgroundColor: "#DFE6EC",
        shadowRadius: 15,
        shadowOffset: { width: 6, height: 6 },
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        textAlign: "center",
    },
    regbtn1: {
        marginTop: "5%",
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
    expMonth: {
        flexDirection: 'row',
        borderBottomWidth: 0.4,
        borderColor: '#BFC7CE',
    },
    spinnerTextStyle: {
        color: 'white'
    }

},

);
