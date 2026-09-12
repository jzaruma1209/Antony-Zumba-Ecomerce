"use client"

import { useState } from "react"
import { Play, RotateCw } from "lucide-react"

interface TikTokEmbedProps {
  videoId: string
  citeUrl: string
}

// TikTok activa su "overload protection" (503 / "overload-protect triggered")
// cuando recibe varios pedidos de embed casi al mismo tiempo desde la misma
// sesion, incluso si se escalonan por unos cientos de ms. La unica forma
// confiable de evitarlo es no pedir el iframe hasta que el usuario quiera
// ver ese video puntual (patron "facade"): así nunca se disparan varias
// peticiones simultaneas solo por entrar a la pagina.
export function TikTokEmbed({ videoId, citeUrl }: TikTokEmbedProps) {
  const [loadKey, setLoadKey] = useState<number | null>(null)

  const play = () => setLoadKey((key) => (key ?? 0) + 1)

  return (
    <div
      className="w-full flex justify-center items-center overflow-hidden rounded-xl bg-card border min-h-[730px] relative"
      style={{ maxWidth: "325px", minWidth: "280px" }}
    >
      {loadKey === null ? (
        <button
          type="button"
          onClick={play}
          className="group flex h-full w-full min-h-[730px] flex-col items-center justify-center gap-3 bg-muted/40 hover:bg-muted/60 transition-colors"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
            <Play className="h-6 w-6 fill-current ml-0.5" />
          </span>
          <span className="text-sm font-medium text-muted-foreground">Toca para reproducir</span>
          <span className="text-xs text-muted-foreground/70">Video de TikTok</span>
        </button>
      ) : (
        <>
          <iframe
            key={loadKey}
            src={`https://www.tiktok.com/embed/v2/${videoId}?lang=es-ES`}
            className="w-full h-[730px] sm:h-[730px]"
            style={{ maxWidth: "325px", minWidth: "280px", border: "none" }}
            allowFullScreen
            scrolling="no"
            allow="encrypted-media;"
          />
          {/* Barra fija arriba del iframe: cubre justo donde TikTok muestra su
              mensaje de error ("overload-protect triggered") cuando el embed
              falla, y le da al usuario un boton claro para reintentar. */}
          <div className="absolute top-0 inset-x-0 flex justify-center pt-2 pointer-events-none">
            <button
              type="button"
              onClick={play}
              className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow hover:bg-background"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Recargar
            </button>
          </div>
        </>
      )}
      <a href={citeUrl} className="sr-only">
        Ver video en TikTok
      </a>
    </div>
  )
}
