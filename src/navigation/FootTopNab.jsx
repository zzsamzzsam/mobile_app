/* eslint-disable prettier/prettier */
import React from 'react';
import Routes from './Routes';
import metrics from '../themes/Metrics';
import Fonts from '../themes/Fonts';
import MyScheduleScreen from '../screens/Schedule/MyScheduleScreen';
import ScheduleScreen from '../screens/Schedule/ScheduleScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import colors from '../themes/Colors';
import FoodScreen from '../screens/Food/FoodScreen';
import OrderedHistoryScreen from '../screens/Food/OrderedHistoryScreen';
const NavStack = createMaterialTopTabNavigator();

const FoodTopNab = () => {
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
                name={Routes.FOODSCREEN}
                component={FoodScreen}
                options={{ title: 'Restaurants' }}
            />
            <NavStack.Screen
                name={Routes.ORDEREDHISTORY}
                component={OrderedHistoryScreen}
                options={{ title: 'Order History' }}
            />
        </NavStack.Navigator>
    );
};

export default FoodTopNab;