import { supabase } from '../lib/supabaseClient'
import type { BlogContent, BlogContentType } from '../types'

type BlogContentRow = {
  id: number
  tipo: BlogContentType
  titulo: string
  slug: string
  resumen: string | null
  contenido: string | null
  imagen_url: string | null
  video_url: string | null
  video_path: string | null
  activo: boolean
  destacado: boolean
  orden: number
  created_at: string
  updated_at: string
}

export type BlogContentFormInput = {
  tipo: BlogContentType
  titulo: string
  resumen: string
  contenido: string
  imagenUrl: string
  videoUrl: string
  videoPath: string
  activo: boolean
  destacado: boolean
  orden: number
}

function mapBlogContent(row: BlogContentRow): BlogContent {
  return {
    id: row.id,
    tipo: row.tipo,
    titulo: row.titulo,
    slug: row.slug,
    resumen: row.resumen || '',
    contenido: row.contenido || '',
    imagenUrl: row.imagen_url || '',
    videoUrl: row.video_url || '',
    videoPath: row.video_path || '',
    activo: row.activo,
    destacado: row.destacado,
    orden: row.orden,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export async function getPublicBlogContents(): Promise<BlogContent[]> {
  const { data, error } = await supabase
    .from('contenido_blog')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data || []).map((row) => mapBlogContent(row as BlogContentRow))
}

export async function getAdminBlogContents(): Promise<BlogContent[]> {
  const { data, error } = await supabase
    .from('contenido_blog')
    .select('*')
    .order('orden', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data || []).map((row) => mapBlogContent(row as BlogContentRow))
}

export async function getAdminBlogContentById(
  id: number,
): Promise<BlogContent | null> {
  const { data, error } = await supabase
    .from('contenido_blog')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  return mapBlogContent(data as BlogContentRow)
}

export async function uploadBlogImage(file: File): Promise<string> {
  const maxSize = 5 * 1024 * 1024

  if (file.size > maxSize) {
    throw new Error('La imagen no debe pesar más de 5 MB.')
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    throw new Error('La imagen debe ser JPG, PNG o WEBP.')
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
  const path = `imagenes/${fileName}`

  const { error } = await supabase.storage.from('blog').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('blog').getPublicUrl(path)

  return data.publicUrl
}

export async function uploadBlogVideo(
  file: File,
): Promise<{ publicUrl: string; path: string }> {
  const maxSize = 50 * 1024 * 1024

  if (file.size > maxSize) {
    throw new Error('El video no debe pesar más de 50 MB.')
  }

  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']

  if (!allowedTypes.includes(file.type)) {
    throw new Error('El video debe ser MP4, WEBM o MOV.')
  }

  const ext = file.name.split('.').pop() || 'mp4'
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
  const path = `videos/${fileName}`

  const { error } = await supabase.storage.from('videos').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('videos').getPublicUrl(path)

  return {
    publicUrl: data.publicUrl,
    path,
  }
}

export async function createBlogContent(
  input: BlogContentFormInput,
): Promise<void> {
  const slug = createSlug(input.titulo)

  const { error } = await supabase.from('contenido_blog').insert({
    tipo: input.tipo,
    titulo: input.titulo,
    slug,
    resumen: input.resumen,
    contenido: input.contenido,
    imagen_url: input.imagenUrl || null,
    video_url: input.videoUrl || null,
    video_path: input.videoPath || null,
    activo: input.activo,
    destacado: input.destacado,
    orden: input.orden,
  })

  if (error) throw new Error(error.message)
}

export async function updateBlogContent(
  id: number,
  input: BlogContentFormInput,
): Promise<void> {
  const { error } = await supabase
    .from('contenido_blog')
    .update({
      tipo: input.tipo,
      titulo: input.titulo,
      resumen: input.resumen,
      contenido: input.contenido,
      imagen_url: input.imagenUrl || null,
      video_url: input.videoUrl || null,
      video_path: input.videoPath || null,
      activo: input.activo,
      destacado: input.destacado,
      orden: input.orden,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}