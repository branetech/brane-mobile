import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function ZohoChat() {
  const zohoHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <script type="text/javascript">
          window.$zoho = window.$zoho || {};
          window.$zoho.salesiq = window.$zoho.salesiq || {
            widgetcode: "${process.env.EXPO_PUBLIC_ZOHO_SALESIQ_CODE}",
            values: {},
            ready: function () {
              console.log("Zoho ready");
            }
          };
        </script>
        <script 
          type="text/javascript" 
          src="https://salesiq.zohopublic.com/widget?"
          defer>
        </script>
      </head>
      <body></body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: zohoHTML }}
        javaScriptEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});