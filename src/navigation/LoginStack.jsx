/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import LinkMore from '../screens/Events/LInkMore';
import Unlink from '../screens/Events/Unlink';
import { TopLogo } from '../components/common/Header/TopLogo';
import Routes from './Routes';
import { HeaderBack } from '../components/common/Header/HeaderBack';
import Signup from '../screens/Login/Signup';

const NavStack = createStackNavigator();

const LoginStack = () => {
    return (
        <NavStack.Navigator
            initialRouteName={Routes.LOGIN}
        >
            <NavStack.Screen
                name={Routes.LOGIN}
                component={Login}
                options={{
                    headerTitle: () => (<TopLogo />),
                    headerTitleAlign: 'center',
                    headerLeft: () => null,
                    headerTitleContainerStyle: {
                        paddingVertical: 0,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                }}
            />
            <NavStack.Screen
                name={Routes.SIGNUP}
                component={Signup}
                options={{
                    headerTitle: () => (<TopLogo />),
                    headerTitleAlign: 'center',
                    // headerShown: false,
                    headerLeft: HeaderBack,
                    // headerBackTitle: null,
                    headerTitleContainerStyle: {
                        paddingVertical: 0,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                }}
            />
            <NavStack.Screen
                name={Routes.LINKEVENT}
                component={LinkMore}
                options={{
                    title: null,
                    headerBackTitleVisible: false,
                    headerLeft: () =>  <HeaderBack />
                }}
            />
            <NavStack.Screen
                name={Routes.UNLINKEVENT}
                component={Unlink}
                options={{
                    title: null,
                    headerBackTitleVisible: false,
                    headerLeft: () =>  <HeaderBack />
                }}
            />
        </NavStack.Navigator>
    );
};

export default LoginStack;
