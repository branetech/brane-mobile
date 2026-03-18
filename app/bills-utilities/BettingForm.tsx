import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { SelectOption } from "./types";

type Props = {
  bettingProviders: SelectOption[];
  bettingProvider: string;
  setBettingProvider: (id: string) => void;
  customerId: string;
  setCustomerId: (v: string) => void;
  customerIdError?: string;
  setCustomerIdError: (v: string | undefined) => void;
  amount: string;
  setAmount: (v: string) => void;
  amountError?: string;
  setAmountError: (v: string | undefined) => void;
};

export function BettingForm({
  bettingProviders,
  bettingProvider,
  setBettingProvider,
  customerId,
  setCustomerId,
  customerIdError,
  setCustomerIdError,
  amount,
  setAmount,
  amountError,
  setAmountError,
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
