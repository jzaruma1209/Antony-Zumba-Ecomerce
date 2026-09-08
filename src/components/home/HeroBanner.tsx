"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [
  {
    id: 1,
    badge: "Nuevos Diseños",
    title: "Cielos Rasos Modernos",
    subtitle: "Elegancia y Durabilidad",
    description: "Diseños exclusivos de gypsum para salas, habitaciones y oficinas con acabados perfectos.",
    cta: "Ver Gypsum",
    href: "/products?category=gypsum",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  },
  {
    id: 2,
    badge: "Revestimiento Premium",
    title: "Paneles WPC Decorativos",
    subtitle: "Resistentes al Agua",
    description: "Dale un estilo natural a tus paredes exteriores e interiores con nuestros paneles WPC premium.",
    cta: "Ver WPC",
    href: "/products?category=wpc",
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800",
  },
  {
    id: 3,
    badge: "Diseño & Lujo",
    title: "Láminas Mármol PVC",
    subtitle: "Brillo y Resistencia",
    description: "Transforma tus espacios al instante con láminas de PVC con efecto mármol de alto relieve.",
    cta: "Ver Mármol PVC",
    href: "/products?category=marmol-pvc",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
  },
]

export function HeroBanner() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full [&>[data-slot=carousel-content]]:h-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="h-full">
              <div className="relative h-full w-full overflow-hidden">
                {/* Full Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  draggable={false}
                  className="object-cover"
                  priority={slide.id === 1}
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                {/* Content — alineado al contenedor del resto de la página */}
                <div className="relative z-10 h-full container mx-auto px-4">
                  <div className="flex flex-col justify-center h-full py-4 max-w-md">
                    <span className="inline-block w-fit rounded bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[11px] font-medium text-white/90 mb-2 tracking-wide uppercase">
                      {slide.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-base sm:text-lg font-semibold text-primary mt-1">
                      {slide.subtitle}
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-white/75 max-w-sm leading-relaxed line-clamp-2">
                      {slide.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <Button asChild className="h-9 text-sm font-semibold px-5 rounded-md">
                        <Link href={slide.href}>{slide.cta}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Flechas pegadas a los bordes de la pantalla */}
        <CarouselPrevious className="left-3 lg:left-4 hidden sm:flex size-10 border-0 bg-white/85 text-slate-800 hover:bg-white shadow-lg" />
        <CarouselNext className="right-3 lg:right-4 hidden sm:flex size-10 border-0 bg-white/85 text-slate-800 hover:bg-white shadow-lg" />

        {/* Dots Indicator */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {slides.map((_, index) => (
            <div
              key={index}
              className="size-2 rounded-full bg-white/50 transition-colors"
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
