import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Surface, Text} from 'react-native-paper';

const SurfaceBox = ({loading, children, noPadding, outerStyle = {}, innerStyle = {}}) => {
  return (
    <View style={{padding: 10, borderRadius: 100, ...outerStyle}}>
      <Surface elevation={4} style={{borderRadius: 5, padding: noPadding ? 0 : 10, backgroundColor: '#fff', ...innerStyle}}>
        {children}
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SurfaceBox;
