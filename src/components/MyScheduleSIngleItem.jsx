/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState } from 'react'
import { Box, Pressable, Divider, Image, Text } from 'native-base'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Alert, StyleSheet } from 'react-native';
import metrics from '../themes/Metrics';
import Routes from '../navigation/Routes';
import AppText from './common/Text';
import colors from '../themes/Colors';
import Fonts from '../themes/Fonts';
import { showMessage } from 'react-native-flash-message';
import LoadingModal from './common/LoadingModal';
import { useMutation, useQuery } from '@apollo/client';
import { CANCLE_BOOK_SCHEDULE } from '../Apollo/Mutations';
import { GET_ME_USER, GET_MY_SCHEDULES } from '../Apollo/Queries';
import { useStoreActions } from 'easy-peasy';
import { CANCLE_WAIT_LIST_SECEDULE } from '../Apollo/Mutations/Schdeules';
import LinearGradient from 'react-native-linear-gradient';
import { AudienceToColor } from '../utils';
import ScheduleAudienceTags from './Schedule/ScheduleAudienceTags';

const MyScheduleSingleItem = ({ item }) => {
    const navigation = useNavigation();
    const [activeDate, setActiveDate] = useState(moment());
    const waitlist = item?.myBookingStatus === 'Waitlist' || false;

    const { setFetchMyScheduleAfterRemove } = useStoreActions(state => ({
        setFetchMyScheduleAfterRemove: state.schedule.setFetchMyScheduleAfterRemove
    }));

    const { data, loading: userLoading } = useQuery(GET_ME_USER);

    const [removeFromBookMutation, { loading, error }] = useMutation(CANCLE_BOOK_SCHEDULE);

    const [removeFromWaitlistMutation, { loading: waitlistLoading }] = useMutation(CANCLE_WAIT_LIST_SECEDULE);


    const subscribed = data?.meAppUser?.myFavourites.includes(`${item?.id}`);
     const isCancelledSchedule = useMemo(() => {
       return item.facility_rec_name === 'Cancelled Classes';
     }, [item]);

    const onOkPress = async ({ scheduleId, bookingId }) => {
        try {
            if (!scheduleId && !bookingId) {
                throw new Error("Something went wrong");
            }
            if (!waitlist) {
                await removeFromBookMutation({
                    variables: {
                        scheduleId,
                        bookingId,
                    },
                    refetchQueries: [
                        {
                            query: GET_MY_SCHEDULES,
                            variables: {
                                startDate: activeDate,
                                endDate: moment(activeDate).add(5, 'day'),
                                page: 1,
                            },
                        }],
                });
                setFetchMyScheduleAfterRemove();
                showMessage({
                    message: "Success",
                    description: "Booked schedule has been cancelled successfully.",
                    type: 'success',
                    icon: 'success',
                });
            } else {
                await removeFromWaitlistMutation({
                    variables: {
                        scheduleId,
                        bookingId,
                    },
                    refetchQueries: [
                        {
                            query: GET_MY_SCHEDULES,
                            variables: {
                                startDate: activeDate,
                                endDate: moment(activeDate).add(5, 'day'),
                                page: 1,
                            },
                        }],
                });
                setFetchMyScheduleAfterRemove();
                showMessage({
                    message: "Success",
                    description: "Waitlist schedule has been cancelled successfully.",
                    type: 'success',
                    icon: 'success',
                })
            }
        } catch (err) {
            console.log("errr", err);
            const errorArray = err?.toString().split(":");
            showMessage({
                message: "Error",
                description: errorArray[errorArray.length - 1] || "Unable to cancel schedule",
                type: 'danger',
                icon: 'danger',
            });
        }
    };

    const onDeletePress = async (scheduleId, bookingId) => {
        Alert.alert('Delete Schedule', 'Are you sure to cancel this schedule?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: async () => await onOkPress(scheduleId, bookingId),
            },
        ]);
    };
    const singleColored = isCancelledSchedule
      ? colors.danger
      : item.audiences?.length === 1
      ? AudienceToColor(item.audiences[0])
      : item.audiences?.length === 3
      ? colors.purple
      : false;
    const basicColored = isCancelledSchedule ? colors.danger : colors.primary;
    const scheduleStartTime = moment(item.startTimeUTC).format('hh:mm A');
    return (
      <Pressable
        onPress={() =>
          navigation.navigate(Routes.SCHEDULEDETAIL, {
            detail: item,
            mySchedule: true,
          })
        }
        key={item?.id}>
        <Box flexDirection={'row'}>
          <Box
            style={{
              backgroundColor: basicColored,
              flex: 1,
              flexDirection: 'row',
              height: '100%',
            }}>
            {/* <LinearGradient
              colors={gradientColors}
              locations={[0.4, 0.6]} // chakey
              start={{x: 0, y: 0}} // chakey
              end={{x: 1, y: 1}} // chakey
              //   start={{x: 0.5, y: 0.5}} // tala mathi
              //   end={{x: 0.5, y: 0.6}} // tala mathi
              //  start={{x: 0, y: 0.5}} // daya baya
              //  end={{x: 1, y: 0.5}} // daya baya
              //  locations={[0.4, 0.6]} // daya baya
              style={{flex: 1}}> */}
              <AppText style={styles.leftTime}>{scheduleStartTime}</AppText>
            {/* </LinearGradient> */}
          </Box>
          <Box style={styles.contentWrapper}>
            <Box style={styles.content}>
              <Box style={styles.leftContent}>
                <Box style={styles.texts}>
                  <AppText text={item?.publicTitle} style={styles.feedTitle} />
                  {/* <ScheduleAudienceTags schedule={item}/> */}
                  <AppText
                    text={`${moment(item?.startTimeUTC)?.format(
                      'hh:mm A',
                    )}-${moment(item?.endTimeUTC)?.format('hh:mm A')}`}
                    style={styles.time}
                  />
                  <AppText
                    text={item?.resourceName}
                    style={styles.description}
                  />
                </Box>
              </Box>
              <Box style={styles.heart}>
                <Pressable
                  onPress={() =>
                    onDeletePress({
                      scheduleId: item?.id,
                      bookingId: item?.myBookingID,
                    })
                  }>
                  <MaterialIcon name="delete" size={30} color={colors.danger} />
                </Pressable>
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider />
        {loading && <LoadingModal title="Cancelling Schedule..." />}
      </Pressable>
    );
};
export default React.memo(MyScheduleSingleItem);

const styles = StyleSheet.create({
    time: {
        fontFamily: Fonts.medium,
    },
    content: {
        paddingVertical: metrics.s10,
        paddingHorizontal: metrics.s10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    feedTitle: {
        color: colors.primary,
        fontFamily: Fonts.bold,
    },
    description: {
        fontFamily: Fonts.book,
    },
    leftContent: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    texts: {
        marginLeft: metrics.s10,
        flexDirection: 'column',
        flex: 1,
    },
    heart: {
        flex: 1,
        // backgroundColor:colors.gray,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    notBookable: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    contentWrapper: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 3,
    },
    leftTime: {
        color: 'white',
        // paddingHorizontal: metrics.s10,
        paddingHorizontal: metrics.s5,
        paddingTop: metrics.s20,
        textAlign: 'center',
        flex: 1,
        fontFamily: Fonts.bold,
        fontWeight: 700
    },
});
