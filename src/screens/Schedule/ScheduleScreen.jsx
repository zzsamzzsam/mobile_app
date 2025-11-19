/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { Box, Divider, Pressable } from 'native-base';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { CalendarIcon } from '../../public/Icons';
import moment from 'moment';
import EachSchedule from '../../components/screens/EachSchedule';
import LoadingCircle from '../../components/LoadingCircle';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import { useQuery } from '@apollo/client';
import { GET_BARCODES, GET_SCHEDULES } from '../../Apollo/Queries';
import AppText from '../../components/common/Text';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import { useStoreActions, useStoreState } from 'easy-peasy';
import EmptyBox from '../../components/common/EmptyBox';
import { ItemColor, allowedAudienceByMyBarcodes } from '../../utils';
import SwipableView from '../../components/SwipeableView';
import { IconButton, Modal, Portal, Provider } from 'react-native-paper';
import LegendScreen from '../Legend/LegendScreen';
import RNCalendarEvents from 'react-native-calendar-events';

const SCHEDULE_LIMIT = 99;

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const flatlistRef = useRef(null);
  const [shouldShowLegend, setShouldShowLegend] = useState(false)
  const [readyToHideReservation, setReadyToHideReservation] = useState(false);
  // const [loading, setLoading] = useState(false);
  const calendarRef = useRef(null);
  const [footerLoading, setFooterLoading] = useState(false);
  const [reservationWarningDismissed, setReservationWarningDismissed] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(moment().startOf('day'));
  const [refreshing, setRefreshing] = useState(false);
  const [limitToShow, setLimitToShow] = useState(5);

  const { scheduleFilters, showAllowedScheduleByBarcode } = useStoreState(state => ({
    scheduleFilters: state.schedule.scheduleFilters,
    showAllowedScheduleByBarcode: state.schedule.showAllowedScheduleByBarcode,
  }));

  const { setShowAllowedScheduleByBarcode } = useStoreActions(action => ({
    setShowAllowedScheduleByBarcode: action.schedule.setShowAllowedScheduleByBarcode,
  }));

  const { data: barcodeData } = useQuery(GET_BARCODES);
  const { data, loading, refetch } = useQuery(GET_SCHEDULES, {
    variables: {
      startDate: moment(selectedDate).subtract(12, 'hours'),
      endDate: moment(selectedDate).add(1, 'days'),
      limit: SCHEDULE_LIMIT,
      page: page,
      filtersInput: {
        activities: scheduleFilters?.activities?.selected,
        programs: scheduleFilters?.programs?.selected,
        audiences: scheduleFilters?.audiences?.selected,
        locations: scheduleFilters?.locations?.selected,
        trainers: scheduleFilters?.trainers?.selected,
      },
    },
  });
  const isToday = useMemo(() => {
    return moment(selectedDate)?.isSame(moment(), 'day');
  }, [selectedDate]);
  useEffect(() => {
    RNCalendarEvents.requestPermissions()
  }, []);
  useEffect(() => {
    refetch();
  }, [scheduleFilters, selectedDate, refetch, showAllowedScheduleByBarcode]);

  const schedules = useMemo(() => {
    const filteredSchedules = data?.appSchedules?.items?.filter(s =>
      moment(s.start_time)?.isSame(moment(selectedDate), 'day'),
    );
    return filteredSchedules;
  }, [data?.appSchedules?.items, selectedDate]);
  const upcomingSchedule = useMemo(() => {
    const barcodeTypes = barcodeData?.appBarcode?.map(item => item.message);
    // const checkDate = moment(selectedDate).isSame(moment(), 'day') ? new Date() : new Date(selectedDate);
    // return schedules?.filter(item => new Date(item?.start_time) > checkDate);
    if (showAllowedScheduleByBarcode) {
      const barcodeAllowed = allowedAudienceByMyBarcodes(barcodeTypes);
      return schedules?.filter(item => {
        if (item?.audiences?.length === 0 || item?.audiences?.length === 3) { // allow all access
          return true;
        }
        return item?.audiences.find(s => barcodeAllowed.includes(s));
      });
    } else {
      return schedules;
    }
  }, [schedules, showAllowedScheduleByBarcode, barcodeData?.appBarcode]);

  const groupedSchedulePassedToday = useMemo(() => {
    if (!isToday) {
      return [];
    }
    return upcomingSchedule?.reduce((result, session) => {
      const { start_time } = session;
      if (moment(start_time)?.isSameOrAfter()) {
        return result;
      }
      const existingGroup = result?.find(group => {
        return group[0]?.start_time === start_time;
      });

      if (existingGroup) {
        existingGroup.push(session);
      } else {
        result.push([session]);
      }
      return result;
    }, []);
  }, [isToday, upcomingSchedule]);
  const groupedSchedule = useMemo(() => {
    return upcomingSchedule?.reduce((result, session) => {
      const { start_time } = session;
      if (isToday && moment(start_time).isBefore()) {
        return result;
      }
      const existingGroup = result.find(group => {
        return group[0]?.start_time === start_time;
      });

      if (existingGroup) {
        existingGroup.push(session);
      } else {
        result.push([session]);
      }
      return result;
    }, []);
  }, [isToday, upcomingSchedule]);

  const onRefresh = async () => {
    setLimitToShow(10);
    setRefreshing(true);
    await refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const upNextItemIndex = useMemo(() => {
    return groupedSchedule?.findIndex(s => moment(s?.[0].start_time).isSameOrAfter());
  }, [groupedSchedule]);

  const _renderItem = useCallback(({ item, index, ignoreUpcoming }) => {
    return (
      <EachSchedule
        key={`${item.ez_id}-${index}`}
        data={item}
        index={index}
        upNextItemIndex={!ignoreUpcoming && upNextItemIndex}
        leftBg={ItemColor(item)}
      />
    );
  }, [upNextItemIndex]);

  const onEndReached = () => {
    if (footerLoading) return;
    if (groupedSchedule?.length > limitToShow) {
      setFooterLoading(true);
      setTimeout(() => {
        setLimitToShow(prev => prev + 10);
        setFooterLoading(false);
      }, 2000);
    }
  };

  const _listFooterComp = useCallback(() => {
    return (
      <Box style={styles.flatlistFooter}>
        <ActivityIndicator size={24} color={colors.secondary} />
      </Box>
    );
  }, []);

  const _itemSeperatorComp = useCallback(() => {
    return <Divider style={{ paddingVertical: 5, backgroundColor: 'transparent' }} />;
  }, []);
  const TodayPastSchedules = useCallback(() => {
    return (
      <Box
        style={{ paddingBottom: groupedSchedulePassedToday?.length ? 10 : 0 }}
        onLayout={event => {
          const { height } = event.nativeEvent.layout;
          if (flatlistRef.current && flatlistRef.current._listRef) {
            flatlistRef.current.scrollToOffset({
              animated: false,
              offset: height,
            });
            setTimeout(() => {
              setReadyToHideReservation(true);
            }, 2000);
          }
        }}>
        <FlatList
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: metrics.s10,
            paddingHorizontal: metrics.s20,
            paddingBottom: !footerLoading ? metrics.s10 : 0,
          }}
          data={groupedSchedulePassedToday}
          keyExtractor={(item, index) => `${item._id}-${index}-${item?.ez_id}`}
          onScroll={() => {
            if (readyToHideReservation) {
              setReservationWarningDismissed(true);
            }
          }}
          ListFooterComponent={footerLoading && _listFooterComp}
          ItemSeparatorComponent={_itemSeperatorComp}
          renderItem={({ item, index }) =>
            _renderItem({ item, index, ignoreUpcoming: true })
          }
          onEndReachedThreshold={0.2}
          onEndReached={onEndReached}
        />
      </Box>
    );
  }, [groupedSchedule])
  return (
    <Box style={{ flex: 1, backgroundColor: colors.white }}>
      <Box
        style={{
          flexDirection: 'row',
          // justifyContent: showAllowedScheduleByBarcode
          //   ? 'space-between'
          //   : 'flex-end',
          justifyContent: 'flex-end',
          paddingHorizontal: metrics.s20,
        }}>
        {showAllowedScheduleByBarcode && (
          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => setShowAllowedScheduleByBarcode(false)}
            style={{
              alignSelf: 'flex-start',
              marginVertical: metrics.s5,
            }}>
            <AppText
              text="Show All Schedules"
              style={[
                styles.mediumFont,
                {
                  color: colors.primary,
                  paddingHorizontal: 5,
                },
              ]}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => navigation.navigate(Routes.FILTER)}
          style={{
            // alignSelf: 'flex-end',
            justifyContent: 'flex-end',
            marginVertical: metrics.s5,
          }}>
          <AppText
            text="Filters"
            style={[
              styles.mediumFont,
              {
                color: colors.primary,
                paddingHorizontal: 5,
              },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => setShouldShowLegend(true)}
          style={{
            // alignSelf: 'flex-end',
            justifyContent: 'flex-end',
            marginVertical: metrics.s5,
          }}>
          <AppText
            text="Legends"
            style={[
              styles.mediumFont,
              {
                color: colors.primary,
                paddingHorizontal: 5,
              },
            ]}
          />
        </TouchableOpacity>
      </Box>
      <SwipableView shouldDismiss={reservationWarningDismissed} />
      <Box style={styles.dateSlider}>
        {!moment(selectedDate).isSame(moment(), 'day') && (
          <Pressable
            style={styles.calenderIcon}
            onPress={() => {
              setSelectedDate(new Date());
              setLimitToShow(5);
            }}>
            <CalendarIcon size={24} color={colors.white} />
          </Pressable>
        )}
        <Box>
          <CalendarStrip
            ref={calendarRef}
            scrollable
            style={{ marginTop: 1, height: 90, paddingTop: 5, paddingBottom: 5 }}
            scrollToOnSetSelectedDate={true}
            calendarColor={colors.primary}
            calendarHeaderStyle={{ color: 'white', marginBottom: 10 }}
            dateNumberStyle={{
              color: 'white',
              fontFamily: Fonts.bold,
              fontWeight: 700,
            }}
            dateNameStyle={{
              color: 'white',
              fontFamily: Fonts.bold,
              fontWeight: 700,
            }}
            iconStyle={{ tintColor: 'white' }}
            iconContainer={{ flex: 0.1 }}
            selectedDate={selectedDate}
            highlightDateNumberStyle={{ color: 'white' }}
            highlightDateNameStyle={{ color: 'white' }}
            daySelectionAnimation={{
              type: 'background',
              duration: 0,
              borderColor: colors.secondary,
              borderHighlightColor: colors.secondary,
              highlightColor: colors.secondary,
              borderWidth: 2,
            }}
            onDateSelected={(s, p) => {
              const _selectedDate = moment(s).subtract(12, 'hours');
              setLimitToShow(5);
              setSelectedDate(_selectedDate);
              // setTodayStartTime(s)
              // requestAnimationFrame(() => {
              //   refetch({
              //     startDate: _selectedDate.toISOString(),
              //     endDate: _selectedDate.add(1, 'day').toISOString(),
              //     limit: SCHEDULE_LIMIT,
              //     page: 1,
              //   });
              // });
            }}
          />
        </Box>
      </Box>
      {loading ? (
        <LoadingCircle />
      ) : ((groupedSchedule && groupedSchedule?.length) ||
        (groupedSchedulePassedToday && groupedSchedulePassedToday?.length)) >
        0 ? (
        <Box style={{ flex: 1 }}>
          {/* <FlatList
            // style={{flex: 1}}
            ref={flatlistRef}
            refreshing={refreshing}
            onRefresh={onRefresh}
            // initialScrollIndex={upNextItemIndex}
            showsVerticalScrollIndicator={false}
            // scrollEnabled={true}
            // pagingEnabled={true}
            // style={{height: '100%'}}
            contentContainerStyle={{
              paddingTop: metrics.s10,
              paddingHorizontal: metrics.s20,
              paddingBottom: !footerLoading ? metrics.s10 : 0,
            }}
            data={groupedSchedule.slice(0, 5)}
            keyExtractor={(item, index) =>
              `${item._id}-${index}-${item?.ez_id}`
            }
            onScroll={() => {
              setReservationWarningDismissed(true);
            }}
            ListFooterComponent={footerLoading && _listFooterComp}
            ItemSeparatorComponent={_itemSeperatorComp}
            renderItem={_renderItem}
            onEndReachedThreshold={0.2}
            onEndReached={onEndReached}
          /> */}
          <FlatList
            // style={{flex: 1}}
            ListHeaderComponent={TodayPastSchedules}
            ref={flatlistRef}
            refreshing={refreshing}
            onRefresh={onRefresh}
            // initialScrollIndex={upNextItemIndex}
            showsVerticalScrollIndicator={false}
            // scrollEnabled={true}
            // pagingEnabled={true}
            contentContainerStyle={{
              paddingTop: metrics.s10,
              paddingHorizontal: metrics.s20,
              paddingBottom: !footerLoading ? metrics.s10 : 0,
            }}
            data={
              isToday ? groupedSchedule : groupedSchedule.slice(0, limitToShow)
            }
            keyExtractor={(item, index) =>
              `${item._id}-${index}-${item?.ez_id}`
            }
            onScroll={() => {
              if (readyToHideReservation) {
                setReservationWarningDismissed(true);
              }
            }}
            ListFooterComponent={footerLoading && _listFooterComp}
            ItemSeparatorComponent={_itemSeperatorComp}
            renderItem={_renderItem}
            onEndReachedThreshold={0.2}
            onEndReached={onEndReached}
          />
        </Box>
      ) : (
        <EmptyBox
          style={{ marginHorizontal: metrics.s20, marginTop: metrics.s20 }}
          bg={colors.homeBg}
          noborder
          description="Schedule is not available"
        />
      )}
      <Portal>
        <Modal
          visible={shouldShowLegend}
          contentContainerStyle={{ backgroundColor: 'white', height: '90%' }}
          dismissable={true}
          onDismiss={() => setShouldShowLegend(false)}>
          <Box style={{ height: '100%' }}>
            <Box>
              <AppText
                bold
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  textAlign: 'center',
                  paddingTop: 10,
                  color: colors.primary,
                }}>
                Legend
              </AppText>
            </Box>
            <LegendScreen />
          </Box>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setShouldShowLegend(false)}
            style={{ position: 'absolute', top: 0, right: 0 }}
          />
        </Modal>
      </Portal>
    </Box>
  );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
  dateSlider: {
    paddingTop: 10,
    backgroundColor: colors.primary,
  },
  date: {
    paddingLeft: metrics.s10,
    flex: 2,
    borderWidth: 1,
    borderColor: colors.gray,
    fontFamily: Fonts.book,
    height: 35,
    justifyContent: 'center',
  },

  bigFont: {
    fontFamily: Fonts.medium,
    fontSize: metrics.s20 + metrics.s5,
  },
  mediumFont: {
    fontFamily: Fonts.medium,
  },
  calenderIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
    zIndex: 99,
  },
  flatlistFooter: {
    paddingVertical: metrics.s5,
  },
});
