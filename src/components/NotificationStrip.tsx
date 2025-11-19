import {Box} from 'native-base';
import React from 'react';

type notificationStripProps = {
  color: string;
};

const NotificationStrip = ({color}: notificationStripProps) => {
  return (
    <Box
      style={{
        width: 5,
        backgroundColor: color,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
      }}
    />
  );
};

export default NotificationStrip;
