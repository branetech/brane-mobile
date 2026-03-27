import Header from "@/components/Header";
import { WealthAllocation } from "@/components/InvestmentTriggerModals/AISallyModal";
import { InvestmentCard } from "@/components/InvestmentTriggerModals/InvestmentTermsAndConditionModal";
import { ShowMore } from "@/components/Stocks/About";
import { STOCKS_SERVICE } from "@/services/routes";
import { useRequest } from "@/services/useRequest";
import { details } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

const getBgColor = (tickerSymbol: string) => {
  switch (tickerSymbol.toLowerCase()) {
    case "airtel":
      return "bg-[#FDF2F2]";
    case "mtnn":
    case "mtn":
      return "bg-[#FFF9E0]";
    case "glo":
      return "bg-[#F4FBF8]";
    case "9mobile":
      return "bg-[#c6def2]";
    default:
      return "bg-[#FDF2F2]";
  }
};

const ManagedWealthPage: React.FC = () => {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const toggleShowMore = () => setShowMore(!showMore);
  const [activeIndex, setActiveIndex] = useState(0);
  const BASE_SCALE = 1;
  const SCALE_DECREMENT = 0.05;
  const CARD_HEIGHT = 180;
  const HORIZONTAL_OFFSET = 57;

  const { data: allocationData } = useRequest(STOCKS_SERVICE.MANAGED_BRACS);

  const { data: investmentData } = useRequest(STOCKS_SERVICE.ASSET_PICKER);

  const transformedInvestmentData = Array.isArray(investmentData)
    ? investmentData.map((data: any) => ({
        tickerSymbol: data.tickerSymbol,
        bracName: data.tickerSymbol,
        units: 0,
        value: 0,
        ytdReturn: 0,
        ytdReturnDisplay: "",
        bgColor: getBgColor(data.tickerSymbol),
        isActive: false,
      }))
    : [];

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <div className='mx-auto px-5 pb-10 bg-white min-h-screen'>
      <Header
        title='MANAGED WEALTH'
        handleBackPress={() => router.push("/account/bracs-investment-trigger")}
      />
      <div>
        <div className='flex justify-center gap-36 border-b-2 border-[#F0FAF6]'>
          <div className='flex gap-2 border-b-2 py-2 border-[#013D25] w-full justify-center'>
            <h5 className='text-[#013D25] text-[14px] text-center font-semibold'>
              About
            </h5>
          </div>
          <div className='flex gap-2 py-2 cursor-pointer w-full '>
            <h5 className='text-[#85808A] text-[14px]'></h5>
          </div>
        </div>
        <h1 className='text-2xl font-bold text-[#0B0014] py-6'>
          Managed Bracs & Wealth Investment
        </h1>
      </div>

      <main className=''>
        <section className='mb-8'>
          <div className='text-[#85808A] font-normal text-[12px]'>
            {showMore ? details : `${details?.substring(0, 250)}...`}
          </div>
          <ShowMore
            onClick={toggleShowMore}
            show={showMore}
            justifyStart={true}
          />
        </section>

        <section className='mb-8'>
          <h2 className='text-sm font-semibold text-[#85808A] mb-4'>
            Top Picks
          </h2>
          <div className='relative h-[200px] w-full overflow-hidden'>
            {transformedInvestmentData &&
              transformedInvestmentData.map((data: any, index: number) => {
                const visualIndex =
                  index < activeIndex
                    ? index + (investmentData.length - activeIndex)
                    : index - activeIndex;

                const scale = BASE_SCALE - visualIndex * SCALE_DECREMENT;
                const scaleDifference = CARD_HEIGHT * (1 - scale);
                const baseTranslateY = visualIndex * 5;
                const compensatedTranslateY = baseTranslateY - scaleDifference;
                const zIndex = investmentData.length - visualIndex;

                return (
                  <div
                    key={index}
                    className={`absolute top-0 left-0 transition-transform duration-300 ease-out cursor-pointer`}
                    style={{
                      zIndex: zIndex,
                      transform: `translateX(${
                        visualIndex * HORIZONTAL_OFFSET
                      }px) translateY(${compensatedTranslateY}px) scale(${scale})`,
                      transformOrigin: "bottom left",
                    }}
                    onClick={() => handleCardClick(index)}
                  >
                    <InvestmentCard {...data} />
                  </div>
                );
              })}
          </div>
        </section>

        <WealthAllocation
          sectionTitle='Why you should allow pro'
          chartTitle='Wealth Allocation'
          items={allocationData}
        />
      </main>
    </div>
  );
};

export default ManagedWealthPage;
