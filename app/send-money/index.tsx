import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

type Scheme = "light" | "dark";

const sendMoneySchema = z.object({
  accountNumber: z
    .string()
    .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  bankName: z.string().min(2, "Bank name is required"),
  recipientName: z.string().min(3, "Recipient name is required"),
});

type SendMoneyForm = z.infer<typeof sendMoneySchema>;
type FormErrors = Partial<Record<keyof SendMoneyForm, string>>;

const initialValues: SendMoneyForm = {
  accountNumber: "",
  bankName: "",
  recipientName: "",
};

export default function SendMoneyScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [formValues, setFormValues] = useState<SendMoneyForm>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [addToBeneficiaries, setAddToBeneficiaries] = useState(false);

  const validateForm = (values: SendMoneyForm) => {
    const result = sendMoneySchema.safeParse(values);

    if (result.success) {
      return {} as FormErrors;
    }

    const fieldErrors: FormErrors = {};
    const flattened = result.error.flatten().fieldErrors;

    (Object.keys(values) as (keyof SendMoneyForm)[]).forEach((key) => {
      const message = flattened[key]?.[0];
      if (message) fieldErrors[key] = message;
    });

    return fieldErrors;
  };

  const handleChange = (field: keyof SendMoneyForm, value: string) => {
    if (field === "accountNumber") {
      const nextAccount = value.replace(/\D/g, "").slice(0, 10);
      setFormValues((prev) => ({
        ...prev,
        accountNumber: nextAccount,
        recipientName: nextAccount.length === 10 ? "Oluwatosin Solomon" : "",
      }));
      setErrors((prev) => ({
        ...prev,
        accountNumber: undefined,
        recipientName: undefined,
      }));
      return;
    }

    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNext = () => {
    const nextErrors = validateForm(formValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    router.push({
      pathname: "/send-money/set-amount",
      params: {
        accountNumber: formValues.accountNumber,
        bankName: formValues.bankName,
        recipientName: formValues.recipientName,
        addToBeneficiaries: addToBeneficiaries ? "true" : "false",
      },
    });
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
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
          <ThemedText style={styles.helperText}>Recipient Account</ThemedText>

          <View style={styles.form}>
            <FormInput
              placeholder="0127277063"
              keyboardType="number-pad"
              value={formValues.accountNumber}
              onChangeText={(value) => handleChange("accountNumber", value)}
              error={errors.accountNumber}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />

            <ThemedText style={styles.helperText}>Bank</ThemedText>
            <FormInput
              placeholder="Guaranty Trust Bank"
              value={formValues.bankName}
              onChangeText={(value) => handleChange("bankName", value)}
              error={errors.bankName}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />

            <ThemedText style={styles.helperText}>Recipient Name</ThemedText>
            <FormInput
              placeholder="Oluwatosin Solomon"
              value={formValues.recipientName}
              onChangeText={(value) => handleChange("recipientName", value)}
              error={errors.recipientName}
              disabled
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <BraneButton
            text="Next"
            onPress={handleNext}
            backgroundColor="#013D25"
            textColor="#D2F1E4"
            height={48}
            radius={8}
            fontSize={11}
          />

          <View style={styles.beneficiaryRow}>
            <ThemedText style={styles.beneficiaryText}>
              Add to beneficiaries
            </ThemedText>
            <Switch
              value={addToBeneficiaries}
              onValueChange={setAddToBeneficiaries}
              trackColor={{ false: "#E6E6E8", true: "#D2F1E4" }}
              thumbColor={addToBeneficiaries ? "#013D25" : "#B9B9BD"}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
  },
  helperText: {
    fontSize: 10,
    color: "#8E8E93",
    marginBottom: 6,
    marginTop: 10,
  },
  form: {
    gap: 2,
  },
  inputContainer: {
    height: 40,
    borderRadius: 8,
    borderColor: "#F0F0F0",
  },
  inputText: {
    fontSize: 11,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 14,
  },
  beneficiaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  beneficiaryText: {
    fontSize: 10,
    color: "#6F6F74",
  },
});
