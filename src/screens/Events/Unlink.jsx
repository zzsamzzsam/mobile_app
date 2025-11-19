/* eslint-disable prettier/prettier */
import { Box } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingCircle from '../../components/LoadingCircle';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';
import ButtonX from '../../components/common/BottonX';
import metrics from '../../themes/Metrics';
import ContainerBox from '../../components/common/CenterX';
import Routes from '../../navigation/Routes';
import { useFocusEffect } from '@react-navigation/native';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import AppText from '../../components/common/Text';
import colors from '../../themes/Colors';
import { isIos } from '../../constant';
import { showCardType } from '../../utils';

const Unlink = () => {
  const navigation = useNavigation();
  const [barcode, setBarcode] = useState();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteClick, setDeleteClick] = useState(false);
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

  useEffect(() => {
    const getBarcode = async () => {
      const savedBarcode = await AsyncStorage.getItem('Barcode');
      const parseBarcode = JSON.parse(savedBarcode);
      setBarcode(parseBarcode[0]);
    };
    getBarcode();
  }, []);
  const deleteBarcodeLink = () => {
    setDeleteClick(!deleteClick);
    if (barcode) {
      setDeleteLoading(true);
      try {
        AsyncStorage.removeItem('Barcode');
        showMessage({
          message: 'Success',
          description: 'Barcode deleted successfully',
          type: 'success',
          icon: 'success',
        });
        navigation.goBack();
        setDeleteLoading(false);
      } catch (error) {
        setDeleteLoading(false);
        showMessage({
          message: 'Error',
          description: 'Error while deleting barcode',
          type: 'danger',
          icon: 'danger',
        });
      }
    } else {
      showMessage({
        message: 'Error',
        description: 'Already deleted',
        type: 'danger',
        icon: 'danger',
      });
    }
  };

  return (
    <ContainerBox>
      <Box
        style={{
          marginTop: metrics.s40,
          width: '100%',
        }}>
        {barcode === '' ? (
          <LoadingCircle />
        ) : (
          <Box>
            <AppText color={colors.primary} style={{ textAlign: 'center' }}>{showCardType(barcode?.message?.trim())}</AppText>
            <Barcode
              format='CODE128'
              value={`${barcode?.barcode}`}
              text={barcode?.barcode}
              background="none"
            />
          </Box>
        )}
      </Box>
      <ButtonX
        title='Delete Barcode'
        isLoading={deleteLoading}
        isLoadingText='Deleting'
        onPress={deleteBarcodeLink}
        style={[styles.saveBtn, { marginTop: metrics.s20 + metrics.s20 }]}
      />
      <ButtonX
        title='Login'
        onPress={() => navigation.navigate(Routes.LOGIN)}
        style={[styles.loginBtn, { marginTop: metrics.s20 }]}
      />
    </ContainerBox>
  );
};

export default Unlink;

const styles = StyleSheet.create({
  loginBtn: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  saveBtn: {
    backgroundColor: colors.danger
  }
});
