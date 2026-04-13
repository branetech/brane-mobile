import { ContactPickerModal, DataPlanModal } from "@/components/bills-utilities/Modals";
import { PhoneInput } from "@/components/phone-input";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import BaseRequest from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { Text, View } from "@idimma/rn-widget";
import {
  ArrowDown2,
  Mobile,
  Profile2User,
  WifiSquare,
} from "iconsax-react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { cleanNetworkLabel, getNetworkImageKey, normalizeDataPlan, normalizeOption, toArray } from "./helpers";
import {
  AMOUNT_PRESETS,
  type DataPlan,
  NETWORK_IMAGES,
  NETWORK_ORDER,
  type UtilityFormData,
  type UtilityFormRef,
  type UtilityService,
} from "./types";

type Props = {
  service: UtilityService;
  onSwitchService: (s: UtilityService) => void;
  onReady: (data: UtilityFormData) => void;
};

const AirtimeDataForm = forwardRef<UtilityFormRef, Props>(({
  service,
  onSwitchService,
  onReady,
}, ref) => {
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { data: airtimeProvider } = useRequest("/mobile-connectivity-service/airtime/providers");
  const { data: mobileDataProvider } = useRequest("/mobile-connectivity-service/mobile-data/providers");
  const { user }: any = useAppState();
  const inputBg = C.inputBackground;

  // ── State ───────────────────────────────────────────────────────────────────
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [selectedDataPlanId, setSelectedDataPlanId] = useState("");
  const [addToBeneficiaries, setAddToBeneficiaries] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDataPlanModal, setShowDataPlanModal] = useState(false);
  const [dataPlanCategory, setDataPlanCategory] = useState<"hot" | "daily" | "weekly" | "monthly" | "yearly">("hot");
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [amountError, setAmountError] = useState<string | undefined>();

  // ── Derived ─────────────────────────────────────────────────────────────────
  const orderedNetworks = useMemo(() => {
    return toArray(service === "airtime" ? airtimeProvider : mobileDataProvider)
      .map(normalizeOption)
      .sort((a, b) => {
        const aKey = getNetworkImageKey(`${a.id} ${a.label} ${a.description || ""}`);
        const bKey = getNetworkImageKey(`${b.id} ${b.label} ${b.description || ""}`);
        const ai = NETWORK_ORDER.findIndex((item) => aKey.includes(item));
        const bi = NETWORK_ORDER.findIndex((item) => bKey.includes(item));
        return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      });
  }, [airtimeProvider, mobileDataProvider, service]);

  const selectedDataPlan = useMemo(
    () => dataPlans.find((p) => p.id === selectedDataPlanId),
    [dataPlans, selectedDataPlanId],
  );

  const selectedNetworkObj = orderedNetworks.find((n) => n.id === network);
  const networkLabel = selectedNetworkObj?.label || network.toUpperCase();
  const networkImageKey = getNetworkImageKey(
    `${network} ${selectedNetworkObj?.label || ""} ${selectedNetworkObj?.description || ""}`,
  );
  const amountToPay = service === "data" ? selectedDataPlan?.amount || 0 : Number(amount || 0);

  // ── Effects ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (orderedNetworks.length > 0 && !network) {
      setNetwork(orderedNetworks[0].id);
    }
  }, [orderedNetworks, network]);

  const fetchDataPlans = useCallback(async (serviceId: string) => {
    if (!serviceId) {
      setDataPlans([]);
      setSelectedDataPlanId("");
      return;
    }
    try {
      const response: any = await BaseRequest.get(
        `${MOBILE_SERVICE.VARIATION_CODES}?serviceId=${encodeURIComponent(serviceId)}`,
      );
      const plans = toArray(response).map(normalizeDataPlan).filter((p) => p.amount > 0);
      setDataPlans(plans);
      setSelectedDataPlanId(plans.length > 0 ? plans[0].id : "");
    } catch {
      setDataPlans([]);
      setSelectedDataPlanId("");
    }
  }, []);

  useEffect(() => {
    if (!network || service !== "data") return;
    fetchDataPlans(network);
  }, [fetchDataPlans, network, service]);

  // Emit latest formData to parent on every relevant change
  useEffect(() => {
    onReady({
      service,
      amountToPay,
      transactionTarget: phone,
      network,
      networkLabel,
      networkImageKey,
      phone,
      addToBeneficiaries,
      beneficiaryName,
      selectedDataPlan,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, amountToPay, phone, network, networkLabel, networkImageKey, addToBeneficiaries, beneficiaryName, selectedDataPlan]);

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    setPhoneError(undefined);
    setAmountError(undefined);

    if (!network) {
      setPhoneError("No network provider available right now");
      return false;
    }
    const phoneRegex = /^[0-9+]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      setPhoneError("Enter a valid phone number");
      return false;
    }
    if (service === "airtime" && Number(amount) <= 0) {
      setAmountError("Enter a valid amount");
      return false;
    }
    if (service === "data" && !selectedDataPlan) {
      setAmountError("Select a data plan");
      return false;
    }
    return true;
  };

  useImperativeHandle(ref, () => ({ validate }));

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleUseMyNumber = () => {
    setPhone(user?.data?.phone || "");
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Airtime / Data tab switcher */}
      <View style={styles.segmentTabs}>
        <TouchableOpacity
          style={styles.segmentTab}
          onPress={() => onSwitchService("airtime")}
        >
          <Mobile
            size={16}
            color={service === "airtime" ? "#013D25" : "#7F7F86"}
            variant="Outline"
          />
          <ThemedText
            style={[
              styles.segmentTabText,
              service === "airtime" && styles.segmentTabTextActive,
            ]}
          >
            Airtime
          </ThemedText>
          {service === "airtime" && <View style={styles.segmentTabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.segmentTab}
          onPress={() => onSwitchService("data")}
        >
          <WifiSquare
            size={16}
            color={service === "data" ? "#013D25" : "#7F7F86"}
            variant="Outline"
          />
          <ThemedText
            style={[
              styles.segmentTabText,
              service === "data" && styles.segmentTabTextActive,
            ]}
          >
            Data
          </ThemedText>
          {service === "data" && <View style={styles.segmentTabUnderline} />}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {/* Network provider grid */}
        <ThemedText style={styles.fieldLabel}>Provider</ThemedText>
        <View style={styles.networkGrid}>
          {orderedNetworks.map((item) => {
            const selected = network === item.id;
            const imgKey = getNetworkImageKey(
              `${item.id} ${item.label} ${item.description || ""}`,
            );
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.networkTile,
                  selected && styles.networkTileActive,
                ]}
                onPress={() => setNetwork(item.id)}
              >
                <Image
                  source={NETWORK_IMAGES[imgKey] || NETWORK_IMAGES.mtn}
                  style={styles.networkLogo}
                  resizeMode="contain"
                />
                <ThemedText
                  style={[
                    styles.networkText,
                    selected && styles.networkTextActive,
                  ]}
                >
                  {cleanNetworkLabel(item.label)}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
          {orderedNetworks.length === 0 && (
            <ThemedText style={styles.emptyText}>
              No network provider available.
            </ThemedText>
          )}
        </View>

        {/* Phone number input */}
        <View spaced row aligned>
          <Text fs={12}>Phone Number</Text>
          <TouchableOpacity onPress={handleUseMyNumber}>
            <Text primary fs={12} regular>Use My Number</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.phoneRow, { backgroundColor: inputBg, paddingRight: 14, borderRadius: 12 }]}>
          <View style={{ flex: 1 }}>
            <PhoneInput
              value={phone}
              onPhoneChange={(v) => {
                setPhone(v);
                setPhoneError(undefined);
              }}
              error={!!phoneError}
              errorMessage={phoneError}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowContactModal(true)}
            style={styles.contactPickerBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <BeneficiaryIcon />
          </TouchableOpacity>
        </View>

        {/* Add to beneficiaries toggle */}
        <View
          style={[
            styles.beneficiaryCon,
            { borderColor: C.border, backgroundColor: C.background },
          ]}
        >
          <View style={[styles.beneficiaryRow]}>
            <ThemedText style={[styles.beneficiaryText, { color: C.text }]}>
              Add to beneficiaries
            </ThemedText>
            <Switch
              value={addToBeneficiaries}
              onValueChange={setAddToBeneficiaries}
              trackColor={{ false: "#E6E6E8", true: "#D2F1E4" }}
              thumbColor={addToBeneficiaries ? "#013D25" : "#FFFFFF"}
              ios_backgroundColor="#E6E6E8"
              style={{
                transform: [
                  { scaleX: Platform.OS === "ios" ? 0.85 : 1.1 },
                  { scaleY: Platform.OS === "ios" ? 0.85 : 1.1 },
                ],
              }}
            />
          </View>

          {addToBeneficiaries && (
            <View
              style={[
                styles.inlineInput,
                {
                  borderColor: C.border,
                  backgroundColor: C.inputBg,
                  marginTop: 4,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.inlineInputText,
                  { color: C.text, fontSize: 14 },
                ]}
                placeholder="Enter beneficiary name"
                placeholderTextColor={C.muted}
                value={beneficiaryName}
                onChangeText={setBeneficiaryName}
                autoCapitalize="words"
              />
            </View>
          )}
        </View>

        {/* Data plan selector */}
        {service === "data" && (
          <>
            <ThemedText style={styles.fieldLabel}>Plan</ThemedText>
            <TouchableOpacity
              style={styles.planSelector}
              onPress={() => setShowDataPlanModal(true)}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  styles.planSelectorTitle,
                  !selectedDataPlan && { color: "#A9A9AE" },
                ]}
              >
                {selectedDataPlan ? selectedDataPlan.label : "Select Plan"}
              </ThemedText>
              <ArrowDown2 size={18} color="#6E6E75" />
            </TouchableOpacity>
            {amountError ? (
              <ThemedText style={styles.errorText}>{amountError}</ThemedText>
            ) : null}

            <ThemedText style={styles.fieldLabel}>Amount</ThemedText>
            <View style={[styles.inlineInput, { backgroundColor: "#F8F8FA" }]}>
              <ThemedText style={styles.currencyPrefix}>₦</ThemedText>
              <ThemedText style={styles.inlineInputText}>
                {selectedDataPlan
                  ? Number(selectedDataPlan.amount).toLocaleString("en-NG")
                  : "Select Plan"}
              </ThemedText>
            </View>
          </>
        )}

        {/* Airtime amount presets */}
        {service === "airtime" && (
          <>
            <ThemedText style={styles.fieldLabel}>Amount</ThemedText>
            <View style={styles.amountGrid}>
              {AMOUNT_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.amountChip,
                    amount === preset && styles.amountChipActive,
                  ]}
                  onPress={() => {
                    setAmount(preset);
                    setAmountError(undefined);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.amountChipText,
                      amount === preset && styles.amountChipTextActive,
                    ]}
                  >
                    ₦ {Number(preset).toLocaleString()}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={[
                styles.customAmountInput,
                amountError ? styles.inputError : undefined,
              ]}
            >
              <TextInput
                style={styles.customAmountText}
                placeholder="Enter custom amount"
                placeholderTextColor="#A9A9AE"
                keyboardType="number-pad"
                value={amount}
                onChangeText={(v) => {
                  setAmount(v.replace(/\D/g, ""));
                  setAmountError(undefined);
                }}
              />
            </View>
            {amountError ? (
              <ThemedText style={styles.errorText}>{amountError}</ThemedText>
            ) : null}
          </>
        )}
      </View>

      {/* Modals owned by this form */}
      <ContactPickerModal
        service={service}
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSelect={(selectedPhone) => {
          setPhone(selectedPhone);
          setPhoneError(undefined);
          setShowContactModal(false);
        }}
      />

      <DataPlanModal
        visible={showDataPlanModal}
        onClose={() => setShowDataPlanModal(false)}
        dataPlans={dataPlans}
        selectedDataPlanId={selectedDataPlanId}
        dataPlanCategory={dataPlanCategory}
        setDataPlanCategory={setDataPlanCategory}
        onSelect={(planId) => {
          setSelectedDataPlanId(planId);
          setAmountError(undefined);
          setShowDataPlanModal(false);
        }}
      />
    </>
  );
});

AirtimeDataForm.displayName = "AirtimeDataForm";
export default AirtimeDataForm;

const styles = StyleSheet.create({
  segmentTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEE",
    marginBottom: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    position: "relative",
  },
  segmentTabUnderline: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#013D25",
    borderRadius: 2,
  },
  segmentTabText: {
    fontSize: 13,
    color: "#7F7F86",
    fontWeight: "600",
  },
  segmentTabTextActive: { color: "#013D25" },
  card: { gap: 14, backgroundColor: "#FFFFFF" },
  fieldLabel: {
    fontSize: 12,
    color: "#8A8A90",
    fontWeight: "500",
    marginBottom: -6,
  },
  networkGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  networkTile: {
    width: "22%",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#F8FCFA",
    backgroundColor: "#F8FCFA",
    paddingVertical: 12,
    alignItems: "center",
    gap: 6,
  },
  networkTileActive: { borderColor: "#013D25", borderWidth: 2 },
  networkLogo: { width: 34, height: 34 },
  networkText: { fontSize: 10, color: "#5A5660", fontWeight: "500" },
  networkTextActive: { color: "#013D25", fontWeight: "700" },
  inlineInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E9E9EC",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contactPickerBtn: {
    padding: 6,
  },
  inputError: { borderColor: "#D73C3C" },
  inlineInputText: { flex: 1, color: "#0B0014", fontSize: 12 },
  currencyPrefix: { fontSize: 14, fontWeight: "700", color: "#4A4A50" },
  errorText: { color: "#D73C3C", fontSize: 10, marginTop: -4 },
  beneficiaryCon: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  beneficiaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  beneficiaryText: { fontSize: 14, fontWeight: "500" },
  planSelector: {
    borderWidth: 1,
    borderColor: "#E7E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  planSelectorTitle: { fontSize: 12, color: "#1D1D22", fontWeight: "600" },
  amountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  amountChip: {
    width: "23%",
    flexGrow: 1,
    borderWidth: 1,
    borderColor: "#E8E8EA",
    borderRadius: 8,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  amountChipActive: { borderColor: "#013D25", borderWidth: 2 },
  amountChipText: { fontSize: 12, color: "#4F4F56", fontWeight: "500" },
  amountChipTextActive: { color: "#013D25" },
  customAmountInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E9E9EC",
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  customAmountText: { fontSize: 14, color: "#0B0014" },
  emptyText: { fontSize: 12, color: "#8E8E93", textAlign: "center" },
});

const BeneficiaryIcon = () => (
  <Profile2User size={20} color="#85808A" />
);
