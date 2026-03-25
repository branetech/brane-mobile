import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { type PaymentOption } from "@/components/payment-method-selector";
import { SuccessModal } from "@/components/success-modal";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import {
  TransactionSummaryModal,
  type TransactionRow,
} from "@/components/transaction-summary-modal";
import { Colors } from "@/constants/colors";
import { type Scheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { AUTH_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { addBeneficiary, sendMoney } from "@/services/send-money";
import { useRequest } from "@/services/useRequest";
import { View } from "@idimma/rn-widget";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Copy } from "iconsax-react-native";
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

  const recipientName = (params.recipientName as string) || "Recipient";
  const accountNumber = (params.accountNumber as string) || "";
  const bankName = (params.bankName as string) || "";
  const bankCode = (params.bankCode as string) || "";
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
  const [selectedPaymentId, setSelectedPaymentId] = useState("brane_wallet");
  const [isSending, setIsSending] = useState(false);

  // Fetch wallet balance using useRequest hook - auto-refetches on screen focus
  const { data: walletBalance = 0, isLoading: isLoadingBalance } = useRequest(
    TRANSACTION_SERVICE.BALANCE,
    {
      initialValue: 0,
      revalidateOnFocus: true,
      revalidateOnMount: true,
    },
  );

  const paymentOptions: PaymentOption[] = [
    { id: "brane_wallet", label: "Brane Wallet", icon: "₦" },
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

  const handleSaveBeneficiary = async () => {
    if (!addToBeneficiaries) {
      return;
    }

    try {
      await addBeneficiary({
        accountNumber,
        bankCode,
        bankName,
        accountName: recipientName,
      });
      console.log("Beneficiary saved successfully");
    } catch (error) {
      catchError(error);
    }
  };

  const handleFundWallet = () => {
    setShowSummarySheet(false);
    router.push("/add-funds" as any);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          Send Money
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recipient Card */}
        <RNView style={[styles.recipientCard, { backgroundColor: "#F8FCFA" }]}>
          <ThemedText style={[styles.smallLabel, { color: C.text }]}>
            {bankName}
          </ThemedText>
          <RNView style={styles.recipientRow}>
            <RNView>
              <ThemedText
                style={[styles.recipientName, { color: C.text, width: 220 }]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {recipientName}
              </ThemedText>
              <ThemedText style={[styles.smallMeta, { color: C.muted }]}>
                {accountNumber}
              </ThemedText>
            </RNView>
            {/* Link/copy icon button matching image */}
            <RNView
              style={[styles.checkIconWrap, { backgroundColor: C.primary }]}
            >
              <ThemedText style={[styles.checkIcon, { color: "#FFFFFF" }]}>
                <Copy size={20} color={C.inputBackground} />
              </ThemedText>
            </RNView>
          </RNView>
        </RNView>

        {/* Add to beneficiaries toggle row */}
        <RNView
          style={[
            styles.beneficiaryRow,
            { borderWidth: 1, borderColor: C.border },
          ]}
        >
          <ThemedText
            style={[styles.fieldHeading, { color: C.text, marginBottom: 0 }]}
          >
            Add to beneficiaries
          </ThemedText>
          <Switch
            value={addToBeneficiaries}
            onValueChange={setAddToBeneficiaries}
            trackColor={{ false: C.inputBg, true: C.googleBg }}
            thumbColor={addToBeneficiaries ? C.primary : C.muted}
          />
        </RNView>

        {/* Amount section */}
        <ThemedText
          style={[styles.fieldHeading, { color: C.muted, marginTop: 16 }]}
        >
          Amount
        </ThemedText>

        {/* Preset amounts grid — no outer border, plain background */}
        <RNView
          style={[
            { gap: 10, borderWidth: 1, borderColor: C.border, padding: 12 },
          ]}
        >
          <RNView style={[styles.presetGrid]}>
            {PRESET_AMOUNTS.map((preset, index) => (
              <TouchableOpacity
                key={`${preset}-${index}`}
                style={[
                  styles.presetBtn,
                  {
                    backgroundColor:
                      amount === preset ? C.inputBg : C.background,
                    borderColor: amount === preset ? C.border : "#E5E5E5",
                  },
                ]}
                onPress={() => {
                  setAmount(preset);
                  setAmountError(undefined);
                }}
              >
                <ThemedText style={[styles.presetText, { color: C.text }]}>
                  ₦ {preset}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </RNView>
          <RNView style={styles.customAmountWrap}>
            <FormInput
              placeholder='Enter custom amount'
              keyboardType='number-pad'
              value={amount}
              onChangeText={(value) => {
                setAmount(value.replace(/\D/g, ""));
                setAmountError(undefined);
              }}
              error={amountError}
              inputContainerStyle={[
                styles.customInputContainer,
                { borderColor: C.border, backgroundColor: "transparent" },
              ]}
              inputStyle={styles.inputText}
            />
          </RNView>
        </RNView>
        {/* Custom amount input — full width, outside preset grid */}

        {/* Remark section */}
        <ThemedText
          style={[styles.fieldHeading, { marginTop: 12, color: C.muted }]}
        >
          Remark
        </ThemedText>
        <View style={styles.remarkWrap}>
          <FormInput
            placeholder='Add a remark'
            value={remark}
            onChangeText={(value) => {
              setRemark(value);
              setRemarkError(undefined);
            }}
            multiline={true}
            editable={true}
            maxLength={150}
            error={remarkError}
            inputContainerStyle={[
              styles.remarkInputContainer,
              { borderColor: C.border, backgroundColor: C.inputBg },
            ]}
            inputStyle={[
              styles.remarkInputText,
              { color: C.text, textAlignVertical: "top" },
            ]}
          />
          <ThemedText style={[styles.counter, { color: C.muted }]}>
            {`${remark.length}/150`}
          </ThemedText>
        </View>
      </ScrollView>

      {/* Footer CTA — rounded pill button */}
      <View style={styles.footer}>
        <BraneButton
          text='Continue'
          onPress={() => {
            if (!validate()) return;
            setShowConfirmSheet(true);
          }}
          backgroundColor={C.primary}
          textColor={C.googleBg}
          height={52}
          // radius={26}
          fontSize={16}
        />
      </View>

      {/* Confirm Sheet Modal */}
      <Modal
        visible={showConfirmSheet}
        transparent
        animationType='slide'
        onRequestClose={() => setShowConfirmSheet(false)}
      >
        <TouchableOpacity
          style={[
            styles.sheetOverlay,
            {
              backgroundColor: "#013D254D",
            },
          ]}
          activeOpacity={1}
          onPress={() => setShowConfirmSheet(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <RNView
              style={[styles.sheetCard, { backgroundColor: C.background }]}
            >
              <RNView style={[styles.grabber, { backgroundColor: C.border }]} />
              <ThemedText style={[styles.sheetTitle, { color: C.text }]}>
                Confirm Recipient
              </ThemedText>

              <RNView
                style={[styles.noticeBox, { backgroundColor: C.googleBg }]}
              >
                <ThemedText style={[styles.noticeText, { color: C.primary }]}>
                  Please review and confirm the receiptient information as
                  succesful transfer can not be refunded
                </ThemedText>
              </RNView>

              <RNView style={styles.sheetRows}>
                {[
                  {
                    label: "Recipient name:",
                    value: recipientName,
                    bordered: true,
                  },
                  { label: "Account Name:", value: accountNumber },
                  { label: "Bank:", value: bankName },
                  {
                    label: "Amount:",
                    value: `₦ ${Number(amount || 0).toLocaleString("en-NG")}`,
                  },
                  { label: "Service Charge:", value: "₦ 25.00" },
                ].map((row, i, arr) => (
                  <RNView
                    key={row.label}
                    style={[
                      styles.sheetRow,
                      i < arr.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: C.border,
                      },
                    ]}
                  >
                    <ThemedText style={[styles.sheetLabel, { color: C.muted }]}>
                      {row.label}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.sheetValue,
                        { color: C.text },
                        row.bordered ? { width: 120 } : { flexShrink: 1 },
                      ]}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {row.value}
                    </ThemedText>
                  </RNView>
                ))}
              </RNView>

              <RNView style={styles.sheetButtons}>
                <BraneButton
                  text='Not This Account'
                  onPress={() => setShowConfirmSheet(false)}
                  backgroundColor={C.googleBg}
                  textColor={C.primary}
                  height={48}
                  radius={24}
                  style={styles.halfBtn}
                  fontSize={14}
                />
                <BraneButton
                  text='Confirm'
                  onPress={() => {
                    setShowConfirmSheet(false);
                    setShowSummarySheet(true);
                  }}
                  backgroundColor={C.primary}
                  textColor={C.googleBg}
                  height={48}
                  radius={24}
                  style={styles.halfBtn}
                  fontSize={14}
                />
              </RNView>
            </RNView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Summary Sheet Modal - using reusable TransactionSummaryModal */}
      <TransactionSummaryModal
        visible={showSummarySheet}
        onClose={() => setShowSummarySheet(false)}
        amount={Number(amount || 0)}
        rows={
          [
            { label: "Recipient", value: recipientName },
            { label: "Bank", value: bankName },
            { label: "Account Number", value: accountNumber },
            {
              label: "Amount",
              value: `₦ ${Number(amount || 0).toLocaleString("en-NG")}`,
            },
            { label: "Service Fee", value: "₦ 25.00" },
            {
              label: "Total Debit",
              value: `₦ ${(Number(amount || 0) + 25).toLocaleString("en-NG")}`,
              bold: true,
            },
          ] as TransactionRow[]
        }
        // iconEmoji="💳"
        paymentOptions={paymentOptions}
        selectedPaymentId={selectedPaymentId}
        onPaymentSelect={setSelectedPaymentId}
        walletBalance={walletBalance}
        isLoadingBalance={isLoadingBalance}
        onFundWallet={handleFundWallet}
        ctaLabel='Pay Now'
        onConfirm={() => {
          setShowSummarySheet(false);
          setShowPinValidator(true);
        }}
      />

      <TransactionPinValidator
        visible={showPinValidator}
        onClose={() => setShowPinValidator(false)}
        onResetPin={() => router.push("/account/reset-transaction-pin" as any)}
        onValidatePin={async (pin) => {
          try {
            const res = await BaseRequest.post(AUTH_SERVICE.PIN_VALIDATION, {
              pin,
            });
            console.log("PIN validation response:", res);
            return true;
          } catch {
            return false;
          }
        }}
        onTransactionPinValidated={async () => {
          setShowPinValidator(false);
          setIsSending(true);
          try {
            await sendMoney({
              recipientName,
              accountNumber,
              bankCode,
              amount: Number(amount) + 25,
              remark,
              paymentMethod: selectedPaymentId,
            });
            await handleSaveBeneficiary();
            setShowSuccessModal(true);
          } catch (error) {
            catchError(error);
          } finally {
            setIsSending(false);
          }
        }}
      />

      <SuccessModal
        visible={showSuccessModal}
        title='Transfer Successful'
        description={`You've successfully sent ₦${Number(amount || 0).toLocaleString("en-NG")} to ${recipientName}.${addToBeneficiaries ? " Added to beneficiaries." : ""}`}
        actionText='Done'
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
  headerTitle: { fontSize: 16 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  // Recipient card
  recipientCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    height: 100,
  },
  smallLabel: { fontSize: 12, marginBottom: 6 },
  recipientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipientName: { fontSize: 16, fontWeight: "700" },
  smallMeta: { fontSize: 12, marginTop: 3 },
  checkIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: { fontSize: 18, fontWeight: "700" },

  // Beneficiary toggle
  beneficiaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    marginBottom: 4,
    borderRadius: 12,
  },

  fieldHeading: { fontSize: 13, fontWeight: "500", marginBottom: 10 },

  // Preset amounts — no surrounding box
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  presetBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 13,
    minWidth: 75,
    alignItems: "center",
  },
  presetText: { fontSize: 13, fontWeight: "500" },

  // Custom amount input — full-width standalone
  customAmountWrap: {
    marginBottom: 16,
    width: "100%",
  },
  customInputContainer: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
  },
  inputText: { fontSize: 13 },

  // Remark
  remarkWrap: { marginBottom: 8 },
  remarkInputContainer: {
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  remarkInputText: { fontSize: 13 },
  counter: {
    alignSelf: "flex-end",
    marginTop: 4,
    fontSize: 10,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },

  // Sheet overlay
  sheetOverlay: {
    flex: 1,
    backgroundColor: "#013D254D",
    justifyContent: "flex-end",
  },
  sheetCard: {
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
  },
  noticeBox: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  noticeText: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 16,
  },
  sheetRows: {
    overflow: "hidden",
    backgroundColor: "#F8FCFA",
    borderRadius: 12,
    padding: 16,
  },
  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  rowDivider: {
    borderBottomWidth: 1,
  },
  sheetLabel: { fontSize: 13 },
  sheetValue: { fontSize: 13, fontWeight: "600" },
  sheetButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  halfBtn: {
    flex: 1,
  },

  // Summary sheet
  summaryCard: {
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
    alignSelf: "center",
  },
  summaryAmount: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
  },
  summaryHeading: {
    fontSize: 12,
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
  },
  summaryRowValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  rewardCard: {
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
  },
  rewardText: {
    fontSize: 12,
    flex: 1,
  },
  rewardValue: {
    fontSize: 12,
    fontWeight: "700",
  },
});
