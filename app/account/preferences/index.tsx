import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setTheme } from "@/redux/slice/themeSlice";
import { RootState } from "@/redux/store";
import BaseRequest, { catchError } from "@/services";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Moon, Sun1 } from "iconsax-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, View as RNView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { usePreference } from "@/services/data";

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

export default function ThemesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [isSaving, setIsSaving] = useState(false);

  const currentTheme = useSelector(
    (state: RootState) => state.themes.currentTheme,
  );
  const isDarkMode = currentTheme === "dark";
  const { showBalance, transactionSound, handlePreference } = usePreference(false);

  const handleThemeToggle = async (value: boolean) => {
    const theme = value ? "dark" : "light";
    setIsSaving(true);
    try {
      dispatch(setTheme(theme));
      await BaseRequest.put("/auth-service/preference", {
        metadata: { theme },
      });
    } catch (error) {
      catchError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.headerTitle}>
          Theme
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Dark Mode Toggle */}
        <RNView
          style={[
            styles.toggleContainer,
            { borderColor: C.border, backgroundColor: C.inputBg },
          ]}
        >
          <View style={styles.toggleLeft}>
            <RNView
              style={[
                styles.iconCircle,
                {
                  backgroundColor: isDarkMode ? C.primary + "20" : C.inputBg,
                },
              ]}
            >
              <Moon
                size={20}
                color={isDarkMode ? C.primary : C.muted}
                variant='Bold'
              />
            </RNView>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.toggleTitle}>Dark Mode</ThemedText>
              <ThemedText style={[styles.toggleDesc, { color: C.muted }]}>
                Dark background, light text
              </ThemedText>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            disabled={isSaving}
            trackColor={{ false: C.border, true: C.primary + "40" }}
            thumbColor={isDarkMode ? C.primary : C.muted}
          />
        </RNView>

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
      </View>       
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 12,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  toggleLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  toggleDesc: {
    fontSize: 12,
    marginTop: 3,
  },
   row: {
    borderBottomWidth: 1,
    paddingVertical: 14,
  },

  rowText: {
    fontSize: 14,
  },
  themeBtn: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  themeLabel: { marginBottom: 4 },
  themeValue: { fontWeight: "700" },
});
