"use client"

interface TikTokEmbedProps {
  videoId: string
  citeUrl: string // Para compatibilidad con los props antiguos, aunque no lo usemos en el iframe
}

export function TikTokEmbed({ videoId }: TikTokEmbedProps) {
  return (
    <div className="w-full flex justify-center items-center overflow-hidden rounded-xl bg-card border">
      <iframe
        src={`https://www.tiktok.com/embed/v2/${videoId}?lang=es-ES`}
        className="w-full h-[730px] sm:h-[730px]"
        style={{ maxWidth: "325px", minWidth: "280px", border: "none" }}
        allowFullScreen
        scrolling="no"
        allow="encrypted-media;"
        loading="lazy"
      />
    </div>
  )
}
