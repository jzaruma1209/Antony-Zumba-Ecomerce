import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Slider Antes/Después — estilo Van Praet (crema, sin bordes redondeados, sin sombras)
 * Uso: <BeforeAfterSlider beforeSrc="..." afterSrc="..." />
 * Si no pasas imágenes, muestra placeholders de textura para maquetar.
 */
export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "ANTES",
  afterLabel = "DESPUÉS",
}) {
  const [position, setPosition] = useState(50); // % desde la izquierda
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updatePosition(clientX);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
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

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2));
  };

  return (
    <div
      style={{
        fontFamily:
          "'Helvetica Neue', Arial, sans-serif",
        background: "#F5F1E8",
        padding: "48px 24px",
      }}
    >
      <div
        ref={containerRef}
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 960,
          margin: "0 auto",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          cursor: "ew-resize",
          userSelect: "none",
          background: "#3a3530",
        }}
      >
        {/* Capa DESPUÉS (fondo completo) */}
        <Layer src={afterSrc} label={afterLabel} tone="after" />

        {/* Capa ANTES (recortada por la posición del slider) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${position}%`,
            overflow: "hidden",
          }}
        >
          <div style={{ width: containerRef.current?.offsetWidth || "960px", height: "100%" }}>
            <Layer src={beforeSrc} label={beforeLabel} tone="before" fixedWidth={containerRef.current?.offsetWidth} />
          </div>
        </div>

        {/* Línea divisora + manija */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${position}%`,
            width: 1,
            background: "#F5F1E8",
            transform: "translateX(-0.5px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
            width: 40,
            height: 40,
            background: "#F5821F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3L1 8L5 13" stroke="#F5F1E8" strokeWidth="1.5" />
            <path d="M11 3L15 8L11 13" stroke="#F5F1E8" strokeWidth="1.5" />
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
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "ew-resize",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 960,
          margin: "16px auto 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "#8a8478",
            textTransform: "uppercase",
          }}
        >
          Arrastra la línea para comparar
        </span>
        <button
          style={{
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#2A2621",
            cursor: "pointer",
            padding: "4px 0",
            borderBottom: "1px solid #2A2621",
          }}
        >
          Cotizar Instalación
          <span
            style={{
              width: 20,
              height: 20,
              background: "#F5821F",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 5H9M9 5L5.5 1.5M9 5L5.5 8.5" stroke="#F5F1E8" strokeWidth="1.2" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

function Layer({ src, label, tone, fixedWidth }) {
  const placeholderBg =
    tone === "before"
      ? "repeating-linear-gradient(135deg, #6b6258, #6b6258 2px, #5c534a 2px, #5c534a 4px)"
      : "repeating-linear-gradient(135deg, #d8d2c4, #d8d2c4 2px, #cfc8b8 2px, #cfc8b8 4px)";

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
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: placeholderBg }} />
      )}
      <span
        style={{
          position: "absolute",
          bottom: 12,
          left: tone === "before" ? 12 : "auto",
          right: tone === "after" ? 12 : "auto",
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "#F5F1E8",
          background: "rgba(20,18,15,0.55)",
          padding: "4px 10px",
        }}
      >
        {label}
      </span>
    </div>
  );
}
