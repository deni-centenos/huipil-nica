import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import {
  getCategorias,
  getConfiguracionNegocio,
  getProductoBySlug,
} from '../../services/catalogService'
import type { BusinessConfig, Category, Product } from '../../types'
import { createWhatsAppUrl, formatCurrency } from '../../utils/format'

export function ProductDetailPage() {
  const { slug } = useParams()

  const [producto, setProducto] = useState<Product | null>(null)
  const [categorias, setCategorias] = useState<Category[]>([])
  const [configuracion, setConfiguracion] = useState<BusinessConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!slug) return

      try {
        setLoading(true)
        setErrorMessage('')

        const [productoData, categoriasData, configuracionData] =
          await Promise.all([
            getProductoBySlug(slug),
            getCategorias(),
            getConfiguracionNegocio(),
          ])

        setProducto(productoData)
        setCategorias(categoriasData)
        setConfiguracion(configuracionData)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el producto',
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [slug])

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-lg font-semibold text-[#102635]">
          Cargando producto...
        </p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#102635]">
            No se pudo cargar el producto
          </h1>
          <p className="mt-2 text-red-600">{errorMessage}</p>
        </div>
      </section>
    )
  }

  if (!producto) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#102635]">
          Producto no encontrado
        </h1>

        <Link
          to="/catalogo"
          className="mt-6 inline-block rounded-full bg-[#102635] px-6 py-3 font-semibold text-white"
        >
          Volver al catálogo
        </Link>
      </section>
    )
  }

  const categoria = categorias.find((c) => c.id === producto.categoriaId)
  const whatsapp = configuracion?.whatsapp || '50588888888'

  const comprarUrl = createWhatsAppUrl(
    whatsapp,
    `Hola, estoy interesado en comprar el producto: ${producto.nombre}. ¿Está disponible?`,
  )

  const alquilarUrl = createWhatsAppUrl(
    whatsapp,
    `Hola, estoy interesado en alquilar el producto: ${producto.nombre}. ¿Está disponible para renta?`,
  )

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-10">
      <Link
        to="/catalogo"
        className="mb-8 inline-flex items-center gap-2 font-semibold text-[#102635]"
      >
        <ArrowLeft size={18} />
        Volver al catálogo
      </Link>

      <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="overflow-hidden bg-white shadow-sm">
          <img
            src={producto.imagenPrincipal}
            alt={producto.nombre}
            className="aspect-4/5 w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold text-gray-600">
            {categoria?.nombre ?? 'Sin categoría'} / Renta-Venta
          </p>

          <h1 className="text-4xl font-bold text-[#102635] md:text-5xl">
            {producto.nombre}
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-700">
            {producto.descripcionLarga}
          </p>

          <div className="mt-8 space-y-3 text-3xl font-bold text-[#111827]">
            {producto.permiteVenta && (
              <p>Venta {formatCurrency(producto.precioVenta)}</p>
            )}

            {producto.permiteRenta && (
              <p>Renta {formatCurrency(producto.precioRenta)}</p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {producto.permiteVenta && (
              <a
                href={comprarUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-black px-7 py-3 text-lg font-bold text-white transition hover:bg-[#102635]"
              >
                <MessageCircle size={20} />
                comprar
              </a>
            )}

            {producto.permiteRenta && (
              <a
                href={alquilarUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-[#102635] px-7 py-3 text-lg font-bold text-[#102635] transition hover:bg-[#102635] hover:text-white"
              >
                <MessageCircle size={20} />
                alquilar
              </a>
            )}
          </div>

          <div className="mt-10 border-l-4 border-[#102635] bg-[#F3F1ED] p-5">
            <h3 className="font-bold text-[#102635]">Nota</h3>
            <p className="mt-2 text-sm text-gray-700">
              Los precios y disponibilidad pueden variar. Consulta por WhatsApp
              para confirmar antes de comprar o alquilar.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-3xl font-bold text-[#102635]">Reseñas</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <article key={item} className="bg-white p-6 shadow-sm">
              <p className="text-yellow-500">★★★★☆</p>
              <p className="mt-2 font-bold text-[#102635]">Luis Pérez</p>
              <p className="mt-3 text-sm text-gray-700">
                Servicio confiable y puntual. El traje estaba limpio, bien
                confeccionado y listo cuando lo necesitaba.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}