import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { type PaymentOption } from "@/components/payment-method-selector";
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
  TRANSACTION_SERVICE,
} from "@/services/routes";
import { hideAppLoader, showError } from "@/utils/helpers";
import * as Contacts from "expo-contacts";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AirtimeDataForm } from "./AirtimeDataForm";
import { BettingForm } from "./BettingForm";
import { CableForm } from "./CableForm";
import { ElectricityForm } from "./ElectricityForm";
import {
  BettingProviderModal,
  BoostModal,
  CablePlanModal,
  ContactPickerModal,
  DataPlanModal,
  ElectricityProviderModal,
  SummaryModal,
  TransportProviderModal,
  TransportRouteModal,
} from "./Modals";
import { TransportationForm } from "./TransportationForm";
import {
  getNetworkImageKey,
  normalizeCablePlan,
  normalizeDataPlan,
  normalizeElectricityProviders,
  normalizeOption,
  toArray,
} from "./helpers";
import {
  NETWORK_ORDER,
  type Beneficiary,
  type CablePlan,
  type DataPlan,
  type SelectOption,
  type TransportRoute,
  type UtilityService,
} from "./types";

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
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>([]);
  const [selectedTransportRouteId, setSelectedTransportRouteId] = useState("");
  const [transportVehicleTypes, setTransportVehicleTypes] = useState<string[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [vehicleTypeError, setVehicleTypeError] = useState<string | undefined>();
  const [departureDate, setDepartureDate] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [seatNumber, setSeatNumber] = useState("");

  const [transportProviderError, setTransportProviderError] = useState<string | undefined>();
  const [transportRouteError, setTransportRouteError] = useState<string | undefined>();
  const [transportDateError, setTransportDateError] = useState<string | undefined>();
  const [transportNameError, setTransportNameError] = useState<string | undefined>();
  const [transportEmailError, setTransportEmailError] = useState<string | undefined>();
  const [transportSeatError, setTransportSeatError] = useState<string | undefined>();

  const [addToBeneficiaries, setAddToBeneficiaries] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [paymentId, setPaymentId] = useState<string>("wallet");
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | undefined>();

  const [customerId, setCustomerId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [electricityProduct, setElectricityProduct] = useState("prepaid");
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDataPlanModal, setShowDataPlanModal] = useState(false);
  const [dataPlanCategory, setDataPlanCategory] = useState<
    "hot" | "daily" | "weekly" | "monthly" | "yearly"
  >("hot");
  const [showElectricityProviderModal, setShowElectricityProviderModal] =
    useState(false);
  const [showBettingProviderModal, setShowBettingProviderModal] =
    useState(false);
  const [showCablePlanModal, setShowCablePlanModal] = useState(false);
  const [showTransportProviderModal, setShowTransportProviderModal] =
    useState(false);
  const [showTransportRouteModal, setShowTransportRouteModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostAmount, setBoostAmount] = useState("200");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [allContacts, setAllContacts] = useState<
    { name: string; phone: string }[]
  >([]);
  const [contactSearch, setContactSearch] = useState("");

  // ── Derived values ────────────────────────────────────────────────────────────

  const selectedDataPlan = useMemo(
    () => dataPlans.find((p) => p.id === selectedDataPlanId),
    [dataPlans, selectedDataPlanId],
  );

  const selectedCablePlan = useMemo(
    () => cablePlans.find((p) => p.id === selectedCablePlanId),
    [cablePlans, selectedCablePlanId],
  );

  const selectedTransportProvider = useMemo(
    () => transportProviders.find((p) => p.id === transportProvider),
    [transportProviders, transportProvider],
  );

  const selectedTransportRoute = useMemo(
    () => transportRoutes.find((r) => r.id === selectedTransportRouteId),
    [transportRoutes, selectedTransportRouteId],
  );

  const selectedElectricityProvider = useMemo(
    () => electricityProviders.find((p) => p.id === electricityProvider),
    [electricityProvider, electricityProviders],
  );

  const selectedBettingProvider = useMemo(
    () => bettingProviders.find((p) => p.id === bettingProvider),
    [bettingProvider, bettingProviders],
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
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  }, [networks]);

  const filteredBeneficiaries = useMemo(() => {
    const q = beneficiarySearch.trim().toLowerCase();
    if (!q) return beneficiaries;
    return beneficiaries.filter(
      (item) =>
        String(item.name || "")
          .toLowerCase()
          .includes(q) ||
        String(item.phone || "")
          .toLowerCase()
          .includes(q),
    );
  }, [beneficiaries, beneficiarySearch]);

  const filteredContacts = useMemo(() => {
    const q = contactSearch.trim().toLowerCase();
    if (!q) return allContacts.slice(0, 50);
    return allContacts
      .filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q))
      .slice(0, 50);
  }, [allContacts, contactSearch]);

  const amountToPay =
    service === "data"
      ? selectedDataPlan?.amount || 0
      : service === "cable"
        ? selectedCablePlan?.amount || 0
        : Number(amount || 0);

  const bracsRewardAmount = Math.round(amountToPay * 0.15);

  const formatMoney = (value: number) =>
    Number(value || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const isAirtimeOrData = service === "airtime" || service === "data";
  const selectedNetworkObj = orderedNetworks.find((n) => n.id === network);
  const networkLabel = selectedNetworkObj?.label || network.toUpperCase();
  const networkImageKey = getNetworkImageKey(
    `${network} ${selectedNetworkObj?.label || ""} ${selectedNetworkObj?.description || ""}`,
  );
  const ctaLabel =
    service === "data"
      ? "Buy Data"
      : service === "airtime"
        ? "Buy Airtime"
        : "Proceed";

  const transactionTarget =
    service === "airtime" || service === "data"
      ? phone
      : service === "betting"
        ? customerId
        : service === "cable"
          ? cardNumber
          : service === "electricity"
            ? meterNumber
            : selectedTransportRoute?.label || "";

  const successDescription = `Your ₦${Number(amountToPay || 0).toLocaleString("en-NG")} ${service} purchase on ${transactionTarget || "your account"} was successful. You have received ${bracsRewardAmount} bracs, which has been added to your bracs balance.`;

  // ── API fetches ───────────────────────────────────────────────────────────────

  const fetchPaymentOptions = useCallback(async () => {
    try {
      const walletRes: any = await BaseRequest.get(
        TRANSACTION_SERVICE.BALANCE,
      ).catch(() => null);
      const walletBalance = Number(
        walletRes?.data?.balance ??
          walletRes?.data?.data?.balance ??
          walletRes?.data ??
          0,
      );
      setWalletBalance(walletBalance);
      const options: PaymentOption[] = [
        // {
        //   id: "total_balance",
        //   label: `Total balance \u2013 \u20A6 ${formatMoney(bracsBalance)}`,
        //   icon: "\u20A6",
        // },
        {
          id: "brane_wallet",
          label: `Brane Wallet \u2013 \u20A6 ${formatMoney(walletBalance)}`,
          icon: "B",
        },
      ];
      setPaymentOptions(options);
      setPaymentId((prev) =>
        options.some((item) => item.id === prev) ? prev : options[0]?.id || "",
      );
    } catch {
      setWalletBalance(undefined);
      setPaymentOptions([]);
    }
  }, []);

  const fetchBeneficiaries = useCallback(
    async (category: "airtime" | "data") => {
      try {
        const response: any = await BaseRequest.get(
          `${MOBILE_SERVICE.BENEFICIARY}?perPage=5&currentPage=0&category=${category}`,
        );
        setBeneficiaries(
          toArray(response).map((item: any, index: number) => ({
            id: String(item?.id || index),
            name: String(item?.name || "Unknown"),
            phone: String(item?.phone || ""),
            networkProvider: String(
              item?.networkProvider || item?.serviceId || "",
            ),
          })),
        );
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
        .filter((p) => p.amount > 0);
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
        .filter((p) => p.amount > 0);
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

  const fetchTransportRoutes = useCallback(async (serviceId: string) => {
    if (!serviceId) {
      setTransportRoutes([]);
      setSelectedTransportRouteId("");
      setTransportVehicleTypes([]);
      setSelectedVehicleType("");
      return;
    }
    try {
      const res: any = await BaseRequest.get(
        MOBILE_SERVICE.TRANSPORT_ROUTES(serviceId),
      );
      console.log("[Transport] routes raw:", JSON.stringify(res, null, 2));
      // Try all common locations for routes in the response
      const rawRoutes: any[] = (() => {
        if (Array.isArray(res?.data?.routes)) return res.data.routes;
        if (Array.isArray(res?.routes)) return res.routes;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res)) return res;
        return [];
      })();
      const data = res?.data || res;
      const vehicleTypes: string[] = Array.isArray(data?.supportedVehicleTypes)
        ? data.supportedVehicleTypes
        : Array.isArray(res?.supportedVehicleTypes)
        ? res.supportedVehicleTypes
        : [];
      const minPrice = Number(data?.minimumPrice || res?.minimumPrice || 0);

      const routes: TransportRoute[] = rawRoutes
        .filter((r: any) => (r.status || "active") !== "inactive")
        .map((r: any) => ({
          id: r.routeCode || r.routeName || String(r.fromStation) + r.toStation,
          routeCode: r.routeCode || "",
          routeName: r.routeName || "",
          fromStation: r.fromStation || "",
          toStation: r.toStation || "",
          amount: Number(r.price || r.amount || 0),
          departureTime: r.departureTime || r.departure_time || "",
          duration: r.duration || "",
          label: r.routeName || `${r.fromStation} → ${r.toStation}`,
        }));

      console.log("[Transport] parsed routes:", routes.length, "vehicleTypes:", vehicleTypes);

      setTransportRoutes(routes);
      setTransportVehicleTypes(vehicleTypes);
      if (vehicleTypes.length > 0) setSelectedVehicleType(vehicleTypes[0]);
      else setSelectedVehicleType("");

      if (routes.length > 0) {
        setSelectedTransportRouteId(routes[0].id);
        setAmount(String(routes[0].amount));
      } else {
        setSelectedTransportRouteId("");
        if (minPrice > 0) setAmount(String(minPrice));
      }
    } catch (e) {
      console.log("[Transport] fetchTransportRoutes error:", e);
      setTransportRoutes([]);
      setSelectedTransportRouteId("");
      setTransportVehicleTypes([]);
      setSelectedVehicleType("");
    }
  }, []);

  const fetchServiceMetadata = useCallback(async () => {
    setIsFetchingMeta(true);
    try {
      const [bettingRes, cableRes, electricityRes, transportRes] =
        await Promise.all([
          BaseRequest.get(MOBILE_SERVICE.BETTING_SERVICE).catch(() => null),
          BaseRequest.get(MOBILE_SERVICE.CABLE_SERVICE).catch(() => null),
          BaseRequest.get(MOBILE_SERVICE.ELECTRICITY_GET_BILLER).catch(
            () => null,
          ),
          BaseRequest.get(MOBILE_SERVICE.TRANSPORT_SERVICE_IDS).catch(
            () => null,
          ),
        ]);

      const remoteBetting = toArray(bettingRes).map(normalizeOption);
      const remoteCable = toArray(cableRes).map(normalizeOption);
      const remoteElectricity = normalizeElectricityProviders(
        electricityRes?.data || electricityRes,
      );
      // Try all common shapes for the transport service-ids response
      const transportRaw = (() => {
        const t = transportRes as any;
        if (Array.isArray(t)) return t as any[];
        if (Array.isArray(t?.data)) return t.data as any[];
        if (Array.isArray(t?.data?.serviceIds)) return t.data.serviceIds as any[];
        if (Array.isArray(t?.data?.services)) return t.data.services as any[];
        if (Array.isArray(t?.serviceIds)) return t.serviceIds as any[];
        if (Array.isArray(t?.services)) return t.services as any[];
        // fallback: find any top-level array value in data object
        if (t?.data && typeof t.data === "object") {
          const found = Object.values(t.data).find((v) => Array.isArray(v));
          if (found) return found as any[];
        }
        return toArray(t);
      })();
      const remoteTransport: SelectOption[] = transportRaw.map(normalizeOption);
      console.log("[Transport] raw response:", JSON.stringify(transportRes, null, 2));
      console.log("[Transport] providers count:", remoteTransport.length, remoteTransport);

      setBettingProviders(remoteBetting);
      setCableProviders(remoteCable);
      setElectricityProviders(remoteElectricity);
      setTransportProviders(remoteTransport);

      const firstBetting = remoteBetting[0]?.id || "";
      const firstCable = remoteCable[0]?.id || "";
      const firstElectricity = remoteElectricity[0]?.id || "";
      const firstTransport = remoteTransport[0]?.id || "";

      setBettingProvider((prev) =>
        remoteBetting.some((i) => i.id === prev) ? prev : firstBetting,
      );
      setCableProvider((prev) =>
        remoteCable.some((i) => i.id === prev) ? prev : firstCable,
      );
      setElectricityProvider((prev) =>
        remoteElectricity.some((i) => i.id === prev) ? prev : firstElectricity,
      );
      setTransportProvider((prev) =>
        remoteTransport.some((i) => i.id === prev) ? prev : firstTransport,
      );

      await Promise.all([
        fetchCablePlans(firstCable),
        fetchTransportRoutes(firstTransport),
        fetchPaymentOptions(),
      ]);
    } finally {
      setIsFetchingMeta(false);
    }
  }, [fetchCablePlans, fetchPaymentOptions, fetchTransportRoutes]);

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
        setNetwork((prev) =>
          remoteNetworks.some((i) => i.id === prev)
            ? prev
            : remoteNetworks[0]?.id || "",
        );
      } catch {
        setNetworks([]);
        setNetwork("");
      }
    },
    [],
  );

  // ── Effects ───────────────────────────────────────────────────────────────────

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
    fetchTransportRoutes(transportProvider);
  }, [fetchTransportRoutes, transportProvider]);

  useEffect(() => {
    if (service === "airtime" || service === "data") {
      fetchBeneficiaries(service);
      fetchConnectivityProviders(service);
      setBeneficiarySearch("");
    }
  }, [fetchBeneficiaries, fetchConnectivityProviders, service]);

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const onSwitchService = (nextService: UtilityService) => {
    setService(nextService);
    setAmountError(undefined);
    setPhoneError(undefined);
    setCustomerIdError(undefined);
    setCardError(undefined);
    setElectricityAccountName("");
    setBeneficiarySearch("");
  };

  const openContactPicker = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Allow contacts access to pick a phone number.",
      );
      return;
    }
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
    });
    const flat = data
      .flatMap((c: Contacts.Contact) =>
        (c.phoneNumbers || []).map((p: Contacts.PhoneNumber) => ({
          name: c.name || "",
          phone: (p.number || "").replace(/[\s\-().+]/g, ""),
        })),
      )
      .filter((c: { name: string; phone: string }) => c.phone.length >= 7);
    setAllContacts(flat);
    setContactSearch("");
    setShowContactsModal(true);
  };

  const validateForm = (): boolean => {
    setPhoneError(undefined);
    setAmountError(undefined);
    setCustomerIdError(undefined);
    setCardError(undefined);

    if (service === "airtime" || service === "data") {
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
    }

    if (service === "betting") {
      if (!bettingProvider) {
        setCustomerIdError("No betting provider available right now");
        return false;
      }
      if (customerId.trim().length < 6) {
        setCustomerIdError("This field is required");
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
      if (cardNumber.trim().length < 6) {
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
      if (meterNumber.trim().length < 6) {
        setCardError("Enter a valid meter number");
        return false;
      }
      if (Number(amount) <= 0) {
        setAmountError("Enter a valid amount");
        return false;
      }
    }

    if (service === "transportation") {
      let valid = true;
      if (!transportProvider) {
        setTransportProviderError("Select a transport provider");
        valid = false;
      }
      if (!selectedTransportRoute) {
        setTransportRouteError("Select a route");
        valid = false;
      }
      if (transportVehicleTypes.length > 0 && !selectedVehicleType) {
        setVehicleTypeError("Select a vehicle type");
        valid = false;
      }
      if (!departureDate.trim()) {
        setTransportDateError("Select a departure date");
        valid = false;
      }
      if (!passengerName.trim()) {
        setTransportNameError("Enter passenger name");
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passengerEmail)) {
        setTransportEmailError("Enter a valid email address");
        valid = false;
      }
      if (!seatNumber.trim()) {
        setTransportSeatError("Enter seat number");
        valid = false;
      }
      if (Number(amount) <= 0) {
        setAmountError("Enter a valid amount");
        valid = false;
      }
      if (!valid) return false;
    }

    return true;
  };

  const startPayment = async () => {
    if (!validateForm()) return;
    setShowPinValidator(false);

    const noopRender = (_: string) => {};
    const goToSuccess = () => {
      hideAppLoader();
      router.push({
        pathname: "/bills-utilities/success" as any,
        params: { title: "Transaction Successful", message: successDescription },
      });
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
          setRender: noopRender,
          setIsLoading: setIsSubmitting,
        });
        goToSuccess();
      }

      if (service === "betting") {
        await onTransactionPinBettingValidation({
          serviceId: bettingProvider,
          customerId,
          user: auth?.user,
          betType: "wallet_funding",
          amount: String(amountToPay),
          setRender: noopRender,
          setIsLoading: setIsSubmitting,
          variationCode: "",
          router,
        });
        goToSuccess();
      }

      if (service === "cable") {
        await onTransactionPinCabelValidation({
          serviceId: cableProvider,
          billersCode: cardNumber,
          user: auth?.user,
          amount: String(amountToPay),
          setRender: noopRender,
          setIsLoading: setIsSubmitting,
          variationCode: selectedCablePlan?.variationCode || "",
          quantity: 1,
          subscription_type: selectedCablePlan?.subscriptionType || "change",
          router,
        });
        goToSuccess();
      }

      if (service === "electricity" && selectedElectricityProvider) {
        await onTransactionPinElectricityValidation({
          serviceId:
            selectedElectricityProvider.description ||
            selectedElectricityProvider.label,
          billersCode: Number(meterNumber),
          user: auth?.user,
          amount: String(amountToPay),
          setRender: noopRender,
          setIsLoading: setIsSubmitting,
          variationCode: electricityProduct,
          name: electricityAccountName,
          router,
        });
        goToSuccess();
      }

      if (service === "transportation") {
        await BaseRequest.post(MOBILE_SERVICE.TRANSPORT_BOOK, {
          serviceId: transportProvider,
          amount: String(amountToPay),
          phone: auth?.user?.phone,
          departureDate,
          fromStation: selectedTransportRoute?.fromStation,
          toStation: selectedTransportRoute?.toStation,
          passengerName,
          passengerEmail,
          seatNumber,
          vehicleType: selectedVehicleType,
        });
        goToSuccess();
      }
    } catch {
      // handled by service helpers via toast
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText style={styles.headerTitle}>
          {isAirtimeOrData ? "Airtime & Data" : "Bills & Utility"}
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {isFetchingMeta ? (
        <View style={styles.fullPageLoader}>
          <ActivityIndicator size='small' color='#013D25' />
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
            {/* Per-service form components */}
            {isAirtimeOrData && (
              <AirtimeDataForm
                service={service}
                orderedNetworks={orderedNetworks}
                network={network}
                setNetwork={setNetwork}
                phone={phone}
                setPhone={setPhone}
                phoneError={phoneError}
                setPhoneError={setPhoneError}
                addToBeneficiaries={addToBeneficiaries}
                setAddToBeneficiaries={setAddToBeneficiaries}
                beneficiaryName={beneficiaryName}
                setBeneficiaryName={setBeneficiaryName}
                amount={amount}
                setAmount={setAmount}
                amountError={amountError}
                setAmountError={setAmountError}
                selectedDataPlan={selectedDataPlan}
                beneficiaries={beneficiaries}
                beneficiarySearch={beneficiarySearch}
                setBeneficiarySearch={setBeneficiarySearch}
                filteredBeneficiaries={filteredBeneficiaries}
                onSwitchService={onSwitchService}
                onOpenContactPicker={openContactPicker}
                onOpenDataPlanModal={() => setShowDataPlanModal(true)}
              />
            )}

            {service === "betting" && (
              <BettingForm
                bettingProviders={bettingProviders}
                selectedBettingProvider={selectedBettingProvider}
                customerId={customerId}
                setCustomerId={setCustomerId}
                customerIdError={customerIdError}
                setCustomerIdError={setCustomerIdError}
                amount={amount}
                setAmount={setAmount}
                amountError={amountError}
                setAmountError={setAmountError}
                onOpenProviderModal={() => setShowBettingProviderModal(true)}
              />
            )}

            {service === "cable" && (
              <CableForm
                cableProviders={cableProviders}
                cableProvider={cableProvider}
                setCableProvider={setCableProvider}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardError={cardError}
                setCardError={setCardError}
                cardHolderName={cardHolderName}
                setCardHolderName={setCardHolderName}
                cablePlans={cablePlans}
                selectedCablePlan={selectedCablePlan}
                onOpenCablePlanModal={() => setShowCablePlanModal(true)}
              />
            )}

            {service === "electricity" && (
              <ElectricityForm
                electricityProviders={electricityProviders}
                selectedElectricityProvider={selectedElectricityProvider}
                electricityProduct={electricityProduct}
                setElectricityProduct={setElectricityProduct}
                meterNumber={meterNumber}
                setMeterNumber={setMeterNumber}
                cardError={cardError}
                setCardError={setCardError}
                electricityAccountName={electricityAccountName}
                amount={amount}
                setAmount={setAmount}
                amountError={amountError}
                setAmountError={setAmountError}
                addToBeneficiaries={addToBeneficiaries}
                setAddToBeneficiaries={setAddToBeneficiaries}
                onOpenProviderModal={() =>
                  setShowElectricityProviderModal(true)
                }
              />
            )}

            {service === "transportation" && (
              <TransportationForm
                transportProviders={transportProviders}
                selectedTransportProvider={selectedTransportProvider}
                transportRoutes={transportRoutes}
                selectedRoute={selectedTransportRoute}
                departureDate={departureDate}
                setDepartureDate={setDepartureDate}
                passengerName={passengerName}
                setPassengerName={setPassengerName}
                passengerEmail={passengerEmail}
                setPassengerEmail={setPassengerEmail}
                seatNumber={seatNumber}
                setSeatNumber={setSeatNumber}
                amount={amount}
                setAmount={setAmount}
                providerError={transportProviderError}
                routeError={transportRouteError}
                dateError={transportDateError}
                nameError={transportNameError}
                emailError={transportEmailError}
                seatError={transportSeatError}
                amountError={amountError}
                clearError={(field) => {
                  if (field === "provider") setTransportProviderError(undefined);
                  else if (field === "route") setTransportRouteError(undefined);
                  else if (field === "date") setTransportDateError(undefined);
                  else if (field === "name") setTransportNameError(undefined);
                  else if (field === "email") setTransportEmailError(undefined);
                  else if (field === "seat") setTransportSeatError(undefined);
                  else if (field === "amount") setAmountError(undefined);
                  else if (field === "vehicleType") setVehicleTypeError(undefined);
                }}
                onOpenProviderModal={() => setShowTransportProviderModal(true)}
                onOpenRouteModal={() => setShowTransportRouteModal(true)}
                vehicleTypes={transportVehicleTypes}
                selectedVehicleType={selectedVehicleType}
                setSelectedVehicleType={(v) => { setSelectedVehicleType(v); setVehicleTypeError(undefined); }}
                vehicleTypeError={vehicleTypeError}
              />
            )}
          </ScrollView>

          {/* Footer CTA */}
          <View style={styles.footer}>
            <BraneButton
              text={
                isAirtimeOrData
                  ? ctaLabel
                  : `Proceed \u2013 \u20A6 ${Number(amountToPay || 0).toLocaleString("en-NG")}`
              }
              onPress={() => {
                if (!validateForm()) return;
                if (service === "airtime") {
                  setShowBoostModal(true);
                } else {
                  setShowSummaryModal(true);
                }
              }}
              backgroundColor='#013D25'
              textColor='#D2F1E4'
              height={52}
              radius={12}
              loading={isSubmitting}
            />
          </View>
        </React.Fragment>
      ) : null}

      <SummaryModal
        visible={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        isAirtime={service === "airtime"}
        amountToPay={amountToPay}
        bracsRewardAmount={bracsRewardAmount}
        networkImageKey={networkImageKey}
        networkLabel={networkLabel}
        phone={phone}
        boostAmount={boostAmount}
        paymentOptions={paymentOptions}
        walletBalance={walletBalance}
        paymentId={paymentId}
        setPaymentId={setPaymentId}
        ctaLabel={ctaLabel}
        isSubmitting={isSubmitting}
        showPaymentMethod
        extraRows={
          service === "transportation"
            ? [
                { label: "Route", value: selectedTransportRoute?.label || "" },
                { label: "Departure Time", value: selectedTransportRoute?.departureTime || "" },
                { label: "Duration", value: selectedTransportRoute?.duration || "" },
                { label: "Vehicle Type", value: selectedVehicleType ? selectedVehicleType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "" },
                { label: "Passenger", value: passengerName },
                { label: "Date", value: departureDate },
              ].filter((r) => r.value)
            : []
        }
        onFundWallet={() => {
          setShowSummaryModal(false);
          router.push("/add-funds" as any);
        }}
        onConfirm={() => {
          setShowSummaryModal(false);
          setTimeout(() => setShowPinValidator(true), 300);
        }}
      />

      {service === "airtime" && (
        <BoostModal
          visible={showBoostModal}
          boostAmount={boostAmount}
          setBoostAmount={setBoostAmount}
          onSkip={() => {
            setBoostAmount("");
            setShowBoostModal(false);
            setTimeout(() => setShowSummaryModal(true), 300);
          }}
          onAdd={() => {
            setShowBoostModal(false);
            setTimeout(() => setShowSummaryModal(true), 300);
          }}
        />
      )}

      <ContactPickerModal
        visible={showContactsModal}
        onClose={() => setShowContactsModal(false)}
        filteredContacts={filteredContacts}
        contactSearch={contactSearch}
        setContactSearch={setContactSearch}
        onSelect={(phone) => {
          setPhone(phone);
          setPhoneError(undefined);
          setShowContactsModal(false);
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

      <ElectricityProviderModal
        visible={showElectricityProviderModal}
        onClose={() => setShowElectricityProviderModal(false)}
        providers={electricityProviders}
        selectedId={electricityProvider}
        onSelect={(id) => {
          setElectricityProvider(id);
          setShowElectricityProviderModal(false);
        }}
      />

      <BettingProviderModal
        visible={showBettingProviderModal}
        onClose={() => setShowBettingProviderModal(false)}
        providers={bettingProviders}
        selectedId={bettingProvider}
        onSelect={(id) => {
          setBettingProvider(id);
          setShowBettingProviderModal(false);
        }}
      />

      <CablePlanModal
        visible={showCablePlanModal}
        onClose={() => setShowCablePlanModal(false)}
        cablePlans={cablePlans}
        selectedCablePlanId={selectedCablePlanId}
        onSelect={(planId) => {
          setSelectedCablePlanId(planId);
          setShowCablePlanModal(false);
        }}
      />

      <TransportProviderModal
        visible={showTransportProviderModal}
        onClose={() => setShowTransportProviderModal(false)}
        providers={transportProviders}
        selectedId={transportProvider}
        onSelect={(id) => {
          setTransportProvider(id);
          setShowTransportProviderModal(false);
        }}
      />

      <TransportRouteModal
        visible={showTransportRouteModal}
        onClose={() => setShowTransportRouteModal(false)}
        routes={transportRoutes}
        selectedRouteId={selectedTransportRouteId}
        onSelect={(id) => {
          setSelectedTransportRouteId(id);
          const route = transportRoutes.find((r) => r.id === id);
          if (route?.amount) setAmount(String(route.amount));
          setShowTransportRouteModal(false);
        }}
      />

      <TransactionPinValidator
        visible={showPinValidator}
        onClose={() => setShowPinValidator(false)}
        onValidatePin={async (pin) => {
          console.log("Validating PIN:", pin);
          try {
            const res = await BaseRequest.post(AUTH_SERVICE.PIN_VALIDATION, {
              transactionPin: String(pin),
            });
            console.log("PIN validation response:", res.data);
            return true;
          } catch (error) {
            const { message } = parseNetworkError(error);
            console.log("PIN validation error:", error, message);
            showError(message || "Invalid transaction pin");
            return false;
          }
        }}
        onTransactionPinValidated={startPayment}
      />
    </SafeAreaView>
  );
}

const createStyles = (C: (typeof Colors)["light"]) =>
  StyleSheet.create({
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
    headerSpacer: { width: 44 },
    headerTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: C.text,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 26,
      gap: 14,
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
    footer: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 16,
    },
  });
