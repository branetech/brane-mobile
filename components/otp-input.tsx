import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "@/constants/colors";

interface OTPProps {
  length?: number;
  onComplete?: (otp: string) => void;
}

export const OTPInput = ({ length = 6, onComplete }: OTPProps) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputsRef = useRef<TextInput[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  const scaleAnims = useRef(
    Array(length)
      .fill(null)
      .map(() => new Animated.Value(1)),
  ).current;

  const popIn = useCallback(
    (index: number) => {
      Animated.sequence([
        Animated.timing(scaleAnims[index], {
          toValue: 1.18,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnims[index], {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [scaleAnims],
  );

  const handleChange = useCallback(
    (text: string, index: number) => {
      const digit = text.slice(-1);
      const newOtp = [...otpValues];
      newOtp[index] = digit;
      setOtpValues(newOtp);

      if (digit) {
        popIn(index);
        if (index < length - 1) {
          inputsRef.current[index + 1]?.focus();
        }
      }

      if (newOtp.every((d) => d !== "")) {
        onComplete?.(newOtp.join(""));
      }
    },
    [otpValues, length, onComplete, popIn],
  );

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      if (e.nativeEvent.key === "Backspace") {
        if (otpValues[index]) {
          const newOtp = [...otpValues];
          newOtp[index] = "";
          setOtpValues(newOtp);
        } else if (index > 0) {
          const newOtp = [...otpValues];
          newOtp[index - 1] = "";
          setOtpValues(newOtp);
          inputsRef.current[index - 1]?.focus();
        }
      }
    },
    [otpValues],
  );

  const handleCellPress = useCallback((index: number) => {
    inputsRef.current[index]?.focus();
  }, []);

  // Split indices into groups of 3: [[0,1,2], [3,4,5]]
  // Works for any length but separator only shows when length === 6
  const groups: number[][] = [];
  for (let i = 0; i < length; i += 3) {
    groups.push(
      Array.from({ length: Math.min(3, length - i) }, (_, k) => i + k),
    );
  }
  const showSeparator = length === 6;

  const renderCell = (index: number) => {
    const filled = otpValues[index] !== "";
    const focused = focusedIndex === index;

    return (
      <Pressable key={index} onPress={() => handleCellPress(index)}>
        <Animated.View
          style={[
            styles.cell,
            {
              backgroundColor: isDark ? "#1A2420" : C.inputBg,
              borderColor: isDark ? "transparent" : C.border,
            },
            filled && {
              backgroundColor: isDark ? "#0D2A1E" : C.inputBg,
              borderColor: C.primary,
            },
            focused && {
              backgroundColor: isDark ? "#152119" : C.inputBg,
              borderColor: C.primary,
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            },
            { transform: [{ scale: scaleAnims[index] }] },
          ]}
        >
          <TextInput
            ref={(el) => {
              if (el) inputsRef.current[index] = el;
            }}
            value={otpValues[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            keyboardType='numeric'
            maxLength={1}
            caretHidden
            selectTextOnFocus
            style={[styles.input, { color: C.text }]}
          />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.row}>
      {groups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {/* Render the group of cells */}
          <View style={styles.group}>
            {group.map((cellIndex) => renderCell(cellIndex))}
          </View>

          {/* Render separator between groups, not after the last one */}
          {showSeparator && groupIndex < groups.length - 1 && (
            <Text
              style={[
                styles.separator,
                { color: isDark ? C.muted : C.border },
              ]}
            >
              —
            </Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const CELL_SIZE = 52;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  group: {
    flexDirection: "row",
    gap: 10,
  },
  separator: {
    fontSize: 22,
    fontWeight: "300",
    marginHorizontal: 8,
    marginBottom: 2,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
    height: "100%",
    padding: 0,
  },
});
