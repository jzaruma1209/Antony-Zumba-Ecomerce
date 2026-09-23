import { Truck, RotateCcw, ShieldCheck } from "lucide-react"

export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-6 items-center justify-between text-[11px]">
          <div className="flex items-center gap-1">
            <span className="hidden sm:inline">Envío a</span>
            <span className="font-semibold">Ecuador</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Envío Confiable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Garantía de Calidad</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Compra Segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
