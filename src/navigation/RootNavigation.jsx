/* eslint-disable prettier/prettier */
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useCallback, useEffect, useState } from 'react'
import Routes from './Routes';
import LoginStack from './LoginStack';
import MainStack from './MainStack';
import SplashScreen from '../components/common/SplashScreen';
import NavigationService, { isMountedRef, navigationRef } from '.';
import useAuth from '../Services/Auth';
import BoardedStack from './BoardedStack';
import { APP_STATE } from '../Store/Models/App';
import OneSignalInitilize from '../utils/OnesignalInitialize';
import { CustomerIO } from 'customerio-reactnative';
import BiometricSetUpScreen from '../screens/OnBoarding/BiometricSetUpScreen';
import AppText from '../components/common/Text';

const Stack = createStackNavigator();

const RootNavigation = () => {
  const { state } = useAuth();
  const { actualUser, isBiometricAsked, biometricAuth } = useStoreState((st) => ({
    actualUser: st.login.actualUser,
    isBiometricAsked: st.login.isBiometricAsked,
    biometricAuth: st.login.biometricAuth,
  }));
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  }, []);

  useEffect(() => {
    const userId = actualUser?._id || '';
    OneSignalInitilize(userId);
  }, [actualUser?._id]);

  const onAnimationFinished = useCallback(() => {
    setSplashFinished(true);
  }, []);

  useEffect(() => {
    if (!isBiometricAsked && state !== APP_STATE.LOGIN && splashFinished) {
      NavigationService.navigate(Routes.BIOMETRICSETUPSCREEN);
    }
  }, [isBiometricAsked, state, splashFinished, actualUser, biometricAuth]);
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isMountedRef.current = navigationRef.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = isMountedRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          CustomerIO.screen(currentRouteName);
        }
        isMountedRef.current = currentRouteName;
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* {!splashFinished && (
          <Stack.Screen name="ramramram">
            {() => <SplashScreen onAnimationFinish={onAnimationFinished} />}
          </Stack.Screen>
        )}
        {splashFinished && (!userToken && !data?.meAppUser) ? (
          <Stack.Screen name={Routes.LOGINSTACK} component={LoginStack} />
        ) : (
          <Stack.Screen name={Routes.MAINSTACK} component={MainStack} />
        )} */}
        {(!splashFinished || state === APP_STATE.UNKNOWN) && (
          <Stack.Screen name="ramramram">
            {() => <SplashScreen onAnimationFinish={onAnimationFinished} />}
          </Stack.Screen>
        )}
        {splashFinished && state === APP_STATE.HOME ? (
          <Stack.Screen name={Routes.MAINSTACK} component={MainStack} />
        ) : state === APP_STATE.UNBOARDING ? (
          <Stack.Screen name={Routes.BOARDED} component={BoardedStack} />
        ) : (
          <Stack.Screen name={Routes.LOGINSTACK} component={LoginStack} />
        )}
        <Stack.Screen
          name={Routes.BIOMETRICSETUPSCREEN}
          component={BiometricSetUpScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation