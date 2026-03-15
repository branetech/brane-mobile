import FingerprintScanner from 'react-native-fingerprint-scanner';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { parseBiometricError } from '@/utils/biometric-error-handler';

export interface BiometricCredentials {
  phoneNumber: string;
  password: string;
  mode: 'auto-login' | '2fa';
}

export interface BiometricAvailability {
  available: boolean;
  type?: 'Fingerprint' | 'Face' | 'Iris';
  error?: string;
}

export const BIOMETRIC_CREDENTIALS_KEY = 'brane_biometric_credentials';
export const BIOMETRIC_MODE_KEY = 'brane_biometric_mode';
export const BIOMETRIC_TYPE_KEY = 'brane_biometric_type';

export const useBiometricAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [availability, setAvailability] = useState<BiometricAvailability>({
    available: false,
  });

  /**
   * Check if biometric authentication is available on the device
   */
  const checkAvailability = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await FingerprintScanner.isSensorAvailable();

      if (result) {
        setAvailability({
          available: true,
          type: 'Fingerprint', // Default to 'Fingerprint' as the type
        });
        return { available: true, type: 'Fingerprint' };
      }

      setAvailability({
        available: false,
        error: 'Biometric sensor not available',
      });
      return { available: false };
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to check biometric availability';
      setAvailability({
        available: false,
        error: errorMsg,
      });
      return { available: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Authenticate user with biometric (fingerprint/face)
   */
  const authenticate = useCallback(
    async (): Promise<{ success: boolean; error?: string }> => {
      try {
        setIsLoading(true);
        await FingerprintScanner.authenticate({
          onAttempt: () => {
            // Called on each attempt
          },
          description: 'Authenticate to login to Brane',
        });
        return { success: true };
      } catch (error: any) {
        const errorInfo = parseBiometricError(error);
        // 'Biometric authentication failed:', errorInfo);
        return {
          success: false,
          error: errorInfo.userMessage,
        };
      } finally {
        setIsLoading(false);
        FingerprintScanner.release();
      }
    },
    []
  );

  /**
   * Store credentials securely for biometric login
   */
  const storeCredentials = useCallback(
    async (
      credentials: BiometricCredentials
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        setIsLoading(true);

        // Store credentials as encrypted JSON
        const credentialsJson = JSON.stringify({
          phoneNumber: credentials.phoneNumber,
          password: credentials.password,
          timestamp: Date.now(),
        });

        await SecureStore.setItemAsync(
          BIOMETRIC_CREDENTIALS_KEY,
          credentialsJson
        );

        // Store mode preference
        await SecureStore.setItemAsync(BIOMETRIC_MODE_KEY, credentials.mode);

        // Store biometric type for reference
        const biometricType = availability.type || 'Fingerprint';
        await SecureStore.setItemAsync(BIOMETRIC_TYPE_KEY, biometricType);

        return { success: true };
      } catch (error: any) {
        const errorMsg = error?.message || 'Failed to store credentials';
        // 'Error storing biometric credentials:', error);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [availability.type]
  );

  /**
   * Retrieve stored credentials from secure storage
   */
  const retrieveCredentials = useCallback(
    async (): Promise<{
      credentials?: BiometricCredentials;
      error?: string;
    }> => {
      try {
        setIsLoading(true);

        const credentialsJson = await SecureStore.getItemAsync(
          BIOMETRIC_CREDENTIALS_KEY
        );
        const mode = (await SecureStore.getItemAsync(
          BIOMETRIC_MODE_KEY
        )) as 'auto-login' | '2fa';

        if (!credentialsJson || !mode) {
          return { error: 'No stored credentials found' };
        }

        const parsed = JSON.parse(credentialsJson);

        return {
          credentials: {
            phoneNumber: parsed.phoneNumber,
            password: parsed.password,
            mode,
          },
        };
      } catch (error: any) {
        const errorMsg = error?.message || 'Failed to retrieve credentials';
        // 'Error retrieving biometric credentials:', error);
        return { error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Remove stored credentials (disable biometric login)
   */
  const deleteCredentials = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      await SecureStore.deleteItemAsync(BIOMETRIC_CREDENTIALS_KEY);
      await SecureStore.deleteItemAsync(BIOMETRIC_MODE_KEY);
      await SecureStore.deleteItemAsync(BIOMETRIC_TYPE_KEY);
      return true;
    } catch (error: any) {
      // 'Error deleting biometric credentials:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if biometric credentials are already stored
   */
  const hasStoredCredentials = useCallback(async (): Promise<boolean> => {
    try {
      const credentials = await SecureStore.getItemAsync(
        BIOMETRIC_CREDENTIALS_KEY
      );
      return !!credentials;
    } catch {
      return false;
    }
  }, []);

  /**
   * Get stored biometric mode (auto-login or 2fa)
   */
  const getStoredMode = useCallback(
    async (): Promise<'auto-login' | '2fa' | null> => {
      try {
        const mode = (await SecureStore.getItemAsync(
          BIOMETRIC_MODE_KEY
        )) as 'auto-login' | '2fa' | null;
        return mode;
      } catch {
        return null;
      }
    },
    []
  );

  /**
   * Initialize hook - check availability on mount
   */
  useEffect(() => {
    checkAvailability();

    return () => {
      FingerprintScanner.release();
    };
  }, [checkAvailability]);

  return {
    isLoading,
    availability,
    checkAvailability,
    authenticate,
    storeCredentials,
    retrieveCredentials,
    deleteCredentials,
    hasStoredCredentials,
    getStoredMode,
  };
};
