import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Type definitions
interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format: string; // Format pattern for phone numbers
  maxLength: number; // Maximum length for the country
}

interface PhoneInputProps {
  onPhoneChange?: (phone: string) => void;
  onFormattedChange?: (formatted: string, raw: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  style?: any;
  error?: boolean;
  errorMessage?: string;
  autoFormat?: boolean;
}

const countries: Country[] = [
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "+234",
    flag: "🇳🇬",
    format: "### ### ####",
    maxLength: 10,
  },
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    format: "(###) ###-####",
    maxLength: 10,
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    format: "#### ### ####",
    maxLength: 10,
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
    format: "(###) ###-####",
    maxLength: 10,
  },
  {
    code: "AU",
    name: "Australia",
    dialCode: "+61",
    flag: "🇦🇺",
    format: "#### ### ###",
    maxLength: 9,
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "+49",
    flag: "🇩🇪",
    format: "### ########",
    maxLength: 11,
  },
  {
    code: "FR",
    name: "France",
    dialCode: "+33",
    flag: "🇫🇷",
    format: "## ## ## ## ##",
    maxLength: 10,
  },
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    format: "##### #####",
    maxLength: 10,
  },
  {
    code: "CN",
    name: "China",
    dialCode: "+86",
    flag: "🇨🇳",
    format: "### #### ####",
    maxLength: 11,
  },
  {
    code: "JP",
    name: "Japan",
    dialCode: "+81",
    flag: "🇯🇵",
    format: "###-####-####",
    maxLength: 11,
  },
];

export const PhoneInput: React.FC<PhoneInputProps> = ({
  onPhoneChange,
  onFormattedChange,
  onSubmitEditing,
  placeholder = "Phone number",
  value = "",
  disabled = false,
  style,
  error = false,
  errorMessage = "",
  autoFormat = true,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>(value);
  const [formattedNumber, setFormattedNumber] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const inputBg = theme.inputBackground;
  const borderColor =
    colorScheme === "dark" ? Colors.dark.borderColor : Colors.light.borderColor;
  const errorColor = theme.error;
  const mutedColor = theme.muted;
  const textColor = theme.text;
  const primaryColor = theme.primary;

  const formatPhoneNumber = (text: string, country: Country): string => {
    if (!autoFormat) return text;
    const cleaned = text.replace(/\D/g, "");

    const limited = cleaned.slice(0, country.maxLength);

    let formatted = "";
    let digitIndex = 0;

    for (
      let i = 0;
      i < country.format.length && digitIndex < limited.length;
      i++
    ) {
      const char = country.format[i];
      if (char === "#") {
        formatted += limited[digitIndex];
        digitIndex++;
      } else {
        formatted += char;
      }
    }

    return formatted;
  };

  // Remove formatting to get raw number
  const getRawNumber = (formatted: string): string => {
    return formatted.replace(/\D/g, "");
  };

  const detectCountryFromDialCode = (text: string): { country: Country; localNumber: string } | null => {
    const trimmed = text.trim();
    if (!trimmed.startsWith("+")) return null;
    // Sort by longest dial code first to avoid "+1" matching "+1X" entries
    const sorted = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const country of sorted) {
      if (trimmed.startsWith(country.dialCode)) {
        const localNumber = getRawNumber(trimmed.slice(country.dialCode.length));
        return { country, localNumber };
      }
    }
    return null;
  };

  const handlePhoneChange = (text: string): void => {
    const detected = detectCountryFromDialCode(text);
    if (detected) {
      const { country, localNumber } = detected;
      const formatted = formatPhoneNumber(localNumber, country);
      setSelectedCountry(country);
      setPhoneNumber(localNumber);
      setFormattedNumber(formatted);
      onPhoneChange?.(country.dialCode + localNumber);
      onFormattedChange?.(country.dialCode + " " + formatted, localNumber);
      return;
    }

    const rawText = getRawNumber(text);
    const formatted = formatPhoneNumber(rawText, selectedCountry);

    setPhoneNumber(rawText);
    setFormattedNumber(formatted);

    onPhoneChange?.(selectedCountry.dialCode + rawText);
    onFormattedChange?.(selectedCountry.dialCode + " " + formatted, rawText);
  };

  const handleCountrySelect = (country: Country): void => {
    setSelectedCountry(country);
    setModalVisible(false);

    // Reformat existing number with new country pattern
    const formatted = formatPhoneNumber(phoneNumber, country);
    setFormattedNumber(formatted);

    if (onPhoneChange) {
      onPhoneChange(country.dialCode + phoneNumber);
    }

    if (onFormattedChange) {
      onFormattedChange(country.dialCode + " " + formatted, phoneNumber);
    }
  };

  // Sync external value changes (e.g. contact picked from picker)
  useEffect(() => {
    if (!value) return;
    // Skip if value was produced by our own onPhoneChange — no work needed
    if (value === selectedCountry.dialCode + phoneNumber) return;

    // Try to detect country from international format (with or without leading +)
    const withPlus = value.startsWith("+") ? value : "+" + value;
    const detected = detectCountryFromDialCode(withPlus);
    if (detected) {
      const { country, localNumber } = detected;
      setSelectedCountry(country);
      setPhoneNumber(localNumber);
      setFormattedNumber(formatPhoneNumber(localNumber, country));
      return;
    }

    // Local format (e.g. 08012345678) — strip leading 0 and keep for current country
    const rawDigits = value.replace(/\D/g, "").replace(/^0+/, "");
    setPhoneNumber(rawDigits);
    setFormattedNumber(formatPhoneNumber(rawDigits, selectedCountry));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const renderCountryItem: ListRenderItem<Country> = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleCountrySelect(item)}
      activeOpacity={0.7}
    >
      <ThemedText style={styles.flag}>{item.flag}</ThemedText>
      <ThemedText style={styles.countryName}>{item.name}</ThemedText>
      <ThemedText style={styles.dialCode}>{item.dialCode}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Labels */}
      {/* <View style={styles.labelsContainer}>
                <ThemedText>Country *</ThemedText>
                <ThemedText>Phone number *</ThemedText>
            </View> */}

      {/* Input Container */}
      <View style={styles.inputContainer}>
        {/* Country Picker */}
        <TouchableOpacity
          style={[
            styles.countryPicker,
            {
              backgroundColor: theme.inputBackground,
              borderColor: error ? errorColor : borderColor,
            },
          ]}
          onPress={() => !disabled && setModalVisible(true)}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <ThemedText style={styles.flag}>{selectedCountry.flag}</ThemedText>
          <ThemedText
            style={[
              disabled && { opacity: 0.6 },
              disabled && { color: mutedColor },
              { fontSize: 14 },
            ]}
          >
            {selectedCountry.dialCode}
          </ThemedText>
          {/* <ArrowDown2 size='13' color={primaryColor} /> */}
        </TouchableOpacity>

        {/* Phone Number Input */}
        <View
          style={[
            styles.phoneInputContainer,
            {
              backgroundColor: inputBg,
              borderColor: error ? errorColor : borderColor,
              gap: 6,
            },
          ]}
        >
          {/* Removed dial code from here */}
          <TextInput
            style={[
              styles.phoneInput,
              disabled && styles.phoneInputDisabled,
              error && styles.inputContainerError,
              { color: textColor },
            ]}
            value={autoFormat ? formattedNumber : phoneNumber}
            onChangeText={handlePhoneChange}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={onSubmitEditing ? "next" : "done"}
            placeholder={placeholder}
            keyboardType='phone-pad'
            placeholderTextColor={mutedColor}
            editable={!disabled}
            maxLength={selectedCountry.format.length}
          />
        </View>
      </View>

      {/* Error Message */}
      {error && errorMessage ? (
        <Text style={[styles.errorText, { color: errorColor }]}>
          {errorMessage}
        </Text>
      ) : null}

      {/* Country Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContainer, { backgroundColor: theme.inputBackground }]}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Select Country</ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.closeButtonText}>✕</ThemedText>
              </TouchableOpacity>
            </View>
            <FlatList<Country>
              data={countries}
              renderItem={renderCountryItem}
              keyExtractor={(item: Country) => item.code}
              style={styles.countryList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  labelsContainer: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    // flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    overflow: "hidden",
    gap: 4,
  },
  inputContainerError: {
    borderColor: "#e53e3e",
  },
  inputContainerDisabled: {
    opacity: 0.6,
  },
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    width: 90, // Adjusted width to accommodate the dial code
    height: 48,
    justifyContent: "center",
    borderRadius: 8,
  },
  countryPickerDisabled: {
    opacity: 0.6,
  },
  flag: {
    fontSize: 20,
    marginRight: 4, // Reduced margin to make space for dial code
  },

  chevronDisabled: {
    opacity: 0.6,
  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
  },
  dialCode: {
    fontSize: 12,
    // color: '#000000',
    // Removed explicit right margin here as it's now handled in the flag style
  },
  dialCodeDisabled: {
    opacity: 0.6,
  },
  phoneInput: {
    flex: 1,
    height: 45,
    fontSize: 14,
    paddingVertical: 12,
  },
  phoneInputDisabled: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#013D254D",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    // backgroundColor: '#fff',
    // borderRadius: 12,
    // width: '100%',
    // maxHeight: '80%',
    // position: 'absolute',
    // bottom: 0,
    borderRadius: 12,
    width: "100%",
    height: "80%", // Use height instead of maxHeight for consistent sizing within the overlay
    // If you want it smaller, adjust this percentage.
    position: "absolute", // Keep position absolute to pin it to the bottom
    bottom: 0,
    // Make sure its children can flex properly
    flexDirection: "column",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    // color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    // color: '#666',
  },
  countryList: {
    flex: 1,
    height: 400,
    padding: 16,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#f0f0f0',
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    // color: '#333',
    marginLeft: 12,
  },
});
