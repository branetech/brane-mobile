import { TransportProviderModal, TransportRouteModal } from "@/components/bills-utilities/Modals";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest from "@/services";
import { MOBILE_SERVICE } from "@/services/routes";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ArrowDown2 } from "iconsax-react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { normalizeOption, toArray } from "./helpers";
import type { SelectOption, TransportRoute, UtilityFormData, UtilityFormRef } from "./types";

type Props = {
  onReady: (data: UtilityFormData) => void;
};

export const TransportationForm = forwardRef<UtilityFormRef, Props>(({ onReady }, ref) => {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];
  const styles = createStyles(C as typeof Colors.light);

  // ── State ───────────────────────────────────────────────────────────────────
  const [providers, setProviders] = useState<SelectOption[]>([]);
  const [transportProvider, setTransportProvider] = useState("");
  const [showProviderModal, setShowProviderModal] = useState(false);

  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [selectedTransportRouteId, setSelectedTransportRouteId] = useState("");
  const [showRouteModal, setShowRouteModal] = useState(false);

  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");

  const [departureDate, setDepartureDate] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  // errors
  const [providerError, setProviderError] = useState<string | undefined>();
  const [routeError, setRouteError] = useState<string | undefined>();
  const [vehicleTypeError, setVehicleTypeError] = useState<string | undefined>();
  const [dateError, setDateError] = useState<string | undefined>();
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [seatError, setSeatError] = useState<string | undefined>();
  const [amountError, setAmountError] = useState<string | undefined>();

  // ── Data loading ─────────────────────────────────────────────────────────────
  const fetchTransportProviders = useCallback(async () => {
    try {
      const res: any = await BaseRequest.get(MOBILE_SERVICE.TRANSPORT_SERVICE_IDS);
      const raw = (() => {
        const t = res as any;
        if (Array.isArray(t)) return t as any[];
        if (Array.isArray(t?.data)) return t.data as any[];
        if (Array.isArray(t?.data?.serviceIds)) return t.data.serviceIds as any[];
        if (Array.isArray(t?.data?.services)) return t.data.services as any[];
        if (Array.isArray(t?.serviceIds)) return t.serviceIds as any[];
        if (Array.isArray(t?.services)) return t.services as any[];
        if (t?.data && typeof t.data === "object") {
          const found = Object.values(t.data).find((v) => Array.isArray(v));
          if (found) return found as any[];
        }
        return toArray(t);
      })();
      const list: SelectOption[] = raw.map(normalizeOption);
      setProviders(list);
      if (list.length > 0) setTransportProvider(list[0].id);
    } catch {
      setProviders([]);
    }
  }, []);

  const fetchRoutes = useCallback(async (serviceId: string) => {
    if (!serviceId) {
      setRoutes([]);
      setVehicleTypes([]);
      return;
    }
    try {
      const res: any = await BaseRequest.get(MOBILE_SERVICE.TRANSPORT_ROUTES(serviceId));
      const rawRoutes: any[] = (() => {
        if (Array.isArray(res?.data?.routes)) return res.data.routes;
        if (Array.isArray(res?.routes)) return res.routes;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res)) return res;
        return [];
      })();
      const data = res?.data || res;
      const fetchedVehicleTypes: string[] = Array.isArray(data?.supportedVehicleTypes)
        ? data.supportedVehicleTypes
        : Array.isArray(res?.supportedVehicleTypes)
          ? res.supportedVehicleTypes
          : [];
      const minPrice = Number(data?.minimumPrice || res?.minimumPrice || 0);
      const newRoutes: TransportRoute[] = rawRoutes
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
      setRoutes(newRoutes);
      setVehicleTypes(fetchedVehicleTypes);
      setSelectedVehicleType(fetchedVehicleTypes.length > 0 ? fetchedVehicleTypes[0] : "");
      if (newRoutes.length > 0) {
        setSelectedTransportRouteId(newRoutes[0].id);
        setAmount(String(newRoutes[0].amount || minPrice || ""));
      }
    } catch {
      setRoutes([]);
      setVehicleTypes([]);
    }
  }, []);

  useEffect(() => { fetchTransportProviders(); }, [fetchTransportProviders]);
  useEffect(() => {
    if (!transportProvider) return;
    fetchRoutes(transportProvider);
  }, [fetchRoutes, transportProvider]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const selectedTransportProvider = providers.find((p) => p.id === transportProvider);
  const selectedRoute = useMemo(
    () => routes.find((r) => r.id === selectedTransportRouteId),
    [routes, selectedTransportRouteId],
  );

  // ── onReady emission ──────────────────────────────────────────────────────────
  useEffect(() => {
    onReady({
      service: "transportation",
      amountToPay: Number(amount || 0),
      transactionTarget: selectedRoute?.label || "",
      transportProviderId: transportProvider,
      selectedTransportRoute: selectedRoute,
      selectedVehicleType,
      departureDate,
      passengerName,
      passengerEmail,
      seatNumber,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transportProvider, selectedRoute, selectedVehicleType, departureDate, passengerName, passengerEmail, seatNumber, amount]);

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    let valid = true;
    setProviderError(undefined);
    setRouteError(undefined);
    setVehicleTypeError(undefined);
    setDateError(undefined);
    setNameError(undefined);
    setEmailError(undefined);
    setSeatError(undefined);
    setAmountError(undefined);

    if (!transportProvider) { setProviderError("Select a transport provider"); valid = false; }
    if (!selectedRoute) { setRouteError("Select a route"); valid = false; }
    if (vehicleTypes.length > 0 && !selectedVehicleType) { setVehicleTypeError("Select a vehicle type"); valid = false; }
    if (!departureDate.trim()) { setDateError("Select a departure date"); valid = false; }
    if (!passengerName.trim()) { setNameError("Enter passenger name"); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passengerEmail)) { setEmailError("Enter a valid email address"); valid = false; }
    if (!seatNumber.trim()) { setSeatError("Enter seat number"); valid = false; }
    if (Number(amount) <= 0) { setAmountError("Enter a valid amount"); valid = false; }

    return valid;
  };

  useImperativeHandle(ref, () => ({ validate }));

  // ── Date picker ──────────────────────────────────────────────────────────────
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) {
      setPickerDate(selected);
      if (Platform.OS === "android") {
        setDepartureDate(formatDate(selected));
        setDateError(undefined);
      }
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Provider */}
      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Select Provider</ThemedText>
        <TouchableOpacity
          style={[styles.selectField, providerError ? styles.fieldError : undefined]}
          onPress={() => { setProviderError(undefined); setShowProviderModal(true); }}
          activeOpacity={0.85}
        >
          <ThemedText style={[styles.selectText, !selectedTransportProvider && styles.placeholderText]}>
            {selectedTransportProvider ? selectedTransportProvider.label : "Select a provider"}
          </ThemedText>
          <ArrowDown2 size={18} color={C.muted} />
        </TouchableOpacity>
        {providerError ? <ThemedText style={styles.errorText}>{providerError}</ThemedText> : null}
      </View>

      {/* Route */}
      {selectedTransportProvider ? (
        <View style={styles.fieldBlock}>
          <ThemedText style={styles.fieldLabel}>Select Route</ThemedText>
          <TouchableOpacity
            style={[styles.selectField, routeError ? styles.fieldError : undefined]}
            onPress={() => { setRouteError(undefined); setShowRouteModal(true); }}
            activeOpacity={0.85}
          >
            <ThemedText style={[styles.selectText, !selectedRoute && styles.placeholderText]}>
              {selectedRoute
                ? `${selectedRoute.fromStation} → ${selectedRoute.toStation}`
                : "Select a route"}
            </ThemedText>
            <ArrowDown2 size={18} color={C.muted} />
          </TouchableOpacity>
          {routeError ? <ThemedText style={styles.errorText}>{routeError}</ThemedText> : null}
        </View>
      ) : null}

      {/* Vehicle Type */}
      {vehicleTypes.length > 0 ? (
        <View style={styles.fieldBlock}>
          <ThemedText style={styles.fieldLabel}>Vehicle Type</ThemedText>
          <View style={styles.pillsRow}>
            {vehicleTypes.map((vt) => (
              <TouchableOpacity
                key={vt}
                style={[styles.pill, selectedVehicleType === vt && styles.pillActive]}
                onPress={() => { setSelectedVehicleType(vt); setVehicleTypeError(undefined); }}
              >
                <ThemedText style={[styles.pillText, selectedVehicleType === vt && styles.pillTextActive]}>
                  {vt.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          {vehicleTypeError ? <ThemedText style={styles.errorText}>{vehicleTypeError}</ThemedText> : null}
        </View>
      ) : null}

      {/* Departure Date */}
      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Departure Date</ThemedText>
        <TouchableOpacity
          style={[styles.selectField, dateError ? styles.fieldError : undefined]}
          onPress={() => { setDateError(undefined); setShowDatePicker(true); }}
          activeOpacity={0.85}
        >
          <ThemedText style={[styles.selectText, !departureDate && styles.placeholderText]}>
            {departureDate || "Select departure date"}
          </ThemedText>
          <ArrowDown2 size={18} color={C.muted} />
        </TouchableOpacity>
        {dateError ? <ThemedText style={styles.errorText}>{dateError}</ThemedText> : null}
      </View>

      {/* Passenger Name */}
      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Passenger Name</ThemedText>
        <View style={[styles.inputField, nameError ? styles.fieldError : undefined]}>
          <TextInput
            style={styles.inputText}
            placeholder="Enter passenger name"
            placeholderTextColor={C.muted}
            value={passengerName}
            onChangeText={(v) => { setPassengerName(v); setNameError(undefined); }}
          />
        </View>
        {nameError ? <ThemedText style={styles.errorText}>{nameError}</ThemedText> : null}
      </View>

      {/* Passenger Email */}
      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Passenger Email</ThemedText>
        <View style={[styles.inputField, emailError ? styles.fieldError : undefined]}>
          <TextInput
            style={styles.inputText}
            placeholder="Enter passenger email"
            placeholderTextColor={C.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={passengerEmail}
            onChangeText={(v) => { setPassengerEmail(v); setEmailError(undefined); }}
          />
        </View>
        {emailError ? <ThemedText style={styles.errorText}>{emailError}</ThemedText> : null}
      </View>

      {/* Seat Number */}
      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Seat Number</ThemedText>
        <View style={[styles.inputField, seatError ? styles.fieldError : undefined]}>
          <TextInput
            style={styles.inputText}
            placeholder="e.g. A12"
            placeholderTextColor={C.muted}
            value={seatNumber}
            onChangeText={(v) => { setSeatNumber(v); setSeatError(undefined); }}
          />
        </View>
        {seatError ? <ThemedText style={styles.errorText}>{seatError}</ThemedText> : null}
      </View>

      {/* Amount */}
      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Amount</ThemedText>
        <View style={[styles.inputField, amountError ? styles.fieldError : undefined]}>
          <TextInput
            style={styles.inputText}
            placeholder="Enter amount"
            placeholderTextColor={C.muted}
            keyboardType="number-pad"
            value={amount}
            onChangeText={(v) => { setAmount(v.replace(/\D/g, "")); setAmountError(undefined); }}
          />
        </View>
        {amountError ? <ThemedText style={styles.errorText}>{amountError}</ThemedText> : null}
      </View>

      {/* Native Date Picker (iOS: spinner modal, Android: inline) */}
      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          minimumDate={today}
          display="default"
          onChange={onDateChange}
        />
      )}
      <Modal
        visible={showDatePicker && Platform.OS === "ios"}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity
          style={styles.calendarOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.calendarCard} onPress={() => {}}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <ThemedText style={[styles.pickerBtn, { color: C.muted }]}>Cancel</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.calendarTitle}>Departure Date</ThemedText>
              <TouchableOpacity
                onPress={() => {
                  setDepartureDate(formatDate(pickerDate));
                  setDateError(undefined);
                  setShowDatePicker(false);
                }}
              >
                <ThemedText style={[styles.pickerBtn, { color: C.primary }]}>Done</ThemedText>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={pickerDate}
              mode="date"
              minimumDate={today}
              display="spinner"
              onChange={onDateChange}
              style={{ width: "100%" }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <TransportProviderModal
        visible={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        providers={providers}
        selectedId={transportProvider}
        onSelect={(id) => {
          setTransportProvider(id);
          setShowProviderModal(false);
        }}
      />

      <TransportRouteModal
        visible={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        routes={routes}
        selectedRouteId={selectedTransportRouteId}
        onSelect={(id) => {
          setSelectedTransportRouteId(id);
          const route = routes.find((r) => r.id === id);
          if (route?.amount) setAmount(String(route.amount));
          setShowRouteModal(false);
        }}
      />
    </View>
  );
});

TransportationForm.displayName = "TransportationForm";

const createStyles = (C: typeof Colors.light) =>
  StyleSheet.create({
    container: { gap: 18, paddingTop: 4 },
    fieldBlock: { gap: 8 },
    fieldLabel: { fontSize: 10, fontWeight: "500", color: C.muted },
    selectField: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: C.inputBg,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "#EEF0F3",
    },
    selectText: { fontSize: 12, color: C.text, fontWeight: "500", flex: 1 },
    placeholderText: { color: C.muted, fontWeight: "400" },
    inputField: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: C.inputBg,
      paddingHorizontal: 14,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#EEF0F3",
    },
    fieldError: { borderColor: C.error },
    inputText: { fontSize: 12, color: C.text, paddingVertical: 0 },
    errorText: { fontSize: 11, color: C.error },
    pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    pill: {
      borderWidth: 1,
      borderColor: "#E7E7EB",
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: C.inputBg,
    },
    pillActive: { borderColor: C.primary, borderWidth: 2, backgroundColor: "#F4FBF7" },
    pillText: { fontSize: 12, color: C.muted, fontWeight: "500" },
    pillTextActive: { color: C.primary },
    calendarOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "flex-end",
    },
    calendarCard: {
      backgroundColor: C.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 32,
    },
    pickerHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 4,
    },
    pickerBtn: { fontSize: 16, fontWeight: "600" },
    calendarTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: C.text,
      textAlign: "center",
    },
  });

