import WithdrawFlow from "@/components/withdraw/withdraw-flow";
import { TRANSACTION_SERVICE } from "@/services/routes";

export default function WalletWithdrawScreen() {
  return (
    <WithdrawFlow
      title='Withdraw'
      balanceLabel='Wallet Balance'
      balanceEndpoint={TRANSACTION_SERVICE.BALANCE}
      withdrawEndpoint='/transactions-service/wallet/withdraw'
      accountPayloadKey='accountNumber'
      accountValueResolver={(account: any) => account?.accountNumber}
      loadingMessage='Processing withdrawal...'
      successToastMessage='Withdrawal successful'
      successRoute='/wallet'
      insufficientBalanceMessage='Insufficient wallet balance'
      requiresPin
    />
  );
}
