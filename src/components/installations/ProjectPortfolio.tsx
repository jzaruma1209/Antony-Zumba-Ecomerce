"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider"
import { useInstallationQuoteStore } from "@/stores/installation-quote-store"
import type { InstallationProject } from "@/data/installation-projects"
import { cn } from "@/lib/utils"
import { IndexTag, SectionTag, btnPrimary, dashedLine, fieldLine, line, mutedText, surface } from "./shared"

const ALL = "Todas"

export function ProjectPortfolio({ projects }: { projects: InstallationProject[] }) {
  const requestQuote = useInstallationQuoteStore((s) => s.requestQuote)
  const [filter, setFilter] = useState<string>(ALL)

  const categories = [ALL, ...new Set(projects.map((p) => p.category))]
  const visible = filter === ALL ? projects : projects.filter((p) => p.category === filter)
  const [featured, ...rest] = visible

  function handleQuote(project: InstallationProject) {
    requestQuote(project.quoteType, project.title)
    document.getElementById("cotizar")?.scrollIntoView({ behavior: "smooth" })
  }

  // El número de obra sale de su posición en el portafolio completo, no del filtro
  const indexOf = (project: InstallationProject) => projects.indexOf(project) + 1

  return (
    <section id="obras" className={cn("scroll-mt-24 border-b", line)}>
      <div className="container mx-auto px-4 py-14 sm:py-16">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTag>
              Portafolio · {String(projects.length).padStart(2, "0")} obras
            </SectionTag>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl dark:text-white">
              Obras terminadas
            </h2>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar" role="group" aria-label="Filtrar obras">
            {categories.map((cat) => {
              const active = filter === cat
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "shrink-0 border px-3 py-2 font-mono text-[11.5px] uppercase tracking-[0.06em] transition-colors",
                    active
                      ? "border-brand-orange bg-brand-orange text-slate-950 dark:border-brand-orange"
                      : cn(fieldLine, "text-slate-600 hover:border-brand-orange hover:text-brand-orange dark:text-slate-400 dark:hover:border-brand-orange")
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {featured && (
          <FeaturedProject project={featured} index={indexOf(featured)} onQuote={() => handleQuote(featured)} />
        )}

        {rest.length > 0 && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {rest.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={indexOf(project)}
                onQuote={() => handleQuote(project)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

interface ProjectViewProps {
  project: InstallationProject
  index: number
  onQuote: () => void
}

function FeaturedProject({ project, index, onQuote }: ProjectViewProps) {
  return (
    <article className={cn("mt-7 grid border lg:grid-cols-[1.3fr_1fr]", line, surface)}>
      <div className="h-[280px] sm:h-[380px] lg:h-auto lg:min-h-[440px]">
        <BeforeAfterSlider
          beforeSrc={project.beforeSrc}
          afterSrc={project.afterSrc}
          subject={project.title}
          initialPosition={52}
          sizes="(max-width: 1024px) 100vw, 700px"
        />
      </div>

      <div className={cn("flex flex-col border-t p-5 sm:p-7 lg:border-l lg:border-t-0", line)}>
        <IndexTag index={index}>{project.category}</IndexTag>
        <h3 className="mt-3 text-2xl font-bold leading-[1.05] tracking-[-0.025em] text-slate-900 sm:text-[1.9rem] dark:text-white">
          {project.title}
        </h3>
        <p className={cn("mt-2.5 text-sm leading-relaxed", mutedText)}>{project.description}</p>

        {project.specs.length > 0 && (
          <dl className={cn("mt-5 grid grid-cols-2 border-t", dashedLine)}>
            {project.specs.map((spec) => (
              <div key={spec.label} className={cn("border-b py-2.5 pr-3", dashedLine)}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-slate-500">{spec.label}</dt>
                <dd className="mt-0.5 font-mono text-xs text-slate-800 dark:text-slate-200">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto pt-6">
          <button type="button" onClick={onQuote} className={cn(btnPrimary, "w-full sm:w-auto")}>
            Quiero uno así
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </article>
  )
}

function ProjectCard({ project, index, onQuote }: ProjectViewProps) {
  return (
    <article className={cn("flex flex-col border", line, surface)}>
      <div className="h-[240px] sm:h-[270px]">
        <BeforeAfterSlider
          beforeSrc={project.beforeSrc}
          afterSrc={project.afterSrc}
          subject={project.title}
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      <div className={cn("flex flex-1 flex-col border-t p-5", line)}>
        <IndexTag index={index}>{project.category}</IndexTag>
        <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-slate-900 sm:text-[1.4rem] dark:text-white">
          {project.title}
        </h3>
        <p className="mt-1.5 font-mono text-[11.5px] text-slate-500 dark:text-slate-400">{project.summary}</p>

        <div className="mt-auto pt-4">
          <div className={cn("border-t pt-4", dashedLine)}>
            <button
              type="button"
              onClick={onQuote}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-brand-orange dark:text-white"
            >
              Quiero uno así
              <span className="grid size-6 place-items-center bg-brand-orange text-slate-950">
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
