import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '@/store'

export const PrivateRoute = () => {
  const { token } = useSelector((s: RootState) => s.user)
  return token ? <Outlet /> : <Navigate to="/auth/login" replace />
}
