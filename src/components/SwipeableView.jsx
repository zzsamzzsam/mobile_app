/* eslint-disable prettier/prettier */
import { Box, Pressable, Text } from 'native-base';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import colors from '../themes/Colors';
import Fonts from '../themes/Fonts';
import metrics from '../themes/Metrics';

const SwipableView = ({ item, onDismiss, shouldDismiss }) => {
    const translateX = useSharedValue(0);
    const height = useSharedValue(500);
    const { width: SCREEN_WIDTH } = Dimensions.get('window');

    const dismissFunction = () => {
        translateX.value = withTiming(-SCREEN_WIDTH);
        height.value = withTiming(0);
    };
    const rStyle = useAnimatedStyle(() => {
        return {
            maxHeight: height.value,
        };
    });

    useEffect(() => {
        if (shouldDismiss) {
            dismissFunction();
        }
    }, [shouldDismiss]);

    const rContainerHeight = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value,
            },
        ],
    }));

    return (
        <Animated.View style={[rStyle, rContainerHeight]}>
            <Pressable style={styles.offerContent} onPress={dismissFunction}>
                <Box
                    style={styles.boxStyle}>
                    <Text style={{ fontFamily: Fonts.medium, color: colors.white }}>
                        Reservations can only be made 48hours in advance
                    </Text>
                </Box>
            </Pressable>
        </Animated.View>
    );
};

export default SwipableView;

const styles = StyleSheet.create({
    boxStyle: {
        backgroundColor: colors.primary,
        padding: metrics.s20,
        paddingTop: metrics.s10,
        paddingBottom: metrics.s10,
    },
    offerContent: {
        elevation: 14,
    },
});
