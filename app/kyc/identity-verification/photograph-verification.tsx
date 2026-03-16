import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import UploadMethodItem from "@/components/kyc/upload-method-item";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppState } from "@/redux/store";
import BaseRequest, { catchError } from "@/services";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { ProfileCircle } from "iconsax-react-native";
import React, { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PhotographVerificationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user } = useAppState();

  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [fileUri, setFileUri] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  const onVerify = async () => {
    if (!fileUri) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: fileUri,
        name: `passport-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      await BaseRequest.post(
        "/auth-service/kyc/verify-identity/passport-photo",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setSuccess(true);
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

      <View style={styles.content}>
        <ThemedText type='subtitle'>Passport Verification</ThemedText>
        <ThemedText style={[styles.help, { color: C.muted }]}>
          We need your passport photograph to verify your identity for accuracy
          and authenticity purposes.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>
          Select Verification Method
        </ThemedText>

        <UploadMethodItem
          title='Upload Passport'
          icon={<ProfileCircle size={20} color='#013D25' />}
          selected={selectedOption === "uploadPassport"}
          onSelect={() => setSelectedOption("uploadPassport")}
          onFileChange={setFileUri}
          status={user?.photoStatus || ""}
        />
      </View>

      <View style={styles.footer}>
        <BraneButton
          text='Proceed to Verify'
          onPress={onVerify}
          loading={loading}
          disabled={!fileUri}
          height={50}
          radius={10}
        />
      </View>

      <Modal
        visible={success}
        transparent
        animationType='fade'
        onRequestClose={() => setSuccess(false)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <ThemedText type='subtitle' style={{ textAlign: "center" }}>
              Successful
            </ThemedText>
            <ThemedText style={[styles.successText, { color: C.muted }]}>
              Your passport has been submitted for verification.
            </ThemedText>
            <BraneButton
              text='Proceed'
              onPress={() => {
                setSuccess(false);
                router.push("/kyc/identity-verification");
              }}
              height={48}
              radius={10}
              style={{ marginTop: 14 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  content: { paddingHorizontal: 16, marginTop: 10 },
  help: { marginTop: 6, fontSize: 12 },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    color: "#0B0014",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: { marginTop: "auto", paddingHorizontal: 16, paddingBottom: 16 },
  successOverlay: {
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
    textAlign: "center",
    fontSize: 12,
  },
});
