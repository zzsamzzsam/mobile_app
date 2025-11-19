/* eslint-disable prettier/prettier */
import { action, Action, persist, thunk } from "easy-peasy";
import AppAsyncStorage from "../../Services/AsyncStorage";
import { GET_NEWS } from "../../Apollo/Queries";
import { client } from "../../Apollo/apolloClient";

const NewsModel =
// persist(
{
    news: [],
    newsLoading: false,
    currentNews: null,
    setNews: action((state, payload) => {
        state.news.filter((item, idx, array) => (
            array.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(item)) === idx
        ));
        state.news = payload;
    }),
    setCurrentNews: action((state, payload) => {
        state.currentNews = payload;
    }),
    setNewsLoading: action((state, payload) => {
        state.newsLoading = payload;
    }),
    fetchNews: thunk(async (actions, payload, helpers) => {
        const { upcoming, limit, page } = payload;
        const { login: { userToken } } = helpers.getStoreState();
        try {
            actions.setNewsLoading(true)
            if (!userToken) {
                throw new Error("Missing credential")
            }
            const { data } = await client.query({
                query: GET_NEWS,
                variables: { upcoming, limit, page },
                context: {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                },
            });
            if (data?.news.items && Array.isArray(data?.news.items)) {
                actions.setNews(data.news.items);
                actions.setNewsLoading(false)
            } else {
                throw new Error("News not found")
            }
        } catch (err) {
            actions.setNewsLoading(false)
            console.log("Error fetchNews", err.toString());
            throw new Error("Error fetchNews", err.toString())
        }
    }),
};
// {
//     allow: ['news', 'currentNews'],
//     deny: ['setNews', 'fetchNews', 'setCurrentNews'],
//     storage: AppAsyncStorage,
// });

export default NewsModel;
