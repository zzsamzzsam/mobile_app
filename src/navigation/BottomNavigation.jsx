/* eslint-disable prettier/prettier */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useMemo } from 'react';
// import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/Ionicons';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome6';
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5';
import { BarcodeScreen } from '../screens/Barcode/BarcodeScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import { HeaderTitle, TopLogo } from '../components/common/Header/TopLogo';
import Routes from './Routes';
import colors from '../themes/Colors';
import ScheduleTopStack from './ScheduleTopStack';
// import NewAccountScreen from '../screens/Account/NewAccountScreen';
import metrics from '../themes/Metrics';
import Animated from 'react-native-reanimated';
import Fonts from '../themes/Fonts';
// import VideoScreen from '../screens/Video/VideoScreen';
// import FoodScreen from '../screens/Food/FoodScreen';
// import { Box } from 'native-base';
import GetFitTopTabs from './GetFitTopTabs';
// import FoodTopNab from './FootTopNab';
import HealthHomeScreen from './HealthHomeNew';
// import ChatScreen from '../screens/Chat';
import { GET_CHANNELS_UNREAD } from '../Apollo/Queries/Channel';
import { useQuery } from '@apollo/client';
// import { useStoreState } from 'easy-peasy';


const Tab = createBottomTabNavigator();

const BottomNavigation = ({ navigation }) => {
  const {data, loading: channelLoading} = useQuery(GET_CHANNELS_UNREAD, {
    fetchPolicy: 'cache-and-network',
  });
  const unreadCount = useMemo(() => {
    return (data?.channels || []).reduce((accu, cur) => {
      return accu + (cur?.unreadCount || 0);
    }, 0)
  }, [data]);
  const getHomeIcon = focused => {
    const scale = focused ? 1.2 : 1;
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon
          name={focused ? 'home' : 'home-outline'}
          size={20}
          color={focused ? colors.secondary : colors.primary}
        />
      </Animated.View>
    );
  };

  const getBarcodeIcon = focused => {
    const scale = focused ? 1.2 : 1;
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon
          name={focused ? 'credit-card-scan' : 'credit-card-scan-outline'}
          size={20}
          color={focused ? colors.secondary : colors.primary}
        />
      </Animated.View>
    );
  };

  const getScheduleIcon = focused => {
    const scale = focused ? 1.2 : 1;
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <IonIcon
          name={focused ? 'calendar' : 'calendar-outline'}
          size={20}
          color={focused ? colors.secondary : colors.primary}
        />
      </Animated.View>
    );
  };

  const getAccountIcon = focused => {
    const scale = focused ? 1.2 : 1;
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <IonIcon
          name={focused ? 'person' : 'person-outline'}
          size={20}
          color={focused ? colors.secondary : colors.primary}
        />
      </Animated.View>
    );
  };
  const getFoodIcon = focused => {
    const scale = focused ? 1.2 : 1;
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <IonIcon
          name={focused ? 'fast-food' : 'fast-food-outline'}
          size={20}
          color={focused ? colors.secondary : colors.primary}
        />
      </Animated.View>
    );
  };
  const getVideoIcon = focused => {
    const scale = focused ? 1.2 : 1;
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <FontAwesomeIcon5
          name={focused ? 'video' : 'video'}
          size={20}
          color={focused ? colors.secondary : colors.primary}
        />
      </Animated.View>
    );
  };
  const getFitnessIcon = focused => {
    const scale = focused ? 1.2 : 1;
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <FontAwesomeIcon5
          name={focused ? 'dumbbell' : 'dumbbell'}
          size={20}
          color={focused ? colors.secondary : colors.primary}
        />
      </Animated.View>
    );
  };
  const getChatIcon = focused => {
    const scale = focused ? 1.2 : 1;
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <IonIcon
          name={focused ? 'chatbubble-outline' : 'chatbubble-outline'}
          size={20}
          color={focused ? colors.secondary : colors.primary}
        />
      </Animated.View>
    );
  };
  return (
    <Tab.Navigator
      initialRouteName={Routes.HOME}
      screenOptions={{
        headerShown: false,
        headerTitleContainerStyle: {
          paddingVertical: 0,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: metrics.s10,
          fontFamily: Fonts.medium,
          marginBottom: metrics.s5,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.primary,
        tabBarStyle: {paddingTop: metrics.s5},
      }}>
      <Tab.Screen
        name={Routes.HOME}
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: true,
          headerTitle: () => <HeaderTitle navigation={navigation} />,
          headerTitleAlign: 'center',
          tabBarIcon: ({focused}) => getHomeIcon(focused),
        }}
      />
      <Tab.Screen
        name={Routes.BARCODE}
        component={BarcodeScreen}
        options={{
          title: 'Barcode',
          headerShown: true,
          headerTitle: () => <TopLogo />,
          headerTitleAlign: 'center',
          tabBarIcon: ({focused}) => getBarcodeIcon(focused),
        }}
      />
      <Tab.Screen
        name={Routes.SCHEDULETOPSTACK}
        component={ScheduleTopStack}
        options={{
          title: 'Schedule',
          headerShown: true,
          headerTitle: () => <TopLogo />,
          headerTitleAlign: 'center',
          tabBarIcon: ({focused}) => getScheduleIcon(focused),
        }}
      />
      {/* <Tab.Screen */}

      <Tab.Screen
        name={Routes.HEALTH_HOME}
        component={HealthHomeScreen}
        options={{
          title: 'Health',
          headerShown: false,
          headerTitle: () => <TopLogo />,
          headerTitleAlign: 'center',
          tabBarIcon: ({focused}) => getFitnessIcon(focused),
        }}
      />
      <Tab.Screen
        name={Routes.GETFITTAB}
        component={GetFitTopTabs}
        options={{
          title: 'Video',
          headerShown: true,
          headerTitle: () => <TopLogo />,
          headerTitleAlign: 'center',
          tabBarIcon: ({focused}) => getVideoIcon(focused),
          tabBarIcon: ({focused}) => getVideoIcon(focused),
        }}
      />
      {/* <Tab.Screen
        name={Routes.FOOD}
        component={FoodTopNab}
        options={{
          title: 'Food',
          headerShown: true,
          headerTitle: () => <TopLogo />,
          headerTitleAlign: 'center',
          tabBarIcon: ({focused}) => getFoodIcon(focused),
        }}
      /> */}
      {/* <Tab.Screen
        name={Routes.CHATSCREEN}
        component={ChatScreen}
        options={{
          title: 'Chat',
          headerShown: true,
          headerTitle: () => <TopLogo />,
          headerTitleAlign: 'center',
          tabBarBadge: unreadCount || null,
          tabBarBadgeStyle: {
            color: colors.secondary,
            backgroundColor: colors.primary,
          },
          tabBarIcon: ({focused}) => getChatIcon(focused),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default BottomNavigation;
