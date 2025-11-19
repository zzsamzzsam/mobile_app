/* eslint-disable prettier/prettier */
import { Dimensions } from 'react-native'
import React, { useMemo } from 'react'
import { Box, Text } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native'
import moment from 'moment';
import metrics from '../themes/Metrics'
import { useNavigation } from '@react-navigation/native'
import Routes from '../navigation/Routes'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../themes/Colors'
import Fonts from '../themes/Fonts'
import AppText from './common/Text'
import { isSameDay } from 'date-fns'

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const BookingStatusTag = ({ myBookingStatus = '' }) => {
    const isWaitList = myBookingStatus?.toLocaleLowerCase() === 'waitlist';
    const computedStatus = myBookingStatus
      ?.toLocaleLowerCase()
      .includes('cancel')
      ? 'Cancelled'
      : myBookingStatus;
    return (
      <Box key={myBookingStatus} style={[styles.audienceTag]}>
        <AppText
          bold
          fontSize={12}
          style={styles.audienceTagText}
          color={(isWaitList || (computedStatus === 'Cancelled')) ? 'red' : colors.primary}>
          {computedStatus || ''}
        </AppText>
      </Box>
    );
};

const SmallFeedBox = ({ item, leftBg, rightBg, fullWidth = false, onPress, withHeart, style, showBookingStatus }) => {
    const navigation = useNavigation();
    const start = new Date(item.start_time);
    const end = new Date(item.end_time);
    const day = moment(item.start_time).format('dddd').substring(0, 3);
    const month = moment(item.start_time).format('MMMM').substring(0, 3);
    const dayOfMonth = moment(item.start_time).format('D');
    const startTime = moment(item.start_time).format('hh:mm A');
    const endTime = moment(item.end_time).format('hh:mm A');
    const facility_resource = item?.resources?.find(s => s.resource_type === 'facility');
    const person_resource = item?.resources?.find(s => s.resource_type === 'person');
    const subTitle = item?.ez_facility_resource || person_resource?.resource_name || facility_resource?.resource_name || 'Cancelled Classes';
    // const startDate = new Date(item.start_time);
    // const endDate = new Date(item.end_time);
    // const differenceInMilliseconds = Math.abs(startDate - endDate);
    // const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    // const differenceInHours = Math.floor(differenceInMinutes / 60);
    // const remainingMinutes = (differenceInMinutes - differenceInHours * 60);

    // const fullDate = () => {
    //     let date = '';
    //     if (remainingMinutes > 0 && differenceInHours > 0) {
    //         date = `${startTime}-${endTime}(${differenceInHours}h ${remainingMinutes}m)`;
    //     } else if (differenceInHours === 0) {
    //         date = `${startTime}-${endTime}(${differenceInMinutes}m)`;
    //     } else if (remainingMinutes === 0 && differenceInHours > 0) {
    //         date = `${startTime}-${endTime} (${differenceInHours}h)`;
    //     } else {
    //         date = `${startTime}-${endTime}`;
    //     } const facility_resource = item?.resources?.find(s => s.resource_type === 'facility');
    //     return date;
    // };
    const isCancelledClass = subTitle === 'Cancelled Classes';
    const needsMultiDay = useMemo(() => {
            return ['Closure', 'Event'].includes(item?.__typename) && !isSameDay(new Date(start), new Date(end));
    }, [item]);
    return (
      <Box
        width={fullWidth ? '100%' : SCREEN_WIDTH - metrics.s20 * 4}
        style={style}>
        <TouchableOpacity
          onPress={onPress}
          style={styles.offerContent}
          activeOpacity={0.5}>
          <Box
            style={[
              styles.left,
              {backgroundColor: isCancelledClass ? colors.danger : leftBg},
            ]}>
            <Text
              style={[
                {
                  color: colors.white,
                  fontSize: metrics.s16,
                  fontFamily: Fonts.medium,
                },
              ]}>
              {day}
            </Text>
            <Text
              style={[
                styles.bold,
                {
                  color: colors.white,
                  fontSize: metrics.s16,
                },
              ]}>
              {dayOfMonth}
            </Text>
            <Text
              style={[
                {
                  color: colors.white,
                  fontSize: metrics.s16,
                  fontFamily: Fonts.medium,
                },
              ]}>
              {month}
            </Text>
          </Box>
          <Box style={[styles.bottom, {backgroundColor: rightBg}]}>
            <Text
              style={styles.offerTitle}
              strikeThrough={subTitle === 'Cancelled Classes' ? true : false}
              textDecorationColor={colors.red}
              noOfLines={2}>
              {item?.title}
            </Text>
            {showBookingStatus && item.myBookingStatus && (
              <BookingStatusTag myBookingStatus={item.myBookingStatus} />
            )}

            {!needsMultiDay && (
              <AppText bold style={styles.date} noOfLines={1}>
                {`${startTime}-${endTime}`}
              </AppText>
            )}
            {needsMultiDay && (
              <Text style={styles.date} noOfLines={2}>
                <AppText bold>{`${startTime} - `}</AppText>
                <AppText bold>{moment(end).format('MMM DD hh:mm A')}</AppText>
              </Text>
            )}
            <Text style={styles.offerDesc} noOfLines={1}>
              {subTitle === 'Cancelled Classes' ? 'Cancelled' : subTitle}
            </Text>
          </Box>
          {needsMultiDay && (
            <Box
              style={[
                styles.left,
                {backgroundColor: isCancelledClass ? colors.danger : leftBg},
              ]}>
              <Text
                style={[
                  {
                    color: colors.white,
                    fontSize: metrics.s16,
                    fontFamily: Fonts.medium,
                  },
                ]}>
                {moment(item.end_time).format('dddd').substring(0, 3)}
              </Text>
              <Text
                style={[
                  styles.bold,
                  {
                    color: colors.white,
                    fontSize: metrics.s16,
                  },
                ]}>
                {moment(item.end_time).format('DD')}
              </Text>
              <Text
                style={[
                  {
                    color: colors.white,
                    fontSize: metrics.s16,
                    fontFamily: Fonts.medium,
                  },
                ]}>
                {moment(item.end_time).format('MMMM').substring(0, 3)}
              </Text>
              {/* <Text
                style={[
                  {
                    color: colors.white,
                    fontSize: metrics.s16,
                    fontFamily: Fonts.medium,
                    fontSize: 12
                  },
                ]}>
                {moment(end).format('hh:mm A')}
              </Text> */}
            </Box>
          )}
          {/* <Box style={styles.heart}>
                    <Pressable>
                        <MaterialIcon
                            name={'heart'}
                            size={30}
                            color={colors.primary}
                        />
                    </Pressable>
                </Box> */}
        </TouchableOpacity>
      </Box>
    );
};
export default React.memo(SmallFeedBox);
const styles = StyleSheet.create({
    bold: {
        fontSize: metrics.s12,
        fontFamily: Fonts.bold,
        textTransform: 'uppercase',
        fontWeight: 700,
    },

    offerContent: {
        // marginTop: metrics.s10,
        borderRadius: metrics.s10,
        flexDirection: 'row',
        overflow: 'hidden',
        flex: 1,
    },
    left: {
        paddingHorizontal: 15,
        paddingVertical: metrics.s15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    bottom: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: colors.black,
        padding: metrics.s10,
        // paddingLeft: 20,
        flex: 10,
    },
    offerTitle: {
        fontSize: 15,
        lineHeight: 17,
        color: colors.primary,
        fontFamily: Fonts.bold,
        fontWeight: 700,
    },
    offerDesc: {
        lineHeight: 16,
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.book,
    },
    date: {
        fontSize: 13,
        color: colors.black,
        fontFamily: Fonts.book,
    },
    heart: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
});
