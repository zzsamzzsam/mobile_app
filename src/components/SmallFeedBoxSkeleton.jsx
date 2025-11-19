/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import { Box, HStack, Skeleton, VStack } from 'native-base';
import { Dimensions } from 'react-native';
import metrics from '../themes/Metrics';
import colors from '../themes/Colors';

const SmallFeedBoxSkeleton = ({ fullWidth }) => {
    const { width: SCREEN_WIDTH } = Dimensions.get('window');
    return (
        <Box>
            <HStack
                w={fullWidth ? '100%' : SCREEN_WIDTH - metrics.s20 * 4}
                backgroundColor={colors.white}
                borderWidth="1"
                space={2}
                rounded="md"
                _dark={{
                    borderColor: colors.white
                }}
                _light={{
                    borderColor: colors.white
                }}
                style={{ padding: metrics.s5 }}
            >
                <Skeleton flex="1" h='20' w='0.5' rounded="md" startColor={colors.gray} />
                <VStack flex="3" space="2">
                    <Skeleton startColor={colors.gray} />
                    <Skeleton.Text lines={2} startColor={colors.gray} />
                </VStack>
            </HStack>
        </Box>
    );
};

export default SmallFeedBoxSkeleton;
