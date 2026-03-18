import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

type RadioButtonProps = {
  selected: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
  children?: React.ReactNode;
  bg?: string;
};

export const BraneRadioButton = ({
  selected,
  onPress,
  size = 24,
  color = "#013D25",
  children,
  bg,
}: RadioButtonProps) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme === "dark" ? "dark" : "light"];
  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrapper, { backgroundColor: bg, borderColor: C.border }]}
    >
      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Radio */}
      <View
        style={[
          styles.outer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: selected ? color : "#D1D5DB",
          },
        ]}
      >
        {selected && (
          <View
            style={{
              width: size * 0.55,
              height: size * 0.55,
              borderRadius: (size * 0.55) / 2,
              backgroundColor: color,
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
    // alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    // backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  outer: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
