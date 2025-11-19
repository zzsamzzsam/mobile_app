/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import colors from '../../themes/Colors'
import { Box } from 'native-base';
import Icons from 'react-native-vector-icons/AntDesign';
import AppText from './Text';

const EmptyBox = ({ description, bg, style, noborder }) => {
    return (
        <Box style={[styles.centerBox, style, { backgroundColor: bg ? bg : colors.secondary, borderRadius: noborder ? 0 : 10 }]}>
            <Icons
                name="inbox"
                size={30}
                color={colors.secondary}
            />
            <AppText
                text={description}
            />
        </Box>
    );
};
const styles = StyleSheet.create({
    centerBox: {
        backgroundColor: colors.danger,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default EmptyBox