# 🚀 GUÍA MAESTRA DE MIGRACIÓN Y CONFIGURACIÓN DE SUPABASE
## Proyecto: Antony Zumba E-commerce (TumbadosZumba)

> **Destinatario:** Documento técnico exhaustivo diseñado para que un agente de IA o desarrollador se conecte mediante MCP (Model Context Protocol) o SQL Editor de Supabase y recree/configure la base de datos de manera íntegra sin romper ninguna funcionalidad del frontend ni de los endpoints.

---

## 1. 📌 INFORMACIÓN GENERAL DEL PROYECTO

- **Framework:** Next.js (App Router, React 19 / Next 15+)
- **ORM:** Prisma Client con adaptador `@prisma/adapter-pg` y pool `pg`
- **Motor de Base de Datos:** PostgreSQL (alojado en Supabase)
- **Autenticación:** NextAuth.js v5 (`credentials` con contraseñas encriptadas con `bcryptjs` y JWT)
- **Almacenamiento de Multimedia:** Cloudinary
- **Pasarela de Pagos:** Stripe (con Webhooks y Checkout Sessions)

---

## 2. 🔑 CREDENCIALES DEL PROYECTO ACTUAL (Origen / Test)

- **Proyecto:** `kerlyzaruma81-del's Project`
- **Publishable Key:** `[REDACTED]`
- **Secret Key:** `[REDACTED]`

> **Nota para el Agente Receptor:**
> Si vas a inicializar un **NUEVO** proyecto de Supabase (o configurar uno existente), necesitarás obtener del dashboard de Supabase (en `Project Settings > Database` y `Project Settings > API`):
> 1. `DATABASE_URL` (Conexión pooled en puerto `6543` con `?pgbouncer=true`)
> 2. `DIRECT_URL` (Conexión directa en puerto `5432`)
> 3. `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (si se utiliza cliente Supabase directo)

---

## 3. 🗄️ ESQUEMA COMPLETO SQL (DDL)

Ejecuta este bloque SQL en el **SQL Editor de Supabase** o envíalo a través del **MCP de Supabase** (`execute_sql` / `query`):

```sql
-- ==============================================================================
-- 1. CREACIÓN DE TIPOS ENUM
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MODERATOR', 'CUSTOMER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'TRANSFER', 'WALLET', 'CASH_ON_DELIVERY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. CREACIÓN DE TABLAS
-- ==============================================================================

-- TABLA: USERS
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- TABLA: CATEGORIES
CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- TABLA: BRANDS
CREATE TABLE IF NOT EXISTS "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- TABLA: PRODUCTS
CREATE TABLE IF NOT EXISTS "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "comparePrice" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[] NOT NULL DEFAULT '{}',
    "specs" JSONB,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- TABLA: ADDRESSES
CREATE TABLE IF NOT EXISTS "addresses" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- TABLA: ORDERS
CREATE TABLE IF NOT EXISTS "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "shipping" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- TABLA: ORDER_ITEMS
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- ==============================================================================
-- 3. ÍNDICES Y CONSTRAINTS ÚNICOS
-- ==============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_key" ON "categories"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "brands_slug_key" ON "brands"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_key" ON "products"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "orders_orderNumber_key" ON "orders"("orderNumber");

CREATE INDEX IF NOT EXISTS "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX IF NOT EXISTS "products_brandId_idx" ON "products"("brandId");
CREATE INDEX IF NOT EXISTS "products_slug_idx" ON "products"("slug");
CREATE INDEX IF NOT EXISTS "addresses_userId_idx" ON "addresses"("userId");
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "orders_orderNumber_idx" ON "orders"("orderNumber");
CREATE INDEX IF NOT EXISTS "order_items_orderId_idx" ON "order_items"("orderId");

-- ==============================================================================
-- 4. CLAVES FORÁNEAS (FOREIGN KEYS)
-- ==============================================================================

DO $$ BEGIN
    ALTER TABLE "products" 
    ADD CONSTRAINT "products_categoryId_fkey" 
    FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "products" 
    ADD CONSTRAINT "products_brandId_fkey" 
    FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "addresses" 
    ADD CONSTRAINT "addresses_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "orders" 
    ADD CONSTRAINT "orders_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "orders" 
    ADD CONSTRAINT "orders_addressId_fkey" 
    FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "order_items" 
    ADD CONSTRAINT "order_items_orderId_fkey" 
    FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "order_items" 
    ADD CONSTRAINT "order_items_productId_fkey" 
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
```

---

## 4. 📄 SCHEMA DE PRISMA (`prisma/schema.prisma`)

Este es el schema exacto del ORM que el proyecto utiliza:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
}

// ==================== ENUMS ====================

enum UserRole {
  ADMIN
  MODERATOR
  CUSTOMER
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  CARD
  TRANSFER
  WALLET
  CASH_ON_DELIVERY
}

// ==================== MODELS ====================

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String
  phone     String?
  avatar    String?
  role      UserRole   @default(CUSTOMER)
  status    UserStatus @default(ACTIVE)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  addresses Address[]
  orders    Order[]

  @@map("users")
}

model Category {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  icon      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  products Product[]

  @@map("categories")
}

model Brand {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  logo      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  products Product[]

  @@map("brands")
}

model Product {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  description  String?
  price        Decimal  @db.Decimal(10, 2)
  comparePrice Decimal? @db.Decimal(10, 2)
  stock        Int      @default(0)
  images       String[]
  specs        Json?
  isNew        Boolean  @default(false)
  isFeatured   Boolean  @default(false)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])

  brandId String
  brand   Brand @relation(fields: [brandId], references: [id])

  orderItems OrderItem[]

  @@index([categoryId])
  @@index([brandId])
  @@index([slug])
  @@map("products")
}

model Address {
  id        String   @id @default(cuid())
  label     String
  name      String
  phone     String
  address   String
  city      String
  state     String
  zipCode   String
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  orders Order[]

  @@index([userId])
  @@map("addresses")
}

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  status          OrderStatus @default(PENDING)
  subtotal        Decimal     @db.Decimal(10, 2)
  shipping        Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  paymentMethod   String
  stripeSessionId String?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id])

  addressId String
  address   Address @relation(fields: [addressId], references: [id])

  items OrderItem[]

  @@index([userId])
  @@index([orderNumber])
  @@map("orders")
}

model OrderItem {
  id       String  @id @default(cuid())
  name     String
  price    Decimal @db.Decimal(10, 2)
  quantity Int
  total    Decimal @db.Decimal(10, 2)

  orderId String
  order   Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId String
  product   Product @relation(fields: [productId], references: [id])

  @@index([orderId])
  @@map("order_items")
}
```

---

## 5. 🌐 MAPA COMPLETO DE RUTAS Y ENDPOINTS (API)

Asegúrate de que la base de datos mantenga las relaciones exactas que estos endpoints consumen:

| Ruta de API | Métodos | Descripción / Dependencias en BD |
|---|---|---|
| `/api/auth/[...nextauth]` | `GET`, `POST` | Manejado por NextAuth v5. Busca usuario por `email` en tabla `users` y compara hash con `bcryptjs`. |
| `/api/auth/register` | `POST` | Crea un usuario con rol `CUSTOMER`, hash de contraseña y status `ACTIVE`. |
| `/api/products` | `GET`, `POST` | **GET:** Filtros `category` (por slug), `brand` (por slug), `minPrice`, `maxPrice`, `sortBy`, `featured`, `new`, `offers`/`onSale`, `search`. Incluye relación con `category` y `brand`.<br>**POST:** Crea producto validando `categoryId` y `brandId`. |
| `/api/products/[id]` | `GET`, `PUT`, `DELETE` | **GET/PUT/DELETE:** Busca por `id` o por `slug`. Incluye relación con `category` y `brand`. |
| `/api/categories` | `GET`, `POST` | **GET:** Lista categorías incluyendo conteo de productos (`_count: { products: true }`).<br>**POST:** Crea categoría con slug único. |
| `/api/categories/[id]` | `GET`, `PUT`, `DELETE` | Operaciones sobre categoría individual. |
| `/api/brands` | `GET`, `POST` | **GET:** Lista marcas incluyendo conteo de productos.<br>**POST:** Crea marca con slug único. |
| `/api/brands/[id]` | `GET`, `PUT`, `DELETE` | Operaciones sobre marca individual. |
| `/api/addresses` | `GET`, `POST` | Direcciones de envío del usuario autenticado (relación `userId`). |
| `/api/addresses/[id]` | `GET`, `PUT`, `DELETE` | Modificación de dirección individual y soporte de `isDefault`. |
| `/api/orders` | `GET`, `POST` | **GET:** Lista pedidos del usuario con sus `items` y `address`.<br>**POST:** Crea orden con `orderNumber` único, `orderItems` anidados y actualización de stock. |
| `/api/orders/[id]` | `GET`, `PUT` | Detalle de orden por ID / número de orden y cambio de `status`. |
| `/api/admin/dashboard` | `GET` | Métricas de ventas: suma de `total` en `orders`, conteo de `users`, conteo de `products`, órdenes recientes. |
| `/api/admin/orders` | `GET`, `PUT` | Gestión de todas las órdenes para administradores. |
| `/api/users` | `GET` | Lista usuarios con conteo de pedidos y cálculo de gasto total (`totalSpent`). |
| `/api/checkout` | `POST` | Inicia sesión de pago con Stripe o registro de pago contra entrega / transferencia. |
| `/api/webhook/stripe` | `POST` | Webhook de Stripe: actualiza orden o crea orden al recibir `checkout.session.completed` utilizando `stripeSessionId`. |
| `/api/upload` | `POST` | Sube imágenes a Cloudinary (carpeta `basictech/products`). |

---

## 6. ⚙️ VARIABLES DE ENTORNO (`.env`)

En el archivo `.env` del proyecto se configuran los accesos de la siguiente manera:

```env
# ============================
# BASE DE DATOS (SUPABASE)
# ============================
# Conexión agrupada (PgBouncer/Supavisor - Pooler modo Transaction)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Conexión directa (Para migraciones y operaciones DDL)
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# ============================
# STRIPE (Pagos)
# ============================
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ============================
# CLOUDINARY (Imágenes)
# ============================
CLOUDINARY_CLOUD_NAME="[REDACTED]"
CLOUDINARY_API_KEY="[REDACTED]"
CLOUDINARY_API_SECRET="[REDACTED]"

# ============================
# NEXTAUTH (Autenticación)
# ============================
NEXTAUTH_SECRET="[REDACTED]"
NEXTAUTH_URL="http://localhost:3000"

# ============================
# APP URL
# ============================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_TRUST_HOST=true
```

---

## 7. 📦 DATOS INICIALES (SEED / POBLACIÓN)

Para inicializar la base de datos con los datos oficiales de TumbadosZumba:

1. **Categorías Principales:**
   - `Gypsum` (`slug: gypsum`, `icon: Building2`)
   - `WPC` (`slug: wpc`, `icon: PanelTop`)
   - `Mármol PVC` (`slug: marmol-pvc`, `icon: Layers`)
   - `Cielo Raso` (`slug: cielo-raso`, `icon: Grid3x3`)
   - `Molduras` (`slug: molduras`, `icon: Frame`)
   - `Piso Flotante` (`slug: piso-flotante`, `icon: LayoutDashboard`)
   - `Iluminación LED` (`slug: iluminacion-led`, `icon: Lightbulb`)
   - `Duelas de PVC` (`slug: duelas-pvc`, `icon: RectangleHorizontal`)
   - `Insumos` (`slug: insumos`, `icon: Wrench`)

2. **Marcas Principales:**
   - `Knauf` (`slug: knauf`)
   - `Gyplac` (`slug: gyplac`)
   - `Deceuninck` (`slug: deceuninck`)
   - `Novacero` (`slug: novacero`)

3. **Usuarios Base (contraseña por defecto: `admin123`):**
   - **Admin:** `admin@tumbadoszumba.com` | Rol: `ADMIN` | Status: `ACTIVE`
   - **Test Customer:** `juan@email.com` | Rol: `CUSTOMER` | Status: `ACTIVE`

---

## 8. 🛠️ GUÍA PASO A PASO PARA EL AGENTE O DESARROLLADOR RECEPTOR

Si eres un agente conectándote al nuevo MCP de Supabase:

1. **Conexión al MCP de Supabase:**
   - Configura el token de acceso de Supabase o la URL de conexión.
2. **Crear las Tablas:**
   - Ejecuta el script SQL de la **Sección 3** mediante la herramienta de ejecución SQL del MCP (`execute_sql`).
3. **Sincronizar Prisma en el Repositorio:**
   - Actualiza la variable `DATABASE_URL` y `DIRECT_URL` en `.env`.
   - Ejecuta en la terminal del proyecto:
     ```bash
     npx prisma generate
     npx prisma db push
     ```
4. **Poblar la Base de Datos:**
   - Ejecuta el seeder para insertar productos, categorías, marcas y usuario admin:
     ```bash
     npx tsx prisma/seed.ts
     ```
5. **Verificación de Integridad:**
   - Realiza un `npm run build` para comprobar que todas las rutas estáticas y dinámicas compilan sin errores de tipos ni esquemas.

---

## 9. 🔍 Diagnóstico Pre-Migración

Este diagnóstico fue realizado en modo solo lectura inspeccionando el proyecto de Supabase origen (`supabase-origen`) y el código fuente del repositorio.

### 1. Esquema Actual
- **Tablas por Schema en Supabase Origen:**
  - **`public` (7 tablas de aplicación):**
    - `public.users`: **3 filas** (usuarios del e-commerce)
    - `public.categories`: **10 filas** (categorías de acabados)
    - `public.brands`: **5 filas** (marcas del catálogo)
    - `public.products`: **20 filas** (productos con specs y precios)
    - `public.addresses`: **1 fila** (dirección registrada)
    - `public.orders`: **0 filas** (sin órdenes activas)
    - `public.order_items`: **0 filas** (sin ítems de orden)
  - **`auth` (23 tablas internas de Supabase):** `audit_log_entries`, `custom_oauth_providers`, `flow_state`, `identities`, `instances`, `mfa_amr_claims`, `mfa_challenges`, `mfa_factors`, `oauth_authorizations`, `oauth_client_states`, `oauth_clients`, `oauth_consents`, `one_time_tokens`, `refresh_tokens`, `saml_providers`, `saml_relay_states`, `schema_migrations`, `sessions`, `sso_domains`, `sso_providers`, `users`, `webauthn_challenges`, `webauthn_credentials`.
  - **`storage` (8 tablas internas de Supabase):** `buckets`, `buckets_analytics`, `buckets_vectors`, `migrations`, `objects`, `s3_multipart_uploads`, `s3_multipart_uploads_parts`, `vector_indexes`.
  - **`realtime` (3 tablas internas):** `messages`, `schema_migrations`, `subscription`.
  - **`extensions` (2 tablas internas):** `pg_stat_statements`, `pg_stat_statements_info`.
  - **`vault` (2 tablas internas):** `decrypted_secrets`, `secrets`.

### 2. Prisma
- **¿Existe la carpeta `prisma/migrations`?** **Sí.**
- **Conteo y migración más reciente:** Existen 2 carpetas de migración:
  1. `20260103220039_init`
  2. `20260104014728_add_stripe_session_id` (la más reciente).
- **Sincronización `schema.prisma` vs Base de Datos:**
  - **100% sincronizado.** Todos los modelos (`User`, `Category`, `Brand`, `Product`, `Address`, `Order`, `OrderItem`), sus campos, relaciones, tipos y enums (`UserRole`, `UserStatus`, `OrderStatus`, `PaymentMethod`) coinciden con las columnas y tipos de la base de datos.
  - *Nota:* La tabla técnica `_prisma_migrations` no existe en la base remota (el esquema se aplicó mediante `prisma db push` o script directo).

### 3. Supabase Auth
- **Referencias en código (`supabase.auth`, `@supabase/auth-helpers`, `createClientComponentClient`):** **0 referencias.**
- **Sistema de Login:** Utiliza exclusivamente **NextAuth.js v5 (Auth.js)** con proveedor `Credentials` y hash `bcryptjs`, conectándose directamente a la tabla `public.users` mediante Prisma.
- **Tabla `auth.users`:** Existe por defecto en Supabase pero tiene **0 usuarios**.

### 4. Supabase Storage
- **Referencias en código (`.storage.from(`, `supabase.storage`):** **0 referencias.**
- **Buckets en Supabase Origen:** `storage.buckets` tiene **0 buckets** (completamente vacío).
- **Origen de imágenes de productos:**
  - **Cloudinary:** Las imágenes subidas dinámicamente (`/api/upload`) se guardan en el bucket `basictech/products` de Cloudinary (`res.cloudinary.com`).
  - **Unsplash:** Las imágenes de catálogo iniciales provienen de URLs externas de Unsplash.
  - Supabase Storage **no se utiliza**.

### 5. RLS y Seguridad
- **Estado de RLS:** **Deshabilitado en todas las tablas de `public`** (`users`, `categories`, `brands`, `products`, `addresses`, `orders`, `order_items`).
- **Policies en `public`:** **0 policies creadas** (el backend Next.js accede mediante conexión directa Postgres vía Prisma).

### 6. Funciones, Triggers y Extensiones
- **Funciones custom en `public`:** **Ninguna.**
- **Triggers custom en `public`:** **Ninguno.**
- **Extensiones instaladas en la base de datos:**
  - `plpgsql` (v1.0)
  - `pg_stat_statements` (v1.11)
  - `uuid-ossp` (v1.1)
  - `pgcrypto` (v1.3)
  - `supabase_vault` (v0.3.1)

### 7. Variables de Entorno Actuales
- **Variables que apuntan a Supabase:**
  - `DATABASE_URL`: Apunta al pooler PgBouncer en puerto `6543` del proyecto `[REDACTED]` (`aws-0-us-east-1.pooler.supabase.com`).
  - `DIRECT_URL`: Apunta a la conexión directa en puerto `5432` del proyecto `[REDACTED]` (`aws-0-us-east-1.pooler.supabase.com`).
- *Nota:* No se utilizan variables `NEXT_PUBLIC_SUPABASE_URL` ni `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

### 📋 Resumen y Recomendación Técnica
La base de datos actual opera como un servidor PostgreSQL estándar conectado exclusivamente mediante **Prisma ORM**. No se está utilizando ninguna característica propietaria de Supabase (Auth, Storage, RLS, Edge Functions ni Triggers/Funciones custom).
Por lo tanto, la migración hacia la nueva base de datos de Supabase es **completamente limpia y de bajo riesgo**: bastará con crear las tablas (vía `npx prisma db push` o ejecución DDL del esquema), traspasar los datos existentes (las 39 filas totales entre usuarios, categorías, marcas, productos y direcciones mediante `pg_dump` o `seed.ts`), y actualizar las variables `DATABASE_URL` y `DIRECT_URL` en `.env`.
