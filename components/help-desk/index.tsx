import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Call, MessageQuestion, ArrowRight2 } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";

const HelpDeskComponent = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const menuItems = [
    {
      key: "contact",
      label: "Contact us",
      icon: <Call size={22} color={C.primary} />,
      bordered: true,
      onPress: () => router.push("/(tabs)/(account)/help-desk/contact"),
    },
    {
      key: "livechat",
      label: "Live chat",
      icon: <MessageQuestion size={22} color={C.primary} />,
      bordered: true,
      onPress: () => router.push("/support"),
    },
    {
      key: "faqs",
      label: "FAQs",
      icon: <MessageQuestion size={22} color={C.primary} />,
      bordered: false,
      onPress: () => router.push("/(tabs)/(account)/help-desk/faqs"),
    },
  ];

  return (
    <View style={[styles.list, { paddingTop: 12 }]}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.row,
            { backgroundColor: C.background },
            item.bordered && [styles.rowBordered, { borderColor: C.border }],
          ]}
          onPress={item.onPress}
          activeOpacity={0.65}
        >
          <View style={styles.rowIconWrap}>{item.icon}</View>
          <ThemedText style={[styles.rowLabel, { color: C.text }]}>
            {item.label}
          </ThemedText>
          <ArrowRight2 size={18} color={C.muted} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HelpDeskComponent;

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  rowBordered: {
    borderWidth: 1,
  },
  rowIconWrap: {
    marginRight: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
});
