import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image as RNImage,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { ArrowLeft } from "iconsax-react-native";

interface SallyFirstModalContentProps {
  onClose: () => void;
  onOpenNext: () => void;
  scheme: string;
}

const benefits = [
  "Benefit of Sally automatically invests your Bracs into diversified assets anytime.",
  "Benefit of Sally automatically invests your Bracs into diversified assets anytime.",
];

export default function SallyFirstModalContent({
  onClose,
  onOpenNext,
  scheme,
}: SallyFirstModalContentProps) {
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const handleGetStarted = useCallback(() => {
    onOpenNext();
  }, [onOpenNext]);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <ArrowLeft size={24} color={C.text} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Image Placeholder */}
        <View style={[styles.imagePlaceholder, { backgroundColor: C.inputBg }]}>
          <RNImage
            source={require("../../assets/images/icn.png")}
            style={styles.image}
          />
        </View>

        {/* Title and Description */}
        <ThemedText style={[styles.title, { color: C.text }]}>
          Let Sally Invest for You
        </ThemedText>
        <ThemedText style={[styles.description, { color: C.muted }]}>
          Sally automatically invests your Bracs into diversified assets once
          you reach your set goal. You can modify this anytime.
        </ThemedText>

        {/* Benefits List */}
        <View style={styles.benefitsList}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View
                style={[styles.bulletPoint, { backgroundColor: C.primary }]}
              />
              <ThemedText style={[styles.benefitText, { color: C.muted }]}>
                {benefit}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: C.primary }]}
        onPress={handleGetStarted}
      >
        <ThemedText style={styles.buttonText}>Get Started</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  content: {
    flex: 1,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    alignSelf: "center",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    flexShrink: 0,
  },
  benefitText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
