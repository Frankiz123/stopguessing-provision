
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, ToastAndroid, Animated, TextInput, Button, Icon, TouchableOpacity, Image, Alert, BackHandler, ImageBackground, Platform
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Header, Content } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import {  Form, Item, Input, Label } from 'native-base';
let backPressed = 0;

export default class login extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
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

  log_in = async () => {
    this.setState({
      spinner: true,
    });    
    if (this.state.email == "") {
      this.setState({
        spinner: false,
      });  
      Alert.alert ("Please enter your email!")
      return
    }
    if (this.state.password == "") {
      this.setState({
        spinner: false,
      });  
      Alert.alert ("Please enter your password!")
      return
    }
    let formdata =
    {
      "email": this.state.email,
      "password": this.state.password
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
    fetch('http://18.222.228.44:3000/signin', datafetch)
      .then(function (response) {
        return response;
      })
      .then(response => response.json())
      .then(responseJson => {        
        if (responseJson.status == "true") {                            
          AsyncStorage.setItem("responseJson",JSON.stringify(responseJson.user[0]))   
          console.log ("userInfo....",responseJson.user[0].id )                  
          this.getSubscriptionStatus (responseJson.user[0].id)                
        }
        else {
          this.setState({
            spinner: false,
            status: responseJson.msg
          });         
        }   

      }).catch((error) => {                
        Alert.alert(error)
      }).done();

}

  getSubscriptionStatus = async(userId) => {  
          
    const formdata = {                 
        userId: userId,
    }        
    let datafetch = {
        method: 'POST',                          
        body: JSON.stringify(formdata),
        headers:
        {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
    };

    fetch('http://18.222.228.44:3000/getSubscriptionStatus', datafetch)
    .then(response => response.json())
    .then(responseJson => {         
        this.setState({spinner: false});                    
        console.log ("responseJson.........vvvvv.......", responseJson)
        if (responseJson.status == 1) {                
          AsyncStorage.setItem('subscriptionId', responseJson.subscription);       
          this.props.navigation.navigate("skinJournal");       
        } else if (responseJson.status == 2){      
            this.props.navigation.navigate("scanResult");   
        } else {
            Alert.alert("Internet connection error!")
        }
        
    }).catch(function(error) {
        Alert.alert(error.toString())
    })
  }

newUser = async() =>
{  
  // this.props.navigation.navigate('signUp');
  this.props.navigation.navigate('signUp');
}

  render() {

    return (
      <Container style={{backgroundColor:'#DFE6EC'}}>     
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Content >         
          <Text style={styles.signText}>Sign in</Text>
          <View style={{ marginTop: '10%' ,backgroundColor:'#DFE6EC' }}>
            <View style={styles.SectionStyle}>
            <Item floatingLabel style={styles.txtinput}>
              <Label style={{color:'black',fontSize:15,fontFamily:'Khula-SemiBold'}} >Email</Label>
              <Input              
                  placeholderTextColor="black"                                   
                  onChangeText={(email, status) => this.setState({ email, status })}
                  value={this.state.email}
              />
            </Item>
            </View>
            <View style={styles.SectionStyle}>
            <Item floatingLabel style={styles.txtinput}>
              <Label style={{color:'black',fontSize:15,fontFamily:'Khula-SemiBold'}} >Password</Label>
              <Input                        
                placeholderTextColor="black"                                      
                onChangeText={(password, status) => this.setState({ password, status })}
                value={this.state.password}
                secureTextEntry={true}
                />
            </Item>             
            </View>
          </View>
          <Text style={{ color: 'red', fontSize: 15, textAlign: 'center', marginTop: '10%' }}>{this.state.status}</Text>
          <Text onPress={() => this.props.navigation.navigate('forgotPassword')} style={styles.forgottext}>Forgot password?</Text>
          <View style={{marginTop:'60%'}}>
        <TouchableOpacity onPress={this.log_in.bind(this)} style={Platform.OS == 'ios' ? styles.regbtnIOS : styles.btn}>
          <Text style={styles.btntxt}>Sign In</Text>
        </TouchableOpacity>
        <Text onPress={this.newUser} style={styles.memberText}>Not a member? <Text style={styles.clubText}>Join the Club</Text></Text>
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
    fontFamily:'Khula-Bold',
    textAlign: "center",
    marginTop: '10%',
    color: '#000000'
  },

  img:
  {
    width: "100%",
    height: "100%",
    marginTop: "auto"
  },

  signin: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 19,
    fontFamily:'Khula-Bold'
  },

  txtinput: {
    flex: 1,
    color: '#31323F',
    borderColor: 'transparent'
  },

  forgottext: {
    textAlign: 'center',
    marginTop: '5%',
    color: 'black',
    fontSize: 14,
    fontFamily:'Khula-Bold'

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
    fontFamily:'Khula-Bold',
  },

  btn: {
      height: 60,
      width: '90%',
      alignSelf: "center",
      fontSize: 15,
      fontFamily: "arial",
     borderBottomEndRadius:100,
     borderBottomStartRadius:100,
     shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 10,
    backgroundColor : "#DFE6EC",
    shadowRadius: 15 ,
    shadowOffset : { width: 56, height: 13},
     borderTopEndRadius:100,
     borderTopStartRadius:100,
      textAlign: "center",
    },
  
  btntxt: {
    marginVertical: 20,
    textAlign: "center",
    margin: "auto",
    color: "black",
    fontWeight: 'bold'
  },
  regbtnIOS:{
    marginTop: "0%",
    height: 60,
    width: '90%',
    alignSelf: "center",
    fontSize: 15,
    fontFamily: "arial",
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    elevation:1,
    backgroundColor : "#DFE6EC",
    shadowRadius: 15 ,
    shadowOffset : { width: 6, height: 5},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: "center",
},
  fbbtn: {
    marginTop: "10%",
    height: 60,
    width: '90%',
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: "arial",
    textAlign: "center",
    backgroundColor: "#3B5998"
  },
  fbbtntxt: {
    marginVertical: -20,
    textAlign: "center",
    color: "white",
    alignItems: "center",
    fontWeight: 'bold',
    fontSize: 14
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#DFE6EC',
    borderBottomWidth: 0.5,
    borderBottomColor: '#BFC7CE',
    height: 61,
marginLeft:10,
marginRight:10
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
    marginTop: "7%",
    marginLeft: "12%",


  },
  regbtn: {
    marginTop: "15%",
    height: 60,
    width: 327,
    marginLeft: "10%",
    marginRight: "10%",
    fontSize: 15,
    fontFamily: "arial",
    textAlign: "center",
    backgroundColor: "#79A14B"
  },
  spinnerTextStyle: {
    color: 'white'
  }


},

);