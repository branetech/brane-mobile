import { useRequest } from "@/services/useRequest"

export const images = [
  {
    id: 1,
    src: "/container.svg",
  },
  {
    id: 2,
    src: "/container_1.svg",
  },
  {
    id: 3,
    src: "/container_2.svg",
  },
];

export const EMPLOYMENT_STATUS = {
  EMPLOYED: "employed",
  SELF_EMPLOYED: "self-employed",
  STUDENT: "student",
  ENTREPRENEUR: "entrepreneur",
  UNEMPLOYED: "unemployed",
};

export interface StockInterface {
  id: string;
  tickerSymbol: string;
  assetClass?: string;
  logo?: string;
  timeOfCurrentPrice?: string;
  braneStockCategory?: string;
  companyName: string;
  companyCeo: string;
  marketSector: string;
  subSector: string;
  sharesOutstanding: string;
  website: string;
  marketCap: string;
  openingPrice: string;
  dayRange: string;
  yearRange: string;
  dividendYield: string;
  vol: string;
  avgVol: string;
  EPS: string;
  stockholding: string;
  riskLevel: string;
  PERatio: string;
  description: string;
  dateListed: string;
  dateOfIncorporation: string;
  boardOfDirectors: string[];
  tradingName: string;
  sector: string;
  historyLink: string;
  marketClassification: string;
  price?: number;
  ticker?: string;
  percentage?: number;
  history?: any[];
  currentPrice?: any;
  isTopPick?:boolean;
  stockSourceId?: string;
  custodian?: string;
  isin?: string;
  assetManager?: string;
  indexTracked?: string;
  trustee?: string;
  liquidityPower?: string;
  fundSponsor?: string;
  tenures?: string;
  annualReturn?: string;
}

export interface LockedFundsData {
  totalLiquidityDays: number;
  remainingLiquidityDays: number;
  tenureDays: number;
  interestRate: number;
}

export const STOCKS_DETAILS: StockInterface[] = [
  {
    id: "NGMTNN000002",
    tickerSymbol: "MTNN",
    companyName: "MTN Nigeria Communications Plc",
    companyCeo: "Karl Olutokun Toriola",
    marketSector: "Telecommunications",
    marketClassification: "Main Board",
    marketCap: "4,189.2 B NGN",
    openingPrice: "179.00 NGN",
    dayRange: "171.00 - 319.80 NGN",
    yearRange: "178.70 - 295.00 NGN",
    dividendYield: "7.81%",
    vol: "185,842",
    avgVol: "1,234,163",
    EPS: "N/A",
    stockholding: "N/A",
    riskLevel: "N/A",
    PERatio: "N/A",
    description:
      "MTN Nigeria Communications Plc is a leading telecommunications company in Nigeria, providing a wide range of services including voice, data, and digital services. The company is known for its extensive network coverage and innovative solutions, aiming to connect people and businesses across Nigeria.",
    dateListed: "2019-05-16",
    dateOfIncorporation: "Nov-08-2000",
    boardOfDirectors: [
      "Ernest Ndukwe (Chairman)",
      "Karl Olutokun Toriola (CEO)",
      "Ralph Mupita (Non-Executive Director)",
      "Ferdi Moolman (Non-Executive Director)",
      "Modupe Kadri (Executive Director/CFO)",
      "Michael Onochie Ajukwu (Independent Non-Executive Director)",
      "Ifueko M Omoigui Okauru (Non-Executive Director)",
      "Omobola Johnson (Non-Executive Director)",
      "Muhammad K. Ahmad (Independent Non-Executive Director)",
      "Andrew Alli (Non-Executive Director)",
      "A.B. Mahmoud (Non-Executive Director)",
      "Jens Schulte-Bockum (Non-Executive Director)",
      "Tsholofelo Molefe (Non-Executive Director)",
      "Mazen Mroue (Non-Executive Director)",
    ],
    tradingName: "MTN Nigeria Communications Plc",
    historyLink:
      "https://doclib.ngxgroup.com/REST/api/stockchartdata/NGMTNN000002",
    sharesOutstanding: "20,995,560,103.00",
    sector: "ICT",
    subSector: "Telecommunications Services",
    website: "https://www.mtn.com/",
  },
  {
    id: "GB00BKDRYJ47",
    tickerSymbol: "AIRTELAFRI",
    companyName: "Airtel Africa Plc",
    companyCeo: "Segun Ogunsanya",
    marketSector: "Telecommunications",
    marketCap: "3,500 B NGN",
    openingPrice: "1,200.00 NGN",
    dayRange: "1,180.00 - 1,250.00 NGN",
    yearRange: "1,100.00 - 1,300.00 NGN",
    dividendYield: "3.5%",
    vol: "150,000",
    avgVol: "200,000",
    EPS: "N/A",
    stockholding: "N/A",
    riskLevel: "N/A",
    PERatio: "N/A",
    dateListed: "2019-06-28",
    dateOfIncorporation: "2018",
    boardOfDirectors: [
      "Sunil Bharti Mittal (Chairman)",
      "Segun Ogunsanya (CEO)",
      "Akhil Gupta (Non-Executive Director)",
      "Nikolai Beckers (Non-Executive Director)",
      "Obinna Ufudo (Independent Non-Executive Director)",
      "Tshepo Mahloele (Independent Non-Executive Director)",
      "Raghunath Mandava (Non-Executive Director)",
      "Olusegun Ogunsanya (Executive Director)",
    ],
    tradingName: "Airtel Africa Plc",
    description:
      "Airtel Africa Plc is a leading telecommunications company in Africa, providing a wide range of services including mobile voice, data, and mobile money services. The company operates in 14 countries across Africa and is known for its extensive network coverage and innovative solutions.",
    historyLink:
      "https://doclib.ngxgroup.com/REST/api/stockchartdata/GB00BKDRYJ47",
    sharesOutstanding: "3,758,151,504.00",
    subSector: "Telecommunications Services",
    sector: "ICT",
    marketClassification: "Main Board",
    website: "https://airtel.com.ng/",
  },
];

export const ElectricityData = [
  {
    label: "IKEDC",
    value: "IKEDC",
  },
  {
    label: "EKEDC",
    value: "EKEDC",
  },
  {
    label: "KEDC",
    value: "KEDC",
  },
  {
    label: "BEDC",
    value: "BEDC",
  },
  {
    label: "IBEDC",
    value: "IBEDC",
  },
  {
    label: "PHEDC",
    value: "PHEDC",
  },
  {
    label: "YEDC",
    value: "YEDC",
  },
  {
    label: "JEDC",
    value: "JEDC",
  },
];

export const ElectricProduct = [
  {
    label: "Postpaid",
    value: "postpaid",
  },
  {
    label: "Prepaid",
    value: "prepaid",
  },
];

export const Beneficiary = [
  // {
  //   biller: "IKEDC",
  //   meterNumber: "8775675687456",
  //   name: "joy",
  //   product: "postpaid",
  // },
  // {
  //   biller: "KEDC",
  //   meterNumber: "7836435687456",
  //   name: "jane",
  //   product: "prepaid",
  // },
  // {
  //   biller: "PHEDC",
  //   meterNumber: "467856687456",
  //   name: "junior",
  //   product: "postpaid",
  // },
];


export const options = [
  {
    title: "AI Investment Assistant (Sally)",
    description:
      "Turn on to automate your bracs Sit back and <br /> let your <span class='text-[#342A3B]'>expert</span> AI buddy do the work",
    isSwitch: true,
    value: "sally",
  },
  {
    title: "Managed Portfolio",
    description:
      "Skip the indecisive let the <span class='text-[#342A3B]'>expert</span> handle it all <br /> from allocation to wealth building",
    isSwitch: true,
    value: "managed",
    url: "/account/bracs-investment-trigger/managed-portfolio",
  },
  {
    title: "Do It Yourself (DIY)",
    isSwitch: true,
    description:
      "Manually set up your bracs allocation and <br /> investment.",
    value: "diy",
    url: "/account/bracs-investment-trigger/bracs-allocation",
  },
];




export const details = `Your Bracs, professionally managed for growth.

Managed Portfolio & Wealth Investment gives you peace of mind by putting your portfolio in the hands of expert investment partners. Instead of worrying about how to allocate or grow your assets, you can rely on a seamless system that manages everything for you securely, transparently, and with your financial goals in mind.

What You Get
• Effortless Management: Your portfolio is handled automatically, so you don't have to lift a finger.
• Expert Oversight: Professional investment partners ensure your assets are optimized for growth.
• Tailored to You: Strategies designed to match your needs and risk preferences.
• Clear & Secure: Transparent reporting and trusted processes keep you in control.

With Managed Portfolio & Wealth Investment, you don't just save you grow. It's the smarter way to build wealth while staying focused on what matters most in your life.`;
