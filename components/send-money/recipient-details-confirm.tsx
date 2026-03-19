import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { CheckCircle } from "iconsax-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

interface RecipientDetailsConfirmProps {
  name: string;
  accountNumber: string;
  bankName: string;
  verified: boolean;
}

export function RecipientDetailsConfirm({
  name,
  accountNumber,
  bankName,
  verified,
}: RecipientDetailsConfirmProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: C.inputBg,
          borderColor: verified ? C.primary : C.border,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: C.text }]}>
          Recipient Details
        </ThemedText>
        {verified && (
          <CheckCircle size={20} color={C.primary} variant="Bold" />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <ThemedText style={[styles.label, { color: C.muted }]}>
            Name
          </ThemedText>
          <ThemedText style={[styles.value, { color: C.text }]}>
            {name}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: C.border }]} />

        <View style={styles.detailRow}>
          <ThemedText style={[styles.label, { color: C.muted }]}>
            Account Number
          </ThemedText>
          <ThemedText style={[styles.value, { color: C.text }]}>
            {accountNumber}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: C.border }]} />

        <View style={styles.detailRow}>
          <ThemedText style={[styles.label, { color: C.muted }]}>
            Bank
          </ThemedText>
          <ThemedText style={[styles.value, { color: C.text }]}>
            {bankName}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailsContainer: {
    gap: 0,
  },
  detailRow: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
  },
});
