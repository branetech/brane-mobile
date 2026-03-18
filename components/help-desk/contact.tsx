import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { Call, MessageAdd } from "iconsax-react-native";
import React from "react";
import { Linking, StyleSheet } from "react-native";
import { ThemedText } from "../themed-text";
import { BraneButton } from "../brane-button";

const ContactComponent = () => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const phoneNumber = "+2348141805564";
  const email = "info@getbrane.co";

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ThemedText style={[styles.description, { color: C.muted }]}>
        Any question or enquiries? Reach out to us.
      </ThemedText>

      {/* Phone Section */}
      <View style={[styles.contactBox, { borderBottomColor: C.border }]}>
        <View style={styles.contactInfo}>
          <ThemedText style={[styles.label, { color: C.muted }]}>
            Phone Number
          </ThemedText>
          <ThemedText style={[styles.value, { color: C.text }]}>
            +234 814 180 5564
          </ThemedText>
        </View>
        <BraneButton
          text='Call'
          onPress={handleCall}
          backgroundColor={C.primary}
          textColor={C.background}
          height={40}
          radius={10}
          width={100}
        />
      </View>

      {/* Email Section */}
      <View style={styles.contactBox}>
        <View style={styles.contactInfo}>
          <ThemedText style={[styles.label, { color: C.muted }]}>
            Email Address
          </ThemedText>
          <ThemedText style={[styles.value, { color: C.text }]}>
            {email}
          </ThemedText>
        </View>
        <BraneButton
          text='Email'
          onPress={handleEmail}
          backgroundColor={C.primary}
          textColor={C.background}
          height={40}
          radius={10}
          width={100}
        />
      </View>

      {/* Support Chat CTA */}
      <View
        style={[
          styles.liveChat,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <MessageAdd size={20} color={C.primary} />
        <View style={{ flex: 1 }}>
          <ThemedText type='defaultSemiBold'>Live Chat Support</ThemedText>
          <ThemedText style={[styles.chatDesc, { color: C.muted }]}>
            Available during business hours
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default ContactComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
  },
  contactBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  contactInfo: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
  liveChat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  chatDesc: {
    fontSize: 11,
    marginTop: 2,
  },
});
