import React from 'react';
import {Button, Divider, Switch, Text} from 'react-native-paper';
import PadWrapper from '../common/PadWrapper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Platform, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AnimatedView from '../common/AnimatedView';
import colors from '../../themes/Colors';
import ViewX from '../common/ViewX';
import {useWatchContext} from '../../Services/Watch/WatchContext';
import {usePlatformHealthContext} from '../../Services/PlatformHealth/PlatformHealthContext';
import {useStoreActions, useStoreState} from 'easy-peasy';
import SurfaceBox from '../common/SurfaceBox';
import ButtonX from '../common/BottonX';
const PlatformHealthCard = ({setDrawerOpen, drawerOpen}) => {
  const {isWatchConnected, isScanning, connectDevice, eventLogs} =
    useWatchContext();
  const {setPlatformHealthTurnedOn} = useStoreActions(action => action.health);
  const {platformHealthTurnedOn} = useStoreState(state => state.health);
  const {initialize, isPlatformHealthReady, getDatas} = usePlatformHealthContext();

  return (
    <PadWrapper>
      <ViewX
        style={{
          padding: 10,
          paddingBottom: 0,
        }}>
        <ViewX style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10}}>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              paddingBottom: 5,
            }}>
            {Platform.OS === 'ios' ? 'Apple' : 'Google'} Health
          </Text>
          <Switch
            style={{alignItems: 'center', alignSelf: 'center'}}
            value={platformHealthTurnedOn}
            onValueChange={() => {
              if (!platformHealthTurnedOn) {
                initialize();
              }
              setPlatformHealthTurnedOn(!platformHealthTurnedOn);
            }}
          />
        </ViewX>
        <Button icon="sync" mode="contained" onPress={getDatas}>Sync</Button>
      </ViewX>
      {platformHealthTurnedOn && (
        <AnimatedView horizontal delayLevel={0} style={{flexDirection: 'row'}}>
          <SurfaceBox>
            <Text>Ready: {isPlatformHealthReady ? 'Yes' : 'No'}</Text>
          </SurfaceBox>
        </AnimatedView>
      )}
    </PadWrapper>
  );
};

export default PlatformHealthCard;
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
