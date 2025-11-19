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
import { HeaderBack } from '../../components/common/Header/HeaderBack';

const WebviewComponent = ({title, origin, onClose}) => {
  const [loading, setLoading] = useState(true);

  
  return (
    <ViewX style={styles.container}>
      {/* <HeaderBack /> */}
      {!!origin && (
        <WebView
          cacheEnabled={false}
          source={{uri: origin}}
          // onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          allowsProtectedMedia
          originWhitelist={['*']}
          mixedContentMode="always"
          // injectedJavaScript={removeHeaderScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
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

export default WebviewComponent;

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
