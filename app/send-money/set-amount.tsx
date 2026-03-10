import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import {
    PaymentMethodSelector,
    type PaymentOption,
} from "@/components/payment-method-selector";
import { SuccessModal } from "@/components/success-modal";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    View as RNView,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type Scheme = "light" | "dark";
const PRESET_AMOUNTS = ["5000", "10000", "20000", "50000"];

const amountSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((value) => Number(value) > 0, "Enter a valid amount"),
  remark: z
    .string()
    .min(3, "Remark must be at least 3 characters")
    .max(150, "Remark must not exceed 150 characters"),
});

export default function SendMoneySetAmountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const recipientName =
    (params.recipientName as string) || "Oluwatosin Solomon";
  const accountNumber = (params.accountNumber as string) || "0127277063";
  const bankName = (params.bankName as string) || "Guaranty Trust Bank";
  const initialBeneficiary = String(params.addToBeneficiaries) === "true";

  const [amount, setAmount] = useState("5000");
  const [remark, setRemark] = useState("");
  const [addToBeneficiaries, setAddToBeneficiaries] =
    useState(initialBeneficiary);
  const [amountError, setAmountError] = useState<string | undefined>(undefined);
  const [remarkError, setRemarkError] = useState<string | undefined>(undefined);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [showSummarySheet, setShowSummarySheet] = useState(false);
  const [showPinValidator, setShowPinValidator] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("total_balance");

  const paymentOptions: PaymentOption[] = [
    { id: "total_balance", label: "Total balance - ₦ 1,000.00", icon: "₦" },
    { id: "brane_wallet", label: "Brane Wallet - ₦ 1,000.00", icon: "B" },
  ];

  const validate = () => {
    const parsed = amountSchema.safeParse({ amount, remark });

    if (parsed.success) {
      setAmountError(undefined);
      setRemarkError(undefined);
      return true;
    }

    const fields = parsed.error.flatten().fieldErrors;
    setAmountError(fields.amount?.[0]);
    setRemarkError(fields.remark?.[0]);
    return false;
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          Bills & Utility
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.recipientCard}>
          <ThemedText style={styles.smallLabel}>Wema bank</ThemedText>
          <View style={styles.recipientRow}>
            <View>
              <ThemedText style={[styles.recipientName, { color: C.text }]}>
                {recipientName}
              </ThemedText>
              <ThemedText style={styles.smallMeta}>{accountNumber}</ThemedText>
            </View>
            <View style={styles.checkIconWrap}>
              <ThemedText style={styles.checkIcon}>✓</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.beneficiaryRow}>
          <ThemedText style={styles.fieldHeading}>
            Add to beneficiaries
          </ThemedText>
          <Switch
            value={addToBeneficiaries}
            onValueChange={setAddToBeneficiaries}
            trackColor={{ false: "#E6E6E8", true: "#D2F1E4" }}
            thumbColor={addToBeneficiaries ? "#013D25" : "#B9B9BD"}
          />
        </View>

        <ThemedText style={styles.fieldHeading}>Amount</ThemedText>
        <View style={styles.newCon} gap={12}>
          <View style={styles.presetGrid}>
            {PRESET_AMOUNTS.concat(PRESET_AMOUNTS).map((preset, index) => (
              <TouchableOpacity
                key={`${preset}-${index}`}
                style={[
                  styles.presetBtn,
                  {
                    backgroundColor: amount === preset ? "#F4F1E2" : "#FFFFFF",
                    borderColor: amount === preset ? "#E4DBC0" : "#ECECEC",
                  },
                ]}
                onPress={() => {
                  setAmount(preset);
                  setAmountError(undefined);
                }}
              >
                <ThemedText style={styles.presetText}>₦ {preset}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <FormInput
            placeholder="Enter custom amount"
            keyboardType="number-pad"
            value={amount}
            onChangeText={(value) => {
              setAmount(value.replace(/\D/g, ""));
              setAmountError(undefined);
            }}
            error={amountError}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
          />
        </View>

        <ThemedText style={[styles.fieldHeading, { marginTop: 12 }]}>
          Remark
        </ThemedText>
        <View style={styles.remarkWrap}>
          <FormInput
            placeholder="Select Plan"
            value={remark}
            onChangeText={(value) => {
              setRemark(value);
              setRemarkError(undefined);
            }}
            error={remarkError}
            inputContainerStyle={styles.remarkInputContainer}
            inputStyle={styles.remarkInputText}
          />
          <ThemedText
            style={styles.counter}
          >{`${remark.length}/150`}</ThemedText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BraneButton
          text="Continue"
          onPress={() => {
            if (!validate()) return;
            setShowConfirmSheet(true);
          }}
          backgroundColor="#013D25"
          textColor="#D2F1E4"
          height={48}
          radius={8}
          fontSize={11}
        />
      </View>

      <Modal
        visible={showConfirmSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmSheet(false)}
      >
        <RNView style={styles.sheetOverlay}>
          <RNView style={styles.sheetCard}>
            <RNView style={styles.grabber} />
            <ThemedText style={styles.sheetTitle}>Confirm Recipient</ThemedText>
            <RNView style={styles.noticeBox}>
              <ThemedText style={styles.noticeText}>
                Please review and confirm the recipient information as
                successful transfer can not be refunded
              </ThemedText>
            </RNView>

            <RNView style={styles.sheetRows}>
              {[
                { label: "Recipient name:", value: recipientName },
                { label: "Account Nn:", value: accountNumber },
                { label: "Bank:", value: bankName },
                {
                  label: "Amount:",
                  value: `₦ ${Number(amount || 0).toLocaleString("en-NG")}`,
                },
              ].map((row, i, arr) => (
                <RNView
                  key={row.label}
                  style={[
                    styles.sheetRow,
                    i < arr.length - 1 && styles.rowDivider,
                  ]}
                >
                  <ThemedText style={styles.sheetLabel}>{row.label}</ThemedText>
                  <ThemedText style={styles.sheetValue}>{row.value}</ThemedText>
                </RNView>
              ))}
            </RNView>

            <RNView style={styles.sheetButtons}>
              <BraneButton
                text="Not This Account"
                onPress={() => setShowConfirmSheet(false)}
                backgroundColor="#D2F1E4"
                textColor="#013D25"
                height={48}
                radius={24}
                style={styles.halfBtn}
                fontSize={12}
              />
              <BraneButton
                text="Confirm"
                onPress={() => {
                  setShowConfirmSheet(false);
                  setShowSummarySheet(true);
                }}
                backgroundColor="#013D25"
                textColor="#D2F1E4"
                height={48}
                radius={24}
                style={styles.halfBtn}
                fontSize={12}
              />
            </RNView>
          </RNView>
        </RNView>
      </Modal>

      <Modal
        visible={showSummarySheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSummarySheet(false)}
      >
        <RNView style={styles.sheetOverlay}>
          <RNView style={styles.summaryCard}>
            <RNView style={styles.grabber} />
            <ThemedText style={styles.summaryAmount}>
              ₦{Number(amount || 0).toLocaleString("en-NG")}
            </ThemedText>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.summaryScroll}
              contentContainerStyle={styles.summaryScrollContent}
            >
              <ThemedText style={styles.summaryHeading}>
                Transaction Summary
              </ThemedText>
              <RNView style={styles.summaryRows}>
                {[
                  { label: "Provider:", value: "MTN" },
                  { label: "Sending to:", value: accountNumber },
                  {
                    label: "Transaction Amount:",
                    value: `₦ ${Number(amount || 0).toLocaleString("en-NG")}`,
                  },
                  { label: "Service Fee:", value: "₦0.00" },
                  {
                    label: "Total Debit:",
                    value: `₦ ${Number(amount || 0).toLocaleString("en-NG")}`,
                  },
                ].map((row, i, arr) => (
                  <RNView
                    key={row.label}
                    style={[
                      styles.summaryRowItem,
                      i < arr.length - 1 && styles.summaryRowDivider,
                    ]}
                  >
                    <ThemedText style={styles.sheetLabel}>
                      {row.label}
                    </ThemedText>
                    <ThemedText style={styles.summaryRowValue}>
                      {row.value}
                    </ThemedText>
                  </RNView>
                ))}
              </RNView>

              <PaymentMethodSelector
                options={paymentOptions}
                selectedId={selectedPaymentId}
                onSelect={setSelectedPaymentId}
                onSeeAll={() => {}}
              />

              <RNView style={styles.rewardCard}>
                <RNView style={styles.rewardLeft}>
                  <RNView style={styles.rewardIcon} />
                  <ThemedText style={styles.rewardText}>
                    You earned/Reward Bracs
                  </ThemedText>
                </RNView>
                <ThemedText style={styles.rewardValue}>3,000 Bracs</ThemedText>
              </RNView>
            </ScrollView>

            <BraneButton
              text="Buy Airtime"
              onPress={() => {
                setShowSummarySheet(false);
                setShowPinValidator(true);
              }}
              backgroundColor="#013D25"
              textColor="#D2F1E4"
              height={52}
              radius={8}
              fontSize={14}
            />
          </RNView>
        </RNView>
      </Modal>

      <TransactionPinValidator
        visible={showPinValidator}
        onClose={() => setShowPinValidator(false)}
        onValidatePin={async (pin) => pin === "123456"}
        onTransactionPinValidated={() => {
          setShowPinValidator(false);
          setShowSuccessModal(true);
        }}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Transaction Successful"
        description={`You've successfully sent ₦${Number(amount || 0).toLocaleString("en-NG")}.`}
        actionText="Dismiss"
        onAction={() => {
          setShowSuccessModal(false);
          router.replace("/(tabs)");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: "bold" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  recipientCard: {
    backgroundColor: "#F6F8F8",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  smallLabel: { fontSize: 9, color: "#8E8E93", marginBottom: 4 },
  recipientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipientName: { fontSize: 12, fontWeight: "600" },
  smallMeta: { fontSize: 9, color: "#8E8E93", marginTop: 2 },
  checkIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#E1F4EC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: { color: "#013D25", fontSize: 10, fontWeight: "700" },
  beneficiaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  fieldHeading: { fontSize: 10, color: "#8E8E93", marginBottom: 8 },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  newCon: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#F7F7F8",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  presetBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 72,
    alignItems: "center",
  },
  presetText: { fontSize: 10, color: "#0B0014", fontWeight: "500" },
  inputContainer: {
    height: 36,
    borderRadius: 8,
    borderColor: "#F0F0F0",
  },
  inputText: { fontSize: 11 },
  remarkWrap: { marginBottom: 8 },
  remarkInputContainer: {
    height: 84,
    borderRadius: 8,
    borderColor: "#F0F0F0",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  remarkInputText: { fontSize: 11 },
  counter: {
    alignSelf: "flex-end",
    marginTop: 4,
    color: "#A1A1A6",
    fontSize: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(11,0,20,0.4)",
    justifyContent: "flex-end",
  },
  sheetCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    gap: 16,
  },
  sheetTitle: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#0B0014",
  },
  noticeBox: {
    backgroundColor: "#D2F1E4",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  noticeText: {
    fontSize: 11,
    color: "#013D25",
    textAlign: "center",
    lineHeight: 16,
  },
  sheetRows: { overflow: "hidden" },
  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF1",
  },
  sheetLabel: { fontSize: 13, color: "#8E8E93" },
  sheetValue: { fontSize: 13, color: "#0B0014", fontWeight: "600" },
  sheetButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  halfBtn: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    height: SCREEN_HEIGHT * 0.82,
    gap: 12,
  },
  summaryScroll: {
    flex: 1,
  },
  summaryScrollContent: {
    gap: 14,
    paddingBottom: 8,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E3E3E8",
    alignSelf: "center",
  },
  summaryAmount: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: "#0B0014",
  },
  summaryHeading: {
    fontSize: 12,
    color: "#0B0014",
    fontWeight: "600",
  },
  summaryRows: {
    overflow: "hidden",
  },
  summaryRowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  summaryRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFF1",
  },
  summaryRowValue: {
    fontSize: 13,
    color: "#0B0014",
    fontWeight: "600",
  },

  rewardCard: {
    backgroundColor: "#E9DFB3",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  rewardIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#C4961A",
  },
  rewardText: {
    fontSize: 12,
    color: "#0B0014",
    flex: 1,
  },
  rewardValue: {
    fontSize: 12,
    color: "#0B0014",
    fontWeight: "700",
  },
});
