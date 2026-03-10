import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { ArrowLeft2, FingerCricle } from "iconsax-react-native";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

type TransactionPinValidatorProps = {
  visible: boolean;
  onClose: () => void;
  onTransactionPinValidated: () => void;
  onResetPin?: () => void;
  onValidatePin?: (pin: string) => Promise<boolean> | boolean;
};

export const TransactionPinValidator = ({
  visible,
  onClose,
  onTransactionPinValidated,
  onResetPin,
  onValidatePin,
}: TransactionPinValidatorProps) => {
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [pin, setPin] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);

  const pinLength = pin.length;

  const handleClose = () => {
    setPin([]);
    setShowInvalid(false);
    setIsLoading(false);
    onClose();
  };

  const handleNumberClick = (num: string) => {
    if (pinLength >= 6) return;
    const nextPin = [...pin, num];
    setPin(nextPin);

    if (nextPin.length === 6) {
      validateEnteredPin(nextPin.join(""));
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const validateEnteredPin = async (value: string) => {
    try {
      setIsLoading(true);
      const valid = onValidatePin ? await onValidatePin(value) : true;

      if (!valid) {
        setShowInvalid(true);
        return;
      }

      setPin([]);
      onTransactionPinValidated();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
        <View style={styles.container}>
          <View style={styles.topContent}>
            <TouchableOpacity onPress={handleClose} style={styles.closeWrap}>
              <ThemedText style={styles.closeText}>×</ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.title}>Confirm transaction</ThemedText>
            <ThemedText style={styles.subtitle}>
              Kindly enter your transaction PIN to authorize this transaction.
            </ThemedText>

            <View style={styles.pinBox}>
              {Array.from({ length: 6 }).map((_, index) => (
                <View
                  key={index}
                  style={{
                    ...styles.dot,
                    backgroundColor: index < pinLength ? "#85808A" : "#D9D9DE",
                  }}
                />
              ))}
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#013D25" />
              <ThemedText style={styles.loadingText}>Please wait</ThemedText>
            </View>
          ) : (
            <View style={styles.keypad}>
              <View style={styles.keyRow}>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("1")}
                >
                  <ThemedText style={styles.keyText}>1</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("2")}
                >
                  <ThemedText style={styles.keyText}>2</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("3")}
                >
                  <ThemedText style={styles.keyText}>3</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.keyRow}>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("4")}
                >
                  <ThemedText style={styles.keyText}>4</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("5")}
                >
                  <ThemedText style={styles.keyText}>5</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("6")}
                >
                  <ThemedText style={styles.keyText}>6</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.keyRow}>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("7")}
                >
                  <ThemedText style={styles.keyText}>7</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("8")}
                >
                  <ThemedText style={styles.keyText}>8</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("9")}
                >
                  <ThemedText style={styles.keyText}>9</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.keyRow}>
                <TouchableOpacity style={styles.keyBtn} onPress={() => {}}>
                  <FingerCricle size={20} color="#12432E" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() => handleNumberClick("0")}
                >
                  <ThemedText style={styles.keyText}>0</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keyBtn} onPress={handleDelete}>
                  <ArrowLeft2 size={20} color="#CB010B" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <Modal
          visible={showInvalid}
          transparent
          animationType="fade"
          onRequestClose={() => setShowInvalid(false)}
        >
          <View style={styles.invalidOverlay}>
            <View style={styles.invalidCard}>
              <ThemedText style={styles.invalidTitle}>
                Invalid transaction pin
              </ThemedText>
              <ThemedText style={styles.invalidHint}>
                Can’t remember PIN?
              </ThemedText>
              <BraneButton
                text="Click here to reset"
                onPress={() => {
                  setShowInvalid(false);
                  onResetPin?.();
                }}
                backgroundColor="#013D25"
                textColor="#D2F1E4"
                height={44}
                radius={12}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  topContent: {
    gap: 8,
  },
  closeWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  closeText: {
    color: "#7C7C82",
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "700",
    color: "#0B0014",
  },
  subtitle: {
    width: "65%",
    fontSize: 10,
    lineHeight: 13,
    color: "#85808A",
  },
  pinBox: {
    width: 186,
    height: 48,
    backgroundColor: "#F7F7F8",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  loadingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
  },
  loadingText: {
    color: "#0B0014",
    fontSize: 12,
  },
  keypad: {
    marginTop: "auto",
    marginBottom: 26,
    width: "78%",
    alignSelf: "center",
    gap: 18,
  },
  keyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  keyBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCFCFD",
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#0B0014",
  },
  invalidOverlay: {
    flex: 1,
    backgroundColor: "rgba(11,0,20,0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  invalidCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    gap: 14,
  },
  invalidTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#0B0014",
  },
  invalidHint: {
    textAlign: "center",
    color: "#D09129",
    fontSize: 12,
  },
});
