import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { EmptyState } from "@/components/empty-state";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Add, Card, Trash } from "iconsax-react-native";
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

interface ISavedCard {
  id: string;
  last4: string;
  cardType: string;
  expiryMonth: string;
  expiryYear: string;
  bank: string;
}

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const maskCardNumber = (last4: string): string => `●●●●  ●●●●  ●●●●  ${last4}`;

const formatExpiry = (month: string, year: string): string => {
  if (!month && !year) return "";
  return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
};

export default function SavedCardsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [cards, setCards] = useState<ISavedCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ISavedCard | null>(null);

  const fetchCards = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const response: any = await BaseRequest.get(TRANSACTION_SERVICE.CARDS);
      const records = toArray(response).map((item: any, index: number) => ({
        id: String(item?.id ?? item?._id ?? index),
        last4: String(item?.last4 ?? item?.lastFour ?? item?.last_four ?? ""),
        cardType: String(
          item?.cardType ?? item?.card_type ?? item?.brand ?? item?.type ?? "",
        ),
        expiryMonth: String(
          item?.expiryMonth ?? item?.expiry_month ?? item?.exp_month ?? "",
        ),
        expiryYear: String(
          item?.expiryYear ?? item?.expiry_year ?? item?.exp_year ?? "",
        ),
        bank: String(item?.bank ?? item?.bankName ?? item?.issuer ?? ""),
      }));
      setCards(records);
    } catch (error) {
      catchError(error);
      setCards([]);
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
        TRANSACTION_SERVICE.DELETE_SINGLE_CARD(pendingDelete.id),
      );
      showSuccess("Card removed successfully");
      setPendingDelete(null);
      fetchCards(true);
    } catch (error) {
      catchError(error);
    } finally {
      setIsDeleting(false);
    }
  }, [pendingDelete, fetchCards]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const renderItem = useCallback(
    ({ item }: { item: ISavedCard }) => (
      <View
        style={StyleSheet.flatten([styles.card, { borderColor: C.border }])}
        row
        aligned
        spaced
      >
        <View
          style={StyleSheet.flatten([
            styles.cardIcon,
            { backgroundColor: C.googleBg },
          ])}
          align='center'
          justify='center'
        >
          <Card size={20} color='#013D25' variant='TwoTone' />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <ThemedText
            type='defaultSemiBold'
            style={{ fontSize: 13, color: C.text, letterSpacing: 1 }}
          >
            {maskCardNumber(item.last4)}
          </ThemedText>
          <View row style={{ gap: 8, marginTop: 4 }}>
            {!!item.cardType && (
              <ThemedText style={{ fontSize: 12, color: C.muted }}>
                {item.cardType}
              </ThemedText>
            )}
            {!!(item.expiryMonth || item.expiryYear) && (
              <ThemedText style={{ fontSize: 12, color: C.muted }}>
                {formatExpiry(item.expiryMonth, item.expiryYear)}
              </ThemedText>
            )}
          </View>
          {!!item.bank && (
            <ThemedText style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              {item.bank}
            </ThemedText>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          activeOpacity={0.7}
          onPress={() => setPendingDelete(item)}
        >
          <Trash size={18} color='#CB010B' variant='TwoTone' />
        </TouchableOpacity>
      </View>
    ),
    [C],
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned spaced>
        <Back />
        <ThemedText type='defaultSemiBold' style={styles.headerTitle}>
          Saved Cards
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='small' color='#013D25' />
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchCards(true)}
              tintColor='#013D25'
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
                    No saved cards
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: C.muted,
                      textAlign: "center",
                      paddingHorizontal: 32,
                    }}
                  >
                    Add a card to make payments faster
                  </ThemedText>
                </View>
                <BraneButton
                  text='Add Card'
                  onPress={() => router.push("/add-funds/add-card")}
                  width={160}
                  style={{ marginTop: 8 }}
                />
              </EmptyState>
            </View>
          }
        />
      )}

      {cards.length > 0 && (
        <View style={styles.fab}>
          <BraneButton
            text='Add Card'
            onPress={() => router.push("/add-funds/add-card")}
            leftIcon={<Add size={18} color='#fff' />}
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
            <ThemedText
              type='defaultSemiBold'
              style={{ fontSize: 16, color: C.text, textAlign: "center" }}
            >
              Remove Card
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
              Are you sure you want to remove this card?
            </ThemedText>
            <View style={styles.modalActions} row>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { borderColor: C.border, borderWidth: 1 },
                ]}
                activeOpacity={0.7}
                onPress={() => setPendingDelete(null)}
              >
                <ThemedText
                  type='defaultSemiBold'
                  style={{ fontSize: 14, color: C.text }}
                >
                  Cancel
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.removeBtn]}
                activeOpacity={0.7}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size='small' color='#fff' />
                ) : (
                  <ThemedText
                    type='defaultSemiBold'
                    style={{ fontSize: 14, color: "#fff" }}
                  >
                    Remove
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
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
    backgroundColor: "#FFFFFF",
  },
  cardIcon: {
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
    backgroundColor: "#FFF3F3",
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
    backgroundColor: "rgba(0,0,0,0.45)",
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
  removeBtn: {
    backgroundColor: "#CB010B",
  },
});
