import WithdrawFlow from "@/components/withdraw/withdraw-flow";
import { STOCKS_SERVICE } from "@/services/routes";

export default function StockWithdrawScreen() {
  return (
    <WithdrawFlow
      title='Withdraw Funds'
      balanceLabel='Stock Wallet Balance'
      balanceEndpoint={STOCKS_SERVICE.WALLET_BALANCE}
      balanceTransform={(res: any) =>
        Number(res?.data?.balance || res?.balance || 0)
      }
      withdrawEndpoint='/stocks-service/wallet/withdraw'
      loadingMessage='Processing withdrawal...'
      successToastMessage='Withdrawal initiated successfully'
      successRoute='/(tabs)/(portfolio)'
      insufficientBalanceMessage='Insufficient stock wallet balance'
    />
  );
}
