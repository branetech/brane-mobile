import ForgotPassword from "@/components/forgot-password";
import ConfirmPassword from "@/components/forgot-password/confirm-password";
import OTP from "@/components/forgot-password/otp";
import { useReduxState } from "@/redux/useReduxState";
import BaseRequest, { parseNetworkError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { formatPhoneNumber, showError, showSuccess } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { View } from "@idimma/rn-widget";
import { useState } from "react";

type Page = "forgotPassword" | "otp" | "createPassword";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [page, setPage] = useReduxState<Page>("forgotPassword", "forgotPassword");
  const [otp, setOtp] = useReduxState("otp-page", "");
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleEmailSubmit = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      const phone = formatPhoneNumber(data.email);
      setPhoneNumber(phone);

      // Request password reset OTP
      await BaseRequest.post(AUTH_SERVICE.PASSWORD_RESET, { phone });

      setPage("otp");
      showSuccess("OTP sent to your phone number");
    } catch (error: any) {
      const { message } = parseNetworkError(error);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = async (otpValue: string) => {
    try {
      setIsLoading(true);
      setOtp(otpValue);

      // Verify OTP before moving to password reset
      await BaseRequest.post("/auth-service/verify-password-reset-otp", {
        phone: phoneNumber,
        otp: otpValue,
      });

      setPage("createPassword");
      showSuccess("OTP verified successfully");
    } catch (error: any) {
      const { message } = parseNetworkError(error);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      await BaseRequest.post(AUTH_SERVICE.PASSWORD_RESET, { phone: phoneNumber });
      showSuccess("New OTP sent successfully");
    } catch (error: any) {
      const { message } = parseNetworkError(error);
      showError(message);
    } finally {
      setIsResending(false);
    }
  };

  const handlePasswordReset = async (data: { password: string; confirmPassword: string }) => {
    try {
      setIsLoading(true);

      if (data.password !== data.confirmPassword) {
        showError("Passwords do not match");
        return;
      }

      await BaseRequest.post("/auth-service/confirm-password-reset", {
        phone: phoneNumber,
        otp: otp,
        password: data.password,
      });

      showSuccess("Password reset successfully");
      router.replace("/(auth)/login");
    } catch (error: any) {
      const { message } = parseNetworkError(error);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View flex>
      {page === "forgotPassword" && (
        <ForgotPassword
          onSubmitEmail={handleEmailSubmit}
          isLoading={isLoading}
        />
      )}
      {page === "otp" && (
        <OTP
          isLoading={isLoading}
          onSubmitEmail={handleOTPComplete}
          isDisabled={false}
          back={() => setPage("forgotPassword")}
          handleOtpChange={setOtp}
          otp={otp}
          isResending={isResending}
          requestOtp={handleResendOtp}
        />
      )}
      {page === "createPassword" && (
        <ConfirmPassword
          onSubmitEmail={handlePasswordReset}
          isLoading={isLoading}
          back={() => setPage("otp")}
        />
      )}
    </View>
  );
}