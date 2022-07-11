import React, {Component} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  style,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import {Container, View} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

const Bg = require('src/image/splash.png');
let backPressed = 0;

class splash extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      backPressed: 1,

      filepath: {
        data: '',
        uri: '',
      },
      fileData: '',
      fileUri: '',
      fileName: '',
      path: '',
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

  login_check = async () => {
    var session_id = await AsyncStorage.getItem('session_id');
    if (session_id == null) {
      let that = this;
      setTimeout(function () {
        that.props.navigation.navigate('Tutorial');
      }, 2000);
    } else {
      let that = this;
      setTimeout(function () {
        that.props.navigation.navigate('skinJournal');
      }, 2000);
    }
    //   this._navigate()
  };

  componentDidMount = async () => {
    const subId = await AsyncStorage.getItem('subscriptionId');
    if (subId) this.props.navigation.navigate('skinJournal');
    else this.props.navigation.navigate('Strip');
  };

  render() {
    return (
      <Container>
        <View
          style={{
            height: '100%',
            backgroundColor: '#DFE6EC',
            alignItems: 'center',
          }}>
          <Image style={styles.Bg} source={Bg} />
        </View>
      </Container>
    );
  }
}

export default splash;

const styles = StyleSheet.create({
  Bg: {
    width: '85%',
    height: '85%',
  },
});
