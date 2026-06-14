import { useEffect, useState } from 'react'
import { FileText, PlayCircle } from 'lucide-react'
import type { BlogContent, BusinessConfig } from '../../types'
import { getPublicBlogContents } from '../../services/blogService'
import { getConfiguracionNegocio } from '../../services/catalogService'

export function BlogPage() {
  const [items, setItems] = useState<BlogContent[]>([])
  const [config, setConfig] = useState<BusinessConfig | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const [blogData, configData] = await Promise.all([
          getPublicBlogContents(),
          getConfiguracionNegocio(),
        ])

        if (mounted) {
          setItems(blogData)
          setConfig(configData)
        }
      } catch {
        if (mounted) {
          setError('No se pudo cargar el blog y videos.')
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

  const blogs = items.filter((item) => item.tipo === 'BLOG')
  const videos = items.filter((item) => item.tipo === 'VIDEO')

  const imagenPortada =
    config?.blogPortadaUrl || config?.portadaUrl || '/img/fondo-catalogo.png'

  return (
    <div>
      {/* PORTADA BLOG Y VIDEOS */}
<section className="relative min-h-115 overflow-hidden md:min-h-130">
  <img
    src={imagenPortada}
    alt="Portada blog y videos"
    className="absolute inset-0 h-full w-full object-cover"
  />

  <div className="absolute inset-0 bg-black/25" />
</section>

{/* INTRODUCCIÓN BLOG Y VIDEOS */}
<section className="bg-[#F3F1ED] px-5 pb-12 md:pb-16">
  <div className="mx-auto max-w-7xl">
    <div className="max-w-4xl">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.4em] text-[#102635]">
        Blog y videos
      </p>

      <h1 className="text-4xl font-black leading-tight text-[#102635] md:text-6xl">
        Cultura, tradición y detalles de nuestros trajes
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
        Explora las historias, el orgullo y la magia detrás de cada una de
        nuestras piezas. Aquí encontrarás videos de nuestras colecciones, el
        origen de sus tejidos y todo el valor cultural que guardan nuestros
        trajes típicos. ¡Lleva nuestra tradición contigo!
      </p>
    </div>
  </div>
</section>

      {/* CONTENIDO BLOG Y VIDEOS */}
      <section className="bg-[#F3F1ED] px-5 pb-12 md:pb-16">
        <div className="mx-auto max-w-7xl">
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
                <h2 className="text-2xl font-black text-[#102635]">
                  Artículos
                </h2>
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
    </div>
  )
}