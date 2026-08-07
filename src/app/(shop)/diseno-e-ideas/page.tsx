import { Lightbulb, Video } from "lucide-react"
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

export default function DisenoEIdeasPage() {
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
        {/* Videos reales de TikTok */}
        {tiktokVideos.map((video) => (
          <div key={video.id} className="flex justify-center w-full">
            <TikTokEmbed videoId={video.id} citeUrl={video.cite} />
          </div>
        ))}

        {/* Placeholders para más videos de TikTok (calcula cuántos faltan para completar 6 espacios) */}
        {Array.from({ length: Math.max(0, 6 - tiktokVideos.length) }).map((_, index) => (
          <div key={`placeholder-${index}`} className="bg-card border rounded-xl overflow-hidden min-h-[580px] flex flex-col items-center justify-center text-muted-foreground bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <Video className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium opacity-60">Espacio para Video TikTok</p>
          </div>
        ))}
      </div>

    </div>
  )
}

