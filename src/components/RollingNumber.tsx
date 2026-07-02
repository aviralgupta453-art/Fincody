"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";

interface RollingNumberProps {
  value: number; // The value is always passed in INR (the base currency)
  showSymbol?: boolean;
  className?: string;
  decimals?: number;
}

export default function RollingNumber({ value, showSymbol = true, className = "", decimals }: RollingNumberProps) {
  const { activeCurrency, format, convert } = useCurrency();
  const [displayString, setDisplayString] = useState("");
  
  const convertedTarget = convert(value);
  
  // Motion values for smooth tweening
  const motionValue = useMotionValue(convertedTarget);
  const spring = useSpring(motionValue, {
    stiffness: 85,
    damping: 18,
    mass: 1
  });

  const prevValueRef = useRef(value);
  const prevCurrencyRef = useRef(activeCurrency.code);

  // Update target when value or currency changes
  useEffect(() => {
    // If the currency changed, snap the motion value directly to the new currency value
    // to prevent circular animation of the exchange rate difference.
    if (activeCurrency.code !== prevCurrencyRef.current) {
      motionValue.set(convertedTarget);
      prevCurrencyRef.current = activeCurrency.code;
    } else {
      // Otherwise, animate the value change (stiffness/damping spring)
      motionValue.set(convertedTarget);
    }
    prevValueRef.current = value;
  }, [value, convertedTarget, activeCurrency.code, motionValue]);

  // Translate spring progress to formatted text
  useEffect(() => {
    const unsubscribe = spring.onChange((latest) => {
      // Calculate how to format this intermediate number
      let formattedVal = "";
      try {
        if (decimals !== undefined) {
          formattedVal = new Intl.NumberFormat(activeCurrency.locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          }).format(latest);
        } else if (activeCurrency.code === "INR") {
          formattedVal = new Intl.NumberFormat(activeCurrency.locale, {
            maximumFractionDigits: 0
          }).format(latest);
        } else {
          formattedVal = new Intl.NumberFormat(activeCurrency.locale, {
            maximumFractionDigits: latest < 100 ? 2 : 0
          }).format(latest);
        }
      } catch (e) {
        formattedVal = decimals !== undefined ? latest.toFixed(decimals) : latest.toFixed(0);
      }

      setDisplayString(showSymbol ? `${activeCurrency.symbol}${formattedVal}` : formattedVal);
    });

    return () => unsubscribe();
  }, [spring, activeCurrency, showSymbol, decimals]);

  // Initial render safety
  useEffect(() => {
    if (decimals !== undefined) {
      const convertedVal = convert(value);
      const formatted = new Intl.NumberFormat(activeCurrency.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(convertedVal);
      setDisplayString(showSymbol ? `${activeCurrency.symbol}${formatted}` : formatted);
    } else {
      setDisplayString(format(value, showSymbol));
    }
  }, [value, activeCurrency, format, showSymbol, decimals]);

  return <span className={`font-mono tabular-nums select-none ${className}`}>{displayString}</span>;
}
