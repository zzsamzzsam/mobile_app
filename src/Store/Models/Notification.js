/* eslint-disable prettier/prettier */
import { action, persist, thunk } from "easy-peasy";
import { UPDATE_NOTIFICATION } from "../../Apollo/Mutations/User";
import { client } from "../../Apollo/apolloClient";
import { GET_ME_USER } from "../../Apollo/Queries";

const NotificationModel =
// persist(
{
    notificationTypes: [],
    notificationCategories: [],
    setNotificationTypes: action((state, payload) => {
        state.notificationTypes = payload;
    }),
    setNotificationCategories: action((state, payload) => {
        state.notificationCategories = payload;
    }),
    updateAppNotification: thunk(async (actions, payload, helpers) => {
        const { input } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_NOTIFICATION,
                variables: { input },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
                fetchPolicy: 'network-only',
                refetchQueries: [{ query: GET_ME_USER }],
            });
            if (data?.updateAppNotificationSetting) {
                actions.setActualUser(data?.updateAppNotificationSetting)
            } else {
                throw new Error("Error on updating notification");
            }
        } catch (err) {
            console.log("Error updateAppNotification", err.toString());
            throw new Error("Error updateAppNotification", err.toString());
        }
    }),
};
// {
//     allow: ['notificationTypes', 'notificationCategories'],
//     deny: ['setNotificationCategories', 'setNotificationTypes', 'updateAppNotification'],
//     storage: AppAsyncStorage,
// });

export default NotificationModel;
