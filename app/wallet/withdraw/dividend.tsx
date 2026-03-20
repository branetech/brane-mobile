import WithdrawFlow from "@/components/withdraw/withdraw-flow";
import { STOCKS_SERVICE } from "@/services/routes";

export default function DividendWithdrawScreen() {
  return (
    <WithdrawFlow
      title='Dividend Withdrawal'
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
      withdrawEndpoint='/stocks-service/wallet/withdraw-dividend'
      loadingMessage='Processing dividend withdrawal...'
      successToastMessage='Dividend withdrawal initiated'
      successRoute='/(tabs)/portfolio'
      insufficientBalanceMessage='Insufficient dividend balance'
    />
  );
}
