import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setUser } from "@/redux/slice/auth-slice";
import { useAppState } from "@/redux/store";
import BaseRequest, { catchError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { EMPLOYMENT_STATUS } from "@/utils/constants";
import { showSuccess, toPascalCase } from "@/utils/helpers";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  occupation: yup.string().required("Occupation is required"),
  houseAddress: yup.string().required("House address is required"),
});

export default function KycVerificationScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAppState();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<any>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    houseAddress: user?.houseAddress || "",
    occupation: user?.occupation || "",
    university: "",
    referral: "",
  });

  const canSubmit = useMemo(() => {
    return (
      !!form.firstName &&
      !!form.lastName &&
      !!form.occupation &&
      !!form.houseAddress
    );
  }, [form]);

  const onSubmit = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});
    } catch (error: any) {
      const next: Record<string, string> = {};
      if (Array.isArray(error?.inner)) {
        error.inner.forEach((item: any) => {
          if (item?.path && !next[item.path]) next[item.path] = item.message;
        });
      }
      setErrors(next);
      return;
    }

    setLoading(true);
    try {
      await BaseRequest.post(AUTH_SERVICE.PROFILE, form);
      dispatch(setUser({ ...user, ...form }));
      showSuccess("Profile updated successfully");
      router.replace("/kyc");
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="subtitle">Personal information</ThemedText>
        <ThemedText style={[styles.help, { color: C.muted }]}>
          We need your details to verify your identity.
        </ThemedText>

        <View style={{ marginTop: 16, gap: 10 }}>
          <FormInput
            labelText="Legal First Name"
            placeholder="Enter your first name"
            value={form.firstName}
            onChangeText={(value) =>
              setForm((prev: any) => ({ ...prev, firstName: value }))
            }
            error={errors.firstName}
          />
          <FormInput
            labelText="Legal Last Name"
            placeholder="Enter your last name"
            value={form.lastName}
            onChangeText={(value) =>
              setForm((prev: any) => ({ ...prev, lastName: value }))
            }
            error={errors.lastName}
          />
          <FormInput
            labelText="House Address"
            placeholder="Enter your house address"
            value={form.houseAddress}
            onChangeText={(value) =>
              setForm((prev: any) => ({ ...prev, houseAddress: value }))
            }
            error={errors.houseAddress}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <ThemedText style={styles.inputLabel}>
            What is your current occupation status?
          </ThemedText>
          {Object.keys(EMPLOYMENT_STATUS).map((key) => {
            const value = (EMPLOYMENT_STATUS as any)[key];
            const selected = value === form.occupation;
            return (
              <Pressable
                key={key}
                style={styles.optionRow}
                onPress={() =>
                  setForm((prev: any) => ({ ...prev, occupation: value }))
                }
              >
                <View style={[styles.radio, selected && styles.radioActive]} />
                <ThemedText>{toPascalCase(key.replace(/_/g, " "))}</ThemedText>
              </Pressable>
            );
          })}
          {!!errors.occupation && (
            <ThemedText style={styles.error}>{errors.occupation}</ThemedText>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BraneButton
          text="Proceed"
          onPress={onSubmit}
          loading={loading}
          disabled={!canSubmit || loading}
          height={50}
          radius={10}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  help: {
    marginTop: 4,
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#AABEB6",
  },
  radioActive: {
    backgroundColor: "#013D25",
    borderColor: "#013D25",
  },
  error: {
    color: "#CB010B",
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
});
