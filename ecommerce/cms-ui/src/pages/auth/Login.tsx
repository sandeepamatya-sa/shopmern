import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import http from '@/http'
import { setUser } from '@/store/user.slice'

export const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await http.post('/auth/login', values)
        if (res.data.user.role === 'Customer') {
          toast.error('Access denied. Customers cannot access the CMS.')
          return
        }
        dispatch(setUser({ token: res.data.token, user: res.data.user }))
        toast.success(`Welcome, ${res.data.user.name}!`)
        navigate('/dashboard')
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Login failed')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#1e293b' }}>
      <div className="card border-0 shadow-lg p-4" style={{ width: 400, borderRadius: 16 }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: 40 }}>🛒</div>
          <h4 className="fw-bold mt-2">ShopMERN CMS</h4>
          <p className="text-muted small">Admin & Staff Portal</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
              placeholder="admin@shopmern.com"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && <div className="invalid-feedback">{formik.errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && <div className="invalid-feedback">{formik.errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2" disabled={formik.isSubmitting}>
            {formik.isSubmitting
              ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
              : <><i className="fas fa-sign-in-alt me-2" />Sign In</>}
          </button>
        </form>
      </div>
    </div>
  )
}
