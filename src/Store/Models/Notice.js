/* eslint-disable prettier/prettier */
import { action, Action, persist, Thunk, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { GET_NOTICES } from "../../Apollo/Queries";
import { client } from "../../Apollo/apolloClient";

const NoticeModel = 
// persist(
    {
    notices: [],
    fetchingNotice: [],
    currentNotices: null,
    setNotices: action((state, payload) => {
        // state.notices = payload;
        state.notices = [...state.notices, ...payload.filter(s => {
            return !state.notices.some(item => item.itemId !== s.itemId);
        })];
    }),
    setFetchingNotice: action((state, payload) => {
        state.fetchingNotice = payload;
    }),
    setCurrentNotices: action((state, payload) => {
        state.currentNotices = payload;
    }),
    fetchNotices: thunk(async (actions, payload, helpers) => {
        try {
            actions.setFetchingNotice(true);
            const { upcoming, limit, page } = payload;
            const { login: { userToken } } = helpers.getStoreState();
            if (!userToken) {
                throw new Error("Something Went Wrong")
            }

            const { data } = await client.query({
                query: GET_NOTICES,
                variables: { upcoming, limit, page },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (data?.latestNotices?.items && Array.isArray(data?.latestNotices.items)) {
                actions.setNotices(data.latestNotices.items);
                actions.setFetchingNotice(false);
            } else {
                throw new Error("Notices not found")
            }
        } catch (err) {
            actions.setFetchingNotice(false);
            console.log("Error fetchNotices", err.toString());
            throw new Error("Error fetchNotices", err.toString())
        }
    }),
};

    // {
    //     allow: ['notices', 'currentNotices', 'fetchingNotice'],
    //     deny: ['setCurrentNotices', 'setNotices', 'fetchNotices', 'setFetchingNotice'],
    //     storage: AppAsyncStorage,
    // });

export default NoticeModel;
