import { BraneButton } from "@/components/brane-button";
import { PinCreated, SuccessBackground } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Modal, StyleSheet, View } from "react-native";

export const PinSuccessModal = ({
  visible,
  onContinue,
}: {
  visible: boolean;
  onContinue: () => void;
}) => {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={StyleSheet.absoluteFill}>
            <SuccessBackground />
          </View>

          <View style={styles.iconContainer}>
            <PinCreated size={80} />
          </View>

          <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
            <ThemedText type="subtitle">Pin Created</ThemedText>
            <ThemedText
              style={{
                fontSize: 12,
                color: C.muted,
                textAlign: "center",
                marginTop: 8,
                lineHeight: 18,
              }}
            >
              You have successfully created your transaction PIN, Continue to
              perform your first transaction.
            </ThemedText>
          </View>

          <BraneButton
            text="Continue"
            onPress={onContinue}
            height={48}
            radius={12}
            backgroundColor="#013D25"
            textColor="#D2F1E4"
            style={{ width: 280 }}
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  card: {
    width: 360,
    height: 320,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  iconContainer: {
    marginTop: 32,
  },
});
