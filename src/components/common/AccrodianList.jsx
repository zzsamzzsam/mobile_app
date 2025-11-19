/* eslint-disable prettier/prettier */
import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Box } from 'native-base';
import { List } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';

const AccrodianList = ({ style, containerStyle, zeroMt, children, ...other }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <Box style={[containerStyle, { marginTop: zeroMt ? 0 : metrics.s10 }]}>
            <List.Accordion
                style={{ backgroundColor: colors.homeBg, paddingVertical: 5, shadowColor: 'white' }}
                right={(props) => <FontAwesome {...props} name={!expanded ? "chevron-down" : "chevron-up"} color={colors.primary} size={14} />}
                expanded={expanded}
                onPress={() => setExpanded(!expanded)}
                {...other}
            >
                {children}
            </List.Accordion>
        </Box>
    );
};
export default AccrodianList