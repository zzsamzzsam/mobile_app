/* eslint-disable prettier/prettier */
import { action, Action, persist, Thunk, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { GET_EVENTS } from "../../Apollo/Queries";
import { client } from "../../Apollo/apolloClient";

const EventsModel = 
// persist(
    {
    events: [],
    currentEvents: null,
    setEvents: action((state, payload) => {
        state.events = payload;
    }),
    setCurrentEvents: action((state, payload) => {
        state.currentEvents = payload;
    }),
    fetchEvents: thunk(async (actions, payload, helpers) => {
        const { upcoming, startDate, endDate, limit, page } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.query({
                query: GET_EVENTS,
                variables: { upcoming, startDate, endDate, limit, page },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    },
                },
            });
            if (data?.events.items && Array.isArray(data?.events.items)) {
                actions.setEvents(data.events.items);
            } else {
                throw new Error("Events not found")
            }
        } catch (err) {
            console.log("Error fetchEvents", err.toString());
            throw new Error("Error fetchEvents", err.toString())
        }
    }),
};

    // {
    //     allow: ['events', 'currentEvents'],
    //     deny: ['setCurrentEvents', 'setEvents', 'fetchEvents'],
    //     storage: AppAsyncStorage,
    // });

export default EventsModel;
