"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency, SUPPORTED_CURRENCIES, CurrencyDetails } from "@/context/CurrencyContext";
import { Globe, Sparkles } from "lucide-react";

interface CurrencyRibbonProps {
  variant?: "full" | "compact";
}

export default function CurrencyRibbon({ variant = "full" }: CurrencyRibbonProps) {
  const { activeCurrency, setActiveCurrency } = useCurrency();
  const ribbonRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [burstCurrency, setBurstCurrency] = useState<string | null>(null);
  const [particles, setParticles] = useState<any[]>([]);

  // 1. Mouse wheel horizontal scrolling listener
  const handleWheel = (e: React.WheelEvent) => {
    if (ribbonRef.current) {
      e.preventDefault();
      ribbonRef.current.scrollLeft += e.deltaY;
    }
  };

  // 2. Select currency with haptic haptic/visual bounce and particle burst
  const handleSelect = (currency: CurrencyDetails, event: React.MouseEvent) => {
    if (activeCurrency.code === currency.code) return;

    setActiveCurrency(currency.code);
    setBurstCurrency(currency.code);

    // Get click location relative to container for particle emitter
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const parentRect = ribbonRef.current?.getBoundingClientRect();
    const originX = rect.left - (parentRect?.left || 0) + rect.width / 2;
    const originY = rect.top - (parentRect?.top || 0) + rect.height / 2;

    // Generate burst particles
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Math.random(),
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 2, // Slight upward trajectory
      color: ["#38bdf8", "#60a5fa", "#67e8f9", "#10b981", "#fbbf24"][i % 5]
    }));

    setParticles(newParticles);

    // Center selected item smoothly in ribbon scroll view
    if (ribbonRef.current) {
      const itemLeft = rect.left - (parentRect?.left || 0) + ribbonRef.current.scrollLeft;
      const targetScroll = itemLeft - ribbonRef.current.clientWidth / 2 + rect.width / 2;
      ribbonRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
    }

    setTimeout(() => setBurstCurrency(null), 600);
  };

  // Drifting background light decor animation coordinates
  const [ambientX, setAmbientX] = useState(0);
  useEffect(() => {
    const ambientInterval = setInterval(() => {
      setAmbientX((prev) => (prev === 0 ? 100 : 0));
    }, 8000);
    return () => clearInterval(ambientInterval);
  }, []);

  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <div className="relative select-none z-40">
        {/* 1. Mobile Dropdown selector (only visible on phones / screen widths < 768px) */}
        <div className="block md:hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-xs font-black select-none">
            <span className="w-4 h-3 flex items-center justify-center overflow-hidden rounded-sm shrink-0">
              <img 
                src={`https://flagcdn.com/w20/${activeCurrency.code.substring(0, 2).toLowerCase()}.png`} 
                className="w-full h-full object-cover"
                alt={activeCurrency.code}
              />
            </span>
            <select
              value={activeCurrency.code}
              onChange={(e) => setActiveCurrency(e.target.value)}
              className="bg-transparent text-white font-black uppercase tracking-wider focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code} className="bg-slate-950 text-white font-sans text-xs">
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Tablet & Laptop Chips selector (only visible on screen widths >= 768px) */}
        <div 
          className="hidden md:flex items-center gap-1.5 flex-wrap py-1 relative max-w-[500px]"
        >
          {SUPPORTED_CURRENCIES.map((currency) => {
            const isActive = activeCurrency.code === currency.code;
            return (
              <motion.div
                key={currency.code}
                onClick={(e) => handleSelect(currency, e)}
                className={`relative shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? "bg-slate-900/80 border-blue-500/50 shadow shadow-blue-500/5 text-white" 
                    : "bg-slate-950/20 border-slate-800/40 text-slate-400 hover:text-slate-200 hover:border-slate-700/60"
                }`}
                style={{
                  opacity: isActive ? 1.0 : 0.65
                }}
                whileHover={{
                  scale: 1.04,
                  y: -0.5,
                  opacity: 1
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeRibbonOutlineCompact"
                    className="absolute inset-0 rounded-full border border-blue-400/35 pointer-events-none shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                    animate={{ scale: [1, 1.04, 1], opacity: [0.7, 0.9, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  />
                )}

                <span className="w-3.5 h-2.5 flex items-center justify-center filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] overflow-hidden rounded-sm">
                  <img 
                    src={`https://flagcdn.com/w20/${currency.code.substring(0, 2).toLowerCase()}.png`} 
                    className="w-full h-full object-cover"
                    alt={currency.code}
                  />
                </span>

                <div className="flex items-baseline gap-0.5 text-[9px] font-black uppercase tracking-wider">
                  <span>{currency.code}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 mt-6 mb-2 z-40 select-none">
      {/* 3D Glassmorphism Outer Ribbon Panel */}
      <div 
        className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl shadow-lg shadow-black/20 p-3 flex items-center justify-between gap-4"
        style={{
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255,255,255,0.05)"
        }}
      >
        {/* Animated ambient gradient blob behind the ribbon */}
        <motion.div 
          className="absolute -top-12 left-0 w-44 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"
          animate={{ x: ambientX }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        
        {/* Left Side Header: Apple VisionOS / Bloomberg modernize theme */}
        <div className="hidden lg:flex items-center gap-2 pl-2 shrink-0 border-r border-[var(--border-color)] pr-4 py-1 text-slate-500">
          <Globe className="w-4 h-4 text-blue-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-subtitle)] flex items-center gap-1">
            Global Assets Denomination
          </span>
        </div>

        {/* Scrollable Chips Container */}
        <div 
          ref={ribbonRef}
          onWheel={handleWheel}
          className="flex-1 overflow-x-auto flex items-center gap-3.5 scrollbar-none py-1.5 px-2 relative cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: "smooth" }}
        >
          {SUPPORTED_CURRENCIES.map((currency) => {
            const isActive = activeCurrency.code === currency.code;
            return (
              <motion.div
                key={currency.code}
                onClick={(e) => handleSelect(currency, e)}
                className={`relative shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? "bg-slate-900/60 border-blue-500/50 shadow-md shadow-blue-500/5 text-white" 
                    : "bg-slate-950/20 border-slate-800/40 text-slate-400 hover:text-slate-200 hover:border-slate-700/60"
                }`}
                style={{
                  opacity: isActive ? 1.0 : 0.55
                }}
                whileHover={{
                  scale: 1.04,
                  y: -1.5,
                  opacity: 1
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Active Outline Pulse Glow */}
                {isActive && (
                  <motion.div 
                    layoutId="activeRibbonOutline"
                    className="absolute inset-0 rounded-full border border-blue-400/35 pointer-events-none shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                    animate={{ scale: [1, 1.04, 1], opacity: [0.7, 0.9, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  />
                )}

                <motion.span 
                  className="w-5 h-3.5 flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] overflow-hidden rounded-sm"
                  animate={isActive ? { y: [-1.5, 0, -1.5], scale: 1.05 } : {}}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  whileHover={{ rotate: 12, scale: 1.15 }}
                >
                  <img 
                    src={`https://flagcdn.com/w20/${currency.code.substring(0, 2).toLowerCase()}.png`} 
                    className="w-full h-full object-cover"
                    alt={currency.code}
                  />
                </motion.span>

                {/* Currency specifications */}
                <div className="flex items-baseline gap-1 text-[11px] font-black uppercase tracking-wider">
                  <span>{currency.code}</span>
                  <span className="text-[9px] font-semibold text-slate-500">{currency.symbol}</span>
                </div>

                {/* Micro particle sparkles inside selection burst */}
                {burstCurrency === currency.code && (
                  <span className="absolute -top-1 -right-1">
                    <Sparkles className="w-2.5 h-2.5 text-blue-400 animate-bounce" />
                  </span>
                )}
              </motion.div>
            );
          })}

          {/* Render Selection Particles */}
          <AnimatePresence>
            {particles.map((p) => (
              <motion.circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={2}
                fill={p.color}
                initial={{ opacity: 0.9, scale: 1 }}
                animate={{
                  x: p.x + p.vx * 12,
                  y: p.y + p.vy * 12,
                  opacity: 0,
                  scale: 0.2
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Right Side Indicator: Current status */}
        <div className="hidden md:flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">
          <span>Rates: Live</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
