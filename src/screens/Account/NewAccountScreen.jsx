/* eslint-disable prettier/prettier */
import { useNavigation } from '@react-navigation/native';
import { Avatar, Box, Divider, ScrollView } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import Routes from '../../navigation/Routes';
import { LogoutUserButton } from '../../components/DeleteButton';
import colors from '../../themes/Colors';
import AppText from '../../components/common/Text';
import { List } from 'react-native-paper';
import metrics from '../../themes/Metrics';
import LinearGradient from 'react-native-linear-gradient';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME_USER } from '../../Apollo/Queries';
import LoadingCircle from '../../components/LoadingCircle';
import AccrodianList from '../../components/common/AccrodianList';
import ButtonX from '../../components/common/BottonX';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Fonts from '../../themes/Fonts';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';
import { RESTART_UNBOARDING } from '../../Apollo/Mutations';
import { showMessage } from 'react-native-flash-message';
import codePush from 'react-native-code-push';

const CheckBoxMarkedIcon = ({ size = 14 }) => {
    return <Icons name="checkbox-marked-outline" color={colors.primary} size={size} />
}
const CheckBoxUnmarkedIcon = ({ size = 14 }) => {
    return (
        <Icons name="checkbox-blank-outline" color={colors.primary} size={size} />
    );
};
const NewAccountScreen = () => {
    const navigation = useNavigation();
    const { data: userData, loading } = useQuery(GET_ME_USER);
    const [restartUnBoardingMutation] = useMutation(RESTART_UNBOARDING, {
        refetchQueries: [{ query: GET_ME_USER }],
    });
    const [codePushVersion, setCodePushVersion] = useState(null);
    const getCodePushVersion = async () => {
      try {
        const localPackage = await codePush.getUpdateMetadata();
        if (localPackage) {
          setCodePushVersion(localPackage.label);
        } else {
          setCodePushVersion('N/A');
        }
      } catch (error) {
        console.error('Error getting CodePush version:', error);
      }
    };
    useEffect(() => {
      getCodePushVersion();
    }, []);
    const [restartLoading, setRestartLoading] = useState(false);
    const { showAllowedScheduleByBarcode, userToken } = useStoreState(state => ({
        showAllowedScheduleByBarcode: state.schedule.showAllowedScheduleByBarcode,
        userToken: state.login.userToken,
    }));
    const {
        fetchUser,
        setShowAllowedScheduleByBarcode,
    } = useStoreActions(action => ({
        fetchUser: action.login.fetchUser,
        setShowAllowedScheduleByBarcode: action.schedule.setShowAllowedScheduleByBarcode,
    }));

    const onOkPress = async () => {
        try {
            setRestartLoading(true);
            const { data } = await restartUnBoardingMutation({
                variables: {
                    _id: `${userData?.meAppUser?._id}`,
                },
            });
            if (data?.restartAppUnBoarding?.success) {
                setTimeout(() => {
                    fetchUser({ token: userToken });
                    trackUserEvent(TrackingEventTypes.restart_onboarding, {
                        message: 'User pressed Restart OnBoarding Button',
                    });
                    setRestartLoading(false);
                }, 3000);
            } else {
                setRestartLoading(false);
                showMessage({
                    message: "Error",
                    description: "Unable to restart unboarding.",
                    type: 'danger',
                    icon: 'danger',
                });
            }
        } catch (err) {
            setRestartLoading(false);
            console.log("Error", err);
        }
    };

    const onRestartOnBoarding = async () => {
        Alert.alert('Restart Onboarding', 'This action clear you all activities that you perform in this app. Are you sure to restart App?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                style: 'cancel',
                onPress: async () => await onOkPress(),
            },
        ]);
    };
    if (loading && !userData) {
        <LoadingCircle />;
    }
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Box
            >
                <LinearGradient
                    colors={[colors.offerText, colors.primary]}
                    start={{ x: 1, y: 0 }}
                    style={{ justifyContent: 'center', paddingBottom: 60, paddingTop: metrics.s15 }}
                    end={{ x: 0, y: 0 }}>
                    <Box style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Avatar source={{
                            uri: userData?.meAppUser?.memberPhotoUrl
                        }}
                            size={150}
                        />
                        <AppText
                            text={`${userData?.meAppUser?.firstName} ${userData?.meAppUser?.lastName}`}
                            bold
                            style={{ color: colors.white, paddingTop: metrics.s5 }}
                            fontSize={16}
                        />
                        <AppText
                            text={`Since ${moment(userData?.meAppUser?.membershipSince || userData?.meAppUser?.createdAt).format('YYYY-MM-DD')}`}
                            style={{ color: colors.white }}
                        />
                        <AppText
                            style={{ color: colors.white }}
                        >
                            OTA Version: {codePushVersion}
                        </AppText>
                    </Box>
                </LinearGradient>
            </Box>
            <Box style={styles.bottomContainer}>
                <Box>
                    <List.Section
                        title='Personal Information'
                        titleStyle={{ fontFamily: Fonts.bold, color: colors.primary, fontSize: 16, paddingLeft: 0 }}
                    >
                        <AccrodianList
                            id='1'
                            zeroMt
                            titleStyle={{ color: colors.black, fontFamily: Fonts.book }}
                            rippleColor={colors.secondary}
                            title="Membership Information"
                            left={props => <Icons {...props} color={colors.primary} name="wallet-membership" size={24} />}
                        >
                            <List.Item
                                title="Member id"
                                description={userData?.meAppUser?.membershipNumber}
                                style={{ paddingVertical: 0 }}
                                titleStyle={{ fontFamily: Fonts.book, color: colors.black }}
                                descriptionStyle={{ fontFamily: Fonts.book, color: colors.black }}
                            />
                            <List.Item
                                title="Type"
                                description={userData?.meAppUser?.membershipType ? userData?.meAppUser?.membershipType : "No Type"}
                                style={{ paddingVertical: 0 }}
                                titleStyle={{ fontFamily: Fonts.book, color: colors.black }}
                                descriptionStyle={{ fontFamily: Fonts.book, color: colors.black }}
                            />
                        </AccrodianList>
                        <AccrodianList
                            id='2'
                            title="Basic Information"
                            titleStyle={{ color: colors.black, fontFamily: Fonts.book }}
                            left={props => <MaterialIcons {...props} color={colors.primary} name="person" size={20} />}
                            rippleColor={colors.secondary}
                        >
                            <List.Item
                                title="Gender"
                                style={{ paddingVertical: 0 }}
                                description={userData?.meAppUser?.gender}
                                titleStyle={{ fontFamily: Fonts.book, color: colors.black }}
                                descriptionStyle={{ fontFamily: Fonts.book, color: colors.black }}
                            />
                            <List.Item
                                title="Birthday"
                                style={{ paddingVertical: 0 }}
                                description={moment(userData?.meAppUser?.dateOfBirth).format('DD-MM-YYYY')}
                                titleStyle={{ fontFamily: Fonts.book, color: colors.black }}
                                descriptionStyle={{ fontFamily: Fonts.book, color: colors.black }}
                            />
                            <List.Item
                                title="Emergency Contact Name"
                                style={{ paddingVertical: 0 }}
                                description={userData?.meAppUser?.emergencyContactName}
                                titleStyle={{ fontFamily: Fonts.book, color: colors.black }}
                                descriptionStyle={{ fontFamily: Fonts.book, color: colors.black }}
                            />
                            <List.Item
                                title="Emergency Contact #"
                                style={{ paddingVertical: 0 }}
                                description={userData?.meAppUser?.emergencyContact}
                                titleStyle={{ fontFamily: Fonts.book, color: colors.black }}
                                descriptionStyle={{ fontFamily: Fonts.book, color: colors.black }}
                            />
                        </AccrodianList>
                        <AccrodianList
                            id='3'
                            titleStyle={{ color: colors.primary, fontFamily: Fonts.book }}
                            rippleColor={colors.secondary}
                            title="Contact Information"
                            left={props => <Icons {...props} name="phone" color={colors.primary} size={20} />}
                        >
                            <List.Item
                                title="Email"
                                description={userData?.meAppUser?.email[0]}
                                style={{ paddingVertical: 0 }}
                                titleStyle={{ fontFamily: Fonts.book, color: colors.black }}
                                descriptionStyle={{ fontFamily: Fonts.book, color: colors.black }}
                            />
                            <List.Item
                                title="Phone Home"
                                description={userData?.meAppUser?.phoneHome}
                                style={{ paddingVertical: 0 }}
                                titleStyle={{ fontFamily: Fonts.book, color: colors.black }}
                                descriptionStyle={{ fontFamily: Fonts.book, color: colors.black }} />
                        </AccrodianList>
                    </List.Section>
                </Box>
                <Divider height={0.5} />
                <Divider height={0.5} />
                <Box>
                    <List.Section
                        title='Settings'
                        titleStyle={{ fontFamily: Fonts.bold, color: colors.primary, fontSize: 16, paddingLeft: 0 }}
                    >
                        <AccrodianList
                            id="5"
                            zeroMt
                            titleStyle={{ color: colors.primary, fontFamily: Fonts.book }}
                            onPress={() => {
                                setShowAllowedScheduleByBarcode(!showAllowedScheduleByBarcode)
                            }}
                            titleNumberOfLines={5}
                            // rippleColor={colors.secondary}
                            style={{ backgroundColor: colors.homeBg, paddingVertical: metrics.s5 }}
                            title="Only show schedule that is allowed by my membership"
                            left={props => <Icons {...props} name="filter" color={colors.primary} size={20} />}
                            // right={(props) => <FontAwesome {...props} name="chevron-right" color={colors.primary} size={14} />}
                            right={() => showAllowedScheduleByBarcode ? <CheckBoxMarkedIcon size={20} /> : <CheckBoxUnmarkedIcon size={20} />}
                        />
                    </List.Section>
                </Box>
                <Box>
                    <List.Section
                        title='Actions'
                        titleStyle={{ fontFamily: Fonts.bold, color: colors.primary, fontSize: 16, paddingLeft: 0 }}
                    >
                        {/* <AccrodianList
                            id="4"
                            zeroMt
                            titleStyle={{ color: colors.primary, fontFamily: Fonts.book }}
                            // onPress={}
                            rippleColor={colors.secondary}
                            style={{ backgroundColor: colors.homeBg, paddingVertical: metrics.s5 }}
                            title="Restart Onboarding"
                            left={props => <FontAwesome5Icon {...props} name="user-cog" color={colors.primary} size={20} />}
                            right={(props) => <FontAwesome {...props} name="chevron-right" color={colors.primary} size={14} />}
                        /> */}
                        <AccrodianList
                            id="5"
                            zeroMt
                            titleStyle={{ color: colors.primary, fontFamily: Fonts.book }}
                            onPress={() => Linking.openURL('https://tpasc.ezfacility.com/Sessions')}
                            rippleColor={colors.secondary}
                            style={{ backgroundColor: colors.homeBg, paddingVertical: metrics.s5 }}
                            title="Update Profile"
                            left={props => <Icons {...props} name="account-edit" color={colors.primary} size={20} />}
                            right={(props) => <FontAwesome {...props} name="chevron-right" color={colors.primary} size={14} />}
                        />
                        <AccrodianList
                            id="6"
                            titleStyle={{ color: colors.primary, fontFamily: Fonts.book }}
                            onPress={() => navigation.navigate(Routes.NOTIFICATION)}
                            rippleColor={colors.secondary}
                            style={{ backgroundColor: colors.homeBg, paddingVertical: metrics.s5 }}
                            title="Update Notifications"
                            left={props => <MaterialIcons {...props} name="edit-notifications" color={colors.primary} size={20} />}
                            right={(props) => <FontAwesome {...props} name="chevron-right" color={colors.primary} size={14} />}
                        />
                        <AccrodianList
                            id="6"
                            titleStyle={{ color: colors.primary, fontFamily: Fonts.book }}
                            onPress={() => navigation.navigate(Routes.MYFAVOURITE, { fromHome: true })}
                            rippleColor={colors.secondary}
                            style={{ backgroundColor: colors.homeBg, paddingVertical: metrics.s5 }}
                            title="My Favourites"
                            left={props => <Icons {...props} name="heart-plus-outline" color={colors.primary} size={20} />}
                            right={(props) => <FontAwesome {...props} name="chevron-right" color={colors.primary} size={14} />}
                        />
                        <AccrodianList
                            id="8"
                            titleStyle={{ color: colors.primary, fontFamily: Fonts.book }}
                            onPress={() => navigation.navigate(Routes.DELETEUSER)}
                            rippleColor={colors.secondary}
                            style={{ backgroundColor: colors.homeBg, paddingVertical: metrics.s5 }}
                            title="Delete Account"
                            left={props => <AntIcons {...props} name="deleteuser" color={colors.primary} size={20} />}
                            right={(props) => <FontAwesome {...props} name="chevron-right" color={colors.primary} size={14} />}
                        />
                    </List.Section>
                    <ButtonX
                        title="Restart Onboarding"
                        isLoading={restartLoading}
                        isLoadingText="Restarting"
                        onPress={onRestartOnBoarding}
                        style={{ marginTop: metrics.s20 }}
                    />
                    <LogoutUserButton />
                </Box>
            </Box>
        </ScrollView>
    );
};

export default NewAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomContainer: {
        flex: 1,
        marginTop: -50,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    content: {
        marginTop: 10,
    },
    eachInfo: {},
    iconTitle: {
        flexDirection: 'row',
    },
    heading: {
        fontFamily: Fonts.medium,
        fontSize: metrics.s18,
    },
    info: {
        marginLeft: metrics.s10,
    },
    information: {
        marginTop: metrics.s10,
    },
    infoTitle: {
        fontFamily: Fonts.bold,
        fontWeight: 700,
    },
    normalText: {
        fontFamily: Fonts.book,
    },
    updateBtn: {
        marginTop: metrics.s20,
        backgroundColor: colors.primary,
    },
});
