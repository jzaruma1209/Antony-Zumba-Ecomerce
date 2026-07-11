import { products } from "./mock-products"

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  createdAt: string
}

export interface Address {
  id: string
  label: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export interface OrderItem {
  productId: string
  name: string
  brand: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  shippingAddress: string
  createdAt: string
  updatedAt: string
}

export const userProfile: UserProfile = {
  id: "1",
  name: "Juan Perez",
  email: "juan.perez@email.com",
  phone: "+51 999 888 777",
  createdAt: "2024-01-15",
}

export const addresses: Address[] = [
  {
    id: "1",
    label: "Casa",
    name: "Juan Perez",
    phone: "+51 999 888 777",
    address: "Av. Principal 123, Dpto 401",
    city: "Lima",
    state: "Lima",
    zipCode: "15001",
    isDefault: true,
  },
  {
    id: "2",
    label: "Oficina",
    name: "Juan Perez",
    phone: "+51 999 888 777",
    address: "Jr. Comercio 456, Piso 3",
    city: "Miraflores",
    state: "Lima",
    zipCode: "15074",
    isDefault: false,
  },
]

export const orders: Order[] = [
  {
    id: "ORD-2026-001",
    items: [
      {
        productId: "1",
        name: 'Plancha de Gypsum Regular 1/2" 1.22x2.44m',
        brand: "Gyplac",
        price: 12.9,
        quantity: 10,
        image: products[0].images[0],
      },
    ],
    total: 129.0,
    status: "delivered",
    paymentMethod: "Tarjeta •••• 3456",
    shippingAddress: "Av. Principal 123, Lima",
    createdAt: "2026-03-15",
    updatedAt: "2026-03-20",
  },
  {
    id: "ORD-2026-002",
    items: [
      {
        productId: "2",
        name: "Plancha de Gypsum Resistente a Humedad RH 1.22x2.44m",
        brand: "Knauf",
        price: 16.5,
        quantity: 5,
        image: products[1].images[0],
      },
      {
        productId: "3",
        name: "Panel WPC para Pared 20cm x 3m",
        brand: "Deceuninck",
        price: 22.0,
        quantity: 8,
        image: products[2].images[0],
      },
    ],
    total: 258.5,
    status: "shipped",
    paymentMethod: "Yape",
    shippingAddress: "Jr. Comercio 456, Miraflores",
    createdAt: "2026-03-18",
    updatedAt: "2026-03-19",
  },
  {
    id: "ORD-2026-003",
    items: [
      {
        productId: "5",
        name: "Moldura de Poliestireno Lisa 2m",
        brand: "Knauf",
        price: 3.5,
        quantity: 20,
        image: products[4].images[0],
      },
    ],
    total: 70.0,
    status: "processing",
    paymentMethod: "Transferencia BCP",
    shippingAddress: "Av. Principal 123, Lima",
    createdAt: "2026-03-20",
    updatedAt: "2026-03-20",
  },
  {
    id: "ORD-2026-004",
    items: [
      {
        productId: "6",
        name: "Piso Flotante SPC Roble Blanco 5mm (caja 2.45m2)",
        brand: "Gyplac",
        price: 27.9,
        quantity: 10,
        image: products[5].images[0],
      },
    ],
    total: 279.0,
    status: "cancelled",
    paymentMethod: "Tarjeta •••• 7890",
    shippingAddress: "Av. Principal 123, Lima",
    createdAt: "2026-03-10",
    updatedAt: "2026-03-11",
  },
]

export const favorites = [products[0], products[1], products[4], products[6]]
