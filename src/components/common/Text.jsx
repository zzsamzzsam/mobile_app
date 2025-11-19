/* eslint-disable prettier/prettier */
import { Text } from 'native-base'
import React from 'react'
import Fonts from '../../themes/Fonts'
import colors from '../../themes/Colors';

const AppText = ({ bold, fontSize, color, text, underline, style, children, ...other }) => {
    const extras = {};
    if(bold) {
        extras.fontWeight = 700;
    }
    return (
        <Text
            style={[style, { letterSpacing: 0.1 }]}
            fontFamily={bold ? Fonts.bold : Fonts.book}
            color={color ? color : colors.black}
            fontSize={fontSize}
            {...extras}
            {...other}
            lineHeight={24}
        >
            {text ? text : children}
        </Text>
    )
}

export default AppText