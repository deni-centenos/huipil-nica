import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Send, Star } from 'lucide-react'
import type { Review, ReviewFormInput } from '../../types'
import { createReview, getPublicReviews } from '../../services/reviewService'

const emptyForm: ReviewFormInput = {
  nombre: '',
  apellido: '',
  puntuacion: 5,
  descripcion: '',
}

export function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [form, setForm] = useState<ReviewFormInput>(emptyForm)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadReviews() {
      try {
        const data = await getPublicReviews()

        if (mounted) {
          setReviews(data)
        }
      } catch {
        if (mounted) {
          setError('No se pudieron cargar las reseñas.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadReviews()

    return () => {
      mounted = false
    }
  }, [])

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.currentTarget

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function validateForm(): string {
    if (form.nombre.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres.'
    }

    if (form.apellido.trim().length < 2) {
      return 'El apellido debe tener al menos 2 caracteres.'
    }

    if (form.puntuacion < 1 || form.puntuacion > 5) {
      return 'La puntuación debe estar entre 1 y 5 estrellas.'
    }

    if (form.descripcion.trim().length < 5) {
      return 'La descripción debe tener al menos 5 caracteres.'
    }

    return ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const validationMessage = validateForm()

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      setSaving(true)

      await createReview(form)

      setForm(emptyForm)
      setSuccess(
        'Gracias por enviar tu reseña. Será revisada antes de publicarse.',
      )
    } catch {
      setError('No se pudo enviar la reseña. Intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  function renderStars(value: number) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={
              star <= value
                ? 'fill-yellow-400 text-yellow-500'
                : 'text-gray-300'
            }
          />
        ))}
      </div>
    )
  }

  return (
    <section className="px-5 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.4em] text-[#102635]">
            Reseñas
          </p>

          <h1 className="text-4xl font-black text-[#102635] md:text-5xl">
            Opiniones de nuestros clientes
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Comparte tu experiencia con Huipil Nica. Las reseñas son revisadas
            antes de mostrarse públicamente.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-4xl bg-white p-6 shadow-md"
          >
            <h2 className="mb-5 text-2xl font-black text-[#102635]">
              Agregar reseña
            </h2>

            {error && (
              <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700">
                {success}
              </div>
            )}

            <div className="space-y-5">
              <label className="space-y-2">
                <span className="text-sm font-bold text-[#102635]">
                  Nombre
                </span>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
                  placeholder="Tu nombre"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-[#102635]">
                  Apellido
                </span>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
                  placeholder="Tu apellido"
                />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-bold text-[#102635]">
                  Puntuación
                </span>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          puntuacion: star,
                        }))
                      }
                      className="rounded-full p-1 transition hover:scale-110"
                      aria-label={`${star} estrellas`}
                    >
                      <Star
                        size={30}
                        className={
                          star <= form.puntuacion
                            ? 'fill-yellow-400 text-yellow-500'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-bold text-[#102635]">
                  Descripción
                </span>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-[#102635]"
                  placeholder="Cuéntanos tu experiencia"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#102635] px-6 py-3 font-bold text-white disabled:opacity-60"
            >
              <Send size={18} />
              {saving ? 'Enviando...' : 'Enviar reseña'}
            </button>
          </form>

          <div>
            <h2 className="mb-5 text-2xl font-black text-[#102635]">
              Reseñas publicadas
            </h2>

            {loading && (
              <div className="rounded-3xl bg-white p-8 text-center shadow">
                Cargando reseñas...
              </div>
            )}

            {!loading && reviews.length === 0 && (
              <div className="rounded-3xl bg-white p-8 text-center shadow">
                Todavía no hay reseñas publicadas.
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-4xl bg-white p-6 shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-[#102635]">
                        {review.nombre} {review.apellido}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          'es-NI',
                        )}
                      </p>
                    </div>

                    {renderStars(review.puntuacion)}
                  </div>

                  <p className="leading-7 text-gray-700">
                    “{review.descripcion}”
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}