"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

/**
 * Slider Antes/Después integrado con los tokens de diseño de TumbadosZumba
 * (Navy marca, Orange marca, bordes sutiles y soporte Dark Mode)
 */
export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "ANTES",
  afterLabel = "DESPUÉS",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50); // % desde la izquierda
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    updatePosition(clientX);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      updatePosition(clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [updatePosition]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2));
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden select-none">
      <div
        ref={containerRef}
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        className="relative w-full h-full cursor-ew-resize overflow-hidden"
      >
        {/* Capa DESPUÉS (fondo completo) */}
        <Layer src={afterSrc} label={afterLabel} tone="after" />

        {/* Capa ANTES (recortada por la posición del slider) */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div style={{ width: containerRef.current?.offsetWidth || "100%", height: "100%" }}>
            <Layer src={beforeSrc} label={beforeLabel} tone="before" fixedWidth={containerRef.current?.offsetWidth} />
          </div>
        </div>

        {/* Línea divisora + manija con naranja de marca #F47B20 */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none bg-white/90 dark:bg-white/80 shadow-sm"
          style={{
            left: `${position}%`,
            width: 2,
            transform: "translateX(-1px)",
          }}
        />
        <div
          className="absolute top-1/2 pointer-events-none flex items-center justify-center size-9 sm:size-10 rounded-full bg-[#F47B20] text-white shadow-lg border-2 border-white transition-transform hover:scale-110"
          style={{
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3L1 8L5 13" />
            <path d="M11 3L15 8L11 13" />
          </svg>
        </div>

        {/* Slider invisible para accesibilidad / teclado */}
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          onKeyDown={onKeyDown}
          aria-label="Comparar antes y después"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      </div>
    </div>
  );
}

interface LayerProps {
  src?: string;
  label: string;
  tone: "before" | "after";
  fixedWidth?: number;
}

function Layer({ src, label, tone, fixedWidth }: LayerProps) {
  // Patrón técnico blueprint/obra usando navy y slate oscuro cuando no hay imagen
  const placeholderBg =
    tone === "before"
      ? "linear-gradient(135deg, #0A3580 0%, #061e4a 100%)"
      : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";

  return (
    <div
      style={{
        position: "relative",
        width: fixedWidth ? `${fixedWidth}px` : "100%",
        height: "100%",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={label}
          draggable={false}
          className="w-full h-full object-cover block"
        />
      ) : (
        <div 
          className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden" 
          style={{ background: placeholderBg }}
        >
          {/* Textura sutil técnica estilo plano / blueprint */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          />
          <div className="relative z-10 text-center px-4">
            <span className="text-xs uppercase tracking-widest text-white/80 font-mono">
              Fase Estructural
            </span>
            <p className="text-sm text-white/90 font-semibold mt-1">
              Perfilería y Armazón
            </p>
          </div>
        </div>
      )}
      <span
        className="absolute bottom-3 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded shadow-sm backdrop-blur-md"
        style={{
          left: tone === "before" ? 12 : "auto",
          right: tone === "after" ? 12 : "auto",
          color: "#ffffff",
          backgroundColor: tone === "before" ? "rgba(10, 53, 128, 0.85)" : "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        {label}
      </span>
    </div>
  );
}
