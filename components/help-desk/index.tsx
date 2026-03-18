import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Call, DocumentFavourite, ArrowRight2 } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";

const HelpDeskComponent = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const menuItems = [
    {
      label: "Contact us",
      icon: <Call size={20} color={C.primary} />,
      onPress: () => router.push("/help-desk/contact"),
    },
    {
      label: "FAQs",
      icon: <DocumentFavourite size={20} color={C.primary} />,
      onPress: () => router.push("/help-desk/faqs"),
    },
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.menuItem, { borderBottomColor: C.border }]}
          activeOpacity={0.7}
          onPress={item.onPress}
        >
          <View style={styles.menuContent}>
            <View style={styles.iconWrap}>{item.icon}</View>
            <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
          </View>
          <ArrowRight2 size={16} color={C.text} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HelpDeskComponent;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
