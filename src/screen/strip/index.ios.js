import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  Platform,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {reviews} from '../../utils/reviews';
import {useNavigation} from '@react-navigation/native';
import PayIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import stripe from 'tipsi-stripe';
import {data} from '../../utils/data';

const nav = false;

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

const navItems = [
  {
    title: 'What To \nExpect',
    id: 1,
  },
  {
    title: 'How it \nworks',
    id: 2,
  },
  {
    title: 'Reviews',
    id: 3,
  },
];

export default () => {
  const [activeIdx, setActiveIdx] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();
  const scrollRef = useRef();

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentPage]);

  const firstStep = currentPage === 1 || currentPage === 2 || currentPage === 3;
  const secondStep =
    currentPage === 4 || currentPage === 5 || currentPage === 6;

  const randomReviews = () => {
    return [
      reviews[randomInteger(3, 35)],
      reviews[randomInteger(3, 35)],
      reviews[randomInteger(3, 35)],
      reviews[randomInteger(3, 35)],
      reviews[randomInteger(3, 35)],
      reviews[randomInteger(3, 35)],
      reviews[randomInteger(3, 35)],
      reviews[randomInteger(3, 35)],
    ];
  };

  const currentReviews =
    currentPage === 1
      ? reviews.slice(0, 8)
      : currentPage === 2
      ? reviews.slice(8, 16)
      : currentPage === 3
      ? reviews.slice(16, 24)
      : currentPage === 4
      ? reviews.slice(24, 32)
      : currentPage === 4
      ? reviews.slice(32, 40)
      : currentPage === 5
      ? randomReviews()
      : currentPage === 6
      ? randomReviews()
      : currentPage === 7
      ? randomReviews()
      : randomReviews();

  const onStart = () => navigation.navigate('camera');

  const sendSubscriptionData = async (email, methodId, name, user_id) => {
    const formdata = {
      email: email,
      paymentMethodId: methodId,
      name: name,
      user_id: user_id,
    };
    let datafetch = {
      method: 'POST',
      body: JSON.stringify(formdata),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch('http://18.222.228.44:3000/createSubscription', datafetch)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.dataStatus == 1) {
          AsyncStorage.setItem('subscriptionId', responseJson.subscription);
          navigation.navigate('skinJournal');
        } else {
          Alert.alert('Your subscription request was failed!');
        }
      });
  };

  const subScribe = async () => {
    const userInfo = await AsyncStorage.getItem('responseJson');
    const email = JSON.parse(userInfo).email;
    const name = JSON.parse(userInfo).name;
    const user_id = JSON.parse(userInfo).id;
    const items = [
      {
        label: 'Stop Guessing Skincare Subscription',
        amount: '23.99',
      },
    ];

    //   const shippingMethods = [{
    //     id: 'StopGuessing',
    //     label: 'Stop Guessing Skincare Subscription',
    //     detail: 'Stop Guessing Skincare Subscription @ 23.99',
    //     amount: '23.99',
    //   }]

    const options = {
      // requiredBillingAddressFields: ['all'],
      requiredShippingAddressFields: ['phone', 'postal_address'],
      // shippingMethods,
    };
    let token = null;
    let paymentMethod = null;
    try {
      token = await stripe.paymentRequestWithApplePay(items, options);
      stripe.completeApplePayRequest();
    } catch (e) {
      stripe.cancelApplePayRequest();
    }
    if (token && token.tokenId) {
      try {
        paymentMethod = await stripe.createPaymentMethod({
          card: {
            token: token.tokenId,
          },
        });
      } catch (e) {
        // Handle error
        Alert.alert('Payment Method Error' + e);
      }
    }
    if (paymentMethod && paymentMethod.id)
      sendSubscriptionData(email, paymentMethod.id, name, user_id);
    else {
      Alert.alert('Requested PaymentMethod was failed!');
    }
  };

  const RenderItem = ({item}, idx) => {
    return (
      <View style={styles.reviewBlock} key={idx}>
        <View style={styles.reviewHeader}>
          <AutoHeightImage
            source={item?.img || require('../../image/A.png')}
            width={55}
            style={{
              resizeMode: 'contain',
            }}
          />
          <View style={styles.reviewHeaderContent}>
            <AutoHeightImage
              source={
                item?.stars
                  ? require('../../image/yellowStars4.png')
                  : require('../../image/yellowStars.png')
              }
              width={width * 0.3}
              style={styles.headerStars}
            />
            <Text style={styles.reviewName}>{item.name}</Text>
          </View>
        </View>
        <Text style={styles.reviewTitle}>{item.title}</Text>
        <Text style={styles.reviewContent}>{item.content}</Text>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        style={styles.container}>
        <Text style={styles.title}>
          Your face mask has {'\n'}been personalized!
        </Text>
        <AutoHeightImage
          source={require('../../image/girlMain.png')}
          width={width * 0.8}
          style={styles.girlImg}
        />
        {nav && (
          <AutoHeightImage
            source={require('../../image/skinRate.png')}
            width={width * 0.8}
            style={styles.girlImg}
          />
        )}
        <View style={styles.navView}>
          {navItems.map((el, idx) => (
            <TouchableOpacity
              disabled={idx === activeIdx}
              onPress={() => setActiveIdx(idx)}
              style={[
                styles.navContent,
                activeIdx === idx && styles.activeNavContent,
              ]}>
              <Text
                style={[
                  styles.navTitle,
                  activeIdx === idx && styles.activeNavTitle,
                ]}>
                {el.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {activeIdx === 0 && (
          <View>
            {data.datamap((item) => {
              return (
                <View>
                  <Text>{item.title}</Text>
                </View>
              );
            })}
          </View>
        )}
        {activeIdx === 1 && (
          <View>
            <Text>How it works</Text>
          </View>
        )}
        {activeIdx === 2 && (
          <>
            <Text style={styles.subTitle}>Customer Reviews</Text>
            <AutoHeightImage
              source={require('../../image/yellowStars.png')}
              width={width * 0.8}
              style={{
                resizeMode: 'contain',
                maxWidth: 360,
              }}
            />
            <Text style={styles.basedOn}>Based on 80 reviews</Text>

            <View style={styles.minContainer}>
              <View
                style={{
                  ...styles.progressView,
                }}>
                <AutoHeightImage
                  source={require('../../image/5.png')}
                  width={width * 0.28}
                  style={{
                    resizeMode: 'contain',
                  }}
                />
                <View
                  style={{
                    ...styles.progressContainer,
                    width: width * 0.32,
                  }}>
                  <View style={styles.progressLine}></View>
                </View>
                <Text
                  style={{
                    width: width * 0.2,
                    fontSize: 17,
                  }}>
                  89% (71)
                </Text>
              </View>

              <View
                style={{
                  ...styles.progressView,
                }}>
                <AutoHeightImage
                  source={require('../../image/4.png')}
                  width={width * 0.28}
                  style={{
                    resizeMode: 'contain',
                  }}
                />
                <View
                  style={{
                    ...styles.progressContainer,
                    width: width * 0.32,
                  }}>
                  <View style={{...styles.progressLine, width: '11%'}}></View>
                </View>
                <Text
                  style={{
                    width: width * 0.2,
                    fontSize: 17,
                  }}>
                  11% (9)
                </Text>
              </View>

              <View
                style={{
                  ...styles.progressView,
                }}>
                <AutoHeightImage
                  source={require('../../image/3.png')}
                  width={width * 0.28}
                  style={{
                    resizeMode: 'contain',
                  }}
                />
                <View
                  style={{
                    ...styles.progressContainer,
                    width: width * 0.32,
                  }}></View>
                <Text
                  style={{
                    width: width * 0.2,
                    fontSize: 17,
                  }}>
                  0% (0)
                </Text>
              </View>

              <View
                style={{
                  ...styles.progressView,
                }}>
                <AutoHeightImage
                  source={require('../../image/2.png')}
                  width={width * 0.28}
                  style={{
                    resizeMode: 'contain',
                  }}
                />
                <View
                  style={{
                    ...styles.progressContainer,
                    width: width * 0.32,
                  }}></View>
                <Text
                  style={{
                    width: width * 0.2,
                    fontSize: 17,
                  }}>
                  0% (0)
                </Text>
              </View>

              <View
                style={{
                  ...styles.progressView,
                  marginBottom: 30,
                }}>
                <AutoHeightImage
                  source={require('../../image/1.png')}
                  width={width * 0.28}
                  style={{
                    resizeMode: 'contain',
                  }}
                />
                <View
                  style={{
                    ...styles.progressContainer,
                    width: width * 0.32,
                  }}></View>
                <Text
                  style={{
                    width: width * 0.2,
                    fontSize: 17,
                  }}>
                  0% (0)
                </Text>
              </View>
            </View>

            <View style={styles.minContainer}>
              {currentReviews.map((item) => (
                <RenderItem item={item} />
              ))}
            </View>
            <View style={styles.mainNav}>
              <TouchableOpacity
                disabled={firstStep && currentPage === 1}
                onPress={() => {
                  // scrollToTop();
                  if (firstStep) return setCurrentPage(1);
                  if (secondStep) return setCurrentPage(currentPage - 1);
                  else return setCurrentPage(6);
                }}>
                <Text
                  style={[
                    styles.navText,
                    firstStep && currentPage === 1 && styles.navTextActive,
                  ]}>
                  {firstStep ? 1 : secondStep ? '<' : '|<'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  (firstStep && currentPage === 2) ||
                  (secondStep && currentPage === 4)
                }
                onPress={() => {
                  // scrollToTop();
                  if (firstStep) return setCurrentPage(2);
                  if (secondStep) return setCurrentPage(4);
                  else return setCurrentPage(currentPage - 1);
                }}>
                <Text
                  style={[
                    styles.navText,
                    ((firstStep && currentPage === 2) ||
                      (secondStep && currentPage === 4)) &&
                      styles.navTextActive,
                  ]}>
                  {firstStep ? 2 : secondStep ? 4 : '<'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  (firstStep && currentPage === 3) ||
                  (secondStep && currentPage === 5) ||
                  currentPage === 7
                }
                onPress={() => {
                  // scrollToTop();
                  if (firstStep) return setCurrentPage(3);
                  if (secondStep) return setCurrentPage(5);
                  else return setCurrentPage(7);
                }}>
                <Text
                  style={[
                    styles.navText,
                    ((firstStep && currentPage === 3) ||
                      (secondStep && currentPage === 5) ||
                      currentPage === 7) &&
                      styles.navTextActive,
                  ]}>
                  {firstStep ? 3 : secondStep ? 5 : 7}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  (secondStep && currentPage === 6) || currentPage === 8
                }
                onPress={() => {
                  // scrollToTop();
                  if (firstStep) return setCurrentPage(currentPage + 1);
                  if (secondStep) return setCurrentPage(6);
                  else return setCurrentPage(8);
                }}>
                <Text
                  style={[
                    styles.navText,
                    ((secondStep && currentPage === 6) || currentPage === 8) &&
                      styles.navTextActive,
                  ]}>
                  {firstStep ? '>' : secondStep ? 6 : 8}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // scrollToTop();
                  if (firstStep) return setCurrentPage(4);
                  if (secondStep) return setCurrentPage(currentPage + 1);
                }}>
                <Text style={[styles.navText]}>
                  {firstStep ? '>|' : secondStep ? '>' : ' '}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                ...styles.footer,
                height: height * 0.28,
              }}>
              {nav ? (
                <>
                  <Text style={styles.text2}>
                    Stop Guessing Monthly Subscription
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>
                    $23.99
                  </Text>
                  <TouchableOpacity
                    style={
                      Platform.OS == 'ios'
                        ? styles.regbtn
                        : styles.regbtnAndroid
                    }
                    onPress={subScribe}>
                    <Text style={styles.text3}>Buy with </Text>
                    {Platform.OS == 'android' ? (
                      <PayIcon name="ios-logo-google" color="white" size={22} />
                    ) : (
                      <PayIcon name="ios-logo-apple" size={22} color="white" />
                    )}
                    <Text style={styles.text3}> Pay</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.updateScan}>
                    Update your skincare routine
                  </Text>
                  <TouchableOpacity
                    onPress={onStart}
                    style={{...styles.startTouch, width: width * 0.8}}>
                    <Text style={styles.letsStart}>LET`S GET STARTED</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
      <SafeAreaView style={styles.safeArea} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DFE6EC',
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  safeArea: {
    backgroundColor: '#DFE6EC',
  },
  mainNav: {
    marginBottom: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewBlock: {
    width: '100%',
    marginBottom: 35,
  },
  girlImg: {
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: 30,
    maxWidth: 400,
  },
  navText: {
    fontSize: 18,
    marginHorizontal: 12,
  },
  navTextActive: {
    fontWeight: '700',
  },
  footer: {
    width: '100%',
    backgroundColor: '#DFE6EC',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.51,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    elevation: 15,
  },
  startTouch: {
    height: 50,
    backgroundColor: '#000',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
  },
  updateScan: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
  },
  letsStart: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  minContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  reviewHeaderContent: {
    marginHorizontal: 15,
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 48,
  },
  reviewContent: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 15,
  },
  headerStars: {
    resizeMode: 'contain',
    maxWidth: 360,
  },
  subTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  reviewName: {
    fontSize: 18,
    fontWeight: '700',
  },
  basedOn: {
    fontSize: 19,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 22,
  },
  progressContainer: {
    height: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 15,
    padding: 1,
  },
  progressView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  blackStars: {
    height: 20,
    backgroundColor: 'blue',
  },
  progressLine: {
    height: '100%',
    width: '89%',
    backgroundColor: '#000',
  },
  navView: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  navTitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
  },
  navContent: {
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 18,
  },
  activeNavContent: {
    backgroundColor: '#000',
    borderRadius: 50,
  },
  activeNavTitle: {
    color: '#fff',
  },
  regbtn: {
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
    backgroundColor: 'black',
    shadowRadius: 15,
    shadowOffset: {width: 6, height: 5},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regbtnAndroid: {
    height: 55,
    width: '85%',
    alignSelf: 'center',
    fontFamily: 'Khula-Bold',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 25,
    backgroundColor: 'black',
    shadowRadius: 15,
    shadowOffset: {width: 56, height: 13},
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text3: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontFamily: 'Khula-Bold',
  },
  text2: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
});
