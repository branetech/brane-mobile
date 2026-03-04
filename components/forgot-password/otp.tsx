import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, View } from "@idimma/rn-widget";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import Back from "../Back";
import { BraneButton } from "../brane-button";
import { OTPInput } from "../otp-input";

interface RegisterProps {
  onSubmitEmail: (otp: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
  back?: () => void;
  requestOtp?: () => void;
  isResending?: boolean;
  handleOtpChange?: (otp: string) => void;
  otp?: string;
  email?: string;
}

export default function OTP({
  onSubmitEmail,
  isLoading,
  isDisabled,
  back,
  requestOtp,
  isResending,
  handleOtpChange,
  email,
}: RegisterProps) {
  const [localOtp, setLocalOtp] = useState("");

  const isOtpComplete = localOtp.length === 6;
  const buttonDisabled = isDisabled || isLoading || !isOtpComplete;

  const handleChange = (value: string) => {
    setLocalOtp(value);
    handleOtpChange?.(value);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View flex py={"12%"} px={"6%"} spaced>
        <View gap={24}>
          <Back onPress={back} />
          <View gap={8}>
            <ThemedText type={"subtitle"}>Reset code</ThemedText>
            <ThemedText>
              Enter the 6 digit code sent to {email ?? "your email"} to continue
            </ThemedText>
          </View>
          <View mt={8}>
            <OTPInput length={6} onComplete={handleChange} />
          </View>
          <TouchableOpacity
            mt={8}
            onPress={requestOtp}
            disabled={isResending || isLoading}
          >
            <ThemedText style={{ color: "#342A3B" }}>
              Didn&apos;t get verification code?
              <ThemedText style={{ color: "#013D25", fontWeight: "bold" }}>
                {" "}
                {isResending ? "Sending..." : "Resend"}
              </ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View>
          <BraneButton
            disabled={buttonDisabled}
            loading={isLoading}
            text={"Proceed"}
            textColor="#D2F1E4"
            height={52}
            radius={12}
            onPress={() => onSubmitEmail(localOtp)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
