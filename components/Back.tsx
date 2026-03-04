import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { ArrowLeft } from "iconsax-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const Back = ({ onPress }: { onPress?: () => void }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F4F5",
      }}
      onPress={onPress || router.back}
    >
      <ArrowLeft
        color={
          colorScheme === "light" ? Colors?.light.icon : Colors?.dark?.icon
        }
        size={24}
      />
    </TouchableOpacity>
  );
};

export default Back;
