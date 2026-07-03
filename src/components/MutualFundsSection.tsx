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
  BookOpen
} from "lucide-react";
import RollingNumber from "./RollingNumber";

interface MutualFundsSectionProps {
  activeCurrency: { code: string; symbol: string };
  format: (value: number, showSymbol?: boolean) => string;
}

interface FundData {
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
}

const FUNDS_DATA: FundData[] = [
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
];

export default function MutualFundsSection({ activeCurrency, format }: MutualFundsSectionProps) {
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

  // Interactive SIP Calculator states
  const [sipMonthlyInput, setSipMonthlyInput] = useState(10000);
  const [sipDurationYears, setSipDurationYears] = useState(10);
  const [sipExpectedReturn, setSipExpectedReturn] = useState(12);

  // Discover Carousel active filter
  const [discoverFilter, setDiscoverFilter] = useState("High Growth");

  // Table Row Toggle Expanded View
  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Comparison Selection Handler
  const toggleComparison = (fund: FundData) => {
    if (comparisonList.some(f => f.id === fund.id)) {
      setComparisonList(prev => prev.filter(f => f.id !== fund.id));
    } else {
      if (comparisonList.length >= 4) return; // Cap at 4
      setComparisonList(prev => [...prev, fund]);
    }
  };

  // Sort & Filter Logic
  const filteredFunds = FUNDS_DATA.filter((fund) => {
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

  return (
    <div className="flex flex-col gap-8 text-left">
      
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
              <RollingNumber value={1245678} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]/20">
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              +₹1,23,456 <TrendingUp className="w-3.5 h-3.5" />
            </span>
            {/* Miniature Sparkline */}
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
            {/* Miniature Sparkline */}
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
            {/* Miniature Sparkline */}
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
              <RollingNumber value={1012222} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]/20">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Current Allocation
            </span>
            <div className="w-4.5 h-4.5 rounded-full border border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-blue-400 animate-spin animate-duration-1000">
              <Layers className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTERS & COMPARE TRIGGERS */}
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
            {/* Sort Dropdown */}
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

            {/* Risk Filter */}
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

            {/* Comparison Drawer Opener */}
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

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 border-t border-[var(--border-color)]/20 pt-3">
          {["All", "Small Cap", "Flexi Cap", "Hybrid", "Large Cap", "Mid Cap"].map((cat) => {
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
            
            {/* Headers */}
            <div className="grid grid-cols-12 gap-2 p-4 bg-slate-950/20 border-b border-[var(--border-color)] text-[10px] font-black text-slate-500 uppercase tracking-widest text-left items-center">
              <div className="col-span-4">Fund Name</div>
              <div className="col-span-2 text-right">Invested</div>
              <div className="col-span-2 text-right">Current</div>
              <div className="col-span-2 text-right">P/L</div>
              <div className="col-span-1 text-right">XIRR</div>
              <div className="col-span-1 text-center">Compare</div>
            </div>

            {/* List Rows */}
            <div className="divide-y divide-[var(--border-color)]/30">
              {filteredFunds.map((fund) => {
                const profit = fund.current - fund.invested;
                const isProfit = profit >= 0;
                const isExpanded = !!expandedRows[fund.id];
                const isCompared = comparisonList.some(f => f.id === fund.id);

                return (
                  <div key={fund.id} className="flex flex-col hover:bg-slate-900/10 transition-colors">
                    
                    {/* Row Content */}
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
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{fund.category} &bull; {fund.house}</span>
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

                      {/* Compare Checkbox */}
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

                    {/* Expand Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-950/30 border-t border-[var(--border-color)]/20"
                        >
                          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                            <div className="flex flex-col gap-1 bg-slate-950/20 border border-[var(--border-color)]/25 p-3 rounded-xl">
                              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">SIP Status</span>
                              <span className={`font-bold block ${fund.sipStatus === "Active" ? "text-emerald-500" : fund.sipStatus === "Paused" ? "text-amber-500" : "text-slate-400"}`}>
                                {fund.sipStatus === "Active" ? `🟢 Active (₹${fund.sipAmount.toLocaleString()}/mo)` : fund.sipStatus === "Paused" ? "🟡 Paused" : "✕ No Active SIP"}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1 bg-slate-950/20 border border-[var(--border-color)]/25 p-3 rounded-xl">
                              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">1Y & 3Y Returns</span>
                              <span className="font-bold text-white block">
                                1Y: <span className="text-emerald-500">{fund.oneYearReturn}%</span> &bull; 3Y: <span className="text-emerald-500">{fund.threeYearReturn}%</span>
                              </span>
                            </div>
                            <div className="flex flex-col gap-1 bg-slate-950/20 border border-[var(--border-color)]/25 p-3 rounded-xl">
                              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Expense Ratio & AUM</span>
                              <span className="font-bold text-slate-300 block">
                                {fund.expenseRatio}% &bull; ₹{fund.aum.toLocaleString()} Cr
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

                            <div className="md:col-span-4 p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] text-slate-300 font-semibold flex items-center gap-1.5 mt-1">
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
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">12 Active</span>
            </div>

            <div className="flex flex-col gap-3.5 text-xs leading-relaxed font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Monthly SIP Amount</span>
                <span className="text-[var(--text-color)] font-mono font-black text-sm">₹45,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Active SIP Count</span>
                <span className="text-[var(--text-color)] font-mono font-bold">12 Funds</span>
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

          {/* B. ASSET ALLOCATION DONUT CHART */}
          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-950/10 flex flex-col gap-4">
            <span className="text-xs font-black uppercase tracking-wider text-white border-b border-[var(--border-color)] pb-3 block">Asset Allocation</span>
            
            <div className="flex justify-center items-center py-2 relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="52" stroke="transparent" strokeWidth="8" fill="none" />
                <circle 
                  cx="72" cy="72" r="52" stroke="#3b82f6" strokeWidth="10" fill="none"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - 0.55)}
                  strokeLinecap="round"
                />
                <circle 
                  cx="72" cy="72" r="52" stroke="#10b981" strokeWidth="10" fill="none"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - 0.15)}
                  className="origin-center transform rotate-[198deg]"
                />
                <circle 
                  cx="72" cy="72" r="52" stroke="#a855f7" strokeWidth="10" fill="none"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - 0.15)}
                  className="origin-center transform rotate-[252deg]"
                />
                <circle 
                  cx="72" cy="72" r="52" stroke="#f59e0b" strokeWidth="10" fill="none"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - 0.15)}
                  className="origin-center transform rotate-[306deg]"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-black text-white font-mono">100%</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Compounded</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-slate-400">Equity (55%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-400">Debt (15%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                <span className="text-slate-400">Hybrid (15%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-400">Index (15%)</span>
              </div>
            </div>
          </div>
          
          {/* C. TOP PERFORMING FUNDS */}
          <div className="glass-card p-6 rounded-2xl border border-[var(--border-color)] bg-slate-950/10 flex flex-col gap-4">
            <span className="text-xs font-black uppercase tracking-wider text-white border-b border-[var(--border-color)] pb-3 block">Top Performers (1Y)</span>
            <div className="flex flex-col gap-3">
              {FUNDS_DATA.slice(0, 3).map((f) => (
                <div key={f.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-800/40 flex items-center justify-center">{f.logo}</span>
                    <span className="font-bold text-slate-300 truncate max-w-[120px]">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-black">+{f.oneYearReturn}%</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. DISCOVER MUTUAL FUNDS RECOMMENDATIONS CAROUSEL */}
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
          {FUNDS_DATA.filter(f => {
            if (discoverFilter === "High Growth") return f.oneYearReturn >= 20;
            if (discoverFilter === "Tax Saving (ELSS)") return f.category === "ELSS" || f.category === "Flexi Cap";
            if (discoverFilter === "Index Funds") return f.category === "Index" || f.category === "Large Cap";
            if (discoverFilter === "Low Risk") return f.riskLevel === "Moderate";
            return f.oneYearReturn >= 22; // AI Picks
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
              <defs>
                <linearGradient id="calcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#0B1020" />
                </linearGradient>
              </defs>
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

      {/* 6. FUND DETAILS MODAL */}
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
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{selectedFund.category} &bull; {selectedFund.house}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Fund Manager</span>
                  <span className="text-xs font-bold text-slate-300 block mt-1">{selectedFund.manager}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Expense Ratio</span>
                  <span className="text-xs font-bold text-slate-300 block mt-1">{selectedFund.expenseRatio}%</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Current NAV</span>
                  <span className="text-xs font-bold text-slate-300 block mt-1">₹{selectedFund.nav}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-[var(--border-color)]/20 rounded-xl">
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Fund Size (AUM)</span>
                  <span className="text-xs font-bold text-slate-300 block mt-1">₹{selectedFund.aum.toLocaleString()} Cr</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                <div className="p-4 bg-slate-950/30 border border-[var(--border-color)]/20 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Risk Profile</span>
                    <span className="text-sm font-black text-rose-500 mt-1 block">{selectedFund.riskLevel}</span>
                  </div>
                  <svg className="w-12 h-6 overflow-visible text-rose-500">
                    <path d="M 0 16 A 12 12 0 0 1 24 16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                    <path d="M 0 16 A 12 12 0 0 1 24 16" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="37.7" strokeDashoffset="12.5" />
                  </svg>
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

      {/* 7. MUTUAL FUND COMPARISON MODAL */}
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
