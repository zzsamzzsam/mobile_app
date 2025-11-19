import React from 'react'
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import { Box } from 'native-base';

const ContainerBox = ({ style, children }) => {
    return (<Box
        style={[style, {
            flex: 1,
            padding: metrics.s20,
            backgroundColor: colors.white,
        }]}
    >
        {children}
    </Box>)
}
export default ContainerBox;