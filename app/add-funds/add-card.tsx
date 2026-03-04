import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Eye, EyeSlash, InfoCircle } from "iconsax-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

export default function AddCardScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const [showPin, setShowPin] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [validPeriod, setValidPeriod] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardPin, setCardPin] = useState("");

  const isFormValid =
    cardNumber.trim().length >= 4 &&
    validPeriod.trim().length > 0 &&
    cvv.trim().length > 0 &&
    cardPin.trim().length > 0;

  const handleAddCard = () => {
    if (cardNumber.length >= 4) {
      router.push({
        pathname: "/add-funds/card",
        params: { newCard: cardNumber.slice(-4) },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          Add New Card
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedText style={styles.bvnText}>
          Your bank card has to be linked to your BVN for security purpose
        </ThemedText>

        <View style={styles.form}>
          <FormInput
            labelText="Card Number"
            placeholder="Enter your card number"
            keyboardType="number-pad"
            value={cardNumber}
            onChangeText={setCardNumber}
            containerStyle={styles.inputGroup}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
          />

          <View style={styles.row}>
            <FormInput
              labelText="Valid Period"
              placeholder="MM/YY"
              keyboardType="number-pad"
              value={validPeriod}
              onChangeText={setValidPeriod}
              containerStyle={[styles.inputGroup, styles.flex]}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />
            <FormInput
              labelText="CVV"
              placeholder="Enter CVV"
              keyboardType="number-pad"
              value={cvv}
              onChangeText={setCvv}
              rightContent={<InfoCircle size={14} color="#8E8E93" />}
              containerStyle={[styles.inputGroup, styles.flex]}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />
          </View>

          <FormInput
            labelText="Card Pin"
            placeholder="xxxx"
            keyboardType="number-pad"
            value={cardPin}
            onChangeText={setCardPin}
            secureTextEntry={!showPin}
            rightContent={
              <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                {showPin ? (
                  <Eye size={14} color="#8E8E93" />
                ) : (
                  <EyeSlash size={14} color="#8E8E93" />
                )}
              </TouchableOpacity>
            }
            containerStyle={styles.inputGroup}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
          />
        </View>
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: C.border }]}>
        <BraneButton
          text="Add Card"
          onPress={() => {
            if (!isFormValid) return;
            handleAddCard();
          }}
          style={styles.addCardBtn}
          backgroundColor={isFormValid ? "#013D25" : "#C5E8D9"}
          textColor={isFormValid ? "#FFFFFF" : "#2A6D53"}
          disabled={false}
          height={48}
          radius={8}
          fontSize={11}
        />
      </View>
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
    paddingTop: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  bvnText: {
    fontSize: 10,
    color: "#8E8E93",
    marginBottom: 18,
  },
  form: {
    gap: 10,
  },
  inputGroup: {
    gap: 4,
  },
  inputContainer: {
    height: 36,
    borderRadius: 8,
    borderColor: "#F0F0F0",
  },
  inputText: {
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 38,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 0,
  },
  addCardBtn: {
    height: 40,
    borderRadius: 8,
    backgroundColor: "#013D25",
    justifyContent: "center",
    alignItems: "center",
  },
  addCardBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
