import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
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
        dispatch(setUser({ token: res.data.token, user: res.data.user }))
        toast.success(`Welcome back, ${res.data.user.name}!`)
        navigate(res.data.user.role !== 'Customer' ? '/' : '/')
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Login failed')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card border-0 shadow-sm p-4 mt-4">
          <div className="text-center mb-4">
            <h3 className="fw-bold">Welcome Back 👋</h3>
            <p className="text-muted">Sign in to your account</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                placeholder="you@example.com"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0 text-muted">
            Don't have an account? <Link to="/auth/register" className="text-primary fw-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
