// components/Avatar.tsx
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getInitials } from "@/utils/helpers";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type AvatarShape = "circle" | "square" | "rounded";
type AvatarSize = number | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children?: React.ReactNode;
}

const SIZE_MAP: Record<string, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const BORDER_RADIUS_MAP: Record<AvatarShape, (size: number) => number> = {
  circle: (size) => size / 2,
  square: () => 0,
  rounded: (size) => size * 0.2,
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  shape = "circle",
  backgroundColor,
  textColor,
  style,
  onPress,
  children,
}) => {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme === "dark" ? "dark" : "light"];

  const resolvedBackgroundColor = backgroundColor || C.inputBackground;
  const resolvedTextColor = textColor || C.text;

  const resolvedSize = typeof size === "number" ? size : SIZE_MAP[size];
  const borderRadius = BORDER_RADIUS_MAP[shape](resolvedSize);
  const fontSize = resolvedSize * 0.35;

  const initials = name ? getInitials(name) : null;
  const displayText = children ?? initials;

  const containerStyle: ViewStyle = {
    width: resolvedSize,
    height: resolvedSize,
    borderRadius: "circle" === shape ? "50%" : borderRadius,
    backgroundColor: resolvedBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const content = src ? (
    <Image
      source={{ uri: src }}
      style={{ width: resolvedSize, height: resolvedSize }}
      resizeMode='cover'
    />
  ) : (
    <Text style={[styles.initials, { fontSize, color: resolvedTextColor }]}>
      {typeof displayText === "string" ? displayText : null}
    </Text>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[containerStyle, style]}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[containerStyle, style]}>{content}</View>;
};

const styles = StyleSheet.create({
  initials: {
    fontWeight: "600",
    textAlign: "center",
  },
});
