
import React, { Component, } from "react";
import { Image, StyleSheet, ImageBackground, Alert, TouchableOpacity, BackHandler, ToastAndroid } from "react-native";
import { Container, Header, Tab, Tabs,Title, TabHeading, Icon, Text, ListItem, Left, Button, Body, Right, View, FooterTab, Footer, Content } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
import { Actions, Router, Scene } from "react-native-router-flux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const devicewidth = Dimensions.get('window').width;
const devicehieght = Dimensions.get('window').height;
const file = require("src/image/file-text.png")

class contactUs extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        return (
            <Container>
<Header androidStatusBarColor="#79A14B" style={{ backgroundColor: '#79A14B',}}>
<Left style={{marginRight:'75%'}}>
            <Button onPress={() => this.props.navigation.navigate('profile')} transparent>
              <Icon name='arrow-back' style={{color:'white'}}/>
            </Button>
          </Left>
          
        </Header>
                <Content>
                    <Text style={{textAlign:'center',marginTop:'20%',fontWeight:'bold',fontSize:20}}>
                    Contact us-  (415) 870-1382
                                       </Text>
                    </Content>
                    <Footer style={{ backgroundColor: '#79A14B' }}>
                    <FooterTab style={{ backgroundColor: '#79A14B' }}>
                        <Button onPress={() => this.props.navigation.navigate('skinJournal')} >
                            <Image source={file} />
                            <Text style={{ color: 'white', fontWeight: 'bold',fontSize:14 }}>SKIN JOURNAL</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate('profile')} vertical>
                            <Icon style={{ color: 'white' }} name="happy" />
                            <Text style={{ color: 'white', fontWeight: 'bold',fontSize:14 }}>MY PROFILE</Text>
                        </Button>

                    </FooterTab>
                </Footer>
            </Container>

        );
    }
}

export default contactUs;

const styles = StyleSheet.create({

    SectionStyle: {

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#000',
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
        fontWeight: '600'
    },
    cnclTxt: {
        color: '#31323F',
        marginTop: '5%',
        marginLeft: '5%',
        fontWeight: 'bold'
    }
})


