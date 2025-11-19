/* eslint-disable prettier/prettier */
import { View, Text, Pressable, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Button, Image } from 'native-base';
import colors from '../../../themes/Colors';
import metrics from '../../../themes/Metrics';
import Fonts from '../../../themes/Fonts';

const { width } = Dimensions.get('window');

const ItemCard = ({ item, index, onPress }) => {
    const { orderCart } = useStoreState(st => ({
        orderCart: st.cart.orderCart,
    }));
    const { addToCart } = useStoreActions(at => ({
        addToCart: at.cart.addToCart,
    }));
    const AddItemToCart = (_item) => {
        addToCart(_item);
    };
    const isDisabled = orderCart?.lineItems.find(s => s.id === item?.id);
    return (
      <TouchableOpacity style={[styles.container]} onPress={onPress}>
        <View style={styles.item}>
          <View style={styles.detailsContainer}>
            <Text style={styles.foodName}>{item.name}</Text>
            <View style={styles.rowContainer}>
              {/* <Button
                isDisabled={!!isDisabled}
                onPress={() => AddItemToCart(item)}>
                Add to Cart
              </Button> */}
              <Text style={styles.price}>
                {item?.available
                  ? `$${(item?.price / 100).toFixed(2)}`
                  : 'Unavailable'}
              </Text>
            </View>
          </View>
          <Image
            source={{uri: item?.images?.[0]?.source || null}}
            resizeMode="contain"
            style={styles.image}
            alt="img"
          />
        </View>
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        marginTop: 10
    },
    item: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: metrics.s10,
        borderBottomColor: colors.gray,
    },
    image: {
        width: width * 0.25,
        height: 100,
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    foodName: {
        fontSize: 18,
        fontFamily: Fonts.book,
        color: colors.primary,
        fontWeight: '700',
        paddingBottom: 10
    },
    foodDetails: {
        fontSize: 14,
        fontFamily: Fonts.book,
        color: colors.black,
    },
    price: {
        fontSize: 14,
        fontFamily: Fonts.book,
        color: colors.primary,
        fontWeight: '600',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
});


export default ItemCard;