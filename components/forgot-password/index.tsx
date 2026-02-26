import { ThemedText } from "@/components/themed-text";
import { useFormHandler } from "@/hooks/use-formik";
import { View } from "@idimma/rn-widget";
import { Sms } from "iconsax-react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import * as yup from "yup";
import Back from "../back";
import { BraneButton } from "../brane-button";
import { FormInput, mapFormikProps } from "../formInput";

interface registerProps {
  onSubmitEmail: (data: any) => void;
  isLoading: boolean;
}

export default function ForgotPassword({ onSubmitEmail, isLoading }: registerProps) {
    const { form, isDisabled } = useFormHandler({
        initialValues: { email: "" },
        validationSchema: yup.object().shape({
          email: yup
          .string()
          .required("This field is required")
          .test(
            "email",
            "Please enter a valid email or phone number",
            (value) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const isEmail = emailRegex.test(value);
              const isNumber = /^(\+\d{1,3})?\d{6,}$/.test(value);
              return isEmail || isNumber;
            }
          ),
        }),
        onSubmit: onSubmitEmail,
      });
  const buttonDisabled = isDisabled || isLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View flex spaced px={'6%'} py={'12%'}>
        <View gap={24}>
          <Back />
          <View gap={8}>
            <ThemedText type={"subtitle"}>Password reset</ThemedText>
            <ThemedText>
              Input the email address associated with your account and we&apos;ll
              send you a link to reset your password.
            </ThemedText>
          </View>
          <View>
            <FormInput
              labelText={"Email address"}
              leftContent={<Sms size="20" color="#89888B" />}
              placeholder="Enter email address"
              {...mapFormikProps("email", form)}
            />
          </View>
        </View>
        <View>
          <BraneButton
            disabled={buttonDisabled}                              
            loading={isLoading}
            text={"Send Reset Code"}
            textColor="#D2F1E4"
            onPress={() => { form.handleSubmit(); }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}