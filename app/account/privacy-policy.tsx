import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POLICY = [
  "We collect personal details such as your name, phone number, email, and verification data to provide secure financial services.",
  "Your data is used for account authentication, fraud prevention, transaction processing, and regulatory compliance.",
  "Brane may share limited data with trusted payment and verification providers only where required to deliver services.",
  "We apply technical and organizational safeguards to protect your data against unauthorized access.",
  "You can request updates to your personal information through support channels where legally permitted.",
  "By continuing to use the app, you consent to this policy and future updates communicated through official channels.",
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle'>Privacy Policy</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {POLICY.map((item, idx) => (
          <View key={`${idx}-${item.slice(0, 16)}`} style={styles.item}>
            <ThemedText style={styles.head}>{`Section ${idx + 1}`}</ThemedText>
            <ThemedText style={[styles.text, { color: C.text }]}>
              {item}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 14,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F7",
    paddingBottom: 12,
  },
  head: { color: "#013D25", fontSize: 13, fontWeight: "700", marginBottom: 5 },
  text: { fontSize: 13, lineHeight: 20 },
});
