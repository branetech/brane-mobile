import { Header } from "@/components/header";
import ContactComponent from "@/components/help-desk/contact";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <Header title='Contact us' />
      <ContactComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
