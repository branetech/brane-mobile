import WithdrawFlow from "@/components/withdraw/withdraw-flow";
import { STOCKS_SERVICE } from "@/services/routes";

export default function DividendWithdrawScreen() {
  return (
    <WithdrawFlow
      title='Dividend Withdraw'
      balanceLabel='Available Dividend Balance'
      balanceEndpoint={STOCKS_SERVICE.WALLET_BALANCE}
      balanceTransform={(res: any) =>
        Number(
          res?.data?.dividendBalance ||
            res?.dividendBalance ||
            res?.data?.balance ||
            res?.balance ||
            0,
        )
      }
      withdrawEndpoint='/stocks-service/wallet/withdraw'
      accountPayloadKey='accountNumber'
      accountValueResolver={(account: any) => account?.accountNumber}
      loadingMessage='Processing dividend withdrawal...'
      successToastMessage='Dividend withdrawal successful'
      successRoute='/wallet'
      insufficientBalanceMessage='Insufficient dividend balance'
      requiresPin
    />
  );
}
