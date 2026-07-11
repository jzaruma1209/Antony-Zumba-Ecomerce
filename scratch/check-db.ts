import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
    }
  })
  console.log("Database Products:")
  products.forEach(p => {
    console.log(`- ID: ${p.id}, Name: "${p.name}", Brand: "${p.brand?.name}", Category: "${p.category?.name}", Images: ${JSON.stringify(p.images)}`)
  })
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
