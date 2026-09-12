"use client"

import { useEffect, useRef, useState } from "react"

interface TikTokEmbedProps {
  videoId: string
  citeUrl: string // Para compatibilidad con los props antiguos, aunque no lo usemos en el iframe
  index?: number // Posición en la grilla, usada para escalonar la carga
}

// TikTok activa su "overload protection" (503 / "overload-protect triggered")
// cuando recibe demasiados embeds al mismo tiempo desde la misma sesión.
// Por eso montamos el iframe solo cuando entra al viewport, y con un pequeño
// retraso escalonado por posición para no disparar varias peticiones a la vez.
const STAGGER_MS = 700

export function TikTokEmbed({ videoId, index = 0 }: TikTokEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const timeout = setTimeout(() => setShouldLoad(true), index * STAGGER_MS)
          return () => clearTimeout(timeout)
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center items-center overflow-hidden rounded-xl bg-card border min-h-[730px]"
      style={{ maxWidth: "325px", minWidth: "280px" }}
    >
      {shouldLoad && (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}?lang=es-ES`}
          className="w-full h-[730px] sm:h-[730px]"
          style={{ maxWidth: "325px", minWidth: "280px", border: "none" }}
          allowFullScreen
          scrolling="no"
          allow="encrypted-media;"
        />
      )}
    </div>
  )
}
