"use client"

import { useState, useEffect } from "react"
import { Calculator } from "@/types"
import { Calculator as CalculatorIcon, Package, X, Trash2, RotateCcw } from "lucide-react"

const WA_NUMBER = "593990099265"

const ceil = (x: number) => Math.ceil(x - 1e-9)
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

interface MaterialItem {
  name: string
  qty: number
  unit: string
}

export function DynamicCalculatorSection() {
  const [calculators, setCalculators] = useState<Calculator[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCalcId, setSelectedCalcId] = useState<string>("")
  const [area, setArea] = useState("32")
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<MaterialItem[]>([])
  const [clientName, setClientName] = useState("")

  useEffect(() => {
    loadCalculators()
  }, [])

  async function loadCalculators() {
    try {
      const res = await fetch("/api/calculators")
      if (res.ok) {
        const data = await res.json()
        setCalculators(data)
        if (data.length > 0) {
          setSelectedCalcId(data[0].id)
        }
      }
    } catch (err) {
      console.error("Error loading calculators:", err)
    } finally {
      setLoading(false)
    }
  }

  function handleCalc() {
    if (!selectedCalcId || !area) {
      alert("Por favor selecciona una calculadora e ingresa el área")
      return
    }

    const calculator = calculators.find(c => c.id === selectedCalcId)
    if (!calculator) return

    const areaNum = parseFloat(area)
    if (areaNum <= 0) {
      alert("El área debe ser mayor a 0")
      return
    }

    const items: MaterialItem[] = calculator.materials.map(mat => ({
      name: mat.name,
      qty: ceil(areaNum * mat.yield),
      unit: mat.unit
    }))

    setResults(items)
    setShowResults(true)
  }

  function handleRemoveItem(index: number) {
    setResults(prev => prev.filter((_, i) => i !== index))
  }

  function handleResetItems() {
    if (!selectedCalcId || !area) return
    const calculator = calculators.find(c => c.id === selectedCalcId)
    if (!calculator) return

    const areaNum = parseFloat(area)
    if (areaNum <= 0) return

    const items: MaterialItem[] = calculator.materials.map(mat => ({
      name: mat.name,
      qty: ceil(areaNum * mat.yield),
      unit: mat.unit
    }))

    setResults(items)
  }

  function handleSendWhatsApp() {
    if (results.length === 0) {
      alert("Agrega al menos un material a la lista para enviar la proforma")
      return
    }

    if (!clientName.trim()) {
      alert("Por favor ingresa tu nombre")
      return
    }

    const calculator = calculators.find(c => c.id === selectedCalcId)
    if (!calculator) return

    const itemsList = results
      .map(item => `• ${item.name}: *${fmt(item.qty)} ${item.unit}*`)
      .join("\n")

    const msg = encodeURIComponent(
      `🏗️ *Solicitud de Proforma - TumbadosZumba*\n\n` +
      `👤 *Cliente:* ${clientName.trim()}\n` +
      `📐 *Sistema:* ${calculator.name}\n` +
      `📏 *Área:* ${fmt(parseFloat(area))} m²\n\n` +
      `📦 *Materiales (${results.length}):*\n${itemsList}\n\n` +
      `Por favor cotizar. ¡Gracias! 🙏`
    )

    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank")
  }

  if (loading) {
    return (
      <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white">
        <p>Cargando calculadora...</p>
      </div>
    )
  }

  if (calculators.length === 0) {
    return (
      <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white">
        <p>No hay calculadoras disponibles</p>
      </div>
    )
  }

  const selectedCalc = calculators.find(c => c.id === selectedCalcId)

  return (
    <>
      <article
        className="relative h-full w-full overflow-hidden rounded-xl text-white select-none p-4"
        style={{
          background: "linear-gradient(160deg, #2E6BFF 0%, #1E4FD6 55%, #0a1a3a 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: "rgba(46,107,255,0.2)", filter: "blur(24px)" }} />

        <div className="relative z-10 flex flex-col h-full gap-2.5">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: "rgba(255,255,255,0.15)" }}>
              <CalculatorIcon size={16} strokeWidth={1.75} className="text-white" />
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

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.75)" }}>
              Sistema constructivo
            </label>
            <select
              value={selectedCalcId}
              onChange={(e) => setSelectedCalcId(e.target.value)}
              className="w-full rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}
            >
              {calculators.map((calc) => (
                <option key={calc.id} value={calc.id} style={{ color: "#111" }}>
                  {calc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.75)" }}>
              Metros Cuadrados (m²)
            </label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Ej: 15.00"
              step="0.1"
              min="0.1"
              className="w-full rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/35 focus:outline-none"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}
            />
          </div>

          <div className="mt-auto pt-1">
            <button
              onClick={handleCalc}
              className="w-full flex items-center justify-center gap-1.5 font-bold text-xs py-2 rounded-lg transition-all shadow-md active:scale-95"
              style={{ background: "#F0731E" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FF8A2E")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#F0731E")}
            >
              Calcular Materiales →
            </button>
          </div>
        </div>
      </article>

      {showResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3" style={{ background: "rgba(2,4,10,0.82)", backdropFilter: "blur(5px)" }}>
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              maxWidth: 520,
              maxHeight: "92vh",
              background: "#0B1220",
              border: "1px solid #1F2A40",
              boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="flex items-start justify-between px-5 py-4 border-b" style={{ borderColor: "#1F2A40" }}>
              <div>
                <h3 className="text-base font-bold text-white m-0 flex items-center gap-2">
                  <Package size={20} strokeWidth={1.75} className="text-[#F0731E]" />
                  <span>{selectedCalc?.name}</span>
                </h3>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <p className="text-xs" style={{ color: "#8B95AC" }}>
                    Área: <span className="font-mono">{fmt(parseFloat(area))}</span> m² • {results.length} materiales
                  </p>
                  {selectedCalc && results.length < selectedCalc.materials.length && (
                    <button
                      type="button"
                      onClick={handleResetItems}
                      className="text-[11px] text-orange-400 hover:text-orange-300 hover:underline inline-flex items-center gap-1 transition-colors"
                      title="Restablecer todos los materiales calculados"
                    >
                      <RotateCcw size={12} strokeWidth={1.75} />
                      Restablecer
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="text-white/60 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-2 flex-1 divide-y divide-[#1F2A40]" style={{ borderColor: "#1F2A40" }}>
              {results.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  <p className="text-sm">Has quitado todos los materiales de la lista.</p>
                  <button
                    type="button"
                    onClick={handleResetItems}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-orange-400 font-semibold hover:underline"
                  >
                    <RotateCcw size={14} strokeWidth={1.75} />
                    Restablecer lista original
                  </button>
                </div>
              ) : (
                results.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 gap-3">
                    <span className="text-sm text-white flex-1 min-w-0 pr-2">{item.name}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-sm" style={{ color: "#F0731E" }}>
                        {fmt(item.qty)} {item.unit}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-white/10 active:scale-95 transition-all"
                        title="Quitar este material antes de enviar"
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 size={16} strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-4 space-y-3 border-t" style={{ borderColor: "#1F2A40" }}>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Tu nombre (requerido)"
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
                style={{ background: "#111B2E", border: "1px solid #1F2A40" }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResults(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm transition-colors"
                  style={{ background: "#111B2E", border: "1px solid #1F2A40", color: "#E7ECF5" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendWhatsApp}
                  disabled={results.length === 0}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#25D366" }}
                  onMouseEnter={(e) => {
                    if (results.length > 0) (e.currentTarget as HTMLButtonElement).style.background = "#20bd5a"
                  }}
                  onMouseLeave={(e) => {
                    if (results.length > 0) (e.currentTarget as HTMLButtonElement).style.background = "#25D366"
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
