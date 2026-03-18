import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  green: "#1a6644",
  text: "#1a1a1a",
  subtext: "#9e9e9e",
  iconBg: "#f0f0f0",
  white: "#fff",
};

type Transaction = {
  id: string;
  // add your transaction fields here
};

type Props = {
  transactions?: Transaction[];
  onSeeAll?: () => void;
};

export default function Transactions() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transaction</Text>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {transactions.length === 0 && (
        <View style={styles.emptyState}>
          {/* <EmptyState/> */}
          <Text style={styles.emptyText}>
            After initiating transactions, you can access the{"\n"}
            history of your transactions here.
          </Text>
        </View>
      )}

      {/* Transaction list goes here when transactions.length > 0 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.green,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.subtext,
    textAlign: "center",
    lineHeight: 20,
  },
});