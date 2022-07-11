import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  ImageBackground,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Spinner from 'react-native-loading-spinner-overlay';
import {CheckBox, Container, Icon, Thumbnail} from 'native-base';
import Toast, {DURATION} from 'react-native-easy-toast';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import moment, {invalid} from 'moment';
import {TextInputMask} from 'react-native-masked-text';
import {Dropdown} from 'react-native-material-dropdown-v2';

import {Header, Content, Form, Item, Input, Label} from 'native-base';

//const card = require("../../image/card-gray.png")

export default class creditDetails extends Component {
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
      subscriptionDate: moment(new Date()).format('MMM DD, YYYY'),
      dt: '',
      cardType: '',
    };
  }

  _handlingCardNumber(number) {
    this.setState({
      cardNum: number
        .replace(/\s?/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim(),
    });
  }

  payment_Details = async () => {
    console.log('start');
    var date = this.state.dt.split('/');

    let cardrx = /^[0-9,' ']{10,25}$/g;

    let isvalidCard = cardrx.test(this.state.cardNum);

    if (!isvalidCard) {
      {
        this.refs.toast.show('Please enter valid card number', 1000);
      }
      return false;
    } else {
      this.props.navigation.navigate('paymentDetails');
    }

    var cardString = this.state.cardNum;
    var res = cardString.slice(15, 20);

    //   AsyncStorage.setItem("card_num", "**** **** ****" + ' ' + res);
    AsyncStorage.setItem('card', this.state.cardNum);
  };

  getcardNum(cardNum) {
    //start without knowing the credit card type
    var result = 'unknown';

    //first check for MasterCard
    if (/^5[1-5]/.test(cardNum)) {
      result = 'mastercard';
    }

    //then check for Visa
    else if (/^4/.test(cardNum)) {
      result = 'visa';
    }

    //then check for AmEx
    else if (/^3[47]/.test(cardNum)) {
      result = 'amex';
    }

    return result;
  }

  onChangeText = async (text) => {
    this.setState({
      cardType: text,
    });
  };
  render() {
    let data = [
      {
        value: 'Credit Card',
      },
      {
        value: 'Debit Card',
      },
    ];
    const barWidth = Dimensions.get('screen').width - 40;

    return (
      <Container>
        <KeyboardAwareScrollView style={{flex: 1, backgroundColor: '#DFE6EC'}}>
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
          <ScrollView>
            <View
              style={{
                width: wp('100%'),
                height: hp('100%'),
                backgroundColor: '#DFE6EC',
                marginTop: hp('5%'),
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: '5%',
                  marginLeft: '20%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 30,
                      borderWidth: 1,
                      marginLeft: '20%',
                      backgroundColor: 'black',
                    }}>
                    <Text
                      style={{
                        marginLeft: '35%',
                        marginTop: '10%',
                        color: '#DFE6EC',
                      }}>
                      1
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 30,
                      borderWidth: 1,
                      marginLeft: '5%',
                      borderColor: 'black',
                    }}>
                    <Text
                      style={{
                        marginLeft: '35%',
                        marginTop: '10%',
                        color: 'black',
                      }}>
                      2
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 30,
                      borderWidth: 1,
                      marginLeft: '5%',
                      borderColor: 'grey',
                    }}>
                    <Text
                      style={{
                        marginLeft: '35%',
                        marginTop: '10%',
                        color: 'grey',
                      }}>
                      3
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.textShipping}>Payment{'\n'} </Text>

              <View style={styles.SectionStyle}>
                <Icon name="card" style={{color: 'black', marginTop: '6%'}} />
                <Dropdown
                  dropdownPosition={(10, -4)}
                  containerStyle={styles.dropdown}
                  pickerStyle={styles.picker}
                  //    label='Select Card Type'
                  data={data}
                  //    baseColor='transparent'
                  value={'Credit Card'}
                  onChangeText={this.onChangeText}
                />
              </View>
              <View style={styles.SectionStyle2}>
                <Icon
                  name="card"
                  style={{color: 'black', marginTop: '6%', marginLeft: '3%'}}
                />
                <TextInput
                  style={styles.txtinput}
                  placeholder="Card number e.g. 4242 4242 4242 4242"
                  placeholderTextColor="black"
                  maxLength={25}
                  underlineColorAndroid="transparent"
                  keyboardType="numeric"
                  onChangeText={(cardNum, cardNumErr) =>
                    this._handlingCardNumber(cardNum, cardNumErr)
                  }
                  value={this.state.cardNum}
                />

                <Text style={{color: 'red', fontSize: 10, marginRight: 10}}>
                  {this.state.cardNumErr}
                </Text>
              </View>

              <TouchableOpacity
                style={
                  Platform.OS == 'ios' ? styles.regbtn : styles.regbtnAndroid
                }
                //  onPress={()=>this.props.navigation.navigate('personalDetails')}
                onPress={this.payment_Details.bind(this)}>
                <Text style={styles.btntxt}>NEXT</Text>
              </TouchableOpacity>

              <Toast
                position="center"
                ref="toast"
                style={{backgroundColor: 'black'}}
              />
            </View>
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
    marginTop: '0%',
    lineHeight: 33,
    textAlign: 'center',
    //   marginLeft: '-50%',
    fontFamily: 'Khula-Bold',
  },

  progressBar: {
    marginTop: 45,
    height: 22,
    width: '90%',
    backgroundColor: 'white',
    borderColor: '#EFEFEF',
    borderWidth: 2,
    borderRadius: 12,
    alignSelf: 'center',
  },
  dropdown: {
    width: '80%',
    marginLeft: '5%',
    height: '100%',
    backgroundColor: 'transparent',
    marginTop: '-2.5%',
  },

  picker: {
    width: '92%',
    marginTop: '-10%',
    marginLeft: '-10%',
    borderColor: 'transparent',
    backgroundColor: '#DFE6EC',
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
    marginTop: '5%',
  },

  btntxt: {
    marginVertical: 20,
    textAlign: 'center',
    margin: 'auto',
    color: 'white',
    fontSize: 16,
    fontFamily: 'Khula-Bold',
  },

  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    marginLeft: '5%',
    //   marginRight: '10%',
    borderWidth: 0.4,
    borderColor: 'black',
    height: '8.1%',
    width: '90%',
  },
  SectionStyle2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 0.8,
    borderColor: '#BFC7CE',
    height: 61,
    marginTop: '10%',
  },
  ImageStyle: {
    margin: 20,
    height: 17,
    width: 17,
    resizeMode: 'stretch',
    alignItems: 'center',
  },

  regbtnAndroid: {
    marginTop: '70%',
    marginBottom: '20%',
    height: 60,
    width: '90%',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'Khula-Bold',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 15,
    backgroundColor: 'black',
    shadowRadius: 15,
    shadowOffset: {width: 56, height: 13},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
  },
  regbtn: {
    marginTop: '70%',
    height: 60,
    width: '90%',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'arial',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    elevation: 5,
    backgroundColor: 'black',
    shadowRadius: 15,
    shadowOffset: {width: 6, height: 6},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
  },
  regbtn1: {
    marginTop: '5%',
    marginBottom: '20%',
    height: 60,
    width: '90%',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'arial',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 10,
    backgroundColor: '#DFE6EC',
    shadowRadius: 15,
    shadowOffset: {width: 56, height: 13},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
  },
  expMonth: {
    flexDirection: 'row',
    borderBottomWidth: 0.4,
    borderColor: '#BFC7CE',
  },
  spinnerTextStyle: {
    color: 'white',
  },
});
