import { supabase } from '../lib/supabaseClient'
import type { Product, ProductStatus } from '../types'

const PRODUCT_BUCKET = 'productos'

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
  estado: ProductStatus
  destacado: boolean
  activo: boolean
}

export type ProductFormInput = {
  categoriaId: number
  nombre: string
  descripcionCorta: string
  descripcionLarga: string
  precioVenta: number
  precioRenta: number
  permiteVenta: boolean
  permiteRenta: boolean
  estado: ProductStatus
  activo: boolean
  destacado: boolean
  imagenPrincipalUrl: string
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

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getAdminProductos(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select(
      'id, categoria_id, nombre, slug, descripcion_corta, descripcion_larga, precio_venta, precio_renta, permite_venta, permite_renta, imagen_principal_url, estado, destacado, activo',
    )
    .order('id', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => mapProducto(row as ProductoRow))
}

export async function getAdminProductoById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('productos')
    .select(
      'id, categoria_id, nombre, slug, descripcion_corta, descripcion_larga, precio_venta, precio_renta, permite_venta, permite_renta, imagen_principal_url, estado, destacado, activo',
    )
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) return null

  return mapProducto(data as ProductoRow)
}

export async function uploadProductImage(file: File): Promise<string> {
  const extension = file.name.split('.').pop() ?? 'jpg'
  const safeName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${extension}`

  const filePath = `productos/${safeName}`

  const { error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(filePath)

  return data.publicUrl
}

export async function createProduct(input: ProductFormInput): Promise<Product> {
  const slug = createSlug(input.nombre)

  const { data, error } = await supabase
    .from('productos')
    .insert({
      categoria_id: input.categoriaId,
      nombre: input.nombre,
      slug,
      descripcion_corta: input.descripcionCorta,
      descripcion_larga: input.descripcionLarga,
      precio_venta: input.precioVenta,
      precio_renta: input.precioRenta,
      permite_venta: input.permiteVenta,
      permite_renta: input.permiteRenta,
      imagen_principal_url: input.imagenPrincipalUrl || null,
      estado: input.estado,
      destacado: input.destacado,
      activo: input.activo,
    })
    .select(
      'id, categoria_id, nombre, slug, descripcion_corta, descripcion_larga, precio_venta, precio_renta, permite_venta, permite_renta, imagen_principal_url, estado, destacado, activo',
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapProducto(data as ProductoRow)
}

export async function updateProduct(
  id: number,
  input: ProductFormInput,
): Promise<Product> {
  const { data, error } = await supabase
    .from('productos')
    .update({
      categoria_id: input.categoriaId,
      nombre: input.nombre,
      descripcion_corta: input.descripcionCorta,
      descripcion_larga: input.descripcionLarga,
      precio_venta: input.precioVenta,
      precio_renta: input.precioRenta,
      permite_venta: input.permiteVenta,
      permite_renta: input.permiteRenta,
      imagen_principal_url: input.imagenPrincipalUrl || null,
      estado: input.estado,
      destacado: input.destacado,
      activo: input.activo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(
      'id, categoria_id, nombre, slug, descripcion_corta, descripcion_larga, precio_venta, precio_renta, permite_venta, permite_renta, imagen_principal_url, estado, destacado, activo',
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapProducto(data as ProductoRow)
}