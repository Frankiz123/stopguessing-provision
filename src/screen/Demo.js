import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
const itemSkus = Platform.select({
  ios: ['com.example.productId'],
  android: ['stop_guessing1'],
});
const itemSubs = Platform.select({ios: ['test.sub'], android: ['guess_sub_1']});
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      receipt: '',
      availableItemsMessage: '',
    };
  }
  async componentDidMount(): void {
    try {
      const result = await RNIap.initConnection();
      console.log('connection is => ', result);
      await RNIap.consumeAllItemsAndroid();
    } catch (err) {
      console.log('error in cdm => ', err);
    }
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        console.log('purchaseUpdatedListener', purchase);
        if (
          purchase.purchaseStateAndroid === 1 &&
          !purchase.isAcknowledgedAndroid
        ) {
          try {
            const ackResult = await acknowledgePurchaseAndroid(
              purchase.purchaseToken,
            );
            console.log('ackResult', ackResult);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
        }
        this.purchaseConfirmed();
        this.setState({receipt: purchase.transactionReceipt});
        purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            console.log('purchaseErrorListener', error);
            // alert('purchase error', JSON.stringify(error));
          },
        );
      },
    );
  }
  componentWillUnmount(): void {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
  }
  getItems = async (): void => {
    try {
      console.log('itemSkus[0]', itemSkus[0]);
      const products: Product[] = await RNIap.getProducts(itemSkus);
      console.log('Products[0]', products[0]);
      this.setState({productList: products});
      this.requestPurchase(itemSkus[0]);
    } catch (err) {
      console.log('getItems || purchase error => ', err);
    }
  };
  getSubscriptions = async (): void => {
    try {
      const products = await RNIap.getSubscriptions(itemSubs);
      console.log('Products => ', products);
      this.setState({productList: products});
    } catch (err) {
      console.log('getSubscriptions error => ', err);
    }
  };
  getAvailablePurchases = async (): void => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.info('Available purchases => ', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          availableItemsMessage: `Got ${purchases.length} items.`,
          receipt: purchases[0].transactionReceipt,
        });
      }
    } catch (err) {
      console.warn(err.code, err.message);
      console.log('getAvailablePurchases error => ', err);
    }
  };
  requestPurchase = async (sku): void => {
    try {
      RNIap.requestPurchase(sku);
    } catch (err) {
      console.log('requestPurchase error => ', err);
    }
  };
  requestSubscription = async (sku) => {
    try {
      await this.getItems();
      await RNIap.requestSubscription(sku);
    } catch (err) {
      alert(err.toLocaleString());
    }
  };
  purchaseConfirmed = () => {
    //you can code here for what changes you want to do in db on purchase successfull
  };
  render() {
    return (
      <SafeAreaView style={styles.rootContainer}>
        <TouchableOpacity
          onPress={() => {
            this.getItems();
          }}
          style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Test IAP</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    width: '70%',
    backgroundColor: '#000',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});