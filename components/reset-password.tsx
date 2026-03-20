import { ThemedText } from "@/components/themed-text";
import { useFormHandler } from "@/hooks/use-formik";
import { View } from "@idimma/rn-widget";
import { Eye, EyeSlash, Lock } from "iconsax-react-native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import * as yup from "yup";
import Back from "./back";
import { BraneButton } from "./brane-button";
import { FormInput, mapFormikProps } from "./formInput";

interface ResetPasswordProps {
  onSubmitPassword: (data: {
    password: string;
    confirmPassword: string;
  }) => void;
  isLoading?: boolean;
  title?: string;
  onBack?: () => void;
}

export default function ResetPassword({
  onSubmitPassword,
  isLoading = false,
  title = "Reset Password",
  onBack,
}: ResetPasswordProps) {
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
          "Your password must have at least 8 characters, a digit (0-9), an uppercase letter (A), and a special character.",
        ),
      confirmPassword: yup
        .string()
        .required("Confirm password field is mandatory")
        .oneOf([yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: (data) => onSubmitPassword(data as any),
  });

  const buttonDisabled = isDisabled || isLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View flex py={"12%"} px={"6%"} spaced>
        <View gap={24}>
          <Back onPress={onBack} />
          <View gap={8}>
            <ThemedText type='subtitle'>{title}</ThemedText>
            <ThemedText>
              Choose a strong password unique to you. You will use it to log in.
            </ThemedText>
          </View>

          <FormInput
            labelText='New Password'
            leftContent={<Lock size='20' color='#89888B' />}
            placeholder='Enter password'
            secureTextEntry={!showPassword}
            rightContent={
              <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                {showPassword ? (
                  <EyeSlash size='20' color='#89888B' />
                ) : (
                  <Eye size='20' color='#89888B' />
                )}
              </TouchableOpacity>
            }
            {...mapFormikProps("password", form)}
          />

          <FormInput
            labelText='Confirm New Password'
            leftContent={<Lock size='20' color='#89888B' />}
            placeholder='Enter password'
            secureTextEntry={!showConfirmPassword}
            rightContent={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((p) => !p)}
              >
                {showConfirmPassword ? (
                  <EyeSlash size='20' color='#89888B' />
                ) : (
                  <Eye size='20' color='#89888B' />
                )}
              </TouchableOpacity>
            }
            {...mapFormikProps("confirmPassword", form)}
          />

          <View mt={8}>
            <ThemedText>
              Your password must have{" "}
              <ThemedText style={{ color: "#013D25", fontWeight: "500" }}>
                at least 8 characters, a digit (0-9), an uppercase letter (A),
                and a special character
              </ThemedText>
              .
            </ThemedText>
          </View>
        </View>

        <View>
          <BraneButton
            disabled={buttonDisabled}
            loading={isLoading}
            text='Proceed'
            textColor='#D2F1E4'
            onPress={() => form.handleSubmit()}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
