import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApolloClient, useQuery, useSubscription } from '@apollo/client';
import { NEW_MESSAGE_SUBS } from '../../Apollo/Queries/Chat';
import { GET_CHANNELS, GET_CHANNELS_UNREAD } from '../../Apollo/Queries/Channel';
import OneSignal from 'react-native-onesignal';
import { useStoreState } from 'easy-peasy';

const SubscriptionContext = createContext();

export const ChatProvider = ({ children }) => {
    const [data, setData] = useState(null);
    // const client = useApolloClient();
    const { userToken } = useStoreState(state => ({
        userToken: state.login.userToken,
    }));
    const { data: subscriptionData, error } = useSubscription(NEW_MESSAGE_SUBS, {
        // onSubscriptionData: ({client, subsData}) => {
        //     // OneSignal.clearOneSignalNotifications();
        //     client.refetchQueries({
        //         include: [GET_CHANNELS_UNREAD],
        //     });
        // }
        skip: !userToken,
    });
   
    const { data: channelsData, loading: channelLoading, refetch: refetchChannels, error: channelError } = useQuery(GET_CHANNELS, {
        fetchPolicy: 'cache-and-network',
        skip: !userToken,
    });
    useEffect(() => {
        if (subscriptionData) {
            setData(subscriptionData);
        }
    }, [subscriptionData]);

    return (
        <SubscriptionContext.Provider value={{ data, error, channelsData, refetchChannels }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscriptionData = () => {
    return useContext(SubscriptionContext);
};