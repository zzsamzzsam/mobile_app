/* eslint-disable prettier/prettier */
import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Checkbox, Text } from 'native-base';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CheckBoxA = ({ title, value, isChecked, onChange, size, icon, onIconPress, ...other }) => {
    return (
        <Checkbox
            isChecked={isChecked}
            value={value}
            size={size === 'md' ? 'md' : 'sm'}
            colorScheme="darkBlue"
            onChange={onChange}
            {...other}
        >
            <Text style={styles.bookText}>{title}</Text>
            {
                icon && <TouchableOpacity
                    activeOpacity={0.5}
                    hitSlop={5}
                    onPress={onIconPress} >
                    <Icon name="help-circle" size={18} />
                </TouchableOpacity>
            }
        </Checkbox>
    );
};
const styles = StyleSheet.create({
    checkboxView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookText: {
        fontFamily: Fonts.medium,
        color: colors.primary,
    },
});
export default CheckBoxA;
