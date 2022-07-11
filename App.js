/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
console.disableYellowBox = true;

import splash from 'src/screen/splash';
import Home from 'src/screen/Home/Home';
import Strip from 'src/screen/strip';
import Tutorial from 'src/screen/Tutorial/Tutorial';
import camera from 'src/screen/camera/camera';
import editPicture from 'src/screen/editPicture/editPicture';
import fineLines from 'src/screen/fineLines/fineLines';
import thankYou from 'src/screen/thankYou/thankYou';
import scanResult from 'src/screen/scanResult/scanResult';
import drySkin from 'src/screen/drySkin/drySkin';
import oilySkin from 'src/screen/oilySkin/oilySkin';
import Demo from 'src/screen/Demo';
import shippingDetails from 'src/screen/shippingDetails/shippingDetails';
import paymentDetails from 'src/screen/paymentDetails/paymentDetails';
import confirmationOrder from 'src/screen/confirmationOrder/confirmationOrder';
import orderCompleted from 'src/screen/orderCompleted/orderCompleted';
import signUp from 'src/screen/signUp/signUp';
import login from 'src/screen/login/login';
import forgotPassword from 'src/screen/forgotPassword/forgotPassword';
import healthySkin from 'src/screen/healthySkin/healthySkin';
import profile from 'src/screen/profile/profile';
import personalDetails from 'src/screen/personalDetails/personalDetails';
import contactUs from 'src/screen/contactUs/contactUs';
import repeathome from 'src/screen/repeathome/repeathome';
import reset from 'src/screen/reset/reset';
import planActive from 'src/screen/planActive/planActive';
import skinJournal from 'src/screen/skinJournal/skinJournal';
import notification from 'src/screen/notification/notification';
import creditDetails from 'src/screen/creditDetails/creditDetails';

import LeftCameraScreen from 'src/screen/LeftCameraScreen';
import RightCameraScreen from 'src/screen/RightCameraScreen';
import Smartlook from 'smartlook-react-native-wrapper';
import analytics from '@react-native-firebase/analytics';

const Stack = createStackNavigator();
const App = () => {
  const navigationRef = useRef();
  const routeNameRef = useRef();
  useEffect(() => {
    SplashScreen.hide();
    Smartlook.setupAndStartRecording(
      '5d2a4d7b1b48e2c05a06c1dbe9219d8187509c39',
    );
    eCommerceEvents();
  }, []);
  const eCommerceEvents = async () => {
    const data = {
      currency: '$',
      items: [
        {
          id: 1,
          name: 'testing item',
          quantity: 1,
        },
      ],
    };
    ///////to explore more events, please check the link below/////
    //https://rnfirebase.io/reference/analytics/begincheckouteventparameters

    await analytics().AddToCartEventParameters(data);
    await analytics().AddToWishlistEventParameters(data);
    await analytics().BeginCheckoutEventParameters(data);
  };

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}>
        <Stack.Navigator
          initialRouteName="splash"
          screenOptions={{gestureEnabled: false}}>
          <Stack.Screen
            name="splash"
            component={splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="signUp"
            component={signUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Strip"
            component={Strip}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="Tutorial"
            component={Tutorial}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="camera"
            component={camera}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="editPicture"
            component={editPicture}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="fineLines"
            component={fineLines}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="thankYou"
            component={thankYou}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="scanResult"
            component={scanResult}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="drySkin"
            component={drySkin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="oilySkin"
            component={oilySkin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Demo"
            component={Demo}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="shippingDetails"
            component={shippingDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="paymentDetails"
            component={paymentDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="confirmationOrder"
            component={confirmationOrder}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="orderCompleted"
            component={orderCompleted}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="login"
            component={login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="forgotPassword"
            component={forgotPassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="healthySkin"
            component={healthySkin}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="profile"
            component={profile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="personalDetails"
            component={personalDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="repeathome"
            component={repeathome}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="contactUs"
            component={contactUs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="reset"
            component={reset}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="planActive"
            component={planActive}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="skinJournal"
            component={skinJournal}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="notification"
            component={notification}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="creditDetails"
            component={creditDetails}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="leftCamera"
            component={LeftCameraScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="rightCamera"
            component={RightCameraScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
export default App;
