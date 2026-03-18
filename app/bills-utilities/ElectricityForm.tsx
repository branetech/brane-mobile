<<<<<<< HEAD
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ArrowDown2 } from "iconsax-react-native";
import React from "react";
import {
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
=======
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import BaseRequest, { parseNetworkError } from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { showError } from "@/utils/helpers";
import { ArrowDown2 } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
import {
    ELECTRICITY_AMOUNTS,
    ELECTRICITY_PRODUCTS,
    type SelectOption,
} from "./types";

type Props = {
  electricityProviders: SelectOption[];
<<<<<<< HEAD
=======
  electricityProvider: string;
  setElectricityProvider: (id: string) => void;
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
  selectedElectricityProvider?: SelectOption;
  electricityProduct: string;
  setElectricityProduct: (v: string) => void;
  meterNumber: string;
  setMeterNumber: (v: string) => void;
  cardError?: string;
  setCardError: (v: string | undefined) => void;
  electricityAccountName: string;
<<<<<<< HEAD
=======
  setElectricityAccountName: (v: string) => void;
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
  amount: string;
  setAmount: (v: string) => void;
  amountError?: string;
  setAmountError: (v: string | undefined) => void;
  onOpenProviderModal: () => void;
<<<<<<< HEAD
  addToBeneficiaries: boolean;
  setAddToBeneficiaries: (value: boolean) => void;
=======
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
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
<<<<<<< HEAD
=======
  setElectricityAccountName,
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
  amount,
  setAmount,
  amountError,
  setAmountError,
<<<<<<< HEAD
  onOpenProviderModal,
  addToBeneficiaries,
  setAddToBeneficiaries,
}: Props) {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];
  const styles = createStyles(C);

  const selectedProductLabel =
    electricityProduct.charAt(0).toUpperCase() + electricityProduct.slice(1);

  const toggleProduct = () => {
    const nextProduct =
      electricityProduct === ELECTRICITY_PRODUCTS[0]
        ? ELECTRICITY_PRODUCTS[1]
        : ELECTRICITY_PRODUCTS[0];
    setElectricityProduct(nextProduct);
    setCardError(undefined);
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Select Biller</ThemedText>
        {electricityProviders.length > 0 ? (
          <TouchableOpacity
            style={styles.selectField}
            onPress={onOpenProviderModal}
            activeOpacity={0.85}
          >
            <ThemedText
              style={[
                styles.selectText,
                !selectedElectricityProvider && styles.placeholderText,
              ]}
            >
              {selectedElectricityProvider
                ? selectedElectricityProvider.label.toUpperCase()
                : "Select a biller"}
            </ThemedText>
            <ArrowDown2 size={18} color={C.muted} />
          </TouchableOpacity>
        ) : (
          <ThemedText style={styles.helperText}>
            No electricity provider available.
          </ThemedText>
        )}
      </View>

      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Select Product</ThemedText>
        <TouchableOpacity
          style={styles.selectField}
          onPress={toggleProduct}
          activeOpacity={0.85}
        >
          <ThemedText style={styles.selectText}>
            {selectedProductLabel}
          </ThemedText>
          <ArrowDown2 size={18} color={C.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Meter number</ThemedText>
        <View
          style={[
            styles.inputField,
            cardError ? styles.inputFieldError : undefined,
          ]}
        >
          <TextInput
            style={styles.inputText}
            placeholder="Input your meter number"
            placeholderTextColor={C.muted}
            keyboardType="number-pad"
            value={meterNumber}
            onChangeText={(value) => {
              setMeterNumber(value.replace(/\D/g, ""));
              setCardError(undefined);
            }}
          />
        </View>
        {cardError ? (
          <ThemedText style={styles.errorText}>{cardError}</ThemedText>
        ) : null}
        {electricityAccountName ? (
          <ThemedText style={styles.accountNameText}>
            {electricityAccountName}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Amount</ThemedText>
        <View style={styles.amountGrid}>
          {ELECTRICITY_AMOUNTS.map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[
                styles.amountChip,
                amount === preset && styles.amountChipActive,
              ]}
              onPress={() => {
                setAmount(preset);
                setAmountError(undefined);
              }}
            >
              <ThemedText
                style={[
                  styles.amountChipText,
                  amount === preset && styles.amountChipTextActive,
                ]}
              >
                ₦ {preset}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={[
            styles.customAmountField,
            amountError ? styles.inputFieldError : undefined,
          ]}
        >
          <TextInput
            style={styles.inputText}
            placeholder="Enter custom amount"
            placeholderTextColor={C.muted}
            keyboardType="number-pad"
            value={amount}
            onChangeText={(v) => {
              setAmount(v.replace(/\D/g, ""));
              setAmountError(undefined);
            }}
          />
        </View>
        {amountError ? (
          <ThemedText style={styles.errorText}>{amountError}</ThemedText>
        ) : null}
      </View>

      <View style={styles.beneficiaryRow}>
        <ThemedText style={styles.beneficiaryText}>
          Save as beneficiaries
        </ThemedText>
        <Switch
          value={addToBeneficiaries}
          onValueChange={setAddToBeneficiaries}
          trackColor={{ false: "#D9D9DE", true: "#D2F1E4" }}
          thumbColor={addToBeneficiaries ? C.primary : "#FFFFFF"}
          ios_backgroundColor="#D9D9DE"
=======
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
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
        />
      </View>
    </View>
  );
}

<<<<<<< HEAD
const createStyles = (C: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      gap: 18,
      paddingTop: 4,
    },
    fieldBlock: {
      gap: 8,
    },
    fieldLabel: {
      fontSize: 10,
      fontWeight: "500",
      color: C.muted,
    },
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
    helperText: {
      fontSize: 11,
      color: C.muted,
    },
    inputField: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: C.inputBg,
      paddingHorizontal: 14,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#EEF0F3",
    },
    customAmountField: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 14,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      marginTop: 10,
    },
    inputFieldError: {
      borderColor: C.error,
    },
    inputText: {
      fontSize: 12,
      color: C.text,
      paddingVertical: 0,
    },
    errorText: {
      fontSize: 11,
      color: C.error,
    },
    accountNameText: {
      fontSize: 11,
      color: C.primary,
      fontWeight: "500",
    },
    amountGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    amountChip: {
      width: "23%",
      minHeight: 40,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    amountChipActive: {
      borderColor: C.primary,
      backgroundColor: "#F4FBF7",
    },
    amountChipText: {
      fontSize: 11,
      color: C.text,
      fontWeight: "500",
    },
    amountChipTextActive: {
      color: C.primary,
    },
    beneficiaryRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4,
    },
    beneficiaryText: {
      fontSize: 10,
      color: C.muted,
      fontWeight: "500",
    },
  });
=======
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
>>>>>>> 0b0149424735cd94f0f81dc0d26a60bb9ecfa268
