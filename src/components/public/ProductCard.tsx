import { Link } from 'react-router-dom'
import type { Category, Product } from '../../types'
import { formatCurrency } from '../../utils/format'

type Props = {
  product: Product
  categories: Category[]
}

export function ProductCard({ product, categories }: Props) {
  const categoria = categories.find((c) => c.id === product.categoriaId)

  return (
    <article className="group overflow-hidden bg-[#F3F1ED] transition">
      <Link to={`/producto/${product.slug}`}>
        <div className="aspect-4/5 overflow-hidden bg-white">
          <img
            src={product.imagenPrincipal}
            alt={product.nombre}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="pt-3">
        <p className="text-xs font-semibold text-gray-600">
          {categoria?.nombre ?? 'Sin categoría'} / Renta-Venta
        </p>

        <h3 className="mt-1 text-lg font-bold text-[#102635]">
          {product.nombre}
        </h3>

        <div className="mt-2 space-y-1 text-base font-bold text-[#111827]">
          {product.permiteVenta && (
            <p>Venta {formatCurrency(product.precioVenta)}</p>
          )}

          {product.permiteRenta && (
            <p>Renta {formatCurrency(product.precioRenta)}</p>
          )}
        </div>

        <Link
          to={`/producto/${product.slug}`}
          className="mt-4 inline-block rounded-full bg-[#102635] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#163447]"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  )
}