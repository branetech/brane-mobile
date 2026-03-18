import { BraneButton } from "@/components/brane-button";
import { PinCreated } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";

type SuccessModalProps = {
  visible: boolean;
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  onRequestClose?: () => void;
};

export const SuccessModal = ({
  visible,
  title,
  description,
  actionText,
  onAction,
  onRequestClose,
}: SuccessModalProps) => {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];
  const dynamicStyles = createDynamicStyles(C);

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onRequestClose ?? onAction}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <PinCreated size={72} />
          </View>

          <View style={styles.textBlock}>
            <ThemedText style={dynamicStyles.title}>{title}</ThemedText>
            <ThemedText style={[styles.description, { color: C.muted }]}>
              {description}
            </ThemedText>
          </View>

          <BraneButton
            text={actionText}
            onPress={onAction}
            height={48}
            radius={10}
            backgroundColor={C.primary}
            textColor={C.background}
            fontSize={14}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 14,
  },
  textBlock: {
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    fontSize: 12,

    textAlign: "center",
    marginTop: 6,
  },
  button: {
    width: "100%",
  },
});

const createDynamicStyles = (C: typeof Colors.light) =>
  StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: "700",
      textAlign: "center",
      color: C.text,
    },
  });
