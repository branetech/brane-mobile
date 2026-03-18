import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/colors";

interface OTPProps {
  length?: number;
  onComplete?: (otp: string) => void;
  mode?: "otp" | "pin"; // "otp" for 6-digit with separator, "pin" for 4-digit without
}

export const OTPInput = ({ length = 6, onComplete, mode = "otp" }: OTPProps) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputsRef = useRef<TextInput[]>([]);
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

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
  // Works for OTP but PIN mode shows all cells without separator
  const groups = useMemo(() => {
    const groupsArray: number[][] = [];

    if (mode === "pin") {
      // For PIN mode, show all cells in one row without grouping
      groupsArray.push(Array.from({ length }, (_, i) => i));
    } else {
      // For OTP mode, group by 3 with separator
      for (let i = 0; i < length; i += 3) {
        groupsArray.push(
          Array.from({ length: Math.min(3, length - i) }, (_, k) => i + k),
        );
      }
    }

    return groupsArray;
  }, [mode, length]);

  const showSeparator = mode === "otp" && length === 6;

  const renderCell = (index: number) => {
    const filled = otpValues[index] !== "";
    const focused = focusedIndex === index;

    return (
      <Pressable key={index} onPress={() => handleCellPress(index)}>
        <Animated.View
          style={[
            styles.cell,
            {
              backgroundColor: C.inputBg,
              borderColor: C.border,
            },
            filled && {
              backgroundColor: C.inputBg,
              borderColor: C.primary,
            },
            focused && {
              backgroundColor: C.inputBg,
              borderColor: C.primary,
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
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
                { color: C.muted },
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
