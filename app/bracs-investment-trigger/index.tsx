import { ThemedText } from "@/components/themed-text";
import { BraneButton } from "@/components/brane-button";
import { Colors } from "@/constants/colors";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

interface BracsAllocation {
  stockAsset: number;
  goldAsset: number;
  fixedIncome: number;
  indexFund: number;
  allocationType?: "do-it-yourself" | "managed" | "ai-automated";
}

const BracsInvestmentTrigger = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allocation, setAllocation] = useState<BracsAllocation | null>(null);

  useEffect(() => {
    fetchAllocation();
  }, []);

  const fetchAllocation = async () => {
    try {
      setIsLoading(true);
      const response = await BaseRequest.get(
        TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION,
      );
      if (response.data) {
        setAllocation(response.data);
        const allocationType = response.data.allocationType;
        if (allocationType === "do-it-yourself") {
          setSelectedOption("diy");
        } else if (allocationType === "managed") {
          setSelectedOption("managed");
        } else if (allocationType === "ai-automated") {
          setSelectedOption("sally");
        }
      }
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionPress = (option: string) => {
    if (option === "diy") {
      router.push("/bracs-investment-trigger/bracs-allocation");
    } else if (option === "managed") {
      router.push("/bracs-investment-trigger/managed-portfolio");
    }
  };

  const options = [
    {
      value: "diy",
      title: "Do-It-Yourself",
      description: "Manually set your preferred asset allocation",
    },
    {
      value: "managed",
      title: "Managed Portfolio",
      description: "Let expert managers grow your wealth",
    },
    {
      value: "sally",
      title: "AI Automated Trading",
      description: "Enable AI-powered investment recommendations",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Bracs Investment Trigger</ThemedText>
          <ThemedText style={styles.subtitle}>
            Choose your investment strategy
          </ThemedText>
        </View>

        {isLoading ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size='large' color={C.primary} />
          </View>
        ) : (
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <BraneButton
                key={option.value}
                onPress={() => handleOptionPress(option.value)}
                style={
                  [
                    styles.optionCard,
                    {
                      backgroundColor: C.inputBg,
                      borderColor:
                        selectedOption === option.value ? C.primary : C.border,
                    },
                  ] as any
                }
              >
                <View style={styles.optionContent}>
                  <ThemedText style={styles.optionTitle}>
                    {option.title}
                  </ThemedText>
                  <ThemedText
                    style={[styles.optionDescription, { color: C.muted }]}
                  >
                    {option.description}
                  </ThemedText>
                  {selectedOption === option.value && (
                    <View
                      style={[styles.badge, { backgroundColor: C.primary }]}
                    >
                      <ThemedText style={styles.badgeText}>Active</ThemedText>
                    </View>
                  )}
                </View>
              </BraneButton>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionContent: {
    gap: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionDescription: {
    fontSize: 13,
  },
  badge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  centerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
});

export default BracsInvestmentTrigger;
