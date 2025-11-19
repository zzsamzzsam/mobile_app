/* eslint-disable prettier/prettier */
import { Badge, Box, Pressable, Text } from 'native-base';
import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import NotificationStrip from '../NotificationStrip';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import Fonts from '../../themes/Fonts';
import moment from 'moment';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';

const HomeNotification = ({ singleNotice, index, noViewAll }) => {
  const navigation = useNavigation();
  const handleNoticePress = () => {
    if (singleNotice?.resource === 'Cancellations' || singleNotice?.resource === 'cancellation' || singleNotice?.resource === 'schedule') {
      navigation.navigate(Routes.SCHEDULEDETAIL, { id: singleNotice?._id, resourceId: singleNotice?.resource_id, shouldFetch: true });
    } else {
      navigation.navigate(Routes.NOTICEDETAIL, { notice: singleNotice });
      trackUserEvent(TrackingEventTypes?.notification_opned, {
        message: 'User opened notification item',
        data: singleNotice,
      });
    }
  };
  const showNoticeType = (resource) => {
    switch (resource) {
      case 'notice':
        return 'NOTICE';
      case 'event':
        return "EVENT";
      // case 'cancellation':
      //   return 'SCHEDULE'
      // case 'closure':
      //   return 'SCHEDULE'
      default:
        return 'SCHEDULE';
    }
  }
  const getNotificationColour = resource => {
    switch (resource) {
      case 'notice':
        return colors.green;
      case 'event':
        return colors.black;
      case 'cancellation':
        return colors.danger;
      case 'closure':
        return colors.danger;
      case 'schedule':
        return colors.purple;
      default:
        return colors.warning;
    }
  };
  return (
    <Box
      shadow={'5'}
      style={[
        styles.notificationContainer,
        { marginTop: index === 0 ? metrics.s10 : 0 },
      ]}>
      <NotificationStrip color={getNotificationColour(singleNotice?.resource)} />
      <Pressable style={styles.notificationContent} onPress={handleNoticePress}>
        {/* {singleNotice?.resource === 'notice' && <Icons name="warning" style={{ marginLeft: 10 }} size={25} color={colors.warning} />} */}
        <Box style={styles.noticeDescBox}>
          <Text
            // noOfLines={3}
            style={
              singleNotice?.isRead
                ? styles.readTextStyle
                : styles.unReadTextStyle
            }>
            {/* {`${showNoticeType(singleNotice.resource)} : `}{singleNotice?.title} */}
            {/* {singleNotice?.title} -{' '} */}
            {singleNotice?.description
              ?.replace(/\n/g, '')
              .replace(/\t/g, '')
              .replace(/&[a-zA-Z0-9]+;/g, '')}
          </Text>
        </Box>
        <Text style={styles.dateText}>
          {singleNotice?.createdAt && moment(singleNotice?.createdAt).fromNow()}
        </Text>
      </Pressable>
    </Box>
  );
};

export default HomeNotification;

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: colors.white,
  },
  notificationContent: {
    paddingVertical: metrics.s10,
    paddingRight: 20,
  },
  dateText: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    color: colors.black,
    fontFamily: Fonts.book,
    fontSize: 12,
    paddingLeft: 20,
  },
  viewTextBox: {
    flex: 1,
    right: 10,
    bottom: -5,
  },
  noticeDescBox: {
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'flex-end',
  },
  readTextStyle: {
    marginLeft: 10,
    color: colors.black,
    fontFamily: Fonts.book,
    fontSize: metrics.s14,
    lineHeight: metrics.s18,
  },
  unReadTextStyle: {
    marginLeft: 10,
    color: colors.black,
    fontFamily: Fonts.book,
    fontWeight: '700',
    fontSize: metrics.s14,
    lineHeight: metrics.s18,
  },
});
