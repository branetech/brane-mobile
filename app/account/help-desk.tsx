import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Add, Minus } from "iconsax-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQS = [
  {
    q: "What is Brane?",
    a: "Brane is a fintech platform that helps you convert spending into investment rewards.",
  },
  {
    q: "How do I verify my account?",
    a: "Go to Account Verification and complete identity, bank, and next-of-kin checks.",
  },
  {
    q: "How do I reset my transaction PIN?",
    a: "From Account, open Reset Transaction PIN and follow the secure verification steps.",
  },
  {
    q: "How can I contact support?",
    a: "Use the Support page for live chat or send email to contact@getbrane.co.",
  },
];

export default function HelpDeskScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle'>Help Desk</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={[styles.contactCard, { borderColor: C.border }]}
          activeOpacity={0.85}
          onPress={() => router.push("/support")}
        >
          <ThemedText type='defaultSemiBold'>Open Support Center</ThemedText>
          <ThemedText style={[styles.subText, { color: C.muted }]}>
            Chat with support and browse frequently asked questions.
          </ThemedText>
        </TouchableOpacity>

        {FAQS.map((item, index) => {
          const expanded = open === index;
          return (
            <View key={item.q} style={[styles.faqItem, { borderBottomColor: C.border }]}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setOpen(expanded ? null : index)}
              >
                <ThemedText style={[styles.faqTitle, { color: C.text }]}>
                  {item.q}
                </ThemedText>
                {expanded ? (
                  <Minus size={16} color={C.primary} />
                ) : (
                  <Add size={16} color={C.primary} />
                )}
              </TouchableOpacity>
              {expanded && (
                <ThemedText style={[styles.faqBody, { color: C.muted }]}>
                  {item.a}
                </ThemedText>
              )}
            </View>
          );
        })}
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
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  contactCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  subText: { marginTop: 4, fontSize: 12 },
  faqItem: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  faqTitle: { flex: 1 },
  faqBody: { marginTop: 8, fontSize: 12, lineHeight: 18 },
});
