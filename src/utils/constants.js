import { StyleSheet } from "react-native";
import Fonts from '../themes/Fonts';

export const pages = {
  WELCOME: 'WELCOME',
  SCAN: 'SCAN',
  HOME: 'HOME',
  HEART: 'HEART',
};

export const connectionType = {
  CONNECTED: 'Connected',
  CONNECTIONFAILED: 'ConnectionFailed',
  DISCONNECTED: 'Disconnected',
};

export const globalStyles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  boldText: {
    fontWeight: '700',
    fontFamily: Fonts.bold,
  }
});

// export const Fonts = {
//   book: Platform.OS === 'ios' ? 'Gotham-Book' : 'GothamBook',
//   light: Platform.OS === 'ios' ? 'Gotham-Light' : 'GothamLight',
//   medium: Platform.OS === 'ios' ? 'Gotham-Medium' : 'GothamMedium',
//   bold: Platform.OS === 'ios' ? 'Gotham-Bold' : 'GothamBold',
// };

export const DEVICE_ASYNC_KEY = 'FIT_LAST_KEY';

export const MEASURE_DATA_KEY = 'MEASURE_DATA_KEY';

export const DATA_MAPPING = {
  ios: {
    H_BLOOD: 'dbp',
    L_BLOOD: 'sbp',
    HEARTRATE: 'heartRate',
    SPO: 'spo',
  },
  android: {
    H_BLOOD: 'lblood',
    L_BLOOD: 'hblood',
    HEARTRATE: 'heart',
    SPO: 'spo',
  },
};


export const HEALTH_SOURCES = {
  PLATFORM : "PLATFORM",
  WATCH : "WATCH"
}

export const defaultParking = {
  0: [
    // sunday
    {
      s: 0,
      e: 6,
      north: 10,
      east: 0,
      text: 'Usually not busy',
      color: "one", //
    },
    {
      s: 6,
      e: 8,
      north: 50,
      east: 30,
      text: 'Usually not too busy',
      color: "two"
    },
    {
      s: 8,
      e: 19,
      north: 95,
      east: 95,
      text: 'Usually as busy as it gets',
      color: "three",
    },
    {
      s: 19,
      e: 23,
      north: 50,
      east: 30,
      text: 'Usually a little busy',
    },
  ],
  1: [
    // monday
    {
      s: 0,
      e: 6,
      north: 10,
      east: 0,
      text: 'Usually not busy',
      color: "one",
    },
    {
      s: 6,
      e: 16,
      north: 50,
      east: 30,
      text: 'Usually not too busy',
      color: "two",
    },
    {
      s: 16,
      e: 23,
      north: 75,
      east: 50,
      text: 'Usually a little busy',
    },
  ],
  2: [
    // tuesday
    {
      s: 0,
      e: 6,
      north: 10,
      east: 0,
      text: 'Usually not busy',
      color: "one",
    },
    {
      s: 6,
      e: 16,
      north: 50,
      east: 30,
      text: 'Usually not too busy',
      color: "two",
    },
    {
      s: 16,
      e: 23,
      north: 75,
      east: 50,
      text: 'Usually a little busy',
    },
  ],
  3: [
    // wednesday
    {
      s: 0,
      e: 6,
      north: 10,
      east: 0,
      text: 'Usually not busy',
      color: "one",
    },
    {
      s: 6,
      e: 16,
      north: 50,
      east: 30,
      text: 'Usually not too busy',
      color: "two",
    },
    {
      s: 16,
      e: 23,
      north: 75,
      east: 50,
      text: 'Usually a little busy',
    },
  ],
  4: [
    // thursday
    {
      s: 0,
      e: 6,
      north: 10,
      east: 0,
      text: 'Usually not busy',
      color: "one",
    },
    {
      s: 6,
      e: 16,
      north: 50,
      east: 30,
      text: 'Usually not too busy',
      color: "two",
    },
    {
      s: 16,
      e: 23,
      north: 75,
      east: 50,
      text: 'Usually a little busy',
    },
  ],
  5: [
    // friday
    {
      s: 0,
      e: 6,
      north: 10,
      east: 0,
      text: 'Usually not busy',
      color: "one",
    },
    {
      s: 6,
      e: 16,
      north: 50,
      east: 30,
      text: 'Usually not too busy',
      color: "two",
    },
    {
      s: 16,
      e: 23,
      north: 75,
      east: 50,
      text: 'Usually a little busy',
    },
  ],
  6: [
    // saturday
    {
      s: 0,
      e: 6,
      north: 10,
      east: 0,
      text: 'Usually not busy',
      color: "one",
    },
    {
      s: 6,
      e: 8,
      north: 50,
      east: 30,
      text: 'Usually not too busy',
      color: "two",
    },
    {
      s: 8,
      e: 19,
      north: 95,
      east: 95,
      text: 'Usually as busy as it gets',
    },
    {
      s: 19,
      e: 23,
      north: 50,
      east: 30,
      text: 'Usually a little busy',
    },
  ],
}

export const parkingForEvent = [
  {
      s: 0,
      e: 6,
      north: 10,
      east: 10,
      text: 'Usually not too busy',
    },
    {
      s: 6,
      e: 21,
      north: 95,
      east: 95,
      text: 'Parking Lots Busy due to Event',
    },
    {
      s: 21,
      e: 23,
      north: 10,
      east: 10,
      text: 'Usually not too busy',
    },
];

export const parkingForLotJ = [
  {
    s: 0,
    e: 23,
    north: 95,
    east: 95,
    text: 'Parking Lots Busy due to Event',
  }
];