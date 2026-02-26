import OTP from "@/components/forgot-password/otp";
import SetPinScreen from "@/components/sign-up/setUpPin";
import { SignupForm } from "@/components/sign-up/signupForm";
import SetUsernameScreen from "@/components/sign-up/userNameForm";
import { useReduxState } from "@/redux/useReduxState";
import { useState } from "react";
import { KeyboardAvoidingView, Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Page = "signup" | "otp" | "setUsername" | "setPin";
type SignupData = {
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function SignupScreen() {
  const [page, setPage] = useReduxState<Page>("signup", "signupPage");
  const [otp, setOtp] = useReduxState("", "signupOtp");
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
  const handleSubmitSignup = async (data: any, method: "sms" | "whatsapp") => {
    try {
      setIsLoading(true);
      console.log("Signup initiated with:", { ...data, verifyMethod: method });
      setPage("otp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = (otpValue: string) => {
    setOtp(otpValue);
    console.log("OTP Entered:", otpValue);
    setPage("setUsername");
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
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
        />
      )}

      {page === "setUsername" && (
        <SetUsernameScreen
          back={() => setPage("otp")}
          onSubmit={(username) => {
            console.log("Username submitted:", username);
            setPage("setPin");
          }}
        />
      )}

      {page === "setPin" && (
        <SetPinScreen
          back={() => setPage("setUsername")}
          onComplete={() => {
            console.log("PIN created successfully");
          }}
        />
      )}
    </SafeAreaView>
  );
}
