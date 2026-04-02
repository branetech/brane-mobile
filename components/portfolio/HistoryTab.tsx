import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import styles from "./holdingStyles";
import TxItem from "./TxItem";

interface HistoryTabProps {
  C: any;
  tickerSymbol: string;
  historyTab: string;
  setHistoryTab: (v: string) => void;
  totalReturn: number;
  returnPct: number;
  unitsHeld: number;
  investedValue: number;
  dividends: number;
  txCount: number;
  startDate: string;
  filteredTx: any[];
  txLoading: boolean;
}

const HISTORY_TABS = ["All", "Buy", "Sell", "Returns"];

const HistoryTab: React.FC<HistoryTabProps> = ({
  C,
  tickerSymbol,
  historyTab,
  setHistoryTab,
  totalReturn,
  returnPct,
  unitsHeld,
  investedValue,
  dividends,
  txCount,
  startDate,
  filteredTx,
  txLoading,
}) => {
  const returnsUp = totalReturn >= 0;

  return (
    <>
      {/* Sub-tabs — pill style */}
      <View style={styles.subTabRow}>
        {HISTORY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setHistoryTab(tab)}
            style={[
              styles.subTab,
              historyTab === tab
                ? { backgroundColor: C.googleBg }
                : { backgroundColor: "transparent" },
            ]}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.subTabTxt, { color: C.primary }]}>
              {tab}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Return — plain background, no card */}
      <View style={styles.returnSection}>
        <ThemedText style={[styles.returnLabel, { color: C.muted }]}>Total Return on {tickerSymbol}</ThemedText>
        <ThemedText style={[styles.returnAmt, { color: C.text }]}> 
          {returnsUp ? "+" : "−"}₦
          {Math.abs(totalReturn).toLocaleString("en", { minimumFractionDigits: 2 })}
        </ThemedText>
        <ThemedText style={[styles.returnPct, { color: returnsUp ? "#0C8F5C" : "#D50000" }]}> 
          {returnsUp ? "▲" : "▼"} ({returnsUp ? "+" : ""}{returnPct.toFixed(2)}%)
        </ThemedText>

        {/* 4 mini stats */}
        <View style={[styles.statsBottomRow, { marginTop: 16 }]}> 
          {[
            { label: "Holdings", value: String(unitsHeld) },
            { label: "Invested", value: startDate },
            { label: "Dividends", value: String(Math.round(dividends)) },
            { label: "Transactions", value: startDate },
          ].map(({ label, value }, i, arr) => (
            <React.Fragment key={label}>
              <View style={{ flex: 1, alignItems: i === 0 ? "flex-start" : i === arr.length - 1 ? "flex-end" : "center" }}>
                <ThemedText style={[styles.statMiniVal, { color: C.text, fontSize: 15 }]}>{value}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: C.muted, marginTop: 2 }]}>{label}</ThemedText>
              </View>
              {i < arr.length - 1 && (
                <View style={[styles.vertDivider, { backgroundColor: C.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={[styles.horizDivider, { backgroundColor: C.border, marginBottom: 20 }]} />

      {/* Transaction History */}
      <ThemedText style={[styles.sectionTitle, { color: C.text, fontSize: 15, marginBottom: 16 }]}> 
        {tickerSymbol} Transaction History
      </ThemedText>

      {txLoading ? (
        <ActivityIndicator size="small" color={C.primary} style={{ marginTop: 20 }} />
      ) : filteredTx.length === 0 ? (
        <View style={{ alignItems: "center", paddingTop: 40 }}>
          <ThemedText style={{ color: C.muted }}>No transactions found.</ThemedText>
        </View>
      ) : (
        filteredTx.map((tx: any, i: number) => <TxItem key={tx?.id ?? i} tx={tx} C={C} />)
      )}

      <View style={{ height: 40 }} />
    </>
  );
};

export default HistoryTab;
