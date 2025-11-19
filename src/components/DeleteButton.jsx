/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { client } from '../Apollo/apolloClient';
import { showMessage } from 'react-native-flash-message';
import { useStoreActions } from 'easy-peasy';
import metrics from '../themes/Metrics';
import colors from '../themes/Colors';
import ButtonX from './common/BottonX';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_STATE } from '../Store/Models/App';



const LogoutUserButton = () => {
    const [logoutLoading, setLogoutLoading] = useState(false);
    const {
        setUserToken,
        setActualUser,
        setSchedules,
        setAppState,
    } = useStoreActions(action => ({
        setUserToken: action.login.setUserToken,
        setActualUser: action.login.setActualUser,
        setSchedules: action.schedule.setSchedules,
        setAppState: action.app.setAppState,
        setIsBiometricAsked: action.login.setIsBiometricAsked,
    }));
    const onLogoutPress = async () => {
        try {
            setLogoutLoading(true);
            setUserToken('');
            setActualUser(null);
            await AsyncStorage.removeItem('token');
            setSchedules([]);
            await AsyncStorage.clear();
            await client.clearStore();
            setLogoutLoading(false);
            setAppState(APP_STATE.LOGIN);
        } catch (err) {
            console.log("logout error ", err);
            setLogoutLoading(false);
            showMessage({
                message: "Error",
                description: "Error on logout user",
                type: "danger",
                icon: "danger"
            });
            console.log("error", err.toString());
        }
    };
    return (
        <ButtonX
            title="Logout"
            isLoading={logoutLoading}
            isLoadingText='Logging out'
            onPress={onLogoutPress}
            style={{ marginVertical: metrics.s20, backgroundColor: colors.danger }}
        />
    );
};

export {
    LogoutUserButton,
};

