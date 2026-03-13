import { ThemedText } from "@/components/themed-text";
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
  return (
    <Pressable
      style={[styles.row, isVerified && styles.disabled]}
      onPress={isVerified ? undefined : onPress}
    >
      <View style={styles.left}>
        <View style={styles.iconWrap}>{icon}</View>
        <ThemedText>{title}</ThemedText>
      </View>

      {isVerified ? (
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>Verified</ThemedText>
        </View>
      ) : (
        <ArrowRight2 size={18} color="#85808A" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F8",
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
    backgroundColor: "#F0FAF6",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#008753",
    fontSize: 12,
    fontWeight: "600",
  },
});
