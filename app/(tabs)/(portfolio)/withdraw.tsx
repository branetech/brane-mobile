import { SafeAreaView } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import EnterAmount from "@/components/portfolio/enter-amount";
import { Colors } from "@/constants/colors";
import { palette } from "@/constants";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemedText } from "@/components/themed-text";
import { BraneButton } from "@/components/brane-button";
import BaseRequest, { catchError } from "@/services";
import { priceFormatter } from "@/utils/helpers";

type Stage = "form" | "success";

export default function WithdrawScreen() {
  const router = useRouter();
  const rawScheme = useColorScheme();
  const scheme: "light" | "dark" = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];

  const [stage, setStage] = useState<Stage>("form");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onAmountEntered = useCallback(async (value: number) => {
    const nextAmount = Number(value || 0);

    setAmount(String(nextAmount));
    setIsLoading(true);

    try {
      await BaseRequest.post("/stocks-service/wallet/withdraw", {
        amount: nextAmount,
      });

      setStage("success");
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDone = useCallback(() => {
    setAmount("");
    setStage("form");
    router.back();
  }, [router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <EnterAmount onSubmit={onAmountEntered} isLoading={isLoading} />
      </KeyboardAvoidingView>

      <Modal
        visible={stage === "success"}
        transparent
        animationType='slide'
        onRequestClose={handleDone}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(1, 61, 37, 0.3)",
          }}
          activeOpacity={1}
          onPress={handleDone}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              backgroundColor: C.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingTop: 28,
              paddingBottom: 32,
              alignItems: "center",
            }}
          >
            <ThemedText
              type='title'
              style={{ marginBottom: 12, color: C.text }}
            >
              Withdrawal Successful
            </ThemedText>
            <ThemedText
              style={{ color: C.muted, textAlign: "center", marginBottom: 24 }}
            >
              Your withdrawal request for {priceFormatter(parseFloat(amount))}{" "}
              was successful.
            </ThemedText>
            <BraneButton
              text='Done'
              onPress={handleDone}
              backgroundColor={C.primary}
              textColor={palette.brandMint}
              height={52}
              radius={12}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
