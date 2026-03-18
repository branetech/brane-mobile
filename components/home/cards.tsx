import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { Image, View } from "@idimma/rn-widget";
import {
    ImageBackground,
    View as RNV,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from "react-native";

export const CardStyle = ({ children }: any) => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  return (
    <View w='100%' h={196} radius={16} style={{ backgroundColor: C.primary }}>
      <ImageBackground
        source={require("@/assets/images/bg.png")}
        style={{ flex: 1, width: "100%", height: "auto", overflow: "hidden" }}
        resizeMode='cover'
      >
        <View p={22} flex={1}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

export const LearnCard = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  return (
    <View
      w='100%'
      h={80}
      p={16}
      radius={12}
      flex={1}
      style={{
        backgroundColor: C.inputBg,
        borderColor: C.border,
        borderWidth: 1,
        shadowColor: C.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        overflow: "hidden",
      }}
    >
      <View w='70%'>
        <ThemedText type='defaultSemiBold' style={{ fontSize: 12 }}>
          Learn about Brane
        </ThemedText>
        <ThemedText numberOfLines={2} style={{ fontSize: 10, lineHeight: 13 }}>
          For you to have a seamless experience we require some details.
        </ThemedText>
      </View>
      <Image
        source={require("@/assets/images/learn.png")}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: 80,
          height: 110,
        }}
      />
    </View>
  );
};

interface UnifiedCardProps {
  variant?: "full" | "compact";
  onPress?: () => void;
  icon: React.ReactNode;
  title: string;
  iconBg?: string;
  bg?: string;
  hide?: boolean;
  height?: number;
  border?: string;
  style?: object;
}

export const ServicesCard = ({
  variant = "full",
  onPress,
  icon,
  title,
  iconBg = "",
  bg = "",
  hide = false,
  height,
  border,
  style = {},
}: UnifiedCardProps) => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = Colors[isDark ? "dark" : "light"];

  if (hide) return null;

  const defaultBorder = border || C.border;

  if (variant === "compact") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.compactContainer, { borderColor: defaultBorder }, style]}
      >
        <RNV
          style={[
            styles.compactIconWrapper,
            {
              backgroundColor: bg || "transparent",
              height: height ?? 56,
              borderColor: defaultBorder,
              borderWidth: border ? 1 : 0,
            },
          ]}
        >
          {icon}
        </RNV>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </TouchableOpacity>
    );
  }

  // Full variant (default)
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fullContainer,
        {
          backgroundColor: bg || "transparent",
          height,
          borderColor: defaultBorder,
          borderWidth: border ? 1 : 0,
        },
        style,
      ]}
    >
      <RNV
        style={[
          styles.iconWrapper,
          { backgroundColor: iconBg || "transparent" },
        ]}
      >
        {icon}
      </RNV>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    flex: 1,
    gap: 8,
    alignItems: "center",
    width: 80,
    justifyContent: "center",
    paddingVertical: 12,
    maxWidth: "100%",
    borderWidth: 1,
  },
  compactIconWrapper: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    borderRadius: 8,
  },
  fullContainer: {
    flex: 1,
    gap: 8,
    alignItems: "center",
    width: 93.5,
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "100%",
    borderWidth: 1,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 12,
  },
});
