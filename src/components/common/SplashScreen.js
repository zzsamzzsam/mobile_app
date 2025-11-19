/* eslint-disable prettier/prettier */
import AnimatedLottieView from 'lottie-react-native';
import { Box, Modal } from 'native-base';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import AnimatedLogo from '../../../Animated_logo.json';
import AppText from './Text';
import colors from '../../themes/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SplashScreen = ({ onAnimationFinish }) => {
  // return <AppText>ramrarmarm</AppText>
  return (
    <Box flex={1} justifyContent="center" alignItems="center" bg={colors.white}>
      <AnimatedLottieView
        source={AnimatedLogo}
        loop={false}
        // speed={0.6}
        style={{ width: SCREEN_WIDTH - 40 }}
        autoPlay
        onAnimationFinish={onAnimationFinish}
      />
    </Box>
  );
};

export default SplashScreen;
