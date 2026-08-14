import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function resetPassword() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10)
    console.log("Generated hash for 'admin123':", hashedPassword)
    
    const updated = await prisma.user.upsert({
      where: { email: "admin@tumbadoszumba.com" },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        status: "ACTIVE",
        name: "Admin Tumbados Zumba",
      },
      create: {
        email: "admin@tumbadoszumba.com",
        password: hashedPassword,
        role: "ADMIN",
        status: "ACTIVE",
        name: "Admin Tumbados Zumba",
        phone: "+593 99 999 9999",
      },
    })
    
    console.log("Successfully updated admin user:", updated.email)
    
    // Verify
    const match = await bcrypt.compare("admin123", updated.password)
    console.log("Verification match:", match)
  } catch (err) {
    console.error("Error resetting password:", err)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

resetPassword()
