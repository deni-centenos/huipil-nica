import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { getConfiguracionNegocio } from '../../services/catalogService'
import type { BusinessConfig } from '../../types'
import { FloatingWhatsAppButton } from './FloatingWhatsAppButton'

const navItems = [
  { label: 'Categorías', to: '/catalogo' },
  { label: 'Blog y videos', to: '/blog' },
  { label: 'Reseñas', to: '/resenas' },
]

export function PublicLayout() {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<BusinessConfig | null>(null)

  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getConfiguracionNegocio()
        setConfig(data)
      } catch {
        setConfig(null)
      }
    }

    loadConfig()
  }, [])

  const nombreNegocio = config?.nombreNegocio || 'HUIPIL NICA'

  return (
    <div className="min-h-screen bg-[#F3F1ED] text-[#1F2933]">
      {/* HEADER */}
      <header
        className={`left-0 right-0 top-0 z-50 px-4 pt-4 ${
          isHome ? 'absolute' : 'sticky bg-[#F3F1ED]/95 pb-4 backdrop-blur'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-[#102635] px-5 py-3 shadow-lg">
          <Link to="/" className="flex items-center gap-3">
            {config?.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={nombreNegocio}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-[#102635]">
                LOGO
              </div>
            )}

            <p className="text-lg font-bold tracking-wide text-white">
              {nombreNegocio.toUpperCase()}
            </p>
          </Link>

          {/* MENÚ PC */}
<div className="hidden items-center gap-6 md:flex">
  <nav className="flex items-center gap-6">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `text-sm font-medium transition ${
            isActive
              ? 'text-white'
              : 'text-[#DCE3E8] hover:text-white'
          }`
        }
      >
        {item.label}
      </NavLink>
    ))}
  </nav>

  <Link
    to="/admin"
    className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-[#102635]"
  >
    Acceso dueño
  </Link>
</div>

          {/* BOTÓN MENÚ MÓVIL */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full p-2 text-white md:hidden"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <aside className="ml-auto h-full w-80 max-w-[85%] bg-[#F3F1ED] p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {config?.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt={nombreNegocio}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#102635] text-xs font-bold text-white">
                    LOGO
                  </div>
                )}

                <p className="text-lg font-bold text-[#102635]">
                  {nombreNegocio.toUpperCase()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-gray-300 p-2"
                aria-label="Cerrar menú"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 font-semibold text-[#102635] hover:bg-gray-200"
              >
                Inicio
              </NavLink>

              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 font-semibold text-[#102635] hover:bg-gray-200"
                >
                  {item.label}
                </NavLink>
              ))}

              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-2xl bg-[#102635] px-4 py-3 text-center font-bold text-white"
              >
                Acceso dueño
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* CONTENIDO */}
<main>
  <Outlet />
</main>

<FloatingWhatsAppButton config={config} />

{/* FOOTER */}
<footer className="mt-16 bg-[#102635] px-5 py-8 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-3">
              <a
                href={config?.facebookUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#102635] transition hover:scale-105"
              >
                <span className="text-sm font-bold">f</span>
              </a>

              <a
                href={config?.instagramUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#102635] transition hover:scale-105"
              >
                <span className="text-sm font-bold">◎</span>
              </a>

              <a
                href={config?.tiktokUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#102635] transition hover:scale-105"
              >
                <span className="text-xs font-bold">T</span>
              </a>
            </div>

            <div className="space-y-1 text-sm text-[#E7EDF2]">
              <p>{config?.telefono || 'Teléfono pendiente'}</p>
              <p>{config?.descripcionInicio || 'Catálogo artesanal'}</p>
            </div>
          </div>

          <div className="flex justify-center">
            {config?.logoUrl ? (
              <img
                src={config.logoUrl}
                alt={nombreNegocio}
                className="h-24 w-24 rounded-full border-4 border-[#9FB3C3] bg-white object-cover shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#9FB3C3] bg-white text-center text-xs font-semibold text-[#102635] shadow-md">
                LOGO
                <br />
                PENDIENTE
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-2 text-sm text-[#E7EDF2] md:items-end">
            <p>{config?.horario || 'Horario pendiente'}</p>
            <p>{config?.direccion || 'Ubicación pendiente'}</p>

            <Link to="/sobre-nosotros" className="hover:text-white">
              Sobre nosotros
            </Link>

            <Link to="/admin" className="text-xs text-[#C9D6DF] hover:text-white">
              Acceso dueño
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}