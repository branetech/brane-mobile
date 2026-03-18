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
import Back from "@/components/back";
import {
  SallyIntroModal,
  SallyConfigModal,
} from "@/components/account/bracs-investment";

type InvestmentOption = {
  id: "sally" | "managed" | "diy";
  title: string;
  description: string;
  badge?: string;
  hasToggle?: boolean;
  onPress?: () => void;
};

export default function BracsInvestmentTriggerScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const dynamicStyles = createDynamicStyles(C);

  const [sallyEnabled, setSallyEnabled] = useState(false);
  const [showSallyIntro, setShowSallyIntro] = useState(false);
  const [showSallyConfig, setShowSallyConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const options: InvestmentOption[] = [
    {
      id: "sally",
      title: "AI Investment Assistant (Sally)",
      description: "Turn on to automate your Bracs and let AI do the work",
      badge: "Coming Soon",
      hasToggle: true,
    },
    {
      id: "managed",
      title: "Managed Portfolio",
      description:
        "Let the experts handle allocation to set you on the path to wealth building",
      onPress: () => router.push("/(tabs)/(account)/bracs-investment-trigger/managed-portfolio"),
    },
    {
      id: "diy",
      title: "Do it yourself (DIY)",
      description:
        "Manually set up your allocation and investment choices at your pace",
      onPress: () => router.push("/(tabs)/(account)/bracs-investment-trigger/bracs-allocation"),
    },
  ];

  const handleSallyToggle = (value: boolean) => {
    setSallyEnabled(value);
    if (value) {
      setShowSallyIntro(true);
    }
  };

  const handleSallyGetStarted = () => {
    setShowSallyIntro(false);
    setShowSallyConfig(true);
  };

  const handleSaveAndActivate = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowSallyConfig(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.title}>
          Bracs Investment Trigger
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {options.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.card,
              {
                backgroundColor: C.inputBg,
                borderColor: C.border,
              },
            ]}
            onPress={option.onPress}
            disabled={option.hasToggle}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <ThemedText
                    type='defaultSemiBold'
                    style={[styles.cardTitle, { color: C.text }]}
                  >
                    {option.title}
                  </ThemedText>
                  {option.badge && (
                    <View style={[dynamicStyles.badge]}>
                      <ThemedText style={dynamicStyles.badgeText}>
                        {option.badge}
                      </ThemedText>
                    </View>
                  )}
                </View>

                {option.hasToggle ? (
                  <Switch
                    value={sallyEnabled}
                    onValueChange={handleSallyToggle}
                    trackColor={{ false: C.border, true: C.primary + "40" }}
                    thumbColor={sallyEnabled ? C.primary : C.muted}
                  />
                ) : (
                  <ThemedText style={[{ fontSize: 20, color: C.muted }]}>
                    ›
                  </ThemedText>
                )}
              </View>

              <ThemedText
                style={[styles.cardDescription, { color: C.muted }]}
              >
                {option.description}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <SallyIntroModal
        visible={showSallyIntro}
        onClose={() => {
          setShowSallyIntro(false);
          setSallyEnabled(false);
        }}
        onGetStarted={handleSallyGetStarted}
      />

      <SallyConfigModal
        visible={showSallyConfig}
        isSaving={isSaving}
        onClose={() => {
          setShowSallyConfig(false);
          setSallyEnabled(false);
        }}
        onBack={() => {
          setShowSallyConfig(false);
          setShowSallyIntro(true);
        }}
        onSaveAndActivate={handleSaveAndActivate}
      />
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
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardContent: {
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
});

const createDynamicStyles = (C: typeof Colors.light) =>
  StyleSheet.create({
    badge: {
      backgroundColor: C.inputBg,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: C.border,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: "600",
      color: C.primary,
    },
  });
