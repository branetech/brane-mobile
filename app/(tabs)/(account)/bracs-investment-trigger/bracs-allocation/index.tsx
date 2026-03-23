import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "iconsax-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BracsAllocationPage() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={18} color={C.text} />
        </Pressable>
        <ThemedText style={[styles.title, { color: C.text }]}>
          Bracs Allocation
        </ThemedText>
        <View style={styles.backSpacer} />
      </View>

      <View style={styles.content}>
        <ThemedText style={[styles.bodyText, { color: C.muted }]}>
          Bracs allocation setup is being migrated to native. I can build out
          the full allocation UI on this screen next.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  backSpacer: { width: 36 },
  title: { fontSize: 16, fontWeight: "700" },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  bodyText: { fontSize: 14, lineHeight: 22 },
});
