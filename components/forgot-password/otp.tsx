import { ThemedText } from "@/components/themed-text";
import { spacing } from "@/constants";
import { TouchableOpacity, View } from "@idimma/rn-widget";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import Back from "../back";
import { BraneButton } from "../brane-button";
import { OTPInput } from "../otp-input";

interface RegisterProps {
  onSubmitEmail: (otp: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
  back?: () => void;
  requestOtp?: () => Promise<void> | void;
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
  const [cooldown, setCooldown] = useState(0);

  const isOtpComplete = localOtp.length === 6;
  const buttonDisabled = isDisabled || isLoading || !isOtpComplete;
  const resendDisabled = isResending || isLoading || cooldown > 0;

  const handleChange = (value: string) => {
    setLocalOtp(value);
    handleOtpChange?.(value);
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResendPress = async () => {
    if (!requestOtp || resendDisabled) return;
    await Promise.resolve(requestOtp());
    // Prevent rapid resend taps even if request returns instantly.
    setCooldown(30);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View flex py={spacing["4xl"]} px={spacing.safe} spaced>
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
            onPress={handleResendPress}
            disabled={resendDisabled}
          >
            <ThemedText style={{ color: "#342A3B" }}>
              Didn&apos;t get verification code?
              <ThemedText style={{ color: "#013D25", fontWeight: "bold" }}>
                {" "}
                {isResending
                  ? "Sending..."
                  : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Resend"}
              </ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View>
          <BraneButton
            disabled={buttonDisabled}
            loading={isLoading}
            text={"Proceed"}
            textColor='#D2F1E4'
            height={52}
            radius={12}
            style={{ marginBottom: 70 }}
            onPress={() => onSubmitEmail(localOtp)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
