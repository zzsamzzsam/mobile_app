/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import { View, Pressable, ScrollView, StyleSheet, Text, ImageBackground } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import FoodList from './components/FoodList';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { Badge, Box, Button, Checkbox, Divider } from 'native-base';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Routes from '../../navigation/Routes';
import colors from '../../themes/Colors';
import { useQuery } from '@apollo/client';
import { GET_ALL_INVENTORIES_BY_MID, GET_ALL_ORDER_TYPES_BY_MID } from '../../Apollo/Queries';
import LoadingCircle from '../../components/LoadingCircle';
import { HeaderTextTitle } from '../../components/common/Header/TopLogo';
import metrics from '../../themes/Metrics';
import RestaurantCard from './components/RestaurantCard';
import { globalStyles } from '../../utils/constants';
import AppText from '../../components/common/Text';
import ItemCard from './components/ItemCard';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Fonts from '../../themes/Fonts';
import { cloverPriceFormat } from '../../utils/utils';
import CheckBoxA from '../../components/common/CheckBoxA';
import ViewX from '../../components/common/ViewX';
import ModifierCheckbox from './components/ModifierCheckbox';
import ExpandableItem from '../../components/common/ExpandableList';

const OrderMenuScreen = ({ navigation }) => {
    const {orderCart, currentRestaurant, menus} = useStoreState(st => ({
      orderCart: st.cart.orderCart,
      currentRestaurant: st.cart.currentRestaurant,
      menus: st.cart.menus,
    }));
    const [filteredActs, setFilteredActs] = useState({
      all: true,
      selected: [],
    });
    const [sheetIndex, setSheetIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const {addOrderType, addToCart} = useStoreActions(at => ({
      addOrderType: at.cart.addOrderType,
      addToCart: at.cart.addToCart,
    }));
    const [count, setCount] = useState(1);
    const { data, loading } = useQuery(GET_ALL_INVENTORIES_BY_MID, {
        variables: {
            code: currentRestaurant?.code,
        },
    });
    const { data: orderTypes } = useQuery(GET_ALL_ORDER_TYPES_BY_MID, {
        variables: {
            code: currentRestaurant?.code,
        },
    });
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
    const resMenu = useMemo(() => {
      return menus?.[currentRestaurant.mid] || null;
    }, [menus, currentRestaurant]);
    const [modifiers, setModifiers] = useState({});
    const modifierTotal = useMemo(() => {
      // console.log('modifiers', modifiers);
      const mergedModifiers = Object.values(modifiers || {}).reduce((acc, cur) => {
        return [...acc, ...cur]
      }, []);
      // console.log('mergedModifiers', mergedModifiers);
      return resMenu?.modifiers?.filter(m =>
        mergedModifiers.includes(m.id),
      ).reduce((acc, cur) => {
        
        return acc + (cur?.price || 0);
      }, 0)
      // console.log('modifierObjects', modifierObjects);
    }, [modifiers]);
    useEffect(() => {
        const setOrderType = () => {
          const hasInstore = orderTypes?.getOrderTypes?.elements?.find(
            // s => s.label === 'In-store Pickup',
            s => s.label === 'Curbside Pickup',
          );
            addOrderType(hasInstore || orderTypes?.getOrderTypes?.elements[0]);
        };
        console.log(
          'setting order====',
          orderTypes?.getOrderTypes?.elements[0],
        );
        setOrderType();
    }, [orderTypes?.getOrderTypes?.elements]);
    const dismissModal = () => {
      setSheetIndex(0);
      setCount(1);
      setModifiers([]);
      bottomSheetRef.current?.dismiss();
    }
    useEffect(() => {
        console.log('is open changed', isOpen)
      if (isOpen) {
        setSheetIndex(2);
        setCount(1);
        setModifiers([]);
        const selectedItem = {
          data: resMenu?.items?.find(s => s.id === isOpen),
        };
        if (selectedItem.data.modifierGroupIds) {
            selectedItem.data.groups = {};
            if (resMenu?.modifierGroups) {
              Object.values(resMenu?.modifierGroups).map(mG => {
                if (selectedItem.data.modifierGroupIds.includes(mG.id)) {
                  selectedItem.data.groups[mG.id] = mG;
                  selectedItem.data.groups[mG.id]['modifiers'] =
                    resMenu?.modifiers?.filter(m=> m.groupId == mG.id);
                }
              });
            }
            selectedItem.data.groups = Object.values(selectedItem.data.groups);
        }
        setSelectedItem(selectedItem);
        bottomSheetRef.current?.present();
      } else {
        setSheetIndex(0);
        setCount(1);
        setModifiers([]);
        bottomSheetRef.current?.dismiss();
      }
    }, [isOpen]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => <HeaderTextTitle text={currentRestaurant?.name} />,
            headerTitleAlign: 'center',
            headerRight: () => <Pressable onPress={() => navigation.navigate(Routes.ADDTOCART)} style={{ paddingRight: metrics.s20 }}>
                {
                    orderCart?.lineItems?.length > 0 && <Badge
                        bg={colors.danger}
                        rounded="full"
                        variant="solid"
                        alignSelf="flex-end" _
                        text={{
                            fontSize: 8
                        }}
                        zIndex={1}
                        style={{ position: 'absolute', top: -8, right: metrics.s20 }}
                    >{orderCart?.lineItems?.length}</Badge>
                }

                <AntIcon name='shoppingcart' size={32} />
            </Pressable>,
            // headerRightContainerStyle: { marginRight: 20 },
        })
    }, [navigation, orderCart?.lineItems, currentRestaurant]);
    const handleModifierChange = (key, val) => {
      setModifiers(prev => {
        return {
          ...prev,
          [key]: val
        }
      })
    }
    const handleAddToCart = () => {
      // console.log('adding to cart', modifiers);
      const modifications = [];
      Object.entries(modifiers).map(([mK, mV]) => {
          mV.map(mVV => {
            const matchedModifier = resMenu?.modifiers?.find(s => s.id == mVV);
            modifications.push({
              name: matchedModifier.name,
              amount: matchedModifier.price,
              modifier: {
                available: matchedModifier.available,
                // price:
                modifierGroup: {
                  id: matchedModifier.groupId,
                },
                name: matchedModifier.name,
                price: matchedModifier.price,
                id: matchedModifier.id,
              },
            });
          })
        })
      // addToCart({
      //   id: selectedItem.id,
      //   name: selectedItem.name,
      //   modifications,
      // })
      const cartPayload = {
        id: selectedItem.data.id,
        name: selectedItem.data.name,
        // image: selectedItem.data.images?.[4]?.source || null,
        modifications,
        price: selectedItem.data.price,
        priceWithModifiers: selectedItem.data.price + (modifierTotal || 0)
      };
      for(let i = 0; i < count; i++) {
        addToCart(JSON.parse(JSON.stringify(cartPayload)));
      }
      bottomSheetRef.current?.dismiss();
    }
    const renderCatMenus = useCallback(() => {
      if (!resMenu?.categories || !resMenu?.items) {
        return null;
      }
      const orderedCategories = Object.values(resMenu.categories).sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
      const filteredCategories = orderedCategories.filter(s => {
        return filteredActs?.all || filteredActs?.selected?.includes(s.name)
      })
      return (
        <Box style={{padding: 10}}>
          <ExpandableItem
            title={`Categories`}
            data={orderedCategories.map(s => s.name)}
            containerStyle={{marginHorizontal: 20, paddingVertical: 15}}
            filtersValue={filteredActs}
            setFiltersValue={setFilteredActs}
          />
          {filteredCategories.map(cat => {
            const items = resMenu.items.filter(s =>
              s?.categoryIds?.includes(cat.id),
            );
            if (!items.length) {
              return null;
            }
            return (
              <>
                <AppText
                  text={cat.name}
                  style={[
                    globalStyles.boldText,
                    {
                      color: colors.primary,
                      marginTop: 15,
                      fontSize: 16,
                      paddingLeft: 5,
                    },
                  ]}
                />
                {items.map((s, i) => (
                  <ItemCard
                    item={s}
                    index={i}
                    onPress={() => setIsOpen(s.id)}
                  />
                ))}
              </>
            );
          })}
        </Box>
      );
    }, [resMenu, isOpen, setIsOpen, filteredActs]);
    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          enableTouchThrough={false}
          pressBehavior="close"
          disappearsOnIndex={-1}
          // appearsOnIndex={2}
          // opacity={1}
          // disappearsOnIndex={1}
        />
      ),
      [],
    );
    if (loading) {
      return <LoadingCircle />;
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        style={styles.container}>
        <RestaurantCard
          heroImage={currentRestaurant.hero}
          icon={currentRestaurant.image}
          title={currentRestaurant.name}
          subtitle={currentRestaurant.name}
          item={currentRestaurant}
        />
        {renderCatMenus()}
        <BottomSheetModal
          ref={bottomSheetRef}
          index={sheetIndex}
          onDismiss={() => setIsOpen(false)}
          style={{padding: 0}}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          // onChange={handleSheetChanges}
        >
          {!!selectedItem?.data && (
            <BottomSheetScrollView style={{backgroundColor: colors.white}}>
              <View style={styles.modalContainer}>
                <Text style={styles.itemName}>{selectedItem.data.name}</Text>
                <Text style={styles.itemName}>
                  {cloverPriceFormat(selectedItem.data.price)}
                </Text>
                {/* <Divider style={{marginVertical: 10}} /> */}
                {!!selectedItem?.data?.images?.[4]?.source && (
                  <ImageBackground
                    resizeMode="contain"
                    style={styles.hero}
                    source={{
                      uri: selectedItem.data.images[4].source,
                    }}></ImageBackground>
                )}
                {!!selectedItem.data.description && (
                  <Text style={styles.subtitle}>
                    {selectedItem.data.description}
                  </Text>
                )}
                <Divider style={{marginVertical: 15}} />
                {selectedItem?.data?.groups
                  ?.filter(sG => sG.modifiers?.length)
                  .sort((kk, ff) => ff.name.localeCompare(kk.name))
                  .map(sG => (
                    <ViewX style={{flex: 1, paddingBottom: 15}} key={sG.name}>
                      <Text style={styles.itemName}>{sG.name}</Text>
                      <ModifierCheckbox
                        options={sG.modifiers}
                        multiple={sG.maxAllowed > 1}
                        minRequired={sG.minRequired}
                        maxAllowed={sG.maxAllowed}
                        onChange={val => handleModifierChange(sG.id, val)}
                      />
                    </ViewX>
                  ))}
              </View>
            </BottomSheetScrollView>
          )}
          <View style={styles.addCartWrapper}>
            <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
              <Button
                style={{}}
                onPress={() => {
                  setCount(count - 1);
                }}
                disabled={count < 2}>
                -
              </Button>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.counterText}>{count}</Text>
              </View>
              <Button
                style={{}}
                onPress={() => {
                  setCount(count + 1);
                }}>
                +
              </Button>
            </View>
            <Button style={{flex: 1}} onPress={handleAddToCart}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.addCartText}>
                  {cloverPriceFormat(
                    count *
                      ((selectedItem?.data?.price || 0) + (modifierTotal || 0)),
                  )}
                </Text>
                <Text style={styles.addCartText}>Add to order</Text>
              </View>
            </Button>
          </View>
        </BottomSheetModal>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.homeBg,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 150,
    backgroundColor: colors.white,
  },
  itemName: {
    fontSize: 18,
    fontFamily: Fonts.book,
    color: colors.primary,
    fontWeight: '700',
    paddingBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: colors.primary,
    // fontWeight: '700',
    paddingTop: 15,
  },
  counterText: {
    fontSize: 18,
    fontFamily: Fonts.book,
    color: colors.primary,
    fontWeight: '700',
    paddingHorizontal: 20,
  },
  addCartText: {
    fontSize: 18,
    fontFamily: Fonts.book,
    color: colors.white,
    fontWeight: '700',
    paddingHorizontal: 20,
  },
  hero: {
    width: '100%',
    height: 150,
    backgroundColor: colors.white,
  },
  addCartWrapper: {
    position: 'absolute',
    backgroundColor: 'white',
    bottom: 0,
    paddingBottom: 40,
    paddingTop: 10,
    left: 0,
    right: 0,
    paddingRight: 10,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});

export default OrderMenuScreen;
