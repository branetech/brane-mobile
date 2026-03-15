import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { SuccessModal } from "@/components/success-modal";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { useRouter } from "expo-router";
import { Add } from "iconsax-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

const PRESET_AMOUNTS = ["200", "500", "750", "1000"];

const BANK_ACCOUNT = {
  id: "1",
  name: "Fatimo Temitope Salami",
  bank: "Guarantee Trust Bank",
  accountNumber: "01234567890",
};

export default function FundWithBankScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [amount, setAmount] = useState("2000");
  const [selectedBankId, setSelectedBankId] = useState<string | null>(
    BANK_ACCOUNT.id,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFundEnabled = !!amount && !!selectedBankId && !loading;
  const formattedAmount = Number(amount || 0).toLocaleString("en-NG");

  const handleFundAccount = async () => {
    if (!isFundEnabled) return;
    setLoading(true);
    try {
      await BaseRequest.post("/payment/fund-wallet", {
        amount: parseFloat(amount),
        bankAccountId: selectedBankId,
        method: "bank_transfer",
      });
      setShowSuccessModal(true);
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          Fund Wallet With Bank
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
            Fund Method
          </ThemedText>

          <View style={[styles.methodContainer, { backgroundColor: C.inputBg, borderColor: C.border }]}>
            <View style={styles.subHeaderRow}>
              <ThemedText style={[styles.addedText, { color: C.muted }]}>Added Banks</ThemedText>
              <TouchableOpacity activeOpacity={0.8}>
                <View style={styles.addNewWrap}>
                  <Add size={12} color={C.primary} />
                  <ThemedText style={[styles.addNewText, { color: C.primary }]}>Add New</ThemedText>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedBankId(BANK_ACCOUNT.id)}
              style={[
                styles.bankRow,
                {
                  borderColor:
                    selectedBankId === BANK_ACCOUNT.id ? C.primary : C.border,
                  backgroundColor:
                    selectedBankId === BANK_ACCOUNT.id ? C.primary + "15" : C.inputBg,
                },
              ]}
            >
              <View style={styles.bankDetails}>
                <View style={[styles.initialsBadge, { backgroundColor: "#E4580A" }]}>
                  <ThemedText style={styles.initialsText}>F</ThemedText>
                </View>
                <View>
                  <ThemedText style={[styles.bankName, { color: C.text }]}>
                    {BANK_ACCOUNT.name}
                  </ThemedText>
                  <ThemedText style={[styles.bankMeta, { color: C.muted }]}>
                    {BANK_ACCOUNT.bank} · {BANK_ACCOUNT.accountNumber}
                  </ThemedText>
                </View>
              </View>

              <View
                style={[
                  styles.radioCircle,
                  {
                    borderColor:
                      selectedBankId === BANK_ACCOUNT.id
                        ? C.primary
                        : C.border,
                  },
                ]}
              >
                {selectedBankId === BANK_ACCOUNT.id && (
                  <View style={[styles.radioInner, { backgroundColor: C.primary }]} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
            Fund Amount
          </ThemedText>
          <FormInput
            placeholder='Enter amount'
            keyboardType='number-pad'
            value={amount}
            onChangeText={setAmount}
            inputContainerStyle={styles.amountInputContainer}
            inputStyle={styles.amountInputText}
          />

          <View style={styles.presetRow}>
            {PRESET_AMOUNTS.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetBtn,
                  {
                    backgroundColor: amount === preset ? C.primary + "20" : C.inputBg,
                    borderColor: amount === preset ? C.primary : C.border,
                  },
                ]}
                onPress={() => setAmount(preset)}
              >
                <View style={styles.presetInner}>
                  <View style={[styles.presetDot, { backgroundColor: C.primary }]} />
                  <ThemedText
                    style={[
                      styles.presetText,
                      { color: amount === preset ? C.primary : C.text },
                    ]}
                  >
                    ₦ {preset}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BraneButton
          text={loading ? 'Processing...' : 'Fund Account'}
          onPress={handleFundAccount}
          loading={loading}
          disabled={!isFundEnabled}
          height={48}
          radius={8}
          fontSize={12}
        />
      </View>

      <SuccessModal
        visible={showSuccessModal}
        title='Transaction Successful'
        description={`You've successfully funded your account with ₦${formattedAmount}.`}
        actionText='Dismiss'
        onAction={() => {
          setShowSuccessModal(false);
          router.replace("/(tabs)");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 14,
  },
  methodContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  subHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  addedText: {
    fontSize: 10,
  },
  addNewWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addNewText: {
    fontSize: 10,
  },
  bankRow: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bankDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  initialsBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  bankName: {
    fontSize: 10,
    fontWeight: "500",
  },
  bankMeta: {
    fontSize: 8,
    marginTop: 2,
  },
  radioCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  amountInputContainer: {
    height: 36,
    borderRadius: 8,
    marginBottom: 10,
  },
  amountInputText: {
    fontSize: 12,
  },
  presetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  presetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  presetDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  presetText: {
    fontSize: 11,
    fontWeight: "400",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
});
