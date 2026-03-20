import OTP from "@/components/forgot-password/otp";
import ResetPassword from "@/components/reset-password";
import { SuccessModal } from "@/components/success-modal";
import BaseRequest, { catchError } from "@/services";
import { PASSWORD_RESET_ROUTE } from "@/services/routes";
import { useBooleans } from "@/utils/hooks";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";

interface DataType {
  password: string;
  confirmPassword: string;
  otp?: string;
}

const ChangePassword = () => {
  const router = useRouter();
  const [stage, setStage] = useState<number>(1);
  const [isLoading, startLoading, stopLoading] = useBooleans(false);
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);

  const getOtp = useCallback(async () => {
    setIsResending(true);
    startLoading();
    try {
      await BaseRequest.get(PASSWORD_RESET_ROUTE);
    } catch (error) {
      catchError(error);
    } finally {
      stopLoading();
      setIsResending(false);
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    getOtp();
  }, [getOtp]);

  const handleSubmitOtp = useCallback(
    async (value: string) => {
      startLoading();
      try {
        await BaseRequest.post(PASSWORD_RESET_ROUTE, { otp: value });
        setOtp(value);
        setStage(2);
      } catch (error) {
        catchError(error);
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const handleSubmitPassword = useCallback(
    async (data: DataType) => {
      startLoading();
      try {
        await BaseRequest.patch(PASSWORD_RESET_ROUTE, {
          password: data.password,
          confirmPassword: data.confirmPassword,
          otp,
        });
        setStage(3);
      } catch (error) {
        catchError(error);
      } finally {
        stopLoading();
      }
    },
    [otp, startLoading, stopLoading],
  );

  return (
    <View flex>
      {stage === 1 && (
        <OTP
          onSubmitEmail={handleSubmitOtp}
          isLoading={isLoading}
          isDisabled={false}
          back={() => router.back()}
          requestOtp={getOtp}
          isResending={isResending}
          email='your phone number'
        />
      )}

      {stage === 2 && (
        <ResetPassword
          isLoading={isLoading}
          onSubmitPassword={handleSubmitPassword}
          title='Change Password'
          onBack={() => setStage(1)}
        />
      )}

      <SuccessModal
        visible={stage === 3}
        title='Successful'
        description='Password change was successful'
        actionText='Dismiss'
        onAction={() => router.replace("/(tabs)/(account)")}
      />
    </View>
  );
};

export default ChangePassword;
