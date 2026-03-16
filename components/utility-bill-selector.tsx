import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ArrowRight } from "iconsax-react-native";
import React from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export interface UtilityBill {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  shortLabel?: string;
}

interface UtilityBillSelectorProps {
  bills: UtilityBill[];
  onSelect: (bill: UtilityBill) => void;
  isLoading?: boolean;
  columns?: number;
}

export const UtilityBillSelector: React.FC<UtilityBillSelectorProps> = ({
  bills,
  onSelect,
  isLoading = false,
  columns = 2,
}) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const renderItem: ListRenderItem<UtilityBill> = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.billCard,
          {
            backgroundColor: C.inputBackground,
            borderColor: C.border,
          },
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        {item.icon && (
          <ThemedText style={styles.billIcon}>{item.icon}</ThemedText>
        )}
        <ThemedText
          type='defaultSemiBold'
          style={[styles.billName, { color: C.text }]}
        >
          {item.name}
        </ThemedText>
        {item.description && (
          <ThemedText style={[styles.billDescription, { color: C.muted }]}>
            {item.description}
          </ThemedText>
        )}
        <View style={styles.arrowContainer}>
          <ArrowRight size={16} color='#013D25' />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={bills}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={columns}
      scrollEnabled={false}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  columnWrapper: {
    gap: 12,
  },
  billCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 8,
    position: "relative",
    minHeight: 120,
    justifyContent: "center",
  },
  billIcon: {
    fontSize: 32,
  },
  billName: {
    fontSize: 14,
    textAlign: "center",
  },
  billDescription: {
    fontSize: 10,
    textAlign: "center",
  },
  arrowContainer: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
