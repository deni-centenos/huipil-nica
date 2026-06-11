import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminProductos } from '../../services/adminProductService'
import { getCategorias } from '../../services/catalogService'
import type { Category, Product } from '../../types'
import { formatCurrency } from '../../utils/format'

export function AdminProductsPage() {
  const [productos, setProductos] = useState<Product[]>([])
  const [categorias, setCategorias] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setErrorMessage('')

        const [productosData, categoriasData] = await Promise.all([
          getAdminProductos(),
          getCategorias(),
        ])

        setProductos(productosData)
        setCategorias(categoriasData)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los productos',
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <p className="font-semibold text-[#102635]">Cargando productos...</p>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#102635]">
          Error al cargar productos
        </h1>
        <p className="mt-2 text-red-600">{errorMessage}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#102635] md:text-4xl">
              Productos
            </h1>

            <p className="mt-2 max-w-2xl text-gray-600">
              Aquí el dueño puede agregar, editar, activar o desactivar productos
              del catálogo.
            </p>
          </div>

          <Link
            to="/admin/productos/nuevo"
            className="inline-flex items-center justify-center rounded-2xl bg-[#102635] px-5 py-3 font-bold text-white transition hover:bg-[#163447]"
          >
            Nuevo producto
          </Link>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {productos.map((producto) => {
          const categoria = categorias.find((c) => c.id === producto.categoriaId)

          return (
            <article
              key={producto.id}
              className="rounded-3xl bg-white p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <img
                  src={producto.imagenPrincipal}
                  alt={producto.nombre}
                  className="h-24 w-24 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-[#102635]">
                    {producto.nombre}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    {categoria?.nombre ?? 'Sin categoría'}
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      producto.activo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {producto.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-[#F3F1ED] p-3">
                  <p className="text-gray-500">Venta</p>
                  <p className="font-bold text-[#102635]">
                    {producto.permiteVenta
                      ? formatCurrency(producto.precioVenta)
                      : 'No aplica'}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F3F1ED] p-3">
                  <p className="text-gray-500">Renta</p>
                  <p className="font-bold text-[#102635]">
                    {producto.permiteRenta
                      ? formatCurrency(producto.precioRenta)
                      : 'No aplica'}
                  </p>
                </div>
              </div>

              <Link
                to={`/admin/productos/editar/${producto.id}`}
                className="mt-4 block rounded-2xl bg-[#102635] px-4 py-3 text-center font-bold text-white"
              >
                Editar producto
              </Link>
            </article>
          )
        })}
      </div>

      <div className="hidden overflow-hidden rounded-3xl bg-white shadow-sm md:block">
        <table className="w-full border-collapse">
          <thead className="bg-[#102635] text-white">
            <tr>
              <th className="px-5 py-4 text-left">Imagen</th>
              <th className="px-5 py-4 text-left">Producto</th>
              <th className="px-5 py-4 text-left">Categoría</th>
              <th className="px-5 py-4 text-left">Venta</th>
              <th className="px-5 py-4 text-left">Renta</th>
              <th className="px-5 py-4 text-left">Estado</th>
              <th className="px-5 py-4 text-left">Acción</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => {
              const categoria = categorias.find(
                (c) => c.id === producto.categoriaId,
              )

              return (
                <tr key={producto.id} className="border-b border-gray-100">
                  <td className="px-5 py-4">
                    <img
                      src={producto.imagenPrincipal}
                      alt={producto.nombre}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  </td>

                  <td className="px-5 py-4 font-bold text-[#102635]">
                    {producto.nombre}
                  </td>

                  <td className="px-5 py-4">
                    {categoria?.nombre ?? 'Sin categoría'}
                  </td>

                  <td className="px-5 py-4">
                    {producto.permiteVenta
                      ? formatCurrency(producto.precioVenta)
                      : 'No aplica'}
                  </td>

                  <td className="px-5 py-4">
                    {producto.permiteRenta
                      ? formatCurrency(producto.precioRenta)
                      : 'No aplica'}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        producto.activo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      to={`/admin/productos/editar/${producto.id}`}
                      className="font-bold text-[#102635] hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}