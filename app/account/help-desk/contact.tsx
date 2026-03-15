import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Call, Location, Sms } from "iconsax-react-native";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ContactItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
};

export default function ContactScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const contacts: ContactItem[] = [
    {
      icon: <Call size={22} color={C.primary} variant='Bold' />,
      label: "Phone",
      value: "+234 814 180 5564",
      onPress: () => Linking.openURL("tel:+2348141805564"),
    },
    {
      icon: <Sms size={22} color={C.primary} variant='Bold' />,
      label: "Email",
      value: "info@getbrane.co",
      onPress: () => Linking.openURL("mailto:info@getbrane.co"),
    },
    {
      icon: <Location size={22} color={C.primary} variant='Bold' />,
      label: "Address",
      value: "188, Awolowo Road, Ikoyi, Lagos",
    },
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.headerTitle}>
          Contact Us
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {contacts.map((item) => {
          const card = (
            <View
              key={item.label}
              style={{
                ...styles.card,
                backgroundColor: C.inputBg,
                borderColor: C.border,
              }}
              row
              aligned
            >
              <View style={[styles.iconWrap, { backgroundColor: C.primary + "20" }]}>
                {item.icon}
              </View>
              <View style={styles.textWrap}>
                <ThemedText style={[styles.label, { color: C.muted }]}>
                  {item.label}
                </ThemedText>
                <ThemedText style={styles.value}>{item.value}</ThemedText>
              </View>
            </View>
          );

          if (item.onPress) {
            return (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                {card}
              </TouchableOpacity>
            );
          }

          return card;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
});
