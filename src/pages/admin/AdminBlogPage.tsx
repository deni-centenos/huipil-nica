import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  Edit,
  FileText,
  ImageIcon,
  PlayCircle,
  Plus,
  Save,
  X,
} from 'lucide-react'
import type { BlogContent } from '../../types'
import {
  createBlogContent,
  getAdminBlogContents,
  updateBlogContent,
  uploadBlogImage,
  uploadBlogVideo,
} from '../../services/blogService'
import type { BlogContentFormInput } from '../../services/blogService'

const emptyForm: BlogContentFormInput = {
  tipo: 'BLOG',
  titulo: '',
  resumen: '',
  contenido: '',
  imagenUrl: '',
  videoUrl: '',
  videoPath: '',
  activo: true,
  destacado: false,
  orden: 0,
}

export function AdminBlogPage() {
  const [items, setItems] = useState<BlogContent[]>([])
  const [form, setForm] = useState<BlogContentFormInput>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

    async function loadData(showLoading = true) {
    try {
      if (showLoading) {
        setLoading(true)
      }

      const data = await getAdminBlogContents()
      setItems(data)
    } catch {
      setError('No se pudo cargar el contenido.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    async function loadInitialData() {
      try {
        const data = await getAdminBlogContents()

        if (mounted) {
          setItems(data)
        }
      } catch {
        if (mounted) {
          setError('No se pudo cargar el contenido.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadInitialData()

    return () => {
      mounted = false
    }
  }, [])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setImageFile(null)
    setVideoFile(null)
    setError('')
    setSuccess('')
  }

  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.currentTarget

    if (name === 'tipo') {
      const tipo = value as BlogContentFormInput['tipo']

      setForm((prev) => ({
        ...prev,
        tipo,
        videoUrl: tipo === 'BLOG' ? '' : prev.videoUrl,
        videoPath: tipo === 'BLOG' ? '' : prev.videoPath,
      }))

      if (tipo === 'BLOG') {
        setVideoFile(null)
      }

      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === 'orden' ? Number(value) : value,
    }))
  }

  function handleCheckChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.currentTarget

    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] || null

    if (file && file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe pesar más de 5 MB.')
      return
    }

    setImageFile(file)
  }

  function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] || null

    if (file && file.size > 50 * 1024 * 1024) {
      setError('El video no debe pesar más de 50 MB.')
      return
    }

    setVideoFile(file)
  }

  function startEdit(item: BlogContent) {
    setEditingId(item.id)
    setForm({
      tipo: item.tipo,
      titulo: item.titulo,
      resumen: item.resumen,
      contenido: item.contenido,
      imagenUrl: item.imagenUrl,
      videoUrl: item.videoUrl,
      videoPath: item.videoPath,
      activo: item.activo,
      destacado: item.destacado,
      orden: item.orden,
    })

    setImageFile(null)
    setVideoFile(null)
    setError('')
    setSuccess('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.titulo.trim()) {
      setError('El título es obligatorio.')
      return
    }

    if (form.tipo === 'VIDEO') {
      const activeVideos = items.filter(
        (item) =>
          item.tipo === 'VIDEO' &&
          item.activo &&
          item.id !== editingId,
      ).length

      if (form.activo && activeVideos >= 3) {
        setError('Solo puedes tener 3 videos activos como máximo.')
        return
      }
    }

    try {
      setSaving(true)

      const payload: BlogContentFormInput = {
        ...form,
        titulo: form.titulo.trim(),
        resumen: form.resumen.trim(),
        contenido: form.contenido.trim(),
      }

      if (imageFile) {
        payload.imagenUrl = await uploadBlogImage(imageFile)
      }

      if (payload.tipo === 'VIDEO') {
        if (videoFile) {
          const uploadedVideo = await uploadBlogVideo(videoFile)
          payload.videoUrl = uploadedVideo.publicUrl
          payload.videoPath = uploadedVideo.path
        }

        if (!payload.videoUrl) {
          setError('Debes seleccionar un video.')
          return
        }
      } else {
        payload.videoUrl = ''
        payload.videoPath = ''
      }

      if (editingId) {
        await updateBlogContent(editingId, payload)
        setSuccess('Contenido actualizado correctamente.')
      } else {
        await createBlogContent(payload)
        setSuccess('Contenido creado correctamente.')
      }

      resetForm()
      await loadData()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el contenido.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#64748B]">
            Administración
          </p>

          <h1 className="text-3xl font-black text-[#102635]">
            Blog y videos
          </h1>

          <p className="mt-2 text-gray-600">
            Administra artículos y hasta 3 videos activos para la página pública.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#102635] px-5 py-3 font-bold text-white"
        >
          <Plus size={18} />
          Nuevo contenido
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-4xl bg-white p-6 shadow-md"
      >
        <div className="mb-6 flex items-center gap-3">
          {form.tipo === 'VIDEO' ? (
            <PlayCircle className="text-[#102635]" />
          ) : (
            <FileText className="text-[#102635]" />
          )}

          <h2 className="text-xl font-black text-[#102635]">
            {editingId ? 'Editar contenido' : 'Nuevo contenido'}
          </h2>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-[#102635]">Tipo</span>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleFieldChange}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
            >
              <option value="BLOG">Artículo</option>
              <option value="VIDEO">Video</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-[#102635]">Orden</span>
            <input
              type="number"
              name="orden"
              value={form.orden}
              onChange={handleFieldChange}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-[#102635]">Título</span>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleFieldChange}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
              placeholder="Ejemplo: Historia del traje típico"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-[#102635]">Resumen</span>
            <textarea
              name="resumen"
              value={form.resumen}
              onChange={handleFieldChange}
              rows={3}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
              placeholder="Pequeña descripción para mostrar en la tarjeta"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-[#102635]">Contenido</span>
            <textarea
              name="contenido"
              value={form.contenido}
              onChange={handleFieldChange}
              rows={6}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
              placeholder="Texto completo del artículo o descripción del video"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="flex items-center gap-2 text-sm font-bold text-[#102635]">
              <ImageIcon size={18} />
              Imagen de portada
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3"
            />

            {form.imagenUrl && (
              <img
                src={form.imagenUrl}
                alt="Vista previa"
                className="mt-3 h-40 w-full rounded-2xl object-cover md:w-80"
              />
            )}

            {imageFile && (
              <p className="text-sm text-gray-500">
                Imagen seleccionada: {imageFile.name}
              </p>
            )}
          </label>

          {form.tipo === 'VIDEO' && (
            <label className="space-y-2 md:col-span-2">
              <span className="flex items-center gap-2 text-sm font-bold text-[#102635]">
                <PlayCircle size={18} />
                Video
              </span>

              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleVideoChange}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3"
              />

              <p className="text-sm text-gray-500">
                Máximo permitido: 50 MB. Formatos: MP4, WEBM o MOV.
              </p>

              {form.videoUrl && (
                <video
                  src={form.videoUrl}
                  controls
                  className="mt-3 aspect-video w-full rounded-2xl bg-black object-cover md:w-96"
                />
              )}

              {videoFile && (
                <p className="text-sm text-gray-500">
                  Video seleccionado: {videoFile.name}
                </p>
              )}
            </label>
          )}

          <div className="flex flex-wrap gap-4 md:col-span-2">
            <label className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3">
              <input
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleCheckChange}
              />
              <span className="font-semibold text-[#102635]">Activo</span>
            </label>

            <label className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3">
              <input
                type="checkbox"
                name="destacado"
                checked={form.destacado}
                onChange={handleCheckChange}
              />
              <span className="font-semibold text-[#102635]">Destacado</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#102635] px-6 py-3 font-bold text-white disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar contenido'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 px-6 py-3 font-bold text-[#102635]"
            >
              <X size={18} />
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="rounded-4xl bg-white p-6 shadow-md">
        <h2 className="mb-5 text-xl font-black text-[#102635]">
          Contenido registrado
        </h2>

        {loading && <p>Cargando contenido...</p>}

        {!loading && items.length === 0 && (
          <p className="text-gray-500">Todavía no hay contenido registrado.</p>
        )}

        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-3xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex gap-4">
                {item.imagenUrl ? (
                  <img
                    src={item.imagenUrl}
                    alt={item.titulo}
                    className="h-20 w-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-gray-100 text-[#102635]">
                    {item.tipo === 'VIDEO' ? (
                      <PlayCircle />
                    ) : (
                      <FileText />
                    )}
                  </div>
                )}

                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#102635] px-3 py-1 text-xs font-bold text-white">
                      {item.tipo === 'VIDEO' ? 'Video' : 'Artículo'}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.activo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.activo ? 'Activo' : 'Inactivo'}
                    </span>

                    {item.destacado && (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                        Destacado
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-[#102635]">{item.titulo}</h3>
                  <p className="text-sm text-gray-500">{item.resumen}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startEdit(item)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#102635] px-4 py-2 font-bold text-[#102635]"
              >
                <Edit size={16} />
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}