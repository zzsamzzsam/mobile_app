/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useMemo} from 'react';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {Box, Divider} from 'native-base';
// import AppText from '../../components/common/Text';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import {
  View,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Routes from '../../navigation/Routes';
import {restaurants} from '../../constant';
import RestaurantCard from './components/RestaurantCard';
import AppText from '../../components/common/Text';
import { useNavigation } from '@react-navigation/native';
const _restaurants = [
  ...restaurants,
  {
    id: 4,
    skipHandle: true,
    code: 'restaurant_4',
    name: 'Tim Hortons',
    image: require('../../public/Tim_Hortons.png'),
    hero: require('../../../assets/timhorton_item.png'),
  },
];

const RestaurantsList = ({horizontal}) => {
  const {setCurrentRestaurant, clearCart, fetchRestaurants, fetchMenus} =
    useStoreActions(at => ({
      setCurrentRestaurant: at.cart.setCurrentRestaurant,
      fetchRestaurants: at.cart.fetchRestaurants,
      fetchMenus: at.cart.fetchMenus,
      clearCart: at.cart.clearCart,
    }));
  const {restaurantDetails} = useStoreState(at => ({
    restaurantDetails: at.cart.restaurants,
  }));
  const combinedRestaurants = useMemo(() => {
    return _restaurants.map(s => ({
      ...s,
      meta: restaurantDetails?.find(r => r.merchantUuid === s.mid),
    }));
  }, [restaurantDetails]);

  const navigation = useNavigation();
  const handleButtonPress = _restaurant => {
    if (_restaurant.code === 'restaurant_4') {
      Linking.openURL('https://apps.apple.com/us/app/tim-hortons/id1143883086');
    } else {
      setCurrentRestaurant(_restaurant);
      clearCart();
      navigation.navigate(Routes.ORDERMENU);
    }
  };
  useEffect(() => {
    fetchRestaurants();
    fetchMenus();
  }, [])
  const _renderItem = useCallback(({item}) => {
    return (
      <RestaurantCard
        heroImage={item.hero}
        icon={item.image}
        title={item.name}
        item={item}
        horizontal={horizontal}
        onPress={() => handleButtonPress(item)}
      />
    );
  }, []);
  const ItemSeparator = useCallback(() => {
    return <Divider style={styles.divider} />;
  }, []);
  return (
    <View style={styles.container}>
      {/* <AppText
        style={styles.text}
      >Pick Restaurant</AppText> */}
      <View>
        <FlatList
          data={combinedRestaurants}
          horizontal={!!horizontal}
          keyExtractor={(item, idx) => `${item.name + idx}`}
          renderItem={_renderItem}
          contentContainerStyle={horizontal ? {height: 250} : {}}
          ItemSeparatorComponent={horizontal ? null : ItemSeparator}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
  },
  text: {
    color: colors.primary,
    fontWeight: 700,
    fontSize: 18,
    textAlign: 'center',
    paddingTop: metrics.s10,
  },
  btn: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 10,
  },
  divider: {
    marginVertical: 2,
    backgroundColor: 'transparent',
  },
});
export default RestaurantsList;
