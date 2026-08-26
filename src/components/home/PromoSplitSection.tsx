"use client"

import { useState } from "react"

// ── Número de WhatsApp destino ─────────────────────────────────────────────
const WA_NUMBER = "593990099265" // Ecuador: 0990099265 → internacional sin +

// ── Helpers ────────────────────────────────────────────────────────────────
const ceil = (x: number) => Math.ceil(x - 1e-9)
const mx = (a: number, b: number) => Math.max(a, b)
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

// ── Tipos ──────────────────────────────────────────────────────────────────
type ResultRow = [string, number, string, string]

export interface MaterialItem {
  id: string
  name: string
  qty: number
  unit: string
  coef: string
  isCustom?: boolean
}

interface Module {
  id: string
  name: string
  sub: string
  adv: string[]
  calc: (area: number, settings: { stud: number; lana: number }) => ResultRow[]
  note?: string
}

// ── Unidades disponibles para materiales personalizados ────────────────────
const AVAILABLE_UNITS = [
  "und",
  "tira",
  "rollo",
  "balde",
  "saco",
  "ml",
  "caja",
  "galón",
  "par",
  "paquete",
  "kg",
  "plancha",
  "otro",
]

// ── Módulos de cálculo ─────────────────────────────────────────────────────
const MODULES: Module[] = [
  {
    id: "gypsum_pared",
    name: "Gypsum (Pared/Tumbado)",
    sub: "Plancha, estructura y masilla",
    adv: [],
    calc(A) {
      return [
        ["Planchas", ceil(A * 0.35), "plancha", "0.35 plancha/m²"],
        ["Ángulos", ceil(A * 0.6), "und", "0.60 und/m²"],
        ["Primarios", ceil(A * 0.24), "und", "0.24 und/m²"],
        ["Omegas", ceil(A * 0.45), "und", "0.45 und/m²"],
        ["Clavos", ceil(A * 8), "und", "8.00 und/m²"],
        ["Autoperforantes", ceil(A * 6), "und", "6.00 und/m²"],
        ["Tornillo Plancha", ceil(A * 15), "und", "15.00 und/m²"],
        ["Masilla", ceil(A * 0.03), "caneca", "0.03 caneca/m²"],
        ["Cinta Fibra Malla", ceil(A * 0.02), "und", "0.02 und/m²"],
        ["Cinta Papel", ceil(A * 0.02), "und", "0.02 und/m²"],
        ["Lija 150", ceil(A * 0.05), "und", "0.05 und/m²"],
        ["Wesco Caneca", ceil(A * 0.01), "caneca", "0.01 caneca/m²"],
        ["Wesco Galón", ceil(A * 0.02), "galón", "0.02 galón/m²"],
      ]
    },
  },
  {
    id: "cielo_raso_120x60",
    name: "Cielo Raso 1.20×0.60",
    sub: "Planchas y perfilería",
    adv: [],
    calc(A) {
      return [
        ["Planchas Cielo", ceil(A * 1.4), "plancha", "1.40 plancha/m²"],
        ["Ángulos", ceil(A * 0.3), "und", "0.30 und/m²"],
        ["Tee 12", ceil(A * 0.23), "und", "0.23 und/m²"],
        ["Tee 4", ceil(A * 1.35), "und", "1.35 und/m²"],
        ["Clavos", ceil(A * 8), "und", "8.00 und/m²"],
        ["Alambre 18", ceil(A * 0.04), "rollo", "0.04 rollo/m²"],
      ]
    },
  },
  {
    id: "cielo_raso_60x60",
    name: "Cielo Raso 60×60",
    sub: "Planchas y perfilería",
    adv: [],
    calc(A) {
      return [
        ["Planchas Cielo", ceil(A * 1.4), "plancha", "1.40 plancha/m²"],
        ["Ángulos", ceil(A * 0.3), "und", "0.30 und/m²"],
        ["Tee 12", ceil(A * 0.23), "und", "0.23 und/m²"],
        ["Tee 4", ceil(A * 1.35), "und", "1.35 und/m²"],
        ["Tee 2", ceil(A * 1.35), "und", "1.35 und/m²"],
        ["Clavos", ceil(A * 8), "und", "8.00 und/m²"],
        ["Alambre 18", ceil(A * 0.04), "rollo", "0.04 rollo/m²"],
      ]
    },
  },
  {
    id: "duela_pvc",
    name: "Duela PVC 5.95×0.25m",
    sub: "Duelas y estructura",
    adv: [],
    calc(A) {
      return [
        ["Duelas", ceil(A * 0.72), "und", "0.72 und/m²"],
        ["Cornisa", ceil(A * 0.12), "und", "0.12 und/m²"],
        ["Ángulos", ceil(A * 0.6), "und", "0.60 und/m²"],
        ["Primarios", ceil(A * 0.24), "und", "0.24 und/m²"],
        ["Omegas", ceil(A * 0.45), "und", "0.45 und/m²"],
        ["Clavos", ceil(A * 8), "und", "8.00 und/m²"],
        ["Autoperforantes", ceil(A * 6), "und", "6.00 und/m²"],
        ["Autoperforante Punta Aguja", ceil(A * 10), "und", "10.00 und/m²"],
      ]
    },
  },
  {
    id: "empaste",
    name: "Empaste",
    sub: "Empaste, pintura y sellador",
    adv: [],
    calc(A) {
      return [
        ["Empaste", ceil(A * 0.05), "und", "0.05 und/m²"],
        ["Pintura", ceil(A * 0.01), "caneca", "0.01 caneca/m²"],
        ["Sellador", ceil(A * 0.02), "galón", "0.02 galón/m²"],
        ["Lija 36", ceil(A * 0.03), "und", "0.03 und/m²"],
        ["Lija 150 180", ceil(A * 0.05), "und", "0.05 und/m²"],
      ]
    },
  },
]

// ── Tipos de popup ─────────────────────────────────────────────────────────
type PopupStep = "adv" | "results" | "identify" | "confirm" | "sent"

export interface CalcResult {
  modName: string
  inputMode: "area" | "dimensions"
  area: number
  ancho?: number
  alto?: number
  items: MaterialItem[]
  note?: string
}

// ── Estilos compartidos inline ─────────────────────────────────────────────
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
    >
      ✕
    </button>
  )
}

export function PromoSplitSection() {
  // ── Calculadora (widget fijo) ──
  const [modId, setModId] = useState(MODULES[0].id)
  const [inputMode, setInputMode] = useState<"area" | "dimensions">("area")
  const [areaDirecta, setAreaDirecta] = useState("")
  const [ancho, setAncho] = useState("")
  const [alto, setAlto] = useState("")

  // ── Opciones avanzadas ──
  const [advStud, setAdvStud] = useState("0.610")
  const [advLana, setAdvLana] = useState("35.70")
  const [advLanaCustom, setAdvLanaCustom] = useState("20")

  // ── Popup ──
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupStep, setPopupStep] = useState<PopupStep>("results")
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null)

  // ── Agregar material adicional ("Otro material") ──
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [customName, setCustomName] = useState("")
  const [customQty, setCustomQty] = useState("1")
  const [customUnit, setCustomUnit] = useState("und")

  // ── Identificación ──
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [contactError, setContactError] = useState("")

  // ── Confirmación de eliminación de ítem ──
  const [itemToDelete, setItemToDelete] = useState<MaterialItem | null>(null)

  const currentMod = MODULES.find((m) => m.id === modId)!
  const hasAdv = currentMod.adv.length > 0

  const effectiveLana =
    advLana === "custom" ? parseFloat(advLanaCustom) || 1 : parseFloat(advLana)
  const effectiveStud = parseFloat(advStud)

  // ── Cuando el usuario pulsa "Calcular" ──
  function handleCalcClick() {
    if (hasAdv) {
      setPopupStep("adv")
      setPopupOpen(true)
    } else {
      doCalc()
    }
  }

  // ── Cálculo efectivo ──
  function doCalc() {
    let A = 0
    let a = 0
    let al = 0

    if (inputMode === "area") {
      A = parseFloat(areaDirecta) || 0
      if (A <= 0) {
        alert("Por favor ingresa un área válida en metros cuadrados (m² > 0)")
        setPopupOpen(false)
        return
      }
    } else {
      a = parseFloat(ancho) || 0
      al = parseFloat(alto) || 0
      A = a * al
      if (A <= 0) {
        alert("Por favor ingresa medidas válidas (Ancho y Alto > 0)")
        setPopupOpen(false)
        return
      }
    }

    const rawRows = currentMod.calc(A, { stud: effectiveStud, lana: effectiveLana })
    const items: MaterialItem[] = rawRows.map(([name, qty, unit, coef], idx) => ({
      id: `calc-${idx}-${name}`,
      name,
      qty,
      unit,
      coef,
    }))

    setCalcResult({
      modName: currentMod.name,
      inputMode,
      area: A,
      ancho: a > 0 ? a : undefined,
      alto: al > 0 ? al : undefined,
      items,
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
    setShowAddCustom(false)
    setCustomName("")
    setCustomQty("1")
    setCustomUnit("und")
    setItemToDelete(null)
  }

  // ── Modificar cantidad de un material ──
  function handleUpdateQty(id: string, newQty: number) {
    if (!calcResult) return
    const validQty = Math.max(1, Number.isFinite(newQty) ? newQty : 1)
    setCalcResult({
      ...calcResult,
      items: calcResult.items.map((item) =>
        item.id === id ? { ...item, qty: validQty } : item
      ),
    })
  }

  // ── Incrementar o decrementar cantidad (+ / -) ──
  function handleIncrementQty(id: string, delta: number) {
    if (!calcResult) return
    setCalcResult({
      ...calcResult,
      items: calcResult.items.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(1, Math.round(item.qty + delta))
          return { ...item, qty: nextQty }
        }
        return item
      }),
    })
  }

  // ── Eliminar un material de la lista ──
  function handleDeleteItem(id: string) {
    if (!calcResult) return
    setCalcResult({
      ...calcResult,
      items: calcResult.items.filter((item) => item.id !== id),
    })
  }

  // ── Agregar material adicional ("Otro material") ──
  function handleAddCustomItem() {
    if (!calcResult) return
    if (!customName.trim()) {
      alert("Por favor ingresa el nombre del material a agregar.")
      return
    }
    const qty = parseFloat(customQty) || 1
    const newItem: MaterialItem = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      qty: Math.max(1, qty),
      unit: customUnit.trim() || "und",
      coef: "Material personalizado",
      isCustom: true,
    }
    setCalcResult({
      ...calcResult,
      items: [...calcResult.items, newItem],
    })
    setCustomName("")
    setCustomQty("1")
    setCustomUnit("und")
    setShowAddCustom(false)
  }

  // ── Restablecer lista original de materiales calculados ──
  function handleResetItems() {
    if (!calcResult) return
    const rawRows = currentMod.calc(calcResult.area, { stud: effectiveStud, lana: effectiveLana })
    const items: MaterialItem[] = rawRows.map(([name, qty, unit, coef], idx) => ({
      id: `calc-${idx}-${name}`,
      name,
      qty,
      unit,
      coef,
    }))
    setCalcResult({
      ...calcResult,
      items,
    })
  }

  // ── Paso de identificación (Correo es opcional) ──
  function handleSendIdentify() {
    if (!clientName.trim()) {
      setContactError("Por favor ingresa tu nombre.")
      return
    }
    setContactError("")
    setPopupStep("confirm")
  }

  // ── Construir mensaje de WhatsApp ──
  function buildWAMessage(result: CalcResult) {
    const itemsList =
      result.items.length > 0
        ? result.items
            .map(
              (item) =>
                `• ${item.name}: *${fmt(item.qty)} ${item.unit}*${
                  item.isCustom ? " _(adicional)_" : ""
                }`
            )
            .join("\n")
        : "_(Sin materiales seleccionados)_"

    const areaStr =
      result.inputMode === "dimensions" && result.ancho && result.alto
        ? `${result.ancho}m × ${result.alto}m = ${fmt(result.area)} m²`
        : `${fmt(result.area)} m²`

    const emailStr = clientEmail.trim() ? `📧 *Correo:* ${clientEmail.trim()}\n` : ""

    return (
      `🏗️ *Solicitud de Proforma de Materiales - TumbadosZumba*\n\n` +
      `👤 *Cliente:* ${clientName.trim()}\n` +
      emailStr +
      `\n📐 *Sistema:* ${result.modName}\n` +
      `📏 *Área:* ${areaStr}\n\n` +
      `📦 *Materiales solicitados (${result.items.length}):*\n${itemsList}\n\n` +
      `Por favor cotizar los materiales indicados. ¡Muchas gracias! 🙏`
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
          WIDGET FIJO (Calculadora en Inicio)
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

        <div className="relative z-10 flex flex-col h-full p-4 gap-2.5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              🧮
            </div>
            <div>
              <h3 className="text-xs font-bold leading-none text-white uppercase tracking-wider">
                Calculadora de Materiales
              </h3>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>
                Cotiza tus materiales al instante
              </p>
            </div>
          </div>

          {/* Sistema */}
          <div>
            <label
              className="block text-[10px] font-semibold uppercase tracking-wide mb-1"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Sistema constructivo
            </label>
            <select
              value={modId}
              onChange={(e) => setModId(e.target.value)}
              className="w-full rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              {MODULES.map((m) => (
                <option key={m.id} value={m.id} style={{ color: "#111" }}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de modo: m² Directos vs Ancho × Alto */}
          <div>
            <div
              className="flex rounded-lg p-0.5 mb-1.5"
              style={{ background: "rgba(0, 0, 0, 0.25)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <button
                type="button"
                onClick={() => setInputMode("area")}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                  inputMode === "area"
                    ? "bg-white text-blue-900 shadow-sm"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <span>📐</span> m² Área
              </button>
              <button
                type="button"
                onClick={() => setInputMode("dimensions")}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                  inputMode === "dimensions"
                    ? "bg-white text-blue-900 shadow-sm"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <span>📏</span> Ancho × Alto
              </button>
            </div>

            {inputMode === "area" ? (
              <div>
                <label
                  className="block text-[10px] font-semibold uppercase tracking-wide mb-1"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  Metros Cuadrados (m²)
                </label>
                <input
                  type="number"
                  value={areaDirecta}
                  onChange={(e) => setAreaDirecta(e.target.value)}
                  placeholder="Ej: 15.00"
                  step="0.1"
                  min="0.1"
                  className="w-full rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/35 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.22)",
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    Ancho (m)
                  </label>
                  <input
                    type="number"
                    value={ancho}
                    onChange={(e) => setAncho(e.target.value)}
                    placeholder="3.00"
                    step="0.1"
                    className="w-full rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/35 focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-[10px] font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    Alto (m)
                  </label>
                  <input
                    type="number"
                    value={alto}
                    onChange={(e) => setAlto(e.target.value)}
                    placeholder="2.40"
                    step="0.1"
                    className="w-full rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/35 focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botón Calcular */}
          <div className="mt-auto pt-1">
            <button
              onClick={handleCalcClick}
              className="w-full flex items-center justify-center gap-1.5 font-bold text-xs py-2 rounded-lg transition-all shadow-md active:scale-95"
              style={{ background: ORANGE, color: "#fff", border: "none" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
            >
              Calcular Materiales →
            </button>
          </div>
        </div>
      </article>

      {/* ══════════════════════════════════════════════
          POPUP MODAL MULTIPASO
      ══════════════════════════════════════════════ */}
      {popupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          style={{ background: "rgba(2,4,10,0.82)", backdropFilter: "blur(5px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClosePopup()
          }}
        >
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              maxWidth: 540,
              maxHeight: "92vh",
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
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
                      {currentMod.sub} — ajusta las opciones y medidas
                    </p>
                  </div>
                  <CloseBtn onClick={handleClosePopup} />
                </div>

                <div className="px-5 py-4 space-y-3.5 overflow-y-auto" style={{ flex: 1 }}>
                  {/* Selector de modo y medidas */}
                  <div>
                    <div
                      className="flex rounded-lg p-0.5 mb-2"
                      style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                    >
                      <button
                        type="button"
                        onClick={() => setInputMode("area")}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                          inputMode === "area"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <span>📐</span> Por Área (m²)
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode("dimensions")}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 ${
                          inputMode === "dimensions"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <span>📏</span> Ancho × Alto
                      </button>
                    </div>

                    {inputMode === "area" ? (
                      <div>
                        <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: TEXT_SOFT }}>
                          Metros Cuadrados (m²)
                        </label>
                        <input
                          type="number"
                          value={areaDirecta}
                          onChange={(e) => setAreaDirecta(e.target.value)}
                          placeholder="Ej: 15.00"
                          step="0.1"
                          min="0.1"
                          className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                          style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                        />
                      </div>
                    ) : (
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
                    )}
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

                <div className="flex gap-2.5 px-5 pb-5 pt-2 border-t" style={{ borderColor: BORDER }}>
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
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg"
                    style={{ background: ORANGE, border: "none", color: "#fff" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
                  >
                    Calcular Materiales →
                  </button>
                </div>
              </>
            )}

            {/* ── PASO: Resultados de Materiales (Editable) ── */}
            {popupStep === "results" && calcResult && (
              <>
                <div
                  className="flex items-start justify-between px-5 py-4 border-b"
                  style={{ borderColor: BORDER, background: CARD_BG, position: "sticky", top: 0, zIndex: 10 }}
                >
                  <div>
                    <h3 className="text-base font-bold text-white m-0 flex items-center gap-2">
                      <span>📦</span> {calcResult.modName}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SOFT }}>
                      {calcResult.inputMode === "dimensions" && calcResult.ancho && calcResult.alto
                        ? `Área: ${calcResult.ancho}m × ${calcResult.alto}m = ${fmt(calcResult.area)} m²`
                        : `Área: ${fmt(calcResult.area)} m²`}
                    </p>
                  </div>
                  <CloseBtn onClick={handleClosePopup} />
                </div>

                {/* Sub-header de ayuda */}
                <div className="px-5 py-2 flex items-center justify-between text-[11px] bg-blue-950/40 border-b" style={{ borderColor: BORDER }}>
                  <span className="text-blue-200">
                    💡 Puedes modificar cantidades con <strong>+ / -</strong> o eliminar materiales.
                  </span>
                  <button
                    type="button"
                    onClick={handleResetItems}
                    className="text-[10px] text-orange-400 hover:underline hover:text-orange-300 ml-2"
                  >
                    ↺ Restablecer
                  </button>
                </div>

                <div className="overflow-y-auto px-5 py-3 divide-y" style={{ flex: 1, borderColor: BORDER }}>
                  {calcResult.items.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-sm text-gray-400">No hay materiales en la lista.</p>
                      <button
                        type="button"
                        onClick={handleResetItems}
                        className="mt-2 text-xs text-orange-400 font-semibold hover:underline"
                      >
                        Restablecer cálculo de materiales
                      </button>
                    </div>
                  ) : (
                    calcResult.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2.5 gap-2"
                        style={{ borderColor: BORDER }}
                      >
                        {/* Nombre del material y detalle */}
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm text-white font-medium truncate">
                              {item.name}
                            </span>
                            {item.isCustom && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/30">
                                Extra
                              </span>
                            )}
                          </div>
                          <span className="block text-[10px] mt-0.5 truncate" style={{ color: TEXT_SOFT }}>
                            {item.coef}
                          </span>
                        </div>

                        {/* Controles de Cantidad (+ / -) y Eliminar */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Botón Decrementar (-) */}
                          <button
                            type="button"
                            onClick={() => handleIncrementQty(item.id, -1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold text-white transition-colors bg-white/10 hover:bg-white/20 active:scale-95"
                            title="Disminuir cantidad"
                          >
                            −
                          </button>

                          {/* Input numérico de cantidad */}
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleUpdateQty(item.id, parseFloat(e.target.value) || 1)}
                            className="w-12 text-center text-sm font-bold font-mono text-orange-400 rounded-md py-1 px-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                          />

                          {/* Botón Incrementar (+) */}
                          <button
                            type="button"
                            onClick={() => handleIncrementQty(item.id, 1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold text-white transition-colors bg-white/10 hover:bg-white/20 active:scale-95"
                            title="Aumentar cantidad"
                          >
                            +
                          </button>

                          {/* Unidad */}
                          <span className="text-xs w-10 text-left font-medium" style={{ color: TEXT_SOFT }}>
                            {item.unit}
                          </span>

                          {/* Botón Eliminar item (con confirmación) */}
                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            className="w-7 h-7 ml-1 rounded-md flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/15 transition-colors"
                            title="Eliminar este material"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {/* ── Sección: Agregar "Otro Material" ── */}
                  <div className="pt-3 pb-1 border-t" style={{ borderColor: BORDER }}>
                    {!showAddCustom ? (
                      <button
                        type="button"
                        onClick={() => setShowAddCustom(true)}
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-dashed hover:border-solid"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.2)",
                          color: "#E7ECF5",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)")}
                      >
                        <span className="text-orange-400 text-sm font-bold">＋</span> Agregar otro material personalizado
                      </button>
                    ) : (
                      <div
                        className="p-3 rounded-xl space-y-2.5 animate-fadeIn"
                        style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                            <span>➕</span> Agregar otro material
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowAddCustom(false)}
                            className="text-[11px] text-gray-400 hover:text-white"
                          >
                            Cancelar
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Nombre del material (ej: Cinta de Malla, Sellador...)"
                            className="w-full rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-gray-500 focus:outline-none"
                            style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-gray-400 mb-1">
                              Cantidad
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customQty}
                              onChange={(e) => setCustomQty(e.target.value)}
                              placeholder="1"
                              className="w-full rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-gray-500 focus:outline-none"
                              style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-semibold text-gray-400 mb-1">
                              Unidad
                            </label>
                            <select
                              value={customUnit}
                              onChange={(e) => setCustomUnit(e.target.value)}
                              className="w-full rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                              style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
                            >
                              {AVAILABLE_UNITS.map((u) => (
                                <option key={u} value={u} style={{ color: "#111" }}>
                                  {u}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddCustomItem}
                          className="w-full py-1.5 rounded-lg text-xs font-bold text-white transition-colors"
                          style={{ background: ORANGE }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
                        >
                          ✓ Guardar material en la lista
                        </button>
                      </div>
                    )}
                  </div>

                  <p
                    className="text-[11px] mt-2 pt-2"
                    style={{ color: TEXT_SOFT }}
                  >
                    {calcResult.note
                      ? `⚠ ${calcResult.note}`
                      : "Cantidades redondeadas comercialmente. Puedes modificarlas libremente."}
                  </p>
                </div>

                <div className="flex gap-2.5 px-5 pb-5 pt-3 border-t" style={{ borderColor: BORDER }}>
                  <button
                    onClick={handleClosePopup}
                    className="flex-1 py-2.5 rounded-lg text-sm transition-colors"
                    style={{ background: CARD2, border: `1px solid ${BORDER}`, color: "#E7ECF5" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1a2540")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = CARD2)}
                  >
                    ← Ajustar medidas
                  </button>
                  <button
                    onClick={() => setPopupStep("identify")}
                    disabled={calcResult.items.length === 0}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    style={{ background: ORANGE, border: "none", color: "#fff" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
                  >
                    Pedir Proforma ({calcResult.items.length}) →
                  </button>
                </div>
              </>
            )}

            {/* ── PASO: Identificación (Correo opcional) ── */}
            {popupStep === "identify" && (
              <>
                <div
                  className="flex items-start justify-between px-5 py-4 border-b"
                  style={{ borderColor: BORDER, background: CARD_BG }}
                >
                  <div>
                    <h3 className="text-base font-bold text-white m-0">Datos de contacto</h3>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SOFT }}>
                      Para personalizar tu cotización por WhatsApp
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
                      Tu nombre <span className="text-orange-400">*</span>
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
                      Correo electrónico <span className="text-gray-400 lowercase font-normal">(opcional)</span>
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com (opcional)"
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                      style={{ background: CARD2, border: `1px solid ${BORDER}` }}
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Si deseas recibir una copia digital de la cotización por correo.
                    </p>
                  </div>
                  {contactError && (
                    <p className="text-xs" style={{ color: ORANGE_H }}>
                      ⚠ {contactError}
                    </p>
                  )}
                </div>

                <div className="flex gap-2.5 px-5 pb-5 pt-2 border-t" style={{ borderColor: BORDER }}>
                  <button
                    onClick={() => setPopupStep("results")}
                    className="flex-1 py-2.5 rounded-lg text-sm transition-colors"
                    style={{ background: CARD2, border: `1px solid ${BORDER}`, color: "#E7ECF5" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1a2540")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = CARD2)}
                  >
                    ← Volver a materiales
                  </button>
                  <button
                    onClick={handleSendIdentify}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg"
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
                      Revisa tu solicitud antes de abrir WhatsApp
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
                    {clientEmail.trim() ? (
                      <p className="text-sm text-white mt-1">📧 {clientEmail}</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">📧 Sin correo (opcional)</p>
                    )}
                  </div>

                  <div className="rounded-lg p-3" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
                    <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: TEXT_SOFT }}>
                      Proforma solicitada
                    </p>
                    <p className="text-sm text-white">
                      🏗️ <strong>{calcResult.modName}</strong>
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: TEXT_SOFT }}>
                      {calcResult.inputMode === "dimensions" && calcResult.ancho && calcResult.alto
                        ? `${calcResult.ancho}m × ${calcResult.alto}m = ${fmt(calcResult.area)} m²`
                        : `Área: ${fmt(calcResult.area)} m²`}
                    </p>
                    <p className="text-xs mt-2 text-orange-400 font-semibold">
                      📦 {calcResult.items.length} materiales en la lista
                    </p>
                  </div>

                  <p className="text-[11px]" style={{ color: TEXT_SOFT }}>
                    Al pulsar el botón se abrirá WhatsApp con la lista exacta de materiales para que nuestro asesor te responda con la cotización formal.
                  </p>

                  <button
                    onClick={() => setPopupStep("identify")}
                    className="text-xs underline"
                    style={{ color: TEXT_SOFT, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    ¿Deseas editar tus datos de contacto? → Editar
                  </button>
                </div>

                <div className="flex gap-2.5 px-5 pb-5 pt-2 border-t" style={{ borderColor: BORDER }}>
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
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1.5 shadow-lg"
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
                    Se abrió WhatsApp con tu lista personalizada de materiales. Un asesor de TumbadosZumba te contactará pronto.
                  </p>
                </div>
                <button
                  onClick={handleClosePopup}
                  className="mt-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg"
                  style={{ background: ORANGE, border: "none", color: "#fff" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE_H)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = ORANGE)}
                >
                  Cerrar
                </button>
              </div>
            )}

            {/* ── Modal de Confirmación de Eliminación ── */}
            {itemToDelete && (
              <div
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setItemToDelete(null)}
              >
                <div
                  className="w-full max-w-sm rounded-2xl p-5 text-center shadow-2xl border animate-fadeScaleIn"
                  style={{ background: CARD_BG, borderColor: BORDER }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl mx-auto mb-3">
                    🗑️
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">
                    ¿Estás seguro de eliminar?
                  </h4>
                  <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                    Se eliminará <strong className="text-white">"{itemToDelete.name}"</strong> ({itemToDelete.qty} {itemToDelete.unit}) de tu lista de cotización.
                  </p>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setItemToDelete(null)}
                      className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{ background: CARD2, border: `1px solid ${BORDER}`, color: "#E7ECF5" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1a2540")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = CARD2)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteItem(itemToDelete.id)
                        setItemToDelete(null)
                      }}
                      className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white transition-colors bg-red-600 hover:bg-red-500 shadow-md"
                    >
                      Sí, eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animaciones */}
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
