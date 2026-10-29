/* eslint-disable prettier/prettier */
import React, { useEffect, useRef } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/Apollo/apolloClient';
import { GET_CURRENT_APP_VERSION } from './src/Apollo/Queries';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import { AppContextProvider } from './src/Services/Auth/AppContext';
import { NativeBaseProvider, extendTheme, useColorMode } from 'native-base';
import RootNavigation from './src/navigation/RootNavigation';
import createStore from './src/Store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import appConfig from './app.json';
import { Appearance, StatusBar } from 'react-native';
import { ThemeProvider } from './src/themes/Context/ThemeContext';
import useAppTheme from './src/themes/Context';
import { NetInfoProvider } from './src/Apollo/lib/NetInfo/Context';
import { DefaultTheme, Provider } from 'react-native-paper';
import { WatchContextProvider } from './src/Services/Watch/WatchContext';
import { PlatformHealthProvider } from './src/Services/PlatformHealth/PlatformHealthContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import { ChatProvider } from './src/Services/Chat/ChatProvider';
import NetInfo from '@react-native-community/netinfo';
import * as Updates from 'expo-updates';

Sentry.init({
  dsn: "https://d0a103e93b52d5aa872274079099a2b4@o4506701917782016.ingest.sentry.io/4506781005643776",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0C5356',
    secondary: 'yellow',
  },
};

const Main = () => {
  const store = createStore();
  const WaitForStateRehydration = ({ children }) => {
    const isRehydrated = useStoreRehydrated();
    // console.log('is hydrated ======', isRehydrated);
    return isRehydrated ? children : null;
  };

  // lock app to portrait
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);
  return (
    <NetInfoProvider>
      <ApolloProvider client={client}>
        <StoreProvider store={store}>
          <WaitForStateRehydration>
            <WatchContextProvider>
              <PlatformHealthProvider>
                <ThemeProvider>
                  <ThemeConsumer />
                </ThemeProvider>
              </PlatformHealthProvider>
            </WatchContextProvider>
          </WaitForStateRehydration>
          <FlashMessage position="top" />
        </StoreProvider>
      </ApolloProvider>
    </NetInfoProvider>
  );
};
const ThemeConsumer = () => {
  // const { theme } = useAppTheme();
  const theme = extendTheme({})
  const updatesState = Updates.useUpdates();
  const promptedUpdateId = useRef(null);
  useEffect(() => {
    if (!Updates.isEnabled || !updatesState.isUpdatePending) {
      return;
    }

    const updateId = updatesState.downloadedUpdate?.updateId || 'pending';
    if (promptedUpdateId.current === updateId) {
      return;
    }
    promptedUpdateId.current = updateId;

    Alert.alert(
      'Update ready',
      'We made some improvements. It only takes a moment to apply.',
      [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Let\'s go!',
          onPress: () => {
            Updates.reloadAsync().catch(error => {
              console.error('Unable to restart with the downloaded update:', error);
              Sentry.captureException(error);
              Alert.alert(
                'Unable to restart',
                'The update is downloaded. Close and reopen the app to apply it.',
              );
            });
          },
        },
      ],
    );
  }, [updatesState.isUpdatePending, updatesState.downloadedUpdate?.updateId]);

  const checkForUpdate = async () => {
    try {
      const net = await NetInfo.fetch();
      if (!net.isConnected) {
        return;
      }

      const { data } = await client.query({
        query: GET_CURRENT_APP_VERSION,
        fetchPolicy: 'network-only',
      });
      const serverRuntimeVersion = data?.getCurrentAppVersion?.version;
      const localRuntimeVersion = appConfig.runtimeVersion;

      if (typeof serverRuntimeVersion !== 'string' || !serverRuntimeVersion.trim()) {
        throw new Error('GetCurrentAppVersion returned an empty or invalid runtime version.');
      }

      if (!localRuntimeVersion) {
        throw new Error('The app runtimeVersion is missing from app.json.');
      }

      if (serverRuntimeVersion.trim() !== localRuntimeVersion.trim()) {
        const storeUrl = Platform.OS === 'ios'
          ? 'https://apps.apple.com/ca/app/tpasc/id6451323229'
          : 'https://play.google.com/store/apps/details?id=com.tpasc';
        Alert.alert(
          'Update available',
          `This app version (${localRuntimeVersion}) is out of sync. The current version is ${serverRuntimeVersion}. Update the app for the latest version.`,
          [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(storeUrl).catch(error => {
                  console.error('Unable to open the app store:', error);
                  Sentry.captureException(error);
                });
              },
            },
          ],
        );
      }
      else {
        console.log('App runtime version is up to date.');
      }
    } catch (error) {
      console.error('Error checking the app runtime version:', error);
      Sentry.captureException(error);
    }
  };
  useEffect(() => {
    const t = setTimeout(() => {
      checkForUpdate();
    }, 2000);
    return () => clearTimeout(t);
  }, [])
  return (
    <SafeAreaProvider>
      <NativeBaseProvider theme={theme}>
        {/* <StatusBar backgroundColor={'white'} barStyle='dark-content' /> */}
        <Provider theme={paperTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              {/* <SafeAreaView style={{ flex: 1 }}> */}
              {/* <WatchContextProvider> */}
              {/* <PlatformHealthProvider> */}
              <AppContextProvider>
                <ChatProvider>
                <RootNavigation />
                </ChatProvider>
              </AppContextProvider>
              {/* </PlatformHealthProvider> */}
              {/* </WatchContextProvider> */}
              {/* </SafeAreaView> */}
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </Provider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};
// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

export default Sentry.wrap(Main);
//export default Sentry.wrap(codePush(Main));
