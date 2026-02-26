import React from "react";
import { StyleSheet } from "react-native";
import { View, Pressable } from "@idimma/rn-widget";

type RadioButtonProps = {
  selected: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
  children?: React.ReactNode;
};

export const RadioButton = ({
  selected,
  onPress,
  size = 24,
  color = "#013D25",
  children,
}: RadioButtonProps) => {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      {/* Content */}
      <View row aligned gap={10}>{children}</View>

      {/* Radio */}
      <View
        style={{
            borderColor: selected ? color : "#D1D5DB",
          }}
          w={size}
          h={size}
          radius={size / 2}
      >
        {selected && (
          <View
            style={{
              width: size * 0.55,
              height: size * 0.55,
              borderRadius: (size * 0.55) / 2,
              backgroundColor: color,
              borderWidth: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
});