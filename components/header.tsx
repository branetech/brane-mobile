import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/colors";
import { View, IS_IOS } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Platform } from "react-native";
import { ThemedText } from "./themed-text";
import Back from "./back";

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
      return router.push(handleBackPress as any);
    if (typeof handleBackPress === "function") return handleBackPress(router);
    router.back();
  }, [handleBackPress, router]);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      // height: 100,
      paddingHorizontal: 16,
      paddingVertical: IS_IOS ? 2 : 5,
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
      <Back onPress={onGoBack} />

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
