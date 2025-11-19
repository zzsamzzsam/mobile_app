/* eslint-disable prettier/prettier */
import { action, persist, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { client } from "../../Apollo/apolloClient";
import { UPDATE_ACTIVITIES } from "../../Apollo/Mutations/User";
import { GET_ME_USER } from "../../Apollo/Queries";

const ActivitiesModel = persist({
    activities: [],
    setActivities: action((state, payload) => {
        state.activities = payload;
    }),
    updateUserActivities: thunk(async (actions, payload, helpers) => {
        const { input } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Missing credential")
        }
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_ACTIVITIES,
                variables: { input },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (!data?.updateEZAppUserInfo && !Array.isArray(data?.updateEZAppUserInfo?.activities)) {
                throw new Error("Error on updating notification");
            }
        } catch (err) {
            console.log("Error update activitiesss", err.toString());
            throw new Error("Error activitiesss", err.toString());
        }
    }),
},
    {
        allow: ['activities'],
        deny: ['setActivities', 'updateUserActivities'],
        storage: AppAsyncStorage,
    });

export default ActivitiesModel;
