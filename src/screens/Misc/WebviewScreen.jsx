/* eslint-disable prettier/prettier */
import {
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {
  useState,
} from 'react';
import {WebView} from 'react-native-webview';
import colors from '../../themes/Colors';
import ViewX from '../../components/common/ViewX';

const WebviewScreen = ({navigation, route}) => {
  const {title = '', origin} = route.params || {};
  const [loading, setLoading] = useState(true);


  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: true,
  //     headerLeft: () => <HeaderBack />,
  //     headerTitle: title || null,
  //     // headerRight: () => resourcesList.map(x => x.name).includes(title) && <View style={{ marginRight: 15 }}><FavouriteButton favourite={isFavourite} onPress={onFavBtnPress} /></View>,
  //     headerTitleAlign: 'center',
  //   });
  // }, [navigation, title]);

  const removeHeaderScript = ``;
  
  return (
    <ViewX style={styles.container}>
      {!!origin && (
        <WebView
          cacheEnabled={false}
          source={{uri: origin}}
          // onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          allowsProtectedMedia
          originWhitelist={['*']}
          // injectedJavaScript={removeHeaderScript}
          javaScriptEnabled={true}
          style={{flex: 1}}
          onLoad={() => {
            setLoading(false);
          }}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
      {loading && (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={colors.primary}
        />
      )}
    </ViewX>
  );
};

export default WebviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    position: 'absolute',
    marginHorizontal: 'auto',
    marginVertical: 'auto',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
