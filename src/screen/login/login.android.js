import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  Animated,
  TextInput,
  Button,
  Icon,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  ImageBackground,
  Platform,
} from 'react-native';
import {Container, Header, Content} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Form, Item, Input, Label} from 'native-base';
let backPressed = 0;

export default class login extends Component {
  componentDidMount() {
    GoogleSignin.configure({
      scopes: [], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '225797216620-und7jqfa6hbo5eo8k6qbm2mt89tkc5v2.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: '', // specifies a hosted domain restriction
      // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      // googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    });
  }
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      status: '',
      backPressed: 1,
      spinner: false,
    };
  }

  handleBackButton() {
    if (backPressed > 0) {
      BackHandler.exitApp();
      backPressed = 0;
    } else {
      backPressed++;
      ToastAndroid.show('Press Again To Exit', ToastAndroid.SHORT);
      setTimeout(() => {
        backPressed = 0;
      }, 2000);
      return true;
    }
  }

  log_in = async () => {
    this.setState({
      spinner: true,
    });
    if (this.state.email == '') {
      this.setState({
        spinner: false,
      });
      Alert.alert('Please enter your email!');
      return;
    }
    if (this.state.password == '') {
      this.setState({
        spinner: false,
      });
      Alert.alert('Please enter your password!');
      return;
    }
    let formdata = {
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
    fetch('http://18.222.228.44:3000/signin', datafetch)
      .then(function (response) {
        return response;
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'true') {
          AsyncStorage.setItem(
            'responseJson',
            JSON.stringify(responseJson.user[0]),
          );
          console.log('userInfo....', responseJson.user[0].id);
          this.getSubscriptionStatus(responseJson.user[0].id);
        } else {
          this.setState({
            spinner: false,
            status: responseJson.msg,
          });
        }
      })
      .catch((error) => {
        Alert.alert(error);
      })
      .done();
  };
  getSubscriptionStatus = async (userId) => {
    const formdata = {
      userId: userId,
    };
    let datafetch = {
      method: 'POST',
      body: JSON.stringify(formdata),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch('http://18.222.228.44:3000/getSubscriptionStatus', datafetch)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({spinner: false});
        console.log('responseJson.........vvvvv.......', responseJson);
        if (responseJson.status == 1) {
          AsyncStorage.setItem('subscriptionId', 'asdfasdflk234jkjnn');
          this.props.navigation.navigate('skinJournal');
        } else if (responseJson.status == 2) {
          this.props.navigation.navigate('scanResult');
        } else {
          Alert.alert('Internet connection error!');
        }
      })
      .catch(function (error) {
        Alert.alert(error.toString());
      });
  };

  newUser = async () => {
    // this.props.navigation.navigate('signUp');
    this.props.navigation.navigate('signUp');
  };

  googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        this.signUp(userInfo.user.name, userInfo.user.email, '*****123qwe');
      } else {
        Alert.alert('Google login error!');
      }
      console.log('userInfo...', userInfo.user);
      // this.setState({ userInfo });
    } catch (error) {
      Alert.alert('Internet connection error!');
    }
  };
  signUp = async (name, email, password) => {
    this.setState({
      spinner: true,
    });
    let formdata = {
      name: name,
      email: email,
      password: password,
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

    fetch('http://18.222.228.44:3000/createcustomer', datafetch)
      .then(function (response) {
        return response;
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 1) {
          console.log('signup 1...', responseJson);
          const data = {
            id: responseJson.userInfo.insertId,
            name: name,
            email: email,
          };
          AsyncStorage.setItem('responseJson', JSON.stringify(data));
          this.getSubscriptionStatus(responseJson.userInfo.insertId);
        } else if (responseJson.status == 2) {
          AsyncStorage.setItem(
            'responseJson',
            JSON.stringify(responseJson.userInfo),
          );
          this.getSubscriptionStatus(responseJson.userInfo.id);
        } else {
          this.setState({
            spinner: false,
          });
          Alert.alert('Internet connection error!');
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
      <Container style={{backgroundColor: '#DFE6EC'}}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Content>
          <Text style={styles.signText}>Sign in</Text>
          <View style={{marginTop: '10%', backgroundColor: '#DFE6EC'}}>
            <View style={styles.SectionStyle}>
              <Item floatingLabel style={styles.txtinput}>
                <Label
                  style={{
                    color: 'black',
                    fontSize: 15,
                    fontFamily: 'Khula-SemiBold',
                  }}>
                  Email
                </Label>
                <Input
                  placeholderTextColor="black"
                  onChangeText={(email, status) =>
                    this.setState({email, status})
                  }
                  value={this.state.email}
                />
              </Item>
            </View>
            <View style={styles.SectionStyle}>
              <Item floatingLabel style={styles.txtinput}>
                <Label
                  style={{
                    color: 'black',
                    fontSize: 15,
                    fontFamily: 'Khula-SemiBold',
                  }}>
                  Password
                </Label>
                <Input
                  placeholderTextColor="black"
                  onChangeText={(password, status) =>
                    this.setState({password, status})
                  }
                  value={this.state.password}
                  secureTextEntry={true}
                />
              </Item>
            </View>
          </View>
          <Text
            style={{
              color: 'red',
              fontSize: 15,
              textAlign: 'center',
              marginTop: '10%',
            }}>
            {this.state.status}
          </Text>
          <Text
            onPress={() => this.props.navigation.navigate('forgotPassword')}
            style={styles.forgottext}>
            Forgot password?
          </Text>
          <View style={{marginTop: 100}}>
            <TouchableOpacity onPress={this.googleSignIn} style={styles.btn}>
              <Text style={styles.btntxt}>Google SignIn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.log_in.bind(this)}
              style={styles.btn}>
              <Text style={styles.btntxt}>Sign In</Text>
            </TouchableOpacity>
            <Text onPress={this.newUser} style={styles.memberText}>
              Not a member? <Text style={styles.clubText}>Join the Club</Text>
            </Text>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  signText: {
    fontSize: 20,
    fontFamily: 'Khula-Bold',
    textAlign: 'center',
    marginTop: '10%',
    color: '#000000',
  },

  img: {
    width: '100%',
    height: '100%',
    marginTop: 'auto',
  },

  signin: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 19,
    fontFamily: 'Khula-Bold',
  },

  txtinput: {
    flex: 1,
    color: '#31323F',
    borderColor: 'transparent',
  },

  forgottext: {
    textAlign: 'center',
    marginTop: '5%',
    color: 'black',
    fontSize: 14,
    fontFamily: 'Khula-Bold',
  },
  clubText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
  },

  memberText: {
    textAlign: 'center',
    marginTop: '5%',
    fontSize: 14,
    fontFamily: 'Khula-Bold',
  },

  btn: {
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
    marginTop: 20,
  },

  btntxt: {
    marginVertical: 20,
    textAlign: 'center',
    margin: 'auto',
    color: 'black',
    fontWeight: 'bold',
  },
  regbtnIOS: {
    marginTop: '0%',
    height: 60,
    width: '90%',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'arial',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    elevation: 1,
    backgroundColor: '#DFE6EC',
    shadowRadius: 15,
    shadowOffset: {width: 6, height: 5},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
  },
  fbbtn: {
    marginTop: '10%',
    height: 60,
    width: '90%',
    alignSelf: 'center',
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
    fontWeight: 'bold',
    fontSize: 14,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DFE6EC',
    borderBottomWidth: 0.5,
    borderBottomColor: '#BFC7CE',
    height: 61,
    marginLeft: 10,
    marginRight: 10,
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
    marginLeft: '12%',
  },
  regbtn: {
    marginTop: '15%',
    height: 60,
    width: 327,
    marginLeft: '10%',
    marginRight: '10%',
    fontSize: 15,
    fontFamily: 'arial',
    textAlign: 'center',
    backgroundColor: '#79A14B',
  },
  spinnerTextStyle: {
    color: 'white',
  },
});
