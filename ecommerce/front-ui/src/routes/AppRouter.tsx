import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { PrivateRoute } from './PrivateRoute'
import { Home } from '@/pages/front/Home'
import { Products } from '@/pages/front/Products'
import { ProductDetail } from '@/pages/front/ProductDetail'
import { Category } from '@/pages/front/Category'
import { Cart } from '@/pages/front/Cart'
import { PaymentSuccess, PaymentFailure } from '@/pages/front/Payment'
import { Login } from '@/pages/auth/Login'
import { Register } from '@/pages/auth/Register'
import { Profile, EditName, ChangePassword, OrderHistory } from '@/pages/profile'

// Simple 404 page
const NotFound = () => (
  <div className="text-center py-5">
    <div style={{ fontSize: 72 }}>🔍</div>
    <h2 className="fw-bold mt-3">Page Not Found</h2>
    <p className="text-muted">The page you're looking for doesn't exist or has been moved.</p>
    <a href="/" className="btn btn-primary">Go to Homepage</a>
  </div>
)

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="category/:id" element={<Category />} />
        <Route path="cart" element={<Cart />} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/failure" element={<PaymentFailure />} />
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />

        {/* Protected routes — redirect to /auth/login if not logged in */}
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit-name" element={<EditName />} />
          <Route path="profile/change-password" element={<ChangePassword />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
