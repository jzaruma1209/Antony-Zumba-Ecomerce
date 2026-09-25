/**
 * Contenido del módulo /instalaciones: tipos de trabajo del formulario y
 * obras del portafolio.
 *
 * Las obras viven aquí por ahora; cuando el cliente quiera administrarlas
 * se pasan a un modelo de Prisma con su CRUD en el admin.
 */

export const quoteProjectTypes = [
  { value: "tumbado", label: "Tumbado", subject: "Cielo raso / tumbado" },
  { value: "pared", label: "Pared / división", subject: "Paredes o divisiones de gypsum" },
  { value: "luz-indirecta", label: "Luz indirecta", subject: "Diseño con luz indirecta / falso techo" },
  { value: "local-comercial", label: "Local comercial", subject: "Remodelación comercial integral" },
  { value: "otro", label: "Otro", subject: "Otro proyecto" },
] as const

export type QuoteProjectType = (typeof quoteProjectTypes)[number]["value"]

export interface InstallationProject {
  id: string
  category: "Residencial" | "Comercial" | "PVC"
  title: string
  description: string
  /** resumen de una línea para las cards pequeñas */
  summary: string
  beforeSrc: string
  afterSrc: string
  /** datos de la ficha técnica; solo se muestran los que existan */
  specs: { label: string; value: string }[]
  /** tipo de trabajo con el que se autocompleta el formulario en "Quiero uno así" */
  quoteType: QuoteProjectType
}

export const installationProjects: InstallationProject[] = [
  {
    id: "obra-01",
    category: "Residencial",
    title: "Tumbado con luz indirecta",
    description:
      "Falso techo con cajones de luz LED perimetral, ojos de buey empotrados y molduras decorativas en sala.",
    summary: "Placa ST · luz LED indirecta · molduras",
    beforeSrc: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788982323/basictech/media/general/qik0bo9yrsw798dh9hd4.jpg",
    afterSrc: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788982324/basictech/media/general/elqoid41yxefr4wa7nuo.jpg",
    specs: [
      { label: "Sistema", value: "Placa ST + perfilería" },
      { label: "Iluminación", value: "LED indirecta" },
      { label: "Aislamiento", value: "Térmico" },
      { label: "Acabado", value: "Molduras decorativas" },
    ],
    quoteType: "luz-indirecta",
  },
  {
    id: "obra-02",
    category: "Comercial",
    title: "Divisiones acústicas con arco",
    description:
      "Paredes divisorias de gypsum con lana de vidrio para control de ruido en oficinas, clínicas y locales.",
    summary: "Placa RH · lana de vidrio · control de ruido",
    beforeSrc: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788982322/basictech/media/general/davnlmtzv17nb06nrbhc.jpg",
    afterSrc: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788982321/basictech/media/general/v32b1eq2ctyp8jaodvyh.jpg",
    specs: [
      { label: "Sistema", value: "Placa RH + perfilería" },
      { label: "Aislamiento", value: "Lana de vidrio" },
      { label: "Uso", value: "Oficinas y locales" },
    ],
    quoteType: "pared",
  },
  {
    id: "obra-03",
    category: "PVC",
    title: "Tumbado PVC acabado madera",
    description: "Estructura colgada alineada con láser y paneles PVC con veta de madera, con panel LED empotrado.",
    summary: "Estructura colgada · PVC madera · panel LED",
    beforeSrc: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788982319/basictech/media/general/rpbt9o1jrjmtuq3cvf3k.jpg",
    afterSrc: "https://res.cloudinary.com/dxkmtbde/image/upload/v1788982318/basictech/media/general/teeg4tbo7zkdhodkrahk.jpg",
    specs: [
      { label: "Estructura", value: "Metálica, nivelada con láser" },
      { label: "Acabado", value: "PVC veta madera" },
      { label: "Iluminación", value: "Panel LED empotrado" },
    ],
    quoteType: "tumbado",
  },
]
