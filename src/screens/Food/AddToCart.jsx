/* eslint-disable prettier/prettier */
import { Dimensions, FlatList, Pressable, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Button, Divider, Image, Text, View } from 'native-base';
import metrics from '../../themes/Metrics';
import colors from '../../themes/Colors';
import Fonts from '../../themes/Fonts';
import Routes from '../../navigation/Routes';
import EmptyBox from '../../components/common/EmptyBox';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { HeaderTextTitle } from '../../components/common/Header/TopLogo';
import _ from 'lodash';
const dummyImage = 'https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg';

const { width } = Dimensions.get('window');

const AddToCart = ({ navigation }) => {

  const [open, setOpen] = useState(false);

  const { orderCart } = useStoreState(st => ({
    orderCart: st.cart.orderCart,
  }));
  const { addToCart, removeFromCart } = useStoreActions(at => ({
    addToCart: at.cart.addToCart,
    removeFromCart: at.cart.removeFromCart,
  }));
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTextTitle text='Checkout' />,
      headerTitleAlign: 'center',
      headerRight: null,
      headerRightContainerStyle: { marginRight: 20 },
    })
  }, [navigation]);


  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 200);
  }, []);

  const groupedItems = useMemo(() => {
    console.log('order cart ====', JSON.stringify(orderCart))
    return orderCart?.lineItems.reduce((result, singleItem) => {
      const existingItem = result.find(x => {
        if(!x[0].id === singleItem?.id) {
          return false;
        }
        const mod1 = _.sortBy(x[0]?.modifications || []);
        const mod2 = _.sortBy(singleItem?.modifications || []);
        const areSame = _.isEqual(mod1, mod2);
        return areSame;
        });
      if (existingItem) {
        existingItem.push(singleItem);
      } else {
        result.push([singleItem])
      }
      return result;
    }, []);
  }, [orderCart?.lineItems]);

  const totalCost = useMemo(() => {
    return groupedItems.reduce((acc, it) => {
      return acc + it[0]?.priceWithModifiers * it?.length;
    }, 0);
  }, [groupedItems]);

  const renderItem = useCallback(({ item, index }) => {

    const AddItem = (_item) => {
      addToCart(_item);
    };
    const RemoveItem = (_item) => {
      removeFromCart(_item);
    };
    console.log('item ===', item);
    return (
      <Pressable>
        <View style={[styles.item, {marginTop: index === 0 ? 10 : 0}]}>
          {/* <Image source={{uri: item[0].image || null}} style={styles.image} alt="img" /> */}
          <View style={styles.detailsContainer}>
            <Text style={styles.foodName}>{item[0]?.name}</Text>
            {item[0]?.modifications && (
              <Text style={styles.subtitle}>
                {item[0].modifications.map(s => s.name).join(',')}
              </Text>
            )}
            <View style={styles.priceView}>
              <View style={styles.actionsView}>
                <Pressable
                  style={styles.actionbtnStyle}
                  onPress={() => RemoveItem(item[0])}>
                  <FontAwesomeIcon
                    name="minus"
                    size={16}
                    color={colors.black}
                  />
                </Pressable>
                <Text style={styles.countText}>{item.length}</Text>
                <Pressable
                  style={styles.actionbtnStyle}
                  onPress={() => AddItem(item[0])}>
                  <FontAwesomeIcon name="plus" size={16} color={colors.black} />
                </Pressable>
              </View>
              <Text style={styles.price}>{`$${(
                (item[0]?.priceWithModifiers * item.length) /
                100
              ).toFixed(2)}`}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }, []);

  const handleCheckout = async () => {
    navigation.navigate(Routes.CHECKOUT);
  };


  const ItemSeparator = useCallback(() => {
    return (
      <Divider
        style={styles.divider}
      />
    );
  }, []);

  return (
    <View style={styles.container}>
      {
        orderCart?.lineItems?.length > 0 ? (
          <FlatList
            data={groupedItems}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
            keyExtractor={(item, idx) => idx}
            ItemSeparatorComponent={ItemSeparator}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyBox
            bg={colors.white}
            description="Item doesnt exits in the cart"
            style={styles.emptyBoxStyle}
          />
        )
      }
      {
        (orderCart?.lineItems?.length > 0 && open) &&
        <View style={styles.btnView}>
          <Text style={styles.totalTextStyle}>{`Total Cost: $${(totalCost / 100).toFixed(2)}`}</Text>
          <Button _text={styles.appFont} onPress={handleCheckout} >Continue to Checkout</Button>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeBg,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: metrics.s10,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
  },
  image: {
    width: width * 0.25,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  foodName: {
    fontSize: 18,
    fontFamily: Fonts.book,
    color: colors.primary,
    fontWeight: '700',
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
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.primary,
    // fontWeight: '700',
    paddingVertical: 5,
  },
  appFont: {
    fontFamily: Fonts.book,
  },
  countText: {
    fontFamily: Fonts.book,
    fontSize: 16,
    marginHorizontal: 10,
  },
  totalTextStyle: {
    marginBottom: 5,
    fontSize: 16,
    fontFamily: Fonts.book,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  btnView: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
  },
  emptyBoxStyle: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  actionsView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionbtnStyle: {
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    // minWidth: 40,
  },
  divider: {
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
});


export default AddToCart;