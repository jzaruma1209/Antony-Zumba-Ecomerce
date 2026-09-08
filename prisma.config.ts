import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Usada solo por el CLI (migrate / db push / introspect).
    // Preferimos la conexion directa; el runtime usa DATABASE_URL via el pool en src/lib/prisma.ts
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});