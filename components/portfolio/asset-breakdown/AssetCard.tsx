import { useRouter } from "expo-router";
import { ArrowDown2, Trash } from "iconsax-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

import { FormInput } from "@/components/formInput";
import {
  onRemoveFromCheckouts,
  onUpdateCheckouts,
} from "@/redux/slice/auth-slice";
import { STOCKS_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { pluralize, priceFormatter } from "@/utils/helpers";
import { StockInfoLine, StockInfoLineTwo } from "../..";

import { ThemedText } from "@/components/themed-text";
import SelectBroker, { SelectTenure } from "./broker-selector";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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

  const estimatedCost = (Number(inputValue) || 0) * currentPrice;

  return (
    <View>
      <View style={styles.qtyRow}>
        <FormInput
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
          containerStyle={styles.qtyInputContainer}
          inputContainerStyle={styles.qtyInputBox}
        />
        <View style={styles.qtyEstBox}>
          <Text style={styles.qtyEstText}>
            Est: {priceFormatter(estimatedCost, 0)}
          </Text>
        </View>
      </View>
      <Text style={styles.qtyPriceLabel}>
        Price per unit: {priceFormatter(currentPrice, 2)}
      </Text>
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
    <View style={{ paddingVertical: 5, marginVertical: 32 }}>
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
  const [openBreakdown, setOpenBreakdown] = useState(false);

  const { data: stock, isLoading: isStockLoading } = useRequest(
    STOCKS_SERVICE.DETAILS(tickerSymbol),
    {
      initialValue: { companyName: "" },
      revalidateOnFocus: false,
      revalidateOnMount: false,
    },
  );

  // Support both currentPrice and currentStockPrice from API
  const { companyName, logo, assetClass } = stock || {};
  const currentPrice = stock?.currentPrice ?? stock?.currentStockPrice ?? 0;

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
      revalidateOnMount: true,
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
    if (assetClass) refetchBreakdown();
  }, [calculatedAmount, quantityState, assetClass, refetchBreakdown]);

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
  const stockPrice = breakdown?.currentStockPrice || 0;
  const netPayable = stockPrice + totalCharge;

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
            <ThemedText style={{ color: "#85808A", fontSize: 10 }}>
              {companyName}
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Trash size={20} color='red' />
        </TouchableOpacity>
      </View>

      <HR />

      {/* Asset Class */}
      <View style={{ marginTop: 16 }}>
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
        currentPrice={currentPrice}
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

      {/* Charges breakdown toggle */}
      <TouchableOpacity
        style={styles.breakdownToggle}
        onPress={() => setOpenBreakdown(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.breakdownToggleText}>Charges breakdown</Text>
        <ArrowDown2 size={18} color='#85808A' />
      </TouchableOpacity>

      <Modal
        visible={openBreakdown}
        animationType='slide'
        transparent
        onRequestClose={() => setOpenBreakdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpenBreakdown(false)}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Charges Breakdown</Text>
            <TouchableOpacity onPress={() => setOpenBreakdown(false)}>
              <ArrowDown2 size={22} color='#85808A' />
            </TouchableOpacity>
          </View>
          <View style={{ maxHeight: 350 }}>
            {[
              { title: "Trade Alert Fee", value: breakdown?.tradeAlert },
              { title: "VAT Trade Alert", value: breakdown?.vatTradeAlert },
              { title: "Stamp Duty", value: breakdown?.stampDuty, decimals: 3 },
              { title: "SEC Fee", value: breakdown?.secFee },
              { title: "Consideration 10%", value: breakdown?.consideration },
              { title: "Brokerage Fee", value: breakdown?.brokerageFee },
              {
                title: "Broker Commission",
                value: breakdown?.brokerCommission,
              },
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
        </View>
      </Modal>

      <HR style={styles.myHr} />

      {/* Price for units/grams */}
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

      {/* Total Charges */}
      <StockInfoLineTwo
        title={<Text style={styles.boldLabel}>Total Charges</Text>}
        value={priceFormatter(breakdown?.allCharges, 2)}
      />

      <HR style={styles.myHr} />

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#013D25",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flex: 1,
    width: 350,
    maxWidth: 388,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
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
    width: 28,
    height: 28,
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
  hr: {
    height: 1,
    backgroundColor: "#E8E8E8",
    // marginVertical: 8,
  },
  lightHr: {
    backgroundColor: "#F8FCFA",
    marginBottom: 8,
  },
  myHr: {
    marginVertical: 8,
    backgroundColor: "#F8FCFA",
  },
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
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  qtyInputContainer: {
    flex: 1,
  },
  qtyInputBox: {
    height: 32,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E6E4E8",
    width: 180,
  },
  qtyEstBox: {
    height: 32,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#E6E4E8",
    borderRadius: 8,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: 120,
  },
  qtyEstText: {
    fontSize: 10,
    color: "#85808A",
    fontWeight: "500",
  },
  qtyPriceLabel: {
    fontSize: 10,
    color: "#85808A",
    marginTop: 8,
    fontWeight: "500",
  },
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
  breakdownToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  breakdownToggleText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "400",
  },
  boldLabel: {
    color: "#85808A",
    fontWeight: "700",
    fontSize: 12,
  },
  primaryBoldLabel: {
    color: "#013D25",
    fontWeight: "700",
    fontSize: 12,
  },
});
