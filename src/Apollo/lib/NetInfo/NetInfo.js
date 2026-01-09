/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const inititalState = {
    type: null,
    effectiveType: null,
    isConnected: false
};

const useNetInfo = () => {
    const [netInfo, setNetInfo] = useState(inititalState);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNetInfo(state);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return netInfo;
};

export default useNetInfo;
