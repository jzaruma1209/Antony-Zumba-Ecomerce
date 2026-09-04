"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface FooterProduct {
  id: string
  name: string
  slug: string
}

const footerLinks = {
  empresa: [
    { name: "Sobre Nosotros", href: "/contacto" },
    { name: "Contacto", href: "/contacto" },
    { name: "Trabaja con Nosotros", href: "/contacto" },
  ],
  ayuda: [
    { name: "Centro de Ayuda", href: "/contacto" },
    { name: "Envíos y Entregas", href: "/contacto" },
    { name: "Devoluciones", href: "/contacto" },
    { name: "Garantía", href: "/contacto" },
    { name: "Preguntas Frecuentes", href: "/contacto" },
  ],
  legal: [
    { name: "Términos y Condiciones", href: "/terms" },
    { name: "Política de Privacidad", href: "/privacy" },
    { name: "Cookies", href: "/cookies" },
  ],
}

export function Footer() {
  const [products, setProducts] = useState<FooterProduct[]>([])

  useEffect(() => {
    async function loadBestSellers() {
      try {
        const res = await fetch("/api/products?sortBy=best-selling&limit=6")
        if (res.ok) {
          const data = await res.json()
          if (data.products && Array.isArray(data.products)) {
            setProducts(data.products.slice(0, 6))
          }
        }
      } catch (err) {
        console.error("Error al cargar productos del footer:", err)
      }
    }
    loadBestSellers()
  }, [])

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/iconozumba.png"
                alt="TumbadosZumba"
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg object-contain"
              />
              <span className="text-xl font-bold">TumbadosZumba</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Tu tienda de tumbados de gypsum de confianza. Los mejores productos y acabados para tu hogar a los mejores precios.
            </p>
            <div className="mt-4 flex gap-3">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" strokeWidth={1.75} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" strokeWidth={1.75} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" strokeWidth={1.75} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" strokeWidth={1.75} />
              </Link>
            </div>
          </div>

          {/* Más vendidos */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Los más vendidos</h3>
            <ul className="mt-4 space-y-2">
              {products.length === 0 ? (
                <>
                  <li className="text-sm text-muted-foreground">Gypsum Estándar</li>
                  <li className="text-sm text-muted-foreground">Panel WPC Acanalado</li>
                  <li className="text-sm text-muted-foreground">Lámina Mármol PVC</li>
                  <li className="text-sm text-muted-foreground">Perfil Omega</li>
                  <li className="text-sm text-muted-foreground">Cielo Raso PVC</li>
                  <li className="text-sm text-muted-foreground">Masilla Drywall</li>
                </>
              ) : (
                products.map((prod) => (
                  <li key={prod.id}>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground line-clamp-1"
                    >
                      {prod.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Empresa</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Ayuda</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.ayuda.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Contacto</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.75} />
                <span>Av. 25 de agosto y galapagos</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span>0997119881</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span>tumbadoszumba2508@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TumbadosZumba. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

