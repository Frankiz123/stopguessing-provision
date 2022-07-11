1.

- npm instll or yarn
- Go to node_modules/react-native-material-textfield/src/components
- check (affix/index.js, helper/index.js, label/index.js)
- Add import { Animated, Text } from 'react-native' in three files.
- You should comment style: Animated.Text.propTypes.style (//style: Animated.Text.propTypes.style)

2.  node_modules > react-native > Libraries > Images > RCTUIImageViewAnimated.m search for if (\_currentFrame)

add the following else block to the if block as below

if (\_currentFrame) {
layer.contentsScale = self.animatedImageScale;
layer.contents = (\_\_bridge id)\_currentFrame.CGImage;
} else {
[super displayLayer:layer];
}

3. Go to node_modules/native-base/dist/src/basic/Tabs/index.js
   Find "this.requestAnimationFrame" and replace it to this.requestAnimationFrame&&

4. "tipsi-stripe": "git+https://github.com/charlesTR/tipsi-stripe#cbr/allow-zero-amount"

5. android version tipsi-stripe issue

- yarn add jetifier
- npx jetifier

add following codes to react-native.config.js file
dependencies: {
'tipsi-stripe':
{
platforms: { android: null, ios: null, }
}
},
assets: ['./src/assets/fonts']

6. Following events added:

- setUserId
- setUserProperties
- logScreenView
- AddToCartEventParameters
- AddToWishlistEventParameters
- BeginCheckoutEventParameters

Ecommerce events have hardcoded data, and placed in root app.js.
you can find it and use wherever you want.
