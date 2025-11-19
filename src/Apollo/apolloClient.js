/* eslint-disable curly */
/* eslint-disable prettier/prettier */

import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    createHttpLink,
    split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const graphUrl = 'http://192.168.1.155:5002/graphql';
// const gqlSubsUrl = 'ws://192.168.1.155:5002/subscriptions';
const graphUrl = 'https://traffic.tpasc.ca/graphql'
const gqlSubsUrl = 'wss://traffic.tpasc.ca/subscriptions'

const LOCAL_SYSTEM_IP_ADDRESS = "192.168.1.70";
const PORT = '5000';
const authLink = setContext(async (_, { headers }) => {
    headers = headers || {};
    const token = await AsyncStorage.getItem('token');
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return {
        headers: headers,
    };
});
const httpLink = createHttpLink({
    // uri: `http://${LOCAL_SYSTEM_IP_ADDRESS}:${PORT}/graphql`,
    uri: graphUrl,
});

const wsLink = new WebSocketLink({
    uri: gqlSubsUrl,
    options: {
        reconnect: true,
        connectionParams: async () => {
            const token = await AsyncStorage.getItem('token');
            return {
                authToken: token,
            };
        },
        onConnected: () => {
            console.log('WebSocket connected');
        },
        onReconnected: () => {
            console.log('WebSocket reconnected');
        },
        onDisconnected: () => {
            console.log('WebSocket disconnected');
        },
    },
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink)
);

export const client = new ApolloClient({
    link: splitLink,
    // link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
});

