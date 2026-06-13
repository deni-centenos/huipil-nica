import { useEffect, useState } from 'react'
import { CheckCircle, Clock, Star, XCircle } from 'lucide-react'
import type { Review, ReviewStatus } from '../../types'
import {
  getAdminReviews,
  updateReviewStatus,
} from '../../services/reviewService'

type ReviewFilter = ReviewStatus | 'TODAS'

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<ReviewFilter>('TODAS')

  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadReviews(showLoading = true) {
    try {
      if (showLoading) {
        setLoading(true)
      }

      const data = await getAdminReviews()
      setReviews(data)
    } catch {
      setError('No se pudieron cargar las reseñas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    async function loadInitialReviews() {
      try {
        const data = await getAdminReviews()

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

    void loadInitialReviews()

    return () => {
      mounted = false
    }
  }, [])

  async function changeStatus(id: number, estado: ReviewStatus) {
    setError('')
    setSuccess('')

    try {
      setSavingId(id)
      await updateReviewStatus(id, estado)
      setSuccess('Estado actualizado correctamente.')
      await loadReviews(false)
    } catch {
      setError('No se pudo actualizar la reseña.')
    } finally {
      setSavingId(null)
    }
  }

  function getStatusClass(status: ReviewStatus) {
    if (status === 'APROBADA') {
      return 'bg-green-100 text-green-700'
    }

    if (status === 'RECHAZADA') {
      return 'bg-red-100 text-red-700'
    }

    return 'bg-yellow-100 text-yellow-700'
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

  const filteredReviews =
    filter === 'TODAS'
      ? reviews
      : reviews.filter((review) => review.estado === filter)

  const totalPendientes = reviews.filter(
    (review) => review.estado === 'PENDIENTE',
  ).length

  const totalAprobadas = reviews.filter(
    (review) => review.estado === 'APROBADA',
  ).length

  const totalRechazadas = reviews.filter(
    (review) => review.estado === 'RECHAZADA',
  ).length

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#64748B]">
          Administración
        </p>

        <h1 className="text-3xl font-black text-[#102635]">Reseñas</h1>

        <p className="mt-2 text-gray-600">
          Revisa las opiniones enviadas por los clientes y decide cuáles se
          muestran públicamente.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-500">Total</p>
          <p className="mt-2 text-3xl font-black text-[#102635]">
            {reviews.length}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-500">Pendientes</p>
          <p className="mt-2 text-3xl font-black text-yellow-600">
            {totalPendientes}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-500">Aprobadas</p>
          <p className="mt-2 text-3xl font-black text-green-600">
            {totalAprobadas}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-500">Rechazadas</p>
          <p className="mt-2 text-3xl font-black text-red-600">
            {totalRechazadas}
          </p>
        </div>
      </div>

      <div className="rounded-4xl bg-white p-5 shadow-md">
        <div className="flex flex-wrap gap-3">
          {(['TODAS', 'PENDIENTE', 'APROBADA', 'RECHAZADA'] as ReviewFilter[]).map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  filter === item
                    ? 'bg-[#102635] text-white'
                    : 'bg-gray-100 text-[#102635] hover:bg-gray-200'
                }`}
              >
                {item === 'TODAS' ? 'Todas' : item}
              </button>
            ),
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-4xl bg-white p-6 shadow-md">
        {loading && <p>Cargando reseñas...</p>}

        {!loading && filteredReviews.length === 0 && (
          <p className="text-gray-500">No hay reseñas en este filtro.</p>
        )}

        <div className="grid gap-5">
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-3xl border border-gray-200 p-5"
            >
              <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        review.estado,
                      )}`}
                    >
                      {review.estado}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString('es-NI')}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-[#102635]">
                    {review.nombre} {review.apellido}
                  </h2>

                  <div className="mt-2">{renderStars(review.puntuacion)}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={
                      savingId === review.id || review.estado === 'APROBADA'
                    }
                    onClick={() => changeStatus(review.id, 'APROBADA')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <CheckCircle size={16} />
                    Aprobar
                  </button>

                  <button
                    type="button"
                    disabled={
                      savingId === review.id || review.estado === 'RECHAZADA'
                    }
                    onClick={() => changeStatus(review.id, 'RECHAZADA')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Rechazar
                  </button>

                  <button
                    type="button"
                    disabled={
                      savingId === review.id || review.estado === 'PENDIENTE'
                    }
                    onClick={() => changeStatus(review.id, 'PENDIENTE')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-4 py-2 text-sm font-bold text-[#102635] disabled:opacity-50"
                  >
                    <Clock size={16} />
                    Pendiente
                  </button>
                </div>
              </div>

              <p className="leading-7 text-gray-700">
                “{review.descripcion}”
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}