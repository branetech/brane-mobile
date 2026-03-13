import Back from "@/components/Back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { ArrowDown2, TickCircle } from "iconsax-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

type RelationshipOption = {
  value: string;
  label: string;
};

type KinForm = {
  id?: string;
  firstName: string;
  lastName: string;
  relationship: string;
  email: string;
  phone: string;
};

type KinErrors = Partial<Record<keyof KinForm, string>>;

const relationshipOptions: RelationshipOption[] = [
  { value: "BROTHER", label: "Brother" },
  { value: "SISTER", label: "Sister" },
  { value: "MOTHER", label: "Mother" },
  { value: "FATHER", label: "Father" },
  { value: "HUSBAND", label: "Husband" },
  { value: "WIFE", label: "Wife" },
  { value: "CHILD", label: "Child" },
  { value: "FRIEND", label: "Friend" },
  { value: "GUARDIAN", label: "Guardian" },
  { value: "SON", label: "Son" },
  { value: "DAUGHTER", label: "Daughter" },
  { value: "COUSIN", label: "Cousin" },
  { value: "SECOND COUSIN", label: "Second Cousin" },
  { value: "NIECE", label: "Niece" },
  { value: "NEPHEW", label: "Nephew" },
  { value: "UNCLE", label: "Uncle" },
  { value: "AUNTY", label: "Aunty" },
];

const schema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(3, "First Name must be at least 3 characters")
    .required("First Name is required"),
  lastName: yup
    .string()
    .trim()
    .min(3, "Last Name must be at least 3 characters")
    .required("Last Name is required"),
  relationship: yup.string().trim().required("Select a relationship"),
  email: yup
    .string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup.string().trim().required("Phone is required"),
});

const initialForm: KinForm = {
  id: "",
  firstName: "",
  lastName: "",
  relationship: "",
  email: "",
  phone: "",
};

const normalizeKin = (payload: any): KinForm => {
  const source = payload?.data?.data || payload?.data || payload || {};
  return {
    id: String(source?.id || ""),
    firstName: String(source?.firstName || ""),
    lastName: String(source?.lastName || ""),
    relationship: String(source?.relationship || ""),
    email: String(source?.email || ""),
    phone: String(source?.phone || ""),
  };
};

const normalizePhone = (value: string) => {
  const cleaned = String(value || "").replace(/\s+/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned.replace(/^\+/, "")}`;
};

export default function UpdateKinDetailsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [form, setForm] = useState<KinForm>(initialForm);
  const [errors, setErrors] = useState<KinErrors>({});

  const selectedRelationshipLabel = useMemo(() => {
    return (
      relationshipOptions.find((item) => item.value === form.relationship)
        ?.label || "Select your relationship"
    );
  }, [form.relationship]);

  const fetchNextOfKin = useCallback(async () => {
    setFetching(true);
    try {
      const response: any = await BaseRequest.get(AUTH_SERVICE.NEXT_OF_KIN);
      setForm(normalizeKin(response));
    } catch {
      setForm(initialForm);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchNextOfKin();
  }, [fetchNextOfKin]);

  const updateField = (key: keyof KinForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateForm = async () => {
    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const nextErrors: KinErrors = {};
      if (Array.isArray(error?.inner)) {
        error.inner.forEach((item: any) => {
          if (item?.path && !nextErrors[item.path as keyof KinForm]) {
            nextErrors[item.path as keyof KinForm] = item.message;
          }
        });
      }
      setErrors(nextErrors);
      return false;
    }
  };

  const onSubmit = async () => {
    const valid = await validateForm();
    if (!valid) return;

    setLoading(true);
    try {
      await BaseRequest.post(AUTH_SERVICE.NEXT_OF_KIN, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        relationship: form.relationship,
        email: form.email.trim(),
        phone: normalizePhone(form.phone),
      });
      setShowSuccess(true);
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header} row aligned>
        <Back onPress={() => router.push("/(tabs)/(account)")} />
        <ThemedText type="subtitle" style={styles.title}>
          Next of Kin
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      {fetching ? (
        <View style={styles.loaderWrap}>
          <ThemedText style={{ color: C.muted }}>Loading...</ThemedText>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <ThemedText style={[styles.helperText, { color: C.muted }]}>
              Your next of kin (NOK) is your closest living relative. We&apos;ll
              contact them if we can&apos;t reach you for an extended period.
            </ThemedText>

            <View gap={12} style={{ marginTop: 18 }}>
              <FormInput
                labelText="Next Of Kin First Name"
                placeholder="Enter first name"
                value={form.firstName}
                onChangeText={(value) => updateField("firstName", value)}
                error={errors.firstName}
              />

              <FormInput
                labelText="Next Of Kin Last Name"
                placeholder="Enter last name"
                value={form.lastName}
                onChangeText={(value) => updateField("lastName", value)}
                error={errors.lastName}
              />

              <View>
                <ThemedText style={styles.inputLabel}>
                  What is your relationship
                </ThemedText>
                <Pressable
                  style={styles.selectField}
                  onPress={() => setShowRelationshipModal(true)}
                >
                  <ThemedText
                    style={
                      form.relationship
                        ? styles.selectText
                        : styles.selectPlaceholder
                    }
                  >
                    {selectedRelationshipLabel}
                  </ThemedText>
                  <ArrowDown2 size={16} color="#85808A" />
                </Pressable>
                {!!errors.relationship && (
                  <ThemedText style={styles.errorText}>
                    {errors.relationship}
                  </ThemedText>
                )}
              </View>

              <FormInput
                labelText="Next Of Kin Email Address"
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(value) => updateField("email", value)}
                error={errors.email}
              />

              <View>
                <ThemedText style={styles.inputLabel}>
                  Next of Kin Phone number
                </ThemedText>
                <TextInput
                  style={styles.phoneField}
                  placeholder="+234 70000 0000"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(value) => updateField("phone", value)}
                />
                {!!errors.phone && (
                  <ThemedText style={styles.errorText}>
                    {errors.phone}
                  </ThemedText>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <BraneButton
              text={form.id ? "Update Next of Kin" : "Submit"}
              onPress={onSubmit}
              loading={loading}
              disabled={loading}
              height={50}
              radius={10}
            />
          </View>
        </>
      )}

      <Modal
        visible={showRelationshipModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRelationshipModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowRelationshipModal(false)}
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              Select relationship
            </ThemedText>
            <ScrollView style={{ maxHeight: 280 }}>
              {relationshipOptions.map((item) => {
                const selected = item.value === form.relationship;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.optionRow}
                    onPress={() => {
                      updateField("relationship", item.value);
                      setShowRelationshipModal(false);
                    }}
                  >
                    <ThemedText style={styles.optionText}>
                      {item.label}
                    </ThemedText>
                    {selected && <TickCircle size={18} color="#013D25" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.successBackdrop}>
          <View style={styles.successCard}>
            <ThemedText type="subtitle" style={{ textAlign: "center" }}>
              Successful
            </ThemedText>
            <ThemedText style={[styles.successText, { color: C.muted }]}>
              Next of Kin details updated successfully.
            </ThemedText>
            <BraneButton
              text="Proceed"
              onPress={() => {
                setShowSuccess(false);
                router.push("/(tabs)");
              }}
              height={48}
              radius={10}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectField: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F7F7F8",
    backgroundColor: "#F7F7F8",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 14,
    color: "#0B0014",
  },
  selectPlaceholder: {
    fontSize: 14,
    color: "#999",
  },
  phoneField: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F7F7F8",
    backgroundColor: "#F7F7F8",
    paddingHorizontal: 12,
    color: "#0B0014",
    fontSize: 14,
  },
  errorText: {
    color: "#CB010B",
    fontSize: 11,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
  },
  modalTitle: {
    marginBottom: 10,
  },
  optionRow: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F8",
  },
  optionText: {
    fontSize: 14,
  },
  successBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
  },
  successText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
  },
});
