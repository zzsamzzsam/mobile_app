/* eslint-disable prettier/prettier */
import { useRoute } from '@react-navigation/native';
import { Box, Divider, Image, Slide, Text } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ImageBackground, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { CalendarIcon } from '../../public/Icons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import SwipableView from '../../components/SwipeableView';
import { useStoreActions } from 'easy-peasy';
import AppText from '../../components/common/Text';
import ButtonX from '../../components/common/BottonX';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import Fonts from '../../themes/Fonts';
import { useMutation, useQuery } from '@apollo/client';
import { BOOK_SCHEDULE, READ_NOTIFICATION, WAIT_LIST_SCHEDULE } from '../../Apollo/Mutations';
import { GET_ME_USER, GET_MY_SCHEDULES, GET_NOTIFICATIONS, GET_SCHEDULE } from '../../Apollo/Queries';
import RNCalendarEvents from "react-native-calendar-events";
import LoadingCircle from '../../components/LoadingCircle';
import Icon from 'react-native-vector-icons//Ionicons';
import ScheduleAudienceTags from '../../components/Schedule/ScheduleAudienceTags';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';
import { GET_SCHEDULE_DETAIL_BY_SESSIONID } from '../../Apollo/Queries/GetSchedules';
import { ActivityIndicator } from 'react-native-paper';


const ScheduleDetail = ({ navigation }) => {
  const route = useRoute();
  const { id, resourceId, shouldFetch, detail, isBooked } = route?.params;
  // const detail = route?.params?.detail;
  const mySchedule = route?.params?.mySchedule || false;
  const [currentDate, setCurrentDate] = useState(moment());
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fillHeart, setFillHeart] = useState(false);
  // const [slotUpdateAt, setSlotUpdateAt] = useState(null);
  const { setFetchMyScheduleAfterRemove, setRefetchNotification } = useStoreActions(state => ({
    setFetchMyScheduleAfterRemove: state.schedule.setFetchMyScheduleAfterRemove,
    setRefetchNotification: state.app.setRefetchNotification,
  }));
  const { data } = useQuery(GET_ME_USER);

  const { data: schedule, loading: scheduleLoading, error } = useQuery(GET_SCHEDULE, {
    variables: {
      ez_id: Number(resourceId),
    },
    skip: !shouldFetch,
  });
  const { data: otherScheduleDetail, loading: scheduleDetailLoading, error: scheduleDetailError, refetch } = useQuery(GET_SCHEDULE_DETAIL_BY_SESSIONID, {
    variables: {
      sessionId: Number(detail?.ez_id || resourceId),
      page: 1,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
  });
  const slotUpdateAt = useMemo(() => {
    if(!otherScheduleDetail) {
      return null
    }
    return new Date();
  }, [otherScheduleDetail])
  const [readNotificationMutation] = useMutation(READ_NOTIFICATION);
  useEffect(() => {
    const updateReadNotice = async () => {
      try {
        if (id && shouldFetch) {
          await readNotificationMutation({ variables: { _id: id }, refetchQueries: [{ query: GET_NOTIFICATIONS }] });
          setRefetchNotification();
        }
      } catch (err) {
        console.log("Error", err.toString());
      }
    };
    updateReadNotice();
  }, [shouldFetch, id])
    ;
  const scheduleDetails = useMemo(() => {
    return detail || schedule?.getSchedule;
  }, [schedule?.getSchedule, detail]);

  useEffect(() => {
    setFillHeart(scheduleDetails?.registered_user_ids?.includes(data?.meAppUser?._id));
  }, [scheduleDetails?.registered_user_ids, data?.meAppUser]);

  const [scheduleBookMutation, { data: bookedData }] = useMutation(BOOK_SCHEDULE);
  const [scheduleWaitlistMutation] = useMutation(WAIT_LIST_SCHEDULE);

  const onBookButtenPress = async (scheduleId, startTime) => {
    if (!(moment(startTime).isBetween(moment(), moment().add(48, 'hours')))) {
      return showMessage({
        message: 'Info',
        description: "Reservations can only be made 48 hours in advance",
        type: 'info',
        icon: 'info',
      });
    }
    const nowDate = moment();
    const twoHoursFromNow = moment(nowDate).add(2, 'hours');
    if (moment(startTime).isBefore(twoHoursFromNow)) {
      // show proumpt
      Alert.alert('Schedule', 'This reservation is less than 2 hours from now, and you will not be able to cancel. Are you sure you would like to book?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          style: 'cancel',
          onPress: async () => await onBookSchedule(scheduleId),
        },
      ]);
    } else {
      await onBookSchedule(scheduleId);
    }
  };

  const onBookSchedule = async (scheduleId, startTime) => {
    setButtonLoading(true);
    if (!scheduleId) {
      throw new Error("Something went wrong");
    }
    try {
      const { data: scheduleData } = await scheduleBookMutation({
        variables: { scheduleId },
        refetchQueries: [
          {
            query: GET_MY_SCHEDULES,
            variables: {
              startDate: currentDate,
              endDate: moment(currentDate).add(5, 'day'),
              page: 1,
            },
          },
        ],
      });
      if (!!scheduleData && scheduleData?.bookEzSessionfromApp) {
        trackUserEvent(TrackingEventTypes?.booked_schedule, {
          ez_schedule_id: scheduleId,
          data: scheduleData,
        });
        Alert.alert('Add to Calender', 'Do you want to add this schedule to calender?', [
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
      }
      setFetchMyScheduleAfterRemove();
      showMessage({
        message: 'Success',
        description: 'Successfully Booked',
        type: 'success',
        icon: 'success',
      });
      setButtonLoading(false);
    } catch (err) {
      setButtonLoading(false);
      console.log("error", err.toString());
      const errorArray = err?.toString().split(":");
      showMessage({
        message: 'Error',
        description: errorArray[errorArray.length - 1] || 'Unable to book ',
        type: 'danger',
        icon: 'danger',
      });
    }
  };
  const waitListSchedule = async (scheduleId) => {
    setButtonLoading(true);
    if (!scheduleId) {
      throw new Error("Something went wrong")
    }
    try {
      await scheduleWaitlistMutation({
        variables: { scheduleId },
        refetchQueries: [
          {
            query: GET_MY_SCHEDULES,
            variables: {
              startDate: currentDate,
              endDate: "2023-07-25",
              page: 1,
            },
          },
        ],
      });
      setFetchMyScheduleAfterRemove();
      showMessage({
        message: 'Success',
        description: 'Successfully Join to Waitlist',
        type: 'success',
        icon: 'success',
      });
      setButtonLoading(false);
    } catch (err) {
      setButtonLoading(false);
      console.log("error", err.toString());
      const errorArray = err?.toString().split(":");
      showMessage({
        message: 'Error',
        description: errorArray[errorArray.length - 1] || 'Unable to join waitlist',
        type: 'danger',
        icon: 'danger',
      });
    }
  };
  const facility_resource = scheduleDetails?.resources?.find(s => s.resource_type === 'facility');
  const person_resource = scheduleDetails?.resources?.find(s => s.resource_type === 'person');

  const slotsTotal = scheduleDetails?.slots_total;
  const slotsAvailable =
    slotsTotal && otherScheduleDetail?.getScheduleDetailBySessionId
      ? slotsTotal - otherScheduleDetail?.getScheduleDetailBySessionId.usedSlots
      : 0;
  const waitList = !(scheduleDetails?.facility_rec_name === "Cancelled Classes") && (scheduleDetails?.bookable && scheduleDetails?.allow_wait_listing && Number(slotsAvailable) === 0) && (scheduleDetails?.bookable && Number(scheduleDetails?.slots_total) > 1);
  const bookable = !(scheduleDetails?.facility_rec_name === "Cancelled Classes") && (scheduleDetails?.bookable && Number(slotsAvailable) !== 0) && (scheduleDetails?.bookable && Number(scheduleDetails?.slots_total) > 1);

  const onOkPress = async () => {
    const eventDetails = {
      calenderId: `${scheduleDetails?.ez_id}`,
      title: scheduleDetails?.title,
      startDate: scheduleDetails?.start_time,
      endDate: scheduleDetails?.end_time,
      location: scheduleDetails?.facility_rec_name || scheduleDetails?.person_rec_name,
      notes: scheduleDetails?.description,
    };
    RNCalendarEvents.saveEvent(`${scheduleDetails?.title}`, eventDetails)
      .then((eventId) => {
        console.log(`Event saved with ID: ${eventId}`);
        trackUserEvent(TrackingEventTypes?.calender_added, {
          schedule_id: scheduleDetails?.ez_id,
          event_details: eventDetails,
        });
        showMessage({
          message: 'Success',
          description: 'Successfully Schedule Added to Calender',
          type: 'success',
          icon: 'success',
        });
      })
      .catch((error) => {
        console.error('Error saving event:', error);
      });

  };
  if (scheduleLoading || scheduleDetailLoading) {
    return <LoadingCircle />;
  }
  if (!scheduleDetails) {
    return <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AppText style={styles.mediumFont}>Unable to load data!</AppText>
    </Box>;
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {bookable && (
        <Box>
          <SwipableView />
        </Box>
      )}
      {!mySchedule && !!scheduleDetails?.rec_item_image && (
        <Box style={{height: 200}}>
          <Image
            source={{uri: scheduleDetails?.rec_item_image}}
            style={{height: '100%'}}
            alt={`${scheduleDetails?.rec_item_image}`}
          />
        </Box>
      )}
      <Box style={{margin: metrics.s20}}>
        <AppText
          text={scheduleDetails?.title}
          style={[styles.boldFont, {fontSize: metrics.s20}]}
        />
        <ScheduleAudienceTags schedule={scheduleDetails} />
        <Divider
          style={{
            marginBottom: metrics.s20 / 2,
            marginTop: metrics.s20 / 2,
          }}
        />
        <Box style={styles.detailBox}>
          <Box>
            <AppText
              text={moment(scheduleDetails?.start_time)
                .format('dddd, MMM DD')
                .toUpperCase()}
              style={[styles.mediumFont, {fontSize: metrics.s18 - 4}]}
            />
            <AppText
              text={`${moment(
                scheduleDetails?.start_time || scheduleDetails?.startTimeUTC,
              ).format('hh:mm A')} - ${moment(
                scheduleDetails?.end_time || scheduleDetails?.endTimeUTC,
              ).format('hh:mm A')}`}
              style={[styles.mediumFont, {fontSize: metrics.s16}]}
            />
          </Box>
          <Box>
            <CalendarIcon size={30} color={colors.primary} />
          </Box>
        </Box>
        <Box style={styles.detailsListBox}>
          <Box>
            <Box style={styles.centerRowBox}>
              <AppText text="Location: " style={styles.mediumFont} />
              <AppText
                text={
                  facility_resource?.resource_name ||
                  scheduleDetails?.resourceName
                }
                style={styles.bookFont}
              />
            </Box>
            {/* <Box
              style={[styles.centerRowBox,]}>
              <AppText text="Audience: " style={styles.mediumFont} />
              <AppText text={scheduleDetails?.audiences?.toString()} style={styles.bookFont} />
            </Box> */}
            {scheduleDetails?.activities && (
              <Box style={styles.centerRowBox}>
                <AppText text="Activities: " style={styles.mediumFont} />
                <AppText style={styles.bookFont}>
                  {scheduleDetails?.activities?.join(',')}
                </AppText>
              </Box>
            )}
            {person_resource && person_resource?.resource_name && (
              <Box style={styles.centerRowBox}>
                <AppText text="Instructor:" style={styles.mediumFont} />
                <AppText
                  text={person_resource.resource_name}
                  style={styles.bookFont}
                />
              </Box>
            )}
            {!mySchedule
              ? bookable && (
                  <Box style={styles.centerRowBox}>
                    <AppText style={styles.mediumFont}>Spots: </AppText>
                    <AppText style={styles.bookFont}>
                      {`${slotsAvailable || '-'}/${
                        scheduleDetails.slots_total
                      }`}
                    </AppText>
                  </Box>
                )
              : bookable && (
                  <Box style={styles.centerRowBox}>
                    <AppText style={styles.mediumFont}>Spots: </AppText>
                    <AppText style={styles.bookFont}>
                      {`${slotsAvailable}/${scheduleDetails.slotsTotal}`}
                    </AppText>
                  </Box>
                )}
            <Box style={[styles.centerRowBox, {justifyContent: 'center', alignItems: 'center'}]}>
              {!!slotUpdateAt && (
                <AppText style={styles.mediumFont}>
                  Updated At: {moment(slotUpdateAt).format('hh:mm:ss a')}
                </AppText>
              )}
              <TouchableOpacity onPress={() => {
                refetch();
              }}>
                <MaterialIcon name="refresh" size={30} color={colors.primary} />
              </TouchableOpacity>
            </Box>
          </Box>

          <Box style={styles.heart}>
            <MaterialIcon
              name={fillHeart ? 'heart' : 'heart-outline'}
              size={30}
              color={colors.primary}
            />
          </Box>
        </Box>

        <Divider />
        {bookable && (
          <ButtonX
            title={
              isBooked
                ? scheduleDetails?.myBookingStatus?.toLowerCase() === 'waitlist'
                  ? scheduleDetails.myBookingStatus
                  : 'Booked'
                : 'Book'
            }
            // disabled={Number(scheduleDetails?.slots_available) === Number(scheduleDetails?.slots_total)}
            isLoading={buttonLoading}
            isLoadingText="Booking"
            disabled={isBooked}
            onPress={() =>
              onBookButtenPress(
                scheduleDetails?.ez_id,
                scheduleDetails?.start_time,
              )
            }
            style={styles.updateBtn}
            bg={colors.secondary}
          />
        )}
        {waitList && (
          <ButtonX
            title="Join Waitlist"
            onPress={() => waitListSchedule(scheduleDetails?.ez_id)}
            isLoading={buttonLoading}
            isLoadingText="Joining"
            style={styles.updateBtn}
          />
        )}
        <Box style={{marginTop: metrics?.s20}}>
          <AppText style={[styles.mediumFont, styles.descriptionText]}>
            {scheduleDetails?.rec_description}
          </AppText>
        </Box>
        <Box>
          <Box
            style={{
              backgroundColor: colors.primary,
              padding: metrics.s10,
              marginVertical: metrics.s20,
            }}>
            <AppText
              style={[
                styles.mediumFont,
                {color: colors.white, lineHeight: 20},
              ]}>
              Booking Information
            </AppText>
          </Box>

          <AppText
            text={scheduleDetails?.booking_information}
            style={[styles.mediumFont, styles.descriptionText]}
          />
        </Box>
      </Box>
    </ScrollView>
  );
};

export default ScheduleDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mediumFont: {
    fontFamily: Fonts.medium,
  },
  boldFont: {
    fontFamily: Fonts.bold,
    color: colors.primary,
    fontWeight: 700,
  },
  bookFont: {
    fontFamily: Fonts.book,
  },
  heart: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  updateBtn: {
    marginTop: metrics.s20,
    backgroundColor: colors.secondary,
    width: '100%',
  },
  centerRowBox: {
    flexDirection: 'row',
    // flexWrap:'wrap'
  },
  detailBox: {
    flexDirection: 'row',
    // alignItems: 'center',
    // flexWrap:'wrap',
    justifyContent: 'space-between',
  },
  detailsListBox: {
    marginTop: 5,
    overflow: 'hidden',
    marginBottom: metrics.s20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  descriptionText: {
    lineHeight: 20,
    paddingLeft: metrics.s20 / 2,
  },
});
