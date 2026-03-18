import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setShowBalance } from "@/redux/slice/auth-slice";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function PaymentSettingsScreen() {
  const scheme = useColorScheme() ?? "light";
  const C = Colors[scheme];
  const dispatch = useDispatch();
  const showBalance = useSelector((state) => state.auth.showBalance);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(true);

  const handleShowBalanceChange = (value) => {
    dispatch(setShowBalance(value));
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={C.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: C.inputBg }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name='arrow-back' size={20} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>
          Payment Settings
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Settings List */}
      <ScrollView style={styles.settingsList}>
        {/* Reset Transaction PIN */}
        <TouchableOpacity
          style={[
            styles.settingRow,
            {
              borderBottomColor: C.border,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
          ]}
          activeOpacity={0.6}
          onPress={() => {
            router.push("/(account)/reset-transaction-pin/change-pin");
          }}
        >
          <Text style={[styles.settingTitle, { color: C.text }]}>
            Reset transaction PIN
          </Text>
          <Ionicons name='chevron-forward' size={18} color={C.muted} />
        </TouchableOpacity>

        {/* Fingerprint */}
        <View
          style={[
            styles.settingRow,
            {
              borderBottomColor: C.border,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          <View style={styles.settingTextGroup}>
            <Text style={[styles.settingTitle, { color: C.text }]}>
              Fingerprint
            </Text>
            <Text style={[styles.settingSubtitle, { color: C.muted }]}>
              Use fingerprint to complete transactions
            </Text>
          </View>
          <Switch
            value={fingerprintEnabled}
            onValueChange={setFingerprintEnabled}
            trackColor={{ false: C.border, true: C.primary }}
            thumbColor={fingerprintEnabled ? "#fff" : C.muted}
            ios_backgroundColor={C.border}
            style={styles.switch}
          />
        </View>

        {/* Show Balance */}
        <View
          style={[
            styles.settingRow,
            {
              borderBottomColor: C.border,
              borderBottomWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          <View style={styles.settingTextGroup}>
            <Text style={[styles.settingTitle, { color: C.text }]}>
              Show balance
            </Text>
            <Text style={[styles.settingSubtitle, { color: C.muted }]}>
              Show my balance on home screen
            </Text>
          </View>
          <Switch
            value={showBalance}
            onValueChange={handleShowBalanceChange}
            trackColor={{ false: C.border, true: C.primary }}
            thumbColor={showBalance ? "#fff" : C.muted}
            ios_backgroundColor={C.border}
            style={styles.switch}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 0 + 12) : 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  headerSpacer: {
    width: 38,
  },
  settingsList: {
    marginTop: 12,
    paddingHorizontal: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  settingTextGroup: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    marginTop: 2,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});
