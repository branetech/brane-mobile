// index.tsx
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { STOCKS_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { StockInterface } from "@/utils/constants";
import {
    calculateRemainingDays,
    collection,
    priceFormatter,
    tenureInDays,
} from "@/utils/helpers";
import { useBoolean } from "@/utils/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { lowerCase } from "lodash";
import { useState } from "react";
import {
    Linking,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { StockLine } from "..";
import LockedFundsCard from "./locked-fund";

// ─── ShowMore ────────────────────────────────────────────────────────────────

export const ShowMore = ({
  show,
  onClick,
  justifyStart = false,
}: {
  show: boolean;
  onClick: () => void;
  justifyStart?: boolean;
}) => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.showMoreRow,
        justifyStart && { justifyContent: "flex-start" },
      ]}
    >
      <Text style={[styles.showMoreText, { color: C.primary }]}>
        {show ? "Show less" : "Show more"}
      </Text>
      <Ionicons
        name={show ? "chevron-up" : "chevron-down"}
        size={14}
        color={C.primary}
      />
    </TouchableOpacity>
  );
};

// ─── PriceComparison ─────────────────────────────────────────────────────────

export const PriceComparison = ({
  ask,
  bid,
}: {
  ask?: string | number;
  bid?: string | number;
}) => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  return (
    <View
      style={[styles.priceCompCard, { backgroundColor: C.inputBackground }]}
    >
      <View style={styles.priceCompCol}>
        <View style={styles.priceCompLabelRow}>
          <Text style={[styles.priceCompLabel, { color: C.muted }]}>
            Asking price:
          </Text>
          <Ionicons
            name='information-circle-outline'
            size={14}
            color={C.muted}
            style={{ marginLeft: 4 }}
          />
        </View>
        <Text style={[styles.priceCompValue, { color: C.text }]}>
          {priceFormatter(Number(ask), 2)}
        </Text>
      </View>

      <View style={[styles.priceCompCol, { alignItems: "flex-end" }]}>
        <View style={styles.priceCompLabelRow}>
          <Text style={[styles.priceCompLabel, { color: C.muted }]}>
            Bidding price:
          </Text>
          <Ionicons
            name='information-circle-outline'
            size={14}
            color={C.muted}
            style={{ marginLeft: 4 }}
          />
        </View>
        <Text style={[styles.priceCompValue, { color: C.text }]}>
          {priceFormatter(Number(bid), 2)}
        </Text>
      </View>
    </View>
  );
};

// ─── StockView ───────────────────────────────────────────────────────────────

export const StockView = ({
  stock,
  price,
}: {
  stock: StockInterface;
  price: string;
}) => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const [modalVisible, setModalVisible] = useState(false);
  const [showMoreStats, setShowMoreStats] = useState(false);
  const { open: showAllDirectors, toggle: toggleShowAllDirectors } =
    useBoolean();

  return (
    <View style={styles.section}>
      {/* About */}
      <View style={styles.block}>
        <Text
          style={[styles.sectionLabel, { color: C.text, width: "70%" }]}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          About {stock?.companyName}
        </Text>
        <Text style={[styles.bodyText, { color: C.muted }]}>
          {stock?.description || "No description available."}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.block}>
        <View style={styles.statsHeader}>
          <Text style={[styles.sectionLabel, { color: C.muted }]}>Stats</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginLeft: 8 }}
          >
            <Ionicons
              name='information-circle-outline'
              size={18}
              color={C.muted}
            />
          </TouchableOpacity>
        </View>

        <StockLine title='Trading Name' value={stock?.tradingName} />
        <StockLine title='Ticker Symbol' value={stock?.tickerSymbol} />
        <StockLine title='Sector' value={stock?.marketSector} />
        <StockLine title='Sub Sector' value={stock?.subSector} />
        <StockLine title='Market Classification' value={stock?.marketCap} />
        <StockLine
          title='Shares Outstanding (Mil.)'
          value={stock?.sharesOutstanding}
        />
        <StockLine title='Opening Price' value={price} />

        {showMoreStats && (
          <>
            <StockLine title='Risk Level' value={stock?.riskLevel} />
            <StockLine title='Year Range' value={stock?.yearRange} />
            <StockLine title='Day Range' value={stock?.dayRange} />
            <StockLine title='P/E Ratio' value={stock?.PERatio} />
            <StockLine title='EPS' value={stock?.EPS} />
            <StockLine title='Volume' value={stock?.vol} />
            <StockLine title='Avg Volume' value={stock?.avgVol} />
            <StockLine title='Market cap' value={stock?.marketCap} />

            <StockLine title='Company Name' value={stock?.companyName} />
            <StockLine title='CEO' value={stock?.companyCeo} />

            <View style={[styles.boardBlock, { borderBottomColor: C.border }]}>
              <Text style={[styles.bodyText, { color: C.text }]}>
                Board of Directors:
              </Text>
              {stock?.boardOfDirectors?.map((name: string, i: number) =>
                !showAllDirectors && i > 3 ? null : (
                  <Text
                    key={i}
                    style={[styles.directorName, { color: C.text }]}
                  >
                    {name}
                  </Text>
                ),
              )}
              {!!stock?.boardOfDirectors?.length && (
                <ShowMore
                  onClick={toggleShowAllDirectors}
                  show={showAllDirectors}
                />
              )}
            </View>

            <StockLine title='Date Listed' value={stock?.dateListed} />
            <StockLine
              title='Date of Incorporation'
              value={stock?.dateOfIncorporation}
            />
            <StockLine
              title='Website'
              value={
                <Text
                  style={[styles.link, { color: C.primary }]}
                  onPress={() => Linking.openURL(stock?.website)}
                >
                  {stock?.website}
                </Text>
              }
            />
          </>
        )}

        <ShowMore
          show={showMoreStats}
          onClick={() => setShowMoreStats((p) => !p)}
          justifyStart
        />
      </View>

      <BottomStatsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title='Stats'
        C={C}
      >
        <Text style={[styles.bodyText, { color: C.text }]}>
          Stats includes trading metrics and company information for this asset.
        </Text>
      </BottomStatsModal>
    </View>
  );
};

const BottomStatsModal = ({
  visible,
  onClose,
  title,
  C,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  C: (typeof Colors)["light"] | (typeof Colors)["dark"];
  children: any;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType='slide'
    onRequestClose={onClose}
  >
    <TouchableOpacity
      activeOpacity={1}
      style={styles.modalOverlay}
      onPress={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {}}
        style={[styles.modalCard, { backgroundColor: C.background }]}
      >
        <Text style={[styles.modalTitle, { color: C.text }]}>{title}</Text>
        {children}
        <TouchableOpacity onPress={onClose} style={styles.modalClose}>
          <Text style={{ color: C.primary, fontWeight: "600" }}>Close</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

// ─── IndexView ───────────────────────────────────────────────────────────────

export const IndexView = ({
  stock,
  price,
}: {
  stock: StockInterface;
  price: string;
}) => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const [showMore, setShowMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { open: showAllCompanies, toggle: toggleShowAllCompanies } =
    useBoolean();
  const router = useRouter();
  const companies = collection(stock?.boardOfDirectors);

  return (
    <View style={styles.section}>
      <View style={styles.block}>
        <Text style={[styles.sectionLabel, { color: C.muted }]}>
          About {stock?.companyName}
        </Text>
        <Text style={[styles.bodyText, { color: C.text }]}>
          {showMore
            ? stock?.description
            : `${stock?.description?.substring(0, 250)}...`}
        </Text>
        <ShowMore onClick={() => setShowMore((p) => !p)} show={showMore} />
        <StockLine title='Valued At' value={price} />
      </View>

      <View style={styles.block}>
        <View style={styles.statsHeader}>
          <Text style={[styles.sectionLabel, { color: C.text }]}>
            Companies
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginLeft: 8 }}
          >
            <Ionicons
              name='information-circle-outline'
              size={18}
              color={C.muted}
            />
          </TouchableOpacity>
        </View>
        {companies?.map((company: any, i: number) =>
          !showAllCompanies && i > 3 ? null : (
            <StockLine
              key={company.Company_name}
              title={
                <Text
                  style={[styles.link, { color: C.primary }]}
                  onPress={() =>
                    router.push(
                      `/portfolio/company/${lowerCase(company.Company_name)}`,
                    )
                  }
                >
                  {company.Company_name}
                </Text>
              }
              value={company.MarketCap}
            />
          ),
        )}
        {!!stock?.boardOfDirectors?.length && (
          <ShowMore onClick={toggleShowAllCompanies} show={showAllCompanies} />
        )}
      </View>

      <BottomStatsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title='Companies'
        C={C}
      >
        <Text style={[styles.bodyText, { color: C.text }]}>
          This section shows key companies and market cap data tracked by this
          index.
        </Text>
      </BottomStatsModal>
    </View>
  );
};

// ─── GoldView ────────────────────────────────────────────────────────────────

export const GoldView = ({
  stock,
  price,
}: {
  stock: StockInterface;
  price: string;
}) => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const [showMore, setShowMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.section}>
      <View style={styles.block}>
        <View style={styles.statsHeader}>
          <Text style={[styles.sectionLabel, { color: C.muted }]}>Stats</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginLeft: 8 }}
          >
            <Ionicons
              name='information-circle-outline'
              size={18}
              color={C.muted}
            />
          </TouchableOpacity>
        </View>
        <PriceComparison ask={stock?.currentPrice} bid={stock?.currentPrice} />
      </View>

      <View style={styles.block}>
        <Text style={[styles.sectionLabel, { color: C.muted }]}>
          About {stock?.companyName}
        </Text>
        <Text style={[styles.bodyText, { color: C.text }]}>
          {showMore
            ? stock?.description
            : `${stock?.description?.substring(0, 250)}...`}
        </Text>
        <ShowMore onClick={() => setShowMore((p) => !p)} show={showMore} />
      </View>

      <BottomStatsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title='Stats'
        C={C}
      >
        <Text style={[styles.bodyText, { color: C.text }]}>
          Asking and bidding prices are shown based on the latest available
          market data.
        </Text>
      </BottomStatsModal>
    </View>
  );
};

// ─── IncomeView ───────────────────────────────────────────────────────────────

export const IncomeView = ({
  stock,
  price,
}: {
  stock: StockInterface;
  price: string;
}) => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const [showMore, setShowMore] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);

  const { data } = useRequest(STOCKS_SERVICE.SECURITY_PLAN, {
    initialValue: [],
    params: { perPage: 100, planName: "fixedIncome" },
  });

  const lockedFundsData = data?.data?.data?.map((item: any) => ({
    totalLiquidityDays: tenureInDays(item.tenure),
    remainingLiquidityDays: calculateRemainingDays(item.maturityDate),
    tenureDays: tenureInDays(item.tenure),
    interestRate: item.interestRate,
  }));

  return (
    <View style={styles.section}>
      <View style={styles.block}>
        <Text style={[styles.sectionLabel, { color: C.muted }]}>
          About {stock?.companyName}
        </Text>
        <Text style={[styles.bodyText, { color: C.text }]}>
          {showMore
            ? stock?.description
            : `${stock?.description?.substring(0, 250)}...`}
        </Text>
        <ShowMore onClick={() => setShowMore((p) => !p)} show={showMore} />
        <StockLine title='Annual return' value={stock?.percentage} />
      </View>

      <View style={styles.block}>
        <View style={styles.statsHeader}>
          <Text style={[styles.sectionLabel, { color: C.muted }]}>Stats</Text>
          <TouchableOpacity
            onPress={() => setStatsModalVisible(true)}
            style={{ marginLeft: 8 }}
          >
            <Ionicons
              name='information-circle-outline'
              size={18}
              color={C.muted}
            />
          </TouchableOpacity>
        </View>
      </View>

      <BottomStatsModal
        visible={statsModalVisible}
        onClose={() => setStatsModalVisible(false)}
        title='Stats'
        C={C}
      >
        <StockLine title='Partner name' value={stock?.companyName} />
        <StockLine title='Annual return' value={stock?.annualReturn} />
        <StockLine title='Tenure' value={stock?.tenures} />
      </BottomStatsModal>

      <View style={styles.block}>
        <Text style={[styles.bodyText, { color: C.text, fontWeight: "400" }]}>
          My Locked Finance
        </Text>
        {lockedFundsData && lockedFundsData.length > 0 ? (
          lockedFundsData.map((item: any, index: number) => (
            <LockedFundsCard key={index} data={item} />
          ))
        ) : (
          <Text style={[styles.emptyText, { color: C.muted }]}>
            No locked finance available. Your locked finance will be displayed
            when a purchase is made.
          </Text>
        )}
      </View>
    </View>
  );
};

// ─── EtfView ─────────────────────────────────────────────────────────────────

export const EtfView = ({
  stock,
  price,
}: {
  stock: StockInterface;
  price: string;
}) => {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const [showMore, setShowMore] = useState(false);
  const [dataModalVisible, setDataModalVisible] = useState(false);

  return (
    <View style={styles.section}>
      <View style={styles.block}>
        <Text style={[styles.sectionLabel, { color: C.muted }]}>
          About {stock?.companyName}
        </Text>
        <Text style={[styles.bodyText, { color: C.text }]}>
          {showMore
            ? stock?.description
            : `${stock?.description?.substring(0, 250)}...`}
        </Text>
        <ShowMore onClick={() => setShowMore((p) => !p)} show={showMore} />

        <View style={styles.dataHeader}>
          <Text style={{ fontWeight: "600", color: C.text }}>Data</Text>
          <TouchableOpacity onPress={() => setDataModalVisible(true)}>
            <Ionicons
              name='information-circle-outline'
              size={16}
              color={C.muted}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <BottomStatsModal
        visible={dataModalVisible}
        onClose={() => setDataModalVisible(false)}
        title='Data'
        C={C}
      >
        <StockLine title='Sector' value={stock?.sector} />
        <StockLine title='ISIN' value={stock?.stockSourceId} />
        <StockLine title='Avg Volume (3M)' value={stock?.avgVol} />
        <StockLine title='Fund Manager' value={stock?.companyCeo} />
        <StockLine title='Index Tracked' value={stock?.indexTracked} />
        <StockLine title='Fund Sponsor' value={stock?.fundSponsor} />
        <StockLine title='Trustee' value={stock?.trustee} />
        <StockLine title='Custodian' value={stock?.custodian} />
        <StockLine title='Liquidity Provider' value={stock?.liquidityPower} />
        <StockLine title='Constituent' value={stock?.companyCeo} />
        <StockLine
          title='Website'
          value={
            <Text
              style={[styles.link, { color: C.primary }]}
              onPress={() => Linking.openURL(stock?.website)}
            >
              {stock?.website}
            </Text>
          }
        />
      </BottomStatsModal>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: { gap: 24, marginBottom: 32 },
  block: { gap: 16, paddingBottom: 24 },

  sectionLabel: { fontWeight: "600", fontSize: 13 },
  bodyText: { fontSize: 12 },
  emptyText: { textAlign: "center", marginTop: 16, fontSize: 13 },

  showMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 8,
  },
  showMoreText: { fontSize: 13 },

  boardBlock: {
    borderBottomWidth: 1,
    paddingVertical: 16,
    gap: 4,
  },
  directorName: { paddingTop: 4, fontSize: 13 },

  statsHeader: { flexDirection: "row", alignItems: "center" },

  link: { textDecorationLine: "underline", fontSize: 13 },

  priceCompCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  priceCompCol: { flexDirection: "column" },
  priceCompLabelRow: { flexDirection: "row", alignItems: "center" },
  priceCompLabel: { fontSize: 13 },
  priceCompValue: { fontSize: 20, fontWeight: "600", marginTop: 4 },

  dataHeader: { flexDirection: "row", alignItems: "center", marginTop: 8 },

  // Bottom sheet modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: "100%",
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "600" },
  modalClose: { alignItems: "center", marginTop: 16 },
});
