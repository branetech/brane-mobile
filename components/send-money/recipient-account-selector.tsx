import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Arrow } from "iconsax-react-native";
import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface RecipientAccountSelectorProps {
  accountNumber: string;
  bankName: string;
  onAccountChange: (value: string) => void;
  onBankChange: (value: string) => void;
  onBankPress?: () => void;
  accountError?: string;
  bankError?: string;
  loading?: boolean;
  verified?: boolean;
  recipientName?: string;
}

export function RecipientAccountSelector({
  accountNumber,
  bankName,
  onAccountChange,
  onBankChange,
  onBankPress,
  accountError,
  bankError,
  loading = false,
  verified = false,
  recipientName,
}: RecipientAccountSelectorProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View>
      <FormInput
        placeholder='0127277063'
        keyboardType='number-pad'
        value={accountNumber}
        labelText='Recipient Account'
        labelStyle={[styles.label, { color: C.muted }]}
        onChangeText={onAccountChange}
        error={accountError}
        editable={!loading}
        inputContainerStyle={[
          // styles.inputContainer,
          { backgroundColor: C.inputBg },
        ]}
        inputStyle={{ color: C.text }}
      />

      <ThemedText style={[styles.label, { color: C.muted, marginTop: 10 }]}>
        Bank
      </ThemedText>
      <TouchableOpacity
        onPress={onBankPress}
        disabled={loading}
        style={[
          styles.inputContainer,
          {
            backgroundColor: C.inputBg,
            borderColor: C.border,
            marginBottom: 16,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            style={[styles.bankText, { color: bankName ? C.text : C.muted }]}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {bankName || "Bank - autofill or select manually"}
          </ThemedText>
          <Arrow />
        </View>
        {loading && <ActivityIndicator color={C.primary} size='small' />}
      </TouchableOpacity>
      {bankError && (
        <ThemedText style={[styles.error, { color: "#DC2626" }]}>
          {bankError}
        </ThemedText>
      )}
      {verified && (
        <FormInput
          placeholder='0127277063'
          keyboardType='number-pad'
          value={recipientName || ""}
          labelText='Account Name'
          labelStyle={[styles.label, { color: C.muted }]}
          inputContainerStyle={[
            // styles.inputContainer,
            { backgroundColor: C.inputBg },
          ]}
          inputStyle={{ color: C.text }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 14,
    // borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginBottom: 8,
  },
  bankText: {
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  verificationCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginTop: 16,
  },
  verificationLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  verificationName: {
    fontSize: 16,
    fontWeight: "600",
  },
});
