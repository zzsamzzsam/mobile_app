/* eslint-disable prettier/prettier */
import { createStackNavigator } from '@react-navigation/stack'
import React, { useMemo } from 'react'
import NotificationPreferences from '../screens/OnBoarding/NotificationPreferences';
import ActivitiesPreferences from '../screens/OnBoarding/ActivitiesPreferences';
import KeyTagNumber from '../screens/OnBoarding/KeyTagNumber';
import CityOrWalking from '../screens/OnBoarding/CityOrWalking';
import TakeStudentId from '../screens/OnBoarding/TakeStudentId';
import UTSC_Student_Staff from '../screens/OnBoarding/UTSCStudentOrStaff';
import MembershipContractStatus from '../screens/OnBoarding/MembershipContractStatus';
import MLinkComptScreen from '../screens/OnBoarding/MLinkComptScreen';
import Routes from './Routes';
import { HeaderBack } from '../components/common/Header/HeaderBack';
import { TopLogo } from '../components/common/Header/TopLogo';
import UpdateUserScreen from '../screens/OnBoarding/UpdateUserScreen';
import OnboardingLanding from '../screens/OnBoarding/OnboardingLanding';
import OnboardingFinalPage from '../screens/OnBoarding/OnboardingFinalPage';
import LinkStudentCardScreen from '../screens/OnBoarding/LinkSutdentCardScreen';

const Stack = createStackNavigator();
const BoardedStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.ONBOARDINGLANDING}
      screenOptions={{
        title: null,
        headerBackTitleVisible: false,
        headerLeft: () => <HeaderBack />,
      }}>
      <Stack.Screen
        name={Routes.ONBOARDINGLANDING}
        component={OnboardingLanding}
        options={{
          headerTitle: () => <TopLogo />,
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
      <Stack.Screen
        name={Routes.UPDATEUSER}
        component={UpdateUserScreen}
      />
      <Stack.Screen
        name={Routes.ONBOARDING_FINAL_PAGE}
        component={OnboardingFinalPage}
      />
      <Stack.Screen
        name={Routes.MEMBERSHIPCONTRACT}
        component={MembershipContractStatus}
        options={{
        }}
      />
      <Stack.Screen
        name={Routes.MLINKCOMPSCREEN}
        component={MLinkComptScreen}
      />
      <Stack.Screen
        name={Routes.ASKUTSCSTUDENTORSTAFF}
        component={UTSC_Student_Staff}
      />
      <Stack.Screen
        name={Routes.LINKSTUDENTCARD}
        component={LinkStudentCardScreen}
      />
      <Stack.Screen
        name={Routes.LINKSTUDENTORSTAFFCARD}
        component={TakeStudentId}
      />
      <Stack.Screen
        name={Routes.ASKTCITYORWALKING}
        component={CityOrWalking}
      />
      <Stack.Screen name={Routes.LINKTAGNUMBER} component={KeyTagNumber} />
      <Stack.Screen
        name={Routes.NOTIFICATIONPREF}
        component={NotificationPreferences}
      />
      <Stack.Screen
        name={Routes.ACTIVITIESPREF}
        component={ActivitiesPreferences}
      />
    </Stack.Navigator>
  );
}

export default BoardedStack
