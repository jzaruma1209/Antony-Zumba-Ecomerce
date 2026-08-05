import { Lightbulb, Video } from "lucide-react"

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {/* Placeholders for TikTok videos */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="bg-card border rounded-xl overflow-hidden aspect-[9/16] flex flex-col items-center justify-center text-muted-foreground bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <Video className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium opacity-60">Espacio para Video TikTok</p>
          </div>
        ))}
      </div>
    </div>
  )
}
