/* eslint-disable prettier/prettier */
import { Box, Divider } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useStoreState } from 'easy-peasy';

import { useQuery } from '@apollo/client';
import SmallFeedBox from '../../components/SmallFeedBox';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import EmptyBox from '../../components/common/EmptyBox';
import { GET_MY_FAVOURITE_SCHEDULES } from '../../Apollo/Queries';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import LoadingCircle from '../../components/LoadingCircle';
import Routes from '../../navigation/Routes';

const LIMIT = 50;
const UpcomingFavouriteScheduleScreen = () => {
    const navigation = useNavigation()
    const [page, setPage] = useState(1)
    const [currentDate, setCurrentDate] = useState(moment());
    const [limitToShow, setLimitToShow] = useState(10);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
    const { data, loading, refetch } = useQuery(GET_MY_FAVOURITE_SCHEDULES, {
        variables: {
            limit: LIMIT,
            page: page,
        },
    });
    const { fetchMyFavouriteUpcoming } = useStoreState(state => ({
        fetchMyFavouriteUpcoming: state.schedule.fetchMyFavouriteUpcoming
    }));
    useEffect(() => {
        refetch();
    }, [fetchMyFavouriteUpcoming]);

    const upcomingFavouriteSchedules = useMemo(() => {
        return data?.myFavouriteSchedules?.items?.filter(item => new Date(item?.start_time) >= new Date());
    }, [data?.myFavouriteSchedules?.items]);


    const ItemSeparator = useCallback(({ orientation }) => {
        return (
            <Divider
                orientation={orientation}
                style={{
                    height: metrics.s10,
                    backgroundColor: 'transparent'
                }}
            />
        );
    }, []);
    const _renderItem = useCallback(({ item }) => {
        return (
            <SmallFeedBox
                fullWidth
                item={item}
                leftBg={colors.primary}
                rightBg={colors.homeBg}
                onPress={() => navigation.navigate(Routes.SCHEDULEDETAIL, { detail: item })}
            />
        );
    }, []);
    const _listFooterComp = useCallback(() => {
        return (
            <Box style={styles.flatlistFooter}>
                <ActivityIndicator size={24} color={colors.secondary} />
            </Box>
        );
    }, []);
    const onEndReached = () => {
        if (!upcomingFavouriteSchedules) return;
        if (upcomingFavouriteSchedules?.length > limitToShow) {
            setShowLoadingIndicator(true);
            setTimeout(() => {
                setLimitToShow(prev => prev + 10);
                setShowLoadingIndicator(false);
            }, 2000);
        }
    };


    return (
        <Box style={styles.container}>
            <Box style={styles.boxStyle}>
                {
                    loading ? (
                        <LoadingCircle />
                    ) : (
                        (upcomingFavouriteSchedules && upcomingFavouriteSchedules?.length > 0) ? (
                            <FlatList
                                data={upcomingFavouriteSchedules?.slice(0, limitToShow)}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                                ItemSeparatorComponent={ItemSeparator}
                                contentContainerStyle={{ paddingTop: metrics.s10, paddingBottom: showLoadingIndicator ? 0 : 10 }}
                                renderItem={_renderItem}
                                ListFooterComponent={showLoadingIndicator && _listFooterComp}
                                onEndReached={onEndReached}
                                onEndReachedThreshold={0.2}
                            />
                        ) : (
                            <EmptyBox
                                bg={colors.white}
                                description="There is no upcoming events."
                            />
                        )
                    )
                }
            </Box>
        </Box>
    );
};
export default UpcomingFavouriteScheduleScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    boxStyle: {
        flex: 1,
        marginHorizontal: metrics.s20,
    },
    flatlistFooter: {
        paddingVertical: metrics.s5,
    },
});
