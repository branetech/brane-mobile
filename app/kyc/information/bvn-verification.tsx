import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput, mapFormikProps } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFormHandler } from "@/hooks/use-formik";
import BaseRequest, { parseNetworkError } from "@/services";
import { showError, showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

export default function BvnVerificationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const [isLoading, setIsLoading] = useState(false);

  const { form, isDisabled } = useFormHandler({
    initialValues: {
      bvn: "",
    },
    validationSchema: yup.object().shape({
      bvn: yup
        .string()
        .matches(/^\d{11}$/, "BVN must be exactly 11 digits")
        .required("BVN is required"),
    }),
    onSubmit: async (data) => {
      setIsLoading(true);
      try {
        const response: any = await BaseRequest.post("/auth-service/kyc/bvn", {
          bvn: data.bvn,
        });

        if (response?.data?.verified || response?.verified) {
          showSuccess("BVN verified successfully");
          router.push("/kyc");
        } else {
          showError("BVN verification failed. Please try again.");
        }
      } catch (error: any) {
        const { message } = parseNetworkError(error);
        showError(message || "Failed to verify BVN");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
        <ThemedText type='subtitle' style={[styles.title, { color: C.text }]}>
          BVN Verification
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type='subtitle' style={[{ color: C.text }]}>
          Add Your BVN
        </ThemedText>
        <ThemedText
          style={[styles.subText, { color: C.muted, marginBottom: 20 }]}
        >
          Your BVN is a unique 11-digit number issued by the Central Bank of
          Nigeria
        </ThemedText>

        <FormInput
          labelText='BVN'
          placeholder='Enter your 11-digit BVN'
          keyboardType='number-pad'
          maxLength={11}
          {...mapFormikProps("bvn", form)}
        />

        <ThemedText
          style={[styles.helperText, { color: C.muted, marginTop: 12 }]}
        >
          Your BVN is required for identity verification and KYC compliance.
        </ThemedText>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: C.border }]}>
        <BraneButton
          text={isLoading ? "Verifying..." : "Verify BVN"}
          onPress={() => form.handleSubmit()}
          disabled={isDisabled || isLoading}
          loading={isLoading}
          backgroundColor={C.primary}
          textColor='#FFFFFF'
          height={50}
          radius={10}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  subText: {
    fontSize: 13,
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
