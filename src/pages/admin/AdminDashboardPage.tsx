import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminProductos } from '../../services/adminProductService'
import { getAdminCategorias, type AdminCategory } from '../../services/adminCategoryService'
import type { Product } from '../../types'
import { formatCurrency } from '../../utils/format'

export function AdminDashboardPage() {
  const [productos, setProductos] = useState<Product[]>([])
  const [categorias, setCategorias] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setErrorMessage('')

        const [productosData, categoriasData] = await Promise.all([
          getAdminProductos(),
          getAdminCategorias(),
        ])

        setProductos(productosData)
        setCategorias(categoriasData)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el dashboard',
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const resumen = useMemo(() => {
    const totalProductos = productos.length
    const productosActivos = productos.filter((p) => p.activo).length
    const productosInactivos = productos.filter((p) => !p.activo).length
    const destacados = productos.filter((p) => p.destacado).length
    const categoriasActivas = categorias.filter((c) => c.activa).length
    const categoriasInactivas = categorias.filter((c) => !c.activa).length
    const venta = productos.filter((p) => p.permiteVenta).length
    const renta = productos.filter((p) => p.permiteRenta).length

    return {
      totalProductos,
      productosActivos,
      productosInactivos,
      destacados,
      categoriasActivas,
      categoriasInactivas,
      venta,
      renta,
    }
  }, [productos, categorias])

  const productosRecientes = productos.slice(0, 5)

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <p className="font-semibold text-[#102635]">Cargando dashboard...</p>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#102635]">
          No se pudo cargar el dashboard
        </h1>
        <p className="mt-2 text-red-600">{errorMessage}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm md:p-6">
        <h1 className="text-3xl font-bold text-[#102635] md:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 max-w-3xl text-gray-600">
          Resumen general del catálogo, productos activos, categorías y accesos
          rápidos para administrar la página.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Productos"
          value={resumen.totalProductos}
          description={`${resumen.productosActivos} activos · ${resumen.productosInactivos} inactivos`}
        />

        <DashboardCard
          title="Categorías activas"
          value={resumen.categoriasActivas}
          description={`${resumen.categoriasInactivas} inactivas`}
        />

        <DashboardCard
          title="Destacados"
          value={resumen.destacados}
          description="Productos visibles en inicio"
        />

        <DashboardCard
          title="Renta / Venta"
          value={`${resumen.renta}/${resumen.venta}`}
          description="Productos con renta y venta"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#102635]">
                Productos recientes
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Últimos productos registrados en el catálogo.
              </p>
            </div>

            <Link
              to="/admin/productos"
              className="rounded-2xl bg-[#102635] px-5 py-3 text-center font-bold text-white transition hover:bg-[#163447]"
            >
              Ver productos
            </Link>
          </div>

          {productosRecientes.length === 0 ? (
            <div className="rounded-3xl bg-[#F3F1ED] p-6 text-center">
              <h3 className="text-xl font-bold text-[#102635]">
                No hay productos
              </h3>
              <p className="mt-2 text-gray-600">
                Agrega el primer producto desde el panel.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {productosRecientes.map((producto) => {
                const categoria = categorias.find(
                  (c) => c.id === producto.categoriaId,
                )

                return (
                  <article
                    key={producto.id}
                    className="flex flex-col gap-4 rounded-3xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex gap-4">
                      <img
                        src={producto.imagenPrincipal}
                        alt={producto.nombre}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />

                      <div>
                        <h3 className="font-bold text-[#102635]">
                          {producto.nombre}
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                          {categoria?.nombre ?? 'Sin categoría'}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {producto.activo ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                              Activo
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                              Inactivo
                            </span>
                          )}

                          {producto.destacado && (
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                              Destacado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm md:text-right">
                      {producto.permiteVenta && (
                        <p className="font-bold text-[#102635]">
                          Venta {formatCurrency(producto.precioVenta)}
                        </p>
                      )}

                      {producto.permiteRenta && (
                        <p className="font-bold text-[#102635]">
                          Renta {formatCurrency(producto.precioRenta)}
                        </p>
                      )}

                      <Link
                        to={`/admin/productos/editar/${producto.id}`}
                        className="mt-2 inline-block font-bold text-[#102635] hover:underline"
                      >
                        Editar
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-2xl font-bold text-[#102635]">
              Accesos rápidos
            </h2>

            <div className="mt-5 space-y-3">
              <QuickLink
                to="/admin/productos/nuevo"
                title="Agregar producto"
                description="Crear un nuevo traje o accesorio"
              />

              <QuickLink
                to="/admin/productos"
                title="Administrar productos"
                description="Editar precios, imágenes y estados"
              />

              <QuickLink
                to="/admin/categorias"
                title="Administrar categorías"
                description="Damas, Caballeros, Niños y más"
              />

              <QuickLink
                to="/admin/configuracion"
                title="Configurar negocio"
                description="Logo, portada, WhatsApp y textos"
              />
            </div>
          </section>

          <section className="rounded-3xl bg-[#102635] p-5 text-white shadow-sm md:p-6">
            <h2 className="text-2xl font-bold">Estado del sitio</h2>

            <p className="mt-3 text-sm text-[#DCE3E8]">
              El catálogo público toma los datos directamente desde Supabase.
              Los cambios que hagas en productos, categorías y configuración se
              reflejan en la página.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}

type DashboardCardProps = {
  title: string
  value: number | string
  description: string
}

function DashboardCard({ title, value, description }: DashboardCardProps) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-semibold text-gray-500">{title}</p>

      <h2 className="mt-3 text-4xl font-bold text-[#102635]">{value}</h2>

      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </article>
  )
}

type QuickLinkProps = {
  to: string
  title: string
  description: string
}

function QuickLink({ to, title, description }: QuickLinkProps) {
  return (
    <Link
      to={to}
      className="block rounded-2xl bg-[#F3F1ED] p-4 transition hover:bg-[#E3E8EC]"
    >
      <p className="font-bold text-[#102635]">{title}</p>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </Link>
  )
}