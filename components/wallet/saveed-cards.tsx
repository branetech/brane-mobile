import Back from "@/components/back";
import { BraneButton } from "@/components/brane-button";
import { BraneRadioButton } from "@/components/brane-radio-button";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { setAmount } from "@/redux/slice/fundCardSlice";
import { useAppState } from "@/redux/store";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { priceFormatter, showSuccess } from "@/utils/helpers";
import { useRouter } from "expo-router";
import { Card, TickCircle } from "iconsax-react-native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { mutate } from "swr";

type SelectSavedCardProps = {
  onClick?: () => void;
  onDone?: (medium: string) => void;
  onSelect?: (value: string) => void;
  isLoading?: boolean;
  email?: string;
  proceedText?: string;
};

type Stage = "select" | "success" | "error";

const SelectSavedCard = ({
  onClick,
  onDone,
  onSelect,
  isLoading: isProcessing,
  email,
  proceedText,
}: SelectSavedCardProps) => {
  const rawScheme = useColorScheme();
  const scheme = rawScheme === "dark" ? "dark" : "light";
  const C = Colors[scheme];
  const router = useRouter();
  const dispatch = useDispatch();
  const { amount } = useAppState("fundCardSlice");

  const { data: fetchedCards, isValidating }: any = useRequest(
    TRANSACTION_SERVICE.CARDS,
    { initialValue: [] },
  );

  const [selectedValue, setSelectedValue] = useState("");
  const [stage, setStage] = useState<Stage>("select");
  const [isLoading, setIsLoading] = useState(false);

  const cards = useMemo(() => {
    if (Array.isArray(fetchedCards)) return fetchedCards;
    if (Array.isArray(fetchedCards?.data)) return fetchedCards.data;
    return [];
  }, [fetchedCards]);

  const onGotoWallet = async () => {
    dispatch(setAmount(0));
    await mutate((key: any) => key);
    router.replace("/wallet" as any);
  };

  const onSubmit = async () => {
    if (onSelect) {
      onSelect(selectedValue);
      return;
    }
    if (selectedValue === "new") {
      onDone?.("card");
      return;
    }

    setIsLoading(true);
    try {
      const { message }: any = await BaseRequest.post(
        "/transactions-service/wallet/fund/card",
        { amount: Number(amount), cardId: selectedValue, email },
      );

      if (String(message).toLowerCase().includes("approv")) {
        setStage("success");
      } else {
        showSuccess(message);
        setStage("error");
      }
    } catch (error) {
      catchError(error);
      setStage("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (stage === "success") {
    return (
      <SafeAreaView
        style={[styles.stateScreen, { backgroundColor: C.background }]}
      >
        <View
          style={[
            styles.stateCard,
            { backgroundColor: C.inputBg, borderColor: C.border },
          ]}
        >
          <TickCircle size={64} color={C.primary} variant='Bold' />
          <ThemedText
            type='subtitle'
            style={[styles.stateTitle, { color: C.text }]}
          >
            Your wallet has been funded.
          </ThemedText>
          <ThemedText style={[styles.stateText, { color: C.muted }]}>
            You successfully funded your wallet with {priceFormatter(amount, 2)}
            .
          </ThemedText>
          <BraneButton
            text='Dismiss'
            onPress={onGotoWallet}
            backgroundColor={C.primary}
            textColor='#D2F1E4'
            height={50}
            radius={10}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (stage === "error") {
    return (
      <SafeAreaView
        style={[styles.stateScreen, { backgroundColor: C.background }]}
      >
        <View
          style={[
            styles.stateCard,
            { backgroundColor: C.inputBg, borderColor: C.border },
          ]}
        >
          <ThemedText
            type='subtitle'
            style={[styles.stateTitle, { color: C.text }]}
          >
            Something went wrong.
          </ThemedText>
          <ThemedText style={[styles.stateText, { color: C.muted }]}>
            The transaction was not completed.
          </ThemedText>
          <BraneButton
            text='Dismiss'
            onPress={onGotoWallet}
            backgroundColor={C.primary}
            textColor='#D2F1E4'
            height={50}
            radius={10}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <Back onPress={onClick ?? (() => router.back())} />
        <ThemedText type='subtitle'>Choose Card</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <ThemedText style={[styles.title, { color: C.text }]}>
            Choose card account
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: C.muted }]}>
            Select or add a card to complete your transaction.
          </ThemedText>
        </View>

        {isValidating ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size='small' color={C.primary} />
          </View>
        ) : null}

        {!cards.length && !isValidating ? (
          <ThemedText style={[styles.emptyText, { color: C.muted }]}>
            No cards added yet. Add your card for easier transactions.
          </ThemedText>
        ) : null}

        <View style={styles.optionsWrap}>
          {cards.map((item: any) => {
            const value = String(item?.id ?? "");
            const selected = selectedValue === value;
            return (
              <BraneRadioButton
                key={value}
                selected={selected}
                onPress={() => setSelectedValue(value)}
                color={C.primary}
                bg={C.inputBg}
                showRadio
              >
                <View style={styles.optionLeft}>
                  <View
                    style={[styles.iconWrap, { backgroundColor: C.background }]}
                  >
                    <Card size={18} color={C.primary} variant='Broken' />
                  </View>
                  <ThemedText style={[styles.optionText, { color: C.text }]}>
                    {`${item?.brand ?? "Card"} •••• ${item?.last4 ?? ""}`}
                  </ThemedText>
                </View>
              </BraneRadioButton>
            );
          })}

          <BraneRadioButton
            selected={selectedValue === "new"}
            onPress={() => setSelectedValue("new")}
            color={C.primary}
            bg={C.inputBg}
            showRadio
          >
            <View style={styles.optionLeft}>
              <View
                style={[styles.iconWrap, { backgroundColor: C.background }]}
              >
                <Card size={18} color={C.primary} variant='Broken' />
              </View>
              <ThemedText style={[styles.optionText, { color: C.text }]}>
                Continue with new card
              </ThemedText>
            </View>
          </BraneRadioButton>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <BraneButton
          text={proceedText || `Fund ${priceFormatter(amount, 2)}`}
          backgroundColor={C.primary}
          textColor='#D2F1E4'
          height={50}
          radius={10}
          disabled={!selectedValue || isValidating || isLoading || isProcessing}
          loading={isLoading || !!isProcessing}
          onPress={onSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { fontSize: 13, marginTop: 4 },
  centerLoader: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    paddingVertical: 14,
  },
  optionsWrap: { gap: 12 },
  optionLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: { fontSize: 14, fontWeight: "500" },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  stateScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  stateCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    alignItems: "center",
    gap: 14,
  },
  stateTitle: { textAlign: "center" },
  stateText: { textAlign: "center", fontSize: 13, lineHeight: 20 },
});

export default SelectSavedCard;
