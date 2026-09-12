"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

interface TikTokEmbedProps {
  citeUrl: string
}

interface TikTokPreview {
  thumbnailUrl: string
  title: string
  authorName: string
}

// En vez de reproducir el video dentro de la pagina (iframe directo o el
// widget oficial), mostramos su portada real (obtenida via nuestra API de
// oEmbed) con un boton de play que abre el video en TikTok en una pestana
// nueva. Nunca se carga un reproductor de TikTok en nuestra pagina, asi que
// es imposible que dispare su "overload protection".
export function TikTokEmbed({ citeUrl }: TikTokEmbedProps) {
  const [preview, setPreview] = useState<TikTokPreview | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch(`/api/tiktok-oembed?url=${encodeURIComponent(citeUrl)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setPreview(data)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [citeUrl])

  return (
    <a
      href={citeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full min-h-[500px] items-center justify-center overflow-hidden rounded-xl border bg-card"
      style={{ maxWidth: "325px", minWidth: "280px" }}
    >
      {preview ? (
        <Image
          src={preview.thumbnailUrl}
          alt={preview.title || `Video de TikTok de ${preview.authorName}`}
          fill
          sizes="325px"
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="flex h-full min-h-[500px] w-full flex-col items-center justify-center gap-3 bg-muted/40">
          {!failed && <span className="text-xs text-muted-foreground">Cargando video...</span>}
          {failed && (
            <>
              <span className="text-sm font-medium text-muted-foreground">Video de TikTok</span>
              <span className="text-xs text-muted-foreground/70">Toca para verlo en TikTok</span>
            </>
          )}
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <Play className="h-6 w-6 fill-current ml-0.5" />
        </span>
        <span className="text-sm font-medium text-white">Ver en TikTok</span>
      </div>

      {preview && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
          <p className="line-clamp-2 text-xs text-white">{preview.title}</p>
        </div>
      )}
    </a>
  )
}
