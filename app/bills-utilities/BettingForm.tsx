import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
<<<<<<< HEAD
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ArrowDown2 } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
=======
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
import type { SelectOption } from "./types";

type Props = {
  bettingProviders: SelectOption[];
<<<<<<< HEAD
  selectedBettingProvider?: SelectOption;
=======
  bettingProvider: string;
  setBettingProvider: (id: string) => void;
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
  customerId: string;
  setCustomerId: (v: string) => void;
  customerIdError?: string;
  setCustomerIdError: (v: string | undefined) => void;
  amount: string;
  setAmount: (v: string) => void;
  amountError?: string;
  setAmountError: (v: string | undefined) => void;
<<<<<<< HEAD
  onOpenProviderModal: () => void;
=======
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
};

export function BettingForm({
  bettingProviders,
<<<<<<< HEAD
  selectedBettingProvider,
=======
  bettingProvider,
  setBettingProvider,
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
  customerId,
  setCustomerId,
  customerIdError,
  setCustomerIdError,
  amount,
  setAmount,
  amountError,
  setAmountError,
<<<<<<< HEAD
  onOpenProviderModal,
}: Props) {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];
  const styles = createStyles(C);

  return (
    <>
      <ThemedText style={styles.label}>Betting Provider</ThemedText>
      {bettingProviders.length > 0 ? (
        <TouchableOpacity
          style={styles.selectField}
          onPress={onOpenProviderModal}
          activeOpacity={0.85}
        >
          <ThemedText
            style={[
              styles.selectText,
              !selectedBettingProvider && styles.placeholderText,
            ]}
          >
            {selectedBettingProvider?.label || "Select betting provider"}
          </ThemedText>
          <ArrowDown2 size={18} color={C.muted} />
        </TouchableOpacity>
      ) : (
        <ThemedText style={styles.emptyText}>
          No betting provider available.
        </ThemedText>
      )}
=======
}: Props) {
  return (
    <>
      <ThemedText style={styles.label}>Betting Provider</ThemedText>
      <View style={styles.providersRow}>
        {bettingProviders.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.providerBtn,
              bettingProvider === item.id && styles.providerBtnActive,
            ]}
            onPress={() => setBettingProvider(item.id)}
          >
            <ThemedText
              style={[
                styles.providerText,
                bettingProvider === item.id && styles.providerTextActive,
              ]}
            >
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
        {bettingProviders.length === 0 && (
          <ThemedText style={styles.emptyText}>
            No betting provider available.
          </ThemedText>
        )}
      </View>
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268

      <ThemedText style={styles.label}>Customer ID</ThemedText>
      <FormInput
        placeholder="Enter customer ID"
        value={customerId}
        onChangeText={(v) => {
          setCustomerId(v);
          setCustomerIdError(undefined);
        }}
        error={customerIdError}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />

      <ThemedText style={styles.label}>Amount</ThemedText>
      <FormInput
        placeholder="Enter amount"
        keyboardType="number-pad"
        value={amount}
        onChangeText={(v) => {
          setAmount(v.replace(/\D/g, ""));
          setAmountError(undefined);
        }}
        error={amountError}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />
    </>
  );
}

<<<<<<< HEAD
const createStyles = (C: typeof Colors.light) =>
  StyleSheet.create({
    label: { fontSize: 10, color: C.muted, marginTop: 4 },
    selectField: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: C.inputBg,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "#EEF0F3",
      marginTop: 4,
    },
    selectText: {
      fontSize: 12,
      color: C.text,
      fontWeight: "500",
      flex: 1,
    },
    placeholderText: {
      color: C.muted,
      fontWeight: "400",
    },
    emptyText: { fontSize: 10, color: C.muted, marginTop: 4 },
    inputContainer: { height: 40, borderRadius: 8, borderColor: "#F0F0F0" },
    inputText: { fontSize: 11 },
  });
=======
const styles = StyleSheet.create({
  label: { fontSize: 10, color: "#8E8E93", marginTop: 4 },
  providersRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  providerBtn: {
    borderWidth: 1,
    borderColor: "#ECECEF",
    borderRadius: 8,
    minWidth: 66,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  providerBtnActive: { borderColor: "#013D25", backgroundColor: "#EAF4EF" },
  providerText: { fontSize: 11, color: "#5A5660", fontWeight: "600" },
  providerTextActive: { color: "#013D25" },
  emptyText: { fontSize: 10, color: "#8E8E93" },
  inputContainer: { height: 40, borderRadius: 8, borderColor: "#F0F0F0" },
  inputText: { fontSize: 11 },
});
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
