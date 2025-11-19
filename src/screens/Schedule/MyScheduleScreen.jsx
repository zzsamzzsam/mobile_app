/* eslint-disable prettier/prettier */
import { Box, Divider, FlatList } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import { useStoreState } from 'easy-peasy';
import AppText from '../../components/common/Text';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import EachSchedule from '../../components/screens/EachSchedule';
import { useMutation, useQuery } from '@apollo/client';
import { GET_MY_SCHEDULES } from '../../Apollo/Queries';
import { CANCLE_BOOK_SCHEDULE } from '../../Apollo/Mutations';
import LoadingCircle from '../../components/LoadingCircle';
import EmptyBox from '../../components/common/EmptyBox';
import ButtonX from '../../components/common/BottonX';
import Fonts from '../../themes/Fonts';
import { ItemColor } from '../../utils';

const MyScheduleScreen = ({ navigation }) => {
  const [activeDay, setActiveDay] = useState("Today");
  const [activeDate, setActiveDate] = useState(moment().startOf('day'));
  const [refreshing, setRefreshing] = useState(false);

  const { fetchMyScheduleAfterRemove } = useStoreState(state => ({
    fetchMyScheduleAfterRemove: state.schedule.fetchMyScheduleAfterRemove
  }));

  const { data, loading, error, refetch } = useQuery(GET_MY_SCHEDULES, {
    variables: {
      startDate: activeDate,
      endDate: moment(activeDate).add(5, 'day'),
      page: 1,
    },
  });
  useEffect(() => {
    activeDate && refetch();
  }, [activeDate, data, fetchMyScheduleAfterRemove, refetch]);

  const [removeFromBookMutation, { loading: bookLoading }] = useMutation(CANCLE_BOOK_SCHEDULE);

  const activeDaySchedule = useMemo(() => {
    return data?.myAppEzSchedule?.myAppEzSchedule?.filter(item => moment(item?.startTimeUTC).isSame(activeDate, 'day'));
  }, [activeDate, data?.myAppEzSchedule?.myAppEzSchedule]);


  const today = () => {
    setActiveDay("Today");
    setActiveDate(moment().format('YYYY-MM-DD').toString());
  };
  const nextDate = () => {
    setActiveDay("Tomorrow");
    setActiveDate(moment().add(1, 'days').format('YYYY-MM-DD').toString());
  };
  const dayAfter = () => {
    setActiveDay("Day After");
    setActiveDate(moment().add(2, 'days').format('YYYY-MM-DD').toString());
  };

  const groupedSchedule = useMemo(() => {
    return activeDaySchedule?.reduce((result, schedule) => {
      const { startTimeUTC } = schedule;
      const existingGroup = result.find(group => group[0]?.startTimeUTC === startTimeUTC);

      if (existingGroup) {
        existingGroup.push(schedule);
      } else {
        result.push([schedule]);
      }

      return result;
    }, []);
  }, [activeDaySchedule]);
  const onRefreshPress = async () => {
    try {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    } catch (err) {
      setRefreshing(false);
    }
  };

  const _itemSeperatorComp = useCallback(() => {
    return <Divider style={{ height: 10, backgroundColor: colors.white }} />;
  }, []);

  return (
    <Box style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'space-between' }}>
      <Box style={{ flex: 1 }}>
        <Box style={styles.optionsContainer}>
          {/* <Box style={styles.headingContainer}>
          <Text style={styles.boldFont}>My Schedule</Text>
        </Box> */}
          <Box style={styles.options}>
            <Box
              style={[
                styles.optionTextContainer, styles.leftBorder]}>
              <TouchableOpacity onPress={today}>
                <AppText
                  text="Today"
                  style={[styles.optionText, activeDay === 'Today' && styles.underlineText]}
                />
              </TouchableOpacity>
            </Box>
            <Box
              style={[
                styles.optionTextContainer, styles.leftBorder]}>
              <TouchableOpacity onPress={nextDate}>
                <AppText
                  text="Tomorrow"
                  style={[styles.optionText, activeDay === 'Tomorrow' && styles.underlineText]}
                />
              </TouchableOpacity>
            </Box>
            <Box style={styles.optionTextContainer}>
              <TouchableOpacity onPress={dayAfter}>
                <AppText
                  text="Day After"
                  style={[styles.optionText, activeDay === 'Day After' && styles.underlineText]}
                />
              </TouchableOpacity>
            </Box>
          </Box>
        </Box>
        <Box style={styles.date}>

          <AppText
            text={moment(activeDate).format('dddd, MMM DD, YYYY').toString()}
            style={styles.dateText}

          />
        </Box>
        {
          (loading || refreshing) ? (<LoadingCircle />) : (groupedSchedule && groupedSchedule?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              contentContainerStyle={{ paddingTop: metrics.s10, paddingHorizontal: metrics.s20 }}
              data={groupedSchedule}
              keyExtractor={(item, index) => `${item._id}-${index}-${item?.ez_id}`}
              ItemSeparatorComponent={_itemSeperatorComp}
              renderItem={({ item, index }) => {
                return (
                  <EachSchedule
                    key={`${item.ez_id}-${index}`}
                    data={item}
                    index={index}
                    myschedule={true}
                    leftBg={ItemColor(item)}
                  />
                );
              }}
            />
          ) : (
            <EmptyBox
              style={{ marginHorizontal: 20 }}
              bg={colors.homeBg}
              noborder
              description="No Data"
            />
          ))
        }
      </Box>
      {/* s */}
      <Box style={{ paddingVertical: metrics.s10 }}>
        <ButtonX
          title="Refresh"
          onPress={onRefreshPress}
          style={{ marginHorizontal: metrics.s20 }}
        />
      </Box>
    </Box>
  );
};

export default MyScheduleScreen;

const styles = StyleSheet.create({
  optionsContainer: {
    backgroundColor: colors.primary,
    flexDirection: 'column',
    padding: metrics.s10,
    paddingBottom: 0,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: metrics.s10,
  },
  boldFont: {
    fontFamily: Fonts.bold,
    color: colors.white,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: metrics.s10,
  },
  optionText: {
    color: colors.white,
    fontFamily: Fonts.book,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: metrics.s5,
  },
  dateText: {
    fontFamily: Fonts.bold,
    color: colors.primary,
    fontSize: metrics.s14,
    fontWeight: 700,
  },
  underlineText: {
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  leftBorder: {
    borderRightWidth: 1,
    borderColor: colors.gray,
  },
});
