import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Star,
  Tags,
  X,
} from 'lucide-react'
import { logoutAdmin } from '../../services/authService'

const adminMenu = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Productos', to: '/admin/productos', icon: Package },
  { label: 'Categorías', to: '/admin/categorias', icon: Tags },
  { label: 'Blog y videos', to: '/admin/blog', icon: FileText },
  { label: 'Reseñas', to: '/admin/resenas', icon: Star },
  { label: 'Configuración', to: '/admin/configuracion', icon: Settings },
]

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    await logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F3F1ED] text-[#102635]">
      {/* TOP BAR MÓVIL */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-[#102635] px-4 py-4 text-white shadow-md md:hidden">
        <div>
          <h1 className="text-lg font-bold">HUIPIL NICA</h1>
          <p className="text-xs text-[#DCE3E8]">Panel del dueño</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl bg-white/10 p-2"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* MENÚ DESKTOP */}
      <aside className="fixed left-0 top-0 hidden h-full w-72 bg-[#102635] p-5 text-white md:block">
        <AdminSidebarContent
          onNavigate={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* MENÚ MÓVIL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <aside className="h-full w-80 max-w-[85%] bg-[#102635] p-5 text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">HUIPIL NICA</h1>
                <p className="text-sm text-[#DCE3E8]">Panel del dueño</p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white/10 p-2"
                aria-label="Cerrar menú"
              >
                <X size={22} />
              </button>
            </div>

            <AdminSidebarContent
              onNavigate={() => setOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* CONTENIDO */}
      <main className="min-h-screen px-4 py-6 md:ml-72 md:px-8 md:py-8">
        <Outlet />
      </main>
    </div>
  )
}

type AdminSidebarContentProps = {
  onNavigate: () => void
  onLogout: () => void
}

function AdminSidebarContent({
  onNavigate,
  onLogout,
}: AdminSidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 hidden md:block">
        <h1 className="text-2xl font-bold">HUIPIL NICA</h1>
        <p className="text-sm text-[#DCE3E8]">Panel del dueño</p>
      </div>

      <nav className="space-y-2">
        {adminMenu.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
                  isActive
                    ? 'bg-white text-[#102635]'
                    : 'text-[#DCE3E8] hover:bg-[#163447] hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white hover:bg-white/20"
      >
        <LogOut size={20} />
        Cerrar sesión
      </button>
    </div>
  )
}