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
import { DocumentText1 } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddressVerificationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];
  const { user } = useAppState();
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [fileUri, setFileUri] = useState<string | undefined>();

  const onVerify = async () => {
    if (!fileUri) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: fileUri,
        name: `utility-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      await BaseRequest.post(
        "/auth-service/kyc/verify-identity/location/utility-bill",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      router.replace("/kyc/identity-verification");
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
        <ThemedText type='subtitle'>Address Verification</ThemedText>
        <ThemedText style={[styles.help, { color: C.muted }]}>
          We need to verify your location for accuracy and authenticity
          purposes.
        </ThemedText>

        <ThemedText style={[styles.sectionTitle, { color: C.text }]}>
          Select Verification Method
        </ThemedText>

        <UploadMethodItem
          title='Utility Bill'
          icon={<DocumentText1 size={20} color={C.primary} />}
          selected={selectedOption === "utility"}
          onSelect={() => setSelectedOption("utility")}
          onFileChange={setFileUri}
          status={user?.locationStatus || ""}
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
    fontSize: 14,
    fontWeight: "500",
  },
  footer: { marginTop: "auto", paddingHorizontal: 16, paddingBottom: 16 },
});
