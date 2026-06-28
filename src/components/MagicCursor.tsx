"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  opacity: number;
  life: number; // 0 to 1
  decay: number; // rate of life decrease per frame
  color: string;
  glowColor: string;
  type: "star" | "diamond";
  rotation: number;
  rotationSpeed: number;
}

export default function MagicCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 1. Accessibility check: Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // 2. Device capability check: Disable on mobile touch screens for optimal performance
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Add CSS class to body to hide standard cursor on desktop
    document.documentElement.classList.add("custom-cursor-active");

    // State parameters
    const mouse = { x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 };
    const cursor = { x: 0, y: 0, radius: 11, targetRadius: 11 };
    const particles: Particle[] = [];
    let isHovering = false;
    let isClicking = false;

    // Check if the page is currently in light mode
    const isLightMode = () => document.documentElement.classList.contains("light");

    // Dark theme color palette (bright glows)
    const darkColors = [
      { main: "rgba(255, 255, 255, opacity)", glow: "rgba(255, 255, 255, 0.3)" },
      { main: "rgba(168, 85, 247, opacity)", glow: "rgba(168, 85, 247, 0.4)" },
      { main: "rgba(196, 181, 253, opacity)", glow: "rgba(196, 181, 253, 0.35)" },
      { main: "rgba(59, 130, 246, opacity)", glow: "rgba(59, 130, 246, 0.4)" },
      { main: "rgba(244, 114, 182, opacity)", glow: "rgba(244, 114, 182, 0.3)" }
    ];

    // Light theme color palette (darker saturated colors for high visibility)
    const lightColors = [
      { main: "rgba(37, 99, 235, opacity)", glow: "rgba(37, 99, 235, 0.25)" }, // royal blue
      { main: "rgba(109, 40, 217, opacity)", glow: "rgba(109, 40, 217, 0.25)" }, // deep purple
      { main: "rgba(79, 70, 229, opacity)", glow: "rgba(79, 70, 229, 0.25)" }, // indigo
      { main: "rgba(219, 39, 119, opacity)", glow: "rgba(219, 39, 119, 0.25)" }, // dark pink
      { main: "rgba(13, 148, 136, opacity)", glow: "rgba(13, 148, 136, 0.25)" } // dark teal
    ];

    // Mouse movement tracker
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);
      
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      // Spawn trail particles based on movement distance (spawned directly at mouse pointer for zero latency)
      if (mouse.speed > 1.5) {
        const amount = isHovering ? 2 : 1;
        for (let i = 0; i < amount; i++) {
          const spawnX = mouse.x + (Math.random() - 0.5) * 6;
          const spawnY = mouse.y + (Math.random() - 0.5) * 6;
          particles.push(createParticle(spawnX, spawnY, false));
        }
      }
    };

    // Global Hover element detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target && (
          target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.closest("a") ||
          target.closest("button") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("cursor-pointer")
        )
      ) {
        isHovering = true;
        cursor.targetRadius = 28; // Expand custom cursor aura
      } else {
        isHovering = false;
        cursor.targetRadius = 11; // Normal custom cursor aura
      }
    };

    // Mousedown animations
    const handleMouseDown = () => {
      isClicking = true;
      cursor.targetRadius = 6; // shrink aura
    };

    const handleMouseUp = () => {
      isClicking = false;
      cursor.targetRadius = isHovering ? 28 : 11;
    };

    // Click burst explosion
    const handleClick = (e: MouseEvent) => {
      const burstCount = isHovering ? 18 : 12;
      for (let i = 0; i < burstCount; i++) {
        particles.push(createParticle(e.clientX, e.clientY, true));
      }
    };

    // Helper: Create single particle
    const createParticle = (x: number, y: number, isExplosion: boolean): Particle => {
      const light = isLightMode();
      const activeColors = light ? lightColors : darkColors;
      const colorScheme = activeColors[Math.floor(Math.random() * activeColors.length)];
      
      const types: Particle["type"][] = ["star", "diamond"];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const life = 1.0;
      const decay = 0.01 + Math.random() * 0.02; // fades out in ~0.6 to 1.5s (assuming 60fps)

      // Velocity vectors
      let vx = 0;
      let vy = 0;

      if (isExplosion) {
        // High speed radial vectors
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4.5;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else {
        // Slow lazy drifting vectors trailing the cursor
        vx = (Math.random() - 0.5) * 1.2;
        vy = (Math.random() - 0.5) * 1.2 - 0.4; // slight upward drift
      }

      // Keep particles sharp and delicate
      const size = type === "star"
        ? 5 + Math.random() * 6
        : 3 + Math.random() * 4;

      return {
        x,
        y,
        vx,
        vy,
        size,
        maxSize: size,
        opacity: light ? 0.5 + Math.random() * 0.5 : 0.3 + Math.random() * 0.7, // slightly darker in light mode
        life,
        decay,
        color: colorScheme.main,
        glowColor: colorScheme.glow,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04
      };
    };

    // Register event listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    // Initialize cursor coordinates instantly to avoid initial jump
    const initCoords = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      window.removeEventListener("mousemove", initCoords);
    };
    window.addEventListener("mousemove", initCoords);

    // Core Animation Frame Loop
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const light = isLightMode();

      // 1. Interpolate outer aura coordinates with inertia (smooth lag)
      const ease = 0.15;
      cursor.x += (mouse.x - cursor.x) * ease;
      cursor.y += (mouse.y - cursor.y) * ease;

      // Smooth custom cursor aura radius resizing
      cursor.radius += (cursor.targetRadius - cursor.radius) * ease;

      // 2. Render Custom Cursor elements
      // A. Outer Glow Aura (Trailing with inertia)
      const auraGradient = ctx.createRadialGradient(
        cursor.x, cursor.y, 0,
        cursor.x, cursor.y, cursor.radius * 2.5
      );
      if (light) {
        auraGradient.addColorStop(0, "rgba(37, 99, 235, 0.08)");
        auraGradient.addColorStop(0.5, "rgba(109, 40, 217, 0.03)");
      } else {
        auraGradient.addColorStop(0, "rgba(59, 130, 246, 0.12)");
        auraGradient.addColorStop(0.5, "rgba(168, 85, 247, 0.05)");
      }
      auraGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, cursor.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // B. Fine outer line (Trailing with inertia)
      ctx.strokeStyle = isHovering 
        ? (light ? "rgba(109, 40, 217, 0.45)" : "rgba(168, 85, 247, 0.25)") 
        : (light ? "rgba(15, 23, 42, 0.18)" : "rgba(255, 255, 255, 0.12)");
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, cursor.radius, 0, Math.PI * 2);
      ctx.stroke();

      // C. Inner solid Core Dot (Drawn instantly at actual mouse position for absolute zero lag responsiveness)
      ctx.fillStyle = isHovering 
        ? (light ? "rgba(109, 40, 217, 0.9)" : "rgba(168, 85, 247, 0.85)") 
        : (light ? "rgba(15, 23, 42, 0.8)" : "#ffffff");
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, isHovering ? 4.5 : 6, 0, Math.PI * 2);
      ctx.fill();

      // 3. Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Update physics
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;
        
        // Decay speed slowdown due to friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Render current particle state
        const currentOpacity = p.opacity * p.life;
        const currentSize = p.maxSize * p.life;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        // Draw foreground particle shape (pure sparkles, no round bubbles)
        ctx.fillStyle = p.color.replace("opacity", currentOpacity.toFixed(3));
        
        if (p.type === "diamond") {
          // Sharp curved diamond sparkle
          ctx.beginPath();
          ctx.moveTo(0, -currentSize);
          ctx.quadraticCurveTo(0, 0, currentSize, 0);
          ctx.quadraticCurveTo(0, 0, 0, currentSize);
          ctx.quadraticCurveTo(0, 0, -currentSize, 0);
          ctx.quadraticCurveTo(0, 0, 0, -currentSize);
          ctx.closePath();
          ctx.fill();
        } else {
          // 4-point cross star sparkle with thin arms
          ctx.beginPath();
          ctx.moveTo(0, -currentSize * 1.6);
          ctx.quadraticCurveTo(0, 0, currentSize * 0.15, -currentSize * 0.15);
          ctx.quadraticCurveTo(currentSize * 1.6, 0, currentSize * 0.15, currentSize * 0.15);
          ctx.quadraticCurveTo(0, currentSize * 1.6, -currentSize * 0.15, currentSize * 0.15);
          ctx.quadraticCurveTo(-currentSize * 1.6, 0, -currentSize * 0.15, -currentSize * 0.15);
          ctx.quadraticCurveTo(0, -currentSize * 1.6, 0, -currentSize * 1.6);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup listeners
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999] hidden md:block"
    />
  );
}
