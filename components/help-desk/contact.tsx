import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Call, MessageAdd } from "iconsax-react-native";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import { ThemedText } from "../themed-text";

const PHONE = "+2348141805564";
const EMAIL = "info@getbrane.co";

export default function ContactComponent() {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const cardBg = scheme === "dark" ? "#1A2420" : "#f7faf8";
  const cardBorder = scheme === "dark" ? "#2A4030" : "#e8eeeb";
  const buttonBg = scheme === "dark" ? `${C.primary}20` : "#d6f0e3";

  return (
    <ScrollView style={[styles.container, { backgroundColor: C.background }]}>
      {/* Subtitle */}
      <ThemedText style={[styles.subtitle, { color: C.muted }]}>
        Any question or enquiries? Reach out to us.
      </ThemedText>

      {/* Cards */}
      <View style={styles.list}>
        {/* Phone Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.cardText}>
            <Text style={[styles.cardLabel, { color: C.muted }]}>Phone Number</Text>
            <Text style={[styles.cardValue, { color: C.text }]}>{PHONE}</Text>
          </View>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: buttonBg }]}
            onPress={() => Linking.openURL(`tel:${PHONE}`)}
            activeOpacity={0.75}
          >
            <Call size={16} color={C.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.actionLabel, { color: C.primary }]}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Email Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.cardText}>
            <Text style={[styles.cardLabel, { color: C.muted }]}>Email Address</Text>
            <Text style={[styles.cardValue, { color: C.text }]}>{EMAIL}</Text>
          </View>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: buttonBg }]}
            onPress={() => Linking.openURL(`mailto:${EMAIL}`)}
            activeOpacity={0.75}
          >
            <MessageAdd size={16} color={C.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.actionLabel, { color: C.primary }]}>Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },

  subtitle: {
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  list: { paddingHorizontal: 16, gap: 12, paddingBottom: 24 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  cardText: { flex: 1, paddingRight: 12 },
  cardLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: "600",
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
});