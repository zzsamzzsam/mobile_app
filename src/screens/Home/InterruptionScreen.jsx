/* eslint-disable prettier/prettier */
import { Box, Divider } from 'native-base';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import SmallFeedBox from '../../components/SmallFeedBox';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import EmptyBox from '../../components/common/EmptyBox';
import { GET_CANCELLATIONS, GET_CLOSURES } from '../../Apollo/Queries';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import LoadingCircle from '../../components/LoadingCircle';

const LIMIT = 50;


const InterruptionScreen = () => {
    const navigation = useNavigation();
    const [limitToShow, setLimitToShow] = useState(10);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

    const { data, loading } = useQuery(GET_CLOSURES, {
        variables: {
            upcoming: true,
            limit: LIMIT,
            page: 1,
        },
    });
    const { data: cancellationData, loading: cancellationLoading } = useQuery(GET_CANCELLATIONS, {
        variables: {
            upcoming: true,
            limit: LIMIT,
            page: 1,
        },
    });
    const upcomingClosures = useMemo(() => {
        let result = [];
        if (data?.closures?.items) {
            result = [...result, ...data?.closures?.items];
        }
        if (cancellationData?.cancellations?.items) {
            result = [...result, ...cancellationData?.cancellations?.items]
        }
        const filtered = result?.filter(item => new Date(item?.start_time) >= new Date());
        return filtered.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    }, [data?.closures?.items, cancellationData?.cancellations?.items]);


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
                leftBg={colors.danger}
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
        if (!upcomingClosures) return;
        if (upcomingClosures?.length > limitToShow) {
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
                    (loading || cancellationLoading) ? (
                        <LoadingCircle />
                    ) : (
                        (upcomingClosures && upcomingClosures?.length > 0) ? (
                            <FlatList
                                data={upcomingClosures?.slice(0, limitToShow)}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                                ItemSeparatorComponent={ItemSeparator}
                                contentContainerStyle={{ paddingTop: metrics.s10, paddingBottom: showLoadingIndicator ? 0 : 10 }}
                                renderItem={_renderItem}
                                ListFooterComponent={showLoadingIndicator && _listFooterComp}
                                onEndReachedThreshold={0.2}
                                onEndReached={onEndReached}
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

export default InterruptionScreen;


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
