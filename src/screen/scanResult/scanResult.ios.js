import React, {Component} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {Container, View, Icon} from 'native-base';
import moment, {invalid} from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import * as Animatable from 'react-native-animatable';
import PayIcon from 'react-native-vector-icons/Ionicons';
import stripe from 'tipsi-stripe';
import Axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

stripe.setOptions({
  // publishableKey: 'pk_test_EqjV36GbTS5PP0ilPIuODmFJ',
  publishableKey: 'pk_live_QKdoTl0tswHXUM0GwGxX9oQr',
  merchantId: 'merchant.com.stopguessing',
  androidPayMode: 'test',
});
const jar = require('src/image/jar.png');

class scanResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 100,
      now: '',
      product_amount: '',
      productList: [],
      receipt: '',
      availableItemsMessage: '',
      purchased: false,
      products: [],
      payment_date: moment(new Date()).format('MMM DD, YYYY'),
      checking: true,
      isLoading: false,
    };
  }

  componentDidMount = async () => {
    var user = await AsyncStorage.getItem('thankYouImage');
    this.setState({
      now: user,
    });
  };

  subScribe = async () => {
    this.setState({isLoading: true});
    const userInfo = await AsyncStorage.getItem('responseJson');
    const email = JSON.parse(userInfo).email;
    const name = JSON.parse(userInfo).name;
    const user_id = JSON.parse(userInfo).id;
    const items = [
      {
        label: 'Stop Guessing Skincare Subscription',
        amount: '13.99',
      },
    ];

    //   const shippingMethods = [{
    //     id: 'StopGuessing',
    //     label: 'Stop Guessing Skincare Subscription',
    //     detail: 'Stop Guessing Skincare Subscription @ 13.99',
    //     amount: '13.99',
    //   }]

    const options = {
      // requiredBillingAddressFields: ['all'],
      requiredShippingAddressFields: ['phone', 'postal_address'],
      // shippingMethods,
    };
    let token = null;
    let paymentMethod = null;
    try {
      token = await stripe.paymentRequestWithApplePay(items, options);
      stripe.completeApplePayRequest();
    } catch (e) {
      stripe.cancelApplePayRequest();
    }
    if (token && token.tokenId) {
      try {
        paymentMethod = await stripe.createPaymentMethod({
          card: {
            token: token.tokenId,
          },
        });
      } catch (e) {
        // Handle error
        Alert.alert('Payment Method Error' + e);
      }
    }
    if (paymentMethod && paymentMethod.id)
      this.sendSubscriptionData(email, paymentMethod.id, name, user_id);
    else {
      Alert.alert('Requested PaymentMethod was failed!');
      this.setState({isLoading: false});
    }
  };

  sendSubscriptionData = async (email, methodId, name, user_id) => {
    const formdata = {
      email: email,
      paymentMethodId: methodId,
      name: name,
      user_id: user_id,
    };
    let datafetch = {
      method: 'POST',
      body: JSON.stringify(formdata),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch('http://18.222.228.44:3000/createSubscription', datafetch)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.dataStatus == 1) {
          this.setState({isLoading: false});
          AsyncStorage.setItem('subscriptionId', responseJson.subscription);
          this.props.navigation.navigate('skinJournal');
        } else {
          Alert.alert('Your subscription request was failed!');
          this.setState({isLoading: false});
        }
      });
  };

  check_user_shipping = async () => {
    var session_id = await AsyncStorage.getItem('session_id');
    var newUserToken = await AsyncStorage.getItem('newUserToken');
    console.log('newUserToekn', newUserToken);

    if (newUserToken !== null || undefined) {
      this.props.navigation.navigate('shippingDetails');
    } else {
      if (session_id == null || undefined) {
        this.props.navigation.navigate('shippingDetails');
      } else {
        this.props.navigation.navigate('creditDetails');
      }
    }
  };

  render() {
    const barWidth = Dimensions.get('screen').width - 40;
    const a = this.state.now;

    return (
      <Container style={{backgroundColor: '#DFE6EC'}}>
        <Spinner
          visible={this.state.isLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View
          style={{
            width: wp('100%'),
            height: hp('105%'),
            backgroundColor: '#DFE6EC',
            marginTop: '5%',
          }}>
          <Text style={styles.text1}>Your face mask has been</Text>

          <Text style={styles.text12}> personalized! </Text>
          <View style={{marginTop: hp('2%')}}>
            <Animatable.View
              animation="zoomIn"
              iterationCount={1}
              duration={2000}
              direction="alternate">
              <Image
                style={{
                  width: wp('70%'),
                  height: wp('70%'),
                  borderRadius: wp('70/2'),
                  marginLeft: '5%',
                }}
                source={{uri: this.state.now}}
                key={this.state.now}
                defaultSource={a}></Image>
            </Animatable.View>
          </View>

          <View style={{alignItems: 'center', marginTop: hp('-15%')}}>
            <Animatable.View
              animation="zoomIn"
              iterationCount={1}
              duration={2000}
              direction="alternate">
              <Image
                source={jar}
                style={{
                  width: wp('45%'),
                  height: hp('26%'),
                  marginLeft: '30%',
                  marginTop: '7%',
                }}></Image>
            </Animatable.View>
          </View>

          <View style={{alignItems: 'center', marginTop: '0%'}}>
            {/* <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold', marginRight: '0%' }}>To get 60% off use code:<Text></Text>SG60</Text> */}

            <Text style={styles.text2}>Pore Cleansing Mask </Text>

            {/* <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold',marginRight:'0%' }}>${this.state.product_amount /100}<Text> (First Month Free)</Text></Text> */}
            <Text
              style={{
                color: 'black',
                fontSize: 14,
                fontWeight: 'bold',
                marginRight: '0%',
              }}>
              $13.99<Text></Text>
            </Text>
          </View>
          <TouchableOpacity
            style={Platform.OS == 'ios' ? styles.regbtn : styles.regbtnAndroid}
            onPress={this.subScribe}>
            <Text style={styles.text3}>Subscribe with </Text>
            {Platform.OS == 'android' ? (
              <PayIcon name="ios-logo-google" color="white" size={22} />
            ) : (
              <PayIcon name="ios-logo-apple" size={22} color="white" />
            )}
            <Text style={styles.text3}>Pay</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

export default scanResult;

const styles = StyleSheet.create({
  TopView: {},
  img: {
    alignSelf: 'flex-end',
    marginTop: 20,
    height: hp('50%'),
    width: wp('95%'),
  },
  text1: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: '3%',
    fontFamily: 'Khula-Bold',
  },
  text12: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: '-2%',
    fontFamily: 'Khula-Bold',
  },
  text2: {
    marginLeft: 50,
    fontSize: 20,
    marginTop: 10,
    fontFamily: 'Khula-Bold',
  },
  text3: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontFamily: 'Khula-Bold',
  },

  regbtn: {
    marginTop: '5%',
    marginBottom: '20%',
    height: 60,
    width: '90%',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'Khula-Bold',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    elevation: 1,
    backgroundColor: 'black',
    shadowRadius: 15,
    shadowOffset: {width: 6, height: 5},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  regbtnAndroid: {
    marginTop: '2%',
    height: 55,
    width: '85%',
    alignSelf: 'center',
    fontFamily: 'Khula-Bold',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 25,
    backgroundColor: 'black',
    shadowRadius: 15,
    shadowOffset: {width: 56, height: 13},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
