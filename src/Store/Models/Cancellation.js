/* eslint-disable prettier/prettier */
import { action, Action, persist, Thunk, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { GET_CANCELLATIONS, GET_EVENTS } from "../../Apollo/Queries";
import { client } from "../../Apollo/apolloClient";

const CancellationModel = 
// persist(
    {
    cancellations: [],
    currentCancellations: [],
    setCancellations: action((state, payload) => {
        state.cancellations = payload;
    }),
    setCurrentCancellation: action((state, payload) => {
        state.currentCancellations = payload;
    }),
    fetchCancellations: thunk(async (actions, payload, helpers) => {
        const { upcoming, limit, page } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.query({
                query: GET_CANCELLATIONS,
                variables: { upcoming, limit, page },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    },
                },
            });
            if (data?.cancellations.items && Array.isArray(data?.cancellations.items)) {
                actions.setCancellations(data.cancellations.items);
            } else {
                throw new Error("Cancellations not found")
            }
        } catch (err) {
            console.log("Error fetchCancellations", err.toString());
            throw new Error("Error fetchCancellations", err.toString())
        }
    }),
};
    // {
    //     allow: ['cancellations', 'currentCancellations'],
    //     deny: ['setCancellations', 'fetchCancellations', 'setCurrentCancellation'],
    //     storage: AppAsyncStorage,
    // });

export default CancellationModel;
