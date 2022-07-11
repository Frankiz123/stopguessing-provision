
import React, { Component, } from "react";
import { Image, StyleSheet, ImageBackground, Alert, TouchableOpacity, BackHandler, Linking, ToastAndroid } from "react-native";
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text, ListItem, Left, Button, Body, Right, View, FooterTab, Footer, Content } from 'native-base';
import moment, { invalid } from "moment";
import AsyncStorage from "@react-native-community/async-storage";

let backPressed = 0;

class profile extends Component {
    
  state = {};
    constructor(props) {
        super(props);
        this.state = {
            backPressed: 1,
            shippingDate: moment(new Date()).add(3, 'day').format("DD-MMM"),
            check: ''
        }
    }   

    componentDidMount = async () => {
        var a = await AsyncStorage.getItem('user_status');
        if (a == null) {
            this.setState({
                check: 0
            })
        }
        else {
            this.setState({
                check: a
            })
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    check = async () => {
        var plan_check = await AsyncStorage.getItem('plan_check')
        if (plan_check == 1) {
            this.props.navigation.navigate('planActive')
        }
        else {
            alert('Do not have any active plan')
        }
    }

    logOut = async () => {
        
        // AsyncStorage.setItem("logout_token", JSON.stringify(token));
        AsyncStorage.removeItem("responseJson")
        this.props.navigation.navigate("login")

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
            <Container style={{backgroundColor: '#DFE6EC'}}>               
                <Content style={{backgroundColor: '#DFE6EC'}}>
                <View style={{marginTop:10,backgroundColor: '#DFE6EC',marginLeft:'5%',marginRight:'5%',}}>
                    <Tabs  tabContainerStyle={{borderWidth:1,borderBottomWidth:1, borderBottomEndRadius:100,
                        borderBottomStartRadius:100,
                        borderColor:'#CFD6DD',
                        
                        shadowOpacity: 0.8,
                        elevation: 10,
                        backgroundColor : "#DFE6EC",
                        shadowRadius: 15 ,
                        shadowOffset : { width: 56, height: 13},
                        borderTopEndRadius:100,
                        borderTopStartRadius:100,}} tabBarUnderlineStyle={{ backgroundColor: 'null', }} style={{backgroundColor:"#DFE6EC"}}  >     
                    
                         <Tab  tabStyle={{backgroundColor: 'null'}} activeTabStyle={{ backgroundColor: '#null' }}
                             activeTextStyle={{color:'black',fontFamily:'Khula-Bold'}} textStyle={{color:'#393939'}}  heading='Account' >
                            <TouchableOpacity style={{ marginTop: '0%' }} onPress={() => this.props.navigation.navigate('personalDetails')}>
                                <View style={styles.SectionStyle}>
                                    <Image
                                        source={require('../../image/account.png')}
                                        style={styles.ImageStyle}
                                    />
                                    <Text style={styles.txtinput}>Account information</Text>
                                    <Icon  name='ios-arrow-forward' style={{ color: '#BFC7CE',marginRight:20 }} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://bioformulaselect.com/pages/privacy')}>
                                <View style={styles.SectionStyle}>
                                    <Image
                                        source={require('../../image/privacy.png')}
                                        style={styles.ImageStyle}
                                    />
                                    <Text style={styles.txtinput}>Privacy</Text>
                                    <Icon  name='ios-arrow-forward' style={{ color: '#BFC7CE',marginRight:20 }} />

                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Linking.openURL('https://bioformulaselect.com/pages/terms-of-service')}>
                                <View style={styles.SectionStyle}>
                                    <Image
                                        source={require('../../image/terms.png')}
                                        style={styles.ImageStyle}
                                    />
                                    <Text style={styles.txtinput}>Terms</Text>

                                    <Icon  name='ios-arrow-forward' style={{ color: '#BFC7CE',marginRight:20 }} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('reset')}>
                                <View style={styles.SectionStyle}>
                                    <Image
                                        source={require('../../image/reset-pass.png')}
                                        style={styles.ImageStyle}
                                    />
                                    <Text style={styles.txtinput}>Reset Password</Text>

                                    <Icon  name='ios-arrow-forward' style={{ color: '#BFC7CE',marginRight:20 }} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.logOut.bind(this)}>
                                <View style={styles.SectionStyle}>
                                    <Image
                                        source={require('../../image/logout.png')}
                                        style={styles.ImageStyle}
                                    />
                                    <Text style={styles.txtinput}>Log out</Text>
                                    
                                    <Icon  name='ios-arrow-forward' style={{ color: '#BFC7CE',marginRight:20 }} />
                                </View>
                            </TouchableOpacity>

                        </Tab>
                      
                        <Tab  tabStyle={{backgroundColor: '"#DFE6EC"'}} textStyle={{color:'#393939'}} activeTabStyle={{ backgroundColor: 'null' }}
                              activeTextStyle={{color:'black',fontFamily:'Khula-Bold'}}  heading='Membership' >
         
                            <View style={{ marginTop: '0%',backgroundColor:'#DFE6EC' }}>
                                <View style={styles.SectionStyle}>
                                    <Image
                                        source={require('../../image/calendar-green.png')}
                                        style={styles.ImageStyle}
                                    />
                                    <Text style={styles.txtinput}>Ship date {'\n'}<Text style={{ fontSize: 12 }}>Bill date: {this.state.shippingDate}</Text></Text>

                                </View>

                                <TouchableOpacity onPress={this.check.bind(this)} >
                                    <View style={styles.SectionStyle}>
                                        <Image
                                            source={require('../../image/reset-pass.png')}
                                            style={styles.ImageStyle}
                                        />
                                        <Text style={styles.txtinput}>Plan {'\n'}<Text style={{ fontSize: 12 }}> {this.state.check == 0 ? 'Active' : 'Inactive'} </Text></Text>
                                        <Text style={{fontFamily:'Khula-SemiBold'}}>Edit</Text>

                                    </View>
                                </TouchableOpacity>
                                <View  style={{height:'60%',backgroundColor:'#DFE6EC'}}></View>
                            </View>
                        </Tab>
                    </Tabs>
                    </View>
                </Content>
                <Footer style={{ backgroundColor: '#DFE6EC',borderTopWidth:0,elevation:0 }}>
                    <FooterTab style={{ backgroundColor: '#DFE6EC',heightPercentageToHP:'10%' }}>                        
                        <TouchableOpacity style={{ marginLeft:'10%', 
                            height: 50,
                            width: '40%',
                            alignSelf: "center",
                            fontSize: 15,
                            fontFamily: "arial",}}
                            onPress={() => this.props.navigation.navigate('skinJournal')} >
                           
                            <Text style={{  fontWeight: 'bold',fontSize:14,color:'#000000',marginLeft:'20%' }}>Skin Journal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.regbtn}onPress={() => this.props.navigation.navigate('profile')} >
                          
                            <Text style={{  fontWeight: 'bold',fontSize:14,textAlign:'center',marginTop:'10%' }}>My Profile</Text>
                        </TouchableOpacity>

                    </FooterTab>
                </Footer>
            </Container>

        );
    }
}

export default profile;

const styles = StyleSheet.create({

    SectionStyle: {

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DFE6EC',
        borderBottomWidth: 0.5,
        borderColor: '#BFC7CE',
        height: 61,
        
    
    },

    ImageStyle: {
        padding: 10,
        margin: 10,
        height: 20,
        width: 20,
        resizeMode: 'stretch',
        alignItems: 'center',
        
    },
    txtinput: {
        flex: 1,
        color: '#31323F',
        borderColor: '#EFEFEF',
        fontSize: 14,
        fontFamily:'Khula-SemiBold'
    },
    cnclTxt: {
        color: '#31323F',
        marginTop: '5%',
        marginLeft: '5%',
        fontWeight: 'bold'
    },
    
regbtn: {
    marginRight: '10%',
    marginBottom: '10%',
    height: 50,
    width: '40%',
    alignSelf: "center",
    fontSize: 15,
    fontFamily: "arial",
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 15,
    backgroundColor: "#DFE6EC",
    shadowRadius: 15,
    shadowOffset: { width: 6, height: 13 },
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: "center",
    
  },
})


