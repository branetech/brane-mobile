import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { ArrowDown2 } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { DataPlan, SelectOption } from "./types";

type Props = {
  transportProviders: SelectOption[];
  transportProvider: string;
  setTransportProvider: (id: string) => void;
  transportReference: string;
  setTransportReference: (v: string) => void;
  referenceError?: string;
  setReferenceError: (v: string | undefined) => void;
  transportPlans: DataPlan[];
  selectedTransportPlan?: DataPlan;
  onOpenTransportPlanModal: () => void;
};

export function TransportationForm({
  transportProviders,
  transportProvider,
  setTransportProvider,
  transportReference,
  setTransportReference,
  referenceError,
  setReferenceError,
  transportPlans,
  selectedTransportPlan,
  onOpenTransportPlanModal,
}: Props) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.sectionTitle}>Transportation</ThemedText>

      <ThemedText style={styles.fieldLabel}>Transport Provider</ThemedText>
      <View style={styles.providersRow}>
        {transportProviders.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.providerBtn,
              transportProvider === item.id && styles.providerBtnActive,
            ]}
            onPress={() => setTransportProvider(item.id)}
          >
            <ThemedText
              style={[
                styles.providerText,
                transportProvider === item.id && styles.providerTextActive,
              ]}
            >
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
        {transportProviders.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No transportation provider available.
          </ThemedText>
        ) : null}
      </View>

      <ThemedText style={styles.fieldLabel}>Reference Number</ThemedText>
      <FormInput
        placeholder="Enter reference number"
        value={transportReference}
        onChangeText={(v) => {
          setTransportReference(v);
          setReferenceError(undefined);
        }}
        error={referenceError}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />

      <ThemedText style={styles.fieldLabel}>Transport Plan</ThemedText>
      {transportPlans.length > 0 ? (
        <TouchableOpacity
          style={styles.planSelector}
          onPress={onOpenTransportPlanModal}
          activeOpacity={0.8}
        >
          <View style={styles.planSelectorTextWrap}>
            <ThemedText style={styles.planSelectorTitle}>
              {selectedTransportPlan
                ? selectedTransportPlan.label
                : "Select transport plan"}
            </ThemedText>
            {selectedTransportPlan ? (
              <ThemedText style={styles.planSelectorAmount}>
                ₦{selectedTransportPlan.amount.toLocaleString("en-NG")}
              </ThemedText>
            ) : null}
          </View>
          <ArrowDown2 size={18} color="#6E6E75" />
        </TouchableOpacity>
      ) : (
        <ThemedText style={styles.emptyText}>
          No transportation plan available.
        </ThemedText>
      )}
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
  providersRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  providerBtn: {
    borderWidth: 1,
    borderColor: "#E7E7EB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  providerBtnActive: { borderColor: "#013D25", borderWidth: 2 },
  providerText: { fontSize: 12, color: "#4F4F56", fontWeight: "500" },
  providerTextActive: { color: "#013D25" },
  inputContainer: { height: 40, borderRadius: 8, borderColor: "#F0F0F0" },
  inputText: { fontSize: 11 },
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
  emptyText: { fontSize: 10, color: "#8E8E93" },
});
