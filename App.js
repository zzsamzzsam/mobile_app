/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, ActivityIndicator } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { ApolloProvider } from '@apollo/client';
import { client } from './src/Apollo/apolloClient';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import { AppContextProvider } from './src/Services/Auth/AppContext';
import { NativeBaseProvider, extendTheme, useColorMode } from 'native-base';
import RootNavigation from './src/navigation/RootNavigation';
import createStore from './src/Store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import colors from './src/themes/Colors';
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
import codePush from "react-native-code-push";
import ButtonX from './src/components/common/BottonX';
import { ChatProvider } from './src/Services/Chat/ChatProvider';

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
      </ApolloProvider >
    </NetInfoProvider>
  );
};
const ThemeConsumer = () => {
  // const { theme } = useAppTheme();
  const theme = extendTheme({})
  const checkForUpdate = async () => {
    setIsCheckingForUpdate(true);
    try {
      const update = await codePush.checkForUpdate();
      if (!update) {
        console.log("App is up to date");
      } else {
        setIsUpdateAvailable(true);
        handleUpdate();
      }
    } catch (error) {
      console.error('Error checking for update:', error);
    }
    setIsCheckingForUpdate(false)
  };
  useEffect(() => {
    checkForUpdate();
  }, [])
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const handleUpdate = async () => {
    try {
      await codePush.sync({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE });
    } catch (error) {
      console.error('Error updating:', error);
    }
    setIsUpdateAvailable(false);
    setIsCheckingForUpdate(false);
  };
  const closeUpdateModal = () => {
    setIsUpdateAvailable(false);
    setIsCheckingForUpdate(false);
  }
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={isUpdateAvailable || isCheckingForUpdate}
            style={{ height: 100 }}
            onRequestClose={closeUpdateModal}
            onDismiss={closeUpdateModal}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isCheckingForUpdate ? 'transparent' : 'rgba(0, 0, 0, 0.5)' }}>
              {isCheckingForUpdate ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <View style={{ padding: 20, backgroundColor: colors.secondary, borderRadius: 10 }}>
                  <Text style={{ fontSize: 18, marginBottom: 10, color: colors.primary }}>Update Available</Text>
                  <Text style={{ marginBottom: 20, color: colors.primary }}>A new version of the app is available and downloading in background.</Text>
                  {/* <Button title="Update" onPress={handleUpdate} /> */}
                  <ActivityIndicator size="large" color="#fff" />
                  <ButtonX onPress={closeUpdateModal} title={"close"} style={{ marginTop: 10 }} />
                </View>
              )}
            </View>
          </Modal>
        </Provider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
};
// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

export default Sentry.wrap(codePush(Main));
