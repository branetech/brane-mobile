import BaseRequest from "@/services/index";
import { showError } from "@/utils/helpers";
import { Linking } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TransactionStatus = "pending" | "success" | "failed";

interface InitializePaymentResponse {
  authorization_url: string;
  reference: string;
  /** "paid" means the transaction was already settled before redirect */
  open?: "paid" | string;
}

interface VerifyTransactionResponse {
  data: TransactionStatus;
}

interface PaymentParams {
  amount: number;
  email: string;
  [key: string]: unknown;
}

// ─── Polling ──────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 10_000;
const MAX_POLL_ATTEMPTS = 18; // ~3 minutes max

/**
 * Polls the verify-transaction endpoint until the transaction leaves
 * "pending" status, a max attempt limit is hit, or an error occurs.
 */
const pollTransactionStatus = (
  reference: string,
  onSuccess: () => void,
  onFailure?: (reason: string) => void,
): (() => void) => {
  let attempts = 0;
  let stopped = false;

  const stop = () => {
    stopped = true;
  };

  const poll = async () => {
    if (stopped) return;

    attempts += 1;

    if (attempts > MAX_POLL_ATTEMPTS) {
      stop();
      onFailure?.(
        "Payment verification timed out. Please check your transaction history.",
      );
      return;
    }

    try {
      const response = await BaseRequest.get<
        unknown,
        VerifyTransactionResponse
      >(`verify-transaction/${reference}`);

      const status: TransactionStatus = response?.data;

      if (status === "pending") {
        // Not resolved yet — schedule next poll
        setTimeout(poll, POLL_INTERVAL_MS);
        return;
      }

      stop();

      if (status === "success") {
        onSuccess();
      } else {
        onFailure?.("Payment was not successful. Please try again.");
      }
    } catch {
      stop();
      onFailure?.(
        "Could not verify payment status. Please check your transaction history.",
      );
    }
  };

  // Kick off the first poll after one interval
  setTimeout(poll, POLL_INTERVAL_MS);

  // Return a cancel function so callers can stop polling (e.g. on unmount)
  return stop;
};

// ─── Deep Link / In-App Browser ───────────────────────────────────────────────

/**
 * Opens a payment URL using React Native's Linking API.
 * For a richer in-app experience, swap this for expo-web-browser:
 *   import * as WebBrowser from "expo-web-browser";
 *   await WebBrowser.openBrowserAsync(url);
 */
const openPaymentUrl = async (url: string): Promise<boolean> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      showError("Unable to open the payment page on this device.");
      return false;
    }
    await Linking.openURL(url);
    return true;
  } catch {
    showError("Failed to open the payment page. Please try again.");
    return false;
  }
};

// ─── Main Handler ─────────────────────────────────────────────────────────────

/**
 * Initializes a Paystack payment and either:
 *  - Calls `onSuccess` immediately if already paid
 *  - Opens the authorization URL and polls for completion
 *
 * Returns a `cancel` function to stop background polling — call it in a
 * useEffect cleanup or when the user navigates away.
 *
 * @example
 * const cancelPoll = handlePayment(
 *   { amount: 5000, email: "user@example.com" },
 *   () => {},
 *   (err) => console.error(err)
 * );
 * // In useEffect: return () => cancelPoll?.();
 */
export const handlePayment = (
  params: PaymentParams,
  onSuccess?: () => void,
  onFailure?: (reason: string) => void,
): void => {
  BaseRequest.post<unknown, InitializePaymentResponse>(
    "payment/paystack/initialize",
    params,
  )
    .then(async (data) => {
      // Already settled — no redirect needed
      if (data.open === "paid") {
        onSuccess?.();
        return;
      }

      const opened = await openPaymentUrl(data.authorization_url);

      if (opened) {
        pollTransactionStatus(data.reference, () => onSuccess?.(), onFailure);
      }
    })
    .catch((error: string) => {
      onFailure?.(error ?? "Payment initialization failed. Please try again.");
    });
};

// ─── Input Helpers ────────────────────────────────────────────────────────────

/**
 * Strips all non-numeric characters from a string.
 * Use with TextInput's onChangeText instead of targeting DOM events.
 *
 * @example
 * <TextInput onChangeText={(val) => setValue(numericOnly(val))} />
 */
export const numericOnly = (value: string): string =>
  value.replace(/[^0-9]/g, "");
