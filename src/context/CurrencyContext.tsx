"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CurrencyDetails {
  code: string;
  symbol: string;
  flag: string;
  name: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyDetails[] = [
  { code: "INR", symbol: "₹", flag: "🇮🇳", name: "Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound", locale: "en-GB" },
  { code: "JPY", symbol: "¥", flag: "🇯🇵", name: "Japanese Yen", locale: "ja-JP" },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪", name: "UAE Dirham", locale: "ar-AE" },
  { code: "SGD", symbol: "S$", flag: "🇸🇬", name: "Singapore Dollar", locale: "en-SG" },
  { code: "AUD", symbol: "A$", flag: "🇦🇺", name: "Australian Dollar", locale: "en-AU" },
  { code: "CAD", symbol: "C$", flag: "🇨🇦", name: "Canadian Dollar", locale: "en-CA" }
];

// Offline static exchange rates (fallback) with INR as base
const STATIC_FALLBACK_RATES: Record<string, number> = {
  INR: 1.0,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.91,
  AED: 0.044,
  SGD: 0.016,
  AUD: 0.018,
  CAD: 0.016
};

interface CurrencyContextType {
  activeCurrency: CurrencyDetails;
  setActiveCurrency: (code: string) => void;
  rates: Record<string, number>;
  convert: (valueInINR: number) => number;
  format: (valueInINR: number, showSymbol?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [activeCurrency, setActiveCurrencyState] = useState<CurrencyDetails>(SUPPORTED_CURRENCIES[0]);
  const [rates, setRates] = useState<Record<string, number>>(STATIC_FALLBACK_RATES);

  // 1. Detect browser locale and preselect currency
  useEffect(() => {
    if (typeof window === "undefined") return;

    // A. Check if user already has a saved selection
    const savedCurrencyCode = localStorage.getItem("fincody_selected_currency");
    if (savedCurrencyCode) {
      const match = SUPPORTED_CURRENCIES.find((c) => c.code === savedCurrencyCode);
      if (match) {
        setActiveCurrencyState(match);
        return;
      }
    }

    // B. Detect from browser locale
    const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || "";
    const lang = browserLang.toLowerCase();

    let autoCode = "INR"; // Default to INR
    if (lang.includes("us") || lang.includes("en-us")) {
      autoCode = "USD";
    } else if (lang.includes("gb") || lang.includes("en-gb")) {
      autoCode = "GBP";
    } else if (lang.includes("jp") || lang.includes("ja")) {
      autoCode = "JPY";
    } else if (lang.includes("ae") || lang.includes("ar-ae")) {
      autoCode = "AED";
    } else if (lang.includes("sg") || lang.includes("en-sg")) {
      autoCode = "SGD";
    } else if (lang.includes("au") || lang.includes("en-au")) {
      autoCode = "AUD";
    } else if (lang.includes("ca") || lang.includes("en-ca") || lang.includes("fr-ca")) {
      autoCode = "CAD";
    } else if (
      lang.includes("de") || lang.includes("fr") || lang.includes("it") || 
      lang.includes("es") || lang.includes("nl") || lang.includes("eu")
    ) {
      autoCode = "EUR";
    }

    const matchedCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === autoCode);
    if (matchedCurrency) {
      setActiveCurrencyState(matchedCurrency);
      localStorage.setItem("fincody_selected_currency", matchedCurrency.code);
    }
  }, []);

  // 2. Fetch and Cache Exchange Rates (12 hours lifetime)
  useEffect(() => {
    const fetchRates = async () => {
      const cacheKey = "fincody_cached_rates";
      const timestampKey = "fincody_rates_timestamp";
      const twelveHours = 12 * 60 * 60 * 1000;

      try {
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem(cacheKey);
          const cachedTime = localStorage.getItem(timestampKey);
          const now = Date.now();

          if (cached && cachedTime && now - parseInt(cachedTime) < twelveHours) {
            setRates(JSON.parse(cached));
            return;
          }
        }

        // Fetch new rates (INR base)
        const res = await fetch("https://open.er-api.com/v6/latest/INR");
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        if (data && data.rates) {
          // Filter only supported currencies to save storage space
          const filteredRates: Record<string, number> = {};
          SUPPORTED_CURRENCIES.forEach((c) => {
            filteredRates[c.code] = data.rates[c.code] || STATIC_FALLBACK_RATES[c.code];
          });

          setRates(filteredRates);
          localStorage.setItem(cacheKey, JSON.stringify(filteredRates));
          localStorage.setItem(timestampKey, Date.now().toString());
          console.log("Lazy-loaded and cached fresh exchange rates from API.");
        }
      } catch (e) {
        console.warn("Failed to fetch live exchange rates, falling back to static rates:", e);
        // Fall back to local storage cached rates if available, else static rates
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setRates(JSON.parse(cached));
        } else {
          setRates(STATIC_FALLBACK_RATES);
        }
      }
    };

    fetchRates();
  }, []);

  const setActiveCurrency = (code: string) => {
    const match = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    if (match) {
      setActiveCurrencyState(match);
      localStorage.setItem("fincody_selected_currency", match.code);
    }
  };

  // Convert helper
  const convert = (valueInINR: number): number => {
    const rate = rates[activeCurrency.code] || STATIC_FALLBACK_RATES[activeCurrency.code] || 1;
    return valueInINR * rate;
  };

  // Format helper
  const format = (valueInINR: number, showSymbol = true): string => {
    const converted = convert(valueInINR);
    
    // Formatting configurations based on currency locale rules
    let formattedVal = "";
    try {
      // INR uses lac/crore formatting (e.g. 12,45,000)
      if (activeCurrency.code === "INR") {
        formattedVal = new Intl.NumberFormat(activeCurrency.locale, {
          maximumFractionDigits: 0
        }).format(converted);
      } else {
        // USD, EUR, etc. use million/billion formatting
        formattedVal = new Intl.NumberFormat(activeCurrency.locale, {
          maximumFractionDigits: converted < 100 ? 2 : 0
        }).format(converted);
      }
    } catch (e) {
      formattedVal = converted.toFixed(0);
    }

    return showSymbol ? `${activeCurrency.symbol}${formattedVal}` : formattedVal;
  };

  return (
    <CurrencyContext.Provider value={{ activeCurrency, setActiveCurrency, rates, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
