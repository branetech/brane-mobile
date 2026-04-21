import AirtimeDataForm from "@/components/bills-utilities/AirtimeDataForm";
import { BettingForm } from "@/components/bills-utilities/BettingForm";
import { CableForm } from "@/components/bills-utilities/CableForm";
import { ElectricityForm } from "@/components/bills-utilities/ElectricityForm";
import { BoostModal, SummaryModal } from "@/components/bills-utilities/Modals";
import { TransportationForm } from "@/components/bills-utilities/TransportationForm";
import {
  type UtilityFormData,
  type UtilityFormRef,
  type UtilityService,
} from "@/components/bills-utilities/types";
import { BraneButton } from "@/components/brane-button";
import { Header } from "@/components/header";
import { type PaymentOption } from "@/components/payment-method-selector";
import { ThemedText } from "@/components/themed-text";
import { TransactionPinValidator } from "@/components/transaction-pin-validator";
import { palette } from "@/constants";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import BaseRequest from "@/services";
import {
  onTransactionPinBettingValidation,
  onTransactionPinCabelValidation,
  onTransactionPinElectricityValidation,
  onTransactionPinValidated,
} from "@/services/data";
import {
  MOBILE_SERVICE,
  PAYMENT_CALLBACK_URL,
  TRANSACTION_SERVICE,
} from "@/services/routes";
import { hideAppLoader } from "@/utils/helpers";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Modal,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UtilitySelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const auth = useAppState("auth");
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const styles = createStyles(C as typeof Colors.light);

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
  const [formData, setFormData] = useState<UtilityFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boostAmount, setBoostAmount] = useState("200");
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showPaying, setShowPaying] = useState(false);
  const [showPinValidator, setShowPinValidator] = useState(false);
  const [paymentId, setPaymentId] = useState<string>("wallet");
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | undefined>();

  // ── Form refs ─────────────────────────────────────────────────────────────────
  const airtimeDataFormRef = useRef<UtilityFormRef>(null);
  const bettingFormRef = useRef<UtilityFormRef>(null);
  const cableFormRef = useRef<UtilityFormRef>(null);
  const electricityFormRef = useRef<UtilityFormRef>(null);
  const transportFormRef = useRef<UtilityFormRef>(null);

  // ── Derived ───────────────────────────────────────────────────────────────────
  const isAirtimeOrData = service === "airtime" || service === "data";

  const activeFormRef = isAirtimeOrData
    ? airtimeDataFormRef
    : service === "betting"
      ? bettingFormRef
      : service === "cable"
        ? cableFormRef
        : service === "electricity"
          ? electricityFormRef
          : transportFormRef;

  const amountToPay = formData?.amountToPay ?? 0;
  const bracsRewardAmount = Math.round(amountToPay * 0.15);
  const formatMoney = (value: number) =>
    Number(value || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const networkLabel = formData?.networkLabel || "";
  const networkImageKey = formData?.networkImageKey || "";
  const ctaLabel =
    service === "data"
      ? "Buy Data"
      : service === "airtime"
        ? "Buy Airtime"
        : "Proceed";

  const successDescription = `Your \u20A6${Number(amountToPay || 0).toLocaleString("en-NG")} ${service} purchase on ${formData?.transactionTarget || "your account"} was successful. You have received ${bracsRewardAmount} bracs, which has been added to your bracs balance.`;

  // ── Payment options ───────────────────────────────────────────────────────────
  const fetchPaymentOptions = useCallback(async () => {
    try {
      const walletRes: any = await BaseRequest.get(
        TRANSACTION_SERVICE.BALANCE,
      ).catch(() => null);
      const balance = Number(
        walletRes?.data?.balance ??
          walletRes?.data?.data?.balance ??
          walletRes?.data ??
          0,
      );
      setWalletBalance(balance);
      const options: PaymentOption[] = [
        {
          id: "brane_wallet",
          label: `Brane Wallet \u2013 \u20A6 ${formatMoney(balance)}`,
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

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (showPinValidator) {
          setShowPinValidator(false);
          return true;
        }
        if (showSummaryModal) {
          setShowSummaryModal(false);
          return true;
        }
        if (showBoostModal) {
          setShowBoostModal(false);
          return true;
        }
        return false;
      },
    );

    return () => subscription.remove();
  }, [showBoostModal, showPinValidator, showSummaryModal]);

  // ── Strategy-pattern payment ──────────────────────────────────────────────────
  const startPayment = async () => {
    if (!formData) return;
    setShowPinValidator(false);
    setShowPaying(true);

    const noopRender = (_: string) => {
      
    };
    const goToSuccess = () => {
      hideAppLoader();
      router.push({
        pathname: "/bills-utilities/success" as any,
        params: { title: "Transaction Successful", message: successDescription },
      });
    };

    try {
      switch (formData.service) {
        case "airtime":
        case "data":
          {
            const result = await onTransactionPinValidated({
              transactionType: formData.service,
              formData: {
                medium: "wallet",
                type: formData.network,
                cardId: "",
                amount: String(amountToPay),
                phone: formData.phone,
              },
              selectedDataPlan:
                formData.service === "data"
                  ? { variation_code: formData.selectedDataPlan?.variationCode }
                  : undefined,
              user: auth?.user,
              PAYMENT_CALLBACK_URL,
              router,
              setRender: noopRender,
              setIsLoading: setIsSubmitting,
            });
            if (result !== false) goToSuccess();
          }
          break;

        case "betting":
          {
            const result = await onTransactionPinBettingValidation({
              serviceId: formData.bettingProviderId || "",
              customerId: formData.customerId || "",
              user: auth?.user,
              betType: "wallet_funding",
              amount: String(amountToPay),
              setRender: noopRender,
              setIsLoading: setIsSubmitting,
              variationCode: "",
              router,
            });
            if (result !== false) goToSuccess();
          }
          break;

        case "cable":
          {
            const result = await onTransactionPinCabelValidation({
              serviceId: formData.cableProviderId || "",
              billersCode: formData.cardNumber || "",
              user: auth?.user,
              amount: String(amountToPay),
              setRender: noopRender,
              setIsLoading: setIsSubmitting,
              variationCode: formData.selectedCablePlan?.variationCode || "",
              quantity: 1,
              subscription_type:
                formData.selectedCablePlan?.subscriptionType || "change",
              router,
            });
            if (result !== false) goToSuccess();
          }
          break;

        case "electricity":
          {
            const result = await onTransactionPinElectricityValidation({
              serviceId:
                formData.electricityProviderDescription ||
                formData.electricityProviderLabel ||
                "",
              billersCode: Number(formData.meterNumber),
              user: auth?.user,
              amount: String(amountToPay),
              setRender: noopRender,
              setIsLoading: setIsSubmitting,
              variationCode: formData.electricityProduct || "",
              name: formData.electricityAccountName || "",
              router,
            });
            if (result !== false) goToSuccess();
          }
          break;

        case "transportation":
          await BaseRequest.post(MOBILE_SERVICE.TRANSPORT_BOOK, {
            serviceId: formData.transportProviderId,
            amount: String(amountToPay),
            phone: auth?.user?.phone,
            departureDate: formData.departureDate,
            fromStation: formData.selectedTransportRoute?.fromStation,
            toStation: formData.selectedTransportRoute?.toStation,
            passengerName: formData.passengerName,
            passengerEmail: formData.passengerEmail,
            seatNumber: formData.seatNumber,
            vehicleType: formData.selectedVehicleType,
          });
          goToSuccess();
          break;
      }
    } catch {
      // handled by service helpers via toast
    }finally{
      setShowPaying(false);
    }
  };

  // ── CTA handler ───────────────────────────────────────────────────────────────
  const handleCTA = () => {
    if (!activeFormRef.current?.validate()) return;
    if (service === "airtime") {
      setShowBoostModal(true);
    } else {
      setShowSummaryModal(true);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <Header title={isAirtimeOrData ? "Airtime & Data" : "Bills & Utility"} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isAirtimeOrData && (
          <AirtimeDataForm
            ref={airtimeDataFormRef}
            service={service}
            onSwitchService={(next) => setService(next)}
            onReady={setFormData}
          />
        )}

        {service === "betting" && (
          <BettingForm ref={bettingFormRef} onReady={setFormData} />
        )}

        {service === "cable" && (
          <CableForm ref={cableFormRef} onReady={setFormData} />
        )}

        {service === "electricity" && (
          <ElectricityForm ref={electricityFormRef} onReady={setFormData} />
        )}

        {service === "transportation" && (
          <TransportationForm ref={transportFormRef} onReady={setFormData} />
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <BraneButton
          text={
            isAirtimeOrData
              ? ctaLabel
              : `Proceed \u2013 \u20A6${Number(amountToPay || 0).toLocaleString("en-NG")}`
          }
          onPress={handleCTA}
          backgroundColor={palette.brandDeep}
          textColor={palette.brandMint}
          height={52}
          radius={12}
          loading={isSubmitting}
        />
      </View>

      {/* Loading overlay */}
      <Modal visible={isSubmitting} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={C.primary} />
            <ThemedText style={styles.loadingText}>Processing...</ThemedText>
          </View>
        </View>
      </Modal>

      <SummaryModal
        visible={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        isAirtime={service === "airtime"}
        amountToPay={amountToPay}
        bracsRewardAmount={bracsRewardAmount}
        networkImageKey={networkImageKey}
        networkLabel={networkLabel}
        phone={formData?.phone || ""}
        boostAmount={boostAmount}
        paymentOptions={paymentOptions}
        walletBalance={walletBalance}
        paymentId={paymentId}
        setPaymentId={setPaymentId}
        ctaLabel={ctaLabel}
        isSubmitting={isSubmitting}
        showPaymentMethod
        extraRows={
          service === "transportation" && formData
            ? [
                {
                  label: "Route",
                  value: formData.selectedTransportRoute?.label || "",
                },
                {
                  label: "Departure Time",
                  value: formData.selectedTransportRoute?.departureTime || "",
                },
                {
                  label: "Duration",
                  value: formData.selectedTransportRoute?.duration || "",
                },
                {
                  label: "Vehicle Type",
                  value: formData.selectedVehicleType
                    ? formData.selectedVehicleType
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : "",
                },
                { label: "Passenger", value: formData.passengerName || "" },
                { label: "Date", value: formData.departureDate || "" },
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

      <TransactionPinValidator
        visible={showPinValidator}
        onClose={() => setShowPinValidator(false)}
        onTransactionPinValidated={startPayment}
      />
    </SafeAreaView>
  );
}

const createStyles = (C: (typeof Colors)["light"]) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.inputBg },
    content: { paddingHorizontal: 16, paddingBottom: 26, gap: 14 },
    footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
    loadingOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    loadingCard: {
      backgroundColor: C.background,
      borderRadius: 16,
      padding: 28,
      gap: 14,
      alignItems: "center",
      minWidth: 180,
    },
    loadingText: { fontSize: 14, color: C.text, fontWeight: "500" },
  });
