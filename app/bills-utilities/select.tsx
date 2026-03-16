import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import {
    PaymentMethodSelector,
    type PaymentOption,
} from "@/components/payment-method-selector";
import { SuccessModal } from "@/components/success-modal";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import BaseRequest, { parseNetworkError } from "@/services";
import {
    onTransactionPinBettingValidation,
    onTransactionPinCabelValidation,
    onTransactionPinElectricityValidation,
    onTransactionPinValidated,
} from "@/services/data";
import {
    AUTH_SERVICE,
    MOBILE_SERVICE,
    PAYMENT_CALLBACK_URL,
    STOCKS_SERVICE,
    TRANSACTION_SERVICE,
} from "@/services/routes";
import { showError } from "@/utils/helpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Add,
    ArrowDown2,
    CloseCircle,
    Mobile,
    SearchNormal1,
    WifiSquare,
} from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

type UtilityService =
  | "airtime"
  | "data"
  | "betting"
  | "cable"
  | "electricity"
  | "transportation";

type SelectOption = {
  id: string;
  label: string;
  description?: string;
};

type Beneficiary = {
  id: string;
  name: string;
  phone: string;
  networkProvider?: string;
};

type DataPlan = {
  id: string;
  label: string;
  amount: number;
  variationCode: string;
};

type CablePlan = {
  id: string;
  label: string;
  amount: number;
  variationCode: string;
  subscriptionType: string;
};

const AMOUNT_PRESETS = [
  "500",
  "1000",
  "2000",
  "4000",
  "5000",
  "10000",
  "20000",
  "50000",
];

const NETWORK_ORDER = ["mtn", "airtel", "9mobile", "etisalat", "glo", "smile"];
const ELECTRICITY_PRODUCTS = ["prepaid", "postpaid"];
const ELECTRICITY_AMOUNTS = ["5000", "10000", "20000", "50000"];
const TRANSPORT_KEYWORDS = [
  "transport",
  "bus",
  "rail",
  "metro",
  "brt",
  "train",
];

const NETWORK_IMAGES: Record<string, any> = {
  mtn: require("@/assets/images/network/mtn.png"),
  mtnn: require("@/assets/images/network/mtn.png"),
  airtel: require("@/assets/images/network/airtel.png"),
  glo: require("@/assets/images/network/glo.png"),
  "9mobile": require("@/assets/images/network/9mobile.png"),
  etisalat: require("@/assets/images/network/9mobile.png"),
  "smile-direct": require("@/assets/images/network/smile-direct.png"),
};

const CABLE_IMAGES: Record<string, any> = {
  dstv: require("@/assets/images/network/dstv.png"),
  gotv: require("@/assets/images/network/gotv.png"),
  startimes: require("@/assets/images/network/startimes.png"),
  showmax: require("@/assets/images/network/showmax.png"),
};

const ELECTRICITY_IMAGES: Record<string, any> = {
  aedc: require("@/assets/images/network/aedc.png"),
  bedc: require("@/assets/images/network/bedc.png"),
  eedc: require("@/assets/images/network/eedc.png"),
  ekedc: require("@/assets/images/network/ekedc.png"),
  ibedc: require("@/assets/images/network/ibedc.png"),
  ikedc: require("@/assets/images/network/ikedc.png"),
  jed: require("@/assets/images/network/jed.png"),
  kaedco: require("@/assets/images/network/kaedco.png"),
  kedc: require("@/assets/images/network/kedc.png"),
  kedco: require("@/assets/images/network/kedco.png"),
  phed: require("@/assets/images/network/phed.png"),
  yedc: require("@/assets/images/network/yedc.png"),
};

const normalizeKey = (value: string) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const getNetworkImageKey = (value: string) => {
  const key = normalizeKey(value);
  if (key.includes("mtn")) return "mtn";
  if (key.includes("airtel")) return "airtel";
  if (key.includes("glo")) return "glo";
  if (key.includes("9mobile") || key.includes("etisalat")) return "9mobile";
  if (key.includes("smile")) return "smile-direct";
  return "mtn";
};

const getCableImageKey = (value: string) => {
  const key = normalizeKey(value);
  if (key.includes("dstv")) return "dstv";
  if (key.includes("gotv")) return "gotv";
  if (
    key.includes("startimes") ||
    key.includes("star times") ||
    key.includes("startime")
  )
    return "startimes";
  if (key.includes("showmax")) return "showmax";
  return "";
};

const getElectricityImageKey = (value: string) => {
  const key = normalizeKey(value);
  if (key.includes("ikeja") || key.includes("ikedc")) return "ikedc";
  if (key.includes("eko") || key.includes("ekedc")) return "ekedc";
  if (key.includes("ibadan") || key.includes("ibedc")) return "ibedc";
  if (key.includes("enugu") || key.includes("eedc")) return "eedc";
  if (key.includes("abuja") || key.includes("aedc")) return "aedc";
  if (key.includes("benin") || key.includes("bedc")) return "bedc";
  if (key.includes("jos") || key.includes("jed")) return "jed";
  if (key.includes("kaduna") || key.includes("kaedco")) return "kaedco";
  if (key.includes("kano") || key.includes("kedco")) return "kedco";
  if (key.includes("ikedc")) return "ikedc";
  if (key.includes("ekedc")) return "ekedc";
  if (key.includes("ibedc")) return "ibedc";
  if (key.includes("eedc")) return "eedc";
  if (key.includes("aedc")) return "aedc";
  if (key.includes("bedc")) return "bedc";
  if (key.includes("port harcourt") || key.includes("phed")) return "phed";
  if (key.includes("yola") || key.includes("yedc")) return "yedc";
  if (key.includes("kedc")) return "kedc";
  return "";
};

const phoneSchema = z
  .string()
  .min(10, "Enter a valid phone number")
  .max(15, "Enter a valid phone number")
  .regex(/^[0-9+]+$/, "Phone must contain digits only");

const customerIdSchema = z.string().min(6, "This field is required");

const toArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data?.providers)) return value.data.providers;
  if (Array.isArray(value?.providers)) return value.providers;
  if (Array.isArray(value?.data?.variations)) return value.data.variations;
  if (Array.isArray(value?.variations)) return value.variations;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.records)) return value.data.records;
  if (Array.isArray(value?.records)) return value.records;
  return [];
};

const normalizeOption = (item: any, index: number): SelectOption => {
  if (typeof item === "string" || typeof item === "number") {
    const value = String(item);
    return {
      id: value.toLowerCase(),
      label: value,
    };
  }

  const rawId =
    item?.serviceID ||
    item?.serviceId ||
    item?.service_id ||
    item?.id ||
    item?.code ||
    item?.slug ||
    item?.name ||
    `option-${index}`;
  const rawLabel =
    item?.name ||
    item?.label ||
    item?.serviceName ||
    item?.title ||
    String(rawId).toUpperCase();

  return {
    id: String(rawId).toLowerCase(),
    label: String(rawLabel),
    description: String(item?.provider || item?.service || ""),
  };
};

const normalizeElectricityProviders = (payload: any): SelectOption[] => {
  const providerMap = payload?.providers || payload?.data?.providers || {};
  const seenIds = new Map<string, number>();

  return Object.keys(providerMap).map((key, index) => {
    const left = String(key || "");
    const right = String(providerMap[key] || "");
    const baseId =
      getElectricityImageKey(`${left} ${right}`) ||
      normalizeKey(left).replace(/\s+/g, "-") ||
      `provider-${index}`;
    const seenCount = seenIds.get(baseId) || 0;
    seenIds.set(baseId, seenCount + 1);
    const uniqueId = seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`;
    const humanLabel = /\s|-/g.test(left) ? left : right || left;
    const meta = humanLabel === left ? right : left;

    return {
      id: uniqueId,
      label: humanLabel,
      description: meta || `provider-${index}`,
    };
  });
};

const normalizeDataPlan = (item: any, index: number): DataPlan => {
  const variationCode = String(
    item?.variation_code ||
      item?.variationCode ||
      item?.code ||
      item?.id ||
      `plan-${index}`,
  );
  const amount = Number(
    item?.variation_amount || item?.amount || item?.price || 0,
  );

  return {
    id: variationCode,
    label: String(item?.name || item?.plan || item?.variation || variationCode),
    amount,
    variationCode,
  };
};

const normalizeCablePlan = (item: any, index: number): CablePlan => {
  const variationCode = String(
    item?.variation_code ||
      item?.variationCode ||
      item?.code ||
      item?.id ||
      `cable-${index}`,
  );
  return {
    id: variationCode,
    label: String(item?.name || item?.plan || item?.variation || variationCode),
    amount: Number(item?.variation_amount || item?.amount || item?.price || 0),
    variationCode,
    subscriptionType: String(
      item?.subscription_type || item?.subscriptionType || "change",
    ),
  };
};

export default function UtilitySelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const auth = useAppState("auth");
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const styles = createStyles(C);

  const initialService = String(params.service || "airtime").toLowerCase();
  const currentService: UtilityService =
    initialService === "data" ||
    initialService === "betting" ||
    initialService === "cable" ||
    initialService === "electricity" ||
    initialService === "transportation"
      ? (initialService as UtilityService)
      : "airtime";

  const [service, setService] = useState<UtilityService>(currentService);
  const [networks, setNetworks] = useState<SelectOption[]>([]);
  const [bettingProviders, setBettingProviders] = useState<SelectOption[]>([]);
  const [cableProviders, setCableProviders] = useState<SelectOption[]>([]);
  const [electricityProviders, setElectricityProviders] = useState<
    SelectOption[]
  >([]);
  const [transportProviders, setTransportProviders] = useState<SelectOption[]>(
    [],
  );

  const [network, setNetwork] = useState<string>("");
  const [bettingProvider, setBettingProvider] = useState<string>("");
  const [cableProvider, setCableProvider] = useState<string>("");
  const [electricityProvider, setElectricityProvider] = useState<string>("");
  const [transportProvider, setTransportProvider] = useState<string>("");

  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [selectedDataPlanId, setSelectedDataPlanId] = useState<string>("");
  const [transportReference, setTransportReference] = useState("");
  const [transportPlans, setTransportPlans] = useState<DataPlan[]>([]);
  const [selectedTransportPlanId, setSelectedTransportPlanId] = useState("");

  const [addToBeneficiaries, setAddToBeneficiaries] = useState(false);
  const [paymentId, setPaymentId] = useState<string>("wallet");
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [electricityProduct, setElectricityProduct] = useState(
    ELECTRICITY_PRODUCTS[0],
  );
  const [electricityAccountName, setElectricityAccountName] = useState("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [beneficiarySearch, setBeneficiarySearch] = useState("");
  const [cablePlans, setCablePlans] = useState<CablePlan[]>([]);
  const [selectedCablePlanId, setSelectedCablePlanId] = useState<string>("");
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [amountError, setAmountError] = useState<string | undefined>();
  const [customerIdError, setCustomerIdError] = useState<string | undefined>();
  const [cardError, setCardError] = useState<string | undefined>();

  const [showPinValidator, setShowPinValidator] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDataPlanModal, setShowDataPlanModal] = useState(false);
  const [showElectricityProviderModal, setShowElectricityProviderModal] =
    useState(false);
  const [showCablePlanModal, setShowCablePlanModal] = useState(false);
  const [showTransportPlanModal, setShowTransportPlanModal] = useState(false);

  const selectedDataPlan = useMemo(
    () => dataPlans.find((plan) => plan.id === selectedDataPlanId),
    [dataPlans, selectedDataPlanId],
  );

  const selectedCablePlan = useMemo(
    () => cablePlans.find((plan) => plan.id === selectedCablePlanId),
    [cablePlans, selectedCablePlanId],
  );

  const selectedTransportPlan = useMemo(
    () => transportPlans.find((plan) => plan.id === selectedTransportPlanId),
    [transportPlans, selectedTransportPlanId],
  );

  const selectedElectricityProvider = useMemo(
    () =>
      electricityProviders.find(
        (provider) => provider.id === electricityProvider,
      ),
    [electricityProvider, electricityProviders],
  );

  const orderedNetworks = useMemo(() => {
    return [...networks].sort((a, b) => {
      const aKey = getNetworkImageKey(
        `${a.id} ${a.label} ${a.description || ""}`,
      );
      const bKey = getNetworkImageKey(
        `${b.id} ${b.label} ${b.description || ""}`,
      );
      const ai = NETWORK_ORDER.findIndex((item) => aKey.includes(item));
      const bi = NETWORK_ORDER.findIndex((item) => bKey.includes(item));
      const safeAi = ai === -1 ? 999 : ai;
      const safeBi = bi === -1 ? 999 : bi;
      return safeAi - safeBi;
    });
  }, [networks]);

  const formatMoney = (value: number) => {
    return Number(value || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const fetchPaymentOptions = useCallback(async () => {
    try {
      const [walletRes, bracsRes] = await Promise.all([
        BaseRequest.get(TRANSACTION_SERVICE.BALANCE).catch(() => null),
        BaseRequest.get(STOCKS_SERVICE.BRACS).catch(() => null),
      ]);

      const walletPayload = walletRes?.data;
      const bracsPayload = bracsRes?.data;

      const walletBalance = Number(
        walletPayload?.balance ||
          walletPayload?.data?.balance ||
          walletPayload?.data ||
          walletPayload ||
          0,
      );
      const bracsBalance = Number(
        bracsPayload?.totalBalance || bracsPayload?.data?.totalBalance || 0,
      );

      const options: PaymentOption[] = [
        {
          id: "wallet",
          label: `Brane Wallet - ₦ ${formatMoney(walletBalance)}`,
          icon: "B",
        },
        {
          id: "total_balance",
          label: `Total balance - ₦ ${formatMoney(bracsBalance)}`,
          icon: "₦",
        },
      ];

      setPaymentOptions(options);
      setPaymentId((prev) =>
        options.some((item) => item.id === prev) ? prev : options[0]?.id || "",
      );
    } catch {
      setPaymentOptions([]);
    }
  }, []);

  const filteredBeneficiaries = useMemo(() => {
    const q = beneficiarySearch.trim().toLowerCase();
    if (!q) return beneficiaries;
    return beneficiaries.filter((item) => {
      return (
        String(item.name || "")
          .toLowerCase()
          .includes(q) ||
        String(item.phone || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [beneficiaries, beneficiarySearch]);

  const fetchBeneficiaries = useCallback(
    async (category: "airtime" | "data") => {
      try {
        const response: any = await BaseRequest.get(
          `${MOBILE_SERVICE.BENEFICIARY}?perPage=5&currentPage=0&category=${category}`,
        );
        const records = toArray(response).map((item: any, index: number) => ({
          id: String(item?.id || index),
          name: String(item?.name || "Unknown"),
          phone: String(item?.phone || ""),
          networkProvider: String(
            item?.networkProvider || item?.serviceId || "",
          ),
        }));
        setBeneficiaries(records);
      } catch {
        setBeneficiaries([]);
      }
    },
    [],
  );

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
      const plans = toArray(response)
        .map(normalizeDataPlan)
        .filter((plan) => plan.amount > 0);
      if (plans.length > 0) {
        setDataPlans(plans);
        setSelectedDataPlanId(plans[0].id);
        return;
      }
      setDataPlans([]);
      setSelectedDataPlanId("");
    } catch {
      setDataPlans([]);
      setSelectedDataPlanId("");
    }
  }, []);

  const fetchCablePlans = useCallback(async (serviceId: string) => {
    if (!serviceId) {
      setCablePlans([]);
      setSelectedCablePlanId("");
      return;
    }

    try {
      const response: any = await BaseRequest.get(
        MOBILE_SERVICE.BILLER_CODE(serviceId),
      );
      const plans = toArray(response)
        .map(normalizeCablePlan)
        .filter((plan) => plan.amount > 0);
      if (plans.length > 0) {
        setCablePlans(plans);
        setSelectedCablePlanId(plans[0].id);
        return;
      }
      setCablePlans([]);
      setSelectedCablePlanId("");
    } catch {
      setCablePlans([]);
      setSelectedCablePlanId("");
    }
  }, []);

  const fetchTransportPlans = useCallback(async (serviceId: string) => {
    if (!serviceId) {
      setTransportPlans([]);
      setSelectedTransportPlanId("");
      return;
    }

    try {
      const response: any = await BaseRequest.get(
        MOBILE_SERVICE.TRANSACTION_META(serviceId),
      );
      const plans = toArray(response)
        .map(normalizeDataPlan)
        .filter((plan) => plan.amount > 0);
      if (plans.length > 0) {
        setTransportPlans(plans);
        setSelectedTransportPlanId(plans[0].id);
        setAmount(String(plans[0].amount));
        return;
      }
      setTransportPlans([]);
      setSelectedTransportPlanId("");
    } catch {
      setTransportPlans([]);
      setSelectedTransportPlanId("");
    }
  }, []);

  const fetchServiceMetadata = useCallback(async () => {
    setIsFetchingMeta(true);
    try {
      const [bettingRes, cableRes, electricityRes, vtPassServiceRes] =
        await Promise.all([
          BaseRequest.get(MOBILE_SERVICE.BETTING_SERVICE).catch(() => null),
          BaseRequest.get(MOBILE_SERVICE.CABLE_SERVICE).catch(() => null),
          BaseRequest.get(MOBILE_SERVICE.ELECTRICITY_GET_BILLER).catch(
            () => null,
          ),
          BaseRequest.get(MOBILE_SERVICE.VT_PASS_SERVICE).catch(() => null),
        ]);

      const remoteBetting = toArray(bettingRes).map(normalizeOption);
      const remoteCable = toArray(cableRes).map(normalizeOption);
      const remoteElectricity = normalizeElectricityProviders(
        electricityRes?.data || electricityRes,
      );
      const vtPassServices = toArray(vtPassServiceRes).map(normalizeOption);
      const remoteTransport = vtPassServices.filter((item) =>
        TRANSPORT_KEYWORDS.some((keyword) =>
          `${item.id} ${item.label} ${item.description || ""}`
            .toLowerCase()
            .includes(keyword),
        ),
      );

      setBettingProviders(remoteBetting);
      setCableProviders(remoteCable);
      setElectricityProviders(remoteElectricity);
      setTransportProviders(remoteTransport);

      const firstBetting = remoteBetting[0]?.id || "";
      const firstCable = remoteCable[0]?.id || "";
      const firstElectricity = remoteElectricity[0]?.id || "";
      const firstTransport = remoteTransport[0]?.id || "";

      setBettingProvider((prev) =>
        remoteBetting.some((item) => item.id === prev) ? prev : firstBetting,
      );
      setCableProvider((prev) =>
        remoteCable.some((item) => item.id === prev) ? prev : firstCable,
      );
      setElectricityProvider((prev) =>
        remoteElectricity.some((item) => item.id === prev)
          ? prev
          : firstElectricity,
      );
      setTransportProvider((prev) =>
        remoteTransport.some((item) => item.id === prev)
          ? prev
          : firstTransport,
      );

      await Promise.all([
        fetchCablePlans(firstCable),
        fetchTransportPlans(firstTransport),
        fetchPaymentOptions(),
      ]);
    } finally {
      setIsFetchingMeta(false);
    }
  }, [fetchCablePlans, fetchPaymentOptions, fetchTransportPlans]);

  const fetchConnectivityProviders = useCallback(
    async (category: "airtime" | "data") => {
      try {
        const endpoint =
          category === "airtime"
            ? "/mobile-connectivity-service/airtime/providers"
            : "/mobile-connectivity-service/mobile-data/providers";
        const response: any = await BaseRequest.get(endpoint);
        const remoteNetworks = toArray(response).map(normalizeOption);

        setNetworks(remoteNetworks);
        setNetwork((prev) => {
          if (remoteNetworks.some((item) => item.id === prev)) return prev;
          return remoteNetworks[0]?.id || "";
        });
      } catch {
        setNetworks([]);
        setNetwork("");
      }
    },
    [],
  );

  useEffect(() => {
    fetchServiceMetadata();
  }, [fetchServiceMetadata]);

  useEffect(() => {
    if (!network || service !== "data") return;
    fetchDataPlans(network);
  }, [fetchDataPlans, network, service]);

  useEffect(() => {
    if (!cableProvider) return;
    fetchCablePlans(cableProvider);
  }, [cableProvider, fetchCablePlans]);

  useEffect(() => {
    if (!transportProvider) return;
    fetchTransportPlans(transportProvider);
  }, [fetchTransportPlans, transportProvider]);

  useEffect(() => {
    if (service === "airtime" || service === "data") {
      fetchBeneficiaries(service);
      fetchConnectivityProviders(service);
      setBeneficiarySearch("");
    }
  }, [fetchBeneficiaries, fetchConnectivityProviders, service]);

  const amountToPay =
    service === "data"
      ? selectedDataPlan?.amount || 0
      : service === "cable"
        ? selectedCablePlan?.amount || 0
        : service === "transportation"
          ? selectedTransportPlan?.amount || 0
          : Number(amount || 0);

  const onSwitchService = (nextService: UtilityService) => {
    setService(nextService);
    setAmountError(undefined);
    setPhoneError(undefined);
    setCustomerIdError(undefined);
    setCardError(undefined);
    setElectricityAccountName("");
    setBeneficiarySearch("");
  };

  const validateForm = () => {
    setPhoneError(undefined);
    setAmountError(undefined);
    setCustomerIdError(undefined);
    setCardError(undefined);

    if (service === "airtime" || service === "data") {
      if (!network) {
        setPhoneError("No network provider available right now");
        return false;
      }

      const parsedPhone = phoneSchema.safeParse(phone.trim());
      if (!parsedPhone.success) {
        setPhoneError(parsedPhone.error.issues[0]?.message);
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
    }

    if (service === "betting") {
      if (!bettingProvider) {
        setCustomerIdError("No betting provider available right now");
        return false;
      }

      const parsedCustomer = customerIdSchema.safeParse(customerId.trim());
      if (!parsedCustomer.success) {
        setCustomerIdError(parsedCustomer.error.issues[0]?.message);
        return false;
      }

      if (Number(amount) <= 0) {
        setAmountError("Enter a valid amount");
        return false;
      }
    }

    if (service === "cable") {
      if (!cableProvider) {
        setCardError("No cable provider available right now");
        return false;
      }

      const parsedCard = customerIdSchema.safeParse(cardNumber.trim());
      if (!parsedCard.success) {
        setCardError("Enter a valid smart card / IUC number");
        return false;
      }

      if (!selectedCablePlan) {
        setCardError("Select a subscription plan");
        return false;
      }
    }

    if (service === "electricity") {
      if (!selectedElectricityProvider) {
        setCardError("No electricity provider available right now");
        return false;
      }

      const parsedMeter = customerIdSchema.safeParse(meterNumber.trim());
      if (!parsedMeter.success) {
        setCardError("Enter a valid meter number");
        return false;
      }

      if (Number(amount) <= 0) {
        setAmountError("Enter a valid amount");
        return false;
      }
    }

    if (service === "transportation") {
      if (!transportProvider) {
        setCustomerIdError("No transportation provider available right now");
        return false;
      }

      const parsedRef = customerIdSchema.safeParse(transportReference.trim());
      if (!parsedRef.success) {
        setCustomerIdError(parsedRef.error.issues[0]?.message);
        return false;
      }

      if (!selectedTransportPlan) {
        setAmountError("Select a transportation plan");
        return false;
      }
    }

    return true;
  };

  const startPayment = async () => {
    if (!validateForm()) return;

    setShowPinValidator(false);
    let wasSuccessful = false;
    const onRender = (value: string) => {
      if (value === "success") wasSuccessful = true;
    };

    try {
      if (service === "airtime" || service === "data") {
        await onTransactionPinValidated({
          transactionType: service,
          formData: {
            medium: "wallet",
            type: network,
            cardId: "",
            amount: String(amountToPay),
            phone,
          },
          selectedDataPlan:
            service === "data"
              ? { variation_code: selectedDataPlan?.variationCode }
              : undefined,
          user: auth?.user,
          PAYMENT_CALLBACK_URL,
          router,
          setRender: onRender,
          setIsLoading: setIsSubmitting,
        });
      }

      if (service === "betting") {
        await onTransactionPinBettingValidation({
          serviceId: bettingProvider,
          customerId,
          user: auth?.user,
          betType: "wallet_funding",
          amount: String(amountToPay),
          setRender: onRender,
          setIsLoading: setIsSubmitting,
          variationCode: "",
          router,
        });
      }

      if (service === "cable") {
        await onTransactionPinCabelValidation({
          serviceId: cableProvider,
          billersCode: cardNumber,
          user: auth?.user,
          amount: String(amountToPay),
          setRender: onRender,
          setIsLoading: setIsSubmitting,
          variationCode: selectedCablePlan?.variationCode || "",
          quantity: 1,
          subscription_type: selectedCablePlan?.subscriptionType || "change",
          router,
        });
      }

      if (service === "electricity" && selectedElectricityProvider) {
        await onTransactionPinElectricityValidation({
          serviceId:
            selectedElectricityProvider.description ||
            selectedElectricityProvider.label,
          billersCode: Number(meterNumber),
          user: auth?.user,
          amount: String(amountToPay),
          setRender: onRender,
          setIsLoading: setIsSubmitting,
          variationCode: electricityProduct,
          name: electricityAccountName,
          router,
        });
      }

      if (service === "transportation") {
        const result: any = await BaseRequest.post(MOBILE_SERVICE.VT_PASS_BUY, {
          serviceID: transportProvider,
          serviceId: transportProvider,
          billersCode: transportReference,
          variation_code: selectedTransportPlan?.variationCode,
          variationCode: selectedTransportPlan?.variationCode,
          amount: String(amountToPay),
          phone: auth?.user?.phone,
        });
        if (result?.message) {
          wasSuccessful = true;
        }
      }

      if (wasSuccessful) setShowSuccess(true);
    } catch {
      // handled by service helpers via toast
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={styles.headerTitle}>Bills & Utilities</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {isFetchingMeta ? (
        <View style={styles.fullPageLoader}>
          <ActivityIndicator size='large' color={C.primary} />
          <ThemedText style={styles.loadingText}>
            Loading services...
          </ThemedText>
        </View>
      ) : null}

      {!isFetchingMeta ? (
        <React.Fragment>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {service === "airtime" || service === "data" ? (
              <View style={styles.segmentTabs}>
                <TouchableOpacity
                  style={[
                    styles.segmentTab,
                    service === "airtime" && styles.segmentTabActive,
                  ]}
                  onPress={() => onSwitchService("airtime")}
                >
                  <Mobile
                    size={16}
                    color={service === "airtime" ? C.primary : C.muted}
                    variant='Outline'
                  />
                  <ThemedText
                    style={[
                      styles.segmentTabText,
                      service === "airtime" && styles.segmentTabTextActive,
                    ]}
                  >
                    Airtime
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.segmentTab,
                    service === "data" && styles.segmentTabActive,
                  ]}
                  onPress={() => onSwitchService("data")}
                >
                  <WifiSquare
                    size={16}
                    color={service === "data" ? C.primary : C.muted}
                    variant='Outline'
                  />
                  <ThemedText
                    style={[
                      styles.segmentTabText,
                      service === "data" && styles.segmentTabTextActive,
                    ]}
                  >
                    Data
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : null}

            {(service === "airtime" || service === "data") && (
              <View style={styles.airtimeDataCard}>
                <ThemedText style={styles.sectionTitle}>
                  Select network provider
                </ThemedText>
                <View style={styles.networkGrid}>
                  {orderedNetworks.map((item) => {
                    const selected = network === item.id;
                    const networkImageKey = getNetworkImageKey(
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
                          source={
                            NETWORK_IMAGES[networkImageKey] ||
                            NETWORK_IMAGES.mtn
                          }
                          style={styles.networkLogo}
                          resizeMode='contain'
                        />
                        <ThemedText
                          style={[
                            styles.networkText,
                            selected && styles.networkTextActive,
                          ]}
                        >
                          {item.label}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                  {networks.length === 0 ? (
                    <ThemedText style={styles.emptyBeneficiaryText}>
                      No network provider available.
                    </ThemedText>
                  ) : null}
                </View>

                <ThemedText style={styles.fieldLabel}>Phone Number</ThemedText>
                <View
                  style={[
                    styles.inlineInput,
                    phoneError ? styles.inlineInputError : undefined,
                  ]}
                >
                  <ThemedText style={styles.phonePrefix}>+234</ThemedText>
                  <TextInput
                    style={styles.inlineInputText}
                    placeholder='Enter phone number'
                    placeholderTextColor={C.muted}
                    keyboardType='number-pad'
                    value={phone}
                    onChangeText={(value) => {
                      setPhone(value.replace(/[^0-9+]/g, ""));
                      setPhoneError(undefined);
                    }}
                  />
                  <Add size={18} color={C.muted} variant='Outline' />
                </View>
                {phoneError ? (
                  <ThemedText style={styles.errorText}>{phoneError}</ThemedText>
                ) : null}

                <View style={styles.beneficiaryRow}>
                  <ThemedText style={styles.beneficiaryText}>
                    Add to beneficiaries
                  </ThemedText>
                  <Switch
                    value={addToBeneficiaries}
                    onValueChange={setAddToBeneficiaries}
                    trackColor={{ false: C.border, true: C.primary + "20" }}
                    thumbColor={addToBeneficiaries ? C.primary : C.muted}
                  />
                </View>

                <View style={styles.beneficiariesWrap}>
                  <ThemedText style={styles.fieldLabel}>
                    Select Beneficiary
                  </ThemedText>
                  <View style={styles.searchRow}>
                    <SearchNormal1
                      size={16}
                      color={C.muted}
                      variant='Outline'
                    />
                    <TextInput
                      style={styles.searchInput}
                      placeholder='Search by name or phone number'
                      placeholderTextColor={C.muted}
                      value={beneficiarySearch}
                      onChangeText={setBeneficiarySearch}
                    />
                  </View>

                  {beneficiarySearch.trim().length > 0 &&
                  filteredBeneficiaries[0] ? (
                    <TouchableOpacity
                      style={styles.beneficiaryResultRow}
                      onPress={() => {
                        const item = filteredBeneficiaries[0];
                        setPhone(item.phone);
                        const matchedNetwork = networks.find(
                          (option) =>
                            getNetworkImageKey(
                              `${option.id} ${option.label} ${option.description || ""}`,
                            ) ===
                            getNetworkImageKey(item.networkProvider || ""),
                        );
                        if (matchedNetwork) {
                          setNetwork(matchedNetwork.id);
                        }
                        setBeneficiarySearch("");
                      }}
                    >
                      <ThemedText style={styles.beneficiaryResultText}>
                        {filteredBeneficiaries[0].name} -{" "}
                        {filteredBeneficiaries[0].phone}
                      </ThemedText>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )}

            {service === "airtime" && (
              <View style={styles.sectionCard}>
                <ThemedText style={styles.sectionTitle}>
                  Choose amount
                </ThemedText>
                <View style={styles.amountRow}>
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
                        ₦ {preset}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
                <View
                  style={[
                    styles.inlineInput,
                    amountError ? styles.inlineInputError : undefined,
                  ]}
                >
                  <ThemedText style={styles.currencyPrefix}>₦</ThemedText>
                  <TextInput
                    style={styles.inlineInputText}
                    placeholder='Enter custom amount'
                    placeholderTextColor={C.muted}
                    keyboardType='number-pad'
                    value={amount}
                    onChangeText={(value) => {
                      setAmount(value.replace(/\D/g, ""));
                      setAmountError(undefined);
                    }}
                  />
                </View>
                {amountError ? (
                  <ThemedText style={styles.errorText}>
                    {amountError}
                  </ThemedText>
                ) : null}
              </View>
            )}

            {service === "data" && (
              <View style={styles.sectionCard}>
                <ThemedText style={styles.sectionTitle}>
                  Select data plan
                </ThemedText>
                {dataPlans.length > 0 ? (
                  <TouchableOpacity
                    style={styles.planSelector}
                    onPress={() => setShowDataPlanModal(true)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.planSelectorTextWrap}>
                      <ThemedText style={styles.planSelectorTitle}>
                        {selectedDataPlan
                          ? selectedDataPlan.label
                          : "Select data plan"}
                      </ThemedText>
                      {selectedDataPlan ? (
                        <ThemedText style={styles.planSelectorAmount}>
                          ₦{selectedDataPlan.amount.toLocaleString("en-NG")}
                        </ThemedText>
                      ) : null}
                    </View>
                    <ArrowDown2 size={18} color={C.muted} />
                  </TouchableOpacity>
                ) : (
                  <ThemedText style={styles.emptyBeneficiaryText}>
                    No data plan available for this provider.
                  </ThemedText>
                )}
              </View>
            )}

            {service === "betting" && (
              <>
                <ThemedText style={styles.label}>Betting Provider</ThemedText>
                <View style={styles.providersRow}>
                  {bettingProviders.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.providerBtn,
                        bettingProvider === item.id && styles.providerBtnActive,
                      ]}
                      onPress={() => setBettingProvider(item.id)}
                    >
                      <ThemedText
                        style={[
                          styles.providerText,
                          bettingProvider === item.id &&
                            styles.providerTextActive,
                        ]}
                      >
                        {item.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                  {bettingProviders.length === 0 ? (
                    <ThemedText style={styles.emptyBeneficiaryText}>
                      No betting provider available.
                    </ThemedText>
                  ) : null}
                </View>

                <ThemedText style={styles.label}>Customer ID</ThemedText>
                <FormInput
                  placeholder='Enter customer ID'
                  value={customerId}
                  onChangeText={(value) => {
                    setCustomerId(value);
                    setCustomerIdError(undefined);
                  }}
                  error={customerIdError}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                />

                <ThemedText style={styles.label}>Amount</ThemedText>
                <FormInput
                  placeholder='Enter amount'
                  keyboardType='number-pad'
                  value={amount}
                  onChangeText={(value) => {
                    setAmount(value.replace(/\D/g, ""));
                    setAmountError(undefined);
                  }}
                  error={amountError}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                />
              </>
            )}

            {service === "cable" && (
              <View style={styles.sectionCard}>
                <ThemedText style={styles.sectionTitle}>
                  Cable Provider
                </ThemedText>
                <View style={styles.cableGrid}>
                  {cableProviders.map((item) => {
                    const imageKey = getCableImageKey(
                      `${item.id} ${item.label} ${item.description || ""}`,
                    );
                    const source = imageKey
                      ? CABLE_IMAGES[imageKey]
                      : undefined;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.cableTile,
                          cableProvider === item.id && styles.cableTileActive,
                        ]}
                        onPress={() => setCableProvider(item.id)}
                      >
                        {source ? (
                          <Image
                            source={source}
                            style={styles.cableLogo}
                            resizeMode='contain'
                          />
                        ) : null}
                        <ThemedText
                          style={[
                            styles.cableText,
                            cableProvider === item.id && styles.cableTextActive,
                          ]}
                        >
                          {item.label}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                  {cableProviders.length === 0 ? (
                    <ThemedText style={styles.emptyBeneficiaryText}>
                      No cable provider available.
                    </ThemedText>
                  ) : null}
                </View>

                <ThemedText style={styles.fieldLabel}>
                  Smart Card / IUC Number
                </ThemedText>
                <FormInput
                  placeholder='Enter smart card number'
                  value={cardNumber}
                  onChangeText={(value) => {
                    setCardNumber(value.replace(/\D/g, ""));
                    setCardError(undefined);
                  }}
                  error={cardError}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                />

                <BraneButton
                  text='Verify card'
                  onPress={async () => {
                    if (!cardNumber || cardNumber.length < 6) {
                      setCardError("Enter a valid smart card / IUC number");
                      return;
                    }
                    try {
                      const response: any = await BaseRequest.post(
                        MOBILE_SERVICE.VERIFY_CABLE_CARD,
                        {
                          serviceId: cableProvider,
                          billersCode: cardNumber,
                        },
                      );
                      const details = response?.data || response;
                      const name =
                        details?.customerName ||
                        details?.name ||
                        details?.customer_name ||
                        "";
                      setCardHolderName(String(name));
                    } catch (error) {
                      const { message } = parseNetworkError(error);
                      showError(message);
                    }
                  }}
                  height={38}
                  radius={8}
                  backgroundColor={C.primary + "20"}
                  textColor={C.primary}
                  fontSize={11}
                  style={styles.verifyBtn}
                />

                {cardHolderName ? (
                  <View style={styles.verifiedCard}>
                    <ThemedText style={styles.verifiedLabel}>
                      Verified Name
                    </ThemedText>
                    <ThemedText style={styles.verifiedValue}>
                      {cardHolderName}
                    </ThemedText>
                  </View>
                ) : null}

                <ThemedText style={styles.fieldLabel}>
                  Subscription Plan
                </ThemedText>
                {cablePlans.length > 0 ? (
                  <TouchableOpacity
                    style={styles.planSelector}
                    onPress={() => setShowCablePlanModal(true)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.planSelectorTextWrap}>
                      <ThemedText style={styles.planSelectorTitle}>
                        {selectedCablePlan
                          ? selectedCablePlan.label
                          : "Select subscription plan"}
                      </ThemedText>
                      {selectedCablePlan ? (
                        <ThemedText style={styles.planSelectorAmount}>
                          ₦{selectedCablePlan.amount.toLocaleString("en-NG")}
                        </ThemedText>
                      ) : null}
                    </View>
                    <ArrowDown2 size={18} color={C.muted} />
                  </TouchableOpacity>
                ) : (
                  <ThemedText style={styles.emptyBeneficiaryText}>
                    No subscription plan available for this provider.
                  </ThemedText>
                )}
              </View>
            )}

            {service === "electricity" && (
              <View style={styles.sectionCard}>
                <ThemedText style={styles.sectionTitle}>Electricity</ThemedText>
                <ThemedText style={styles.fieldLabel}>
                  Select Provider
                </ThemedText>
                {electricityProviders.length > 0 ? (
                  <TouchableOpacity
                    style={styles.planSelector}
                    onPress={() => setShowElectricityProviderModal(true)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.planSelectorTextWrap}>
                      <ThemedText style={styles.planSelectorTitle}>
                        {selectedElectricityProvider
                          ? selectedElectricityProvider.label.toUpperCase()
                          : "Select a provider"}
                      </ThemedText>
                      {selectedElectricityProvider?.description ? (
                        <ThemedText style={styles.planSelectorAmount}>
                          {selectedElectricityProvider.description
                            .replace(/-/g, " ")
                            .toUpperCase()}
                        </ThemedText>
                      ) : null}
                    </View>
                    <ArrowDown2 size={18} color={C.muted} />
                  </TouchableOpacity>
                ) : (
                  <ThemedText style={styles.emptyBeneficiaryText}>
                    No electricity provider available.
                  </ThemedText>
                )}

                <ThemedText style={styles.fieldLabel}>Meter Type</ThemedText>
                <View style={styles.amountRow}>
                  {ELECTRICITY_PRODUCTS.map((product) => (
                    <TouchableOpacity
                      key={product}
                      style={[
                        styles.amountChip,
                        electricityProduct === product &&
                          styles.amountChipActive,
                      ]}
                      onPress={() => setElectricityProduct(product)}
                    >
                      <ThemedText
                        style={[
                          styles.amountChipText,
                          electricityProduct === product &&
                            styles.amountChipTextActive,
                        ]}
                      >
                        {product}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>

                <ThemedText style={styles.fieldLabel}>Meter Number</ThemedText>
                <FormInput
                  placeholder='Enter meter number'
                  value={meterNumber}
                  onChangeText={(value) => {
                    setMeterNumber(value.replace(/\D/g, ""));
                    setCardError(undefined);
                  }}
                  error={cardError}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                />

                <BraneButton
                  text='Verify meter'
                  onPress={async () => {
                    if (!meterNumber || meterNumber.length < 6) {
                      setCardError("Enter a valid meter number");
                      return;
                    }
                    try {
                      const provider = electricityProviders.find(
                        (item) => item.id === electricityProvider,
                      );
                      const response: any = await BaseRequest.post(
                        MOBILE_SERVICE.ELECTRICITY_METER_VERIFY,
                        {
                          serviceId: provider?.description || provider?.label,
                          billersCode: meterNumber,
                          variationCode: electricityProduct,
                        },
                      );
                      const details = response?.data || response;
                      const name =
                        details?.customerName ||
                        details?.name ||
                        details?.Customer_Name ||
                        "";
                      setElectricityAccountName(String(name));
                    } catch (error) {
                      const { message } = parseNetworkError(error);
                      showError(message);
                    }
                  }}
                  height={38}
                  radius={8}
                  backgroundColor={C.primary + "20"}
                  textColor={C.primary}
                  fontSize={11}
                  style={styles.verifyBtn}
                />

                {electricityAccountName ? (
                  <View style={styles.verifiedCard}>
                    <ThemedText style={styles.verifiedLabel}>
                      Verified Name
                    </ThemedText>
                    <ThemedText style={styles.verifiedValue}>
                      {electricityAccountName}
                    </ThemedText>
                  </View>
                ) : null}

                <ThemedText style={styles.fieldLabel}>Amount</ThemedText>
                <View style={styles.amountRow}>
                  {ELECTRICITY_AMOUNTS.map((preset) => (
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
                        ₦ {preset}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
                <View
                  style={[
                    styles.inlineInput,
                    amountError ? styles.inlineInputError : undefined,
                  ]}
                >
                  <ThemedText style={styles.currencyPrefix}>₦</ThemedText>
                  <TextInput
                    style={styles.inlineInputText}
                    placeholder='Enter custom amount'
                    placeholderTextColor={C.muted}
                    keyboardType='number-pad'
                    value={amount}
                    onChangeText={(value) => {
                      setAmount(value.replace(/\D/g, ""));
                      setAmountError(undefined);
                    }}
                  />
                </View>
              </View>
            )}

            {service === "transportation" && (
              <View style={styles.sectionCard}>
                <ThemedText style={styles.sectionTitle}>
                  Transportation
                </ThemedText>

                <ThemedText style={styles.fieldLabel}>
                  Transport Provider
                </ThemedText>
                <View style={styles.providersRow}>
                  {transportProviders.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.providerBtn,
                        transportProvider === item.id &&
                          styles.providerBtnActive,
                      ]}
                      onPress={() => setTransportProvider(item.id)}
                    >
                      <ThemedText
                        style={[
                          styles.providerText,
                          transportProvider === item.id &&
                            styles.providerTextActive,
                        ]}
                      >
                        {item.label}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                  {transportProviders.length === 0 ? (
                    <ThemedText style={styles.emptyBeneficiaryText}>
                      No transportation provider available.
                    </ThemedText>
                  ) : null}
                </View>

                <ThemedText style={styles.fieldLabel}>
                  Reference Number
                </ThemedText>
                <FormInput
                  placeholder='Enter reference number'
                  value={transportReference}
                  onChangeText={(value) => {
                    setTransportReference(value);
                    setCustomerIdError(undefined);
                  }}
                  error={customerIdError}
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                />

                <ThemedText style={styles.fieldLabel}>
                  Transport Plan
                </ThemedText>
                {transportPlans.length > 0 ? (
                  <TouchableOpacity
                    style={styles.planSelector}
                    onPress={() => setShowTransportPlanModal(true)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.planSelectorTextWrap}>
                      <ThemedText style={styles.planSelectorTitle}>
                        {selectedTransportPlan
                          ? selectedTransportPlan.label
                          : "Select transport plan"}
                      </ThemedText>
                      {selectedTransportPlan ? (
                        <ThemedText style={styles.planSelectorAmount}>
                          ₦
                          {selectedTransportPlan.amount.toLocaleString("en-NG")}
                        </ThemedText>
                      ) : null}
                    </View>
                    <ArrowDown2 size={18} color={C.muted} />
                  </TouchableOpacity>
                ) : (
                  <ThemedText style={styles.emptyBeneficiaryText}>
                    No transportation plan available.
                  </ThemedText>
                )}
              </View>
            )}

            {paymentOptions.length > 0 ? (
              <PaymentMethodSelector
                options={paymentOptions}
                selectedId={paymentId}
                onSelect={setPaymentId}
              />
            ) : (
              <ThemedText style={styles.emptyBeneficiaryText}>
                Payment methods unavailable at the moment.
              </ThemedText>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <BraneButton
              text={`Proceed - ₦ ${Number(amountToPay || 0).toLocaleString("en-NG")}`}
              onPress={() => {
                if (!validateForm()) return;
                setShowPinValidator(true);
              }}
              backgroundColor={C.primary}
              textColor='#ffffff'
              height={48}
              radius={8}
              loading={isSubmitting}
            />
          </View>
        </React.Fragment>
      ) : null}

      <TransactionPinValidator
        visible={showPinValidator}
        onClose={() => setShowPinValidator(false)}
        onValidatePin={async (pin) => {
          try {
            await BaseRequest.post(AUTH_SERVICE.PIN_VALIDATION, {
              pin,
            });
            return true;
          } catch (error) {
            const { message } = parseNetworkError(error);
            showError(message || "Invalid transaction pin");
            return false;
          }
        }}
        onTransactionPinValidated={startPayment}
      />

      <SuccessModal
        visible={showSuccess}
        title='Transaction Successful'
        description={`Your ${service} payment of ₦${Number(amountToPay || 0).toLocaleString("en-NG")} has been processed.`}
        actionText='Done'
        onAction={() => {
          setShowSuccess(false);
          router.back();
        }}
      />

      <Modal
        visible={showDataPlanModal}
        transparent
        animationType='slide'
        onRequestClose={() => setShowDataPlanModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDataPlanModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalCard}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                Select Data Plan
              </ThemedText>
              <TouchableOpacity onPress={() => setShowDataPlanModal(false)}>
                <CloseCircle size={18} color={C.muted} variant='Outline' />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {dataPlans.map((plan) => {
                const selected = selectedDataPlanId === plan.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.modalListRow,
                      selected && styles.modalListRowActive,
                    ]}
                    onPress={() => {
                      setSelectedDataPlanId(plan.id);
                      setShowDataPlanModal(false);
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.modalListTitle,
                        selected && styles.modalListTitleActive,
                      ]}
                    >
                      {plan.label}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.modalListAmount,
                        selected && styles.modalListAmountActive,
                      ]}
                    >
                      ₦{plan.amount.toLocaleString("en-NG")}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showElectricityProviderModal}
        transparent
        animationType='slide'
        onRequestClose={() => setShowElectricityProviderModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowElectricityProviderModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalCard}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Provider</ThemedText>
              <TouchableOpacity
                onPress={() => setShowElectricityProviderModal(false)}
              >
                <CloseCircle size={18} color={C.muted} variant='Outline' />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {electricityProviders.map((item) => {
                const imageKey = getElectricityImageKey(
                  `${item.id} ${item.label} ${item.description || ""}`,
                );
                const logo = imageKey
                  ? ELECTRICITY_IMAGES[imageKey]
                  : undefined;
                const selected = electricityProvider === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.providerModalRow,
                      selected && styles.providerModalRowActive,
                    ]}
                    onPress={() => {
                      setElectricityProvider(item.id);
                      setShowElectricityProviderModal(false);
                    }}
                  >
                    {logo ? (
                      <Image
                        source={logo}
                        style={styles.providerModalLogo}
                        resizeMode='contain'
                      />
                    ) : null}
                    <View style={styles.providerModalTextWrap}>
                      <ThemedText style={styles.providerModalTitle}>
                        {item.label.toUpperCase()}
                      </ThemedText>
                      <ThemedText style={styles.providerModalSubtitle}>
                        (
                        {(item.description || "")
                          .replace(/-/g, " ")
                          .toUpperCase()}
                        )
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showTransportPlanModal}
        transparent
        animationType='slide'
        onRequestClose={() => setShowTransportPlanModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTransportPlanModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalCard}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                Select Transport Plan
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowTransportPlanModal(false)}
              >
                <CloseCircle size={18} color={C.muted} variant='Outline' />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {transportPlans.map((plan) => {
                const selected = selectedTransportPlanId === plan.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.modalListRow,
                      selected && styles.modalListRowActive,
                    ]}
                    onPress={() => {
                      setSelectedTransportPlanId(plan.id);
                      setAmount(String(plan.amount));
                      setShowTransportPlanModal(false);
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.modalListTitle,
                        selected && styles.modalListTitleActive,
                      ]}
                    >
                      {plan.label}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.modalListAmount,
                        selected && styles.modalListAmountActive,
                      ]}
                    >
                      ₦{plan.amount.toLocaleString("en-NG")}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showCablePlanModal}
        transparent
        animationType='slide'
        onRequestClose={() => setShowCablePlanModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCablePlanModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalCard}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                Select Subscription Plan
              </ThemedText>
              <TouchableOpacity onPress={() => setShowCablePlanModal(false)}>
                <CloseCircle size={18} color={C.muted} variant='Outline' />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {cablePlans.map((plan) => {
                const selected = selectedCablePlanId === plan.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.modalListRow,
                      selected && styles.modalListRowActive,
                    ]}
                    onPress={() => {
                      setSelectedCablePlanId(plan.id);
                      setShowCablePlanModal(false);
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.modalListTitle,
                        selected && styles.modalListTitleActive,
                      ]}
                    >
                      {plan.label}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.modalListAmount,
                        selected && styles.modalListAmountActive,
                      ]}
                    >
                      ₦{plan.amount.toLocaleString("en-NG")}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (C: typeof Colors["light"]) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.inputBg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerSpacer: {
    width: 44,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 26,
    gap: 10,
  },
  fullPageLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    color: C.muted,
  },
  heading: {
    color: C.muted,
    fontSize: 10,
  },
  segmentTabs: {
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: C.inputBg,
    padding: 4,
    gap: 4,
    marginBottom: 4,
  },
  segmentTab: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  segmentTabActive: {
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.border,
  },
  segmentTabText: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "600",
  },
  segmentTabTextActive: {
    color: C.primary,
  },
  serviceRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  serviceChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  serviceChipActive: {
    backgroundColor: C.primary + "20",
    borderColor: C.border,
  },
  serviceChipText: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "500",
  },
  serviceChipTextActive: {
    color: C.primary,
    fontWeight: "700",
  },
  label: {
    fontSize: 10,
    color: C.muted,
    marginTop: 4,
  },
  providersRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  airtimeDataCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    backgroundColor: C.inputBg,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: C.inputBg,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: C.text,
    fontWeight: "700",
  },
  fieldLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
  },
  networkGrid: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  networkTile: {
    width: "23%",
    minWidth: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    paddingVertical: 11,
    alignItems: "center",
    gap: 6,
  },
  networkTileActive: {
    borderColor: C.primary,
    backgroundColor: C.primary + "10",
  },
  networkLogo: {
    width: 28,
    height: 28,
  },
  networkText: {
    fontSize: 10,
    color: C.muted,
    fontWeight: "600",
  },
  networkTextActive: {
    color: C.primary,
  },
  inlineInput: {
    height: 44,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.inputBg,
  },
  phonePrefix: {
    fontSize: 18,
    fontWeight: "700",
    color: C.text,
    marginRight: 2,
  },
  inlineInputError: {
    borderColor: "#D73C3C",
  },
  inlineInputText: {
    flex: 1,
    color: C.text,
    fontSize: 12,
  },
  errorText: {
    color: "#D73C3C",
    fontSize: 10,
    marginTop: -4,
  },
  currencyPrefix: {
    fontSize: 14,
    fontWeight: "700",
    color: C.muted,
  },
  providerBtn: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    minWidth: 66,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.inputBg,
  },
  providerLogo: {
    width: 22,
    height: 22,
    marginBottom: 4,
  },
  providerBtnActive: {
    borderColor: C.primary,
    backgroundColor: C.primary + "15",
  },
  providerText: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
  },
  providerTextActive: {
    color: C.primary,
  },
  cableGrid: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cableTile: {
    width: "23%",
    minWidth: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cableTileActive: {
    borderColor: C.primary,
    backgroundColor: C.primary + "10",
  },
  cableLogo: {
    width: 38,
    height: 24,
    marginBottom: 5,
  },
  cableText: {
    fontSize: 10,
    color: C.muted,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cableTextActive: {
    color: C.primary,
  },
  beneficiaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  beneficiaryText: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
  },
  beneficiariesWrap: {
    gap: 6,
  },
  searchRow: {
    height: 42,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.inputBg,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: C.text,
  },
  beneficiaryList: {
    gap: 8,
    paddingRight: 8,
  },
  beneficiaryCard: {
    minWidth: 140,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.inputBg,
  },
  beneficiaryAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  beneficiaryInitials: {
    fontSize: 11,
    color: C.primary,
    fontWeight: "700",
  },
  beneficiaryName: {
    fontSize: 11,
    color: C.text,
    fontWeight: "600",
  },
  beneficiaryPhone: {
    fontSize: 10,
    color: C.muted,
  },
  emptyBeneficiaryText: {
    fontSize: 10,
    color: C.muted,
  },
  amountRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginVertical: 0,
  },
  planCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: C.inputBg,
  },
  amountChip: {
    width: "23%",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 11,
    backgroundColor: C.inputBg,
    alignItems: "center",
  },
  amountChipActive: {
    backgroundColor: C.primary + "15",
    borderColor: C.primary,
  },
  amountChipText: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
  },
  beneficiaryResultRow: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: C.primary + "10",
  },
  beneficiaryResultText: {
    fontSize: 10,
    color: C.primary,
    fontWeight: "600",
  },
  amountChipTextActive: {
    color: C.primary,
  },
  dataPlansList: {
    gap: 8,
  },
  dataPlanRow: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.inputBg,
  },
  dataPlanRowActive: {
    borderColor: C.primary,
    backgroundColor: C.primary + "10",
  },
  dataPlanTitle: {
    fontSize: 12,
    color: C.text,
    fontWeight: "600",
  },
  dataPlanTitleActive: {
    color: C.primary,
  },
  dataPlanAmount: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "700",
  },
  dataPlanAmountActive: {
    color: C.primary,
  },
  planSelector: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.inputBg,
  },
  planSelectorTextWrap: {
    flex: 1,
    gap: 2,
  },
  planSelectorTitle: {
    fontSize: 12,
    color: C.text,
    fontWeight: "600",
  },
  planSelectorAmount: {
    fontSize: 11,
    color: C.muted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(11,0,20,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: C.inputBg,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    maxHeight: "72%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 14,
    color: C.text,
    fontWeight: "700",
  },
  modalList: {
    maxHeight: 420,
  },
  modalListRow: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: C.inputBg,
  },
  modalListRowActive: {
    borderColor: C.primary,
    backgroundColor: C.primary + "10",
  },
  modalListTitle: {
    fontSize: 12,
    color: C.text,
    fontWeight: "600",
  },
  modalListTitleActive: {
    color: C.primary,
  },
  modalListAmount: {
    marginTop: 2,
    fontSize: 11,
    color: C.muted,
  },
  modalListAmountActive: {
    color: C.primary,
  },
  providerModalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  providerModalRowActive: {
    backgroundColor: C.primary + "10",
    borderRadius: 8,
    borderBottomColor: C.primary + "10",
    paddingHorizontal: 8,
  },
  providerModalLogo: {
    width: 37,
    height: 37,
    borderRadius: 18,
  },
  providerModalTextWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
    flex: 1,
  },
  providerModalTitle: {
    fontSize: 14,
    color: C.text,
    fontWeight: "600",
  },
  providerModalSubtitle: {
    fontSize: 12,
    color: C.muted,
  },
  inputContainer: {
    height: 40,
    borderRadius: 8,
    borderColor: C.border,
  },
  inputText: {
    fontSize: 11,
  },
  verifyBtn: {
    width: 110,
    marginTop: 8,
  },
  verifiedCard: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: C.primary + "10",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  verifiedLabel: {
    fontSize: 9,
    color: C.muted,
  },
  verifiedValue: {
    marginTop: 2,
    fontSize: 12,
    color: C.primary,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
});
