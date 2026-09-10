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
    badge: "Estructura Profesional",
    title: "Perfilería Metálica",
    subtitle: "Para Cielos Rasos y Paredes",
    description: "Perfiles galvanizados de alta resistencia para instalaciones de gypsum y construcción en seco.",
    cta: "Ver Perfilería",
    href: "/products?category=gypsum",
    imageWeb: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788973278/basictech/media/general/qwduflotktnjvsjgmnkr.jpg",
    imageMobile: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788973292/basictech/media/general/xjt2scrg4hrnabuhjwtn.jpg",
  },
  {
    id: 2,
    badge: "Catálogo Completo",
    title: "Cielos Rasos y Paneles PVC",
    subtitle: "Variedad de Diseños",
    description: "Paneles decorativos para cielo raso y pared con texturas de madera, ondulados y lisos en PVC resistente.",
    cta: "Ver Paneles",
    href: "/products?category=duelas-pvc",
    imageWeb: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788973280/basictech/media/general/n6vbyc7afdd4cvsrwnz1.jpg",
    imageMobile: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788973292/basictech/media/general/euxqjbuv9zppylsa6ybp.jpg",
  },
  {
    id: 3,
    badge: "Construcción en Seco",
    title: "Placas de Yeso y Fibrocemento",
    subtitle: "Calidad Garantizada",
    description: "Materiales profesionales para cielos rasos, divisiones y acabados de interior con las mejores marcas.",
    cta: "Ver Placas",
    href: "/products?category=gypsum",
    imageWeb: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788973282/basictech/media/general/ullgzrhmlnowm7iihppr.jpg",
    imageMobile: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788973293/basictech/media/general/bxd9nj6aaley0arfpt9q.jpg",
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
                {/* Mobile Background Image */}
                <Image
                  src={slide.imageMobile}
                  alt={slide.title}
                  fill
                  draggable={false}
                  className="object-cover md:hidden"
                  priority={slide.id === 1}
                  sizes="100vw"
                />
                {/* Desktop Background Image */}
                <Image
                  src={slide.imageWeb}
                  alt={slide.title}
                  fill
                  draggable={false}
                  className="object-cover hidden md:block"
                  priority={slide.id === 1}
                  sizes="100vw"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />

                {/* Content — alineado al contenedor del resto de la página */}
                <div className="relative z-10 h-full container mx-auto px-4">
                  <div className="flex flex-col justify-center h-full py-4 max-w-md">
                    <span className="inline-block w-fit rounded bg-brand-orange/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white mb-2 tracking-wide uppercase">
                      {slide.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-base sm:text-lg font-semibold text-brand-orange mt-1">
                      {slide.subtitle}
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-sm leading-relaxed line-clamp-2">
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
