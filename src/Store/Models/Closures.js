/* eslint-disable prettier/prettier */
import { action, Action, persist, Thunk, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { GET_CLOSURES, GET_NEWS } from "../../Apollo/Queries";
import { client } from "../../Apollo/apolloClient";

const ClosureModel =
// persist(
{
    closures: [],
    currentClosure: null,
    setClosures: action((state, payload) => {
        state.closures = payload;
    }),
    setCurrentClosures: action((state, payload) => {
        state.currentClosure = payload;
    }),
    fetchClosures: thunk(async (actions, payload, helpers) => {
        const { upcoming, limit, page } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.query({
                query: GET_CLOSURES,
                variables: { upcoming, limit, page },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (data?.closures?.items && Array.isArray(data?.closures.items)) {
                actions.setClosures(data.closures.items);
            } else {
                throw new Error("Closures not found")
            }
        } catch (err) {
            console.log("Error fetchClosures", err);
            throw new Error("Error fetchClosures", err)
        }
    }),
};
// {
//     allow: ['closures', 'currentClosure'],
//     deny: ['setClosures', 'setCurrentClosures', 'fetchClosures'],
//     storage: AppAsyncStorage,
// });

export default ClosureModel;
