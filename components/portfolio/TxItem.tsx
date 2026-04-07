import React from "react";
import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { priceFormatter } from "@/utils/helpers";
import moment from "moment";
import styles from "./holdingStyles";

interface TxItemProps {
  tx: any;
  C: any;
}

const TxItem: React.FC<TxItemProps> = ({ tx, C }) => {
  const type = String(tx?.type ?? tx?.transactionType ?? "").toLowerCase();
  const isDividend = type.includes("dividend") || type.includes("return");
  const isBuy = type.includes("buy") || type.includes("purchase");
  const amt = Number(tx?.amount ?? tx?.value ?? 0);
  const label = isDividend
    ? "Dividend Earned"
    : isBuy
    ? "Stock Purchased"
    : "Stock Sold";
  const date = moment(tx?.createdAt ?? tx?.date).format(
    "MMM DD, YYYY [at] h:mm A",
  );
  const units = tx?.quantity ?? tx?.units;

  return (
    <View style={styles.txItem}>
      {/* Icon */}
      <View
        style={[
          styles.txIconWrap,
          { backgroundColor: isDividend ? "#FFF3E0" : "#E8F5F0" },
        ]}
      >
        <ThemedText style={{ fontSize: 18 }}>
          {isDividend ? "🎁" : isBuy ? "📊" : "📉"}
        </ThemedText>
      </View>

      {/* Label + date */}
      <View style={{ flex: 1 }}>
        <ThemedText style={[styles.txLabel, { color: C.text }]}>
          {label}
        </ThemedText>
        <ThemedText style={[styles.txDate, { color: C.muted }]}>
          {date}
        </ThemedText>
      </View>

      {/* Amount + units/date */}
      <View style={{ alignItems: "flex-end" }}>
        <ThemedText
          style={[styles.txAmt, { color: amt >= 0 ? "#0C8F5C" : "#D50000" }]}
        >
          {amt >= 0 ? "+" : "−"}
          {priceFormatter(Math.abs(amt), 2)}
        </ThemedText>
        {units != null ? (
          <ThemedText style={[styles.txDate, { color: C.muted }]}>
            {units} units
          </ThemedText>
        ) : (
          <ThemedText style={[styles.txDate, { color: C.muted }]}>
            {date}
          </ThemedText>
        )}
      </View>
    </View>
  );
};

export default TxItem;
