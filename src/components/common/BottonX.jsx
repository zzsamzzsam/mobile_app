/* eslint-disable prettier/prettier */
import React from 'react'
import { Button, Text } from 'native-base'
import metrics from '../../themes/Metrics'
import Fonts from '../../themes/Fonts'
import { StyleSheet, TouchableOpacity } from 'react-native'
import colors from '../../themes/Colors'
import AppText from './Text'

const ButtonX = ({
    title,
    isLoading,
    isLoadingText,
    onPress,
    style,
    bg,
    disabled,
    textColor,
    textStyle,
    variant,
    other,
}) => {
    return (
        <Button
            isLoading={isLoading}
            isLoadingText={isLoadingText}
            backgroundColor={bg ? bg : colors.primary}
            size={'md'}
            variant={variant ? variant : 'solid'}
            onPress={onPress}
            style={style}
            disabled={disabled}
            _text={{
                fontSize: metrics.s18,
                fontFamily: Fonts.medium,
            }}
            {...other}
        >
            <Text style={textStyle, [styles.btnText, { color: textColor ? textColor : colors.white }]}>
                {title}
            </Text>
        </Button>
    )
}

export const SmallButton = ({ title, style, onPress, outlined }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[style, styles.btn, outlined ? styles.outlined : styles.solid]}>
            <AppText
                text={title}
                color={outlined ? colors.black : colors.white}
                style={{ fontFamily: Fonts.medium }}
            />
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: metrics.s20,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outlined: {
        borderWidth: metrics.s10 * (1 / 10),
        borderColor: colors.gray,
        paddingVertical: metrics.s10 * (9 / 10),
    },
    solid: {
        backgroundColor: colors.primary,
        paddingVertical: metrics.s10
    },
    btnText: {
        fontSize: 15,
        fontFamily: Fonts.medium,
        paddingVertical: 2,
    }

})

export default ButtonX