'use client'
import CustomButton from '@/components/Button';
import FormInput, { numberInputOnly } from '@/components/FormInput';
import { Header } from '@/components/Header';
import { useReduxState } from '@/redux/useReduxState';
import { onShowInsufficientFunds, priceFormatter, showError } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import React from 'react';

const Dividend = ({onSubmit, isLoading}: any) => {
  const router = useRouter();
  const balanceWallet = '0';
  const [amount, setAmount] = useReduxState(0, 'dividendSlice');
  const onChange = ({target: {value}}: any) => setAmount(Number(value.replace('₦', '')));
  const handleSubmit = () => {
    if (parseFloat(balanceWallet) >= amount) {
      onSubmit(amount);
    } else {
      showError('Insufficient balance');
      onShowInsufficientFunds()
    }
  }
  return (
    <div className='brane-container h-full'>
      <Header handleBackPress={router.back} title={"Enter amount"}/>
      <div className='border-1 border-[#f7f7f8] flex justify-between !h-[61px] items-center rounded-xl px-4'>
      <p>Dividend balance</p>
        <h1>{priceFormatter(Number(balanceWallet) || 0)}</h1>
      </div>
      <div className='flex justify-center flex-col items-center'>
        <FormInput
          placeholder='₦0.00'
          value={priceFormatter(amount)}
          onInput={numberInputOnly}
          className={"min-w-[55vw] h-[50px] bg-[#f7f7f7] placeholder:text-center placeholder:text-[20px] text-center"}
          onChange={onChange}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              if (parseFloat(balanceWallet) < amount) {
                showError('Insufficient balance');
                onShowInsufficientFunds();
              } else {
                onSubmit(amount);
              }
            }
          }}
        />
        {!amount && <p>(Tap <span className='text-[#0B0014]'>₦0.00</span> to enter amount)</p>}
        {!!amount && <p>Amount to fund <span className='text-primary font-bold'>{priceFormatter(amount)}</span></p>}
        {(parseFloat(balanceWallet) < amount) && <span className='text-[12px] d-block text-danger' >Insufficient balance</span>}
      </div>
      <div className=' w-full flex justify-end items-end mb-8 h-full'>
        <CustomButton
          onClick={() => handleSubmit()}
          title={'Proceed'}
          className={`bg-[#12432e] text-[#D2F1E4] w-full rounded-xl`}
          isLoading={isLoading}
          disabled={isLoading || Number(amount) < 1 || parseFloat(balanceWallet) < amount}
        /></div>
    </div>
  );
}

export default Dividend