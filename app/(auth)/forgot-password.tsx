import ForgotPassword from "@/components/forgot-password";
import ConfirmPassword from "@/components/forgot-password/confirm-password";
import OTP from "@/components/forgot-password/otp";
import BaseRequest, { parseNetworkError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { formatPhoneNumber, showError, showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { useState } from "react";

type Page = "forgotPassword" | "otp" | "createPassword";
const pattern = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

type ResetIdentity = {
  email?: string;
  phone?: string;
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [page, setPage] = useState<Page>("forgotPassword");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<ResetIdentity>({});
  const [plainOTP, setPlainOTP] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      const identity = String(data.email || "")
        .replace("+", "")
        .trim();
      const payload: ResetIdentity = pattern.test(identity)
        ? { email: identity }
        : { phone: formatPhoneNumber(identity) };
      setFormData(payload);

      const response: any = await BaseRequest.post(
        AUTH_SERVICE.PASSWORD_RESET,
        payload,
      );
      const returnedOtp = response?.data?.otp || response?.otp;
      if (returnedOtp) setPlainOTP(String(returnedOtp));

      setPage("otp");
      showSuccess("OTP sent successfully!");
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

      const res = await BaseRequest.post(
        "/auth-service/verify-reset-password",
        {
          ...formData,
          otp: otpValue,
        },
      );
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
      await BaseRequest.post(AUTH_SERVICE.PASSWORD_RESET, formData);
      showSuccess("New OTP sent successfully");
    } catch (error: any) {
      const { message } = parseNetworkError(error);
      showError(message);
    } finally {
      setIsResending(false);
    }
  };

  const handlePasswordReset = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);

      if (data.password !== data.confirmPassword) {
        showError("Passwords do not match");
        return;
      }

      await BaseRequest.patch(AUTH_SERVICE.PASSWORD_RESET, {
        ...formData,
        otp: otp,
        password: data.password,
      });

      showSuccess("Password reset successfully");
      router.replace("/login");
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
          email={formData.email || formData.phone || plainOTP}
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
