/* eslint-disable prettier/prettier */
import React from 'react';
import Routes from './Routes';
import metrics from '../themes/Metrics';
import Fonts from '../themes/Fonts';
import MyScheduleScreen from '../screens/Schedule/MyScheduleScreen';
import ScheduleScreen from '../screens/Schedule/ScheduleScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import colors from '../themes/Colors';
const NavStack = createMaterialTopTabNavigator();

const ScheduleTopStack = () => {
    return (
        <NavStack.Navigator
            initialRouteName={Routes.SCHEDULE}
            screenOptions={{
                headerShown: true,
                tabBarLabelStyle: {
                    // color: colors.primary,
                    fontSize: metrics.s14,
                    fontFamily: Fonts.medium,
                },
                tabBarActiveTintColor: colors.secondary,
                tabBarPressColor: colors.secondary,
                tabBarIndicatorStyle: {
                    height: 2,
                    backgroundColor: colors.secondary,
                },
                tabBarInactiveTintColor: colors.primary
            }}>
            <NavStack.Screen
                name={Routes.SCHEDULE}
                component={ScheduleScreen}
                options={{ title: 'Schedule' }}
            />
            <NavStack.Screen
                name={Routes.MYSCHEDULE}
                component={MyScheduleScreen}
                options={{ title: 'My Schedule' }}
            />
        </NavStack.Navigator>
    );
};

export default ScheduleTopStack;