import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';

const PadWrapper = ({styles = {}, children}) => {
  return <View style={{padding: 10, ...styles}}>{children}</View>;
};

export default PadWrapper;