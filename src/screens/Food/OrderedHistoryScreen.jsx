/* eslint-disable prettier/prettier */
import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import { useQuery } from '@apollo/client'
import { GET_MY_ORDERS } from '../../Apollo/Queries'
import colors from '../../themes/Colors';
import { Divider } from 'native-base';
import moment from 'moment';
import { List } from 'react-native-paper';
import Fonts from '../../themes/Fonts';
import LoadingCircle from '../../components/LoadingCircle';

const OrderedHistoryScreen = () => {
    const { data, loading } = useQuery(GET_MY_ORDERS);

    const _renderItem = useCallback(({ item, index }) => {
        return (
            <View>
                <View style={[styles.itemContainer, { marginTop: index === 0 ? 10 : 0, marginBottom: index === data?.getMyOrders?.length - 1 ? 10 : 0 }]}>
                    <List.Accordion
                        title="Order Details"
                        titleStyle={styles.titleText}
                        style={{ backgroundColor: colors.homeBg }}
                        rippleColor={colors.homeBg}
                    >
                        <View style={{ marginHorizontal: 20 }}>
                            <View style={styles.rowStyle}>
                                <Text style={styles.descriptionText}>Ordered From:</Text>
                                <Text style={styles.descriptionText}>{item?.restaurantName}</Text>
                            </View>
                            <View style={styles.rowStyle}>
                                <Text style={styles.descriptionText}>Order Placed:</Text>
                                <Text style={styles.descriptionText}>{moment(item?.details?.createdTime).format('DD-MMM-YYYY h:mm A').toString()}</Text>
                            </View>
                            <View style={styles.rowStyle}>
                                <Text style={styles.descriptionText}>OrderId:</Text>
                                <Text style={styles.descriptionText}>{item?.details?.id}</Text>
                            </View>
                            <View style={styles.rowStyle}>
                                <Text style={styles.descriptionText}>Status:</Text>
                                <Text style={styles.descriptionText}>{item?.details?.paymentState}</Text>
                            </View>
                            <View style={styles.rowStyle}>
                                <Text style={styles.descriptionText}>Pay Type:</Text>
                                <Text style={styles.descriptionText}>{item?.details?.payType}</Text>
                            </View>
                            <Divider style={{ marginTop: 5, marginBottom: 10 }} />
                            {
                                item?.details?.lineItems?.elements?.map((s, idx) => {
                                    const qty = item?.details?.lineItems?.elements?.filter(x => x.id === s.id);
                                    return (
                                        <View key={s.idx} style={styles.rowStyle}>
                                            <Text style={styles.descriptionText}>{`${s.name}:`}</Text>
                                            <Text style={styles.descriptionText}>{`x ${qty.length}`}</Text>
                                        </View>
                                    );
                                })
                            }
                            <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                            <View style={styles.totalBoxStyle}>
                                <Text style={styles.totalText}>Total:</Text>
                                <Text style={styles.totalText}>{`$${(item?.details?.total / 100).toFixed(2)}`}</Text>
                            </View>
                        </View>
                    </List.Accordion>
                </View>
            </View>
        );
    }, []);
    const ItemSeparator = useCallback(() => {
        return (
            <Divider
                style={styles.divider}
            />
        );
    }, []);
    return (
        <View style={styles.container}>
            {loading && <LoadingCircle />}
            <FlatList
                data={data?.getMyOrders}
                showsVerticalScrollIndicator={false}
                renderItem={_renderItem}
                ItemSeparatorComponent={ItemSeparator}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: colors.white,
    },
    itemContainer: {
        backgroundColor: colors.homeBg,
        borderColor: colors.gray,
        borderWidth: 1,
        // borderRadius: 5,
    },
    divider: {
        marginVertical: 5,
        backgroundColor: 'transparent',
    },
    titleText: {
        fontFamily: Fonts.book,
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    descriptionText: {
        fontFamily: Fonts.book,
        fontSize: 14,
        color: colors.black,
    },
    totalText: {
        fontFamily: Fonts.book,
        fontSize: 16,
        fontWeight: '700',
        color: colors.black,
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 5,
    },
    totalBoxStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
    }
});

export default OrderedHistoryScreen;
