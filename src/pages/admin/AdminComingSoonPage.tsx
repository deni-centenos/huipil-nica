import { Link } from 'react-router-dom'

type Props = {
  title: string
  description: string
}

export function AdminComingSoonPage({ title, description }: Props) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#102635]">
          Módulo pendiente
        </p>

        <h1 className="mt-3 text-4xl font-bold text-[#102635]">{title}</h1>

        <p className="mt-4 max-w-3xl text-gray-600">{description}</p>

        <div className="mt-8 rounded-3xl bg-[#F3F1ED] p-6">
          <h2 className="text-xl font-bold text-[#102635]">
            Este módulo se puede agregar después
          </h2>

          <p className="mt-2 text-gray-600">
            Por ahora dejamos el diseño preparado para que el menú del panel
            esté completo. Más adelante se puede conectar a Supabase.
          </p>
        </div>

        <Link
          to="/admin"
          className="mt-8 inline-block rounded-2xl bg-[#102635] px-5 py-3 font-bold text-white transition hover:bg-[#163447]"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  )
}