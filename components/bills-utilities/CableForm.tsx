import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import BaseRequest, { parseNetworkError } from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { showError } from "@/utils/helpers";
import { ArrowDown2 } from "iconsax-react-native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { CABLE_IMAGES, type CablePlan, type SelectOption } from "./types";
import { getCableImageKey } from "./helpers";

type Props = {
  cableProviders: SelectOption[];
  cableProvider: string;
  setCableProvider: (id: string) => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardError?: string;
  setCardError: (v: string | undefined) => void;
  cardHolderName: string;
  setCardHolderName: (v: string) => void;
  cablePlans: CablePlan[];
  selectedCablePlan?: CablePlan;
  onOpenCablePlanModal: () => void;
};

export function CableForm({
  cableProviders,
  cableProvider,
  setCableProvider,
  cardNumber,
  setCardNumber,
  cardError,
  setCardError,
  cardHolderName,
  setCardHolderName,
  cablePlans,
  selectedCablePlan,
  onOpenCablePlanModal,
}: Props) {
  const handleVerify = async () => {
    if (!cardNumber || cardNumber.length < 6) {
      setCardError("Enter a valid smart card / IUC number");
      return;
    }
    try {
      const response: any = await BaseRequest.post(
        MOBILE_SERVICE.VERIFY_CABLE_CARD,
        { serviceId: cableProvider, billersCode: cardNumber },
      );
      const details = response?.data || response;
      const name =
        details?.customerName || details?.name || details?.customer_name || "";
      setCardHolderName(String(name));
    } catch (error) {
      const { message } = parseNetworkError(error);
      showError(message);
    }
  };

  return (
    <View style={styles.card}>
      <ThemedText style={styles.sectionTitle}>Cable Provider</ThemedText>

      <View style={styles.cableGrid}>
        {cableProviders.map((item) => {
          const imageKey = getCableImageKey(
            `${item.id} ${item.label} ${item.description || ""}`,
          );
          const source = imageKey ? CABLE_IMAGES[imageKey] : undefined;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.cableTile,
                cableProvider === item.id && styles.cableTileActive,
              ]}
              onPress={() => setCableProvider(item.id)}
            >
              {source ? (
                <Image
                  source={source}
                  style={styles.cableLogo}
                  resizeMode="contain"
                />
              ) : null}
              <ThemedText
                style={[
                  styles.cableText,
                  cableProvider === item.id && styles.cableTextActive,
                ]}
              >
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
        {cableProviders.length === 0 && (
          <ThemedText style={styles.emptyText}>
            No cable provider available.
          </ThemedText>
        )}
      </View>

      <ThemedText style={styles.fieldLabel}>Smart Card / IUC Number</ThemedText>
      <FormInput
        placeholder="Enter smart card number"
        value={cardNumber}
        onChangeText={(v) => {
          setCardNumber(v.replace(/\D/g, ""));
          setCardError(undefined);
        }}
        error={cardError}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />

      <BraneButton
        text="Verify card"
        onPress={handleVerify}
        height={38}
        radius={8}
        backgroundColor="#D2F1E4"
        textColor="#013D25"
        fontSize={11}
        style={styles.verifyBtn}
      />

      {cardHolderName ? (
        <View style={styles.verifiedCard}>
          <ThemedText style={styles.verifiedLabel}>Verified Name</ThemedText>
          <ThemedText style={styles.verifiedValue}>{cardHolderName}</ThemedText>
        </View>
      ) : null}

      <ThemedText style={styles.fieldLabel}>Subscription Plan</ThemedText>
      {cablePlans.length > 0 ? (
        <TouchableOpacity
          style={styles.planSelector}
          onPress={onOpenCablePlanModal}
          activeOpacity={0.8}
        >
          <View style={styles.planSelectorTextWrap}>
            <ThemedText style={styles.planSelectorTitle}>
              {selectedCablePlan
                ? selectedCablePlan.label
                : "Select subscription plan"}
            </ThemedText>
            {selectedCablePlan ? (
              <ThemedText style={styles.planSelectorAmount}>
                ₦{selectedCablePlan.amount.toLocaleString("en-NG")}
              </ThemedText>
            ) : null}
          </View>
          <ArrowDown2 size={18} color="#6E6E75" />
        </TouchableOpacity>
      ) : (
        <ThemedText style={styles.emptyText}>
          No subscription plan available for this provider.
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
  cableGrid: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cableTile: {
    width: "23%",
    minWidth: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8EA",
    backgroundColor: "#F9FAFA",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cableTileActive: { borderColor: "#013D25", backgroundColor: "#F2FAF6" },
  cableLogo: { width: 38, height: 24, marginBottom: 5 },
  cableText: {
    fontSize: 10,
    color: "#4F4F56",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cableTextActive: { color: "#013D25" },
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
