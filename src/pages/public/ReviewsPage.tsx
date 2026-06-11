const reviews = [
  {
    id: 1,
    nombre: 'María López',
    comentario:
      'Excelente atención, trajes bonitos y muy buena presentación para actividades culturales.',
  },
  {
    id: 2,
    nombre: 'Carlos Pérez',
    comentario:
      'El traje estaba limpio, completo y listo para la presentación. Muy recomendado.',
  },
  {
    id: 3,
    nombre: 'Ana García',
    comentario:
      'Buena variedad de trajes para renta y venta. La atención fue rápida por WhatsApp.',
  },
]

export function ReviewsPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#102635]">
          Reseñas
        </p>

        <h1 className="mt-3 text-4xl font-bold text-[#102635] md:text-5xl">
          Opiniones de clientes
        </h1>

        <p className="mt-4 max-w-3xl text-gray-600">
          Esta sección quedará preparada para mostrar opiniones reales de
          clientes sobre la atención, calidad de los trajes y experiencia de
          alquiler o compra.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="text-xl text-yellow-500">★★★★★</p>

            <h2 className="mt-4 text-xl font-bold text-[#102635]">
              {review.nombre}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {review.comentario}
            </p>

            <span className="mt-5 inline-block rounded-full bg-[#F3F1ED] px-3 py-1 text-xs font-bold text-[#102635]">
              Ejemplo visual
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}