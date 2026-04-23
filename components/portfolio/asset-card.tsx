import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

import {
  onRemoveFromCheckouts,
  onUpdateCheckouts,
} from "@/redux/slice/auth-slice";
import { useReduxState } from "@/redux/useReduxState";
import { STOCKS_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { pluralize, priceFormatter } from "@/utils/helpers";
import { ArrowDown2, ArrowUp2, Trash } from "iconsax-react-native";
import { StockInfoLine, StockInfoLineTwo } from "..";
import { Ticker } from "../home/cards";
import SelectBroker, { SelectTenure } from "./asset-breakdown/broker-selector";

const getTickerColor = (ticker: any): string => {
  if ([-1, "down"].includes(ticker)) return "#CB010B";
  if ([1, "up"].includes(ticker)) return "#008753";
  return "#85808A";
};

// ─────────────────────────────────────────────
// Skeleton Loader
// ─────────────────────────────────────────────
const StockPurchaseCardSkeleton: React.FC = () => (
  <View style={styles.skeletonCard}>
    {[200, 150, 180, 120, 200, 160].map((w, i) => (
      <View key={i} style={[styles.skeletonLine, { width: w }]} />
    ))}
  </View>
);

// ─────────────────────────────────────────────
// Quantity Selector
// ─────────────────────────────────────────────
const QuantitySelectorWithLabel: React.FC<{
  quantity: number;
  setQuantity: (v: number) => void;
  currentPrice?: number;
}> = ({ quantity, setQuantity, currentPrice = 0 }) => {
  const [inputValue, setInputValue] = useState(
    quantity > 0 ? String(quantity) : "",
  );

  useEffect(() => {
    setInputValue(quantity > 0 ? String(quantity) : "");
  }, [quantity]);

  const handleBlur = () => {
    const num = Number(inputValue);
    const validated = Math.max(0, Math.floor(num || 0));
    setInputValue(validated > 0 ? String(validated) : "");
    setQuantity(validated);
  };

  const estimatedCost =
    inputValue === "" ? 0 : (Number(inputValue) || 0) * currentPrice;

  return (
    <View style={styles.qtyInputRow}>
      <TextInput
        style={styles.qtyInputBox}
        value={inputValue}
        onChangeText={(v) => {
          if (v === "" || /^\d+$/.test(v)) {
            setInputValue(v);
            setQuantity(Math.max(0, Math.floor(Number(v) || 0)));
          }
        }}
        onBlur={handleBlur}
        keyboardType='numeric'
        placeholder='Enter number of shares'
        placeholderTextColor='#A1A1A1'
      />
      <View style={styles.qtyEstBox}>
        <Text style={styles.qtyEstLabel}>Est:</Text>
        <Text style={styles.qtyEstValue}>
          {priceFormatter(estimatedCost, 0)}
        </Text>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────
// Amount Input Variants
// ─────────────────────────────────────────────
const AmountRow: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "numeric" | "default";
}> = ({
  label,
  value,
  onChange,
  placeholder = "Enter Amount",
  keyboardType = "numeric",
}) => (
  <View style={styles.amountRow}>
    <StockInfoLine value={label} className='text-[#85808A]' />
    <TextInput
      style={styles.amountInput}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor='#aaa'
      keyboardType={keyboardType}
    />
  </View>
);

const GoldAmount = (props: any) => (
  <View style={styles.mt4}>
    <AmountRow
      label='Amount to buy'
      value={props.amount}
      onChange={props.setAmount}
    />
  </View>
);

const IndexAmount = (props: any) => (
  <View style={styles.mt4}>
    <AmountRow
      label='Investment amount'
      value={props.amount}
      onChange={props.setAmount}
    />
  </View>
);

const FixedAmount = (props: any) => (
  <View style={[styles.mt4, { gap: 8 }]}>
    <AmountRow
      label='Investment amount'
      value={props.amount}
      onChange={props.setAmount}
    />
    <AmountRow
      label='Name your Investment'
      value={props.name}
      onChange={props.setName}
      placeholder='Name your investment'
      keyboardType='default'
    />
  </View>
);

const AssetsAmountSetter = (props: any) => {
  if (props.assetClass === "gold") return <GoldAmount {...props} />;
  if (props.assetClass === "indexes") return <IndexAmount {...props} />;
  if (props.assetClass === "fixed-income") return <FixedAmount {...props} />;
  return (
    <View style={{ marginBottom: 16 }}>
      <QuantitySelectorWithLabel
        quantity={props.quantityState}
        setQuantity={props.setQuantity}
        currentPrice={props.currentPrice}
      />
    </View>
  );
};

// ─────────────────────────────────────────────
// Asset Class Tag
// ─────────────────────────────────────────────
const assetTagColors: Record<string, string> = {
  blue: "#1677ff",
  purple: "#722ed1",
  gold: "#d48806",
  green: "#389e0d",
  red: "#cf1322",
};

const AssetTag: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <View
    style={[styles.tag, { borderColor: assetTagColors[color] || "#1677ff" }]}
  >
    <Text
      style={[styles.tagText, { color: assetTagColors[color] || "#1677ff" }]}
    >
      {label}
    </Text>
  </View>
);

// ─────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────
const HR = ({ style }: { style?: object }) => (
  <View style={[styles.hr, style]} />
);

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
interface StockBreakdownDetailsProps {
  tickerSymbol: string;
  hasMore?: boolean;
  quantity?: number;
  brokerName: string;
  tenure?: { tenureDuration: string };
  amount?: number;
  name?: string;
}

const StockBreakdownDetails: React.FC<StockBreakdownDetailsProps> = ({
  tickerSymbol,
  hasMore,
  quantity = 1,
  brokerName,
  tenure = { tenureDuration: "" },
  amount: initialAmount = 0,
  name,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [quantityState, setQuantity] = useState(quantity);
  const [selectedBrokerName, setSelectedBrokerName] = useState(brokerName);
  const [selectedTenure, setSelectedTenure] = useState(tenure);
  const [amount, setAmount] = useState(
    initialAmount > 0 ? String(initialAmount) : "",
  );
  const [nameInvestment, setNameInvestment] = useState(name || "");
  const [openBreakdown, setOpenBreakdown] = useReduxState(
    false,
    "openBreakdown",
  );

  const { data: stock, isLoading: isStockLoading } = useRequest(
    STOCKS_SERVICE.DETAILS(tickerSymbol),
    {
      initialValue: { companyName: "" },
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  );


  const {
    companyName,
    currentPrice,
    logo,
    assetClass,
    ticker,
    percentage,
    timeOfCurrentPrice,
  } = stock || {};

  const assetColor = useMemo(() => {
    const map: Record<string, string> = {
      stocks: "green",
      etfs: "purple",
      gold: "gold",
      indexes: "blue",
      "fixed-income": "red",
    };
    return map[assetClass] || "blue";
  }, [assetClass]);

  const calculatedAmount = useMemo(() => {
    const num = Number(amount) || 0;
    return ["gold", "indexes", "fixed-income"].includes(assetClass) ? num : 0;
  }, [assetClass, amount]);

  const tenureRate = Number(selectedTenure?.tenureDuration ?? 0) / 100;

  const {
    data: breakdown,
    isLoading: isBreakdownLoading,
    mutate: refetchBreakdown,
  } = useRequest(
    STOCKS_SERVICE.BREAKDOWN(
      tickerSymbol,
      quantityState,
      assetClass,
      calculatedAmount,
    ),
    {
      initialValue: {},
      revalidateOnFocus: false,
      revalidateOnMount: false,
      onDone({ data }: any) {
        const totalCharge = data?.allCharges || 0;
        const stockPrice = data?.currentStockPrice || 0;
        dispatch(
          onUpdateCheckouts({
            quantity: quantityState,
            assetClass,
            brokerName: selectedBrokerName,
            netPayable: stockPrice + totalCharge,
            tickerSymbol,
            stockPrice,
            totalCharge,
            tenure: `${selectedTenure.tenureDuration} days`,
            tenureDuration: selectedTenure.tenureDuration,
            tenureRate,
            amount: calculatedAmount,
            name: nameInvestment,
          }),
        );
      },
    },
  );

  useEffect(() => {
    if (assetClass && calculatedAmount > 0) refetchBreakdown();
  }, [calculatedAmount, assetClass, refetchBreakdown]);

  const goldGrams = useMemo(() => {
    if (!amount || isNaN(Number(amount)) || !currentPrice) return 0;
    return Number(amount) / currentPrice;
  }, [amount, currentPrice]);

  useEffect(() => {
    if (assetClass === "gold" && goldGrams > 0) {
      setQuantity(Number(goldGrams.toFixed(4)));
    }
  }, [goldGrams, assetClass]);

  const onDelete = () => {
    dispatch(onRemoveFromCheckouts(tickerSymbol));
    if (!hasMore) router.replace("/portfolio" as any);
  };

  const isLoading = isStockLoading || isBreakdownLoading;

  const totalCharge = breakdown?.allCharges || 0;
  const stockPrice = stock?.price || 0;
  const netPayable =  Number(totalCharge) + Number(stockPrice);
  const price = priceFormatter((stockPrice || 0) as number, 2);

  if (isLoading) return <StockPurchaseCardSkeleton />;

  return (
    <ScrollView
      style={styles.card}
      contentContainerStyle={styles.cardContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.logoPlaceholder]} />
          )}
          <View style={{ marginLeft: 8 }}>
            <StockInfoLine className='text-[#85808A]' value={tickerSymbol} />
            <View style={styles.tickerRow}>
              <Ticker ticker={ticker} />
              <Text style={{ color: getTickerColor(ticker), fontSize: 11 }}>
                {price} ({Number(percentage).toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Trash size={20} color={"red"} />
        </TouchableOpacity>
      </View>

      <HR />

      {/* Asset Class */}
      <View style={{ marginTop: 8 }}>
        <StockInfoLineTwo
          title='Asset Class'
          value={
            <AssetTag
              color={assetColor}
              label={String(assetClass).toUpperCase()}
            />
          }
        />
      </View>
      <HR style={styles.lightHr} />

      {/* Price per unit/gram */}
      {/* <StockInfoLineTwo
        title={
          ["etfs", "indexes", "fixed-income", "stocks"].includes(assetClass)
            ? "Price per unit"
            : "Price per gram"
        }
        value={priceFormatter(currentPrice, 2)}
        className='text-[#85808A]'
      /> */}
      <HR style={styles.lightHr} />

      {/* Tenure selector */}
      {assetClass === "fixed-income" && (
        <SelectTenure
          selectedTenure={selectedTenure}
          setSelectedTenure={(t: any) => {
            setSelectedTenure(t);
            dispatch(
              onUpdateCheckouts({
                quantity: quantityState,
                netPayable,
                tickerSymbol,
                stockPrice,
                totalCharge,
                assetClass,
                tenure: `${t.tenureDuration} days`,
                tenureDuration: t.tenureDuration,
                tenureRate: Number(t.tenureDuration ?? 0) / 100,
                amount: calculatedAmount,
                name: nameInvestment,
              }),
            );
          }}
          assetClass={assetClass || ""}
        />
      )}

      {/* Amount setter */}
      <AssetsAmountSetter
        assetClass={assetClass}
        quantityState={quantityState}
        setQuantity={setQuantity}
        amount={amount}
        setAmount={setAmount}
        currentPrice={stockPrice}
        name={nameInvestment}
        setName={setNameInvestment}
      />

      {/* Broker selector */}
      <SelectBroker
        selectedBrokerName={selectedBrokerName}
        setSelectedBrokerName={(b: string) => {
          setSelectedBrokerName(b);
          dispatch(
            onUpdateCheckouts({
              quantity: quantityState,
              brokerName: b,
              netPayable,
              tickerSymbol,
              stockPrice,
              totalCharge,
              amount: calculatedAmount,
              assetClass,
            }),
          );
        }}
        assetClass={assetClass || ""}
      />

      <HR style={styles.lightHr} />
      {["etfs", "fixed-income", "stocks"].includes(assetClass) ? (
        <StockInfoLineTwo
          title={`Price for ${pluralize(quantityState || 1, "unit")}`}
          value={priceFormatter(breakdown?.currentStockPrice || 0, 2)}
        />
      ) : assetClass === "indexes" ? (
        <StockInfoLineTwo
          title='Price'
          value={priceFormatter(breakdown?.currentStockPrice || 0, 2)}
        />
      ) : assetClass === "gold" ? (
        <StockInfoLineTwo
          title={`Price for ${pluralize(quantityState || 1, "gram")}`}
          value={priceFormatter(breakdown?.currentStockPrice || 0, 2)}
        />
      ) : null}

      <HR style={styles.myHr} />

      <TouchableOpacity
        style={styles.breakdownToggleBtn}
        onPress={() => setOpenBreakdown(!openBreakdown)}
        activeOpacity={0.7}
      >
        <Text style={styles.breakdownToggleText}>Charges breakdown</Text>
        {openBreakdown ? (
          <ArrowUp2 size={16} color='#0B0014' />
        ) : (
          <ArrowDown2 size={16} color='#0B0014' />
        )}
      </TouchableOpacity>

      {/* Subtotal and breakdown toggle row */}
      <StockInfoLineTwo
        title='Sub total charges'
        value={priceFormatter(breakdown?.allCharges, 2)}
      />

      {/* Inline breakdown details */}
      {openBreakdown && (
        <View style={styles.breakdownCard}>
          {[
            { title: "Trade Alert Fee", value: breakdown?.tradeAlert },
            { title: "VAT Trade Alert", value: breakdown?.vatTradeAlert },
            { title: "Stamp Duty", value: breakdown?.stampDuty, decimals: 3 },
            { title: "SEC Fee", value: breakdown?.secFee },
            { title: "Consideration 10%", value: breakdown?.consideration },
            { title: "Brokerage Fee", value: breakdown?.brokerageFee },
            { title: "Broker Commission", value: breakdown?.brokerCommission },
            {
              title: "V.A.T on Broker Commission",
              value: breakdown?.vatOnBrokerCommission,
            },
          ].map(({ title, value, decimals }) => (
            <StockInfoLineTwo
              key={title}
              title={title}
              className='text-[#85808A]'
              value={priceFormatter(value, decimals ?? 2)}
            />
          ))}
          {assetClass === "gold" && (
            <StockInfoLineTwo
              title='Quantity'
              value={`${quantityState.toFixed(4)} grams`}
              className='text-[#85808A]'
            />
          )}
        </View>
      )}

      <HR style={styles.myHr} />

      {/* Price for units/grams */}

      {/* Total Charges */}
      {/* <StockInfoLineTwo
        title={<Text style={styles.boldLabel}>Total Charges</Text>}
        value={priceFormatter(breakdown?.allCharges, 2)}
      />

      <HR style={styles.myHr} /> */}

      {/* Net Payable */}
      <StockInfoLineTwo
        title={
          <Text style={styles.primaryBoldLabel}>
            Payable on {tickerSymbol.toUpperCase()}
            {["etfs", "stocks"].includes(assetClass)
              ? ` (${pluralize(quantity || 0, "unit")})`
              : ""}
          </Text>
        }
        value={priceFormatter(netPayable, 2)}
      />
    </ScrollView>
  );
};

export default StockBreakdownDetails;

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  qtyInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    // marginTop: 8,
    marginBottom: 8,
  },
  qtyInputBox: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E4E8",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    fontSize: 12,
    color: "#232323",
  },
  qtyEstBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E4E8",
    backgroundColor: "#fff",
    // paddingHorizontal: 8,
    minWidth: 100,
    justifyContent: "center",
  },
  // (Removed duplicate qtyEstLabel and qtyEstValue, only the 10px versions remain below)
  breakdownRow: {
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 0,
    gap: 8,
  },
  subtotalLabel: {
    color: "#A1A1A1",
    fontSize: 14,
    fontWeight: "400",
  },
  subtotalValue: {
    color: "#232323",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  breakdownToggleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  breakdownToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  breakdownToggleText: {
    color: "#0B0014",
    fontSize: 12,
    fontWeight: "500",
    marginRight: 2,
  },
  breakdownCard: {
    backgroundColor: "#F7F7F8",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    marginBottom: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flex: 1,
    width: 355,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },

  // Skeleton
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: "#F0F0F0",
    borderRadius: 6,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoPlaceholder: {
    backgroundColor: "#F0F0F0",
  },
  tickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  timeText: {
    fontSize: 10,
    color: "#999",
  },

  // Dividers
  hr: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 8,
  },
  lightHr: {
    backgroundColor: "#F8FCFA",
  },
  myHr: {
    marginVertical: 8,
    backgroundColor: "#F8FCFA",
  },

  // Tag
  tag: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "600",
  },

  // Quantity Selector
  qtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qtyEstLabel: {
    color: "#A1A1A1",
    fontSize: 10,
    fontWeight: "400",
    marginRight: 2,
  },
  qtyEstValue: {
    color: "#232323",
    fontSize: 12,
    fontWeight: "600",
  },
  // Removed duplicate and misplaced styles for qtyBtnText, qtyInput, and unrelated properties

  // Amount Input
  mt4: {
    marginTop: 16,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountInput: {
    width: 150,
    height: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    fontSize: 13,
    color: "#000",
  },

  // Breakdown Toggle
  breakdownToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },

  // Labels
  boldLabel: {
    color: "#85808A",
    fontWeight: "700",
    fontSize: 12,
  },
  primaryBoldLabel: {
    color: "#0B0014",
    fontSize: 12,
  },
});
