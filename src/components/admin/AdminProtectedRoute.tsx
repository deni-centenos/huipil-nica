import { type ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../../services/authService'

type Props = {
  children: ReactNode
}

export function AdminProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const user = await getCurrentUser()

      setIsLoggedIn(Boolean(user))
      setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F1ED]">
        <p className="font-semibold text-[#102635]">Validando sesión...</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}