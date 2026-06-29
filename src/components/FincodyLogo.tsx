"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

interface FincodyLogoProps {
  variant?: "desktop" | "mobile" | "compact" | "favicon";
  className?: string;
}

export default function FincodyLogo({ variant = "desktop", className = "" }: FincodyLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [blink, setBlink] = useState(false);
  const [shineKey, setShineKey] = useState(0);
  const [particles, setParticles] = useState<any[]>([]);

  // Magnetic Spring Offsets
  const springConfig = { stiffness: 120, damping: 15 };
  const logoX = useSpring(0, springConfig);
  const logoY = useSpring(0, springConfig);

  // Trigger shine sweep every 10s
  useEffect(() => {
    const shineInterval = setInterval(() => {
      setShineKey((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(shineInterval);
  }, []);

  // Particle Emitter Loop on Hover
  useEffect(() => {
    if (!isHovered) {
      setParticles([]);
      return;
    }
    const particleInterval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-10), // Limit total particles
        {
          id: Math.random(),
          // Position relative to the Y arrow tip in compact/desktop SVG coordinate systems
          x: variant === "favicon" ? 22 : 110,
          y: variant === "favicon" ? 8 : 10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -1.2 - Math.random() * 1.0,
        },
      ]);
    }, 200);

    return () => clearInterval(particleInterval);
  }, [isHovered, variant]);

  // Magnetic mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || variant === "favicon") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Constrain follow distance to max 6px
    const factor = 0.08;
    const moveX = Math.max(-6, Math.min(6, x * factor));
    const moveY = Math.max(-6, Math.min(6, y * factor));

    logoX.set(moveX);
    logoY.set(moveY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Trigger eyes blink exactly once
    setBlink(true);
    setTimeout(() => setBlink(false), 140);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    logoX.set(0);
    logoY.set(0);
  };

  // Easing presets
  const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // Letter bounce staggered animation variants
  const letterVariants: any = {
    hidden: {
      opacity: 0,
      y: 12
    },
    load: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: premiumEase as any,
        delay: i * 0.08,
      },
    }),
    bounce: (i: number) => ({
      y: [0, -5, 2, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut" as any,
        delay: i * 0.03,
      },
    }),
  };

  if (variant === "favicon") {
    // Emblem mode: Combination of D and Y
    return (
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative select-none inline-block ${className}`}
        style={{ width: "36px", height: "36px" }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(56,189,248,0.15)]"
        >
          {/* Gradients definitions */}
          <defs>
            <linearGradient id="favDGrad" x1="0" y1="0" x2="0" y2="32">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="favYGrad" x1="0" y1="0" x2="0" y2="32">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>

          {/* D Loop */}
          <motion.path
            d="M6 6 H14 C19 6 22 9 22 14 C22 19 19 22 14 22 H6 V6 Z"
            fill="url(#favDGrad)"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: premiumEase as any }}
          />

          {/* D Smile emoticon inside loop */}
          {/* Eyes */}
          <motion.ellipse
            cx={11}
            cy={13}
            rx={0.8}
            ry={blink ? 0.1 : 1.2}
            fill="#ffffff"
            animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.2 }}
          />
          <motion.ellipse
            cx={15}
            cy={13}
            rx={0.8}
            ry={blink ? 0.1 : 1.2}
            fill="#ffffff"
            animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.2 }}
          />
          {/* Smile */}
          <motion.path
            d="M 10 16 Q 13 19 16 16"
            stroke="#ffffff"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
            animate={isHovered ? { strokeWidth: 1.5, d: "M 9.5 15.5 Q 13 20 16.5 15.5" } : {}}
            transition={{ duration: 0.3 }}
          />

          {/* Y Growth Arrow */}
          <motion.path
            d="M18 18 L22 14 L22 26"
            stroke="url(#favYGrad)"
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <motion.path
            d="M20 14 L22 14 L22 16"
            stroke="url(#favYGrad)"
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          />

          {/* Floating glowing $ */}
          <motion.text
            x={23}
            y={12}
            fill="#67E8F9"
            fontSize="8"
            fontWeight="bold"
            style={{ textShadow: "0 0 4px #22D3EE" }}
            animate={{
              y: [12, 10, 12],
              scale: isHovered ? 1.25 : 1,
            }}
            transition={{
              y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" as any },
              scale: { duration: 0.2 },
            }}
          >
            $
          </motion.text>

          {/* Drifting Particles */}
          <AnimatePresence>
            {particles.map((p) => (
              <motion.circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={0.8}
                fill="#67E8F9"
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{
                  x: p.x + p.vx * 4,
                  y: p.y + p.vy * 5,
                  opacity: 0,
                  scale: 0.3,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" as any }}
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>
    );
  }

  // Dimensions configuration depending on Desktop or Mobile/Compact
  const isCompact = variant === "compact" || variant === "mobile";
  const viewWidth = isCompact ? 140 : 180;
  const viewHeight = isCompact ? 35 : 45;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none inline-block cursor-pointer ${className}`}
      style={{
        x: logoX,
        y: logoY,
        width: `${viewWidth}px`,
        height: `${viewHeight}px`,
      }}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <style>{`
            .finco-letter {
              fill: url(#fincoDarkGrad);
              transition: fill 0.3s ease;
            }
            html.light .finco-letter {
              fill: url(#fincoLightGrad);
            }
          `}</style>

          {/* Light Mode Gradient (Deep Navy) */}
          <linearGradient id="fincoLightGrad" x1="0" y1="0" x2="100" y2="0">
            <stop offset="0%" stopColor="#0B1F4D" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* Dark Mode Gradient (Premium Silver-White blending into Ice Blue) */}
          <linearGradient id="fincoDarkGrad" x1="0" y1="0" x2="100" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F0F9FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="dGrad" x1="0" y1="0" x2="0" y2="35">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>

          <linearGradient id="yGrad" x1="0" y1="0" x2="0" y2="35">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>

          {/* Premium sweep shine gradient */}
          <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="65%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Text Clip path for shine sweep overlay */}
          <clipPath id="textClip">
            <text
              x="5"
              y={isCompact ? "25" : "32"}
              fontSize={isCompact ? "20" : "26"}
              fontWeight="800"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="0.05em"
            >
              FINCO
            </text>
            {/* Custom vector path for D */}
            <path
              d={
                isCompact
                  ? "M 87, 8 H 94 C 98.5, 8 101, 10.5 101, 15.5 C 101, 20.5 98.5, 23 94, 23 H 87 V 8 Z"
                  : "M 112, 10 H 121 C 127, 10 130, 13 130, 19.5 C 130, 26 127, 29 121, 29 H 112 V 10 Z"
              }
            />
            {/* Custom vector path for Y (left branch & stem) */}
            <path
              d={
                isCompact
                  ? "M 107, 8 L 112, 15.5 V 23 M 112, 15.5"
                  : "M 137, 10 L 144, 19.5 V 29 M 144, 19.5"
              }
            />
          </clipPath>
        </defs>

        {/* Ambient background glow behind the center 'D' */}
        <motion.circle
          cx={isCompact ? 95 : 122}
          cy={isCompact ? 16 : 20}
          r={isCompact ? 18 : 24}
          fill="#38BDF8"
          opacity={isHovered ? 0.08 : 0.03}
          style={{ filter: "blur(12px)" }}
          animate={{
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* --- LETTERS GROUPS --- */}

        {/* Letter F */}
        <motion.g
          custom={0}
          initial="hidden"
          animate={isHovered ? "bounce" : "load"}
          variants={letterVariants}
        >
          <text
            x="5"
            y={isCompact ? "25" : "32"}
            className="finco-letter"
            fontSize={isCompact ? "20" : "26"}
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.05em"
          >
            F
          </text>
        </motion.g>

        {/* Letter I */}
        <motion.g
          custom={1}
          initial="hidden"
          animate={isHovered ? "bounce" : "load"}
          variants={letterVariants}
        >
          <text
            x={isCompact ? "20" : "24"}
            y={isCompact ? "25" : "32"}
            className="finco-letter"
            fontSize={isCompact ? "20" : "26"}
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.05em"
          >
            I
          </text>
        </motion.g>

        {/* Letter N */}
        <motion.g
          custom={2}
          initial="hidden"
          animate={isHovered ? "bounce" : "load"}
          variants={letterVariants}
        >
          <text
            x={isCompact ? "29" : "35"}
            y={isCompact ? "25" : "32"}
            className="finco-letter"
            fontSize={isCompact ? "20" : "26"}
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.05em"
          >
            N
          </text>
        </motion.g>

        {/* Letter C */}
        <motion.g
          custom={3}
          initial="hidden"
          animate={isHovered ? "bounce" : "load"}
          variants={letterVariants}
        >
          <text
            x={isCompact ? "48" : "60"}
            y={isCompact ? "25" : "32"}
            className="finco-letter"
            fontSize={isCompact ? "20" : "26"}
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.05em"
          >
            C
          </text>
        </motion.g>

        {/* Letter O */}
        <motion.g
          custom={4}
          initial="hidden"
          animate={isHovered ? "bounce" : "load"}
          variants={letterVariants}
        >
          <text
            x={isCompact ? "66" : "82"}
            y={isCompact ? "25" : "32"}
            className="finco-letter"
            fontSize={isCompact ? "20" : "26"}
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.05em"
          >
            O
          </text>
        </motion.g>

        {/* Letter D (The smiling character center) */}
        <motion.g
          custom={5}
          initial="hidden"
          animate={isHovered ? "bounce" : "load"}
          variants={letterVariants}
        >
          {/* Base character loop */}
          <path
            d={
              isCompact
                ? "M 87, 8 H 94 C 98.5, 8 101, 10.5 101, 15.5 C 101, 20.5 98.5, 23 94, 23 H 87 V 8 Z"
                : "M 112, 10 H 121 C 127, 10 130, 13 130, 19.5 C 130, 26 127, 29 121, 29 H 112 V 10 Z"
            }
            fill="url(#dGrad)"
          />

          {/* Minimal Emoticon overlay inside counter (D loop gap is around x: 90-95 in compact, 116-123 in desktop) */}
          {/* Left Eye */}
          <motion.ellipse
            cx={isCompact ? 92 : 118}
            cy={isCompact ? 14 : 17.5}
            rx={0.6}
            ry={blink ? 0.1 : 1.0}
            fill="#ffffff"
          />
          {/* Right Eye */}
          <motion.ellipse
            cx={isCompact ? 96 : 123}
            cy={isCompact ? 14 : 17.5}
            rx={0.6}
            ry={blink ? 0.1 : 1.0}
            fill="#ffffff"
          />
          {/* Smile path */}
          <motion.path
            d={
              isCompact
                ? "M 91.5, 17 Q 94, 19.5 96.5, 17"
                : "M 117.5, 21.5 Q 120.5, 24.5 123.5, 21.5"
            }
            stroke="#ffffff"
            strokeWidth={0.8}
            strokeLinecap="round"
            fill="none"
            animate={
              isHovered
                ? {
                    strokeWidth: 1.2,
                    d: isCompact
                      ? "M 91, 16.5 Q 94, 20.5 97, 16.5"
                      : "M 117, 21 Q 120.5, 25.5 124, 21",
                  }
                : {}
            }
            transition={{ duration: 0.25 }}
          />
        </motion.g>

        {/* Letter Y (Financial Growth Arrow) */}
        <motion.g
          custom={6}
          initial="hidden"
          animate={isHovered ? "bounce" : "load"}
          variants={letterVariants}
        >
          {/* Stem & Left branch */}
          <path
            d={
              isCompact
                ? "M 107, 8 L 112, 15.5 V 23"
                : "M 137, 10 L 144, 19.5 V 29"
            }
            stroke="url(#yGrad)"
            strokeWidth={isCompact ? 3.5 : 4.5}
            strokeLinecap="round"
            fill="none"
          />

          {/* Right branch extending into financial growth trajectory */}
          <motion.path
            d={
              isCompact
                ? "M 112, 15.5 Q 116, 12 121, 5"
                : "M 144, 19.5 Q 150, 15 156, 6"
            }
            stroke="url(#yGrad)"
            strokeWidth={isCompact ? 3.5 : 4.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.6,
              ease: premiumEase as any,
            }}
          />

          {/* Arrow Tip */}
          <motion.path
            d={
              isCompact
                ? "M 117, 5 H 121 V 9"
                : "M 151, 6 H 156 V 11"
            }
            stroke="url(#yGrad)"
            strokeWidth={isCompact ? 2.5 : 3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.25 }}
          />

          {/* Shimmer sweep animation over the Y Arrow path */}
          {isHovered && (
            <motion.path
              d={
                isCompact
                  ? "M 112, 15.5 Q 116, 12 121, 5"
                  : "M 144, 19.5 Q 150, 15 156, 6"
              }
              stroke="#ffffff"
              strokeWidth={isCompact ? 4 : 5}
              strokeLinecap="round"
              fill="none"
              opacity={0.8}
              initial={{ pathLength: 0, pathOffset: 0 }}
              animate={{ pathLength: [0, 0.4, 0], pathOffset: [0, 1.2] }}
              transition={{
                duration: 0.9,
                ease: "easeOut" as any,
              }}
            />
          )}
        </motion.g>

        {/* Floating glowing '$' symbol */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.3 }}
        >
          <motion.text
            x={isCompact ? 123 : 159}
            y={isCompact ? 7 : 8}
            fill="#67E8F9"
            fontSize={isCompact ? "8" : "10"}
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
            style={{
              textShadow: "0 0 8px rgba(34,211,238,0.7), 0 0 2px rgba(34,211,238,0.9)",
            }}
            animate={{
              y: [isCompact ? 7 : 8, isCompact ? 5 : 6, isCompact ? 7 : 8],
              scale: isHovered ? 1.25 : 1,
            }}
            transition={{
              y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" as any },
              scale: { duration: 0.25 },
            }}
          >
            $
          </motion.text>
        </motion.g>

        {/* --- SHINE SWEEP OVERLAY (Clips to letters) --- */}
        <motion.rect
          key={shineKey}
          x="-150"
          y="0"
          width="100"
          height={viewHeight}
          fill="url(#shineGrad)"
          clipPath="url(#textClip)"
          initial={{ x: -150 }}
          animate={{ x: viewWidth + 50 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut" as any,
            delay: 0.5,
          }}
        />

        {/* --- PARTICLES EMITTER --- */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={isCompact ? 0.6 : 0.8}
              fill="#67E8F9"
              style={{ filter: "drop-shadow(0 0 2px #22D3EE)" }}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{
                x: p.x + p.vx * 5,
                y: p.y + p.vy * 6,
                opacity: 0,
                scale: 0.2,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" as any }}
            />
          ))}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}
