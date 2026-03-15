import { Avatar } from "@/components/avatar";
import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DetailRow = ({
  label,
  value,
  labelColor,
  valueColor,
  borderColor,
}: {
  label: string;
  value?: string | null;
  labelColor: string;
  valueColor: string;
  borderColor: string;
}) => (
  <View
    style={[styles.row, { borderBottomColor: borderColor }]}
    row
    spaced
    aligned
  >
    <ThemedText style={[styles.label, { color: labelColor }]}>
      {label}
    </ThemedText>
    <ThemedText style={[styles.value, { color: valueColor }]}>
      {value || "-"}
    </ThemedText>
  </View>
);

export default function AccountDetailsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user } = useAppState();

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "User";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={{ color: C.text }}>
          Account Details
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarWrap}>
          <Avatar name={fullName} src={user?.image} size={96} shape='circle' />
          <ThemedText style={[styles.avatarHint, { color: C.primary }]}>
            Profile Information
          </ThemedText>
        </View>

        <DetailRow
          label='First Name'
          value={user?.firstName}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Last Name'
          value={user?.lastName}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Phone Number'
          value={user?.phone}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Email Address'
          value={user?.email}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Username'
          value={user?.username ? `@${user.username}` : undefined}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />
        <DetailRow
          label='Address'
          value={user?.houseAddress}
          labelColor={C.muted}
          valueColor={C.text}
          borderColor={C.border}
        />

        <View style={[styles.note, { backgroundColor: C.inputBg }]}>
          <ThemedText style={[styles.noteText, { color: C.muted }]}>
            For account information changes, please contact our support team at
            support@getbrane.co
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  avatarHint: {
    fontSize: 13,
    fontWeight: "500",
  },
  row: {
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
    textAlign: "right",
  },
  note: {
    marginTop: 24,
    borderRadius: 12,
    padding: 14,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
