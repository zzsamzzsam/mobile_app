/* eslint-disable prettier/prettier */
import { View, Text, ActivityIndicator, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { Box } from 'native-base';
import LoadingCircle from '../../components/LoadingCircle';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import metrics from '../../themes/Metrics';

const { height, width } = Dimensions.get('window')

const SingleNews = () => {
  const route = useRoute();
  const { news } = route.params;
  const webViewRef = useRef(null)

  const [loading, setLoading] = useState(true)

  const headerIdRemove = 'site-header'
  const elementIdToRemove = 'footer';
  const footerDialog = 'fb_dialog_content';

  const REMOVE_HEADER_AND_FOOTER = `
      document.addEventListener("DOMContentLoaded", function() {
        const header = document.querySelector('#${headerIdRemove}');
        const footer = document.querySelector('${elementIdToRemove}');

        if (header) {
            header.remove();
          }
        if (footer) {
          footer.remove();
        }
      });
    `;
  const REMOVE_DIALOG = `
    const chatDialog = document.querySelector('.${footerDialog}');
    if(chatDialog){
        chatDialog.remove()
    }
    `
  const customFontCSS = `
    @font-face {
      font-family: 'CustomFont';
      src: url('./assets/fonts/YourFont-Regular.ttf') format('truetype');
      /* Add more font formats for broader browser support */
    }

    body {
      font-family: ${Fonts.bold};
    }
  `;
  const disableZoomJS = `
    var meta = document.createElement('meta');
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
    meta.setAttribute('name', 'viewport');
    document.getElementsByTagName('head')[0].appendChild(meta);
  `;

  const handleWebViewLoad = () => {
    setLoading(false)
    console.log('WebView loaded successfully.');
    webViewRef.current.injectJavaScript(disableZoomJS, REMOVE_DIALOG);
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error: ', nativeEvent);
  };
  const onMessage = (event) => {
    console.log("event", event)
  };
  // if (loading) {
  //   return <ActivityIndicator color={colors.secondary} size='large' />
  // }
  return (
    <WebView
      ref={webViewRef}
      startInLoadingState={true}
      source={{ uri: news?.news_path }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{ height, width }}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      injectedJavaScriptBeforeContentLoaded={REMOVE_HEADER_AND_FOOTER}
      onMessage={onMessage}
      onLoad={handleWebViewLoad}
      onError={handleWebViewError}
    />
  );
};

export default SingleNews;
