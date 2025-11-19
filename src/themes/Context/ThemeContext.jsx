/* eslint-disable prettier/prettier */
import React, { useState, useMemo } from 'react';
import { Appearance } from 'react-native';
import darkTheme from '../config/dark';
import defaultTheme from '../config/default';

const ThemeContext = React.createContext();

export const ThemeProvider = ({ theme, children }) => {
    const colorScheme = Appearance.getColorScheme();

    const systemTheme = useMemo(() => {
        const isDark = true;
        return isDark ? darkTheme : defaultTheme;
    }, [colorScheme]);

    const [themeObj, changeTheme] = useState(theme || systemTheme);

    const setTheme = t => {
        changeTheme(t);
    };
    const contextValue = useMemo(
        () => ({
            theme: themeObj,
            toggleTheme: () => {
                if (themeObj.id === 1) {
                    setTheme(darkTheme);
                } else {
                    setTheme(defaultTheme);
                }
            },
        }),
        [themeObj],
    );
    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
