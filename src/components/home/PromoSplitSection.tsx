"use client"

import { useState } from "react"
import { Calculator, Ruler, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const plankTypes = ["Plancha Estándar", "Resistente a Humedad (RH)", "Resistente al Fuego (RF)"]

export function PromoSplitSection() {
  const [step, setStep] = useState<1 | 2>(1)
  const [ancho, setAncho] = useState("")
  const [alto, setAlto] = useState("")
  const [tipo, setTipo] = useState("")

  return (
    <article className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-blue text-white p-5 flex flex-col justify-between select-none">
      {/* Subtle glow */}
      <div className="absolute -right-10 -top-10 size-36 rounded-full bg-brand-blue-light/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-white/10 shrink-0">
              <Calculator className="size-4 text-white" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white leading-none">
                Calculadora Gypsum
              </h3>
              <p className="text-[10px] text-white/60 mt-0.5">Calcula planchas al instante</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0.5 text-[10px] font-medium">
            <button
              onClick={() => setStep(1)}
              className={`px-2 py-0.5 rounded transition-all ${
                step === 1 ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              1
            </button>
            <span className="text-white/30">·</span>
            <button
              onClick={() => setStep(2)}
              className={`px-2 py-0.5 rounded transition-all ${
                step === 2 ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              2
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col justify-center">
          {step === 1 ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-white/70 block mb-1" htmlFor="calc-ancho">
                  Ancho (m)
                </label>
                <input
                  id="calc-ancho"
                  type="number"
                  value={ancho}
                  onChange={(e) => setAncho(e.target.value)}
                  placeholder="3.00"
                  className="w-full rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-white/70 block mb-1" htmlFor="calc-alto">
                  Alto (m)
                </label>
                <input
                  id="calc-alto"
                  type="number"
                  value={alto}
                  onChange={(e) => setAlto(e.target.value)}
                  placeholder="2.40"
                  className="w-full rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-medium text-white/70 block mb-1" htmlFor="calc-tipo">
                Tipo de plancha
              </label>
              <select
                id="calc-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full appearance-none rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/30"
              >
                <option value="" disabled className="text-slate-900">
                  Selecciona una opción
                </option>
                {plankTypes.map((t) => (
                  <option key={t} value={t} className="text-slate-900">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10">
          {step === 1 ? (
            <Button
              size="sm"
              onClick={() => setStep(2)}
              className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-8 rounded-md"
            >
              Siguiente <ChevronRight className="ml-1 size-3" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-white/70 hover:text-white hover:bg-white/10 text-xs h-8 px-2"
              >
                ← Atrás
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs font-semibold h-8 rounded-md"
              >
                <Ruler className="mr-1 size-3" />
                Calcular
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
