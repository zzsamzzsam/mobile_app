/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useStoreState } from 'easy-peasy';
import { Box } from 'native-base';
import { StyleSheet } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import { useIsFocused, useRoute } from '@react-navigation/native';
import ViewX from '../../components/common/ViewX';
import { ActivityIndicator } from 'react-native-paper';
import colors from '../../themes/Colors';


const FriendlierScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const [loadingCode, setLoadingCode] = useState(true);
  const { vidId } = route?.params || {};
  const webViewRef = useRef(null);
  
   const {actualUser} = useStoreState(
     state => ({
       actualUser: state.login.actualUser,
     }),
   );
  if(!actualUser) {
    return null;
  }


  const injectScript = `
     function myInjectedFunction() {
  document.addEventListener("DOMContentLoaded", function () {
    const interval = setInterval(function () {
      window.ReactNativeWebView.postMessage("Interval running");
       var input = document.querySelector('input[placeholder="Enter your email"]');
      if (input) {
        clearInterval(interval);
        window.ReactNativeWebView.postMessage("Input found===");
        window.ReactNativeWebView.postMessage("CODE_READY");
        var emailAddress = '${actualUser?.email?.[0]}';
         emailAddress.split('').forEach(function(char) {
          // window.ReactNativeWebView.postMessage("Firing event" + char);
        var event = new KeyboardEvent('input', {
          bubbles: true,
          cancelable: true,
          key: char,
          keyCode: char.charCodeAt(0),
          charCode: char.charCodeAt(0)
        });
        input.dispatchEvent(event);
        input.value = '${actualUser?.email?.[0]}'; // Update the value directly
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      } else {
        window.ReactNativeWebView.postMessage("Input not===");
      }
    }, 2000);
  });
  try {
    // Call this function to indicate that it has been called
    // window.ReactNativeWebView.postMessage('injectedFunctionCalled');
  } catch (e) {
    window.ReactNativeWebView.postMessage("Error====" + e.toString());
  }
}
// Call the function immediately when the script is injected
myInjectedFunction();

  `;

  // useEffect(() => {
  //   const reloadWebView = async () => {
  //     if (webViewRef.current && isFocused) {
  //       await CookieManager?.clearAll(true);
  //       webViewRef.current?.clearCache && webViewRef.current?.clearCache(true);
  //       webViewRef.current?.injectJavaScript(REMOVE_LOCALSTORAGE);
  //       // webViewRef.current.reload();
  //     }
  //   };
  //   reloadWebView();
  // }, [userToken, isFocused, REMOVE_LOCALSTORAGE]);

    const handleMessage = event => {
      // Check if the message indicates that the injected function has been called
      const payload = event.nativeEvent.data;
      console.log('Received payload:', payload);
      if (event.nativeEvent.data === 'CODE_READY') {
        setLoadingCode(false);
      }
      // if (event.nativeEvent.data === 'injectedFunctionCalled') {
      //   console.log('Injected function called!');
      //   // You can perform additional actions here
      // }
    };
  const webUrl = 'https://app.friendlier.ca/return';

  return (
    <ViewX style={styles.container}>
      <WebView
        ref={webViewRef}
        startInLoadingState={true}
        source={{
          uri: webUrl,
          // method: 'GET',
          // headers: {Authorization: `Bearer ${userToken}`},
        }}
        // showsVerticalScrollIndicator={false}
        // showsHorizontalScrollIndicator={false}
        style={{flex: 1}}
        // originWhitelist={['*']}
        javaScriptEnabled={true}
        // allowsFullscreenVideo={true}
        // domStorageEnabled={true}
        // scalesPageToFit={false}
        injectedJavaScriptBeforeContentLoaded={injectScript}
        onMessage={handleMessage}
        // injectedJavaScript="document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');"
        // injectedJavaScriptBeforeContentLoaded={INJECTED_JS}
        // onLoad={handleWebViewLoad}
        // onError={handleWebViewError}
      />
      {loadingCode && (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={colors.secondary}
        />
      )}
    </ViewX>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: 'absolute',
        marginHorizontal: 'auto',
        marginVertical: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
});
export default FriendlierScreen;