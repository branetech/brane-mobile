import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import BaseRequest, { parseNetworkError } from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { showError } from "@/utils/helpers";
import { ArrowDown2 } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import {
    ELECTRICITY_AMOUNTS,
    ELECTRICITY_PRODUCTS,
    type SelectOption,
} from "./types";

type Props = {
  electricityProviders: SelectOption[];
  electricityProvider: string;
  setElectricityProvider: (id: string) => void;
  selectedElectricityProvider?: SelectOption;
  electricityProduct: string;
  setElectricityProduct: (v: string) => void;
  meterNumber: string;
  setMeterNumber: (v: string) => void;
  cardError?: string;
  setCardError: (v: string | undefined) => void;
  electricityAccountName: string;
  setElectricityAccountName: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  amountError?: string;
  setAmountError: (v: string | undefined) => void;
  onOpenProviderModal: () => void;
};

export function ElectricityForm({
  electricityProviders,
  selectedElectricityProvider,
  electricityProduct,
  setElectricityProduct,
  meterNumber,
  setMeterNumber,
  cardError,
  setCardError,
  electricityAccountName,
  setElectricityAccountName,
  amount,
  setAmount,
  amountError,
  setAmountError,
  electricityProvider,
  onOpenProviderModal,
}: Props) {
  const handleVerify = async () => {
    if (!meterNumber || meterNumber.length < 6) {
      setCardError("Enter a valid meter number");
      return;
    }
    try {
      const response: any = await BaseRequest.post(
        MOBILE_SERVICE.ELECTRICITY_METER_VERIFY,
        {
          serviceId:
            selectedElectricityProvider?.description ||
            selectedElectricityProvider?.label,
          billersCode: meterNumber,
          variationCode: electricityProduct,
        },
      );
      const details = response?.data || response;
      const name =
        details?.customerName || details?.name || details?.Customer_Name || "";
      setElectricityAccountName(String(name));
    } catch (error) {
      const { message } = parseNetworkError(error);
      showError(message);
    }
  };

  return (
    <View style={styles.card}>
      <ThemedText style={styles.sectionTitle}>Electricity</ThemedText>

      <ThemedText style={styles.fieldLabel}>Select Provider</ThemedText>
      {electricityProviders.length > 0 ? (
        <TouchableOpacity
          style={styles.planSelector}
          onPress={onOpenProviderModal}
          activeOpacity={0.8}
        >
          <View style={styles.planSelectorTextWrap}>
            <ThemedText style={styles.planSelectorTitle}>
              {selectedElectricityProvider
                ? selectedElectricityProvider.label.toUpperCase()
                : "Select a provider"}
            </ThemedText>
            {selectedElectricityProvider?.description ? (
              <ThemedText style={styles.planSelectorAmount}>
                {selectedElectricityProvider.description
                  .replace(/-/g, " ")
                  .toUpperCase()}
              </ThemedText>
            ) : null}
          </View>
          <ArrowDown2 size={18} color="#6E6E75" />
        </TouchableOpacity>
      ) : (
        <ThemedText style={styles.emptyText}>
          No electricity provider available.
        </ThemedText>
      )}

      <ThemedText style={styles.fieldLabel}>Meter Type</ThemedText>
      <View style={styles.chipsRow}>
        {ELECTRICITY_PRODUCTS.map((product) => (
          <TouchableOpacity
            key={product}
            style={[
              styles.chip,
              electricityProduct === product && styles.chipActive,
            ]}
            onPress={() => setElectricityProduct(product)}
          >
            <ThemedText
              style={[
                styles.chipText,
                electricityProduct === product && styles.chipTextActive,
              ]}
            >
              {product}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ThemedText style={styles.fieldLabel}>Meter Number</ThemedText>
      <FormInput
        placeholder="Enter meter number"
        value={meterNumber}
        onChangeText={(v) => {
          setMeterNumber(v.replace(/\D/g, ""));
          setCardError(undefined);
        }}
        error={cardError}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />

      <BraneButton
        text="Verify meter"
        onPress={handleVerify}
        height={38}
        radius={8}
        backgroundColor="#D2F1E4"
        textColor="#013D25"
        fontSize={11}
        style={styles.verifyBtn}
      />

      {electricityAccountName ? (
        <View style={styles.verifiedCard}>
          <ThemedText style={styles.verifiedLabel}>Verified Name</ThemedText>
          <ThemedText style={styles.verifiedValue}>
            {electricityAccountName}
          </ThemedText>
        </View>
      ) : null}

      <ThemedText style={styles.fieldLabel}>Amount</ThemedText>
      <View style={styles.chipsRow}>
        {ELECTRICITY_AMOUNTS.map((preset) => (
          <TouchableOpacity
            key={preset}
            style={[styles.chip, amount === preset && styles.chipActive]}
            onPress={() => {
              setAmount(preset);
              setAmountError(undefined);
            }}
          >
            <ThemedText
              style={[
                styles.chipText,
                amount === preset && styles.chipTextActive,
              ]}
            >
              ₦ {preset}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={[
          styles.inlineInput,
          amountError ? styles.inputError : undefined,
        ]}
      >
        <ThemedText style={styles.currencyPrefix}>₦</ThemedText>
        <TextInput
          style={styles.inlineInputText}
          placeholder="Enter custom amount"
          placeholderTextColor="#A9A9AE"
          keyboardType="number-pad"
          value={amount}
          onChangeText={(v) => {
            setAmount(v.replace(/\D/g, ""));
            setAmountError(undefined);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ECECEF",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  sectionTitle: { fontSize: 12, color: "#0B0014", fontWeight: "700" },
  fieldLabel: {
    fontSize: 12,
    color: "#8A8A90",
    fontWeight: "500",
    marginBottom: -6,
  },
  planSelector: {
    borderWidth: 1,
    borderColor: "#E7E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  planSelectorTextWrap: { flex: 1, gap: 2 },
  planSelectorTitle: { fontSize: 12, color: "#1D1D22", fontWeight: "600" },
  planSelectorAmount: { fontSize: 11, color: "#676770" },
  chipsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    width: "23%",
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#E8E8EA",
    borderRadius: 8,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  chipActive: { borderColor: "#013D25", borderWidth: 2 },
  chipText: { fontSize: 12, color: "#4F4F56", fontWeight: "500" },
  chipTextActive: { color: "#013D25" },
  inputContainer: { height: 40, borderRadius: 8, borderColor: "#F0F0F0" },
  inputText: { fontSize: 11 },
  verifyBtn: { width: 110, marginTop: 8 },
  verifiedCard: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#EFFAF4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D7EDE0",
  },
  verifiedLabel: { fontSize: 9, color: "#5A8A70" },
  verifiedValue: {
    marginTop: 2,
    fontSize: 12,
    color: "#013D25",
    fontWeight: "600",
  },
  inlineInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E9E9EC",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  inputError: { borderColor: "#D73C3C" },
  currencyPrefix: { fontSize: 14, fontWeight: "700", color: "#4A4A50" },
  inlineInputText: { flex: 1, color: "#0B0014", fontSize: 12 },
  emptyText: { fontSize: 10, color: "#8E8E93" },
});
