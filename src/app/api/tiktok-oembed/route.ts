import { NextRequest, NextResponse } from "next/server"

interface TikTokOembedResponse {
  thumbnail_url: string
  title: string
  author_name: string
}

// Trae la portada y el titulo de un video de TikTok via su API publica de
// oEmbed. Se hace desde el servidor (no desde el navegador del usuario) para
// evitar CORS y para poder cachear la respuesta: es solo metadata liviana,
// nunca el reproductor de video, asi que no puede disparar el limite de
// "overload protection" que TikTok aplica a los embeds de video.
export async function GET(request: NextRequest) {
  const videoUrl = request.nextUrl.searchParams.get("url")

  if (!videoUrl || !videoUrl.startsWith("https://www.tiktok.com/")) {
    return NextResponse.json({ error: "URL invalida" }, { status: 400 })
  }

  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`
    const response = await fetch(oembedUrl, {
      next: { revalidate: 60 * 60 * 24 },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "No se pudo obtener el video" }, { status: 502 })
    }

    const data: TikTokOembedResponse = await response.json()

    return NextResponse.json({
      thumbnailUrl: data.thumbnail_url,
      title: data.title,
      authorName: data.author_name,
    })
  } catch (error) {
    console.error("Error fetching TikTok oEmbed:", error)
    return NextResponse.json({ error: "Error fetching TikTok oEmbed" }, { status: 500 })
  }
}
