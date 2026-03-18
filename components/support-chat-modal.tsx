import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { CloseCircle, Send } from "iconsax-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

interface SupportChatModalProps {
  visible: boolean;
  onClose: () => void;
}

const SUPPORT_RESPONSES = [
  "Thanks for reaching out! How can I help you today?",
  "I understand. Let me help you with that.",
  "Great question! Here's what you need to know...",
  "Is there anything else I can assist you with?",
  "I'll check that for you right away.",
];

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  visible,
  onClose,
}) => {
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 Welcome to Brane Support. How can we help you today?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    scrollToBottom();

    // Simulate support response
    setIsLoading(true);
    setTimeout(() => {
      const randomResponse =
        SUPPORT_RESPONSES[Math.floor(Math.random() * SUPPORT_RESPONSES.length)];
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportMessage]);
      setIsLoading(false);
      scrollToBottom();
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View
            style={{
              backgroundColor: C.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              flex: 1,
              maxHeight: "90%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: C.border,
              }}
            >
              <ThemedText
                type='defaultSemiBold'
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: C.text,
                }}
              >
                Support
              </ThemedText>
              <TouchableOpacity onPress={onClose}>
                <CloseCircle size={24} color={C.text} />
              </TouchableOpacity>
            </View>

            {/* Messages List */}
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                gap: 12,
              }}
              onContentSizeChange={() => scrollToBottom()}
            >
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={{
                    alignItems:
                      message.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <View
                    style={{
                      maxWidth: "80%",
                      backgroundColor:
                        message.sender === "user" ? C.primary : C.inputBg,
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                    }}
                  >
                    <ThemedText
                      style={{
                        fontSize: 14,
                        color: message.sender === "user" ? "#FFFFFF" : C.text,
                        lineHeight: 20,
                      }}
                    >
                      {message.text}
                    </ThemedText>
                  </View>
                  <ThemedText
                    style={{
                      fontSize: 11,
                      color: C.muted,
                      marginTop: 4,
                      marginHorizontal: 6,
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </ThemedText>
                </View>
              ))}

              {isLoading && (
                <View
                  style={{
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: C.inputBg,
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      flexDirection: "row",
                      gap: 6,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: C.muted,
                        opacity: 0.6,
                      }}
                    />
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: C.muted,
                        opacity: 0.8,
                      }}
                    />
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: C.muted,
                      }}
                    />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input Area */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: C.border,
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: C.inputBg,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  color: C.text,
                  maxHeight: 100,
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
                placeholder='Type your message...'
                placeholderTextColor={C.muted}
                value={inputText}
                onChangeText={setInputText}
                editable={!isLoading}
                multiline
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor:
                    inputText.trim() && !isLoading ? C.primary : C.border,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Send
                  size={20}
                  color={inputText.trim() && !isLoading ? "#FFFFFF" : C.muted}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};
