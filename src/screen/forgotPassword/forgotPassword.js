import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, TextInput, Button, Icon, TouchableOpacity, Image, Alert,ImageBackground } from 'react-native';
import { CheckBox, Container } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Toast, {DURATION} from 'react-native-easy-toast'
import Spinner from 'react-native-loading-spinner-overlay';

import {  Header, Content, Form, Item, Input, Label } from 'native-base';

export default class forgotPassword extends Component {
constructor(props){
    super(props);
    this.state={
email:'',
status:'',
spinner: false,

    }
}

forgot_password() {
    

    this.setState({
        spinner: true,
      });

    let formdata =
    {
      "email":this.state.email,
     
    }

    datafetch =
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

    fetch('http://18.222.228.44:3000/forgotPassword', datafetch)
      .then(function (response) {
        return response;
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status == "true") {
            this.setState({
                spinner: false,
              });
            this.refs.toast.show('Email sent successfully!', 500, () => {
            this.props.navigation.navigate("login");
    });
        }

        else {

            this.setState({
                status : responseJson.msg,
                spinner: false,

              })
    

        }
      }).catch((error) => {
 setTimeout(() => {
  Alert.alert(
      //title
      'Stop Guessing',
      //body
      'Under maintenance. We will back soon !!',
      [
        {text: 'Ok', onPress: () => BackHandler.exitApp()
      },
      ],
      { cancelable: false }
    );                
}, 3000);      
}).done();

  }

    render() {
        return (

            <Container style={{backgroundColor:'#DFE6EC'}}>
              <View style={{width:wp('100%'),height:hp('100%'),backgroundColor:'#DFE6EC',marginTop:hp('5%'),borderTopLeftRadius:40,borderTopRightRadius:40}}>                
              <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
                <Text style={styles.textPassword}>Forgot Password</Text>

                <View style={styles.SectionStyle}>
                <Item floatingLabel style={styles.txtinput}
>
              <Label style={{color:'black',fontSize:15,fontFamily:'Khula-SemiBold'}} >Email</Label>
              <Input 
              
              
              onChangeText={(email,status) => this.setState({ email,status })}
              value={this.state.email}
              />
            </Item>
                   
                </View>
                <Text style={{ color: 'red', fontSize: 15, textAlign:'center',marginTop:'10%' }}>{this.state.status}</Text>
                <Toast ref="toast" style={{backgroundColor:'#79A14B'}}/>
              <View style={{marginTop:'60%'}}>
                <TouchableOpacity style={styles.regbtn} onPress={this.forgot_password.bind(this)}>
                    <Text style={styles.btntxt}>Reset Password</Text>
                </TouchableOpacity>
</View>
            </View >
            </Container>
        );
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',

    },

    textPassword: {

        color: '#000000',
        fontSize: 24,
        marginTop: '10%',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 33,
        fontFamily:'Khula-Bold'
    },

    progressBar: {
        marginTop: 50,
        height: 25,
        width: '90%',
        backgroundColor: 'white',
        borderColor: '#EFEFEF',
        borderWidth: 2,
        borderRadius: 12,
        alignSelf: 'center'
    },

    progressBarfill: {
        height: 20,
        width:'44%' ,
        borderRadius: 11,
        backgroundColor: '#66893E',
    },

    txtinput: {
        flex: 1,
        color: '#31323F',
        borderColor: 'transparent'
    },

    btntxt: {
        marginVertical: 20,
        textAlign: "center",
        margin: "auto",
        color: "black",
        fontSize: 16,
        fontFamily:'Khula-Bold'
    },

    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DFE6EC',
        borderBottomWidth: 0.4,
        borderColor: '#BFC7CE',
        height: 61,
        marginTop:'10%',
marginLeft:'5%',
marginRight:'5%'
    },

    ImageStyle: {
        padding: 10,
        margin: 10,
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        alignItems: 'center',
    },

   
regbtn: {
    marginTop: "20%",
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
    expMonth: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: 0.4,
        borderColor: '#000',

    },
    spinnerTextStyle: {
        color: 'white'
      }

},

);





