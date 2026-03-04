import { BraneButton } from "@/components/brane-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "@idimma/rn-widget";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    View as RNView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Back from "../Back";
import { PinSuccessModal } from "./pinModal";

type Props = {
  back: () => void;
  onComplete: () => void;
};

export default function SetPinScreen({ back, onComplete }: Props) {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];
  const [focusedInput, setFocusedInput] = useState<"pin" | "confirm" | null>(
    "pin",
  );
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const pinInputRef = useRef<TextInput>(null);
  const confirmInputRef = useRef<TextInput>(null);
  const isMismatched = confirmPin.length === 6 && pin !== confirmPin;
  const pinsMatch =
    pin.length === 6 && confirmPin.length === 6 && pin === confirmPin;

  const isButtonDisabled = !pinsMatch;

  const handleSetPin = () => {
    if (pinsMatch) setShowSuccess(true);
  };

  const renderPinBoxes = (
    value: string,
    onPress: () => void,
    label?: string,
    isFocused?: boolean,
    isError?: boolean,
  ) => {
    const boxes = [];

    for (let i = 0; i < 6; i++) {
      const isFilled = i < value.length;
      const isActive = i === value.length && isFocused;

      boxes.push(
        <RNView
          key={i}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: "#F7F7F8",
            alignItems: "center",
            justifyContent: "center",
            marginRight: i !== 5 ? 8 : 0,
            borderWidth: 1.5,
            borderColor: isActive ? "#004737" : "#F7F7F8",
          }}
        >
          {isFilled ? (
            <RNView
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#1C1C1E",
              }}
            />
          ) : isActive ? (
            <ThemedText
              style={{ color: "#004737", fontSize: 20, fontWeight: "300" }}
            >
              |
            </ThemedText>
          ) : null}
        </RNView>,
      );
    }

    return (
      <RNView style={{ marginBottom: 24 }}>
        {label && (
          <ThemedText
            style={{ fontSize: 12, color: C.muted, marginVertical: 6 }}
          >
            {label}
          </ThemedText>
        )}
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          style={{ flexDirection: "row", justifyContent: "flex-start" }}
        >
          {boxes}
        </TouchableOpacity>
      </RNView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View flex style={{ paddingHorizontal: "6%" }}>
          <Back onPress={back} />

          <View style={{ marginVertical: 24 }}>
            <ThemedText type="subtitle">Set-up Transaction Pin</ThemedText>
            <ThemedText style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
              Create and confirm your 6-digit transaction pin
            </ThemedText>
          </View>

          {renderPinBoxes(
            pin,
            () => pinInputRef.current?.focus(),
            "Transaction PIN",
            focusedInput === "pin",
          )}
          <TextInput
            ref={pinInputRef}
            onFocus={() => setFocusedInput("pin")}
            onBlur={() => setFocusedInput(null)}
            value={pin}
            onChangeText={(val) => {
              if (/^[0-9]*$/.test(val) && val.length <= 6) {
                setPin(val);
                if (val.length === 6) confirmInputRef.current?.focus();
              }
            }}
            style={styles.hiddenInput}
            keyboardType="number-pad"
            autoFocus
          />

          {renderPinBoxes(
            confirmPin,
            () => confirmInputRef.current?.focus(),
            "Confirm Transaction PIN",
            focusedInput === "confirm",
            isMismatched,
          )}

          {isMismatched && (
            <ThemedText
              style={{
                color: "#E02B2B",
                fontSize: 12,
                marginTop: -8,
                marginBottom: 12,
              }}
            >
              Pin does not match
            </ThemedText>
          )}
          <TextInput
            ref={confirmInputRef}
            onFocus={() => setFocusedInput("confirm")}
            onBlur={() => setFocusedInput(null)}
            value={confirmPin}
            onChangeText={(val) => {
              if (/^[0-9]*$/.test(val) && val.length <= 6) {
                setConfirmPin(val);
              }
            }}
            style={styles.hiddenInput}
            keyboardType="number-pad"
          />

          <View
            style={{ flex: 1, justifyContent: "flex-end", marginBottom: 24 }}
          >
            <BraneButton
              text="Set Pin"
              onPress={handleSetPin}
              disabled={isButtonDisabled}
              height={52}
              radius={12}
              textColor={C.googleBg}
              backgroundColor={C.primary}
            />
          </View>
        </View>

        <PinSuccessModal
          visible={showSuccess}
          onContinue={() => {
            setShowSuccess(false);
            onComplete();
            router.replace("/(tabs)");
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hiddenInput: {
    position: "absolute",
    opacity: 0,
  },
});
