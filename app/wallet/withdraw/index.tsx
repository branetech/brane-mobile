import WithdrawFlow from "@/components/withdraw/withdraw-flow";
import { TRANSACTION_SERVICE } from "@/services/routes";

export default function WalletWithdrawScreen() {
  return (
    <WithdrawFlow
      title='Withdraw'
      balanceLabel='Wallet Balance'
      balanceEndpoint={TRANSACTION_SERVICE.BALANCE}
      withdrawEndpoint='/transactions-service/wallet/withdraw'
      loadingMessage='Processing withdrawal...'
      successToastMessage='Withdrawal initiated successfully'
      successRoute='/(tabs)'
      insufficientBalanceMessage='Insufficient wallet balance'
      requiresPin
    />
  );
}
