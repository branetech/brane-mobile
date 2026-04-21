import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

// ── Slider Card ───────────────────────────────────────────────────────────────

const SliderCard = ({
  label,
  value,
  onChange,
  C,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  C: (typeof Colors)["light"];
}) => {
  const handleInputChange = (text: string) => {
    if (text === "") {
      onChange(0);
      return;
    }
    const n = parseInt(text, 10);
    if (!isNaN(n) && n >= 0 && n <= 100) {
      onChange(n);
    }
  };

  return (
    <View style={sliderStyles.card}>
      <View style={sliderStyles.row}>
        <Text style={[sliderStyles.label, { color: C.text }]}>{label}</Text>
        <View style={sliderStyles.inputWrap}>
          <TextInput
            style={[
              sliderStyles.input,
              { color: C.text, borderColor: "#B6B3B9" },
            ]}
            value={value === 0 ? "0" : String(value)}
            onChangeText={handleInputChange}
            keyboardType='number-pad'
            maxLength={3}
            selectTextOnFocus
          />
          <Text style={[sliderStyles.pctSign, { color: C.text }]}>%</Text>
        </View>
      </View>

      <Slider
        style={sliderStyles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor='#013D25'
        maximumTrackTintColor='#AABEB6'
        thumbTintColor='#013D25'
      />

      <View style={[sliderStyles.divider, { backgroundColor: palette.surface100 }]} />
    </View>
  );
};

const sliderStyles = StyleSheet.create({
  card: { paddingVertical: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: { fontSize: 14, fontWeight: "500", flex: 1, marginTop: 8 },
  inputWrap: {
    width: 41,
    height: 24,
    position: "relative",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "500",
    paddingRight: 10,
  },
  pctSign: {
    position: "absolute",
    right: 4,
    fontSize: 10,
    fontWeight: "500",
  },
  slider: { width: "100%", height: 36 },
  divider: { height: 1, marginTop: 20 },
});

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function BracsAllocationScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [isLoading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(true);
  const [stockAssets, setStockAssets] = useState(25);
  const [goldAssets, setGoldAssets] = useState(25);
  const [fixedIncome, setFixedIncome] = useState(25);
  const [indexFunds, setIndexFunds] = useState(25);
  const [isAiTradesEnabled, setIsAiTradesEnabled] = useState(false);

  const total = stockAssets + goldAssets + fixedIncome + indexFunds;
  const isValid = total === 100;

  const fetchAllocation = useCallback(async () => {
    try {
      const res: any = await BaseRequest.get(
        TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION,
      );
      if (res) {
        setStockAssets(res.stockAsset ?? 25);
        setGoldAssets(res.goldAsset ?? 25);
        setFixedIncome(res.fixedIncome ?? 25);
        setIndexFunds(res.indexFund ?? 25);
      }
    } catch {
      // silent
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchAllocation();
  }, [fetchAllocation]);

  const handleSave = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        stockAsset: stockAssets,
        goldAsset: goldAssets,
        fixedIncome,
        indexFund: indexFunds,
        allocationType: "do-it-yourself",
      });
      showSuccess("Bracs Allocation Settings Saved Successfully");
    } catch (err) {
      catchError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.headerTitle, { color: C.text }]}>
          Bracs Allocation
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isFetching ? (
        <View style={styles.loader}>
          <ActivityIndicator color={C.primary} size='small' />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <Text style={[styles.subtitle, { color: C.muted }]}>
            Preset your Bracs distribution across available assets. Bracs will
            be{" "}
            <Text style={{ color: C.text, fontWeight: "500" }}>
              distributed in %
            </Text>{" "}
            according to your setting.
          </Text>

          {/* Slider cards */}
          <View style={styles.sliders}>
            <SliderCard
              label='Stock assets'
              value={stockAssets}
              onChange={setStockAssets}
              C={C}
            />
            <SliderCard
              label='Gold assets'
              value={goldAssets}
              onChange={setGoldAssets}
              C={C}
            />
            <SliderCard
              label='Fixed income'
              value={fixedIncome}
              onChange={setFixedIncome}
              C={C}
            />
            <SliderCard
              label='Index funds'
              value={indexFunds}
              onChange={setIndexFunds}
              C={C}
            />
          </View>

          {/* Validation error — matches web: single line "Current: X%" */}
          {!isValid && (
            <Text style={styles.validationError}>Current: {total}%</Text>
          )}

          {/* AI Recommended Trades toggle */}
          <View style={[styles.aiRow, { borderBottomColor: C.border }]}>
            <View style={styles.aiLeft}>
              <Text style={[styles.aiTitle, { color: "#342A3B" }]}>
                AI Recommended Trades
              </Text>
              <Text style={[styles.aiDesc, { color: palette.gray350 }]}>
                Enable or disable AI recommended trades
              </Text>
            </View>
            <Switch
              value={isAiTradesEnabled}
              onValueChange={setIsAiTradesEnabled}
              trackColor={{ false: "#E7E6E8", true: palette.brandMint }}
              thumbColor={isAiTradesEnabled ? palette.brandDeep : "#ACAAAD"}
              ios_backgroundColor='#E7E6E8'
            />
          </View>

          {/* Save button */}
          <View style={styles.saveBtn}>
            <BraneButton
              text='Save Settings'
              onPress={handleSave}
              backgroundColor={isValid ? palette.brandDeep : "#AABEB6"}
              textColor={isValid ? palette.brandMint : "#8CA198"}
              height={50}
              radius={12}
              loading={isLoading}
              disabled={!isValid}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: "600" },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { paddingHorizontal: 20, paddingBottom: 48 },
  subtitle: { fontSize: 12, lineHeight: 18, marginBottom: 20 },
  sliders: { gap: 0 },
  validationError: {
    color: "#E54B4B",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 8,
  },
  aiRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginTop: 8,
  },
  aiLeft: { flex: 1, marginRight: 12 },
  aiTitle: { fontSize: 14, fontWeight: "500", marginBottom: 2 },
  aiDesc: { fontSize: 12, lineHeight: 17 },
  saveBtn: { marginTop: 24 },
});
