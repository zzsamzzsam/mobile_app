/* eslint-disable prettier/prettier */
import { Box, Divider, Text } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import NotificationStrip from '../NotificationStrip';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import metrics from '../../themes/Metrics';
import AppText from '../common/Text';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import NoticeSkeleton from '../NoticeSkeleton';
import { useQuery } from '@apollo/client';
import { GET_NOTICES, GET_PROGRAM_SCHEDULES } from '../../Apollo/Queries';
import { removeHtmlEntities } from '../../utils/utils';
import moment from 'moment';
import { isWithinInterval, parseISO } from 'date-fns';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const HomeNotice = ({noViewAll, onlyParking, setHasLotJ, hasLotJ}) => {
  const navigation = useNavigation();
  const [hasPass, setHasPass] = useState(false);
  const {data, loading} = useQuery(GET_NOTICES, {
    variables: {
      upcoming: false,
      limit: 3,
      page: 1,
    },
  });
  const {data: pSchedules, refetch: refetchPSchedule} = useQuery(
    GET_PROGRAM_SCHEDULES,
  );
  useEffect(() => {
    const now = new Date();
    const runningLotJ =
      pSchedules?.appEzProgramSchedules?.filter(s => {
        try {
          const startTime = parseISO(s.start_time);
          const endTime = parseISO(s.end_time);

          const isWithin = isWithinInterval(now, {
            start: startTime,
            end: endTime,
          });
          return isWithin;
        } catch(e) {
          console.log('Error parsing====', e, s);
          return false;
        }
      }) || [];
      setHasPass(
        !!pSchedules?.appEzProgramSchedules?.find(s => s.hasParkingPass),
      );
    setHasLotJ(!!runningLotJ.length);
  }, [pSchedules]);
  const notices = useMemo(() => {
    let _notices = [];
    if (data?.latestNotices?.items?.length) {
      _notices = data.latestNotices.items.filter(s => {
        if (!onlyParking) {
          return true;
        }
        if (s.tags.includes('Parking')) {
          return true;
        }
        return false;
      });
    }
    return _notices;
  }, [data]);
  const renderPSchedule = ({item}) => {
    const startDate = moment(item.start_time).format('ddd, MMM DD');
    const endDate = moment(item.end_time).format('ddd, MMM DD');
    const startTime = moment(item.start_time).format('hh:mm A ');
    const endTime = moment(item.end_time).format('hh:mm A ');
    return (
      <Box
        shadow={'5'}
        style={[styles.notificationContainer]}
        width={SCREEN_WIDTH * 0.8}>
        <NotificationStrip color={colors.black} />
        <Pressable style={styles.notificationContent} onPress={() => {}}>
          {/* {singleNotice?.resource === 'notice' && <Icons name="warning" style={{ marginLeft: 10 }} size={25} color={colors.warning} />} */}
          <Box style={styles.noticeDescBox}>
            <Text
              // noOfLines={3}
              style={styles.notifTitle}>
              UTSC Lot J
            </Text>
            <Text style={styles.notifSubTitle}>
              Lot J is available from{' '}
              <Text style={styles.bold}>
                {startDate === endDate
                  ? startTime
                  : `${startDate} ${startTime}`}
              </Text>
              to{' '}
              <Text style={styles.bold}>
                {startDate === endDate ? endTime : `${endDate} ${endTime}`}
                {startDate === endDate ? `on ${startDate}` : ''}
              </Text>{' '}
              for permit holders on a first come, first served basis
            </Text>
          </Box>
        </Pressable>
      </Box>
    );
  };
  const _itemSeperatorComp = useCallback(() => {
    return (
      <Divider style={{paddingVertical: 5, backgroundColor: 'transparent'}} />
    );
  }, []);
  return (
    <>
      <Box shadow={'6'} style={[styles.notificationContainer]}>
        {loading && !onlyParking ? (
          <NoticeSkeleton />
        ) : (
          !!notices?.length && (
            <Box>
              <NotificationStrip color={colors.warning} />
              <TouchableOpacity
                style={styles.notificationContent}
                onPress={() =>
                  navigation.navigate(Routes.NOTICEDETAIL, {
                    notice: notices[0],
                  })
                }>
                <Icons name="warning" size={25} color={colors.warning} />
                <Box style={styles.centerBpx}>
                  <Box style={styles.noticeBox}>
                    <AppText
                      text={`NOTICE: ${removeHtmlEntities(
                        notices[0].description,
                      )}`}
                      //   noOfLines={5}
                      style={styles.noticeText}
                    />
                  </Box>
                  {notices && notices.length > 1 && (
                    <TouchableOpacity
                      style={styles.viewAllBox}
                      onPress={() => navigation.navigate(Routes.NOTICE)}>
                      <Text style={styles.viewallText}>view all</Text>
                    </TouchableOpacity>
                  )}
                </Box>
              </TouchableOpacity>
            </Box>
          )
        )}
      </Box>
      {hasPass && !!pSchedules?.appEzProgramSchedules?.length && (
        <FlatList
          data={pSchedules?.appEzProgramSchedules}
          horizontal
          contentContainerStyle={{alignItems: 'stretch'}}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, idx) => `${item?._id}-${idx}`}
          renderItem={renderPSchedule}
          // ItemSeparatorComponent={_itemSeperatorComp}
        />
      )}
    </>
  );
};

export default HomeNotice;

const styles = StyleSheet.create({
  noticeDescBox: {
    flex: 1,
    paddingLeft: 10,
  },
  bold: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold'
  },
  notifTitle: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: Fonts.bold,
  },
  notifSubTitle: {
    fontFamily: Fonts.book,
    textAlign: 'left',
    // fontWeight: 'bold',
    // fontFamily: Fonts.bold,
    // fontSize: 12,
  },
  notificationContainer: {
    backgroundColor: colors.white,
    position: 'relative',
    marginTop: metrics.s20,
    marginHorizontal: 10,
  },
  notificationContent: {
    paddingVertical: metrics.s10,
    paddingHorizontal: metrics.s10,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  centerBpx: {
    flexDirection: 'row',
    width: '100%',
    flexShrink: 1,
    justifyContent: 'center',
  },
  noticeBox: {
    // backgroundColor: 'red',
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeText: {
    marginHorizontal: metrics.s10,
    fontSize: metrics.s12,
    fontFamily: Fonts.medium,
    lineHeight: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewallText: {
    color: colors.danger,
    fontFamily: Fonts.medium,
  },
  viewAllBox: {
    alignSelf: 'flex-end',
    bottom: -metrics.s5,
  },
});
