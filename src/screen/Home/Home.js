
import React, { Component, } from "react";
import { Text, Image, StyleSheet, ImageBackground, Alert, TouchableOpacity, BackHandler, ToastAndroid } from "react-native";
import { Container, View, Icon, Content, FooterTab, Footer, Button,Header } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
import { Actions, Router, Scene } from "react-native-router-flux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';

const devicewidth = Dimensions.get('window').width;
const devicehieght = Dimensions.get('window').height;

const BgPerson = require("src/image/person.png")
let backPressed = 0;



class Home extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      backPressed: 1,

      filepath: {
        data: '',
        uri: ''
      },
      fileData: '',
      fileUri: '',
      fileName: '',
      path: ''
    }
  }

 

  handleBackButton() {
    if (backPressed > 0) {
      BackHandler.exitApp();
      backPressed = 0;
    } else {
      backPressed++;
      ToastAndroid.show("Press Again To Exit", ToastAndroid.SHORT);
      setTimeout(() => { backPressed = 0 }, 2000);
      return true;
    }
  }



  render() {

    return (
      <Container>

        <Content >

          <ImageBackground style={styles.Bg} source={BgPerson}>
          </ImageBackground>
        </Content>
        <Footer style={{ backgroundColor: '#79A14B', }}>
          <FooterTab style={{ backgroundColor: '#79A14B' }}>
            <Button onPress={() => this.props.navigation.navigate('camera')} vertical>
              <Icon style={{ color: 'white' }} name="camera" />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>SCAN FACE</Text>
            </Button>


          </FooterTab>
        </Footer>

      </Container>

    );
  }
}

export default Home;

const styles = StyleSheet.create({

  Bg: {
    width: wp('100%'),
    height: hp('100%')
  },
  bottomView: {
    width: wp('100%'),
    height: hp('12%'),
    backgroundColor: '#79A14B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
    fontFamily:'Khula-Bold'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },

})


