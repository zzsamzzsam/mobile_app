/* eslint-disable prettier/prettier */
import { Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import SwipableBarcodeView from './SwipableBarcodeView';
import SwipeableFeed from '../SwipableFeed';
import { ScrollView } from 'react-native';
import metrics from '../../themes/Metrics';
import { useQuery } from '@apollo/client';
import { GET_ME_USER } from '../../Apollo/Queries';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import { isIos } from '../../constant';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';

const BarcodeComponent = () => {
  const navigation = useNavigation();
  const { data: userData } = useQuery(GET_ME_USER);
  const [deviceBrightnessLevel, setDeviceBrightnessLevel] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const getDefaultDeviceBrightnessLevel = async () => {
        const result = await DeviceBrightness.getSystemBrightnessLevel();
        setDeviceBrightnessLevel(result);
      };

      getDefaultDeviceBrightnessLevel();
      DeviceBrightness.setBrightnessLevel(1.0);

      return () => DeviceBrightness.setBrightnessLevel(isIos ? 0.5 : -1);
    }, [navigation]),
  );
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Box style={styles.codeContainer}>
        <SwipableBarcodeView />
      </Box>
      {/* {
        userData?.meAppUser?.membershipType && (
          <Box style={{ marginTop: metrics.s10 }}>
            <AppText
              text={`Membership Type: ${userData?.meAppUser?.membershipType}`}
              style={styles.membershipText}
            />
            {
              userData?.meAppUser?.membershipContractStatus && <AppText
                text={`Membership Status: ${userData?.meAppUser?.membershipContractStatus}`}
                style={styles.membershipText}
              />
            }
          </Box>
        )
      } */}
      <SwipeableFeed />
    </ScrollView >
  );
};

export default BarcodeComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: metrics.s10,
    paddingHorizontal: metrics.s20,
    backgroundColor: colors.white,
  },
  codeContainer: {
    flex: 1,
    width: '100%',
  },
  membershipText: {
    fontFamily: Fonts.bold,
    fontWeight: 700,
  },
});
