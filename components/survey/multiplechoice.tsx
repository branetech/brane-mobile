import { Colors } from "@/constants";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface MultipleChoiceProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export default function MultipleChoice({ options, selected, onToggle }: MultipleChoiceProps) {
  return (
    <View style={styles.list}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onToggle(opt)}
            activeOpacity={0.75}
            style={[styles.row, isSelected && styles.rowSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {opt}
            </Text>
            <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
              <Text style={[styles.icon, isSelected && styles.iconSelected]}>
                {isSelected ? "✓" : "+"}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
    backgroundColor: '#F5F5F5',
  },
  rowSelected: {
    borderColor: Colors.light.googleBg,
    backgroundColor: Colors.light.googleBg,
  },
  label: {
    fontSize: 13,
    color: Colors.light.text,
    flex: 1,
  },
  labelSelected: {
    color: Colors.light.icon,
    fontWeight: "600",
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.light.borderColor,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  iconCircleSelected: {
    borderColor: Colors.light.icon,
    backgroundColor: Colors.light.icon,
  },
  icon: {
    fontSize: 13,
    color: Colors.light.muted,
    fontWeight: "700",
    lineHeight: 16,
  },
  iconSelected: {
    color: Colors.light.primary,
  },
});