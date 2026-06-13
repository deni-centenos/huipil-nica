import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ShoppingBag, Sparkles } from 'lucide-react'
import type { BusinessConfig, Category, Product } from '../../types'
import {
  getCategorias,
  getConfiguracionNegocio,
  getProductos,
} from '../../services/catalogService'
import { ProductCard } from '../../components/public/ProductCard'

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [config, setConfig] = useState<BusinessConfig | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const [categoriasData, productosData, configData] = await Promise.all([
          getCategorias(),
          getProductos(),
          getConfiguracionNegocio(),
        ])

        if (mounted) {
          setCategories(categoriasData)
          setProducts(productosData)
          setConfig(configData)
        }
      } catch {
        if (mounted) {
          setCategories([])
          setProducts([])
          setConfig(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      mounted = false
    }
  }, [])

  const portadaUrl = config?.portadaUrl || '/img/fondo-catalogo.png'

  const textoPortada =
    config?.textoPortada ||
    'Explora nuestra colección: historia, tradición y orgullo nicaragüense en cada detalle.'

  const historia =
    config?.historia ||
    'Somos un catálogo artesanal dedicado a promover la belleza de los trajes típicos, máscaras y accesorios tradicionales nicaragüenses. Nuestro propósito es acercar la cultura, la tradición y la identidad nacional a cada cliente mediante piezas llenas de historia y color.'

  const descripcionInicio =
    config?.descripcionInicio ||
    'Catálogo artesanal de trajes típicos, máscaras y accesorios para venta y alquiler.'

  const categoriasInicio = categories.slice(0, 3)
  const productosDestacados = products
    .filter((product) => product.destacado)
    .slice(0, 4)

  const productosAMostrar =
    productosDestacados.length > 0 ? productosDestacados : products.slice(0, 4)

  return (
    <div>
      {/* PORTADA */}
      <section className="relative min-h-115 overflow-hidden md:min-h-130">
        <img
          src={portadaUrl}
          alt="Portada Huipil Nica"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative mx-auto flex min-h-115 max-w-7xl items-center px-5 pt-28 md:min-h-130">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
              “{textoPortada}”
            </h1>
          </div>
        </div>
      </section>

      {/* BOTONES DE CATEGORÍAS */}
      {categoriasInicio.length > 0 && (
        <section className="bg-[#F3F1ED] px-5 py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-5">
            {categoriasInicio.map((category) => (
              <Link
                key={category.id}
                to={`/catalogo?categoria=${category.slug}`}
                className="min-w-36 rounded-full bg-[#102635] px-8 py-3 text-center font-bold text-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                {category.nombre}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* INTRODUCCIÓN / QUIÉNES SOMOS */}
      <section className="bg-[#F3F1ED] px-5 py-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-4xl bg-white shadow-lg md:grid-cols-[0.95fr_1.3fr]">
            <div className="relative flex min-h-75 flex-col justify-between bg-[#102635] p-8 text-white md:p-10">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-white/10" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-white/10" />

              <div className="relative">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#102635] shadow-md">
                  <BookOpen size={28} />
                </div>

                <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-[#B8CAD7]">
                  Nuestra esencia
                </p>

                <h2 className="text-4xl font-black leading-tight md:text-5xl">
                  Quiénes Somos
                </h2>

                <p className="mt-5 max-w-md text-base leading-8 text-[#E7EDF2]">
                  {descripcionInicio}
                </p>
              </div>

              <div className="relative mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-[#E7EDF2]">
                  Tradición
                </span>

                <span className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-[#E7EDF2]">
                  Cultura
                </span>

                <span className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-[#E7EDF2]">
                  Identidad
                </span>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#E8EEF2] px-4 py-2 text-sm font-bold text-[#102635]">
                <Sparkles size={17} />
                Historia, tradición y orgullo nicaragüense
              </div>

              <p className="text-lg leading-9 text-gray-700">{historia}</p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/sobre-nosotros"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#102635] px-6 py-3 font-bold text-white transition hover:scale-[1.01]"
                >
                  Conocer más
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/catalogo"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#102635] px-6 py-3 font-bold text-[#102635] transition hover:bg-[#102635] hover:text-white"
                >
                  Ver catálogo
                  <ShoppingBag size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="bg-[#F3F1ED] px-5 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.4em] text-[#102635]">
                Categorías
              </p>

              <h2 className="text-3xl font-black text-[#102635] md:text-4xl">
                Explora el catálogo
              </h2>
            </div>

            <Link
              to="/catalogo"
              className="font-bold text-[#102635] hover:underline"
            >
              Ver todo
            </Link>
          </div>

          {loading ? (
            <div className="rounded-4xl bg-white p-8 text-center shadow">
              Cargando categorías...
            </div>
          ) : categories.length === 0 ? (
            <div className="rounded-4xl bg-white p-8 text-center shadow">
              No hay categorías activas todavía.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/catalogo?categoria=${category.slug}`}
                  className="group rounded-4xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#102635] text-white transition group-hover:scale-110">
                    <ShoppingBag size={26} />
                  </div>

                  <h3 className="text-xl font-black text-[#102635]">
                    {category.nombre}
                  </h3>

                  {category.descripcion && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {category.descripcion}
                    </p>
                  )}

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#102635]">
                    Ver productos
                    <ArrowRight size={16} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="bg-[#F3F1ED] px-5 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.4em] text-[#102635]">
                Selección
              </p>

              <h2 className="text-3xl font-black text-[#102635] md:text-4xl">
                Productos destacados
              </h2>
            </div>

            <Link
              to="/catalogo"
              className="font-bold text-[#102635] hover:underline"
            >
              Ver catálogo
            </Link>
          </div>

          {loading ? (
            <div className="rounded-4xl bg-white p-8 text-center shadow">
              Cargando productos...
            </div>
          ) : productosAMostrar.length === 0 ? (
            <div className="rounded-4xl bg-white p-8 text-center shadow">
              Todavía no hay productos activos.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {productosAMostrar.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categories={categories}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}