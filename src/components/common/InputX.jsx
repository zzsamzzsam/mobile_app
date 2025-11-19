/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { FormControl, Input, Stack, Text } from 'native-base'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { EyeNoSeeIcon, EyeSeeIcon, LockIcon, PersonIcon } from '../../public/Icons'
import metrics from '../../themes/Metrics'
import colors from '../../themes/Colors'
import Fonts from '../../themes/Fonts'

const InputA = ({ label, value, type, onFocus, style, containerStyle, onChangeText, error, perfix, ...other }, ref) => {
    return (
        <Stack style={containerStyle}>
            {label && <FormControl.Label>
                <Text style={styles.bookFont}>{label}</Text>
            </FormControl.Label>}
            <Input
                ref={ref}
                _input={{
                    fontSize: metrics.s16,
                    fontFamily: Fonts.book,
                }}
                style={style}
                value={value}
                type={'text'}
                autoCapitalize='none'
                focusOutlineColor={colors.primary}
                onFocus={onFocus}
                _focus={{ backgroundColor: 'none' }}
                InputLeftElement={perfix ? <PersonIcon margin={10} /> : null}
                onChangeText={onChangeText}
                placeholderTextColor={colors.gray}
                {...other}
            />
            {error !== '' && (
                <Text style={[styles.error, styles.bookFont]}>
                    {error}
                </Text>
            )}
        </Stack>

    )
};
export const PasswordInputA = ({ label, value, type, onFocus, style, onChangeText, error, containerStyle, ...other }, ref) => {
    const [show, setShow] = useState(false);
    return (
        <Stack style={containerStyle}>
            {label && <FormControl.Label>
                <Text style={styles.bookFont}>{label}</Text>
            </FormControl.Label>}
            <Input
                ref={ref}
                _input={{
                    fontSize: metrics.s16,
                    fontFamily: Fonts.book,
                }}
                style={style}
                value={value}
                autoCapitalize='none'
                type={show ? 'text' : "password"}
                focusOutlineColor={colors.primary}
                onFocus={onFocus}
                _focus={{ backgroundColor: 'none' }}
                InputLeftElement={<LockIcon margin={10} />}
                onChangeText={onChangeText}
                InputRightElement={
                    <TouchableOpacity onPress={() => setShow(!show)}>
                        {show ? (
                            <EyeSeeIcon margin={10} />
                        ) : (
                            <EyeNoSeeIcon margin={10} />
                        )}
                    </TouchableOpacity>
                }
                {...other}
            />
            {error !== '' && (
                <Text style={[styles.error, styles.bookFont]}>
                    {error}
                </Text>
            )}
        </Stack>

    )
};
export const InputX = React.forwardRef(InputA);
export const PasswordInputX = React.forwardRef(PasswordInputA);
const styles = StyleSheet.create({
    error: {
        color: 'red',
    },
    bookFont: {
        fontFamily: Fonts.book,
    },
})
