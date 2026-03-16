/**
 * Biometric authentication error handler
 * Handles specific biometric errors and provides user-friendly messages
 */

export type BiometricErrorType =
  | 'NOT_AVAILABLE'
  | 'NOT_ENROLLED'
  | 'TIMEOUT'
  | 'CANCELLED'
  | 'LOCKED_OUT'
  | 'PERMISSION_DENIED'
  | 'HARDWARE_UNAVAILABLE'
  | 'NEGATIVE_BUTTON'
  | 'NO_SPACE'
  | 'UNKNOWN';

export interface BiometricErrorInfo {
  type: BiometricErrorType;
  userMessage: string;
  recoveryAction?: 'retry' | 'use_password' | 'setup' | 'none';
}

/**
 * Parse biometric error and return user-friendly message with recovery action
 */
export const parseBiometricError = (error: any): BiometricErrorInfo => {
  const errorMessage = error?.message || error?.toString() || '';
  const errorCode = error?.code || '';

  // Map error codes and messages to user-friendly responses
  if (
    errorMessage.toLowerCase().includes('not available') ||
    errorMessage.toLowerCase().includes('sensor not available') ||
    errorCode === 'NOT_AVAILABLE'
  ) {
    return {
      type: 'NOT_AVAILABLE',
      userMessage:
        'Biometric authentication is not available on this device',
      recoveryAction: 'use_password',
    };
  }

  if (
    errorMessage.toLowerCase().includes('not enrolled') ||
    errorMessage.toLowerCase().includes('no fingerprints') ||
    errorCode === 'NOT_ENROLLED'
  ) {
    return {
      type: 'NOT_ENROLLED',
      userMessage:
        'No biometric data registered. Please set up biometrics in your device settings.',
      recoveryAction: 'use_password',
    };
  }

  if (
    errorMessage.toLowerCase().includes('timeout') ||
    errorCode === 'TIMEOUT'
  ) {
    return {
      type: 'TIMEOUT',
      userMessage: 'Biometric authentication timed out. Please try again.',
      recoveryAction: 'retry',
    };
  }

  if (
    errorMessage.toLowerCase().includes('cancelled') ||
    errorMessage.toLowerCase().includes('user cancelled') ||
    errorCode === 'NEGATIVE_BUTTON'
  ) {
    return {
      type: 'CANCELLED',
      userMessage: 'Authentication cancelled.',
      recoveryAction: 'none',
    };
  }

  if (
    errorMessage.toLowerCase().includes('locked') ||
    errorMessage.toLowerCase().includes('too many attempts') ||
    errorCode === 'LOCKED_OUT'
  ) {
    return {
      type: 'LOCKED_OUT',
      userMessage:
        'Too many failed attempts. Please try again later or use your password.',
      recoveryAction: 'use_password',
    };
  }

  if (
    errorMessage.toLowerCase().includes('permission') ||
    errorCode === 'PERMISSION_DENIED'
  ) {
    return {
      type: 'PERMISSION_DENIED',
      userMessage:
        'Biometric permission denied. Please enable in device settings.',
      recoveryAction: 'use_password',
    };
  }

  if (
    errorMessage.toLowerCase().includes('hardware') ||
    errorCode === 'HARDWARE_UNAVAILABLE'
  ) {
    return {
      type: 'HARDWARE_UNAVAILABLE',
      userMessage:
        'Biometric hardware is unavailable. Please use your password.',
      recoveryAction: 'use_password',
    };
  }

  if (errorMessage.toLowerCase().includes('no space')) {
    return {
      type: 'NO_SPACE',
      userMessage:
        'Device storage issue. Please use your password to log in.',
      recoveryAction: 'use_password',
    };
  }

  return {
    type: 'UNKNOWN',
    userMessage: 'Biometric authentication failed. Please try again.',
    recoveryAction: 'retry',
  };
};

/**
 * Check if biometric error is recoverable by retrying
 */
export const isRetryableError = (errorType: BiometricErrorType): boolean => {
  return ['TIMEOUT', 'CANCELLED'].includes(errorType);
};

/**
 * Check if user should fall back to password
 */
export const shouldFallbackToPassword = (errorType: BiometricErrorType): boolean => {
  return [
    'NOT_AVAILABLE',
    'NOT_ENROLLED',
    'PERMISSION_DENIED',
    'HARDWARE_UNAVAILABLE',
    'LOCKED_OUT',
    'NO_SPACE',
  ].includes(errorType);
};
