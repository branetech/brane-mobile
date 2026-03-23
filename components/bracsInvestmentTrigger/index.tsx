import SallyFirstModalContent from "@/components/modals/SallyFirstModalContent";
import SallySecondModalContent from "@/components/modals/SallySecondModalContent";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRouter } from "expo-router";
import { Back } from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type InvestmentOption = {
  id: "sally" | "managed" | "diy";
  title: string;
  description: string;
};

const INVESTMENT_OPTIONS: InvestmentOption[] = [
  {
    id: "sally",
    title: "AI Investment Assistant (Sally)",
    description:
      "Turn on to automate your bracs. Sit back and let your expert AI buddy do the work",
  },
  {
    id: "managed",
    title: "Managed Portfolio",
    description:
      "Skip the indecisive. Let the expert handle it all from allocation to wealth building",
  },
  {
    id: "diy",
    title: "Do It Yourself (DIY)",
    description: "Manually set up your bracs allocation and investment.",
  },
];

export default function BracsInvestmentComponent() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        setIsLoading(true);
        const response: any = await BaseRequest.get(
          TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION,
        );
        const type = response?.data?.allocationType || response?.allocationType;

        switch (type) {
          case "do-it-yourself":
            setSelectedOption("diy");
            break;
          case "managed":
            setSelectedOption("managed");
            break;
          case "ai-automated":
            setSelectedOption("sally");
            break;
          default:
            setSelectedOption(null);
        }
      } catch (err) {
        catchError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllocation();
  }, []);

  const handleOptionToggle = useCallback(
    (optionId: string) => {
      if (selectedOption === optionId) {
        setSelectedOption(null);
        setShowFirstModal(false);
        setShowSecondModal(false);
        return;
      }

      setSelectedOption(optionId);
      if (optionId === "sally") {
        setShowFirstModal(true);
      } else if (optionId === "managed") {
        router.push("/bracs-investment-trigger/managed-portfolio");
      } else if (optionId === "diy") {
        router.push("/bracs-investment-trigger/bracs-allocation");
      }
    },
    [router, selectedOption],
  );

  const handleCloseModal = useCallback(() => {
    setShowFirstModal(false);
    setShowSecondModal(false);
    setSelectedOption(null);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: C.background }]}
      >
        <ActivityIndicator color={C.primary} size='large' />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Back size={24} color='#fff' />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>
          Bracs Investment Trigger
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {INVESTMENT_OPTIONS.map((option) => {
          const isSelected = selectedOption === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor: C.inputBg,
                  borderColor: isSelected ? C.primary : C.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => handleOptionToggle(option.id)}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.optionTitle, { color: C.text }]}>
                {option.title}
              </ThemedText>
              <ThemedText
                style={[styles.optionDescription, { color: C.muted }]}
              >
                {option.description}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal
        visible={showFirstModal}
        transparent
        animationType='slide'
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView
          style={[styles.modalContainer, { backgroundColor: C.background }]}
        >
          <SallyFirstModalContent
            onClose={handleCloseModal}
            onOpenNext={() => {
              setShowFirstModal(false);
              setShowSecondModal(true);
            }}
            scheme={scheme || "light"}
          />
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showSecondModal}
        transparent
        animationType='slide'
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView
          style={[styles.modalContainer, { backgroundColor: C.background }]}
        >
          <SallySecondModalContent
            onClose={handleCloseModal}
            onGoBack={() => {
              setShowSecondModal(false);
              setShowFirstModal(true);
            }}
            onSallyEnabled={() => {
              setSelectedOption("sally");
              setShowSecondModal(false);
            }}
            scheme={scheme || "light"}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { width: 24, alignItems: "flex-start" },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 12,
  },
  optionCard: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  modalContainer: { flex: 1 },
});
