/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import { Box, ScrollView } from 'native-base';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SmallFeedBox from './SmallFeedBox';
import moment from 'moment';
import AppText from './common/Text';
import { RectButton } from 'react-native-gesture-handler';
import SmallFeedBoxSkeleton from './SmallFeedBoxSkeleton';
import colors from '../themes/Colors';
import EmptyBox from './common/EmptyBox';
import metrics from '../themes/Metrics';
import Fonts from '../themes/Fonts';
import { GET_CANCELLATIONS } from '../Apollo/Queries';
import { useQuery } from '@apollo/client';

const LIMIT = 20;
const currentDate = new Date();
const SwipeableFeed = () => {
    const [page, setPage] = useState(1);

    const { data: cancellationData, loading } = useQuery(GET_CANCELLATIONS, {
        variables: {
            upcoming: true,
            limit: LIMIT,
            page: page,
        },
    });
    const todayCancellations = useMemo(() => {
        return cancellationData?.cancellations?.items?.filter(item => moment(item?.start_time).isSame(moment(currentDate), 'day'));
    }, [cancellationData?.cancellations?.items]);

    const SingleItem = ({ item, customStyle, data = cancellationData?.cancellations?.items }) => {
        const swipableRef = useRef(null);
        const renderLeftActions = (progress, dragX) => {
            const trans = dragX.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 1],
            });
            return (
                <RectButton style={styles.leftAction} onPress={() => console.log("predd=====")}>
                    <Animated.Text
                        style={[
                            styles.actionText,
                            {
                                transform: [{ translateX: trans }],
                            }
                        ]}>
                        Remove
                    </Animated.Text>
                </RectButton>
            );
        };
        return (
            <Swipeable
                ref={swipableRef}
                friction={2}
                enableTrackpadTwoFingerGesture
                leftThreshold={30}
                rightThreshold={40}
                // renderLeftActions={renderLeftActions}
                // renderRightActions={renderRightActions}
                onSwipeableOpen={(direction) => {
                    const newData = data.filter(s => s._id !== item._id);
                    // setData(newData)
                }}
                onSwipeableClose={(direction) => {
                    const newData = data.filter(s => s._id !== item._id);
                    // setData(newData)
                }}
            >
                <Box style={[customStyle]}>
                    <SmallFeedBox
                        item={item}
                        fullWidth
                        leftBg={colors.danger}
                        rightBg={colors.homeBg}
                    />
                </Box>
            </Swipeable >
        );
    }

    return (
        <Box style={{ flex: 1, marginBottom: 50 }}>
            <AppText
                text="Today's Cancellations"
                style={[styles.bold, { color: colors.primary, paddingVertical: 10 }]}
            />
            <Box>

                {
                    loading ? (
                        <ScrollView
                        >
                            {[1, 2, 3].map((single, idx) => {
                                return <Box key={`${single}+${idx}`} style={{ paddingBottom: (idx !== todayCancellations?.length - 1) ? metrics.s10 : 0 }} >
                                    <SmallFeedBoxSkeleton fullWidth />
                                </Box>
                            })}
                        </ScrollView>
                    ) : (
                        (todayCancellations && todayCancellations?.length > 0) ? (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {todayCancellations && todayCancellations.map((single, idx) => {
                                    const customStyle = {};
                                    if (idx === 0) {
                                        customStyle.marginTop = 0;
                                    } else {
                                        customStyle.marginTop = 10;
                                    }

                                    return <SingleItem key={single._id} customStyle={customStyle} data={cancellationData?.cancellations?.items} item={single} />
                                })}
                            </ScrollView>
                        ) : (
                            <EmptyBox
                                bg={colors.homeBg}
                                description="There are no cancellations for today."
                            />)
                    )
                }
            </Box>
        </Box>
    );
};
const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
        // backgroundColor: '#497AFC',
        justifyContent: 'center',
    },
    bold: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: Fonts.bold,
        fontWeight: 700
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
});
export default SwipeableFeed;
