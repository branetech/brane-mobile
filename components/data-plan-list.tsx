import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Check } from "iconsax-react-native";
import React from "react";
import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export interface DataPlan {
  id: string;
  name: string;
  size: string;
  price: number;
  validity?: string;
  description?: string;
}

interface DataPlansListProps {
  plans: DataPlan[];
  selectedId?: string;
  onSelect: (plan: DataPlan) => void;
  isLoading?: boolean;
}

export const DataPlansList: React.FC<DataPlansListProps> = ({
  plans,
  selectedId,
  onSelect,
  isLoading = false,
}) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const renderItem: ListRenderItem<DataPlan> = ({ item }) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          {
            borderColor: isSelected ? "#013D25" : C.border,
            backgroundColor: isSelected ? "#D2F1E4" : C.inputBackground,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.planContent}>
          <View style={styles.planHeader}>
            <View style={{ flex: 1 }}>
              <ThemedText type='defaultSemiBold' style={styles.planName}>
                {item.name}
              </ThemedText>
              <ThemedText style={[styles.planSize, { color: C.muted }]}>
                {item.size}
                {item.validity ? ` • ${item.validity}` : ""}
              </ThemedText>
              {item.description && (
                <ThemedText
                  style={[styles.planDescription, { color: C.muted }]}
                >
                  {item.description}
                </ThemedText>
              )}
            </View>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: isSelected ? "#013D25" : C.border,
                  backgroundColor: isSelected ? "#013D25" : "transparent",
                },
              ]}
            >
              {isSelected && <Check size={16} color='#fff' variant='Bold' />}
            </View>
          </View>

          <ThemedText
            type='defaultSemiBold'
            style={[
              styles.planPrice,
              { color: isSelected ? "#013D25" : C.text },
            ]}
          >
            ₦{item.price.toLocaleString()}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={plans}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      scrollEnabled={false}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  separator: {
    height: 8,
  },
  planCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 0,
  },
  planContent: {
    gap: 12,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  planName: {
    fontSize: 15,
    marginBottom: 4,
  },
  planSize: {
    fontSize: 12,
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 11,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
});
