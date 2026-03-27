import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowUp2 } from "iconsax-react-native";

interface MTNCardProps {
  id: string;
  companyName: string;
  percentage: string;
  price: string;
  rhbc: string;
  tickerSymbol: string;
  onClick: (cardData: MTNCardProps) => void;
}

const MTNCard: React.FC<MTNCardProps> = ({
  id,
  companyName,
  percentage,
  price,
  rhbc,
  tickerSymbol,
  onClick,
}) => {
  const handleClick = () => {
    onClick({
      id,
      companyName,
      percentage,
      price,
      rhbc,
      tickerSymbol,
      onClick,
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleClick}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={styles.tickerBadge}>
          <Text style={styles.tickerBadgeText}>{tickerSymbol}</Text>
        </View>
        <View>
          <Text style={styles.tickerSymbol}>{tickerSymbol}</Text>
          <Text style={styles.companyName}>{companyName}</Text>
        </View>
      </View>
      <View style={styles.percentageSection}>
        <ArrowUp2 size={12} color='#008753' variant='Bold' />
        <Text style={styles.percentageText}>{percentage}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.rhbc}>{rhbc}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MTNCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tickerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  tickerBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#0B0014",
  },
  tickerSymbol: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  companyName: {
    fontSize: 12,
    color: "#6b7280",
  },
  percentageSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 12,
    color: "#008753",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  rhbc: {
    fontSize: 12,
    color: "#6b7280",
  },
});
