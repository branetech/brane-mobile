import { Colors } from "@/constants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SingleChoiceProps {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
}

export default function SingleChoice({
  options,
  selected,
  onSelect,
}: SingleChoiceProps) {
  return (
    <View style={styles.list}>
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            activeOpacity={0.75}
            style={[styles.row, isSelected && styles.rowSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {opt}
            </Text>
            <View
              style={[
                styles.radioOuter,
                isSelected && styles.radioOuterSelected,
              ]}
            >
              {isSelected && <View style={styles.radioInner} />}
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
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  rowSelected: {
    borderColor: Colors.light.selectedBorder,
    backgroundColor: Colors.light.selectedBg,
  },
  label: {
    fontSize: 13,
    color: Colors.light.text,
    flex: 1,
  },
  labelSelected: {
    color: "#013D25",
    fontWeight: "600",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  radioOuterSelected: {
    borderColor: Colors.light.selectedBorder,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#013D25",
  },
});
