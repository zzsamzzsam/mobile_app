/* eslint-disable prettier/prettier */
import React, { memo, useState } from 'react'
import { FormControl, Stack, View, Text } from 'native-base'
import { StyleSheet, TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { EyeNoSeeIcon, EyeSeeIcon, LockIcon, PersonIcon } from '../../public/Icons'
import metrics from '../../themes/Metrics'
import colors from '../../themes/Colors'
import Fonts from '../../themes/Fonts'

const InputA = ({ label, value, type, onFocus, style, containerStyle, onChangeText, error, perfix, ...other }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const inputStyles = [
        nativeStyles.inputBase,
        isFocused ? nativeStyles.inputFocused : nativeStyles.inputBlur,
        style
    ];
    
    const containerDynamicStyle = [
        nativeStyles.inputContainer,
        isFocused ? nativeStyles.inputFocused : nativeStyles.inputBlur
    ];
    
    return (
        <Stack style={containerStyle}>
            {label && <FormControl.Label>
                <Text style={styles.bookFont}>{label}</Text>
            </FormControl.Label>}
            <View style={containerDynamicStyle}>
                {perfix ? <PersonIcon margin={10} /> : null}
                <TextInput
                    ref={ref}
                    style={inputStyles}
                    value={value}
                    autoCapitalize='none'
                    secureTextEntry={type=='text' ? false : true}
                    selectionColor={colors.primary}
                    onFocus={onFocus}
                    onChangeText={onChangeText}
                    placeholderTextColor={colors.gray}
                    color={colors.black}
                    {...other}
                />
            </View>
            {error !== '' && (
                <Text style={[styles.error, styles.bookFont]}>
                    {error}
                </Text>
            )}
        </Stack>
    )
};
export const PasswordInputA = ({ label, value, type, onFocus, style, onChangeText, error, containerStyle, ...other }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [show, setShow] = useState(false);
    
    const inputStyles = [
        nativeStyles.inputBase,
        isFocused ? nativeStyles.inputFocused : nativeStyles.inputBlur,
        style
    ];
    
    const containerDynamicStyle = [
        nativeStyles.inputContainer,
        isFocused ? nativeStyles.inputFocused : nativeStyles.inputBlur
    ];
    
    return (
        <Stack style={containerStyle}>
            {label && <FormControl.Label>
                <Text style={styles.bookFont}>{label}</Text>
            </FormControl.Label>}
            <View style={containerDynamicStyle}>
                <LockIcon margin={10} />
                <TextInput
                    ref={ref}
                    style={inputStyles}
                    value={value}
                    autoCapitalize='none'
                    secureTextEntry={show ? false : true}
                    selectionColor={colors.primary}
                    onFocus={onFocus}
                    onChangeText={onChangeText}
                    placeholderTextColor={colors.gray}
                    color={colors.black}
                    {...other}
                />
                <TouchableOpacity onPress={() => setShow(!show)}>
                    {show ? (
                        <EyeSeeIcon margin={10} />
                    ) : (
                        <EyeNoSeeIcon margin={10} />
                    )}
                </TouchableOpacity>
            </View>
            {error !== '' && (
                <Text style={[styles.error, styles.bookFont]}>
                    {error}
                </Text>
            )}
        </Stack>
    )
};
export const InputX = React.memo(React.forwardRef(InputA));
export const PasswordInputX = React.memo(React.forwardRef(PasswordInputA));
const styles = StyleSheet.create({
    error: {
        color: 'red',
    },
    bookFont: {
        fontFamily: Fonts.book,
    },
})

const nativeStyles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#FFFFFF', 
        borderRadius: 4, 
        borderWidth: 1,
        paddingRight: 10,
    },
    inputBase: {
        flex: 1, 
        fontSize: metrics.s16,
        fontFamily: Fonts.book,
        padding: 10,
        borderWidth: 0,
    },
    inputBlur: {
        borderColor: colors.gray, 
    },
    inputFocused: {
        borderColor: colors.primary,
    }
});
