import { useEffect, useState } from 'react'
import { FileText, PlayCircle } from 'lucide-react'
import type { BlogContent } from '../../types'
import { getPublicBlogContents } from '../../services/blogService'

export function BlogPage() {
  const [items, setItems] = useState<BlogContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPublicBlogContents()
        setItems(data)
      } catch {
        setError('No se pudo cargar el blog y videos.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const blogs = items.filter((item) => item.tipo === 'BLOG')
  const videos = items.filter((item) => item.tipo === 'VIDEO')

  return (
    <section className="px-5 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.4em] text-[#102635]">
            Blog y videos
          </p>

          <h1 className="text-4xl font-black text-[#102635] md:text-5xl">
            Cultura, tradición y detalles de nuestros trajes
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Conoce más sobre la historia, el cuidado y la belleza de los trajes
            típicos nicaragüenses.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            Cargando contenido...
          </div>
        )}

        {error && (
          <div className="rounded-3xl bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            Todavía no hay contenido publicado.
          </div>
        )}

        {videos.length > 0 && (
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <PlayCircle className="text-[#102635]" size={28} />
              <h2 className="text-2xl font-black text-[#102635]">Videos</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-4xl bg-white shadow-md"
                >
                  <div className="bg-black">
                    <video
                      src={item.videoUrl}
                      controls
                      preload="metadata"
                      poster={item.imagenUrl || undefined}
                      className="aspect-video w-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black text-[#102635]">
                      {item.titulo}
                    </h3>

                    {item.resumen && (
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {item.resumen}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {blogs.length > 0 && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <FileText className="text-[#102635]" size={28} />
              <h2 className="text-2xl font-black text-[#102635]">Artículos</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-4xl bg-white shadow-md"
                >
                  {item.imagenUrl ? (
                    <img
                      src={item.imagenUrl}
                      alt={item.titulo}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-[#D9D9D9] text-[#102635]">
                      <FileText size={48} />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-black text-[#102635]">
                      {item.titulo}
                    </h3>

                    {item.resumen && (
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {item.resumen}
                      </p>
                    )}

                    {item.contenido && (
                      <p className="mt-4 text-sm leading-7 text-gray-700">
                        {item.contenido}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}