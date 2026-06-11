import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../services/authService'

export function AdminLoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setErrorMessage('')

      await loginAdmin(email, password)

      navigate('/admin')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar sesión',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F3F1ED] px-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-[#102635]">Panel del dueño</h1>

        <p className="mt-2 text-gray-600">
          Acceso privado para administrar productos, precios e imágenes.
        </p>

        {errorMessage && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-semibold text-[#102635]">
              Correo
            </label>

            <input
              type="email"
              placeholder="admin@huipilnica.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-[#102635]">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="block w-full rounded-2xl bg-[#102635] px-5 py-3 text-center font-bold text-white transition hover:bg-[#163447] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Entrando...' : 'Entrar al panel'}
          </button>
        </form>
      </div>
    </section>
  )
}