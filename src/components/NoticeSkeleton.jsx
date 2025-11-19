/* eslint-disable prettier/prettier */
import { Dimensions } from 'react-native'
import React from 'react'
import { Box, HStack, Skeleton, VStack } from 'native-base'
import colors from '../themes/Colors'
import metrics from '../themes/Metrics'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NoticeSkeleton = () => {
    return (
        <Box>
            <HStack
                backgroundColor='white'
                borderWidth="1"
                space={4}
                rounded="md"
                _dark={{
                    borderColor: "white"
                }}
                _light={{
                    borderColor: "white"
                }}
            >
                <VStack style={{ padding: metrics.s10 }} space="2" width='100%'>
                    <Skeleton.Text flex='1' lines={2} startColor={colors.gray} />
                </VStack>
            </HStack>
        </Box>
    );
};

export default NoticeSkeleton;
