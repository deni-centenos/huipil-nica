export type Category = {
  id: number
  nombre: string
  slug: string
  descripcion: string
}

export type ProductStatus = 'DISPONIBLE' | 'NO_DISPONIBLE' | 'POR_ENCARGO'

export type Product = {
  id: number
  categoriaId: number
  nombre: string
  slug: string
  descripcionCorta: string
  descripcionLarga: string
  precioVenta: number
  precioRenta: number
  permiteVenta: boolean
  permiteRenta: boolean
  imagenPrincipal: string
  imagenes: string[]
  estado: ProductStatus
  destacado: boolean
  activo: boolean
}

export type BusinessConfig = {
  id: number
  nombreNegocio: string
  slogan: string
  descripcionInicio: string
  textoPortada: string
  mision: string
  vision: string
  historia: string
  telefono: string
  whatsapp: string
  direccion: string
  googleMapsUrl: string
  horario: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
  logoUrl: string
  portadaUrl: string
}

export type BlogContentType = 'BLOG' | 'VIDEO'

export type BlogContent = {
  id: number
  tipo: BlogContentType
  titulo: string
  slug: string
  resumen: string
  contenido: string
  imagenUrl: string
  videoUrl: string
  videoPath: string
  activo: boolean
  destacado: boolean
  orden: number
  createdAt: string
  updatedAt: string
}

export type ReviewStatus = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'

export type Review = {
  id: number
  nombre: string
  apellido: string
  puntuacion: number
  descripcion: string
  estado: ReviewStatus
  revisadoPor: string
  revisadoEn: string
  createdAt: string
  updatedAt: string
}

export type ReviewFormInput = {
  nombre: string
  apellido: string
  puntuacion: number
  descripcion: string
}