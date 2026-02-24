import { BraneButton } from "@/components/brane-button";
import { FormInput, mapFormikProps } from "@/components/formInput";
import { PhoneInput } from "@/components/phone-input";
import { PassWrd } from "@/components/svg";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFormHandler } from "@/hooks/use-formik";
import { Image, TouchableOpacity, View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { Eye, EyeSlash } from "iconsax-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme ?? "light"];
  const [showPassword, setShowPassword] = useState(false);

  const { form, isDisabled } = useFormHandler({
    initialValues: { phone: "", password: "" },
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
          "Your password must have at least 8 characters, a digit (0-9), an uppercase letter (A), a special character ($, @, etc.)"
        ),
    }),
    onSubmit: (data) => {
      router.replace('/(tabs)')
      console.log("Logging in...", data);

    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: '6%' }}>
          <View>
            <View style={{ gap: 30 }}>
              <View style={{ alignItems: "center", gap: 8 }}>
                <ThemedText type={"subtitle"}>Welcome back!</ThemedText>
              </View>

              <View style={{ gap: 16 }}>
                <View>
                  <ThemedText
                    style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}
                  >
                    Phone Number
                  </ThemedText>
                  <PhoneInput
                    value={form.values.phone}
                    onPhoneChange={(val) => form.setFieldValue("phone", val)}
                    placeholder="8092738 223776"
                  />
                </View>

                <View gap={8}>
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
                    rightContent={
                      <TouchableOpacity
                        onPress={() => setShowPassword((p) => !p)}
                      >
                        {showPassword ? (
                          <EyeSlash size="20" color={C.muted} />
                        ) : (
                          <Eye size="20" color={C.muted} />
                        )}
                      </TouchableOpacity>
                    }
                    {...mapFormikProps("password", form)}
                       labelText="Password"
                  />
                   <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <ThemedText
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: C.primary,
                    marginBottom: 32,
                  }}
                >
                  I Forgot My Password
                </ThemedText>
              </TouchableOpacity>
                </View>
              </View>

             
            </View>

            <View style={{ gap: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 32,
                }}
              >
                <BraneButton
                  text="Login"
                  onPress={() => form.handleSubmit()}
                  disabled={isDisabled}
                  textColor={C.googleBg}
                  backgroundColor={C.primary}
                  height={52}
                  radius={12}
                  style={{ flex: 1, marginRight: 12 }}
                />
                <TouchableOpacity
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: C.fingerBorder,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0.4,
                  }}
                >
                  <Image
                    source={require("@/assets/images/finger-scan.png")}
                    style={{ width: 32, height: 32 }}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 32,
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
                fontSize={14}
              />

              <View style={{ alignItems: "center", marginTop: 32, }}>
                <ThemedText style={{ fontSize: 12, color: C.muted }}>
                  Are you a new user?{" "}
                  <ThemedText
                    style={{
                      color: C.primary,
                      fontWeight: "400",
                      fontSize: 12,
                    }}
                    onPress={() => router.replace("/signup")}
                  >
                    Create Account
                  </ThemedText>
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <ThemedText style={{ fontSize: 12, color: C.muted }}>
              Version 1.0.6
            </ThemedText>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
