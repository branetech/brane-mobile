import {
    auth,
    setRefreshToken,
    setToken,
    setUser,
} from "@/redux/slice/auth-slice";
import { RootState } from "@/redux/store";
import {
    AUTH_SERVICE,
    MOBILE_SERVICE,
    STOCKS_SERVICE,
} from "@/services/routes";
import {
    formatPhoneNumber,
    hideAppLoader,
    onShowInsufficientFunds,
    showAppLoader,
    showError,
    showSuccess,
    UseNgnPhone,
} from "@/utils/helpers";
import { useRouter } from "expo-router"; // ✅ Changed from "next/navigation"
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseRequest, { catchError, parseNetworkError } from ".";
import { onReloadData } from "./useRequest";

export const usePostBvn = (
  setIsLoading: any,
  setSuccessMessage: any,
  verificationType: any,
  dob?: any,
) => {
  const fetchData = async (data: any, serialNumber: any) => {
    setIsLoading(true);
    try {
      await BaseRequest.post(AUTH_SERVICE.IDENTITY, {
        serialNumber,
        verificationType,
      });
      setSuccessMessage(true);
      return true;
    } catch (error: any) {
      const { message } = parseNetworkError(error);
      showError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  return { fetchData };
};

export const usePostLogin = ({ setIsLoading, router, dispatch }: any) => {
  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    const registerData = {
      phone: formatPhoneNumber(data.email),
      password: data.password,
    };
    try {
      const {
        data: { authCredentials, ...user },
      } = await BaseRequest.post("/auth-service/signin", registerData);
      const { accessToken: token, refreshToken } = authCredentials;
      dispatch(setUser(user));
      dispatch(setToken(token));
      dispatch(setRefreshToken(refreshToken));
      setIsLoading(false);
      router.push("/home");
    } catch (error: any) {
      catchError(error);
      setIsLoading(false);
    }
  };
  return { handleSubmit };
};

export const usePostResetOtp = (setIsNewLoading: any, setStage: any) => {
  const handleOtpSubmit = async (data: any) => {
    setIsNewLoading(true);
    try {
      await BaseRequest.post("/auth-service/reset-username", { otp: data });
      setStage(2);
    } catch (error: any) {
      const { message } = parseNetworkError(error);
      showError(message);
    }
    setIsNewLoading(false);
  };
  return { handleOtpSubmit };
};

export const usePostResetUsername = (
  setIsLoading: any,
  setStage: any,
  otp: any,
) => {
  const handleUsernameSubmit = async (data: any) => {
    try {
      await BaseRequest.patch("/auth-service/reset-username", {
        otp: otp?.otp,
        username: data?.username,
      });
      setStage(3);
    } catch (error: any) {
      const { message } = parseNetworkError(error);
      showError(message);
      setIsLoading(false);
    }
  };
  return { handleUsernameSubmit };
};

export const usePostOtp = ({
  setIsOtpLoading,
  setStage,
  setError,
  phone,
  dispatch,
}: any) => {
  const handleSubmitOtp = async (data: any) => {
    setIsOtpLoading(true);
    try {
      const response = await BaseRequest.post(
        "/auth-service/signup/verify-otp",
        {
          phone: "+" + phone,
          otp: data,
        },
      );
      const accessToken = response?.data?.authCredentials?.accessToken;
      dispatch(auth({ otp: data, token: accessToken }));
      setStage(3);
    } catch (error: any) {
      setIsOtpLoading(false);
      const { message } = parseNetworkError(error);
      showError(message);
    }
  };
  return { handleSubmitOtp };
};

export const usePostUsername = ({
  setIsUserNameLoading,
  setStage,
  setError,
}: any) => {
  const handleSubmitUsername = async (data: any) => {
    setIsUserNameLoading(true);
    try {
      await BaseRequest.post("/auth-service/username", data);
      setStage(4);
    } catch (error: any) {
      setIsUserNameLoading(false);
      const { message } = parseNetworkError(error);
      showError(message);
    }
  };
  return { handleSubmitUsername };
};

export const getTransactions = async () =>
  await BaseRequest.get("/transactions-service/transactions/user");

export const useInAppOtp = ({
  setIsNewLoading,
  setStage,
  setError,
  dispatch,
}: any) => {
  const handleSubmitOtp = async (data: any) => {
    setIsNewLoading(true);
    try {
      await BaseRequest.post("/auth-service/inapp-password-reset", {
        otp: data,
      });
      dispatch(setUser({ otp: data }));
      setStage(2);
    } catch (error: any) {
      setIsNewLoading(false);
      const { message } = parseNetworkError(error);
      showError(message);
    }
  };
  return { handleSubmitOtp };
};

export const useDeleteOtp = ({ setIsNewLoading, dispatch }: any) => {
  const router = useRouter(); // ✅ Now uses expo-router
  const handleSubmitOtp = async (data: any) => {
    setIsNewLoading(true);
    try {
      await BaseRequest.post("/auth-service/delete-user", { otp: data });
      dispatch(setUser({ otp: data }));
      router.push("/(tabs)");
    } catch (error: any) {
      setIsNewLoading(false);
      const { message } = parseNetworkError(error);
      showError(message);
    }
  };
  return { handleSubmitOtp };
};

export const useInAppPasswordChange = ({
  setIsLoading,
  setStage,
  setError,
  otp,
}: any) => {
  const handleSubmitPassword = async (data: {
    password: string;
    confirmPassword: string;
    oldPassword: string;
  }) => {
    setIsLoading(true);
    try {
      await BaseRequest.patch("/auth-service/inapp-password-reset", {
        otp: "+" + otp,
        password: data.password,
        oldPassword: data.oldPassword,
      });
      setStage(3);
    } catch (error: any) {
      setIsLoading(false);
      const { message } = parseNetworkError(error);
      showError(message);
    }
  };
  return { handleSubmitPassword };
};

export const useBeneficiary = (type: any) => {
  const fetchData = async (data: any) => {
    try {
      return await BaseRequest.post(
        "/mobile-connectivity-service/beneficiaries",
        {
          category: type,
          phone: data.phoneNumber,
          name: data.name,
        },
      );
    } catch (err) {
      const { message } = parseNetworkError(err);
      return message;
    }
  };
  return { fetchData };
};

export const usePostSellStocks = (setIsLoading: any, setStage: any) => {
  const fetchData = async (
    tickerSymbol: any,
    quantity: any,
    sellTrigger: any,
  ) => {
    const data = { tickerSymbol, quantity, sellTrigger };
    setStage("confirm");
    setIsLoading(true);
    try {
      const sellStocks: any = await BaseRequest.post(
        "/stocks-service/customer-stocks/sell",
        data,
      );
      showSuccess(sellStocks?.message);
      await onReloadData();
      setStage("success");
    } catch (err) {
      const { message } = parseNetworkError(err);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };
  return { fetchData };
};

export const usePreference = (showLoader = true) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const preference = useMemo(() => {
    return (
      user?.preference?.metadata || {
        showBalance: true,
        theme: "light",
        transactionSound: false,
      }
    );
  }, [user]);

  const handlePreference = useCallback(
    async (updatedPreference: any) => {
      try {
        if (showLoader) showAppLoader();
        const pref = { metadata: { ...preference, ...updatedPreference } };
        dispatch(setUser({ ...user, preference: pref }));
        const { data } = await BaseRequest.put(
          "/auth-service/preference",
          pref,
        );
        dispatch(setUser({ ...user, preference: data }));
      } catch (err) {
        catchError(err);
      } finally {
        hideAppLoader();
      }
    },
    [preference],
  );

  const onToggleBalance = () =>
    handlePreference({ showBalance: !preference?.showBalance });

  return { handlePreference, onToggleBalance, ...preference };
};

export const onTransactionPinCabelValidation = async ({
  serviceId,
  billersCode,
  user,
  amount,
  setRender,
  setIsLoading,
  onReloadData,
  variationCode,
  quantity,
  subscription_type,
}: {
  serviceId: string;
  billersCode: string;
  user?: any;
  amount: string;
  setRender: any;
  setIsLoading: any;
  onReloadData?: any;
  variationCode: string;
  quantity: number;
  subscription_type: string;
  router: any;
}) => {
  setRender("preview");
  setIsLoading(true);
  showAppLoader({
    message: "Processing Transaction",
    style: { backgroundColor: "rgba(1, 61, 37, .60)" },
    textStyle: { color: "#FFFFFF" },
    spinnerColor: "#FFFFFF",
  });

  try {
    const { message, data }: any = await BaseRequest.post(
      MOBILE_SERVICE.BUY_CABLE,
      {
        serviceId,
        billersCode,
        phone: user?.phone,
        amount: String(amount),
        variationCode,
        quantity,
        subscription_type,
      },
    );
    showSuccess(message);
    await onReloadData();
    return setRender("success");
  } catch (error: any) {
    const { message } = parseNetworkError(error);
    if (String(message).includes("insufficient")) onShowInsufficientFunds();
    showError(message);
  } finally {
    setIsLoading(false);
    hideAppLoader();
  }
};

export const onTransactionPinElectricityValidation = async ({
  serviceId,
  billersCode,
  user,
  amount,
  setShowErrorModal,
  setRender,
  setIsLoading,
  onReloadData,
  variationCode,
  name,
  router,
}: {
  serviceId: string;
  billersCode: number;
  user?: any;
  amount: string;
  setShowErrorModal?: any;
  setRender: any;
  setIsLoading: any;
  onReloadData?: any;
  variationCode: string;
  name?: string;
  router: any;
}) => {
  setRender("preview");
  setIsLoading(true);
  showAppLoader({
    message: "Processing Transaction",
    style: { backgroundColor: "rgba(1, 61, 37, .60)" },
    textStyle: { color: "#FFFFFF" },
    spinnerColor: "#FFFFFF",
  });

  try {
    const { message, data }: any = await BaseRequest.post(
      MOBILE_SERVICE.ELECTRICITY_BUY,
      {
        serviceId,
        billersCode,
        phone: user?.phone,
        amount: String(amount),
        variationCode,
        name,
      },
    );
    showSuccess(message);
    setRender("success");
    return data;
  } catch (error: any) {
    const { message } = parseNetworkError(error);
    if (message === "Insufficient wallet balance") onShowInsufficientFunds();
    setShowErrorModal(true);
    showError(message);
    return null;
  } finally {
    setIsLoading(false);
    hideAppLoader();
  }
};

export const onTransactionPinBettingValidation = async ({
  serviceId,
  customerId,
  user,
  betType,
  amount,
  setShowErrorModal,
  setRender,
  setIsLoading,
}: {
  serviceId: string;
  customerId: string;
  user?: any;
  betType?: string;
  amount: string;
  setShowErrorModal?: any;
  setRender: any;
  setIsLoading: any;
  onReloadData?: any;
  variationCode: string;
  name?: string;
  router: any;
}) => {
  setRender("preview");
  setIsLoading(true);
  showAppLoader({
    message: "Processing Transaction",
    style: { backgroundColor: "rgba(1, 61, 37, .60)" },
    textStyle: { color: "#FFFFFF" },
    spinnerColor: "#FFFFFF",
  });

  try {
    const { message, data }: any = await BaseRequest.post(
      MOBILE_SERVICE.BETTING_BUY_SERVICE,
      {
        serviceId,
        customerId,
        betType,
        phone: user?.phone,
        amount: String(amount),
        email: user?.email,
      },
    );
    showSuccess(message);
    setRender("success");
    return data;
  } catch (error: any) {
    const { message } = parseNetworkError(error);
    if (message === "Insufficient wallet balance") onShowInsufficientFunds();
    setShowErrorModal(true);
    showError(message);
    return null;
  } finally {
    setIsLoading(false);
    hideAppLoader();
  }
};

export const onTransactionPinCheckoutValidation = async ({
  tickerSymbol,
  assetClass,
  purchaseMode,
  quantity,
  setShowErrorModal,
  setRender,
  setIsLoading,
  onReloadData,
  router,
}: {
  tickerSymbol: string;
  assetClass: string;
  purchaseMode: string;
  quantity: number;
  setShowErrorModal?: any;
  setRender: any;
  setIsLoading?: any;
  onReloadData?: any;
  router: any;
}) => {
  setIsLoading(true);
  showAppLoader({
    message: "Processing Transaction",
    style: { backgroundColor: "rgba(1, 61, 37, .60)" },
    textStyle: { color: "#FFFFFF" },
    spinnerColor: "#FFFFFF",
  });

  try {
    const { message, data }: any = await BaseRequest.post(STOCKS_SERVICE.BUY, {
      tickerSymbol,
      quantity,
      purchaseMode,
      assetClass,
    });
    showSuccess(message);
    setRender("success");
    return data;
  } catch (error: any) {
    const { message } = parseNetworkError(error);
    if (message === "Insufficient wallet balance") onShowInsufficientFunds();
    setShowErrorModal(true);
    showError(message);
    return null;
  } finally {
    setIsLoading(false);
    hideAppLoader();
  }
};

export const onTransactionSellStockPinCheckout = async ({
  tickerSymbol,
  assetClass,
  quantity,
  setShowErrorModal,
  setRender,
  setIsLoading,
  purchaseMode,
  onReloadData,
  router,
}: {
  tickerSymbol: string;
  assetClass: string;
  quantity: number;
  setShowErrorModal?: any;
  setRender: any;
  setIsLoading?: any;
  onReloadData?: any;
  router: any;
  purchaseMode: string;
}) => {
  setIsLoading(true);
  showAppLoader({
    message: "Processing Transaction",
    style: { backgroundColor: "rgba(1, 61, 37, .60)" },
    textStyle: { color: "#FFFFFF" },
    spinnerColor: "#FFFFFF",
  });

  try {
    const { message, data }: any = await BaseRequest.post(STOCKS_SERVICE.BUY, {
      tickerSymbol,
      quantity,
      assetClass,
      purchaseMode,
    });
    showSuccess(message);
    setRender("success");
    return data;
  } catch (error: any) {
    const { message } = parseNetworkError(error);
    if (message === "Insufficient wallet balance") onShowInsufficientFunds();
    setShowErrorModal(true);
    showError(message);
    return null;
  } finally {
    setIsLoading(false);
    hideAppLoader();
  }
};

export const onTransactionPinValidated = async ({
  transactionType,
  formData,
  selectedDataPlan,
  user,
  PAYMENT_CALLBACK_URL,
  router,
  setRender,
  setIsLoading,
  onReloadData,
}: {
  transactionType: "airtime" | "data";
  formData: any;
  selectedDataPlan?: any;
  user?: any;
  PAYMENT_CALLBACK_URL: any;
  router: any;
  setRender: any;
  setIsLoading: any;
  onReloadData?: any;
}) => {
  setRender("preview");
  setIsLoading(true);
  showAppLoader({
    message: "Processing Transaction",
    style: { backgroundColor: "rgba(1, 61, 37, .60)" },
    textStyle: { color: "#FFFFFF" },
    spinnerColor: "#FFFFFF",
  });

  try {
    const { medium, type, cardId, amount, phone } = formData;
    const isAirtime = transactionType === "airtime";
    const baseServiceURL = isAirtime
      ? "/mobile-connectivity-service/airtime/buy"
      : "/mobile-connectivity-service/mobile-data/buy";

    const payloadBase: any = {
      serviceId: String(type).toLowerCase(),
      amount: String(amount),
      phone: isAirtime ? UseNgnPhone(String(phone)) : formatPhoneNumber(phone),
      email: user?.email,
      callbackUrl: `${PAYMENT_CALLBACK_URL}?type=${transactionType}&amount=${amount}&phone=${phone}`,
      medium,
      cardId,
    };

    if (!isAirtime) {
      Object.assign(payloadBase, {
        variationCode: selectedDataPlan?.variation_code,
        billersCode: phone,
      });
    }

    if (medium === "wallet") {
      const walletResponse: any = await BaseRequest.post(
        baseServiceURL,
        payloadBase,
      );
      showSuccess(walletResponse?.message);
      if (isAirtime && onReloadData) await onReloadData();
      return setRender("success");
    }

    const transactionServiceURL = isAirtime
      ? "/transactions-service/buy-airtime"
      : "/transactions-service/buy-data";

    let URL = transactionServiceURL;

    const reRoute = (data: any) => {
      if (data?.authorization_url) {
        router.push(data.authorization_url); // ✅ expo-router handles external URLs too
      } else {
        setIsLoading(false);
      }
    };

    if (medium === "card" && cardId === "new") {
      const { message, data }: any = await BaseRequest.post(URL, payloadBase);
      showSuccess(message);
      reRoute(data);
      return;
    }

    if (medium === "bank") {
      payloadBase.medium = "bank_transfer";
      const { message, data }: any = await BaseRequest.post(URL, payloadBase);
      showSuccess(message);
      reRoute(data);
      return;
    }

    if (medium === "card" && cardId !== "new") {
      URL = isAirtime
        ? "/transactions-service/saved-card-buy-airtime"
        : "/transactions-service/saved-card-buy-data";
      const { message }: any = await BaseRequest.post(URL, payloadBase);
      showSuccess(message);
      return setRender("success");
    }
  } catch (error) {
    const { message } = parseNetworkError(error);
    if (message === "Insufficient wallet balance") onShowInsufficientFunds();
    showError(message);
  } finally {
    setIsLoading(false);
    hideAppLoader();
  }
};
