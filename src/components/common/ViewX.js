import React from 'react';
import {View} from 'react-native';

const ViewX = ({
  flexRow = false,
  justifyContent,
  alignItems,
  alignSelf,
  children,
  style,
}) => {
  const styles = {
    ...(flexRow && {flexDirection: 'row'}),
    ...(justifyContent && {justifyContent}),
    ...(alignItems && {alignItems}),
    ...(alignSelf && {alignSelf}),
    ...style,
  };
  return <View style={styles}>{children}</View>;
};

export default ViewX;
