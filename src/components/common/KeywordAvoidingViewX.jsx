import { View, Text, Keyboard } from 'react-native'
import React from 'react'
import { KeyboardAvoidingView } from 'native-base'
import { isIos } from '../../constant'
import { TouchableWithoutFeedback } from 'react-native'

const KeywordAvoidingViewX = ({ children, containerStyle }) => {
    const back = false;
    return (
        <KeyboardAvoidingView
            behavior={isIos ? 'padding' : 'height'}
            style={[containerStyle, { flex: 1 }]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {children}
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default KeywordAvoidingViewX