/* eslint-disable prettier/prettier */
import { Box, Divider } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import SmallFeedBoxSkeleton from '../SmallFeedBoxSkeleton';
import EmptyBox from '../common/EmptyBox';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import AppText from '../common/Text';
import { GET_MY_FAVOURITE_SCHEDULES, GET_MY_SCHEDULES } from '../../Apollo/Queries';
import { useQuery } from '@apollo/client';
import { useStoreState } from 'easy-peasy';
import SmallFeedBox from '../SmallFeedBox';
import Routes from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../themes/Fonts';
import moment from 'moment';
import { trackUserEvent } from '../../utils';
import { TrackingEventTypes } from '../../constant';
const LIMIT = 20;

const MyScheduleFeed = () => {
    const navigation = useNavigation();
    const [page, setPage] = useState(1);
    const [activeDate, setActiveDate] = useState(moment().startOf('day'));
    const {data, loading, error, refetch} = useQuery(GET_MY_SCHEDULES, {
      variables: {
        startDate: activeDate,
        endDate: moment(activeDate).add(5, 'day'),
        page: 1,
      },
    });

    const upcomingMySchedules = data?.myAppEzSchedule?.myAppEzSchedule;
    const _renderItem = useCallback(({ item }) => {
        return (
            <SmallFeedBox
                item={item}
                leftBg={colors.primary}
                rightBg={colors.white}
                showBookingStatus={true}
                onPress={() => {
                    trackUserEvent(
                      TrackingEventTypes?.my_booking_feed_pressed,
                      {
                        data: {
                        },
                      },
                    );
                    navigation.navigate(Routes.SCHEDULETOPSTACK, {
                      screen: Routes.MYSCHEDULE,
                    });
                }}
            />
        )
    }, []);
    const ItemSeparator = useCallback(() => {
        return (
            <Divider
                orientation='vertical'
                style={{ width: metrics.s10, backgroundColor: 'transparent' }}
            />
        );
    }, []);
    // return <AppText>sdfsd</AppText>;
    if(!upcomingMySchedules || !upcomingMySchedules.length) {
        return null;
    }
    return (
        <Box style={{ marginHorizontal: metrics.s20 }}>

            <AppText
                text="My Bookings"
                style={[styles.bold, { color: colors.primary, paddingVertical: 10 }]}
            />
            <Box>
                <FlatList
                            data={upcomingMySchedules?.slice(0, 10)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                            ItemSeparatorComponent={ItemSeparator}
                            renderItem={_renderItem}
                        />
            </Box>

        </Box>
    );
};

export default MyScheduleFeed;

const styles = StyleSheet.create({
    boxStyle: {
        marginTop: 10,
    },
    offerContainer: {
        paddingHorizontal: metrics.s20,
    },
    bold: {
        paddingBottom: 10,
        fontSize: 14,
        fontFamily: Fonts.bold,
        fontWeight: 700,
    },
});
