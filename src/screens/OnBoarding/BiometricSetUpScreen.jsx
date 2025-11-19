/* eslint-disable prettier/prettier */
import { Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContainerBox from '../../components/common/CenterX'
import { Image } from 'native-base'
import AppText from '../../components/common/Text'
import ButtonX from '../../components/common/BottonX'
import { useNavigation } from '@react-navigation/native'
import colors from '../../themes/Colors'
import metrics from '../../themes/Metrics'
import Routes from '../../navigation/Routes'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { showMessage } from 'react-native-flash-message'

const BiometricSetUpScreen = () => {
    const navigation = useNavigation();
    const { userToken, actualUser, biometricDetails, biometricAuth } = useStoreState(state => ({
        userToken: state.login.userToken,
        actualUser: state.login.actualUser,
        biometricDetails: state.login.biometricDetails,
        biometricAuth: state.login.biometricAuth,
    }));
    const { setIsBiometricAsked, setBiometricAuth } = useStoreActions(action => ({
        setIsBiometricAsked: action.login.setIsBiometricAsked,
        setBiometricAuth: action.login.setBiometricAuth,
    }));

    const isUpdated = !!biometricAuth && biometricAuth?.user?._id !== actualUser?._id;
    const checkNavigation = (_isAppBoarded) => {
        if (_isAppBoarded) {
            navigation.navigate(Routes.MAINSTACK);
        } else {
            navigation.navigate(Routes.BOARDED);
        }
    };
    const onOkPress = () => {
        checkNavigation(actualUser?.isAppBoarded);
        setIsBiometricAsked(true);
    };
    const handleBiometricSetup = async () => {
        const authDetails = { user: actualUser, jwt: userToken };
        setBiometricAuth(authDetails);
        showMessage({
          message: 'Success',
          description: `Your ${biometricDetails?.biometryType} details is ${
            isUpdated ? 'updated' : 'saved'
          }.`,
          type: 'success',
          icon: 'success',
        });
        onOkPress();
        // Alert.alert(`${biometricDetails?.biometryType} setup`, , [
        //     {
        //         text: 'OK',
        //         style: 'cancel',
        //         onPress: () => onOkPress(),
        //     },
        // ]);
    };
    useEffect(() => {
        console.log('handling', biometricDetails)
        if(biometricDetails && !biometricDetails.available) {
            handleSkip();
        }
    }, [biometricDetails]);
    const handleSkip = async () => {
        if (biometricDetails?.biometryExist) {
            setBiometricAuth(null);
        }
        setIsBiometricAsked(true);
        checkNavigation(actualUser?.isAppBoarded);
    };
    return (
      <ContainerBox style={{justifyContent: 'center'}}>
        <Image
          style={{height: '30%'}}
          resizeMode="contain"
          source={require('../../public/lock.gif')}
          alt="Logo"
        />
        <AppText
          text={`Would you like to use ${biometricDetails?.biometryType} to login?`}
          style={styles.heading}
        />
        <ButtonX
          title={
            isUpdated
              ? `Update ${biometricDetails?.biometryType} details`
              : `Setup ${biometricDetails?.biometryType}`
          }
          onPress={handleBiometricSetup}
          style={{width: '100%', marginTop: metrics.s20 + metrics.s20}}
        />
        <ButtonX
          title="Skip"
          onPress={handleSkip}
          style={{width: '100%', marginTop: metrics.s20}}
        />
      </ContainerBox>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: metrics.s20,
        paddingVertical: metrics.s10,
    },
    heading: {
        textAlign: 'center',
        fontSize: metrics.s18, marginTop: metrics.s20,
        lineHeight: metrics.s20,
    }
})

export default BiometricSetUpScreen