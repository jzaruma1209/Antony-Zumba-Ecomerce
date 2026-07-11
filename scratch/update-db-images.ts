import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const imageMap: Record<string, string[]> = {
  "Plancha de Gypsum Estándar 1.20x2.40m": [
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600"
  ],
  "Gypsum Resistente a Humedad RH": [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600"
  ],
  "Panel WPC para Revestimiento 20cm": [
    "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600"
  ],
  "Machimbre WPC Deck 2.20m": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"
  ],
  "Lámina de Mármol PVC 1.22x2.44m": [
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600"
  ],
  "Panel Decorativo Mármol PVC 3D": [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600"
  ],
  "Bandeja de Cielo Raso 60x60cm": [
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600"
  ],
  "Perfileria Galvanizada Cielo Raso": [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600"
  ],
  "Moldura de PVC 2.40m Blanca": [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600"
  ],
  "Cornisa Decorativa de Gypsum 2m": [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600"
  ],
  "Piso Flotante Roble Claro 7mm": [
    "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600"
  ],
  "Piso Flotante Vinílico SPC Roble": [
    "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600"
  ],
  "Panel LED Empotrable 60x60cm 40W": [
    "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600"
  ],
  "Tira LED RGB 5m + Control": [
    "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600"
  ],
  "Duela de PVC Roble Natural 4m": [
    "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600"
  ],
  "Tableta PVC Pizarra 30x60cm": [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600"
  ]
}

async function main() {
  console.log("Updating product images in database...")
  const products = await prisma.product.findMany()
  
  for (const product of products) {
    const newImages = imageMap[product.name]
    if (newImages) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages }
      })
      console.log(`- Updated: "${product.name}"`)
    } else {
      console.log(`- No image mapping found for: "${product.name}"`)
    }
  }
  
  console.log("Done updating images!")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
