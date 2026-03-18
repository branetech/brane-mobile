import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ArrowRight2 } from "iconsax-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type KycItemProps = {
  onPress: () => void;
  isVerified: boolean;
  icon: React.ReactNode;
  title: string;
};

export default function KycItem({
  onPress,
  isVerified,
  icon,
  title,
}: KycItemProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <Pressable
      style={[
        styles.row,
        { borderBottomColor: C.border },
        isVerified && styles.disabled,
      ]}
      onPress={isVerified ? undefined : onPress}
    >
      <View style={styles.left}>
        <View style={styles.iconWrap}>{icon}</View>
        <ThemedText>{title}</ThemedText>
      </View>

      {isVerified ? (
        <View style={[styles.badge, { backgroundColor: C.primary + "20" }]}>
          <ThemedText style={[styles.badgeText, { color: C.primary }]}>
            Verified
          </ThemedText>
        </View>
      ) : (
        <ArrowRight2 size={18} color={C.muted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disabled: {
    opacity: 0.6,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 24,
    alignItems: "center",
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
