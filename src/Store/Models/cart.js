/* eslint-disable prettier/prettier */
import { action, persist, thunk } from "easy-peasy";
import AsyncStorage from "../../Services/AsyncStorage";
import axios from 'axios';

const CartModel = persist({
    currentRestaurant: null,
    items: [],
    orderCart: {
        orderType: {},
        lineItems: [],
    },
    restaurants: [],
    setRestaurants: action((state, payload) => {
        state.restaurants = payload;
    }),
    menus: {},
    setMenus: action((state, payload) => {
        state.menus = payload;
    }),
    fetchRestaurants: thunk(async (actions, payload, helpers) => {
        try {
            const api1 = `https://www.clover.com/oloservice/v1/merchants/QZFZ8SDWY3DV1`;
            const api2 = `https://www.clover.com/oloservice/v1/merchants/NK0PVENK3C481`;
            const api3 = `https://www.clover.com/oloservice/v1/merchants/KKA9VYYW593D1`;
            
            const [response1, response2, response3] = await Promise.all([
                axios.get(api1),
                axios.get(api2),
                axios.get(api3),
            ]);
            const combined = [];
            if (response1?.data?.merchantUuid) {
                combined.push({
                    ...response1?.data,
                })
            }
            if (response2?.data?.merchantUuid) {
                combined.push({
                    ...response2?.data,
                })
            }
            if (response3?.data?.merchantUuid) {
                combined.push({
                    ...response3?.data,
                })
            }
            actions.setRestaurants(combined);
        } catch (err) {
            console.log("Error fetchRestaurants", err.toString());
            throw new Error("Error fetchRestaurants", err.toString())
        }
    }),
    fetchMenus: thunk(async (actions, payload, helpers) => {
        try {
            const api1 = `https://www.clover.com/oloservice/v1/merchants/QZFZ8SDWY3DV1/menu?orderType=PICKUP`;
            const api2 = `https://www.clover.com/oloservice/v1/merchants/NK0PVENK3C481/menu?orderType=PICKUP`;
            const api3 = `https://www.clover.com/oloservice/v1/merchants/KKA9VYYW593D1/menu?orderType=PICKUP`;
            
            const [response1, response2, response3] = await Promise.all([
                axios.get(api1),
                axios.get(api2),
                axios.get(api3),
            ]);
            const combined = {};
            if (response1?.data?.categories) {
                combined["QZFZ8SDWY3DV1"] = response1.data
            }
            if (response2?.data?.categories) {
                combined["NK0PVENK3C481"] = response2.data
            }
            if (response3?.data?.categories) {
                combined["KKA9VYYW593D1"] = response3.data
            }
            actions.setMenus(combined);
        } catch (err) {
            console.log("Error fetchRestaurants", err.toString());
            throw new Error("Error fetchRestaurants", err.toString())
        }
    }),
    addToCart: action((state, payload) => {
        state.orderCart.lineItems.push(payload);
    }),
    addOrderType: action((state, payload) => {
        state.orderCart.orderType = payload;
    }),
    removeFromCart: action((state, payload) => {
        const { id } = payload;
        const index = state.orderCart.lineItems.findIndex(x => x?.id === id);
        state.orderCart.lineItems.splice(index, 1);
    }),
    removeItemById: action((state, payload) => {
        const { id } = payload;
        state.orderCart.lineItems = state.orderCart?.lineItems.filter(x => x.id !== id);
    }),
    clearCart: action((state) => {
        state.orderCart.orderType = null;
        state.orderCart.lineItems = [];
    }),
    setCurrentRestaurant: action((state, payload) => {
        state.currentRestaurant = payload;
    }),
},
    {
        allow: [''],
        deny: ['addToCart', 'clearCart', 'fetchRestaurants', 'setRestaurants', 'fetchMenus', 'setMenus'],
        storage: AsyncStorage,
    }
);

export default CartModel;
