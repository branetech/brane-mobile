import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setTheme } from "@/redux/slice/themeSlice";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type ThemeOption = "light" | "dark" | "system";

interface ThemeChoice {
  value: ThemeOption;
  label: string;
  description: string;
}

const themeOptions: ThemeChoice[] = [
  {
    value: "system",
    label: "Automatic",
    description: "Use your system default setting",
  },
  {
    value: "dark",
    label: "Dark Mode",
    description: "Always use dark theme",
  },
  {
    value: "light",
    label: "Light Mode",
    description: "Always use light theme",
  },
];

export default function ThemesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const currentTheme = useSelector(
    (state: RootState) => state.themes.currentTheme,
  );

  const handleThemeChange = (newTheme: ThemeOption) => {
    dispatch(setTheme(newTheme));
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.title}>
          Themes
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {themeOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.themeOption,
              {
                backgroundColor: C.inputBg,
                borderColor:
                  currentTheme === option.value ? C.primary : C.border,
                borderWidth: currentTheme === option.value ? 2 : 1,
              },
            ]}
            onPress={() => handleThemeChange(option.value)}
          >
            <View style={styles.themeContent}>
              <View style={styles.themeTextWrapper}>
                <ThemedText
                  type='defaultSemiBold'
                  style={[styles.themeLabel, { color: C.text }]}
                >
                  {option.label}
                </ThemedText>
                <ThemedText
                  style={[styles.themeDescription, { color: C.muted }]}
                >
                  {option.description}
                </ThemedText>
              </View>

              {/* Radio Circle */}
              <View
                style={[
                  styles.radioCircle,
                  {
                    borderColor:
                      currentTheme === option.value ? C.primary : C.border,
                  },
                ]}
              >
                {currentTheme === option.value && (
                  <View
                    style={[styles.radioInner, { backgroundColor: C.primary }]}
                  />
                )}
              </View>
            </View>
          </Pressable>
        ))}
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
  themeOption: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  themeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  themeTextWrapper: {
    flex: 1,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
