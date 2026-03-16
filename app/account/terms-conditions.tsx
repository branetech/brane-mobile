import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TERMS = [
  "By creating a Brane account, you agree to provide accurate and up-to-date information for identity checks and account security.",
  "Transactions executed on your account are considered authorized when validated with your account credentials, OTP, or transaction PIN.",
  "Brane may temporarily restrict account features when suspicious activity is detected, pending additional verification.",
  "Investment-related rewards and outcomes are subject to market conditions and partner provider terms.",
  "You are responsible for protecting your login credentials and promptly reporting unauthorized access.",
  "Brane reserves the right to update product terms in line with regulations and service-provider policy changes.",
];

export default function TermsConditionsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle'>Terms & Conditions</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {TERMS.map((item, idx) => (
          <View key={`${idx}-${item.slice(0, 16)}`} style={styles.item} row>
            <ThemedText
              style={[styles.dot, { color: C.primary }]}
            >{`${idx + 1}.`}</ThemedText>
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
    gap: 12,
  },
  item: { gap: 8, alignItems: "flex-start" },
  dot: { width: 22, fontWeight: "700" },
  text: { flex: 1, fontSize: 13, lineHeight: 20 },
});
