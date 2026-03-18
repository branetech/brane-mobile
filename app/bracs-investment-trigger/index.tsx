import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/colors";
import { ThemedText } from "@/components/themed-text";
import { Back } from "iconsax-react-native";
import { useDispatch, useSelector } from "react-redux";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { RootState } from "@/redux/store";
import SallyFirstModalContent from "@/components/modals/SallyFirstModalContent";
import SallySecondModalContent from "@/components/modals/SallySecondModalContent";

interface InvestmentOption {
  id: "sally" | "managed" | "diy";
  title: string;
  description: string;
}

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

export default function BracsInvestmentTriggerScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allocationType, setAllocationType] = useState<string | null>(null);

  // Fetch allocation data
  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        setIsLoading(true);
        const response = await BaseRequest.get(
          TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION
        );
        const type = response.data?.allocationType;
        setAllocationType(type);

        // Map allocation type to selected option
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

  const handleOptionToggle = useCallback((optionId: string) => {
    if (selectedOption === optionId) {
      setSelectedOption(null);
      setShowFirstModal(false);
      setShowSecondModal(false);
    } else {
      setSelectedOption(optionId);

      if (optionId === "sally") {
        setShowFirstModal(true);
      } else if (optionId === "managed") {
        router.push("/bracs-investment-trigger/managed-portfolio");
      } else if (optionId === "diy") {
        router.push("/bracs-investment-trigger/bracs-allocation");
      }
    }
  }, [selectedOption, router]);

  const handleSallyEnabled = useCallback(() => {
    setSelectedOption("sally");
    setShowFirstModal(false);
    setShowSecondModal(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowFirstModal(false);
    setShowSecondModal(false);
    setSelectedOption(null);
  }, []);

  const handleGoToSecondModal = useCallback(() => {
    setShowFirstModal(false);
    setShowSecondModal(true);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
        <ActivityIndicator color={C.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Back size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>
          Bracs Investment Trigger
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {INVESTMENT_OPTIONS.map((option) => (
          <InvestmentOptionCard
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onToggle={() => handleOptionToggle(option.id)}
            scheme={scheme}
            textColor={C.text}
            mutedColor={C.muted}
            primaryColor={C.primary}
            inputBgColor={C.inputBg}
            borderColor={C.border}
          />
        ))}
      </ScrollView>

      {/* Sally First Modal */}
      <Modal
        visible={showFirstModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: C.background }]}>
          <SallyFirstModalContent
            onClose={handleCloseModal}
            onOpenNext={handleGoToSecondModal}
            scheme={scheme}
          />
        </SafeAreaView>
      </Modal>

      {/* Sally Second Modal */}
      <Modal
        visible={showSecondModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: C.background }]}>
          <SallySecondModalContent
            onClose={handleCloseModal}
            onGoBack={handleGoToSecondModal}
            onSallyEnabled={handleSallyEnabled}
            scheme={scheme}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

interface CardProps {
  option: InvestmentOption;
  isSelected: boolean;
  onToggle: () => void;
  scheme: string;
  textColor: string;
  mutedColor: string;
  primaryColor: string;
  inputBgColor: string;
  borderColor: string;
}

function InvestmentOptionCard({
  option,
  isSelected,
  onToggle,
  scheme,
  textColor,
  mutedColor,
  primaryColor,
  inputBgColor,
  borderColor,
}: CardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        {
          backgroundColor: inputBgColor,
          borderColor: isSelected ? primaryColor : borderColor,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
      onPress={onToggle}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionTextContainer}>
          <ThemedText style={[styles.optionTitle, { color: textColor }]}>
            {option.title}
          </ThemedText>
          {option.id === "sally" && (
            <View style={[styles.badge, { backgroundColor: "#FFEFCC" }]}>
              <Text style={styles.badgeText}>Coming Soon</Text>
            </View>
          )}
        </View>
        <ThemedText style={[styles.optionDescription, { color: mutedColor }]}>
          {option.description}
        </ThemedText>
      </View>

      {/* Toggle Switch */}
      <View
        style={[
          styles.toggle,
          {
            backgroundColor: isSelected ? primaryColor : "#E7E6E8",
          },
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            {
              transform: [{ translateX: isSelected ? 20 : 0 }],
              backgroundColor: "#fff",
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  optionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  optionContent: {
    flex: 1,
    marginRight: 16,
  },
  optionTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#404040",
  },
  optionDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
  },
});
