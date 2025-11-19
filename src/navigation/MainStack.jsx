/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavigation from './BottomNavigation';
import { BarcodeHomeScreen } from '../screens/Barcode/BarcodeScreen';;
import NotificationScreen from '../screens/Notification/Notification';
import Routes from './Routes';
import AfterBarcodeLink from '../screens/Barcode/AfterBarcodeScreen';
import AfterUnlink from '../screens/Barcode/AfterUnlink';
import NoticeScreen from '../screens/Notice/NoticeScreen';
import NoticeDetailScreen from '../screens/Notice/NoticeDetailScreen';
import ScheduleDetail from '../screens/Schedule/ScheduleDetail';
import { HeaderBack } from '../components/common/Header/HeaderBack';
import SingleNews from '../screens/Home/SingleNews';
import NewAccountScreen from '../screens/Account/NewAccountScreen';
import DeleteUser from '../screens/Account/DeleteUser';
import LoadingCircle from '../components/LoadingCircle';
import TakeStudentId from '../screens/OnBoarding/TakeStudentId';
import KeyTagNumber from '../screens/OnBoarding/KeyTagNumber';
import FilterScreen from '../screens/Filter/FilterScreen';
import ActivitiesPreferences from '../screens/OnBoarding/ActivitiesPreferences';
import EventScreen from '../screens/Home/EventScreen';
import InterruptionScreen from '../screens/Home/InterruptionScreen';
import UpcomingFavouriteScheduleScreen from '../screens/Home/UpcomingFavouriteScheduleScreen';
import { useQuery } from '@apollo/client';
import { GET_ME_USER } from '../Apollo/Queries';
import Fonts from '../themes/Fonts';
import colors from '../themes/Colors';
import OrderMenuScreen from '../screens/Food/OrderMenuScreen';
import AddToCart from '../screens/Food/AddToCart';
import CheckoutScreen from '../screens/Food/CheckoutScreen';
import WatchSettings from '../components/health/WatchSettings';
import FriendlierScreen from '../screens/Food/FriendlierScreen';
import SingleChatScreen from '../screens/Chat/SingleChatScreen';
import UserSearchScreen from '../screens/Chat/UserSearchScreen';
import WebviewScreen from '../screens/Misc/WebviewScreen';

const NavStack = createStackNavigator();
const MainStack = ({ navigation }) => {
    // const { actualUser } = useStoreState((state) => ({
    //     actualUser: state.login.actualUser,
    // }));
    const { data } = useQuery(GET_ME_USER);

    return (
        <>
            {
                data?.meAppUser ?
                    (
                        <NavStack.Navigator
                            initialRouteName={Routes.BOTTOMTAB}
                            screenOptions={{
                                headerShown: false,
                            }}
                        >
                            <NavStack.Screen
                                name={Routes.BOTTOMTAB}
                                component={BottomNavigation}
                                options={{ headerShown: false }}
                            />
                            {/* <NavStack.Screen
                                name={Routes.UNBOARDINGSTACK}
                                component={BoardedStack}
                                options={{ headerShown: false }}
                            /> */}
                            <NavStack.Screen
                                name={'new'}
                                component={NewAccountScreen}
                                options={{ headerShown: false }}
                            />
                            <NavStack.Screen
                                name={Routes.SCHEDULEDETAIL}
                                component={ScheduleDetail}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.ACCOUNT}
                                component={NewAccountScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: 'Profile',
                                    headerTitleAlign: 'center',
                                    headerTitleStyle: { fontSize: 16, fontFamily: Fonts.book, fontWeight: 700, color: colors.primary },
                                    headerBackTitleVisible: false,
                                }}
                            />

                            <NavStack.Screen
                                name={Routes.HOMEBARCODE}
                                component={BarcodeHomeScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.LINKBARCODE}
                                component={AfterBarcodeLink}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />

                            <NavStack.Screen
                                name={Routes.UNLINKBARCODE}
                                component={AfterUnlink}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.NOTIFICATION}
                                component={NotificationScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.NOTICE}
                                component={NoticeScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: 'Notifications',
                                    headerTitleAlign: 'center',
                                    headerTitleStyle: { fontSize: 16, fontFamily: Fonts.book, fontWeight: 700, color: colors.primary },
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.NOTICEDETAIL}
                                component={NoticeDetailScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                             <NavStack.Screen
                                name={Routes.FRIENDLIER}
                                component={FriendlierScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                             <NavStack.Screen
                                name={Routes.WEBVIEWSCREEN}
                                component={WebviewScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.SINGLENEWS}
                                component={SingleNews}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.DELETEUSER}
                                component={DeleteUser}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.LINKSTUDENTORSTAFFCARDFROMHOME}
                                component={TakeStudentId}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.LINKTAGNUMBERFROMHOME}
                                component={KeyTagNumber}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.FILTER}
                                component={FilterScreen}
                                options={{
                                    headerShown: false,
                                    presentation: 'modal',
                                    cardStyle: {
                                        marginTop: '10%',
                                        backgroundColor: 'white',
                                    },
                                    cardOverlayEnabled: false,
                                    cardShadowEnabled: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.MYFAVOURITE}
                                component={ActivitiesPreferences}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.EVENTS}
                                component={EventScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.INTERRUPTIONS}
                                component={InterruptionScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.UPCOMINGFAVOURITES}
                                component={UpcomingFavouriteScheduleScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.ORDERMENU}
                                component={OrderMenuScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.ADDTOCART}
                                component={AddToCart}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: null,
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.CHECKOUT}
                                component={CheckoutScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: 'Checkout',
                                    headerTitleAlign:'center',
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.WATCH_SETUP}
                                component={WatchSettings}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: 'Watch Settings',
                                    headerTitleAlign:'center',
                                    title: null,
                                    headerBackTitleVisible: false,
                                }}
                            />
                             <NavStack.Screen
                                name={Routes.SINGLECHATSCREEN}
                                component={SingleChatScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerBackTitleVisible: false,
                                }}
                            />
                            <NavStack.Screen
                                name={Routes.USERSEARCHSCREEN}
                                component={UserSearchScreen}
                                options={{
                                    headerShown: true,
                                    headerLeft: HeaderBack,
                                    headerTitle: '',
                                }}
                            />
                        </NavStack.Navigator>
                    ) : (<LoadingCircle />)
            }
        </>
    )
};

export default MainStack;