/* eslint-disable prettier/prettier */
import { Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import LoadingCircle from '../../components/LoadingCircle';
import { useMutation } from '@apollo/client';
import { UNLINK_BARCODE } from '../../Apollo/Mutations';
import { GET_BARCODES } from '../../Apollo/Queries';
import ButtonX from '../../components/common/BottonX';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import AppText from '../../components/common/Text';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import { isIos } from '../../constant';
import { showCardType } from '../../utils';

const AfterUnlink = () => {
  const navigation = useNavigation();
  const [deleteBarcodeMutation, { loading }] = useMutation(UNLINK_BARCODE);
  const route = useRoute();
  const barcode = route.params.barcode;
  const barcodeType = route.params.barcodeType || "notype";

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
    }, []),
  );

  const deleteBarcode = async (barcodeId, type) => {
    if (loading) return;
    if (!barcode) {
      showMessage({
        message: 'Error',
        description: 'baroce already deleted',
        type: 'dander',
        icon: 'dander',
      });
      navigation.goBack()
    }
    try {
      if (type === 'event') {
        await AsyncStorage.removeItem('Barcode');
        showMessage({
          message: 'Success',
          description: 'Barcode deleted successfully',
          type: 'success',
          icon: 'success',
        });
        navigation.goBack();
      } else {
        await deleteBarcodeMutation({
          variables: { barcode: barcodeId },
          fetchPolicy: 'network-only',
          refetchQueries: [{ query: GET_BARCODES }],
        });
        showMessage({
          message: 'Success',
          description: 'Barcode deleted successfully',
          type: 'success',
          icon: 'success',
        });
        navigation.goBack();
      }
    } catch (e) {
      console.log('Error on unlink barcode', e.toString()),
        showMessage({
          message: 'Error',
          description: e?.message || 'Unable to delete barcode',
          type: 'danger',
          icon: 'danger',
        });
    }
  };

  return (
    <Box style={styles.container}>
      <Box style={styles.codeContainer}>
        <Box
          style={{
            marginTop: metrics.s30,
            width: '100%',
          }}>
          {barcode === '' ? (
            <LoadingCircle />
          ) : (
            <Box>
              <AppText color={colors.primary} style={{ textAlign: 'center' }}>{showCardType(barcode?.message?.trim())}</AppText>
              <Barcode
                format="CODE128"
                value={barcode.barcode}
                text={barcode.barcode}
                background="none"
              />
            </Box>
          )}
        </Box>
        <ButtonX
          title="Delete Barcode"
          isLoading={loading}
          isLoadingText='Deleting'
          onPress={() => deleteBarcode(barcode.barcodeId, barcodeType)}
          style={{ width: '100%', marginTop: metrics.s20 + metrics.s20, backgroundColor: colors.danger }}
        />
      </Box>
    </Box>
  );
};

export default AfterUnlink;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: metrics.s20,
    backgroundColor: colors.white
  },

  codeContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
});
