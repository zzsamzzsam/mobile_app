/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { useStoreState } from 'easy-peasy';
import { Box } from 'native-base';
import CookieManager from '@react-native-cookies/cookies';
import { useIsFocused, useRoute } from '@react-navigation/native';


const VideoScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const { vidId } = route?.params || {};
  const webViewRef = useRef(null);
  const { userToken } = useStoreState(state => ({
    userToken: state.login.userToken,
  }));

  const REMOVE_LOCALSTORAGE = `
  window.localStorage.clear();
  `;

  useEffect(() => {
    const reloadWebView = async () => {
      if (webViewRef.current && isFocused) {
        await CookieManager?.clearAll(true);
        webViewRef.current?.clearCache && webViewRef.current?.clearCache(true);
        webViewRef.current?.injectJavaScript(REMOVE_LOCALSTORAGE);
        // webViewRef.current.reload();
      }
    };
    reloadWebView();
  }, [userToken, isFocused, REMOVE_LOCALSTORAGE]);


  const localUrl = 'http://192.168.1.70:3000/';
  const webUrl = 'https://video.tpasc.ca/';

  const webUri = useMemo(() => {
    if (isFocused && route?.params && vidId) {
      return `${webUrl}applogin?redirect=video?vid=${vidId}&token=${userToken}`;
    } else {
      return `${webUrl}applogin?token=${userToken}`;
    }
  }, [vidId, route?.params, userToken, isFocused]);

  return (
    <Box style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        startInLoadingState={true}
        source={{
          uri: webUri,
          method: 'GET',
          headers: { Authorization: `Bearer ${userToken}` },
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ height: '100%', width: '100%' }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        allowsFullscreenVideo={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        injectedJavaScript="document.querySelector('meta[name=viewport]').setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');"
      // injectedJavaScriptBeforeContentLoaded={INJECTED_JS}
      // onLoad={handleWebViewLoad}
      // onError={handleWebViewError}
      />
    </Box>
  );
}

export default VideoScreen;