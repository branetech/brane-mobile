import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput, mapFormikProps } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFormHandler } from "@/hooks/use-formik";
import BaseRequest, { parseNetworkError } from "@/services";
import { showError, showSuccess } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { Eye, EyeSlash, InfoCircle } from "iconsax-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

type Scheme = "light" | "dark";

export default function AddCardScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { form, isDisabled } = useFormHandler({
    initialValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardPin: "",
      cardholder: "",
    },
    validationSchema: yup.object().shape({
      cardNumber: yup
        .string()
        .matches(/^\d{13,19}$/, "Card number must be 13-19 digits")
        .required("Card number is required"),
      expiryDate: yup
        .string()
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/YY")
        .required("Expiry date is required"),
      cvv: yup
        .string()
        .matches(/^\d{3,4}$/, "CVV must be 3-4 digits")
        .required("CVV is required"),
      cardholder: yup
        .string()
        .min(3, "Cardholder name is required")
        .required("Cardholder name is required"),
      cardPin: yup
        .string()
        .matches(/^\d{4,6}$/, "Card PIN must be 4-6 digits")
        .required("Card PIN is required"),
    }),
    onSubmit: async (data) => {
      setIsLoading(true);
      try {
        // Call API to save card
        await BaseRequest.post("/payment/add-card", {
          cardNumber: data.cardNumber,
          expiryDate: data.expiryDate,
          cvv: data.cvv,
          cardholder: data.cardholder,
          cardPin: data.cardPin,
        });

        showSuccess("Card added successfully");
        router.push("/saved-cards");
      } catch (error: any) {
        const { message } = parseNetworkError(error);
        showError(message || "Failed to add card");
      } finally {
        setIsLoading(false);
      }
    },
  });

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
        <ThemedText style={[styles.bvnText, { color: C.muted }]}>
          Your bank card has to be linked to your BVN for security purpose
        </ThemedText>

        <View style={styles.form}>
          <FormInput
            labelText='Cardholder Name'
            placeholder='Enter name as shown on card'
            {...mapFormikProps("cardholder", form)}
            containerStyle={styles.inputGroup}
            inputContainerStyle={[styles.inputContainer, { borderColor: C.border }]}
            inputStyle={[styles.inputText, { color: C.text }]}
          />

          <FormInput
            labelText='Card Number'
            placeholder='Enter your card number'
            keyboardType='number-pad'
            {...mapFormikProps("cardNumber", form)}
            containerStyle={styles.inputGroup}
            inputContainerStyle={[styles.inputContainer, { borderColor: C.border }]}
            inputStyle={[styles.inputText, { color: C.text }]}
          />

          <View style={styles.row}>
            <FormInput
              labelText='Expiry Date'
              placeholder='MM/YY'
              keyboardType='number-pad'
              {...mapFormikProps("expiryDate", form)}
              containerStyle={[styles.inputGroup, styles.flex]}
              inputContainerStyle={[styles.inputContainer, { borderColor: C.border }]}
              inputStyle={[styles.inputText, { color: C.text }]}
            />
            <FormInput
              labelText='CVV'
              placeholder='Enter CVV'
              keyboardType='number-pad'
              rightContent={<InfoCircle size={14} color={C.muted} />}
              {...mapFormikProps("cvv", form)}
              containerStyle={[styles.inputGroup, styles.flex]}
              inputContainerStyle={[styles.inputContainer, { borderColor: C.border }]}
              inputStyle={[styles.inputText, { color: C.text }]}
            />
          </View>

          <FormInput
            labelText='Card PIN'
            placeholder='xxxx'
            keyboardType='number-pad'
            secureTextEntry={!showPin}
            rightContent={
              <TouchableOpacity onPress={() => setShowPin(!showPin)}>
                {showPin ? (
                  <EyeSlash size={14} color={C.muted} />
                ) : (
                  <Eye size={14} color={C.muted} />
                )}
              </TouchableOpacity>
            }
            {...mapFormikProps("cardPin", form)}
            containerStyle={styles.inputGroup}
            inputContainerStyle={[styles.inputContainer, { borderColor: C.border }]}
            inputStyle={[styles.inputText, { color: C.text }]}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: C.border }]}>
        <BraneButton
          text={isLoading ? "Adding Card..." : "Add Card"}
          onPress={() => form.handleSubmit()}
          disabled={isDisabled || isLoading}
          loading={isLoading}
          backgroundColor={C.primary}
          textColor={C.googleBg}
          height={48}
          radius={8}
          fontSize={14}
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
