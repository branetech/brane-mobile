"use client";
import CustomButton from "@/components/Button";
import FormInput, { numberInputOnly } from "@/components/FormInput";
import { Header } from "@/components/Header";
import { PlusIcon } from "@/components/Svgs";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { onShowInsufficientFunds, priceFormatter, showError } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import React from "react";

const Wallet = ({
                  onSubmit,
                  inputAmount,
                  setInputAmount,
                }: {
  onSubmit: any;
  inputAmount: number;
  setInputAmount: Function;
}) => {
  const router = useRouter();
  const {data: balanceWallet} = useRequest(TRANSACTION_SERVICE.BALANCE, {
    initialValue: 0,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    noCache: true,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (/^\d*\.?\d*$/.test(inputValue)) {
      setInputAmount(parseFloat(inputValue) || 0);
    }
  };

  const isSufficientBalance = () => parseFloat(balanceWallet) >= inputAmount;

  const handleSubmit = () => {
    if (isSufficientBalance()) {
      onSubmit();
    } else {
      showError("Insufficient balance");
      onShowInsufficientFunds();
    }
  };

  return (
    <div className='brane-container h-full'>
      <Header title='Enter amount'/>
      <div className='flex flex-col flex-1 gap-6'>
        <div className='border-1 border-[#f7f7f8] flex justify-between h-[61px] items-center rounded-xl px-4'>
          <p>Wallet balance</p>
          <h1>{priceFormatter(Number(balanceWallet))}</h1>
        </div>
        {parseFloat(balanceWallet) === 0 ? (
          <div className='flex justify-center flex-col items-center'>
            <CustomButton
              className='xs-[360px]:w-[120px] rounded-xl w-[150px] max-w-full font-[500] text-[#013D25] h-[40px] bg-[#D2F1E4]'
              onClick={() => router.push("/wallet/fund-wallet")}
              title={"Fund Wallet"}
              leftContent={<PlusIcon/>}
            />
            <span>Low wallet balance, please fund your wallet</span>
          </div>
        ) : (
          <div className='flex justify-center flex-col items-center'>
            <FormInput
              placeholder='₦0.00'
              onChange={handleInputChange}
              className='mix-w-[55vw] h-[50px] bg-[#f7f7f7] placeholder:text-center placeholder:text-[20px] text-center'
              onInput={numberInputOnly}
              value={inputAmount ? priceFormatter(inputAmount) : ""}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            {!inputAmount && (
              <p>
                (Tap <span className='text-[#0B0014]'>₦0.00</span> to enter amount)
              </p>
            )}
            {inputAmount > 0 && (
              <p>
                Amount to fund <span className='text-primary font-bold'>{priceFormatter(inputAmount)}</span>
              </p>
            )}
            {!isSufficientBalance() && inputAmount > 0 && (
              <p className='text-red-500'>Insufficient balance</p>
            )}
          </div>
        )}
      </div>

      <CustomButton
        onClick={handleSubmit}
        title={"Proceed"}
        disabled={!isSufficientBalance() || inputAmount === 0}
        className={`text-white mb-11 w-full rounded-xl h-[50px] ${!isSufficientBalance() ? 'bg-gray-400' : ''}`}
      />
    </div>
  );
};

export default Wallet;
