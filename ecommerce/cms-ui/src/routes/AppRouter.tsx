import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components'
import { PrivateRoute } from './PrivateRoute'
import { Login } from '@/pages/auth/Login'
import { Dashboard } from '@/pages/dashboard/Dashboard'
import { Categories } from '@/pages/categories/Categories'
import { Brands } from '@/pages/brands/Brands'
import { Products, ProductForm } from '@/pages/products/Products'
import { Orders } from '@/pages/orders/Orders'
import { Customers } from '@/pages/customers/Customers'
import { Reviews } from '@/pages/reviews/Reviews'
import { Staffs } from '@/pages/staffs/Staffs'

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/auth/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/create" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
)
