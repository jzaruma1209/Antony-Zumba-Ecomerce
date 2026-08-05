"use client"

import { useState } from "react"

// ── Número de WhatsApp destino (cambiar en producción) ─────────────────────
const WA_NUMBER = "593990099265" // Ecuador: 0990099265 → internacional sin +

// ── Helpers ────────────────────────────────────────────────────────────────
const ceil = (x: number) => Math.ceil(x - 1e-9)
const mx = (a: number, b: number) => Math.max(a, b)
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

// ── Tipos ──────────────────────────────────────────────────────────────────
type ResultRow = [string, number, string, string]

interface Module {
  id: string
  name: string
  sub: string
  adv: string[]
  calc: (area: number, settings: { stud: number; lana: number }) => ResultRow[]
  note?: string
}

// ── Módulos de cálculo ─────────────────────────────────────────────────────
const MODULES: Module[] = [
  {
    id: "gypsum",
    name: "Tumbado Gypsum",
    sub: "Cielorraso continuo",
    adv: ["lana"],
    calc(A, S) {
      const lana = S.lana
      return [
        ["Placas Knauf", mx(1, ceil((A * 1.05) / 2.98)), "und", "1.05 m² placa/m²"],
        ["Ángulo Provind", mx(1, ceil(A * 0.35)), "tira", "0.35 und/m²"],
        ["Principal Provind", mx(1, ceil(A * 0.35)), "tira", "0.35 und/m²"],
        ["Secundario Provind", mx(1, ceil(A * 0.8)), "tira", "0.80 und/m²"],
        ["Clavo de Impacto", mx(2, ceil(A * 1.8)), "und", "1.80 und/m²"],
        ["Clavo 2×20", ceil(A * 7.0), "und", "7 und/m²"],
        ["Tornillo Estructura", mx(1, ceil(A * 5)), "und", "5 und/m²"],
        ["Tornillo de Plancha", mx(40, ceil(A * 30.0)), "und", "30 und/m² · paq. mín. 40"],
        ["Masilla Readymas 28kg", mx(1, ceil((A * 1.1) / 28)), "balde", "1.10 kg/m²"],
        ["Cinta de Papel 250'", mx(1, ceil((A * 1.3) / 76.2)), "rollo", "1.30 ml/m²"],
        ["Lana de Vidrio", ceil(A / lana), "rollo", `formato ${lana} m²`],
      ]
    },
    note: "No incluye material para cuelgas o tirantes.",
  },
  {
    id: "pared1",
    name: "Pared Una Cara",
    sub: "Tabique simple",
    adv: ["stud", "lana"],
    calc(A, S) {
      const d = S.stud
      const lana = S.lana
      return [
        ["Placas Knauf", mx(1, ceil((A * 1.05) / 2.98)), "und", "1.05 m² placa/m²"],
        ["Stud Provind", mx(2, ceil(A / d)), "ml", `cada ${d} m`],
        ["Track Provind", mx(1, ceil((A * 0.7) / 3.0)), "ml", "0.70 ml/m²"],
        ["Clavo de Impacto", ceil(A * 4), "und", "4 und/m²"],
        ["Tornillo Estructura", mx(1, ceil(A * 5)), "und", "5 und/m²"],
        ["Tornillo de Plancha", mx(40, ceil(A * 16)), "und", "16 und/m² · paq. mín. 40"],
        ["Masilla Readymas 28kg", mx(1, ceil((A * 0.9) / 28)), "balde", "0.90 kg/m²"],
        ["Cinta de Papel 250'", mx(1, ceil((A * 1.65) / 76.2)), "rollo", "1.65 ml/m²"],
        ["Lana de Vidrio", ceil(A / lana), "rollo", `formato ${lana} m²`],
      ]
    },
  },
  {
    id: "f60",
    name: "Revestimiento F60",
    sub: "Trasdosado con perfil Omega",
    adv: ["lana"],
    calc(A, S) {
      const lana = S.lana
      return [
        ["Placas Knauf", mx(1, ceil(A * 0.35)), "und", "0.35 und/m²"],
        ["Ángulo Provind", mx(1, ceil(A * 0.35)), "tira", "0.35 und/m²"],
        ["Perfil F60 Provind", mx(1, ceil(A * 0.7)), "tira", "0.70 und/m²"],
        ["Soporte Directo Provind", mx(5, ceil(A * 4.5)), "und", "4.5 und/m² · mín. 5"],
        ["Empalme F60 Provind", mx(1, ceil(A * 0.3)), "und", "0.30 und/m²"],
        ["Taco Golpe 6×40", mx(10, ceil(A * 9.0)), "und", "9 und/m² · mín. 10"],
        ["Clavo 2×20", ceil(A * 7.0), "und", "7 und/m²"],
        ["Tornillo Estructura", ceil(A * 12.0), "und", "12 und/m²"],
        ["Tornillo de Plancha", ceil(A * 40.0), "und", "40 und/m²"],
        ["Masilla Readymas 28kg", mx(1, ceil((A * 0.9) / 28)), "balde", "0.90 kg/m²"],
        ["Cinta de Papel 250'", mx(1, ceil((A * 1.65) / 76.2)), "rollo", "1.65 ml/m²"],
        ["Lana de Vidrio", ceil(A / lana), "rollo", `formato ${lana} m²`],
      ]
    },
  },
  {
    id: "revoque",
    name: "Revoque en Seco",
    sub: "Placa pegada directo",
    adv: [],
    calc(A) {
      return [
        ["Placas Knauf", mx(1, ceil(A * 0.35)), "und", "0.35 und/m²"],
        ["Pegamento Perlfix 25kg", mx(1, ceil((A * 4.5) / 25.0)), "saco", "4.5 kg/m²"],
        ["Masilla Readymas 28kg", mx(1, ceil((A * 0.6) / 28.0)), "balde", "0.60 kg/m²"],
        ["Cinta de Papel 250'", mx(1, ceil((A * 1.4) / 76.2)), "rollo", "1.40 ml/m²"],
      ]
    },
  },
]

// ── Tipos de popup ─────────────────────────────────────────────────────────
// "adv"     → popup previo para opciones avanzadas + medidas (sistemas que lo necesiten)
// "results" → lista de materiales calculados
// "identify"→ datos de contacto (nombre + correo)
// "confirm" → confirmación antes de enviar
// "sent"    → pantalla de éxito
type PopupStep = "adv" | "results" | "identify" | "confirm" | "sent"

interface CalcResult {
  modName: string
  area: number
  ancho: number
  alto: number
  rows: ResultRow[]
  note?: string
}

// ── Estilos compartidos inline (evita conflictos con Tailwind) ─────────────
const CARD_BG = "#0B1220"
const BORDER = "#1F2A40"
const CARD2 = "#111B2E"
const TEXT_SOFT = "#8B95AC"
const ORANGE = "#F0731E"
const ORANGE_H = "#FF8A2E"
const GREEN = "#25D366"
const GREEN_H = "#20bd5a"

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm ml-3 transition-colors"
      style={{ background: CARD2, border: `1px solid ${BORDER}`, color: TEXT_SOFT }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = TEXT_SOFT)}
    >✕</button>
  )
}

export function PromoSplitSection() {
  // ── Calculadora (widget fijo) ──
  const [modId, setModId] = useState(MODULES[0].id)
  const [ancho, setAncho] = useState("")
  const [alto, setAlto] = useState("")

  // ── Opciones avanzadas (solo en popup) ──
  const [advStud, setAdvStud] = useState("0.610")
  const [advLana, setAdvLana] = useState("35.70")
  const [advLanaCustom, setAdvLanaCustom] = useState("20")

  // ── Popup ──
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupStep, setPopupStep] = useState<PopupStep>("results")
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null)

  // ── Identificación ──
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [contactError, setContactError] = useState("")

  const currentMod = MODULES.find((m) => m.id === modId)!
  const hasAdv = currentMod.adv.length > 0

  const effectiveLana =
    advLana === "custom" ? parseFloat(advLanaCustom) || 1 : parseFloat(advLana)
  const effectiveStud = parseFloat(advStud)

  // ── Cuando el usuario pulsa "Calcular" ──
  function handleCalcClick() {
    if (hasAdv) {
      // Abrir popup de opciones avanzadas primero
      setPopupStep("adv")
      setPopupOpen(true)
    } else {
      // Si no hay opciones avanzadas, calcular directo
      doCalc()
    }
  }

  // ── Cálculo efectivo ──
  function doCalc() {
    const a = parseFloat(ancho) || 0
    const al = parseFloat(alto) || 0
    const A = a * al

    if (A <= 0) {
      alert("Por favor ingresa medidas válidas (Ancho y Alto > 0)")
      setPopupOpen(false)
      return
    }

    const rows = currentMod.calc(A, { stud: effectiveStud, lana: effectiveLana })
    setCalcResult({
      modName: currentMod.name,
      area: A,
      ancho: a,
      alto: al,
      rows,
      note: currentMod.note,
    })
    setPopupStep("results")
    setPopupOpen(true)
  }

  function handleClosePopup() {
    setPopupOpen(false)
    setPopupStep("results")
    setClientName("")
    setClientEmail("")
    setContactError("")
  }

  function handleSendIdentify() {
    if (!clientName.trim()) {
      setContactError("Por favor ingresa tu nombre.")
      return
    }
    if (!clientEmail.trim()) {
      setContactError("Por favor ingresa tu correo electrónico.")
      return
    }
    setContactError("")
    setPopupStep("confirm")
  }

  function buildWAMessage(result: CalcResult) {
    const rows = result.rows
      .map(([name, qty, unit]) => `• ${name}: *${fmt(qty)} ${unit}*`)
      .join("\n")

    return (
      `🏗️ *Solicitud de Proforma de Materiales - TumbadosZumba*\n\n` +
      `👤 *Cliente:* ${clientName}\n` +
      `📧 *Correo:* ${clientEmail}\n\n` +
      `📐 *Sistema:* ${result.modName}\n` +
      `📏 *Área:* ${result.ancho}m × ${result.alto}m = ${fmt(result.area)} m²\n\n` +
      `📦 *Materiales calculados:*\n${rows}\n\n` +
      `Por favor cotizar los materiales indicados. ¡Gracias! 🙏`
    )
  }

  function handleConfirmSend() {
    if (!calcResult) return
    const msg = encodeURIComponent(buildWAMessage(calcResult))
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank", "noopener,noreferrer")
    setPopupStep("sent")
  }

  return (
    <>
      {/* ══════════════════════════════════════════════
          WIDGET FIJO — nunca cambia de tamaño
      ══════════════════════════════════════════════ */}
      <article
        className="relative h-full w-full overflow-hidden rounded-xl text-white select-none"
        style={{
          background: "linear-gradient(160deg, #2E6BFF 0%, #1E4FD6 55%, #0a1a3a 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Glow decorativo */}
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "rgba(46,107,255,0.2)", filter: "blur(24px)" }}
        />

        <div className="relative z-10 flex flex-col h-full p-4 gap-3">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              🧮
            </div>
            <div>
              <h3 className="text-sm font-bold leading-none text-white">
                Calculadora de Materiales
              </h3>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                Elige el sistema y calcula al instante
              </p>
            </div>
          </div>

          {/* Sistema */}
          <div>
            <label
              className="block text-[10px] font-medium uppercase tracking-wide mb-1"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Sistema
            </label>
            <select
              value={modId}
              onChange={(e) => setModId(e.target.value)}
              className="w-full rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {MODULES.map((m) => (
                <option key={m.id} value={m.id} style={{ color: "#111" }}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ancho / Alto */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                className="block text-[10px] font-medium uppercase tracking-wide mb-1"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Ancho (m)
              </label>
              <input
                type="number"
                value={ancho}
                onChange={(e) => setAncho(e.target.value)}
                placeholder="3.00"
                step="0.1"
                className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              />
            </div>
            <div>
              <label
                className="block text-[10px] font-medium uppercase tracking-wide mb-1"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Alto (m)
              </label>
              <input
                type="number"
                value={alto}
                onChange={(e) => setAlto(e.target.value)}
                placeholder="2.40"
                step="0.1"
                className="w-full rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              />
            </div>
          </div>



          {/* Botón Calcular */}
          <div className="mt-auto">
            <button
              onClick={handleCalcClick}
              className="w-full flex items-center justify-center gap-1.5 font-bold text-sm py-2.5 rounded-lg transition-colors"
              style={{ background: ORANGE, color: "#fff", border: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
            >
              Calcular →
            </button>
          </div>
        </div>
      </article>

      {/* ══════════════════════════════════════════════
          POPUP MODAL (todos los pasos)
      ══════════════════════════════════════════════ */}
      {popupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(2,4,10,0.78)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClosePopup()
          }}
        >
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              maxWidth: 520,
              maxHeight: "90vh",
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              animation: "fadeScaleIn 0.18s ease-out",
            }}
          >

            {/* ── PASO: Opciones avanzadas + medidas ── */}
            {popupStep === "adv" && (
              <>
                <div
                  className="flex items-start justify-between px-5 py-4 border-b"
                  style={{ borderColor: BORDER, background: CARD_BG }}
                >
                  <div>
                    <h3 className="text-base font-bold text-white m-0">{currentMod.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SOFT }}>
                      {currentMod.sub} — ajusta las opciones y confirma las medidas
                    </p>
                  </div>
                  <CloseBtn onClick={handleClosePopup} />
                </div>

                <div className="px-5 py-4 space-y-3 overflow-y-auto" style={{ flex: 1 }}>
                  {/* Medidas (confirmación visual) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: TEXT_SOFT }}>
                        Ancho (m)
                      </label>
                      <input
                        type="number"
                        value={ancho}
                        onChange={(e) => setAncho(e.target.value)}
                        placeholder="3.00"
                        step="0.1"
                        className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                        style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: TEXT_SOFT }}>
                        Alto (m)
                      </label>
                      <input
                        type="number"
                        value={alto}
                        onChange={(e) => setAlto(e.target.value)}
                        placeholder="2.40"
                        step="0.1"
                        className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                        style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: `1px dashed ${BORDER}`, paddingTop: 4 }}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: TEXT_SOFT }}>
                      Opciones avanzadas
                    </p>
                  </div>

                  {/* Stud */}
                  {currentMod.adv.includes("stud") && (
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: TEXT_SOFT }}>
                        Distancia entre Stud
                      </label>
                      <select
                        value={advStud}
                        onChange={(e) => setAdvStud(e.target.value)}
                        className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
                        style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                      >
                        <option value="0.610" style={{ color: "#111" }}>0.610 m</option>
                        <option value="0.407" style={{ color: "#111" }}>0.407 m</option>
                        <option value="0.305" style={{ color: "#111" }}>0.305 m</option>
                      </select>
                    </div>
                  )}

                  {/* Lana */}
                  {currentMod.adv.includes("lana") && (
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: TEXT_SOFT }}>
                        Formato lana de vidrio
                      </label>
                      <select
                        value={advLana}
                        onChange={(e) => setAdvLana(e.target.value)}
                        className="w-full rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
                        style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                      >
                        <option value="35.70" style={{ color: "#111" }}>35.70 m²</option>
                        <option value="18.85" style={{ color: "#111" }}>18.85 m²</option>
                        <option value="custom" style={{ color: "#111" }}>Personalizado…</option>
                      </select>
                      {advLana === "custom" && (
                        <input
                          type="number"
                          value={advLanaCustom}
                          onChange={(e) => setAdvLanaCustom(e.target.value)}
                          step="0.5"
                          placeholder="m² por rollo"
                          className="w-full mt-2 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                          style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5 px-5 pb-5 pt-2">
                  <button
                    onClick={handleClosePopup}
                    className="flex-1 py-2.5 rounded-lg text-sm transition-colors"
                    style={{ background: CARD2, border: `1px solid ${BORDER}`, color: "#E7ECF5" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1a2540")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = CARD2)}
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={doCalc}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors"
                    style={{ background: ORANGE, border: "none", color: "#fff" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
                  >
                    Calcular →
                  </button>
                </div>
              </>
            )}

            {/* ── PASO: Resultados ── */}
            {popupStep === "results" && calcResult && (
              <>
                <div
                  className="flex items-start justify-between px-5 py-4 border-b"
                  style={{ borderColor: BORDER, background: CARD_BG, position: "sticky", top: 0 }}
                >
                  <div>
                    <h3 className="text-base font-bold text-white m-0">{calcResult.modName}</h3>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SOFT }}>
                      Área calculada: {calcResult.ancho}m × {calcResult.alto}m = {fmt(calcResult.area)} m²
                    </p>
                  </div>
                  <CloseBtn onClick={handleClosePopup} />
                </div>

                <div className="overflow-y-auto px-5 py-3" style={{ flex: 1 }}>
                  {calcResult.rows.map(([name, qty, unit, coef], i) => (
                    <div
                      key={i}
                      className="flex items-baseline justify-between py-2.5"
                      style={{
                        borderBottom: i < calcResult.rows.length - 1 ? `1px solid ${BORDER}` : "none",
                      }}
                    >
                      <div>
                        <span className="text-sm text-white">{name}</span>
                        <span className="block text-[10px] mt-0.5" style={{ color: TEXT_SOFT }}>
                          {coef}
                        </span>
                      </div>
                      <div className="text-right pl-3 flex-shrink-0">
                        <span
                          className="font-bold text-[15px]"
                          style={{ color: ORANGE_H, fontFamily: "monospace" }}
                        >
                          {fmt(qty)}
                        </span>
                        <span className="text-[10px] ml-1" style={{ color: TEXT_SOFT }}>
                          {unit}
                        </span>
                      </div>
                    </div>
                  ))}

                  <p
                    className="text-[11px] mt-3 pt-3"
                    style={{ color: TEXT_SOFT, borderTop: `1px dashed ${BORDER}` }}
                  >
                    {calcResult.note
                      ? `⚠ ${calcResult.note}`
                      : "Cantidades redondeadas a presentación comercial (función techo)."}
                  </p>
                </div>

                <div className="flex gap-2.5 px-5 pb-5 pt-3">
                  <button
                    onClick={() => {
                      handleClosePopup()
                    }}
                    className="flex-1 py-2.5 rounded-lg text-sm transition-colors"
                    style={{ background: CARD2, border: `1px solid ${BORDER}`, color: "#E7ECF5" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1a2540")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = CARD2)}
                  >
                    ← Ajustar medidas
                  </button>
                  <button
                    onClick={() => setPopupStep("identify")}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors"
                    style={{ background: ORANGE, border: "none", color: "#fff" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
                  >
                    Pedir Proforma
                  </button>
                </div>
              </>
            )}

            {/* ── PASO: Identificación ── */}
            {popupStep === "identify" && (
              <>
                <div
                  className="flex items-start justify-between px-5 py-4 border-b"
                  style={{ borderColor: BORDER, background: CARD_BG }}
                >
                  <div>
                    <h3 className="text-base font-bold text-white m-0">Datos de contacto</h3>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SOFT }}>
                      Para identificarte y enviarte la cotización
                    </p>
                  </div>
                  <CloseBtn onClick={handleClosePopup} />
                </div>

                <div className="px-5 py-5 space-y-4" style={{ flex: 1 }}>
                  <div>
                    <label
                      className="block text-xs font-medium uppercase tracking-wide mb-1.5"
                      style={{ color: TEXT_SOFT }}
                    >
                      Tu nombre *
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                      style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-medium uppercase tracking-wide mb-1.5"
                      style={{ color: TEXT_SOFT }}
                    >
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                      style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                    />
                  </div>
                  {contactError && (
                    <p className="text-xs" style={{ color: ORANGE_H }}>
                      ⚠ {contactError}
                    </p>
                  )}
                </div>

                <div className="flex gap-2.5 px-5 pb-5 pt-2">
                  <button
                    onClick={() => setPopupStep("results")}
                    className="flex-1 py-2.5 rounded-lg text-sm transition-colors"
                    style={{ background: CARD2, border: `1px solid ${BORDER}`, color: "#E7ECF5" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1a2540")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = CARD2)}
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={handleSendIdentify}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors"
                    style={{ background: ORANGE, border: "none", color: "#fff" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
                  >
                    Continuar →
                  </button>
                </div>
              </>
            )}

            {/* ── PASO: Confirmación ── */}
            {popupStep === "confirm" && calcResult && (
              <>
                <div
                  className="flex items-start justify-between px-5 py-4 border-b"
                  style={{ borderColor: BORDER, background: CARD_BG }}
                >
                  <div>
                    <h3 className="text-base font-bold text-white m-0">Confirmar solicitud</h3>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SOFT }}>
                      Revisa antes de enviar por WhatsApp
                    </p>
                  </div>
                  <CloseBtn onClick={handleClosePopup} />
                </div>

                <div className="px-5 py-4 space-y-3 overflow-y-auto" style={{ flex: 1 }}>
                  <div className="rounded-lg p-3" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: TEXT_SOFT }}>
                      Tus datos
                    </p>
                    <p className="text-sm text-white">👤 {clientName}</p>
                    <p className="text-sm text-white mt-1">📧 {clientEmail}</p>
                  </div>

                  <div className="rounded-lg p-3" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: TEXT_SOFT }}>
                      Proforma solicitada
                    </p>
                    <p className="text-sm text-white">
                      🏗️ <strong>{calcResult.modName}</strong>
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: TEXT_SOFT }}>
                      {calcResult.ancho}m × {calcResult.alto}m = {fmt(calcResult.area)} m²
                    </p>
                    <p className="text-xs mt-2" style={{ color: TEXT_SOFT }}>
                      {calcResult.rows.length} materiales calculados
                    </p>
                  </div>

                  <p className="text-[11px]" style={{ color: TEXT_SOFT }}>
                    Al continuar, se abrirá WhatsApp con el detalle completo para que un asesor te cotice.
                  </p>

                  <button
                    onClick={() => setPopupStep("identify")}
                    className="text-xs underline"
                    style={{ color: TEXT_SOFT, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    ¿Quieres cambiar tus datos? → Editar
                  </button>
                </div>

                <div className="flex gap-2.5 px-5 pb-5 pt-2">
                  <button
                    onClick={() => setPopupStep("results")}
                    className="flex-1 py-2.5 rounded-lg text-sm transition-colors"
                    style={{ background: CARD2, border: `1px solid ${BORDER}`, color: "#E7ECF5" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1a2540")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = CARD2)}
                  >
                    ← Ver materiales
                  </button>
                  <button
                    onClick={handleConfirmSend}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1.5"
                    style={{ background: GREEN, border: "none", color: "#fff" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = GREEN_H)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = GREEN)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enviar por WhatsApp
                  </button>
                </div>
              </>
            )}

            {/* ── PASO: Enviado ── */}
            {popupStep === "sent" && (
              <div
                className="flex flex-col items-center justify-center px-6 py-10 text-center gap-4"
                style={{ flex: 1 }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{ background: "rgba(37,211,102,0.15)" }}
                >
                  ✅
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">¡Solicitud enviada!</h3>
                  <p className="text-sm" style={{ color: TEXT_SOFT }}>
                    Se abrió WhatsApp con tu lista de materiales. Un asesor de TumbadosZumba te
                    contactará pronto.
                  </p>
                </div>
                <button
                  onClick={handleClosePopup}
                  className="mt-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors"
                  style={{ background: ORANGE, border: "none", color: "#fff" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animación de entrada del modal */}
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </>
  )
}
