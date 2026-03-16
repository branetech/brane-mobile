import {
  OptionRow,
  SallyConfigModal,
  SallyIntroModal,
} from "@/components/account/bracs-investment";
import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AllocationType = "ai-automated" | "managed" | "do-it-yourself" | "";

const resolveAllocationType = (payload: any): AllocationType => {
  const raw =
    payload?.allocationType ||
    payload?.data?.allocationType ||
    payload?.data?.data?.allocationType ||
    payload?.record?.allocationType ||
    "";

  const value = String(raw).trim().toLowerCase();
  if (value === "managed") return "managed";
  if (
    value === "ai-automated" ||
    value === "ai automated" ||
    value === "sally"
  ) {
    return "ai-automated";
  }
  if (
    value === "do-it-yourself" ||
    value === "do it yourself" ||
    value === "diy" ||
    value === "do_it_yourself"
  ) {
    return "do-it-yourself";
  }
  return "";
};

const options = [
  {
    title: "AI Investment Assistant (Sally)",
    description: "Turn on to automate your Bracs with AI recommendations.",
    value: "sally",
    route: undefined,
    activeRoute: undefined,
  },
  {
    title: "Managed Portfolio",
    description: "Let experts manage your Bracs allocation and growth.",
    value: "managed",
    route: "/account/bracs-investment-trigger/managed-portfolio",
    activeRoute:
      "/account/bracs-investment-trigger/managed-portfolio/about-managed-portfolio",
  },
  {
    title: "Do It Yourself (DIY)",
    description: "Set your own Bracs percentage allocation manually.",
    value: "diy",
    route: "/account/bracs-investment-trigger/bracs-allocation",
    activeRoute: undefined,
  },
] as const;

export default function BracsInvestmentTriggerScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [loading, setLoading] = useState(false);
  const [isSavingSally, setIsSavingSally] = useState(false);
  const [showSallyIntro, setShowSallyIntro] = useState(false);
  const [showSallyConfig, setShowSallyConfig] = useState(false);
  const [allocationType, setAllocationType] = useState<AllocationType>("");

  const selectedOption = useMemo(() => {
    if (allocationType === "managed") return "managed";
    if (allocationType === "do-it-yourself") return "diy";
    if (allocationType === "ai-automated") return "sally";
    return "";
  }, [allocationType]);

  const fetchAllocation = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await BaseRequest.get(
        TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION,
      );
      setAllocationType(resolveAllocationType(response));
    } catch (error) {
      catchError(error);
      setAllocationType("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllocation();
  }, [fetchAllocation]);

  useFocusEffect(
    useCallback(() => {
      fetchAllocation();
    }, [fetchAllocation]),
  );

  const canNavigate = useCallback(
    (value: string) => {
      if (value === "diy") return allocationType === "do-it-yourself";
      if (value === "managed") return allocationType === "managed";
      return true;
    },
    [allocationType],
  );

  const onOptionChange = useCallback(
    (value: string, route?: string) => {
      if (value === "sally") {
        setShowSallyIntro(true);
        return;
      }

      if ((value === "managed" || value === "diy") && route) {
        router.push(route as any);
      }
    },
    [router],
  );

  const onOptionPress = useCallback(
    (value: string, route?: string, activeRoute?: string) => {
      if (route && canNavigate(value)) {
        router.push((activeRoute || route) as any);
        return;
      }
      onOptionChange(value, route);
    },
    [canNavigate, onOptionChange, router],
  );

  const onSaveSally = useCallback(async () => {
    setIsSavingSally(true);
    try {
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        allocationType: "ai-automated",
      });
      setAllocationType("ai-automated");
      setShowSallyConfig(false);
      setShowSallyIntro(false);
      showSuccess("Bracs Allocation Settings Saved Successfully");
    } catch (error) {
      catchError(error);
    } finally {
      setIsSavingSally(false);
    }
  }, []);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.push("/(tabs)/(account)")} />
        <ThemedText type='subtitle' style={styles.title}>
          Bracs Investment Trigger
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={[styles.helpText, { color: C.muted }]}>
          Choose how your Bracs should be allocated into investments.
        </ThemedText>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size='small' color='#013D25' />
          </View>
        ) : (
          <View style={styles.card}>
            {options.map((option) => (
              <OptionRow
                key={option.value}
                title={option.title}
                description={option.description}
                isSelected={selectedOption === option.value}
                onPress={() =>
                  onOptionPress(option.value, option.route, option.activeRoute)
                }
                badgeText={option.value === "sally" ? "Coming Soon" : undefined}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <SallyIntroModal
        visible={showSallyIntro}
        onClose={() => setShowSallyIntro(false)}
        onGetStarted={() => {
          setShowSallyIntro(false);
          setShowSallyConfig(true);
        }}
      />

      <SallyConfigModal
        visible={showSallyConfig}
        onClose={() => setShowSallyConfig(false)}
        onBack={() => {
          setShowSallyConfig(false);
          setShowSallyIntro(true);
        }}
        isSaving={isSavingSally}
        onSaveAndActivate={onSaveSally}
      />
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
  title: { fontSize: 16 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 12,
  },
  helpText: {
    fontSize: 13,
    marginBottom: 4,
  },
  loaderWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#FFFAF0",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
});
