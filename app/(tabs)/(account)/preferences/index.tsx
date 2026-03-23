import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch as RNSwitch,
} from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/colors";
import { ThemedText } from "@/components/themed-text";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setTransactionSound, setShowBalance } from "@/redux/slice/preferencesSlice";
import Back from "@/components/back";
import { Volume, Eye, Setting } from "iconsax-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PreferencesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const dispatch = useDispatch();

  const { transactionSound, showBalance } = useSelector(
    (state: RootState) => state.preferences
  );

  const handleTransactionSoundChange = useCallback(
    (value: boolean) => {
      dispatch(setTransactionSound(value));
      // TODO: Add sound notification here
    },
    [dispatch]
  );

  const handleShowBalanceChange = useCallback(
    (value: boolean) => {
      dispatch(setShowBalance(value));
    },
    [dispatch]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.title, { color: C.text }]}>
          Preferences
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Transaction Sound Toggle */}
        <PreferenceRow
          icon={<Volume size={24} color={C.primary} />}
          label="Transaction sound"
          value={transactionSound}
          onValueChange={handleTransactionSoundChange}
          textColor={C.text}
          borderColor={C.border}
          thumbColor={C.primary}
        />

        {/* Theme Selection */}
        <TouchableOpacity
          style={[styles.row]}
          onPress={() => router.push("/(tabs)/(account)/preferences/themes")}
        >
          <View style={styles.rowContent}>
            <Setting size={24} color={C.primary} />
            <ThemedText style={[styles.rowLabel, { color: C.text }]}>
              Theme
            </ThemedText>
          </View>
          <ThemedText style={[styles.arrow, { color: C.muted }]}>›</ThemedText>
        </TouchableOpacity>

        {/* Show Balance Toggle */}
        <PreferenceRow
          icon={<Eye size={24} color={C.primary} />}
          label="Show balance"
          value={showBalance}
          onValueChange={handleShowBalanceChange}
          textColor={C.text}
          borderColor={C.border}
          thumbColor={C.primary}
          isLast
        />
      </ScrollView>
    </SafeAreaView>
  );
}

interface PreferenceRowProps {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  textColor: string;
  borderColor: string;
  thumbColor?: string;
  isLast?: boolean;
}

function PreferenceRow({
  icon,
  label,
  value,
  onValueChange,
  textColor,
  borderColor,
  thumbColor,
  isLast = false,
}: PreferenceRowProps) {
  return (
    <View style={[styles.row, !isLast && { borderBottomColor: borderColor }]}>
      <View style={styles.rowContent}>
        {icon}
        <ThemedText style={[styles.rowLabel, { color: textColor }]}>
          {label}
        </ThemedText>
      </View>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: borderColor, true: thumbColor ? `${thumbColor}80` : `${borderColor}80` }}
        thumbColor={value ? thumbColor : undefined}
      />
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  arrow: {
    fontSize: 20,
    fontWeight: "300",
  },
});
