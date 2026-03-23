import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { User } from "iconsax-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export interface Beneficiary {
  id?: string;
  name?: string;
  accountNumber?: string;
  bankName?: string;
  bankCode?: string;
  // Alternative field names from API
  account_number?: string;
  bank_name?: string;
  bank_code?: string;
}

interface BeneficiarySelectorProps {
  beneficiaries: Beneficiary[];
  selectedId?: string;
  onSelect: (beneficiary: Beneficiary) => void;
  onAddNew?: () => void;
  loading?: boolean;
}

export function BeneficiarySelector({
  beneficiaries,
  selectedId,
  onSelect,
  onAddNew,
  loading = false,
}: BeneficiarySelectorProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [search, setSearch] = useState("");

  const filteredBeneficiaries = beneficiaries.filter(
    (b) =>
      ((b.name || b.name)?.toLowerCase() || "").includes(
        search.toLowerCase(),
      ) || (b.accountNumber || b.account_number || "").includes(search),
  );

  if (loading) {
    return (
      <View style={styles.centerLoader}>
        <ActivityIndicator color={C.primary} size='small' />
      </View>
    );
  }

  return (
    <View>
      <ThemedText style={[styles.title, { color: C.text }]}>
        Select Beneficiary
      </ThemedText>

      <FormInput
        placeholder='Search by name or phone number'
        value={search}
        onChangeText={setSearch}
        inputContainerStyle={[
          styles.searchContainer,
          { backgroundColor: C.inputBg, borderColor: C.border },
        ]}
        inputStyle={{ color: C.text }}
      />

      {filteredBeneficiaries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.avatar, { backgroundColor: C.inputBg }]}>
            <User size={32} color={C.muted} />
          </View>
          <ThemedText style={[styles.emptyText, { color: C.muted }]}>
            No saved beneficiary
          </ThemedText>
          {onAddNew && (
            <TouchableOpacity
              onPress={onAddNew}
              style={[styles.addButton, { backgroundColor: C.primary }]}
            >
              <ThemedText style={[styles.addButtonText]}>
                Add New Recipient
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View>
          {filteredBeneficiaries.map((beneficiary) => (
            <TouchableOpacity
              key={beneficiary.id}
              onPress={() => onSelect(beneficiary)}
              style={[
                styles.beneficiaryRow,
                {
                  backgroundColor: C.inputBg,
                  borderColor:
                    selectedId === beneficiary.id ? C.primary : C.border,
                  borderWidth: selectedId === beneficiary.id ? 2 : 1,
                },
              ]}
            >
              <View
                style={[styles.avatar, { backgroundColor: C.primary + "20" }]}
              >
                <User size={20} color={C.primary} />
              </View>
              <View style={styles.beneficiaryInfo}>
                <ThemedText
                  style={[styles.beneficiaryName, { color: C.text }]}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {beneficiary.name || beneficiary.name || ""}
                </ThemedText>
                <ThemedText
                  style={[styles.beneficiaryBank, { color: C.muted }]}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {beneficiary.bankName || beneficiary.bank_name || ""}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  beneficiaryRow: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    borderRadius: 50,
    padding: 8,
    marginRight: 12,
  },
  beneficiaryInfo: {
    flex: 1,
  },
  beneficiaryName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  beneficiaryBank: {
    fontSize: 12,
  },
  centerLoader: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 20,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
