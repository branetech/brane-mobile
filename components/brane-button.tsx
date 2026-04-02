import { ThemedText } from "@/components/themed-text";
import {
    ActivityIndicator,
    DimensionValue,
    GestureResponderEvent,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface BtnProps {
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  disabled?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  backgroundColor?: string;
  rightIcon?: any;
  leftIcon?: any;
  text?: string;
  textColor?: string;
  fontSize?: number;
  icon?: any;
  loading?: boolean;
  loadingColor?: string;
}

export const BraneButton = ({
  fontSize,
  textColor,
  text,
  rightIcon,
  leftIcon,
  height,
  radius,
  width,
  disabled,
  onPress,
  style,
  backgroundColor,
  icon,
  loading,
  loadingColor,
}: BtnProps) => {
  const isDisabled = disabled || loading;
  const buttonBackgroundColor = backgroundColor || "#013D25";
  const spinnerColor = loadingColor || textColor || "#fff";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btnContainer,
        style,
        {
          width: width ?? "100%",
          height: height ?? 42,
          borderRadius: radius ?? 8,
          backgroundColor: buttonBackgroundColor,
          opacity: isDisabled && !loading ? 0.4 : 1,
        },
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size='small' color={spinnerColor} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <ThemedText
            style={[
              styles.btnText,
              {
                color: textColor || "#fff",
                fontSize: fontSize || 14,
              },
            ]}
          >
            {text || icon}
          </ThemedText>
          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontWeight: "600",
  },
});
