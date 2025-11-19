import React, { useEffect, useState } from 'react';
import { AnimatedFAB, Button, Snackbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import { Platform, StyleSheet } from 'react-native';
import AnimatedView from '../common/AnimatedView';
import PadWrapper from '../common/PadWrapper';
import { useWatchContext } from '../../Services/Watch/WatchContext';
import colors from '../../themes/Colors';
import ViewX from '../common/ViewX';
import Text from '../common/Text';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { usePlatformHealthContext } from '../../Services/PlatformHealth/PlatformHealthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HEALTH_SOURCES } from '../../utils/constants';
import Fonts from '../../themes/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Connection from './Connection';


const WatchStatus = ({ setDrawerOpen, drawerOpen, isConnectionModalOpen, setIsConnectionModalOpen }) => {
  const { isWatchConnected, isScanning, isLoading } = useWatchContext();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isExtended, setIsExtended] = useState(true);
  const { setPlatformHealthTurnedOn, setActiveSource } = useStoreActions(action => action.health);
  const { platformHealthTurnedOn, activeSource } = useStoreState(state => state.health);
  const { initialize, isPlatformHealthReady, getDatas } = usePlatformHealthContext();

  const handleExtension = () => {
    setIsExtended(true);
    setTimeout(() => {
      setIsExtended(false);
    }, 3000);
  };
  useEffect(() => {
    setIsExtended(true);
    setTimeout(() => {
      if (!isScanning) {
        setIsExtended(false);
      }
    }, 3000);
  }, []);
  useEffect(() => {
    if (!isFirstLoad) {
      setIsExtended(isScanning);
    }
    setIsFirstLoad(false);
  }, [isScanning]);
  const watchLabel = isScanning
    ? 'Scanning'
    : isWatchConnected
      ? 'Connected'
      : 'Disconnected';
  return (
    <>
      {/* <PadWrapper> */}
      <ViewX
      // flexRow
      // alignItems="center"
      // justifyContent="space-between"
      >

        <TouchableOpacity onPress={() => { setIsConnectionModalOpen(true) }}>
          {!activeSource && <ViewX flexRow style={{ padding: 15, backgroundColor: colors.homeBg }}>
            <MaterialIcons name="security-update-warning" size={25} color={colors.gray} />
            {Platform.OS === 'ios' && <Text style={{ fontSize: 15, color: colors.secondary, fontFamily: Fonts.bold, fontWeight: '700', paddingHorizontal: 10 }}>
              No active source set. Please connect or activate watch or Apple Health</Text>}
            {Platform.OS === 'android' && <Text style={{ fontSize: 15, color: colors.secondary, fontFamily: Fonts.bold, fontWeight: '700', paddingHorizontal: 10 }}>
              No active source set. Please connect to TPASC Watch</Text>}
            <MaterialIcons name="chevron-right" size={25} color={colors.gray} />
          </ViewX>}
          <ViewX style={styles.watchStatusCont}>
            {activeSource && activeSource === HEALTH_SOURCES.WATCH && <AnimatedView
              horizontal
              delayLevel={0}
              style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons
                name="watch-variant"
                color={colors.secondary}
                size={25}
              />
              <ViewX justifyContent={'space-between'} flexRow style={{ flex: 1 }}>
                <Text bold>Watch Status</Text>
                <Text bold>{watchLabel}</Text>
              </ViewX>
            </AnimatedView>}

            {activeSource && activeSource === HEALTH_SOURCES.PLATFORM && <AnimatedView
              horizontal
              delayLevel={0}
              style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons
                name="cellphone"
                color={colors.secondary}
                size={25}
              />
              <ViewX justifyContent={'space-between'} flexRow style={{ flex: 1 }}>
                <Text bold>{Platform.OS === 'ios' ? 'Apple Health' : 'Google Health'} Status</Text>
                {platformHealthTurnedOn && <Text bold>{!isPlatformHealthReady ? 'Connected (not ready)' : 'Connected (Ready)'}</Text>}
                {!platformHealthTurnedOn && <Text bold>Not Setup</Text>}
                {/* <Button icon="sync" mode="contained" onPress={getDatas}>Sync</Button> */}
              </ViewX>
            </AnimatedView>}
          </ViewX>
        </TouchableOpacity>
        <Connection isOpen={isConnectionModalOpen} onDismiss={() => setIsConnectionModalOpen(false)} />
        {/* <AnimatedView horizontal delayLevel={1}>

        </AnimatedView> */}
        {/* <AnimatedView horizontal delayLevel={2}>
          <MaterialCommunityIcons
            name={isWatchConnected ? 'bluetooth' : 'bluetooth-off'}
            color={isWatchConnected ? colors.primary : 'red'}
            size={25}
          />
        </AnimatedView> */}
        {/* <AnimatedFAB
            icon={() => (
              <MaterialCommunityIcons
                name={isWatchConnected ? 'bluetooth' : 'bluetooth-off'}
                color={isWatchConnected ? colors.green : 'red'}
                size={25}
              />
            )}
            // icon="plus"
            //   elevation={0}
            label={watchLabel}
            extended={isExtended}
            variant="surface"
            onPress={() => {
              handleExtension(true);
            }}
            visible={true}
            iconMode={'dynamic'}
            animateFrom="right"
            style={[styles.fabStyle]}
          /> */}
      </ViewX>
      {/* </PadWrapper> */}
    </>
  );
};

export default WatchStatus;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    right: 0,
    backgroundColor: '#fff',
    borderColor: 'transparent',
    // padding: 0,
    // bottom: 0,
    position: 'absolute',
  },
});
