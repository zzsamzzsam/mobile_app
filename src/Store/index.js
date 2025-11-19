/* eslint-disable prettier/prettier */
import ConfigureStore from './ConfigureStore';
import model from './Models';
// import Api from '../Services/Api';
// import { persist } from 'easy-peasy';

let store = null;
// let apiClient = null;

const createStore = () => {

    // apiClient = Api.createApiClient();
    store = ConfigureStore(model);
    return store;
};

// 👇 Kickoff our StoreCreater and store instance

export default createStore;
export { store as StoreService };
