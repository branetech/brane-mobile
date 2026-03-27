import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const BracsAllocationDisplay = ({ bracs }: { bracs: number }) => {
  const { data: allocatedBracsResponse } = useRequest(
    TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION,
    {},
  );
  const { indexFund, stockAsset, goldAsset, fixedIncome } =
    allocatedBracsResponse || {};

  const calculateAllocation = (percentage: number) => {
    if (!bracs || Number(percentage) < 0) return 0;
    return Number((Number(percentage) / 100) * bracs).toFixed(3);
  };

  const detailsList = [
    {
      label: `Stocks (${stockAsset || 100}%)`,
      value: calculateAllocation(stockAsset || 100),
      suffix: "Bracs",
    },
    {
      label: `ETFs (${indexFund || 0}%)`,
      value: calculateAllocation(indexFund || 0),
      suffix: "Bracs",
    },
    {
      label: `Gold (${goldAsset || 0}%)`,
      value: calculateAllocation(goldAsset || 0),
      suffix: "Bracs",
    },
    {
      label: `Fixed Income (${fixedIncome || 0}%)`,
      value: calculateAllocation(fixedIncome || 0),
      suffix: "Bracs",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your bracs allocation</Text>
      <View style={styles.card}>
        {detailsList.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>
              {item.value || 0} {item.suffix || ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 12,
    color: "#0B0014",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FBFDFC",
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E7E6E8",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 24,
    color: "#013D25",
  },
  value: {
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 24,
    color: "#013D25",
  },
});
