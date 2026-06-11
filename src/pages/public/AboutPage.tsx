import { useEffect, useState } from 'react'
import { getConfiguracionNegocio } from '../../services/catalogService'
import type { BusinessConfig } from '../../types'

export function AboutPage() {
  const [config, setConfig] = useState<BusinessConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true)
        setErrorMessage('')

        const data = await getConfiguracionNegocio()
        setConfig(data)
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la información del negocio',
        )
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="font-semibold text-[#102635]">
          Cargando información...
        </p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#102635]">
            No se pudo cargar la página
          </h1>
          <p className="mt-2 text-red-600">{errorMessage}</p>
        </div>
      </section>
    )
  }

  const nombreNegocio = config?.nombreNegocio || 'Huipil Nica'

  const historia =
    config?.historia ||
    'Somos un emprendimiento dedicado a resaltar la cultura nicaragüense mediante la venta y alquiler de trajes típicos, huipiles, máscaras y accesorios tradicionales.'

  const mision =
    config?.mision ||
    'Promover la identidad cultural nicaragüense ofreciendo trajes y accesorios tradicionales de calidad.'

  const vision =
    config?.vision ||
    'Ser una referencia local en trajes típicos, alquiler y productos culturales para eventos, colegios y presentaciones.'

  const descripcion =
    config?.descripcionInicio ||
    'Catálogo artesanal de trajes típicos, huipiles, máscaras y accesorios para venta y alquiler.'

  const imagenPortada = config?.portadaUrl || '/img/fondo-catalogo.png'

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="relative min-h-[280px] overflow-hidden">
          <img
            src={imagenPortada}
            alt={nombreNegocio}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="relative mx-auto flex min-h-[280px] max-w-7xl items-center px-5 py-16">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white">
                Sobre nosotros
              </p>

              <h1 className="mt-3 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                {nombreNegocio}
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-white/90">
                {descripcion}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex justify-center">
              {config?.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt={nombreNegocio}
                  className="h-32 w-32 rounded-full border-4 border-[#9FB3C3] object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#9FB3C3] bg-[#F3F1ED] text-sm font-bold text-[#102635]">
                  LOGO
                </div>
              )}
            </div>

            <h2 className="mt-6 text-center text-3xl font-bold text-[#102635]">
              {nombreNegocio}
            </h2>

            <p className="mt-4 text-center text-gray-600">{descripcion}</p>

            <div className="mt-8 space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-bold text-[#102635]">Teléfono:</span>{' '}
                {config?.telefono || 'Pendiente'}
              </p>

              <p>
                <span className="font-bold text-[#102635]">WhatsApp:</span>{' '}
                {config?.whatsapp || 'Pendiente'}
              </p>

              <p>
                <span className="font-bold text-[#102635]">Dirección:</span>{' '}
                {config?.direccion || 'Pendiente'}
              </p>

              <p>
                <span className="font-bold text-[#102635]">Horario:</span>{' '}
                {config?.horario || 'Pendiente'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <article className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#102635]">
                Nuestra historia
              </h2>

              <p className="mt-4 leading-relaxed text-gray-700">{historia}</p>
            </article>

            <div className="grid gap-6 md:grid-cols-2">
              <article className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#102635]">Misión</h2>

                <p className="mt-4 leading-relaxed text-gray-700">{mision}</p>
              </article>

              <article className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#102635]">Visión</h2>

                <p className="mt-4 leading-relaxed text-gray-700">{vision}</p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}