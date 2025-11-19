/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { View, Modal, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import colors from '../../themes/Colors'
import AppText from './Text'
import metrics from '../../themes/Metrics'

const LoadingModal = ({ title, black }) => {
    return (
        <Modal animationType='fade'
            transparent={true}
            visible={true}
            statusBarTranslucent={true
            }>

            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: colors.homeBg }]}>
                    <ActivityIndicator size='large' color={colors.secondary} />
                    <AppText
                        bold
                        fontSize={15}
                        text={title}
                        style={styles.modalText}
                    />
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    modalView: {
        margin: metrics.s20,
        paddingHorizontal: metrics.s30,
        paddingVertical: metrics.s5,
        backgroundColor: colors.gray,
        borderRadius: metrics.s5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginVertical: metrics.s15,
        textAlign: 'center',
        marginLeft: metrics.s15,
        color: colors.black
    }
})
export default LoadingModal;