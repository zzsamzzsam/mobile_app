/* eslint-disable prettier/prettier */
import React from 'react';
import Routes from './Routes';
import metrics from '../themes/Metrics';
import Fonts from '../themes/Fonts';
import MyScheduleScreen from '../screens/Schedule/MyScheduleScreen';
import ScheduleScreen from '../screens/Schedule/ScheduleScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import colors from '../themes/Colors';
import VideoScreen from '../screens/Video/VideoScreen';
import ExerciseScreen from '../screens/Video/ExerciseScreen';
import ConnectScreen from '../screens/Video/ConnectScreen';
const NavStack = createMaterialTopTabNavigator();

const GetFitTopTabs = () => {
    return (
        <NavStack.Navigator
            initialRouteName={Routes.VIDEO}
            screenOptions={{
                headerShown: true,
                tabBarLabelStyle: {
                    fontSize: metrics.s14,
                    fontFamily: Fonts.medium,
                    textTransform: 'none',
                },
                tabBarActiveTintColor: colors.secondary,
                tabBarPressColor: colors.secondary,
                tabBarIndicatorStyle: {
                    height: 2,
                    backgroundColor: colors.secondary,
                },
                tabBarInactiveTintColor: colors.primary,
                swipeEnabled: false,
            }}>
            <NavStack.Screen
                name={Routes.VIDEO}
                component={VideoScreen}
                options={{ title: 'Videos' }}
            />
            {/* <NavStack.Screen
                name={Routes.EXERCISE}
                component={ExerciseScreen}
                options={{ title: 'Exercises' }}
            />
            <NavStack.Screen
                name={Routes.CONNECT}
                component={ConnectScreen}
                options={{ title: 'Connect' }}
            /> */}
        </NavStack.Navigator>
    );
};

export default GetFitTopTabs;