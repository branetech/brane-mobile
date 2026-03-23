import CustomButton from "@/components/Button";
import Header from "@/components/Header";
import { RiskDisclosureModalContent } from "@/components/InvestmentTriggerModals/InvestmentTermsAndConditionModal";
import { BraneInvestmentTermsAndConditionModal } from "@/components/Modal";
import { ManagedEarnIcon, ManagedExpertIcon } from "@/components/Svgs";
import { FeatureItem } from "@/components/Tag";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import BaseRequest, { catchError } from "@/services";
import { TRANSACTION_SERVICE } from "@/services/routes";
import { showSuccess } from "@/utils/helpers";

const ManagedPortfolioComponent = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const handleProceed = async () => {
    setIsModalOpen(true)
    if (isTermsAccepted) {
    } else {
      setIsModalOpen(true);
    }
  };

  const handleTermsAccept = useCallback(async() => {
    setIsTermsAccepted(true);
    setLoading(true);
    try {
      await BaseRequest.put(TRANSACTION_SERVICE.ACCOUNT_BRACS_ALLOCATION, {
        allocationType: "managed",
      });
      showSuccess("Bracs Allocation Settings Saved Successfully");
      router.push(
        "/account/bracs-investment-trigger/managed-portfolio/about-managed-portfolio"
      );
    } catch (err) {
      catchError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden text-white flex flex-col">
      <div className="absolute inset-0 z-0">
        <Image
          src="/network/CoverInvestment.png"
          alt="Green investment background"
          layout="fill"
          objectFit="cover"
          quality={100}
          loading="lazy"
          placeholder="blur"
          blurDataURL="/path/to/blur/image"
        />
      </div>

      <div className="relative z-10 flex flex-col px-5 pb-5 flex-grow">
        <Header
          title="Bracs Investment Trigger"
          titleColor="#fff"
          handleBackPress={() =>
            router.push("/account/bracs-investment-trigger")
          }
        />

        <div className="flex flex-col flex-grow pt-10 pb-8">
          <div className="flex flex-col">
            <div className="w-[150px] h-[150px] rounded-2xl overflow-hidden mt-[-10px] bg-[#2d9868]">
              <Image
                src="/network/invest-brane.png"
                alt="Wooden circular icon"
                width={150}
                height={150}
                objectFit="cover"
              />
            </div>

            <h2
              className="text-[24px] font-bold mt-6 mb-[50px] text-white"
              style={{ lineHeight: "150%", letterSpacing: "0%" }}
            >
              Let Expert Manage & Grow Your <br /> Wealth From Every Spending
            </h2>

            <FeatureItem
              title="Earn More While You Spend"
              description="Expert investors grow your wealth using Brac balance automatically at 12-18% historical market returns VS 0% sitting idle in your wallet."
              iconSvg={<ManagedEarnIcon />}
            />

            <FeatureItem
              title="Access Expert-Level Investment"
              description="Get the same proven strategies and SEC-regulated protection that wealthy investors pay millions for at no-extra-cost to you."
              iconSvg={<ManagedExpertIcon />}
            />
          </div>

          <div className="flex-grow" />

          <div className="flex flex-col w-full">
            <p className="text-[12px] font-normal text-center opacity-80 mb-6 text-white">
               The Managed Portfolio is managed by Sankore securities, a Registered Investment Broker licensed by SEC 
            </p>

            <CustomButton
              title="Proceed"
              className="w-full h-[50px] py-3 bg-[#013D25] text-[#D2F1E4] font-bold rounded-xl shadow-xl hover:bg-[#013D25] transition duration-150"
              onClick={handleProceed}
              isLoading={isLoading}
            >
              Proceed
            </CustomButton>

            <p className="text-[12px] font-normal text-center opacity-80 mt-4 text-white">
              By proceeding you agree to our{" "}
              <span
                className="underline font-medium"
                onClick={() => setIsModalOpen(true)}
              >
                Terms and Conditions
              </span>
            </p>
          </div>
        </div>
      </div>
      <BraneInvestmentTermsAndConditionModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        className="max-h-[100vh]"
      >
        <RiskDisclosureModalContent
          onAccept={handleTermsAccept}
          onClose={() => setIsModalOpen(false)}
        />
      </BraneInvestmentTermsAndConditionModal>
    </div>
  );
};

export default ManagedPortfolioComponent;
