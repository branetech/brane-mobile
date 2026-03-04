import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { SuccessModal } from "@/components/success-modal";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
    setShowSuccessModal(true);
  };

  const formattedAmount = Number(amount || 0).toLocaleString("en-NG");

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          Fund Wallet With Card
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
          <View style={styles.methodContainer}>
            <View style={styles.subHeaderRow}>
              <ThemedText style={styles.addedCardsText}>Added Cards</ThemedText>
              {savedCards.length > 0 && (
                <TouchableOpacity
                  onPress={() => router.push("/add-funds/add-card")}
                >
                  <ThemedText style={styles.addNewText}>Add New</ThemedText>
                </TouchableOpacity>
              )}
            </View>

            {savedCards.length === 0 ? (
              <BraneButton
                style={styles.addNewCardBtn}
                backgroundColor="#C5E8D9"
                text="Add New Card"
                onPress={() => router.push("/add-funds/add-card")}
                leftIcon={<Add size={14} color="#013D25" />}
                textColor="#013D25"
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
                          selectedCard === card ? "#E4DDCC" : "#E8E8E8",
                        backgroundColor:
                          selectedCard === card ? "#F3F0E4" : "#FFFFFF",
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
                            selectedCard === card ? "#1E5B41" : "#D0D0D0",
                          backgroundColor: "#FFFFFF",
                        },
                      ]}
                    >
                      {selectedCard === card && (
                        <View style={styles.radioInner} />
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
            placeholder="Enter amount"
            keyboardType="number-pad"
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
                    backgroundColor: amount === preset ? "#F4F1E2" : "#FFFFFF",
                    borderColor: amount === preset ? "#E4DBC0" : "#ECECEC",
                  },
                ]}
                onPress={() => setAmount(preset)}
              >
                <View style={styles.presetInner}>
                  <View style={styles.presetDot} />
                  <ThemedText
                    style={[
                      styles.presetText,
                      { color: amount === preset ? "#013D25" : "#111111" },
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
            text="Fund Wallet"
            onPress={() => {
              if (!amount || !selectedCard) return;
              handleFund();
            }}
            backgroundColor={amount && selectedCard ? "#013D25" : "#C5E8D9"}
            textColor={amount && selectedCard ? "#FFFFFF" : "#2A6D53"}
            disabled={false}
            height={48}
            radius={8}
            fontSize={11}
          />
        </View>
      )}

      <SuccessModal
        visible={showSuccessModal}
        title="Transaction Successful"
        description={`You've successfully funded your account with ₦${formattedAmount}.`}
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
    borderColor: "#EDEDED",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  subHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  addedCardsText: {
    fontSize: 10,
    color: "#8E8E93",
  },
  addNewCardBtn: {
    height: 36,
    borderRadius: 8,
    borderWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#C5E8D9",
  },
  addNewCardText: {
    color: "#013D25",
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#EA2D2D",
  },
  brandYellow: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F3BD30",
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
    backgroundColor: "#013D25",
  },
  cardText: {
    fontSize: 11,
    fontWeight: "400",
  },
  addNewText: {
    fontSize: 10,
    color: "#013D25",
    fontWeight: "400",
  },
  amountInputContainer: {
    height: 36,
    borderRadius: 8,
    borderColor: "#F0F0F0",
    marginBottom: 10,
  },
  amountInputText: {
    fontSize: 12,
    color: "#0B0014",
  },
  amountInput: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
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
    backgroundColor: "#0B0014",
  },
  presetText: {
    fontSize: 11,
    fontWeight: "400",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 0,
  },
  fundBtn: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  fundBtnText: {
    color: "#fff",
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
    borderBottomColor: "#EAEAEA",
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
    color: "#8E8E93",
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
    backgroundColor: "#013D25",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  addCardBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
