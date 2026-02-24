import { BraneButton } from "@/components/brane-button";
import { FormInput, mapFormikProps } from "@/components/formInput";
import { PhoneInput } from "@/components/phone-input";
import { PassWrd } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { VerifyMethodModal } from "@/components/sign-up/verificationModal";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFormHandler } from "@/hooks/use-formik";
import { Image, TouchableOpacity, View } from "@idimma/rn-widget";
import { Eye, EyeSlash } from "iconsax-react-native";
import { useState } from "react";
import * as yup from "yup";
import { router } from "expo-router";

type SignupFormProps = {
  initialValues: {
    phone: string;
    password: string;
    confirmPassword: string;
  };
  onChangeValues: (values: {
    phone: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onSubmit: (data: {
    phone: string;
    password: string;
    confirmPassword: string;
  }) => void;
  openVerifyModal: boolean;
  onCloseVerifyModal: () => void;
  onSelectMethod: (method: "sms" | "whatsapp") => void;
  verifyMethod: "sms" | "whatsapp";
  setVerifyMethod: (method: "sms" | "whatsapp") => void;
};
export function SignupForm({
  onSubmit,
  openVerifyModal,
  onCloseVerifyModal,
  onSelectMethod,
  verifyMethod,
  initialValues,
  onChangeValues,
}: SignupFormProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? "light"];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { form } = useFormHandler({
    initialValues,
    validationSchema: yup.object().shape({
      phone: yup
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .required("Phone number is required"),
      password: yup
        .string()
        .min(8, "Password cannot be less than 8 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.,_-])(?=.{8,})/,
          "Password must have at least: 8 characters, a number, an uppercase letter, and a special character."
        ),
      confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords do not match"),
    }),
    onSubmit: (data) => {
      onSubmit(data);
    },
  });
  const handleFormSubmission = async () => {
    const isValid = await form.validateForm();
    if (!Object.keys(isValid).length) {
      form.handleSubmit();
    } else {
      form.setTouched({
        phone: true,
        password: true,
        confirmPassword: true,
      });
    }
  };

  return (
    <View flex px={'6%'}>
      <View gap={24}>
        <View gap={8} style={{ alignItems: "center" }}>
          <ThemedText type={"subtitle"}>Create your account</ThemedText>
          <ThemedText
            style={{ fontSize: 12, color: C.muted, textAlign: "center" }}
          >
            Welcome to the future of wealth creation
          </ThemedText>
        </View>

        <View>
          <ThemedText style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
            Phone Number
          </ThemedText>
          <PhoneInput
            value={form.values.phone}
            onPhoneChange={(val) => {
              form.setFieldValue("phone", val);
              onChangeValues({ ...form.values, phone: val });
            }}
            placeholder="80298 83647 738"
          />
        </View>

        <View>
          <ThemedText style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
            Password
          </ThemedText>
          <FormInput
            leftContent={
              <PassWrd
                color={
                  form.errors.password && form.touched.password
                    ? C.error
                    : C.muted
                }
                size={20}
              />
            }
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            textContentType="oneTimeCode"
            rightContent={
              <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                {showPassword ? (
                  <EyeSlash size="20" color={C.muted} />
                ) : (
                  <Eye size="20" color={C.muted} />
                )}
              </TouchableOpacity>
            }
            {...mapFormikProps("password", form)}
            onChangeText={(val) => {
              form.handleChange("password")(val);
              onChangeValues({ ...form.values, password: val });
            }}
          />
        </View>

        <View>
          <ThemedText style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
            Confirm Password
          </ThemedText>
          <FormInput
            leftContent={
              <PassWrd
                color={
                  form.errors.confirmPassword && form.touched.confirmPassword
                    ? C.error
                    : C.muted
                }
                size={20}
              />
            }
            placeholder="Enter password"
            secureTextEntry={!showConfirmPassword}
            textContentType="oneTimeCode"
            rightContent={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((p) => !p)}
              >
                {showConfirmPassword ? (
                  <EyeSlash size="20" color={C.muted} />
                ) : (
                  <Eye size="20" color={C.muted} />
                )}
              </TouchableOpacity>
            }
            {...mapFormikProps("confirmPassword", form)}
            onChangeText={(val) => {
              form.handleChange("confirmPassword")(val);
              onChangeValues({ ...form.values, confirmPassword: val });
            }}
          />
        </View>
      </View>

      <View>
        <ThemedText
          style={{
            fontSize: 12,
            color: C.muted,
            lineHeight: 16,
            textAlign: "center",
            marginTop: 32,
            marginBottom: 24,
          }}
        >
          By clicking create account, you agree to our{" "}
          <ThemedText style={{ color: C.primary, fontSize: 12 }}>
            Privacy Policy
          </ThemedText>{" "}
          and{" "}
          <ThemedText style={{ color: C.primary, fontSize: 12 }}>
            Terms and Conditions
          </ThemedText>
          .
        </ThemedText>

        <BraneButton
          text="Create Account"
          onPress={handleFormSubmission}
          disabled={
            !form.values.phone ||
            !form.values.password ||
            !form.values.confirmPassword ||
            !!form.errors.phone ||
            !!form.errors.password ||
            !!form.errors.confirmPassword
          }
          height={52}
          radius={12}
          textColor={C.googleBg}
          backgroundColor={C.primary}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 32,
            marginTop: 32,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          <ThemedText
            style={{
              marginHorizontal: 12,
              fontSize: 12,
              color: C.muted,
              backgroundColor: C.inputBg,
              paddingHorizontal: 6,
              paddingBottom: 2,
              fontWeight: "500",
              borderRadius: 6,
            }}
          >
            or
          </ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
        </View>
        <BraneButton
          text="Continue with Google"
          textColor={C.primary}
          backgroundColor={C.googleBg}
          onPress={() => console.log("Google Login")}
          height={52}
          radius={12}
          leftIcon={
            <Image
              source={require("@/assets/images/Google.png")}
              style={{ width: 18, height: 18 }}
            />
          }
        />
      </View>
      <View style={{ alignItems: "center", marginTop: 32 }}>
        <ThemedText style={{ fontSize: 12, color: C.muted }}>
          Are you a new user?{" "}
          <ThemedText
            style={{
              color: C.primary,
              fontWeight: "400",
              fontSize: 12,
            }}
            onPress={() => router.replace("/login")}
          >
            Login
          </ThemedText>
        </ThemedText>
      </View>

      <VerifyMethodModal
        visible={openVerifyModal}
        onClose={onCloseVerifyModal}
        selectedMethod={verifyMethod}
        onSelect={onSelectMethod}
      />
    </View>
  );
}
