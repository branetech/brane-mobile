import {
  AllocationSliderRow,
  OptionRow,
} from "@/components/account/bracs-investment";
import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AllocationPayload = {
  stockAsset: number;
  goldAsset: number;
  fixedIncome: number;
  indexFund: number;
};

const initialAllocation: AllocationPayload = {
  stockAsset: 25,
  goldAsset: 25,
  fixedIncome: 25,
  indexFund: 25,
};

const toNumber = (value: string | number | undefined, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const allocationFromPayload = (payload: any): AllocationPayload => {
  const source = payload?.data?.data || payload?.data || payload || {};
  return {
    stockAsset: toNumber(source?.stockAsset, 25),
    goldAsset: toNumber(source?.goldAsset, 25),
    fixedIncome: toNumber(source?.fixedIncome, 25),
    indexFund: toNumber(source?.indexFund, 25),
  };
};

export default function BracsAllocationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isAiTradesEnabled, setIsAiTradesEnabled] = useState(false);
  const [allocation, setAllocation] =
    useState<AllocationPayload>(initialAllocation);

  const total = useMemo(
    () =>
      allocation.stockAsset +
      allocation.goldAsset +
      allocation.fixedIncome +
      allocation.indexFund,
    [allocation],
  );

  const isValid = total === 100;

  const fetchAllocation = useCallback(async () => {
    setFetching(true);
    try {
      const response: any = await BaseRequest.get(
        TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION,
      );
      setAllocation(allocationFromPayload(response));
    } catch (error) {
      catchError(error);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchAllocation();
  }, [fetchAllocation]);

  const onSave = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        ...allocation,
        allocationType: "do-it-yourself",
      });
      showSuccess("Bracs Allocation Settings Saved Successfully");
      router.back();
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.title}>
          Bracs Allocation
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {fetching ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='small' color={C.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText style={[styles.helpText, { color: C.muted }]}>
            Preset your Bracc distribution across available assets. Bracc will
            be distributed in % according to your setting.
          </ThemedText>

          <View style={styles.sliderCardWrap}>
            <AllocationSliderRow
              label='Stock assets'
              value={allocation.stockAsset}
              onChange={(next) =>
                setAllocation((prev) => ({ ...prev, stockAsset: next }))
              }
            />
            <AllocationSliderRow
              label='Gold assets'
              value={allocation.goldAsset}
              onChange={(next) =>
                setAllocation((prev) => ({ ...prev, goldAsset: next }))
              }
            />
            <AllocationSliderRow
              label='Fixed income'
              value={allocation.fixedIncome}
              onChange={(next) =>
                setAllocation((prev) => ({ ...prev, fixedIncome: next }))
              }
            />
            <AllocationSliderRow
              label='Index funds'
              value={allocation.indexFund}
              onChange={(next) =>
                setAllocation((prev) => ({ ...prev, indexFund: next }))
              }
            />
          </View>

          {!isValid && (
            <ThemedText style={[styles.totalText, { color: "#CB010B" }]}>
              Current: {total}%
            </ThemedText>
          )}

          <View style={styles.aiOptionWrap}>
            <OptionRow
              title='AI Recommended Trades'
              description='Enable or disable AI recommended trades'
              isSelected={isAiTradesEnabled}
              onPress={() => setIsAiTradesEnabled((prev) => !prev)}
            />
          </View>

          <BraneButton
            text='Save Settings'
            onPress={onSave}
            loading={loading}
            disabled={!isValid}
            style={styles.button}
          />
        </ScrollView>
      )}
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
  title: { fontSize: 16 },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  helpText: {
    fontSize: 13,
  },
  sliderCardWrap: {
    marginTop: 14,
  },
  totalText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  aiOptionWrap: {
    marginTop: 12,
  },
  button: {
    marginTop: 24,
  },
});
