import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setTheme } from "@/redux/slice/themeSlice";
import BaseRequest, { catchError } from "@/services";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Mobile, Moon, Sun1 } from "iconsax-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

type ThemeValue = "system" | "dark" | "light";

type ThemeOption = {
  value: ThemeValue;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const THEME_OPTIONS: Omit<ThemeOption, "icon">[] = [
  {
    value: "system",
    title: "Automatic",
    description: "Follows your device system setting",
  },
  {
    value: "dark",
    title: "Dark Mode",
    description: "Dark background, light text",
  },
  {
    value: "light",
    title: "Light Mode",
    description: "Light background, dark text",
  },
];

export default function ThemesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const currentTheme = useSelector((state: any) => state.themes.currentTheme);

  const getIcon = (value: ThemeValue, isSelected: boolean) => {
    const color = isSelected ? C.primary : C.muted;
    const props = { size: 22, color, variant: "Bold" as const };
    switch (value) {
      case "system":
        return <Mobile {...props} />;
      case "dark":
        return <Moon {...props} />;
      case "light":
        return <Sun1 {...props} />;
    }
  };

  const onSelect = async (value: ThemeValue) => {
    dispatch(setTheme(value));
    try {
      await BaseRequest.put("/auth-service/preference", {
        metadata: { theme: value },
      });
    } catch (error) {
      catchError(error);
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
        {THEME_OPTIONS.map(({ value, title, description }) => {
          const isSelected = currentTheme === value;
          return (
            <TouchableOpacity
              key={value}
              activeOpacity={0.7}
              style={[
                styles.option,
                {
                  borderColor: isSelected ? C.primary : C.border,
                  backgroundColor: C.background,
                },
              ]}
              onPress={() => onSelect(value)}
            >
              <View
                style={{
                  ...styles.iconWrap,
                  backgroundColor: isSelected ? C.primary + "20" : C.inputBg,
                }}
              >
                {getIcon(value, isSelected)}
              </View>

              <View style={styles.textWrap}>
                <ThemedText style={styles.optionTitle}>{title}</ThemedText>
                <ThemedText style={[styles.optionDesc, { color: C.muted }]}>
                  {description}
                </ThemedText>
              </View>

              <View
                style={{
                  ...styles.radioOuter,
                  borderColor: isSelected ? C.primary : C.muted,
                }}
              >
                {isSelected && (
                  <View
                    style={[styles.radioInner, { backgroundColor: C.primary }]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  optionDesc: {
    fontSize: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
