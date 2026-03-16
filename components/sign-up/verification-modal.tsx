import { Text } from "@idimma/rn-widget";
import React from "react";
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

const COLORS = {
  primary: "#013D25",
  text: "#0B0014",
  muted: "#85808A",
  bgLight: "#F7F7F8",
  white: "#FFFFFF",
  borderInactive: "#D1D1D1",
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (method: "sms" | "whatsapp") => void;
  selectedMethod?: "sms" | "whatsapp";
};

export const VerifyMethodModal = ({
  visible,
  onClose,
  onSelect,
  selectedMethod,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View style={styles.card}>
            <Text style={styles.headerText}>
              How would you like to verify your phone number?
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onSelect("whatsapp")}
              style={styles.optionItem}
            >
              <Text style={styles.optionLabel}>Via Whats app</Text>
              <View
                style={[
                  styles.radioOuter,
                  {
                    borderColor:
                      selectedMethod === "whatsapp"
                        ? COLORS.primary
                        : COLORS.borderInactive,
                  },
                ]}
              >
                {selectedMethod === "whatsapp" && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onSelect("sms")}
              style={[styles.optionItem, { marginTop: 12 }]}
            >
              <Text style={styles.optionLabel}>Via SMS</Text>
              <View
                style={[
                  styles.radioOuter,
                  {
                    borderColor:
                      selectedMethod === "sms"
                        ? COLORS.primary
                        : COLORS.borderInactive,
                  },
                ]}
              >
                {selectedMethod === "sms" && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 390,
  },
  headerText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.text,
    textAlign: "left",
    marginBottom: 24,
    lineHeight: 22,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.bgLight,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  optionLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "400",
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
});
