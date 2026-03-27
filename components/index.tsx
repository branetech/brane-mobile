import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

// ─── StockLine ────────────────────────────────────────────────────────────────

export const StockLine = ({ title, value }: { title: any; value: any }) => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  return (
    <View style={[styles.stockLineRow, { borderBottomColor: C.border }]}>
      <Text style={[styles.stockLineTitle, { color: C.muted }]}>{title}:</Text>
      <Text
        style={[styles.stockLineValue, { color: C.text }]}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {value}
      </Text>
    </View>
  );
};

// ─── StockInfoLine ────────────────────────────────────────────────────────────

export const StockInfoLine = ({
  className,
  value,
}: {
  className?: string;
  value: any;
}) => (
  <View>
    <Text style={styles.stockInfoLine}>{value}</Text>
  </View>
);

// ─── StockInfoLineTwo ─────────────────────────────────────────────────────────

export const StockInfoLineTwo = ({
  title,
  value,
  bracValue,
  className,
}: {
  title: string | ReactNode;
  value: any;
  bracValue?: any;
  className?: string;
}) => (
  <View style={styles.stockInfoLineTwoRow}>
    <Text
      style={[
        styles.stockInfoLineTwoTitle,
        className ? { color: className } : null,
      ]}
    >
      {title}
    </Text>
    <View style={styles.stockInfoLineTwoRight}>
      <Text style={styles.stockInfoLineTwoValue}>{value}</Text>
      {bracValue && (
        <Text style={styles.stockInfoLineTwoBrac}> ({bracValue})</Text>
      )}
    </View>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // StockLine
  stockLineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  stockLineTitle: {
    fontSize: 12,
  },
  stockLineValue: {
    fontWeight: "500",
    fontSize: 12,
    width: "60%",
    textAlign: "right",
  },

  // StockInfoLine
  stockInfoLine: {
    fontSize: 12,
    fontWeight: "500",
  },

  // StockInfoLineTwo
  stockInfoLineTwoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    
  },
  stockInfoLineTwoTitle: {
    color: "#85808A",
    fontSize: 12,
    fontWeight: "400",
  },
  stockInfoLineTwoRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockInfoLineTwoValue: {
    color: "#013D25",
    fontWeight: "500",
    fontSize: 12,
  },
  stockInfoLineTwoBrac: {
    color: "#013D25",
    fontWeight: "500",
    fontSize: 12,
  },
});
