import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "iconsax-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const Back = ({ onPress }: { onPress?: () => void }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme === "dark" ? "dark" : "light"];
  const handleBack = React.useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)" as any);
  }, [onPress, router]);

  return (
    <TouchableOpacity
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: C.inputBg,
      }}
      onPress={handleBack}
    >
      <ArrowLeft color={C.icon} size={24} />
    </TouchableOpacity>
  );
};

export default Back;
