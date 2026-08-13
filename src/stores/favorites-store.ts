import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/types"

interface FavoritesState {
  items: Product[]

  // Actions
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void

  // Computed helpers
  isFavorite: (productId: string) => boolean
  getItemCount: () => number
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id)
          if (existingItem) return state
          return {
            items: [...state.items, product],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      toggleItem: (product) => {
        const isFav = get().isFavorite(product.id)
        if (isFav) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },

      isFavorite: (productId) => {
        return get().items.some((item) => item.id === productId)
      },

      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: "basictech-favorites",
    }
  )
)
