import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import colors from '../themes/Colors';

const LoadingCircle = ({small, color = colors.secondary}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={small ? 'small' : 'large'} color={color} />
    </View>
  );
};

export default LoadingCircle;
