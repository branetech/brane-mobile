import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { TrendDown, TrendUp } from "iconsax-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  previousPrice?: number;
  changePercent?: number;
  quantity?: number;
  totalValue?: number;
  icon?: string;
}

interface StockCardProps {
  stock: Stock;
  onPress?: () => void;
  showQuantity?: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onPress,
  showQuantity = false,
}) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const isPositive = stock.changePercent ? stock.changePercent >= 0 : true;
  const changeColor = isPositive ? "#013D25" : "#CB010B";
  const trendIcon = isPositive ? (
    <TrendUp size={16} color='#013D25' variant='Bold' />
  ) : (
    <TrendDown size={16} color='#CB010B' variant='Bold' />
  );

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: C.border,
          backgroundColor: C.inputBackground,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {stock.icon ? (
              <ThemedText style={styles.icon}>{stock.icon}</ThemedText>
            ) : (
              <View
                style={[styles.iconPlaceholder, { backgroundColor: C.border }]}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText
              type='defaultSemiBold'
              style={[styles.symbol, { color: C.text }]}
            >
              {stock.symbol}
            </ThemedText>
            <ThemedText style={[styles.name, { color: C.muted }]}>
              {stock.name}
            </ThemedText>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <ThemedText
            type='defaultSemiBold'
            style={[styles.price, { color: C.text }]}
          >
            ₦{stock.currentPrice.toLocaleString()}
          </ThemedText>
          {stock.changePercent !== undefined && (
            <View style={styles.changeRow}>
              {trendIcon}
              <ThemedText style={[styles.change, { color: changeColor }]}>
                {isPositive ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      {showQuantity && stock.quantity !== undefined && (
        <View style={[styles.footer, { borderTopColor: C.border }]}>
          <View>
            <ThemedText style={[styles.quantityLabel, { color: C.muted }]}>
              Quantity
            </ThemedText>
            <ThemedText
              type='defaultSemiBold'
              style={[styles.quantity, { color: C.text }]}
            >
              {stock.quantity} shares
            </ThemedText>
          </View>
          {stock.totalValue !== undefined && (
            <View>
              <ThemedText style={[styles.valueLabel, { color: C.muted }]}>
                Total Value
              </ThemedText>
              <ThemedText
                type='defaultSemiBold'
                style={[styles.value, { color: C.text }]}
              >
                ₦{stock.totalValue.toLocaleString()}
              </ThemedText>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 22,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  symbol: {
    fontSize: 14,
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
  },
  priceContainer: {
    alignItems: "flex-end",
    gap: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  quantityLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  quantity: {
    fontSize: 13,
  },
  valueLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  value: {
    fontSize: 13,
  },
});
