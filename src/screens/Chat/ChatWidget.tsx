import React from 'react';
import {WebView} from 'react-native-webview';
import {View, StyleSheet} from 'react-native';

const ChatWidget = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chat Widget</title>
    </head>
    <body style="background-color: red">
      <script 
  src="https://widgets.leadconnectorhq.com/loader.js"  
  data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js" 
 data-widget-id="66d734d7904b780be4bc8834"  > 
 </script>
      <p>we are chat</p>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{uri: 'https://tpasc.ca/chat-1'}}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default ChatWidget;
