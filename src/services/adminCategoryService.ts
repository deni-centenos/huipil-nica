import { supabase } from '../lib/supabaseClient'

export type AdminCategory = {
  id: number
  nombre: string
  slug: string
  descripcion: string
  orden: number
  activa: boolean
}

export type CategoryFormInput = {
  nombre: string
  descripcion: string
  orden: number
  activa: boolean
}

type CategoriaRow = {
  id: number
  nombre: string
  slug: string
  descripcion: string | null
  orden: number
  activa: boolean
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

function mapCategoria(row: CategoriaRow): AdminCategory {
  return {
    id: row.id,
    nombre: row.nombre,
    slug: row.slug,
    descripcion: row.descripcion ?? '',
    orden: row.orden,
    activa: row.activa,
  }
}

export async function getAdminCategorias(): Promise<AdminCategory[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, nombre, slug, descripcion, orden, activa')
    .order('orden', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => mapCategoria(row as CategoriaRow))
}

export async function createCategory(
  input: CategoryFormInput,
): Promise<AdminCategory> {
  const slug = createSlug(input.nombre)

  const { data, error } = await supabase
    .from('categorias')
    .insert({
      nombre: input.nombre,
      slug,
      descripcion: input.descripcion,
      orden: input.orden,
      activa: input.activa,
    })
    .select('id, nombre, slug, descripcion, orden, activa')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapCategoria(data as CategoriaRow)
}

export async function updateCategory(
  id: number,
  input: CategoryFormInput,
): Promise<AdminCategory> {
  const { data, error } = await supabase
    .from('categorias')
    .update({
      nombre: input.nombre,
      descripcion: input.descripcion,
      orden: input.orden,
      activa: input.activa,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, nombre, slug, descripcion, orden, activa')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapCategoria(data as CategoriaRow)
}