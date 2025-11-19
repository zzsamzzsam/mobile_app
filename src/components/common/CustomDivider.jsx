/* eslint-disable prettier/prettier */
import { Box } from 'native-base';
import React from 'react';
import colors from '../../themes/Colors';

const CustomDivider = () => {
  return (
    <Box style={{ borderWidth: 0.8, borderColor: colors.gray }} />
  );
};

export default CustomDivider;
