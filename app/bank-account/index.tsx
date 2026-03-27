import { BraneButton } from "@/components/brane-button";
import { EmptyState } from "@/components/empty-state";
import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Add, Bank, TickCircle, Trash } from "iconsax-react-native";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const maskAccountNumber = (num: string): string => {
  if (!num || num.length < 4) return num;
  return `••••  ${num.slice(-4)}`;
};

export default function BankAccountScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [accounts, setAccounts] = useState<IBankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<IBankAccount | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const fetchAccounts = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const response: any = await BaseRequest.get(
        TRANSACTION_SERVICE.BENEFICIARIES,
      );
      const records = toArray(response).map((item: any, index: number) => ({
        id: String(item?.id ?? item?._id ?? index),
        bankName: String(
          item?.bankName ?? item?.bank ?? item?.institution ?? "Bank",
        ),
        accountNumber: String(item?.accountNumber ?? item?.account ?? ""),
        accountName: String(item?.accountName ?? item?.name ?? ""),
      }));
      setAccounts(records);
    } catch (error) {
      catchError(error);
      setAccounts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await BaseRequest.delete(
        `${TRANSACTION_SERVICE.BENEFICIARIES}/${pendingDelete.id}`,
      );
      setShowDeleteSuccess(true);
      setPendingDelete(null);

      // Auto-close success modal and refresh list after delay
      setTimeout(() => {
        setShowDeleteSuccess(false);
        fetchAccounts(true);
      }, 2000);
    } catch (error) {
      catchError(error);
    } finally {
      setIsDeleting(false);
    }
  }, [pendingDelete, fetchAccounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const renderItem = useCallback(
    ({ item }: { item: IBankAccount }) => (
      <View
        style={StyleSheet.flatten([
          styles.card,
          { borderColor: C.border, backgroundColor: C.inputBg },
        ])}
        row
        aligned
        spaced
      >
        <View
          style={StyleSheet.flatten([
            styles.bankIcon,
            { backgroundColor: C.googleBg },
          ])}
          align='center'
          justify='center'
        >
          <Bank size={20} color={C.primary} variant='TwoTone' />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <ThemedText
            type='defaultSemiBold'
            style={{ fontSize: 14, color: C.text }}
          >
            {item.bankName}
          </ThemedText>
          <ThemedText style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            {maskAccountNumber(item.accountNumber)}
          </ThemedText>
          <ThemedText style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            {item.accountName}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: C.error + "20" }]}
          activeOpacity={0.7}
          onPress={() => setPendingDelete(item)}
        >
          <Trash size={18} color={C.error} variant='TwoTone' />
        </TouchableOpacity>
      </View>
    ),
    [C],
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>
      <Header title='Bank Accounts' />

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='small' color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchAccounts(true)}
              tintColor={C.primary}
            />
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <EmptyState>
                <View style={{ gap: 4, alignItems: "center" }}>
                  <ThemedText
                    type='defaultSemiBold'
                    style={{ fontSize: 14, color: C.text }}
                  >
                    No bank accounts added
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      textAlign: "center",
                      paddingHorizontal: 32,
                    }}
                  >
                    Add a bank account to enable withdrawals
                  </ThemedText>
                </View>
                <BraneButton
                  text='Add Bank Account'
                  onPress={() => router.push("/add-funds/bank")}
                  width={200}
                  style={{ marginTop: 8 }}
                />
              </EmptyState>
            </View>
          }
        />
      )}

      {accounts.length > 0 && (
        <View style={styles.fab}>
          <BraneButton
            text='Add Bank Account'
            onPress={() => router.push("/add-funds/bank")}
            leftIcon={<Add size={18} color={C.googleBg} />}
          />
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={!!pendingDelete}
        transparent
        animationType='fade'
        onRequestClose={() => setPendingDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={StyleSheet.flatten([
              styles.modalCard,
              { backgroundColor: C.background },
            ])}
          >
            {/* Trash Icon */}
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <View
                style={[styles.iconCircle, { backgroundColor: C.error + "15" }]}
              >
                <Trash size={28} color={C.error} />
              </View>
            </View>

            <ThemedText
              type='defaultSemiBold'
              style={{ fontSize: 16, color: C.text, textAlign: "center" }}
            >
              Remove Bank Account
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 13,
                color: C.muted,
                textAlign: "center",
                marginTop: 8,
                lineHeight: 20,
              }}
            >
              Are you sure you want to remove this bank account?
            </ThemedText>
            <View style={styles.modalActions} row>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { borderColor: C.border, borderWidth: 1 },
                ]}
                activeOpacity={0.7}
                onPress={() => setPendingDelete(null)}
                disabled={isDeleting}
              >
                <ThemedText
                  type='defaultSemiBold'
                  style={{ fontSize: 14, color: C.text }}
                >
                  Cancel
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: C.error }]}
                activeOpacity={0.7}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size='small' color='#FFFFFF' />
                ) : (
                  <ThemedText
                    type='defaultSemiBold'
                    style={{ fontSize: 14, color: "#FFFFFF" }}
                  >
                    Remove
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Success Modal */}
      <Modal
        visible={showDeleteSuccess}
        transparent
        animationType='fade'
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View
            style={StyleSheet.flatten([
              styles.modalCard,
              { backgroundColor: C.background },
            ])}
          >
            {/* Success Icon */}
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: C.primary + "15" },
                ]}
              >
                <TickCircle size={28} color={C.primary} />
              </View>
            </View>

            <ThemedText
              type='defaultSemiBold'
              style={{ fontSize: 16, color: C.text, textAlign: "center" }}
            >
              Bank Account Removed
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 13,
                color: C.muted,
                textAlign: "center",
                marginTop: 8,
                lineHeight: 20,
              }}
            >
              Your bank account has been successfully removed.
            </ThemedText>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 16,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#013D254D",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  modalActions: {
    gap: 10,
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
