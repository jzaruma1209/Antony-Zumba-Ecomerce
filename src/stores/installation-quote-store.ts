import { create } from "zustand"
import type { QuoteProjectType } from "@/data/installation-projects"

interface QuoteReference {
  type: QuoteProjectType
  title: string
}

interface InstallationQuoteState {
  /** obra elegida con "Quiero uno así"; el formulario de /instalaciones se autocompleta con ella */
  reference: QuoteReference | null

  // Actions
  requestQuote: (type: QuoteProjectType, title: string) => void
  clearReference: () => void
}

export const useInstallationQuoteStore = create<InstallationQuoteState>()((set) => ({
  reference: null,

  requestQuote: (type, title) => {
    set({ reference: { type, title } })
  },

  clearReference: () => {
    set({ reference: null })
  },
}))
