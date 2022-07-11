import React, { Component } from 'react';
import { StyleSheet, View, Text, Linking, Dimensions, BackHandler, TextInput, Button, Icon, TouchableOpacity, Image, Alert, ImageBackground } from 'react-native';
import { CheckBox, Container, Item, Label, Input } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from "moment";
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import notification from '../notification/notification';
import Toast from 'react-native-easy-toast'
import ToggleBox from '../toggle'
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native'

const jar = require("src/image/jar.png")
export default class confirmationOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shippingDate: moment(new Date()).add(3, 'day').format("DD-MMM"),
            progress: 75,
            final_image: '',
            product_amount: '',
            percent_off: "",
            check: false,
            shippingInfo: '',
            billingInfo: '',
            shippingInfoErr: '',
            billingInfoErr: '',
            editableBilling: false,
            editableShipping: false,
            textColor: 'red',
            textColorBilling: 'red',
            isModalVisible: '',
            isModalVisible1:"",
            spinner:false,
            cityShipping: '',
            cityErrShipping: '',
            addressShipping: '',
            addressErrShipping: '',
            zipShipping: '',
            zipErrshipping: '',
            fullName: '',
            fullNameErr: '',
            city: '',
            cityErr: '',
            address: '',
            addressErr: '',
            zip: '',
            zipErr: '',
        }
        this.notification = new notification(this.onNotification);
    }
    onNotification = (notif) => {
        this.props.navigation.navigate('skinJournal');
    }
    handlePerm(perms) {
        Alert.alert("Permissions", JSON.stringify(perms));
    }
    checkboxTest() {
        this.setState({
            check: !this.state.check
        })
    }

    componentDidMount = async () => {

        var bgimage = await AsyncStorage.getItem('thankYouImage');
        this.setState({
            final_image: bgimage
        });
        var user_id = await AsyncStorage.getItem('user_id');
        this.product_price();
        this.product_coupan();
        this.shippingInfo();
        this.billingInfo();
        let formdata = {
            "id": user_id
        }
        
        let datafetch = {
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
        fetch('http://18.222.228.44:3000/clientemailsubscription', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .catch((error) => {
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

    product_price = async () => {

        let datafetch =
        {
            method: 'GET',
            credentials: 'same-origin',
            mode: 'same-origin',
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        fetch('http://18.222.228.44:3000/retriveprice', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    product_amount: responseJson.unit_amount_decimal
                })
            }).catch((error) => {

            }).done();
    }
    product_coupan = async () => {

        let datafetch =
        {
            method: 'GET',
            credentials: 'same-origin',
            mode: 'same-origin',
            headers:
            {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        fetch('http://18.222.228.44:3000/retrivecoupan', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    percent_off: responseJson.percent_off
                })
            }).catch((error) => {

            }).done();
    }

    shippingInfo = async () => {
       

        var user_id = await AsyncStorage.getItem('user_id');

        let formdata =

        {
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
       

        fetch('http://18.222.228.44:3000/shippingInfo', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "true") {

                    this.setState({
                        shippingInfo: responseJson.result[0].address + " " + responseJson.result[0].city + " " + responseJson.result[0].zip,
                        addressShipping: responseJson.result[0].address,
                        cityShipping: responseJson.result[0].city,
                        zipShipping: responseJson.result[0].zip,
                    })
                
                }
             
            }).catch((error) => {

            }).done();
    }

    billingInfo = async () => {
       
        var user_id = await AsyncStorage.getItem('user_id');
        let formdata =

        {
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

        fetch('http://18.222.228.44:3000/billingInfo', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "true") {

                 console.log("values1");

                 var x = responseJson.result[0].shipping_name +' ' +responseJson.result[0].shipping_city +' '+responseJson.result[0].shipping_address +' '+responseJson.result[0].shipping_zip;
                 console.log("value2",x);


                      this.setState({
                        billingInfo:responseJson.result[0] == undefined|| responseJson.result[0] == null || x == 0 ? "same as shipping ": x
                      })
                   

                this.setState({
                    fullName:responseJson.result[0].shipping_name ,
                    city:responseJson.result[0].shipping_city,
                    address:responseJson.result[0].shipping_address ,
                    zip:responseJson.result[0].shipping_zip
                })
                }
             
            }).catch((error) => {

             //   console.log('lol',this.setState.billingInfo);
            }).done();
    }

    userRegistrationDate = async () => {
        var date = await AsyncStorage.getItem('subscription_date');
        var user_id = await AsyncStorage.getItem('user_id');
        var subscribe_id = await AsyncStorage.getItem('subscribe_id');

        let formdata =
        {
            "user_id": user_id,
            "subscribe_date": date,
            "subscribe_status": "Active",
            "subscribe_id": subscribe_id

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

        fetch('http://18.222.228.44:3000/subscribe_date', datafetch)
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


    Shippinhdetailsupdate = async () => {

        var user_id = await AsyncStorage.getItem('user_id');
        let regname = /([^\s])/;

        let isAddressValid = regname.test(this.state.addressShipping);
        let isCityValid = regname.test(this.state.cityShipping);
        let isZipValid = regname.test(this.state.zipShipping);

        if (!isAddressValid) {
            this.setState({ addressErrShipping: 'Required' })
            return false;
        }

        else if (!isCityValid) {
            this.setState({ cityErrShipping: 'Required' })
            return false;
        }
        else if (!isZipValid) {
            this.setState({ zipErrshipping: 'Required' })
            return false;
        }

        else {
            this.setState({ addressErrShipping: '' })
            this.setState({ zipErrshipping: '' })
            this.setState({ cityErrShipping: '' })
        }
        this.setState({
            spinner: true,
        });

        let formdata =

        {
            "id": user_id,
            "city":this.state.cityShipping,
            "address":this.state.addressShipping,
            "zip":this.state.zipShipping
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

        fetch('http://18.222.228.44:3000/Shippingdetailsupdate', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "true" || responseJson.status == true) {


                    this.setState({
                        spinner: false,
                        isModalVisible:false
                    });
                this.shippingInfo();
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

    Billingdetailsupdate = async () => {

        var user_id = await AsyncStorage.getItem('user_id');
        let regname = /([^\s])/;

        let isFullName = regname.test(this.state.fullName);
        let isAddressValid = regname.test(this.state.address);
        let isCityValid = regname.test(this.state.city);
        let isZipValid = regname.test(this.state.zip);

        if (!isFullName) {
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
            this.setState({ addressErrShipping: '' })
            this.setState({ zipErrshipping: '' })
            this.setState({ cityErrShipping: '' })
        }
        this.setState({
            spinner: true,
        });

        let formdata =

        {
            "id": user_id,
            "name":this.state.fullName,
            "city":this.state.city,
            "address":this.state.address,
            "zip":this.state.zip
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

        fetch('http://18.222.228.44:3000/billingdetailsupdate', datafetch)
            .then(function (response) {
                return response;
            })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status == "true" || responseJson.status == true) {


                    this.setState({
                        spinner: false,
                        isModalVisible1:false
                    });
                this.billingInfo();
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


    closeModal = () => {
        this.setState({
            isModalVisible1: false
        })
    }

    openModal = () => {
        this.setState({
            isModalVisible1: true
        })
    }
    closeModal2 = () => {
        this.setState({
            isModalVisible: false
        })
    }

    openModal2 = () => {
        this.setState({
            isModalVisible: true
        })
    }

    notify = async () => {
        this.userRegistrationDate();
        this.notification.scheduleNotification();

        if (this.state.check == false) {
            { this.refs.toast1.show('Please agree to Terms and Conditions', 1000) }
        } else {
            this.props.navigation.navigate('skinJournal');

        }
    }

    render() {
        const barWidth = Dimensions.get('screen').width - 40;

        const real_price = this.state.product_amount / 100;

        return (

            <Container style={{ backgroundColor: '#DFE6EC' }}>
                  <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                        textStyle={{color:'white'}}
                    />
                <ScrollView style={{ backgroundColor: '#DFE6EC' }}>
                    <View style={{ width: wp('100%'), height: hp('100%'), backgroundColor: '#DFE6EC', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: '5%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

                            <View style={{ height: 30, width: 30, borderRadius: 30, borderWidth: 1, marginLeft: '30%', backgroundColor: 'black' }}>
                                <Text style={{ marginLeft: '35%', marginTop: '10%', color: '#DFE6EC' }}>1</Text>
                            </View>
                            <View style={{ height: 30, width: 30, borderRadius: 30, borderWidth: 1, marginLeft: '0%', borderColor: 'black', backgroundColor: 'black' }}>
                                <Text style={{ marginLeft: '35%', marginTop: '10%', color: '#DFE6EC' }}>2</Text>
                            </View>
                            <View style={{ height: 30, width: 30, borderRadius: 30, borderWidth: 1, marginRight: '30%', borderColor: 'black' }}>
                                <Text style={{ marginLeft: '35%', marginTop: '10%', color: 'black' }}>3</Text>
                            </View>
                        </View>

                        <Text style={styles.textConfirmation}>Confirmation</Text>

                        <View style={{ flexDirection: "row",borderTopWidth:0.3,borderColor:'#BFC7CE' }}>

                            <View style={styles.SectionStyle}>
                                <TextInput floatingLabel style={styles.txtinput}
                                
                                  placeholder='Shipping Information'
                                        onChangeText={(shippingInfo, shippingInfoErr) => this.setState({ shippingInfo, shippingInfoErr })}
                                        value={this.state.shippingInfo}
                                        editable={this.state.editableShipping}
                                    >

                                </TextInput>
                                <Text style={{ color: 'red', fontSize: 14, marginRight: 10 }}>{this.state.shippingInfoErr}</Text>

                            </View>
                            {/* <Text onPress={() => this.setState({editableShipping:true,textColor:"green"})} style={{ color: this.state.textColor, fontSize: 14, marginLeft: '7%' }}>Edit</Text> */}
                            <Text onPress={() => this.openModal2()} style={{ color: this.state.textColor, fontSize: 14, marginLeft: '7%',marginTop:'5%' }}>Edit</Text>

                        </View>
                        <Modal animationIn="slideInUp" animationOut="slideOutDown" onBackdropPress={() => this.closeModal2()} onSwipeComplete={() => this.closeModal2()} swipeDirection="right"
                            isVisible={this.state.isModalVisible} style={{ backgroundColor: 'white',maxHeight:Dimensions.get('window').height / 2.5, borderRadius: 60 / 2 }}>
                            <View style={{ marginTop: '0%' }}>

                                <View style={styles.SectionStyle2}>

                                    <Item floatingLabel style={styles.txtinput}
                                    >
                                        <Label style={{ color: 'black', fontSize: 15,fontFamily:'Khula-SemiBold' }} >Address</Label>
                                        <Input
                                            placeholderTextColor="black"
                                            onChangeText={(addressShipping, addressErrShipping) => this.setState({ addressShipping, addressErrShipping })}
                                            value={this.state.addressShipping}
                                        />
                                    </Item>

                                    <Text style={{ color: 'red', fontSize: 14, marginLeft: '-20%' }}>{this.state.addressErrShipping}</Text>

                                </View>

                                <View style={styles.SectionStyle2}>

                                    <Item floatingLabel style={styles.txtinput}
                                    >
                                        <Label style={{ color: 'black', fontSize: 15,fontFamily:'Khula-SemiBold'}} >City</Label>
                                        <Input
                                            placeholderTextColor="black"
                                            onChangeText={(cityShipping, cityErrShipping) => this.setState({ cityShipping, cityErrShipping })}
                                            value={this.state.cityShipping}
                                        />
                                    </Item>

                                    <Text style={{ color: 'red', fontSize: 14, marginLeft: '-20%' }}>{this.state.cityErrShipping}</Text>

                                </View>

                                <View style={styles.SectionStyle2}>
                                    <Item floatingLabel style={styles.txtinput}
                                    >
                                        <Label style={{ color: 'black', fontSize: 15,fontFamily:'Khula-SemiBold' }} >Zip</Label>
                                        <Input
                                            placeholderTextColor="black"
                                            keyboardType='numeric'
                                            onChangeText={(zipShipping, zipErrshipping) => this.setState({ zipShipping, zipErrshipping })}
                                            value={this.state.zipShipping}
                                        />
                                    </Item>

                                    <Text style={{ color: 'red', fontSize: 14, marginLeft: '-20%' }}>{this.state.zipErrshipping}</Text>

                                </View>


                                <TouchableOpacity style={{ width: '45%', height: '17%', backgroundColor: 'black', borderRadius: 60 / 2,alignSelf:'center',justifyContent:'center', marginTop: '5%' }}
                              onPress={this.Shippinhdetailsupdate.bind(this)}
                                 >
                                    <Text style={{ textAlign: 'center', color: 'white' }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>


                        <Modal animationIn="slideInUp" animationOut="slideOutDown" onBackdropPress={() => this.closeModal()} onSwipeComplete={() => this.closeModal()} swipeDirection="right"
                            isVisible={this.state.isModalVisible1} style={{ backgroundColor: 'white', maxHeight: Dimensions.get('window').height / 2.2, borderRadius: 60 / 2 }}>
                            <View style={{ marginTop: '5%' }}>
                                <View style={styles.SectionStyle2}>

                                    <Item floatingLabel style={styles.txtinput}
                                    >
                                        <Label style={{ color: 'black', fontSize: 15,fontFamily:'Khula-SemiBold'  }} >Full name</Label>
                                        <Input


                                            placeholderTextColor="black"
                                            onChangeText={(fullName, fullNameErr) => this.setState({ fullName, fullNameErr })}
                                            value={this.state.fullName}
                                        />
                                    </Item>
                                    <Text style={{ color: 'red', fontSize: 14, marginLeft: '-20%' }}>{this.state.fullNameErr}</Text>

                                </View>

                                <View style={styles.SectionStyle2}>



                                    <Item floatingLabel style={styles.txtinput}
                                    >
                                        <Label style={{ color: 'black', fontSize: 15,fontFamily:'Khula-SemiBold'  }} >Address</Label>
                                        <Input


                                            placeholderTextColor="black"
                                            onChangeText={(address, addressErr) => this.setState({ address, addressErr })}
                                            value={this.state.address}
                                        />
                                    </Item>

                                    <Text style={{ color: 'red', fontSize: 14, marginLeft: '-20%' }}>{this.state.addressErr}</Text>

                                </View>

                                <View style={styles.SectionStyle2}>

                                    <Item floatingLabel style={styles.txtinput}
                                    >
                                        <Label style={{ color: 'black', fontSize: 15,fontFamily:'Khula-SemiBold'  }} >City</Label>
                                        <Input


                                            placeholderTextColor="black"
                                            onChangeText={(city, cityErr) => this.setState({ city, cityErr })}
                                            value={this.state.city}
                                        />
                                    </Item>

                                    <Text style={{ color: 'red', fontSize: 14, marginLeft: '-20%' }}>{this.state.cityErr}</Text>

                                </View>



                                <View style={styles.SectionStyle2}>
                                    <Item floatingLabel style={styles.txtinput}
                                    >
                                        <Label style={{ color: 'black', fontSize: 15,fontFamily:'Khula-SemiBold'  }} >Zip</Label>
                                        <Input


                                            placeholderTextColor="black"
                                            keyboardType='numeric'
                                            onChangeText={(zip, zipErr) => this.setState({ zip, zipErr })}
                                            value={this.state.zip}
                                        />
                                    </Item>

                                    <Text style={{ color: 'red', fontSize: 14, marginLeft: '-20%' }}>{this.state.zipErr}</Text>

                                </View>


                                <TouchableOpacity style={{ width: '35%', height: '13%', backgroundColor: 'black', borderRadius: 60 / 2,  marginTop: '5%',alignSelf:"center",justifyContent:'center',marginBottom:'5%' }} 
                                onPress={this.Billingdetailsupdate.bind(this)}
                                >
                                    <Text style={{ textAlign: 'center', color: 'white' }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>


                        <View style={{ flexDirection: "row" }}>

                            <View style={styles.SectionStyle}>
                                <TextInput  style={styles.txtinput}
                                
                                placeholder ='Billing Information(same as shipping)' 
                                        onChangeText={(billingInfo, billingInfoErr) => this.setState({ billingInfo, billingInfoErr })}
                                        value={this.state.billingInfo}
                                        editable={this.state.editableBilling}

                             >

                                </TextInput>
                                <Text style={{ color: 'red', fontSize: 14, marginRight: 10 }}>{this.state.shippingInfoErr}</Text>

                            </View>
                            <Text onPress={() => this.openModal()} style={{ color: this.state.textColor, fontSize: 14, marginLeft: '7%',marginTop:'5%' }}>Edit</Text>

                        </View>

                        <View style={styles.SectionStyle}>
                            <Text
                                style={styles.txtinput}
                                placeholder="Phone number"
                                placeholderTextColor="black"
                                maxLength={10}
                                underlineColorAndroid="transparent"
                                keyboardType='numeric'
                                onChangeText={(phone, phoneErr) => this.setState({ phone, phoneErr })}
                                value={this.state.phone}
                            >Box information</Text>
                            <Text style={{ color: 'black', fontSize: 15, marginLeft: '7%' }}>Every Month</Text>

                        </View>
                        <ScrollView>
                            {/* expanded={true} */}
                            <ToggleBox label='Hide Order Summary' style={{ backgroundColor: '#DFE6EC', borderWidth: 1, borderColor: '#CFD6DD', marginLeft: '0%' }}>
                                <View style={{ marginTop: '2%' }}>
                                    <Text style={{ fontSize: 14, color: "black", marginLeft: '5%', fontFamily: 'Khula-SemiBold' }}>1 item in your cart</Text>
                                    <View style={{ flexDirection: 'row', marginTop: '1%', marginBottom: '5%', marginLeft: '5%' }}>
                                        <View>
                                            <Image source={{ uri: this.state.final_image }} key={this.state.final_image} style={{ width: wp('30%'), height: wp('30%'), borderRadius: wp('30%/2'), marginLeft: 0 }} ></Image>
                                            <Image source={jar} style={{ width: wp('20%'), height: hp('12%'), marginTop: '-30%', marginLeft: 50 }} ></Image>
                                        </View>
                                        <View style={{ marginLeft: '10%' }}>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: "31323F", marginTop: '20%', fontFamily: 'Khula-Bold' }}>Pore Cleaning Mask</Text>
                                            <Text style={{ fontSize: 14, color: "black", fontFamily: 'Khula-SemiBold' }}>${this.state.product_amount / 100}<Text> (First Month Free)</Text></Text>
                                            <Text style={{ fontSize: 12, color: "black", marginTop: '20%', fontFamily: 'Khula-SemiBold' }}>30g</Text>
                                        </View>
                                    </View>
                                </View>
                            </ToggleBox>
                        </ScrollView>
                        <View style={{ marginLeft: '10%', flexDirection: 'row',marginBottom:'5%' }}>
                            <CheckBox color="black" checked={this.state.check} onPress={() => this.checkboxTest()} />
                            <Text style={{ marginLeft: 20, color: '#31323F' }}>I agree to<Text style={{ color: 'black', fontFamily: 'Khula-Bold' }} onPress={() => Linking.openURL('https://bioformulaselect.com/pages/terms-of-service')}> Terms and Conditions</Text></Text>
                        </View>
                        <Toast position='center'
                            ref="toast1" style={{ backgroundColor: 'black' }} />
                        <TouchableOpacity style={Platform.OS == "ios" ? styles.regbtn : styles.regbtnAndroid}
                             onPress={this.notify.bind(this)}
                        >
                            <Text style={styles.btntxt}>Confirm Order</Text>
                        </TouchableOpacity>
                    </View>


                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },

    txtinput: {

        color: '#000000',
        fontSize: 14,
        marginTop: '0%',
        fontFamily: 'Khula-Bold',
        lineHeight: 33,
        marginLeft: '5%'

    },

    textConfirmation: {

        color: '#000000',
        fontSize: 24,
        marginTop: '3%',
        fontFamily: 'Khula-Bold',
        textAlign: 'center',
        lineHeight: 33,
        marginBottom: '5%'
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
        width: '75%',
        borderRadius: 11,
        backgroundColor: '#66893E',
    },

    btntxt: {
        textAlign: "center",
        color: "white",
        fontSize: 16,
        fontFamily: 'Khula-Bold',
    },

    SectionStyle: {
        height: 60,
        backgroundColor: '#DFE6EC',
        borderColor: '#CFD6DD',
        width: '80%'
    },

    ImageStyle: {
        padding: 10,
        margin: 10,
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-around'
    },


    regbtn: {
         marginBottom: "30%",
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
       backgroundColor : "black",
       shadowRadius: 15 ,
       shadowOffset : { width: 6, height: 5},
        borderTopEndRadius:100,
        borderTopStartRadius:100,
         justifyContent: "center"

    },

    regbtnAndroid: {
        marginBottom: '30%',
        height: 50,
        width: '90%',
        alignSelf: "center",
        fontSize: 15,
        borderBottomEndRadius: 100,
        borderBottomStartRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 0.8,
        elevation: 10,
        backgroundColor: "black",
        shadowRadius: 15,
        shadowOffset: { width: 56, height: 13 },
        borderTopEndRadius: 100,
        borderTopStartRadius: 100,
        justifyContent:'center'

    },

    
    SectionStyle2: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        //  borderBottomWidth: 0.4,
        borderColor: '#BFC7CE',
        height: 60,

    },


},

);




