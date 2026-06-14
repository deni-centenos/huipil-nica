import { supabase } from '../lib/supabaseClient'
import type { BusinessConfig } from '../types'

const BUSINESS_BUCKET = 'negocio'

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
  resenas_portada_url: string | null
  blog_portada_url: string | null
}

export type BusinessConfigInput = {
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
  resenasPortadaUrl: string
  blogPortadaUrl: string
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
    resenasPortadaUrl: row.resenas_portada_url ?? '',
    blogPortadaUrl: row.blog_portada_url ?? '',
  }
}

export async function getAdminBusinessConfig(): Promise<BusinessConfig | null> {
  const { data, error } = await supabase
    .from('configuracion_negocio')
    .select(
      'id, nombre_negocio, slogan, descripcion_inicio, texto_portada, mision, vision, historia, telefono, whatsapp, direccion, google_maps_url, horario, facebook_url, instagram_url, tiktok_url, logo_url, portada_url, resenas_portada_url, blog_portada_url',
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

export async function updateBusinessConfig(
  id: number,
  input: BusinessConfigInput,
): Promise<BusinessConfig> {
  const { data, error } = await supabase
    .from('configuracion_negocio')
    .update({
      nombre_negocio: input.nombreNegocio,
      slogan: input.slogan,
      descripcion_inicio: input.descripcionInicio,
      texto_portada: input.textoPortada,
      mision: input.mision,
      vision: input.vision,
      historia: input.historia,
      telefono: input.telefono,
      whatsapp: input.whatsapp,
      direccion: input.direccion,
      google_maps_url: input.googleMapsUrl,
      horario: input.horario,
      facebook_url: input.facebookUrl,
      instagram_url: input.instagramUrl,
      tiktok_url: input.tiktokUrl,
      logo_url: input.logoUrl || null,
      portada_url: input.portadaUrl || null,
      resenas_portada_url: input.resenasPortadaUrl || null,
      blog_portada_url: input.blogPortadaUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(
      'id, nombre_negocio, slogan, descripcion_inicio, texto_portada, mision, vision, historia, telefono, whatsapp, direccion, google_maps_url, horario, facebook_url, instagram_url, tiktok_url, logo_url, portada_url, resenas_portada_url, blog_portada_url',
    )
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return mapConfiguracion(data as ConfiguracionRow)
}

export async function uploadBusinessImage(
  file: File,
  folder: 'logo' | 'portada' | 'blog' | 'resenas',
): Promise<string> {
  const extension = file.name.split('.').pop() ?? 'jpg'
  const safeName = `${folder}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${extension}`

  const filePath = `${folder}/${safeName}`

  const { error } = await supabase.storage
    .from(BUSINESS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(BUSINESS_BUCKET).getPublicUrl(filePath)

  return data.publicUrl
}