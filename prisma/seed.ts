import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.user.deleteMany()

  // Create Categories
  const categoriesData = [
    { name: "Gypsum", slug: "gypsum", icon: "Building2" },
    { name: "WPC", slug: "wpc", icon: "PanelTop" },
    { name: "Mármol PVC", slug: "marmol-pvc", icon: "Layers" },
    { name: "Cielo Raso", slug: "cielo-raso", icon: "Grid3x3" },
    { name: "Molduras", slug: "molduras", icon: "Frame" },
    { name: "Piso Flotante", slug: "piso-flotante", icon: "LayoutDashboard" },
    { name: "Iluminación LED", slug: "iluminacion-led", icon: "Lightbulb" },
    { name: "Duelas de PVC", slug: "duelas-pvc", icon: "RectangleHorizontal" },
    { name: "Insumos", slug: "insumos", icon: "Wrench" },
  ]

  const categories: Record<string, string> = {}
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat })
    categories[cat.slug] = created.id
  }
  console.log(`Created ${categoriesData.length} categories`)

  // Create Brands
  const brandsData = [
    { name: "Knauf", slug: "knauf" },
    { name: "Gyplac", slug: "gyplac" },
    { name: "Deceuninck", slug: "deceuninck" },
    { name: "Novacero", slug: "novacero" },
  ]

  const brands: Record<string, string> = {}
  for (const brand of brandsData) {
    const created = await prisma.brand.create({ data: brand })
    brands[brand.name] = created.id
  }
  console.log(`Created ${brandsData.length} brands`)

  // Create Products
  const productsData = [
    // --- Gypsum ---
    {
      name: 'Plancha de Gypsum Regular 1/2" 1.22x2.44m',
      slug: 'plancha-gypsum-regular-122x244',
      brand: 'Gyplac',
      category: 'gypsum',
      price: 12.9,
      images: [
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
      ],
      description: 'Plancha de gypsum regular de 1/2" (12.7mm) para cielo raso y divisiones interiores. Borde rebajado para juntas reforzadas.',
      specs: {
        Dimensiones: '1.22 x 2.44 m',
        Espesor: '12.7 mm (1/2")',
        'Peso aprox': '29.5 kg',
        'Resistencia al fuego': 'Clase A (ASTM C36)',
        'Borde': 'Rebajado (tapered edge)',
      },
      stock: 80,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Plancha de Gypsum Resistente a Humedad RH 1.22x2.44m',
      slug: 'plancha-gypsum-resistente-humedad',
      brand: 'Knauf',
      category: 'gypsum',
      price: 16.5,
      images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600'],
      description: 'Plancha de gypsum con núcleo hidrofugado y forro tratado contra humedad. Ideal para baños, cocinas y sótanos.',
      specs: {
        Dimensiones: '1.22 x 2.44 m',
        Espesor: '12.7 mm (1/2")',
        'Tratamiento': 'Hidrofugado en núcleo y forro',
        Color: 'Verde',
        'Uso recomendado': 'Baños, cocinas, áreas húmedas',
      },
      stock: 45,
      isNew: true,
      isFeatured: true,
    },
    // --- WPC ---
    {
      name: 'Panel WPC para Pared 20cm x 3m',
      slug: 'panel-wpc-pared-20cm',
      brand: 'Deceuninck',
      category: 'wpc',
      price: 22.0,
      images: [
        'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600',
      ],
      description: 'Panel de WPC (Wood Plastic Composite) para revestimiento de paredes. Sistema de instalación oculta con clips. Resistente a UV y humedad.',
      specs: {
        Ancho: '20 cm',
        Largo: '3 m',
        Espesor: '10 mm',
        Material: 'WPC (60% fibra madera + 40% PVC)',
        'Acabado': 'Textura madera cepillada',
        'Color': 'Gris oscuro / Teak',
      },
      stock: 35,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Perfil WPC para Cielo Raso 3m',
      slug: 'perfil-wpc-cielo-raso',
      brand: 'Deceuninck',
      category: 'wpc',
      price: 14.5,
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'],
      description: 'Perfil liviano de WPC para cielos rasos exteriores e interiores. Resistente a la intemperie, no se oxida ni se pudre.',
      specs: {
        Largo: '3 m',
        Ancho: '10 cm',
        Espesor: '8 mm',
        Material: 'WPC',
        'Carga máxima': '15 kg/m (suspensión)',
        'Uso': 'Cielo raso exterior e interior',
      },
      stock: 50,
      isNew: true,
      isFeatured: false,
    },
    // --- Mármol PVC ---
    {
      name: 'Lámina de Mármol PVC Decorativo 1.22x2.44m',
      slug: 'lamina-marmol-pvc-decorativo',
      brand: 'Novacero',
      category: 'marmol-pvc',
      price: 35.0,
      images: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600',
      ],
      description: 'Lámina decorativa de PVC con impresión de alto relieve efecto mármol. Para revestimiento de paredes, columnas y muebles.',
      specs: {
        Dimensiones: '1.22 x 2.44 m',
        Espesor: '3.5 mm',
        'Acabado': 'Brillante UV',
        Material: 'PVC rígido',
        Colores: 'Blanco Carrara / Negro Marquina / Beige Travertino',
      },
      stock: 20,
      isNew: true,
      isFeatured: true,
    },
    {
      name: 'Panel PVC Efecto Mármol para Pared 60cm x 2.44m',
      slug: 'panel-pvc-efecto-marmol',
      brand: 'Novacero',
      category: 'marmol-pvc',
      price: 28.5,
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600'],
      description: 'Panel ranurado de PVC con diseño marmolado para revestimiento de paredes. Instalación rápida con adhesivo o perfil H.',
      specs: {
        Dimensiones: '0.60 x 2.44 m',
        Espesor: '8 mm',
        'Ancho útil': '58.5 cm (con empalme)',
        Material: 'PVC compuesto',
        'Acabado': 'Mate / Satinado',
      },
      stock: 25,
      isNew: true,
      isFeatured: false,
    },
    // --- Cielo Raso ---
    {
      name: 'Perfil Metálico Canal Listón para Cielo Raso 3m',
      slug: 'perfil-canal-liston-cielo-raso',
      brand: 'Novacero',
      category: 'cielo-raso',
      price: 4.8,
      images: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
      ],
      description: 'Perfil metálico galvanizado en forma de canal listón para estructura de cielo raso suspendido. Para instalación de gypsum o paneles.',
      specs: {
        Material: 'Acero galvanizado calibre 26',
        Longitud: '3 m',
        'Tipo': 'Canal listón (hat channel)',
        Dimensiones: '25 x 40 mm',
        'Peso': '0.45 kg/m',
      },
      stock: 120,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Suspensión y Anclaje para Cielo Raso (caja x 100)',
      slug: 'suspension-anclaje-cielo-raso',
      brand: 'Novacero',
      category: 'cielo-raso',
      price: 18.5,
      images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'],
      description: 'Kit de suspensión regulable para cielo raso suspendido. Incluye alambre galvanizado, anclajes de expansión y conectores rápidos.',
      specs: {
        'Tipo': 'Suspensión regulable',
        'Capacidad de carga': '25 kg por punto',
        'Longitud máxima': '1.5 m (regulable)',
        Material: 'Acero galvanizado',
        'Presentación': 'Caja x 100 unidades',
        Incluye: 'Alambre, anclaje expansivo, conector rápido',
      },
      stock: 30,
      isNew: false,
      isFeatured: false,
    },
    // --- Molduras ---
    {
      name: 'Moldura de Poliestireno Lisa 2m',
      slug: 'moldura-poliestireno-lisa-2m',
      brand: 'Knauf',
      category: 'molduras',
      price: 3.5,
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
      ],
      description: 'Moldura lisa de poliestireno expandido de alta densidad para decoración de cielos rasos y paredes. Liviana y fácil de instalar con adhesivo.',
      specs: {
        Largo: '2 m',
        Ancho: '5 cm',
        Alto: '3 cm',
        Material: 'Poliestireno expandido de alta densidad',
        'Acabado': 'Liso (listo para pintar)',
        'Instalación': 'Adhesivo especial para molduras',
      },
      stock: 200,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Moldura Decorativa con Relieve 2m',
      slug: 'moldura-decorativa-relieve-2m',
      brand: 'Knauf',
      category: 'molduras',
      price: 5.2,
      comparePrice: 6.9,
      images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600'],
      description: 'Moldura decorativa de poliestireno con diseño en relieve clásico. Ideal para cornices y marcos decorativos en interiores.',
      specs: {
        Largo: '2 m',
        Ancho: '8 cm',
        Alto: '4 cm',
        Material: 'Poliestireno expandido de alta densidad',
        Diseño: 'Relieve floral clásico',
        'Acabado': 'Listo para pintar',
      },
      stock: 150,
      isNew: false,
      isFeatured: true,
    },
    // --- Piso Flotante ---
    {
      name: 'Piso Flotante Laminado 8mm Roble (caja 2.13m2)',
      slug: 'piso-flotante-laminado-8mm',
      brand: 'Gyplac',
      category: 'piso-flotante',
      price: 22.5,
      images: [
        'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600',
      ],
      description: 'Piso laminado de 8mm con sistema click AC4. Lámina decorativa Roble Europeo, resistente a rayones y manchas.',
      specs: {
        Espesor: '8 mm',
        'm2 por caja': '2.13',
        'Clasificación': 'AC4 (alto tráfico residencial)',
        'Sistema': 'Click (sin pegamento)',
        'Acabado': 'Roble Europeo mate',
        'Garantía': '15 años residencial',
      },
      stock: 40,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Piso Flotante SPC Roble Blanco 5mm (caja 2.45m2)',
      slug: 'piso-flotante-spc-resistente',
      brand: 'Gyplac',
      category: 'piso-flotante',
      price: 27.9,
      images: ['https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600'],
      description: 'Piso vinílico SPC (Stone Plastic Composite) 100% impermeable. Núcleo rígido de piedra-cal compuesto, ideal para baños y cocinas.',
      specs: {
        Espesor: '5 mm (capa uso +0.5mm)',
        'm2 por caja': '2.45',
        Material: 'SPC (Stone Plastic Composite)',
        'Impermeable al agua': 'Sí (24h sin daño)',
        'Sistema': 'Click rígido',
        'Garantía': 'Lifetime residencial',
      },
      stock: 35,
      isNew: true,
      isFeatured: true,
    },
    // --- Iluminación LED ---
    {
      name: 'Tira LED para Cielo Raso 5m 3000K/6500K',
      slug: 'tira-led-cielo-raso-5m',
      brand: 'Novacero',
      category: 'iluminacion-led',
      price: 11.5,
      images: [
        'https://images.unsplash.com/photo-1550985616-10810253b84d?w=600',
      ],
      description: 'Tira LED flexible para iluminación perimetral en cielos rasos y molduras. Temperatura de color ajustable, auto-adhesiva.',
      specs: {
        Largo: '5 m',
        Potencia: '24W',
        'Temperatura color': '3000K/4000K/6500K (ajustable)',
        'Flujo luminoso': '600 lm/m',
        'Vida util': '30,000 h',
        Incluye: 'Control remoto + adaptador 12V',
      },
      stock: 60,
      isNew: true,
      isFeatured: false,
    },
    {
      name: 'Spot LED Empotrable para Gypsum 12W',
      slug: 'spot-led-empotrable-gypsum',
      brand: 'Novacero',
      category: 'iluminacion-led',
      price: 8.9,
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'],
      description: 'Spot LED redondo empotrable para cielo raso de gypsum. Corte de 10cm, luz blanca neutra 4000K. Incluye driver.',
      specs: {
        Potencia: '12W',
        'Flujo luminoso': '1080 lm',
        'Temperatura color': '4000K (neutro)',
        'Ángulo': '120°',
        'Corte en placa': '10 cm de diámetro',
        Incluye: 'Driver LED',
        'Vida util': '25,000 h',
      },
      stock: 80,
      isNew: false,
      isFeatured: true,
    },
    // --- Duelas de PVC ---
    {
      name: 'Duela de PVC para Pared 20cm x 2.8m',
      slug: 'duela-pvc-pared-20cm',
      brand: 'Deceuninck',
      category: 'duelas-pvc',
      price: 12.8,
      images: [
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600',
      ],
      description: 'Duela de PVC para revestimiento de paredes. Sistema de instalación oculta, imitación madera natural. Resistente a la humedad.',
      specs: {
        Largo: '2.80 m',
        Ancho: '20 cm',
        Espesor: '8 mm',
        Material: 'PVC rígido',
        'Acabado': 'Roble Natural / Nogal',
        'Instalación': 'Clip oculto (machimbrado)',
        'Uso': 'Paredes interiores',
      },
      stock: 55,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Duela de PVC para Techo 20cm x 2.8m',
      slug: 'duela-pvc-techo-20cm',
      brand: 'Deceuninck',
      category: 'duelas-pvc',
      price: 14.2,
      images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600'],
      description: 'Duela de PVC liviana para cielos rasos exteriores e interiores. Resistente a UV, no se deforma con el calor ni la humedad.',
      specs: {
        Largo: '2.80 m',
        Ancho: '20 cm',
        Espesor: '6 mm',
        Material: 'PVC rígido con estabilizador UV',
        'Acabado': 'Blanco / Roble claro',
        'Uso': 'Techos y cielos rasos',
        'Resistencia UV': 'Sí',
      },
      stock: 45,
      isNew: true,
      isFeatured: false,
    },
    // --- Insumos ---
    {
      name: 'Clavos para Gypsum (caja x 1000)',
      slug: 'clavos-gypsum-caja',
      brand: 'Gyplac',
      category: 'insumos',
      price: 8.5,
      images: ['https://images.unsplash.com/photo-1586864387789-628af9feed72?w=600'],
      description: 'Clavos de acero electrosoldado con cabeza de sombrero para fijación de planchas de gypsum a perfiles metálicos.',
      specs: {
        Material: 'Acero electrosoldado',
        Longitud: '1" (25 mm)',
        'Cabeza': 'Sombrero (8 mm diámetro)',
        'Presentación': 'Caja x 1000 unidades',
        'Uso': 'Fijación de gypsum a perfiles metálicos',
        'Acabado': 'Galvanizado',
      },
      stock: 40,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Tornillos Autoperforantes para Gypsum (caja x 500)',
      slug: 'tornillos-autoperforantes-gypsum',
      brand: 'Novacero',
      category: 'insumos',
      price: 12.5,
      images: ['https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600'],
      description: 'Tornillos autoperforantes de fosfatizado negro para fijación de gypsum a perfiles de acero galvanizado de hasta 1.5mm.',
      specs: {
        Material: 'Acero al carbono fosfatizado',
        Longitud: '1 1/4" (32 mm)',
        'Tipo': 'Autoperforante (self-drilling)',
        'Punta': 'Broca (punto #2)',
        'Presentación': 'Caja x 500 unidades',
        'Uso': 'Gypsum a perfil metálico',
      },
      stock: 35,
      isNew: false,
      isFeatured: true,
    },
    {
      name: 'Cinta de Papel para Juntas de Gypsum (rollo 150m)',
      slug: 'cinta-papel-juntas-gypsum',
      brand: 'Knauf',
      category: 'insumos',
      price: 6.9,
      images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600'],
      description: 'Cinta de papel perforado para refuerzo de juntas entre planchas de gypsum. Fibra de vidrio longitudinal para alta resistencia a la tracción.',
      specs: {
        Material: 'Papel kraft perforado con fibra de vidrio',
        Ancho: '50 mm',
        Largo: '150 m (rollo)',
        'Resistencia a tracción': '≥ 40 N/cm',
        'Uso': 'Juntas de gypsum y paneles de yeso',
      },
      stock: 25,
      isNew: false,
      isFeatured: false,
    },
    {
      name: 'Masilla para Juntas de Gypsum (balde 5kg)',
      slug: 'masilla-juntas-gypsum-5kg',
      brand: 'Knauf',
      category: 'insumos',
      price: 14.9,
      images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600'],
      description: 'Pasta para juntas de gypsum lista para usar. Secado rápido, mínimo encogimiento. Para el sellado y acabado de uniones entre planchas.',
      specs: {
        'Tipo': 'Pasta lista para usar',
        'Presentación': 'Balde x 5 kg',
        'Tiempo de secado': '60-90 min',
        'Rendimiento': '~15 m2 por balde',
        'Color': 'Blanco',
        'Uso': 'Juntas y acabados de gypsum',
      },
      stock: 20,
      isNew: false,
      isFeatured: false,
    },
  ]

  for (const product of productsData) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        stock: product.stock,
        images: product.images,
        specs: product.specs,
        isNew: product.isNew,
        isFeatured: product.isFeatured,
        categoryId: categories[product.category],
        brandId: brands[product.brand],
      },
    })
  }
  console.log(`Created ${productsData.length} products`)

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@tumbadoszumba.com",
      password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9lK", // password: admin123
      name: "Admin Tumbados Zumba",
      phone: "+593 99 999 9999",
      role: "ADMIN",
      status: "ACTIVE",
    },
  })
  console.log(`Created admin user: ${adminUser.email}`)

  // Create Test Customer
  const customerUser = await prisma.user.create({
    data: {
      email: "juan@email.com",
      password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9lK", // password: admin123
      name: "Juan Perez",
      phone: "+593 98 765 4321",
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  })
  console.log(`Created customer user: ${customerUser.email}`)

  // Create Address for Customer
  await prisma.address.create({
    data: {
      label: "Casa",
      name: "Juan Perez",
      phone: "+593 98 765 4321",
      address: "Av. Amazonas N37-29",
      city: "Quito",
      state: "Pichincha",
      zipCode: "170506",
      isDefault: true,
      userId: customerUser.id,
    },
  })
  console.log("Created address for customer")

  console.log("Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
