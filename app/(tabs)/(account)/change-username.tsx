import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { FormInput } from "@/components/formInput";
import { OTPInput } from "@/components/otp-input";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import BaseRequest, { catchError } from "@/services";
import { AUTH_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";
import { View } from "@idimma/rn-widget";
import { useRouter } from "expo-router";
import { TickCircle } from "iconsax-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangeUsernameScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const C = Colors[scheme === "dark" ? "dark" : "light"];

  const [stage, setStage] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onResend = async () => {
    try {
      const response: any = await BaseRequest.get(AUTH_SERVICE.RESET_USERNAME);
      if (response?.data?.otp) showSuccess("OTP sent");
    } catch (error) {
      catchError(error);
    }
  };

  const onVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      await BaseRequest.post(AUTH_SERVICE.RESET_USERNAME, { otp });
      setStage(2);
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitUsername = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      await BaseRequest.patch(AUTH_SERVICE.RESET_USERNAME, {
        otp,
        username: username.trim(),
      });
      setSuccess(true);
    } catch (error) {
      catchError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        <View style={styles.header} row aligned>
          <Back onPress={() => router.back()} />
          <ThemedText type='subtitle'>Change Username</ThemedText>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {stage === 1 ? (
            <>
              <ThemedText type='defaultSemiBold'>Verify user</ThemedText>
              <ThemedText style={[styles.text, { color: C.muted }]}>
                Enter the 6-digit code sent to your email/phone.
              </ThemedText>
              <View style={{ marginTop: 16 }}>
                <OTPInput onComplete={setOtp} />
              </View>
              <BraneButton
                text='Proceed'
                onPress={onVerifyOtp}
                loading={loading}
                disabled={otp.length < 6}
                style={styles.btn}
              />
              <BraneButton
                text='Resend OTP'
                onPress={onResend}
                backgroundColor={C.inputBg}
                textColor={C.primary}
                style={{ marginTop: 10 }}
              />
            </>
          ) : (
            <>
              <FormInput
                labelText='Username'
                placeholder='Enter new username'
                autoCapitalize='none'
                value={username}
                onChangeText={setUsername}
              />
              <BraneButton
                text='Save Username'
                onPress={onSubmitUsername}
                loading={loading}
                disabled={!username.trim()}
                style={styles.btn}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={success}
        transparent
        animationType='fade'
        onRequestClose={() => setSuccess(false)}
      >
        <Pressable
          style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={() => setSuccess(false)}
        >
          <RNView
            style={
              [
                styles.card,
                {
                  backgroundColor: C.background,
                  borderColor: C.border,
                  borderWidth: 1,
                },
              ] as any
            }
          >
            <RNView style={{ alignItems: "center", marginBottom: 12 }}>
              <TickCircle size={48} color={C.primary} />
            </RNView>
            <ThemedText
              type='defaultSemiBold'
              style={[{ textAlign: "center", color: C.text, fontSize: 18 }]}
            >
              Success!
            </ThemedText>
            <ThemedText
              style={[
                styles.text,
                { color: C.muted, textAlign: "center", marginTop: 8 },
              ]}
            >
              Your username has been changed successfully.
            </ThemedText>
            <BraneButton
              text='Continue'
              onPress={() => router.push("/(tabs)")}
              height={48}
              radius={10}
              style={{ marginTop: 20 }}
            />
          </RNView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  text: { fontSize: 13 },
  btn: { marginTop: 18 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
});
