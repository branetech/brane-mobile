import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setAmount } from "@/redux/slice/fundCardSlice";
import { useAppState } from "@/redux/store";
import { priceFormatter } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

type EnterAmountProps = {
  onSubmit: (amount: number) => void;
  isLoading?: boolean;
};

export default function EnterAmount({
  onSubmit,
  isLoading = false,
}: EnterAmountProps) {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const reduxDispatch = useDispatch();
  const { amount } = useAppState("fundCardSlice");

  const handleChange = (value: string) => {
    const normalized = value.replace(/[^0-9.]/g, "");
    const nextAmount = Number(normalized);
    reduxDispatch(setAmount(Number.isFinite(nextAmount) ? nextAmount : 0));
  };

  const submitDisabled = isLoading || Number(amount) < 1;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle'>Enter Amount</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputBlock}>
            <ThemedText style={[styles.title, { color: C.text }]}>
              Enter amount
            </ThemedText>

            <FormInput
              placeholder='₦0.00'
              value={amount ? String(amount) : ""}
              onChangeText={handleChange}
              keyboardType='decimal-pad'
              inputContainerStyle={[
                styles.inputContainer,
                { backgroundColor: C.inputBg, borderColor: C.border },
              ]}
              inputStyle={[styles.input, { color: C.text }]}
              placeholderTextColor={C.muted}
              returnKeyType='done'
              onSubmitEditing={() => {
                if (!submitDisabled) onSubmit(Number(amount));
              }}
            />

            {!amount ? (
              <ThemedText style={[styles.helperText, { color: C.muted }]}>
                Tap ₦0.00 to enter amount
              </ThemedText>
            ) : (
              <ThemedText style={[styles.helperText, { color: C.muted }]}>
                Amount to fund{" "}
                <ThemedText type='defaultSemiBold' style={{ color: C.primary }}>
                  {priceFormatter(amount, 2)}
                </ThemedText>
              </ThemedText>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <BraneButton
            text='Proceed'
            onPress={() => onSubmit(Number(amount))}
            backgroundColor={submitDisabled ? C.border : C.primary}
            textColor={submitDisabled ? C.muted : "#D2F1E4"}
            height={52}
            radius={12}
            loading={isLoading}
            disabled={submitDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  content: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  inputBlock: {
    alignItems: "center",
    paddingTop: 12,
  },
  title: {
    fontSize: 16,
    marginBottom: 24,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 280,
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 12,
  },
  input: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
  },
  helperText: {
    marginTop: 14,
    fontSize: 13,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
});
