import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setAmount } from "@/redux/slice/fundCardSlice";
import { useDispatch } from "react-redux";
import { useAppState } from "@/redux/store";
import { priceFormatter } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";

type EnterAmountProps = {
  onSubmit: (amount: number) => void;
  isLoading?: boolean;
  portfolioBalance?: number;
  profitBalance?: number;
};

const EnterAmount = ({
  onSubmit,
  isLoading = false,
  portfolioBalance = 0,
  profitBalance = 0,
}: EnterAmountProps) => {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const reduxDispatch = useDispatch();
  const { amount } = useAppState("fundCardSlice");

  const onChange = (value: string) => {
    const normalized = value.replace(/[^0-9.]/g, "");
    const nextAmount = Number(normalized);
    reduxDispatch(setAmount(Number.isFinite(nextAmount) ? nextAmount : 0));
  };

  const submitDisabled = isLoading || Number(amount) < 1;

  return (
    <View style={[styles.screen, { backgroundColor: C.background }]}>
     
        <View style={styles.header}>
          <Back onPress={() => router.back()} />
          <ThemedText type='subtitle'>Enter Amount</ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.balanceCard,
              { backgroundColor: "#F8FCFA", borderColor: C.border },
            ]}
          >
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceLabel, { color: C.muted }]}>
                Portfolio Balance:
              </Text>
              <Text style={[styles.balanceValue, { color: C.text }]}>
                {priceFormatter(portfolioBalance, 2)}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceLabel, { color: C.muted }]}>
                Profit Balance:
              </Text>
              <Text style={[styles.balanceValue, { color: C.text }]}>
                {priceFormatter(profitBalance, 2)}
              </Text>
            </View>
          </View>

          <View style={styles.inputBlock}>
            <ThemedText style={[styles.title, { color: C.text }]}>
              Enter amount
            </ThemedText>

            <View style={{ width: "100%", alignItems: "center" }}>
              <FormInput
                placeholder='₦0.00'
                value={amount ? String(amount) : ""}
                onChangeText={onChange}
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
            </View>
            {!amount ? (
              <ThemedText style={[styles.helperText, { color: C.muted }]}>
                Tap ₦0.00 to enter amount
              </ThemedText>
            ) : (
              <ThemedText style={[styles.helperText, { color: C.muted }]}>
                Amount to fund{" "}
                <ThemedText  style={{ color: C.primary, fontSize: 12 }}>
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
            backgroundColor={submitDisabled ? '#AABEB6' : C.primary}
            textColor={submitDisabled ? C.muted : "#D2F1E4"}
            height={52}
            radius={12}
            loading={isLoading}
            disabled={submitDisabled}
            style={{marginBottom: 42}}
          />
        </View>
    </View>
  );
};

export default EnterAmount;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flex: 1 },
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
    paddingHorizontal: 16,
    paddingTop: 8,
    width: "100%",
  },
  balanceCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 40,
    height: 96,
    marginTop: 8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
  },
  balanceLabel: {
    fontSize: 13,
  },
  balanceValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  inputBlock: {
    alignItems: "center",
    paddingTop: 6,
    width: "100%",
  },
  title: {
    fontSize: 16,
    marginBottom: 18,
  },
  inputContainer: {
    width: "100%",
    // minHeight: 56,
    borderWidth: 1,
    borderRadius: 12,
  },
  input: {
    textAlign: "center",
    fontSize: 21,
    fontWeight: "600",
  },
  helperText: {
    marginTop: 12,
    fontSize: 12,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
});
