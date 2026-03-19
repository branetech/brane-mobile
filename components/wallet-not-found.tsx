import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { CardRemove } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type WalletNotFoundProps = {
  message: string;
  title?: string;
  onCompleteKYC?: () => void;
};

export const WalletNotFound = ({
  message,
  title,
  onCompleteKYC,
}: WalletNotFoundProps) => {
  const raw = useColorScheme();
  const scheme = raw === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const buttonLabel =
    message === "Unable to create a tier 1 wallet at this time"
      ? ""
      : "Complete Your KYC";

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.card,
          { backgroundColor: C.inputBg, borderColor: C.border, borderWidth: 1 },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconWrap}>
          <CardRemove size={48} color={C.primary} variant='Broken' />
        </View>

        {/* Text */}
        <ThemedText style={[styles.title, { color: C.text }]}>
          {title || "Wallet Retrieval Error"}
        </ThemedText>
        <ThemedText style={[styles.message, { color: C.muted }]}>
          {message}
        </ThemedText>

        {/* CTA */}
        {!!buttonLabel && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: C.primary }]}
            onPress={onCompleteKYC}
            activeOpacity={0.85}
          >
            <ThemedText style={styles.btnLabel}>{buttonLabel}</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    width: "100%",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrap: {
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 4,
  },
  btn: {
    marginTop: 20,
    width: "100%",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
