import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, View } from "react-native";

type Scheme = "light" | "dark";

const Financials = () => {
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: C.inputBg, borderColor: C.border },
      ]}
    >
      <ThemedText style={[styles.title, { color: C.text }]}>
        Financials
      </ThemedText>
      <ThemedText style={[styles.body, { color: C.muted }]}>
        Financial details are rendered from the company details screen.
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default Financials;
