/* eslint-disable prettier/prettier */
import { useContext } from 'react';
import ThemeContext from './ThemeContext';

const useAppTheme = props => {
    return useContext(ThemeContext);
};

export default useAppTheme;
