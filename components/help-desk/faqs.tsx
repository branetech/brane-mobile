import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { Add, Minus } from "iconsax-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";

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
  {
    q: "What's the minimum investment?",
    a: "The minimum investment is 100 Bracs (which is approximately ₦100).",
  },
  {
    q: "Do Bracs expire?",
    a: "No, Bracs never expire and can be used anytime.",
  },
];

const FaqsComponent = () => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <View
            key={index}
            style={[styles.faqItem, { borderBottomColor: C.border }]}
          >
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => setOpenIndex(isOpen ? null : index)}
              activeOpacity={0.7}
            >
              <ThemedText style={[styles.faqTitle, { flex: 1, color: C.text }]}>
                {faq.q}
              </ThemedText>
              {isOpen ? (
                <Minus size={18} color={C.primary} />
              ) : (
                <Add size={18} color={C.primary} />
              )}
            </TouchableOpacity>

            {isOpen && (
              <ThemedText style={[styles.faqBody, { color: C.muted }]}>
                {faq.a}
              </ThemedText>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default FaqsComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 0,
  },
  faqItem: {
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  faqTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  faqBody: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 12,
  },
});
