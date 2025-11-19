/* eslint-disable prettier/prettier */
import React, { useCallback } from 'react';
import { useStoreActions } from 'easy-peasy';
import { Box, Divider } from 'native-base';
// import AppText from '../../components/common/Text';
import colors from '../../themes/Colors';
import metrics from '../../themes/Metrics';
import { View, FlatList, ImageBackground, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Routes from '../../navigation/Routes';
import { restaurants } from '../../constant';
import RestaurantCard from './components/RestaurantCard';
import RestaurantsList from './RestaurantsList';
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

const FoodScreen = ({ navigation, route }) => {
  // return null;
  return <RestaurantsList/>
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
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
});

export default FoodScreen;