import { BraneButton } from "@/components/brane-button";
import { FormInput, mapFormikProps } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFormHandler } from "@/hooks/use-formik";
import { View } from "@idimma/rn-widget";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
import Back from "../Back";
import { ChangeUsername } from "../svg";

type Props = {
  back: () => void;
  onSubmit: (username: string) => void;
};

export default function SetUsernameScreen({ back, onSubmit }: Props) {
  const scheme = useColorScheme();
  const themeKey: "light" | "dark" = scheme === "dark" ? "dark" : "light";
  const C = Colors[themeKey];

  const { form, isDisabled } = useFormHandler({
    initialValues: { username: "" },
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(15, "Username cannot exceed 15 characters")
        .required("Username is required"),
    }),
    onSubmit: (data) => {
      onSubmit(data.username);
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View flex style={{ paddingHorizontal: "6%" }}>
          <Back onPress={back} />
          <View style={{ marginTop: 24, marginBottom: 24 }}>
            <ThemedText type="subtitle">Create your username</ThemedText>
            <ThemedText style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
              Choose a username that is unique to you.
            </ThemedText>
          </View>
          <FormInput
            leftContent={
              <ThemedText
                style={{ fontSize: 14, color: "#0B0014" }}
                adjustsFontSizeToFit
              >
                @
              </ThemedText>
            }
            rightContent={
              form.values.username.trim().length > 2 &&
              !form.errors.username && (
                <ChangeUsername size={20} color="#008753" />
              )
            }
            placeholder="Enter your username"
            placeholderTextColor={C.muted}
            autoCapitalize="none"
            {...mapFormikProps("username", form)}
            onChangeText={(val) => {
              const formatted = val.replace(/\s/g, "");
              form.setFieldValue("username", formatted);
            }}
          />

          {form.touched.username && form.errors.username ? (
            <ThemedText
              style={{
                color: C.error,
                fontSize: 12,
                marginTop: 8,
              }}
            >
              {form.errors.username}
            </ThemedText>
          ) : null}

          <View
            style={{ flex: 1, justifyContent: "flex-end", marginBottom: 16 }}
          >
            <BraneButton
              text="Set Username"
              onPress={() => form.handleSubmit()}
              disabled={isDisabled}
              height={52}
              radius={12}
              textColor={C.googleBg}
              backgroundColor={C.primary}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
