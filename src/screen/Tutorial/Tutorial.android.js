import React, {Component} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
  Platform,
  ScrollView,
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
import {Dimensions} from 'react-native';

const devicewidth = Dimensions.get('window').width * 0.8;
const devicehieght = Dimensions.get('window').height;
const radiusWidth = devicewidth / 2;

const BgPerson = require('src/image/jar.png');
let backPressed = 0;

class Tutorial extends Component {
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      backPressed: 1,
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

  render() {
    return (
      //#DFE6EC
      <Container
        style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
        <ScrollView>
          <ImageBackground
            source={require('src/image/start_screen/1.png')}
            style={{width: '100%', height: 550, alignItems: 'center'}}
            resizeMode="stretch">
            <Text
              style={{
                width: 330,
                color: 'white',
                fontSize: 30,
                alignSelf: 'center',
                marginTop: 50,
                fontFamily: 'TimesNewRoman-Italic',
              }}>
              Your skincare should be as smart as your smartphone.
            </Text>
          </ImageBackground>
          <Text
            style={{
              fontSize: 33,
              alignSelf: 'center',
              marginTop: 20,
              fontFamily: 'TimesNewRoman-Italic',
            }}>
            "So stop wasting time..."
          </Text>
          <Image
            source={require('src/image/start_screen/2-1.png')}
            style={{width: '100%', marginTop: 20}}
            resizeMode="stretch"
          />
          <View
            style={{
              backgroundColor: '#84b778',
              width: '100%',
              height: 110,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 40,
                fontFamily: 'TimesNewRoman-Italic',
              }}>
              And Stop Guessing!
            </Text>
          </View>
          <Image
            source={require('src/image/start_screen/2-2.png')}
            style={{width: '100%'}}
            resizeMode="stretch"
          />
          <Text
            style={{
              width: '90%',
              alignSelf: 'center',
              fontSize: 18,
              marginTop: 20,
              fontFamily: 'TimesNewRoman',
            }}>
            It's a skincare app that uses machine learning to change your
            skincare ingredients as your skin changes
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 33,
              marginTop: 20,
              fontFamily: 'TimesNewRoman-Italic',
            }}>
            This is How{'\n'}Stop Guessing works
          </Text>
          <Image
            source={require('src/image/GIF11.gif')}
            style={{
              width: devicewidth,
              overlayColor: 'white',
              height: devicewidth,
              borderRadius: radiusWidth,
              marginTop: 20,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              marginTop: 20,
              fontFamily: 'TimesNewRoman',
            }}>
            Scan Face
          </Text>
          <Image
            source={require('src/image/GIF22.gif')}
            style={{
              width: devicewidth,
              overlayColor: 'white',
              height: devicewidth,
              borderRadius: radiusWidth,
              marginTop: 20,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              marginTop: 20,
              fontFamily: 'TimesNewRoman',
            }}>
            Touch Scan Problems
          </Text>
          <Image
            source={require('src/image/GIF33.gif')}
            style={{
              width: devicewidth,
              height: devicewidth,
              overlayColor: 'white',
              borderRadius: radiusWidth,
              marginTop: 20,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              marginTop: 20,
              fontFamily: 'TimesNewRoman',
            }}>
            and Get Personalized Face Mask delivered to {'\n'}your door
          </Text>

          <Image
            source={require('src/image/start_screen/3.png')}
            style={{width: '100%', marginTop: 20}}
          />
          <View
            style={{
              backgroundColor: '#84b778',
              width: '100%',
              height: 130,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 30,
                fontFamily: 'TimesNewRoman-Italic',
              }}>
              ... are all available to me
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 30,
                fontFamily: 'TimesNewRoman-Italic',
              }}>
              after you subscribe for
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 30,
                fontFamily: 'TimesNewRoman-Italic',
              }}>
              $13.99 a month
            </Text>
          </View>
          <Text
            style={{
              width: '90%',
              fontSize: 16,
              marginTop: 20,
              alignSelf: 'center',
              fontFamily: 'TimesNewRoman',
            }}>
            When you labeling your skin issues, our professionals and doctors
            check to make sure your skin problems are accurately labeled (for
            example, your acne is really acne... and not a mosquito bite)
          </Text>
          <Image
            source={require('src/image/start_screen/4.png')}
            style={{width: '100%', height: 300, marginTop: 20}}
          />
          <Text
            style={{
              width: '90%',
              fontSize: 16,
              marginTop: 20,
              alignSelf: 'center',
              fontFamily: 'TimesNewRoman',
            }}>
            After we confirm the accuracy of the labels, we will assign the
            right ingredients
          </Text>
          <Image
            source={require('src/image/start_screen/5_1.png')}
            style={{
              width: '100%',
              height: 230,
              marginTop: 20,
              alignSelf: 'center',
            }}
          />
          <Image
            source={require('src/image/start_screen/5_2.jpg')}
            style={{
              width: '100%',
              height: 230,
              marginTop: 10,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              width: '90%',
              fontSize: 16,
              marginTop: 20,
              alignSelf: 'center',
              fontFamily: 'TimesNewRoman',
            }}>
            You receive the treatment. Check back with us in a month, and then
            determine the success of the ingredients and determine the next
            steps.
          </Text>
          <Image
            source={require('src/image/start_screen/6.png')}
            style={{
              width: '100%',
              height: 620,
              marginTop: 20,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              width: '90%',
              fontSize: 16,
              marginTop: 20,
              alignSelf: 'center',
              fontFamily: 'TimesNewRoman',
            }}>
            As your skin changes, your skincare routine will, too. Stop Guessing
            monitors the changes in your skin through monthly updates. Every
            month, you are required to take a picture and a dermatologist will
            see how your skin is reacting to current ingredients, track your
            skin’s progress and track changes.
          </Text>
          <Image
            source={require('src/image/start_screen/7.png')}
            style={{
              width: '100%',
              height: 300,
              marginTop: 20,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              width: '90%',
              fontSize: 16,
              marginTop: 20,
              alignSelf: 'center',
              fontFamily: 'TimesNewRoman',
            }}>
            The genius behind the Stop Guessing App is that it is using
            artificial Intelligence. Research shows that artificial intelligence
            is at the point where it can outperform doctors.
          </Text>
          <Image
            source={require('src/image/start_screen/8.png')}
            style={{width: '100%', marginTop: 20, alignSelf: 'center'}}
          />
          <Text
            style={{
              width: '70%',
              textAlign: 'center',
              fontSize: 33,
              marginTop: 20,
              alignSelf: 'center',
              fontFamily: 'TimesNewRoman-Italic',
            }}>
            So stop guessing and update your skincare routine.{' '}
          </Text>
          <View style={{height: 130}} />
        </ScrollView>
        <TouchableOpacity
          style={Platform.OS == 'ios' ? styles.regbtn : styles.regbtnAndroid}
          onPress={() => this.props.navigation.navigate('camera')}>
          <Text style={styles.btntxt}>Start Scanning Face</Text>
        </TouchableOpacity>
      </Container>
    );
  }
}
export default Tutorial;

const styles = StyleSheet.create({
  text: {
    marginTop: devicehieght / 12,
    color: 'black',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Khula-Bold',
  },
  Bg: {
    height: hp('45%'),
    width: wp('80%'),
    marginTop: '25%',
    alignSelf: 'center',
  },

  textStyle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btntxt: {
    marginVertical: 20,
    textAlign: 'center',
    margin: 'auto',
    color: '#31323F',
    fontSize: 17,
    fontWeight: 'bold',
  },
  regbtn: {
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
    backgroundColor: '#DFE6EC',
    shadowRadius: 15,
    shadowOffset: {width: 6, height: 5},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
  },
  regbtnAndroid: {
    position: 'absolute',
    bottom: 20,
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
    backgroundColor: '#DFE6EC',
    shadowRadius: 15,
    shadowOffset: {width: 56, height: 13},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
  },
});
