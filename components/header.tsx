import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/colors";
import { View, TouchableOpacity } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { ArrowLeft } from "iconsax-react-native";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";

interface IHeaderProps {
  title?: string;
  description?: string;
  rightContent?: React.ReactNode;
  handleBackPress?: string | ((router: any) => void);
  bgColor?: string;
  titleColor?: string;
}

export const Header = ({
  title,
  description,
  rightContent,
  handleBackPress,
  bgColor,
  titleColor,
}: IHeaderProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme === "dark" ? "dark" : "light"];

  const onGoBack = useCallback(() => {
    if (typeof handleBackPress === "string")
      return router.push(handleBackPress);
    if (typeof handleBackPress === "function") return handleBackPress(router);
    router.back();
  }, [handleBackPress, router]);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 56,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: bgColor || C.background,
    },
    backButton: {
      width: "20%",
      justifyContent: "center",
    },
    centerContent: {
      width: "60%",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: titleColor || C.text,
      textAlign: "center",
    },
    description: {
      fontSize: 12,
      color: C.muted,
      textAlign: "center",
      marginTop: 2,
    },
    rightContent: {
      width: "20%",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onGoBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ArrowLeft size={20} color={C.text} />
      </TouchableOpacity>

      <View style={styles.centerContent}>
        {title && <ThemedText style={styles.title}>{title}</ThemedText>}
        {description && (
          <ThemedText style={styles.description}>{description}</ThemedText>
        )}
      </View>

      <View style={styles.rightContent}>{rightContent}</View>
    </View>
  );
};

export default Header;
