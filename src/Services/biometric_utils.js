/* eslint-disable prettier/prettier */
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

export const rnBiometrics = new ReactNativeBiometrics();

export const getBiometricDetails = async () => {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    return { available, biometryType };
};


