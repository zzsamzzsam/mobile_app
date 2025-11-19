/* eslint-disable prettier/prettier */
import { Box, Divider } from 'native-base';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import SmallFeedBox from '../../components/SmallFeedBox';
import SmallFeedBoxSkeleton from '../../components/SmallFeedBoxSkeleton';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import EmptyBox from '../../components/common/EmptyBox';
import { GET_EVENTS } from '../../Apollo/Queries';
import { ActivityIndicator } from 'react-native-paper';
import LoadingCircle from '../../components/LoadingCircle';

const LIMIT = 50;
const EventScreen = () => {
    const [limitToShow, setLimitToShow] = useState(10);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);


    const { data, loading } = useQuery(GET_EVENTS, {
        variables: {
            limit: LIMIT,
            page: 1,
        },
    });

    const upcomingEvents = useMemo(() => {
        return data?.events?.items?.filter(item => new Date(item?.start_time) >= new Date());
    }, [data?.events?.items]);

    const ItemSeparator = useCallback(() => {
        return (
            <Divider
                style={{
                    marginVertical: 5,
                    backgroundColor: 'transparent'
                }}
            />
        );
    }, []);

    const _renderItem = useCallback(({ item, index }) => {
        const bottomPadding = (index === upcomingEvents?.length - 1) ? 20 : 0;
        return (
            <SmallFeedBox
                fullWidth
                item={item}
                // style={{ paddingBottom: bottomPadding }}
                leftBg={colors.third}
                rightBg={colors.homeBg}
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
        if (!upcomingEvents) return;
        if (upcomingEvents?.length > limitToShow) {
            setShowLoadingIndicator(true);
            setTimeout(() => {
                setLimitToShow(prev => prev + 10);
                setShowLoadingIndicator(false);
            }, 2000);
        }
    }

    return (
        <Box style={styles.container}>
            <Box style={styles.boxStyle}>
                {
                    loading ? (
                        <LoadingCircle />
                    ) : (
                        (upcomingEvents && upcomingEvents?.length > 0) ? (
                            <FlatList
                                data={upcomingEvents}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                                ItemSeparatorComponent={ItemSeparator}
                                contentContainerStyle={{ paddingTop: 10, paddingBottom: showLoadingIndicator ? 0 : 10 }}
                                renderItem={_renderItem}
                                onEndReachedThreshold={0.5}
                                onEndReached={onEndReached}
                                ListFooterComponent={showLoadingIndicator && _listFooterComp}
                            />
                        ) : (
                            <EmptyBox
                                bg={colors.homeBg}
                                description="There is no upcoming events."
                            />
                        )
                    )
                }
            </Box>
        </Box>
    );
};

export default EventScreen;


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
