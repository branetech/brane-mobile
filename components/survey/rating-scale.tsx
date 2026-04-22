import { Colors } from "@/constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RatingScaleProps {
  labels: string[];
  selected: number | null;
  onSelect: (index: number) => void;
}

export default function RatingScale({
  labels,
  selected,
  onSelect,
}: RatingScaleProps) {
  return (
    <View style={styles.row}>
      {labels.map((label, i) => {
        const isSelected = selected === i;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => onSelect(i)}
            activeOpacity={0.75}
            style={styles.item}
          >
            <View
              style={[styles.circle, isSelected && styles.circleSelected]}
            />
            <Text
              style={[styles.label, isSelected && styles.labelSelected]}
              numberOfLines={2}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.light.borderColor,
    backgroundColor: Colors.light.background,
  },
  circleSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  label: {
    fontSize: 12,
    color: Colors.light.text,
    textAlign: "center",
    lineHeight: 13,
    fontWeight: "400",

  },
  labelSelected: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
});
