/* eslint-disable prettier/prettier */
import { action, persist, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { APP_LOGIN, RESTART_UNBOARDING } from "../../Apollo/Mutations";
import { client } from "../../Apollo/apolloClient";
import { GET_ME_USER } from "../../Apollo/Queries";
import { APP_STATE } from "./App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trackUserEvent } from "../../utils";
import { TrackingEventTypes } from "../../constant";


const LoginModel = persist({
    actualUser: null,
    userToken: '',
    updateUserFlag: false,
    isBiometricAsked: false,
    biometricDetails: null,
    biometricAuth: null,
    isVideoCookieClear: true,

    setActualUser: action((state, payload) => {
        state.actualUser = payload;
    }),
    logoutUser: action((state, payload) => {
        state.actualUser = null;
    }),
    setUserToken: action((state, payload) => {
        state.userToken = payload;
    }),
    setIsBiometricAsked: action((state, payload) => {
        state.isBiometricAsked = payload;
    }),
    setBiometricDetails: action((state, payload) => {
        state.biometricDetails = { ...state?.biometricDetails, ...payload };
    }),
    setBiometricAuth: action((state, payload) => {
        state.biometricAuth = payload;
    }),
    setIsVideoCookieClear: action((state, payload) => {
        state.isVideoCookieClear = payload;
    }),
    setUpdateUserFlag: action((state, payload) => {
        state.updateUserFlag = !state?.updateUserFlag;
    }),
    fetchUser: thunk(async (actions, payload, helpers) => {
        const { app: { setAppState } } = helpers.getStoreActions();
        const { login: { actualUser, userToken } } = helpers.getStoreState();
        const { token } = payload;
        try {
            const { data } = await client.query({
                query: GET_ME_USER,
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
            if (!data?.meAppUser) {
                throw new Error("User not found");
            }
            // console.log('the---', token)
            actions.setActualUser(data?.meAppUser);
            if (!data?.meAppUser?.isAppBoarded) {
                setAppState(APP_STATE.UNBOARDING);
            } else {
                setAppState(APP_STATE.HOME);
            }
        } catch (err) {
            if (!!userToken && !!actualUser) {
                if (actualUser?.isAppBoarded) {
                    setAppState(APP_STATE.HOME);
                } else {
                    setAppState(APP_STATE.UNBOARDING);
                }
            } else {
                setAppState(APP_STATE.LOGIN);
            }
            // console.log("Error fetchUser", err.toString());
            // throw new Error(err.toString());
        }
    }),
    loginUserWithBiometric: thunk(async (actions, payload, helpers) => {
        const { app: { setAppState }, login: { setIsVideoCookieClear } } = helpers.getStoreActions();
        const { token } = payload;
        try {
            const { data } = await client.query({
                query: GET_ME_USER,
                context: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });
            if (data?.meAppUser) {
                actions.setUserToken(token);
                actions.setActualUser(data?.meAppUser);
                await AsyncStorage.setItem('token', token);
                const user = data?.ezClientApplogin;
                trackUserEvent(TrackingEventTypes?.biometric_login_finish, {
                    userId: user?._id,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: Array.isArray(user?.email) ? user?.email[0] : user?.email,
                    username: user?.username,
                });
                setIsVideoCookieClear(true);

                if (!data?.meAppUser?.isAppBoarded) {
                    setAppState(APP_STATE.UNBOARDING);
                } else {
                    setAppState(APP_STATE.HOME);
                }
                actions.setActualUser(data.meAppUser);
            } else {
                throw new Error("User not found");
            }
        } catch (err) {
            await AsyncStorage.removeItem('token');
            setAppState(APP_STATE.LOGIN);
        }
    }),
    loginAppUser: thunk(async (actions, payload) => {
        const { username, password } = payload;
        try {
            const { data } = await client.mutate({
                mutation: APP_LOGIN,
                variables: { username, password },
            });
            if (!!data?.ezClientApplogin && !!data.ezClientApplogin?.jwt) {
                actions.setUserToken(data.ezClientApplogin?.jwt);
                // await AsyncStorage.setItem("token", data.ezClientApplogin?.jwt)
                delete data?.ezClientApplogin?.__typename;
                delete data?.ezClientApplogin?.jwt;
                // console.log('setting app user login', 'loginAppUser', data?.ezClientApplogin);
                actions.setActualUser(data?.ezClientApplogin);
                return data?.ezClientApplogin;
            } else {
                throw new Error("Data not found");
            }
        } catch (err) {
            const errMsg = err && err.toString().split(":")[1] ? err.toString().split(":")[1] : "Invalid Credentials";
            console.log("Error appLogin", err.toString());
            throw new Error(errMsg);
        }
    }),
    restartUnBoarding: thunk(async (actions, payload, helpers) => {
        const { _id } = payload;
        const { app: { setAppState }, login: { fetchUser } } = helpers.getStoreActions();
        const { login: { userToken } } = helpers.getStoreState();
        try {
            const { data } = await client.mutate({
                mutation: RESTART_UNBOARDING,
                variables: { _id: _id },
                refetchQueries: [{ query: GET_ME_USER }]
            });
            if (data?.restartAppUnBoarding) {
                await fetchUser({ token: userToken });
                // setAppState(APP_STATE.UNBOARDING);
            } else {
                throw new Error("Data not found");
            }
        } catch (err) {
            setAppState(APP_STATE.LOGIN);
            const errMsg = err && err.toString().split(":")[1] ? err.toString().split(":")[1] : "Invalid Credentials";
            console.log("Error appLogin", err.toString());
            throw new Error(errMsg);
        }
    }),
},
    {
        allow: ['actualUser', 'userToken', 'isBiometricAsked', 'biometricDetails', 'biometricAuth'],
        deny: ['setActualUser', 'loginAppUser', 'setUserToken', 'fetchUser', 'logoutUser', 'fetchActualUser', 'setBiometricAuth'],
        storage: AppAsyncStorage,
    });

export default LoginModel;
