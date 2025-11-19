/* eslint-disable prettier/prettier */
import { Box, Divider, FormControl, ScrollView } from 'native-base';
import React, { useCallback, useMemo, useState } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { showMessage } from 'react-native-flash-message';
import { InputX, PasswordInputX } from './common/InputX';
import AppText from './common/Text';
import metrics from '../themes/Metrics';
import colors from '../themes/Colors';
import Fonts from '../themes/Fonts';
import ButtonX from './common/BottonX';
import Routes from '../navigation/Routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@apollo/client';
import { APP_LOGIN } from '../Apollo/Mutations';
import LoadingModal from './common/LoadingModal';
import { APP_STATE } from '../Store/Models/App';
import { trackUserEvent } from '../utils';
import { TrackingEventTypes } from '../constant';
import { rnBiometrics } from '../Services/biometric_utils';

const LoginForm = () => {
  const navigation = useNavigation();

  const { setUserToken, setAppState, setIsVideoCookieClear, setIsBiometricAsked, loginUserWithBiometric, setBiometricAuth } = useStoreActions(action => ({
    setUserToken: action.login.setUserToken,
    setAppState: action.app.setAppState,
    setIsVideoCookieClear: action.login.setIsVideoCookieClear,
    setIsBiometricAsked: action.login.setIsBiometricAsked,
    loginUserWithBiometric: action.login.loginUserWithBiometric,
    setBiometricAuth: action.login.setBiometricAuth,
  }));
  const { biometricDetails, biometricAuth } = useStoreState((st) => ({
    biometricDetails: st.login.biometricDetails,
    biometricAuth: st.login.biometricAuth,
  }));
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [formData, setData] = React.useState({ username: '', password: '' });
  const [errors, setErrors] = React.useState({
    passwordError: '',
    usernameError: '',
  });

  const [loginUserMutation] = useMutation(APP_LOGIN);
  const handleEvent = async () => {
    try {
      const localBarcode = await AsyncStorage.getItem('Barcode');
      if (localBarcode) {
        navigation.navigate(Routes.UNLINKEVENT, { barcode: localBarcode[0] });
      } else {
        navigation.navigate(Routes.LINKEVENT);
      }
      trackUserEvent(TrackingEventTypes?.event_button_click, {
        message: 'User just click on event',
      });
    } catch (err) {
      console.log(err.toString());
    }
  };
  const handleSignup = () => {
    // Linking.openURL('https://tpasc.ezfacility.com/register');
    navigation.navigate(Routes.SIGNUP);
  };
  const handleLogin = async () => {
    let valid = true;
    if (formData.username === '') {
      valid = false;
      setErrors(e => ({ ...e, usernameError: 'Username is required' }));
    }
    if (formData.password === '') {
      valid = false;
      setErrors(e => ({ ...e, passwordError: 'Password is required' }));
    }
    if (valid) {
      const { username, password } = formData;
      try {
        setLoading(true);
        setLoadingText('Logging in...');
        const { data } = await loginUserMutation({
          variables: {
            username,
            password,
          },
        });

        if (data && data?.ezClientApplogin) {
          const user = data?.ezClientApplogin;
          if (!!biometricAuth && biometricAuth?.user?._id === user?._id) {
            const authDetails = { user, jwt: data?.ezClientApplogin?.jwt };
            setBiometricAuth(authDetails);
            setIsBiometricAsked(true);
          } else {
            setIsBiometricAsked(false);
          }
          trackUserEvent(TrackingEventTypes?.login_finish, {
            userId: user?._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: Array.isArray(user?.email) ? user?.email[0] : user?.email,
            username: user?.username,
          });
          setUserToken(data?.ezClientApplogin?.jwt);
          setIsVideoCookieClear(true);
          await AsyncStorage.setItem('token', data?.ezClientApplogin?.jwt);
          if (data?.ezClientApplogin?.isAppBoarded) {
            setAppState(APP_STATE.HOME);
          } else {
            setAppState(APP_STATE.UNBOARDING);
          }
          // const user = data?.ezClientApplogin || null;
          // await AsyncStorage.setItem('token', data?.ezClientApplogin?.jwt);
          // delete user?.jwt;
          // setActualUser(user);
        } else {
          setAppState(APP_STATE.LOGIN)
          throw new Error("Invalid credentials")
        }
        // setLoading(false);
      } catch (error) {
        setAppState(APP_STATE.LOGIN);
        setLoading(false);
        setLoadingText('');
        const errMsg = error && error.toString().split(":")[1] ? error.toString().split(":")[1] : "Invalid Credentials";
        trackUserEvent(TrackingEventTypes?.login_failed, {
          message: 'Login Error',
          description: errMsg,
        });
        showMessage({
          message: 'Login Error',
          description: errMsg,
          type: 'danger',
          icon: 'danger',
        });
      }
    }
  };
  const handleBiometricLogin = async () => {
    const { available, biometryType } = biometricDetails;
    setLoadingText(`Logging in with ${biometryType}...`);
    if (!available && !biometryType) {
      throw new Error(`${biometryType} login error`);
    }
    try {
      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage: 'Log in',
        cancelButtonText: 'Dismiss',
      });
      if (error) {
        setLoading(false);
        return showMessage({
          message: `${biometryType} prompt dismiss`,
          description: `You cancelled ${biometryType} prompt`,
          type: 'danger',
          icon: 'danger',
        });
      }
      if (!success) {
        throw new Error(`Faild to login using ${biometryType}. Please try normal login.`);
      }
      const { user, jwt } = biometricAuth;
      if (!user && !jwt) {
        throw new Error(`Faild to login using ${biometryType}. Please try normal login.`);
      }
      setLoading(true);
      await loginUserWithBiometric({ token: jwt });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showMessage({
        message: `${biometryType} Login Error`,
        description: err && err.toString().split(':')[1],
        type: 'danger',
        icon: 'danger',
      });
    }

  };

  useFocusEffect(
    useCallback(() => {
      setData({ username: '', password: '' });
    }, [navigation]),
  );
  return (
    <>
      {
        loading && <LoadingModal
          title={loadingText || "Logging in..."}
        />
      }
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Box
          borderRadius="md"
          shadow="6"
          style={[
            styles.formContainer,
          ]}>
          <Box style={{ margin: 15 }}>
            <AppText
              text={'Login'}
              bold
              fontSize={16}
            />
          </Box>
          <Divider />

          <Box style={{ padding: metrics.s20 }}>
            <AppText
              text={"Please login with your TPASC EzFacility Username and password that you use to access our self service."}
              fontSize={16}
              lineHeight={16}
            />
            <Box
              style={{
                marginBottom: metrics.s20,
                marginTop: metrics.s20,
              }}>
              <FormControl isRequired>
                <InputX
                  label="Username"
                  value={formData.username}
                  type='text'
                  onFocus={() => setErrors({ ...errors, usernameError: '' })}
                  onChangeText={value =>
                    setData({ ...formData, username: value })
                  }
                  error={errors.usernameError}
                  perfix={true}
                />
                <PasswordInputX
                  label="Password"
                  value={formData.password}
                  onSubmitEditing={handleLogin}
                  onFocus={() => setErrors({ ...errors, passwordError: '' })}
                  onChangeText={value =>
                    setData({ ...formData, password: value })
                  }
                  error={errors.passwordError}
                />
                <Box style={styles.forgetPw}>
                  <TouchableOpacity onPress={() => Linking.openURL('https://tpasc.ezfacility.com/RetrieveUsername')}>
                    <AppText text={'Forgot username?'} color={colors.primary} style={styles.underlineText} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL('https://tpasc.ezfacility.com/RetrievePassword')}>
                    <AppText text={'Forgot password?'} color={colors.primary} style={styles.underlineText} />
                  </TouchableOpacity>
                </Box>
                <Box style={styles.buttons}>
                  <ButtonX
                    variant='outline'
                    bg={colors.white}
                    textColor={colors.primary}
                    style={{ paddingLeft: '10%', paddingRight: '10%' }}
                    title="Sign Up"
                    onPress={handleSignup}
                  />
                  <ButtonX
                    title="Log In"
                    style={{ paddingLeft: '10%', paddingRight: '10%' }}
                    onPress={handleLogin}
                  />
                </Box>
                
                {
                  (biometricDetails?.available && biometricDetails?.biometryExist) && <ButtonX
                    title={`Log In with ${biometricDetails?.biometryType}`}
                    style={{ marginTop: 20 }} showBiometricButton
                    onPress={handleBiometricLogin}
                  />
                }

              </FormControl>
            </Box>
          </Box>
        </Box>
        <Box
          shadow={6}
          borderRadius='md'
          style={{ marginHorizontal: metrics.s20 }}
        >
          <ButtonX
            title="Events"
            onPress={handleEvent}
          />
        </Box>
      </ScrollView>
    </>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: metrics.s20,
    marginTop: metrics.s30,
    backgroundColor: colors.white,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgetPw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: metrics.s20,
  },
  input: {
    borderWidth: 1,
  },
  error: {
    color: colors.danger,
  },
  bookFont: {
    fontFamily: Fonts.book,
    color: colors.black,
  },
  underlineText: {
    textDecorationLine: 'underline',
    textDecorationColor: colors.secondary,
  }
});
