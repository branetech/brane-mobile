import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { SearchNormal1, Trash } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Beneficiary = {
  id: string;
  name: string;
  phone: string;
  category?: string;
};

const toArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.records)) return value.records;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.records)) return value.data.records;
  return [];
};

export default function ManageBeneficiaryScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  const fetchBeneficiaries = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const response: any = await BaseRequest.get(MOBILE_SERVICE.BENEFICIARY);
      const records = toArray(response);
      const normalized = records.map((item: any, index: number) => ({
        id: String(item?.id ?? item?._id ?? index),
        name: String(item?.name ?? item?.beneficiaryName ?? "Unknown"),
        phone: String(item?.phone ?? item?.phoneNumber ?? ""),
        category: item?.category,
      }));
      setBeneficiaries(normalized);
    } catch (error) {
      catchError(error);
      setBeneficiaries([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const onDeleteBeneficiary = useCallback(
    async (item: Beneficiary) => {
      try {
        await BaseRequest.delete(`${MOBILE_SERVICE.BENEFICIARY}/${item.id}`);
        showSuccess("Beneficiary deleted successfully");
        fetchBeneficiaries(true);
      } catch (error) {
        catchError(error);
      }
    },
    [fetchBeneficiaries],
  );

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  const filteredBeneficiaries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return beneficiaries;
    return beneficiaries.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        String(item.category || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [beneficiaries, search]);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={styles.title}>
          Manage Beneficiaries
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <View style={[styles.searchWrap, { borderColor: C.border }]} row aligned>
        <SearchNormal1 size={18} color={C.muted} />
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder='Search name or phone'
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='small' color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredBeneficiaries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchBeneficiaries(true)}
              tintColor={C.primary}
            />
          }
          ListEmptyComponent={
            <ThemedText style={[styles.emptyText, { color: C.muted }]}>
              No beneficiaries found.
            </ThemedText>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { borderColor: C.border, backgroundColor: C.screen },
              ]}
              row
              aligned
              spaced
            >
              <View style={{ flex: 1 }}>
                <ThemedText type='defaultSemiBold'>{item.name}</ThemedText>
                <ThemedText style={[styles.meta, { color: C.muted }]}>
                  {item.phone}
                </ThemedText>
                {!!item.category && (
                  <ThemedText style={[styles.meta, { color: C.muted }]}>
                    {item.category}
                  </ThemedText>
                )}
              </View>
              <Pressable
                style={styles.deleteButton}
                onPress={() => onDeleteBeneficiary(item)}
              >
                <Trash size={16} color='#D50000' />
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
  },
  searchWrap: {
    marginTop: 18,
    marginHorizontal: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
    height: 46,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    color: "#0B0014",
    fontSize: 14,
  },
  loaderWrap: {
    marginTop: 24,
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  meta: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCE4E4",
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
  },
});
