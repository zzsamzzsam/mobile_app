/* eslint-disable prettier/prettier */
import { action, Action, persist, Thunk, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { GET_EVENTS, GET_ME_USER, GET_MY_FAVOURITE_SCHEDULES, GET_MY_SCHEDULES, GET_SCHEDULES } from "../../Apollo/Queries";
import { client } from "../../Apollo/apolloClient";
import { ADD_FAVOURITE, BOOK_SCHEDULE, CANCLE_BOOK_SCHEDULE, REMOVE_FAVOURITE, WAIT_LIST_SCHEDULE } from "../../Apollo/Mutations";
import { initialScheduleFilters } from "../../constant";
import { defaultParking } from "../../utils/constants";
import { GET_PARKING } from "../../Apollo/Queries/GetParking";


const ScheduleModel = persist({
    schedules: [],
    currentSchedules: null,
    mySchedules: [],
    myFavouriteSchedules: [],
    fetchMyScheduleAfterRemove: false,
    fetchMyFavouriteUpcoming: false,
    scheduleFilters: initialScheduleFilters,
    showAllowedScheduleByBarcode: false,

    setSchedules: action((state, payload) => {
        state.schedules = payload;
    }),
    setMySchedule: action((state, payload) => {
        state.mySchedules = payload;
    }),
    setMyFavouriteSchedules: action((state, payload) => {
        state.myFavouriteSchedules = payload;
    }),
    setCurrentSchedules: action((state, payload) => {
        state.currentSchedules = payload;
    }),
    setFetchMyFavouriteUpcoming: action((state, payload) => {
        state.fetchMyFavouriteUpcoming = !state.fetchMyFavouriteUpcoming;
    }),
    setScheduleFilters: action((state, payload) => {
        state.scheduleFilters = payload;
    }),
    setShowAllowedScheduleByBarcode: action((state, payload) => {
        state.showAllowedScheduleByBarcode = payload;
    }),
    setFetchMyScheduleAfterRemove: action((state, payload) => {
        state.fetchMyScheduleAfterRemove = !state.fetchMyScheduleAfterRemove;
    }),
    fetchSchedules: thunk(async (actions, payload, helpers) => {
        const { startDate, endDate, limit, page } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.query({
                query: GET_SCHEDULES,
                variables: { startDate, endDate, limit, page },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (data?.appSchedules.items && Array.isArray(data?.appSchedules.items)) {
                actions.setSchedules(data.appSchedules.items);
            } else {
                throw new Error("Schedules not found")
            }
        } catch (err) {
            console.log("Error fetchSchedules", err.toString());
            throw new Error("Error fetchSchedules", err.toString())
        }
    }),
    removeFromWaitList: thunk(async (actions, payload, helpers) => {
        const { scheduleId, bookingId } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.mutate({
                mutation: CANCLE_BOOK_SCHEDULE,
                variables: { scheduleId, bookingId },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (!data?.cancelBookedEzSessionFromApp) {
                throw new Error("Error in removeFromBook")
            }
        } catch (err) {
            console.log("Error removeFromBook", err.toString());
            throw new Error("Error removeFromBook", err.toString())
        }
    }),
    fetchMySchedules: thunk(async (actions, payload, helpers) => {
        const { startDate, endDate, page } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.query({
                query: GET_MY_SCHEDULES,
                variables: { startDate, endDate, page },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (data?.myEzSchedule?.myEzSchedule && Array.isArray(data?.myEzSchedule.myEzSchedule)) {
                actions.setMySchedule(data.myEzSchedule.myEzSchedule);
            } else {
                throw new Error("Schedules not found")
            }
        } catch (err) {
            let errMsg = err ? err?.toString()?.split(":")[1] : "wow";
            console.log("Error fetchMySchedules", err.toString());
            throw new Error(errMsg)
        }
    }),
    fetchMyFavouriteSchedules: thunk(async (actions, payload, helpers) => {
        const { startDate, endDate, limit, page } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        if (!userToken) {
            throw new Error("Something Went Wrong")
        }
        try {
            const { data } = await client.query({
                query: GET_MY_FAVOURITE_SCHEDULES,
                variables: { startDate, endDate, limit, page },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (data?.getFavouriteSchedules?.items && Array.isArray(data?.getFavouriteSchedules?.items)) {
                actions.setMyFavouriteSchedules(data?.getFavouriteSchedules?.items);
            } else {
                throw new Error("Schedules not found")
            }
        } catch (err) {
            let errMsg = err ? err?.toString()?.split(":")[1] : "wow";
            console.log("Error fetchMyFavouriteSchedules", err.toString());
            throw new Error(errMsg)
        }
    }),
    parking: defaultParking,
    setParking: action((state, payload) => {
        state.parking = payload;
    }),
    fetchParking: thunk(async (actions, payload, helpers) => {
        try {
            const { login: { userToken } } = helpers.getStoreState();
            if (!userToken) {
                throw new Error("Something Went Wrong")
            }

            const { data } = await client.query({
                fetchPolicy: 'network-only',
                query: GET_PARKING,
                variables: {},
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if(data?.parkingTemp?.data) {
                actions.setParking(data?.parkingTemp?.data);
            }
        } catch (err) {
            console.log("Error fetchParking", err);
            throw new Error("Error fetchParking", err.toString())
        }
    }),
},
    {
        allow: ['schedules', 'currentSchedules', 'mySchedules', 'myFavouriteSchedules'],
        deny: ['fetchMySchedules', 'fetchSchedules', 'removeFromWaitList', 'setCurrentSchedules', 'setMySchedule', 'setMyFavouriteSchedules', 'fetchMyFavouriteSchedules', 'fetchParking', 'setParking'],
        storage: AppAsyncStorage,
    });

export default ScheduleModel;
