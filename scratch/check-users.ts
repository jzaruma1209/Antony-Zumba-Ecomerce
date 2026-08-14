import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function check() {
  try {
    console.log("Connecting with DATABASE_URL:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":***@"))
    const users = await prisma.user.findMany()
    console.log("Total users found:", users.length)
    for (const u of users) {
      const match = await bcrypt.compare("admin123", u.password)
      console.log(`User: ${u.email} | Role: ${u.role} | Password matches 'admin123': ${match}`)
    }
  } catch (err) {
    console.error("Database error:", err)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

check()
