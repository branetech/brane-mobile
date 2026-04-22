import { Colors } from "@/constants/colors";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { Colors } from "../constants/colors";

interface NpsScaleProps {
  selected: number | null;
  onSelect: (value: number) => void;
}

const SCORES = Array.from({ length: 10 }, (_, i) => i + 1);

export default function NpsScale({ selected, onSelect }: NpsScaleProps) {
  return (
    <View style={{backgroundColor: '#fff', borderRadius: 10}}>
      <View style={styles.row}>
        {SCORES.map((n) => {
          const isSelected = selected === n;
          return (
            <TouchableOpacity
              key={n}
              onPress={() => onSelect(n)}
              activeOpacity={0.75}
              style={[styles.item, isSelected && styles.itemSelected]}
            >
              <Text style={[styles.number, isSelected && styles.numberSelected]}>
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.labels}>
        <Text style={styles.labelText}>1 - Very Likely</Text>
        <Text style={styles.labelText}>10 - Very Unlikely</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginBottom: 10,
  },
  item: {
    flex: 1,
    height: 52,
    width: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.borderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#fff',
  },
  itemSelected: {
    backgroundColor: Colors.light.googleBg,
    borderColor: Colors.light.googleBg,
  },
  number: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  numberSelected: {
    // color: Colors.white,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: 10,
    // color: Colors.textMuted,
  },
});