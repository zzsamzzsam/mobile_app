/* eslint-disable prettier/prettier */
import { useNavigation } from '@react-navigation/native';
import { Pressable, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons//Ionicons';
import AppText from '../Text';
import colors from '../../../themes/Colors';
import metrics from '../../../themes/Metrics';
export const HeaderBack = ({ }) => {

  const navigation = useNavigation()
  return (
    <View
      style={{
        paddingLeft: metrics.s15,
        // backgroundColor:'red',
      }}
    >
      <Pressable hitSlop={5}>
        <Icon
          name='chevron-back'
          color={colors.primary}
          onPress={() => navigation.goBack()}
          size={32}
        />
      </Pressable>
    </View>
  );
};

export const HeaderOnlyBack = () => {
  return <HeaderBack />
};

