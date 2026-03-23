import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const CREDENTIALS_KEY = "brane_biometric_credentials";

type Credentials = {
  phoneNumber: string;
  password: string;
};

type Availability = {
  available: boolean;
  biometricType: "fingerprint" | "facial" | "iris" | null;
};

type AuthResult =
  | { success: true; error?: never }
  | { success: false; error: string };

type CredentialsResult =
  | { credentials: Credentials; error?: never }
  | { credentials?: never; error: string };

export function useBiometricAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<Availability>({
    available: false,
    biometricType: null,
  });

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setAvailability({ available: false, biometricType: null });
        return;
      }

      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      let biometricType: Availability["biometricType"] = "fingerprint";
      if (
        supportedTypes.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
        )
      ) {
        biometricType = "facial";
      } else if (
        supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
      ) {
        biometricType = "iris";
      }

      setAvailability({ available: true, biometricType });
    } catch {
      setAvailability({ available: false, biometricType: null });
    }
  };

  const authenticate = async (): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        fallbackLabel: "Use PIN",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) return { success: true };

      const errorMap: Record<string, string> = {
        UserCancel: "Authentication cancelled",
        UserFallback: "Please login manually",
        SystemCancel: "Authentication was cancelled by the system",
        PasscodeNotSet: "No passcode set on device",
        BiometryNotAvailable: "Biometry not available",
        BiometryNotEnrolled: "No biometrics enrolled",
        BiometryLockout: "Too many attempts. Please try again later",
      };

      return {
        success: false,
        error: errorMap[result.error ?? ""] ?? "Authentication failed",
      };
    } catch (e: any) {
      return { success: false, error: e?.message ?? "Authentication failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const saveCredentials = async (
    phoneNumber: string,
    password: string
  ): Promise<boolean> => {
    try {
      await SecureStore.setItemAsync(
        CREDENTIALS_KEY,
        JSON.stringify({ phoneNumber, password })
      );
      return true;
    } catch {
      return false;
    }
  };

  const retrieveCredentials = async (): Promise<CredentialsResult> => {
    try {
      const raw = await SecureStore.getItemAsync(CREDENTIALS_KEY);
      if (!raw) return { error: "No stored credentials found" };
      const credentials = JSON.parse(raw) as Credentials;
      return { credentials };
    } catch {
      return { error: "Failed to retrieve credentials" };
    }
  };

  const clearCredentials = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
  };

  return {
    isLoading,
    availability,
    authenticate,
    saveCredentials,
    retrieveCredentials,
    clearCredentials,
  };
}