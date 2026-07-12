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
    gradient: "from-amber-900 via-yellow-900 to-slate-900",
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
    gradient: "from-blue-900 via-cyan-900 to-slate-900",
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
    gradient: "from-emerald-900 via-teal-900 to-slate-900",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
  },
]

export function HeroBanner() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <section className="relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient}`}>
                {/* Background Image */}
                <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    draggable={false}
                    className="object-cover"
                    priority={slide.id === 1}
                  />
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                  <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
                    {/* Text Content */}
                    <div className="max-w-xl text-center lg:text-left">
                      <span className="inline-block rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white mb-3">
                        {slide.badge}
                      </span>
                      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        {slide.title}
                        <span className="block text-primary">{slide.subtitle}</span>
                      </h2>
                      <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-md mx-auto lg:mx-0">
                        {slide.description}
                      </p>
                      <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <Button asChild size="default">
                          <Link href={slide.href}>{slide.cta}</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                          <Link href="/products">Ver Todo</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className="relative w-72 h-52 sm:w-96 sm:h-72 lg:w-[500px] lg:h-80">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none select-none" />
                      <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          draggable={false}
                          className="object-cover rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 hidden sm:flex" />
        <CarouselNext className="right-4 hidden sm:flex" />

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-1.5 w-6 rounded-full bg-white/30 transition-colors"
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
