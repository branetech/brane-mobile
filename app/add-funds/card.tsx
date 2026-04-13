import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { Header } from "@/components/header";
import { SuccessModal } from "@/components/success-modal";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Add } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

const PRESET_AMOUNTS = ["200", "500", "750", "1000"];

export default function CardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [amount, setAmount] = useState("");
  const [savedCards, setSavedCards] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showPinValidator, setShowPinValidator] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (params.newCard) {
      const newCard = params.newCard as string;
      if (!savedCards.includes(newCard)) {
        setSavedCards((prev) => [...prev, newCard]);
      }
      setSelectedCard(newCard);
    }
  }, [params.newCard, savedCards]);

  const handleFund = () => {
    setShowPinValidator(true);
  };

  const handlePinValidated = () => {
    setShowSuccessModal(true);
  };

  const formattedAmount = Number(amount || 0).toLocaleString("en-NG");

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <Header title='Fund Wallet With Card' />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
            Fund Method
          </ThemedText>
          <View
            style={[
              styles.methodContainer,
              { borderColor: C.border, backgroundColor: C.screen },
            ]}
          >
            <View style={styles.subHeaderRow}>
              <ThemedText style={[styles.addedCardsText, { color: C.muted }]}>
                Added Cards
              </ThemedText>
              {savedCards.length > 0 && (
                <TouchableOpacity
                  onPress={() => router.push("/add-funds/add-card")}
                >
                  <ThemedText style={[styles.addNewText, { color: C.primary }]}>
                    Add New
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            {savedCards.length === 0 ? (
              <BraneButton
                style={styles.addNewCardBtn}
                backgroundColor={C.googleBg}
                text='Add New Card'
                onPress={() => router.push("/add-funds/add-card")}
                leftIcon={<Add size={14} color={C.primary} />}
                textColor={C.primary}
                fontSize={12}
                radius={8}
                height={36}
              />
            ) : (
              <View>
                {savedCards.map((card) => (
                  <TouchableOpacity
                    key={card}
                    style={[
                      styles.cardRow,
                      {
                        borderColor:
                          selectedCard === card ? C.primary : C.border,
                        backgroundColor:
                          selectedCard === card ? C.inputBg : C.screen,
                      },
                    ]}
                    onPress={() => setSelectedCard(card)}
                  >
                    <View style={styles.cardDetails}>
                      <View style={styles.brandIcon}>
                        <View style={styles.brandRed} />
                        <View style={styles.brandYellow} />
                      </View>
                      <ThemedText style={[styles.cardText, { color: C.text }]}>
                        Card •••• {card}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        {
                          borderColor:
                            selectedCard === card ? C.primary : C.muted,
                          backgroundColor: C.screen,
                        },
                      ]}
                    >
                      {selectedCard === card && (
                        <View
                          style={[
                            styles.radioInner,
                            { backgroundColor: C.primary },
                          ]}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
            inputContainerStyle={[
              styles.amountInputContainer,
              { borderColor: C.border },
            ]}
            inputStyle={[
              styles.amountInputText,
              { color: C.text, backgroundColor: C.inputBg },
            ]}
          />
          <View style={styles.presetRow}>
            {PRESET_AMOUNTS.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetBtn,
                  {
                    backgroundColor: amount === preset ? C.inputBg : C.screen,
                    borderColor: amount === preset ? C.primary : C.border,
                  },
                ]}
                onPress={() => setAmount(preset)}
              >
                <View style={styles.presetInner}>
                  <View
                    style={[
                      styles.presetDot,
                      {
                        backgroundColor: amount === preset ? C.primary : C.text,
                      },
                    ]}
                  />
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

      {savedCards.length > 0 && (
        <View style={[styles.footer, { borderTopColor: C.border }]}>
          <BraneButton
            text='Fund Wallet'
            onPress={() => {
              if (!amount || !selectedCard) return;
              handleFund();
            }}
            backgroundColor={amount && selectedCard ? C.primary : C.googleBg}
            textColor={amount && selectedCard ? C.background : C.primary}
            disabled={false}
            height={48}
            radius={8}
            fontSize={11}
          />
        </View>
      )}

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

      <TransactionPinValidator
        visible={showPinValidator}
        onClose={() => setShowPinValidator(false)}
        onValidatePin={async (pin) => {
          try {
            await BaseRequest.post(AUTH_SERVICE.PIN_VALIDATION, {
              transactionPin: String(pin),
            });
            return true;
          } catch (error) {
            catchError(error);
            return false;
          }
        }}
        onTransactionPinValidated={handlePinValidated}
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
  addedCardsText: {
    fontSize: 10,
  },
  addNewCardBtn: {
    height: 36,
    borderRadius: 8,
    borderWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addNewCardText: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  cardDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    flexDirection: "row",
    alignItems: "center",
    width: 18,
    height: 12,
  },
  brandRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.mastercardRed,
  },
  brandYellow: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.visaAmber,
    marginLeft: -3,
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
  cardText: {
    fontSize: 11,
    fontWeight: "400",
  },
  addNewText: {
    fontSize: 10,
    fontWeight: "400",
  },
  amountInputContainer: {
    height: 36,
    borderRadius: 8,
    marginBottom: 10,
  },
  amountInputText: {
    fontSize: 12,
  },
  amountInput: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
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
    borderTopWidth: 1,
  },
  fundBtn: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  fundBtnText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal Styles
  modalSafe: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalScroll: {
    padding: 20,
  },
  bvnText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  flex: {
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  addCardBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  addCardBtnText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
