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

type FAQ = { q: string; a: string };

const FAQS: FAQ[] = [
  {
    q: "What is Brane?",
    a: "Brane is a fintech platform that helps you turn everyday spending into wealth. Every time you buy airtime, pay electricity bills, fund gaming accounts, you earn Bracs Points which are converted into investments such as stocks, gold, ETFs, and fixed-income assets.",
  },
  {
    q: "Who can use Brane?",
    a: "Anyone 18+ with a valid BVN and a Nigerian mobile number.",
  },
  {
    q: "Is Brane licensed?",
    a: "Brane operates under Nigerian fintech regulations and partners with licensed brokers (e.g., Sankore Investment) to deliver investment products. Wallets are NDIC-protected.",
  },
  {
    q: "How do I fund my wallet?",
    a: "Go to Add Funds on your Home screen. You can fund via bank transfer or debit card.",
  },
  {
    q: "What are BRACS Points?",
    a: "BRACS Points are rewards earned on every transaction. They are automatically converted into real investments on your behalf.",
  },
  {
    q: "How do I withdraw my money?",
    a: "Go to Wallet → Withdraw. Funds are sent to your linked bank account within 1-3 business days.",
  },
  {
    q: "Is my money safe?",
    a: "Yes. Wallet funds are NDIC-insured up to ₦5 million. Investments are held in your name via licensed custodians.",
  },
  {
    q: "How do I buy stocks?",
    a: "Go to the Portfolio tab, then tap Marketplace. Browse available stocks and tap Buy.",
  },
  {
    q: "What is BRACS?",
    a: "BRACS is Brane's proprietary reward-to-asset conversion system. Your daily spending earns BRACS which are invested in a diversified portfolio.",
  },
  {
    q: "Can I sell my stocks?",
    a: "Yes. Go to Portfolio → My Stocks, select a stock, and tap Sell.",
  },
  {
    q: "How do I add a bank account?",
    a: "Go to Account → Bank Accounts or during KYC. You will need your bank name and account number.",
  },
  {
    q: "What fees does Brane charge?",
    a: "Brane charges 0% commission on stock trades. Transaction fees apply to bill payments and vary by service.",
  },
  {
    q: "How do I contact support?",
    a: "Go to Account → Help Desk → Contact Us, or chat with us via the in-app support button.",
  },
];

export default function FAQsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.headerTitle}>
          FAQs
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {FAQS.map((faq, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <View
              key={index}
              style={{
                ...styles.item,
                borderColor: C.border,
                backgroundColor: C.background,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.questionRow}
                onPress={() => toggle(index)}
              >
                <ThemedText style={styles.question}>{faq.q}</ThemedText>
                {isExpanded ? (
                  <Minus size={20} color='#013D25' />
                ) : (
                  <Add size={20} color='#85808A' />
                )}
              </TouchableOpacity>

              {isExpanded && (
                <ThemedText style={[styles.answer, { color: "#85808A" }]}>
                  {faq.a}
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
  screen: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 10,
  },
  item: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  question: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  answer: {
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
});
