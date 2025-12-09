import React, { forwardRef } from 'react';
import { ScrollView } from 'react-native';

const RNScrollWrapper = forwardRef((props, ref) => {
  return <ScrollView ref={ref} {...props} />;
});

export default RNScrollWrapper;