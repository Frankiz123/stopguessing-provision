import React, {Component} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import {
  Container,
  View,
  Footer,
  FooterTab,
  Button,
  Header,
  Content,
  Icon,
} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Dash from 'react-native-dash';
import moment, {invalid} from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

const jar = require('src/image/jar.png');
let backPressed = 0;

class skinJournal extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      backPressed: 1,
      userImage: '',
      payment_date: '',
      actionDate: moment(new Date()).format('MMM DD, YYYY'),
      checkUpDate: '',
      singleProduct: '',
    };
  }

  componentDidMount = async () => {
    var now = await AsyncStorage.getItem('thankYouImage');
    this.setState({
      userImage: now,
    });
    const subId = await AsyncStorage.getItem('subscriptionId');
    this.getSubscription(subId);
  };

  getSubscription = async (subId) => {
    const formdata = {
      subId: subId,
    };
    let datafetch = {
      method: 'POST',
      body: JSON.stringify(formdata),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch('http://18.222.228.44:3000/getSubscription', datafetch)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.status == 1) {
          const end_date = Number(responseJson.subscription.current_period_end);
          // var checkUpDate = moment(this.state.payment_date).add(30,'day').format("MMM DD, YYYY");
          var checkUpDate = moment.unix(end_date).format('MM/DD/YYYY');
          this.setState({
            checkUpDate: checkUpDate,
          });
        } else {
          Alert.alert('There is no subscription');
        }
      });
    //   .catch(function (error) {
    //     Alert.alert(error.toString());
    //   });
  };

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

  render() {
    return (
      <Container style={{backgroundColor: '#DFE6EC'}}>
        <Content>
          {this.state.checkUpDate !== this.state.actionDate && (
            <View>
              <View style={{marginLeft: '30%', marginTop: '5%'}}>
                <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                  SKIN JOURNAL{' '}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon style={styles.circleRed} name="notifications" />

                <Text style={styles.date}>
                  Next checkup: {'\n'}
                  <Text style={styles.teaText}>{this.state.checkUpDate}</Text>
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Dash
                  dashGap={5}
                  dashColor="#79A14B"
                  style={{
                    width: 1,
                    height: hp('2%'),
                    flexDirection: 'column',
                    marginLeft: '17%',
                    marginTop: '5%',
                  }}
                />
              </View>
            </View>
          )}

          {this.state.checkUpDate === this.state.actionDate && (
            <View>
              <View style={{flexDirection: 'row'}}>
                <Icon style={styles.circleRed} name="notifications" />

                <Text style={styles.date}>
                  New Notification {'\n'}
                  <Text style={styles.teaText}>Action Required!</Text>
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Dash
                  dashGap={5}
                  dashColor="#79A14B"
                  style={{
                    width: 1,
                    height: hp('7%'),
                    flexDirection: 'column',
                    marginLeft: '17%',
                    marginTop: '2%',
                  }}
                />
                <Button
                  onPress={() => this.props.navigation.navigate('camera')}
                  style={{
                    marginLeft: '23%',
                    width: '35%',
                    backgroundColor: '#CE4F4F',
                    marginTop: '2%',
                  }}>
                  <Text style={{color: 'white', marginLeft: '17%'}}>
                    SCAN FACE
                  </Text>
                </Button>
              </View>
            </View>
          )}

          <View style={{flexDirection: 'row'}}>
            <View style={styles.circleGreen}></View>
            <Text style={styles.date}>
              {this.state.subscription_date} {'\n'}
              <Text style={styles.teaText}>StopGuessing</Text>
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Dash dashGap={5} dashColor="#79A14B" style={styles.dashhedLine} />
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  width: wp('30%'),
                  height: wp('30%'),
                  borderRadius: wp('30/2'),
                  marginTop: '8%',
                  marginLeft: '35%',
                }}
                source={{uri: this.state.userImage}}
                key={this.state.userImage}></Image>
              <Image style={styles.jar} source={jar}></Image>
            </View>
          </View>
        </Content>

        <Footer
          style={{backgroundColor: '#DFE6EC', borderTopWidth: 0, elevation: 0}}>
          <FooterTab
            style={{backgroundColor: '#DFE6EC', heightPercentageToHP: '10%'}}>
            <TouchableOpacity
              style={Platform.OS == 'ios' ? styles.regbtnIOS : styles.regbtn}
              onPress={() => this.props.navigation.navigate('skinJournal')}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: '#000000',
                  textAlign: 'center',
                  marginTop: '10%',
                }}>
                Skin Journal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 50,
                width: '40%',
                alignSelf: 'center',
                fontSize: 15,
                fontFamily: 'arial',
              }}
              onPress={() => this.props.navigation.navigate('profile')}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  marginRight: '5%',
                  marginTop: '0%',
                }}>
                My Profile
              </Text>
            </TouchableOpacity>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default skinJournal;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    marginTop: '5%',
  },
  circleGreen: {
    backgroundColor: 'black',
    height: wp('5%'),
    width: wp('5%'),
    borderRadius: wp('3/2%'),
    marginTop: '15%',
    marginLeft: '15%',
    shadowOpacity: 0.8,
    elevation: 10,
    shadowRadius: 15,
    shadowColor: 'black',
  },
  circleRed: {
    color: '#CE4F4F',
    marginTop: '10%',
    marginLeft: '15%',
  },
  date: {
    marginTop: '10%',
    fontSize: 14,
    marginLeft: '20%',
  },
  teaText: {
    color: '#31323F',
    fontWeight: '600',
    fontSize: 18,
    marginLeft: '50%',
  },
  jar: {
    width: wp('20%'),
    height: hp('11%'),
    marginTop: '46%',
    marginLeft: '-27%',
  },
  dashhedLine: {
    width: 1,
    height: hp('22%'),
    flexDirection: 'column',
    marginLeft: '17%',
    marginTop: '5%',
  },
  regbtn: {
    marginLeft: '10%',
    marginBottom: '10%',
    height: 50,
    width: '40%',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'arial',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 15,
    backgroundColor: '#DFE6EC',
    shadowRadius: 15,
    shadowOffset: {width: 56, height: 13},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
  },
  regbtnIOS: {
    marginLeft: '10%',
    marginBottom: '10%',
    height: 50,
    width: '40%',
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
});
