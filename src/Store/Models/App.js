/* eslint-disable prettier/prettier */
import { action, persist, thunk } from "easy-peasy";
import AsyncStorage from "../../Services/AsyncStorage";

export const APP_STATE = {
    UNKNOWN: "UNKNOWN",
    LOADING: "LOADING",
    UNBOARDING: "UNBOARDING",
    LOGIN: "LOGIN",
    HOME: "HOME",
};

const AppModel = persist({
    defaultTheme: 'light',
    appState: APP_STATE.UNKNOWN,
    refetchNotification: false,
    setAppState: action((state, payload) => {
        state.appState = payload;
    }),
    setDefaultTmeme: action((state, payload) => {
        state.defaultTheme = payload;
    }),
    setRefetchNotification: action((state) => {
        state.refetchNotification = !state.refetchNotification;
    }),
},
    {
        allow: ['appState', 'defaultTheme'],
        deny: ['setAppState', 'setDefaultTmeme'],
        storage: AsyncStorage,
    }
);

export default AppModel;
