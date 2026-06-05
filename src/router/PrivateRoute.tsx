import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { isLoggedIn } from '../utils/auth'

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}
