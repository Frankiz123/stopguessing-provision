/* eslint-disable prettier/prettier */
import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Animated,
  TextInput,
  Button,
  Icon,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  ImageBackground,
} from 'react-native';
import {CheckBox} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast, {DURATION} from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';

const BgPerson = require('src/image/person.png');
import analytics from '@react-native-firebase/analytics';

export default class signUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      fullNameErr: '',
      email: '',
      emailErr: '',
      password: '',
      passwordErr: '',
      confirmPassword: '',
      confirmPasswordErr: '',
      phone: '',
      phoneErr: '',
      status: '',
      spinner: false,
    };
  }

  componentDidMount() {}

  signUp = async () => {
    let rjxemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let regname = /([^\s])/;
    let rxpassword = /^(?!\s*$).+/;
    let isvalidfullName = regname.test(this.state.fullName);

    let isEmailValid = rjxemail.test(this.state.email);
    let isPassword = rxpassword.test(this.state.password);

    if (!isvalidfullName) {
      this.setState({fullNameErr: 'Required'});
      return false;
    } else if (!isEmailValid) {
      this.setState({emailErr: 'Email Required'});
      return false;
    } else if (!isPassword) {
      this.setState({passwordErr: 'Required'});
      return false;
    } else if (this.state.password != this.state.confirmPassword) {
      this.setState({confirmPasswordErr: 'Unmatched password'});
      return false;
    } else {
      this.setState({isvalidfullName: ''});
      this.setState({emailErr: ''});
      this.setState({passwordErr: ''});
    }

    this.setState({
      spinner: true,
    });
    let formdata = {
      name: this.state.fullName,
      email: this.state.email,
      password: this.state.password,
    };

    let datafetch = {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin',
      body: JSON.stringify(formdata),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const subId = await AsyncStorage.getItem('subscriptionId');
    fetch('http://18.222.228.44:3000/createcustomer', datafetch)
      .then(function (response) {
        return response;
      })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
        this.setState({
          spinner: false,
        });
        if (responseJson.status == 1) {
          const data = {
            id: responseJson.userInfo.insertId,
            name: this.state.fullName,
            email: this.state.email,
          };
          AsyncStorage.setItem('responseJson', JSON.stringify(data));

          await analytics().setUserId(data.id);
          await analytics().setUserProperties('user_properties', data);
          // this.props.navigation.navigate('skinJournal');
        } else if (responseJson.status == 2) {
          Alert.alert('Email already exists!');
        } else {
          Alert.alert('Email already exists!');
        }
      })
      .catch((error) => {
        // console.error("api not",error);
        setTimeout(() => {
          Alert.alert(
            //title
            'Stop Guessing',
            //body
            'Please check your internet connection.',
            [{text: 'Ok', onPress: () => BackHandler.exitApp()}],
            {cancelable: false},
          );
        }, 3000);
      })
      .done();
  };

  render() {
    return (
      <KeyboardAwareScrollView style={{flex: 1}}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />

        <ImageBackground
          style={{width: wp('100%'), height: hp('100%')}}
          source={BgPerson}>
          <View
            style={{
              width: wp('100%'),
              height: hp('95%'),
              backgroundColor: 'white',
              marginTop: hp('5%'),
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            }}>
            {/* <View style={styles.progressBar}>
          <View style={styles.progressBarfill}>
          </View>
        </View> */}

            <Text style={styles.signin}>Sign Up</Text>
            <Text style={styles.l2}>
              Do you have an account?
              <Text
                onPress={() => this.props.navigation.navigate('login')}
                style={styles.l3}>
                {' '}
                Sign In {'\n'}
                {'\n'}
              </Text>
            </Text>

            <View style={styles.SectionStyle}>
              <Image
                source={require('../../image/user.png')}
                style={styles.ImageStyle}
              />

              <TextInput
                style={styles.txtinput}
                placeholder="Full name"
                placeholderTextColor="black"
                underlineColorAndroid="transparent"
                onChangeText={(fullName, fullNameErr) =>
                  this.setState({fullName, fullNameErr})
                }
                value={this.state.fullName}
              />
              <Text style={{color: 'red', fontSize: 15, marginRight: 10}}>
                {this.state.fullNameErr}
              </Text>
            </View>

            <View style={styles.SectionStyle}>
              <Image
                source={require('../../image/email.png')}
                style={styles.ImageStyle}
              />

              <TextInput
                style={styles.txtinput}
                placeholder="Email"
                placeholderTextColor="black"
                underlineColorAndroid="transparent"
                onChangeText={(email, emailErr) =>
                  this.setState({email, emailErr})
                }
                value={this.state.email}
              />
              <Text style={{color: 'red', fontSize: 15, marginRight: 10}}>
                {this.state.emailErr}
              </Text>
            </View>

            <View style={styles.SectionStyle}>
              <Image
                source={require('../../image/password.png')}
                style={styles.ImageStyle}
              />

              <TextInput
                style={styles.txtinput}
                placeholder="Password"
                placeholderTextColor="black"
                underlineColorAndroid="transparent"
                onChangeText={(password, passwordErr) =>
                  this.setState({password, passwordErr})
                }
                value={this.state.password}
                secureTextEntry={true}
              />
              <Text style={{color: 'red', fontSize: 15, marginRight: 10}}>
                {this.state.passwordErr}
              </Text>
            </View>

            <View style={styles.SectionStyle}>
              <Image
                source={require('../../image/password.png')}
                style={styles.ImageStyle}
              />

              <TextInput
                style={styles.txtinput}
                placeholder="Confirm password"
                placeholderTextColor="black"
                underlineColorAndroid="transparent"
                onChangeText={(confirmPassword, confirmPasswordErr) =>
                  this.setState({confirmPassword, confirmPasswordErr})
                }
                value={this.state.confirmPassword}
                secureTextEntry={true}
              />
              <Text style={{color: 'red', fontSize: 15, marginRight: 10}}>
                {this.state.confirmPasswordErr}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.regbtn}
              onPress={this.signUp.bind(this)}>
              <Text style={styles.btntxt}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  img: {
    width: '100%',
    height: '100%',
    marginTop: 'auto',
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: '25%',
  },
  signin: {
    color: '#000000',
    fontSize: 24,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 33,
  },
  l2: {
    color: '#31323F',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
  },
  l3: {
    marginTop: 50,
    color: '#000000',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 19,
  },
  progressBar: {
    marginTop: 50,
    height: 25,
    width: '90%',
    backgroundColor: 'white',
    borderColor: '#EFEFEF',
    borderWidth: 2,
    borderRadius: 12,
    alignSelf: 'center',
  },

  progressBarfill: {
    height: 20,
    width: '15%',
    borderRadius: 11,
    backgroundColor: '#66893E',
  },

  txtinput: {
    flex: 1,
    color: '#31323F',
    borderColor: '#EFEFEF',
  },

  forgottext: {
    textAlign: 'center',
    marginTop: '30%',
    borderColor: '#EFEFEF',
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  btn: {
    marginTop: '2%',
    height: 60,
    width: 327,
    marginLeft: '10%',
    marginRight: '10%',
    fontSize: 15,
    fontFamily: 'arial',

    textAlign: 'center',
    backgroundColor: '#79A14B',
  },
  btntxt: {
    marginVertical: 20,
    textAlign: 'center',
    margin: 'auto',
    color: 'white',
  },
  fbbtn: {
    marginTop: '2%',
    height: 60,
    width: 327,
    marginLeft: '10%',
    marginRight: '10%',
    fontSize: 15,
    fontFamily: 'arial',

    textAlign: 'center',
    backgroundColor: '#3B5998',
  },
  fbbtntxt: {
    marginVertical: -20,
    textAlign: 'center',
    color: 'white',
    alignItems: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 55,
  },

  ImageStyle: {
    padding: 10,
    margin: 10,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  fbimg: {
    marginTop: '7%',
    marginLeft: '15%',
  },
  regbtn: {
    marginTop: '10%',
    height: 60,
    width: '90%',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'arial',

    textAlign: 'center',
    backgroundColor: '#79A14B',
  },
  spinnerTextStyle: {
    color: 'white',
  },
});
