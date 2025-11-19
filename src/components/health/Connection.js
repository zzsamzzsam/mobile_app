import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  AnimatedFAB,
  Button,
  Divider,
  IconButton,
  SegmentedButtons,
  Snackbar,
  Switch,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import {Platform, StyleSheet} from 'react-native';
import AnimatedView from '../common/AnimatedView';
import PadWrapper from '../common/PadWrapper';
import {useWatchContext} from '../../Services/Watch/WatchContext';
import colors from '../../themes/Colors';
import ViewX from '../common/ViewX';
import Text from '../common/Text';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {usePlatformHealthContext} from '../../Services/PlatformHealth/PlatformHealthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {globalStyles, HEALTH_SOURCES} from '../../utils/constants';
import Fonts from '../../themes/Fonts';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import Devices from './Devices';
import SurfaceBox from '../common/SurfaceBox';
import ConnectionTimeline from './ConnectionTimeline';
import IOSHelpModal from './IOSHelpModal';

const Connection = ({isOpen, onDismiss}) => {
  const {
    isWatchConnected,
    isScanning,
    isLoading,
    startScan,
    stopScan,
    removeDevice,
    setIsWatchConnected,
    connectionLogs,
    setConnectionLogs,
    getDayData,
    setEventLogs,
  } = useWatchContext();
  const [helpModalType, setHelpModalType] = useState(null);
  const {initialize, isPlatformHealthReady, getDatas} = usePlatformHealthContext();
  const [index, setIndex] = useState(0);
  const {
    setPlatformHealthTurnedOn,
    setActiveSource,
    setSyncedData,
    clearLogs,
    syncToServer,
  } = useStoreActions(action => action.health);
  const {platformHealthTurnedOn, activeSource} = useStoreState(
    state => state.health,
  );
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  useEffect(() => {
    if (isOpen) {
      setIndex(activeSource ? 1 : 0);
      // setIndex(0);
      bottomSheetRef.current?.present();
    } else {
      setIndex(0);
      bottomSheetRef.current?.dismiss();
    }
  }, [isOpen]);
  const syncData = useCallback(async () => {
    console.log('sync started');
    let needsSync = false;
    if (activeSource === HEALTH_SOURCES.WATCH && isWatchConnected) {
      getDayData();
      needsSync = true;
    } else if (
      activeSource === HEALTH_SOURCES.PLATFORM &&
      platformHealthTurnedOn
    ) {
      await getDatas();
      needsSync = true;
    }
    if (needsSync) {
      setTimeout(() => {
        console.log('syncing after 3 seconds');
        syncToServer();
      }, 4000);
    }
  }, [activeSource, syncToServer, isWatchConnected, platformHealthTurnedOn]);
  const onSourceChange = useCallback(
    _activeSource => {
      if (!_activeSource) {
        bottomSheetRef?.current?.snapToIndex(0);
        setActiveSource(null);
      } else {
        bottomSheetRef?.current?.snapToIndex(1);
        setActiveSource(_activeSource);
      }
      setSyncedData(null);
      setEventLogs([]);
      clearLogs([]);
    },
    [activeSource],
  );
  const handleDisconnect = () => {
    setHelpModalType(null);
    removeDevice();
    setIsWatchConnected(false);
    setActiveSource(null);
    setConnectionLogs([]);
  }
  const handleOnCallingClose = () => {
    setHelpModalType(null);
    setIndex(2);
    startScan();
  }
  useEffect(() => {
    syncData();

    const intervalId = setInterval(() => {
      syncData();
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={false}
        pressBehavior="close"
        disappearsOnIndex={-1}
        // appearsOnIndex={2}
        // opacity={1}
        // disappearsOnIndex={1}
      />
    ),
    [],
  );
  const watchLabel = useMemo(() => {
    return isScanning
      ? 'Scanning'
      : isWatchConnected
      ? 'Connected'
      : 'Disconnected';
  }, [isScanning, isWatchConnected]);
  return (
    <ViewX style={styles.container}>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={index}
        onDismiss={onDismiss}
        style={{padding: 0}}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        // onChange={handleSheetChanges}
      >
        <ViewX style={styles.headerWrap}>
          <Text style={[globalStyles.boldText, styles.headerText]}>
            Connection
          </Text>
          <Text style={styles.headerSubText}>
            Choose your active health data source
          </Text>
          {/* <MaterialCommunityIcons name="close-circle" size={25} color={colors.gray} /> */}
        </ViewX>
        <BottomSheetScrollView style={styles.sheetContainer}>
          {/* <ViewX>
                    <ViewX flexRow justifyContent={"space-between"} style={styles.watchSwitchWrap}>
                        <Text style={globalStyles.boldText}>{Platform.OS === 'android' ? 'Google' : 'Apple'} Health</Text>
                        <Switch color={colors.primary} value={activeSource === HEALTH_SOURCES.PLATFORM} onValueChange={(x) => {
                            onToggleSwitch(HEALTH_SOURCES.PLATFORM, x)
                        }} />
                    </ViewX>
                    <Divider />
                    <ViewX flexRow justifyContent={"space-between"} style={styles.watchSwitchWrap}>
                        <Text style={globalStyles.boldText}>TPASC Watch</Text>
                        <Switch color={colors.primary} value={activeSource === HEALTH_SOURCES.WATCH} onValueChange={(x) => {
                            onToggleSwitch(HEALTH_SOURCES.WATCH, x)
                        }} />
                    </ViewX>
                    <Divider />
                </ViewX> */}
          <SegmentedButtons
            style={styles.segmented}
            value={activeSource}
            theme={{
              colors: {
                primary: 'green',
                secondaryContainer: colors.primary,
                onSecondaryContainer: colors.white,
              },
            }}
            onValueChange={onSourceChange}
            buttons={[
              ...(Platform.OS === 'ios' ? [{
                value: HEALTH_SOURCES.PLATFORM,
                icon: 'cellphone',
                labelStyle: {fontSize: 14},
                label: `${
                  Platform.OS === 'android' ? 'Google' : 'Apple'
                } Health`,
              }] : []),
              {
                value: null,
                label: 'None',
                style: {flex: Platform.OS === 'android' ? 1 : 0},
                labelStyle: {fontSize: 14},
              },
              {
                value: HEALTH_SOURCES.WATCH,
                label: 'TPASC Watch',
                labelStyle: {fontSize: 14},
                icon: 'watch-variant',
              },
            ]}
          />
          {activeSource && (
            <SurfaceBox>
              <ViewX style={styles.watchStatusCont}>
                {activeSource === HEALTH_SOURCES.WATCH && (
                  <AnimatedView
                    horizontal
                    delayLevel={0}
                    style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons
                      name="watch-variant"
                      color={colors.secondary}
                      size={25}
                    />
                    <ViewX
                      justifyContent={'space-between'}
                      flexRow
                      style={{flex: 1}}>
                      <Text bold>Status</Text>
                      <Text bold>{watchLabel}</Text>
                    </ViewX>
                  </AnimatedView>
                )}

                {activeSource === HEALTH_SOURCES.PLATFORM && (
                  <AnimatedView
                    horizontal
                    delayLevel={0}
                    style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons
                      name="cellphone"
                      color={colors.secondary}
                      size={25}
                    />
                    <ViewX
                      justifyContent={'space-between'}
                      flexRow
                      style={{flex: 1}}>
                      <Text bold>Status</Text>
                      {platformHealthTurnedOn && (
                        <Text bold>
                          {!isPlatformHealthReady
                            ? 'Connected (not ready)'
                            : 'Connected (Ready)'}
                        </Text>
                      )}
                      {!platformHealthTurnedOn && <Text bold>Not Setup</Text>}
                      {/* <Button icon="sync" mode="contained" onPress={getDatas}>Sync</Button> */}
                    </ViewX>
                  </AnimatedView>
                )}
              </ViewX>
            </SurfaceBox>
          )}
          {activeSource && (
            <ViewX flexRow style={styles.actionsWrap}>
              {isWatchConnected && activeSource === HEALTH_SOURCES.WATCH && (
                <Button
                  buttonColor={colors.secondary}
                  style={{flex: 1, marginHorizontal: 5}}
                  icon="sync"
                  mode="contained"
                  onPress={() => {Platform.OS === 'ios' ? setHelpModalType("disconnect") : handleDisconnect()}}>
                  Disconnect
                </Button>
              )}
              {((activeSource === HEALTH_SOURCES.WATCH && isWatchConnected) || (activeSource === HEALTH_SOURCES.PLATFORM && platformHealthTurnedOn)) && (
                <Button
                  buttonColor={colors.secondary}
                  style={{flex: 1, marginHorizontal: 5}}
                  icon="sync"
                  mode="contained"
                  onPress={() => {
                    syncData();
                  }}>
                  Sync
                </Button>
              )}
               {activeSource === HEALTH_SOURCES.PLATFORM && (
                <Button
                  buttonColor={colors.secondary}
                  style={{flex: 1, marginHorizontal: 5}}
                  icon="sync"
                  mode="contained"
                  onPress={() => {
                    if (!platformHealthTurnedOn) {
                        initialize();
                    }
                    setPlatformHealthTurnedOn(!platformHealthTurnedOn);
                  }}>
                  Turn {platformHealthTurnedOn ? 'Off' : 'On'}
                </Button>
              )}
              {activeSource === HEALTH_SOURCES.WATCH && !isWatchConnected && (
                <Button
                  buttonColor={colors.secondary}
                  style={{flex: 1, marginHorizontal: 5}}
                  icon="sync"
                  mode="contained"
                  onPress={() => {
                    console.log('scanning===', isScanning);
                    if (isScanning) {
                      setIndex(1);
                      stopScan();
                    } else {
                      setHelpModalType("calling");
                    }
                  }}>
                  {isScanning ? 'Stop ' : ''}Scan
                </Button>
              )}
            </ViewX>
          )}
          <ConnectionTimeline data={connectionLogs} />
          {isScanning && <Devices />}
        </BottomSheetScrollView>
      </BottomSheetModal>
      {!!helpModalType && <IOSHelpModal type={helpModalType} onClose={handleOnCallingClose} onConfirm={helpModalType === "disconnect" && handleDisconnect}/>}
    </ViewX>
  );
};

export default Connection;
const styles = StyleSheet.create({
  sheetContainer: {
    padding: 10,
  },
  actionsWrap: {
    paddingVertical: 10,
  },
  headerWrap: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    // backgroundColor: 'red',
    // flexDirection: 'row'
  },
  headerText: {
    fontSize: 18,
  },
  segmented: {
    marginBottom: 10,
  },
  headerSubText: {
    // color: colors.gray,
    fontFamily: Fonts.medium,
  },
  watchSwitchWrap: {
    paddingVertical: 5,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    // padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  watchStatusCont: {
    paddingVertical: 10,
  },
});
