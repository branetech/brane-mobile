import { ThemedText } from "@/components/themed-text";
import { useFormHandler } from "@/hooks/use-formik";
import { View } from "@idimma/rn-widget";
import { Eye, EyeSlash, Lock } from "iconsax-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import * as yup from "yup";
import Back from "../Back";
import { BraneButton } from "../brane-button";
import { FormInput, mapFormikProps } from "../formInput";

interface RegisterProps {
  onSubmitEmail: (data: any) => void;
  isLoading: boolean;
  back: () => void;
}

export default function ConfirmPassword({
  onSubmitEmail,
  isLoading,
  back,
}: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { form, isDisabled } = useFormHandler({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: yup.object().shape({
      password: yup
        .string()
        .min(8, "Password cannot be less than 8 characters")
        .required("Password field is mandatory")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.,_-])(?=.{8,})/,
          "Your password must have at least 8 characters, a digit (0-9), an uppercase letter (A), a special character ($, @, etc.)",
        ),
      confirmPassword: yup
        .string()
        .required("Confirm password field is mandatory")
        .oneOf([yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: onSubmitEmail,
  });

  const buttonDisabled = isDisabled || isLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View flex py={"12%"} px={"6%"} spaced>
        <View gap={24}>
          <Back onPress={back} />
          <View gap={8}>
            <ThemedText type={"subtitle"}>Create password</ThemedText>
            <ThemedText>
              Choose a password that is unique to you. You will be able to login
              with this password
            </ThemedText>
          </View>
          <View>
            <FormInput
              labelText={"Password"}
              leftContent={<Lock size="20" color="#89888B" />}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              rightContent={
                <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                  {showPassword ? (
                    <EyeSlash size="20" color="#89888B" />
                  ) : (
                    <Eye size="20" color="#89888B" />
                  )}
                </TouchableOpacity>
              }
              {...mapFormikProps("password", form)}
            />
          </View>
          <View>
            <FormInput
              labelText={"Confirm Password"}
              leftContent={<Lock size="20" color="#89888B" />}
              placeholder="Enter password"
              secureTextEntry={!showConfirmPassword}
              rightContent={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((p) => !p)}
                >
                  {showConfirmPassword ? (
                    <EyeSlash size="20" color="#89888B" />
                  ) : (
                    <Eye size="20" color="#89888B" />
                  )}
                </TouchableOpacity>
              }
              {...mapFormikProps("confirmPassword", form)}
            />
          </View>
          <View mt={8}>
            <ThemedText>
              Your password must have{" "}
              <ThemedText style={{ color: "#013D25", fontWeight: "500" }}>
                at least 8 characters, a digit (0-9), an uppercase letter (A), a
                special character ($, @, etc.)
              </ThemedText>
              <ThemedText style={{ fontWeight: "500", color: "#342A3B" }}>
                {" "}
                and match.
              </ThemedText>
            </ThemedText>
          </View>
        </View>
        <View>
          <BraneButton
            disabled={buttonDisabled}
            loading={isLoading}
            text={"Reset Password"}
            textColor="#D2F1E4"
            onPress={() => form.handleSubmit()}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
