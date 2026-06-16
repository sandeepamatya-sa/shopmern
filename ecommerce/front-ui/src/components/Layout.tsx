import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { logout } from '@/store/user.slice'
import { useState, useEffect, useRef } from 'react'
import http from '@/http'

export const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s: RootState) => s.user)
  const cartItems = useSelector((s: RootState) => s.cart.items)
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
  const [search, setSearch] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const catRef = useRef<HTMLLIElement>(null)
  const userRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    http.get('/mix/categories').then(r => setCategories(r.data.slice(0, 5))).catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setUserOpen(false)
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate('/products?search=' + encodeURIComponent(search.trim()))
      setSearch('')
    }
  }

  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0)

  return (
    <>
      <div className="bg-dark text-white py-1 px-3 d-flex justify-content-between" style={{ fontSize: 13 }}>
        <span><i className="fas fa-phone me-1" />+977-9800000000 &nbsp; <i className="fas fa-envelope me-1" />info@shopmern.com</span>
        <span>Free shipping on orders over Rs. 2000!</span>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/">🛒 ShopMERN</Link>
          <button className="navbar-toggler" type="button"
            onClick={() => { const el = document.getElementById('navMenu'); el?.classList.toggle('show') }}>
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <form className="d-flex mx-auto w-50" onSubmit={handleSearch}>
              <input className="form-control me-2" placeholder="Search products..."
                value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn btn-primary" type="submit"><i className="fas fa-search" /></button>
            </form>

            <ul className="navbar-nav ms-auto align-items-center gap-2">
              {/* Categories — max 5 */}
              <li className="nav-item dropdown" ref={catRef}>
                <a className="nav-link dropdown-toggle" href="#"
                  onClick={e => { e.preventDefault(); setCatOpen(o => !o) }}>
                  <i className="fas fa-th-large me-1" />Categories
                </a>
                <ul className={`dropdown-menu${catOpen ? ' show' : ''}`}>
                  {categories.length === 0
                    ? <li><span className="dropdown-item text-muted small">No categories yet</span></li>
                    : categories.map(c => (
                      <li key={c._id}>
                        <Link className="dropdown-item" to={'/category/' + c._id}
                          onClick={() => setCatOpen(false)}>
                          <i className="fas fa-chevron-right me-2 text-muted" style={{ fontSize: 10 }} />{c.name}
                        </Link>
                      </li>
                    ))}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item text-primary fw-semibold" to="/products" onClick={() => setCatOpen(false)}>
                      <i className="fas fa-border-all me-2" />All Products
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Cart */}
              <li className="nav-item">
                <Link className="nav-link position-relative" to="/cart">
                  <i className="fas fa-shopping-cart fa-lg" />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              </li>

              {/* User */}
              {user ? (
                <li className="nav-item dropdown" ref={userRef}>
                  <a className="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#"
                    onClick={e => { e.preventDefault(); setUserOpen(o => !o) }}>
                    <span className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: 30, height: 30, fontSize: 13 }}>
                      {user.name[0].toUpperCase()}
                    </span>
                    {user.name.split(' ')[0]}
                  </a>
                  <ul className={`dropdown-menu dropdown-menu-end${userOpen ? ' show' : ''}`} style={{ minWidth: 210 }}>
                    <li className="px-3 py-2 border-bottom">
                      <div className="fw-semibold">{user.name}</div>
                      <div className="text-muted small">{user.email}</div>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/profile/edit-name" onClick={() => setUserOpen(false)}>
                        <i className="fas fa-user-edit me-2 text-primary" />Change Name
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/profile/change-password" onClick={() => setUserOpen(false)}>
                        <i className="fas fa-lock me-2 text-warning" />Change Password
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2" to="/orders" onClick={() => setUserOpen(false)}>
                        <i className="fas fa-receipt me-2 text-info" />My Orders
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2" />Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/auth/login"><i className="fas fa-sign-in-alt me-1" />Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-primary btn-sm" to="/auth/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>

      <footer className="py-4 mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h5 className="text-white mb-3">🛒 ShopMERN</h5>
              <p style={{ fontSize: 14 }}>Your trusted online marketplace. Quality products, fast delivery, and great prices.</p>
            </div>
            <div className="col-md-2">
              <h6 className="text-white">Quick Links</h6>
              <ul className="list-unstyled" style={{ fontSize: 14 }}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/cart">Cart</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="text-white">Contact</h6>
              <p style={{ fontSize: 14 }}>Kathmandu, Nepal<br />+977-9800000000<br />info@shopmern.com</p>
            </div>
            <div className="col-md-3">
              <h6 className="text-white">Follow Us</h6>
              <div className="d-flex gap-3" style={{ fontSize: 20 }}>
                <a href="#" onClick={e => e.preventDefault()}><i className="fab fa-facebook" /></a>
                <a href="#" onClick={e => e.preventDefault()}><i className="fab fa-instagram" /></a>
                <a href="#" onClick={e => e.preventDefault()}><i className="fab fa-twitter" /></a>
              </div>
            </div>
          </div>
          <hr style={{ borderColor: '#333' }} />
          <p className="text-center mb-0" style={{ fontSize: 13 }}>© {new Date().getFullYear()} ShopMERN. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
