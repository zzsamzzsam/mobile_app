/* eslint-disable prettier/prettier */
import React from 'react'
import { Chip } from 'react-native-paper';
import colors from '../../themes/Colors';
import { StyleSheet } from 'react-native';
import Fonts from '../../themes/Fonts';

const ChipX = ({ onPress, style, selected, text, ...other }) => {
    return (
        <Chip
            onPress={onPress}
            compact
            selected={selected}
            selectedColor={colors.primary}
            textStyle={styles.chipText}
            style={[style, styles.chipStyle, { backgroundColor: selected ? colors.secondary : colors.white }]}
            mode='outlined'
            {...other}
        >
            {text}
        </Chip>
    );
};
export default ChipX;

const styles = StyleSheet.create({
    chipStyle: {
        borderColor: colors.primary,
    },
    chipText: {
        fontFamily: Fonts.bold,
        fontWeight: 700,
        fontSize: 13,
        color: colors.primary,
    },
});
