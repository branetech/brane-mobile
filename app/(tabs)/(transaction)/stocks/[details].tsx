import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, priceFormatter } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Scheme = "light" | "dark";

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const getTransactionTypeColor = (type: string) => {
  const t = String(type || "").toLowerCase();
  if (t.includes("buy") || t.includes("purchase"))
    return { color: "#09734C", bg: "#EAF8F1" };
  if (t.includes("sell")) return { color: "#D50000", bg: "#FDECEC" };
  return { color: "#B5760A", bg: "#FFF7E8" };
};

export default function StockTransactionScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const { details } = useLocalSearchParams();
  const detailsStr = String(details || "");
  const isAll = detailsStr === "all";

  const [transactions, setTransactions] = useState<any[]>([]);
  const [singleTx, setSingleTx] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(
    async (refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      try {
        if (isAll) {
          const res: any = await BaseRequest.get(
            TRANSACTION_SERVICE.STOCK_TRANSACTION_LIST,
          );
          setTransactions(toArray(res));
        } else {
          const res: any = await BaseRequest.get(
            TRANSACTION_SERVICE.SINGLE(detailsStr),
          );
          setSingleTx(res?.data || res);
        }
      } catch (error) {
        catchError(error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [detailsStr, isAll],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderListItem = ({ item }: { item: any }) => {
    const companyName = String(
      item?.companyName || item?.name || item?.stockName || "-",
    );
    const ticker = String(
      item?.tickerSymbol || item?.ticker || item?.symbol || "",
    );
    const txType = String(
      item?.transactionType || item?.type || item?.action || "-",
    );
    const amount = Number(
      item?.amount || item?.totalAmount || item?.price || 0,
    );
    const quantity = Number(item?.quantity || item?.units || 0);
    const date = item?.createdAt || item?.date || item?.transactionDate;
    const typeColors = getTransactionTypeColor(txType);

    return (
      <TouchableOpacity
        style={{
          ...StyleSheet.flatten(styles.listItem),
          borderColor: C.border,
        }}
        activeOpacity={0.7}
        onPress={() =>
          router.push({
            pathname: "/transaction/stocks/[details]",
            params: { details: String(item?.id || item?._id || "") },
          })
        }
      >
        <View style={styles.itemLeft}>
          <View
            style={{
              ...StyleSheet.flatten(styles.typePill),
              backgroundColor: typeColors.bg,
            }}
          >
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.typeText),
                color: typeColors.color,
              }}
            >
              {txType.toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText
            style={{ ...StyleSheet.flatten(styles.companyName), color: C.text }}
          >
            {companyName}
          </ThemedText>
          {!!ticker && (
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.tickerText),
                color: C.muted,
              }}
            >
              {ticker.toUpperCase()}
            </ThemedText>
          )}
          {quantity > 0 && (
            <ThemedText
              style={{ ...StyleSheet.flatten(styles.quantity), color: C.muted }}
            >
              {quantity} {quantity === 1 ? "unit" : "units"}
            </ThemedText>
          )}
        </View>
        <View style={styles.itemRight}>
          <ThemedText
            style={{ ...StyleSheet.flatten(styles.amount), color: C.text }}
          >
            {priceFormatter(amount, 2)}
          </ThemedText>
          <ThemedText
            style={{ ...StyleSheet.flatten(styles.dateText), color: C.muted }}
          >
            {formatDate(String(date || ""), "MMM dd, yyyy")}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetail = () => {
    if (!singleTx) return null;
    const txType = String(
      singleTx?.transactionType || singleTx?.type || singleTx?.action || "-",
    );
    const typeColors = getTransactionTypeColor(txType);
    const amount = Number(
      singleTx?.amount || singleTx?.totalAmount || singleTx?.price || 0,
    );

    return (
      <View style={styles.detailContent}>
        <View
          style={{
            ...StyleSheet.flatten(styles.detailCard),
            borderColor: C.border,
          }}
        >
          <ThemedText
            style={{
              ...StyleSheet.flatten(styles.detailTitle),
              color: C.muted,
            }}
          >
            {singleTx?.companyName ||
              singleTx?.stockName ||
              "Stock Transaction"}
          </ThemedText>
          <ThemedText
            style={{
              ...StyleSheet.flatten(styles.detailAmount),
              color: C.text,
            }}
          >
            {priceFormatter(amount, 2)}
          </ThemedText>
          <View
            style={{
              ...StyleSheet.flatten(styles.typePill),
              backgroundColor: typeColors.bg,
            }}
          >
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.typeText),
                color: typeColors.color,
              }}
            >
              {txType.toUpperCase()}
            </ThemedText>
          </View>
        </View>

        <View
          style={{
            ...StyleSheet.flatten(styles.detailRows),
            borderColor: C.border,
          }}
        >
          <DetailRow
            label='Ticker'
            value={String(singleTx?.tickerSymbol || singleTx?.ticker || "-")}
            C={C}
          />
          <DetailRow
            label='Quantity'
            value={String(singleTx?.quantity || singleTx?.units || "-")}
            C={C}
          />
          <DetailRow
            label='Price per Unit'
            value={priceFormatter(
              Number(singleTx?.pricePerUnit || singleTx?.unitPrice || 0),
              2,
            )}
            C={C}
          />
          <DetailRow
            label='Total Amount'
            value={priceFormatter(amount, 2)}
            C={C}
          />
          <DetailRow
            label='Status'
            value={String(singleTx?.status || "-")}
            C={C}
          />
          <DetailRow
            label='Date'
            value={formatDate(
              String(singleTx?.createdAt || singleTx?.date || ""),
              "MMMM dd, yyyy | hh:mm a",
            )}
            C={C}
          />
          <DetailRow
            label='Reference'
            value={String(singleTx?.id || singleTx?._id || "-")}
            C={C}
          />
        </View>

        <BraneButton
          text='Buy More Stocks'
          onPress={() => router.push("/stock")}
          backgroundColor={C.primary}
          textColor='#D2F1E4'
          height={52}
          radius={12}
          width='100%'
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        ...StyleSheet.flatten(styles.screen),
        backgroundColor: C.background,
      }}
    >
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText
          style={{ ...StyleSheet.flatten(styles.headerTitle), color: C.text }}
        >
          {isAll ? "Stock Transactions" : "Transaction Detail"}
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='small' color={C.primary} />
        </View>
      ) : isAll ? (
        <FlatList
          data={transactions}
          keyExtractor={(item, idx) => String(item?.id || item?._id || idx)}
          renderItem={renderListItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchData(true)}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <ThemedText
                style={{
                  ...StyleSheet.flatten(styles.emptyText),
                  color: C.muted,
                }}
              >
                No stock transactions found
              </ThemedText>
            </View>
          }
        />
      ) : (
        <FlatList
          data={[1]}
          keyExtractor={() => "detail"}
          renderItem={renderDetail}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchData(true)}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  C,
}: {
  label: string;
  value: string;
  C: (typeof Colors)["light"];
}) {
  return (
    <View style={styles.detailRow}>
      <ThemedText
        style={{ ...StyleSheet.flatten(styles.detailLabel), color: C.muted }}
      >
        {label}
      </ThemedText>
      <ThemedText
        style={{ ...StyleSheet.flatten(styles.detailValue), color: C.text }}
      >
        {value || "-"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingHorizontal: 16, paddingBottom: 40, gap: 12 },
  listItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  itemLeft: { flex: 1, gap: 4 },
  itemRight: { alignItems: "flex-end", gap: 4 },
  typePill: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeText: { fontSize: 10, fontWeight: "700" },
  companyName: { fontSize: 14, fontWeight: "700" },
  tickerText: { fontSize: 11 },
  quantity: { fontSize: 11 },
  amount: { fontSize: 14, fontWeight: "700" },
  dateText: { fontSize: 11 },
  detailContent: { gap: 16, paddingHorizontal: 16, paddingBottom: 40 },
  detailCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    alignItems: "flex-start",
  },
  detailTitle: { fontSize: 13, fontWeight: "600" },
  detailAmount: { fontSize: 22, fontWeight: "800" },
  detailRows: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  detailLabel: { fontSize: 12, flex: 1 },
  detailValue: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  emptyWrap: { flex: 1, alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 14 },
});
