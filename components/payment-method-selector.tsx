import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export type PaymentOption = {
  /** Unique identifier for this option */
  id: string;
  /** Display label e.g. "Total balance - ₦ 1,000.00" */
  label: string;
  /** Single character or short string shown in the icon circle */
  icon: string;
};

type Props = {
  options: PaymentOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSeeAll?: () => void;
};

export function PaymentMethodSelector({
  options,
  selectedId,
  onSelect,
  onSeeAll,
}: Props) {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme === "dark" ? "dark" : "light"];
  const dynamicStyles = createDynamicStyles(C);
  return (
    <View style={styles.wrapper}>
      {/* Header row */}
      <View style={styles.header}>
        <ThemedText style={dynamicStyles.heading}>Select Payment Method</ThemedText>
        {onSeeAll && (
          <TouchableOpacity
            onPress={onSeeAll}
            hitSlop={8}
            style={styles.seeAllBtn}
          >
            <ThemedText style={[styles.seeAll, { color: C.primary }]}>See All</ThemedText>
            <ThemedText style={[styles.seeAllChevron, { color: C.primary }]}>›</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Options card */}
      <View style={[styles.card, { borderColor: C.border }]}>
        {options.map((option, index) => {
          const isSelected = option.id === selectedId;
          const isLast = index === options.length - 1;
          return (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.7}
              onPress={() => onSelect(option.id)}
              style={[
                styles.optionRow,
                { backgroundColor: C.screen },
                !isLast && [
                  styles.optionDivider,
                  { borderBottomColor: C.border },
                ],
              ]}
            >
              {/* Left: icon + label */}
              <View style={styles.optionLeft}>
                <View style={styles.iconWrap}>
                  <ThemedText style={dynamicStyles.iconText}>{option.icon}</ThemedText>
                </View>
                <ThemedText style={dynamicStyles.optionLabel}>
                  {option.label}
                </ThemedText>
              </View>

              {/* Right: radio */}
              <View
                style={[
                  styles.radio,
                  isSelected
                    ? [styles.radioSelected, { borderColor: C.primary }]
                    : styles.radioUnselected,
                ]}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 12,
    fontWeight: "600",
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAll: {
    fontSize: 11,
    fontWeight: "500",
  },
  seeAllChevron: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionDivider: {
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E1F4EC",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 12,
    fontWeight: "700",
  },
  optionLabel: {
    fontSize: 12,
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
  },
  radioUnselected: {
    borderColor: "#C5C5CA",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

const createDynamicStyles = (C: typeof Colors.light) =>
  StyleSheet.create({
    heading: {
      fontSize: 12,
      fontWeight: "600",
      color: C.text,
    },
    optionLabel: {
      fontSize: 12,
      color: C.text,
      flex: 1,
    },
    iconText: {
      fontSize: 12,
      fontWeight: "700",
      color: C.primary,
    },
  });
