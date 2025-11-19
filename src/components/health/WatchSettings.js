import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Checkbox,
} from 'react-native-paper';
import {Platform, StyleSheet} from 'react-native';
import {useWatchContext} from '../../Services/Watch/WatchContext';
import colors from '../../themes/Colors';
import ViewX from '../common/ViewX';
import Text from '../common/Text';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {globalStyles} from '../../utils/constants';
import Fonts from '../../themes/Fonts';

const WatchSettings = ({isOpen, onDismiss}) => {
  const {
    isWatchConnected,
    handleWrist
  } = useWatchContext();
  // const [index, setIndex] = useState(0);
  // const {x} = useStoreActions(action => action.health);
  const {platformHealthTurnedOn, activeSource} = useStoreState(
    state => state.health,
  );
  return (
    <>
        <ViewX style={styles.headerWrap}>
          <Text style={[globalStyles.boldText, styles.headerText]}>
            Settings
          </Text>
          {/* <Text style={styles.headerSubText}>
            Choose your active health data source
          </Text> */}
        </ViewX>
         <Checkbox.Item
            mode="android"
            color={colors.secondary}
            label="Lift Wrist to bright screen"
            status={"checked"}
            labelStyle={{
              fontFamily: Fonts.medium,
              fontWeight: 'bold',
              fontSize: 14,
              lineHeight: 18,
            }}
            onPress={handleWrist}
          />
      </>    
  );
};

export default WatchSettings;
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
});
