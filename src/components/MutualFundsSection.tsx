"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Shield, 
  Calendar, 
  Search, 
  X, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ChevronDown, 
  Coins, 
  Percent, 
  Landmark, 
  HelpCircle, 
  Activity, 
  Plus, 
  Minus, 
  Layers, 
  ArrowUpDown,
  BookOpen,
  Trash2,
  RefreshCw,
  Upload,
  KeyRound,
  FileText,
  Edit2
} from "lucide-react";
import RollingNumber from "./RollingNumber";

export interface FundData {
  id: string;
  name: string;
  logo: string;
  category: "Small Cap" | "Flexi Cap" | "Hybrid" | "Large Cap" | "Mid Cap" | "ELSS" | "Index";
  house: string;
  invested: number;
  current: number;
  xirr: number;
  sipStatus: "Active" | "Paused" | "None";
  sipAmount: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  nav: number;
  minSip: number;
  aum: number; // in Crores
  expenseRatio: number; // %
  manager: string;
  exitLoad: string;
  riskLevel: "Low" | "Moderate" | "High" | "Very High";
  aiInsight: string;
  sharpeRatio: number;
  sortinoRatio: number;
  alpha: number;
  beta: number;
  holdings: { name: string; percentage: number }[];
  sectors: { name: string; percentage: number }[];
  folioNumber?: string;
  broker?: string;
  purchaseDate?: string;
  units?: number;
  nextSipDate?: string;
  bank?: string;
  autoDebitStatus?: "Enabled" | "Disabled";
}

export const DEFAULT_MUTUAL_FUNDS: FundData[] = [
  {
    id: "fund-1",
    name: "SBI Small Cap Fund",
    logo: "🟢",
    category: "Small Cap",
    house: "SBI Mutual Fund",
    invested: 150000,
    current: 185240,
    xirr: 22.45,
    sipStatus: "Active",
    sipAmount: 5000,
    oneYearReturn: 28.5,
    threeYearReturn: 24.1,
    fiveYearReturn: 20.8,
    nav: 142.50,
    minSip: 500,
    aum: 24500,
    expenseRatio: 0.68,
    manager: "R. Srinivasan",
    exitLoad: "1% if redeemed before 1 year",
    riskLevel: "Very High",
    aiInsight: "Excellent long-term performer with dominant small-cap allocation.",
    sharpeRatio: 1.85,
    sortinoRatio: 2.15,
    alpha: 5.42,
    beta: 0.92,
    holdings: [
      { name: "Blue Star Ltd", percentage: 4.8 },
      { name: "Carborundum Universal", percentage: 4.2 },
      { name: "Kalpataru Projects", percentage: 3.9 },
      { name: "V-Guard Industries", percentage: 3.5 }
    ],
    sectors: [
      { name: "Capital Goods", percentage: 24.5 },
      { name: "Consumer Services", percentage: 18.2 },
      { name: "Financials", percentage: 12.8 },
      { name: "Chemicals", percentage: 9.4 }
    ],
    folioNumber: "1024589/22",
    broker: "Groww",
    purchaseDate: "2024-03-12",
    units: 1052.63,
    nextSipDate: "05 July 2026",
    bank: "HDFC Bank",
    autoDebitStatus: "Enabled"
  },
  {
    id: "fund-2",
    name: "Parag Parikh Flexi Cap Fund",
    logo: "🟤",
    category: "Flexi Cap",
    house: "PPFAS Mutual Fund",
    invested: 250000,
    current: 312500,
    xirr: 18.20,
    sipStatus: "Active",
    sipAmount: 10000,
    oneYearReturn: 21.8,
    threeYearReturn: 19.5,
    fiveYearReturn: 18.2,
    nav: 72.85,
    minSip: 1000,
    aum: 62400,
    expenseRatio: 0.55,
    manager: "Rajeev Thakkar",
    exitLoad: "2% if redeemed before 1 year, 1% before 2 years",
    riskLevel: "High",
    aiInsight: "Includes international tech equities providing global diversification.",
    sharpeRatio: 1.62,
    sortinoRatio: 1.95,
    alpha: 3.85,
    beta: 0.85,
    holdings: [
      { name: "HDFC Bank Ltd", percentage: 8.2 },
      { name: "Alphabet Inc (Google)", percentage: 5.4 },
      { name: "Bajaj Holdings", percentage: 5.1 },
      { name: "Microsoft Corp", percentage: 4.8 }
    ],
    sectors: [
      { name: "Financials", percentage: 28.5 },
      { name: "Technology", percentage: 22.4 },
      { name: "Consumer Staples", percentage: 14.1 },
      { name: "Automobile", percentage: 8.9 }
    ],
    folioNumber: "5948210/18",
    broker: "Zerodha Coin",
    purchaseDate: "2023-08-20",
    units: 3431.70,
    nextSipDate: "05 July 2026",
    bank: "SBI",
    autoDebitStatus: "Enabled"
  },
  {
    id: "fund-3",
    name: "HDFC Balanced Advantage Fund",
    logo: "🔴",
    category: "Hybrid",
    house: "HDFC Mutual Fund",
    invested: 200000,
    current: 238450,
    xirr: 13.90,
    sipStatus: "Active",
    sipAmount: 5000,
    oneYearReturn: 16.4,
    threeYearReturn: 14.8,
    fiveYearReturn: 13.5,
    nav: 412.30,
    minSip: 500,
    aum: 85100,
    expenseRatio: 0.72,
    manager: "Gopal Agrawal",
    exitLoad: "1% if redeemed before 1 year",
    riskLevel: "Moderate",
    aiInsight: "Dynamic asset allocation matches equity swing indicators.",
    sharpeRatio: 1.22,
    sortinoRatio: 1.45,
    alpha: 1.85,
    beta: 0.78,
    holdings: [
      { name: "ICICI Bank Ltd", percentage: 6.8 },
      { name: "Reliance Industries", percentage: 6.2 },
      { name: "Government Securities", percentage: 14.5 },
      { name: "State Bank of India", percentage: 4.2 }
    ],
    sectors: [
      { name: "Financials", percentage: 22.1 },
      { name: "Energy & Power", percentage: 15.4 },
      { name: "Sovereign Debt", percentage: 14.5 },
      { name: "Technology", percentage: 8.8 }
    ],
    folioNumber: "3845129/01",
    broker: "Groww",
    purchaseDate: "2024-01-05",
    units: 485.08,
    nextSipDate: "10 July 2026",
    bank: "HDFC Bank",
    autoDebitStatus: "Enabled"
  },
  {
    id: "fund-4",
    name: "ICICI Prudential Bluechip Fund",
    logo: "🔵",
    category: "Large Cap",
    house: "ICICI Prudential MF",
    invested: 180000,
    current: 215420,
    xirr: 12.80,
    sipStatus: "Active",
    sipAmount: 5000,
    oneYearReturn: 15.2,
    threeYearReturn: 13.6,
    fiveYearReturn: 12.9,
    nav: 98.45,
    minSip: 100,
    aum: 48900,
    expenseRatio: 0.82,
    manager: "Anish Tawakley",
    exitLoad: "1% if redeemed before 1 year",
    riskLevel: "Moderate",
    aiInsight: "Low risk and highly stable bluechip market leadership.",
    sharpeRatio: 1.15,
    sortinoRatio: 1.32,
    alpha: 0.95,
    beta: 0.95,
    holdings: [
      { name: "ICICI Bank Ltd", percentage: 8.9 },
      { name: "Reliance Industries", percentage: 8.5 },
      { name: "Infosys Ltd", percentage: 6.9 },
      { name: "Larsen & Toubro", percentage: 5.2 }
    ],
    sectors: [
      { name: "Financials", percentage: 32.4 },
      { name: "Technology", percentage: 15.8 },
      { name: "Energy & Utilities", percentage: 12.1 },
      { name: "Construction", percentage: 9.2 }
    ],
    folioNumber: "2845210/99",
    broker: "Direct Portal",
    purchaseDate: "2024-02-18",
    units: 1828.34,
    nextSipDate: "15 July 2026",
    bank: "ICICI Bank",
    autoDebitStatus: "Enabled"
  },
  {
    id: "fund-5",
    name: "Axis Midcap Fund",
    logo: "⚪",
    category: "Mid Cap",
    house: "Axis Mutual Fund",
    invested: 120000,
    current: 142800,
    xirr: 14.15,
    sipStatus: "Active",
    sipAmount: 5000,
    oneYearReturn: 17.5,
    threeYearReturn: 15.2,
    fiveYearReturn: 14.8,
    nav: 84.10,
    minSip: 500,
    aum: 21200,
    expenseRatio: 0.58,
    manager: "Shreyash Devalkar",
    exitLoad: "1% if redeemed before 1 year",
    riskLevel: "Very High",
    aiInsight: "Growth-oriented selection across high-compounding midcap companies.",
    sharpeRatio: 1.35,
    sortinoRatio: 1.55,
    alpha: 2.12,
    beta: 0.98,
    holdings: [
      { name: "Cholamandalam Invest", percentage: 4.5 },
      { name: "Trent Ltd", percentage: 4.1 },
      { name: "Supreme Industries", percentage: 3.8 },
      { name: "Astral Ltd", percentage: 3.5 }
    ],
    sectors: [
      { name: "Financials", percentage: 21.8 },
      { name: "Consumer Discretionary", percentage: 19.5 },
      { name: "Industrials", percentage: 16.4 },
      { name: "Chemicals", percentage: 10.5 }
    ],
    folioNumber: "1940120/44",
    broker: "Kuvera",
    purchaseDate: "2024-04-10",
    units: 1426.87,
    nextSipDate: "18 July 2026",
    bank: "HDFC Bank",
    autoDebitStatus: "Enabled"
  },
  {
    id: "fund-6",
    name: "Motilal Oswal Midcap Fund",
    logo: "🟡",
    category: "Mid Cap",
    house: "Motilal Oswal MF",
    invested: 80000,
    current: 108420,
    xirr: 20.85,
    sipStatus: "Paused",
    sipAmount: 5000,
    oneYearReturn: 26.4,
    threeYearReturn: 22.8,
    fiveYearReturn: 18.5,
    nav: 92.50,
    minSip: 500,
    aum: 9800,
    expenseRatio: 0.62,
    manager: "Niket Shah",
    exitLoad: "1% if redeemed before 1 year",
    riskLevel: "Very High",
    aiInsight: "Aggressive portfolio tilt toward manufacturing cycles.",
    sharpeRatio: 1.72,
    sortinoRatio: 2.05,
    alpha: 4.85,
    beta: 1.10,
    holdings: [
      { name: "Jio Financial Services", percentage: 6.2 },
      { name: "Kalyan Jewellers", percentage: 5.8 },
      { name: "Polycab India", percentage: 5.1 },
      { name: "Prestige Estates", percentage: 4.5 }
    ],
    sectors: [
      { name: "Financials", percentage: 22.4 },
      { name: "Consumer Cyclicals", percentage: 18.9 },
      { name: "Capital Goods", percentage: 15.6 },
      { name: "Real Estate", percentage: 11.2 }
    ],
    folioNumber: "5821034/12",
    broker: "Zerodha Coin",
    purchaseDate: "2024-05-15",
    units: 864.86,
    nextSipDate: "25 July 2026",
    bank: "Axis Bank",
    autoDebitStatus: "Disabled"
  },
  {
    id: "fund-7",
    name: "Nippon India Growth Fund",
    logo: "🔵",
    category: "Flexi Cap",
    house: "Nippon India MF",
    invested: 50000,
    current: 62420,
    xirr: 15.60,
    sipStatus: "None",
    sipAmount: 0,
    oneYearReturn: 19.8,
    threeYearReturn: 16.5,
    fiveYearReturn: 15.2,
    nav: 122.30,
    minSip: 100,
    aum: 28400,
    expenseRatio: 0.78,
    manager: "Manish Gunwani",
    exitLoad: "1% if redeemed before 1 year",
    riskLevel: "High",
    aiInsight: "Diversified portfolio across growth sectors with value comfort.",
    sharpeRatio: 1.42,
    sortinoRatio: 1.68,
    alpha: 2.50,
    beta: 0.88,
    holdings: [
      { name: "HDFC Bank Ltd", percentage: 5.8 },
      { name: "ICICI Bank Ltd", percentage: 5.2 },
      { name: "Reliance Industries", percentage: 4.9 },
      { name: "State Bank of India", percentage: 4.1 }
    ],
    sectors: [
      { name: "Financials", percentage: 24.2 },
      { name: "Energy & Utilities", percentage: 15.1 },
      { name: "Consumer Discretionary", percentage: 12.8 },
      { name: "Industrials", percentage: 9.8 }
    ],
    folioNumber: "9582103/90",
    broker: "ET Money",
    purchaseDate: "2024-06-01",
    units: 408.83,
    nextSipDate: "None",
    bank: "None",
    autoDebitStatus: "Disabled"
  },
  {
    id: "fund-8",
    name: "Quant Small Cap Fund",
    logo: "🟣",
    category: "Small Cap",
    house: "Quant Mutual Fund",
    invested: 32222,
    current: 44198,
    xirr: 26.50,
    sipStatus: "Active",
    sipAmount: 5000,
    oneYearReturn: 34.2,
    threeYearReturn: 28.9,
    fiveYearReturn: 24.5,
    nav: 228.40,
    minSip: 1000,
    aum: 18600,
    expenseRatio: 0.76,
    manager: "Sanjeev Sharma",
    exitLoad: "1% if redeemed before 1 year",
    riskLevel: "Very High",
    aiInsight: "Proprietary VLRT dynamic model with quick portfolio turnover rates.",
    sharpeRatio: 2.15,
    sortinoRatio: 2.58,
    alpha: 7.25,
    beta: 1.15,
    holdings: [
      { name: "Reliance Industries", percentage: 9.1 },
      { name: "Jio Financial Services", percentage: 6.8 },
      { name: "Adani Power Ltd", percentage: 5.4 },
      { name: "Bikaji Foods", percentage: 4.5 }
    ],
    sectors: [
      { name: "Financials", percentage: 26.8 },
      { name: "Energy & Power", percentage: 20.4 },
      { name: "Consumer Staples", percentage: 14.8 },
      { name: "Materials", percentage: 11.2 }
    ],
    folioNumber: "1863501/29",
    broker: "Groww",
    purchaseDate: "2024-05-02",
    units: 141.07,
    nextSipDate: "05 July 2026",
    bank: "HDFC Bank",
    autoDebitStatus: "Enabled"
  }
];

const ALL_DISCOVERABLE_FUNDS = [
  { name: "SBI Small Cap Fund", rate: 28.5, nav: 142.50, risk: "Very High", cat: "Small Cap", house: "SBI Mutual Fund" },
  { name: "Parag Parikh Flexi Cap Fund", rate: 21.8, nav: 72.85, risk: "High", cat: "Flexi Cap", house: "PPFAS Mutual Fund" },
  { name: "HDFC Balanced Advantage Fund", rate: 16.4, nav: 412.30, risk: "Moderate", cat: "Hybrid", house: "HDFC Mutual Fund" },
  { name: "ICICI Prudential Bluechip Fund", rate: 15.2, nav: 98.45, risk: "Moderate", cat: "Large Cap", house: "ICICI Prudential MF" },
  { name: "Axis Midcap Fund", rate: 17.5, nav: 84.10, risk: "Very High", cat: "Mid Cap", house: "Axis Mutual Fund" },
  { name: "Motilal Oswal Midcap Fund", rate: 26.4, nav: 92.50, risk: "Very High", cat: "Mid Cap", house: "Motilal Oswal MF" },
  { name: "Quant Infrastructure Fund", rate: 31.4, nav: 48.90, risk: "Very High", cat: "Index", house: "Quant Mutual Fund" },
  { name: "Mirae Asset Emerging Bluechip", rate: 22.1, nav: 118.40, risk: "High", cat: "Large Cap", house: "Mirae Asset MF" }
];

interface MutualFundsSectionProps {
  activeCurrency: { code: string; symbol: string };
  format: (value: number, showSymbol?: boolean) => string;
  mutualFunds: FundData[];
  setMutualFunds: React.Dispatch<React.SetStateAction<FundData[]>>;
}

export default function MutualFundsSection({ activeCurrency, format, mutualFunds, setMutualFunds }: MutualFundsSectionProps) {
  // Navigation & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Returns");
  const [filterRisk, setFilterRisk] = useState<string>("All");

  // Selection & Modal States
  const [selectedFund, setSelectedFund] = useState<FundData | null>(null);
  const [comparisonList, setComparisonList] = useState<FundData[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Sync / Add modal states
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncMethod, setSyncMethod] = useState<"menu" | "search" | "cas" | "bank" | "manual">("menu");
  
  // Simulated CAS upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState("");

  // OTP Bank Sync states
  const [panCard, setPanCard] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSyncingBank, setIsSyncingBank] = useState(false);

  // Manual Form State
  const [manualName, setManualName] = useState("");
  const [manualAMC, setManualAMC] = useState("");
  const [manualCategory, setManualCategory] = useState<any>("Flexi Cap");
  const [manualType, setManualType] = useState<"SIP" | "Lumpsum">("SIP");
  const [manualAmount, setManualAmount] = useState("");
  const [manualNAV, setManualNAV] = useState("100.00");
  const [manualFolio, setManualFolio] = useState("");

  // Search & Add autocomplete
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const [selectedSearchAddFund, setSelectedSearchAddFund] = useState<any | null>(null);

  // Buy More / Redeem actions modal
  const [transactionModal, setTransactionModal] = useState<{ type: "buy" | "redeem"; fund: FundData } | null>(null);
  const [transactionAmount, setTransactionAmount] = useState("");

  // Interactive SIP Calculator states
  const [sipMonthlyInput, setSipMonthlyInput] = useState(10000);
  const [sipDurationYears, setSipDurationYears] = useState(10);
  const [sipExpectedReturn, setSipExpectedReturn] = useState(12);

  // Discover Carousel active filter
  const [discoverFilter, setDiscoverFilter] = useState("High Growth");

  // Direct Add Mutual Fund Form States (same style as FDs)
  const [directAddName, setDirectAddName] = useState("");
  const [directAddAmount, setDirectAddAmount] = useState("");
  const [directAddSip, setDirectAddSip] = useState("");
  const [directAddNAV, setDirectAddNAV] = useState("100");
  const [directAddCategory, setDirectAddCategory] = useState("Flexi Cap");

  // Inline Folio Editing State
  const [editingFund, setEditingFund] = useState<FundData | null>(null);
  const [editInvested, setEditInvested] = useState("");
  const [editCurrent, setEditCurrent] = useState("");
  const [editXirr, setEditXirr] = useState("");
  const [editSipAmount, setEditSipAmount] = useState("");
  const [editFolio, setEditFolio] = useState("");
  const [editBroker, setEditBroker] = useState("");

  // Dynamic portfolio stats calculation
  const totalMfValue = mutualFunds.reduce((acc, f) => acc + f.current, 0);
  const totalMfInvested = mutualFunds.reduce((acc, f) => acc + f.invested, 0);
  const totalSipMonthly = mutualFunds.filter(f => f.sipStatus === "Active").reduce((acc, f) => acc + f.sipAmount, 0);
  const activeSipCount = mutualFunds.filter(f => f.sipStatus === "Active").length;

  const bestPerformer = [...mutualFunds].sort((a, b) => b.oneYearReturn - a.oneYearReturn)[0] || null;
  const worstPerformer = [...mutualFunds].sort((a, b) => a.oneYearReturn - b.oneYearReturn)[0] || null;
  const highestAllocated = [...mutualFunds].sort((a, b) => b.current - a.current)[0] || null;

  // Calculate AMC exposures
  const amcExposures: Record<string, number> = {};
  mutualFunds.forEach(f => {
    amcExposures[f.house] = (amcExposures[f.house] || 0) + f.current;
  });
  const sortedAmcs = Object.entries(amcExposures).sort((a, b) => b[1] - a[1]);
  const largestAmcExposure = sortedAmcs[0]?.[0] || "None";

  // Table Row Toggle Expanded View
  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Comparison Selection Handler
  const toggleComparison = (fund: FundData) => {
    if (comparisonList.some(f => f.id === fund.id)) {
      setComparisonList(prev => prev.filter(f => f.id !== fund.id));
    } else {
      if (comparisonList.length >= 4) return;
      setComparisonList(prev => [...prev, fund]);
    }
  };

  // Sort & Filter Logic
  const filteredFunds = mutualFunds.filter((fund) => {
    const matchCategory = selectedCategory === "All" || fund.category === selectedCategory;
    const matchSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) || fund.house.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRisk = filterRisk === "All" || fund.riskLevel === filterRisk;
    return matchCategory && matchSearch && matchRisk;
  }).sort((a, b) => {
    if (sortOption === "Returns") return b.oneYearReturn - a.oneYearReturn;
    if (sortOption === "Risk") {
      const riskMap = { "Low": 1, "Moderate": 2, "High": 3, "Very High": 4 };
      return riskMap[a.riskLevel] - riskMap[b.riskLevel];
    }
    if (sortOption === "AUM") return b.aum - a.aum;
    if (sortOption === "Expense") return a.expenseRatio - b.expenseRatio;
    return 0;
  });

  // Calculate dynamic calculations for SIP Calculator
  const monthlyRate = (sipExpectedReturn / 12) / 100;
  const totalMonths = sipDurationYears * 12;
  const totalInvestedCalculator = sipMonthlyInput * totalMonths;
  const futureValueCalculator = Math.round(
    sipMonthlyInput * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const estimatedGainCalculator = futureValueCalculator - totalInvestedCalculator;

  // SIMULATE CAS FILE UPLOAD & AI SCANNING
  const handleCasDrop = (file: File) => {
    setUploadFile(file);
    setIsScanning(true);
    setScanProgress(0);
    setScanPhase("Reading CAS statement PDF structure...");

    const phases = [
      { p: 20, s: "Extracting PAN & Folio unit registers..." },
      { p: 50, s: "Matching ISIN codes with live exchange NAV feeds..." },
      { p: 80, s: "Synchronizing compounding XIRR rates..." },
      { p: 100, s: "Building integrated portfolio metrics..." }
    ];

    let currentPhase = 0;
    const timer = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 5;
        if (phases[currentPhase] && next >= phases[currentPhase].p) {
          setScanPhase(phases[currentPhase].s);
          currentPhase++;
        }
        if (next >= 100) {
          clearInterval(timer);
          // Apply mock synced funds
          const importedFunds: FundData[] = [
            {
              id: "fund-cas-1",
              name: "Quant Infrastructure Fund",
              logo: "📐",
              category: "Index",
              house: "Quant Mutual Fund",
              invested: 95000,
              current: 124500,
              xirr: 31.42,
              sipStatus: "Active",
              sipAmount: 2500,
              oneYearReturn: 35.8,
              threeYearReturn: 28.2,
              fiveYearReturn: 22.4,
              nav: 48.90,
              minSip: 1000,
              aum: 6500,
              expenseRatio: 0.76,
              manager: "Ankit Pande",
              exitLoad: "0.5% if redeemed before 3 months",
              riskLevel: "Very High",
              aiInsight: "Vibrant sector play targeting production-linked incentives.",
              sharpeRatio: 2.25,
              sortinoRatio: 2.78,
              alpha: 8.42,
              beta: 1.22,
              holdings: [
                { name: "Reliance Industries", percentage: 8.5 },
                { name: "Adani Enterprises", percentage: 7.2 },
                { name: "L&T Ltd", percentage: 6.8 }
              ],
              sectors: [
                { name: "Infrastructure", percentage: 48.2 },
                { name: "Energy & Utilities", percentage: 32.1 }
              ],
              folioNumber: "9283712/99",
              broker: "CAMS import",
              purchaseDate: "2024-04-12",
              units: 2545.91,
              nextSipDate: "05 July 2026",
              bank: "HDFC Bank",
              autoDebitStatus: "Enabled"
            }
          ];
          setMutualFunds(prevList => [...prevList, ...importedFunds]);
          setIsScanning(false);
          setShowSyncModal(false);
          setSyncMethod("menu");
        }
        return next;
      });
    }, 150);
  };

  // SIMULATE MF CENTRAL/GROWW LOGIN SYNC
  const handleBankSync = () => {
    if (!panCard) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    setIsSyncingBank(true);
    setTimeout(() => {
      // Import simulated holdings
      const syncedFunds: FundData[] = [
        {
          id: "fund-sync-1",
          name: "Mirae Asset Emerging Bluechip Fund",
          logo: "🌐",
          category: "Large Cap",
          house: "Mirae Asset MF",
          invested: 140000,
          current: 172400,
          xirr: 22.10,
          sipStatus: "Active",
          sipAmount: 5000,
          oneYearReturn: 24.5,
          threeYearReturn: 20.8,
          fiveYearReturn: 19.2,
          nav: 118.40,
          minSip: 1000,
          aum: 32800,
          expenseRatio: 0.65,
          manager: "Neelesh Surana",
          exitLoad: "1% if redeemed before 1 year",
          riskLevel: "High",
          aiInsight: "Excellent large & midcap blend with optimal risk-adjusted returns.",
          sharpeRatio: 1.76,
          sortinoRatio: 2.12,
          alpha: 4.25,
          beta: 0.94,
          holdings: [
            { name: "HDFC Bank Ltd", percentage: 7.8 },
            { name: "ICICI Bank Ltd", percentage: 7.2 },
            { name: "Reliance Industries", percentage: 6.9 }
          ],
          sectors: [
            { name: "Financials", percentage: 29.5 },
            { name: "Technology", percentage: 18.4 }
          ],
          folioNumber: "8521094/33",
          broker: "MF Central Sync",
          purchaseDate: "2024-01-20",
          units: 1456.08,
          nextSipDate: "05 July 2026",
          bank: "HDFC Bank",
          autoDebitStatus: "Enabled"
        }
      ];
      setMutualFunds(prevList => [...prevList, ...syncedFunds]);
      setIsSyncingBank(false);
      setOtpSent(false);
      setShowSyncModal(false);
      setSyncMethod("menu");
    }, 2000);
  };

  // MANUAL ENTRY SUBMIT
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualAmount) return;

    const principal = parseFloat(manualAmount) || 0;
    const navVal = parseFloat(manualNAV) || 100;
    const computedUnits = parseFloat((principal / navVal).toFixed(2));

    const newFund: FundData = {
      id: "fund-manual-" + Date.now(),
      name: manualName,
      logo: "💼",
      category: manualCategory,
      house: manualAMC || "Self Maintained",
      invested: principal,
      current: principal,
      xirr: 12.00,
      sipStatus: manualType === "SIP" ? "Active" : "None",
      sipAmount: manualType === "SIP" ? 5000 : 0,
      oneYearReturn: 12.5,
      threeYearReturn: 12.0,
      fiveYearReturn: 11.5,
      nav: navVal,
      minSip: 500,
      aum: 1200,
      expenseRatio: 0.75,
      manager: "Self Managed",
      exitLoad: "None",
      riskLevel: "Moderate",
      aiInsight: "Manually registered asset folio. Monitored for yield balance.",
      sharpeRatio: 1.10,
      sortinoRatio: 1.25,
      alpha: 0.50,
      beta: 0.90,
      holdings: [{ name: "Broad Market Equities", percentage: 100 }],
      sectors: [{ name: "Diversified", percentage: 100 }],
      folioNumber: manualFolio || "MANUAL-" + Date.now().toString().slice(-6),
      broker: "Manual entry",
      purchaseDate: new Date().toISOString().split("T")[0],
      units: computedUnits,
      nextSipDate: manualType === "SIP" ? "05 July 2026" : "None",
      bank: manualType === "SIP" ? "HDFC Bank" : "None",
      autoDebitStatus: manualType === "SIP" ? "Enabled" : "Disabled"
    };

    setMutualFunds(prevList => [...prevList, newFund]);
    setShowSyncModal(false);
    setSyncMethod("menu");
    setManualName("");
    setManualAMC("");
    setManualAmount("");
    setManualNAV("100.00");
    setManualFolio("");
  };

  // DIRECT ADD SUBMIT (same style as FDs)
  const handleDirectAddFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directAddName || !directAddAmount) return;

    const principal = parseFloat(directAddAmount) || 0;
    const navVal = parseFloat(directAddNAV) || 100;
    const sipVal = parseFloat(directAddSip) || 0;
    const computedUnits = parseFloat((principal / navVal).toFixed(2));

    const matchedInfo = ALL_DISCOVERABLE_FUNDS.find(f => f.name.toLowerCase() === directAddName.toLowerCase()) || {
      rate: 12.5,
      risk: "Moderate",
      cat: "Flexi Cap",
      house: "Self Managed"
    };

    const newFund: FundData = {
      id: "fund-direct-" + Date.now(),
      name: directAddName,
      logo: "📈",
      category: matchedInfo.cat as any,
      house: matchedInfo.house,
      invested: principal,
      current: principal,
      xirr: matchedInfo.rate / 2,
      sipStatus: sipVal > 0 ? "Active" : "None",
      sipAmount: sipVal,
      oneYearReturn: matchedInfo.rate,
      threeYearReturn: matchedInfo.rate - 2,
      fiveYearReturn: matchedInfo.rate - 4,
      nav: navVal,
      minSip: 500,
      aum: 4800,
      expenseRatio: 0.72,
      manager: "Direct Track Asset",
      exitLoad: "1% if redeemed before 12 months",
      riskLevel: matchedInfo.risk as any,
      aiInsight: "Directly tracked mutual fund. Added via quick-tracker form.",
      sharpeRatio: 1.45,
      sortinoRatio: 1.62,
      alpha: 2.15,
      beta: 0.95,
      holdings: [{ name: "Equity Broad Market", percentage: 100 }],
      sectors: [{ name: "Diversified Assets", percentage: 100 }],
      folioNumber: "DIR-" + Date.now().toString().slice(-4),
      broker: "Direct Form",
      purchaseDate: new Date().toISOString().split("T")[0],
      units: computedUnits,
      nextSipDate: sipVal > 0 ? "05 July 2026" : "None",
      bank: sipVal > 0 ? "HDFC Bank" : "None",
      autoDebitStatus: sipVal > 0 ? "Enabled" : "Disabled"
    };

    setMutualFunds(prevList => [...prevList, newFund]);
    setDirectAddName("");
    setDirectAddAmount("");
    setDirectAddSip("");
    setDirectAddNAV("100");
  };

  // SEARCH AND ADD AUTOCOMPLETE SELECT
  const handleSearchAddSelect = (selected: any) => {
    setSelectedSearchAddFund(selected);
  };

  const handleApplySearchAdd = () => {
    if (!selectedSearchAddFund) return;
    const principal = 10000;
    const computedUnits = parseFloat((principal / selectedSearchAddFund.nav).toFixed(2));

    const newFund: FundData = {
      id: "fund-add-" + Date.now(),
      name: selectedSearchAddFund.name,
      logo: "🔍",
      category: selectedSearchAddFund.cat,
      house: selectedSearchAddFund.house,
      invested: principal,
      current: principal,
      xirr: selectedSearchAddFund.rate / 2,
      sipStatus: "None",
      sipAmount: 0,
      oneYearReturn: selectedSearchAddFund.rate,
      threeYearReturn: selectedSearchAddFund.rate - 2,
      fiveYearReturn: selectedSearchAddFund.rate - 4,
      nav: selectedSearchAddFund.nav,
      minSip: 500,
      aum: 8600,
      expenseRatio: 0.72,
      manager: "A. K. Mehta",
      exitLoad: "1% if redeemed before 12 months",
      riskLevel: selectedSearchAddFund.risk,
      aiInsight: "Added from premium discover catalogue. High performance profile.",
      sharpeRatio: 1.55,
      sortinoRatio: 1.82,
      alpha: 3.25,
      beta: 0.98,
      holdings: [{ name: "Index Core Components", percentage: 100 }],
      sectors: [{ name: "Diversified Equities", percentage: 100 }],
      folioNumber: "9582103/" + Date.now().toString().slice(-2),
      broker: "Search Discover",
      purchaseDate: new Date().toISOString().split("T")[0],
      units: computedUnits,
      nextSipDate: "None",
      bank: "None",
      autoDebitStatus: "Disabled"
    };

    setMutualFunds(prevList => [...prevList, newFund]);
    setShowSyncModal(false);
    setSyncMethod("menu");
    setSelectedSearchAddFund(null);
    setAddSearchQuery("");
  };

  // BUY MORE / REDEEM TRANSACTION HANDLERS
  const handleTransactionApply = () => {
    if (!transactionModal || !transactionAmount) return;
    const amountVal = parseFloat(transactionAmount) || 0;
    const fundToUpdate = transactionModal.fund;

    setMutualFunds(prevList => 
      prevList.map(f => {
        if (f.id === fundToUpdate.id) {
          const deltaUnits = amountVal / f.nav;
          if (transactionModal.type === "buy") {
            const nextInvested = f.invested + amountVal;
            const nextUnits = (f.units || 0) + deltaUnits;
            const nextCurrent = f.current + amountVal;
            return { ...f, invested: nextInvested, units: parseFloat(nextUnits.toFixed(2)), current: nextCurrent };
          } else {
            const nextInvested = Math.max(0, f.invested - amountVal);
            const nextUnits = Math.max(0, (f.units || 0) - deltaUnits);
            const nextCurrent = Math.max(0, f.current - amountVal);
            return { ...f, invested: nextInvested, units: parseFloat(nextUnits.toFixed(2)), current: nextCurrent };
          }
        }
        return f;
      })
    );

    setTransactionModal(null);
    setTransactionAmount("");
  };

  // OPEN EDIT FOLIO DIALOG
  const handleOpenEdit = (fund: FundData) => {
    setEditingFund(fund);
    setEditInvested(fund.invested.toString());
    setEditCurrent(fund.current.toString());
    setEditXirr(fund.xirr.toString());
    setEditSipAmount(fund.sipAmount.toString());
    setEditFolio(fund.folioNumber || "");
    setEditBroker(fund.broker || "");
  };

  // SAVE FOLIO CHANGES
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFund) return;

    const investedVal = parseFloat(editInvested) || 0;
    const currentVal = parseFloat(editCurrent) || 0;
    const xirrVal = parseFloat(editXirr) || 0;
    const sipVal = parseFloat(editSipAmount) || 0;

    setMutualFunds(prevList => 
      prevList.map(f => {
        if (f.id === editingFund.id) {
          const computedUnits = parseFloat((currentVal / f.nav).toFixed(2));
          return {
            ...f,
            invested: investedVal,
            current: currentVal,
            xirr: xirrVal,
            sipAmount: sipVal,
            sipStatus: sipVal > 0 ? "Active" : "None",
            folioNumber: editFolio,
            broker: editBroker,
            units: computedUnits
          };
        }
        return f;
      })
    );

    setEditingFund(null);
  };

  // SIP OVERRIDES (Pause, Resume, Stop)
  const handleSipAction = (id: string, action: "pause" | "resume" | "stop") => {
    setMutualFunds(prevList => 
      prevList.map(f => {
        if (f.id === id) {
          if (action === "pause") {
            return { ...f, sipStatus: "Paused", autoDebitStatus: "Disabled" };
          } else if (action === "resume") {
            return { ...f, sipStatus: "Active", autoDebitStatus: "Enabled" };
          } else {
            return { ...f, sipStatus: "None", sipAmount: 0, nextSipDate: "None", autoDebitStatus: "Disabled" };
          }
        }
        return f;
      })
    );
  };

  // REMOVE FUND FROM PORTFOLIO
  const handleRemoveFund = (id: string) => {
    setMutualFunds(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Premium Mutual Funds</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-bold">Monitor, sync, and allocate your automated systematic SIP portfolios</p>
        </div>
        <button
          onClick={() => {
            setSyncMethod("menu");
            setShowSyncModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white transition-all cursor-pointer shadow shadow-blue-500/25 flex items-center gap-2 hover:scale-105 active:scale-95 duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Sync Investments
        </button>
      </div>

      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Total MF Value */}
        <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden group/card min-h-[125px] flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider flex justify-between items-center">
              Total Mutual Fund Value
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">Live</span>
            </div>
            <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">
              <RollingNumber value={totalMfValue} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]/20">
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              +{format(totalMfValue - totalMfInvested)} <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <svg className="w-16 h-6 overflow-visible text-emerald-500">
              <path d="M0 20 Q10 8, 20 18 T40 4 T60 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Today's Gain */}
        <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden group/card min-h-[125px] flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Today's Gain
            </div>
            <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">
              <RollingNumber value={8732} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]/20">
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              +0.72% <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <svg className="w-16 h-6 overflow-visible text-emerald-500">
              <path d="M0 16 Q8 2, 24 18 T48 10 T60 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Overall XIRR */}
        <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden group/card min-h-[125px] flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Overall XIRR
            </div>
            <div className="text-3xl font-black mt-1 text-blue-500 font-mono">
              14.35%
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]/20">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Since Inception
            </span>
            <svg className="w-16 h-6 overflow-visible text-blue-500">
              <path d="M0 20 Q12 18, 24 10 T48 14 T60 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Total Invested */}
        <div className="glass-card p-5 rounded-2xl border border-[var(--border-color)] text-left relative overflow-hidden group/card min-h-[125px] flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Total Invested
            </div>
            <div className="text-3xl font-black mt-1 text-[var(--text-color)] font-mono">
              <RollingNumber value={totalMfInvested} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]/20">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-semibold">
              Current Allocation
            </span>
            <div className="w-4.5 h-4.5 rounded-full border border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-blue-400 animate-spin animate-duration-1000">
              <Layers className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTERS */}
      <div className="flex flex-col gap-4 p-5 rounded-2xl border border-[var(--border-color)] bg-slate-900/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-slate-950/20 border border-[var(--border-color)] rounded-xl px-3.5 py-2.5 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mutual funds, fund houses, index pools..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none font-semibold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-900 border border-[var(--border-color)] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer font-bold"
              >
                <option value="Returns">Highest Returns</option>
                <option value="Risk">Lowest Risk</option>
                <option value="AUM">Highest AUM</option>
                <option value="Expense">Lowest Expense</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Risk:</span>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-slate-900 border border-[var(--border-color)] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer font-bold"
              >
                <option value="All">All Risks</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            {comparisonList.length > 0 && (
              <button
                onClick={() => setShowComparisonModal(true)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer shadow shadow-blue-500/25 flex items-center gap-2"
              >
                Compare ({comparisonList.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 border-t border-[var(--border-color)]/20 pt-3">
          {["All", "Small Cap", "Flexi Cap", "Hybrid", "Large Cap", "Mid Cap", "Index"].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  isSelected 
                    ? "bg-blue-600 border-blue-500 text-white shadow shadow-blue-500/10"
                    : "bg-slate-950/20 border-slate-800/40 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WIDGETS ROW: TABLE (LEFT) & SIDEBAR DETAILS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MUTUAL FUNDS PORTFOLIO TABLE */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="glass-card rounded-2xl border border-[var(--border-color)] overflow-hidden">
            
            <div className="grid grid-cols-12 gap-2 p-4 bg-slate-950/20 border-b border-[var(--border-color)] text-[10px] font-black text-slate-500 uppercase tracking-widest text-left items-center">
              <div className="col-span-4">Fund Name</div>
              <div className="col-span-2 text-right">Invested</div>
              <div className="col-span-2 text-right">Current</div>
              <div className="col-span-2 text-right">P/L</div>
              <div className="col-span-1 text-right">XIRR</div>
              <div className="col-span-1 text-center">Compare</div>
            </div>

            <div className="divide-y divide-[var(--border-color)]/30">
              {filteredFunds.map((fund) => {
                const profit = fund.current - fund.invested;
                const isProfit = profit >= 0;
                const isExpanded = !!expandedRows[fund.id];
                const isCompared = comparisonList.some(f => f.id === fund.id);

                return (
                  <div key={fund.id} className="flex flex-col hover:bg-slate-900/10 transition-colors">
                    
                    <div 
                      onClick={() => toggleRow(fund.id)}
                      className="grid grid-cols-12 gap-2 p-4 text-xs font-semibold items-center text-left cursor-pointer"
                    >
                      <div className="col-span-4 flex items-center gap-2.5">
                        <span className="text-base select-none shrink-0 w-8 h-8 rounded-xl bg-slate-800/20 border border-[var(--border-color)]/20 flex items-center justify-center">
                          {fund.logo}
                        </span>
                        <div className="flex flex-col truncate">
                          <span className="font-black text-white hover:text-blue-400 transition-colors truncate">{fund.name}</span>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{fund.category} &bull; Folio {fund.folioNumber || "None"}</span>
                        </div>
                      </div>

                      <div className="col-span-2 text-right font-mono font-bold text-slate-400">
                        {format(fund.invested)}
                      </div>

                      <div className="col-span-2 text-right font-mono font-bold text-white">
                        {format(fund.current)}
                      </div>

                      <div className={`col-span-2 text-right font-mono font-black ${isProfit ? "text-emerald-500" : "text-rose-500"}`}>
                        {isProfit ? "+" : ""}{format(profit)}
                      </div>

                      <div className="col-span-1 text-right font-mono font-black text-blue-400">
                        {fund.xirr}%
                      </div>

                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleComparison(fund);
                        }}
                        className="col-span-1 flex items-center justify-center cursor-pointer"
                      >
                        <div className={`w-4.5 h-4.5 rounded border transition-colors flex items-center justify-center ${
                          isCompared ? "bg-blue-600 border-blue-500 text-white" : "border-slate-800 hover:border-slate-700 bg-slate-950/45"
                        }`}>
                          {isCompared && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-950/30 border-t border-[var(--border-color)]/20"
                        >
                          <div className="p-4 flex flex-col gap-4 text-xs font-semibold">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="flex flex-col gap-1 bg-slate-950/20 border border-[var(--border-color)]/25 p-3 rounded-xl">
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">SIP Status</span>
                                <span className={`font-bold block ${fund.sipStatus === "Active" ? "text-emerald-500" : fund.sipStatus === "Paused" ? "text-amber-500" : "text-slate-400"}`}>
                                  {fund.sipStatus === "Active" ? `🟢 Active (₹${fund.sipAmount.toLocaleString()}/mo)` : fund.sipStatus === "Paused" ? "🟡 Paused" : "✕ No Active SIP"}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1 bg-slate-950/20 border border-[var(--border-color)]/25 p-3 rounded-xl">
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Next SIP & Bank</span>
                                <span className="font-bold text-slate-300 block">
                                  {fund.nextSipDate !== "None" ? `📅 ${fund.nextSipDate} (${fund.bank})` : "None Setup"}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1 bg-slate-950/20 border border-[var(--border-color)]/25 p-3 rounded-xl">
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Holding Units & NAV</span>
                                <span className="font-bold text-slate-300 block">
                                  {fund.units} Units &bull; NAV ₹{fund.nav}
                                </span>
                              </div>
                              <div className="flex items-center justify-end">
                                <button
                                  onClick={() => setSelectedFund(fund)}
                                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer shadow shadow-blue-500/10 flex items-center gap-1"
                                >
                                  View Details <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* SIP Overrides & Transactions Actions Panel */}
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)]/20 justify-between items-center">
                              <div className="flex flex-wrap gap-2">
                                <button 
                                  onClick={() => setTransactionModal({ type: "buy", fund })}
                                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-400 text-[10px] uppercase font-bold transition-all cursor-pointer"
                                >
                                  Buy More
                                </button>
                                <button 
                                  onClick={() => setTransactionModal({ type: "redeem", fund })}
                                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-[10px] uppercase font-bold transition-all cursor-pointer"
                                >
                                  Redeem Units
                                </button>
                                <button 
                                  onClick={() => handleOpenEdit(fund)}
                                  className="px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] hover:bg-blue-500/10 hover:text-blue-400 text-slate-400 text-[10px] uppercase font-bold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" /> Edit Folio
                                </button>
                                {fund.sipStatus === "Active" ? (
                                  <button 
                                    onClick={() => handleSipAction(fund.id, "pause")}
                                    className="px-2.5 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold transition-all cursor-pointer"
                                  >
                                    Pause SIP
                                  </button>
                                ) : fund.sipStatus === "Paused" ? (
                                  <button 
                                    onClick={() => handleSipAction(fund.id, "resume")}
                                    className="px-2.5 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold transition-all cursor-pointer"
                                  >
                                    Resume SIP
                                  </button>
                                ) : null}

                                {fund.sipStatus !== "None" && (
                                  <button 
                                    onClick={() => handleSipAction(fund.id, "stop")}
                                    className="px-2.5 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 text-[10px] uppercase font-bold transition-all cursor-pointer"
                                  >
                                    Stop SIP
                                  </button>
                                )}
                              </div>

                              <button 
                                onClick={() => handleRemoveFund(fund.id)}
                                className="text-rose-500 hover:text-rose-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove Folio
                              </button>
                            </div>

                            <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] text-slate-300 font-semibold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                              <span><strong>AI Advisor:</strong> {fund.aiInsight}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {filteredFunds.length === 0 && (
              <span className="text-xs text-slate-500 italic text-center py-6 block">No active portfolios matching filters.</span>
            )}
            
            {/* Direct Add Form (same style as FDs) */}
            <div className="p-4 bg-slate-950/20 border-t border-[var(--border-color)]">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">➕ Track Mutual Fund Direct Entry</span>
              <form onSubmit={handleDirectAddFund} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div className="relative flex flex-col sm:col-span-2">
                  <input
                    type="text"
                    value={directAddName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDirectAddName(val);
                      const exact = ALL_DISCOVERABLE_FUNDS.find(f => f.name.toLowerCase() === val.toLowerCase());
                      if (exact) {
                        setDirectAddNAV(exact.nav.toString());
                        setDirectAddCategory(exact.cat);
                      }
                    }}
                    placeholder="Mutual Fund Name (e.g. SBI Small Cap)"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white font-semibold"
                  />
                  {directAddName && !ALL_DISCOVERABLE_FUNDS.some(f => f.name === directAddName) && (
                    (() => {
                      const suggestions = ALL_DISCOVERABLE_FUNDS.filter(f => f.name.toLowerCase().includes(directAddName.toLowerCase()));
                      if (suggestions.length === 0) return null;
                      return (
                        <div className="absolute z-[9999] left-0 right-0 top-full mt-1 rounded-xl border border-blue-500/25 bg-slate-950 shadow-2xl p-1.5 flex flex-col gap-1 max-h-[140px] overflow-y-auto">
                          {suggestions.map((s) => (
                            <button
                              key={s.name}
                              type="button"
                              onClick={() => {
                                setDirectAddName(s.name);
                                setDirectAddNAV(s.nav.toString());
                                setDirectAddCategory(s.cat);
                              }}
                              className="px-2.5 py-1.5 text-left rounded-lg text-[10px] font-bold text-slate-300 hover:text-white hover:bg-blue-600/10 transition-colors w-full cursor-pointer flex justify-between"
                            >
                              <span>🏦 {s.name}</span>
                              <span className="text-emerald-400 font-mono">₹{s.nav}</span>
                            </button>
                          ))}
                        </div>
                      );
                    })()
                  )}
                </div>

                <input
                  type="number"
                  value={directAddAmount}
                  onChange={(e) => setDirectAddAmount(e.target.value)}
                  placeholder="Invested Amount"
                  required
                  className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white font-semibold"
                />

                <input
                  type="number"
                  value={directAddSip}
                  onChange={(e) => setDirectAddSip(e.target.value)}
                  placeholder="SIP Amount (0 if Lumpsum)"
                  required
                  className="px-3 py-2 rounded-xl bg-slate-900/50 border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500/30 text-white font-semibold"
                />

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 font-black uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" /> Track Fund
                </button>
              </form>
            </div>

          </div>

          {/* D. PORTFOLIO ANALYTICS MATRIX */}
          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] grid grid-cols-2 md:grid-cols-4 gap-4 text-left bg-slate-900/5">
            <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">Best Performer (1Y)</span>
              <span className="text-xs font-bold text-white block mt-1.5 truncate" title={bestPerformer?.name}>{bestPerformer ? `📈 ${bestPerformer.name}` : "None"}</span>
              <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">+{bestPerformer?.oneYearReturn}% CAGR</span>
            </div>
            <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">Highest Allocation</span>
              <span className="text-xs font-bold text-white block mt-1.5 truncate" title={highestAllocated?.name}>{highestAllocated ? `🎯 ${highestAllocated.name}` : "None"}</span>
              <span className="text-[10px] text-blue-400 font-bold block mt-0.5">{format(highestAllocated?.current || 0)} total</span>
            </div>
            <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">Largest AMC Exposure</span>
              <span className="text-xs font-bold text-white block mt-1.5 truncate">{largestAmcExposure}</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Grouped folio weight</span>
            </div>
            <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">Upcoming SIP</span>
              <span className="text-xs font-bold text-amber-500 block mt-1.5">05 July 2026</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Automated debit</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR METRICS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* A. SIP OVERVIEW CARD */}
          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-blue-600/[0.02] flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-white">SIP Overview</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">{activeSipCount} Active</span>
            </div>

            <div className="flex flex-col gap-3.5 text-xs leading-relaxed font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Monthly SIP Amount</span>
                <span className="text-[var(--text-color)] font-mono font-black text-sm">₹{totalSipMonthly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Active SIP Count</span>
                <span className="text-[var(--text-color)] font-mono font-bold">{activeSipCount} Funds</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Next SIP Date</span>
                <span className="text-amber-500 font-mono font-bold">05 July 2026</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSortOption("Returns");
              }}
              className="w-full py-2.5 rounded-xl border border-[var(--border-color)] hover:bg-slate-500/5 text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-wider cursor-pointer"
            >
              View All SIPs
            </button>
          </div>

        </div>
      </div>

      {/* 4. DISCOVER RECOMMENDED CAROUSEL */}
      <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-5 text-left">
        <div className="border-b border-[var(--border-color)] pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" /> Discover Mutual Funds
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">Top-performing recommendations compiled by Fincody AI Advisor</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {["High Growth", "Tax Saving (ELSS)", "Index Funds", "Low Risk", "AI Picks"].map((cat) => {
              const isActive = discoverFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setDiscoverFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    isActive 
                      ? "bg-blue-600 border-blue-500 text-white shadow shadow-blue-500/10"
                      : "bg-slate-900/40 border-blue-500/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {mutualFunds.filter(f => {
            if (discoverFilter === "High Growth") return f.oneYearReturn >= 20;
            if (discoverFilter === "Tax Saving (ELSS)") return f.category === "ELSS" || f.category === "Flexi Cap";
            if (discoverFilter === "Index Funds") return f.category === "Index" || f.category === "Large Cap";
            if (discoverFilter === "Low Risk") return f.riskLevel === "Moderate";
            return f.oneYearReturn >= 22;
          }).slice(0, 4).map((fund) => (
            <div 
              key={fund.id}
              className="p-4 rounded-xl border border-[var(--border-color)]/40 bg-slate-950/20 flex flex-col justify-between gap-4 hover:-translate-y-1 hover:border-blue-500/30 transition-all group duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <span className="text-xl bg-slate-900/50 p-1.5 rounded-xl border border-[var(--border-color)]/30 w-9 h-9 flex items-center justify-center">{fund.logo}</span>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                  fund.riskLevel === "Very High" ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                }`}>{fund.riskLevel} Risk</span>
              </div>

              <div>
                <h4 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors truncate">{fund.name}</h4>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">{fund.house}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold border-y border-[var(--border-color)]/20 py-2">
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">1Y Return</span>
                  <span className="text-emerald-400 font-mono">+{fund.oneYearReturn}%</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">AUM</span>
                  <span className="text-slate-300 font-mono">₹{fund.aum.toLocaleString()} Cr</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold">
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase">NAV</span>
                  <span className="text-slate-300 font-mono">₹{fund.nav}</span>
                </div>
                <button
                  onClick={() => setSelectedFund(fund)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow shadow-blue-500/10"
                >
                  Invest Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. INTERACTIVE SIP CALCULATOR */}
      <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] flex flex-col gap-6 text-left">
        <div>
          <span className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-blue-400" /> Interactive SIP Calculator
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">Visualize the power of compounding systematic investments</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Monthly Investment</span>
                <span className="text-white font-mono">₹{sipMonthlyInput.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={sipMonthlyInput}
                onChange={(e) => setSipMonthlyInput(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Duration (Years)</span>
                <span className="text-white font-mono">{sipDurationYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={sipDurationYears}
                onChange={(e) => setSipDurationYears(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Expected Return Rate</span>
                <span className="text-white font-mono">{sipExpectedReturn}% CAGR</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={sipExpectedReturn}
                onChange={(e) => setSipExpectedReturn(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center mt-3 pt-3 border-t border-[var(--border-color)]/20">
              <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Total Invested</span>
                <span className="text-xs font-mono font-black text-slate-400 mt-1 block">₹{totalInvestedCalculator.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Est. Gain</span>
                <span className="text-xs font-mono font-black text-emerald-400 mt-1 block">+₹{estimatedGainCalculator.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-blue-600/10 border border-blue-500/25 rounded-xl">
                <span className="text-[8px] text-blue-400 font-bold uppercase tracking-wider block">Total Value</span>
                <span className="text-xs font-mono font-black text-blue-400 mt-1 block">₹{futureValueCalculator.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 h-48 flex items-end justify-between relative bg-slate-950/10 border border-[var(--border-color)]/20 rounded-2xl p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <svg className="absolute inset-0 w-full h-full text-blue-500 pointer-events-none">
              <path 
                d={`M0 160 Q120 140, 380 ${170 - (futureValueCalculator / 20000000) * 100}`} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
              <path 
                d={`M0 160 Q120 140, 380 ${170 - (futureValueCalculator / 20000000) * 100} L380 190 L0 190 Z`} 
                fill="url(#calcGrad)" 
                opacity="0.1" 
              />
            </svg>

            <div className="absolute top-4 left-4 flex flex-col gap-0.5 z-10 text-xs font-bold text-slate-400">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Compounding Output</span>
              <span>10Y CAGR: <span className="text-white font-mono">{sipExpectedReturn}%</span></span>
            </div>

            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest absolute bottom-4 left-4">Year 0</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest absolute bottom-4 right-4">Year {sipDurationYears}</span>
          </div>
        </div>
      </div>

      {/* 6. SYNC INVESTMENTS MODAL */}
      <AnimatePresence>
        {showSyncModal && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-md glass-card rounded-3xl border border-blue-500/25 p-7 shadow-2xl relative bg-slate-900/95 text-left flex flex-col gap-6"
            >
              <button
                onClick={() => {
                  setShowSyncModal(false);
                  setSyncMethod("menu");
                  setUploadFile(null);
                  setOtpSent(false);
                  setSelectedSearchAddFund(null);
                }}
                className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-blue-500/10 pb-4">
                <span className="text-xl bg-slate-950/50 p-2 rounded-xl border border-blue-500/20 w-10 h-10 flex items-center justify-center">🔄</span>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Sync & Import Investments</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Choose options to aggregate portfolios</p>
                </div>
              </div>

              {syncMethod === "menu" && (
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => setSyncMethod("search")}
                    className="p-3.5 rounded-xl border border-blue-500/10 bg-slate-950/30 hover:bg-blue-600/10 hover:border-blue-500/30 text-left font-black text-xs text-slate-200 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <span>🔍 Search Mutual Fund</span>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </button>
                  <button 
                    onClick={() => setSyncMethod("cas")}
                    className="p-3.5 rounded-xl border border-blue-500/10 bg-slate-950/30 hover:bg-blue-600/10 hover:border-blue-500/30 text-left font-black text-xs text-slate-200 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <span>📄 Upload CAS Statement (PDF/XML)</span>
                    <Upload className="w-4 h-4 text-blue-400" />
                  </button>
                  <button 
                    onClick={() => setSyncMethod("bank")}
                    className="p-3.5 rounded-xl border border-blue-500/10 bg-slate-950/30 hover:bg-blue-600/10 hover:border-blue-500/30 text-left font-black text-xs text-slate-200 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <span>🏦 Sync via CAMS / Groww / Zerodha</span>
                    <KeyRound className="w-4 h-4 text-blue-400" />
                  </button>
                  <button 
                    onClick={() => setSyncMethod("manual")}
                    className="p-3.5 rounded-xl border border-blue-500/10 bg-slate-950/30 hover:bg-blue-600/10 hover:border-blue-500/30 text-left font-black text-xs text-slate-200 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <span>🔗 Manual Entry Folio</span>
                    <Plus className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              )}

              {syncMethod === "search" && (
                <div className="flex flex-col gap-4 text-xs font-semibold">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Search Fund Name</label>
                    <input 
                      type="text" 
                      value={addSearchQuery}
                      onChange={(e) => setAddSearchQuery(e.target.value)}
                      placeholder="Type SBI, HDFC, Quant..."
                      className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none focus:border-blue-500 text-xs font-semibold"
                    />
                  </div>

                  {addSearchQuery && (
                    <div className="max-h-[160px] overflow-y-auto border border-blue-500/15 rounded-xl bg-slate-950/60 divide-y divide-blue-500/10">
                      {ALL_DISCOVERABLE_FUNDS.filter(f => f.name.toLowerCase().includes(addSearchQuery.toLowerCase())).map(f => (
                        <div 
                          key={f.name} 
                          onClick={() => handleSearchAddSelect(f)}
                          className={`p-3 cursor-pointer hover:bg-blue-600/10 transition-colors flex justify-between items-center ${selectedSearchAddFund?.name === f.name ? "bg-blue-600/10 border-l-2 border-blue-500" : ""}`}
                        >
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-white text-xs">{f.name}</span>
                            <span className="text-[9px] text-slate-500 uppercase mt-0.5">{f.cat} &bull; {f.house}</span>
                          </div>
                          <span className="text-emerald-400 font-mono text-[10px] font-black">NAV ₹{f.nav}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedSearchAddFund && (
                    <div className="p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl text-left flex flex-col gap-1 text-[11px]">
                      <span className="text-white font-bold">Selected: {selectedSearchAddFund.name}</span>
                      <span className="text-slate-400">Standard CAGR: {selectedSearchAddFund.rate}%</span>
                      <span className="text-slate-400">Risk Profile: {selectedSearchAddFund.risk}</span>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end border-t border-blue-500/10 pt-3">
                    <button 
                      onClick={() => setSyncMethod("menu")}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleApplySearchAdd}
                      disabled={!selectedSearchAddFund}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 disabled:opacity-50"
                    >
                      Add Fund
                    </button>
                  </div>
                </div>
              )}

              {syncMethod === "cas" && (
                <div className="flex flex-col gap-4 text-xs">
                  {!isScanning ? (
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) handleCasDrop(file);
                      }}
                      className="border-2 border-dashed border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/20 group transition-all"
                    >
                      <input 
                        type="file" 
                        accept=".pdf,.xml"
                        id="casFile"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCasDrop(file);
                        }}
                      />
                      <label htmlFor="casFile" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-8 h-8 text-blue-500 group-hover:scale-105 duration-200" />
                        <span className="font-bold text-white block mt-3">Drag & Drop CAS Statement</span>
                        <span className="text-[10px] text-slate-500 mt-1 block">Supports CAMS/KFintech CAS (PDF/XML)</span>
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
                      <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                      <div className="flex flex-col gap-1 w-full mt-2">
                        <span className="text-white font-bold text-xs">{scanPhase}</span>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 relative">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${scanProgress}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-start">
                    <button 
                      onClick={() => setSyncMethod("menu")}
                      className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {syncMethod === "bank" && (
                <div className="flex flex-col gap-4 text-xs font-semibold">
                  {!otpSent ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest">PAN Card / PAN Number</label>
                        <input 
                          type="text" 
                          value={panCard}
                          onChange={(e) => setPanCard(e.target.value)}
                          placeholder="ABCDE1234F"
                          className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none focus:border-blue-500 uppercase"
                        />
                      </div>
                      <button 
                        onClick={handleBankSync}
                        disabled={!panCard}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider disabled:opacity-50"
                      >
                        Request Otp code
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <span className="text-[11px] text-slate-400 leading-normal block">OTP verification code has been dispatched to PAN registered email & phone.</span>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest">Verification Code (OTP)</label>
                        <input 
                          type="text" 
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button 
                        onClick={handleVerifyOtp}
                        disabled={!otpCode || isSyncingBank}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        {isSyncingBank && <RefreshCw className="w-4 h-4 animate-spin" />}
                        Verify & Sync holding
                      </button>
                    </div>
                  )}

                  <div className="flex justify-start">
                    <button 
                      onClick={() => {
                        setSyncMethod("menu");
                        setOtpSent(false);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {syncMethod === "manual" && (
                <form onSubmit={handleManualSubmit} className="flex flex-col gap-3.5 text-xs text-left font-semibold">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-400 uppercase tracking-widest">Fund Name</label>
                      <input 
                        type="text" 
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        placeholder="SBI Small Cap"
                        required
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-400 uppercase tracking-widest">AMC House</label>
                      <input 
                        type="text" 
                        value={manualAMC}
                        onChange={(e) => setManualAMC(e.target.value)}
                        placeholder="SBI Mutual Fund"
                        required
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-400 uppercase tracking-widest">Category</label>
                      <select 
                        value={manualCategory}
                        onChange={(e) => setManualCategory(e.target.value as any)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                      >
                        <option value="Small Cap">Small Cap</option>
                        <option value="Flexi Cap">Flexi Cap</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Large Cap">Large Cap</option>
                        <option value="Mid Cap">Mid Cap</option>
                        <option value="Index">Index</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-400 uppercase tracking-widest">Investment Type</label>
                      <select 
                        value={manualType}
                        onChange={(e) => setManualType(e.target.value as any)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                      >
                        <option value="SIP">Monthly SIP</option>
                        <option value="Lumpsum">Lumpsum Investment</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-400 uppercase tracking-widest">Amount (Principal)</label>
                      <input 
                        type="number" 
                        value={manualAmount}
                        onChange={(e) => setManualAmount(e.target.value)}
                        placeholder="10000"
                        required
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] text-slate-400 uppercase tracking-widest">Purchase NAV</label>
                      <input 
                        type="number" 
                        step="any"
                        value={manualNAV}
                        onChange={(e) => setManualNAV(e.target.value)}
                        placeholder="100.00"
                        required
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase tracking-widest">Folio Number (Optional)</label>
                    <input 
                      type="text" 
                      value={manualFolio}
                      onChange={(e) => setManualFolio(e.target.value)}
                      placeholder="1092831/12"
                      className="px-3 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 justify-end border-t border-blue-500/10 pt-3.5">
                    <button 
                      type="button"
                      onClick={() => setSyncMethod("menu")}
                      className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 cursor-pointer"
                    >
                      Add Folio
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. TRANSACTION BUY MORE / REDEEM DIALOG */}
      <AnimatePresence>
        {transactionModal && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm glass-card rounded-3xl border border-blue-500/25 p-7 shadow-2xl relative bg-slate-900/95 text-left flex flex-col gap-6"
            >
              <button
                onClick={() => setTransactionModal(null)}
                className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-blue-500/10 pb-4">
                <span className="text-xl bg-slate-950/50 p-2 rounded-xl border border-blue-500/20 w-10 h-10 flex items-center justify-center">{transactionModal.fund.logo}</span>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{transactionModal.type === "buy" ? "Buy More Units" : "Redeem Holding Units"}</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{transactionModal.fund.name}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 text-xs font-semibold">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest">Transaction Amount ({activeCurrency.symbol})</label>
                  <input 
                    type="number" 
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    placeholder="10000"
                    required
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>Current NAV: ₹{transactionModal.fund.nav}</span>
                  <span>Est. Units: {transactionAmount ? (parseFloat(transactionAmount) / transactionModal.fund.nav).toFixed(2) : 0}</span>
                </div>

                <button 
                  onClick={handleTransactionApply}
                  disabled={!transactionAmount}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider disabled:opacity-50"
                >
                  Confirm Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT FOLIO DIALOG MODAL */}
      <AnimatePresence>
        {editingFund && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-3xl border border-blue-500/25 p-7 shadow-2xl relative bg-slate-900/95 text-left flex flex-col gap-6"
            >
              <button
                onClick={() => setEditingFund(null)}
                className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-blue-500/10 pb-4">
                <span className="text-xl bg-slate-950/50 p-2 rounded-xl border border-blue-500/20 w-10 h-10 flex items-center justify-center">{editingFund.logo}</span>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Edit Folio Details</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{editingFund.name}</p>
                </div>
              </div>

              <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase tracking-widest">Invested Cost ({activeCurrency.symbol})</label>
                    <input 
                      type="number" 
                      value={editInvested}
                      onChange={(e) => setEditInvested(e.target.value)}
                      required
                      className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase tracking-widest">Current Value ({activeCurrency.symbol})</label>
                    <input 
                      type="number" 
                      value={editCurrent}
                      onChange={(e) => setEditCurrent(e.target.value)}
                      required
                      className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase tracking-widest">XIRR Return (%)</label>
                    <input 
                      type="number" 
                      step="any"
                      value={editXirr}
                      onChange={(e) => setEditXirr(e.target.value)}
                      required
                      className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase tracking-widest">SIP Amount ({activeCurrency.symbol})</label>
                    <input 
                      type="number" 
                      value={editSipAmount}
                      onChange={(e) => setEditSipAmount(e.target.value)}
                      required
                      className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase tracking-widest">Folio Number</label>
                    <input 
                      type="text" 
                      value={editFolio}
                      onChange={(e) => setEditFolio(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 uppercase tracking-widest">Broker Source</label>
                    <input 
                      type="text" 
                      value={editBroker}
                      onChange={(e) => setEditBroker(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/15 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider mt-2 cursor-pointer"
                >
                  Save Folio Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. FUND DETAILS MODAL */}
      <AnimatePresence>
        {selectedFund && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-2xl glass-card rounded-3xl border border-blue-500/25 p-7 shadow-2xl relative bg-slate-900/95 text-left flex flex-col gap-6 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedFund(null)}
                className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-blue-500/10 pb-4">
                <span className="text-2xl bg-slate-950/50 p-2 rounded-2xl border border-blue-500/20 w-12 h-12 flex items-center justify-center">{selectedFund.logo}</span>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">{selectedFund.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{selectedFund.category} &bull; Folio {selectedFund.folioNumber || "None"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[8px] text-slate-500 uppercase block font-bold">Fund Manager</span>
                  <span className="text-xs font-bold text-slate-300 block mt-1">{selectedFund.manager}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[8px] text-slate-500 uppercase block font-bold">Expense Ratio</span>
                  <span className="text-xs font-bold text-slate-300 block mt-1">{selectedFund.expenseRatio}%</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[8px] text-slate-500 uppercase block font-bold">Current NAV</span>
                  <span className="text-xs font-bold text-slate-300 block mt-1">₹{selectedFund.nav}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[8px] text-slate-500 uppercase block font-bold">Fund Size (AUM)</span>
                  <span className="text-xs font-bold text-slate-300 block mt-1">₹{selectedFund.aum.toLocaleString()} Cr</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <div className="p-4 bg-slate-950/30 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Broker / Source</span>
                  <span className="text-white block mt-1 leading-normal font-black text-sm">{selectedFund.broker || "Self"}</span>
                </div>
                <div className="p-4 bg-slate-950/30 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Exit Load Details</span>
                  <span className="text-slate-300 block mt-1 leading-normal font-semibold text-[11px]">{selectedFund.exitLoad}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-1">Top Holdings</span>
                  <div className="flex flex-col gap-2">
                    {selectedFund.holdings.map((h, i) => (
                      <div key={i} className="flex justify-between items-center text-slate-300 font-semibold">
                        <span>🏢 {h.name}</span>
                        <span className="font-mono text-white">{h.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-1">Sector Allocations</span>
                  <div className="flex flex-col gap-2">
                    {selectedFund.sectors.map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-slate-300 font-semibold">
                        <span>💼 {s.name}</span>
                        <span className="font-mono text-white">{s.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-800 pb-1">CAGR Returns Timeline</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                    <span className="text-[8px] text-slate-500 uppercase block font-bold">1Y CAGR</span>
                    <span className="text-xs font-mono font-black text-emerald-400 mt-1 block">+{selectedFund.oneYearReturn}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                    <span className="text-[8px] text-slate-500 uppercase block font-bold">3Y CAGR</span>
                    <span className="text-xs font-mono font-black text-emerald-400 mt-1 block">+{selectedFund.threeYearReturn}%</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                    <span className="text-[8px] text-slate-500 uppercase block font-bold">5Y CAGR</span>
                    <span className="text-xs font-mono font-black text-emerald-400 mt-1 block">+{selectedFund.fiveYearReturn}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="font-semibold">
                  <span className="text-[9px] text-blue-400 font-bold block uppercase tracking-widest">AI Portfolio Advisor Insight</span>
                  <p className="text-slate-300 mt-1 leading-relaxed">{selectedFund.aiInsight} Recommend maintaining target allocation.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. MUTUAL FUND COMPARISON MODAL */}
      <AnimatePresence>
        {showComparisonModal && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-4xl glass-card rounded-3xl border border-blue-500/25 p-7 shadow-2xl relative bg-slate-900/95 text-left flex flex-col gap-6 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => {
                  setShowComparisonModal(false);
                  setComparisonList([]);
                }}
                className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-blue-500/10 pb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">Mutual Fund Comparison Matrix</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Compare up to 4 funds side-by-side</p>
                </div>
              </div>

              <div className="overflow-x-auto border border-[var(--border-color)] rounded-2xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/30 border-b border-[var(--border-color)]">
                      <th className="p-3 text-[9px] uppercase tracking-wider text-slate-500 font-bold w-[180px]">Parameters</th>
                      {comparisonList.map(f => (
                        <th key={f.id} className="p-3 text-center w-[180px] font-black text-white">
                          <span>{f.logo} {f.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/20 font-semibold text-slate-300">
                    <tr>
                      <td className="p-3 bg-slate-950/10 font-bold text-slate-400">Category</td>
                      {comparisonList.map(f => (
                        <td key={f.id} className="p-3 text-center">{f.category}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-950/10 font-bold text-slate-400">1Y Returns</td>
                      {comparisonList.map(f => (
                        <td key={f.id} className="p-3 text-center text-emerald-400 font-mono">{f.oneYearReturn}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-950/10 font-bold text-slate-400">3Y Returns</td>
                      {comparisonList.map(f => (
                        <td key={f.id} className="p-3 text-center text-emerald-400 font-mono">{f.threeYearReturn}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-950/10 font-bold text-slate-400">AUM (Fund Size)</td>
                      {comparisonList.map(f => (
                        <td key={f.id} className="p-3 text-center font-mono">₹{f.aum.toLocaleString()} Cr</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-950/10 font-bold text-slate-400">Expense Ratio</td>
                      {comparisonList.map(f => (
                        <td key={f.id} className="p-3 text-center font-mono">{f.expenseRatio}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-950/10 font-bold text-slate-400">Sharpe Ratio</td>
                      {comparisonList.map(f => (
                        <td key={f.id} className="p-3 text-center font-mono text-blue-400">{f.sharpeRatio}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-950/10 font-bold text-slate-400">Alpha</td>
                      {comparisonList.map(f => (
                        <td key={f.id} className="p-3 text-center font-mono text-emerald-500">{f.alpha}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-950/10 font-bold text-slate-400">Beta</td>
                      {comparisonList.map(f => (
                        <td key={f.id} className="p-3 text-center font-mono text-slate-400">{f.beta}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 bg-slate-950/10 font-bold text-slate-400">Risk Profile</td>
                      {comparisonList.map(f => (
                        <td key={f.id} className={`p-3 text-center font-black ${f.riskLevel === "Very High" ? "text-rose-500" : "text-emerald-500"}`}>{f.riskLevel}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setShowComparisonModal(false);
                    setComparisonList([]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  Clear Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
