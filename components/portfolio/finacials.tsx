import { EmptyState } from "@/components/empty-state";
import { FinancialsTransactionsLineItem } from "@/components/portfolio";
import { StockIcn, TotalDiv } from "@/components/svg";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRequest } from "@/services/useRequest";
import {
  calculateRemainingDays,
  collection,
  parseTransaction,
  priceFormatter,
  tenureInDays,
} from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { STOCKS_SERVICE, TRANSACTION_SERVICE } from "@/services/routes";
import { tickerToNetwork } from "@/utils/hooks";
import { concat, orderBy } from "lodash";
import LockedFundsCard from "./locked-fund";

const EmptyTransaction = ({
  show,
  textColor,
}: {
  show: boolean;
  textColor: string;
}) => {
  if (!show) return null;

  return (
    <EmptyState>
      <Text style={[styles.emptyLockedText, { color: textColor }]}>
        No transaction history yet.
      </Text>
    </EmptyState>
  );
};

const PointEarnedCard = ({
  title,
  price,
  icon,
  borderColor,
  titleColor,
  valueColor,
}: {
  title: string;
  price: string;
  icon: React.ReactNode;
  borderColor: string;
  titleColor: string;
  valueColor: string;
}) => {
  return (
    <View style={[styles.pointCard, { borderColor }]}>
      <View style={styles.pointIconWrap}>{icon}</View>
      <View>
        <Text style={[styles.pointCardTitle, { color: titleColor }]}>
          {title}
        </Text>
        <Text style={[styles.pointCardValue, { color: valueColor }]}>
          {price}
        </Text>
      </View>
    </View>
  );
};

const Financials = ({ data }: any) => {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const { data: _transaction } = useRequest(
    TRANSACTION_SERVICE.BRAC(data?.tickerSymbol),
    { params: { type: "Buy Stocks" } },
  );

  const { data: _transaction1 } = useRequest(
    TRANSACTION_SERVICE.BRAC(data?.tickerSymbol),
    { params: { type: "Sell Stocks" } },
  );

  const transaction = useMemo(() => {
    return orderBy(
      collection(concat(_transaction, _transaction1)).map(parseTransaction),
      ["createdAt"],
      ["desc"],
    );
  }, [_transaction, _transaction1]);

  const { data: LockedData } = useRequest(STOCKS_SERVICE.SECURITY_PLAN, {
    initialValue: [],
    params: {
      perPage: 100,
      planName: "fixedIncome",
    },
  });

  const lockedFundsData = LockedData?.data?.data?.map((item: any) => ({
    totalLiquidityDays: tenureInDays(item.tenure),
    remainingLiquidityDays: calculateRemainingDays(item.maturityDate),
    tenureDays: tenureInDays(item.tenure),
    interestRate: item.interestRate,
  }));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: C.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Stats Cards */}
      <View style={styles.cardGrid}>
        <View style={styles.cardWrapper}>
          <PointEarnedCard
            title='Total stocks bought'
            price={priceFormatter(0)}
            icon={<StockIcn />}
            borderColor={C.border}
            titleColor={C.muted}
            valueColor={C.text}
          />
        </View>
        <View style={styles.cardWrapper}>
          <PointEarnedCard
            title='Dividends'
            price={priceFormatter(0)}
            icon={<TotalDiv />}
            borderColor={C.border}
            titleColor={C.muted}
            valueColor={C.text}
          />
        </View>
      </View>

      {/* Locked Finance Section */}
      {data?.braneStockCategory === "fixed-income" && (
        <View style={styles.lockedSection}>
          <Text style={[styles.lockedTitle, { color: C.text }]}>
            My Locked Finance
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {lockedFundsData && lockedFundsData.length > 0 ? (
              lockedFundsData.map((item: any, index: number) => (
                <View key={index} style={styles.lockedCardWrapper}>
                  <LockedFundsCard data={item} />
                </View>
              ))
            ) : (
              <Text style={[styles.emptyLockedText, { color: C.muted }]}>
                No locked finance available. Your locked finance will be
                displayed when a purchase is made.
              </Text>
            )}
          </ScrollView>
        </View>
      )}

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Transaction History */}
      <View style={styles.transactionSection}>
        <Text style={[styles.transactionTitle, { color: C.text }]}>
          {tickerToNetwork(data?.tickerSymbol)?.toUpperCase()} Transaction
          History
        </Text>
        <View style={{marginTop: 100}}>
                  <EmptyTransaction show={!transaction.length} textColor={C.muted} />

        </View>
        <View style={styles.dividerList}>
          {transaction?.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/transaction-history/${item?.id}`)}
              activeOpacity={0.7}
            >
              <FinancialsTransactionsLineItem {...item} />
              <View style={[styles.divider, { backgroundColor: C.border }]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Financials;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  cardGrid: {
    flexDirection: "row",
    gap: 12,
    // paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardWrapper: {
    flex: 1,
  },
  pointCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
    justifyContent: "space-between",
    gap: 12,
  },
  pointIconWrap: {
    alignSelf: "flex-start",
  },
  pointCardTitle: {
    fontSize: 12,
    marginBottom: 6,
  },
  pointCardValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  lockedSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  lockedTitle: {
    fontWeight: "400",
    fontSize: 14,
    marginBottom: 8,
  },
  horizontalScroll: {
    paddingRight: 16,
    gap: 10,
  },
  lockedCardWrapper: {
    minWidth: 300,
  },
  emptyLockedText: {
    textAlign: "center",
    marginTop: 8,

    fontSize: 13,
  },
  spacer: {
    height: 8,
  },
  transactionSection: {
    marginTop: 8,
    // paddingHorizontal: 16,
  },
  transactionTitle: {
    marginBottom: 16,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  dividerList: {
    // wrapper for transaction items
  },
  divider: {
    height: 1,
  },
});
