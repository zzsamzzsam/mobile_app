module.exports = {
  project: {
    ios: {},
    android: {
      packageName: 'com.tpasc'
    },
  },
  assets: ['./assets/fonts'],

  // TODO: added line
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
};
