import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Add, Minus, SearchNormal1, Send } from "iconsax-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

type ChatMessage = {
  id: string;
  text: string;
  sender: "support" | "user";
};

const FAQ_ITEMS = [
  "How can i get stock rewards",
  "How can i get stock rewards",
  "How can i get stock rewards",
  "How can i get stock rewards",
  "What are the requirements I need to open an account?",
];

const DOC_SUBTEXT = "Learn how to make good use of your bracs for investment";

const DOC_BODY =
  "Lorem ipsum dolor sit amet consectetur. Et vitae eget volutpat libero integer vel tristique nisi. Gravida potenti aliquet ut morbi tristique arcu egestas. Tempor cursus duis quis placerat metus congue phasellus sapien. Ultricies proin ut mattis morbi suspendisse nunc sollicitudin accumsan tortor. Dolor mattis mauris id nibh dui magna ultrices posuere fringilla. Eu cursus et sapien accumsan quam phasellus. Ut non odio eu congue at duis quis. Morbi libero amet vel semper. A molestie et a commodo quam ut. Tellus dictum nulla egestas tellus ipsum id. Ultricies sed ut faucibus ultrices volutpat ac. Pulvinar ut turpis leo dui quam. Arcu id urna sed pulvinar a dui elit ut lectus. Morbi tortor interdum sem dui tellus eget sit. Sem eget pellentesque cum vitae tristique velit. Varius aliquam tincidunt eu morbi senectus.";

const FAQRow = ({
  text,
  expanded,
  onPress,
  iconColor,
  backgroundColor,
  borderColor,
  textColor,
}: {
  text: string;
  expanded: boolean;
  onPress: () => void;
  iconColor: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}) => {
  return (
    <TouchableOpacity
      style={[styles.faqRow, { backgroundColor, borderColor }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <ThemedText style={[styles.faqText, { color: textColor }]}>
        {text}
      </ThemedText>
      {expanded ? (
        <Minus size={16} color={iconColor} />
      ) : (
        <Add size={16} color={iconColor} />
      )}
    </TouchableOpacity>
  );
};

const DocLinkRow = ({
  onPress,
  titleColor,
  subColor,
}: {
  onPress: () => void;
  titleColor: string;
  subColor: string;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <ThemedText style={[styles.docLinkTitle, { color: titleColor }]}>
        How to put my bracks to work
      </ThemedText>
      <ThemedText style={[styles.docLinkSub, { color: subColor }]}>
        {DOC_SUBTEXT}
      </ThemedText>
    </TouchableOpacity>
  );
};

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
      <SafeAreaView
        style={[styles.modalSafe, { backgroundColor: C.background }]}
      >
        <View style={styles.modalHeaderRow}>
          <Back onPress={onClose} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.docScrollContent}
        >
          <ThemedText
            type='subtitle'
            style={[styles.docTitle, { color: C.text }]}
          >
            How to Put My Bracs To Work
          </ThemedText>

          <ThemedText style={[styles.docBody, { color: C.text }]}>
            {DOC_BODY}
          </ThemedText>

          <ThemedText
            type='subtitle'
            style={[styles.docSubHeader, { color: C.text }]}
          >
            Another Subheader
          </ThemedText>
          <ThemedText style={[styles.docBody, { color: C.text }]}>
            {DOC_BODY}
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

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
      <SafeAreaView
        style={[styles.modalSafe, { backgroundColor: C.background }]}
      >
        <View style={[styles.liveHeader, { borderBottomColor: C.border }]}>
          <Back onPress={onClose} />
          <ThemedText style={[styles.liveHeaderText, { color: C.text }]}>
            Live Chat
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <KeyboardAvoidingView
          style={styles.flexOne}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={72}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.flexOne}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatScroll}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.chatBubble,
                  message.sender === "support"
                    ? [styles.supportBubble, { backgroundColor: C.inputBg }]
                    : [styles.userBubble, { backgroundColor: C.primary }],
                ]}
              >
                <ThemedText
                  style={[
                    styles.chatBubbleText,
                    {
                      color:
                        message.sender === "support" ? C.text : C.background,
                    },
                  ]}
                >
                  {message.text}
                </ThemedText>
              </View>
            ))}
          </ScrollView>

          <View
            style={[
              styles.chatInputRow,
              { borderTopColor: C.border, backgroundColor: C.background },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.attachIconWrap, { backgroundColor: C.inputBg }]}
            >
              <ThemedText style={[styles.attachIcon, { color: C.primary }]}>
                ⌁
              </ThemedText>
            </TouchableOpacity>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder='I have always wanted to be a wing man'
              placeholderTextColor={C.muted}
              style={[
                styles.chatInput,
                { borderColor: C.border, color: C.text },
              ]}
              multiline
            />
            <TouchableOpacity
              onPress={sendMessage}
              activeOpacity={0.85}
              style={[styles.chatSendBtn, { backgroundColor: C.primary }]}
            >
              <Send size={14} color={C.background} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default function SupportScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showDocumented, setShowDocumented] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [search, setSearch] = useState("");

  const filteredFaq = useMemo(() => {
    if (!search.trim()) return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <ImageBackground
      source={require("@/assets/images/Home Screen Populated 1.png")}
      style={styles.screen}
      resizeMode='contain'
    >
      <SafeAreaView style={styles.screenInner}>
        <View style={[styles.greenTopBlock, { backgroundColor: C.primary }]}>
          <View style={styles.brandRow}>
            <View style={styles.brandWrap}>
              <ThemedText style={styles.brandText}>brane</ThemedText>
              <ThemedText style={styles.supportText}>Support</ThemedText>
            </View>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.closeCircle}
              onPress={() => router.push("/(tabs)")}
            >
              <ThemedText style={styles.closeText}>×</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.heroQuestion}>How Can We Help?</ThemedText>

          <View style={[styles.searchWrap, { backgroundColor: C.inputBg }]}>
            <SearchNormal1 size={14} color={C.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder='Search anything'
              placeholderTextColor={C.muted}
              style={[styles.searchInput, { color: C.text }]}
            />
          </View>
        </View>

        <View style={[styles.bodyArea, { backgroundColor: C.background }]}>
          <ThemedText style={[styles.faqHeading, { color: C.text }]}>
            FAQs
          </ThemedText>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {filteredFaq.map((item, index) => (
              <FAQRow
                key={`${item}-${index}`}
                text={item}
                expanded={openFaqIndex === index}
                onPress={() =>
                  setOpenFaqIndex((prev) => (prev === index ? null : index))
                }
                iconColor={scheme === "dark" ? C.muted : C.primary}
                backgroundColor={C.inputBg}
                borderColor={C.border}
                textColor={C.text}
              />
            ))}

            {[0, 1, 2].map((index) => (
              <View
                key={`doc-${index}`}
                style={[
                  styles.docLinkRow,
                  { backgroundColor: C.inputBg, borderColor: C.border },
                ]}
              >
                <DocLinkRow
                  onPress={() => setShowDocumented(true)}
                  titleColor={C.text}
                  subColor={C.muted}
                />
              </View>
            ))}

            <View style={styles.bottomSpace} />
          </ScrollView>

          <View
            style={[styles.startCtaWrap, { backgroundColor: C.background }]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.startCtaBtn, { backgroundColor: C.primary }]}
              onPress={() => setShowLiveChat(true)}
            >
              <ThemedText style={[styles.startCtaText, { color: "#FFFFFF" }]}>
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenInner: {
    flex: 1,
    backgroundColor: "transparent",
  },
  greenTopBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "transparent",
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  brandText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  supportText: {
    color: "#D3EBE1",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  closeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  heroQuestion: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchWrap: {
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  bodyArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -12,
  },
  faqHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  faqRow: {
    minHeight: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  faqText: {
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  docLinkRow: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  docLinkTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  docLinkSub: {
    fontSize: 12,
  },
  bottomSpace: {
    height: 20,
  },
  startCtaWrap: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    paddingTop: 8,
  },
  startCtaBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  startCtaText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalSafe: {
    flex: 1,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  docScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  docTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  docSubHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 12,
  },
  docBody: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  flexOne: {
    flex: 1,
  },
  liveHeader: {
    height: 60,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  liveHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chatScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  chatBubble: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  supportBubble: {
    alignSelf: "flex-start",
  },
  userBubble: {
    alignSelf: "flex-end",
  },
  chatBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatInputRow: {
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  attachIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  attachIcon: {
    fontSize: 20,
  },
  chatInput: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  chatSendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
