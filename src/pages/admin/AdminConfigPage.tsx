import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import { ImagePlus, Save } from 'lucide-react'
import {
  getAdminBusinessConfig,
  updateBusinessConfig,
  uploadBusinessImage,
} from '../../services/adminConfigService'

type FormState = {
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
  resenasPortadaUrl: string
  blogPortadaUrl: string
}

const initialForm: FormState = {
  id: 0,
  nombreNegocio: '',
  slogan: '',
  descripcionInicio: '',
  textoPortada: '',
  mision: '',
  vision: '',
  historia: '',
  telefono: '',
  whatsapp: '',
  direccion: '',
  googleMapsUrl: '',
  horario: '',
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
  logoUrl: '',
  portadaUrl: '',
  resenasPortadaUrl: '',
  blogPortadaUrl: '',
}

export function AdminConfigPage() {
  const [form, setForm] = useState<FormState>(initialForm)

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [portadaFile, setPortadaFile] = useState<File | null>(null)
  const [blogPortadaFile, setBlogPortadaFile] = useState<File | null>(null)

  const [logoPreview, setLogoPreview] = useState('')
  const [portadaPreview, setPortadaPreview] = useState('')
  const [blogPortadaPreview, setBlogPortadaPreview] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadConfig() {
      try {
        const config = await getAdminBusinessConfig()

        if (!mounted) return

        if (!config) {
          setErrorMessage('No existe configuración del negocio en la base de datos.')
          return
        }

        setForm({
          id: config.id,
          nombreNegocio: config.nombreNegocio,
          slogan: config.slogan,
          descripcionInicio: config.descripcionInicio,
          textoPortada: config.textoPortada,
          mision: config.mision,
          vision: config.vision,
          historia: config.historia,
          telefono: config.telefono,
          whatsapp: config.whatsapp,
          direccion: config.direccion,
          googleMapsUrl: config.googleMapsUrl,
          horario: config.horario,
          facebookUrl: config.facebookUrl,
          instagramUrl: config.instagramUrl,
          tiktokUrl: config.tiktokUrl,
          logoUrl: config.logoUrl,
          portadaUrl: config.portadaUrl,
          resenasPortadaUrl: config.resenasPortadaUrl,
          blogPortadaUrl: config.blogPortadaUrl,
        })

        setLogoPreview(config.logoUrl)
        setPortadaPreview(config.portadaUrl)
        setBlogPortadaPreview(config.blogPortadaUrl)
      } catch (error) {
        if (mounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'No se pudo cargar la configuración',
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadConfig()

    return () => {
      mounted = false
    }
  }, [])

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.currentTarget

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    if (!file) return

    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  function handlePortadaChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    if (!file) return

    setPortadaFile(file)
    setPortadaPreview(URL.createObjectURL(file))
  }

  function handleBlogPortadaChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    if (!file) return

    setBlogPortadaFile(file)
    setBlogPortadaPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSaving(true)
      setErrorMessage('')
      setSuccessMessage('')

      if (!form.nombreNegocio.trim()) {
        throw new Error('El nombre del negocio es obligatorio')
      }

      let logoUrl = form.logoUrl
      let portadaUrl = form.portadaUrl
      let blogPortadaUrl = form.blogPortadaUrl

      if (logoFile) {
        logoUrl = await uploadBusinessImage(logoFile, 'logo')
      }

      if (portadaFile) {
        portadaUrl = await uploadBusinessImage(portadaFile, 'portada')
      }

      if (blogPortadaFile) {
        blogPortadaUrl = await uploadBusinessImage(blogPortadaFile, 'blog')
      }

      const updated = await updateBusinessConfig(form.id, {
        nombreNegocio: form.nombreNegocio.trim(),
        slogan: form.slogan.trim(),
        descripcionInicio: form.descripcionInicio.trim(),
        textoPortada: form.textoPortada.trim(),
        mision: form.mision.trim(),
        vision: form.vision.trim(),
        historia: form.historia.trim(),
        telefono: form.telefono.trim(),
        whatsapp: form.whatsapp.trim(),
        direccion: form.direccion.trim(),
        googleMapsUrl: form.googleMapsUrl.trim(),
        horario: form.horario.trim(),
        facebookUrl: form.facebookUrl.trim(),
        instagramUrl: form.instagramUrl.trim(),
        tiktokUrl: form.tiktokUrl.trim(),
        logoUrl,
        portadaUrl,
        resenasPortadaUrl: form.resenasPortadaUrl,
        blogPortadaUrl,
      })

      setForm((prev) => ({
        ...prev,
        logoUrl: updated.logoUrl,
        portadaUrl: updated.portadaUrl,
        resenasPortadaUrl: updated.resenasPortadaUrl,
        blogPortadaUrl: updated.blogPortadaUrl,
      }))

      setLogoPreview(updated.logoUrl)
      setPortadaPreview(updated.portadaUrl)
      setBlogPortadaPreview(updated.blogPortadaUrl)

      setLogoFile(null)
      setPortadaFile(null)
      setBlogPortadaFile(null)

      setSuccessMessage('Configuración guardada correctamente.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la configuración',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <p className="font-semibold text-[#102635]">
          Cargando configuración...
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <h1 className="text-3xl font-bold text-[#102635] md:text-4xl">
            Configuración
          </h1>

          <p className="mt-2 max-w-3xl text-gray-600">
            Administra la información principal que verá el cliente en la página:
            logo, portadas, contacto, horario y textos del negocio.
          </p>
        </div>

        <button
          type="submit"
          form="config-form"
          disabled={saving}
          className="hidden items-center justify-center gap-2 rounded-2xl bg-[#102635] px-5 py-3 font-bold text-white transition hover:bg-[#163447] disabled:cursor-not-allowed disabled:opacity-70 md:inline-flex"
        >
          <Save size={20} />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-3xl bg-red-50 p-5 font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-3xl bg-green-50 p-5 font-semibold text-green-700">
          {successMessage}
        </div>
      )}

      <form
        id="config-form"
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#102635]">
              Información general
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                label="Nombre del negocio"
                name="nombreNegocio"
                value={form.nombreNegocio}
                onChange={handleChange}
                required
              />

              <TextInput
                label="Slogan"
                name="slogan"
                value={form.slogan}
                onChange={handleChange}
              />

              <TextInput
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />

              <TextInput
                label="WhatsApp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="50588888888"
              />

              <TextInput
                label="Horario"
                name="horario"
                value={form.horario}
                onChange={handleChange}
              />

              <TextInput
                label="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <TextInput
                  label="Link Google Maps"
                  name="googleMapsUrl"
                  value={form.googleMapsUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#102635]">
              Textos de la página
            </h2>

            <div className="space-y-5">
              <TextArea
                label="Texto de portada"
                name="textoPortada"
                value={form.textoPortada}
                onChange={handleChange}
                rows={3}
              />

              <TextArea
                label="Descripción de inicio"
                name="descripcionInicio"
                value={form.descripcionInicio}
                onChange={handleChange}
                rows={3}
              />

              <TextArea
                label="Misión"
                name="mision"
                value={form.mision}
                onChange={handleChange}
                rows={3}
              />

              <TextArea
                label="Visión"
                name="vision"
                value={form.vision}
                onChange={handleChange}
                rows={3}
              />

              <TextArea
                label="Historia"
                name="historia"
                value={form.historia}
                onChange={handleChange}
                rows={5}
              />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#102635]">
              Redes sociales
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                label="Facebook"
                name="facebookUrl"
                value={form.facebookUrl}
                onChange={handleChange}
              />

              <TextInput
                label="Instagram"
                name="instagramUrl"
                value={form.instagramUrl}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <TextInput
                  label="TikTok"
                  name="tiktokUrl"
                  value={form.tiktokUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#102635]">Logo</h2>

            <div className="flex justify-center rounded-3xl bg-[#F3F1ED] p-6">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-[#102635]">
                  <ImagePlus size={36} />
                  <p className="mt-2 text-sm font-semibold">Sin logo</p>
                </div>
              )}
            </div>

            <label className="mt-5 block cursor-pointer rounded-2xl bg-[#102635] px-5 py-3 text-center font-bold text-white transition hover:bg-[#163447]">
              Subir logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#102635]">
              Imagen de portada principal
            </h2>

            <div className="overflow-hidden rounded-3xl bg-[#F3F1ED]">
              {portadaPreview ? (
                <img
                  src={portadaPreview}
                  alt="Portada principal"
                  className="aspect-16/9 w-full object-cover"
                />
              ) : (
                <div className="flex aspect-16/9 flex-col items-center justify-center gap-3 text-[#102635]">
                  <ImagePlus size={42} />
                  <p className="font-semibold">Sin portada</p>
                </div>
              )}
            </div>

            <label className="mt-5 block cursor-pointer rounded-2xl bg-[#102635] px-5 py-3 text-center font-bold text-white transition hover:bg-[#163447]">
              Subir portada
              <input
                type="file"
                accept="image/*"
                onChange={handlePortadaChange}
                className="hidden"
              />
            </label>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-2 text-2xl font-bold text-[#102635]">
              Portada de blog y videos
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Esta imagen aparecerá al inicio de la página pública de Blog y videos.
            </p>

            <div className="overflow-hidden rounded-3xl bg-[#F3F1ED]">
              {blogPortadaPreview ? (
                <img
                  src={blogPortadaPreview}
                  alt="Portada de blog y videos"
                  className="aspect-16/9 w-full object-cover"
                />
              ) : (
                <div className="flex aspect-16/9 flex-col items-center justify-center gap-3 text-[#102635]">
                  <ImagePlus size={42} />
                  <p className="font-semibold">Sin portada de blog y videos</p>
                </div>
              )}
            </div>

            <label className="mt-5 block cursor-pointer rounded-2xl bg-[#102635] px-5 py-3 text-center font-bold text-white transition hover:bg-[#163447]">
              Subir portada de blog y videos
              <input
                type="file"
                accept="image/*"
                onChange={handleBlogPortadaChange}
                className="hidden"
              />
            </label>
          </section>

          <button
            type="submit"
            form="config-form"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#102635] px-5 py-4 font-bold text-white transition hover:bg-[#163447] disabled:cursor-not-allowed disabled:opacity-70 md:hidden"
          >
            <Save size={20} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </aside>
      </form>
    </div>
  )
}

type FieldProps = {
  label: string
  name: string
  value: string
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  placeholder?: string
  required?: boolean
  rows?: number
}

function TextInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block font-semibold text-[#102635]">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
      />
    </div>
  )
}

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  rows = 4,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block font-semibold text-[#102635]">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
      />
    </div>
  )
}