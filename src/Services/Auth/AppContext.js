/* eslint-disable prettier/prettier */
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useContext, useEffect } from 'react';
import { APP_STATE } from '../../Store/Models/App';
import useNetInfo from '../../Apollo/lib/NetInfo/NetInfo';
import { CustomerIO, CustomerIOEnv, CustomerioConfig, Region } from 'customerio-reactnative';
import { customerIoUserIdetify } from '../../utils';
import { getBiometricDetails } from '../biometric_utils';


const AppStateContext = React.createContext(null);

export const useAppContext = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};


export const AppContextProvider = ({ children }) => {
    const { isConnected } = useNetInfo();
    const { userToken, appState, actualUser, biometricAuth } = useStoreState(state => ({
        userToken: state.login.userToken,
        appState: state.app.appState,
        actualUser: state.login.actualUser,
        biometricAuth: state.login.biometricAuth,
    }));
    const { fetchUser, setAppState, setBiometricDetails } = useStoreActions(action => ({
        fetchUser: action.login.fetchUser,
        setAppState: action.app.setAppState,
        setBiometricDetails: action.login.setBiometricDetails,
    }));

    const customerIoInit = () => {
        const data = new CustomerioConfig();
        data.enableInApp = true;
        // data.logLevel = CioLogLevel.debug
        data.backgroundQueueSecondsDelay = 7200;

        const cioEnv = new CustomerIOEnv();

        cioEnv.siteId = '1bb433fc0bdf40326764';
        cioEnv.apiKey = '69bac83ed7a05c91e3fa';
        cioEnv.region = Region.US;
        CustomerIO.initialize(cioEnv, data);
    };

    useEffect(() => {
        const setupBiometricsDetails = async () => {
            const { available, biometryType } = await getBiometricDetails();
            console.log('check-======', available, biometryType)
            setBiometricDetails({biometryType, available, biometryExist: !!biometricAuth});
        };
        setupBiometricsDetails();
    }, [userToken, biometricAuth, setBiometricDetails]);


    useEffect(() => {
        customerIoInit();
    }, [userToken]);
    useEffect(() => {
        if (userToken) {
            if (isConnected) {
                fetchUser({ token: userToken });
                customerIoUserIdetify(actualUser);
            } else {
                if (!!actualUser && actualUser?.isAppBoarded) {
                    setAppState(APP_STATE.HOME);
                } else {
                    setAppState(APP_STATE.UNBOARDING);
                }
            }
        } else {
            setAppState(APP_STATE.LOGIN);
        }
    }, [userToken, isConnected, actualUser?.isAppBoarded, fetchUser, setAppState, actualUser]);
    return (
        <AppStateContext.Provider value={{ state: appState }}>
            {children}
        </AppStateContext.Provider>
    );
};

export default AppStateContext;
