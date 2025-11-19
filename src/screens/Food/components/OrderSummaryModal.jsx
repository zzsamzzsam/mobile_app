/* eslint-disable prettier/prettier */
import { View, Text, Modal, StyleSheet, Pressable, FlatList } from 'react-native'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useMutation } from '@apollo/client';
import colors from '../../../themes/Colors';
import Fonts from '../../../themes/Fonts';
import AntIcon from 'react-native-vector-icons/AntDesign'
import LoadingCircle from '../../../components/LoadingCircle';
import { useStoreState } from 'easy-peasy';
import { CREATE_ORDER_SUMMARY } from '../../../Apollo/Mutations';

const OrderSummaryModal = ({ modalVisible, setModalVisible }) => {
    const { orderCart, currentRestaurant } = useStoreState(st => ({
        orderCart: st.cart.orderCart,
        actualUser: st.login.actualUser,
        currentRestaurant: st.cart.currentRestaurant,
    }));
    const [createOrderSummaryMutation, { data: orderSummaryData, loading: orderSummeryCalculating, error }] = useMutation(CREATE_ORDER_SUMMARY);


    useEffect(() => {
        const getOrderSummary = async () => {
            try {
                if (orderCart?.lineItems?.length > 0) {
                    await createOrderSummaryMutation({
                        variables: {
                            input: {
                                code: `${currentRestaurant?.code}`,
                                orderCart,
                            },
                        },
                    });
                }
            } catch (err) {
                console.log(err.toString());
            }
        };

        !!orderCart?.lineItems?.length && getOrderSummary();
    }, [orderCart?.lineItems, modalVisible]);

    const groupedItems = useMemo(() => {
        return orderSummaryData?.createOrderSummary?.orderCart?.lineItems?.elements.reduce((result, singleItem) => {
            const existingItem = result.find(x => x[0].id === singleItem?.id);
            if (existingItem) {
                existingItem.push(singleItem);
            } else {
                result.push([singleItem])
            }
            return result;
        }, [])
    }, [orderSummaryData?.createOrderSummary?.orderCart?.lineItems?.elements]);

    const _renderItem = useCallback(({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <View style={[styles.itemDescriptionContainer, { borderTopWidth: index === 0 ? 0 : 1, }]}>
                    <Text style={styles.title}>{`${item[0]?.name}  x ${item?.length}`}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.subTitle}>{`$${((item[0]?.price * item?.length) / 100).toFixed(2)}`}</Text>
                    </View>
                </View>
            </View>
        );
    }, []);
    return (
        <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(true);
            }}>
            <View style={styles.modalView}>
                {orderSummeryCalculating ? (
                    <LoadingCircle />
                ) : (
                    <View style={{ marginTop: 40 }}>
                        <Text style={styles.bigText}>Your Order</Text>
                        {
                            groupedItems?.length > 0 ? (
                                <View>
                                    <View style={{ backgroundColor: colors.homeBg }}>
                                        <FlatList
                                            data={groupedItems}
                                            renderItem={_renderItem}
                                        />
                                    </View>
                                    <View style={styles.summaryView}>
                                        <View style={styles.rowStyle}>
                                            <Text style={styles.subTitle}>Subtotal</Text>
                                            <Text style={styles.subTitle}>{`$${(orderSummaryData?.createOrderSummary?.subtotal / 100).toFixed(2)}`}</Text>
                                        </View>
                                        <View style={styles.rowStyle}>
                                            <Text style={styles.subTitle}>Tax</Text>
                                            <Text style={styles.subTitle}>{`$${(orderSummaryData?.createOrderSummary?.totalTaxAmount / 100).toFixed(2)}`}</Text>
                                        </View>
                                        <View style={styles.rowStyle}>
                                            <Text style={styles.totalText}>Total</Text>
                                            <Text style={styles.totalText}>{`$${(orderSummaryData?.createOrderSummary?.total / 100).toFixed(2)}`}</Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <Text>Add items to your order</Text>
                                </View>
                            )
                        }

                    </View>
                )
                }
                <Pressable onPress={() => setModalVisible(false)} style={styles.iconView}>
                    <AntIcon name='closecircle' size={24} color={colors.primary} />
                </Pressable>
            </View>
        </Modal >
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
    },
    bigText: {
        fontSize: 18
        , fontFamily: Fonts.book,
        fontWeight: '700',
        color: colors.black,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: Fonts.book,
        color: colors.primary,
        fontWeight: '700',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: colors.black,
        marginBottom: 5,
    },
    modalView: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
        paddingTop: 40,
        position: 'relative',
    },
    totalText: {
        fontSize: 16,
        fontFamily: Fonts.book,
        color: colors.black,
        fontWeight: '700',
        marginBottom: 5,
    },
    summaryView: {
        borderTopWidth: 1,
        borderColor: colors.gray,
        justifyContent: 'space-between',
        backgroundColor: colors.homeBg,
        paddingVertical: 10,
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    iconView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 40,
        left: 20,
    },
    itemContainer: {
        paddingTop: 0,
        paddingHorizontal: 10,
    },
    itemDescriptionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: colors.gray,
        paddingVertical: 10
    }
});

export default OrderSummaryModal