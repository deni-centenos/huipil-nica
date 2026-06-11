const posts = [
  {
    id: 1,
    titulo: 'Historia del traje tradicional nicaragüense',
    descripcion:
      'Conoce el significado cultural de los trajes típicos usados en bailes, actos escolares y eventos folclóricos.',
    tipo: 'Artículo',
  },
  {
    id: 2,
    titulo: 'Videos de bailes folclóricos',
    descripcion:
      'Espacio preparado para mostrar videos de presentaciones, danzas tradicionales y eventos culturales.',
    tipo: 'Video',
  },
  {
    id: 3,
    titulo: 'Cómo cuidar un traje típico',
    descripcion:
      'Consejos para conservar mejor las prendas, colores, bordados y accesorios tradicionales.',
    tipo: 'Artículo',
  },
]

export function BlogPage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#102635]">
            Blog y videos
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#102635] md:text-5xl">
            Cultura, tradición e historias
          </h1>

          <p className="mt-4 max-w-3xl text-gray-600">
            Esta sección quedará preparada para publicar historias culturales,
            videos de bailes, información de trajes tradicionales y contenido
            relacionado con la identidad nicaragüense.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex aspect-video items-center justify-center bg-[#102635] text-white">
                <p className="text-lg font-bold">{post.tipo}</p>
              </div>

              <div className="p-6">
                <span className="rounded-full bg-[#F3F1ED] px-3 py-1 text-xs font-bold text-[#102635]">
                  Próximamente
                </span>

                <h2 className="mt-4 text-xl font-bold text-[#102635]">
                  {post.titulo}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {post.descripcion}
                </p>

                <button
                  type="button"
                  disabled
                  className="mt-5 rounded-full bg-gray-200 px-5 py-2 text-sm font-bold text-gray-500"
                >
                  Disponible pronto
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}