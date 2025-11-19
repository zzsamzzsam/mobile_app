/* eslint-disable prettier/prettier */
import { Box, Divider, FlatList } from 'native-base';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import SmallFeedBox from '../SmallFeedBox';
import SmallFeedBoxSkeleton from '../SmallFeedBoxSkeleton';
import EmptyBox from '../common/EmptyBox';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import AppText from '../common/Text';
import { useQuery } from '@apollo/client';
import { GET_CANCELLATIONS, GET_CLOSURES } from '../../Apollo/Queries';
import { useNavigation } from '@react-navigation/native';
import Routes from '../../navigation/Routes';
import Fonts from '../../themes/Fonts';

const LIMIT = 20;
const InterruptionsFeed = () => {
    const navigation = useNavigation();
    const { data, loading, error } = useQuery(GET_CLOSURES, {
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
        const filtered = result?.filter(item => new Date(item?.start_time) > new Date());
        return filtered.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    }, [data?.closures?.items, cancellationData?.cancellations?.items]);
    const _renderClosureSkeleton = useCallback(({ item }) => {
        return <SmallFeedBoxSkeleton />;
    }, []);

    const ItemSeparator = useCallback(({ orientation }) => {
        return (
            <Divider
                orientation={orientation}
                style={{
                    width: metrics.s10,
                    backgroundColor: 'transparent'
                }}
            />
        );
    }, []);
    const _renderItem = useCallback(({ item }) => {
        return (
            <SmallFeedBox
                item={item}
                leftBg={colors.danger}
                rightBg={colors.white}
                onPress={() => navigation.navigate(Routes.INTERRUPTIONS)}
            />
        );
    }, []);
    return (
        <Box style={{ marginHorizontal: metrics.s20 }}>
            <AppText
                text="Interruptions"
                style={[styles.bold, { color: colors.primary, paddingVertical: 10 }]}
            />

            <Box>
                {
                    (loading || cancellationLoading) ? (
                        <FlatList
                            data={[1, 2, 4]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                            ItemSeparatorComponent={ItemSeparator}
                            renderItem={_renderClosureSkeleton}
                        />
                    ) : ((upcomingClosures && upcomingClosures.length > 0) ? (
                        <FlatList
                            data={upcomingClosures.slice(0, 15)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, idx) => `${item?._id}-${idx}`}
                            ItemSeparatorComponent={ItemSeparator}
                            renderItem={_renderItem}
                        />
                    ) : (
                        <EmptyBox
                            bg={colors.white}
                            description={"There are no Interruptions"}
                        />
                    ))
                }
            </Box>

        </Box>
    );
};

export default InterruptionsFeed;

const styles = StyleSheet.create({
    offerContainer: {
        paddingHorizontal: metrics.s20,
    },
    bold: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        fontWeight: 700,
    },
});
