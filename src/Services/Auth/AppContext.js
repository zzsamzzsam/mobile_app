/* eslint-disable prettier/prettier */
import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useContext, useEffect } from 'react';
import { APP_STATE } from '../../Store/Models/App';
import useNetInfo from '../../Apollo/lib/NetInfo/NetInfo';
import { CustomerIO, CioLogLevel, CioRegion } from 'customerio-reactnative';
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
        const config = {
            cdpApiKey: '69bac83ed7a05c91e3fa',  // your CDP API key
            region: CioRegion.US,               // or CioRegion.EU
            logLevel: CioLogLevel.Debug,        // optional
            trackApplicationLifecycleEvents: true,
            inApp: {
                siteId: '1bb433fc0bdf40326764',  // required if using in-app
            },
            backgroundQueueSecondsDelay: 7200,  // equivalent of old backgroundQueueSecondsDelay
        };

        CustomerIO.initialize(config);
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
