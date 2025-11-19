/* eslint-disable prettier/prettier */
import { useContext } from 'react';
import AppStateContext from './AppContext';

const useAuth = () => {
    return useContext(AppStateContext);
};

export default useAuth;
