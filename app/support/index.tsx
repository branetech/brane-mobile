import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Add, Minus, SearchNormal1, Send } from "iconsax-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GREEN_DARK = "#1a4a32";
const GREEN_LIGHT = "#c8e8d8";

type Scheme = "light" | "dark";
type ChatMessage = { id: string; text: string; sender: "support" | "user" };

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
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

const FAQ_ITEMS = FAQS.map((faq) => faq.q);

const DOC_SUBTEXT = "Learn how to make good use of your bracs for investment";
const DOC_BODY =
  "Lorem ipsum dolor sit amet consectetur. Et vitae eget volutpat libero integer vel tristique nisi. Gravida potenti aliquet ut morbi tristique arcu egestas. Tempor cursus duis quis placerat metus congue phasellus sapien. Ultricies proin ut mattis morbi suspendisse nunc sollicitudin accumsan tortor.";

// ─── FAQ Row ─────────────────────────────────────────────────
const FAQRow = ({
  text,
  answer,
  expanded,
  onPress,
  scheme,
}: {
  text: string;
  answer: string;
  expanded: boolean;
  onPress: () => void;
  scheme: Scheme;
}) => {
  const C = Colors[scheme];
  return (
    <View style={[styles.faqRow, { backgroundColor: C.inputBg }]}>
      <TouchableOpacity
        style={styles.faqHeaderBtn}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <ThemedText style={[styles.faqText, { color: C.text }]}>
          {text}
        </ThemedText>
        {expanded ? (
          <Minus size={16} color={C.primary} />
        ) : (
          <Add size={16} color={C.primary} />
        )}
      </TouchableOpacity>

      {expanded && (
        <ThemedText style={[styles.faqAnswer, { color: C.muted }]}>
          {answer}
        </ThemedText>
      )}
    </View>
  );
};

// ─── Document Modal ──────────────────────────────────────────
const DocumentedSupportModal = ({
  visible,
  onClose,
  scheme,
}: {
  visible: boolean;
  onClose: () => void;
  scheme: Scheme;
}) => {
  const C = Colors[scheme];
  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      onRequestClose={onClose}
    >
      <SafeAreaView style={[s.flex, { backgroundColor: C.background }]}>
        <View style={styles.modalHeaderRow}>
          <Back onPress={onClose} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.docScrollContent}
        >
          <ThemedText
            type='subtitle'
            style={[styles.docModalTitle, { color: C.text }]}
          >
            How to Put My Bracs To Work
          </ThemedText>
          <ThemedText style={[styles.docBodyText, { color: C.text }]}>
            {DOC_BODY}
          </ThemedText>
          <ThemedText
            type='subtitle'
            style={[styles.docSubHeader, { color: C.text }]}
          >
            Another Subheader
          </ThemedText>
          <ThemedText style={[styles.docBodyText, { color: C.text }]}>
            {DOC_BODY}
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// ─── Live Chat Modal ─────────────────────────────────────────
const LiveChatModal = ({
  visible,
  onClose,
  scheme,
}: {
  visible: boolean;
  onClose: () => void;
  scheme: Scheme;
}) => {
  const C = Colors[scheme];
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Thank you for contacting brane customer service",
      sender: "support",
    },
    {
      id: "2",
      text: "Nike wants to partner with you for a $5000 campaign deal. Review and ...",
      sender: "user",
    },
  ]);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), text, sender: "user" },
    ]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      onRequestClose={onClose}
    >
      <SafeAreaView style={[s.flex, { backgroundColor: C.background }]}>
        {/* Header */}
        <View style={[lc.header, { borderBottomColor: C.border }]}>
          <Back onPress={onClose} />
          <ThemedText style={[lc.headerTitle, { color: C.text }]}>
            Live Chat
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <KeyboardAvoidingView
          style={s.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={72}
        >
          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            style={s.flex}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={lc.chatScroll}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  lc.msgRow,
                  msg.sender === "user" ? lc.msgRowUser : lc.msgRowSupport,
                ]}
              >
                {/* Avatar for support */}
                {msg.sender === "support" && (
                  <View style={[lc.avatar, { backgroundColor: C.border }]} />
                )}

                {/* Bubble */}
                <View
                  style={[
                    lc.bubble,
                    msg.sender === "support"
                      ? [
                          lc.supportBubble,
                          {
                            backgroundColor:
                              scheme === "dark" ? C.inputBg : "#d6f0e3",
                          },
                        ]
                      : [lc.userBubble, { backgroundColor: GREEN_DARK }],
                  ]}
                >
                  <ThemedText
                    style={[
                      lc.bubbleText,
                      { color: msg.sender === "support" ? C.text : "#fff" },
                    ]}
                  >
                    {msg.text}
                  </ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input bar */}
          <View style={[lc.inputBar, { backgroundColor: C.background }]}>
            {/* Attach button */}
            <TouchableOpacity
              style={[
                lc.attachBtn,
                { backgroundColor: C.inputBg, borderColor: C.border },
              ]}
            >
              <Send
                size={18}
                color={GREEN_DARK}
                style={{ transform: [{ rotate: "45deg" }] }}
              />
            </TouchableOpacity>

            {/* Text input */}
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder='I have always wanted to be a wing man'
              placeholderTextColor={C.muted}
              style={[
                lc.input,
                {
                  borderColor: C.border,
                  color: C.text,
                  backgroundColor: C.background,
                },
              ]}
              multiline
            />

            {/* Send button */}
            <TouchableOpacity
              onPress={sendMessage}
              style={[lc.sendBtn, { backgroundColor: GREEN_DARK }]}
            >
              <Send size={16} color='#fff' />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

// ─── Main Screen ─────────────────────────────────────────────
export default function SupportScreen() {
  const router = useRouter();
  const scheme: Scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showDocumented, setShowDocumented] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [search, setSearch] = useState("");

  const filteredFaq = useMemo(
    () =>
      search.trim()
        ? FAQS.filter(
            (faq) =>
              faq.q.toLowerCase().includes(search.toLowerCase()) ||
              faq.a.toLowerCase().includes(search.toLowerCase()),
          )
        : FAQS,
    [search],
  );

  return (
    <View style={[s.root, { backgroundColor: C.background }]}>
      <StatusBar barStyle='light-content' />

      {/* ── Dark green header ── */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <View style={styles.brandRow}>
          <View style={styles.brandWrap}>
            <Image
              source={require("@/assets/images/icn.png")}
              resizeMode='contain'
              style={{ width: 91, height: 31, marginRight: 2 }}
            />
            <ThemedText style={styles.supportLabel}> Support</ThemedText>
          </View>
          <TouchableOpacity
            style={styles.closeCircle}
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.closeX}>×</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.heroText}>How Can We Help?</ThemedText>

        <View style={styles.searchBar}>
          <SearchNormal1 size={16} color='rgba(255,255,255,0.6)' />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder='Search anything'
            placeholderTextColor='rgba(255,255,255,0.5)'
            style={styles.searchInput}
          />
        </View>
      </SafeAreaView>

      {/* ── White body ── */}
      <View style={[styles.body, { backgroundColor: C.background }]}>
        <ThemedText style={[styles.faqsLabel, { color: C.text }]}>
          FAQs
        </ThemedText>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* FAQ accordion */}
          {filteredFaq.map((item, index) => (
            <FAQRow
              key={`faq-${item.q}`}
              text={item.q}
              answer={item.a}
              expanded={openFaqIndex === index}
              onPress={() =>
                setOpenFaqIndex((prev) => (prev === index ? null : index))
              }
              scheme={scheme}
            />
          ))}

          {/* Articles card */}
          <View style={[styles.docsCard, { backgroundColor: C.inputBg }]}>
            {[0, 1, 2].map((i) => (
              <View key={i}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowDocumented(true)}
                  style={styles.docRow}
                >
                  <ThemedText style={[styles.docTitle, { color: C.text }]}>
                    How to put my bracks to work
                  </ThemedText>
                  <ThemedText style={[styles.docSub, { color: C.muted }]}>
                    {DOC_SUBTEXT}
                  </ThemedText>
                </TouchableOpacity>
                {i < 2 && (
                  <View
                    style={[styles.docDivider, { backgroundColor: C.border }]}
                  />
                )}
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating CTA */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              { backgroundColor: scheme === "dark" ? C.inputBg : GREEN_LIGHT },
            ]}
            onPress={() => setShowLiveChat(true)}
            activeOpacity={0.85}
          >
            <Send size={16} color={C.primary} style={{ marginRight: 8 }} />
            <ThemedText style={[styles.ctaLabel, { color: C.primary }]}>
              Start Conversation
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <DocumentedSupportModal
        visible={showDocumented}
        onClose={() => setShowDocumented(false)}
        scheme={scheme}
      />
      <LiveChatModal
        visible={showLiveChat}
        onClose={() => setShowLiveChat(false)}
        scheme={scheme}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
});

const styles = StyleSheet.create({
  // Header
  header: {
    backgroundColor: GREEN_DARK,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  brandWrap: { flexDirection: "row", alignItems: "baseline" },
  brandText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    fontStyle: "italic",
  },
  supportLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeX: { color: "#fff", fontSize: 20, lineHeight: 22 },
  heroText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#fff", padding: 0 },

  // Body
  body: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  faqsLabel: { fontSize: 20, fontWeight: "800", marginBottom: 14 },
  scrollContent: { paddingBottom: 20 },

  // FAQ
  faqRow: {
    borderRadius: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  faqHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  faqText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    paddingRight: 12,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
    paddingBottom: 16,
    paddingRight: 12,
  },

  // Docs card
  docsCard: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 12,
  },
  docRow: { paddingVertical: 14 },
  docTitle: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  docSub: { fontSize: 12, lineHeight: 18 },
  docDivider: { height: StyleSheet.hairlineWidth },

  // CTA
  ctaWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 36 : 20,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    paddingVertical: 16,
  },
  ctaLabel: { fontSize: 15, fontWeight: "700" },

  // Modals
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  docScrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  docModalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  docSubHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 12,
  },
  docBodyText: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  liveHeader: {
    height: 60,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  liveHeaderText: { fontSize: 16, fontWeight: "bold" },
  chatScroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  bubble: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  supportBubble: { alignSelf: "flex-start" },
  userBubble: { alignSelf: "flex-end" },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  chatInputRow: {
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  attachIcon: { fontSize: 20 },
  chatInput: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── Live Chat styles ─────────────────────────────────────────
const lc = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  chatScroll: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 14,
  },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  msgRowSupport: { justifyContent: "flex-start" },
  msgRowUser: { justifyContent: "flex-end" },
  avatar: { width: 36, height: 36, borderRadius: 18, flexShrink: 0 },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "72%",
  },
  supportBubble: { borderTopLeftRadius: 4 },
  userBubble: { borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },
  attachBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 100,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  sendBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
