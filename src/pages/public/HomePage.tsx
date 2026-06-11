import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../../components/public/ProductCard'
import {
  getCategorias,
  getConfiguracionNegocio,
  getProductos,
} from '../../services/catalogService'
import type { BusinessConfig, Category, Product } from '../../types'

export function HomePage() {
  const [categorias, setCategorias] = useState<Category[]>([])
  const [productos, setProductos] = useState<Product[]>([])
  const [config, setConfig] = useState<BusinessConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriasData, productosData, configData] = await Promise.all([
          getCategorias(),
          getProductos(),
          getConfiguracionNegocio(),
        ])

        setCategorias(categoriasData)
        setProductos(productosData)
        setConfig(configData)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const destacados = productos.filter((p) => p.destacado && p.activo)
  const portada = config?.portadaUrl || '/img/fondo-catalogo.png'

  const textoPortada =
    config?.textoPortada ||
    'Explora nuestra colección: historia, tradición y orgullo nicaragüense en cada detalle.'

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="font-semibold text-[#102635]">Cargando inicio...</p>
      </section>
    )
  }

  return (
    <div>
      <section className="overflow-hidden">
        <div className="relative min-h-[330px] overflow-hidden">
          <img
            src={portada}
            alt="Portada Huipil Nica"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/25" />

          <div className="relative mx-auto flex min-h-[330px] max-w-7xl items-center px-5 pb-16 pt-28">
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white drop-shadow-lg md:text-5xl">
              “{textoPortada}”
            </h1>
          </div>
        </div>

        <div className="bg-[#F3F1ED] px-5 py-6">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-5 md:gap-20">
            {categorias.slice(0, 3).map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.slug}`}
                className="rounded-full bg-[#102635] px-9 py-2 font-semibold text-white shadow transition hover:bg-[#163447]"
              >
                {cat.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#102635]">
              Categorías
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#102635]">
              Explora el catálogo
            </h2>
          </div>

          <Link to="/catalogo" className="font-semibold text-[#102635]">
            Ver todo
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogo?categoria=${cat.slug}`}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-xl font-bold text-[#102635]">
                {cat.nombre}
              </h3>

              <p className="mt-2 text-sm text-gray-600">{cat.descripcion}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#102635]">
            Destacados
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#102635]">
            Productos populares
          </h2>
        </div>

        {destacados.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold text-[#102635]">
              No hay productos destacados
            </h3>
            <p className="mt-2 text-gray-600">
              Marca productos como destacados desde el panel del dueño.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categorias}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}