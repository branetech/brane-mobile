import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { SearchNormal1, Trash, Plus } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    RefreshControl,
    StyleSheet,
    TextInput,
    View as RNView,
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
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setIsDeleting(true);
      try {
        await BaseRequest.delete(`${MOBILE_SERVICE.BENEFICIARY}/${item.id}`);
        showSuccess("Beneficiary removed successfully");
        setDeleteConfirmModal(false);
        setSelectedBeneficiary(null);
        fetchBeneficiaries(true);
      } catch (error) {
        catchError(error);
      } finally {
        setIsDeleting(false);
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
                style={[
                  styles.deleteButton,
                  { backgroundColor: C.error + "20" },
                ]}
                onPress={() => {
                  setSelectedBeneficiary(item);
                  setDeleteConfirmModal(true);
                }}
              >
                <Trash size={16} color={C.error} />
              </Pressable>
            </View>
          )}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteConfirmModal}
        transparent
        animationType='fade'
        onRequestClose={() => setDeleteConfirmModal(false)}
      >
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={() => setDeleteConfirmModal(false)}
        >
          <RNView
            style={
              [
                styles.confirmCard,
                { backgroundColor: C.background, borderColor: C.border },
              ] as any
            }
          >
            <ThemedText
              type='defaultSemiBold'
              style={[styles.confirmTitle, { color: C.text }]}
            >
              Remove Beneficiary?
            </ThemedText>
            <ThemedText style={[styles.confirmText, { color: C.muted }]}>
              {selectedBeneficiary ? `Remove ${selectedBeneficiary.name} from your beneficiaries?` : "Are you sure you want to remove this beneficiary?"}
            </ThemedText>

            <RNView style={styles.confirmActions}>
              <BraneButton
                text='Remove'
                onPress={() => selectedBeneficiary && onDeleteBeneficiary(selectedBeneficiary)}
                loading={isDeleting}
                disabled={isDeleting}
                backgroundColor={C.error}
                style={{ flex: 1 }}
                height={44}
                radius={8}
              />
              <BraneButton
                text='Cancel'
                onPress={() => setDeleteConfirmModal(false)}
                disabled={isDeleting}
                backgroundColor={C.primary + "20"}
                textColor={C.primary}
                style={{ flex: 1, marginLeft: 12 }}
                height={44}
                radius={8}
              />
            </RNView>
          </RNView>
        </Pressable>
      </Modal>
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
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmCard: {
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  confirmTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 12,
  },
});
