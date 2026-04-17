import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { palette } from "@/constants";

const COLORS = {
  green: "#1a6644",
  greenLight: "#b2dfce",
  text: "#1a1a1a",
  subtext: "#9e9e9e",
  border: "#f0f0f0",
  white: palette.white,
};

type RowItem = {
  key: string;
  label: string;
  onPress: () => void;
};

const passwordRows: RowItem[] = [
  { key: "change", label: "Change password", onPress: () => router.push("/(account)/change-password/reset-password") },
  { key: "forgot", label: "Forgot password",  onPress: () => router.push("/forgot-password") },
];

export default function LoginSettingsScreen() {
  const [touchIdEnabled, setTouchIdEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.body}>

        {/* ── Password Section ── */}
        <Text style={styles.sectionLabel}>Password</Text>
        <View style={styles.section}>
          {passwordRows.map((item, index) => (
            <React.Fragment key={item.key}>
              <TouchableOpacity style={styles.row} onPress={item.onPress} activeOpacity={0.6}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
              {index < passwordRows.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Biometrics Section ── */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>Biometrics Login</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Login with touch ID</Text>
            <Switch
              value={touchIdEnabled}
              onValueChange={setTouchIdEnabled}
              trackColor={{ false: "#e0e0e0", true: COLORS.greenLight }}
              thumbColor={touchIdEnabled ? COLORS.green : "#fff"}
              ios_backgroundColor="#e0e0e0"
            />
          </View>
        </View>

      </View>

      {/* Footer */}
      {/* <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerBtn}
          onPress={() => router.push("/add-next-of-kin")}
          activeOpacity={0.75}
        >
          <Text style={styles.footerBtnLabel}>Add Next of Kin</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },

  body: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },

  sectionLabel: {
    fontSize: 13,
    color: COLORS.subtext,
    marginBottom: 10,
  },

  section: {
    borderRadius: 0,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingTop: 12,
  },
  footerBtn: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
  },
  footerBtnLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.green,
  },
});