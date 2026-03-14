import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import {
    hideAppLoader,
    priceFormatter,
    showAppLoader,
    showError,
} from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TickCircle } from "iconsax-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "electricity" | "cable" | "betting";
type Stage = "form" | "pin" | "success";
type Scheme = "light" | "dark";

const toArray = (v: any): any[] => {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.records)) return v.records;
  if (Array.isArray(v?.data?.records)) return v.data.records;
  return [];
};

const ELECTRICITY_AMOUNTS = ["5000", "10000", "20000", "50000"];

const CABLE_IMAGES: Record<string, any> = {
  dstv: require("@/assets/images/network/dstv.png"),
  gotv: require("@/assets/images/network/gotv.png"),
  startimes: require("@/assets/images/network/startimes.png"),
  showmax: require("@/assets/images/network/showmax.png"),
};

export default function PayBillsScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: Scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const params = useLocalSearchParams();
  const mode = String(params.mode || "electricity").toLowerCase() as Mode;

  const [stage, setStage] = useState<Stage>("form");
  const [pinVisible, setPinVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Electricity state ────────────────────────────────────────────────────
  const [elProviders, setElProviders] = useState<any[]>([]);
  const [elProvider, setElProvider] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [meterProduct, setMeterProduct] = useState<"prepaid" | "postpaid">(
    "prepaid",
  );
  const [elAmount, setElAmount] = useState("");
  const [elVerified, setElVerified] = useState(false);
  const [elAccountName, setElAccountName] = useState("");
  const [elVerifying, setElVerifying] = useState(false);

  // ─── Cable state ──────────────────────────────────────────────────────────
  const [cableProvider, setCableProvider] = useState("");
  const [smartCard, setSmartCard] = useState("");
  const [cableVerified, setCableVerified] = useState(false);
  const [cableAccountName, setCableAccountName] = useState("");
  const [cableVerifying, setCableVerifying] = useState(false);
  const [cablePlans, setCablePlans] = useState<any[]>([]);
  const [cablePlan, setCablePlan] = useState("");
  const [cablePlanAmount, setCablePlanAmount] = useState(0);

  // ─── Betting state ────────────────────────────────────────────────────────
  const [bettingProviders, setBettingProviders] = useState<any[]>([]);
  const [bettingProvider, setBettingProvider] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [bettingAmount, setBettingAmount] = useState("");

  // Fetch providers on mount
  useEffect(() => {
    if (mode === "electricity") fetchElProviders();
    else if (mode === "betting") fetchBettingProviders();
  }, [mode]);

  const fetchElProviders = async () => {
    try {
      const res: any = await BaseRequest.get(
        MOBILE_SERVICE.ELECTRICITY_GET_BILLER,
      );
      const providerMap = res?.data?.providers || res?.providers || {};
      const list = Object.keys(providerMap).map((key) => ({
        id: key.toLowerCase(),
        label: key,
        description: String(providerMap[key]),
      }));
      setElProviders(list);
    } catch (error) {
      catchError(error);
    }
  };

  const fetchBettingProviders = async () => {
    try {
      const res: any = await BaseRequest.get(MOBILE_SERVICE.BETTING_SERVICE);
      setBettingProviders(toArray(res?.data || res));
    } catch (error) {
      catchError(error);
    }
  };

  const fetchCablePlans = async (providerId: string) => {
    try {
      const res: any = await BaseRequest.get(
        MOBILE_SERVICE.BILLER_CODE(providerId),
      );
      setCablePlans(
        toArray(res?.data?.variations || res?.variations || res?.data || res),
      );
    } catch (error) {
      catchError(error);
    }
  };

  const handleVerifyMeter = async () => {
    if (!meterNumber || !elProvider) {
      showError("Please enter meter number and select a provider");
      return;
    }
    setElVerifying(true);
    try {
      const res: any = await BaseRequest.post(
        MOBILE_SERVICE.ELECTRICITY_METER_VERIFY,
        {
          meterNumber,
          serviceId: elProvider,
          type: meterProduct,
        },
      );
      const name =
        res?.data?.name ||
        res?.name ||
        res?.data?.customerName ||
        res?.customerName ||
        "Verified";
      setElAccountName(name);
      setElVerified(true);
    } catch (error) {
      catchError(error);
    } finally {
      setElVerifying(false);
    }
  };

  const handleVerifyCable = async () => {
    if (!smartCard || !cableProvider) {
      showError("Please enter smart card number and select a provider");
      return;
    }
    setCableVerifying(true);
    try {
      const res: any = await BaseRequest.post(
        MOBILE_SERVICE.VERIFY_CABLE_CARD,
        {
          smartCardNumber: smartCard,
          serviceId: cableProvider,
        },
      );
      const name =
        res?.data?.name ||
        res?.name ||
        res?.data?.customerName ||
        res?.customerName ||
        "Verified";
      setCableAccountName(name);
      setCableVerified(true);
      fetchCablePlans(cableProvider);
    } catch (error) {
      catchError(error);
    } finally {
      setCableVerifying(false);
    }
  };

  const canSubmit = useCallback(() => {
    if (mode === "electricity") return elVerified && !!elAmount;
    if (mode === "cable") return cableVerified && !!cablePlan;
    if (mode === "betting")
      return !!bettingProvider && !!customerId && !!bettingAmount;
    return false;
  }, [
    mode,
    elVerified,
    elAmount,
    cableVerified,
    cablePlan,
    bettingProvider,
    customerId,
    bettingAmount,
  ]);

  const handleSubmit = async () => {
    setPinVisible(false);
    setIsLoading(true);
    showAppLoader({ message: "Processing payment..." });
    try {
      if (mode === "electricity") {
        await BaseRequest.post(MOBILE_SERVICE.ELECTRICITY_BUY, {
          meterNumber,
          serviceId: elProvider,
          amount: Number(elAmount),
          type: meterProduct,
        });
      } else if (mode === "cable") {
        const plan = cablePlans.find((p) => {
          const code = p?.variation_code || p?.variationCode || p?.id || "";
          return code === cablePlan;
        });
        await BaseRequest.post(MOBILE_SERVICE.BUY_CABLE, {
          serviceId: cableProvider,
          smartCardNumber: smartCard,
          variationCode: cablePlan,
          amount:
            cablePlanAmount || plan?.variation_amount || plan?.amount || 0,
          subscriptionType: plan?.subscription_type || "change",
        });
      } else if (mode === "betting") {
        await BaseRequest.post(MOBILE_SERVICE.BETTING_BUY_SERVICE, {
          serviceId: bettingProvider,
          customerId,
          amount: Number(bettingAmount),
        });
      }
      setStage("success");
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
      hideAppLoader();
    }
  };

  const modeTitle: Record<Mode, string> = {
    electricity: "Electricity",
    cable: "Cable TV",
    betting: "Betting",
  };

  const renderElectricity = () => (
    <>
      {/* Provider selector */}
      <ThemedText
        style={{ ...StyleSheet.flatten(styles.sectionLabel), color: C.muted }}
      >
        Electricity Provider
      </ThemedText>
      <View style={styles.providerGrid}>
        {elProviders.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={{
              ...StyleSheet.flatten(styles.providerChip),
              borderColor: elProvider === p.id ? C.primary : C.border,
              backgroundColor: elProvider === p.id ? "#EAF8F1" : C.inputBg,
            }}
            onPress={() => {
              setElProvider(p.id);
              setElVerified(false);
              setElAccountName("");
            }}
          >
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.providerChipText),
                color: elProvider === p.id ? C.primary : C.text,
              }}
            >
              {p.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product selector */}
      <ThemedText
        style={{ ...StyleSheet.flatten(styles.sectionLabel), color: C.muted }}
      >
        Meter Type
      </ThemedText>
      <View style={styles.toggleRow}>
        {(["prepaid", "postpaid"] as const).map((pt) => (
          <TouchableOpacity
            key={pt}
            style={{
              ...StyleSheet.flatten(styles.toggleBtn),
              backgroundColor: meterProduct === pt ? C.primary : C.inputBg,
              borderColor: meterProduct === pt ? C.primary : C.border,
            }}
            onPress={() => {
              setMeterProduct(pt);
              setElVerified(false);
              setElAccountName("");
            }}
          >
            <ThemedText
              style={{
                ...StyleSheet.flatten(styles.toggleBtnText),
                color: meterProduct === pt ? "#FFFFFF" : C.text,
              }}
            >
              {pt.charAt(0).toUpperCase() + pt.slice(1)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <FormInput
        labelText="Meter Number"
        placeholder="Enter meter number"
        value={meterNumber}
        onChangeText={(v) => {
          setMeterNumber(v);
          setElVerified(false);
          setElAccountName("");
        }}
        keyboardType="numeric"
      />

      {elAccountName ? (
        <View
          style={{
            ...StyleSheet.flatten(styles.verifiedBanner),
            borderColor: "#09734C",
            backgroundColor: "#EAF8F1",
          }}
        >
          <TickCircle size={16} color="#09734C" variant="Bold" />
          <ThemedText
            style={{
              ...StyleSheet.flatten(styles.verifiedText),
              color: "#09734C",
            }}
          >
            {elAccountName}
          </ThemedText>
        </View>
      ) : (
        <BraneButton
          text={elVerifying ? "Verifying…" : "Verify Meter"}
          onPress={handleVerifyMeter}
          backgroundColor="#013D25"
          textColor="#D2F1E4"
          height={44}
          radius={10}
          width="100%"
          loading={elVerifying}
          disabled={!meterNumber || !elProvider}
        />
      )}

      {elVerified && (
        <>
          <ThemedText
            style={{
              ...StyleSheet.flatten(styles.sectionLabel),
              color: C.muted,
            }}
          >
            Amount
          </ThemedText>
          <View style={styles.presetRow}>
            {ELECTRICITY_AMOUNTS.map((a) => (
              <TouchableOpacity
                key={a}
                style={{
                  ...StyleSheet.flatten(styles.presetChip),
                  borderColor: elAmount === a ? C.primary : C.border,
                  backgroundColor: elAmount === a ? "#EAF8F1" : C.inputBg,
                }}
                onPress={() => setElAmount(a)}
              >
                <ThemedText
                  style={{
                    ...StyleSheet.flatten(styles.presetText),
                    color: elAmount === a ? C.primary : C.text,
                  }}
                >
                  {priceFormatter(Number(a))}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <FormInput
            labelText="Or enter amount"
            placeholder="₦ 0.00"
            value={elAmount}
            onChangeText={(v) => setElAmount(v.replace(/\D/g, ""))}
            keyboardType="numeric"
          />
        </>
      )}
    </>
  );

  const renderCable = () => (
    <>
      <ThemedText
        style={{ ...StyleSheet.flatten(styles.sectionLabel), color: C.muted }}
      >
        Cable Provider
      </ThemedText>
      <View style={styles.cableRow}>
        {(["dstv", "gotv", "startimes", "showmax"] as const).map((key) => {
          const img = CABLE_IMAGES[key];
          const isSelected = cableProvider === key;
          return (
            <TouchableOpacity
              key={key}
              style={{
                ...StyleSheet.flatten(styles.cableChip),
                borderColor: isSelected ? C.primary : C.border,
                backgroundColor: isSelected ? "#EAF8F1" : C.inputBg,
              }}
              onPress={() => {
                setCableProvider(key);
                setCableVerified(false);
                setCableAccountName("");
                setCablePlans([]);
                setCablePlan("");
              }}
            >
              <Image
                source={img}
                style={styles.cableImg}
                resizeMode="contain"
              />
              <ThemedText
                style={{
                  ...StyleSheet.flatten(styles.cableLabel),
                  color: isSelected ? C.primary : C.text,
                }}
              >
                {key.toUpperCase()}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      <FormInput
        labelText="SmartCard / IUC Number"
        placeholder="Enter card number"
        value={smartCard}
        onChangeText={(v) => {
          setSmartCard(v);
          setCableVerified(false);
          setCableAccountName("");
        }}
        keyboardType="numeric"
      />

      {cableAccountName ? (
        <View
          style={{
            ...StyleSheet.flatten(styles.verifiedBanner),
            borderColor: "#09734C",
            backgroundColor: "#EAF8F1",
          }}
        >
          <TickCircle size={16} color="#09734C" variant="Bold" />
          <ThemedText
            style={{
              ...StyleSheet.flatten(styles.verifiedText),
              color: "#09734C",
            }}
          >
            {cableAccountName}
          </ThemedText>
        </View>
      ) : (
        <BraneButton
          text={cableVerifying ? "Verifying…" : "Verify Card"}
          onPress={handleVerifyCable}
          backgroundColor="#013D25"
          textColor="#D2F1E4"
          height={44}
          radius={10}
          width="100%"
          loading={cableVerifying}
          disabled={!smartCard || !cableProvider}
        />
      )}

      {cableVerified && cablePlans.length > 0 && (
        <>
          <ThemedText
            style={{
              ...StyleSheet.flatten(styles.sectionLabel),
              color: C.muted,
            }}
          >
            Select Plan
          </ThemedText>
          <View
            style={{
              ...StyleSheet.flatten(styles.card),
              borderColor: C.border,
            }}
          >
            {cablePlans.map((plan, idx) => {
              const code = String(
                plan?.variation_code ||
                  plan?.variationCode ||
                  plan?.id ||
                  `plan-${idx}`,
              );
              const label = String(plan?.name || plan?.plan || code);
              const amount = Number(
                plan?.variation_amount || plan?.amount || 0,
              );
              const isSelected = cablePlan === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={{
                    ...StyleSheet.flatten(styles.planRow),
                    ...(idx < cablePlans.length - 1
                      ? StyleSheet.flatten(styles.planDivider)
                      : {}),
                  }}
                  onPress={() => {
                    setCablePlan(code);
                    setCablePlanAmount(amount);
                  }}
                >
                  <View style={styles.planInfo}>
                    <ThemedText
                      style={{
                        ...StyleSheet.flatten(styles.planLabel),
                        color: C.text,
                      }}
                    >
                      {label}
                    </ThemedText>
                    <ThemedText
                      style={{
                        ...StyleSheet.flatten(styles.planAmount),
                        color: C.muted,
                      }}
                    >
                      {priceFormatter(amount, 2)}
                    </ThemedText>
                  </View>
                  <View
                    style={{
                      ...StyleSheet.flatten(styles.radio),
                      borderColor: isSelected ? C.primary : C.border,
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          ...StyleSheet.flatten(styles.radioInner),
                          backgroundColor: C.primary,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </>
  );

  const renderBetting = () => (
    <>
      <ThemedText
        style={{ ...StyleSheet.flatten(styles.sectionLabel), color: C.muted }}
      >
        Betting Platform
      </ThemedText>
      <View style={styles.providerGrid}>
        {bettingProviders.map((p, idx) => {
          const id = String(
            p?.serviceID || p?.id || p?.name || `bet-${idx}`,
          ).toLowerCase();
          const label = String(p?.name || p?.label || id).toUpperCase();
          return (
            <TouchableOpacity
              key={id}
              style={{
                ...StyleSheet.flatten(styles.providerChip),
                borderColor: bettingProvider === id ? C.primary : C.border,
                backgroundColor: bettingProvider === id ? "#EAF8F1" : C.inputBg,
              }}
              onPress={() => setBettingProvider(id)}
            >
              <ThemedText
                style={{
                  ...StyleSheet.flatten(styles.providerChipText),
                  color: bettingProvider === id ? C.primary : C.text,
                }}
              >
                {label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      <FormInput
        labelText="Customer ID / User ID"
        placeholder="Enter your betting user ID"
        value={customerId}
        onChangeText={setCustomerId}
      />

      <FormInput
        labelText="Amount"
        placeholder="₦ 0.00"
        value={bettingAmount}
        onChangeText={(v) => setBettingAmount(v.replace(/\D/g, ""))}
        keyboardType="numeric"
      />
    </>
  );

  const renderSuccess = () => (
    <View style={styles.successContainer}>
      <TickCircle size={80} color="#09734C" variant="Bold" />
      <ThemedText
        style={{ ...StyleSheet.flatten(styles.successTitle), color: C.text }}
      >
        Payment Successful!
      </ThemedText>
      <ThemedText
        style={{ ...StyleSheet.flatten(styles.successSub), color: C.muted }}
      >
        Your {modeTitle[mode]} payment was processed successfully.
      </ThemedText>
      <View style={{ gap: 12, width: "100%", marginTop: 24 }}>
        <BraneButton
          text="Go Home"
          onPress={() => router.push("/(tabs)")}
          backgroundColor={C.primary}
          textColor="#D2F1E4"
          height={52}
          radius={12}
          width="100%"
        />
        <BraneButton
          text="Pay Another Bill"
          onPress={() => {
            setStage("form");
            setElVerified(false);
            setElAccountName("");
            setMeterNumber("");
            setElAmount("");
            setCableVerified(false);
            setCableAccountName("");
            setSmartCard("");
            setCablePlan("");
            setCustomerId("");
            setBettingAmount("");
          }}
          backgroundColor="transparent"
          textColor={C.primary}
          height={52}
          radius={12}
          width="100%"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        ...StyleSheet.flatten(styles.screen),
        backgroundColor: C.background,
      }}
    >
      {stage !== "success" && (
        <View style={styles.header}>
          <Back onPress={() => router.back()} />
          <ThemedText
            style={{ ...StyleSheet.flatten(styles.headerTitle), color: C.text }}
          >
            {modeTitle[mode as Mode] || "Pay Bills"}
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>
      )}

      {stage === "form" && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {mode === "electricity" && renderElectricity()}
            {mode === "cable" && renderCable()}
            {mode === "betting" && renderBetting()}

            {canSubmit() && (
              <BraneButton
                text="Proceed"
                onPress={() => setPinVisible(true)}
                backgroundColor={C.primary}
                textColor="#D2F1E4"
                height={52}
                radius={12}
                width="100%"
                loading={isLoading}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {stage === "success" && renderSuccess()}

      <TransactionPinValidator
        visible={pinVisible}
        onClose={() => setPinVisible(false)}
        onTransactionPinValidated={handleSubmit}
      />
    </SafeAreaView>
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
  content: { paddingHorizontal: 16, paddingBottom: 40, gap: 16 },
  sectionLabel: { fontSize: 12, fontWeight: "600", marginBottom: -8 },
  providerGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  providerChip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  providerChipText: { fontSize: 13, fontWeight: "600" },
  toggleRow: { flexDirection: "row", gap: 10 },
  toggleBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleBtnText: { fontSize: 13, fontWeight: "600" },
  presetRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  presetChip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  presetText: { fontSize: 13, fontWeight: "600" },
  verifiedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  verifiedText: { fontSize: 13, fontWeight: "600" },
  cableRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  cableChip: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    gap: 4,
    width: "22%",
  },
  cableImg: { width: 36, height: 36 },
  cableLabel: { fontSize: 10, fontWeight: "700" },
  card: { borderWidth: 1, borderRadius: 12, padding: 14 },
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  planDivider: { borderBottomWidth: 1, borderBottomColor: "#EFEFF1" },
  planInfo: { flex: 1, gap: 2 },
  planLabel: { fontSize: 13, fontWeight: "600" },
  planAmount: { fontSize: 12 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  successTitle: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  successSub: { fontSize: 14, textAlign: "center", lineHeight: 22 },
});
