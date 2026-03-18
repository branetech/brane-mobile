import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Add, SearchNormal1 } from "iconsax-react-native";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const FAQS = [
  "How can I get stock rewards?",
  "How do I invest my funds?",
  "How can I withdraw my money?",
  "How long does it take to process transactions?",
  "What are the requirements to open an account?",
];

export default function SupportScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [search, setSearch] = useState("");

  const filteredFaq = useMemo(() => {
    if (!search) return FAQS;
    return FAQS.filter((faq) =>
      faq.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      {/* 🔥 HEADER */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <View style={styles.headerTop}>
          <ThemedText style={styles.brand}>
            brane <ThemedText style={[styles.support, { color: `${C.primary}50` }]}>Support</ThemedText>
          </ThemedText>

          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText style={styles.close}>×</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.title}>
          How Can We Help?
        </ThemedText>

        {/* 🔍 SEARCH */}
        <View style={[styles.searchBox, { backgroundColor: C.inputBg }]}>
          <SearchNormal1 size={16} color={C.muted} />
          <TextInput
            placeholder="Search anything"
            placeholderTextColor={C.muted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: C.text }]}
          />
        </View>
      </View>

      {/* 🔥 BODY */}
      <View style={[styles.body, { backgroundColor: C.background }]}>
        <ThemedText style={[styles.faqTitle, { color: C.text }]}>FAQs</ThemedText>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* FAQ LIST */}
          {filteredFaq.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.faqItem, { backgroundColor: C.inputBg, borderColor: C.border, borderWidth: 1 }]}>
              <ThemedText style={[styles.faqText, { color: C.text }]}>{item}</ThemedText>
              <Add size={16} color={C.primary} />
            </TouchableOpacity>
          ))}

          {/* 📄 DOCUMENTED SUPPORT */}
          <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
            Documented Support
          </ThemedText>

          {[1, 2, 3].map((_, i) => (
            <TouchableOpacity key={i} style={[styles.docCard, { backgroundColor: C.inputBg, borderColor: C.border, borderWidth: 1 }]}>
              <ThemedText style={[styles.docTitle, { color: C.text }]}>
                How to Put My Bracs To Work
              </ThemedText>
              <ThemedText style={[styles.docSub, { color: C.muted }]}>
                Learn how to make good use of your funds for investment
              </ThemedText>
            </TouchableOpacity>
          ))}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* 💬 CTA BUTTON */}
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: `${C.primary}15`, borderColor: C.primary, borderWidth: 1 }]}
          onPress={() => router.push("/live-chat")}
        >
          <ThemedText style={[styles.ctaText, { color: C.primary }]}>
            Start Conversation
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    fontStyle: "italic",
  },

  support: {
    fontSize: 12,
  },

  close: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 28,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },

  searchBox: {
    marginTop: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  body: {
    flex: 1,
    padding: 16,
    marginTop: -10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  faqTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  faqItem: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  faqText: {
    fontSize: 14,
    flex: 1,
  },

  docCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  docTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  docSub: {
    fontSize: 12,
    marginTop: 4,
  },

  cta: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  ctaText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});