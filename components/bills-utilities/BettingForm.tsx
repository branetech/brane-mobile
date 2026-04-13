import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ArrowDown2 } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import type { SelectOption } from "./types";

type Props = {
  bettingProviders: SelectOption[];
  selectedBettingProvider?: SelectOption;
  customerId: string;
  setCustomerId: (v: string) => void;
  customerIdError?: string;
  setCustomerIdError: (v: string | undefined) => void;
  amount: string;
  setAmount: (v: string) => void;
  amountError?: string;
  setAmountError: (v: string | undefined) => void;
  onOpenProviderModal: () => void;
};

export function BettingForm({
  bettingProviders,
  selectedBettingProvider,
  customerId,
  setCustomerId,
  customerIdError,
  setCustomerIdError,
  amount,
  setAmount,
  amountError,
  setAmountError,
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
