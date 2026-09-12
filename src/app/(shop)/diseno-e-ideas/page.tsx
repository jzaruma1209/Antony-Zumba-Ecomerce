"use client"

import { useState } from "react"
import { Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TikTokEmbed } from "@/components/TikTokEmbed"

// Para añadir nuevos videos de TikTok, simplemente agrega el ID del video a esta lista:
const TIKTOK_VIDEO_IDS = [
  "7570510366111714580",
  "7264984821947075846",
  "7546027741934521656",
  "7621243081207188756",
  "7299297356502060294",
  "7658085920134057236",
  "7652516558354337045",
]

const tiktokVideos = TIKTOK_VIDEO_IDS.map(id => ({
  id,
  cite: `https://www.tiktok.com/@tumbados_zumba/video/${id}`
}))

// Cuántos videos se muestran de entrada y cuántos se agregan por cada click en "Ver más".
// TikTok limita cuántos embeds acepta a la vez desde la misma sesión, así que mostrarlos
// todos de golpe dispara su protección anti-abuso ("overload-protect triggered").
const VIDEOS_PER_PAGE = 3

export default function DisenoEIdeasPage() {
  const [visibleCount, setVisibleCount] = useState(VIDEOS_PER_PAGE)
  const visibleVideos = tiktokVideos.slice(0, visibleCount)
  const hasMore = visibleCount < tiktokVideos.length

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Lightbulb className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Diseño e Ideas</h1>
        <p className="text-muted-foreground text-lg">
          Inspírate con nuestros mejores trabajos y descubre las últimas tendencias en acabados para tu hogar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
        {visibleVideos.map((video, index) => (
          <div key={video.id} className="flex justify-center w-full">
            <TikTokEmbed videoId={video.id} citeUrl={video.cite} index={index} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setVisibleCount((count) => count + VIDEOS_PER_PAGE)}
          >
            Ver más
          </Button>
        </div>
      )}
    </div>
  )
}
