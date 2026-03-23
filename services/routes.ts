import { networkToTicker } from "@/utils/hooks";

export const TRANSACTION_SERVICE = {
  BRAC_BREAKDOWN: "/transactions-service/transactions/rebates",
  CARDS: "/transactions-service/banking-info/cards",
  BENEFICIARIES: "/transactions-service/banking-info/accounts",
  VERIFY_ACCOUNT: "/transactions-service/banking-info/resolve-account-number",
  BANKS: "/transactions-service/banking-info/banks",
  BALANCE: "/transactions-service/wallet/balance",
  TRANSACTION_LIST: "/transactions-service/transactions/user",
  STOCK_TRANSACTION_LIST: "/stocks-service/transactions/user",
  SPENDING_PATTERN: "/transactions-service/transactions/users/spending-pattern",
  ROVA_ACCOUNT_NO: "/transactions-service/rova/user/account-no",
  BRAC: (networkTicker: string) =>
    networkTicker
      ? `/transactions-service/transactions/user?perPage=1000&tickerSymbol=${networkToTicker(networkTicker)}`
      : "",
  SINGLE: (details: string) =>
    details ? `/transactions-service/transactions/${details}/user` : "",
  ACCOUNT_BRACS_ALLOCATION: "/transactions-service/bracs-allocation",
  DELETE_SINGLE_CARD: (id: any) =>
    `/transactions-service/banking-info/cards/${id}`,
};

export const STOCKS_SERVICE = {
  STOCK_UNIT_BALANCE:
    "/stocks-service/customer-stocks/total-stock-unit-balance",
  WALLET_USER: "/stocks-service/wallet/user",
  WALLET_BALANCE: "/stocks-service/wallet/balance",
  WALLET_BALANCE_BREAKDOWN: "/stocks-service/wallet/bracs",
  BRAC_BALANCE: "/stocks-service/wallet/bracs/balance",
  BUY: "/stocks-service/customer-stocks/buy",
  CHECKOUT: "/stocks-service/customer-stocks/checkout",
  SELL: "/stocks-service/customer-stocks/sell",
  STOCKS: "/stocks-service/stocks/user",
  USER_STOCKS: "/stocks-service/customer-stocks/user",

  BRAC: (networkTicker: string) =>
    networkTicker
      ? `/stocks-service/wallet/ticker-symbol/${networkToTicker(networkTicker)}`
      : "",
  BREAKDOWN: (
    networkTicker: string,
    quantity?: number,
    assetClass?: string,
    amount?: number,
  ) =>
    networkTicker
      ? `/stocks-service/wallet/purchase-calc-breakdown/${networkToTicker(networkTicker)}?quantity=${quantity || 1}&assetClass=${assetClass}&amount=${amount}`
      : "",
  DETAILS: (networkTicker: string) =>
    networkTicker
      ? `/stocks-service/stocks/details/${networkToTicker(networkTicker)}`
      : "",
  HISTORY: (networkTicker: string) =>
    networkTicker
      ? `/stocks-service/stocks/historical-data?tickerSymbol=${networkToTicker(networkTicker)}`
      : "",
  // stock?.tickerSymbol?`/stocks-service/stocks/historical-data?tickerSymbol=${stock?.tickerSymbol}`:''
  BRACS: "/stocks-service/wallet/balance",
  CONVERSION_HISTORY: "/stocks-service/wallet/convert-bracs-log",
  SECURITY_PLAN: "/stocks-service/security-plans/user",
  MANAGED_BRACS: "/stocks-service/managed-bracs-allocation/user/data",
  ASSET_PICKER: "/stocks-service/asset-top-pick",
};

export const MOBILE_SERVICE = {
  BUY_DATA: "/mobile-connectivity-service/mobile-data/buy",
  BUY_AIRTIME: "/mobile-connectivity-service/mobile-data/buy",
  BUY_CABLE: "/mobile-connectivity-service/cable/buy",
  BENEFICIARY: "/mobile-connectivity-service/beneficiaries",
  VERIFY_CABLE_CARD: "/mobile-connectivity-service/cable/verify-smart-card",
  TRANSACTION_META: (details: string) =>
    details ? `/mobile-connectivity-service/vtpass/metadata/${details}` : "",
  TRANSACTION_ID: (details: string) =>
    details
      ? `/mobile-connectivity-service/vtpass/transactions/${details}`
      : "",
  BILLER_CODE: (biller: string) =>
    biller
      ? `/mobile-connectivity-service/cable/variation-codes?serviceId=${biller}`
      : "",
  ELECTRICITY_GET_BILLER: "/mobile-connectivity-service/electricity/biller",
  ELECTRICITY_BUY: "/mobile-connectivity-service/electricity/buy",
  ELECTRICITY_METER_VERIFY:
    "/mobile-connectivity-service/electricity/verify-meter",
  BETTING_SERVICE: "/mobile-connectivity-service/sportbet/service-ids",
  BETTING_BUY_SERVICE: "/mobile-connectivity-service/sportbet/bet",
  CABLE_SERVICE: "/mobile-connectivity-service/cable/merchant",
  PAYMENT_CODE: "/mobile-connectivity-service/quick-teller/payment-code",
  QUICKTELLER_VALIDATE: "/mobile-connectivity-service/quick-teller/validate",
  VARIATION_CODES: "/mobile-connectivity-service/mobile-data/variation-codes",
  NETWORKS: "/mobile-connectivity-service/mobile-data/networks",
  AIRTIME_TOPUP: "/mobile-connectivity-service/mobile-data/airtime-topup",
  DATA_PLANS: "/mobile-connectivity-service/mobile-data/data-plans",
  VT_PASS_META: "/mobile-connectivity-service/vtpass/metadata",
  VT_PASS_SERVICE: "/mobile-connectivity-service/vtpass/service-ids",
  VT_PASS_BUY: "/mobile-connectivity-service/vtpass/buy",
};

export const PASSWORD_RESET_ROUTE = "/auth-service/inapp-password-reset";
export const AUTH_SERVICE = {
  PROFILE: "/auth-service/user",
  RESEND_OTP: "/auth-service/signup/resend-otp",
  PASSWORD_RESET: "/auth-service/reset-password",
  SIGN_UP: "/auth-service/signup",
  VERIFY_OTP: "/auth-service/signup/verify-otp",
  USER_NAME: "/auth-service/username",
  INIT_DELETE: "/auth-service/initiate-delete-user",
  DELETE: "/auth-service/delete-user",
  DELETE_PROFILE_IMAGE: "/auth-service/profile-image",
  PIN_VALIDATION: "/auth-service/validate-transaction-pin",
  EMAIL: "/auth-service/email",
  PHONE: "/auth-service/phone",
  RESET_USERNAME: "/auth-service/reset-username",
  RESET_TRANSACTION_PIN: "/auth-service/pin",
  RESET_PIN: "/auth-service/reset-pin",
  NEXT_OF_KIN: "/auth-service/kyc/next-of-kin",
  IDENTITY: "/auth-service/kyc/verify-identity",
};
const hasWindow = () => typeof window === "object";

export const PAYMENT_CALLBACK_URL = hasWindow()
  ? `${window.location.origin}/payment-callback`
  : "";

export const routesToPrefetch = [
  "/buy-airtime",
  "/buy-data",
  "/stock",
  "/saved-cards",
  "/bank-account",
  "/kyc",
  "/kyc/identity-verification/id-verification",
  "/kyc/identity-verification/address-verification",
  "/kyc/identity-verification/photograph-verification",
  "/kyc/information",
  "/kyc/kin-details",
  "/kyc/verification",
  "/transaction-history",
  "/transaction-history/[details]",
  "/wallet",
  "/wallet/add-bank",
  "/wallet/add-card",
  "/wallet/fund-wallet",
  "/account/account-details",
  "/account/change-password",
  "/account/beneficiary",
  "/account/update-kin-details",
  "/account/change-username",
  "/account/reset-transaction-pin",
  "/notification-page",
  "/notification-page/[detailsId]",
  "/pay-bills",
  "/stocks",
  "/account",
  "/all-services",
  "/home",
  "/login",
  "/register",
  "/onboarding",
  "/kyc/information/bvn-verification",
  "/stock/withdraw",
];
