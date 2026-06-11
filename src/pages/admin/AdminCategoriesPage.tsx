import { type FormEvent, useEffect, useState } from 'react'
import {
  createCategory,
  getAdminCategorias,
  type AdminCategory,
  updateCategory,
} from '../../services/adminCategoryService'

type FormState = {
  nombre: string
  descripcion: string
  orden: string
  activa: boolean
}

const initialForm: FormState = {
  nombre: '',
  descripcion: '',
  orden: '0',
  activa: true,
}

export function AdminCategoriesPage() {
  const [categorias, setCategorias] = useState<AdminCategory[]>([])
  const [form, setForm] = useState<FormState>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadCategorias()
  }, [])

  async function loadCategorias() {
    try {
      setLoading(true)
      setErrorMessage('')

      const data = await getAdminCategorias()
      setCategorias(data)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las categorías',
      )
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm(initialForm)
    setEditingId(null)
    setErrorMessage('')
  }

  function startEdit(category: AdminCategory) {
    setEditingId(category.id)
    setForm({
      nombre: category.nombre,
      descripcion: category.descripcion,
      orden: category.orden.toString(),
      activa: category.activa,
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSaving(true)
      setErrorMessage('')

      if (!form.nombre.trim()) {
        throw new Error('El nombre de la categoría es obligatorio')
      }

      const input = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        orden: Number(form.orden || 0),
        activa: form.activa,
      }

      if (editingId) {
        await updateCategory(editingId, input)
      } else {
        await createCategory(input)
      }

      resetForm()
      await loadCategorias()
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la categoría',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm md:p-6">
        <h1 className="text-3xl font-bold text-[#102635] md:text-4xl">
          Categorías
        </h1>

        <p className="mt-2 max-w-2xl text-gray-600">
          Administra las categorías que se mostrarán en el catálogo, como Damas,
          Caballeros, Niños, Máscaras o Accesorios.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-3xl bg-red-50 p-5 font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* FORMULARIO */}
        <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6 lg:self-start">
          <h2 className="text-2xl font-bold text-[#102635]">
            {editingId ? 'Editar categoría' : 'Nueva categoría'}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block font-semibold text-[#102635]">
                Nombre
              </label>

              <input
                value={form.nombre}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    nombre: event.target.value,
                  }))
                }
                placeholder="Ej: Damas"
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-[#102635]">
                Descripción
              </label>

              <textarea
                value={form.descripcion}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    descripcion: event.target.value,
                  }))
                }
                placeholder="Descripción corta de la categoría"
                rows={4}
                className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-[#102635]">
                Orden
              </label>

              <input
                type="number"
                value={form.orden}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    orden: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-[#F3F1ED] p-4 font-semibold text-[#102635]">
              <input
                type="checkbox"
                checked={form.activa}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    activa: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-[#102635]"
              />
              Categoría activa
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-[#102635] px-5 py-3 font-bold text-white transition hover:bg-[#163447] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving
                ? 'Guardando...'
                : editingId
                  ? 'Guardar cambios'
                  : 'Guardar categoría'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-2xl border border-[#102635] px-5 py-3 font-bold text-[#102635] transition hover:bg-[#F3F1ED]"
              >
                Cancelar edición
              </button>
            )}
          </form>
        </section>

        {/* LISTA */}
        <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-bold text-[#102635]">
            Categorías registradas
          </h2>

          {loading ? (
            <p className="mt-6 font-semibold text-[#102635]">
              Cargando categorías...
            </p>
          ) : categorias.length === 0 ? (
            <p className="mt-6 text-gray-600">
              Todavía no hay categorías registradas.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {categorias.map((cat) => (
                <article
                  key={cat.id}
                  className="flex flex-col gap-4 rounded-3xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-[#102635]">
                        {cat.nombre}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          cat.activa
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {cat.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      {cat.descripcion || 'Sin descripción'}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-gray-500">
                      Slug: {cat.slug} · Orden: {cat.orden}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => startEdit(cat)}
                    className="rounded-2xl bg-[#102635] px-5 py-3 font-bold text-white transition hover:bg-[#163447]"
                  >
                    Editar
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}