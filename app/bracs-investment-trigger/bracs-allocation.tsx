import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRouter } from "expo-router";
import { TickCircle } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
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
}

const BracsAllocationScreen = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  const [stockAssets, setStockAssets] = useState(25);
  const [goldAssets, setGoldAssets] = useState(25);
  const [fixedIncome, setFixedIncome] = useState(25);
  const [indexFunds, setIndexFunds] = useState(25);
  const [isAiTradesEnabled, setIsAiTradesEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchAllocation();
  }, []);

  const fetchAllocation = async () => {
    try {
      setIsLoadingData(true);
      const response = await BaseRequest.get(
        TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION,
      );
      if (response.data) {
        setStockAssets(response.data.stockAsset || 25);
        setGoldAssets(response.data.goldAsset || 25);
        setFixedIncome(response.data.fixedIncome || 25);
        setIndexFunds(response.data.indexFund || 25);
      }
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const total = stockAssets + goldAssets + fixedIncome + indexFunds;
  const isValid = total === 100;

  const handleSave = async () => {
    if (!isValid) return;

    try {
      setIsLoading(true);
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        stockAsset: stockAssets,
        goldAsset: goldAssets,
        fixedIncome,
        indexFund: indexFunds,
        allocationType: "do-it-yourself",
      });
      setShowSuccessModal(true);
    } catch (err) {
      catchError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetChange = (value: string, setter: (val: number) => void) => {
    const num = parseInt(value) || 0;
    if (num >= 0 && num <= 100) {
      setter(num);
    }
  };

  const AssetRow = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (val: string) => void;
  }) => (
    <View style={styles.assetRow}>
      <ThemedText style={styles.assetLabel}>{label}</ThemedText>
      <View
        style={[
          styles.assetInputContainer,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
      >
        <FormInput
          placeholder='0-100'
          placeholderTextColor={C.muted}
          value={value.toString()}
          onChangeText={onChange}
          keyboardType='number-pad'
          style={styles.assetInput}
          maxLength={3}
        />
        <ThemedText style={styles.percentSign}>%</ThemedText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Bracs Allocation</ThemedText>
          <ThemedText style={[styles.subtitle, { color: C.muted }]}>
            Set your preferred distribution across available assets
          </ThemedText>
        </View>

        {isLoadingData ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size='large' color={C.primary} />
          </View>
        ) : (
          <>
            {/* Asset Allocation Inputs */}
            <View style={styles.allocationSection}>
              <AssetRow
                label='Stock Assets'
                value={stockAssets}
                onChange={(val) => handleAssetChange(val, setStockAssets)}
              />
              <AssetRow
                label='Gold Assets'
                value={goldAssets}
                onChange={(val) => handleAssetChange(val, setGoldAssets)}
              />
              <AssetRow
                label='Fixed Income'
                value={fixedIncome}
                onChange={(val) => handleAssetChange(val, setFixedIncome)}
              />
              <AssetRow
                label='Index Funds'
                value={indexFunds}
                onChange={(val) => handleAssetChange(val, setIndexFunds)}
              />
            </View>

            {/* Total Indicator */}
            <View
              style={[
                styles.totalCard,
                {
                  backgroundColor: isValid ? `${C.primary}15` : `${C.error}15`,
                  borderColor: isValid ? C.primary : C.error,
                },
              ]}
            >
              <ThemedText style={styles.totalLabel}>Total Allocated</ThemedText>
              <ThemedText
                style={[
                  styles.totalValue,
                  { color: isValid ? C.primary : C.error },
                ]}
              >
                {total}%
              </ThemedText>
              {!isValid && (
                <ThemedText style={[styles.totalHint, { color: C.error }]}>
                  Must equal 100%
                </ThemedText>
              )}
            </View>

            {/* AI Trades Toggle */}
            <View
              style={[
                styles.toggleCard,
                { backgroundColor: C.inputBg, borderColor: C.border },
              ]}
            >
              <View>
                <ThemedText style={styles.toggleTitle}>
                  AI Recommended Trades
                </ThemedText>
                <ThemedText
                  style={[styles.toggleDescription, { color: C.muted }]}
                >
                  Enable or disable AI recommendations
                </ThemedText>
              </View>
              <Pressable
                style={[
                  styles.toggleSwitch,
                  { backgroundColor: isAiTradesEnabled ? C.primary : C.border },
                ]}
                onPress={() => setIsAiTradesEnabled(!isAiTradesEnabled)}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      transform: [{ translateX: isAiTradesEnabled ? 20 : 2 }],
                    },
                  ]}
                />
              </Pressable>
            </View>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <BraneButton
                onPress={handleSave}
                disabled={!isValid || isLoading}
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: isValid ? C.primary : C.border,
                    opacity: isValid ? 1 : 0.5,
                  },
                ]}
              >
                <ThemedText style={styles.saveButtonText}>
                  {isLoading ? "Saving..." : "Save Settings"}
                </ThemedText>
              </BraneButton>
            </View>
          </>
        )}
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType='fade'
        onRequestClose={() => {
          setShowSuccessModal(false);
          router.back();
        }}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={() => {
            setShowSuccessModal(false);
            router.back();
          }}
        >
          <View style={[styles.successCard, { backgroundColor: C.background }]}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${C.primary}15` },
              ]}
            >
              <TickCircle size={48} color={C.primary} variant='Bold' />
            </View>
            <ThemedText style={styles.successTitle}>Success!</ThemedText>
            <ThemedText style={[styles.successMessage, { color: C.muted }]}>
              Your allocation settings have been saved successfully
            </ThemedText>
            <BraneButton
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
              style={[styles.continueButton, { backgroundColor: C.primary }]}
            >
              <ThemedText style={styles.continueButtonText}>
                Continue
              </ThemedText>
            </BraneButton>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
  },
  centerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  allocationSection: {
    gap: 16,
    marginBottom: 24,
  },
  assetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assetLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  assetInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    width: 100,
  },
  assetInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  percentSign: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  totalCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  totalHint: {
    fontSize: 12,
    marginTop: 8,
  },
  toggleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 12,
  },
  toggleSwitch: {
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
    backgroundColor: "#FFFFFF",
  },
  buttonContainer: {
    gap: 12,
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#FFFFFF",
  },
  // Modal styles
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    maxWidth: 280,
    paddingVertical: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
  },
  continueButton: {
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default BracsAllocationScreen;
