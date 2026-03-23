import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  RecipientAccountSelector,
  BeneficiarySelector,
  RecipientDetailsConfirm,
  type Beneficiary,
} from "@/components/send-money";
import { getBeneficiaries, verifyAccountDetails, getBanks } from "@/services/send-money";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const sendMoneySchema = z.object({
  accountNumber: z
    .string()
    .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  bankCode: z.string().min(1, "Bank is required"),
});

type FormData = z.infer<typeof sendMoneySchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function SendMoneyScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [step, setStep] = useState<"account" | "confirm">(
    "account"
  );

  // Form State
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Beneficiary & Verification
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [recipientName, setRecipientName] = useState("");
  const [verified, setVerified] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [banks, setBanks] = useState<
    Array<{ code: string; name: string }>
  >([]);
  const [addToBeneficiaries, setAddToBeneficiaries] = useState(false);
  const [bankSearch, setBankSearch] = useState("");

  // Load data
  useEffect(() => {
    loadBenficiariesAndBanks();
  }, []);

  // Auto-verify account when both account number and bank are filled
  useEffect(() => {
    if (accountNumber.length === 10 && bankCode && !verified) {
      const timer = setTimeout(() => {
        handleVerifyAccount();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [accountNumber, bankCode]);

  const loadBenficiariesAndBanks = useCallback(async () => {
    setLoading(true);
    try {
      const [benefData, bankData] = await Promise.all([
        getBeneficiaries(),
        getBanks(),
      ]);
      setBeneficiaries(benefData || []);
      setBanks(bankData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
    bank.code.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const validateForm = (): boolean => {
    const result = sendMoneySchema.safeParse({
      accountNumber,
      bankCode,
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: FormErrors = {};
    const flattened = result.error.flatten().fieldErrors;
    Object.keys({ accountNumber, bankCode }).forEach((key) => {
      const message = flattened[key as keyof FormData]?.[0];
      if (message) fieldErrors[key as keyof FormData] = message;
    });
    setErrors(fieldErrors);
    return false;
  };

  const handleAccountChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(cleaned);
    setVerified(false);
    setRecipientName("");
    setSelectedBeneficiary(null);
    setErrors((prev) => ({ ...prev, accountNumber: undefined }));
  };

  const handleVerifyAccount = async () => {
    if (!accountNumber || accountNumber.length < 10) {
      setErrors((prev) => ({
        ...prev,
        accountNumber: "Account number must be 10 digits",
      }));
      return;
    }

    if (!bankCode) {
      setErrors((prev) => ({
        ...prev,
        bankCode: "Please select a bank",
      }));
      return;
    }

    setVerifying(true);
    setErrors({});
    try {
      console.log("Verifying account:", { accountNumber, bankCode });
      const result = await verifyAccountDetails(accountNumber, bankCode);
      console.log("Verification result:", result);

      if (result && (result.account_name || result.accountName || result.name)) {
        setRecipientName(result.account_name || result.accountName || result.name || "");
        setVerified(true);
      } else if (result) {
        // Result exists but no name - still consider it verified
        setRecipientName("Account Verified");
        setVerified(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          accountNumber: "Account not found or verification failed",
        }));
      }
    } catch (error) {
      console.error("Verification error:", error);
      setErrors((prev) => ({
        ...prev,
        accountNumber: "Verification failed. Please check details and try again.",
      }));
    } finally {
      setVerifying(false);
    }
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setAccountNumber(beneficiary.accountNumber || beneficiary.account_number || "");
    setBankCode(beneficiary.bankCode || beneficiary.bank_code || "");
    setBankName(beneficiary.bankName || beneficiary.bank_name || "");
    setRecipientName(beneficiary.name || "");
    setVerified(true);
    setSelectedBeneficiary(beneficiary);
    // Don't auto-navigate, let user click button to proceed
  };
const handleProceed = () => {
  if (step === "account") {
    if (!verified) {
      handleVerifyAccount();
    } else {
      // Verified — go straight to set-amount, skip confirm step
      if (!validateForm()) return;
      router.push({
        pathname: "/send-money/set-amount",
        params: {
          accountNumber,
          bankCode,
          bankName,
          recipientName,
          addToBeneficiaries: addToBeneficiaries ? "true" : "false",
        },
      });
    }
  }
};

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        <View style={styles.header}>
          <Back onPress={() => (step === "account" ? router.back() : setStep("account"))} />
          <ThemedText
            style={[styles.headerTitle, { color: C.text }]}
          >
            Send Money
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Step 1: Account Details + Beneficiary Selection */}
          {step === "account" && (
            <>

              <RecipientAccountSelector
                accountNumber={accountNumber}
                bankName={bankName}
                onAccountChange={handleAccountChange}
                onBankChange={setBankName}
                onBankPress={() => setShowBankModal(true)}
                accountError={errors.accountNumber}
                bankError={errors.bankCode}
                loading={verifying}
                verified={verified}
                recipientName={recipientName}
              />


              <View style={styles.buttonContainer}>
                <BraneButton
                  text={verified ? "Proceed to Confirm" : "Next"}
                  onPress={handleProceed}
                  loading={verifying}
                  disabled={!verified || verifying}
                />
              </View>

              <View style={{ marginTop: 32 }}>
                <BeneficiarySelector
                  beneficiaries={beneficiaries}
                  selectedId={selectedBeneficiary?.id}
                  onSelect={handleBeneficiarySelect}
                  loading={loading}
                />
              </View>
            </>
          )}

          {/* Step 2: Confirm */}
          {/* {step === "confirm" && (
            <>
              <RecipientDetailsConfirm
                name={recipientName}
                accountNumber={accountNumber}
                bankName={bankName}
                verified={verified}
              />

              <View style={[styles.optionRow, { borderBottomColor: C.border }]}>
                <ThemedText style={[styles.label, { color: C.text }]}>
                  Add to beneficiaries
                </ThemedText>
                <Switch
                  value={addToBeneficiaries}
                  onValueChange={setAddToBeneficiaries}
                  trackColor={{ false: C.border, true: C.primary + "40" }}
                  thumbColor={addToBeneficiaries ? C.primary : C.muted}
                />
              </View>
            </>
          )} */}
        </ScrollView>

     
      </KeyboardAvoidingView>

      {/* Bank Selection Modal */}
      <Modal visible={showBankModal} animationType="slide" transparent>
        <SafeAreaView style={[styles.modalScreen, { backgroundColor: C.background }]}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowBankModal(false)}>
              <ThemedText style={[{ color: C.primary }]}>Close</ThemedText>
            </Pressable>
            <ThemedText type="subtitle" style={[{ color: C.text }]}>
              Select Bank
            </ThemedText>
            <View style={{ width: 44 }} />
          </View>

          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder="Search banks..."
              placeholderTextColor={C.muted}
              value={bankSearch}
              onChangeText={setBankSearch}
              style={[
                styles.searchInput,
                { backgroundColor: C.inputBg, borderColor: C.border, color: C.text },
              ]}
            />
          </View>

          <ScrollView>
            {filteredBanks.map((bank, index) => (
              <Pressable
                key={`${bank.code}-${index}`}
                onPress={() => {
                  setBankCode(bank.code);
                  setBankName(bank.name);
                  setShowBankModal(false);
                  setErrors((prev) => ({ ...prev, bankCode: undefined }));
                }}
                style={[
                  styles.bankOption,
                  {
                    backgroundColor:
                      bankCode === bank.code ? C.inputBg : "transparent",
                    borderColor: C.border,
                  },
                ]}
              >
                <ThemedText style={[{ color: C.text }]}>
                  {bank.name}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingVertical: 14,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalScreen: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  bankOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 12,
  },
});
