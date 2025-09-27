
import { Navigate } from 'react-router-dom'

export function PrivateRoute({ children, role }){
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')
  const contractSigned = localStorage.getItem('contractSigned') === 'true'

  if(!token) return <Navigate to="/login" />
  if(role && userRole !== role) return <Navigate to="/login" />
  if(role === 'distributor' && !contractSigned) return <Navigate to="/invite" />

  return children
}
