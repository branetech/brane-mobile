import Back from "@/components/back";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest from "@/services";
import { MOBILE_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, parseTransaction, priceFormatter } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";
import { useLocalSearchParams, useRouter } from "expo-router";
import { InfoCircle } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getStatusStyles = (status?: string, C?: any) => {
  const key = String(status || "").toLowerCase();
  if (key.includes("success")) {
    return {
      bg: C?.googleBg,
      color: C?.primary,
      text: "Successful",
    };
  }
  if (key.includes("pending")) {
    return { bg: "#FFF7E8", color: "#B5760A", text: "Pending" };
  }
  return { bg: "#FCE4E4", color: "#C53333", text: "Failed" };
};

const formatSignedAmount = (transaction: ITransactionDetail | null) => {
  const amount = Number(transaction?.amount || 0);
  const txType = String(
    transaction?.actionType || transaction?.transactionType || "",
  ).toLowerCase();

  const isCredit =
    txType.includes("credit") ||
    txType.includes("top up") ||
    txType.includes("sell") ||
    txType.includes("reward");

  const sign = isCredit ? "+" : "-";
  return `${sign} ${priceFormatter(Math.abs(amount), 0)}`;
};

const getReferenceId = (transaction: ITransactionDetail | null) => {
  return String(
    transaction?.transactionId ||
      transaction?.paystackReference ||
      transaction?.id ||
      "-",
  );
};

const getBalanceValue = (
  meta: any,
  transaction: ITransactionDetail | null,
  key: string,
) => {
  return (
    meta?.[key] ??
    meta?.data?.[key] ??
    meta?.transaction?.[key] ??
    (transaction as any)?.[key] ??
    0
  );
};

export default function TransactionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const details = String(params.details || "");
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [transaction, setTransaction] = useState<ITransactionDetail | null>(
    null,
  );
  const [meta, setMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDetail = useCallback(
    async (refresh = false) => {
      if (!details) return;

      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const txRes: any = await BaseRequest.get(
          TRANSACTION_SERVICE.SINGLE(details),
        );
        const tx = txRes?.data || txRes;
        const parsed = parseTransaction(tx as ITransactionDetail);
        setTransaction(parsed);

        if (parsed?.transactionId) {
          const metaRes: any = await BaseRequest.get(
            MOBILE_SERVICE.TRANSACTION_ID(String(parsed.transactionId)),
          );
          setMeta(metaRes?.data || metaRes);
        } else {
          setMeta(null);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [details],
  );

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const statusUI = useMemo(
    () => getStatusStyles(transaction?.status, C),
    [transaction?.status, C],
  );

  const balanceBefore = Number(
    getBalanceValue(meta, transaction, "balanceBefore"),
  );
  const balanceAfter = Number(
    getBalanceValue(meta, transaction, "balanceAfter"),
  );

  console.log("Transaction Detail:", transaction);
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={[styles.title, { color: C.text }]}>
          Transaction Details
        </ThemedText>
        <View style={styles.spacer} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchDetail(true)}
              tintColor={C.primary}
            />
          }
        >
          <View style={[styles.mainCard, { backgroundColor: C.background }]}>
            <View style={styles.summaryTop}>
              <ThemedText style={[styles.summaryTitle, { color: C.muted }]}>
                {transaction?.transactionDescription ||
                  transaction?.transactionType ||
                  "Transaction"}
              </ThemedText>
              <ThemedText style={[styles.summaryAmount, { color: C.text }]}>
                {formatSignedAmount(transaction)}
              </ThemedText>
            </View>

            <ThemedText style={[styles.statusText, { color: statusUI.color }]}>
              {statusUI.text}
            </ThemedText>

            <View style={styles.bracsRowWrap}>
              <View style={styles.bracsLeft}>
                <InfoCircle size={18} color={C.primary} variant='Outline' />
                <ThemedText style={[styles.bracsLabel, { color: C.text }]}>
                  Earned BRACs
                </ThemedText>
              </View>
              <ThemedText style={[styles.bracsValue, { color: C.text }]}>
                {Number(
                  transaction?.points || transaction?.bracValue || 0,
                ).toFixed(2)}
              </ThemedText>
            </View>

            <View
              style={[styles.divider, { backgroundColor: C.borderColor }]}
            />

            <View style={styles.detailsList}>
              <DetailRow
                title='Reference ID'
                value={getReferenceId(transaction)}
                C={C}
              />
              <DetailRow
                title='Date & Time'
                value={formatDate(
                  transaction?.createdAt,
                  "MMM dd, yyyy | hh:mm a",
                )}
                C={C}
              />
              <DetailRow
                title='Transaction Type'
                value={(() => {
                  const raw = String(
                    transaction?.actionType ||
                      transaction?.transactionType ||
                      "-",
                  );
                  return raw.charAt(0).toUpperCase() + raw.slice(1);
                })()}
                C={C}
              />
              {!!transaction?.sentTo && (
                <DetailRow
                  title='Sent to'
                  value={String(transaction.sentTo)}
                  C={C}
                />
              )}
              <DetailRow
                title='Service Charge'
                value={priceFormatter(
                  Number(transaction?.serviceCharge || 0),
                  0,
                )}
                C={C}
              />
              <DetailRow
                title='Balance Before'
                value={priceFormatter(balanceBefore, 2)}
                C={C}
              />
              <DetailRow
                title='Balance After'
                value={priceFormatter(balanceAfter, 2)}
                C={C}
              />
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.footerSupport}>
        <ThemedText style={[styles.footerText, { color: C.muted }]}>
          Got issues with this transaction?
        </ThemedText>
        <ThemedText style={[styles.footerAction, { color: C.primary }]}>
          Contact Support
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

type DetailRowProps = {
  title: string;
  value: string;
  C: (typeof Colors)["light"];
};

function DetailRow({ title, value, C }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <ThemedText style={[styles.detailLabel, { color: C.muted }]}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.detailValue, { color: C.text }]}>
        {value || "-"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spacer: {
    width: 44,
  },
  title: {
    fontSize: 16,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 130,
    paddingTop: 8,
  },
  mainCard: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  summaryTop: { alignItems: "center", gap: 6 },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "600",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  bracsRowWrap: {
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: "#ECE9DD",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bracsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bracsLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  bracsValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  detailsList: {
    gap: 2,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 12,
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  footerSupport: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 26,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
  footerAction: {
    fontSize: 12,
    fontWeight: "700",
  },
  helpRow: {
    alignItems: "center",
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    textDecorationLine: "underline",
  },
});
