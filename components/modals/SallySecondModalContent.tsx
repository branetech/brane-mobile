import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { ArrowLeft, CloseCircle, InfoCircle } from "iconsax-react-native";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Slider,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface SallySecondModalContentProps {
  onClose: () => void;
  onGoBack: () => void;
  onSallyEnabled: (enabled: boolean) => void;
  scheme: string;
}

export default function SallySecondModalContent({
  onClose,
  onGoBack,
  onSallyEnabled,
  scheme,
}: SallySecondModalContentProps) {
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [threshold, setThreshold] = useState(50);
  const [bracsValue, setBracsValue] = useState(500);
  const [isSaving, setIsSaving] = useState(false);

  const updateBracsValue = useCallback((val: number) => {
    const maxBracs = 1000;
    const calculatedBracs = Math.round((val / 100) * maxBracs);
    setBracsValue(calculatedBracs);
    setThreshold(val);
  }, []);

  const handleSaveAndActivate = useCallback(async () => {
    try {
      setIsSaving(true);
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        allocationType: "ai-automated",
      });

      // Success callback
      onSallyEnabled(true);
      onClose();
    } catch (err) {
      catchError(err);
    } finally {
      setIsSaving(false);
    }
  }, [onClose, onSallyEnabled]);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color={C.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <CloseCircle size={24} color={C.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <ThemedText style={[styles.title, { color: C.text }]}>
            Sally For You and With You
          </ThemedText>
          <ThemedText style={[styles.description, { color: C.muted }]}>
            Set a threshold for how Sally auto invest your Bracs into
            diversified assets.
          </ThemedText>
        </View>

        {/* Threshold Slider */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderLabelRow}>
            <ThemedText style={[styles.sliderLabel, { color: C.text }]}>
              Drag to set threshold
            </ThemedText>
            <InfoCircle size={16} color={C.muted} />
          </View>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={100}
              step={5}
              value={threshold}
              onValueChange={updateBracsValue}
              minimumTrackTintColor={C.primary}
              maximumTrackTintColor={C.border}
              thumbTintColor={C.primary}
            />

            {/* Value Indicator */}
            <View style={styles.valueIndicator}>
              <ThemedText style={[styles.valueText, { color: C.text }]}>
                {bracsValue} Bracs
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Save and Activate Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: C.primary }]}
        onPress={handleSaveAndActivate}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color='#fff' size='small' />
        ) : (
          <ThemedText style={styles.buttonText}>Save and Activate</ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  sliderSection: {
    marginBottom: 32,
  },
  sliderLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  sliderContainer: {
    gap: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  valueIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  valueText: {
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
