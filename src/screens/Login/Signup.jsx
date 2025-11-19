/* eslint-disable prettier/prettier */
import {View, Text, ActivityIndicator, Dimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {Box} from 'native-base';
import LoadingCircle from '../../components/LoadingCircle';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import metrics from '../../themes/Metrics';
import ViewX from '../../components/common/ViewX';
import {Button} from 'react-native-paper';
import ButtonX from '../../components/common/BottonX';
import AppText from '../../components/common/Text';
import Routes from '../../navigation/Routes';

const {height, width} = Dimensions.get('window');

const Signup = ({navigation}) => {
  const route = useRoute();
  const webViewRef = useRef(null);
  const [showRegistered, setShowRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleWebViewLoad = () => {
    setLoading(false);
    console.log('WebView loaded successfully.');
    // webViewRef.current.injectJavaScript(disableZoomJS, REMOVE_DIALOG);
  };
  const injectedCSS = `
    body {
      background-color: #f0f0f0; /* Example CSS */
    }
    .btn-link {
      width: 100%;
    }
    /* Add your additional CSS styles here */
  `;
  // console.log('show register', showRegistered)
  // useEffect(() => {
  //   setShowRegistered(false);
  // }, [])
  const handleWebViewError = syntheticEvent => {
    const {nativeEvent} = syntheticEvent;
    console.error('WebView error: ', nativeEvent);
  };
  const onMessage = event => {
    console.log('event', event);
  };
  // if (loading) {
  //   return <ActivityIndicator color={colors.secondary} size='large' />
  // }
  handleNavigationStateChange = navState => {
    // navState contains information about the current navigation state
    console.log('nav stat====', navState);

    if (
      navState.url === 'https://tpasc.ezfacility.com/Sessions' ||
      navState.url === 'https://tpasc.ezfacility.com/sessions'
    ) {
      setShowRegistered(true);
    }
  };
  const injectedJavaScript = `
    window.onload = function() {
      // alert('sdfsdf');
      var elements = document.getElementsByClassName('btn');
      var headdd = document.getElementById('headerSSLogo');
      headdd.style.display = "none";
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.width = '100%';
        // You can add more styles here if needed
      }
    };
  `;
  const handleOkPress = () => {
    navigation.replace(Routes.LOGIN)
  }
  return (
    <>
      {showRegistered ? (
        <ViewX
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <AppText bold style={{textAlign: 'center'}}>
            Thank you for registering!
          </AppText>
          <AppText style={{textAlign: 'center'}}>
            Please complete your registration process by clicking on the link
            sent to your email. {'\n'}
          </AppText>
          <AppText style={{textAlign: 'center'}}>
            After completing the registration, you can log in to the app. {'\n'}
          </AppText>

          <ButtonX title="Log In" onPress={handleOkPress} />
        </ViewX>
      ) : (
        <WebView
          ref={webViewRef}
          startInLoadingState={true}
          source={{uri: 'https://tpasc.ezfacility.com/register'}}
          showsVerticalScrollIndicator={false}
          onNavigationStateChange={handleNavigationStateChange}
          showsHorizontalScrollIndicator={false}
          style={{height, width}}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          injectedJavaScript={injectedJavaScript}
          // injectedJavaScript={`
          //   const styleElement = document.createElement('style');
          //   styleElement.innerHTML = '${injectedCSS}';
          //   document.head.appendChild(styleElement);
          // `}
          // injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
          onMessage={onMessage}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
        />
      )}
    </>
  );
};

export default Signup;
