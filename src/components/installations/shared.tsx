import { cn } from "@/lib/utils"

/**
 * Piezas del estilo "ficha técnica" de /instalaciones: cuadrícula de plano,
 * etiquetas en mono y naranja de marca como único acento. Cada clase trae su
 * variante clara y oscura.
 */

export const surface = "bg-white dark:bg-[#0F1624]"
export const pageBg = "bg-slate-50 dark:bg-[#0A0D14]"
export const line = "border-slate-200 dark:border-[#1E293B]"
export const fieldLine = "border-slate-300 dark:border-[#263244]"
export const dashedLine = "border-dashed border-slate-300 dark:border-[#263244]"
export const mutedText = "text-slate-600 dark:text-slate-400"
export const monoLabel = "font-mono text-[11px] uppercase tracking-[0.1em] text-slate-500"
export const blueprint =
  "bg-[linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"

export const btnPrimary =
  "inline-flex items-center justify-between gap-4 bg-brand-orange px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#E06A12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:opacity-60"
export const btnGhost = cn(
  "inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-brand-orange hover:text-brand-orange dark:text-white dark:hover:border-brand-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange",
  fieldLine
)
export function SectionTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(monoLabel, "inline-flex items-center gap-2", className)}>
      <span aria-hidden className="size-[7px] bg-brand-orange" />
      {children}
    </span>
  )
}

/** "01 · Residencial": número de obra en naranja + categoría */
export function IndexTag({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <span className={monoLabel}>
      <span className="mr-2 text-brand-orange">{String(index).padStart(2, "0")}</span>
      {children}
    </span>
  )
}

/** Esquinas de encuadre naranjas alrededor de una figura (el padre debe ser relative) */
export function FrameCorners() {
  const base = "pointer-events-none absolute z-10 size-3.5 border-brand-orange"
  return (
    <>
      <span aria-hidden className={cn(base, "-left-1.5 -top-1.5 border-l border-t")} />
      <span aria-hidden className={cn(base, "-right-1.5 -top-1.5 border-r border-t")} />
      <span aria-hidden className={cn(base, "-bottom-1.5 -left-1.5 border-b border-l")} />
      <span aria-hidden className={cn(base, "-bottom-1.5 -right-1.5 border-b border-r")} />
    </>
  )
}
