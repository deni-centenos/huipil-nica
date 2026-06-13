import { supabase } from '../lib/supabaseClient'
import type { Review, ReviewFormInput, ReviewStatus } from '../types'

type ReviewRow = {
  id: number
  nombre: string
  apellido: string
  puntuacion: number
  descripcion: string
  estado: ReviewStatus
  revisado_por: string | null
  revisado_en: string | null
  created_at: string
  updated_at: string
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    nombre: row.nombre,
    apellido: row.apellido,
    puntuacion: row.puntuacion,
    descripcion: row.descripcion,
    estado: row.estado,
    revisadoPor: row.revisado_por || '',
    revisadoEn: row.revisado_en || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getPublicReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('resenas')
    .select('*')
    .eq('estado', 'APROBADA')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data || []).map((row) => mapReview(row as ReviewRow))
}

export async function createReview(input: ReviewFormInput): Promise<void> {
  const { error } = await supabase.from('resenas').insert({
    nombre: input.nombre.trim(),
    apellido: input.apellido.trim(),
    puntuacion: input.puntuacion,
    descripcion: input.descripcion.trim(),
    estado: 'PENDIENTE',
  })

  if (error) throw new Error(error.message)
}

export async function getAdminReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('resenas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data || []).map((row) => mapReview(row as ReviewRow))
}

export async function updateReviewStatus(
  id: number,
  estado: ReviewStatus,
): Promise<void> {
  const { data: userData } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('resenas')
    .update({
      estado,
      revisado_por: estado === 'PENDIENTE' ? null : userData.user?.id || null,
      revisado_en: estado === 'PENDIENTE' ? null : new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}