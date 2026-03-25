import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ArrowDown2 } from "iconsax-react-native";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { SelectOption, TransportRoute } from "./types";

type Props = {
  transportProviders: SelectOption[];
  selectedTransportProvider?: SelectOption;
  transportRoutes: TransportRoute[];
  selectedRoute?: TransportRoute;
  departureDate: string;
  setDepartureDate: (v: string) => void;
  passengerName: string;
  setPassengerName: (v: string) => void;
  passengerEmail: string;
  setPassengerEmail: (v: string) => void;
  seatNumber: string;
  setSeatNumber: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  // per-field errors
  providerError?: string;
  routeError?: string;
  dateError?: string;
  nameError?: string;
  emailError?: string;
  seatError?: string;
  amountError?: string;
  vehicleTypeError?: string;
  vehicleTypes: string[];
  selectedVehicleType: string;
  setSelectedVehicleType: (v: string) => void;
  clearError: (field: string) => void;
  onOpenProviderModal: () => void;
  onOpenRouteModal: () => void;
};

export function TransportationForm({
  transportProviders,
  selectedTransportProvider,
  transportRoutes,
  selectedRoute,
  departureDate,
  setDepartureDate,
  passengerName,
  setPassengerName,
  passengerEmail,
  setPassengerEmail,
  seatNumber,
  setSeatNumber,
  amount,
  setAmount,
  providerError,
  routeError,
  dateError,
  nameError,
  emailError,
  seatError,
  amountError,
  vehicleTypeError,
  vehicleTypes,
  selectedVehicleType,
  setSelectedVehicleType,
  clearError,
  onOpenProviderModal,
  onOpenRouteModal,
}: Props) {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];
  const styles = createStyles(C);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const today = new Date();

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selected) {
      setPickerDate(selected);
      if (Platform.OS === "android") {
        setDepartureDate(formatDate(selected));
        clearError("date");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Provider */}
      <View style={styles.fieldBlock}>
        <ThemedText style={styles.fieldLabel}>Select Provider</ThemedText>
        <TouchableOpacity
          style={[styles.selectField, providerError ? styles.fieldError : undefined]}
          onPress={() => { clearError("provider"); onOpenProviderModal(); }}
          activeOpacity={0.85}
        >
          <ThemedText
            style={[styles.selectText, !selectedTransportProvider && styles.placeholderText]}
          >
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
            onPress={() => { clearError("route"); onOpenRouteModal(); }}
            activeOpacity={0.85}
          >
            <ThemedText
              style={[styles.selectText, !selectedRoute && styles.placeholderText]}
            >
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
                onPress={() => setSelectedVehicleType(vt)}
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
          onPress={() => { clearError("date"); setShowDatePicker(true); }}
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
            onChangeText={(v) => { setPassengerName(v); clearError("name"); }}
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
            onChangeText={(v) => { setPassengerEmail(v); clearError("email"); }}
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
            onChangeText={(v) => { setSeatNumber(v); clearError("seat"); }}
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
            onChangeText={(v) => { setAmount(v.replace(/\D/g, "")); clearError("amount"); }}
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
                  clearError("date");
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
    </View>
  );
}

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
    pickerBtn: {
      fontSize: 16,
      fontWeight: "600",
    },
    calendarTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: C.text,
      textAlign: "center",
    },
  });

