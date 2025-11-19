/* eslint-disable prettier/prettier */
import { action, Action, persist, Thunk, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { GET_CHANNELS, GET_EVENTS } from "../../Apollo/Queries";
import { client } from "../../Apollo/apolloClient";

const ChannelModel =
// persist(
{
    channels: [],
    currentChannel: null,
    setChannel: action((state, payload) => {
        state.events = payload;
    }),
    setCurrentChannel: action((state, payload) => {
        state.currentEvents = payload;
    }),
    fetchChannels: thunk(async (actions, payload, helpers) => {
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.query({
                query: GET_CHANNELS,
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            // console.log('the---channels', data?.channels)
            if (data?.channels && Array.isArray(data?.channels)) {
                actions.setChannel(data.channels);
            } else {
                throw new Error("Channels not found")
            }
        } catch (err) {
            console.log("Error channels", err.toString());
            throw new Error("Error channels", err.toString())
        }
    }),
};

// {
//     allow: ['events', 'currentEvents'],
//     deny: ['setCurrentEvents', 'setEvents', 'fetchEvents'],
//     storage: AppAsyncStorage,
// });

export default ChannelModel;
