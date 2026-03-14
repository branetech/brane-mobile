import OTP from "@/components/forgot-password/otp";
import SetPinScreen from "@/components/sign-up/setUpPin";
import { SignupForm } from "@/components/sign-up/signupForm";
import SetUsernameScreen from "@/components/sign-up/userNameForm";
import { setRefreshToken, setToken, setUser } from "@/redux/slice/auth-slice";
import { useReduxState } from "@/redux/useReduxState";
import BaseRequest, { parseNetworkError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { formatPhoneNumber, showError, showSuccess } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

type Page = "signup" | "otp" | "setUsername" | "setPin";
type SignupData = {
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function SignupScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useReduxState<Page>("signup", "signupPage");
  const [otp, setOtp] = useReduxState("", "signupOtp");
  const [, setPlainOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState<"sms" | "whatsapp">("sms");
  const [tempSignupData, setTempSignupData] = useState<any>(null);
  const [signupData, setSignupData] = useState<SignupData>({
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const resetSignupSession = () => {
    setOtp("");
    setPlainOtp("");
  };

  const handleSubmitSignup = async (data: any, method: "sms" | "whatsapp") => {
    try {
      setIsLoading(true);
      const payload = {
        phone: formatPhoneNumber(data.phone),
        password: data.password,
        medium: method,
      };

      const response: any = await BaseRequest.post(
        AUTH_SERVICE.SIGN_UP,
        payload,
      );
      const serverOtp = response?.data?.otp || response?.otp || "";

      setPlainOtp(String(serverOtp));
      setSignupData(data);
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
    setOtp(otpValue);

    try {
      setIsLoading(true);
      const response: any = await BaseRequest.post(AUTH_SERVICE.VERIFY_OTP, {
        phone: formatPhoneNumber(signupData.phone),
        otp: otpValue,
      });

      const authCredentials =
        response?.data?.authCredentials || response?.authCredentials;
      const user = response?.data
        ? { ...response.data, authCredentials: undefined }
        : response;

      if (!authCredentials?.accessToken) {
        showError("Unable to verify OTP. Please try again.");
        return;
      }

      dispatch(setToken(authCredentials.accessToken));
      dispatch(setRefreshToken(authCredentials.refreshToken || null));
      dispatch(setUser(user));
      setPage("setUsername");
      showSuccess("Phone number verified");
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
      const payload = {
        phone: formatPhoneNumber(signupData.phone),
        password: signupData.password,
      };
      const response: any = await BaseRequest.post(
        AUTH_SERVICE.RESEND_OTP,
        payload,
      );
      const serverOtp = response?.data?.otp || response?.otp || "";
      setPlainOtp(String(serverOtp));
      showSuccess("New OTP sent successfully");
    } catch (error: any) {
      const { message } = parseNetworkError(error);
      showError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {page === "signup" && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SignupForm
            initialValues={signupData}
            onChangeValues={setSignupData}
            onSubmit={(data) => {
              setTempSignupData(data);
              setShowVerifyModal(true);
            }}
            openVerifyModal={showVerifyModal}
            onCloseVerifyModal={() => setShowVerifyModal(false)}
            onSelectMethod={(method) => {
              setVerifyMethod(method);
              setShowVerifyModal(false);
              if (tempSignupData) {
                handleSubmitSignup(tempSignupData, method);
              } else {
                console.warn("No signup data available.");
              }
            }}
            verifyMethod={verifyMethod}
            setVerifyMethod={setVerifyMethod}
          />
        </KeyboardAvoidingView>
      )}

      {page === "otp" && (
        <OTP
          otp={otp}
          handleOtpChange={setOtp}
          onSubmitEmail={handleOTPComplete}
          back={() => setPage("signup")}
          isResending={isResending}
          requestOtp={handleResendOtp}
          isLoading={isLoading}
          isDisabled={false}
          email={formatPhoneNumber(signupData.phone)}
        />
      )}

      {page === "setUsername" && (
        <SetUsernameScreen
          back={() => setPage("otp")}
          onSubmit={async (username) => {
            try {
              setIsLoading(true);
              await BaseRequest.post(AUTH_SERVICE.USER_NAME, { username });
              setPage("setPin");
              showSuccess("Username created successfully");
            } catch (error: any) {
              const { message } = parseNetworkError(error);
              showError(message);
            } finally {
              setIsLoading(false);
            }
          }}
          isLoading={isLoading}
        />
      )}

      {page === "setPin" && (
        <SetPinScreen
          back={() => setPage("setUsername")}
          onComplete={async (pin) => {
            try {
              setIsLoading(true);
              await BaseRequest.post(AUTH_SERVICE.RESET_TRANSACTION_PIN, {
                transactionPin: pin,
              });
              showSuccess("Transaction pin created successfully");
              resetSignupSession();
              setPage("signup");
              router.replace("/(tabs)");
            } catch (error: any) {
              const { message } = parseNetworkError(error);
              showError(message);
            } finally {
              setIsLoading(false);
            }
          }}
          isLoading={isLoading}
        />
      )}
    </SafeAreaView>
  );
}
