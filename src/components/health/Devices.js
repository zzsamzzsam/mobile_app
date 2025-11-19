import React from 'react';
import {Divider, Text} from 'react-native-paper';
import PadWrapper from '../common/PadWrapper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AnimatedView from '../common/AnimatedView';
import colors from '../../themes/Colors';
import ViewX from '../common/ViewX';
import {useWatchContext} from '../../Services/Watch/WatchContext';
import moment from 'moment';
const Devices = ({}) => {
  const {isWatchConnected, isScanning, connectDevice, devices, setConnectionLogs} =
    useWatchContext();
    // return null;
  return (
    <PadWrapper>
      <ViewX style={{padding: 10, paddingBottom: 0}}>
        <Text style={{fontWeight: 'bold', color: 'black', paddingBottom: 5}}>
          DEVICES
        </Text>
        {devices.map(s => (
          <TouchableOpacity
            key={s.address}
            onPress={() => {
              if (s.address !== 'ff:12:12:12:45:23') {
                connectDevice(s);
              }
              setConnectionLogs(prev => {
                return [...prev, {
                  date: moment(new Date().toISOString()).format('HH:mm:ss'),
                  status: 'Connecting'
                }];
              })
            }}>
            <AnimatedView
              horizontal
              key={s.address}
              style={{flexDirection: 'column'}}>
              <Divider style={{marginVertical: 10}} />
              <ViewX flexRow alignItems={'center'}>
                <MaterialCommunityIcons
                  name="bluetooth"
                  color={colors.primary}
                  size={16}
                />
                <Text
                  style={{
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: 10,
                    fontSize: 16,
                    fontWeight: '500',
                  }}>
                  {s.name}
                </Text>
              </ViewX>
              <ViewX
                flexRow
                style={{paddingLeft: 26}}
                justifyContent="space-between">
                <Text style={{paddingTop: 0, fontSize: 14, color: 'grey'}}>
                  {s.address}
                </Text>
                <Text style={{paddingTop: 0, fontSize: 14, color: 'grey'}}>
                  {s.rssi}
                </Text>
              </ViewX>
            </AnimatedView>
          </TouchableOpacity>
        ))}
      </ViewX>
    </PadWrapper>
  );
};

export default Devices;
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
