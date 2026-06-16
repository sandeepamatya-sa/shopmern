import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { logout } from '@/store/user.slice'

const navItems = [
  { to: '/dashboard', icon: 'fa-gauge', label: 'Dashboard' },
  { to: '/products', icon: 'fa-box', label: 'Products' },
  { to: '/categories', icon: 'fa-tags', label: 'Categories' },
  { to: '/brands', icon: 'fa-copyright', label: 'Brands' },
  { to: '/orders', icon: 'fa-receipt', label: 'Orders' },
  { to: '/customers', icon: 'fa-users', label: 'Customers' },
  { to: '/reviews', icon: 'fa-star', label: 'Reviews' },
  { to: '/staffs', icon: 'fa-user-tie', label: 'Staffs', adminOnly: true },
]

export const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s: RootState) => s.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth/login')
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">🛒 ShopMERN CMS</div>
        <nav className="flex-grow-1 py-2">
          {navItems
            .filter(n => !n.adminOnly || user?.role === 'Admin')
            .map(n => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <i className={`fas ${n.icon}`} />{n.label}
              </NavLink>
            ))}
        </nav>
        <div className="p-3 border-top border-secondary">
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 36, height: 36 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-white fw-semibold small">{user?.name}</div>
              <div className="text-secondary" style={{ fontSize: 11 }}>{user?.role}</div>
            </div>
          </div>
          <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-1" />Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main-content flex-grow-1">
        <div className="topbar">
          <h6 className="mb-0 fw-semibold text-muted">Admin Panel</h6>
          <span className="badge bg-primary">{user?.role}</span>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
