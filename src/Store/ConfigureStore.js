/* eslint-disable prettier/prettier */
import { createStore } from 'easy-peasy';

export default (model) => {
    return createStore(model, {
        name: 'easystore',
    });
};
