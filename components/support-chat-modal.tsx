import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useAppState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setShowSupportChat } from "@/redux/slice/auth-slice";
import { TouchableOpacity } from "@idimma/rn-widget";
import { ThemedText } from "./themed-text";

export default function SupportChat() {
  const { showSupportChat, user } = useAppState();
  const dispatch = useDispatch();

  if (!showSupportChat) return null;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <script>
          window.$zoho = window.$zoho || {};
          window.$zoho.salesiq = {
            widgetcode: "YOUR_ZOHO_CODE",
            values: {},
            ready: function() {
              ${
                user?.name
                  ? `window.$zoho.salesiq.visitor.name("${user.name}");`
                  : ""
              }
              ${
                user?.email
                  ? `window.$zoho.salesiq.visitor.email("${user.email}");`
                  : ""
              }
            }
          };
        </script>
        <script src="https://salesiq.zohopublic.com/widget?" defer></script>
      </head>
      <body></body>
    </html>
  `;

  return (
    <View style={styles.overlay}>
      {/* Close Button */}
      <TouchableOpacity
        onPress={() => dispatch(setShowSupportChat(false))}
        style={styles.closeBtn}
      >
        <ThemedText>Close</ThemedText>
      </TouchableOpacity>

      <WebView originWhitelist={["*"]} source={{ html }} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000099",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
  },
});