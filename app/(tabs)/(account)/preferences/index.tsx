import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PreferencesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [transactionSound, setTransactionSound] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.title}>
          Preferences
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Transaction Sound */}
        <Pressable
          style={[
            styles.preferenceRow,
            { borderBottomColor: C.border },
          ]}
        >
          <View style={styles.preferenceLeft}>
            <ThemedText style={[styles.preferenceLabel, { color: C.text }]}>
              Transaction sound
            </ThemedText>
          </View>
          <Switch
            value={transactionSound}
            onValueChange={setTransactionSound}
            trackColor={{ false: C.border, true: C.primary + "40" }}
            thumbColor={transactionSound ? C.primary : C.muted}
          />
        </Pressable>

        {/* Theme Selection */}
        <Pressable
          style={[
            styles.preferenceRow,
            { borderBottomColor: C.border },
          ]}
          onPress={() => router.push("/(tabs)/(account)/preferences/themes")}
        >
          <View style={styles.preferenceLeft}>
            <ThemedText style={[styles.preferenceLabel, { color: C.text }]}>
              Theme
            </ThemedText>
          </View>
          <ThemedText style={[{ fontSize: 20, color: C.muted }]}>
            ›
          </ThemedText>
        </Pressable>

        {/* Show Balance */}
        <Pressable
          style={[
            styles.preferenceRow,
            { borderBottomColor: C.border },
          ]}
        >
          <View style={styles.preferenceLeft}>
            <ThemedText style={[styles.preferenceLabel, { color: C.text }]}>
              Show balance
            </ThemedText>
          </View>
          <Switch
            value={showBalance}
            onValueChange={setShowBalance}
            trackColor={{ false: C.border, true: C.primary + "40" }}
            thumbColor={showBalance ? C.primary : C.muted}
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: { fontSize: 16, fontWeight: "600" },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  preferenceLeft: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
