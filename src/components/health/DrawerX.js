import React, {useState} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {Drawer} from 'react-native-drawer-layout';
import {Drawer as PaperDrawer} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { useWatchContext } from '../../Services/Watch/WatchContext';
import colors from '../../themes/Colors';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { usePlatformHealthContext } from '../../Services/PlatformHealth/PlatformHealthContext';
import { HEALTH_SOURCES } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
export default function DrawerX({children, drawerOpen, setDrawerOpen, isConnectionModalOpen, setIsConnectionModalOpen}) {
  const {
    isWatchConnected,
    checkIfDeviceExists,
    checkAndReConnect,
    startScan,
    isScanning,
    takePhoto,
    stopScan,
    measureAllData,
    findWatch,
    removeDevice,
    reconnectLastDevice,
    turnonRealTimeStepNotification,
    setShowEventLog,
    showEventLogs,
    getDayData
  } = useWatchContext();
  const {platformHealthTurnedOn, activeSource} = useStoreState(state => state.health);
  const {setPlatformHealthTurnedOn} = useStoreActions(action => action.health);
  const {initialize, isPlatformHealthReady, getDatas} = usePlatformHealthContext();
  const navigation = useNavigation();
  return (
    <Drawer
      open={drawerOpen}
      drawerStyle={{
        width: 100,
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
      drawerType="front"
      drawerPosition={'left'}
      onOpen={() => {
        setDrawerOpen(true);
      }}
      onClose={() => setDrawerOpen(false)}
      renderDrawerContent={() => {
        return (
          <PaperDrawer.Section title="">
            {!isScanning && (
              <TouchableOpacity
                onPress={() => {
                  setDrawerOpen(false);
                  setIsConnectionModalOpen(true)
                }}>
                <View style={styles.sideMenuSingle}>
                  <MaterialCommunityIcons
                    size={30}
                    name="magnify-scan"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>{(isWatchConnected || platformHealthTurnedOn) ? "Disconnect" : "Connect"}</Text>
                </View>
              </TouchableOpacity>
            )}
            {platformHealthTurnedOn && activeSource === HEALTH_SOURCES.PLATFORM && (
              <TouchableOpacity
                onPress={() => {
                  getDatas();
                }}>
                <View style={styles.sideMenuSingle}>
                  <MaterialCommunityIcons
                    size={30}
                    name="cellphone"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>{Platform.OS === 'ios' ? 'Apple' : 'Health'} Sync</Text>
                </View>
              </TouchableOpacity>
            )}
            {isScanning && (
              <TouchableOpacity
                onPress={() => {
                  setDrawerOpen(false);
                  stopScan();
                }}>
                <View style={styles.sideMenuSingle}>
                  <MaterialCommunityIcons
                    size={30}
                    name="magnify-scan"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>Stop Scan</Text>
                </View>
              </TouchableOpacity>
            )}
            {isWatchConnected && (
              <TouchableOpacity
                onPress={() => {
                  
                }}>
                <View style={styles.sideMenuSingle}>
                  <MaterialCommunityIcons
                    size={30}
                    name="watch-vibrate"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>Remove Watch</Text>
                </View>
              </TouchableOpacity>
            )}
            {isWatchConnected && (
              <TouchableOpacity onPress={() => findWatch()}>
                <View style={styles.sideMenuSingle}>
                  <MaterialIcons
                    size={30}
                    name="find-replace"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>Find</Text>
                </View>
              </TouchableOpacity>
            )}
            {isWatchConnected && (
              <TouchableOpacity onPress={() => takePhoto()}>
                <View style={styles.sideMenuSingle}>
                  <MaterialIcons
                    size={30}
                    name="camera"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>Take Photo</Text>
                </View>
              </TouchableOpacity>
            )}
            {/* {isWatchConnected && (
              <TouchableOpacity onPress={() => setShowWatchSettings(true)}>
                <View style={styles.sideMenuSingle}>
                  <MaterialIcons
                    size={30}
                    name="camera"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>Settings</Text>
                </View>
              </TouchableOpacity>
            )} */}
            {isWatchConnected && (
              <TouchableOpacity onPress={() => measureAllData()}>
                <View style={styles.sideMenuSingle}>
                  <MaterialCommunityIcons
                    size={30}
                    name="table-heart"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>Measure</Text>
                </View>
              </TouchableOpacity>
            )}
            {/* {isWatchConnected && (
              <TouchableOpacity onPress={() => turnonRealTimeStepNotification()}>
                <View style={styles.sideMenuSingle}>
                  <MaterialCommunityIcons
                    size={30}
                    name="table-heart"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>RealTimeSteps</Text>
                </View>
              </TouchableOpacity>
            )} */}
            {isWatchConnected && activeSource === HEALTH_SOURCES.WATCH && (
              <TouchableOpacity onPress={() => getDayData()}>
                <View style={styles.sideMenuSingle}>
                  <MaterialCommunityIcons
                    size={30}
                    name="sync"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>Sync</Text>
                </View>
              </TouchableOpacity>
            )}
            {/* {isWatchConnected && activeSource === HEALTH_SOURCES.WATCH && (
              <TouchableOpacity onPress={() => {
                setDrawerOpen(false);
                navigation.navigate(Routes.WATCH_SETUP);
              }}>
                <View style={styles.sideMenuSingle}>
                  <MaterialCommunityIcons
                    size={30}
                    name="bluetooth-settings"
                    color={colors.secondary}
                  />
                  <Text style={styles.singleMenuText}>Settings</Text>
                </View>
              </TouchableOpacity>
            )} */}
          </PaperDrawer.Section>
        );
      }}>
      {children}
    </Drawer>
  );
}
const styles = StyleSheet.create({
  singleMenuText: {
    fontSize: 10,
    paddingTop: 5,
  },
  sideMenuSingle: {
    // backgroundColor: '#fff',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    marginBottom: 10,
  },
});
