/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { Box, ScrollView } from 'native-base'
import colors from '../../themes/Colors'
import AppText from '../../components/common/Text'
import metrics from '../../themes/Metrics'
import ButtonX from '../../components/common/BottonX'
import { useMutation } from '@apollo/client'
import { DELETE_USER } from '../../Apollo/Mutations'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { client } from '../../Apollo/apolloClient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { showMessage } from 'react-native-flash-message'
import { APP_STATE } from '../../Store/Models/App';

const DeleteUser = () => {
    const [loading, setLoading] = useState(false);
    const { actualUser } = useStoreState(state => ({
        actualUser: state.login.actualUser,
    }))
    const {
        setUserToken,
        setActualUser,
        setSchedules,
        setAppState,
        setBiometricDetails,
        setBiometricAuth,
    } = useStoreActions(action => ({
        setUserToken: action.login.setUserToken,
        setActualUser: action.login.setActualUser,
        setSchedules: action.schedule.setSchedules,
        setAppState: action.app.setAppState,
        setBiometricDetails: action.login.setBiometricDetails,
        setBiometricAuth: action.login.setBiometricAuth,
    }));

    const [deleteUserMutation] = useMutation(DELETE_USER);
    const onOkPress = async (id) => {
        if (!actualUser?._id) {
            return showMessage({
                message: "Error",
                description: "Missing User",
                type: "danger",
                icon: "danger"
            });
        }
        try {
            setLoading(true);
            await deleteUserMutation({
                variables: { _id: actualUser?._id },
            });
            setUserToken('');
            setActualUser(null);
            await AsyncStorage.removeItem('token');
            setBiometricAuth(null);
            setSchedules([]);
            setBiometricDetails(null);
            await client.clearStore();
            setAppState(APP_STATE.LOGIN);
            setLoading(false);
        } catch (err) {
            console.log("logout error ", err)
            setLoading(false);
            showMessage({
                message: "Error",
                description: "Error on Delete user",
                type: "danger",
                icon: "danger"
            });
        }
    }
    const onDeletePress = async (scheduleId, bookingId) => {
        Alert.alert('Delete User', 'Are you sure to Delete this Account?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                style: 'cancel',
                onPress: async () => await onOkPress(scheduleId, bookingId),
            },
        ]);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.container}
            >
                <Box>
                    <AppText
                        text="Delete My Online Account"
                        bold
                        fontSize={16}
                    />
                    <AppText
                        fontSize={16}
                        style={styles.normalText}
                    >
                        Deleting your online account will erase your member website and mobile app accounts,
                        along with your current username/password.
                    </AppText>
                    <AppText
                        fontSize={16}
                        style={styles.normalText}
                    >
                        Please be aware, doing so will disable access to all digital membership benefits
                        including but not limited to, your virtual membership card,
                        class/ program schedules and registration, live-stream/on-demand classes,
                        club notifications, and the self service portal.
                    </AppText>
                    <AppText
                        fontSize={16}
                        style={styles.normalText}
                    >
                        After your online account is deleted, you will need to contact
                        Toronto Pan Am Sports Centre to create a new online account ,
                        if you want it to be connected to your membership.
                    </AppText>
                    <AppText
                        fontSize={16}
                        style={[styles.normalText]}
                    >
                        Deleting your online account will not impact or cancel your TPASC Fitness Membership.
                    </AppText>
                    <ButtonX
                        title="Delete Online Account"
                        isLoading={loading}
                        isLoadingText={"Deleting"}
                        onPress={onDeletePress}
                        style={{ marginTop: metrics.s20 + metrics.s20, backgroundColor: colors.danger }}
                    />
                </Box>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: metrics.s20,
        paddingVertical: metrics.s10
    },
    normalText: {
        lineHeight: 20,
        marginTop: metrics.s10
    }
})
export default DeleteUser