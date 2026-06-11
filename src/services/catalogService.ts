import { supabase } from '../lib/supabaseClient'
import type { BusinessConfig, Category, Product } from '../types'

type CategoriaRow = {
  id: number
  nombre: string
  slug: string
  descripcion: string | null
  orden: number
  activa: boolean
}

type ProductoRow = {
  id: number
  categoria_id: number
  nombre: string
  slug: string
  descripcion_corta: string | null
  descripcion_larga: string | null
  precio_venta: number
  precio_renta: number
  permite_venta: boolean
  permite_renta: boolean
  imagen_principal_url: string | null
  estado: 'DISPONIBLE' | 'NO_DISPONIBLE' | 'POR_ENCARGO'
  destacado: boolean
  activo: boolean
}

function mapCategoria(row: CategoriaRow): Category {
  return {
    id: row.id,
    nombre: row.nombre,
    slug: row.slug,
    descripcion: row.descripcion ?? '',
  }
}

function mapProducto(row: ProductoRow): Product {
  return {
    id: row.id,
    categoriaId: row.categoria_id,
    nombre: row.nombre,
    slug: row.slug,
    descripcionCorta: row.descripcion_corta ?? '',
    descripcionLarga: row.descripcion_larga ?? '',
    precioVenta: Number(row.precio_venta),
    precioRenta: Number(row.precio_renta),
    permiteVenta: row.permite_venta,
    permiteRenta: row.permite_renta,
    imagenPrincipal:
      row.imagen_principal_url ??
      'https://placehold.co/800x1000?text=Sin+imagen',
    imagenes: [],
    estado: row.estado,
    destacado: row.destacado,
    activo: row.activo,
  }
}

export async function getCategorias(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre, slug, descripcion, orden, activa')
    .eq('activa', true)
    .order('orden', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => mapCategoria(row as CategoriaRow))
}

export async function getProductos(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select(
      'id, categoria_id, nombre, slug, descripcion_corta, descripcion_larga, precio_venta, precio_renta, permite_venta, permite_renta, imagen_principal_url, estado, destacado, activo',
    )
    .eq('activo', true)
    .order('id', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => mapProducto(row as ProductoRow))
}

export async function getProductoBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('productos')
    .select(
      'id, categoria_id, nombre, slug, descripcion_corta, descripcion_larga, precio_venta, precio_renta, permite_venta, permite_renta, imagen_principal_url, estado, destacado, activo',
    )
    .eq('slug', slug)
    .eq('activo', true)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) return null

  return mapProducto(data as ProductoRow)
}

type ConfiguracionRow = {
  id: number
  nombre_negocio: string | null
  slogan: string | null
  descripcion_inicio: string | null
  texto_portada: string | null
  mision: string | null
  vision: string | null
  historia: string | null
  telefono: string | null
  whatsapp: string | null
  direccion: string | null
  google_maps_url: string | null
  horario: string | null
  facebook_url: string | null
  instagram_url: string | null
  tiktok_url: string | null
  logo_url: string | null
  portada_url: string | null
}

function mapConfiguracion(row: ConfiguracionRow): BusinessConfig {
  return {
    id: row.id,
    nombreNegocio: row.nombre_negocio ?? 'Huipil Nica',
    slogan: row.slogan ?? '',
    descripcionInicio: row.descripcion_inicio ?? '',
    textoPortada: row.texto_portada ?? '',
    mision: row.mision ?? '',
    vision: row.vision ?? '',
    historia: row.historia ?? '',
    telefono: row.telefono ?? '',
    whatsapp: row.whatsapp ?? '',
    direccion: row.direccion ?? '',
    googleMapsUrl: row.google_maps_url ?? '',
    horario: row.horario ?? '',
    facebookUrl: row.facebook_url ?? '',
    instagramUrl: row.instagram_url ?? '',
    tiktokUrl: row.tiktok_url ?? '',
    logoUrl: row.logo_url ?? '',
    portadaUrl: row.portada_url ?? '',
  }
}

export async function getConfiguracionNegocio(): Promise<BusinessConfig | null> {
  const { data, error } = await supabase
    .from('configuracion_negocio')
    .select(
      'id, nombre_negocio, slogan, descripcion_inicio, texto_portada, mision, vision, historia, telefono, whatsapp, direccion, google_maps_url, horario, facebook_url, instagram_url, tiktok_url, logo_url, portada_url',
    )
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) return null

  return mapConfiguracion(data as ConfiguracionRow)
}