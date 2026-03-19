import CustomButton from "@/components/Button";
import React from "react";
import styles from "@/components/Button/style.module.css";
import {Gtb, PlusIcon} from "@/components/Svgs";
import {BraneCustomRadio} from "@/components";
import {RadioGroup} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import Header from "@/components/Header";

const DividendAcc = ({onSubmit}: { onSubmit: any }) => {
  const router = useRouter();
  return (
    <div className='brane-container h-full'>
      <Header handleBackPress={() => router.back()}/>
      <div>
        <h1 className='text-[20px]'>Choose bank account</h1>
        <p>Select or add a bank account to complete your transactions.</p>
      </div>
      <div className="pb-7 border-b-1 border-[#F7F7F8]">
        <CustomButton
          className={`${styles.btn} bg-[#D2F1E4] h-[50px] w-full rounded-xl mt-4 text-[#013D25]`}
          title='Add a New Bank'
          type='submit'
          // onClick={onSubmit}
          leftContent={<PlusIcon/>}
        />
      </div>
      {/*<RadioGroup size="lg">*/}
      {/*  <BraneCustomRadio*/}
      {/*    value='gtb'*/}
      {/*    description='Guarantee Trust Bank • 01234567890'*/}
      {/*    img={<Gtb/>}*/}
      {/*  >*/}
      {/*    Fatimo Temitope Salami*/}
      {/*  </BraneCustomRadio>*/}
      {/*</RadioGroup>*/}

      <CustomButton
        title={"Withdraw (₦ 3,000)"}
        className={`${styles.btn} bg-[#AABEB6] text-[#D2F1E4] fixed left-0 bottom-0 right-0 mx-auto w-[420px] rounded-xl h-[50px] mb-[42px]`}
        onClick={onSubmit}
      />
    </div>
  );
};

export default DividendAcc;
