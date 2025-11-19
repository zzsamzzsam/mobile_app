/* eslint-disable prettier/prettier */
import React, { useEffect, useMemo, useState } from 'react'
import { Box, Pressable, Divider, Image } from 'native-base'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppText from '../common/Text';
import Routes from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../themes/Fonts';
import moment from 'moment';
import { Alert, StyleSheet } from 'react-native';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME_USER, GET_MY_FAVOURITE_SCHEDULES, GET_MY_SCHEDULES, GET_SCHEDULES } from '../../Apollo/Queries';
import { useStoreActions } from 'easy-peasy';
import { ADD_FAVOURITE, CANCLE_BOOK_SCHEDULE, REMOVE_FAVOURITE } from '../../Apollo/Mutations';
import LinearGradient from 'react-native-linear-gradient';
import ScheduleAudienceTags from '../Schedule/ScheduleAudienceTags';
import { showMessage } from 'react-native-flash-message';
import { CANCLE_WAIT_LIST_SECEDULE } from '../../Apollo/Mutations/Schdeules';
import LoadingModal from '../common/LoadingModal';
import { TrackingEventTypes } from '../../constant';
import { trackUserEvent } from '../../utils';

const currentDate = moment();

const ScheduleItem = ({ item, index, isUpNext, deleteIcon, myschedule }) => {
  const navigation = useNavigation();
  const [fillHeart, setFillHeart] = useState(false);
  const [activeDate, setActiveDate] = useState(moment());
  const waitlist = item?.myBookingStatus === 'Waitlist' || false;

  const [removeFromBookMutation, { loading, error }] = useMutation(CANCLE_BOOK_SCHEDULE);

  const [removeFromWaitlistMutation, { loading: waitlistLoading }] = useMutation(CANCLE_WAIT_LIST_SECEDULE);
  const { data } = useQuery(GET_ME_USER);
  const isCancelledSchedule = useMemo(() => {
    return item.facility_rec_name === 'Cancelled Classes';
  }, [item]);
  const scheduleStartTime = moment(item.start_time).format('hh:mm A');
  const { setFetchMyFavouriteUpcoming, setFetchMyScheduleAfterRemove } = useStoreActions(action => ({
    setFetchMyFavouriteUpcoming: action.schedule.setFetchMyFavouriteUpcoming,
    setFetchMyScheduleAfterRemove: action.schedule.setFetchMyScheduleAfterRemove
  }));
  const subscribed = useMemo(() => {
    const schdeuleActivities = new Set(item?.activities) || [];
    const userActivities = new Set(data?.meAppUser?.activities) || [];
    for (const activity of userActivities) {
      if (schdeuleActivities.has(activity)) {
        return true;
      }
    }

    return false;
  }, [data?.meAppUser?.activities, item?.activities]);
  useEffect(() => {
    setFillHeart(subscribed);
  }, [subscribed]);

  const [addToFavouriteMutation] = useMutation(ADD_FAVOURITE);
  const [removeToFavouriteMutation] = useMutation(REMOVE_FAVOURITE);

  const onHeartPress = async () => {
    try {
      if (fillHeart) {
        await removeToFavouriteMutation({
          variables: { activities: item?.activities },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: GET_MY_FAVOURITE_SCHEDULES,
              variables: {
                limit: 50,
                page: 1,
              },
            },
            { query: GET_ME_USER },
            {
              query: GET_SCHEDULES,
              variables: {
                startDate: currentDate,
                endDate: moment(currentDate).add(5, 'day'),
                limit: 80,
                page: 1,
              },
            },
          ],
        });
        setFetchMyFavouriteUpcoming();
        setFillHeart(false);
      } else {
        await addToFavouriteMutation({
          variables: { activities: item?.activities },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: GET_MY_FAVOURITE_SCHEDULES,
              variables: {
                limit: 50,
                page: 1,
              },
            },
            { query: GET_ME_USER },
            {
              query: GET_SCHEDULES,
              variables: {
                startDate: currentDate,
                endDate: moment(currentDate).add(5, 'day'),
                limit: 80,
                page: 1,
              },
            },
          ],
        });
        trackUserEvent(TrackingEventTypes?.favourited_activity, {
          data: item?.activities,
        });
        setFetchMyFavouriteUpcoming();
        setFillHeart(true);
      }
    } catch (err) {
      setFillHeart(false);
      console.log("Error on heart press");
    }
  };
  const onOkPress = async ({ scheduleId, bookingId, startTime }) => {
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
      const nowDate = moment();
      const twoHoursFromNow = moment(nowDate).add(2, 'hours');
      const isLessthanTwoHours = moment(startTime).isBefore(twoHoursFromNow);
      showMessage({
        message: "Error",
        description: isLessthanTwoHours ? 'Reservation cannot be cancelled with less than 2 hours until start time.' : errorArray[errorArray.length - 1] || "Unable to cancel schedule",
        type: 'danger',
        icon: 'danger',
      });
    }
  };
  const onDeletePress = async (scheduleId, bookingId, startTime) => {
    Alert.alert('Cancel Booked Schedule', 'Are you sure to cancel this booked schedule?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => await onOkPress(scheduleId, bookingId, startTime),
      },
    ]);
  };

  const waitList = !(item?.facility_rec_name === "Cancelled Classes") && (item?.bookable && item?.allow_wait_listing && Number(item?.slots_available) === 0) && (item?.bookable && Number(item?.slots_total) > 1);
  const bookable = !(item?.facility_rec_name === "Cancelled Classes") && (item?.bookable && Number(item?.slots_available) !== 0) && (item?.bookable && Number(item?.slots_total) > 1);
  const facility_location = item?.facility_rec_name || item?.resourceName;
  const facility_trainer = item?.person_rec_name;
  // const singleColored = isCancelledSchedule
  //   ? colors.danger
  //   : item.audiences?.length === 1
  //   ? AudienceToColor(item.audiences[0])
  //   : item.audiences?.length === 3
  //   ? colors.purple
  //   : false;
  const basicColored = isCancelledSchedule ? colors.danger : colors.primary;
  // const gradientColors = singleColored ? [singleColored, singleColored]
  //     : [
  //         AudienceToColor(item.audiences?.[0] ? item.audiences[0] : null),
  //         AudienceToColor(item.audiences?.[1] ? item.audiences[1] : null),
  //       ];


  const onItemPress = () => {
    trackUserEvent(TrackingEventTypes?.single_schedule_item_pressed, {
      data: item,
    });
    navigation.navigate(Routes.SCHEDULEDETAIL, { detail: item, isBooked: !!deleteIcon })
  };

  return (
    <Pressable onPress={onItemPress} key={item?.ez_id}>
      <Box flexDirection={'row'}>
        <Box
          style={{
            //   borderBottomColor: 'white',
            //   borderBottomWidth: 2,
            flex: 1,
            height: '100%',
            backgroundColor: basicColored,
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
              style={{flex: 1}}
            > */}
          {index === 0 && isUpNext && (
            <AppText style={[styles.leftTime, styles.upNext]}>
              {`Up Next`}
            </AppText>
          )}
          <AppText style={styles.leftTime}>
            {index === 0 && !isUpNext ? scheduleStartTime : ''}
          </AppText>
          {/* </LinearGradient> */}
        </Box>
        {/* <Divider /> */}
        <Box style={styles.contentWrapper}>
          <Box style={styles.content}>
            <Box style={styles.leftContent}>
              <Box style={styles.texts}>
                <AppText
                  text={item?.title}
                  noOfLines={2}
                  strikeThrough={
                    facility_location === 'Cancelled Classes' ? true : false
                  }
                  style={[styles.feedTitle]}
                />
                <ScheduleAudienceTags schedule={item} />
                <AppText
                  text={`${moment(item?.start_time)?.format(
                    'hh:mm A',
                  )}-${moment(item?.end_time)?.format('hh:mm A')}`}
                  style={styles.time}
                />
                <AppText
                  text={`${
                    facility_location === 'Cancelled Classes'
                      ? 'Cancelled'
                      : facility_location
                  }${facility_trainer ? ` | ${facility_trainer}` : ''}`}
                  style={styles.description}
                />
                {/* <AppText style={styles.description} noOfLines={1}>
                  {item?.activities?.join(',')}
                </AppText> */}
                {/* {bookable && item?.slots_total > 0 && (
                  <AppText style={styles.description}>
                    {`Spots: ${item?.slots_available}/${item?.slots_total}`}
                  </AppText>
                )} */}
                {item?.myBookingStatus && (
                  <AppText style={styles.description}>
                    {`Status: ${
                      item?.myBookingStatus
                        ?.toLocaleLowerCase()
                        .includes('cancel')
                        ? 'Cancelled'
                        : item?.myBookingStatus
                    }`}
                  </AppText>
                )}
              </Box>
            </Box>
            {deleteIcon ? (
              <Box style={styles.deleteIconBox}>
                <Pressable
                  onPress={() =>
                    onDeletePress({
                      scheduleId: item?.id,
                      bookingId: item?.myBookingID,
                      startTime: item?.start_time,
                    })
                  }>
                  <MaterialIcon name="delete" size={30} color={colors.danger} />
                </Pressable>
              </Box>
            ) : (
              <Box style={bookable ? styles.heart : styles.notBookable}>
                {bookable && (
                  <Image
                    style={{height: 25, width: 25}}
                    resourceName
                    resizeMode="contain"
                    source={require('../../public/booking.png')}
                    alt="booking"
                  />
                )}

                <Pressable onPress={onHeartPress}>
                  <MaterialIcon
                    name={fillHeart ? 'heart' : 'heart-outline'}
                    size={30}
                    color={colors.primary}
                  />
                </Pressable>
              </Box>
            )}
          </Box>
          {/* <Box style={{borderWidth: 0.8, borderColor: colors.gray}} /> */}
          <Divider />
        </Box>
        {(loading || waitlistLoading) && (
          <LoadingModal title="Cancelling Schedule..." />
        )}
      </Box>
    </Pressable>
  );
};
export default React.memo(ScheduleItem);

const styles = StyleSheet.create({
  time: {
    fontFamily: Fonts.medium,
  },
  leftTime: {
    color: 'white',
    // paddingHorizontal: metrics.s10,
    paddingHorizontal: metrics.s5,
    paddingTop: metrics.s20,
    textAlign: 'center',
    // flex: 1,
    fontFamily: Fonts.bold,
    fontWeight: 700,
  },
  upNext: {
    backgroundColor: colors.green,
    paddingTop: 0,
  },
  contentWrapper: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 3,
  },
  content: {
    flex: 1,
    paddingVertical: metrics.s10,
    // paddingHorizontal: metrics.s10,
    flexDirection: 'row',
  },
  feedTitle: {
    color: colors.primary,
    fontFamily: Fonts.bold,
    fontWeight: 700,
    lineHeight: 18
  },
  description: {
    fontFamily: Fonts.medium,
    fontWeight: 500,
    color: colors.primary,
  },
  leftContent: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  texts: {
    marginLeft: metrics.s10,
    flexDirection: 'column',
    flex: 1,
  },
  heart: {
    // flex: 1,
    // backgroundColor: colors.gray,
    paddingHorizontal: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notBookable: {
    // flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  deleteIconBox: {
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
