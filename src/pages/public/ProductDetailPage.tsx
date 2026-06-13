import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Star } from 'lucide-react'
import {
  getCategorias,
  getConfiguracionNegocio,
  getProductoBySlug,
} from '../../services/catalogService'
import { getPublicReviews } from '../../services/reviewService'
import type { BusinessConfig, Category, Product, Review } from '../../types'
import { createWhatsAppUrl, formatCurrency } from '../../utils/format'

export function ProductDetailPage() {
  const { slug } = useParams()

  const [producto, setProducto] = useState<Product | null>(null)
  const [categorias, setCategorias] = useState<Category[]>([])
  const [configuracion, setConfiguracion] = useState<BusinessConfig | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!slug) return

      try {
        setLoading(true)
        setErrorMessage('')

        const [
          productoData,
          categoriasData,
          configuracionData,
          reviewsData,
        ] = await Promise.all([
          getProductoBySlug(slug),
          getCategorias(),
          getConfiguracionNegocio(),
          getPublicReviews(),
        ])

        setProducto(productoData)
        setCategorias(categoriasData)
        setConfiguracion(configuracionData)
        setReviews(reviewsData)
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
  const reviewsToShow = reviews.slice(0, 3)

  const comprarUrl = createWhatsAppUrl(
    whatsapp,
    `Hola, estoy interesado en comprar el producto: ${producto.nombre}. ¿Está disponible?`,
  )

  const alquilarUrl = createWhatsAppUrl(
    whatsapp,
    `Hola, estoy interesado en alquilar el producto: ${producto.nombre}. ¿Está disponible para renta?`,
  )

  function renderStars(value: number) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={
              star <= value
                ? 'fill-yellow-400 text-yellow-500'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
    )
  }

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
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold text-[#102635]">Reseñas</h2>
            <p className="mt-2 text-sm text-gray-600">
              Opiniones reales aprobadas por el administrador.
            </p>
          </div>

          <Link
            to="/resenas"
            className="font-bold text-[#102635] hover:underline"
          >
            Ver o agregar reseña
          </Link>
        </div>

        {reviewsToShow.length === 0 ? (
          <div className="bg-white p-6 text-center shadow-sm">
            <p className="font-bold text-[#102635]">
              Todavía no hay reseñas aprobadas.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Cuando el administrador apruebe reseñas de clientes, aparecerán
              aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {reviewsToShow.map((review) => (
              <article key={review.id} className="bg-white p-6 shadow-sm">
                {renderStars(review.puntuacion)}

                <p className="mt-2 font-bold text-[#102635]">
                  {review.nombre} {review.apellido}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('es-NI')}
                </p>

                <p className="mt-3 text-sm text-gray-700">
                  {review.descripcion}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}