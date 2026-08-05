import { Hammer, Phone } from "lucide-react"

export default function InstalacionesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Hammer className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Instalaciones Profesionales</h1>
        <p className="text-muted-foreground text-lg">
          Ofrecemos el servicio de instalación completa de Tumbados Zumba. También contamos con un directorio de maestros recomendados.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-card border rounded-xl p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Servicio Integral TumbadosZumba</h2>
          <p className="text-muted-foreground mb-6">
            Nos encargamos de todo el proceso, desde los materiales hasta la instalación final con nuestra garantía de calidad.
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Cotizar Instalación
          </button>
        </div>

        <div className="bg-card border rounded-xl p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Directorio de Maestros</h2>
          <p className="text-muted-foreground mb-6">
            Contacta directamente con profesionales de confianza recomendados por nosotros en tu zona.
          </p>
          <div className="flex flex-col items-center justify-center gap-3">
             <div className="flex items-center justify-center gap-2 text-primary font-medium">
                <Phone className="w-4 h-4" />
                <span>Próximamente números de contacto...</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
