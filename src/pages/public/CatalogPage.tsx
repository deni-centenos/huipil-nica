import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../../components/public/ProductCard'
import { getCategorias, getProductos } from '../../services/catalogService'
import type { Category, Product } from '../../types'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaSlug = searchParams.get('categoria') ?? 'todos'

  const [categorias, setCategorias] = useState<Category[]>([])
  const [productos, setProductos] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setErrorMessage('')

        const [categoriasData, productosData] = await Promise.all([
          getCategorias(),
          getProductos(),
        ])

        setCategorias(categoriasData)
        setProductos(productosData)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el catálogo',
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const productosFiltrados = useMemo(() => {
    if (categoriaSlug === 'todos') {
      return productos
    }

    const categoria = categorias.find((c) => c.slug === categoriaSlug)

    if (!categoria) {
      return productos
    }

    return productos.filter((p) => p.categoriaId === categoria.id)
  }, [categoriaSlug, categorias, productos])

  function cambiarCategoria(slug: string) {
    if (slug === 'todos') {
      setSearchParams({})
    } else {
      setSearchParams({ categoria: slug })
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-lg font-semibold text-[#102635]">
          Cargando catálogo...
        </p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#102635]">
            No se pudo cargar el catálogo
          </h1>
          <p className="mt-2 text-red-600">{errorMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#102635]">Catálogo</h1>

        <p className="mt-3 max-w-2xl text-gray-700">
          Explora nuestra colección de trajes típicos, accesorios y piezas
          tradicionales disponibles para venta o alquiler.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-5">
        <button
          onClick={() => cambiarCategoria('todos')}
          className={`rounded-full px-8 py-2 font-semibold transition ${
            categoriaSlug === 'todos'
              ? 'bg-[#102635] text-white'
              : 'bg-[#D9D9D9] text-[#102635] hover:bg-[#102635] hover:text-white'
          }`}
        >
          Todos
        </button>

        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => cambiarCategoria(cat.slug)}
            className={`rounded-full px-8 py-2 font-semibold transition ${
              categoriaSlug === cat.slug
                ? 'bg-[#102635] text-white'
                : 'bg-[#D9D9D9] text-[#102635] hover:bg-[#102635] hover:text-white'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-[#102635]">
            No hay productos disponibles
          </h2>
          <p className="mt-2 text-gray-600">
            Pronto agregaremos productos a esta categoría.
          </p>
        </div>
      ) : (
        <div className="grid gap-x-16 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categories={categorias}
            />
          ))}
        </div>
      )}
    </section>
  )
}