
import React, { Component, } from "react";
import { Text, Image, StyleSheet, ImageBackground, BackHandler, ToastAndroid } from "react-native";
import { Container, Icon, Content, FooterTab, Footer, Button } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';

let backPressed = 0;
const file = require("src/image/file-text.png")

class repeathome extends Component {
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
        path: '',
        final_image:''
    }
  }

  componentDidMount = async() =>
  {
    var bgimage = await AsyncStorage.getItem('thankYouImage');
    var response = await AsyncStorage.getItem('responseJson');
    var loginToken = await AsyncStorage.getItem('loginToken');

this.setState({
  final_image:bgimage
})   
  }

userImage = async() =>
{

    let formdata =
    {
      "id":5 

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

    fetch('http://18.222.228.44:3000/singleUserImage', datafetch)
      .then(function (response) {
        return response;
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "true") {

        }

        else {
       

        }
      }).catch((error) => {
        setTimeout(() => {
          Alert.alert(
            //title
            'Stop Guessing',
            //body
            'Under maintenance. We will back soon !!',
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
        <Content>
          <ImageBackground style={styles.Bg} source={{uri : this.state.final_image}} key={this.state.final_image}>
          </ImageBackground>
        </Content>
        <Footer style={{ backgroundColor: '#79A14B' }}>
                    <FooterTab style={{ backgroundColor: '#79A14B' }}>
                        <Button onPress={() => this.props.navigation.navigate('skinJournal')} >
                            <Image source={file} />
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>SKIN JOURNAL</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('profile')} vertical>
                            <Icon style={{ color: 'white' }} name="happy" />
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>MY PROFILE</Text>
                        </Button>
                    </FooterTab>
         </Footer>
      </Container>

    );
  }
}

export default repeathome;

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
    fontWeight: 'bold'
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


