import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import BaseRequest from "@/services";
import { MOBILE_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { formatDate, parseTransaction, priceFormatter } from "@/utils/helpers";
import { ITransactionDetail } from "@/utils/index";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getStatusStyles = (status?: string) => {
  const key = String(status || "").toLowerCase();
  if (key.includes("success")) {
    return { bg: "#EAF8F1", color: "#0E8A4D", border: "#CBECD9" };
  }
  if (key.includes("pending")) {
    return { bg: "#FFF7E8", color: "#B5760A", border: "#F1D9A8" };
  }
  return { bg: "#FDECEC", color: "#C53333", border: "#F6C8C8" };
};

const mapServiceRoute = (type: string) => {
  const key = String(type || "").toLowerCase();
  if (key.includes("airtime")) return "airtime";
  if (key.includes("data")) return "data";
  if (key.includes("cable")) return "cable";
  if (key.includes("electricity")) return "electricity";
  if (key.includes("betting")) return "betting";
  if (key.includes("transport")) return "transportation";
  return "";
};

export default function TransactionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const details = String(params.details || "");

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
    () => getStatusStyles(transaction?.status),
    [transaction?.status],
  );
  const branePayload = meta?.branePayload || {};
  const transactionType = String(transaction?.transactionType || "");
  const buyAgainRoute = mapServiceRoute(transactionType);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={styles.title}>Transaction Details</ThemedText>
        <View style={styles.spacer} />
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator color='#013D25' />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchDetail(true)}
            />
          }
        >
          <View style={styles.summaryCard}>
            <ThemedText style={styles.summaryTitle}>
              {transaction?.transactionDescription ||
                transaction?.transactionType}
            </ThemedText>
            <ThemedText style={styles.summaryAmount}>
              {priceFormatter(Number(transaction?.amount || 0))}
            </ThemedText>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: statusUI.bg,
                  borderColor: statusUI.border,
                },
              ]}
            >
              <ThemedText
                style={[styles.statusText, { color: statusUI.color }]}
              >
                {String(transaction?.status || "").toUpperCase()}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <DetailRow
              title='Reference ID'
              value={String(transaction?.id || "-")}
            />
            <DetailRow
              title='Date & Time'
              value={formatDate(
                transaction?.createdAt,
                "MMMM dd, yyyy | hh:mm a",
              )}
            />
            <DetailRow
              title='Transaction Type'
              value={String(transaction?.transactionType || "-")}
            />
            <DetailRow
              title='Recipient'
              value={String(transaction?.sentTo || "-")}
            />
            <DetailRow
              title='Service Charge'
              value={priceFormatter(Number(transaction?.serviceCharge || 0))}
            />
            <DetailRow
              title='Amount'
              value={priceFormatter(Number(transaction?.amount || 0))}
            />

            {branePayload?.serviceID ? (
              <DetailRow
                title='Service ID'
                value={String(branePayload.serviceID)}
              />
            ) : null}
            {branePayload?.variation_code ? (
              <DetailRow
                title='Variation Code'
                value={String(branePayload.variation_code)}
              />
            ) : null}
            {meta?.token ? (
              <DetailRow title='Token' value={String(meta.token)} />
            ) : null}
          </View>

          {buyAgainRoute ? (
            <BraneButton
              text='Buy Again'
              onPress={() =>
                router.push({
                  pathname: "/bills-utilities/select",
                  params: { service: buyAgainRoute },
                })
              }
              backgroundColor='#013D25'
              textColor='#D2F1E4'
              height={48}
              radius={10}
            />
          ) : null}

          <TouchableOpacity style={styles.helpRow}>
            <ThemedText style={styles.helpText}>
              Having issues? Contact support
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

type DetailRowProps = {
  title: string;
  value: string;
};

function DetailRow({ title, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <ThemedText style={styles.detailLabel}>{title}</ThemedText>
      <ThemedText style={styles.detailValue}>{value || "-"}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    fontWeight: "700",
    color: "#0B0014",
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: "#EFEFF1",
    borderRadius: 12,
    padding: 14,
    alignItems: "flex-start",
    gap: 8,
  },
  summaryTitle: {
    fontSize: 13,
    color: "#4E4A57",
    fontWeight: "600",
  },
  summaryAmount: {
    fontSize: 20,
    color: "#0B0014",
    fontWeight: "700",
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: "#EFEFF1",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#77717F",
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: "#0B0014",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  helpRow: {
    alignItems: "center",
    marginTop: 4,
  },
  helpText: {
    fontSize: 12,
    color: "#013D25",
    textDecorationLine: "underline",
  },
});
