import EnterAmount from "@/components/wallet/enter-amount";
import SelectSavedCard from "@/components/wallet/saveed-cards";
import { useAppState } from "@/redux/store";
import BaseRequest, { catchError } from "@/services";
import { PAYMENT_CALLBACK_URL } from "@/services/routes";
import { useRouter } from "expo-router";
import React, { useState } from "react";

const BankWallet = () => {
  const router = useRouter();
  const [stage, setStage] = useState<"amount" | "choose-card">("amount");
  const [isLoading, setIsLoading] = useState(false);
  const { amount } = useAppState("fundCardSlice");
  const { user } = useAppState();

  const onAmountEntered = () => setStage("choose-card");

  const onLoadPaystack = async (medium: string) => {
    if (medium === "choose-card") {
      setStage("choose-card");
      return;
    }

    setIsLoading(true);
    const callbackUrl = `${PAYMENT_CALLBACK_URL}?type=wallet&amount=${amount}`;

    try {
      const res: any = await BaseRequest.post(
        "/transactions-service/wallet/fund",
        {
          amount: Number(amount),
          email: user?.email ?? undefined,
          medium,
          callbackUrl,
        },
      );

      const authUrl = res?.data?.authorization_url ?? res?.authorization_url;
      if (authUrl) {
        router.push(authUrl as any);
      }
    } catch (error) {
      catchError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {stage === "amount" && (
        <EnterAmount onSubmit={onAmountEntered} isLoading={isLoading} />
      )}
      {stage === "choose-card" && (
        <SelectSavedCard
          onDone={onLoadPaystack}
          isLoading={isLoading}
          email={user?.email ?? undefined}
          onClick={() => setStage("amount")}
        />
      )}
    </>
  );
};

export default BankWallet;
