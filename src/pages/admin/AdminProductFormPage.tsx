import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Save } from 'lucide-react'
import {
  createProduct,
  getAdminProductoById,
  updateProduct,
  uploadProductImage,
} from '../../services/adminProductService'
import { getCategorias } from '../../services/catalogService'
import type { Category, ProductStatus } from '../../types'

type ProductFormState = {
  nombre: string
  categoriaId: string
  descripcionCorta: string
  descripcionLarga: string
  precioVenta: string
  precioRenta: string
  permiteVenta: boolean
  permiteRenta: boolean
  estado: ProductStatus
  activo: boolean
  destacado: boolean
  imagenPrincipalUrl: string
}

const initialForm: ProductFormState = {
  nombre: '',
  categoriaId: '',
  descripcionCorta: '',
  descripcionLarga: '',
  precioVenta: '',
  precioRenta: '',
  permiteVenta: true,
  permiteRenta: true,
  estado: 'DISPONIBLE',
  activo: true,
  destacado: false,
  imagenPrincipalUrl: '',
}

export function AdminProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const isEditMode = Boolean(id)

  const [categorias, setCategorias] = useState<Category[]>([])
  const [form, setForm] = useState<ProductFormState>(initialForm)
  const [imagenPreview, setImagenPreview] = useState('')
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setErrorMessage('')

        const categoriasData = await getCategorias()
        setCategorias(categoriasData)

        if (isEditMode && id) {
          const producto = await getAdminProductoById(Number(id))

          if (!producto) {
            setErrorMessage('Producto no encontrado')
            return
          }

          setForm({
            nombre: producto.nombre,
            categoriaId: producto.categoriaId.toString(),
            descripcionCorta: producto.descripcionCorta,
            descripcionLarga: producto.descripcionLarga,
            precioVenta: producto.precioVenta.toString(),
            precioRenta: producto.precioRenta.toString(),
            permiteVenta: producto.permiteVenta,
            permiteRenta: producto.permiteRenta,
            estado: producto.estado,
            activo: producto.activo,
            destacado: producto.destacado,
            imagenPrincipalUrl: producto.imagenPrincipal,
          })

          setImagenPreview(producto.imagenPrincipal)
        } else {
          setForm((prev) => ({
            ...prev,
            categoriaId: categoriasData[0]?.id.toString() ?? '',
          }))
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la información',
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, isEditMode])

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const target = event.currentTarget
    const { name, value } = target

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      const checked = target.checked

      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }))

      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    setSelectedImageFile(file)
    setImagenPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSaving(true)
      setErrorMessage('')

      if (!form.nombre.trim()) {
        throw new Error('El nombre del producto es obligatorio')
      }

      if (!form.categoriaId) {
        throw new Error('Selecciona una categoría')
      }

      if (!form.permiteVenta && !form.permiteRenta) {
        throw new Error('El producto debe permitir venta, renta o ambas')
      }

      let imageUrl = form.imagenPrincipalUrl

      if (selectedImageFile) {
        imageUrl = await uploadProductImage(selectedImageFile)
      }

      const input = {
        categoriaId: Number(form.categoriaId),
        nombre: form.nombre.trim(),
        descripcionCorta: form.descripcionCorta.trim(),
        descripcionLarga: form.descripcionLarga.trim(),
        precioVenta: Number(form.precioVenta || 0),
        precioRenta: Number(form.precioRenta || 0),
        permiteVenta: form.permiteVenta,
        permiteRenta: form.permiteRenta,
        estado: form.estado,
        activo: form.activo,
        destacado: form.destacado,
        imagenPrincipalUrl: imageUrl,
      }

      if (isEditMode && id) {
        await updateProduct(Number(id), input)
      } else {
        await createProduct(input)
      }

      navigate('/admin/productos')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el producto',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <p className="font-semibold text-[#102635]">Cargando formulario...</p>
      </div>
    )
  }

  if (errorMessage === 'Producto no encontrado') {
    return (
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#102635]">
          Producto no encontrado
        </h1>

        <Link
          to="/admin/productos"
          className="mt-6 inline-block rounded-2xl bg-[#102635] px-5 py-3 font-bold text-white"
        >
          Volver a productos
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <Link
            to="/admin/productos"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#102635] hover:underline"
          >
            <ArrowLeft size={18} />
            Volver a productos
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-[#102635] md:text-4xl">
            {isEditMode ? 'Editar producto' : 'Nuevo producto'}
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-gray-600 md:text-base">
            Administra nombre, categoría, precios, disponibilidad e imagen
            principal del producto.
          </p>
        </div>

        <button
          type="submit"
          form="product-form"
          disabled={saving}
          className="hidden items-center justify-center gap-2 rounded-2xl bg-[#102635] px-5 py-3 font-bold text-white transition hover:bg-[#163447] disabled:cursor-not-allowed disabled:opacity-70 md:inline-flex"
        >
          <Save size={20} />
          {saving
            ? 'Guardando...'
            : isEditMode
              ? 'Guardar cambios'
              : 'Guardar producto'}
        </button>
      </div>

      {errorMessage && errorMessage !== 'Producto no encontrado' && (
        <div className="mb-6 rounded-3xl bg-red-50 p-5 font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#102635]">
              Información principal
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold text-[#102635]">
                  Nombre del producto
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Traje de Mestizaje"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#102635]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-[#102635]">
                  Categoría
                </label>
                <select
                  name="categoriaId"
                  value={form.categoriaId}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#102635]"
                  required
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-[#102635]">
                  Estado
                </label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#102635]"
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="NO_DISPONIBLE">No disponible</option>
                  <option value="POR_ENCARGO">Por encargo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold text-[#102635]">
                  Descripción corta
                </label>
                <input
                  name="descripcionCorta"
                  value={form.descripcionCorta}
                  onChange={handleChange}
                  placeholder="Descripción breve para el catálogo"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#102635]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold text-[#102635]">
                  Descripción larga
                </label>
                <textarea
                  name="descripcionLarga"
                  value={form.descripcionLarga}
                  onChange={handleChange}
                  placeholder="Información completa del traje"
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#102635]"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#102635]">
              Precios y opciones
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-[#102635]">
                  Precio venta
                </label>
                <input
                  name="precioVenta"
                  value={form.precioVenta}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="750"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#102635]"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-[#102635]">
                  Precio renta
                </label>
                <input
                  name="precioRenta"
                  value={form.precioRenta}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="360"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#102635]"
                />
              </div>

              <CheckOption
                name="permiteVenta"
                label="Disponible para venta"
                checked={form.permiteVenta}
                onChange={handleChange}
              />

              <CheckOption
                name="permiteRenta"
                label="Disponible para renta"
                checked={form.permiteRenta}
                onChange={handleChange}
              />

              <CheckOption
                name="activo"
                label="Producto activo"
                checked={form.activo}
                onChange={handleChange}
              />

              <CheckOption
                name="destacado"
                label="Mostrar como destacado"
                checked={form.destacado}
                onChange={handleChange}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 text-2xl font-bold text-[#102635]">
              Imagen principal
            </h2>

            <div className="overflow-hidden rounded-3xl bg-[#F3F1ED]">
              {imagenPreview ? (
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className="aspect-4/5 w-full object-cover"
                />
              ) : (
                <div className="flex aspect-4/5 flex-col items-center justify-center gap-3 text-[#102635]">
                  <ImagePlus size={46} />
                  <p className="font-semibold">Sin imagen</p>
                </div>
              )}
            </div>

            <label className="mt-5 block cursor-pointer rounded-2xl bg-[#102635] px-5 py-3 text-center font-bold text-white transition hover:bg-[#163447]">
              Subir imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <p className="mt-3 text-sm text-gray-500">
              Esta imagen será la que verá el cliente en el catálogo y en el
              detalle del producto.
            </p>
          </section>

          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#102635] px-5 py-4 font-bold text-white transition hover:bg-[#163447] disabled:cursor-not-allowed disabled:opacity-70 md:hidden"
          >
            <Save size={20} />
            {saving
              ? 'Guardando...'
              : isEditMode
                ? 'Guardar cambios'
                : 'Guardar producto'}
          </button>
        </aside>
      </form>
    </div>
  )
}

type CheckOptionProps = {
  name: string
  label: string
  checked: boolean
  onChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void
}

function CheckOption({ name, label, checked, onChange }: CheckOptionProps) {
  return (
    <label className="flex items-center gap-3 rounded-2xl bg-[#F3F1ED] p-4 font-semibold text-[#102635]">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-[#102635]"
      />
      {label}
    </label>
  )
}