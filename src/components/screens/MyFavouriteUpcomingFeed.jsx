/* eslint-disable prettier/prettier */
import { Box, Divider } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import SmallFeedBoxSkeleton from '../SmallFeedBoxSkeleton';
import EmptyBox from '../common/EmptyBox';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import AppText from '../common/Text';
import { GET_MY_FAVOURITE_SCHEDULES } from '../../Apollo/Queries';
import { useQuery } from '@apollo/client';
import { useStoreState } from 'easy-peasy';
import SmallFeedBox from '../SmallFeedBox';
import Routes from '../../navigation/Routes';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../themes/Fonts';
const LIMIT = 20;

const MyFavouriteUpcomingFeed = () => {
    const navigation = useNavigation();
    const [page, setPage] = useState(1);

    const { data, loading, refetch } = useQuery(GET_MY_FAVOURITE_SCHEDULES, {
        variables: {
            limit: LIMIT,
            page: page,
        },
    });
    const { fetchMyFavouriteUpcoming } = useStoreState(state => ({
        fetchMyFavouriteUpcoming: state.schedule.fetchMyFavouriteUpcoming,
    }));
    useEffect(() => {
        fetchMyFavouriteUpcoming && refetch();
    }, [fetchMyFavouriteUpcoming, refetch]);

    const upcomingFavouriteSchedules = useMemo(() => {
        return data?.myFavouriteSchedules?.items?.filter(item => new Date(item?.start_time) > new Date());
    }, [data?.myFavouriteSchedules?.items]);

    const _renderItem = useCallback(({ item }) => {
        return (
            <SmallFeedBox
                item={item}
                leftBg={colors.primary}
                rightBg={colors.white}
                onPress={() => navigation.navigate(Routes.UPCOMINGFAVOURITES)}
            />
        )
    }, []);
    const _renderSkeleton = useCallback(({ item }) => {
        return <SmallFeedBoxSkeleton />
    }, [])
    const ItemSeparator = useCallback(() => {
        return (
            <Divider
                orientation='vertical'
                style={{ width: metrics.s10, backgroundColor: 'transparent' }}
            />
        );
    }, []);
    return (
        <Box style={{ marginHorizontal: metrics.s20 }}>

            <AppText
                text="My Upcoming Favourites"
                style={[styles.bold, { color: colors.primary, paddingVertical: 10 }]}
            />
            <Box>
                {
                    loading ? (
                        <FlatList
                            data={[1, 2, 4]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                            ItemSeparatorComponent={ItemSeparator}
                            renderItem={_renderSkeleton}
                        />
                    ) : ((upcomingFavouriteSchedules && upcomingFavouriteSchedules.length > 0) ? (
                        <FlatList
                            data={upcomingFavouriteSchedules?.slice(0, 10)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                            ItemSeparatorComponent={ItemSeparator}
                            renderItem={_renderItem}
                        />
                    ) : (
                        <EmptyBox
                            bg={colors.white}
                            description={"There are no upcoming favourite schedules."}
                        />
                    ))
                }
            </Box>

        </Box>
    );
};

export default MyFavouriteUpcomingFeed;

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
