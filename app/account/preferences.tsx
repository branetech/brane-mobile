import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePreference } from "@/services/data";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Switch, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PrefRow = ({
  title,
  value,
  onToggle,
  C,
}: {
  title: string;
  value: boolean;
  onToggle: () => void;
  C: (typeof Colors)["light"];
}) => {
  return (
    <View
      style={[styles.row, { borderBottomColor: C.border }]}
      row
      aligned
      spaced
    >
      <ThemedText style={[styles.rowText, { color: C.text }]}>
        {title}
      </ThemedText>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: C.border, true: C.primary }}
      />
    </View>
  );
};

export default function PreferencesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { showBalance, transactionSound, handlePreference } =
    usePreference(false);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle'>Preferences</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <PrefRow
          title='Show account balance'
          value={!!showBalance}
          onToggle={() => handlePreference({ showBalance: !showBalance })}
          C={C}
        />
        <PrefRow
          title='Transaction sound'
          value={!!transactionSound}
          onToggle={() =>
            handlePreference({ transactionSound: !transactionSound })
          }
          C={C}
        />

        <TouchableOpacity
          style={[styles.themeBtn, { borderColor: C.border }]}
          activeOpacity={0.85}
          onPress={() =>
            handlePreference({ theme: scheme === "dark" ? "light" : "dark" })
          }
        >
          <ThemedText style={[styles.themeLabel, { color: C.text }]}>
            Toggle app theme
          </ThemedText>
          <ThemedText style={[styles.themeValue, { color: C.tint }]}>
            {scheme === "dark" ? "Dark" : "Light"}
          </ThemedText>
        </TouchableOpacity>
      </View>
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
  content: { paddingHorizontal: 16, paddingTop: 16 },
  row: {
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  rowText: { fontSize: 14 },
  themeBtn: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  themeLabel: { marginBottom: 4 },
  themeValue: { fontWeight: "700" },
});
