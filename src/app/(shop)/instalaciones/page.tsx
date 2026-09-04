"use client";

import { useState } from "react";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import Link from "next/link";
import { 
  Send, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// SVG oficial de WhatsApp (conservando excepción de logo de marca según el sistema de diseño)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function InstalacionesPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    tipoProyecto: "",
    detalles: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fullMessage = `Tipo de Proyecto: ${formData.tipoProyecto}\n\nDetalles / Medidas:\n${formData.detalles || "No especificado"}`;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || "cotizaciones@tumbadoszumba.com",
          phone: formData.phone,
          subject: `Cotización de Obra: ${formData.tipoProyecto}`,
          message: fullMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo enviar la solicitud");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        tipoProyecto: "",
        detalles: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al enviar la solicitud. Intente de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!formData.name || !formData.phone || !formData.tipoProyecto) {
      alert("Por favor completa los campos requeridos (Nombre, Teléfono y Tipo de Proyecto)");
      return;
    }

    const whatsappNumber = "593997119881";
    
    const mensaje = `
🏗️ *Solicitud de Cotización - TumbadosZumba*

👤 *Nombre:* ${formData.name}
📱 *Teléfono:* ${formData.phone}
${formData.email ? `📧 *Email:* ${formData.email}` : ''}

📋 *Tipo de Proyecto:*
${formData.tipoProyecto}

${formData.detalles ? `📝 *Detalles del Proyecto:*\n${formData.detalles}` : ''}

---
_Mensaje generado desde tumbadoszumba.com/instalaciones_
    `.trim();

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="relative w-full h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 w-full h-full opacity-60">
           <BeforeAfterSlider 
              afterSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCBtLyq3q98JPg10hXKNlGoIIHLQuhfiPCoNKVanJTYYoZSQASNLT4R2tGC57qjTQhuItLl9S0IRiaAJRKfm136ZWR5sbGaHKouv1tCRslasvXZco8xDNLvA6SgzwGYVpguim8UsLlxyYxLRyVpjP5K8i2EhULNuO4N2BdujpWtNF0OJjrswSluUQWQBYH5U4WGSpof70rzuY_0CAEW2CqwB2IcfIwMG-YHssizJiLGB-b1lgPMKzY"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-slate-950/60 to-slate-950/70 pointer-events-none"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4 border border-brand-orange/30 backdrop-blur-xs">
            <Sparkles className="size-3.5" strokeWidth={1.75} />
            Mano de Obra Certificada
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4 drop-shadow-sm">
            Dominando el arte de la instalación en Gypsum
          </h1>
          <p className="text-base sm:text-lg text-slate-200 font-normal mb-8 max-w-2xl mx-auto leading-relaxed">
            Transformamos tus espacios con instalaciones profesionales de cielo raso, divisiones, molduras y acabados técnicos de máxima durabilidad.
          </p>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
            <a 
              href="#cotizar" 
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-brand-orange/90 transition-all shadow-md hover:shadow-lg"
            >
              Cotizar Instalación
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </a>
            <a 
              href="#proyectos" 
              className="inline-flex items-center gap-2 bg-slate-900/80 text-white border border-slate-700 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors backdrop-blur-xs"
            >
              Ver Galería de Trabajos
            </a>
          </div>
        </div>
      </header>

      {/* Intro / Philosophy */}
      <section className="py-16 sm:py-20 px-4 border-b border-border/60 bg-muted/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-orange block">
              Garantía y Experiencia
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Estructura sólida, nivelación exacta y acabado fino.
            </h2>
          </div>
          <div className="md:col-span-8 text-sm sm:text-base text-muted-foreground leading-relaxed space-y-4">
            <p>
              En <strong className="text-foreground">TumbadosZumba</strong> no solo instalamos placas; garantizamos precisión milimétrica en modulación de perfilería, fijaciones estructurales y tratamiento de juntas sin fisuras.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <ShieldCheck className="size-5 text-brand-orange mt-0.5 shrink-0" strokeWidth={1.75} />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Materiales Certificados</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Perfilería de acero galvanizado y placas de primeras marcas.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Award className="size-5 text-brand-orange mt-0.5 shrink-0" strokeWidth={1.75} />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Personal Cualificado</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Maestros con años de experiencia en acabados comerciales y residenciales.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 sm:py-20 px-4 max-w-6xl mx-auto" id="proyectos">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-2 block">
            Portafolio Real
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Nuestros Trabajos y Acabados
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Desliza para ver el antes y el después de nuestras obras recientes en viviendas y locales comerciales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1 */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-orange block mb-2">Residencial</span>
              <h3 className="text-xl font-bold text-foreground mb-3">Cielo Raso Decorativo e Iluminación</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Diseño de falsos techos con cajones de luz indirecta LED, aislamiento térmico y molduras decorativas para salas y dormitorios.
              </p>
            </div>
            <div className="h-[280px] rounded-lg overflow-hidden border border-border">
               <BeforeAfterSlider 
                  afterSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuB8xyiR_zZAZcjnXzScxNhhQ1gElQgM_29PVUo8XO94sfw_3DWwdZ8LuQFlivfTMvMPc5e2GpQ_TJasuTUyteDUzg7wThpZmesJzOBG_IGaz5uNiC5w8OJ0NLD4C7I9qoPYp9A0Dy7ZWTT9mphTbAhzTLdDKAjRbvHltamFlxKaUZh79feafq61ROEbksAi71GAaOeQ3sstYtOh_fgHyg2k1NAHadLGQoc105rDzy50P8Ti_iBkO3o"
               />
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-orange block mb-2">Comercial</span>
              <h3 className="text-xl font-bold text-foreground mb-3">Paredes y Divisiones Acústicas</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Montaje rápido y limpio de paredes divisorias de gypsum con lana de vidrio para control de ruido en oficinas, clínicas y locales.
              </p>
            </div>
            <div className="h-[280px] rounded-lg overflow-hidden border border-border">
               <BeforeAfterSlider 
                  afterSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuARsWUXcv-lPSTpaWk6r-p_yghzuJKZAh6SSXG568v0ZZipp5WdjAGxhPG8jFQuVefPEpMUbP4turU2wY1AK8dLxn_roFsjfrlVwy6me7sdtP57ic4yl3vlp9YkebYSRjDTwx0eUfo-nEqOQVbooqJiMsVmj3czw76JqC4Coowc2VMSAwZTHjOrjeQ1SQQ-kv_cM0batnvXoi21aHj5RNvAKzp7JniCl9ydntuHYoU0nhrw-ILvExw"
               />
            </div>
          </div>
        </div>

        {/* Full width comparison */}
        <div className="mt-12 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <div className="mb-6 text-center max-w-xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Del Armazón Estructural al Acabado Final</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Estructura metálica alineada con láser y superficie perfectamente empastada lista para pintura.</p>
          </div>
          <div className="h-[360px] sm:h-[440px] rounded-lg overflow-hidden border border-border">
            <BeforeAfterSlider 
              beforeSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDayY2zm0KacWHyLLaQjtBwje3fj9UVioG-GcNrpRnyqoMuWYrYRB5YCzUg5dJG2A9dRNMItW_oUOqYIYYVWqUTxNpiYlRB-nE4UzEKRJUcaOJAu9054HPInry8kN_y77EbD8pMnNTOKym91dQdQODpOUMrcI474RBdWymPP9NIUCPEmzNqRj5oSTs3ENQiu2lASYZiQK3L_EzfyJEVkVq5NIgh-fEg-mkmXwid4d_nGgHvUkn5ZQQ"
              afterSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC8GSR46gtdA7Ux-WA_THPeWjJO4oNYPQ58Jo0veYte2G5MYTkMzQ921slQHeV0kNVv5UELmvyCIDTtx_A32gPRmBSpdAUEIwNb4iv-8OJvsEpz_g2NinLqab7q_EZJ82KU13_M2SWFvKAcCoRzdpMg4EK78RMqhNpxCe9Bt1SYrYxkqh4wwQUX303omTfZRNlerUfStf5t-GWnowrWn-HrxkZMFj6bAcnfFz-DkGLGUddK-_dOVDw"
            />
          </div>
        </div>
      </section>

      {/* Formulario Section - Diseño idéntico a Centro de Contacto */}
      <section id="cotizar" className="py-16 sm:py-20 border-t border-border bg-muted/30 dark:bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs uppercase tracking-widest text-brand-orange font-bold mb-2 block">
              Cotiza Tu Trabajo
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Solicita tu Cotización o Contrata un Proyecto
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Déjanos tus datos y las características de tu espacio. Te contactaremos inmediatamente para brindarte una asesoría personalizada y un presupuesto detallado.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Info Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Información de Contacto
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-brand-orange mt-0.5 shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Dirección</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Av. 25 de agosto y galapagos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="size-5 text-brand-orange mt-0.5 shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Teléfono / WhatsApp</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">0997119881</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="size-5 text-brand-orange mt-0.5 shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Correo Electrónico</p>
                      <p className="text-muted-foreground text-xs sm:text-sm break-all">
                        tumbadoszumba2508@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-brand-orange mt-0.5 shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Horario de Atención</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Lunes a Sábado: 8:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner de asesoría inmediata */}
              <div className="rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-5">
                <h4 className="text-sm font-semibold text-brand-orange mb-1">
                  ¿Necesitas respuesta inmediata?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Completa tu nombre y teléfono y puedes pulsar el botón de WhatsApp para contactar directamente a uno de nuestros asesores técnicos de obra.
                </p>
              </div>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto size-14 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
                      <CheckCircle2 className="size-8" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      ¡Solicitud de Cotización Enviada con Éxito!
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Gracias por comunicarte con TumbadosZumba. Hemos registrado tu proyecto y te responderemos a la brevedad con tu cotización detallada.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="mt-4"
                    >
                      Enviar otra cotización
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input
                          id="name"
                          placeholder="Ej. Juan Pérez"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
                        <Input
                          id="phone"
                          placeholder="0997119881"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico (opcional)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="ejemplo@correo.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipoProyecto">Tipo de Proyecto *</Label>
                        <Select
                          value={formData.tipoProyecto}
                          onValueChange={(val) => setFormData({ ...formData, tipoProyecto: val })}
                          required
                        >
                          <SelectTrigger id="tipoProyecto">
                            <SelectValue placeholder="Selecciona el tipo de trabajo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cielo Raso / Tumbados">Instalación de Cielo Raso / Tumbados</SelectItem>
                            <SelectItem value="Paredes o Divisiones de Gypsum">Paredes o Divisiones de Gypsum</SelectItem>
                            <SelectItem value="Remodelación Comercial Integral">Remodelación Comercial Integral</SelectItem>
                            <SelectItem value="Diseño con Luces Indirectas / Falso Techo">Diseño con Luces Indirectas / Falso Techo</SelectItem>
                            <SelectItem value="Otro Proyecto">Otro Proyecto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="detalles">Detalles del Proyecto o Medidas Aproximadas</Label>
                      <Textarea
                        id="detalles"
                        rows={4}
                        placeholder="Cuéntanos brevemente sobre los metros cuadrados aproximados, ciudad, tipo de inmueble o especificaciones relevantes..."
                        value={formData.detalles}
                        onChange={(e) => setFormData({ ...formData, detalles: e.target.value })}
                      />
                    </div>

                    {error && (
                      <div className="p-3 text-xs sm:text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-900">
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={loading || !formData.tipoProyecto}
                        className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange/90 text-white font-medium flex items-center justify-center gap-2"
                      >
                        <Send className="size-4" strokeWidth={1.75} />
                        {loading ? "Enviando solicitud..." : "Enviar mensaje"}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleWhatsAppClick}
                        className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium flex items-center justify-center gap-2"
                      >
                        <WhatsAppIcon className="size-4" />
                        Cotizar por WhatsApp
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
